"use client";

import { useTransition } from "react";
import { updateLeadStatus, deleteLead } from "@/app/actions";
import type { ILead } from "@/models/Lead";

export default function LeadRowActions({
  id,
  status,
}: {
  id: string;
  status: ILead["status"];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() =>
            updateLeadStatus(id, e.target.value as ILead["status"])
          )
        }
        className="rounded-md border border-line bg-paper px-2 py-1 text-xs outline-none focus:border-ink-2"
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="responded">Responded</option>
        <option value="won">Won</option>
        <option value="dead">Dead</option>
      </select>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Remove this lead?")) {
            startTransition(() => deleteLead(id));
          }
        }}
        className="text-xs text-slate-2 transition hover:text-danger"
        title="Delete lead"
      >
        Remove
      </button>
    </div>
  );
}
