<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

class ReviewGenerator
{
    private const FIRST_NAMES = [
        'Emma', 'Chloé', 'Léa', 'Manon', 'Camille', 'Julie', 'Sarah', 'Marie', 'Laura', 'Clara',
        'Anna', 'Sofia', 'Giulia', 'Elena', 'Carmen', 'Ingrid', 'Freya', 'Nora', 'Isabel', 'Marta',
        'Alice', 'Charlotte', 'Olivia', 'Lucie', 'Inès', 'Léna', 'Louise', 'Zoé', 'Jade', 'Amélie',
        'Lucas', 'Louis', 'Hugo', 'Nathan', 'Thomas', 'Antoine', 'Maxime', 'Alexandre', 'Nicolas', 'Julien',
        'Mathieu', 'Pierre', 'Marco', 'Luca', 'Miguel', 'Hans', 'Lars', 'Erik', 'Daniel', 'David',
        'Diego', 'Paolo', 'Matteo', 'Gabriel', 'Adam', 'Noah', 'Ethan', 'Arthur', 'Jules', 'Théo',
    ];

    private const LAST_NAMES = [
        'Dubois', 'Martin', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre',
        'Michel', 'Garcia', 'Rossi', 'Ferrari', 'Bianchi', 'Romano', 'Müller', 'Schmidt', 'Fischer', 'Weber',
        'Fernández', 'López', 'Martínez', 'Santos', 'Silva', 'Costa', 'Andersen', 'Nielsen', 'Jensen',
        'Kowalski', 'Nowak', 'Novak', 'Van Dijk', 'De Vries', 'Janssen', 'Smith', 'Taylor', 'Walsh', 'Murphy',
    ];

    private const COUNTRIES = [
        'FR', 'FR', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'GB', 'IE', 'AT', 'CH', 'SE', 'NO', 'DK', 'PL',
    ];

    private const POSITIVE_COMMENTS = [
        "Très satisfait de mon achat, la qualité est vraiment au rendez-vous.",
        "Livraison rapide et produit parfaitement conforme à la description.",
        "Confortables dès le premier essai, je recommande vivement !",
        "Excellent rapport qualité-prix, je suis ravi.",
        "Le design est encore plus beau en vrai qu'en photo.",
        "Parfait pour un usage quotidien, très bon maintien.",
        "Deuxième paire que je commande chez BloomShop, toujours aussi bien.",
        "Service client réactif et produit de qualité, rien à redire.",
        "Taille bien, correspond parfaitement au guide des tailles.",
        "Matériaux de bonne qualité, finitions soignées.",
        "Je suis cliente fidèle et je ne suis jamais déçue.",
        "Un achat que je referais sans hésiter.",
        "Très bon confort, idéal pour marcher toute la journée.",
        "Le produit a dépassé mes attentes, merci !",
        "Emballage soigné et livraison dans les délais annoncés.",
        "Un classique indémodable, je les adore.",
        "Faciles à entretenir et très résistantes.",
        "Rapport qualité-prix imbattable pour ce niveau de finition.",
        "Coup de cœur immédiat, je recommande à 100%.",
        "Extrêmement satisfait, la cinquième étoile est méritée.",
    ];

    private const NEUTRAL_COMMENTS = [
        "Correct sans plus, la qualité pourrait être améliorée.",
        "Produit sympa mais la taille chausse un peu grand.",
        "Bon produit mais le délai de livraison a été un peu long.",
        "Satisfait dans l'ensemble, quelques petits défauts de finition.",
        "Convient bien mais le confort n'est pas exceptionnel.",
    ];

    private const NEGATIVE_COMMENTS = [
        "Déçu par la qualité, je m'attendais à mieux pour ce prix.",
        "La taille ne correspond pas du tout au guide des tailles.",
        "Produit arrivé avec un léger défaut, dommage.",
        "Confort moyen, je ne suis pas totalement convaincu.",
    ];

    /**
     * Add or remove reviews on the given product so its total review
     * count matches $targetCount exactly.
     */
    public static function syncCount(Product $product, int $targetCount): void
    {
        $current = $product->reviews()->count();

        if ($targetCount > $current) {
            $toCreate = $targetCount - $current;
            $rows = [];

            for ($i = 0; $i < $toCreate; $i++) {
                $rows[] = self::randomReviewRow($product->id);
            }

            foreach (array_chunk($rows, 50) as $chunk) {
                DB::table('reviews')->insert($chunk);
            }
        } elseif ($targetCount < $current) {
            $toDelete = $current - $targetCount;

            $ids = $product->reviews()
                ->orderBy('created_at')
                ->limit($toDelete)
                ->pluck('id');

            Review::whereIn('id', $ids)->delete();
        }
    }

    public static function randomReviewRow(int $productId): array
    {
        $rating = self::randomRating();
        $createdAt = now()->subDays(rand(1, 240))->subMinutes(rand(0, 1440));

        return [
            'product_id' => $productId,
            'author_name' => self::FIRST_NAMES[array_rand(self::FIRST_NAMES)].' '.self::LAST_NAMES[array_rand(self::LAST_NAMES)],
            'country' => self::COUNTRIES[array_rand(self::COUNTRIES)],
            'rating' => $rating,
            'comment' => self::commentForRating($rating),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    private static function randomRating(): int
    {
        $roll = rand(1, 100);

        return match (true) {
            $roll <= 45 => 5,
            $roll <= 75 => 4,
            $roll <= 90 => 3,
            $roll <= 97 => 2,
            default => 1,
        };
    }

    private static function commentForRating(int $rating): string
    {
        return match (true) {
            $rating >= 4 => self::POSITIVE_COMMENTS[array_rand(self::POSITIVE_COMMENTS)],
            $rating === 3 => self::NEUTRAL_COMMENTS[array_rand(self::NEUTRAL_COMMENTS)],
            default => self::NEGATIVE_COMMENTS[array_rand(self::NEGATIVE_COMMENTS)],
        };
    }
}
