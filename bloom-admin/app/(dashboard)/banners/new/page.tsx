import BannerForm from "@/components/banners/BannerForm";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Nouvelle bannière</h1>
      <BannerForm />
    </div>
  );
}
