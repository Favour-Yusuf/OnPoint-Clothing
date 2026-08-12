/**
 * Core domain types for the OnPoint Clothing storefront.
 *
 * There is no backend yet — these types are shared between the mock data
 * layer (lib/data/*) and the UI, so a future database/API can be dropped in
 * behind lib/products.ts without changing components.
 */

export type CloudinaryImage = {
  /**
   * Production value is a Cloudinary delivery URL. Until real photography is
   * supplied, this holds a "placeholder:<key>" marker that MediaImage
   * (components/ui/media-image.tsx) renders as an art-directed placeholder
   * instead of a broken <img>.
   */
  url: string;
  alt: string;
};

export type ProductColor = {
  name: string;
  /** Swatch hex, for the color selector UI. */
  hex: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  inStock: boolean;
};

export type ProductAvailability = "in-stock" | "low-stock" | "made-to-order" | "sold-out";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Price in the smallest sensible display unit for the currency (major units, e.g. dollars). */
  price: number;
  compareAtPrice?: number;
  currency: "USD";
  categorySlug: string;
  collectionSlugs: string[];
  images: CloudinaryImage[];
  shortDescription: string;
  description: string;
  details: string[];
  care: string[];
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  availability: ProductAvailability;
  isNew?: boolean;
  isBespokeEligible?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: CloudinaryImage;
};

export type Collection = {
  slug: string;
  name: string;
  season: string;
  description: string;
  image: CloudinaryImage;
  productSlugs: string[];
};

export type CartItem = {
  /** Composite key: `${productId}:${variantId}`, used for line-item identity. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: CloudinaryImage;
  size: string;
  color: string;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type Customer = {
  id: string;
  email: string;
  fullName: string;
};

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  email: string;
  createdAt: string;
};

export type BespokeRequest = {
  name: string;
  email: string;
  phone?: string;
  garmentType: string;
  notes: string;
};
