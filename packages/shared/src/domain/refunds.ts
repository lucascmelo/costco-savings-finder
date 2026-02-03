import { RefundResult, RefundClassification, RefundOpportunity } from '../types';

/**
 * Determines if a refund opportunity is active or expired
 * Active: coupon valid_until is today or in the future
 * Expired: coupon valid_until is in the past
 */
export function classifyRefund(refundResult: RefundResult): RefundClassification {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  const validUntil = new Date(refundResult.coupon_valid_until);
  validUntil.setHours(0, 0, 0, 0);
  
  return validUntil >= today ? 'active' : 'expired';
}

/**
 * Checks if a date string is valid (YYYY-MM-DD format)
 */
export function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculates days left until coupon expires
 * Returns negative numbers for expired coupons
 */
export function getDaysUntilExpiry(validUntil: string): number {
  if (!isValidDateString(validUntil)) {
    throw new Error(`Invalid date format: ${validUntil}`);
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(validUntil);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Creates a refund opportunity with classification
 */
export function createRefundOpportunity(refundResult: RefundResult): RefundOpportunity {
  return {
    result: refundResult,
    classification: classifyRefund(refundResult),
  };
}

/**
 * Filters refund opportunities by classification
 */
export function filterByClassification(
  opportunities: RefundOpportunity[],
  classification: RefundClassification
): RefundOpportunity[] {
  return opportunities.filter(opp => opp.classification === classification);
}

/**
 * Separates refund opportunities into active and expired
 */
export function separateRefunds(opportunities: RefundOpportunity[]): {
  active: RefundOpportunity[];
  expired: RefundOpportunity[];
} {
  return {
    active: filterByClassification(opportunities, 'active'),
    expired: filterByClassification(opportunities, 'expired'),
  };
}

/**
 * Calculates total refund amount for active refunds only
 */
export function calculateTotalActiveRefund(opportunities: RefundOpportunity[]): number {
  return opportunities
    .filter(opp => opp.classification === 'active')
    .reduce((total, opp) => total + opp.result.refund_amount, 0);
}

/**
 * Calculates total refund amount for all refunds (including expired)
 */
export function calculateTotalRefund(opportunities: RefundOpportunity[]): number {
  return opportunities.reduce((total, opp) => total + opp.result.refund_amount, 0);
}

/**
 * Sorts refund opportunities by refund amount (highest first)
 */
export function sortByRefundAmount(opportunities: RefundOpportunity[]): RefundOpportunity[] {
  return [...opportunities].sort((a, b) => b.result.refund_amount - a.result.refund_amount);
}

/**
 * Sorts refund opportunities by days until expiry (soonest first)
 */
export function sortByExpiryDate(opportunities: RefundOpportunity[]): RefundOpportunity[] {
  return [...opportunities].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.result.coupon_valid_until);
    const daysB = getDaysUntilExpiry(b.result.coupon_valid_until);
    return daysA - daysB;
  });
}
