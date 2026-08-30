<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ReviewGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->string('search').'%');
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->string('category'));
            });
        }

        $products = $query->orderByDesc('id')->paginate($request->integer('per_page', 20));

        return ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);

        $product = Product::create([
            'category_id' => $data['category_id'] ?? null,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'compare_at_price' => $data['compare_at_price'] ?? null,
            'stock' => $data['stock'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
            'is_new' => $data['is_new'] ?? false,
        ]);

        $this->syncImages($request, $product);

        if (array_key_exists('reviews_count', $data)) {
            ReviewGenerator::syncCount($product, (int) $data['reviews_count']);
        }

        return new ProductResource(
            $product->loadCount('reviews')->loadAvg('reviews', 'rating')->load(['category', 'images'])
        );
    }

    public function show(Product $product)
    {
        return new ProductResource(
            $product->loadCount('reviews')->loadAvg('reviews', 'rating')->load(['category', 'images'])
        );
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validateData($request, $product->id);

        $product->update([
            'category_id' => $data['category_id'] ?? $product->category_id,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? $product->slug,
            'description' => $data['description'] ?? $product->description,
            'price' => $data['price'],
            'compare_at_price' => $data['compare_at_price'] ?? null,
            'stock' => $data['stock'] ?? $product->stock,
            'is_active' => $data['is_active'] ?? $product->is_active,
            'is_new' => $data['is_new'] ?? $product->is_new,
        ]);

        $this->syncImages($request, $product);

        if (array_key_exists('reviews_count', $data)) {
            ReviewGenerator::syncCount($product, (int) $data['reviews_count']);
        }

        return new ProductResource(
            $product->loadCount('reviews')->loadAvg('reviews', 'rating')->load(['category', 'images'])
        );
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {
            $this->deleteStoredImage($image->url);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    public function destroyImage(Product $product, ProductImage $image)
    {
        abort_if($image->product_id !== $product->id, 404);

        $this->deleteStoredImage($image->url);
        $image->delete();

        $this->normalizePositions($product);

        return new ProductResource(
            $product->loadCount('reviews')->loadAvg('reviews', 'rating')->load(['category', 'images'])
        );
    }

    public function setMainImage(Product $product, ProductImage $image)
    {
        abort_if($image->product_id !== $product->id, 404);

        $others = $product->images()
            ->where('id', '!=', $image->id)
            ->orderBy('position')
            ->get();

        $image->update(['position' => 0]);

        foreach ($others as $index => $other) {
            $other->update(['position' => $index + 1]);
        }

        return new ProductResource(
            $product->loadCount('reviews')->loadAvg('reviews', 'rating')->load(['category', 'images'])
        );
    }

    private function normalizePositions(Product $product): void
    {
        $product->images()->orderBy('position')->get()->each(function ($image, $index) {
            if ($image->position !== $index) {
                $image->update(['position' => $index]);
            }
        });
    }

    private function validateData(Request $request, ?int $productId = null): array
    {
        return $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,'.$productId],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_new' => ['nullable', 'boolean'],
            'reviews_count' => ['nullable', 'integer', 'min:0', 'max:2000'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
        ]);
    }

    private function syncImages(Request $request, Product $product): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $position = $product->images()->max('position') + 1;

        foreach ($request->file('images') as $file) {
            $path = $file->store('products', 'public');

            ProductImage::create([
                'product_id' => $product->id,
                'url' => Storage::disk('public')->url($path),
                'position' => $position++,
            ]);
        }
    }

    private function deleteStoredImage(string $url): void
    {
        $path = str($url)->after('/storage/')->toString();

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
