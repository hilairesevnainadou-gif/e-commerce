<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 20));

        return OrderResource::collection($orders);
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load('items'));
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,completed,cancelled'],
        ]);

        if ($data['status'] !== 'pending' && $data['status'] !== 'cancelled' && ! $order->paid_at) {
            $data['paid_at'] = now();
        }

        if ($data['status'] === 'pending' || $data['status'] === 'cancelled') {
            $data['paid_at'] = null;
        }

        $order->update($data);

        return new OrderResource($order->load('items'));
    }
}
