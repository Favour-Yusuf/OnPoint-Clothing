/**
 * Core domain types for the OnPoint Clothing storefront.
 *
 * There is no backend yet — these types are shared between the mock data
 * layer (lib/data/*) and the UI, so a future database/API can be dropped in
 * behind lib/products.ts without changing components.
 */

export type CloudinaryImage = {
  /**
   * A Cloudinary public ID (e.g. "onpoint/products/suits/classic-black-suit/front"),
   * resolved to a delivery URL by lib/cloudinary/image.ts. Until real
   * photography is supplied, this holds a "placeholder:<key>" marker that
   * MediaImage (components/ui/media-image.tsx) renders as an art-directed
   * placeholder instead of a broken <img>.
   */
  publicId: string;
  alt: string;
};

export type CloudinaryVideo = {
  /** A Cloudinary public ID, resolved to a delivery URL by lib/cloudinary/video.ts. No placeholder handling — videos are only ever added once real footage exists. */
  publicId: string;
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
  currency: "NGN";
  categorySlug: string;
  collectionSlugs: string[];
  /** Photography backdrop color (e.g. "red", "grey") — not a garment color. Used to group the shop grid by matching backdrops. */
  backdropColor?: string;
  images: CloudinaryImage[];
  /** Gallery videos, shown before `images` on the product page. Absent/empty for most products. */
  videos?: CloudinaryVideo[];
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

export type Address = {
  id: string;
  label?: string | null;
  fullName: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault?: boolean;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "ready_for_delivery"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderItem = {
  id: string;
  productName: string;
  productSlug?: string | null;
  imagePublicId?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  paystackReference?: string | null;
  items: OrderItem[];
  createdAt: string;
};

export type BespokeStatus = "new" | "contacted" | "consultation" | "in_progress" | "completed" | "cancelled";

export type BespokeRequest = {
  name: string;
  email: string;
  phone?: string;
  garmentType: string;
  notes: string;
};

export type BespokeRequestAdmin = BespokeRequest & {
  id: string;
  customerId: string | null;
  status: BespokeStatus;
  createdAt: string;
};

export type AdminCustomerSummary = {
  key: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  type: "registered" | "guest";
};

export type AdminPayment = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  provider: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type DateRangeKey = "today" | "7d" | "30d" | "90d" | "12mo";
