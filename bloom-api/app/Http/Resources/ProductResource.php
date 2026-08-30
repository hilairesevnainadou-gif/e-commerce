<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'sizes' => $this->sizes,
            'colors' => $this->colors,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
            'is_new' => $this->is_new,
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'reviews_avg_rating' => $this->reviews_avg_rating !== null
                ? round((float) $this->reviews_avg_rating, 1)
                : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'position' => $image->position,
            ])->values()),
            'image' => $this->whenLoaded('images', fn () => $this->images->first()?->url),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
