<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $sneakers = Category::where('slug', 'sneakers')->firstOrFail();
        $femme = Category::where('slug', 'vetements-femme')->firstOrFail();
        $homme = Category::where('slug', 'vetements-homme')->firstOrFail();
        $accessoires = Category::where('slug', 'accessoires')->firstOrFail();

        $products = [
            // Sneakers - grandes marques
            ['cat' => $sneakers, 'name' => 'Air Jordan 1 Retro High Bred', 'price' => 189, 'image' => '1552346154-21d32810aba3', 'description' => "La silhouette culte qui a lancé la lignée Jordan. Cuir premium et coloris noir/rouge intemporel.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Converse Chuck Taylor All Star Rouge', 'price' => 65, 'image' => '1607522370275-f14206abe5d3', 'description' => "Le modèle montant en toile le plus copié au monde, dans son coloris rouge signature."],
            ['cat' => $sneakers, 'name' => 'New Balance 247 Kaki', 'price' => 99, 'image' => '1539185441755-769473a23570', 'description' => "Silhouette running réinterprétée en version lifestyle, empiècements daim et mesh coloris kaki."],
            ['cat' => $sneakers, 'name' => 'Nike Air Max 1', 'price' => 139, 'compare_at_price' => 169, 'image' => '1600185365926-3a2ce3cdb9eb', 'description' => "La première Air Max visible de l'histoire, toujours aussi recherchée pour son confort légendaire."],
            ['cat' => $sneakers, 'name' => 'Nike Air Force 1 Utility', 'price' => 129, 'image' => '1543508282-6319a3e2621f', 'description' => "L'icône basketball revisitée avec sangles utilitaires et empiècements renforcés."],
            ['cat' => $sneakers, 'name' => 'Common Projects Achilles Low', 'price' => 159, 'image' => '1587563871167-1ee9c731aefb', 'description' => "Le minimalisme scandinave à l'état pur : cuir pleine fleur et finitions haut de gamme."],
            ['cat' => $sneakers, 'name' => 'Air Jordan 1 High Turbo Green', 'price' => 199, 'image' => '1552066344-2464c1135c32', 'description' => "Édition colorée de la Jordan 1 High, suède premium et détails contrastés.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Nike Free Run', 'price' => 89, 'image' => '1460353581641-37baddab0fa2', 'description' => "Conçue pour une sensation de course pieds nus, flexibilité maximale et légèreté."],
            ['cat' => $sneakers, 'name' => 'Nike ZoomX Running', 'price' => 149, 'image' => '1491553895911-0055eca6402d', 'description' => "Amorti ZoomX nouvelle génération pour un retour d'énergie exceptionnel sur longue distance."],
            ['cat' => $sneakers, 'name' => 'Vans Old Skool Bordeaux', 'price' => 69, 'compare_at_price' => 79, 'image' => '1525966222134-fcfa99b8ae77', 'description' => "Le classique du skate à la bande latérale iconique, coloris bordeaux profond."],
            ['cat' => $sneakers, 'name' => 'K-Swiss Classic 88', 'price' => 79, 'image' => '1595341888016-a392ef81b7de', 'description' => "Silhouette héritage revisitée en tons bleu et orange, cuir texturé résistant."],
            ['cat' => $sneakers, 'name' => 'New Balance 574 Pastel', 'price' => 109, 'image' => '1465453869711-7e174808ace9', 'description' => "Le best-seller New Balance en coloris pastel, confort ENCAP au quotidien.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Nike Dunk High Pastel', 'price' => 149, 'image' => '1584735175315-9d5df23860e6', 'description' => "La Dunk High dans un dégradé pastel exclusif, cuir et daim assemblés à la main.", 'is_new' => true],
            ['cat' => $sneakers, 'name' => 'Derby en daim sarcelle', 'price' => 119, 'image' => '1560343090-f0409e92791a', 'description' => "Derby habillée en daim colorée, semelle en cuir cousue pour une allure chic et affirmée."],
            ['cat' => $sneakers, 'name' => 'Converse Chuck Taylor Beige', 'price' => 65, 'compare_at_price' => 79, 'image' => '1548883354-94bf5ba0e6e5', 'description' => "La Chuck Taylor montante dans un coloris beige sable polyvalent."],

            // Vêtements Femme - grandes marques
            ['cat' => $femme, 'name' => "Levi's Jean 721 Skinny", 'price' => 89, 'image' => '1475178626620-a4d074967452', 'description' => "Le jean skinny taille haute signé Levi's, coupe seconde peau et denim stretch confortable."],
            ['cat' => $femme, 'name' => 'Robe chemise en jean', 'price' => 75, 'image' => '1591369822096-ffd140ec948f', 'description' => "Robe chemise en denim léger, boutonnage complet et poches poitrine. Facile à vivre au quotidien."],
            ['cat' => $femme, 'name' => 'Sandales à talons daim', 'price' => 95, 'compare_at_price' => 120, 'image' => '1519415943484-9fa1873496d4', 'description' => "Sandales à talon en daim, brides fines et finitions soignées pour les soirées d'été."],
            ['cat' => $femme, 'name' => 'Jean skinny stretch', 'price' => 65, 'image' => '1543163521-1bf539c55dd2', 'description' => "Jean skinny en denim stretch confortable, disponible en plusieurs délavages."],
            ['cat' => $femme, 'name' => 'Veste en jean oversize grise', 'price' => 85, 'image' => '1517841905240-472988babdf9', 'description' => "Veste en jean coupe oversize à porter par-dessus un sweat à capuche. Un basique streetwear.", 'is_new' => true],
            ['cat' => $femme, 'name' => 'Escarpins imprimés fleuris', 'price' => 89, 'image' => '1600269452121-4f2416e1f224', 'description' => "Escarpins à bout pointu en imprimé floral, talon fin pour une silhouette élégante."],

            // Vêtements Homme - grandes marques
            ['cat' => $homme, 'name' => 'T-shirt graphique tête de mort', 'price' => 39, 'image' => '1503341504253-dff4815485f1', 'description' => "T-shirt oversize à imprimé graphique, coton épais et coupe streetwear décontractée."],
            ['cat' => $homme, 'name' => 'T-shirt noir logo brodé', 'price' => 29, 'image' => '1618354691373-d851c5c3a990', 'description' => "T-shirt basique en coton noir avec petit logo brodé sur la poitrine."],
            ['cat' => $homme, 'name' => 'Polo classique coton', 'price' => 55, 'image' => '1586363104862-3a5e2ab60d99', 'description' => "Polo en piqué de coton, coupe droite et col boutonné. Disponible en plusieurs coloris.", 'is_new' => true],
            ['cat' => $homme, 'name' => 'Veste en jean col sherpa', 'price' => 119, 'image' => '1544923246-77307dd654cb', 'description' => "Veste en jean doublée sherpa, chaude et robuste pour l'automne et l'hiver.", 'is_new' => true],
            ['cat' => $homme, 'name' => 'T-shirt lilas édition limitée', 'price' => 35, 'image' => '1622470953794-aa9c70b0fb9d', 'description' => "T-shirt en coton coloris lilas, sérigraphie discrète en édition limitée."],
            ['cat' => $homme, 'name' => 'Veste en cuir cognac', 'price' => 179, 'compare_at_price' => 219, 'image' => '1614252369475-531eba835eb1', 'description' => "Veste en cuir véritable coloris cognac, col officier et coupe cintrée. Une pièce forte pour toutes les saisons.", 'is_new' => true],
            ['cat' => $homme, 'name' => 'Veste en jean col velours', 'price' => 99, 'image' => '1611312449408-fcece27cdbb7', 'description' => "Veste en jean brut à col en velours côtelé contrastant, coupe trucker classique."],

            // Accessoires - grandes marques
            ['cat' => $accessoires, 'name' => 'Lunettes de soleil oversize', 'price' => 49, 'image' => '1556015048-4d3aa10df74c', 'description' => "Lunettes de soleil à large monture, verres dégradés pour un look affirmé."],
            ['cat' => $accessoires, 'name' => 'Lunettes de soleil rondes dorées', 'price' => 55, 'compare_at_price' => 70, 'image' => '1511499767150-a48a237f0083', 'description' => "Monture ronde métal doré et verres teintés, un classique intemporel."],
            ['cat' => $accessoires, 'name' => 'Montre minimaliste cuir taupe', 'price' => 99, 'image' => '1524592094714-0f0654e20314', 'description' => "Montre au cadran épuré et bracelet en cuir taupe, boîtier fin pour un port quotidien discret."],
            ['cat' => $accessoires, 'name' => 'Sac à main en cuir tressé', 'price' => 149, 'image' => '1590874103328-eac38a683ce7', 'description' => "Sac à main en cuir tressé façon panier, anse rigide et fermoir à clapet. Une pièce artisanale.", 'is_new' => true],
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
