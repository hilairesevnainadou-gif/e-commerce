<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $paidOrders = Order::whereNotNull('paid_at');

        $revenueTotal = (clone $paidOrders)->sum('total');
        $revenueThisMonth = (clone $paidOrders)->whereDate('paid_at', '>=', now()->startOfMonth())->sum('total');
        $paidOrdersCount = (clone $paidOrders)->count();
        $averageOrderValue = $paidOrdersCount > 0 ? $revenueTotal / $paidOrdersCount : 0;

        $revenueByDay = (clone $paidOrders)
            ->whereDate('paid_at', '>=', now()->subDays(13)->startOfDay())
            ->selectRaw('DATE(paid_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $revenueLast14Days = collect(range(13, 0))->map(function ($daysAgo) use ($revenueByDay) {
            $date = now()->subDays($daysAgo)->toDateString();

            return [
                'date' => $date,
                'total' => (float) ($revenueByDay[$date] ?? 0),
            ];
        })->values();

        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $lowStockProducts = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(5)
            ->get(['id', 'name', 'slug', 'stock']);

        $outOfStockCount = Product::where('stock', '<=', 0)->count();

        $topProducts = OrderItem::select('product_id', 'product_name', DB::raw('SUM(quantity) as units_sold'))
            ->whereHas('order', fn ($query) => $query->where('status', '!=', 'cancelled'))
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('units_sold')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'product_id' => $row->product_id,
                'product_name' => $row->product_name,
                'units_sold' => (int) $row->units_sold,
            ]);

        return response()->json([
            'revenue' => [
                'total' => (float) $revenueTotal,
                'this_month' => (float) $revenueThisMonth,
                'average_order_value' => round((float) $averageOrderValue, 2),
                'last_14_days' => $revenueLast14Days,
            ],
            'orders' => [
                'total' => Order::count(),
                'pending' => (int) ($ordersByStatus['pending'] ?? 0),
                'by_status' => $ordersByStatus,
            ],
            'products' => [
                'total' => Product::count(),
                'active' => Product::where('is_active', true)->count(),
                'out_of_stock' => $outOfStockCount,
                'low_stock' => $lowStockProducts,
            ],
            'customers' => [
                'total' => User::where('role', 'customer')->count(),
            ],
            'reviews' => [
                'total' => Review::count(),
                'average_rating' => round((float) Review::avg('rating'), 1),
            ],
            'top_products' => $topProducts,
        ]);
    }
}
