<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show()
    {
        return new SettingResource(Setting::current());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'social_facebook' => ['nullable', 'string', 'max:255'],
            'social_instagram' => ['nullable', 'string', 'max:255'],
            'social_twitter' => ['nullable', 'string', 'max:255'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:1'],
            'free_shipping_threshold' => ['required', 'numeric', 'min:0'],
            'international_shipping_fee' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'sale_ends_at' => ['nullable', 'date'],
            'announcement_text' => ['nullable', 'string', 'max:255'],
            'bank_account_holder' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_iban' => ['nullable', 'string', 'max:34'],
            'bank_bic' => ['nullable', 'string', 'max:11'],
            'notify_new_orders' => ['nullable', 'boolean'],
            'notification_email' => ['nullable', 'email', 'max:255'],
        ]);

        $data['notify_new_orders'] = $request->boolean('notify_new_orders');

        $settings = Setting::current();

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('branding', 'public');
            $data['logo_url'] = Storage::disk('public')->url($path);
        }

        unset($data['logo']);

        $settings->update($data);

        Cache::forget('settings');

        return new SettingResource($settings);
    }
}
