<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    public const POSITIONS = ['home_hero', 'home_secondary', 'shop_new', 'shop_sale', 'shop_all'];

    protected $fillable = [
        'title',
        'subtitle',
        'image_url',
        'link_url',
        'position',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
