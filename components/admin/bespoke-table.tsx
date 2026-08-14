import Link from "next/link";
import { BespokeStatusBadge } from "@/components/admin/status-badge";
import type { BespokeRequestAdmin } from "@/lib/types";

export function BespokeTable({ requests }: { requests: BespokeRequestAdmin[] }) {
  if (requests.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-foreground/50">No bespoke requests found.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <table className="hidden w-full min-w-[720px] border-collapse font-sans text-sm sm:table">
        <thead>
          <tr className="border-b border-foreground/10 text-left text-xs tracking-[0.15em] text-foreground/45 uppercase">
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Garment</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-foreground/5 hover:bg-foreground/[0.03]">
              <td className="py-3 pr-4">
                <Link
                  href={`/admin/bespoke/${request.id}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {request.name}
                </Link>
                <p className="text-xs text-foreground/45">{request.email}</p>
              </td>
              <td className="py-3 pr-4 text-foreground/70">{request.garmentType}</td>
              <td className="py-3 pr-4 text-foreground/50">{new Date(request.createdAt).toLocaleDateString()}</td>
              <td className="py-3 pr-4">
                <BespokeStatusBadge status={request.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10 sm:hidden">
        {requests.map((request) => (
          <Link
            key={request.id}
            href={`/admin/bespoke/${request.id}`}
            className="flex flex-col gap-2 py-4 font-sans text-sm active:bg-foreground/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground">{request.name}</span>
              <span className="text-xs text-foreground/45">{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-foreground/60">{request.garmentType}</p>
            <BespokeStatusBadge status={request.status} />
          </Link>
        ))}
      </div>
    </>
  );
}
