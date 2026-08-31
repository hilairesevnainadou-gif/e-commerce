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
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  LayoutDashboard,
  ListTree,
  LogOut,
  Mail,
  Package,
  Settings as SettingsIcon,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/products", label: "Produits", icon: Package },
  { href: "/categories", label: "Catégories", icon: ListTree },
  { href: "/banners", label: "Bannières", icon: ImageIcon },
  { href: "/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/subscribers", label: "Abonnés newsletter", icon: Mail },
  { href: "/settings", label: "Réglages", icon: SettingsIcon },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
      setConfirmLogoutOpen(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "w-64 shrink-0 border-r border-border bg-background flex flex-col h-screen fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:sticky md:top-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight">
              BLOOM<span className="text-primary">SHOP</span>
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Panneau d&apos;administration
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-accent"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-3">
          <div className="px-3 text-sm">
            <p className="font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => setConfirmLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <Dialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Se déconnecter</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Voulez-vous vraiment vous déconnecter du panneau
            d&apos;administration ?
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmLogoutOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Déconnexion..." : "Se déconnecter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
