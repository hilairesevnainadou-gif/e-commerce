<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        if (Subscriber::where('email', $data['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['Cet e-mail est déjà abonné à la newsletter.'],
            ]);
        }

        Subscriber::create($data);

        return response()->json([
            'message' => 'Merci pour votre inscription !',
        ], 201);
    }
}
