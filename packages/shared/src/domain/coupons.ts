import { Coupon } from '../types';

/**
 * Validates coupon data structure
 */
export function validateCoupon(coupon: Coupon): boolean {
  return (
    typeof coupon.product_id === 'string' && coupon.product_id.length > 0 &&
    typeof coupon.product_name === 'string' && coupon.product_name.length > 0 &&
    typeof coupon.discount_price === 'number' && coupon.discount_price >= 0 &&
    typeof coupon.province === 'string' && coupon.province.length > 0 &&
    typeof coupon.valid_until === 'string' && coupon.valid_until.length === 10
  );
}

/**
 * Filters coupons by province
 */
export function filterByProvince(coupons: Coupon[], province: string): Coupon[] {
  return coupons.filter(coupon => coupon.province === province);
}

/**
 * Filters coupons that are currently valid (not expired)
 */
export function filterValidCoupons(coupons: Coupon[]): Coupon[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return coupons.filter(coupon => {
    const validUntil = new Date(coupon.valid_until);
    validUntil.setHours(0, 0, 0, 0);
    return validUntil >= today;
  });
}

/**
 * Filters coupons that have expired
 */
export function filterExpiredCoupons(coupons: Coupon[]): Coupon[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return coupons.filter(coupon => {
    const validUntil = new Date(coupon.valid_until);
    validUntil.setHours(0, 0, 0, 0);
    return validUntil < today;
  });
}

/**
 * Finds a coupon by product_id
 */
export function findCouponById(coupons: Coupon[], productId: string): Coupon | undefined {
  return coupons.find(coupon => coupon.product_id === productId);
}

/**
 * Finds coupons by product name (exact match)
 */
export function findCouponsByName(coupons: Coupon[], productName: string): Coupon[] {
  return coupons.filter(coupon => 
    coupon.product_name.toLowerCase() === productName.toLowerCase()
  );
}

/**
 * Searches coupons by partial product name match
 */
export function searchCouponsByName(coupons: Coupon[], searchTerm: string): Coupon[] {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return coupons.filter(coupon =>
    coupon.product_name.toLowerCase().includes(normalizedSearch)
  );
}

/**
 * Gets unique provinces from coupon list
 */
export function getUniqueProvinces(coupons: Coupon[]): string[] {
  const provinces = new Set(coupons.map(coupon => coupon.province));
  return Array.from(provinces).sort();
}

/**
 * Normalizes coupon data (ensures consistent formatting)
 */
export function normalizeCoupon(coupon: Coupon): Coupon {
  return {
    product_id: coupon.product_id.trim(),
    product_name: coupon.product_name.trim(),
    discount_price: Math.round(coupon.discount_price * 100) / 100, // Round to 2 decimal places
    province: coupon.province.trim().toUpperCase(),
    valid_until: coupon.valid_until.trim(),
  };
}

/**
 * Validates and normalizes an array of coupons
 * Throws error if any coupon is invalid
 */
export function validateAndNormalizeCoupons(coupons: Coupon[]): Coupon[] {
  const normalizedCoupons: Coupon[] = [];
  
  for (const coupon of coupons) {
    if (!validateCoupon(coupon)) {
      throw new Error(`Invalid coupon data: ${JSON.stringify(coupon)}`);
    }
    normalizedCoupons.push(normalizeCoupon(coupon));
  }
  
  return normalizedCoupons;
}
