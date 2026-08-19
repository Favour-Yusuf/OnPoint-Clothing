import { CONTACT } from "@/lib/contact";
import { ChatIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const METHODS = [
  { label: "Call", value: CONTACT.phone.display, href: CONTACT.phone.href, icon: PhoneIcon },
  { label: "WhatsApp", value: CONTACT.whatsapp.display, href: CONTACT.whatsapp.href, icon: ChatIcon },
  { label: "Email", value: CONTACT.email.display, href: CONTACT.email.href, icon: MailIcon },
] as const;

export function ContactMethods() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden bg-foreground/10 sm:grid-cols-3">
      {METHODS.map((method, index) => (
        <Reveal key={method.label} delayMs={index * 90} className="bg-background">
          <a
            href={method.href}
            target={method.href.startsWith("http") ? "_blank" : undefined}
            rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-foreground/5"
          >
            <method.icon className="h-5 w-5 text-burgundy" />
            <div>
              <p className="font-sans text-xs font-light tracking-[0.15em] text-foreground/50 uppercase">
                {method.label}
              </p>
              <p className="mt-2 font-sans text-lg font-light tracking-wide text-foreground group-hover:text-burgundy-light">
                {method.value}
              </p>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
