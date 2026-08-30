<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExtraBatchSeeder3 extends Seeder
{
    public function run(): void
    {
        $homme = Category::where('slug', 'vetements-homme')->firstOrFail();

        $product = Product::firstOrCreate(
            ['slug' => Str::slug('Sweat à capuche blanc streetwear')],
            [
                'category_id' => $homme->id,
                'name' => 'Sweat à capuche blanc streetwear',
                'description' => "Sweat à capuche en coton molletonné blanc, coupe décontractée. Un essentiel streetwear à associer à toutes les tenues.",
                'price' => 55,
                'stock' => 30,
                'is_active' => true,
                'is_new' => false,
            ]
        );

        if ($product->images()->count() === 0) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://images.unsplash.com/photo-1550246140-29f40b909e5a?q=80&w=1000&auto=format&fit=crop',
                'position' => 0,
            ]);
        }
    }
}
