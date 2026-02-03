import { Receipt, Coupon, RefundOpportunity } from '../types';
import { 
  findMatchingCoupons, 
  createRefundResult 
} from '../domain/matching';
import { 
  createRefundOpportunity, 
  separateRefunds 
} from '../domain/refunds';
import { filterByProvince, filterValidCoupons } from '../domain/coupons';

/**
 * Main service for calculating refund opportunities
 * This is the core business logic that ties together matching and classification
 */

export interface RefundCalculationOptions {
  /** Include expired refund opportunities in results */
  includeExpired?: boolean;
  /** Only consider coupons valid after this date (YYYY-MM-DD) */
  validAfter?: string;
  /** Minimum refund amount to include */
  minimumRefundAmount?: number;
}

/**
 * Calculates refund opportunities for a single receipt
 */
export function calculateRefundsForReceipt(
  receipt: Receipt,
  coupons: Coupon[],
  options: RefundCalculationOptions = {}
): RefundOpportunity[] {
  const {
    includeExpired = true,
    validAfter,
    minimumRefundAmount = 0,
  } = options;

  // Filter coupons by province first
  const provinceCoupons = filterByProvince(coupons, receipt.province);
  
  // Filter by validity date if specified
  let eligibleCoupons = provinceCoupons;
  if (validAfter) {
    eligibleCoupons = provinceCoupons.filter(coupon => 
      coupon.valid_until >= validAfter
    );
  }

  const opportunities: RefundOpportunity[] = [];

  // Process each receipt item
  for (const item of receipt.items) {
    const matchingCoupons = findMatchingCoupons(item, eligibleCoupons);
    
    // Create refund result for each matching coupon
    for (const coupon of matchingCoupons) {
      const refundResult = createRefundResult(item, coupon);
      
      // Filter by minimum refund amount
      if (refundResult.refund_amount >= minimumRefundAmount) {
        const opportunity = createRefundOpportunity(refundResult);
        
        // Include expired opportunities based on options
        if (includeExpired || opportunity.classification === 'active') {
          opportunities.push(opportunity);
        }
      }
    }
  }

  return opportunities;
}

/**
 * Calculates refund opportunities for multiple receipts
 */
export function calculateRefundsForReceipts(
  receipts: Receipt[],
  coupons: Coupon[],
  options: RefundCalculationOptions = {}
): RefundOpportunity[] {
  const allOpportunities: RefundOpportunity[] = [];

  for (const receipt of receipts) {
    const receiptOpportunities = calculateRefundsForReceipt(receipt, coupons, options);
    allOpportunities.push(...receiptOpportunities);
  }

  return allOpportunities;
}

/**
 * Gets only active refund opportunities
 */
export function getActiveRefunds(
  receipts: Receipt[],
  coupons: Coupon[],
  options: Omit<RefundCalculationOptions, 'includeExpired'> = {}
): RefundOpportunity[] {
  return calculateRefundsForReceipts(receipts, coupons, {
    ...options,
    includeExpired: false,
  });
}

/**
 * Gets only expired refund opportunities
 */
export function getExpiredRefunds(
  receipts: Receipt[],
  coupons: Coupon[],
  options: Omit<RefundCalculationOptions, 'includeExpired'> = {}
): RefundOpportunity[] {
  const allOpportunities = calculateRefundsForReceipts(receipts, coupons, {
    ...options,
    includeExpired: true,
  });

  const { expired } = separateRefunds(allOpportunities);
  return expired;
}

/**
 * Gets separated active and expired refund opportunities
 */
export function getSeparatedRefunds(
  receipts: Receipt[],
  coupons: Coupon[],
  options: RefundCalculationOptions = {}
): { active: RefundOpportunity[]; expired: RefundOpportunity[] } {
  const allOpportunities = calculateRefundsForReceipts(receipts, coupons, options);
  return separateRefunds(allOpportunities);
}

/**
 * Calculates refund opportunities for receipts within the price adjustment window
 * (typically 30-45 days from receipt date)
 */
export function calculatePriceAdjustmentRefunds(
  receipts: Receipt[],
  coupons: Coupon[],
  adjustmentWindowDays: number = 30,
  options: RefundCalculationOptions = {}
): RefundOpportunity[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eligibleReceipts = receipts.filter(receipt => {
    const receiptDate = new Date(receipt.receipt_date);
    receiptDate.setHours(0, 0, 0, 0);
    
    const daysSinceReceipt = Math.floor(
      (today.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceReceipt <= adjustmentWindowDays;
  });

  return calculateRefundsForReceipts(eligibleReceipts, coupons, options);
}
