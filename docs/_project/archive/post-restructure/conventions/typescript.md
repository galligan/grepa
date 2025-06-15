# TypeScript Conventions

A terse reference for day-to-day coding across all projects.

---

## Table of Contents

1. [Utility Types "Power Pack"](#1-utility-types-power-pack)
   - 1.1 [Core Utility Types](#11-core-utility-types)
   - 1.2 [Quick Heuristics](#12-quick-heuristics)
2. [Error & Result Handling Pattern](#2-error--result-handling-pattern)
   - 2.1 [AppError Type](#21-apperror-type)
   - 2.2 [Zod Adapter](#22-zod-adapter)
   - 2.3 [Result Helpers](#23-result-helpers)
   - 2.4 [Usage Examples](#24-usage-examples)
3. [UI Adapters](#3-ui-adapters)
   - 3.1 [Toast Wrapper](#31-toast-wrapper)
   - 3.2 [Error Boundaries](#32-error-boundaries)
4. [Async Patterns & Data Fetching](#4-async-patterns--data-fetching)
   - 4.1 [Typed Fetch Wrapper](#41-typed-fetch-wrapper)
   - 4.2 [React Query Integration](#42-react-query-integration)
5. [Type Guards & Assertions](#5-type-guards--assertions)
   - 5.1 [Type Guard Patterns](#51-type-guard-patterns)
   - 5.2 [Assertion Functions](#52-assertion-functions)
6. [Schema & Validation Patterns](#6-schema--validation-patterns)
   - 6.1 [Zod Schema Composition](#61-zod-schema-composition)
   - 6.2 [Form Integration](#62-form-integration)
7. [Pitfalls & Lint Rules](#7-pitfalls--lint-rules)
   - 7.1 [Common Gotchas](#71-common-gotchas)
   - 7.2 [ESLint Configuration](#72-eslint-configuration)
   - 7.3 [TypeScript Configuration](#73-typescript-configuration)
8. [Quick Reference Card](#8-quick-reference-card)

---

## 1. Utility Types "Power Pack"

### 1.1 Core Utility Types

| Utility                    | Purpose                                      | Micro-example                                             |
| -------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `Partial<T>`               | Make every key optional                      | `type Patch = Partial<User>; // { id?: number; ... }`     |
| `Required<T>`              | Make every key required                      | `type Full = Required<User>;`                             |
| `Readonly<T>`              | Freeze keys (make properties readonly)       | `type Frozen = Readonly<User>;`                           |
| `Pick<T, K>`               | Keep only K                                  | `type IdName = Pick<User, "id" \| "name">;`               |
| `Omit<T, K>`               | Remove K                                     | `type NoPwd = Omit<User, "password">;`                    |
| `Record<K, V>`             | Map union → value                            | `type RoleMap = Record<Role, boolean>;`                   |
| `Exclude<U, M>`            | Remove members from union U that are in M    | `type T = Exclude<"a" \| "b" \| "c", "a">; // "b" \| "c"` |
| `Extract<U, M>`            | Keep members from union U that are also in M | `type T = Extract<"a" \| "b" \| "c", "a" \| "d">; // "a"` |
| `NonNullable<T>`           | Remove null/undefined                        | `type NN = NonNullable<string \| null>; // string`        |
| `ReturnType<F>`            | Infer return type of function F              | `type R = ReturnType<typeof fn>;`                         |
| `Parameters<F>`            | Infer parameter tuple of a function F        | `type P = Parameters<typeof fn>;`                         |
| `Awaited<T>`               | Unwrap Promise type                          | `type A = Awaited<Promise<string>>; // string`            |
| `ConstructorParameters<C>` | Infer constructor arguments of class C       | `type CP = ConstructorParameters<typeof Klass>;`          |
| `InstanceType<C>`          | Infer instance type of class C               | `type I = InstanceType<typeof Klass>;`                    |

### 1.2 Quick Heuristics

- Treat utility types as set algebra for shapes (union, intersection, subtraction).
- Prefer deriving over duplicating: infer from functions/constructors.
- `Partial` is shallow — use a custom `DeepPartial` if you need recursion.
- Consider the `satisfies` operator for better type inference and validation without altering the type itself, especially when working with complex objects or configurations that should conform to a utility type or a broader type.
- For immutable patterns, consider using `DeepReadonly` to recursively make all properties readonly, preventing accidental mutations throughout the object hierarchy.

---

## 2. Error & Result Handling Pattern

### 2.1 AppError Type

```typescript
export type ErrorCode =
  | 'auth.invalidToken'    // 401
  | 'auth.unauthorized'    // 403
  | 'user.emailTaken'      // 409
  | 'user.notFound'        // 404 (specific to user context)
  | 'notFound'             // 404 (generic resource not found)
  | 'validation'           // 400 (schema/input validation failure)
  | 'badRequest'           // 400 (generic client error)
  | 'network'              // 503 or client-side fetch issues
  | 'serverError'          // 5xx (generic server error)
  | 'unexpected';          // 500 or unhandled exceptions

export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode?: number; // HTTP status code, if applicable
  cause?: unknown;     // Original error, for debugging
}

export const makeError = (
  code: ErrorCode,
  message: string,
  cause?: unknown,
): AppError => ({
  code,
  message,
  statusCode: getStatusCode(code),
  cause,
});

// Maps ErrorCodes to appropriate HTTP status codes.
function getStatusCode(code: ErrorCode): number {
  const mapping: Record<ErrorCode, number> = {
    'auth.invalidToken': 401,
    'auth.unauthorized': 403,
    'user.emailTaken': 409,
    'user.notFound': 404,
    'notFound': 404,
    'validation': 400,
    'badRequest': 400,
    'network': 503, // Service Unavailable, or implies client-side network issue
    'serverError': 500, // Internal Server Error as a default for 5xx
    'unexpected': 500,
  };
  // Fallback for codes not explicitly in mapping (though all current ones are)
  return mapping[code] || 500;
}
```

### 2.2 Zod Adapter

```typescript
import { ZodError } from 'zod';
import { makeError, AppError, ErrorCode } from './AppError'; // Assuming AppError.ts

export const fromZod = (err: ZodError): AppError => {
  const issue = err.errors[0]; // Focus on the first error for simplicity
  const field = issue.path.join('.');
  const defaultMessage = `${field ? `${field}: ` : ''}${issue.message}`;

  // Example of mapping a specific Zod issue to a domain-specific ErrorCode.
  // This kind of mapping is highly application-specific.
  if (field === 'email' && issue.code === 'custom' /* and specific custom error key */) {
    // Assuming the custom validation for email taken sets a specific message
    return makeError('user.emailTaken', issue.message || 'This email address is already in use.', err);
  }

  return makeError(
    'validation',
    defaultMessage,
    err
  );
};
```

### 2.3 Result Helpers

```typescript
// AppError would be imported from its definition file
// import type { AppError, ErrorCode } from './AppError';


export type Result<T, E = AppError> =
  | { ok: true;  data: T }
  | { ok: false; error: E };

export const success = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const failure = <E = AppError>(error: E): Result<never, E> => ({ ok: false, error });

// Helper for async operations, ensuring errors are caught and wrapped in Result.
export async function tryAsync<T>(
  fn: () => Promise<T>,
  // Default error code if the promise rejects with an unknown error.
  // Consider if a more specific default is needed based on context.
  defaultErrorCode: ErrorCode = 'unexpected'
): Promise<Result<T, AppError>> {
  try {
    const data = await fn();
    return success(data);
  } catch (cause) {
    // If 'cause' is already an AppError, re-throw or handle as appropriate.
    // For this generic helper, we'll create a new AppError.
    if (isAppError(cause)) { // Assuming isAppError type guard exists
        return failure(cause);
    }
    // Attempt to get a meaningful message from the caught error.
    const message = cause instanceof Error ? cause.message : String(cause);
    return failure(makeError(defaultErrorCode, message, cause));
  }
}

// Simple type guard for AppError (can be expanded)
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as AppError).code === 'string' &&
    typeof (error as AppError).message === 'string'
  );
}
```

### 2.4 Usage Examples

```typescript
// Assume User type, userSchema (Zod), db client, makeError, fromZod, tryAsync, Result, success, failure are defined/imported.
// Example: import { User, userSchema } from './user.schema';
// Example: import { db } from './database';
// Example: import { makeError, fromZod, tryAsync, success, failure, Result } from './result';

export async function createUser(input: unknown): Promise<Result<User>> {
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) {
    return failure(fromZod(parsed.error));
  }

  // Domain-specific check
  const existingUser = await tryAsync(() => db.user.findUnique({
    where: { email: parsed.data.email }
  }), 'network'); // Or 'serverError' if DB interaction implies server issues

  if (!existingUser.ok) {
    // Propagate error from DB query (e.g., network error)
    return failure(existingUser.error);
  }
  if (existingUser.data) {
    return failure(makeError('user.emailTaken', 'This email address is already registered.'));
  }

  // Create user in database
  return tryAsync(
    () => db.user.create({ data: parsed.data }),
    'serverError' // More specific than 'unexpected' for DB operations
  );
}
```

## 3. UI Adapters

### 3.1 Toast Wrapper

```typescript
import { toast } from 'sonner';
// Assuming Result, AppError, ErrorCode, humanise are defined/imported
// import type { Result, AppError, ErrorCode } from '@/lib/result'; // Adjust path
// import { humanise } from '@/lib/humanise'; // Adjust path

type ToastOptions = {
  loading?: string;
  duration?: number; // in milliseconds
};

// Displays a toast message based on the Result status.
// Returns true if the result was successful, acting as a type guard.
export function showResultToast<T>(
  title: string,
  res: Result<T, AppError>,
  options?: Pick<ToastOptions, 'duration'> & { showSuccess?: boolean } // Add option to show success toast
): res is { ok: true; data: T } {
  if (res.ok) {
    // Show success toast when explicitly enabled for consistent positive feedback
    if (options?.showSuccess) {
      toast.success(title, { 
        description: "Operation completed successfully.",
        duration: options?.duration,
      });
    }
  } else {
    toast.error(title, {
      description: humanise(res.error), // humanise maps AppError to user-friendly string
      duration: options?.duration,
    });
  }
  return res.ok;
}

// Wraps an async operation (Promise<Result<T>>) with loading, success, and error toasts.
export async function withToast<T>(
  promise: Promise<Result<T, AppError>>,
  messages: {
    loading: string;
    success: string;
    error?: string; // Optional custom error title, defaults to 'Operation failed'
  },
  toastOptions?: Pick<ToastOptions, 'duration'>
): Promise<Result<T, AppError>> {
  const id = toast.loading(messages.loading);
  const result = await promise;

  if (result.ok) {
    toast.success(messages.success, { id, duration: toastOptions?.duration });
  } else {
    toast.error(messages.error ?? 'Operation failed', {
      id,
      description: humanise(result.error),
      duration: toastOptions?.duration,
    });
  }

  return result;
}

// Example humanise function (should be more comprehensive)
export function humanise(err: AppError): string {
  // This mapping should be extensive and cover all relevant ErrorCodes.
  const messages: Partial<Record<ErrorCode, string>> = {
    'user.emailTaken': 'This email is already registered. Please use a different email.',
    'user.notFound': 'The requested user could not be found.',
    'notFound': 'The requested resource could not be found.',
    'auth.invalidToken': 'Your session has expired. Please sign in again.',
    'auth.unauthorized': "You don't have permission to perform this action.",
    'validation': `Invalid input: ${err.message}`, // err.message from Zod often contains field info
    'badRequest': `There was a problem with your request: ${err.message}`,
    'network': 'A network error occurred. Please check your connection and try again.',
    'serverError': 'An unexpected error occurred on our server. Please try again later.',
    'unexpected': 'An unexpected error occurred. Please try again.',
  };

  const message = messages[err.code];
  
  // Log unmapped error codes for telemetry and debugging
  if (!message && err.code) {
    console.warn(`Unmapped error code: ${err.code}`, { error: err });
  }

  return message ?? err.message ?? 'An unknown error occurred.';
}
```

### 3.2 Error Boundaries

```typescript
// app/error.tsx (Next.js App Router example)
'use client';

import { useEffect } from 'react';
// IMPORTANT: Ensure these imports point to your actual module locations
// import { humanise } from '@/lib/toast'; // Contains the humanise function defined in section 3.1
// import type { AppError } from '@/lib/error'; // Contains the AppError type from section 2.1
// import { isAppError } from '@/lib/result'; // Contains the type guard from section 2.3

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // Next.js error type
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Boundary Error:", error);
  }, [error]);

  // Attempt to determine if it's an AppError for better messaging
  const displayError: { title: string; message: string } = {
    title: 'Something went wrong!',
    message: 'An unexpected error occurred. Please try again.',
  };

  if (isAppError(error)) { // isAppError is the type guard from section 2.3
    displayError.message = humanise(error);
    if (error.code === 'auth.invalidToken' || error.code === 'auth.unauthorized') {
        displayError.title = 'Access Denied';
    }
  } else if (error.message) {
    // Generic error message
    displayError.message = error.message;
  }

  return (
    <div className="error-container p-4 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-2">{displayError.title}</h2>
      <p className="text-gray-700 mb-4">{displayError.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

// isAppError function (from section 2.3, ensure it's imported or defined here)
// function isAppError(error: unknown): error is AppError { ... }
```

## 4. Async Patterns & Data Fetching

### 4.1 Typed Fetch Wrapper

```typescript
// Assuming Result, AppError, ErrorCode, makeError, success, failure are defined/imported.
// import { Result, AppError, ErrorCode, makeError, success, failure } from './result'; // Adjust path

// A typed fetch wrapper that returns a Result.
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<Result<T, AppError>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Good practice to specify accept header
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errorBody: any = null;
      let responseText = '';
      try {
        // Try to parse as JSON, but fall back to text if that fails.
        // This helps capture API error details if they are JSON-formatted.
        responseText = await res.text();
        errorBody = JSON.parse(responseText);
      } catch (e) {
        // If parsing fails, responseText still holds the raw text.
      }

      // Ideal scenario: API returns a structured error object like { code: ErrorCode, message: string }
      // If errorBody has 'code' and 'message', we could use that directly.
      // For this example, we primarily map from HTTP status codes.
      // if (errorBody && typeof errorBody.code === 'string' && typeof errorBody.message === 'string') {
      //   return failure(makeError(errorBody.code as ErrorCode, errorBody.message, { status: res.status, body: errorBody }));
      // }

      let errorCode: ErrorCode = 'unexpected';
      const status = res.status;

      if (status === 400) errorCode = 'badRequest';
      else if (status === 401) errorCode = 'auth.invalidToken';
      else if (status === 403) errorCode = 'auth.unauthorized';
      else if (status === 404) errorCode = 'notFound';
      else if (status === 409) errorCode = 'user.emailTaken'; // Example: Conflict
      else if (status >= 400 && status < 500) errorCode = 'badRequest'; // Broader client error
      else if (status >= 500 && status < 600) errorCode = 'serverError';

      const message = errorBody?.message || responseText.substring(0, 200) || `HTTP Error: ${status} ${res.statusText}`;
      return failure(makeError(errorCode, message, { status, body: responseText.substring(0,500) }));
    }

    // Assuming successful responses are JSON. Adjust if not always the case.
    const data = await res.json() as T;
    return success(data);

  } catch (cause) {
    // This typically catches network errors (DNS, connection refused, etc.)
    if (cause instanceof Error && cause.name === 'AbortError') {
        return failure(makeError('network', 'Request aborted.', cause));
    }
    return failure(makeError('network', 'Network request failed. Please check your connection.', cause));
  }
}

/*
// Usage example:
async function getUsers(): Promise<Result<User[]>> {
  const result = await fetchApi<User[]>('/api/users');
  if (result.ok) {
    console.log('Users:', result.data);
  } else {
    console.error('Failed to fetch users:', result.error.message, result.error.code);
  }
  return result;
}
*/
```

> **Note on fetchApi**: Ideally, your backend API should consistently return structured JSON errors (e.g., `{ "code": "some.code", "message": "Detailed error message" }`). The `fetchApi` wrapper can then parse this for more precise error handling, rather than relying solely on HTTP status codes. The example above includes a placeholder for this logic.

### 4.2 React Query Integration

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Assuming fetchApi, Result, AppError, User types are available
// import { fetchApi } from './fetchApi';
// import type { Result, AppError } from './result';
// import type { User } from './user';

// Query key factory for consistency and type safety
export const queryKeys = {
  all: ['root'] as const, // A common root key
  users: () => [...queryKeys.all, 'users'] as const,
  userLists: (filters?: Record<string, any>) => [...queryKeys.users(), 'list', filters ?? {}] as const,
  userDetail: (id: string | number) => [...queryKeys.users(), 'detail', id] as const,
  // Add more domain-specific keys as needed
} as const;

// Typed query hook using the fetchApi wrapper
export function useUser(id: string) {
  return useQuery<User, AppError>({ // Explicitly type data and error types
    queryKey: queryKeys.userDetail(id),
    queryFn: async () => {
      const result = await fetchApi<User>(`/api/users/${id}`);
      if (!result.ok) {
        // React Query expects the queryFn to throw an error on failure
        throw result.error;
      }
      return result.data;
    },
    // Recommended query options for optimal UX
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    retry: (failureCount, error) => {
      // Retry network errors up to 3 times, but not auth errors
      if (error.code === 'network' && failureCount < 3) return true;
      if (error.code === 'auth.invalidToken' || error.code === 'auth.unauthorized') return false;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

// Typed mutation hook with optimistic updates example
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, AppError, { id: string; data: Partial<User> }>({
    mutationFn: async ({ id, data }) => {
      const result = await fetchApi<User>(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async ({ id, data: newData }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.userDetail(id) });

      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData<User>(queryKeys.userDetail(id));

      // Optimistically update to the new value
      if (previousUserData) {
        queryClient.setQueryData<User>(queryKeys.userDetail(id), {
          ...previousUserData,
          ...newData,
        });
      }

      // Return a context object with the snapshotted value
      return { previousUserData };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, { id }, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(queryKeys.userDetail(id), context.previousUserData);
      }
      // Optionally, display a toast or handle the error
      // toast.error(`Failed to update user: ${humanise(err)}`);
    },
    // Always refetch after error or success:
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.userLists() }); // Invalidate lists too
    },
  });
}
```

## 5. Type Guards & Assertions

### 5.1 Type Guard Patterns

```typescript
// Basic type guards
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null; // Checks for both null and undefined
}

// Array filtering with type guards
// const mixedArray = ['a', null, 'b', undefined, 'c', 0];
// const stringArray: string[] = mixedArray.filter(isString);
// const nonNullArray: ('a' | 'b' | 'c' | 0)[] = mixedArray.filter(isNonNull);


// Object property existence and type guard
export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return obj != null && typeof obj === 'object' && key in obj;
}

// Example: Guarding for a specific property type
export function hasStringProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, string> {
  return hasProperty(obj, key) && typeof obj[key] === 'string';
}


// Discriminated union guards
type Action =
  | { type: 'SET_USER'; payload: User } // Assuming User type is defined
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; error: AppError }; // Assuming AppError type is defined

export function isSetUserAction(action: Action): action is { type: 'SET_USER'; payload: User } {
  return action.type === 'SET_USER';
}

export function isLogoutAction(action: Action): action is { type: 'LOGOUT' } {
  return action.type === 'LOGOUT';
}

export function isSetErrorAction(action: Action): action is { type: 'SET_ERROR'; error: AppError } {
  return action.type === 'SET_ERROR';
}
```

### 5.2 Assertion Functions

```typescript
// Asserts a condition is true, otherwise throws an error.
// The 'asserts condition' part is crucial for type narrowing.
export function assert(condition: unknown, message?: string | (() => string)): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message ?? 'Assertion failed');
  }
}

// Asserts a value is non-null and non-undefined.
export function assertNonNull<T>(value: T | null | undefined, message?: string | (() => string)): asserts value is T {
    assert(value != null, message ?? `Value should be non-null, but received ${value}`);
}


// Ensures exhaustive checks in switch statements or conditional logic.
// If a new case is added to a union type and not handled, this will cause a compile-time error.
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${JSON.stringify(value)}`);
}

/*
// Usage in exhaustive checks
function handleAction(action: Action) {
  switch (action.type) {
    case 'SET_USER':
      // action.payload is User
      return console.log(action.payload);
    case 'LOGOUT':
      return console.log('Logged out');
    case 'SET_ERROR':
      // action.error is AppError
      return console.error(action.error.message);
    default:
      // If a new Action type is added and not handled above,
      // 'action' will not be 'never', leading to a TypeScript error here.
      assertNever(action, `Unhandled action type: ${(action as Action).type}`);
  }
}
*/
```

## 6. Schema & Validation Patterns

### 6.1 Zod Schema Composition

```typescript
import { z } from 'zod';

// Base schemas for reusability and consistency
const idSchema = z.string().uuid({ message: "Invalid ID format" });
const emailSchema = z.string().email({ message: "Invalid email address" }).toLowerCase().trim();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long");

// Timestamps: Use z.date() if you transform strings to Date objects,
// or z.string().datetime() for ISO string representation.
const isoTimestampSchema = z.string().datetime({ message: "Invalid ISO timestamp format" });
// const dateTimestampSchema = z.preprocess((arg) => {
//   if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
// }, z.date());


// Domain schema for a User
export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  role: z.enum(['admin', 'user', 'guest'], { errorMap: () => ({ message: "Invalid role" }) }),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
  bio: z.string().max(500, "Bio is too long").optional().nullable(), // Example optional and nullable field
  metadata: z.record(z.string(), z.unknown()).optional(), // For unstructured extra data
});

// Derive TypeScript types directly from Zod schemas
export type User = z.infer<typeof userSchema>;

// Input schema for creating a new user (e.g., from a form or API request)
export const createUserSchema = userSchema
  .omit({ id: true, createdAt: true, updatedAt: true }) // These are typically server-generated
  .extend({
    password: passwordSchema,
    confirmPassword: passwordSchema, // Or z.string() if only checking equality
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Path of the error (on the confirmPassword field)
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Input schema for updating an existing user (all fields optional)
export const updateUserSchema = userSchema
  .omit({ id: true, createdAt: true, updatedAt: true, email: true }) // Often email is not updatable or has a special process
  .partial() // Makes all remaining fields optional
  .extend({
    // If password update is allowed, include it here, possibly with currentPassword for verification
    // currentPassword: passwordSchema.optional(),
    // newPassword: passwordSchema.optional(),
  })
  // .refine(...); // Add refinements if needed for updates

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### 6.2 Form Integration

```typescript
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodError } from 'zod';
// Assuming createUserSchema, CreateUserInput, createUser (API function), showResultToast are imported
// import { createUserSchema, CreateUserInput } from './user.schema';
// import { createUser } from './user.api';
// import { showResultToast } from './toast';
// import { AppError } from './error';

export function UserRegistrationForm() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'user', // Sensible default
      password: '',
      confirmPassword: '',
      // bio: null, // Explicitly null if that's the desired default for nullable
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = form;

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    // The 'data' is already validated by Zod via react-hook-form
    const result = await createUser(data); // createUser is your API call function

    if (!result.ok) {
      const appError = result.error as AppError; // Type assertion if needed
      // Map API errors back to form fields
      if (appError.code === 'user.emailTaken') {
        setError('email', {
          type: 'manual', // Or 'server'
          message: appError.message, // Use human-friendly message from AppError
        });
      } else if (appError.code === 'validation' && appError.cause instanceof ZodError) {
        // Handle detailed validation errors from server if they exist and map to fields
        appError.cause.errors.forEach(err => {
            const field = err.path.join('.') as keyof CreateUserInput;
            if (field) {
                setError(field, { type: 'server', message: err.message });
            }
        });
      } else {
        // Generic error toast for other unmapped errors
        showResultToast('Registration Failed', result);
      }
      return;
    }

    // Success handling
    showResultToast('Registration Successful', result);
    form.reset(); // Optionally reset form on success
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Example Field: Email */}
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      {/* ... other form fields for name, password, confirmPassword, role ... */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

## 7. Pitfalls & Lint Rules

### 7.1 Common Gotchas

| Gotcha                                                                            | Guardrail / Solution                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `instanceof Error` fails across realms (e.g., Web Workers, iframes, Edge Runtime) | Prefer duck-typing for error shapes: `typeof e === 'object' && e !== null && 'message' in e`. Use the `isAppError` guard.                                                                                                                                                                                                     |
| Missing return type on public/exported helper functions                           | Enable `@typescript-eslint/explicit-module-boundary-types` or `@typescript-eslint/explicit-function-return-type` for exported functions to ensure API contracts are clear.                                                                                                                                                    |
| Direct `toast.error(...)` calls scattered, bypassing humanise or Result logic     | Create a custom ESLint rule (e.g., `no-direct-toast-error`) that enforces using approved wrappers like `showResultToast` or `withToast`.                                                                                                                                                                                      |
| Unchecked Result objects (ignoring the error case)                                | Utilize ESLint plugins like `eslint-plugin-result` (if available and suitable), `eslint-plugin-functional` (e.g., `no-expression-statement` for functions returning Result), or implement custom lint rules to ensure Result types are always checked (e.g., via an `if (!result.ok)` block).                                 |
| Throwing non-Error objects (`throw "oops"`)                                       | Enable ESLint rules `no-throw-literal` (built-in) and `@typescript-eslint/no-throw-literal` (more robust for TS) to enforce throwing actual Error instances or AppError objects.                                                                                                                                              |
| Implicit `any` in catch blocks (`catch (e)`)                                      | Use `unknown` for catch clause variables (`catch (e: unknown)`). Enable `@typescript-eslint/no-explicit-any` and consider `@typescript-eslint/use-unknown-in-catch-callback-variable` (though explicit `unknown` is often preferred). Then, perform type narrowing (e.g., `if (e instanceof Error)` or `if (isAppError(e))`). |
| Over-reliance on type assertions (`as Foo`)                                       | Prefer type guards, `satisfies` operator, or schema validation to achieve type safety. Use assertions as a last resort when you have more knowledge than the compiler.                                                                                                                                                        |
| Modifying objects received as props/arguments                                     | Treat props and arguments as immutable where possible. Use `Readonly<T>` or `readonly` modifiers. For updates, create new objects/arrays.                                                                                                                                                                                     |

### 7.2 ESLint Configuration

> **Note**: This is a snippet. A full ESLint config would include parser, plugins, extends, etc. Consider extending from `plugin:@typescript-eslint/recommended-type-checked` for a strong, type-aware baseline.
>
> **Required setup**:
>
> - Parser: `@typescript-eslint/parser`
> - Plugins: `@typescript-eslint/eslint-plugin`
> - Extends: `["eslint:recommended", "plugin:@typescript-eslint/recommended"]`
> - ParserOptions: `{ project: true }` for type-aware rules

```json
{
  "rules": {
    // Enforce explicit return types on exported functions/methods
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    // Disallow throwing anything other than Error objects or objects that extend Error
    "@typescript-eslint/no-throw-literal": "error",
    // Prefer 'unknown' for catch clause variables
    // "@typescript-eslint/use-unknown-in-catch-callback-variable": "warn", // Or handle manually with 'e: unknown'
    // Enforce stricter boolean expressions (e.g., no '!!variable' if 'variable' is already boolean)
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      "allowString": false,
      "allowNumber": false,
      "allowNullableObject": false, // Consider true if you often check objects for null/undefined
      "allowNullableBoolean": false,
      "allowNullableString": false,
      "allowNullableNumber": false
    }],
    // Warns about conditions that are always true or false, often indicating a bug
    "@typescript-eslint/no-unnecessary-condition": "warn",
    // Disallow assigning 'any' to a variable or property
    "@typescript-eslint/no-unsafe-assignment": "warn", // Consider "error" for stricter projects
    // Disallow member access on 'any' typed variables
    "@typescript-eslint/no-unsafe-member-access": "warn",
    // Disallow calling 'any' typed variables as functions
    "@typescript-eslint/no-unsafe-call": "warn",
    // Prevents common mistakes with Promises (e.g., forgetting await in async function)
    "@typescript-eslint/no-misused-promises": ["error", {
      "checksVoidReturn": {
        "attributes": false // Allow async event handlers like onClick={async () => {...}} without explicit void return
      }
    }],
    // Standard ESLint rule, good to have alongside the TS version
    "no-throw-literal": "error",
    // Consider adding rules for consistent import sorting, naming conventions, etc.
    // "import/order": ["warn", { ... }],
    // "@typescript-eslint/naming-convention": ["warn", { ... }]
  }
}
```

### 7.3 TypeScript Configuration

> **Note**: This is a snippet of `compilerOptions`. A full `tsconfig.json` includes `include`, `exclude`, etc.

```json
{
  "compilerOptions": {
    // Core Strictness
    "strict": true, // Enables all strict type-checking options

    // Additional Strict Checks (often enabled by 'strict: true', but good to be explicit)
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true, // Parse in strict mode and emit "use strict"

    // Enhanced Safety & Correctness
    "noUncheckedIndexedAccess": true, // Accessing an array/object element by index/key might be undefined
    "exactOptionalPropertyTypes": true, // Optional properties cannot be assigned 'undefined' explicitly unless 'undefined' is in the type
    "noPropertyAccessFromIndexSignature": true, // Prefer indexed access 'obj[key]' over 'obj.key' for index signatures
    "noImplicitOverride": true, // Ensures 'override' keyword is used when overriding methods from a base class

    // Code Quality & Consistency
    "allowUnreachableCode": false, // Disallow unreachable code
    "allowUnusedLabels": false, // Disallow unused labels
    "noFallthroughCasesInSwitch": true, // Require 'break' or 'return' in switch cases
    "forceConsistentCasingInFileNames": true, // Important for case-sensitive file systems

    // Module System & Interoperability
    "module": "esnext", // Or "commonjs", "node16"/"nodenext" depending on target environment
    "moduleResolution": "bundler", // Or "node16"/"nodenext", aligns with modern bundlers & Node.js
    "esModuleInterop": true, // Improves compatibility with CommonJS modules (often default with modern module settings)
    "verbatimModuleSyntax": true, // Recommended for new projects; avoids ambiguity in module interpretation
    "isolatedModules": true, // Ensures files can be transpiled independently (required by some tools like Babel, esbuild)

    // Output
    "target": "ES2020", // Or newer, depending on your runtime environment support
    "lib": ["dom", "dom.iterable", "esnext"], // Standard libraries
    "jsx": "preserve", // Or "react-jsx" for automatic JSX runtime

    // Other useful options
    "skipLibCheck": true, // Speeds up compilation by not type-checking declaration files (.d.ts)
    "resolveJsonModule": true // Allows importing .json files
  }
}
```

> **One-liner philosophy**: Derive > Duplicate · Normalise early (data & errors) · Surface meaning only at the edge (UI/API boundaries) · Type narrowing > Type casting

Keep this doc close to your project template so agents & humans share the same contract.

## 8. TypeScript Everywhere

### 8.1 Configuration and Build Files

**Principle**: Use TypeScript for all project files, including configuration and build scripts.

#### Why TypeScript for Everything?

1. **Type Safety Throughout**: Config errors caught at compile time, not runtime
2. **Consistency**: Single language across your entire codebase
3. **Better Refactoring**: Find all references works across config files
4. **IDE Support**: Full IntelliSense for your build scripts and configs

#### Implementation Guidelines

```typescript
// eslint.config.ts (instead of .eslintrc.js)
import type { Linter } from 'eslint';

export default {
  rules: {
    // Type-safe rule configuration
  }
} satisfies Linter.Config;

// vite.config.ts (instead of vite.config.js)
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

export default defineConfig(({ mode }): UserConfig => ({
  // Type-safe Vite configuration
}));

// build-scripts/publish.ts (instead of shell scripts where possible)
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import type { PackageJson } from 'type-fest';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageJson;
// Type-safe package.json access
```

#### File Conversion Strategy

| File Type | Keep As-Is | Convert To TypeScript |
|-----------|------------|----------------------|
| `package.json` | ✓ (Required by npm) | - |
| `tsconfig.json` | ✓ (Supports comments) | - |
| `.eslintrc.js` | - | ✓ `.eslintrc.ts` or `eslint.config.ts` |
| `*.config.js` | - | ✓ `*.config.ts` |
| Build scripts | - | ✓ TypeScript with `tsx` or `ts-node` |
| Test files | - | ✓ Always TypeScript |

#### Execution Strategies

```json
// package.json scripts using tsx for direct TS execution
{
  "scripts": {
    "build": "tsx scripts/build.ts",
    "lint:custom": "tsx scripts/lint-custom-rules.ts"
  }
}
```

#### Benefits in Practice

```typescript
// shared/types.ts - Shared across app and config
export const ERROR_CODES = {
  AUTH_INVALID: 'auth.invalid',
  USER_NOT_FOUND: 'user.notFound',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// eslint-rules/no-direct-error.ts - Can import app types!
import { ERROR_CODES } from '../shared/types';

export default {
  create(context) {
    // Your rule can use the same types as your app
  }
};
```

### 8.2 Migration Checklist

When converting JavaScript files to TypeScript:

1. **Add `.ts` extension** (or `.mts` for explicit ESM)
2. **Add type imports** for dependencies
3. **Replace `module.exports` with `export`**
4. **Replace `require()` with `import`**
5. **Add explicit types** where inference fails
6. **Use `satisfies` operator** for config objects
7. **Enable `allowJs` temporarily** during migration

## 9. Quick Reference Card

Most-used patterns at a glance:

```typescript
// Result pattern for all fallible operations (async or sync)
async function fetchData(): Promise<Result<Data, AppError>> { /* ... */ }
const result = await fetchData();
if (!result.ok) {
  // Log, show toast, or map to UI error state
  return handleError(result.error);
}
const data = result.data; // data is typed and safe to use

// Type guards for narrowing unknown or union types
function processValue(value: unknown) {
  if (isString(value)) {
    // value is string here
  } else if (isAppError(value)) {
    // value is AppError here
  }
}

// Zod for schema definition and validation (single source of truth)
import { z } from 'zod';
const mySchema = z.object({ id: z.string().uuid(), name: z.string() });
type MyType = z.infer<typeof mySchema>;
function parseInput(input: unknown): Result<MyType, AppError> {
  const parsed = mySchema.safeParse(input);
  if (!parsed.success) return failure(fromZod(parsed.error)); // fromZod maps ZodError to AppError
  return success(parsed.data);
}

// React Query keys for structured cache management
// import { queryKeys } from './queryKeys';
// queryClient.invalidateQueries({ queryKey: queryKeys.users() });
// const { data } = useQuery({ queryKey: queryKeys.userDetail(id), queryFn: ... });

// Composition over duplication for schemas and types
// const baseUserSchema = z.object({ email: z.string(), name: z.string() });
// const createUserSchema = baseUserSchema.extend({ password: z.string() });
// const updateUserSchema = baseUserSchema.partial(); // All fields optional
```
