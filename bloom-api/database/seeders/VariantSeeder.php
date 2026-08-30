<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class VariantSeeder extends Seeder
{
    private const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    private const SHOE_SIZES = ['39', '40', '41', '42', '43', '44', '45', '46'];

    private const SHOE_KEYWORDS = ['bottines', 'derby', 'sandales', 'escarpins'];

    /** Mots de couleur déjà présents dans un nom : on ne propose pas d'autres coloris. */
    private const COLOR_WORDS = [
        'noir', 'blanc', 'rouge', 'bleu', 'vert', 'rose', 'beige', 'gris', 'grise', 'kaki',
        'camel', 'cognac', 'terracotta', 'bordeaux', 'prune', 'lilas', 'doré', 'dorée',
        'argenté', 'taupe', 'sarcelle', 'pastel', 'turbo green', 'bred', 'wheat',
    ];

    private const BASIC_PALETTES = [
        ['Noir', 'Blanc', 'Gris chiné'],
        ['Noir', 'Blanc', 'Marine'],
        ['Blanc', 'Noir', 'Kaki'],
    ];

    public function run(): void
    {
        Product::with('category')->get()->each(function (Product $product) {
            $categorySlug = $product->category?->slug;
            $nameLower = mb_strtolower($product->name);

            $isShoe = $categorySlug === 'sneakers' || $this->containsAny($nameLower, self::SHOE_KEYWORDS);
            $isClothing = in_array($categorySlug, ['vetements-femme', 'vetements-homme'], true) && ! $isShoe;

            $sizes = null;
            if ($isShoe) {
                $sizes = self::SHOE_SIZES;
            } elseif ($isClothing) {
                $sizes = self::CLOTHING_SIZES;
            }

            $colors = null;
            $hasColorInName = $this->containsAny($nameLower, self::COLOR_WORDS);
            if (! $hasColorInName && ($isClothing || $categorySlug === 'sneakers')) {
                $colors = self::BASIC_PALETTES[$product->id % count(self::BASIC_PALETTES)];
            }

            $product->update([
                'sizes' => $sizes,
                'colors' => $colors,
            ]);
        });
    }

    private function containsAny(string $haystack, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }
}
