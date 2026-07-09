import { Suspense } from "react";
import { getLeads } from "@/app/actions";
import ScanPanel from "@/components/ScanPanel";
import StatCards from "@/components/StatCards";
import FilterBar from "@/components/FilterBar";
import LeadsTable from "@/components/LeadsTable";

type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

async function Results({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { leads, niches, cities, stats } = await getLeads({
    niche: first(searchParams.niche),
    city: first(searchParams.city),
    noWebsiteOnly: first(searchParams.noWebsiteOnly) === "1",
    minRating: first(searchParams.minRating)
      ? Number(first(searchParams.minRating))
      : undefined,
    minReviews: first(searchParams.minReviews)
      ? Number(first(searchParams.minReviews))
      : undefined,
    status: first(searchParams.status),
    q: first(searchParams.q),
  });

  return (
    <>
      <StatCards total={stats.total} withoutWebsite={stats.withoutWebsite} />
      <FilterBar niches={niches} cities={cities} />
      <LeadsTable leads={leads} />
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-7">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-slate-2">
          Lead scanner
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink sm:text-4xl">
          LeadScout
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-slate">
          Find local businesses on Google Maps with no website, or an
          outdated one, so you always know who to pitch next.
        </p>
      </header>

      <div className="mb-6">
        <ScanPanel />
      </div>

      <div className="flex flex-col gap-4">
        <Suspense
          fallback={
            <div className="rounded-xl border border-line bg-card px-6 py-16 text-center text-sm text-slate-2">
              Loading leads…
            </div>
          }
        >
          <Results searchParams={resolvedParams} />
        </Suspense>
      </div>
    </main>
  );
}
