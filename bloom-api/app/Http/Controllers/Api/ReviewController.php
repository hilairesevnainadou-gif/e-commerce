<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request, string $slug)
    {
        $product = Product::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $reviews = $product->reviews()->paginate($request->integer('per_page', 20));

        $distribution = $product->reviews()
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');

        return ReviewResource::collection($reviews)->additional([
            'distribution' => collect([5, 4, 3, 2, 1])->mapWithKeys(
                fn ($star) => [(string) $star => $distribution[$star] ?? 0]
            ),
        ]);
    }
}
