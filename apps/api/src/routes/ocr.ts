import { Router, Request, Response } from 'express'
import multer from 'multer'
import { processReceiptImage, processReceiptPDF } from '../services/ocr-service'

const router: Router = Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'))
    }
  },
})

/**
 * POST /api/ocr/process-image
 * Process uploaded receipt image and extract structured data
 */
router.post('/process-image', upload.single('receipt'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { province } = req.body
    if (!province) {
      return res.status(400).json({ error: 'Province is required' })
    }

    const result = await processReceiptImage(req.file.buffer, province)
    res.json(result)
  } catch (error) {
    console.error('OCR processing error:', error)
    res.status(500).json({ 
      error: 'Failed to process receipt image',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/ocr/process-pdf
 * Process uploaded receipt PDF and extract structured data
 */
router.post('/process-pdf', upload.single('receipt'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { province } = req.body
    if (!province) {
      return res.status(400).json({ error: 'Province is required' })
    }

    const result = await processReceiptPDF(req.file.buffer, province)
    res.json(result)
  } catch (error) {
    console.error('PDF processing error:', error)
    res.status(500).json({ 
      error: 'Failed to process receipt PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/ocr/process-multiple
 * Process multiple receipt files
 */
router.post('/process-multiple', upload.array('receipts', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const { province } = req.body
    if (!province) {
      return res.status(400).json({ error: 'Province is required' })
    }

    const results = []
    
    for (const file of req.files as any[]) {
      try {
        let result
        if (file.mimetype === 'application/pdf') {
          result = await processReceiptPDF(file.buffer, province)
        } else {
          result = await processReceiptImage(file.buffer, province)
        }
        results.push({
          filename: file.originalname,
          success: true,
          data: result
        })
      } catch (error) {
        results.push({
          filename: file.originalname,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    res.json({ results })
  } catch (error) {
    console.error('Multiple file processing error:', error)
    res.status(500).json({ 
      error: 'Failed to process files',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export { router as ocrRoutes }
