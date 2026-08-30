<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Services\ReviewGenerator;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        Product::all()->each(function (Product $product) {
            ReviewGenerator::syncCount($product, rand(15, 25));
        });
    }
}
