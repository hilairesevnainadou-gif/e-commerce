<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order)
    {
        Carbon::setLocale('fr');
        $this->order->loadMissing('items');
    }

    public function envelope(): Envelope
    {
        $settings = Setting::current();

        return new Envelope(
            subject: "Nouvelle commande {$this->order->reference} — {$settings->site_name}",
        );
    }

    public function content(): Content
    {
        $settings = Setting::current();

        return new Content(
            view: 'emails.new-order-alert',
            with: [
                'order' => $this->order,
                'settings' => $settings,
                'orderUrl' => rtrim(config('app.admin_url'), '/')."/orders/{$this->order->id}",
            ],
        );
    }
}
