'use client'

import { useState } from 'react'
import { ProvinceSelector } from '@/components/province-selector'
import { ReceiptUpload } from '@/components/receipt-upload'
import { RefundResults } from '@/components/refund-results'

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [receipts, setReceipts] = useState<any[]>([])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Costco Savings Finder
          </h1>
          <p className="text-lg text-muted-foreground">
            Track price adjustment opportunities for your Costco purchases
          </p>
        </header>

        <div className="space-y-8">
          {/* Step 1: Province Selection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Select Your Province</h2>
            <ProvinceSelector 
              value={selectedProvince}
              onChange={setSelectedProvince}
            />
          </section>

          {/* Step 2: Receipt Upload */}
          {selectedProvince && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Upload Receipts</h2>
              <ReceiptUpload
                province={selectedProvince}
                onReceiptsChange={setReceipts}
              />
            </section>
          )}

          {/* Step 3: Refund Results */}
          {receipts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Refund Opportunities</h2>
              <RefundResults
                receipts={receipts}
                province={selectedProvince}
              />
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
