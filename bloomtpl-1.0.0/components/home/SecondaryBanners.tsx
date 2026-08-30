import { getBanners } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function SecondaryBanners() {
  const banners = await getBanners("home_secondary");

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl mx-auto mb-12">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative h-64 sm:h-72 rounded-xl overflow-hidden group"
        >
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug max-w-[16rem]">
              {banner.title}
            </h3>
            {banner.subtitle && (
              <p className="text-white/85 text-sm mt-2 max-w-[16rem]">
                {banner.subtitle}
              </p>
            )}
            {banner.link_url && (
              <Link
                href={banner.link_url}
                className="mt-4 inline-flex items-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Découvrir
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
