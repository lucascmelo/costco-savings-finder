import { Router, Request, Response } from 'express'
import { 
  validateAndNormalizeCoupons,
  filterByProvince,
  filterValidCoupons,
  filterExpiredCoupons,
  getUniqueProvinces
} from '@costco-savings-finder/shared'

const router: Router = Router()

// Mock coupon data - in production this would come from a database or external source
const MOCK_COUPONS = [
  {
    product_id: '123456',
    product_name: 'Organic Whole Milk',
    discount_price: 6.99,
    province: 'ON',
    valid_until: '2024-12-31'
  },
  {
    product_id: '789012',
    product_name: 'Kirkland Coffee Beans',
    discount_price: 12.99,
    province: 'ON',
    valid_until: '2024-11-30'
  },
  {
    product_id: '345678',
    product_name: 'Kirkland Paper Towels',
    discount_price: 19.99,
    province: 'BC',
    valid_until: '2024-12-25'
  }
]

/**
 * GET /api/coupons
 * Get all coupons or filter by province
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { province, valid } = req.query

    let coupons = [...MOCK_COUPONS]

    // Filter by province if specified
    if (province && typeof province === 'string') {
      coupons = filterByProvince(coupons, province)
    }

    // Filter by validity if specified
    if (valid === 'true') {
      coupons = filterValidCoupons(coupons)
    } else if (valid === 'false') {
      coupons = filterExpiredCoupons(coupons)
    }

    res.json({
      coupons,
      count: coupons.length,
      provinces: getUniqueProvinces(MOCK_COUPONS)
    })
  } catch (error) {
    console.error('Get coupons error:', error)
    res.status(500).json({ 
      error: 'Failed to get coupons',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/coupons/provinces
 * Get list of available provinces
 */
router.get('/provinces', async (req: Request, res: Response) => {
  try {
    const provinces = getUniqueProvinces(MOCK_COUPONS)
    res.json({ provinces })
  } catch (error) {
    console.error('Get provinces error:', error)
    res.status(500).json({ 
      error: 'Failed to get provinces',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/coupons/validate
 * Validate and normalize coupon data
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { coupons } = req.body

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ error: 'Coupons must be an array' })
    }

    const normalizedCoupons = validateAndNormalizeCoupons(coupons)
    
    res.json({
      valid: true,
      coupons: normalizedCoupons,
      count: normalizedCoupons.length
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    res.status(400).json({ 
      error: 'Invalid coupon data',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/coupons/:province
 * Get coupons for a specific province
 */
router.get('/:province', async (req: Request, res: Response) => {
  try {
    const { province } = req.params
    const { valid } = req.query

    let coupons = filterByProvince(MOCK_COUPONS, province as string)

    if (valid === 'true') {
      coupons = filterValidCoupons(coupons)
    } else if (valid === 'false') {
      coupons = filterExpiredCoupons(coupons)
    }

    res.json({
      province,
      coupons,
      count: coupons.length
    })
  } catch (error) {
    console.error('Get province coupons error:', error)
    res.status(500).json({ 
      error: 'Failed to get province coupons',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/coupons/sync
 * Sync coupons from external source (placeholder for future implementation)
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    // TODO: Implement coupon synchronization from external source
    // This would fetch coupons from the Cloudflare Pages JSON endpoint
    // and update the local database/cache
    
    res.json({
      message: 'Coupon sync not implemented yet',
      status: 'placeholder'
    })
  } catch (error) {
    console.error('Coupon sync error:', error)
    res.status(500).json({ 
      error: 'Failed to sync coupons',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export { router as couponRoutes }
