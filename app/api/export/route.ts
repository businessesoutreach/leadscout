import { NextRequest } from "next/server";
import { exportLeadsCsv } from "@/app/actions";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const csv = await exportLeadsCsv({
    niche: params.get("niche") || undefined,
    city: params.get("city") || undefined,
    noWebsiteOnly: params.get("noWebsiteOnly") === "1",
    minRating: params.get("minRating")
      ? Number(params.get("minRating"))
      : undefined,
    minReviews: params.get("minReviews")
      ? Number(params.get("minReviews"))
      : undefined,
    status: params.get("status") || undefined,
    q: params.get("q") || undefined,
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leadscout-export.csv"`,
    },
  });
}
