import type { Metadata } from "next";
import Link from "next/link";
import { PolicyLayout, PolicySection } from "@/components/legal/policy-layout";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the OnPoint Clothing website and orders placed through it.",
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" updated="31 August 2026">
      <PolicySection title="About These Terms">
        <p>
          These Terms of Service govern your use of justonpointng.com and any order you place with OnPoint Clothing
          Nig (&ldquo;OnPoint,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By browsing the site or placing an order,
          you agree to these terms. If you do not agree, please do not use the site.
        </p>
        <p>
          Nothing in these terms removes or limits any right you have under the Federal Competition and Consumer
          Protection Act 2018 or any other Nigerian law that cannot be excluded by agreement. Where a clause here
          conflicts with those rights, your statutory rights apply.
        </p>
      </PolicySection>

      <PolicySection title="Who Can Use This Site">
        <p>
          You must be at least 18 years old, or have the consent of a parent or guardian, to place an order. By
          ordering, you confirm you are legally able to enter a contract and that the information you give us is
          accurate.
        </p>
      </PolicySection>

      <PolicySection title="Products and Pricing">
        <p>
          Prices are listed in Nigerian naira and include applicable taxes unless stated otherwise at checkout. We
          may change prices at any time, but a price change never applies to an order we have already accepted.
        </p>
        <p>
          We make reasonable efforts to display accurate pricing, availability, and product details, but errors
          happen. If we find a pricing or listing error after you place an order, we will contact you before
          charging or shipping. You may then confirm the order at the corrected price or cancel it for a full
          refund.
        </p>
        <p>
          Product photography is intended to represent items as accurately as possible. Colour and texture can
          appear differently across screens, and handmade or bespoke pieces will carry small natural variations.
          These are not defects.
        </p>
      </PolicySection>

      <PolicySection title="Orders and Payment">
        <p>
          Placing an order is an offer to purchase. A contract is formed only when we confirm acceptance of your
          order, not when payment is taken.
        </p>
        <p>
          We accept payment through Paystack, and by direct bank transfer where that option is shown at checkout.
          Payment card details are handled by Paystack, not by us.
        </p>
        <p>
          We may refuse or cancel an order where an item is out of stock, where there is a pricing or listing error,
          where we suspect fraud or unauthorised use of a payment method, or where we cannot deliver to the address
          given. If we cancel, we refund any payment already taken in full.
        </p>
      </PolicySection>

      <PolicySection title="Bespoke and Made to Order Pieces">
        <p>
          Bespoke pieces are produced specifically for you based on the measurements and specifications you supply
          at the time of order.
        </p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; You are responsible for the accuracy of the measurements you provide. We can advise, but we cannot verify them.</li>
          <li>&bull; Production timelines given at checkout are estimates, not guarantees, and depend on the complexity of the piece.</li>
          <li>
            &bull; Once production has begun, a bespoke order cannot be cancelled or returned for a change of mind.
            You may cancel free of charge before production starts by contacting us.
          </li>
          <li>&bull; This does not affect your rights if the piece arrives defective, or materially different from what was agreed.</li>
        </ul>
        <p>
          Our{" "}
          <Link href="/returns" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            Returns &amp; Refunds
          </Link>{" "}
          policy sets out how bespoke orders are handled when something goes wrong.
        </p>
      </PolicySection>

      <PolicySection title="Shipping and Delivery">
        <p>
          A shipping fee applies to all orders. The fee is calculated at checkout based on your delivery address and
          is shown to you before you pay.
        </p>
        <p>
          Delivery timeframes are estimates. They can be affected by courier delays, public holidays, weather, and
          the accuracy of the address you provide. We will keep you informed if a delay is significant.
        </p>
        <p>
          Risk in the goods passes to you when the order is delivered to the address given at checkout, or to a
          person at that address who accepts it. If an order is returned to us because nobody was available or the
          address was wrong, we may charge the cost of redelivery.
        </p>
      </PolicySection>

      <PolicySection title="Faulty or Incorrect Items">
        <p>
          If an item arrives damaged, defective, or is not what you ordered, contact us within 7 days of delivery
          with your order number and photographs. We will arrange a repair, replacement, or refund in line with our{" "}
          <Link href="/returns" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            Returns &amp; Refunds
          </Link>{" "}
          policy and your rights under Nigerian consumer law.
        </p>
      </PolicySection>

      <PolicySection title="Accounts">
        <p>
          You are responsible for keeping your account details confidential and for activity that happens under
          your account. Tell us immediately at{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
          </a>{" "}
          if you think someone else has accessed it.
        </p>
        <p>We may suspend or close an account that is being used fraudulently, to abuse promotions, or in breach of these terms.</p>
      </PolicySection>

      <PolicySection title="Acceptable Use">
        <p>
          You agree not to use the site to attempt unauthorised access to our systems or another user&rsquo;s
          account, to scrape or copy the site for a competing service, to upload anything malicious, to place
          fraudulent or speculative orders, or to post content that is unlawful, defamatory, or infringes someone
          else&rsquo;s rights.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual Property">
        <p>
          All content on this site, including photography, product designs, logos, and text, belongs to OnPoint
          Clothing Nig. You may view and share it for personal, non-commercial purposes. You may not reproduce,
          resell, or use it commercially without our written permission.
        </p>
        <p>
          Anything you submit to us, such as a review or a photograph tagged to us, remains yours, but you give us
          permission to use it to promote OnPoint. Tell us if you want that use to stop.
        </p>
      </PolicySection>

      <PolicySection title="Third Party Links">
        <p>
          Our site may link to other websites and social media pages. We do not control them and are not
          responsible for their content or their handling of your data.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of Liability">
        <p>
          Nothing in these terms limits our liability for death or personal injury caused by our negligence, for
          fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited.
        </p>
        <p>
          Subject to that, and to the fullest extent permitted by law, we are not liable for indirect or
          consequential loss, loss of profit, or loss of opportunity arising from your use of the site or a
          purchase. Our total liability in connection with any order will not exceed the amount you paid for that
          order.
        </p>
        <p>We do not guarantee that the site will be available without interruption or free of errors.</p>
      </PolicySection>

      <PolicySection title="Events Outside Our Control">
        <p>
          We are not liable for delay or failure to perform caused by events beyond our reasonable control,
          including courier failures, strikes, civil unrest, fire, flood, power or internet outages, government
          action, or supply shortages. If such an event continues for more than 30 days, either of us may cancel the
          affected order and we will refund you in full.
        </p>
      </PolicySection>

      <PolicySection title="Complaints">
        <p>
          If something goes wrong, email{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
          </a>{" "}
          with your order number and we will respond within 5 working days. If we cannot resolve it, you may refer
          the matter to the Federal Competition and Consumer Protection Commission at{" "}
          <a
            href="https://fccpc.gov.ng"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light"
          >
            fccpc.gov.ng
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="General">
        <p>
          If any part of these terms is found unenforceable, the rest stays in force. If we do not enforce a term
          straight away, that does not mean we have given up the right to enforce it later. You may not transfer
          your rights under these terms to someone else without our agreement.
        </p>
        <p>
          These terms, together with our{" "}
          <Link href="/privacy" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/returns" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            Returns &amp; Refunds
          </Link>{" "}
          policy, form the whole agreement between us regarding your use of the site.
        </p>
      </PolicySection>

      <PolicySection title="Governing Law">
        <p>
          These terms are governed by the laws of the Federal Republic of Nigeria. Disputes arising from these
          terms or your use of the site are subject to the exclusive jurisdiction of the courts of Lagos State.
        </p>
      </PolicySection>

      <PolicySection title="Changes to These Terms">
        <p>
          We may update these terms from time to time. The date at the top shows when they were last revised.
          Changes do not apply retroactively to orders we have already accepted.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>OnPoint Clothing Nig</p>
        <p>
          <a href={CONTACT.address.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.address.display}
          </a>
        </p>
        <p>
          Email:{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
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
