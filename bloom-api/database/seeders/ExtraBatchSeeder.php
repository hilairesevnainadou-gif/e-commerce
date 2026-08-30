<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExtraBatchSeeder extends Seeder
{
    public function run(): void
    {
        $accessoires = Category::where('slug', 'accessoires')->firstOrFail();
        $homme = Category::where('slug', 'vetements-homme')->firstOrFail();

        $products = [
            ['cat' => $accessoires, 'name' => 'Sac cabas en toile kraft', 'price' => 29, 'image' => '1608042314453-ae338d80c428', 'description' => "Sac cabas en toile robuste coloris kraft, anses renforcées. Pratique pour les courses ou en tote bag du quotidien."],
            ['cat' => $homme, 'name' => 'Bottines en cuir camel', 'price' => 139, 'image' => '1520639888713-7851133b1ed0', 'description' => "Bottines en cuir véritable coloris camel, lacets contrastés et semelle robuste. Un basique pour toutes les saisons.", 'is_new' => true],
        ];

        foreach ($products as $data) {
            $product = Product::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $data['cat']->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'compare_at_price' => $data['compare_at_price'] ?? null,
                    'stock' => 30,
                    'is_active' => true,
                    'is_new' => $data['is_new'] ?? false,
                ]
            );

            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => "https://images.unsplash.com/photo-{$data['image']}?q=80&w=1000&auto=format&fit=crop",
                    'position' => 0,
                ]);
            }
        }
    }
}
