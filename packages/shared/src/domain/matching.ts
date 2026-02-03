import { Coupon, ReceiptItem, RefundResult } from '../types';

/**
 * Normalizes product name for matching
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes extra spaces
 */
export function normalizeProductName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Primary matching by product_id
 * Only matches when both receipt item and coupon have product_id and they are exactly equal
 */
export function matchByProductId(receiptItem: ReceiptItem, coupon: Coupon): boolean {
  return (
    receiptItem.product_id !== null &&
    receiptItem.product_id === coupon.product_id
  );
}

/**
 * Fallback matching by product name
 * Only used when receipt item has no product_id
 * Uses normalized product name comparison
 */
export function matchByName(receiptItem: ReceiptItem, coupon: Coupon): boolean {
  if (receiptItem.product_id !== null) {
    return false; // Don't match by name if product_id exists
  }
  
  return normalizeProductName(receiptItem.product_name) === 
         normalizeProductName(coupon.product_name);
}

/**
 * Determines if a receipt item matches a coupon
 * Follows the deterministic matching rules:
 * 1. Primary match by product_id
 * 2. Fallback match by name (only if no product_id)
 */
export function isMatch(receiptItem: ReceiptItem, coupon: Coupon): boolean {
  return matchByProductId(receiptItem, coupon) || matchByName(receiptItem, coupon);
}

/**
 * Determines the match type for UI display
 */
export function getMatchType(receiptItem: ReceiptItem, coupon: Coupon): 'product_id' | 'name' {
  if (matchByProductId(receiptItem, coupon)) {
    return 'product_id';
  }
  if (matchByName(receiptItem, coupon)) {
    return 'name';
  }
  throw new Error('No match found between receipt item and coupon');
}

/**
 * Finds all matching coupons for a receipt item
 */
export function findMatchingCoupons(
  receiptItem: ReceiptItem, 
  coupons: Coupon[]
): Coupon[] {
  return coupons.filter(coupon => isMatch(receiptItem, coupon));
}

/**
 * Creates a refund result from a matched receipt item and coupon
 */
export function createRefundResult(
  receiptItem: ReceiptItem,
  coupon: Coupon
): RefundResult {
  const matchType = getMatchType(receiptItem, coupon);
  const refundAmount = Math.max(0, receiptItem.price_paid - coupon.discount_price);
  
  return {
    product_id: coupon.product_id,
    product_name: coupon.product_name,
    price_paid: receiptItem.price_paid,
    current_price: coupon.discount_price,
    refund_amount: refundAmount,
    coupon_valid_until: coupon.valid_until,
    match_type: matchType,
  };
}
