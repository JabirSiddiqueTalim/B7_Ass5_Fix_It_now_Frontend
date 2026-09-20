import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ServiceDetails, TechnicianReview } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import {
  getServiceById,
  ServiceNotFoundError,
} from "../../_actions/getServiceById";
import { getTechnicianById } from "../../_actions/getTechnicianById";
import {
  BoardCta,
  DispatchHeader,
} from "../../_components/service-details/dispatch-header";
import { JobLedger } from "../../_components/service-details/job-ledger";
import { JobTicket } from "../../_components/service-details/job-ticket";
import { BoardError } from "../../_components/service-details/board-error";
import { TechnicianCard } from "../../_components/service-details/technician-card";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

function serialOf(id: string): string {
  return `FIN-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getServiceById(id);
    const service = res?.data as ServiceDetails | undefined;
    if (!service) return { title: "Service \u2014 FixItNow" };
    return {
      title: `${service.title} \u2014 FixItNow`,
      description: `${service.description} Fixed price ${formatBDT(service.price)}, booked in minutes.`,
    };
  } catch {
    return { title: "Service \u2014 FixItNow" };
  }
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const serial = serialOf(id);

  let service: ServiceDetails | null = null;
  let fetchFailed = false;

  try {
    const res = await getServiceById(id);
    service = (res?.data ?? null) as ServiceDetails | null;
  } catch (error) {
    if (error instanceof ServiceNotFoundError) {
      notFound();
    }
    fetchFailed = true;
  }

  if (!service && !fetchFailed) {
    notFound();
  }

  let reviews: TechnicianReview[] = [];
  if (service) {
    try {
      const res = await getTechnicianById(service.technicianId);
      reviews = (res?.data?.reviews ?? []) as TechnicianReview[];
    } catch {
      reviews = [];
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-ticket text-ink">
      <DispatchHeader serial={serial} />
      <main className="flex-1">
        {service ? (
          <>
            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
              <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                <JobTicket service={service} serial={serial} />
                <TechnicianCard technician={service.technician} />
              </div>
            </section>
            <JobLedger
              reviews={reviews}
              dispatched={service._count?.bookings ?? 0}
            />
            <BoardCta />
          </>
        ) : (
          <BoardError />
        )}
      </main>
    </div>
  );
}
