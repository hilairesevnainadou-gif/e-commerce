<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\Setting;
use App\Support\PdfFonts;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class OrderConfirmation extends Mailable
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
            subject: "Facture {$this->order->reference} — {$settings->site_name}",
        );
    }

    public function content(): Content
    {
        $settings = Setting::current();

        return new Content(
            view: 'emails.order-confirmation',
            with: [
                'order' => $this->order,
                'settings' => $settings,
                'invoiceUrl' => URL::signedRoute('orders.invoice', ['order' => $this->order->id], now()->addYear()),
                'contactUrl' => rtrim(config('app.frontend_url'), '/').'/contact',
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $settings = Setting::current();

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $this->order,
            'settings' => $settings,
        ]);
        PdfFonts::register($pdf->getDomPDF());
        $output = $pdf->output();

        return [
            Attachment::fromData(fn () => $output, "facture-{$this->order->reference}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
