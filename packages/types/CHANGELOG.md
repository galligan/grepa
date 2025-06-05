# @grepa/types

## 0.1.0

### Minor Changes

- 620fb29: Implement TypeScript conventions and consolidate v2 APIs

  - **Result Pattern**: All methods now support Result<T, E> pattern for better error handling
  - **Runtime Validation**: Added Zod schemas for all inputs and outputs
  - **Type Safety**: Stricter TypeScript configuration with noUncheckedIndexedAccess and exactOptionalPropertyTypes
  - **Error Handling**: Comprehensive AppError type with domain-specific error codes
  - **API Consolidation**: Merged v2 improvements into main APIs, removing duplication
  - **Type Guards**: Added runtime type assertions for safer code
  - **Better CLI**: Enhanced error messages and validation

  Breaking changes:

  - New async methods return Result<T> instead of throwing errors
  - Legacy sync methods preserved for backward compatibility
