<?php

namespace App\Support;

class MoneyFormatter
{
    private const SYMBOLS = [
        'EUR' => '€',
        'USD' => '$',
        'GBP' => '£',
    ];

    public static function format(float|string $amount, string $currency): string
    {
        $symbol = self::SYMBOLS[$currency] ?? $currency.' ';
        $formatted = number_format((float) $amount, 2, ',', ' ');

        return $symbol === $currency.' '
            ? $symbol.$formatted
            : $formatted.' '.$symbol;
    }
}
