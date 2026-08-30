<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JewelrySeeder extends Seeder
{
    public function run(): void
    {
        $bijoux = Category::firstOrCreate(
            ['slug' => 'bijoux'],
            [
                'name' => 'Bijoux',
                'description' => 'Colliers, bagues, bracelets et boucles d\'oreilles pour sublimer chaque tenue.',
                'image' => 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop',
            ]
        );

        $products = [
            ['name' => 'Collier fin double rangs', 'price' => 45, 'image' => '1611652022419-a9419f74343d', 'description' => "Collier fin en plaqué or à double rang, à porter seul ou superposé. Fermoir mousqueton sécurisé."],
            ['name' => 'Bague sertie de pierres roses', 'price' => 39, 'image' => '1611955167811-4711904bb9f8', 'description' => "Bague statement en plaqué or ornée de pierres roses facettées. Une pièce qui attire le regard."],
            ['name' => 'Collier de perles de culture', 'price' => 89, 'image' => '1515562141207-7a88fb7ce338', 'description' => "Collier de perles de culture véritables, fermoir orné d'un motif floral. Un classique intemporel.", 'is_new' => true],
            ['name' => 'Bracelet orné de strass', 'price' => 55, 'image' => '1573408301185-9146fe634ad0', 'description' => "Bracelet rigide entièrement pavé de strass, fermoir à cliquet. Idéal pour les grandes occasions."],
            ['name' => 'Collier pendentif nacre', 'price' => 42, 'image' => '1611085583191-a3b181a88401', 'description' => "Collier fin en plaqué or avec pendentif en nacre, chaîne ajustable. Délicat et lumineux."],
            ['name' => "Boucles d'oreilles pierres colorées", 'price' => 35, 'compare_at_price' => 45, 'image' => '1535632787350-4e68ef0ac584', 'description' => "Boucles d'oreilles pendantes serties de pierres colorées facettées, monture argentée."],
            ['name' => 'Parure collier & boucles dorée', 'price' => 79, 'image' => '1601121141461-9d6647bca1ed', 'description' => "Parure complète collier et boucles d'oreilles au motif floral doré, ornée de pierres rouges.", 'is_new' => true],
            ['name' => 'Bracelet chaîne doré', 'price' => 39, 'image' => '1596944924616-7b38e7cfac36', 'description' => "Bracelet chaîne maille forçat en plaqué or, à porter seul ou associé à d'autres bijoux."],
            ['name' => 'Collier pendentif pierre bleue', 'price' => 49, 'image' => '1599643477877-530eb83abc8e', 'description' => "Collier avec pendentif facetté en pierre bleue profonde, chaîne fine en plaqué or."],
        ];

        foreach ($products as $data) {
            $product = Product::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $bijoux->id,
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
