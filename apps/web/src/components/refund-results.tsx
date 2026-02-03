'use client'

import { useState } from 'react'

interface RefundResultsProps {
  receipts: any[]
  province: string
}

export function RefundResults({ receipts, province }: RefundResultsProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active')

  const mockActiveRefunds = [
    {
      product_name: 'Kirkland Paper Towels',
      price_paid: 24.99,
      current_price: 19.99,
      refund_amount: 5.00,
      coupon_valid_until: '2024-12-31',
      match_type: 'product_id' as const
    }
  ]

  const mockExpiredRefunds = [
    {
      product_name: 'Coffee Beans',
      price_paid: 15.99,
      current_price: 12.99,
      refund_amount: 3.00,
      coupon_valid_until: '2024-11-30',
      match_type: 'product_id' as const
    }
  ]

  const currentRefunds = activeTab === 'active' ? mockActiveRefunds : mockExpiredRefunds
  const currentTotal = currentRefunds.reduce((sum, refund) => sum + refund.refund_amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 rounded-md ${
            activeTab === 'active' ? 'bg-background shadow-sm' : ''
          }`}
        >
          Active Refunds ({mockActiveRefunds.length})
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`flex-1 py-2 px-4 rounded-md ${
            activeTab === 'expired' ? 'bg-background shadow-sm' : ''
          }`}
        >
          Expired Refunds ({mockExpiredRefunds.length})
        </button>
      </div>

      <div className="text-lg font-semibold">
        Total Potential Refund: ${currentTotal.toFixed(2)}
      </div>

      <div className="space-y-4">
        {currentRefunds.map((refund, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{refund.product_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Match type: {refund.match_type}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  ${refund.refund_amount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valid until {refund.coupon_valid_until}
                </div>
              </div>
            </div>
            <div className="text-sm">
              Paid: ${refund.price_paid.toFixed(2)} → 
              Current: ${refund.current_price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
