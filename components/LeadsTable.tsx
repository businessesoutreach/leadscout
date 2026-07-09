import type { ILead } from "@/models/Lead";
import LeadRowActions from "./LeadRowActions";

type LeadDoc = ILead & { _id: string };

export default function LeadsTable({ leads }: { leads: LeadDoc[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          No leads yet
        </p>
        <p className="mt-1 text-sm text-slate">
          Run a scan above, or loosen your filters, to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-2">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Reputation</th>
              <th className="px-4 py-3 font-medium">Web presence</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className={`border-b border-line last:border-0 ${
                  !lead.hasWebsite ? "bg-signal-dim/40" : ""
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-ink">{lead.name}</p>
                  <p className="mt-0.5 text-xs text-slate-2">
                    {lead.category || lead.niche} · {lead.city}
                  </p>
                  {lead.address && (
                    <p className="mt-0.5 max-w-xs text-xs text-slate-2">
                      {lead.address}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-data text-xs text-slate">
                    {lead.phone || "—"}
                  </p>
                  {lead.googleMapsUrl && (
                    <a
                      href={lead.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-ink-2 underline underline-offset-2"
                    >
                      View on Maps
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-data text-sm text-ink">
                    {lead.rating ? lead.rating.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-slate-2">
                    {lead.reviewCount ?? 0} reviews
                  </p>
                </td>
                <td className="px-4 py-3 align-top">
                  {lead.hasWebsite ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-claimed-dim px-2.5 py-1 text-xs font-medium text-claimed">
                      Has website
                    </span>
                  ) : (
                    <span className="blip inline-flex items-center gap-2 rounded-full bg-signal-dim px-2.5 py-1 text-xs font-semibold text-signal">
                      Unclaimed
                    </span>
                  )}
                  {lead.websiteUrl && (
                    <a
                      href={lead.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate max-w-[160px] text-xs text-ink-2 underline underline-offset-2"
                    >
                      {lead.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <LeadRowActions id={lead._id} status={lead.status} />
                </td>
                <td className="px-4 py-3 align-top" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
