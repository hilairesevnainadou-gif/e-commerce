"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { createBanner, updateBanner } from "@/lib/api";
import { BANNER_POSITIONS, type Banner } from "@/types/banner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BannerForm({ banner }: { banner?: Banner }) {
  const { token } = useAuth();
  const router = useRouter();
  const isEditing = !!banner;

  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [linkUrl, setLinkUrl] = useState(banner?.link_url || "");
  const [position, setPosition] = useState(banner?.position || "home_hero");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(String(banner?.sort_order ?? 0));
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("link_url", linkUrl);
    formData.append("position", position);
    formData.append("is_active", isActive ? "1" : "0");
    formData.append("sort_order", sortOrder);
    if (image) formData.append("image", image);

    try {
      if (isEditing) {
        await updateBanner(token, banner.id, formData);
      } else {
        if (!image) {
          throw new Error("Une image est requise.");
        }
        await createBanner(token, formData);
      }
      router.push("/banners");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Sous-titre</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Emplacement</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger id="position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANNER_POSITIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">URL du lien (optionnel)</Label>
            <Input
              id="link_url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/shop ou https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Ordre d&apos;affichage</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="is_active">Visible sur la boutique</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            {banner?.image_url && (
              <div className="relative h-24 w-full max-w-sm rounded-md overflow-hidden bg-muted mb-2">
                <Image
                  src={banner.image_url}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              Recommandé : image large au format paysage, au moins 1600×600px
              pour l&apos;emplacement principal.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Créer la bannière"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/banners")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
