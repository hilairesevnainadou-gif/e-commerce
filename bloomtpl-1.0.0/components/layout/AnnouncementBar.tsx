"use client";

import { useSettings } from "@/context/SettingsContext";

export default function AnnouncementBar() {
  const { announcement_text } = useSettings();

  if (!announcement_text) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-2 text-sm">
        {announcement_text}
      </div>
    </div>
  );
}
