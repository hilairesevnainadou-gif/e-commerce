<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExtendedCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'vetements-femme' => Category::firstOrCreate(
                ['slug' => 'vetements-femme'],
                [
                    'name' => 'Vêtements Femme',
                    'description' => 'Robes, jeans, vestes et pièces essentielles pour composer votre garde-robe.',
                    'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
                ]
            ),
            'vetements-homme' => Category::firstOrCreate(
                ['slug' => 'vetements-homme'],
                [
                    'name' => 'Vêtements Homme',
                    'description' => 'Chemises, jeans, vestes et basiques pour un vestiaire masculin intemporel.',
                    'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
                ]
            ),
            'accessoires' => Category::firstOrCreate(
                ['slug' => 'accessoires'],
                [
                    'name' => 'Accessoires',
                    'description' => 'Sacs, lunettes, montres et accessoires pour parfaire chaque tenue.',
                    'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
                ]
            ),
        ];

        $products = [
            // Vêtements Femme
            ['cat' => 'vetements-femme', 'name' => 'Robe longue rouge', 'price' => 89, 'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop', 'description' => "Robe longue fluide en satin rouge, coupe cintrée à la taille et jupe évasée. Parfaite pour les occasions spéciales.", 'is_new' => true],
            ['cat' => 'vetements-femme', 'name' => 'Robe en dentelle prune', 'price' => 95, 'compare_at_price' => 120, 'image' => 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop', 'description' => "Robe en dentelle crochet finement travaillée, découpes graphiques à la taille. Une pièce délicate au tombé impeccable."],
            ['cat' => 'vetements-femme', 'name' => 'Jean taille haute déstructuré', 'price' => 69, 'image' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop', 'description' => "Jean taille haute à l'esprit destroy, patchs brodés et coupe mom fit. Un basique customisé pour un look affirmé."],
            ['cat' => 'vetements-femme', 'name' => 'T-shirt noir imprimé', 'price' => 39, 'image' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop', 'description' => "T-shirt oversize en coton épais, sérigraphie graphique au dos. Coupe décontractée pour un style urbain.", 'is_new' => true],
            ['cat' => 'vetements-femme', 'name' => 'Veste en jean oversize', 'price' => 79, 'image' => 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1000&auto=format&fit=crop', 'description' => "Veste en jean coupe oversize, délavage vintage. Un intemporel à superposer en toute saison."],
            ['cat' => 'vetements-femme', 'name' => 'Veste bomber terracotta', 'price' => 99, 'compare_at_price' => 129, 'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop', 'description' => "Veste bomber légère en coloris terracotta, doublure douce et poches zippées. Parfaite pour les mi-saisons."],
            ['cat' => 'vetements-femme', 'name' => 'Ensemble chemise imprimée & pantalon', 'price' => 109, 'image' => 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?q=80&w=1000&auto=format&fit=crop', 'description' => "Chemise imprimée associée à un pantalon fluide taille haute. Un ensemble prêt-à-porter pour un look assuré.", 'is_new' => true],

            // Vêtements Homme
            ['cat' => 'vetements-homme', 'name' => 'Chemise casual bordeaux', 'price' => 59, 'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', 'description' => "Chemise en coton à la coupe droite, disponible en plusieurs coloris classiques. Idéale du bureau au week-end."],
            ['cat' => 'vetements-homme', 'name' => 'T-shirt col rond basique', 'price' => 29, 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', 'description' => "T-shirt essentiel en coton, coupe droite et col rond renforcé. Le basique qui ne se démode jamais."],
            ['cat' => 'vetements-homme', 'name' => 'Jean slim brut', 'price' => 75, 'compare_at_price' => 95, 'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop', 'description' => "Jean slim en denim brut, stretch pour plus de confort. Une coupe ajustée qui s'adapte à toutes les silhouettes."],
            ['cat' => 'vetements-homme', 'name' => 'Veste en cuir motard', 'price' => 149, 'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop', 'description' => "Veste motard en cuir vegan, zips apparents et col cranté. Un indispensable pour un style affirmé.", 'is_new' => true],
            ['cat' => 'vetements-homme', 'name' => 'Sweat à capuche gris', 'price' => 49, 'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop', 'description' => "Sweat à capuche en molleton chiné, poche kangourou et capuche doublée. Confortable pour toutes les saisons."],

            // Accessoires
            ['cat' => 'accessoires', 'name' => 'Sac à main en cuir', 'price' => 119, 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', 'description' => "Sac à main en cuir grainé, fermoir doré et bandoulière amovible. Un accessoire structuré pour toutes vos tenues.", 'is_new' => true],
            ['cat' => 'accessoires', 'name' => 'Casquette blanche', 'price' => 25, 'image' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop', 'description' => "Casquette trucker en coton, dos filet respirant et fermeture ajustable. Un basique pour toutes les saisons."],
            ['cat' => 'accessoires', 'name' => 'Lunettes de soleil rondes', 'price' => 45, 'compare_at_price' => 59, 'image' => 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1000&auto=format&fit=crop', 'description' => "Lunettes de soleil à monture ronde transparente, verres teintés avec protection UV400."],
            ['cat' => 'accessoires', 'name' => 'Montre classique cuir', 'price' => 129, 'image' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop', 'description' => "Montre à cadran classique et bracelet en cuir véritable. Un accessoire intemporel pour toutes les occasions."],
            ['cat' => 'accessoires', 'name' => 'Sac à dos urbain', 'price' => 69, 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop', 'description' => "Sac à dos urbain en toile résistante, compartiment matelassé pour ordinateur portable. Pensé pour le quotidien.", 'is_new' => true],
            ['cat' => 'accessoires', 'name' => 'Écharpe à carreaux', 'price' => 35, 'image' => 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop', 'description' => "Écharpe à carreaux en tissu doux et chaud, idéale pour twister toutes les tenues d'hiver."],
        ];

        foreach ($products as $data) {
            $product = Product::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $categories[$data['cat']]->id,
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
                    'url' => $data['image'],
                    'position' => 0,
                ]);
            }
        }

        // Add a couple of promotions among the existing sneakers too.
        Product::where('slug', 'airflex-runner')->update(['compare_at_price' => 109]);
        Product::where('slug', 'classic-court-90s')->update(['compare_at_price' => 99]);

        // Banner for the default "all products" shop view.
        \App\Models\Banner::firstOrCreate(
            ['position' => 'shop_all'],
            [
                'title' => 'Toute la collection',
                'subtitle' => 'Vêtements, sneakers et accessoires pour elle et pour lui.',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
                'link_url' => null,
                'is_active' => true,
                'sort_order' => 0,
            ]
        );
    }
}
