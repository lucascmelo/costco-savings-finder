'use client'

import { useState } from 'react'

interface ReceiptUploadProps {
  province: string
  onReceiptsChange: (receipts: any[]) => void
}

export function ReceiptUpload({ province, onReceiptsChange }: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    
    // TODO: Process files with OCR
    // For now, just simulate processing
    setTimeout(() => {
      const mockReceipts = files.map((file, index) => ({
        receipt_id: `receipt_${Date.now()}_${index}`,
        receipt_date: new Date().toISOString().split('T')[0],
        province,
        items: [
          {
            product_id: null,
            product_name: 'Sample Product',
            price_paid: 29.99
          }
        ]
      }))
      onReceiptsChange(mockReceipts)
      setIsUploading(false)
    }, 2000)
    
    setIsUploading(true)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="text-lg font-medium">Upload Costco Receipts</div>
          <div className="text-sm text-muted-foreground">
            Support for PDF and image files (JPG, PNG)
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading ? 'Processing...' : 'Choose Files'}
          </label>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploaded Files:</div>
          <ul className="text-sm text-muted-foreground">
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
