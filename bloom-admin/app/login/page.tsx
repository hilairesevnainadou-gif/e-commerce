"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  Mail,
  Package,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const BACKGROUND_IMAGE_URL =
  "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1600&auto=format&fit=crop";

const highlights = [
  {
    icon: LayoutDashboard,
    title: "Vue d'ensemble en temps réel",
    description: "Chiffre d'affaires, commandes et alertes de stock d'un seul coup d'œil.",
  },
  {
    icon: Package,
    title: "Catalogue sous contrôle",
    description: "Produits, variantes, catégories et bannières centralisés.",
  },
  {
    icon: ShoppingBag,
    title: "Commandes maîtrisées",
    description: "Suivi des statuts, factures et reçus générés automatiquement.",
  },
];

function LoginForm() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already signed in (e.g. navigated back to /login with a valid
  // session) — no reason to show the form again.
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Branded panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden px-12 py-12">
        <Image
          src={BACKGROUND_IMAGE_URL}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        <div className="relative">
          <span className="text-2xl font-bold tracking-tight text-white">
            BLOOM<span className="text-primary">SHOP</span>
          </span>
          <p className="text-sm text-white/70 mt-1">Panneau d&apos;administration</p>
        </div>

        <div className="relative space-y-8 max-w-sm">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Pilotez votre boutique en toute simplicité.
          </h1>
          <div className="space-y-5">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{title}</p>
                  <p className="text-sm text-white/70">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} BloomShop. Tous droits réservés.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <span className="lg:hidden inline-block text-xl font-bold tracking-tight mb-6">
              BLOOM<span className="text-primary">SHOP</span>
            </span>
            <h2 className="text-2xl font-bold text-foreground">Bon retour</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous pour accéder au panneau d&apos;administration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {expired && !error && (
              <p className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                Votre session a expiré. Veuillez vous reconnecter.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@bloomshop.test"
                  className="pl-9"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
