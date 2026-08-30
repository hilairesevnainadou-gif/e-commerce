"use client";

import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const { sale_ends_at } = useSettings();
  const target = sale_ends_at ? new Date(sale_ends_at).getTime() : null;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    target ? getTimeLeft(target) : null
  );

  useEffect(() => {
    if (!target) return;

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  if (!target || !timeLeft) {
    return null;
  }

  const units: { value: number; label: string }[] = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "Heures" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Secondes" },
  ];

  return (
    <div className="flex items-start justify-center gap-8 sm:gap-12 py-8 max-w-7xl mx-auto">
      {units.map(({ value, label }) => (
        <div key={label} className="text-center">
          <span
            className="text-4xl sm:text-5xl font-bold text-foreground tabular-nums"
            suppressHydrationWarning
          >
            {String(value).padStart(2, "0")}
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 uppercase tracking-wide">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
