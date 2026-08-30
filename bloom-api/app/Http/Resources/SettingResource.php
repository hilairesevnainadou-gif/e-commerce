<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'site_name' => $this->site_name,
            'logo_url' => $this->logo_url,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'contact_address' => $this->contact_address,
            'whatsapp_number' => $this->whatsapp_number,
            'social_facebook' => $this->social_facebook,
            'social_instagram' => $this->social_instagram,
            'social_twitter' => $this->social_twitter,
            'tax_rate' => (float) $this->tax_rate,
            'free_shipping_threshold' => (float) $this->free_shipping_threshold,
            'international_shipping_fee' => (float) $this->international_shipping_fee,
            'currency' => $this->currency,
            'sale_ends_at' => $this->sale_ends_at?->toIso8601String(),
            'announcement_text' => $this->announcement_text,
            'bank_account_holder' => $this->bank_account_holder,
            'bank_name' => $this->bank_name,
            'bank_iban' => $this->bank_iban,
            'bank_bic' => $this->bank_bic,
        ];
    }
}
