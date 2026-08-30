<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function show()
    {
        $settings = Cache::remember('settings', 3600, fn () => Setting::current());

        return new SettingResource($settings);
    }
}
