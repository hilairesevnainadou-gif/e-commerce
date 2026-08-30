"use client";

import BannerForm from "@/components/banners/BannerForm";
import { useAuth } from "@/context/AuthContext";
import { getAdminBanner } from "@/lib/api";
import type { Banner } from "@/types/banner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBannerPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminBanner(token, Number(id))
      .then(setBanner)
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (!banner) {
    return <p className="text-muted-foreground">Bannière introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Modifier la bannière</h1>
      <BannerForm banner={banner} />
    </div>
  );
}
