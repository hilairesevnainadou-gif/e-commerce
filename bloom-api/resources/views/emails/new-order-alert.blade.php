<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nouvelle commande {{ $order->reference }}</title>
</head>
<body style="margin:0; padding:32px 16px; background:#f5f5f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Brand header -->
          <tr>
            <td style="padding:0 4px 16px 4px;">
              <span style="font-size:15px; font-weight:700; color:#1a1a1a;">{{ $settings->site_name }}</span>
              <span style="font-size:13px; color:#6b6b6b;"> · Panneau d'administration</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff; border:1px solid #e5e5e5; border-radius:12px; padding:28px;">

              <p style="margin:0 0 6px 0; font-size:13px; color:#6b6b6b;">
                Nouvelle commande reçue
              </p>
              <p style="margin:0 0 4px 0; font-size:30px; font-weight:700; color:#1a1a1a;">
                {{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}
              </p>
              <p style="margin:0 0 20px 0; font-size:13px; color:#6b6b6b;">
                Commande {{ $order->reference }} — {{ $order->created_at->translatedFormat('d F Y à H:i') }}
              </p>

              <div style="border-top:1px solid #e5e5e5; padding-top:16px; margin-bottom:16px;">
                <a href="{{ $orderUrl }}" style="color:#ea580c; text-decoration:none; font-size:13px; font-weight:600;">
                  &#8594; Voir la commande dans l'admin
                </a>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e5e5; padding-top:14px;">
                <tr>
                  <td style="padding-top:14px; font-size:12px; color:#6b6b6b;">
                    Client<br>
                    <span style="color:#1a1a1a; font-weight:600;">{{ $order->customer_name }}</span>
                  </td>
                  <td style="padding-top:14px; font-size:12px; color:#6b6b6b;">
                    E-mail<br>
                    <span style="color:#1a1a1a; font-weight:600;">{{ $order->customer_email }}</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <!-- Order details card -->
          <tr>
            <td style="background:#ffffff; border:1px solid #e5e5e5; border-radius:12px; padding:28px;">
              <p style="margin:0 0 16px 0; font-size:14px; font-weight:700; color:#1a1a1a;">
                Articles ({{ $order->items->sum('quantity') }})
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                @foreach($order->items as $item)
                <tr>
                  <td style="padding:10px 0; border-top:1px solid #e5e5e5; font-size:13px; color:#1a1a1a;">
                    {{ $item->product_name }}
                    <br><span style="font-size:11px; color:#6b6b6b;">Qté {{ $item->quantity }}</span>
                  </td>
                  <td style="padding:10px 0; border-top:1px solid #e5e5e5; font-size:13px; color:#1a1a1a; text-align:right; white-space:nowrap;">
                    {{ \App\Support\MoneyFormatter::format($item->unit_price * $item->quantity, $settings->currency) }}
                  </td>
                </tr>
                @endforeach
                <tr>
                  <td style="padding:14px 0 4px 0; border-top:1px solid #1a1a1a; font-size:13px; font-weight:700; color:#1a1a1a;">Total</td>
                  <td style="padding:14px 0 4px 0; border-top:1px solid #1a1a1a; font-size:13px; font-weight:700; color:#1a1a1a; text-align:right;">
                    {{ \App\Support\MoneyFormatter::format($order->total, $settings->currency) }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 4px 0 4px; text-align:center; font-size:12px; color:#6b6b6b;">
              Vous recevez cet e-mail car les notifications de nouvelle commande sont activées dans les réglages de {{ $settings->site_name }}.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
