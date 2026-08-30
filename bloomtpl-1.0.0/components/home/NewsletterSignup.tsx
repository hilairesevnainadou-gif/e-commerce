"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
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
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">S&apos;abonner</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
