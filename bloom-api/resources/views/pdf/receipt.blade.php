@php
    use App\Support\Countries;
    use App\Support\MoneyFormatter;

    $money = fn ($amount) => MoneyFormatter::format($amount, $settings->currency);

    // Monogram standing in for the logo: dompdf runs with remote images disabled,
    // so a fetched logo_url would silently render as a broken box.
    $initials = collect(preg_split('/\s+/', trim((string) $settings->site_name)))
        ->filter()
        ->take(2)
        ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
        ->implode('');

    // 0.0800 reads as "8", 0.0850 as "8,5" — never "8,00".
    $taxPercent = rtrim(rtrim(number_format((float) $settings->tax_rate * 100, 2, ',', ' '), '0'), ',');

    $country = Countries::name($order->country);
    $unitCount = $order->items->sum('quantity');
@endphp
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<style>
    /* Shares the invoice's design system; the accents turn green because a
       receipt only exists once the order is paid. */
    @page { margin: 0 0 76px 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', sans-serif; color: #262626; font-size: 11.5px; line-height: 1.45; }
    table { border-collapse: collapse; }
    .wrap { padding: 20px 46px 0 46px; }
    .spacer { width: 5%; padding: 0; }

    /* ---------------------------------------------------------------- masthead */
    .masthead { background: #14110d; color: #ffffff; padding: 26px 46px 22px 46px; }
    .masthead table { width: 100%; }
    .masthead td { vertical-align: top; }
    .monogram { width: 44px; height: 44px; background: #c19a5b; color: #14110d; border-radius: 11px;
                text-align: center; line-height: 44px; font-size: 17px; font-weight: bold; letter-spacing: .03em; }
    .brand-name { font-size: 16px; font-weight: bold; letter-spacing: -.005em; }
    .brand-tag { font-size: 10px; color: #a8a29e; margin-top: 2px; }
    .doc-cell { text-align: right; }
    .doc-kind { font-size: 25px; font-weight: bold; letter-spacing: .16em; text-transform: uppercase; }
    .doc-ref { font-size: 12px; color: #a8c4b3; font-weight: 600; letter-spacing: .04em; margin-top: 3px; }
    .pill { border-radius: 999px; padding: 5px 12px; font-size: 8.5px; font-weight: bold;
            text-transform: uppercase; letter-spacing: .1em; background: #7d9d8a; color: #12251a; }
    .accent-rule { height: 3px; background: #7d9d8a; font-size: 0; line-height: 0; }

    /* ------------------------------------------------------------- fact strip */
    .facts { width: 100%; margin-bottom: 12px; }
    .facts td { width: 30%; border: 1px solid #ebe7e1; border-radius: 8px; padding: 8px 12px; vertical-align: top; }
    /* Needs the .facts prefix: a bare .spacer loses to .facts td and every column
       ends up the same width. */
    .facts td.spacer { width: 5%; border: none; background: none; }
    .facts td.highlight { background: #f3f7f4; border-color: #cfdfd5; }
    .k { display: block; font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: .1em;
         color: #8a8377; margin-bottom: 3px; }
    .facts .v { font-size: 12.5px; font-weight: 600; color: #14110d; }
    .facts .highlight .v { color: #4a6b57; font-size: 14px; font-weight: bold; }

    /* ---------------------------------------------------------------- parties */
    .parties { width: 100%; margin-bottom: 14px; }
    .parties td.party { width: 47.5%; border: 1px solid #ebe7e1; border-radius: 8px; padding: 10px 14px; vertical-align: top; }
    .parties td.billed { background: #fafaf9; }
    .who { font-size: 12.5px; font-weight: 600; color: #14110d; margin-bottom: 2px; }
    .line { color: #57534e; font-size: 10.5px; }

    /* ------------------------------------------------------------------ items */
    .items { width: 100%; margin-bottom: 10px; }
    .items thead td { background: #14110d; color: #ffffff; font-size: 8px; font-weight: bold;
                      text-transform: uppercase; letter-spacing: .1em; padding: 8px 10px; }
    .items thead td.first { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
    .items thead td.last { border-top-right-radius: 6px; border-bottom-right-radius: 6px; }
    .items tbody td { padding: 7px 10px; border-bottom: 1px solid #f0ede8; vertical-align: top; font-size: 11.5px; }
    .items tbody tr.alt td { background: #fafaf9; }
    .items .idx { width: 26px; color: #a8a29e; font-size: 10px; }
    .items .name { font-weight: 500; color: #14110d; }
    .c-qty { width: 46px; text-align: center; }
    .c-unit { width: 96px; text-align: right; }
    .c-amount { width: 104px; text-align: right; font-weight: 600; color: #14110d; }

    /* --------------------------------------------------- history + totals row */
    .recap { font-size: 10.5px; color: #78716c; margin-bottom: 7px; }
    .summary { width: 100%; margin-top: 12px; page-break-inside: avoid; }
    .summary td { vertical-align: top; }
    .summary td.pay-cell { width: 57%; }
    .summary td.tot-cell { width: 39%; }
    .totals { width: 100%; }
    .totals td { padding: 5px 12px; font-size: 11.5px; }
    .totals td.amt { text-align: right; }
    .totals tr.sep td { border-bottom: 1px solid #ebe7e1; }
    /* One cell carries the dark background: two adjacent cells leave a hairline
       seam between their fills in dompdf. */
    .totals tr.grand td { background: #14110d; border-radius: 7px; padding: 9px 12px; }
    .grand-inner { width: 100%; }
    .grand-inner td { padding: 0; color: #ffffff; font-weight: bold; font-size: 13px; }
    .grand-inner td.amt { text-align: right; }

    /* ---------------------------------------------------------------- payment */
    .payment { border: 1px solid #ebe7e1; border-left: 3px solid #7d9d8a; border-radius: 8px; padding: 11px 14px; }
    .payment .bank { width: 100%; margin-top: 6px; }
    .payment .bank td { padding: 2px 0; font-size: 10.5px; vertical-align: top; }
    .payment .bank td.label { width: 130px; color: #8a8377; }
    .payment .bank td.value { font-weight: 500; color: #14110d; }
    .terms { margin-top: 9px; padding-top: 8px; border-top: 1px solid #f0ede8; font-size: 9.5px; color: #8a8377; }

    /* ----------------------------------------------------------------- footer */
    .footer { position: fixed; bottom: 26px; left: 46px; right: 46px; border-top: 1px solid #ebe7e1;
              padding-top: 7px; font-size: 8.5px; color: #a8a29e; }
    .footer table { width: 100%; }
    .footer .right { text-align: right; }
    /* dompdf resolves counter(pages) to 0, so only the current page is printed. */
    .page-num:before { content: "Page " counter(page); }
</style>
</head>
<body>

<div class="masthead">
    <table>
        <tr>
            <td>
                <table>
                    <tr>
                        <td class="monogram">{{ $initials !== '' ? $initials : 'F' }}</td>
                        <td style="padding-left: 12px; vertical-align: middle;">
                            <div class="brand-name">{{ $settings->site_name }}</div>
                            @if($settings->tagline)
                                <div class="brand-tag">{{ $settings->tagline }}</div>
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td class="doc-cell">
                <div class="doc-kind">Reçu</div>
                <div class="doc-ref">{{ $order->receipt_reference }}</div>
                <table align="right" style="margin-top: 9px;">
                    <tr>
                        <td class="pill">Payée</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div class="accent-rule"></div>

<div class="wrap">

    <table class="facts">
        <tr>
            <td>
                <span class="k">Date de paiement</span>
                <span class="v">{{ $order->paid_at->translatedFormat('d F Y') }}</span>
            </td>
            <td class="spacer"></td>
            <td>
                <span class="k">Facture liée</span>
                <span class="v">{{ $order->reference }}</span>
            </td>
            <td class="spacer"></td>
            <td class="highlight">
                <span class="k">Montant payé</span>
                <span class="v">{{ $money($order->total) }}</span>
            </td>
        </tr>
    </table>

    <table class="parties">
        <tr>
            <td class="party">
                <span class="k">Émetteur</span>
                <div class="who">{{ $settings->site_name }}</div>
                @if($settings->contact_address)
                    <div class="line">{!! nl2br(e($settings->contact_address)) !!}</div>
                @endif
                @if($settings->contact_email)
                    <div class="line">{{ $settings->contact_email }}</div>
                @endif
                @if($settings->contact_phone)
                    <div class="line">{{ $settings->contact_phone }}</div>
                @endif
            </td>
            <td class="spacer"></td>
            <td class="party billed">
                <span class="k">Reçu de</span>
                <div class="who">{{ $order->customer_name }}</div>
                <div class="line">{!! nl2br(e($order->shipping_address)) !!}</div>
                @if($country)
                    <div class="line">{{ $country }}</div>
                @endif
                <div class="line">{{ $order->customer_email }}</div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <td class="first">#</td>
                <td>Désignation</td>
                <td class="c-qty">Qté</td>
                <td class="c-unit">Prix unitaire</td>
                <td class="c-amount last">Montant</td>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr class="{{ $loop->even ? 'alt' : '' }}">
                    <td class="idx">{{ $loop->iteration }}</td>
                    <td class="name">{{ $item->product_name }}</td>
                    <td class="c-qty">{{ $item->quantity }}</td>
                    <td class="c-unit">{{ $money($item->unit_price) }}</td>
                    <td class="c-amount">{{ $money($item->unit_price * $item->quantity) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Payment history fills the space beside the totals instead of pushing a
         short receipt onto a second page. --}}
    <table class="summary">
        <tr>
            <td class="pay-cell">
                <div class="recap">
                    {{ $order->items->count() }} {{ $order->items->count() > 1 ? 'références' : 'référence' }},
                    {{ $unitCount }} {{ $unitCount > 1 ? 'articles' : 'article' }}
                </div>
                <div class="payment">
                    <span class="k">Historique de paiement</span>
                    <table class="bank">
                        <tr><td class="label">Mode de paiement</td><td class="value">Virement bancaire</td></tr>
                        <tr><td class="label">Date</td><td class="value">{{ $order->paid_at->translatedFormat('d F Y') }}</td></tr>
                        <tr><td class="label">Montant payé</td><td class="value">{{ $money($order->total) }}</td></tr>
                        <tr><td class="label">N° de reçu</td><td class="value">{{ $order->receipt_reference }}</td></tr>
                    </table>

                    <div class="terms">
                        Reçu émis pour la facture {{ $order->reference }}, acquittée le
                        {{ $order->paid_at->translatedFormat('d F Y') }}. Aucun montant restant dû.
                    </div>
                </div>
            </td>
            <td class="spacer"></td>
            <td class="tot-cell">
                <table class="totals">
                    <tr>
                        <td>Sous-total</td>
                        <td class="amt">{{ $money($order->subtotal) }}</td>
                    </tr>
                    <tr>
                        <td>Livraison</td>
                        <td class="amt">{{ $order->shipping > 0 ? $money($order->shipping) : 'Offerte' }}</td>
                    </tr>
                    <tr class="sep">
                        <td>TVA ({{ $taxPercent }} %)</td>
                        <td class="amt">{{ $money($order->tax) }}</td>
                    </tr>
                    <tr class="grand">
                        <td colspan="2">
                            <table class="grand-inner">
                                <tr>
                                    <td>Montant payé</td>
                                    <td class="amt">{{ $money($order->total) }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</div>

<div class="footer">
    <table>
        <tr>
            <td>{{ $settings->site_name }}@if($settings->contact_email) · {{ $settings->contact_email }}@endif</td>
            <td class="right">Reçu {{ $order->receipt_reference }} · <span class="page-num"></span></td>
        </tr>
    </table>
</div>

</body>
</html>
