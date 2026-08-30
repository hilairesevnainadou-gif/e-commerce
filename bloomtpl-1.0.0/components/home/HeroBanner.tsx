import { getBanners } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function HeroBanner({
  position = "home_hero",
}: {
  position?: string;
}) {
  const banners = await getBanners(position);
  const banner = banners[0];

  if (!banner) {
    return null;
  }

  const content = (
    <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[360px] rounded-2xl overflow-hidden group">
      <Image
        src={banner.image_url}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {banner.title}
        </h2>
        {banner.subtitle && (
          <p className="text-white/90 text-sm sm:text-base max-w-md">
            {banner.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (banner.link_url) {
    return (
      <Link href={banner.link_url} className="block mb-10 max-w-7xl mx-auto">
        {content}
      </Link>
    );
  }

  return <div className="mb-10 max-w-7xl mx-auto">{content}</div>;
}
