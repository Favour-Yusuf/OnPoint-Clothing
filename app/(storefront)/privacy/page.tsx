import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/legal/policy-layout";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How OnPoint Clothing collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="31 August 2026">
      <p className="text-sm leading-relaxed text-foreground/65">
        This policy explains what personal information OnPoint Clothing Nig (&ldquo;OnPoint,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us&rdquo;) collects through justonpointng.com, why we collect it, how we protect it, and what you can
        ask us to do with it. It applies to visitors, account holders, and anyone who places an order with us.
      </p>
      <p className="text-sm leading-relaxed text-foreground/65">
        For the purposes of the Nigeria Data Protection Act 2023, OnPoint Clothing Nig is the data controller for
        the information described here.
      </p>

      <PolicySection title="Information We Collect">
        <p>Information you give us directly:</p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; Account details — your name and email address when you create an account.</li>
          <li>&bull; Order and delivery information — name, delivery address, phone number, and the contents of your order.</li>
          <li>&bull; Bespoke measurements and style preferences, if you submit a bespoke request.</li>
          <li>&bull; Wishlist and saved products linked to your account.</li>
          <li>&bull; Your email address if you sign up for our newsletter.</li>
          <li>&bull; Anything you send us by email, phone, or WhatsApp.</li>
        </ul>
        <p>Information we collect automatically:</p>
        <ul className="flex flex-col gap-1.5">
          <li>
            &bull; Basic technical data such as your IP address, browser type, and device type, which our hosting
            provider records for security and to keep the site running.
          </li>
          <li>&bull; Your shopping bag contents and sign-in session, stored on your device.</li>
        </ul>
        <p>
          We do not collect or store your card details. Payments are handled directly by Paystack — see &ldquo;Third
          Parties We Work With&rdquo; below.
        </p>
      </PolicySection>

      <PolicySection title="Why We Use It and Our Legal Basis">
        <p>Under the Nigeria Data Protection Act 2023 we must have a lawful basis for using your information. Ours are:</p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; To process and fulfil your orders, including bespoke commissions. Basis: performance of a contract with you.</li>
          <li>&bull; To create and manage your account, including order history and wishlist. Basis: performance of a contract with you.</li>
          <li>&bull; To contact you about an order, your account, or an enquiry you sent us. Basis: performance of a contract, or our legitimate interest in responding to you.</li>
          <li>&bull; To send newsletter and promotional emails. Basis: your consent, which you can withdraw at any time.</li>
          <li>&bull; To detect and prevent fraud, and to keep the site secure. Basis: our legitimate interest in protecting the business and our customers.</li>
          <li>&bull; To meet accounting, tax, and other legal obligations. Basis: compliance with a legal obligation.</li>
        </ul>
        <p>We do not make decisions about you by automated means alone.</p>
      </PolicySection>

      <PolicySection title="Bespoke Measurements">
        <p>
          If you submit body measurements for a bespoke piece, we use them only to produce your garment and to
          advise on fit for future orders. We do not share them with anyone outside the people making your order,
          and you can ask us to delete them once your order is complete.
        </p>
      </PolicySection>

      <PolicySection title="Third Parties We Work With">
        <p>We share the minimum information needed with the following service providers:</p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; <span className="text-foreground">Supabase</span> — hosts our database and manages account sign-in.</li>
          <li>
            &bull; <span className="text-foreground">Paystack</span> — processes card and bank transfer payments.
            Paystack collects your payment details directly. We never see or store your full card number.
            Paystack&rsquo;s own privacy policy governs that data.
          </li>
          <li>&bull; <span className="text-foreground">Cloudinary</span> — hosts our product photography. This does not involve customer personal data.</li>
          <li>
            &bull; <span className="text-foreground">WhatsApp (Meta)</span> — we send new order details to our own
            team over WhatsApp so we can act on orders quickly. Meta processes that message data under its own
            terms.
          </li>
          <li>&bull; <span className="text-foreground">Delivery partners</span> — we pass your name, delivery address, and phone number to the courier handling your order.</li>
        </ul>
        <p>
          We may also disclose information where we are required to by law, by a court, or by a regulator, or where
          it is necessary to establish or defend a legal claim.
        </p>
        <p>We do not sell your personal information, and we do not share it with advertisers.</p>
      </PolicySection>

      <PolicySection title="Transfers Outside Nigeria">
        <p>
          Some of the providers listed above store or process data on servers outside Nigeria. Where that happens,
          we rely on the transfer conditions permitted under section 41 of the Nigeria Data Protection Act 2023, and
          we only work with providers who commit to an adequate level of protection through their own contractual
          terms.
        </p>
      </PolicySection>

      <PolicySection title="Cookies and Local Storage">
        <p>
          We use essential cookies and browser storage to keep you signed in and to remember your shopping bag
          between visits. These are needed for the site to work and cannot be switched off without breaking core
          features.
        </p>
        <p>
          We do not currently use third party advertising or tracking cookies. If that changes, we will update this
          policy and ask for your consent first where the law requires it.
        </p>
      </PolicySection>

      <PolicySection title="How We Protect Your Information">
        <p>
          We use encrypted connections (HTTPS) across the site, restrict access to customer data to the people who
          need it to do their job, and rely on providers who maintain their own security controls. No system is
          completely secure, so we cannot guarantee absolute security, but we take reasonable steps to protect what
          you give us.
        </p>
        <p>
          If a breach happens that is likely to put your rights at risk, we will notify the Nigeria Data Protection
          Commission within 72 hours of becoming aware of it, and we will tell you directly where the law requires
          it.
        </p>
      </PolicySection>

      <PolicySection title="How Long We Keep It">
        <ul className="flex flex-col gap-1.5">
          <li>&bull; Account and wishlist data — while your account is active, and for a reasonable period after you close it.</li>
          <li>&bull; Order and transaction records — at least six years from the end of the relevant financial year, to meet tax and accounting requirements.</li>
          <li>&bull; Bespoke measurements — until you ask us to delete them, or until your account is closed.</li>
          <li>&bull; Newsletter subscription data — until you unsubscribe.</li>
          <li>&bull; Enquiries and correspondence — up to two years after the matter is closed.</li>
        </ul>
        <p>
          You can ask us to delete your data at any time. We will do so unless we are legally required to keep it,
          in which case we will tell you what we are keeping and why.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>Under the Nigeria Data Protection Act 2023 you have the right to:</p>
        <ul className="flex flex-col gap-1.5">
          <li>&bull; Ask what personal information we hold about you and get a copy of it.</li>
          <li>&bull; Have inaccurate or incomplete information corrected.</li>
          <li>&bull; Ask us to delete your information.</li>
          <li>&bull; Ask us to restrict how we use your information while a concern is being resolved.</li>
          <li>&bull; Object to us using your information where we rely on legitimate interest.</li>
          <li>&bull; Receive your information in a portable format, or have it sent to another provider where technically possible.</li>
          <li>
            &bull; Withdraw consent at any time, including unsubscribing from our newsletter. Withdrawing consent
            does not affect anything we did before you withdrew it.
          </li>
        </ul>
        <p>
          To exercise any of these, email{" "}
          <a href={CONTACT.email.href} className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            {CONTACT.email.display}
          </a>
          . We will respond within 30 days. We may ask you to confirm your identity first so we do not release your
          data to the wrong person. There is no charge for this unless a request is clearly excessive or repetitive.
        </p>
        <p>
          If you are not satisfied with how we handle your request, you can complain to the Nigeria Data Protection
          Commission at{" "}
          <a href="mailto:info@ndpc.gov.ng" className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light">
            info@ndpc.gov.ng
          </a>{" "}
          or through{" "}
          <a
            href="https://ndpc.gov.ng"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-burgundy underline-offset-4 hover:text-burgundy-light"
          >
            ndpc.gov.ng
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Children">
        <p>
          Our site is not directed at children under 18. We do not knowingly collect information from anyone under
          18 without the consent of a parent or guardian. If you believe a child has given us their information,
          contact us and we will delete it.
        </p>
      </PolicySection>

      <PolicySection title="Links to Other Sites">
        <p>
          Our site may link to other websites and social media pages. We are not responsible for how those sites
          handle your information, so check their own privacy policies.
        </p>
      </PolicySection>

      <PolicySection title="Changes to This Policy">
        <p>
          We may update this policy as our practices change. The date at the top of the page shows when it was last
          revised. If the change is significant, we will let account holders know by email.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us">
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
