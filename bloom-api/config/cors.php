<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Origins allowed to call the API from a browser. The checkout page runs
    // client-side, so the storefront domain must be listed here or the order
    // POST is blocked by the browser. Override in production through
    // CORS_ALLOWED_ORIGINS in .env (comma-separated list).
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', (string) env(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:3000,http://localhost:3001,'
        . 'https://friedrichgrupo.online,https://www.friedrichgrupo.online,https://admin.friedrichgrupo.online,'
        . 'https://maisonvelocite.com,https://www.maisonvelocite.com,'
        . 'https://frontend-e-pi.vercel.app'
    ))))),

    // Vercel preview deployments get a generated subdomain on every push.
    'allowed_origins_patterns' => [
        '#^https://frontend-e-[a-z0-9-]+\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
