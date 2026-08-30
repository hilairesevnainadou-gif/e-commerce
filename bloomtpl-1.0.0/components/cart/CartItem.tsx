"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  isLast: boolean;
}

export default function CartItem({ item, isLast }: CartItemProps) {
  const { removeFromCart, updateQuantity, updateVariant } = useCart();
  const { currency } = useSettings();
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const handleRemove = () => {
    removeFromCart(item.id, item.size, item.color);
    setConfirmRemoveOpen(false);
  };

  const current = { size: item.size, color: item.color };
  const canEditSize = !!item.availableSizes?.length;
  const canEditColor = !!item.availableColors?.length;

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="100px"
            className="rounded-lg object-cover bg-muted"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="font-semibold text-foreground line-clamp-2">
                {item.name}
              </h2>
              {!canEditSize && !canEditColor && (item.size || item.color) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.size && <>Taille : {item.size}</>}
                  {item.size && item.color && " · "}
                  {item.color && <>Couleur : {item.color}</>}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(item.price, currency)} l&apos;unité
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmRemoveOpen(true)}
              className="text-muted-foreground hover:text-destructive h-10 w-10 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {(canEditColor || canEditSize) && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
              {canEditColor && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Couleur :</span>
                  <div className="flex flex-wrap gap-1">
                    {item.availableColors!.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          updateVariant(item.id, current, { color })
                        }
                        className={cn(
                          "px-2 py-0.5 rounded-full border text-xs transition-colors",
                          item.color === color
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {canEditSize && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Taille :</span>
                  <div className="flex flex-wrap gap-1">
                    {item.availableSizes!.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => updateVariant(item.id, current, { size })}
                        className={cn(
                          "h-6 min-w-[1.5rem] px-1.5 rounded-full border text-xs transition-colors",
                          item.size === size
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                }
                disabled={item.quantity <= 1}
                className="h-10 w-10 rounded-r-none"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-4 py-2 min-w-[50px] text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                }
                className="h-10 w-10 rounded-l-none"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {formatPrice(item.price * item.quantity, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isLast && <Separator className="mt-4" />}

      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer l&apos;article</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Retirer « {item.name} » de votre panier ?
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmRemoveOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleRemove}>
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
