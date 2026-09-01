/**
 * Groups the catalog's ~23 distinct ProductColor names into a small set of
 * visually distinct "families" for the shop filter bar. A product page's own
 * color swatches still show the exact shade name/hex from lib/data/products.ts
 * (e.g. "Wine", "Ash") — this grouping only applies to the cross-product
 * filter list, where showing 23 near-identical dots (several different reds,
 * several different greys) reads as broken rather than as a real choice.
 *
 * "Custom" is deliberately its own family, not merged into whichever hue its
 * underlying hex happens to be — it means "made to your color," not a fixed
 * shade, so folding it into e.g. "Black" would misrepresent it.
 */

const FAMILY_BY_NAME: Record<string, string> = {
  Black: "Black",
  White: "White",
  "Off White": "White",
  Cream: "White",
  Grey: "Grey",
  Ash: "Grey",
  Red: "Red",
  Burgundy: "Red",
  Wine: "Red",
  Green: "Green",
  "Emerald Green": "Green",
  "Military Green": "Green",
  Navy: "Blue",
  "Navy Blue": "Blue",
  "Sky Blue": "Blue",
  Yellow: "Yellow",
  Gold: "Yellow",
  Brown: "Brown",
  "Coffee Brown": "Brown",
  "Burnt Orange": "Orange",
  Pink: "Pink",
  Purple: "Purple",
  Custom: "Custom",
};

const FAMILY_HEX: Record<string, string> = {
  Black: "#0a0a0a",
  White: "#fbfaf8",
  Grey: "#84807a",
  Red: "#b3202f",
  Green: "#1f4d36",
  Blue: "#1c2333",
  Yellow: "#d4a017",
  Brown: "#5c4033",
  Orange: "#cc5500",
  Pink: "#e8a0bf",
  Purple: "#6a3ea1",
  Custom: "#a49a89",
};

const DEFAULT_FAMILY_HEX = "#8a8478";

/** Which filter-swatch family a specific product color name belongs to. Unknown names fall back to their own name as a single-member family. */
export function getColorFamily(name: string): string {
  return FAMILY_BY_NAME[name] ?? name;
}

/** Representative swatch hex for a family (or a raw color name that isn't in any family). */
export function getFamilyHex(family: string): string {
  return FAMILY_HEX[family] ?? DEFAULT_FAMILY_HEX;
}
