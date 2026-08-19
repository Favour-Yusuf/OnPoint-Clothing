import type { BespokeStatus, OrderStatus, PaymentStatus } from "@/lib/types";

type Tone = "neutral" | "positive" | "attention" | "muted";

const TONE_CLASSES: Record<Tone, { text: string; dot: string }> = {
  neutral: { text: "text-foreground/70", dot: "bg-foreground/40" },
  positive: { text: "text-[#93b184]", dot: "bg-[#93b184]" },
  attention: { text: "text-burgundy-light", dot: "bg-burgundy-light" },
  muted: { text: "text-foreground/35", dot: "bg-foreground/25" },
};

function Badge({ label, tone }: { label: string; tone: Tone }) {
  const classes = TONE_CLASSES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 font-sans text-xs font-light tracking-wide ${classes.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${classes.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  pending: "neutral",
  processing: "neutral",
  ready_for_delivery: "neutral",
  shipped: "neutral",
  delivered: "positive",
  cancelled: "muted",
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  ready_for_delivery: "Ready for Delivery",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge label={ORDER_STATUS_LABEL[status]} tone={ORDER_STATUS_TONE[status]} />;
}

const PAYMENT_STATUS_TONE: Record<PaymentStatus, Tone> = {
  pending: "neutral",
  paid: "positive",
  failed: "attention",
  refunded: "muted",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge label={PAYMENT_STATUS_LABEL[status]} tone={PAYMENT_STATUS_TONE[status]} />;
}

const BESPOKE_STATUS_TONE: Record<BespokeStatus, Tone> = {
  new: "attention",
  contacted: "neutral",
  consultation: "neutral",
  in_progress: "neutral",
  completed: "positive",
  cancelled: "muted",
};

const BESPOKE_STATUS_LABEL: Record<BespokeStatus, string> = {
  new: "New",
  contacted: "Contacted",
  consultation: "Consultation",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BespokeStatusBadge({ status }: { status: BespokeStatus }) {
  return <Badge label={BESPOKE_STATUS_LABEL[status]} tone={BESPOKE_STATUS_TONE[status]} />;
}

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];
export const PAYMENT_STATUS_OPTIONS = Object.keys(PAYMENT_STATUS_LABEL) as PaymentStatus[];
export const BESPOKE_STATUS_OPTIONS = Object.keys(BESPOKE_STATUS_LABEL) as BespokeStatus[];
export { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, BESPOKE_STATUS_LABEL };
