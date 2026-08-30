# BloomShop

Boutique e-commerce (vitrine publique) construite avec **Next.js 16** (App Router) et **Tailwind CSS v4**. Ce dépôt correspond au front-end client de la plateforme BloomShop, connecté à l'API Laravel du dépôt [`bloom-api`](../bloom-api) et administré via [`bloom-admin`](../bloom-admin).

## Stack technique

- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (style "new-york") + **Radix UI** pour les composants d'interface
- **lucide-react** pour les icônes

## Fonctionnalités

- Catalogue produits avec filtres et fiches détaillées (variantes taille/couleur, galerie, avis, produits liés)
- Panier persistant avec recommandations
- Tunnel de commande complet (coordonnées, adresse, sélecteur de pays avec frais de livraison internationaux hors zone euro, moyen de paiement) et page de confirmation avec téléchargement de facture PDF et copie de l'IBAN
- Suivi de commande
- Notifications toast (ex. ajout au panier)
- Bouton de contact WhatsApp flottant (masqué sur le tunnel de commande)
- Pages institutionnelles : À propos, Blog, Carrières, Presse, Aide, Contact, mentions légales, confidentialité, cookies, accessibilité, livraison, retours, moyens de paiement, CGV
- Réglages (nom du site, devise, taxes, frais de livraison, coordonnées bancaires, etc.) pilotés dynamiquement depuis l'API

## Dépôts liés

| Dépôt | Rôle |
| --- | --- |
| `bloomtpl-1.0.0` (ce dépôt) | Boutique publique (Next.js) |
| `bloom-api` | API REST Laravel (produits, commandes, paramètres, envoi d'e-mails et génération des factures PDF) |
| `bloom-admin` | Back-office Next.js pour gérer produits, commandes et réglages |

Le front-end public a besoin que `bloom-api` tourne pour fonctionner (catalogue, panier, commandes, réglages).

## Prérequis

- Node.js 20+
- L'API `bloom-api` démarrée (par défaut sur `http://localhost:8000`)

## Installation

```bash
npm install
```

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Démarrer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Démarre le serveur en mode production (après `build`) |
| `npm run lint` | Lint du code (ESLint) |

## Structure du projet

```text
app/                 Routes (App Router) : shop, product/[slug], cart, checkout, pages institutionnelles...
components/
  home/               Composants de la page d'accueil (bannières, liste produits, newsletter...)
  product/            Fiche produit (galerie, avis, produits liés...)
  shop/               Filtres de la boutique
  cart/               Panier et récapitulatif de commande
  layout/             Header, footer, bandeau d'annonce, bouton WhatsApp...
  ui/                 Composants shadcn/ui de base (button, card, input, select...)
context/              CartContext, SettingsContext, ToastContext (état global React)
lib/                  Client API, formatage des prix, liste des pays / zone euro, utilitaires
types/                Types TypeScript partagés (Order, Settings, Product...)
```

## Licence

Basé à l'origine sur le template [BloomShop](https://themewagon.com/themes/bloomtpl/) de ThemeWagon (MIT), largement personnalisé et étendu depuis.
