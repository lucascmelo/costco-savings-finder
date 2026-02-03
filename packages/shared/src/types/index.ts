// Core domain types for the Costco Savings Finder

export interface Coupon {
  product_id: string;
  product_name: string;
  discount_price: number;
  province: string;
  valid_until: string; // YYYY-MM-DD
}

export interface ReceiptItem {
  product_id: string | null;
  product_name: string;
  price_paid: number;
}

export interface Receipt {
  receipt_id: string;
  receipt_date: string; // YYYY-MM-DD
  province: string;
  items: ReceiptItem[];
}

export interface RefundResult {
  product_id: string;
  product_name: string;
  price_paid: number;
  current_price: number;
  refund_amount: number;
  coupon_valid_until: string;
  match_type: 'product_id' | 'name';
}

export type RefundClassification = 'active' | 'expired';

export interface RefundOpportunity {
  result: RefundResult;
  classification: RefundClassification;
}

export interface Province {
  code: string;
  name: string;
}

export const CANADIAN_PROVINCES: Province[] = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
];
