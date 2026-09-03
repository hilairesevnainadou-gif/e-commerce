"use client";

import { useSettings } from "@/context/SettingsContext";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Footer() {
  const settings = useSettings();

  const footerSections = [
    {
      title: "Boutique",
      links: [
        { href: "/shop", label: "Tous les produits" },
        { href: "/shop?category=velos-de-route", label: "Vélos de route" },
        { href: "/shop?category=vtt", label: "VTT" },
        { href: "/shop?category=velos-electriques", label: "Vélos électriques" },
        { href: "/shop?category=pieces-composants", label: "Pièces & Accessoires" },
        { href: "/shop?on_sale=1", label: "Promotions" },
      ],
    },
    {
      title: "Service client",
      links: [
        { href: "/contact", label: "Nous contacter" },
        { href: "/help", label: "Centre d'aide" },
        { href: "/shipping", label: "Informations de livraison" },
        { href: "/returns", label: "Retours et échanges" },
        { href: "/payment-methods", label: "Moyens de paiement" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { href: "/about", label: "À propos" },
        { href: "/careers", label: "Carrières" },
        { href: "/help", label: "FAQ" },
        { href: "/track-order", label: "Suivi de commande" },
      ],
    },
    {
      title: "Mentions légales",
      links: [
        { href: "/legal-notice", label: "Mentions légales" },
        { href: "/privacy", label: "Politique de confidentialité" },
        { href: "/terms", label: "Conditions générales" },
        { href: "/cookies", label: "Politique de cookies" },
        { href: "/accessibility", label: "Accessibilité" },
      ],
    },
  ];

  const socialLinks = [
    settings.social_facebook && {
      href: settings.social_facebook,
      icon: Facebook,
      label: "Facebook",
    },
    settings.social_twitter && {
      href: settings.social_twitter,
      icon: Twitter,
      label: "Twitter",
    },
    settings.social_instagram && {
      href: settings.social_instagram,
      icon: Instagram,
      label: "Instagram",
    },
  ].filter(Boolean) as { href: string; icon: typeof Facebook; label: string }[];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <div className="lg:col-span-2">
              <Link
                className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
                href="/"
                aria-label={`${settings.site_name} - Accueil`}
              >
                {settings.site_name}
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {settings.description ||
                  settings.tagline ||
                  "Vélos de route, VTT, électriques et de ville, ainsi que toutes les pièces et accessoires pour les entretenir. Une sélection pensée pour durer, livrée rapidement partout en France."}
              </p>

              <div className="space-y-3">
                {settings.contact_address && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{settings.contact_address}</span>
                  </div>
                )}
                {settings.contact_phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{settings.contact_phone}</span>
                  </div>
                )}
                {settings.contact_email && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{settings.contact_email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div
                key={section.title}
                className={`${index >= 2 ? "lg:col-span-1" : ""}`}
              >
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
