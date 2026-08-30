<?php

namespace App\Support;

class Eurozone
{
    /**
     * ISO 3166-1 alpha-2 codes of countries using the euro.
     */
    public const COUNTRY_CODES = [
        'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE',
        'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
    ];

    public static function includes(?string $countryCode): bool
    {
        return in_array(strtoupper((string) $countryCode), self::COUNTRY_CODES, true);
    }
}
