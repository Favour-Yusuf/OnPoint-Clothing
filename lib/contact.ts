const ADDRESS_DISPLAY = "No 12B Ben Okagbue Mba, Lekki Phase 1, Lagos";

export const CONTACT = {
  phone: { display: "+234 803 464 5559", href: "tel:+2348034645559" },
  whatsapp: { display: "+234 816 880 8535", href: "https://wa.me/2348168808535" },
  email: { display: "Onpointclothingnig@yahoo.com", href: "mailto:Onpointclothingnig@yahoo.com" },
  address: {
    display: ADDRESS_DISPLAY,
    href: `https://maps.google.com/?q=${encodeURIComponent(ADDRESS_DISPLAY)}`,
  },
} as const;

/** Manual bank transfer — the fallback payment route when Paystack isn't an option. */
export const BANK_TRANSFER = {
  bankName: "Providus Bank",
  accountName: "Just Onpoint Clothing",
  accountNumber: "1309412264",
} as const;
