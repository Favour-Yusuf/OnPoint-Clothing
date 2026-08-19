/**
 * Lists every image asset in the Cloudinary account via the Admin Search
 * API, printing each one's real `public_id` next to its Media Library
 * `display_name`/`asset_folder`. Cloudinary's Dynamic Folder Mode keeps
 * those as separate fields — the Media Library UI shows display_name and
 * folder prominently, but delivery URLs need the public_id, and the two can
 * differ a lot (e.g. an auto-generated `OJM09891` vs a display name like
 * `Black-Senator-Kaftan-Detail`). Run this before adding a product's images
 * to lib/data/products.ts, rather than reading the public ID off the Media
 * Library grid.
 *
 * Usage: npm run cloudinary:list
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and
 * CLOUDINARY_API_SECRET in .env.local (dashboard → Settings → Access Keys).
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET. Add them to .env.local first."
  );
  process.exit(1);
}

type CloudinaryAsset = {
  public_id: string;
  display_name?: string;
  asset_folder?: string;
  secure_url: string;
};

async function fetchAllAssets(): Promise<CloudinaryAsset[]> {
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const results: CloudinaryAsset[] = [];
  let nextCursor: string | undefined;

  do {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: "resource_type:image",
        max_results: 500,
        next_cursor: nextCursor,
        fields: ["public_id", "asset_folder", "display_name", "secure_url"],
      }),
    });
    if (!res.ok) {
      throw new Error(`Cloudinary API error: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    results.push(...data.resources);
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return results;
}

async function main() {
  const assets = await fetchAllAssets();
  console.log(`Found ${assets.length} image asset(s) in "${cloudName}":\n`);
  for (const asset of assets) {
    console.log(`public_id:    ${asset.public_id}`);
    if (asset.display_name) console.log(`display_name: ${asset.display_name}`);
    if (asset.asset_folder) console.log(`asset_folder: ${asset.asset_folder}`);
    console.log(`secure_url:   ${asset.secure_url}`);
    console.log("");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
