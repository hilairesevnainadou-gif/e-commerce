import CategoryForm from "@/components/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Nouvelle catégorie</h1>
      <CategoryForm />
    </div>
  );
}
