export {};

// Ambient types for Paystack's Inline JS (v1/inline.js), loaded via a
// <script> tag rather than an npm package — see components/checkout/checkout-view.tsx.
declare global {
  interface PaystackPopHandler {
    openIframe: () => void;
  }

  interface PaystackPopSetupOptions {
    key: string;
    email: string;
    amount: number; // minor units
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }

  interface Window {
    PaystackPop?: {
      setup: (options: PaystackPopSetupOptions) => PaystackPopHandler;
    };
  }
}
