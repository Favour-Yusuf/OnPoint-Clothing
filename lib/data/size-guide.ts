/**
 * Size guide content. The guide shown on a product page is chosen from that
 * product's own size labels (see getSizeGuideKind), so ready-to-wear, caps,
 * made-to-measure and one-size pieces each get the right explanation without
 * any change to the product data.
 *
 * NOTE: the measurements below are standard body-measurement ranges used as a
 * starting point. Replace them with OnPoint's own figures if they differ.
 */

export type SizeGuideKind = "garment" | "cap" | "custom" | "one-size";

/** A [min, max] range in inches. Centimetres are derived (see toCm). */
type Range = readonly [number, number];

export type GarmentSizeRow = { size: string; chest: Range; waist: Range; hip: Range };
export type CapSizeRow = { size: string; head: number };

export const GARMENT_SIZES: GarmentSizeRow[] = [
  { size: "S", chest: [36, 38], waist: [30, 32], hip: [36, 38] },
  { size: "M", chest: [38, 40], waist: [32, 34], hip: [38, 40] },
  { size: "L", chest: [40, 42], waist: [34, 36], hip: [40, 42] },
  { size: "XL", chest: [42, 44], waist: [36, 38], hip: [42, 44] },
  { size: "2XL", chest: [44, 46], waist: [38, 40], hip: [44, 46] },
  { size: "3XL", chest: [46, 48], waist: [40, 42], hip: [46, 48] },
  { size: "4XL", chest: [48, 50], waist: [42, 44], hip: [48, 50] },
];

/** Cap sizes are head circumference in inches. */
export const CAP_SIZES: CapSizeRow[] = [20, 21, 22, 23, 24, 25, 25.5].map((head) => ({ size: String(head), head }));

export const GARMENT_MEASURE_TIPS = [
  { label: "Chest", text: "Around the fullest part of your chest, arms relaxed at your sides." },
  { label: "Waist", text: "Around your natural waistline, the narrowest part of your torso." },
  { label: "Hip", text: "Around the fullest part of your hips." },
];

export const CAP_MEASURE_TIP =
  "Wrap a soft tape measure around your head, just above your eyebrows and ears. Read the number in inches and choose the matching size.";

export function toCm(inches: number): number {
  return Math.round(inches * 2.54);
}

export function formatInches([min, max]: Range): string {
  return `${min} to ${max}`;
}

export function formatCm([min, max]: Range): string {
  return `${toCm(min)} to ${toCm(max)}`;
}

export function getSizeGuideKind(sizes: string[]): SizeGuideKind | null {
  if (sizes.length === 0) return null;
  const labels = sizes.map((size) => size.trim().toLowerCase());
  if (labels.every((label) => label === "custom")) return "custom";
  if (labels.every((label) => label === "one size")) return "one-size";
  if (labels.every((label) => /^\d+(\.\d+)?$/.test(label))) return "cap";
  return "garment";
}
