"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongodb";
import Lead, { ILead } from "@/models/Lead";
import { searchPlaces } from "@/lib/googlePlaces";

export type ScanResult = {
  ok: boolean;
  message: string;
  found?: number;
  saved?: number;
  withoutWebsite?: number;
};

export async function runScan(formData: FormData): Promise<ScanResult> {
  const niche = String(formData.get("niche") || "").trim();
  const city = String(formData.get("city") || "").trim();

  if (!niche || !city) {
    return { ok: false, message: "Enter both a niche and a city." };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message: "GOOGLE_PLACES_API_KEY is not set on the server.",
    };
  }

  try {
    await dbConnect();

    const query = `${niche} in ${city}`;
    const places = await searchPlaces(query, apiKey);

    let saved = 0;
    let withoutWebsite = 0;

    for (const place of places) {
      if (!place.id) continue;

      const hasWebsite = Boolean(place.websiteUri);
      if (!hasWebsite) withoutWebsite++;

      await Lead.findOneAndUpdate(
        { placeId: place.id },
        {
          placeId: place.id,
          name: place.displayName?.text || "Unnamed business",
          niche,
          city,
          category: place.primaryTypeDisplayName?.text,
          address: place.formattedAddress,
          phone:
            place.nationalPhoneNumber || place.internationalPhoneNumber,
          rating: place.rating,
          reviewCount: place.userRatingCount,
          websiteUrl: place.websiteUri,
          hasWebsite,
          lat: place.location?.latitude,
          lng: place.location?.longitude,
          googleMapsUrl: place.googleMapsUri,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      saved++;
    }

    revalidatePath("/");

    return {
      ok: true,
      message: `Scanned "${query}".`,
      found: places.length,
      saved,
      withoutWebsite,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Scan failed.",
    };
  }
}

export type LeadFilters = {
  niche?: string;
  city?: string;
  noWebsiteOnly?: boolean;
  minRating?: number;
  minReviews?: number;
  status?: string;
  q?: string;
};

export async function getLeads(filters: LeadFilters = {}) {
  await dbConnect();

  const query: Record<string, unknown> = {};

  if (filters.niche) query.niche = filters.niche;
  if (filters.city) query.city = filters.city;
  if (filters.noWebsiteOnly) query.hasWebsite = false;
  if (filters.status) query.status = filters.status;
  if (filters.minRating) query.rating = { $gte: filters.minRating };
  if (filters.minReviews) {
    query.reviewCount = { $gte: filters.minReviews };
  }
  if (filters.q) {
    query.name = { $regex: filters.q, $options: "i" };
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

  // Distinct niches/cities for the filter dropdowns.
  const [niches, cities] = await Promise.all([
    Lead.distinct("niche"),
    Lead.distinct("city"),
  ]);

  const stats = {
    total: leads.length,
    withoutWebsite: leads.filter((l) => !l.hasWebsite).length,
  };

  return {
    leads: JSON.parse(JSON.stringify(leads)) as (ILead & { _id: string })[],
    niches: niches as string[],
    cities: cities as string[],
    stats,
  };
}

export async function updateLeadStatus(
  id: string,
  status: ILead["status"]
) {
  await dbConnect();
  await Lead.findByIdAndUpdate(id, { status });
  revalidatePath("/");
}

export async function deleteLead(id: string) {
  await dbConnect();
  await Lead.findByIdAndDelete(id);
  revalidatePath("/");
}

export async function exportLeadsCsv(filters: LeadFilters = {}) {
  const { leads } = await getLeads(filters);

  const header = [
    "Name",
    "Niche",
    "City",
    "Category",
    "Address",
    "Phone",
    "Rating",
    "Reviews",
    "Website",
    "Status",
    "Google Maps",
  ];

  const rows = leads.map((l) => [
    l.name,
    l.niche,
    l.city,
    l.category || "",
    l.address || "",
    l.phone || "",
    l.rating ?? "",
    l.reviewCount ?? "",
    l.websiteUrl || "NONE",
    l.status,
    l.googleMapsUrl || "",
  ]);

  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  return csv;
}
