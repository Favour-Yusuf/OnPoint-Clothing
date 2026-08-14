import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBespokeRequestByIdForAdmin } from "@/lib/bespoke";
import { BespokeStatusControl } from "@/components/admin/bespoke-status-control";
import { BespokeStatusBadge } from "@/components/admin/status-badge";

export const metadata: Metadata = {
  title: "Bespoke Request Detail",
};

export default async function AdminBespokeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getBespokeRequestByIdForAdmin(id);
  if (!request) notFound();

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/bespoke" className="font-sans text-xs text-foreground/50 hover:text-foreground">
        &larr; All Bespoke Requests
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">{request.name}</h1>
          <div className="mt-2">
            <BespokeStatusBadge status={request.status} />
          </div>
          <p className="mt-2 font-sans text-sm text-foreground/45">
            {new Date(request.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <BespokeStatusControl requestId={request.id} currentStatus={request.status} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-[1fr_280px]">
        <section>
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
            Request Details
          </h2>
          <div className="mt-4 flex flex-col gap-4 font-sans text-sm">
            <div>
              <p className="text-foreground/45">Garment Type</p>
              <p className="mt-1 text-foreground">{request.garmentType}</p>
            </div>
            <div>
              <p className="text-foreground/45">Notes</p>
              <p className="mt-1 leading-relaxed whitespace-pre-wrap text-foreground/80">{request.notes}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">Contact</h2>
          <div className="mt-4 font-sans text-sm text-foreground/70 select-all">
            <p>{request.email}</p>
            {request.phone ? <p>{request.phone}</p> : null}
          </div>
          <p className="mt-3 font-sans text-xs text-foreground/45">
            {request.customerId ? "Registered customer" : "Guest enquiry"}
          </p>
          {request.customerId ? (
            <Link
              href={`/admin/customers/${request.customerId}`}
              className="mt-1 inline-block font-sans text-xs text-foreground/70 underline-offset-4 hover:underline"
            >
              View customer
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}
