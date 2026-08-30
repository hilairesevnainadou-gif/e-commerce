<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<style>
    @page { margin: 48px 48px 70px 48px; }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1a1a1a; font-size: 12px; }
    .header { width: 100%; overflow: hidden; margin-bottom: 28px; }
    .header h1 { float: left; font-size: 26px; margin: 0; font-weight: 700; }
    .brand { float: right; text-align: right; }
    .brand .name { font-size: 15px; font-weight: 700; }
    .meta { width: 100%; margin-bottom: 22px; }
    .meta td { padding: 1px 0; font-size: 12px; }
    .meta .label { font-weight: 700; width: 130px; }
    .parties { width: 100%; margin-bottom: 22px; }
    .parties td { vertical-align: top; width: 50%; font-size: 12px; line-height: 1.5; }
    .parties .title { font-weight: 700; margin-bottom: 4px; display: block; }
    .amount-line { font-size: 16px; font-weight: 700; margin: 22px 0 18px 0; }
    table.items { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    table.items thead td { font-size: 10px; text-transform: uppercase; letter-spacing: .03em; color: #6b6b6b; border-bottom: 1px solid #1a1a1a; padding: 0 0 6px 0; }
    table.items tbody td { padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-size: 12px; vertical-align: top; }
    .col-qty { text-align: center; width: 60px; }
    .col-price { text-align: right; width: 90px; }
    .col-amount { text-align: right; width: 90px; }
    table.totals { width: 260px; float: right; margin-top: 10px; border-collapse: collapse; }
    table.totals td { padding: 4px 0; font-size: 12px; }
    table.totals td:last-child { text-align: right; }
    table.totals tr.total td { border-top: 1px solid #1a1a1a; font-weight: 700; padding-top: 8px; }
    table.totals tr.paid td { font-weight: 700; }
    .history { clear: both; margin-top: 90px; }
    .history .title { font-weight: 700; margin-bottom: 8px; display: block; }
    table.hist { width: 100%; border-collapse: collapse; }
    table.hist thead td { font-size: 10px; text-transform: uppercase; letter-spacing: .03em; color: #6b6b6b; border-bottom: 1px solid #1a1a1a; padding: 0 0 6px 0; }
    table.hist tbody td { padding: 8px 0; font-size: 12px; }
    .footer { position: fixed; bottom: 24px; left: 48px; right: 48px; border-top: 1px solid #e5e5e5; padding-top: 8px; font-size: 10px; color: #6b6b6b; text-align: right; }
</style>
</head>
<body>
    <div class="header">
        <h1>Reçu</h1>
        <div class="brand">
            <div class="name">{{ $settings->site_name }}</div>
        </div>
    </div>

    <table class="meta">
        <tr><td class="label">N° de facture</td><td>{{ $order->reference }}</td></tr>
        <tr><td class="label">N° de reçu</td><td>{{ $order->receipt_reference }}</td></tr>
        <tr><td class="label">Date de paiement</td><td>{{ $order->paid_at->translatedFormat('d F Y') }}</td></tr>
    </table>

    <table class="parties">
        <tr>
            <td>
                <span class="title">{{ $settings->site_name }}</span>
                @if($settings->contact_address){{ $settings->contact_address }}<br>@endif
                @if($settings->contact_email){{ $settings->contact_email }}@endif
            </td>
            <td>
                <span class="title">Facturé à</span>
                {{ $order->customer_name }}<br>
                {{ $order->shipping_address }}<br>
                {{ $order->customer_email }}
            </td>
        </tr>
    </table>

    <div class="amount-line">
        {{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}
        payé le {{ $order->paid_at->translatedFormat('d F Y') }}
    </div>

    <table class="items">
        <thead>
            <tr>
                <td>Description</td>
                <td class="col-qty">Qté</td>
                <td class="col-price">Prix unitaire</td>
                <td class="col-amount">Montant</td>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td class="col-qty">{{ $item->quantity }}</td>
                <td class="col-price">{{ \App\Support\MoneyFormatter::format($item->unit_price, $settings->currency) }}</td>
                <td class="col-amount">{{ \App\Support\MoneyFormatter::format($item->unit_price * $item->quantity, $settings->currency) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Sous-total</td><td>{{ \App\Support\MoneyFormatter::format($order->subtotal, $settings->currency) }}</td></tr>
        <tr><td>Livraison</td><td>{{ $order->shipping > 0 ? \App\Support\MoneyFormatter::format($order->shipping, $settings->currency) : 'Gratuite' }}</td></tr>
        <tr><td>Taxe</td><td>{{ \App\Support\MoneyFormatter::format($order->tax, $settings->currency) }}</td></tr>
        <tr class="total"><td>Total</td><td>{{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}</td></tr>
        <tr class="paid"><td>Montant payé</td><td>{{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}</td></tr>
    </table>

    <div class="history">
        <span class="title">Historique de paiement</span>
        <table class="hist">
            <thead>
                <tr>
                    <td>Mode de paiement</td>
                    <td>Date</td>
                    <td>Montant payé</td>
                    <td>N° de reçu</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Virement bancaire</td>
                    <td>{{ $order->paid_at->translatedFormat('d F Y') }}</td>
                    <td>{{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}</td>
                    <td>{{ $order->receipt_reference }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="footer">{{ $settings->site_name }} — {{ $order->reference }}</div>
</body>
</html>
