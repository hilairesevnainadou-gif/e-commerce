"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import {
  deleteSubscriber,
  exportSubscribers,
  getAdminSubscribers,
  type Subscriber,
} from "@/lib/api";
import { ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const PER_PAGE = 20;

export default function SubscribersPage() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAdminSubscribers(token, { page, perPage: PER_PAGE })
      .then((result) => {
        setSubscribers(result.data);
        setMeta(result.meta ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, page]);

  const handleDelete = async () => {
    if (!token || !subscriberToDelete) return;
    setDeleting(true);
    try {
      await deleteSubscriber(token, subscriberToDelete.id);
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriberToDelete.id));
      setMeta((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setSubscriberToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const blob = await exportSubscribers(token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `abonnes-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Abonnés newsletter</h1>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              {meta.total} abonné{meta.total > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exporting || !meta?.total}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Export..." : "Exporter en CSV"}
        </Button>
      </div>

      {loading ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : subscribers.length === 0 ? (
        <div className="border border-border rounded-lg bg-background px-4 py-8 text-center text-muted-foreground">
          Aucun abonné pour l&apos;instant.
        </div>
      ) : (
        <>
          <div className="border border-border rounded-lg bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">E-mail</th>
                  <th className="text-left font-medium px-4 py-3">Inscrit le</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {subscriber.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(subscriber.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSubscriberToDelete(subscriber)}
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

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Page {meta.current_page} sur {meta.last_page}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={meta.current_page >= meta.last_page}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog
        open={!!subscriberToDelete}
        onOpenChange={(open) => !open && setSubscriberToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;abonné</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir retirer « {subscriberToDelete?.email} » de la
            liste de diffusion ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubscriberToDelete(null)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
