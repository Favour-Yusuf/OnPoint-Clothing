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
