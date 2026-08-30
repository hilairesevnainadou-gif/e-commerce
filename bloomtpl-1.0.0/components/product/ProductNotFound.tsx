import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Produit introuvable
        </h1>
        <p className="text-muted-foreground mb-6">
          Le produit que vous recherchez n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la boutique
          </Link>
        </Button>
      </div>
    </div>
  );
}
