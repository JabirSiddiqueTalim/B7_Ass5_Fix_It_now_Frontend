import type { Metadata } from "next";
import type { Category, ServiceListItem } from "@/lib/types";
import { getAllServices } from "../_actions/getAllServices";
import { getAllCategory } from "../_actions/getAllCategory";
import { ServicesBoard } from "../_components/services/board";

export const metadata: Metadata = {
  title: "Services \u2014 FixItNow",
  description:
    "Browse every service FixItNow technicians take on across Dhaka. Fixed prices in taka, booked in minutes.",
};

type ServicesSearchParams = Promise<{
  search?: string | string[];
  category?: string | string[];
  page?: string | string[];
}>;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: ServicesSearchParams;
}) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const category =
    typeof params.category === "string" ? params.category : "";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [servicesRes, categoriesRes] = await Promise.all([
    getAllServices({ search, category, page: currentPage }),
    getAllCategory(),
  ]);

  const services = (servicesRes.data?.data ?? []) as ServiceListItem[];
  const categories = (categoriesRes.data?.data ?? []) as Category[];
  const meta = servicesRes.data?.meta;

  return (
    <ServicesBoard
      services={services}
      total={meta?.total ?? services.length}
      totalPages={meta?.totalPages ?? 1}
      currentPage={currentPage}
      search={search}
      category={category}
      categories={categories}
    />
  );
}
