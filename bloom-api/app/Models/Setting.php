<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'logo_url',
        'tagline',
        'description',
        'contact_email',
        'contact_phone',
        'contact_address',
        'whatsapp_number',
        'social_facebook',
        'social_instagram',
        'social_twitter',
        'tax_rate',
        'free_shipping_threshold',
        'international_shipping_fee',
        'currency',
        'sale_ends_at',
        'announcement_text',
        'bank_account_holder',
        'bank_name',
        'bank_iban',
        'bank_bic',
    ];

    protected function casts(): array
    {
        return [
            'tax_rate' => 'decimal:4',
            'free_shipping_threshold' => 'decimal:2',
            'international_shipping_fee' => 'decimal:2',
            'sale_ends_at' => 'datetime',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1]);
    }
}
