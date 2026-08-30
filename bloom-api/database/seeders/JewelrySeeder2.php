<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JewelrySeeder2 extends Seeder
{
    public function run(): void
    {
        $bijoux = Category::where('slug', 'bijoux')->firstOrFail();
        $accessoires = Category::where('slug', 'accessoires')->firstOrFail();

        $products = [
            ['cat' => $bijoux, 'name' => 'Bracelet chaîne maille cheval', 'price' => 59, 'image' => '1602173574767-37ac01994b2a', 'description' => "Bracelet chaîne à maillons épais façon maille cheval, plaqué or. Un bijou fort et intemporel."],
            ['cat' => $bijoux, 'name' => 'Collier pendentif corne dorée', 'price' => 45, 'image' => '1620656798579-1984d9e87df7', 'description' => "Collier avec pendentif corne stylisé en plaqué or, chaîne fine ajustable."],
            ['cat' => $bijoux, 'name' => 'Bracelet tennis serti', 'price' => 129, 'compare_at_price' => 159, 'image' => '1619119069152-a2b331eb392a', 'description' => "Bracelet tennis en argent serti de pierres blanches facettées, fermoir sécurisé à cliquet.", 'is_new' => true],
            ['cat' => $accessoires, 'name' => 'Tissot Montre chronographe classique', 'price' => 249, 'image' => '1522312346375-d1a52e2b99b3', 'description' => "Montre chronographe suisse au cadran blanc et bracelet cuir marron. Précision et élégance intemporelle.", 'is_new' => true],
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
