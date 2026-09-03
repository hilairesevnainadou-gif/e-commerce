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
            'email' => 'admin@velocite.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        Setting::create([
            'site_name' => 'Maison Vélocité',
            'tagline' => 'Vélos, pièces et accessoires pour tous les terrains',
            'description' => 'Découvrez notre sélection de vélos de route, VTT, vélos électriques et vélos de ville, ainsi que toutes les pièces et accessoires pour les entretenir et les personnaliser. Livraison rapide et retours gratuits. Achetez maintenant !',
            'contact_email' => 'support@velocite.test',
            'contact_phone' => '+33 1 23 45 67 89',
            'contact_address' => '123 Avenue du Cyclisme, 75001 Paris',
            'whatsapp_number' => '+33612345678',
            'tax_rate' => 0.08,
            'free_shipping_threshold' => 50,
            'currency' => 'EUR',
            'announcement_text' => 'Livraison gratuite dès 50 € sur les vélos et pièces détachées',
        ]);

        // Neutral macro/mechanical detail shots (brake, tire tread, drivetrain, fork) used as
        // supplementary gallery photos for every bike. They're tightly cropped component shots,
        // not photos of a different whole bike, so they never contradict the hero photo's model
        // or colour — unlike lifestyle/whole-bike stock photos, which visibly clash.
        $bikeDetailPhotos = [
            'https://images.unsplash.com/photo-1684237070788-46598a69192c?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
            'https://images.unsplash.com/photo-1760486423116-5afdee549223?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
            'https://images.unsplash.com/photo-1716494974209-3a2d562b8258?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
            'https://images.unsplash.com/photo-1562486033-338dfb5dbfc2?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
        ];

        $categories = [
            'route' => Category::create([
                'name' => 'Vélos de route',
                'slug' => 'velos-de-route',
                'description' => 'Vélos de route et gravel pensés pour la vitesse et l\'endurance sur bitume comme sur chemin.',
            ]),
            'vtt' => Category::create([
                'name' => 'VTT',
                'slug' => 'vtt',
                'description' => 'Vélos tout-terrain robustes pour les sentiers, la montagne et l\'enduro.',
            ]),
            'electrique' => Category::create([
                'name' => 'Vélos électriques',
                'slug' => 'velos-electriques',
                'description' => 'Vélos à assistance électrique pour la ville et les longs trajets sans effort.',
            ]),
            'ville' => Category::create([
                'name' => 'Vélos de ville',
                'slug' => 'velos-de-ville',
                'description' => 'Vélos urbains confortables et équipés pour les trajets quotidiens.',
            ]),
            'cargo' => Category::create([
                'name' => 'Vélos cargo',
                'slug' => 'velos-cargo',
                'description' => 'Vélos cargo électriques pour transporter enfants, courses et marchandises au quotidien.',
            ]),
            'pieces' => Category::create([
                'name' => 'Pièces & Composants',
                'slug' => 'pieces-composants',
                'description' => 'Pièces détachées pour l\'entretien, la réparation et la personnalisation de votre vélo.',
            ]),
            'accessoires' => Category::create([
                'name' => 'Accessoires',
                'slug' => 'accessoires',
                'description' => 'Casques, antivols, éclairages et sacoches pour rouler en sécurité et confort.',
            ]),
        ];

        $products = [
            // --- Vélos de route ---
            [
                'category' => 'route',
                'name' => 'Aero Route Carbon',
                'price' => 2499,
                'image' => 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Volez sur le bitume : ce cadre carbone monocoque au profil aérodynamique et son groupe Shimano 105 12 vitesses transforment chaque coup de pédale en accélération franche. Roues carbone 40 mm pour fendre le vent, freins à disque hydrauliques pour un freinage puissant par tous les temps, et seulement 8,1 kg sur la balance : la sensation d'un vélo de course, prêt à rouler dès la sortie de la boîte.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Noir mat', 'Blanc'],
                'is_new' => true,
            ],
            [
                'category' => 'route',
                'name' => 'Endurance Sport 105',
                'price' => 1899,
                'image' => 'https://images.unsplash.com/photo-1601840713997-8e58ae8ceca3?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Le compagnon idéal des longues sorties du dimanche : géométrie endurance pour un dos préservé même après 100 km, cadre aluminium 6061 triple-butté allié à une fourche carbone qui absorbe les irrégularités de la route. Groupe Shimano 105 11 vitesses, fiable et précis, freins à disque mécaniques pour un freinage constant sous la pluie. Poids : 9,4 kg.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Bleu marine', 'Rouge'],
            ],
            [
                'category' => 'route',
                'name' => 'Gravel Explorer',
                'price' => 1699,
                'image' => 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Un seul vélo pour la route, les chemins et tout ce qui se trouve entre les deux. Cadre aluminium avec passage de pneu jusqu'à 45 mm pour avaler les sentiers en toute confiance, groupe Shimano GRX 11 vitesses pensé pour le tout-terrain, pneus mixtes 700x40c et freins à disque hydrauliques. Points de fixation porte-bagages inclus pour partir à l'aventure sur plusieurs jours. Poids : 10,2 kg.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Vert olive', 'Gris'],
                'is_new' => true,
            ],
            [
                'category' => 'route',
                'name' => 'Route Access Alu',
                'price' => 799,
                'image' => 'https://images.unsplash.com/photo-1484144709249-a643e3720d13?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "La porte d'entrée parfaite vers le cyclisme sur route, sans rien sacrifier au plaisir de rouler. Cadre aluminium 6061 réactif, fourche aluminium, groupe Shimano Claris 8 vitesses fiable et facile à entretenir, freins à patins à double pivot pour un freinage progressif. Tout ce qu'il faut pour attaquer ses premières sorties ou reprendre la compétition en club. Poids : 10,8 kg.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Gris anthracite', 'Rouge'],
            ],
            [
                'category' => 'route',
                'name' => 'Route Elite Carbon Di2',
                'price' => 4299,
                'image' => 'https://images.unsplash.com/photo-1605272652001-c1971601e75e?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "La performance sans compromis, pour les cyclistes qui refusent l'à-peu-près. Cadre carbone au profil aérodynamique poussé, transmission électronique Shimano Ultegra Di2 12 vitesses pour des changements de vitesse instantanés au bout du doigt, roues carbone 45 mm taillées pour la vitesse, freins à disque hydrauliques. À seulement 7,4 kg, chaque relance se fait sentir immédiatement. Le vélo des cyclosportives et des grandes ambitions.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Noir brillant'],
                'is_new' => true,
            ],

            // --- VTT ---
            [
                'category' => 'vtt',
                'name' => 'Trail Master 29',
                'price' => 1299,
                'image' => 'https://images.unsplash.com/photo-1768161680532-32d02decbcb4?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Partez à la découverte des sentiers sans hésitation : ce semi-rigide taillé pour la polyvalence encaisse racines et cailloux avec une suspension avant 120 mm bien calibrée. Grandes roues 29 pouces pour rouler droit sur les terrains techniques, groupe Shimano Deore 12 vitesses fiable en toute condition, freins à disque hydrauliques puissants. Poids : 13,8 kg.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Noir', 'Orange'],
            ],
            [
                'category' => 'vtt',
                'name' => 'Enduro Pro Suspension',
                'price' => 2199,
                'image' => 'https://images.unsplash.com/photo-1610926358710-5859736d0ae6?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Pour ceux qui cherchent la sensation forte en descente. Tout-suspendu avec 150 mm de débattement avant/arrière pour absorber les pires réceptions, roues 27,5 pouces maniables dans les virages serrés, groupe SRAM GX Eagle 12 vitesses et freins à disque 4 pistons pour freiner fort et tard. Poids : 14,9 kg.",
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Rouge', 'Gris mat'],
                'compare_at_price' => 2499,
            ],
            [
                'category' => 'vtt',
                'name' => 'Trail Starter 27.5',
                'price' => 549,
                'image' => 'https://images.unsplash.com/photo-1575585269294-7d28dd912db8?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Le VTT parfait pour se lancer sur les sentiers sans se ruiner. Cadre aluminium robuste, suspension avant 100 mm pour amortir les irrégularités, groupe Shimano Tourney/Altus 21 vitesses pour grimper partout, freins à disque mécaniques fiables. L'aventure tout-terrain commence ici. Poids : 14,5 kg.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Rouge', 'Noir'],
            ],
            [
                'category' => 'vtt',
                'name' => 'Cross Country Race 29',
                'price' => 1799,
                'image' => 'https://images.unsplash.com/photo-1625057983766-71c6d131a01a?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Léger, nerveux, taillé pour la compétition cross-country. Cadre aluminium optimisé, suspension avant 100 mm à verrouillage pour ne perdre aucune énergie en danseuse, roues 29 pouces qui roulent vite sur tous les terrains, groupe Shimano SLX 12 vitesses et freins à disque hydrauliques. À 11,9 kg, chaque relance compte.",
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Noir', 'Vert kaki'],
                'is_new' => true,
            ],

            // --- Vélos électriques ---
            [
                'category' => 'electrique',
                'name' => 'Urban e-Cruiser 500W',
                'price' => 2399,
                'image' => 'https://plus.unsplash.com/premium_photo-1679528244908-8d2e6901d418?q=80&w=1080&auto=format&fit=crop',
                'description' => "La mobilité électrique qui se plie à votre quotidien. Cadre compact et pliable, moteur intégré 500 W qui gomme les côtes et les feux rouges, batterie 48V/14Ah amovible pour recharger où bon vous semble, jusqu'à 90 km d'autonomie. Écran LCD, freins à disque hydrauliques. Se glisse dans le coffre ou sous le bureau. Poids : 19 kg.",
                'sizes' => ['M', 'L'],
                'colors' => ['Noir', 'Bleu'],
                'is_new' => true,
            ],
            [
                'category' => 'electrique',
                'name' => 'City e-Comfort',
                'price' => 1999,
                'image' => 'https://images.unsplash.com/photo-1620802051782-725fa33db067?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Le confort avant tout, pour rouler sans effort tous les jours. Moteur pédalier central 250 W à l'assistance naturelle, batterie 36V/11Ah pour 70 km d'autonomie, cadre bas facile d'accès et porte-bagages intégré pour les courses. Le vélo électrique pensé pour simplifier chaque trajet du quotidien. Poids : 22,5 kg.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Blanc', 'Gris'],
            ],
            [
                'category' => 'electrique',
                'name' => 'e-City Essential 250W',
                'price' => 1299,
                'image' => 'https://images.unsplash.com/photo-1692668696940-c6d790824ef2?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Votre première expérience de la mobilité électrique, sans se ruiner. Moteur moyeu arrière 250 W discret et efficace, batterie 36V/10Ah intégrée au cadre pour 50 km d'autonomie, écran LED clair, freins à disque mécaniques. Le compagnon idéal pour redécouvrir la ville sans sueur ni essoufflement. Poids : 21 kg.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Vert menthe', 'Noir'],
            ],
            [
                'category' => 'electrique',
                'name' => 'e-Trekking Deluxe',
                'price' => 2699,
                'image' => 'https://plus.unsplash.com/premium_photo-1663036966684-7917bd4f596d?q=80&w=1080&auto=format&fit=crop',
                'description' => "Le compagnon des grandes distances, en ville comme sur les routes de campagne. Moteur central puissant et silencieux, batterie longue portée jusqu'à 100 km d'autonomie logée sur le porte-bagages, cadre trekking robuste avec garde-boue et éclairage intégrés. Écran multifonction, freins à disque hydrauliques. Le vélo électrique qui transforme chaque trajet en trajet plaisir, qu'il fasse 5 ou 50 km. Poids : 24 kg.",
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Noir', 'Gris anthracite'],
                'is_new' => true,
            ],
            [
                'category' => 'electrique',
                'name' => 'e-Fat Commuter Pro',
                'price' => 2199,
                'image' => 'https://images.unsplash.com/photo-1625304664697-30a254733647?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Roulez sur tous les terrains, par tous les temps, de jour comme de nuit. Pneus fat 4 pouces pour une accroche inégalée sur sable, neige et pavés, batterie intégrée dans le cadre pour un look épuré, éclairage puissant intégré pour une visibilité maximale en ville. Le vélo électrique premium pour les trajets urbains qui ne s'arrêtent jamais, même sous la pluie. Poids : 25 kg.",
                'sizes' => ['M', 'L'],
                'colors' => ['Noir mat'],
                'is_new' => true,
            ],
            [
                'category' => 'electrique',
                'name' => 'e-Enduro Power 750W',
                'price' => 3499,
                'image' => 'https://images.unsplash.com/photo-1613937104213-913b11eb76a4?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "L'assistance électrique rencontre la performance enduro. Moteur central 750 W (limité à 25 km/h en UE) pour grimper sans jamais poser pied à terre, batterie 630 Wh pour enchaîner les descentes toute la journée, débattement 160 mm avant/arrière, roues 29 pouces, freins à disque 4 pistons. Le VTT électrique qui repousse vos limites en montagne. Poids : 23 kg.",
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Noir mat'],
                'compare_at_price' => 3799,
                'is_new' => true,
            ],

            // --- Vélos de ville ---
            [
                'category' => 'ville',
                'name' => 'City Classic 7V',
                'price' => 649,
                'image' => 'https://images.unsplash.com/photo-1501236570302-906143a7c9f8?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Le vélo de ville par excellence : confort immédiat, équipement complet, zéro accessoire à ajouter. Cadre acier robuste, dérailleur 7 vitesses pour rouler partout en ville, garde-boue et porte-bagages inclus, selle confort et éclairage intégré. Enfourchez-le et roulez, tout est déjà pensé. Poids : 15,5 kg.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Noir', 'Crème'],
                'compare_at_price' => 749,
            ],
            [
                'category' => 'ville',
                'name' => 'City Fold Compact',
                'price' => 449,
                'image' => 'https://images.unsplash.com/photo-1586403232406-43107b51e673?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "La liberté de combiner vélo et transports en commun, sans contrainte. Cadre acier pliable en 15 secondes chrono, roues 20 pouces maniables, dérailleur 6 vitesses. Se range sous un bureau, dans un coffre ou une entrée d'appartement. Le compagnon idéal des trajets multimodaux. Poids : 12,5 kg.",
                'sizes' => ['Taille unique'],
                'colors' => ['Gris', 'Vert olive'],
            ],

            // --- Vélos cargo ---
            [
                'category' => 'cargo',
                'name' => 'Cargo Family Longtail',
                'price' => 3299,
                'image' => 'https://images.unsplash.com/photo-1517132020230-beff8105d397?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Remplacez la seconde voiture par un vélo qui transporte toute la famille. Plateforme arrière extensible avec repose-pieds pour installer jusqu'à 2 enfants en toute sécurité, moteur central 250 W et batterie 500 Wh pour rouler chargé sans effort, béquille double renforcée pour un stationnement stable. Charge utile de 180 kg : écoles, courses, sorties du week-end, tout devient plus simple. Poids : 28 kg.",
                'sizes' => ['Taille unique'],
                'colors' => ['Bleu turquoise', 'Noir'],
                'is_new' => true,
            ],
            [
                'category' => 'cargo',
                'name' => 'Cargo Front Biporteur',
                'price' => 3799,
                'image' => 'https://images.unsplash.com/photo-1556538628-451736d0e2c3?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "La solution biporteur pour transporter enfants et courses en toute confiance, dès la sortie de la maison. Caisse avant en bois spacieuse et sécurisée, faible centre de gravité pour une stabilité rassurante même chargé, moteur central 250 W, batterie 500 Wh, freins à disque hydrauliques pour freiner en toute sécurité. Charge utile de 100 kg dans la caisse. Poids : 32 kg.",
                'sizes' => ['Taille unique'],
                'colors' => ['Bois naturel'],
                'compare_at_price' => 4099,
                'is_new' => true,
            ],

            // --- Pièces & Composants ---
            [
                'category' => 'pieces',
                'name' => 'Transmission Chaîne & Cassette 11V',
                'price' => 89,
                'image' => 'https://images.unsplash.com/photo-1562486033-14af01d4add5?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Redonnez de la précision et du silence à votre transmission. Chaîne avec traitement anti-usure pour une durée de vie prolongée, cassette 11-32 dents compatible Shimano et SRAM pour grimper toutes les pentes. Un remplacement simple qui change tout au pédalage. Poids : 380 g.",
                'images' => [
                    'https://images.unsplash.com/photo-1421429167374-8fc8ab6d0f66?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                    'https://images.unsplash.com/photo-1625242825294-dcc908480fae?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Roues AeroDisc Wheelset 28"',
                'price' => 349,
                'image' => 'https://images.unsplash.com/photo-1715546138693-2fda4a7adc83?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Gagnez en rigidité et en légèreté d'un seul geste. Paire de roues carbone/aluminium pour freinage à disque, jantes 28 pouces aérodynamiques, moyeux à roulements scellés pour une fiabilité longue durée. Compatible 8 à 11 vitesses : la mise à niveau qui se ressent dès les premiers coups de pédale. Poids : 1 650 g la paire.",
                'images' => [
                    'https://images.unsplash.com/photo-1636581088972-03bd08108cb1?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                    'https://images.unsplash.com/photo-1572393665233-28ec66640077?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Pédales GripLock Clipless',
                'price' => 79,
                'image' => 'https://images.unsplash.com/photo-1570865122427-1ef77fba6fcb?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Transmettez chaque watt directement à la route. Pédales automatiques en aluminium usiné CNC, cales incluses, roulements scellés et réglage de tension ajustable pour un déclipsage adapté à votre niveau. Légères, précises, fiables sortie après sortie. Poids : 320 g la paire.",
                'images' => [
                    'https://images.unsplash.com/photo-1739945634786-cb33a6884c73?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Selle ComfortRide Gel',
                'price' => 45,
                'image' => 'https://images.unsplash.com/photo-1580224881685-6bb1d75f1046?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Dites adieu à l'inconfort sur les longues distances. Rembourrage en gel ergonomique qui épouse les points d'appui, base en nylon renforcé, rails en acier chromé pour une durabilité à toute épreuve. Le détail qui change complètement le plaisir de rouler. Poids : 320 g.",
                'colors' => ['Noir'],
                'images' => [
                    'https://images.unsplash.com/photo-1722109879134-edc2661250be?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                    'https://images.unsplash.com/photo-1682787330862-ac33bc6fd9b7?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Kit Freins à Disque PowerStop',
                'price' => 129,
                'image' => 'https://images.unsplash.com/photo-1618762098304-38e6b03db348?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Freinez fort, freinez net, par tous les temps. Kit complet hydraulique avant/arrière, disques flottants 160 mm pour une dissipation thermique optimale, plaquettes semi-métalliques longue durée. Câbles inclus pour une installation complète et sans surprise.",
                'images' => [
                    'https://images.unsplash.com/photo-1779043750168-ef291893cd9c?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                    'https://images.unsplash.com/photo-1617044538612-fb1251b79c7a?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Guidon Route Carbone',
                'price' => 89,
                'image' => 'https://images.unsplash.com/photo-1716058404899-526b60203d48?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Allégez votre vélo là où ça compte vraiment. Cintre en fibre de carbone, drop compact 125 mm pour une position aérodynamique accessible, diamètre de pince 31,8 mm. Absorbe les vibrations de la route pour des mains moins fatiguées en fin de sortie. Largeurs disponibles : 40, 42, 44 cm.",
            ],
            [
                'category' => 'pieces',
                'name' => 'Potence Ajustable Alu',
                'price' => 35,
                'image' => 'https://images.unsplash.com/photo-1624915435590-2c40fb92cba3?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Trouvez enfin votre position idéale. Potence en aluminium à angle réglable de -17° à +17°, longueurs disponibles de 70 à 120 mm, pince 31,8 mm compatible route, VTT et ville. Une pièce simple qui transforme le confort de conduite au quotidien.",
                'images' => [
                    'https://images.unsplash.com/photo-1719929830722-1d173b29b72e?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Tige de Selle Carbone',
                'price' => 65,
                'image' => 'https://images.unsplash.com/photo-1727281623987-83b75fa1f0a5?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Un gain de poids et de confort en une seule pièce. Tige de selle carbone, diamètre 27,2 mm, longueur 350 mm, offset 0 mm. Filtre les vibrations de la route pour préserver votre dos sur la durée. Poids : 195 g.",
                'images' => [
                    'https://images.unsplash.com/photo-1652541341472-26c6620901bf?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Jeu de Pneus Route 28mm',
                'price' => 55,
                'image' => 'https://images.unsplash.com/photo-1672845648217-6787a7fa415e?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Roulez plus vite, plus sûr, avec moins de crevaisons. Paire de pneus route tubeless-ready, section 28 mm pour un compromis parfait entre rendement et confort, carcasse 60 TPI, bande anti-crevaison intégrée. À monter sur toute jante route standard.",
                'images' => [
                    'https://images.unsplash.com/photo-1592222166121-93437e78d8d0?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Kit de Réparation Anti-Crevaison',
                'price' => 15,
                'image' => 'https://plus.unsplash.com/premium_photo-1676399365834-0cafd318c243?q=80&w=1080&auto=format&fit=crop',
                'description' => "Ne restez plus jamais bloqué en pleine sortie. Kit complet avec 2 chambres à air, 3 démonte-pneus et rustines avec colle. Se glisse dans n'importe quelle sacoche de selle : l'assurance tranquillité à emporter partout.",
            ],
            [
                'category' => 'pieces',
                'name' => 'Batterie Additionnelle Vélo Électrique',
                'price' => 449,
                'image' => 'https://images.unsplash.com/photo-1592318348310-f31b61a931c8?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Doublez votre autonomie, doublez vos possibilités. Batterie additionnelle 36V/14Ah pour prolonger significativement la portée de votre vélo électrique, compatible supports porte-bagages standards, charge complète en 4h. Idéale pour les longues sorties ou les trajets quotidiens sans recharge intermédiaire.",
                'is_new' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1669965691576-9e69564dd39c?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'pieces',
                'name' => 'Manivelles & Pédalier Route',
                'price' => 149,
                'image' => 'https://images.unsplash.com/photo-1785476390557-d44c47424f21?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Optimisez votre rendement à chaque coup de pédale. Pédalier route compact 2 plateaux (50-34 dents), axe carbone pour une rigidité maximale, compatible boîtiers de pédalier standards. Léger et précis pour ne perdre aucun watt en transmission.",
                'images' => [
                    'https://images.unsplash.com/photo-1716494974209-3a2d562b8258?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],

            // --- Accessoires ---
            [
                'category' => 'accessoires',
                'name' => 'Casque AeroShell MIPS',
                'price' => 99,
                'image' => 'https://images.unsplash.com/photo-1591511275477-88f079d88154?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Roulez protégé sans jamais sacrifier le confort. Coque in-mold et technologie MIPS anti-rotation pour une protection avancée en cas de choc, 18 aérations pour une tête au frais même en été, réglage occipital précis et sangles réfléchissantes pour être vu de loin.",
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Noir', 'Blanc', 'Rouge'],
                'is_new' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1601971360277-7b4c8aa60894?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                    'https://images.unsplash.com/photo-1611485100985-cb332cd79671?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                ],
            ],
            [
                'category' => 'accessoires',
                'name' => 'Antivol Câble SecureLock',
                'price' => 59,
                'image' => 'https://images.unsplash.com/photo-1664146158348-6a8c71ac62d1?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "La tranquillité d'esprit à chaque arrêt. Antivol câble enroulable avec gaine anti-coupure et serrure à combinaison 4 chiffres réinitialisable, longueur 1,8 m pour s'adapter à tous les points d'ancrage. Fixation support cadre incluse pour l'emporter partout sans y penser.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Éclairage DuoBeam LED Set',
                'price' => 39,
                'image' => 'https://images.unsplash.com/photo-1579118690145-7753994c2d56?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Voyez et soyez vu, même à la nuit tombée. Feu avant 400 lumens et feu arrière rechargeables par USB-C, 5 modes d'éclairage adaptés à chaque situation, autonomie jusqu'à 10 h. Fixation sans outil pour un montage en quelques secondes.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Sacoche TrailPannier XL',
                'price' => 69,
                'image' => 'https://images.unsplash.com/photo-1783085663252-f04814cf3c61?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Emportez tout ce dont vous avez besoin, sans jamais y penser sur la route. Sacoche porte-bagages 25 L en tissu déperlant, bandes réfléchissantes pour la sécurité, fixation rapide à crochets pour l'installer et la retirer en un geste. Courses, travail, week-end : elle suit partout.",
                'colors' => ['Noir', 'Kaki'],
            ],
            [
                'category' => 'accessoires',
                'name' => 'Garde-Boue Clip-On',
                'price' => 25,
                'image' => 'https://images.unsplash.com/photo-1516686491778-e8842063c23c?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Arrivez propre, même sous la pluie. Garde-boue avant et arrière à clipser sans outil, compatible roues 26 à 29 pouces. Une protection efficace contre les projections, installée en quelques minutes.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Porte-Bagages Arrière Alu',
                'price' => 39,
                'image' => 'https://images.unsplash.com/photo-1561732387-bfd185ba57d5?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Transformez votre vélo en véhicule du quotidien. Porte-bagages arrière en aluminium léger et résistant, charge maximale 25 kg, fixation sur œillets de cadre. Compatible sacoches standard pour transporter courses, sac de sport ou cartable.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Béquille Réglable',
                'price' => 15,
                'image' => 'https://images.unsplash.com/photo-1775312867385-e272717efbc6?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Stationnez votre vélo n'importe où, en toute stabilité. Béquille arrière en aluminium à longueur réglable, fixation sur haubans ou support central. Un petit accessoire qui simplifie chaque arrêt.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Compteur GPS TrackPro',
                'price' => 179,
                'image' => 'https://images.unsplash.com/photo-1592580230733-9d55b379f0c1?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Suivez chaque performance, découvrez chaque itinéraire. Compteur GPS avec navigation intégrée, suivi détaillé de vos performances, connectivité Bluetooth/ANT+ pour synchroniser capteurs de puissance et cardiofréquencemètre. Écran couleur lisible en plein soleil, autonomie 20h pour ne jamais tomber à court en pleine sortie.",
                'is_new' => true,
            ],
            [
                'category' => 'accessoires',
                'name' => 'Home Trainer Connecté SmartRide',
                'price' => 449,
                'image' => 'https://images.unsplash.com/photo-1601625193660-86f2807b024b?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Roulez à haute intensité, même quand il pleut dehors. Home trainer à résistance connecté, compatible Zwift et toutes les grandes applications d'entraînement virtuel, précision de puissance ±2% pour un entraînement fiable. Pliable pour se ranger facilement, simulation de pente jusqu'à 16% pour recréer les cols en plein salon.",
                'is_new' => true,
            ],
            [
                'category' => 'accessoires',
                'name' => 'Traceur GPS Antivol Connecté',
                'price' => 89,
                'image' => 'https://images.unsplash.com/photo-1743491856718-cb51601e86dc?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Gardez un œil sur votre vélo, où qu'il soit. Traceur GPS discret à fixer sous la selle ou dans le cadre, suivi en temps réel via application mobile, alerte de mouvement instantanée. Autonomie jusqu'à 15 jours, sans abonnement obligatoire : la sécurité sans contrainte.",
                'is_new' => true,
            ],
            [
                'category' => 'accessoires',
                'name' => 'Sacoche de Guidon Bikepacking',
                'price' => 79,
                'image' => 'https://images.unsplash.com/photo-1697475338985-3cac4ffbf7b6?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Partez à l'aventure, léger et organisé. Sacoche de guidon étanche 10L pour le bikepacking, fixation sans support ni perçage pour s'adapter à n'importe quel vélo, compartiment séparé pour vos objets de valeur. Bandes réfléchissantes pour rouler en sécurité même à l'approche du soir.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Support Téléphone Vélo Universel',
                'price' => 24,
                'image' => 'https://images.unsplash.com/photo-1761721576781-baaf47945242?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Naviguez et filmez sans jamais lâcher le guidon. Support avec rotation 360°, compatible smartphones 4,7 à 6,7 pouces, fixation antivibration pour un écran toujours lisible. Montage et démontage en une seule main, même en mouvement.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Porte-Vélo Attelage 2 Vélos',
                'price' => 199,
                'image' => 'https://images.unsplash.com/photo-1608663003827-55979ea3bbd6?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Emmenez vos vélos partout où la voiture peut aller. Porte-vélo sur attelage pour 2 vélos, plateau basculant pour un accès au coffre sans tout démonter, bras réglables pour s'adapter à chaque cadre. Verrouillage antivol inclus pour partir l'esprit tranquille. Charge maximale : 60 kg.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Siège Enfant Vélo',
                'price' => 89,
                'image' => 'https://plus.unsplash.com/premium_photo-1663100717096-4814f46305fc?q=80&w=1080&auto=format&fit=crop',
                'description' => "Partagez vos balades en toute sécurité, dès les premiers mois. Siège enfant arrière avec repose-pieds réglables et harnais 5 points pour un maintien optimal, fixation solide sur porte-bagages ou cadre. Homologué dès 9 mois, charge maximale 22 kg : les souvenirs à vélo commencent tôt.",
                'is_new' => true,
            ],
            [
                'category' => 'accessoires',
                'name' => 'Remorque Vélo Enfant',
                'price' => 249,
                'image' => 'https://images.unsplash.com/photo-1607623618478-384d71c091d0?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Emmenez toute la famille, quel que soit le temps. Remorque 2 places avec harnais de sécurité et bâche imperméable, roues suspendues pour un confort maximal même sur pavés. Attelage universel, charge maximale 45 kg, pliable pour un rangement facile.",
                'is_new' => true,
            ],
            [
                'category' => 'accessoires',
                'name' => 'Porte-Bidon Alu',
                'price' => 12,
                'image' => 'https://images.unsplash.com/photo-1769445910141-37cd5a72981a?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Ne manquez plus jamais d'hydratation en sortie. Porte-bidon en aluminium léger, compatible avec tous les bidons standards 750 ml, fixation simple 2 vis sur cadre. Un indispensable discret et increvable. Poids : 28 g.",
            ],
            [
                'category' => 'accessoires',
                'name' => 'Sonnette Vélo Classic',
                'price' => 9,
                'image' => 'https://images.unsplash.com/photo-1772631482002-9243a4882346?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0',
                'description' => "Signalez votre présence avec élégance. Sonnette mécanique au son clair et puissant, fixation universelle sans outil sur guidons de 22 à 24 mm. Le petit détail qui fait toute la différence en ville.",
            ],
        ];

        foreach ($products as $data) {
            $product = Product::create([
                'category_id' => $categories[$data['category']]->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'compare_at_price' => $data['compare_at_price'] ?? null,
                'sizes' => $data['sizes'] ?? null,
                'colors' => $data['colors'] ?? null,
                'stock' => $data['stock'] ?? rand(8, 40),
                'is_active' => true,
                'is_new' => $data['is_new'] ?? false,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url' => $data['image'],
                'position' => 0,
            ]);

            $isBike = in_array($data['category'], ['route', 'vtt', 'electrique', 'ville', 'cargo'], true);
            $candidateExtras = $isBike ? $bikeDetailPhotos : ($data['images'] ?? []);

            $extraImages = array_values(array_filter(
                $candidateExtras,
                fn ($url) => $url !== $data['image']
            ));

            foreach (array_slice($extraImages, 0, 3) as $index => $url) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $url,
                    'position' => $index + 1,
                ]);
            }
        }

        Banner::create([
            'title' => 'Équipez-vous pour chaque terrain',
            'subtitle' => 'Vélos de route, VTT, électriques et de ville — jusqu\'à 15% de réduction sur une sélection de modèles.',
            'image_url' => 'https://images.unsplash.com/photo-1660411235465-e43f9f6148ee?q=80&w=1600&auto=format&fit=crop',
            'link_url' => '/',
            'position' => 'home_hero',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Nouveautés',
            'subtitle' => 'De nouveaux vélos et pièces chaque semaine.',
            'image_url' => 'https://images.unsplash.com/photo-1620802090791-fd9420668913?q=80&w=800&auto=format&fit=crop',
            'link_url' => '/shop?new=1',
            'position' => 'home_secondary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Livraison gratuite',
            'subtitle' => 'Sur toutes les commandes de plus de 50 €.',
            'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
            'link_url' => '/',
            'position' => 'home_secondary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Banner::create([
            'title' => 'Nouveautés',
            'subtitle' => 'Découvrez les derniers vélos et pièces ajoutés à notre catalogue.',
            'image_url' => 'https://images.unsplash.com/photo-1527421214132-5f2469ca182d?q=80&w=1600&auto=format&fit=crop',
            'link_url' => null,
            'position' => 'shop_new',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        Banner::create([
            'title' => 'Promotions',
            'subtitle' => "Jusqu'à 15% de réduction sur une sélection de vélos et de pièces détachées.",
            'image_url' => 'https://images.unsplash.com/photo-1627044185459-09e6dbc39444?q=80&w=1600&auto=format&fit=crop',
            'link_url' => null,
            'position' => 'shop_sale',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $this->call(ReviewSeeder::class);
    }
}
