"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";

const WHATSAPP_NUMBER = "2348034645559";
const DEFAULT_MESSAGE = "Hi, I'd like to know more about OnPoint Clothing.";

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/checkout")) {
    return null;
  }

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-background shadow-lg shadow-burgundy-deep/30 transition-colors hover:bg-burgundy-light"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
