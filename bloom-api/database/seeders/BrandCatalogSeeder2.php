<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandCatalogSeeder2 extends Seeder
{
    public function run(): void
    {
        $sneakers = Category::where('slug', 'sneakers')->firstOrFail();
        $femme = Category::where('slug', 'vetements-femme')->firstOrFail();
        $accessoires = Category::where('slug', 'accessoires')->firstOrFail();

        $products = [
            ['cat' => $accessoires, 'name' => 'Bagues dorées empilables', 'price' => 39, 'image' => '1611923134239-b9be5816e3b4', 'description' => "Lot de bagues fines dorées à empiler, ornées de pierres colorées. Un accessoire discret pour toutes les tenues."],
            ['cat' => $accessoires, 'name' => 'Montre chronographe acier', 'price' => 149, 'image' => '1509941943102-10c232535736', 'description' => "Montre chronographe au boîtier acier et bracelet cuir cognac, cadran lisible et robuste au quotidien.", 'is_new' => true],
            ['cat' => $femme, 'name' => 'Short en jean taille haute', 'price' => 45, 'image' => '1591195853828-11db59a44f6b', 'description' => "Short en denim taille haute à finitions délavées, coupe revers pour un look estival décontracté."],
            ['cat' => $sneakers, 'name' => 'Nike Kyrie Basketball', 'price' => 139, 'compare_at_price' => 159, 'image' => '1605348532760-6753d2c43329', 'description' => "Chaussure de basketball signature, maintien renforcé à la cheville et accroche optimale sur parquet."],
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
