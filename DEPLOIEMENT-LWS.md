# Déploiement sur LWS

Trois applications à déployer, chacune avec son bundle prêt à uploader :

| Application | Bundle | Domaine cible |
|---|---|---|
| API Laravel | `bloom-api/bloom-api-deploy.zip` (15 Mo, 7 016 fichiers) | `api.friedrichgrupo.online` |
| Vitrine Next.js | `bloomtpl-1.0.0/bloomtpl-deploy.zip` (16 Mo, 1 611 fichiers) | `friedrichgrupo.online` |
| Back-office Next.js | `bloom-admin/bloom-admin-deploy.zip` (12 Mo, 1 423 fichiers) | `admin.friedrichgrupo.online` |

Total : ~10 000 fichiers (à comparer au quota d'inodes de l'offre LWS).

Les deux fronts Next.js sont **entièrement dynamiques** (SSR) : aucune page n'est
pré-rendue, donc un export statique est impossible. Il faut un hébergement où
**Node.js 20.9+ tourne en permanence** (cPanel → *Setup Node.js App*, ou un VPS).

---

## 1. API Laravel

1. **Sous-domaine** `api.friedrichgrupo.online`, racine `~/api`, et *document root*
   pointé sur `~/api/public`. Si LWS ne permet pas de changer le document root :
   placer le contenu de `public/` dans le dossier web et le reste dans un dossier
   frère, puis corriger les deux `require` de `public/index.php`.
2. **PHP 8.2 minimum** (Laravel 12) via *MultiPHP Manager*. Extensions requises :
   `mbstring`, `openssl`, `pdo_mysql`, `gd`, `dom`, `zip`, `fileinfo`.
3. **Upload** `bloom-api-deploy.zip`, extraction dans `~/api` (le zip s'extrait
   directement à la racine : `app/`, `public/`, `vendor/`…).
4. **Base de données** : créer BDD + utilisateur dans le panel LWS, puis importer
   `bloom-api/bloom_ecommerce_velo.sql` via phpMyAdmin (structure + données,
   20 tables). Alternative en SSH : `php artisan migrate --force --seed`.
5. **Configuration** : renommer `.env.production.example` en `.env` et remplir les
   `CHANGEME` (APP_KEY, identifiants BDD, SMTP).
   - `APP_KEY` : reprendre celle du `.env` local si la base importée vient de là,
     sinon `php artisan key:generate --show`.
6. **Permissions** : `storage/` et `bootstrap/cache/` en **755** (jamais 777 chez
   LWS : cela provoque une 500).
7. **Images** : créer le lien `public/storage` → `../storage/app/public`
   (`php artisan storage:link` en SSH, sinon lien symbolique manuel).
8. **Caches** (SSH, optionnel mais recommandé) :
   `php artisan config:cache && php artisan route:cache`.
   À refaire après chaque modification du `.env`.
9. **Vérification** : `https://api.friedrichgrupo.online/api/settings` doit
   renvoyer du JSON.

### En cas de 500

Dans l'ordre de probabilité : version PHP trop basse → `vendor/` incomplet →
permissions 777 → `.env`/`APP_KEY` manquant → `AllowOverride` qui refuse la ligne
`Options -MultiViews -Indexes` du `.htaccess`. Passer `APP_DEBUG=true`
temporairement, puis lire `storage/logs/laravel.log` et les logs d'erreur du panel.

---

## 2. Fronts Next.js (mutualisé avec Node.js)

Pour chaque front, dans cPanel → **Setup Node.js App** :

- **Node version** : 20.9 minimum (22 conseillé)
- **Application root** : le dossier où le zip a été extrait
- **Application URL** : le domaine ou sous-domaine correspondant
- **Application startup file** : `server.js`
- **Environment variable** : `NEXT_PUBLIC_API_URL=https://friedrichgrupo.online/api`
- puis **Restart**

Passenger fournit lui-même le `PORT`, que `server.js` utilise automatiquement.
`npm install` est inutile : les dépendances sont déjà dans le bundle, avec les
binaires **sharp Linux x64** (les binaires Windows ont été retirés).

### Variante VPS

```bash
sudo npm i -g pm2
cd /var/www/bloom-front && pm2 start server.js --name bloom-front
pm2 save && pm2 startup
```
Puis un vhost Nginx en `proxy_pass http://127.0.0.1:3000;` et `certbot` pour le TLS.

---

## 3. Régénérer les bundles

`NEXT_PUBLIC_API_URL` est figée **au moment du build** : toute modification de
`.env.local` impose un rebuild complet.

```bash
# Front (idem dans bloom-admin)
cd bloomtpl-1.0.0
npm run build
rm -rf deploy && mkdir deploy
cp -r .next/standalone/. deploy/
mkdir -p deploy/.next && cp -r .next/static deploy/.next/static
cp -r public deploy/public

# Binaires sharp pour Linux (les builds Windows ne fonctionnent pas sur LWS)
npm i sharp@0.34.5 --os=linux --cpu=x64 --libc=glibc --prefix /tmp/sharp-linux
cp -r /tmp/sharp-linux/node_modules/@img/sharp-linux-x64 deploy/node_modules/@img/
cp -r /tmp/sharp-linux/node_modules/@img/sharp-libvips-linux-x64 deploy/node_modules/@img/
rm -rf deploy/node_modules/@img/sharp-win32-x64

tar -a -c -f bloomtpl-deploy.zip -C deploy .
```

```bash
# API
cd bloom-api
composer install --no-dev --optimize-autoloader
```

---

## Si le domaine racine sert la vitrine

L'API est actuellement attendue sur `https://friedrichgrupo.online/api`, c'est-à-dire
sur le domaine racine — or c'est là que doit vivre la vitrine, et les deux ne peuvent
pas cohabiter sous Apache. Après avoir déplacé l'API sur `api.friedrichgrupo.online`,
mettre à jour les deux `.env.local` :

```
NEXT_PUBLIC_API_URL=https://api.friedrichgrupo.online/api
```

puis **rebuilder les deux fronts** (voir section 3). Le sous-domaine est déjà autorisé
dans `next.config.ts` et dans la configuration CORS de l'API.
