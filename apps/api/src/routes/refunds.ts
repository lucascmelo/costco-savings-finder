import { Router, Request, Response } from 'express'
import { 
  calculateRefundsForReceipts,
  getActiveRefunds,
  getExpiredRefunds,
  getSeparatedRefunds
} from '@costco-savings-finder/shared'

const router: Router = Router()

/**
 * POST /api/refunds/calculate
 * Calculate refund opportunities for given receipts
 */
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { receipts, coupons, options = {} } = req.body

    if (!Array.isArray(receipts)) {
      return res.status(400).json({ error: 'Receipts must be an array' })
    }

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ error: 'Coupons must be an array' })
    }

    const opportunities = calculateRefundsForReceipts(receipts, coupons, options)
    const { active, expired } = separateRefunds(opportunities)
    const activeTotal = active.reduce((sum, opp) => sum + opp.result.refund_amount, 0)
    const expiredTotal = expired.reduce((sum, opp) => sum + opp.result.refund_amount, 0)

    res.json({
      active,
      expired,
      summary: {
        activeCount: active.length,
        expiredCount: expired.length,
        activeTotal,
        expiredTotal,
        total: activeTotal + expiredTotal
      }
    })
  } catch (error) {
    console.error('Refund calculation error:', error)
    res.status(500).json({ 
      error: 'Failed to calculate refunds',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/refunds/active
 * Get only active refund opportunities
 */
router.post('/active', async (req: Request, res: Response) => {
  try {
    const { receipts, coupons, options = {} } = req.body

    if (!Array.isArray(receipts)) {
      return res.status(400).json({ error: 'Receipts must be an array' })
    }

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ error: 'Coupons must be an array' })
    }

    const activeRefunds = getActiveRefunds(receipts, coupons, options)
    const total = activeRefunds.reduce((sum, opp) => sum + opp.result.refund_amount, 0)

    res.json({
      refunds: activeRefunds,
      count: activeRefunds.length,
      total
    })
  } catch (error) {
    console.error('Active refunds error:', error)
    res.status(500).json({ 
      error: 'Failed to get active refunds',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/refunds/expired
 * Get only expired refund opportunities
 */
router.post('/expired', async (req: Request, res: Response) => {
  try {
    const { receipts, coupons, options = {} } = req.body

    if (!Array.isArray(receipts)) {
      return res.status(400).json({ error: 'Receipts must be an array' })
    }

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ error: 'Coupons must be an array' })
    }

    const expiredRefunds = getExpiredRefunds(receipts, coupons, options)
    const total = expiredRefunds.reduce((sum, opp) => sum + opp.result.refund_amount, 0)

    res.json({
      refunds: expiredRefunds,
      count: expiredRefunds.length,
      total
    })
  } catch (error) {
    console.error('Expired refunds error:', error)
    res.status(500).json({ 
      error: 'Failed to get expired refunds',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/refunds/price-adjustment
 * Calculate refunds within price adjustment window (default 30 days)
 */
router.post('/price-adjustment', async (req: Request, res: Response) => {
  try {
    const { receipts, coupons, windowDays = 30, options = {} } = req.body

    if (!Array.isArray(receipts)) {
      return res.status(400).json({ error: 'Receipts must be an array' })
    }

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ error: 'Coupons must be an array' })
    }

    // Filter receipts within the adjustment window
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const eligibleReceipts = receipts.filter((receipt: any) => {
      const receiptDate = new Date(receipt.receipt_date)
      receiptDate.setHours(0, 0, 0, 0)
      
      const daysSinceReceipt = Math.floor(
        (today.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      return daysSinceReceipt <= windowDays
    })

    const opportunities = calculateRefundsForReceipts(eligibleReceipts, coupons, options)
    const { active, expired } = separateRefunds(opportunities)
    const activeTotal = active.reduce((sum, opp) => sum + opp.result.refund_amount, 0)

    res.json({
      eligibleReceipts: eligibleReceipts.length,
      totalReceipts: receipts.length,
      windowDays,
      activeRefunds: active,
      activeTotal,
      claimableToday: activeTotal
    })
  } catch (error) {
    console.error('Price adjustment calculation error:', error)
    res.status(500).json({ 
      error: 'Failed to calculate price adjustments',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

function separateRefunds(opportunities: any[]) {
  const active = opportunities.filter(opp => opp.classification === 'active')
  const expired = opportunities.filter(opp => opp.classification === 'expired')
  return { active, expired }
}

export { router as refundRoutes }
