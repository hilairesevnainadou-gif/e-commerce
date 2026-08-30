<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        return BannerResource::collection(
            Banner::query()->orderBy('position')->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);

        if ($request->hasFile('image')) {
            $data['image_url'] = $this->storeImage($request);
        } elseif (empty($data['image_url'])) {
            abort(422, 'An image is required.');
        }

        $banner = Banner::create($data);

        return new BannerResource($banner);
    }

    public function show(Banner $banner)
    {
        return new BannerResource($banner);
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $this->validateData($request);

        if ($request->hasFile('image')) {
            $data['image_url'] = $this->storeImage($request);
        } else {
            unset($data['image_url']);
        }

        $banner->update($data);

        return new BannerResource($banner);
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return response()->json(['message' => 'Banner deleted.']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'link_url' => ['nullable', 'string', 'max:255'],
            'position' => ['required', 'string', 'in:'.implode(',', Banner::POSITIONS)],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function storeImage(Request $request): string
    {
        $path = $request->file('image')->store('banners', 'public');

        return Storage::disk('public')->url($path);
    }
}
