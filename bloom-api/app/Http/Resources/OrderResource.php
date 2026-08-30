<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'status' => $this->status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'shipping_address' => $this->shipping_address,
            'country' => $this->country,
            'subtotal' => (float) $this->subtotal,
            'shipping' => (float) $this->shipping,
            'tax' => (float) $this->tax,
            'total' => (float) $this->total,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'unit_price' => (float) $item->unit_price,
                'quantity' => $item->quantity,
            ])),
            'invoice_url' => URL::signedRoute('orders.invoice', ['order' => $this->id], now()->addYear()),
            'receipt_url' => $this->paid_at
                ? URL::signedRoute('orders.receipt', ['order' => $this->id], now()->addYear())
                : null,
            'created_at' => $this->created_at,
        ];
    }
}
