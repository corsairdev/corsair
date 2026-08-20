import { ApiError } from 'corsair/http';
import type { CorsairErrorHandler } from 'corsair/core';
import { AeroleadsAPIError } from './client';

export const errorHandlers = {
  RATE_LIMIT_ERROR: {
    match: (error: Error) => {
      // The plugin's client re-throws all upstream errors as
      // AeroleadsAPIError (preserving status + retryAfter from ApiError).
      // Match both shapes so retries fire regardless of which layer the
      // error surfaces from.
      if (error instanceof ApiError && error.status === 429) return true;
      if (error instanceof AeroleadsAPIError && error.status === 429) return true;
      const msg = error.message.toLowerCase();
      return msg.includes('rate_limited') || msg.includes('429');
    },
    handler: async (error: Error) => {
      let retryAfterMs: number | undefined;
      if (error instanceof ApiError && error.retryAfter !== undefined) {
        retryAfterMs = error.retryAfter;
      } else if (
        error instanceof AeroleadsAPIError &&
        error.retryAfter !== undefined
      ) {
        retryAfterMs = error.retryAfter;
      }
      return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
    },
  },
  AUTH_ERROR: {
    match: (error: Error) => {
      if (error instanceof ApiError && error.status === 401) return true;
      if (error instanceof AeroleadsAPIError && error.status === 401) return true;
      const msg = error.message.toLowerCase();
      return msg.includes('unauthorized') || msg.includes('invalid_auth');
    },
    handler: async () => ({ maxRetries: 0 }),
  },
  DEFAULT: {
    match: () => true,
    handler: async () => ({ maxRetries: 0 }),
  },
} satisfies CorsairErrorHandler;