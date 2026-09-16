export type PaidOrderNotification = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  total: number; // minor units (kobo), same convention as the orders table
  items: {
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    totalPrice: number; // minor units
  }[];
  shippingAddress: {
    fullName: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  adminUrl: string;
};

export type BespokeRequestNotification = {
  name: string;
  email: string;
  phone: string | null;
  garmentType: string;
  notes: string;
  adminUrl: string;
};

/**
 * A bank-transfer order the moment it's placed — payment is unconfirmed at
 * this point (the customer still has to actually send the transfer and its
 * receipt), unlike PaidOrderNotification. Exists so admin gets a proactive
 * alert instead of relying solely on the customer remembering to message
 * their receipt on WhatsApp.
 */
export type BankTransferOrderNotification = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  total: number; // minor units (kobo), same convention as the orders table
  items: {
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    totalPrice: number; // minor units
  }[];
  shippingAddress: {
    fullName: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  adminUrl: string;
};

export type AbandonedCheckoutNotification = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number; // minor units (kobo), same convention as the orders table
  items: {
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    totalPrice: number; // minor units
  }[];
  checkoutUrl: string;
};
