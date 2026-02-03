'use client'

import { CANADIAN_PROVINCES } from '@costco-savings-finder/shared'

interface ProvinceSelectorProps {
  value: string
  onChange: (province: string) => void
}

export function ProvinceSelector({ value, onChange }: ProvinceSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="province" className="text-sm font-medium">
        Select your province
      </label>
      <select
        id="province"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-input rounded-md bg-background text-foreground"
      >
        <option value="">Choose a province...</option>
        {CANADIAN_PROVINCES.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>
    </div>
  )
}
