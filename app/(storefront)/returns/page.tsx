import type { Metadata } from "next";
import Link from "next/link";
import { PolicyLayout, PolicySection } from "@/components/legal/policy-layout";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "OnPoint Clothing's returns and refunds policy for ready-to-wear and bespoke orders.",
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Returns & Refunds" updated="31 August 2026">
      <p className="text-sm leading-relaxed text-foreground/65">
        We want you to be happy with what you buy from OnPoint. This policy explains when you can return something,
        how to do it, and how refunds work.
      </p>
      <p className="text-sm leading-relaxed text-foreground/65">
        Nothing here limits your rights under the Federal Competition and Consumer Protection Act 2018. If an item
        is faulty, not as described, or not fit for purpose, those rights apply regardless of what this policy
        says.
      </p>

      <PolicySection title="Ready to Wear">
        <p>Ready to wear pieces can be returned within 30 days of delivery, provided the item is:</p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; Unworn and unwashed</li>
          <li>&bull; Free of stains, marks, perfume, and odour</li>
          <li>&bull; Returned with the original tags still attached</li>
          <li>&bull; In its original packaging where possible</li>
        </ul>
        <p>Items returned outside the 30 day window, or that show signs of wear, cannot be accepted.</p>
        <p>
          For hygiene reasons we cannot accept returns on underwear, swimwear, or pierced jewellery once the hygiene
          seal is broken or the tags are removed. This does not apply if the item is faulty.
        </p>
      </PolicySection>

      <PolicySection title="Sale and Discounted Items">
        <p>
          Items bought in a sale or with a discount code follow the same 30 day return window. Refunds are issued
          at the price you actually paid, not the original price.
        </p>
      </PolicySection>

      <PolicySection title="Bespoke and Made to Order Pieces">
        <p>
          Bespoke pieces are cut and finished specifically for you, so we cannot resell them. They are not eligible
          for return or exchange because of size, fit, or a change of mind.
        </p>
        <p>
          You can cancel a bespoke order free of charge at any point before we begin cutting. Contact us as soon as
          possible if you need to.
        </p>
        <p>
          We will repair, remake, or refund a bespoke piece where it arrives damaged or defective, or where it
          differs materially from the specification agreed at the time of order. Where the fault is with our
          workmanship or our measurement of you, we cover the cost of putting it right. Where the piece was made
          correctly to measurements you supplied, we can usually still alter it, but an alteration charge may apply.
          We will quote before doing any work.
        </p>
      </PolicySection>

      <PolicySection title="How to Start a Return">
        <p>
          Email{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
          </a>{" "}
          or message us on WhatsApp at{" "}
          <a href={CONTACT.whatsapp.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.whatsapp.display}
          </a>{" "}
          with your order number and the reason for the return.
        </p>
        <p>
          We will confirm whether the item is eligible and send you the return address. Please do not send anything
          back before we confirm, as we cannot process unannounced returns.
        </p>
        <p>
          Pack the item securely, include your order number in the parcel, and use a courier that gives you a
          tracking number. Keep proof of postage. Until the parcel reaches us, responsibility for it sits with you
          and the courier, so tracked shipping protects you.
        </p>
      </PolicySection>

      <PolicySection title="Return Shipping Costs">
        <ul className="flex flex-col gap-1.5">
          <li>&bull; Change of mind or wrong size — you cover the return shipping.</li>
          <li>
            &bull; Damaged, defective, incorrect, or not as described — we cover it, and we will either arrange
            collection or reimburse a reasonable return shipping cost against a receipt.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Refunds">
        <p>Once we receive and inspect the returned item, we will email you to confirm the outcome.</p>
        <p>
          Approved refunds go back to the original payment method within 7 to 10 business days of approval. If you
          paid by bank transfer, we will ask for the account details to refund into. Depending on your bank, the
          money may take a few extra days to appear.
        </p>
        <p>
          The original delivery fee is not refunded, unless the return is because of our error or a fault with the
          item, in which case we refund it in full.
        </p>
      </PolicySection>

      <PolicySection title="Returns That Fail Inspection">
        <p>
          If an item arrives back to us worn, washed, damaged after delivery, missing tags, or outside the 30 day
          window, we cannot refund it. We will contact you and send it back at your cost. If we do not hear from
          you within 30 days of that message, we may dispose of the item.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or Incorrect Items">
        <p>
          If your order arrives damaged, defective, or different from what you ordered, contact us within 7 days of
          delivery with photographs of the item and the packaging.
        </p>
        <p>
          We will arrange a replacement, a repair, or a full refund including all shipping costs, at no charge to
          you. You choose which of these you would prefer, and we will do it where it is reasonably possible.
        </p>
        <p>
          Faults that appear later through normal use are still covered by your statutory rights. Contact us and we
          will assess the item. This does not cover normal wear and tear, damage from misuse, or damage from
          washing against the care label.
        </p>
      </PolicySection>

      <PolicySection title="Orders That Never Arrive">
        <p>
          If tracking shows your order as delivered but you have not received it, contact us within 7 days and we
          will open a claim with the courier. If an order has not arrived and tracking has not updated for 10
          business days, contact us and we will investigate and either resend or refund.
        </p>
      </PolicySection>

      <PolicySection title="Exchanges">
        <p>
          We do not offer direct exchanges. If you want a different size or colour, return the eligible item for a
          refund and place a new order on{" "}
          <Link href="/shop" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            the shop
          </Link>
          . This gets you the new piece faster than waiting for an exchange to process.
        </p>
      </PolicySection>

      <PolicySection title="Questions">
        <p>
          Email:{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
          </a>
        </p>
        <p>
          WhatsApp:{" "}
          <a href={CONTACT.whatsapp.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.whatsapp.display}
          </a>
        </p>
        <p>
          Phone:{" "}
          <a href={CONTACT.phone.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.phone.display}
          </a>
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
