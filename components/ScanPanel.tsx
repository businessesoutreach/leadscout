"use client";

import { useActionState } from "react";
import { runScan, type ScanResult } from "@/app/actions";

const initialState: ScanResult = { ok: true, message: "" };

export default function ScanPanel() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ScanResult, formData: FormData) => runScan(formData),
    initialState
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink text-white">
      <div className="map-grid absolute inset-0" aria-hidden />
      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-signal">
          New scan
        </p>
        <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
          Search a niche and a city
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-white/60">
          Pulls live results from Google Maps and flags every business with
          no website, or none listed, so you know who to pitch first.
        </p>

        <form
          action={formAction}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="niche"
              className="mb-1.5 block text-xs font-medium text-white/60"
            >
              Niche
            </label>
            <input
              id="niche"
              name="niche"
              placeholder="e.g. gym, dentist, salon"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-signal"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="city"
              className="mb-1.5 block text-xs font-medium text-white/60"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              placeholder="e.g. Multan"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-signal"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Scanning…" : "Scan area"}
          </button>
        </form>

        {state.message && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              state.ok
                ? "border-signal/30 bg-white/5 text-white/80"
                : "border-danger/40 bg-danger/10 text-white"
            }`}
          >
            {state.ok && typeof state.found === "number" ? (
              <span>
                Found{" "}
                <span className="font-data font-semibold text-white">
                  {state.found}
                </span>{" "}
                listings, saved{" "}
                <span className="font-data font-semibold text-white">
                  {state.saved}
                </span>
                . <span className="text-signal font-medium">
                  {state.withoutWebsite} have no website.
                </span>
              </span>
            ) : (
              state.message
            )}
          </div>
        )}
      </div>
    </div>
  );
}
