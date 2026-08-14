import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="bg-background pt-16 lg:pt-20">
      <CheckoutView />
    </div>
  );
}
