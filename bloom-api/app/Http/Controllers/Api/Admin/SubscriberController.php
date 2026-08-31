<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubscriberController extends Controller
{
    public function index(Request $request)
    {
        $subscribers = Subscriber::orderByDesc('id')
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => $subscribers->items(),
            'meta' => [
                'current_page' => $subscribers->currentPage(),
                'last_page' => $subscribers->lastPage(),
                'total' => $subscribers->total(),
            ],
        ]);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return response()->json(['message' => 'Abonné supprimé.']);
    }

    public function export(): StreamedResponse
    {
        $filename = 'abonnes-newsletter-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputs($handle, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel.
            fputcsv($handle, ['E-mail', 'Inscrit le']);

            Subscriber::orderByDesc('id')->chunk(200, function ($subscribers) use ($handle) {
                foreach ($subscribers as $subscriber) {
                    fputcsv($handle, [
                        $subscriber->email,
                        $subscriber->created_at->format('Y-m-d H:i'),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
