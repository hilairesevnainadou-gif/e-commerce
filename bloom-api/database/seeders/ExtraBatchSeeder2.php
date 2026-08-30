<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExtraBatchSeeder2 extends Seeder
{
    public function run(): void
    {
        $sneakers = Category::where('slug', 'sneakers')->firstOrFail();

        $product = Product::firstOrCreate(
            ['slug' => Str::slug('Nike Air Force 1 Wheat')],
            [
                'category_id' => $sneakers->id,
                'name' => 'Nike Air Force 1 Wheat',
                'description' => "L'Air Force 1 dans un coloris blé chaleureux, empiècements suédés et doublure matelassée. Un look automnal affirmé.",
                'price' => 149,
                'stock' => 30,
                'is_active' => true,
                'is_new' => true,
            ]
        );

        if ($product->images()->count() === 0) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
                'position' => 0,
            ]);
        }
    }
}
