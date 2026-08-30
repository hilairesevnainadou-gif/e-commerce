<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::query()->where('is_active', true)->orderBy('sort_order');

        if ($request->filled('position')) {
            $query->where('position', $request->string('position'));
        }

        return BannerResource::collection($query->get());
    }
}
