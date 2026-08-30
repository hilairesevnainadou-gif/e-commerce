<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'paid_at',
        'customer_name',
        'customer_email',
        'shipping_address',
        'country',
        'subtotal',
        'shipping',
        'tax',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Human-facing invoice reference, e.g. "BLOOM-000042".
     */
    public function getReferenceAttribute(): string
    {
        return 'BLOOM-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Receipt reference, only meaningful once the order is paid.
     */
    public function getReceiptReferenceAttribute(): string
    {
        return $this->reference.'-R';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
