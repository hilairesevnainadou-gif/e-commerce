<?php

use App\Http\Controllers\Api\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderPdfController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/settings', [SettingController::class, 'show']);
Route::get('/banners', [BannerController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/orders', [OrderController::class, 'store']);

// Signed links (emailed to the customer / shown on the confirmation page).
// No login required: the signature itself authorizes the download.
Route::middleware('signed')->group(function () {
    Route::get('/orders/{order}/invoice', [OrderPdfController::class, 'invoice'])->name('orders.invoice');
    Route::get('/orders/{order}/receipt', [OrderPdfController::class, 'receipt'])->name('orders.receipt');
});

// Authenticated (customer or admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});

// Admin only
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index']);
    Route::get('notifications', [AdminNotificationController::class, 'index']);
    Route::get('notifications/unread-count', [AdminNotificationController::class, 'unreadCount']);
    Route::post('notifications/read-all', [AdminNotificationController::class, 'markAllRead']);
    Route::post('notifications/{notification}/read', [AdminNotificationController::class, 'markRead']);
    Route::apiResource('products', AdminProductController::class);
    Route::delete('products/{product}/images/{image}', [AdminProductController::class, 'destroyImage']);
    Route::patch('products/{product}/images/{image}/main', [AdminProductController::class, 'setMainImage']);
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('banners', AdminBannerController::class);
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{order}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{order}', [AdminOrderController::class, 'update']);
    Route::get('settings', [AdminSettingController::class, 'show']);
    Route::post('settings', [AdminSettingController::class, 'update']);
});
