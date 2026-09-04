"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";

const WHATSAPP_NUMBER = "2348168808535";
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
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-colors hover:bg-[#20BD5A]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}