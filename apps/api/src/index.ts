import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ocrRoutes } from './routes/ocr'
import { refundRoutes } from './routes/refunds'
import { couponRoutes } from './routes/coupons'

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/ocr', ocrRoutes)
app.use('/api/refunds', refundRoutes)
app.use('/api/coupons', couponRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`)
    console.log(`📖 Health check: http://localhost:${PORT}/health`)
  })
}

export default app
