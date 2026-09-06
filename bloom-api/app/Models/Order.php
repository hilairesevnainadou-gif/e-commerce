<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * Prefixes for the human-facing document references, following the French
     * accounting convention: FA for a facture, RE for its receipt.
     */
    public const INVOICE_PREFIX = 'FA';

    public const RECEIPT_PREFIX = 'RE';

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
     * Human-facing invoice reference, e.g. "FA-2026-000042".
     */
    public function getReferenceAttribute(): string
    {
        return $this->documentReference(self::INVOICE_PREFIX);
    }

    /**
     * Receipt reference, only meaningful once the order is paid, e.g.
     * "RE-2026-000042".
     */
    public function getReceiptReferenceAttribute(): string
    {
        return $this->documentReference(self::RECEIPT_PREFIX);
    }

    /**
     * Both documents carry the issue year and the same sequence, so a receipt
     * can be matched to its invoice at a glance. The year comes from the order
     * date rather than the payment date to keep that pairing intact.
     */
    private function documentReference(string $prefix): string
    {
        $year = ($this->created_at ?? now())->format('Y');

        return $prefix.'-'.$year.'-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
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
