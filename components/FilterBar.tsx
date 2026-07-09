"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
  niches: string[];
  cities: string[];
};

export default function FilterBar({ niches, cities }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const noWebsiteOnly = searchParams.get("noWebsiteOnly") === "1";

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3">
      <input
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        placeholder="Search business name…"
        className="min-w-[180px] flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      />

      <select
        defaultValue={searchParams.get("niche") ?? ""}
        onChange={(e) => setParam("niche", e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      >
        <option value="">All niches</option>
        {niches.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("city") ?? ""}
        onChange={(e) => setParam("city", e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      >
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("minRating") ?? ""}
        onChange={(e) => setParam("minRating", e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      >
        <option value="">Any rating</option>
        <option value="3">3.0+</option>
        <option value="3.5">3.5+</option>
        <option value="4">4.0+</option>
        <option value="4.5">4.5+</option>
      </select>

      <select
        defaultValue={searchParams.get("minReviews") ?? ""}
        onChange={(e) => setParam("minReviews", e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      >
        <option value="">Any review count</option>
        <option value="10">10+ reviews</option>
        <option value="20">20+ reviews</option>
        <option value="50">50+ reviews</option>
        <option value="100">100+ reviews</option>
      </select>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink-2"
      >
        <option value="">Any status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="responded">Responded</option>
        <option value="won">Won</option>
        <option value="dead">Dead</option>
      </select>

      <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-slate">
        <span>No website only</span>
        <button
          type="button"
          role="switch"
          aria-checked={noWebsiteOnly}
          onClick={() => setParam("noWebsiteOnly", noWebsiteOnly ? "" : "1")}
          className={`relative h-5 w-9 rounded-full transition ${
            noWebsiteOnly ? "bg-signal" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
              noWebsiteOnly ? "left-4" : "left-0.5"
            }`}
          />
        </button>
      </label>

      <a
        href={`/api/export?${searchParams.toString()}`}
        className="rounded-lg border border-ink-2 px-3.5 py-2 text-sm font-medium text-ink-2 transition hover:bg-ink-2 hover:text-white"
      >
        Export CSV
      </a>
    </div>
  );
}
