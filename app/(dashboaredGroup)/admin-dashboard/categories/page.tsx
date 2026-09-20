import { getAdminCategories } from "../../_actions/getAdminCategories";
import { AdminCategoriesBoard } from "../../_components/admin-categories-board";
import { RecordError } from "../../_components/Userprofile/record-error";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories().catch(() => null);

  if (!categories) {
    return <RecordError retryHref="/admin-dashboard/categories" />;
  }

  return <AdminCategoriesBoard categories={categories} />;
}
