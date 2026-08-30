<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Support\Eurozone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'string', 'email', 'max:255'],
            'shipping_address' => ['required', 'string'],
            'country' => ['required', 'string', 'size:2'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $settings = Setting::current();

        $order = DB::transaction(function () use ($data, $settings, $request) {
            $subtotal = 0;
            $lineItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::where('is_active', true)->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(422, "Insufficient stock for {$product->name}.");
                }

                $lineTotal = $product->price * $item['quantity'];
                $subtotal += $lineTotal;

                $lineItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                ];
            }

            $baseShipping = $subtotal >= (float) $settings->free_shipping_threshold ? 0 : 9.99;
            $internationalFee = Eurozone::includes($data['country']) ? 0 : (float) $settings->international_shipping_fee;
            $shipping = $baseShipping + $internationalFee;
            $tax = round($subtotal * (float) $settings->tax_rate, 2);
            $total = $subtotal + $shipping + $tax;

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'status' => 'pending',
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'shipping_address' => $data['shipping_address'],
                'country' => strtoupper($data['country']),
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
            ]);

            foreach ($lineItems as $line) {
                $order->items()->create([
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'unit_price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                ]);

                $line['product']->decrement('stock', $line['quantity']);
            }

            return $order;
        });

        $order->load('items');

        try {
            Mail::to($order->customer_email)->send(new OrderConfirmation($order));
        } catch (\Throwable $e) {
            // Never let a mail failure break order creation.
            Log::error('Failed to send order confirmation email', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }

        return new OrderResource($order);
    }

    public function show(Request $request, Order $order)
    {
        if ($request->user()?->id !== $order->user_id && ! $request->user()?->isAdmin()) {
            abort(403);
        }

        return new OrderResource($order->load('items'));
    }
}
