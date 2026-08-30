<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@bloomshop.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        Setting::create([
            'site_name' => 'BloomShop',
            'tagline' => 'Vêtements, chaussures et accessoires tendance',
            'description' => 'Découvrez une large sélection de vêtements, chaussures et accessoires tendance sur Bloom E-Commerce. Livraison rapide et retours gratuits. Achetez maintenant !',
            'contact_email' => 'support@bloomshop.test',
            'contact_phone' => '+33 1 23 45 67 89',
            'contact_address' => '123 Rue Bloom, 75001 Paris',
            'whatsapp_number' => '+33612345678',
            'tax_rate' => 0.08,
            'free_shipping_threshold' => 50,
            'currency' => 'EUR',
            'announcement_text' => 'Votre boutique en ligne',
        ]);

        $sneakers = Category::create([
            'name' => 'Sneakers',
            'slug' => 'sneakers',
            'description' => 'Sneakers pour un usage quotidien et sportif.',
        ]);

        $products = [
            ['name' => 'AirFlex Runner', 'price' => 89, 'image' => 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers de running légères conçues pour la vitesse et le confort. Mesh respirant et semelle durable.'],
            ['name' => 'Urban Street Pro', 'price' => 99, 'image' => 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers minimalistes pour un usage quotidien. Cuir premium au look urbain moderne.'],
            ['name' => 'Classic Court 90s', 'price' => 79, 'image' => 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers d\'inspiration rétro avec une allure de terrain de tennis. Parfait équilibre entre confort et style.'],
            ['name' => 'Volt Edge', 'price' => 119, 'image' => 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers de performance aux finitions audacieuses. Amorti réactif pour une énergie toute la journée.', 'is_new' => true],
            ['name' => 'Zenith Flow', 'price' => 129, 'image' => 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers lifestyle premium alliant tricot haut de gamme et design futuriste.', 'is_new' => true],
            ['name' => 'Street Vibe Low', 'price' => 69, 'image' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers basses décontractées à la silhouette intemporelle. Conçues pour la polyvalence et le confort.'],
            ['name' => 'Nova Horizon', 'price' => 109, 'image' => 'https://images.unsplash.com/photo-1516767254874-281bffac9e9a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers montantes en daim et mesh. Parfait mélange de streetwear et de performance.', 'is_new' => true],
            ['name' => 'Pulse React', 'price' => 99, 'image' => 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers dynamiques à l\'amorti réactif. Conçues pour l\'entraînement et le confort au quotidien.'],
            ['name' => 'Core Street Retro', 'price' => 85, 'image' => 'https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers old-school inspirées du basketball des années 80. Construction durable, esprit vintage.'],
            ['name' => 'AeroFlex Lite', 'price' => 75, 'image' => 'https://images.unsplash.com/photo-1496202703211-aa28e9500c30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'description' => 'Sneakers ultra-légères conçues pour la mobilité au quotidien. Design respirant et flexible.'],
        ];

        foreach ($products as $data) {
            $product = Product::create([
                'category_id' => $sneakers->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'stock' => 25,
                'is_active' => true,
                'is_new' => $data['is_new'] ?? false,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url' => $data['image'],
                'position' => 0,
            ]);
        }

        Banner::create([
            'title' => 'Soldes d\'été sur les sneakers',
            'subtitle' => 'Jusqu\'à 30% de réduction sur une sélection de modèles — dans la limite des stocks disponibles.',
            'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop',
            'link_url' => '/',
            'position' => 'home_hero',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Nouveautés',
            'subtitle' => 'De nouveaux modèles chaque semaine.',
            'image_url' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
            'link_url' => '/shop?new=1',
            'position' => 'home_secondary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Livraison gratuite',
            'subtitle' => 'Sur toutes les commandes de plus de 50 $.',
            'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
            'link_url' => '/',
            'position' => 'home_secondary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Banner::create([
            'title' => 'Nouveautés',
            'subtitle' => 'Découvrez les derniers modèles ajoutés à notre collection.',
            'image_url' => 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1600&auto=format&fit=crop',
            'link_url' => null,
            'position' => 'shop_new',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Promotions',
            'subtitle' => "Jusqu'à 30% de réduction sur une sélection de sneakers.",
            'image_url' => 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1600&auto=format&fit=crop',
            'link_url' => null,
            'position' => 'shop_sale',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $this->call(ReviewSeeder::class);
    }
}
