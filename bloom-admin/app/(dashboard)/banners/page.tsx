"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { deleteBanner, getAdminBanners } from "@/lib/api";
import { BANNER_POSITIONS, type Banner } from "@/types/banner";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBanners = () => {
    if (!token) return;
    setLoading(true);
    getAdminBanners(token)
      .then(setBanners)
      .finally(() => setLoading(false));
  };

  useEffect(loadBanners, [token]);

  const handleDelete = async () => {
    if (!token || !bannerToDelete) return;
    setDeleting(true);
    try {
      await deleteBanner(token, bannerToDelete.id);
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setBannerToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const positionLabel = (value: string) =>
    BANNER_POSITIONS.find((p) => p.value === value)?.label || value;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          Bannières
          <span className="block text-sm font-normal text-muted-foreground mt-1">
            Espaces publicitaires affichés sur la page d&apos;accueil de la
            boutique.
          </span>
        </h1>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/banners/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle bannière
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : banners.length === 0 ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Aucune bannière pour l&apos;instant.
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="border border-border rounded-lg bg-background p-4 flex gap-3"
              >
                <Link href={`/banners/${banner.id}`} className="shrink-0">
                  <div className="relative h-14 w-20 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={banner.image_url}
                      alt={banner.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/banners/${banner.id}`}
                      className="font-medium text-foreground hover:text-primary truncate"
                    >
                      {banner.title}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setBannerToDelete(banner)}
                      className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8 -mt-1 -mr-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {positionLabel(banner.position)}
                  </p>
                  <Badge
                    variant={banner.is_active ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {banner.is_active ? "Active" : "Masquée"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet and up: table */}
          <div className="hidden sm:block border border-border rounded-lg bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Bannière</th>
                  <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                    Emplacement
                  </th>
                  <th className="text-left font-medium px-4 py-3">Statut</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/banners/${banner.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative h-10 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={banner.image_url}
                            alt={banner.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-foreground hover:text-primary">
                          {banner.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {positionLabel(banner.position)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? "Active" : "Masquée"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBannerToDelete(banner)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Dialog
        open={!!bannerToDelete}
        onOpenChange={(open) => !open && setBannerToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la bannière</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer « {bannerToDelete?.title} » ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerToDelete(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
