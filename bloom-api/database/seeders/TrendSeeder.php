<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TrendSeeder extends Seeder
{
    public function run(): void
    {
        $sneakers = Category::where('slug', 'sneakers')->firstOrFail();
        $femme = Category::where('slug', 'vetements-femme')->firstOrFail();
        $homme = Category::where('slug', 'vetements-homme')->firstOrFail();
        $accessoires = Category::where('slug', 'accessoires')->firstOrFail();
        $bijoux = Category::where('slug', 'bijoux')->firstOrFail();

        $products = [
            // Sneakers Homme - tendances 2026
            ['cat' => $sneakers, 'name' => 'Nike Air Max Plus', 'price' => 170, 'image' => '1562613521-6b5293e5b0ea', 'description' => "La sneaker incontournable de la saison, entre performance et lifestyle. Amorti Air visible et design audacieux.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Nike Air Max 95', 'price' => 190, 'image' => '1679581987371-1e537cbe7fbe', 'description' => "Le retro running toujours plébiscité, empiècements superposés et amorti Air visible au talon."],
            ['cat' => $sneakers, 'name' => 'Nike P-6000', 'price' => 125, 'image' => '1757513189385-580a91ac7fe4', 'description' => "Alternative running rétro à l'esthétique épurée, loin des collaborations limitées mais tout aussi recherchée."],
            ['cat' => $sneakers, 'name' => 'Nike Total 90 III', 'price' => 135, 'image' => '1611080028493-5af733f05dfc', 'description' => "Le retour des silhouettes football sur le terrain du lifestyle, coloris contrastés et lignes dynamiques."],
            ['cat' => $sneakers, 'name' => 'adidas Samba OG', 'price' => 115, 'image' => '1551795490-b919936ebfd9', 'description' => "Le best-seller historique adidas, ligne épurée et semelle gomme. Une valeur sûre en forte demande."],
            ['cat' => $sneakers, 'name' => 'adidas Gazelle', 'price' => 105, 'image' => '1700853012811-ce0a42d2b6d3', 'description' => "Silhouette fine en suède, coupe basse polyvalente qui s'accorde avec toutes les tenues.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'adidas Spezial', 'price' => 115, 'image' => '1534211269469-314ffbac5b34', 'description' => "Le classique revisité à l'esthétique vintage assumée, empiècements suède et finitions rétro."],
            ['cat' => $sneakers, 'name' => 'adidas Campus', 'price' => 105, 'image' => '1558191053-c03db2757e3d', 'description' => "Toujours plébiscitée pour son look rétro, un excellent rapport image-prix au quotidien."],
            ['cat' => $sneakers, 'name' => 'adidas BW Army', 'price' => 125, 'image' => '1579446565308-427218a2c60e', 'description' => "Ligne épurée qui s'accorde aussi bien avec un denim qu'un pantalon large."],
            ['cat' => $sneakers, 'name' => 'New Balance 204L', 'price' => 135, 'image' => '1747679181924-c606d83f866d', 'description' => "Silhouette fine en forte progression cette saison, mesh technique et confort au quotidien."],
            ['cat' => $sneakers, 'name' => 'New Balance 740', 'price' => 115, 'image' => '1738958668321-c4e2907195eb', 'description' => "L'un des modèles New Balance les plus portés du moment, amorti Fresh Foam moelleux."],
            ['cat' => $sneakers, 'name' => 'New Balance 574 Parkour', 'price' => 125, 'image' => '1747679181924-c606d83f866d', 'description' => "Esthétique sport urbain à l'identité forte, renforts visibles et construction robuste."],
            ['cat' => $sneakers, 'name' => 'ASICS Gel-1130', 'price' => 115, 'image' => '1572710029599-1e1ffe84493f', 'description' => "Cité parmi les modèles les plus populaires du moment, silhouette running affirmée."],
            ['cat' => $sneakers, 'name' => 'ASICS Gel Kayano 14', 'price' => 180, 'image' => '1572710029599-1e1ffe84493f', 'description' => "Tendance performance lifestyle en forte ascension, amorti GEL visible et look technique.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Puma Speedcat', 'price' => 105, 'image' => '1581923597046-427a5d83f932', 'description' => "Ligne basse et minimaliste inspirée de la course automobile, très portée cette saison."],
            ['cat' => $sneakers, 'name' => 'Puma Future Rider Afro Tech', 'price' => 115, 'image' => '1750270438660-f57de76532cc', 'description' => "Motifs à forte identité culturelle sur une base running confortable et colorée."],

            // Sneakers Femme - tendances 2026
            ['cat' => $sneakers, 'name' => 'adidas Samba Jane', 'price' => 115, 'image' => '1700853012811-ce0a42d2b6d3', 'description' => "À la tête de la tendance sneaker ballerine, version féminine et affinée de la Samba."],
            ['cat' => $sneakers, 'name' => 'adidas Superstar II W Rhinestone', 'price' => 130, 'image' => '1535944575480-975564904e3a', 'description' => "Réinterprétation scintillante d'un classique intemporel, détails premium et coquille iconique."],
            ['cat' => $sneakers, 'name' => 'Puma Speedcat Ballet', 'price' => 105, 'image' => '1602580997742-205c2221b67d', 'description' => "Silhouette ballerine tendance et légèreté assumée, pour un look sport-chic."],
            ['cat' => $sneakers, 'name' => 'Nike Air Rift', 'price' => 125, 'image' => '1580581321154-ceda6585698f', 'description' => "Design fendu iconique qui fait sensation sur les réseaux, une silhouette qui ne passe pas inaperçue."],
            ['cat' => $sneakers, 'name' => 'Nike WMNS Shox Z', 'price' => 170, 'image' => '1611080028493-5af733f05dfc', 'description' => "Look sportif contrasté et formes voyantes, la tendance chunky assumée jusqu'au bout.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'adidas Tokyo', 'price' => 105, 'image' => '1558191053-c03db2757e3d', 'description' => "Silhouette fine en croissance rapide, un profil bas facile à associer au quotidien."],

            // Vêtements
            ['cat' => $homme, 'name' => 'Sweat et hoodie matching set', 'price' => 70, 'image' => '1756865271059-af17c35f368d', 'description' => "Ensemble coordonné haut et bas, forte valeur perçue pour un look assorti sans effort."],
            ['cat' => $femme, 'name' => 'Pantalon cargo technique', 'price' => 85, 'image' => '1564099972442-1dc9b9d88386', 'description' => "Pantalon cargo à poches multiples, esprit techwear/gorpcore pour un usage utilitaire au quotidien.", 'is_new' => true],
            ['cat' => $femme, 'name' => 'Pantalon large fluide imprimé', 'price' => 95, 'image' => '1769063382633-ef27742cf2a1', 'description' => "Pantalon large taille haute en matière fluide, coupe ample tendance et imprimé graphique."],
            ['cat' => $homme, 'name' => 'Veste imperméable techwear', 'price' => 135, 'image' => '1782174358357-b7338e3f1437', 'description' => "Veste à capuche entièrement imperméable, croisement assumé entre mode urbaine et outdoor technique.", 'is_new' => true],
            ['cat' => $femme, 'name' => 'Legging jogging athleisure', 'price' => 53, 'image' => '1618355281720-4c59174ecb91', 'description' => "Legging technique taille haute, confortable et respirant pour le sport comme pour la ville."],

            // Accessoires & Bijoux
            ['cat' => $accessoires, 'name' => 'Casquette trucker néo', 'price' => 30, 'image' => '1588850561407-ed78c282e89b', 'description' => "Casquette trucker à la texture premium, dos filet respirant et fermeture ajustable."],
            ['cat' => $accessoires, 'name' => 'Ceinture tressée motif graphique', 'price' => 25, 'image' => '1643386156507-db1d17022bc2', 'description' => "Ceinture en tissu tressé à motifs, boucle métallique ornée d'une pierre turquoise."],
            ['cat' => $bijoux, 'name' => 'Bijou coquillage', 'price' => 20, 'image' => '1757743066485-e7acb3d7af7a', 'description' => "Petite pièce inspirée des coquillages naturels, l'accessoire tendance de l'été à petit prix."],
            ['cat' => $accessoires, 'name' => 'Sac inspiration nautique', 'price' => 65, 'image' => '1744117614329-baeef7168909', 'description' => "Sac cabas en paille tressée, complète parfaitement la tendance maritime de la saison.", 'is_new' => true],
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
