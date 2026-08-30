<?php

namespace App\Support;

use Dompdf\Dompdf;

class PdfFonts
{
    /**
     * Register the Inter typeface (matching the storefront's brand font)
     * with dompdf so PDFs render with it instead of falling back to Helvetica.
     */
    public static function register(Dompdf $dompdf): void
    {
        $metrics = $dompdf->getFontMetrics();

        $weights = [
            'normal' => 'Inter-Regular.ttf',
            '500' => 'Inter-Medium.ttf',
            '600' => 'Inter-SemiBold.ttf',
            'bold' => 'Inter-Bold.ttf',
        ];

        foreach ($weights as $weight => $file) {
            $metrics->registerFont(
                ['family' => 'Inter', 'weight' => $weight, 'style' => 'normal'],
                storage_path("fonts/{$file}")
            );
        }
    }
}
