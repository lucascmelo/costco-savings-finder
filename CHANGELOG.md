# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial monorepo architecture setup
- Project task migrations system implementation

## [0.1.0] - 2026-02-04

### Added
- **Monorepo Foundation**: Complete Turborepo + pnpm workspace setup
- **Shared Configuration**: Centralized ESLint, TypeScript, and Tailwind configs
- **Domain Logic Package**: Complete business logic for Costco Price Adjustment Tracker
  - Coupon validation and filtering
  - Receipt processing and validation  
  - Matching algorithms (product_id and name-based)
  - Refund calculation with active/expired classification
- **Next.js Frontend**: v15 with App Router, TypeScript, Tailwind CSS
  - Province selector component
  - Receipt upload interface
  - Refund results with active/expired tabs
- **Express Backend API**: TypeScript server with proper type annotations
  - OCR processing routes (image, PDF, batch)
  - Refund calculation endpoints
  - Coupon management APIs
- **Build System**: Turborepo with efficient caching and parallel builds

### Technical Details
- **Frontend Stack**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend Stack**: Express, TypeScript, Multer for file uploads
- **Architecture**: Clean boundaries with shared domain logic
- **Build Tools**: Turborepo, pnpm workspaces
- **Type Safety**: Full TypeScript coverage across all packages

### Project Structure
```
costco-savings-finder/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Backend API
├── packages/
│   ├── shared/       # Domain logic and types
│   └── config/       # Shared configurations
├── project/          # Task migrations
├── CHANGELOG.md      # Version history
└── README.md         # Project overview
```

---

## Migration Notes

### From v0.0.0 to v0.1.0
- Established monorepo architecture from scratch
- Implemented complete domain logic following project requirements
- Set up build system with proper caching and parallel execution
- Created placeholder components and APIs ready for real implementation
