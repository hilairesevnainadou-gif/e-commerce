# BloomShop

BloomShop est une plateforme e-commerce complète composée de trois applications indépendantes réunies dans ce dépôt (monorepo) : une **API REST Laravel**, une **boutique publique Next.js** et un **back-office d'administration Next.js**.

| Dossier | Rôle | Stack |
| --- | --- | --- |
| [`bloom-api/`](bloom-api) | API REST : produits, catégories, commandes, avis, réglages, facturation PDF, authentification | Laravel 12 (PHP 8.2+), MySQL |
| [`bloomtpl-1.0.0/`](bloomtpl-1.0.0) | Boutique publique (vitrine client) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| [`bloom-admin/`](bloom-admin) | Back-office pour gérer produits, catégories, bannières, commandes et réglages | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |

Les deux applications front-end sont des clients purement statiques/SSR qui consomment l'API `bloom-api` via HTTP — aucune des deux n'accède directement à la base de données.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation en local](#installation-en-local)
  - [1. Base de données](#1-base-de-données)
  - [2. API (bloom-api)](#2-api-bloom-api)
  - [3. Boutique publique (bloomtpl-1.0.0)](#3-boutique-publique-bloomtpl-100)
  - [4. Back-office (bloom-admin)](#4-back-office-bloom-admin)
- [Démarrage rapide (tout en un)](#démarrage-rapide-tout-en-un)
- [Structure du projet](#structure-du-projet)
- [Déploiement en production](#déploiement-en-production)
- [Licence](#licence)

## Fonctionnalités

### Boutique publique (`bloomtpl-1.0.0`)

- Catalogue produits avec filtres, catégories et fiches détaillées (variantes taille/couleur, galerie d'images, avis, produits liés)
- Panier persistant avec recommandations
- Tunnel de commande complet (coordonnées, adresse, sélecteur de pays avec frais de livraison internationaux hors zone euro, moyen de paiement)
- Page de confirmation de commande avec téléchargement de facture PDF et copie de l'IBAN pour le virement
- Suivi de commande
- Notifications toast, bandeau d'annonce, bouton de contact WhatsApp flottant
- Pages institutionnelles : À propos, Blog, Carrières, Presse, Aide, Contact, mentions légales, confidentialité, cookies, accessibilité, livraison, retours, moyens de paiement, CGV
- Réglages de la boutique (nom, devise, taxes, frais de livraison, coordonnées bancaires…) pilotés dynamiquement depuis l'API

### Back-office (`bloom-admin`)

- Authentification admin (via Laravel Sanctum)
- Gestion des produits (CRUD, images multiples, image principale, variantes taille/couleur)
- Gestion des catégories
- Gestion des bannières de la page d'accueil
- Gestion des commandes (consultation, changement de statut)
- Gestion des réglages globaux de la boutique

### API (`bloom-api`)

- Endpoints publics : produits, catégories, avis, bannières, réglages
- Authentification (inscription/connexion) et endpoints protégés (`/me`, historique de commande) via Laravel Sanctum
- Création de commande, génération de facture et de reçu PDF (liens signés, sans connexion requise) via `barryvdh/laravel-dompdf`
- Espace `admin/*` protégé par un middleware de rôle (`EnsureUserIsAdmin`) pour la gestion complète du catalogue, des commandes et des réglages

## Architecture

```text
┌─────────────────────┐      ┌──────────────────────┐
│  bloomtpl-1.0.0      │      │  bloom-admin          │
│  Boutique publique    │      │  Back-office admin    │
│  Next.js (port 3000) │      │  Next.js (port 3001) │
└──────────┬───────────┘      └──────────┬───────────┘
           │           HTTP / JSON       │
           └──────────────┬──────────────┘
                           ▼
                  ┌──────────────────┐
                  │   bloom-api        │
                  │   Laravel (8000)  │
                  └────────┬──────────┘
                           ▼
                  ┌──────────────────┐
                  │  MySQL/MariaDB    │
                  │  bloom_ecommerce  │
                  └──────────────────┘
```

## Prérequis

- **PHP 8.2+** avec les extensions usuelles de Laravel (pdo_mysql, mbstring, openssl, etc.)
- **Composer**
- **Node.js 20+** et npm
- **MySQL / MariaDB** (ou XAMPP, qui fournit Apache + MySQL + PHP)
- (Optionnel) **Redis** si vous souhaitez l'utiliser pour le cache/les queues au lieu du driver `database`

## Installation en local

### 1. Base de données

Créez une base de données MySQL vide (le nom par défaut attendu est `bloom_ecommerce`) :

```sql
CREATE DATABASE bloom_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Avec XAMPP, cela peut se faire depuis phpMyAdmin ou en ligne de commande :

```bash
mysql -u root -e "CREATE DATABASE bloom_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. API (`bloom-api`)

```bash
cd bloom-api
composer install
cp .env.example .env
php artisan key:generate
```

Renseignez ensuite les identifiants de connexion à la base dans `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bloom_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

Puis lancez les migrations et (optionnellement) les seeders pour peupler la base avec des données de démonstration (catalogue, avis, variantes…) :

```bash
php artisan migrate
php artisan db:seed
```

Créez un compte administrateur (via `php artisan tinker` ou une seed dédiée) en vous assurant que sa colonne `role` vaut `admin` — c'est ce que vérifie le middleware `EnsureUserIsAdmin` pour autoriser l'accès au back-office.

Démarrez le serveur de développement :

```bash
php artisan serve
```

L'API est alors disponible sur `http://localhost:8000` (base des routes : `http://localhost:8000/api`).

> Le mailer est configuré en mode `log` par défaut (`.env`) : les e-mails (confirmation de commande, etc.) sont écrits dans `storage/logs/laravel.log` plutôt qu'envoyés réellement. Configurez `MAIL_MAILER` et les identifiants SMTP pour un envoi réel.

### 3. Boutique publique (`bloomtpl-1.0.0`)

```bash
cd bloomtpl-1.0.0
npm install
```

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Démarrez le serveur de développement :

```bash
npm run dev
```

Disponible sur `http://localhost:3000`.

### 4. Back-office (`bloom-admin`)

```bash
cd bloom-admin
npm install
```

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Démarrez le serveur de développement (configuré pour tourner sur le port 3001 afin de ne pas entrer en conflit avec la boutique publique) :

```bash
npm run dev
```

Disponible sur `http://localhost:3001`.

## Démarrage rapide (tout en un)

Une fois les trois applications installées et configurées comme ci-dessus, trois terminaux suffisent pour tout lancer :

```bash
# Terminal 1 — API
cd bloom-api && php artisan serve

# Terminal 2 — Boutique publique
cd bloomtpl-1.0.0 && npm run dev

# Terminal 3 — Back-office
cd bloom-admin && npm run dev
```

`bloom-api` fournit également un script Composer `composer run dev` qui démarre en parallèle le serveur PHP, le worker de queue, les logs (`pail`) et Vite — pratique pour le développement de l'API seule.

## Structure du projet

```text
ecommerce/
├── bloom-api/            API REST Laravel
│   ├── app/Models/       Product, Category, Order, OrderItem, Review, Banner, Setting, User...
│   ├── app/Http/Controllers/Api/       Contrôleurs publics
│   ├── app/Http/Controllers/Api/Admin/ Contrôleurs protégés (CRUD produits, commandes, réglages...)
│   ├── database/migrations/            Schéma de la base de données
│   ├── database/seeders/               Données de démonstration (catalogue, avis, variantes...)
│   └── routes/api.php                  Déclaration des routes de l'API
│
├── bloomtpl-1.0.0/       Boutique publique (Next.js)
│   ├── app/              Routes : shop, product/[slug], cart, checkout, pages institutionnelles...
│   ├── components/       home, product, shop, cart, layout, ui (shadcn/ui)
│   ├── context/          CartContext, SettingsContext, ToastContext
│   └── lib/               Client API, formatage des prix, pays/zone euro, utilitaires
│
└── bloom-admin/          Back-office (Next.js)
    ├── app/(dashboard)/  products, categories, banners, orders, settings
    ├── app/login/        Authentification admin
    ├── components/       Composants d'interface du back-office
    └── lib/               Client API vers bloom-api
```

## Déploiement en production

### API (`bloom-api`)

1. Sur le serveur : `composer install --no-dev --optimize-autoloader`.
2. Copier `.env.example` vers `.env`, renseigner `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` (domaine public de l'API), les identifiants MySQL de production et une configuration SMTP réelle (`MAIL_MAILER`, `MAIL_HOST`, etc.).
3. `php artisan key:generate --force` puis `php artisan migrate --force`.
4. Mettre en cache la configuration et les routes : `php artisan config:cache && php artisan route:cache`.
5. Servir l'application via Apache/Nginx + PHP-FPM en pointant le document root sur `bloom-api/public`, avec HTTPS activé.
6. Prévoir un worker de queue persistant (`php artisan queue:work`, supervisé par ex. via Supervisor) si des jobs asynchrones sont utilisés.

### Boutique publique et back-office (`bloomtpl-1.0.0`, `bloom-admin`)

Ce sont deux applications Next.js indépendantes, à builder et déployer séparément :

```bash
npm run build
npm run start   # ou déploiement sur une plateforme Next.js (Vercel, etc.)
```

Dans chaque environnement de production, définir `NEXT_PUBLIC_API_URL` pointant vers l'URL publique de `bloom-api` (par ex. `https://api.votredomaine.com/api`).

> Comme `bloom-api` sert de source unique de vérité (catalogue, commandes, réglages), assurez-vous que CORS est correctement configuré côté Laravel (`config/cors.php`) pour autoriser les domaines de la boutique publique et du back-office.

## Licence

- `bloomtpl-1.0.0` est basé à l'origine sur le template [BloomShop](https://themewagon.com/themes/bloomtpl/) de ThemeWagon (MIT), largement personnalisé et étendu depuis.
- `bloom-api` est un projet Laravel, framework open-source sous licence [MIT](https://opensource.org/licenses/MIT).
#   e - c o m m e r c e  
 