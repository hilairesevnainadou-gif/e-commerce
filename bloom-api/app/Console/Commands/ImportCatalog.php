<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportCatalog extends Command
{
    protected $signature = 'catalog:import
        {file : Chemin du fichier JSON du catalogue fournisseur}
        {--replace : Supprime le catalogue existant avant d\'importer}
        {--force : Ne demande pas confirmation avant la suppression (déploiement automatisé)}
        {--default-stock=0 : Stock appliqué aux produits dont le feed ne précise pas la quantité}
        {--dry-run : Analyse le fichier et affiche le plan sans rien écrire}';

    protected $description = "Importe un catalogue fournisseur au format JSON";

    /**
     * The whole import runs in one transaction: --replace wipes the catalogue
     * first, and a row that fails halfway through would otherwise leave the
     * shop empty.
     */
    public function handle(): int
    {
        $path = $this->argument('file');

        if (! is_file($path)) {
            $this->error("Fichier introuvable : {$path}");

            return self::FAILURE;
        }

        $rows = json_decode((string) file_get_contents($path), true);

        if (! is_array($rows) || json_last_error() !== JSON_ERROR_NONE) {
            $this->error('JSON invalide : '.json_last_error_msg());

            return self::FAILURE;
        }

        if (! array_is_list($rows)) {
            $this->error('Le fichier doit contenir un tableau de produits.');

            return self::FAILURE;
        }

        // Validate everything before touching the database, so a bad feed never
        // gets the chance to delete the existing catalogue.
        $errors = [];

        foreach ($rows as $i => $row) {
            $where = 'produit #'.($i + 1);

            if (! is_array($row)) {
                $errors[] = "{$where} : entrée invalide";

                continue;
            }

            foreach (['name', 'price', 'category'] as $field) {
                if (blank($row[$field] ?? null)) {
                    $errors[] = "{$where} : champ « {$field} » manquant";
                }
            }

            if (isset($row['price']) && ! is_numeric($row['price'])) {
                $errors[] = "{$where} : « price » n'est pas un nombre";
            }

            if (isset($row['compare_at_price']) && filled($row['compare_at_price']) && ! is_numeric($row['compare_at_price'])) {
                $errors[] = "{$where} : « compare_at_price » n'est pas un nombre";
            }
        }

        if ($errors !== []) {
            $this->error(count($errors).' erreur(s) dans le fichier, rien n\'a été importé :');
            foreach (array_slice($errors, 0, 25) as $error) {
                $this->line('  · '.$error);
            }

            return self::FAILURE;
        }

        $defaultStock = (int) $this->option('default-stock');
        $withoutStock = collect($rows)->filter(fn ($row) => ! isset($row['stock']))->count();
        $existingProducts = Product::count();
        $affectedReviews = Review::count();

        $this->info(count($rows).' produit(s) valides dans '.basename($path));

        if ($this->option('replace')) {
            $this->warn("--replace supprimera {$existingProducts} produit(s) existant(s).");
            $this->warn("Les {$affectedReviews} avis clients rattachés seront supprimés en cascade (irréversible).");
            $this->line("Les commandes passées ne sont pas affectées : chaque ligne conserve le nom et le prix du produit.");
        }

        if ($withoutStock > 0) {
            $this->warn("{$withoutStock} produit(s) sans stock dans le feed : stock fixé à {$defaultStock}."
                .($defaultStock === 0 ? ' À 0, ils seront refusés au paiement.' : ''));
        }

        if ($this->option('dry-run')) {
            $this->newLine();
            $this->info('--dry-run : aucune écriture effectuée.');
            $this->table(
                ['Catégorie', 'Produit', 'Prix', 'Stock', 'Images'],
                collect($rows)->take(15)->map(fn ($row) => [
                    $row['category'],
                    Str::limit($row['name'], 40),
                    $row['price'],
                    $row['stock'] ?? $defaultStock,
                    count($row['images'] ?? []),
                ])->all()
            );

            if (count($rows) > 15) {
                $this->line('  … et '.(count($rows) - 15).' autre(s).');
            }

            return self::SUCCESS;
        }

        if ($this->option('replace') && ! $this->option('force')
            && ! $this->confirm('Confirmer la suppression du catalogue actuel ?', false)) {
            $this->line('Import annulé.');

            return self::SUCCESS;
        }

        $imported = 0;
        $categoriesCreated = 0;

        DB::transaction(function () use ($rows, $defaultStock, &$imported, &$categoriesCreated) {
            if ($this->option('replace')) {
                // Cascades to product_images and reviews; order_items keep their
                // denormalised name and price and simply lose the foreign key.
                Product::query()->delete();
            }

            $categories = [];

            foreach ($rows as $row) {
                $slug = Str::slug($row['category']);

                if (! isset($categories[$slug])) {
                    $category = Category::firstOrCreate(
                        ['slug' => $slug],
                        ['name' => $row['category'], 'description' => $row['category_description'] ?? null]
                    );

                    if ($category->wasRecentlyCreated) {
                        $categoriesCreated++;
                    }

                    $categories[$slug] = $category;
                }

                $product = Product::create([
                    'category_id' => $categories[$slug]->id,
                    'name' => $row['name'],
                    'slug' => $this->uniqueSlug($row['name']),
                    'description' => $row['description'] ?? null,
                    'price' => $row['price'],
                    'compare_at_price' => filled($row['compare_at_price'] ?? null) ? $row['compare_at_price'] : null,
                    'sizes' => $row['sizes'] ?? null,
                    'colors' => $row['colors'] ?? null,
                    'stock' => $row['stock'] ?? $defaultStock,
                    'is_active' => $row['is_active'] ?? true,
                    'is_new' => $row['is_new'] ?? false,
                ]);

                foreach (array_values($row['images'] ?? []) as $position => $url) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'url' => $url,
                        'position' => $position,
                    ]);
                }

                $imported++;
            }
        });

        $this->newLine();
        $this->info("{$imported} produit(s) importé(s), {$categoriesCreated} catégorie(s) créée(s).");

        return self::SUCCESS;
    }

    /**
     * Slugs are unique in the products table, so a feed with two "Vélo de
     * ville" entries needs the second one suffixed rather than rejected.
     */
    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
