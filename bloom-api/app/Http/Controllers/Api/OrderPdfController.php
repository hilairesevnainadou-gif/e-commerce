<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Setting;
use App\Support\PdfFonts;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class OrderPdfController extends Controller
{
    public function invoice(Order $order)
    {
        Carbon::setLocale('fr');
        $order->load('items');
        $settings = Setting::current();

        $pdf = Pdf::loadView('pdf.invoice', compact('order', 'settings'));
        PdfFonts::register($pdf->getDomPDF());

        return $pdf->stream("facture-{$order->reference}.pdf");
    }

    public function receipt(Order $order)
    {
        abort_unless($order->paid_at, 404, "Aucun reçu n'est disponible tant que la commande n'est pas payée.");

        Carbon::setLocale('fr');
        $order->load('items');
        $settings = Setting::current();

        $pdf = Pdf::loadView('pdf.receipt', compact('order', 'settings'));
        PdfFonts::register($pdf->getDomPDF());

        return $pdf->stream("recu-{$order->receipt_reference}.pdf");
    }
}
