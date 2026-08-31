"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/ToastContext";
import { subscribeToNewsletter } from "@/lib/api";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function NewsletterSignup() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email);
      setEmail("");
      showToast("Merci pour votre inscription à la newsletter !");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 border-y border-border">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Restez informé
        </h3>
        <p className="text-muted-foreground mb-6">
          Abonnez-vous à notre newsletter pour des offres exclusives, les
          nouveautés et de l&apos;inspiration style.
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
          <Input
            type="email"
            placeholder="Entrez votre e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1"
            required
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span className="sr-only">S&apos;abonner</span>
          </Button>
        </form>
        {error && (
          <p className="text-sm text-destructive mt-3" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
