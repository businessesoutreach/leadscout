// Thin wrapper around the Places API (New) — Text Search endpoint.
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

export type RawPlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri?: string;
  location?: { latitude?: number; longitude?: number };
  primaryTypeDisplayName?: { text?: string };
};

type SearchTextResponse = {
  places?: RawPlace[];
  nextPageToken?: string;
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.location",
  "places.primaryTypeDisplayName",
  "nextPageToken",
].join(",");

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

/**
 * Fetches up to `maxPages` pages (20 results each, ~60 max — mirrors the cap
 * the Google Maps UI itself imposes on a single search) for one niche+city
 * query.
 */
export async function searchPlaces(
  query: string,
  apiKey: string,
  maxPages = 3
): Promise<RawPlace[]> {
  const results: RawPlace[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    // The Places API (New) requires textQuery on EVERY request, including
    // paginated ones — sending pageToken alone triggers "Empty text_query".
    const body: Record<string, unknown> = {
      textQuery: query,
      pageSize: 20,
      ...(pageToken ? { pageToken } : {}),
    };

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Places API error (${res.status}): ${errText.slice(0, 300)}`
      );
    }

    const data: SearchTextResponse = await res.json();
    if (data.places?.length) results.push(...data.places);

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;

    // The API requires a short delay before a pageToken becomes valid.
    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}
