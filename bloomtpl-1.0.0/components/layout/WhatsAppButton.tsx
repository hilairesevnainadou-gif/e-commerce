"use client";

import { useSettings } from "@/context/SettingsContext";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const { whatsapp_number } = useSettings();
  const pathname = usePathname();

  if (!whatsapp_number || pathname?.startsWith("/checkout")) {
    return null;
  }

  const cleanNumber = whatsapp_number.replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.72 14.06c-.24.68-1.18 1.24-1.94 1.4-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.24-5.05-4.44-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.14.07.15.12.31.02.51-.1.2-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.41-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.23.57.35.08.13.08.72-.16 1.4z" />
      </svg>
    </a>
  );
}
