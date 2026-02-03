import { Receipt, ReceiptItem } from '../types';

/**
 * Validates receipt data structure
 */
export function validateReceipt(receipt: Receipt): boolean {
  return (
    typeof receipt.receipt_id === 'string' && receipt.receipt_id.length > 0 &&
    typeof receipt.receipt_date === 'string' && receipt.receipt_date.length === 10 &&
    typeof receipt.province === 'string' && receipt.province.length > 0 &&
    Array.isArray(receipt.items) && receipt.items.length > 0 &&
    receipt.items.every(validateReceiptItem)
  );
}

/**
 * Validates receipt item data structure
 */
export function validateReceiptItem(item: ReceiptItem): boolean {
  return (
    (item.product_id === null || typeof item.product_id === 'string') &&
    typeof item.product_name === 'string' && item.product_name.length > 0 &&
    typeof item.price_paid === 'number' && item.price_paid >= 0
  );
}

/**
 * Normalizes receipt data (ensures consistent formatting)
 */
export function normalizeReceipt(receipt: Receipt): Receipt {
  return {
    receipt_id: receipt.receipt_id.trim(),
    receipt_date: receipt.receipt_date.trim(),
    province: receipt.province.trim().toUpperCase(),
    items: receipt.items.map(normalizeReceiptItem),
  };
}

/**
 * Normalizes receipt item data
 */
export function normalizeReceiptItem(item: ReceiptItem): ReceiptItem {
  return {
    product_id: item.product_id ? item.product_id.trim() : null,
    product_name: item.product_name.trim(),
    price_paid: Math.round(item.price_paid * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Validates and normalizes an array of receipts
 * Throws error if any receipt is invalid
 */
export function validateAndNormalizeReceipts(receipts: Receipt[]): Receipt[] {
  const normalizedReceipts: Receipt[] = [];
  
  for (const receipt of receipts) {
    if (!validateReceipt(receipt)) {
      throw new Error(`Invalid receipt data: ${JSON.stringify(receipt)}`);
    }
    normalizedReceipts.push(normalizeReceipt(receipt));
  }
  
  return normalizedReceipts;
}

/**
 * Filters receipts by province
 */
export function filterReceiptsByProvince(receipts: Receipt[], province: string): Receipt[] {
  return receipts.filter(receipt => receipt.province === province);
}

/**
 * Filters receipts by date range
 */
export function filterReceiptsByDateRange(
  receipts: Receipt[],
  startDate: string,
  endDate: string
): Receipt[] {
  return receipts.filter(receipt => {
    const receiptDate = new Date(receipt.receipt_date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return receiptDate >= start && receiptDate <= end;
  });
}

/**
 * Gets unique provinces from receipt list
 */
export function getUniqueReceiptProvinces(receipts: Receipt[]): string[] {
  const provinces: { [key: string]: boolean } = {}
  const result: string[] = []
  
  for (const receipt of receipts) {
    if (!provinces[receipt.province]) {
      provinces[receipt.province] = true
      result.push(receipt.province)
    }
  }
  
  return result.sort()
}

/**
 * Finds a receipt by ID
 */
export function findReceiptById(receipts: Receipt[], receiptId: string): Receipt | undefined {
  for (const receipt of receipts) {
    if (receipt.receipt_id === receiptId) {
      return receipt;
    }
  }
  return undefined;
}

/**
 * Calculates total spent on a receipt
 */
export function calculateReceiptTotal(receipt: Receipt): number {
  return receipt.items.reduce((total, item) => total + item.price_paid, 0);
}

/**
 * Gets receipt items that have product IDs
 */
export function getItemsWithProductIds(receipt: Receipt): ReceiptItem[] {
  return receipt.items.filter(item => item.product_id !== null);
}

/**
 * Gets receipt items that don't have product IDs
 */
export function getItemsWithoutProductIds(receipt: Receipt): ReceiptItem[] {
  return receipt.items.filter(item => item.product_id === null);
}
