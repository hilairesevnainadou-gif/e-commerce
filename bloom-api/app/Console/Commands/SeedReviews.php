<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\ReviewGenerator;
use Illuminate\Console\Command;

class SeedReviews extends Command
{
    protected $signature = 'catalog:reviews
        {--averages=4.5,3.5 : Moyennes à répartir sur le catalogue}
        {--min=6 : Nombre minimum d\'avis par produit}
        {--max=14 : Nombre maximum d\'avis par produit}
        {--only-empty : Ne traite que les produits sans avis}';

    protected $description = "Génère des avis clients pour atteindre des notes moyennes précises";

    public function handle(): int
    {
        $averages = collect(explode(',', (string) $this->option('averages')))
            ->map(fn ($a) => trim(str_replace(',', '.', $a)))
            ->filter(fn ($a) => is_numeric($a))
            ->map(fn ($a) => (float) $a)
            ->filter(fn ($a) => $a >= 1 && $a <= 5)
            ->values();

        if ($averages->isEmpty()) {
            $this->error('--averages attend des notes entre 1 et 5, par exemple 4.5,3.5');

            return self::FAILURE;
        }

        $min = max(2, (int) $this->option('min'));
        $max = max($min, (int) $this->option('max'));

        $query = Product::query();
        if ($this->option('only-empty')) {
            $query->doesntHave('reviews');
        }

        $products = $query->get();

        if ($products->isEmpty()) {
            $this->warn('Aucun produit à traiter.');

            return self::SUCCESS;
        }

        $this->info($products->count().' produit(s), moyennes réparties : '.$averages->implode(' / '));

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $written = 0;
        $tally = [];

        foreach ($products as $index => $product) {
            // Deal the averages round-robin so the split stays even whatever
            // the catalogue size, rather than drifting with random draws.
            $target = $averages[$index % $averages->count()];
            $written += ReviewGenerator::syncWithAverage($product, $target, rand($min, $max));
            $tally[(string) $target] = ($tally[(string) $target] ?? 0) + 1;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        foreach ($tally as $average => $count) {
            $this->line("  {$count} produit(s) à ".str_replace('.', ',', $average).'/5');
        }

        $this->info("{$written} avis générés.");

        return self::SUCCESS;
    }
}
