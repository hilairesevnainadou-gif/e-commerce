"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  createProduct,
  deleteProductImage,
  getCategories,
  setMainProductImage,
  updateProduct,
} from "@/lib/api";
import type { Category, Product, ProductImage } from "@/types/product";
import { Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface StagedFile {
  key: string;
  file: File;
  previewUrl: string;
}

export default function ProductForm({ product }: { product?: Product }) {
  const { token } = useAuth();
  const { currency } = useSettings();
  const router = useRouter();
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState<string>(
    product?.category?.id ? String(product.category.id) : ""
  );
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() || ""
  );
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [reviewsCount, setReviewsCount] = useState(
    String(product?.reviews_count ?? 0)
  );
  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    product?.images ?? []
  );
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [imageActionId, setImageActionId] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    return () => {
      stagedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      key: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setStagedFiles((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeStagedFile = (key: string) => {
    setStagedFiles((prev) => {
      const target = prev.find((f) => f.key === key);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.key !== key);
    });
  };

  const handleDeleteExistingImage = async () => {
    if (!token || !product || !imageToDelete) return;

    setImageActionId(imageToDelete.id);
    try {
      const updated = await deleteProductImage(token, product.id, imageToDelete.id);
      setExistingImages(updated.images ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer l'image.");
    } finally {
      setImageActionId(null);
      setImageToDelete(null);
    }
  };

  const handleSetMainImage = async (image: ProductImage) => {
    if (!token || !product) return;

    setImageActionId(image.id);
    try {
      const updated = await setMainProductImage(token, product.id, image.id);
      setExistingImages(updated.images ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de définir l'image principale.");
    } finally {
      setImageActionId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("compare_at_price", compareAtPrice);
    formData.append("stock", stock);
    formData.append("is_active", isActive ? "1" : "0");
    formData.append("is_new", isNew ? "1" : "0");
    formData.append("reviews_count", reviewsCount || "0");
    if (categoryId) formData.append("category_id", categoryId);
    stagedFiles.forEach(({ file }) => formData.append("images[]", file));

    try {
      if (isEditing) {
        await updateProduct(token, product.id, formData);
      } else {
        await createProduct(token, formData);
      }
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tarification &amp; stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix ({currency})</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Prix barré ({currency})</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="Optionnel"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Renseignez un prix barré supérieur au prix actuel pour afficher
                le produit comme étant en promotion sur la boutique.
              </p>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="max-w-[12rem]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingImages.length === 0 && stagedFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune image pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border group"
                    >
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Principale
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            title="Définir comme image principale"
                            disabled={imageActionId === image.id}
                            onClick={() => handleSetMainImage(image)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          title="Supprimer l'image"
                          disabled={imageActionId === image.id}
                          onClick={() => setImageToDelete(image)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {stagedFiles.map((staged) => (
                    <div
                      key={staged.key}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-dashed border-primary/50 group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={staged.previewUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/90 text-[10px] font-medium px-2 py-0.5">
                        Nouvelle
                      </span>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          title="Retirer"
                          onClick={() => removeStagedFile(staged.key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Input
                ref={fileInputRef}
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleAddFiles(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Ajouter des images
              </Button>
              <p className="text-xs text-muted-foreground">
                La première image (ou celle marquée « Principale ») est celle
                affichée dans le catalogue. Survolez une image pour la
                supprimer ou la définir comme principale.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="is_active">Visible sur la boutique</Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch id="is_new" checked={isNew} onCheckedChange={setIsNew} />
                <Label htmlFor="is_new">
                  Nouveauté
                  <span className="block text-xs font-normal text-muted-foreground">
                    Affiché dans la vue « Nouveautés » de la boutique
                  </span>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avis clients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="reviews_count">Nombre d&apos;avis</Label>
              <Input
                id="reviews_count"
                type="number"
                min="0"
                max="2000"
                value={reviewsCount}
                onChange={(e) => setReviewsCount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Génère automatiquement ce nombre d&apos;avis clients pour ce
                produit
                {isEditing && product.reviews_count > 0 && (
                  <>
                    {" "}
                    (actuellement {product.reviews_count}, note moyenne{" "}
                    {product.reviews_avg_rating?.toFixed(1) ?? "—"}/5)
                  </>
                )}
                . Réduire le nombre supprime les avis les plus anciens.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Créer le produit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          Annuler
        </Button>
      </div>
    </form>

    <Dialog
      open={!!imageToDelete}
      onOpenChange={(open) => !open && setImageToDelete(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;image</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer cette image du produit ? Cette
          action est irréversible.
        </p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setImageToDelete(null)}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteExistingImage}
            disabled={imageActionId === imageToDelete?.id}
          >
            {imageActionId === imageToDelete?.id ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
