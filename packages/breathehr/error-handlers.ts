import type { CorsairErrorHandler, ErrorContext, RetryStrategy } from 'corsair/core';
import { BreatheHRApiError } from './client';

export const errorHandlers: CorsairErrorHandler = {
  'breathehr-api': {
    match: (error: unknown): error is BreatheHRApiError => {
      return error instanceof BreatheHRApiError;
    },
    handler: async (error: BreatheHRApiError, ctx: ErrorContext): Promise<RetryStrategy> => {
      switch (error.status) {
        case 400:
          return {
            shouldRetry: false,
            message: 'Bad Request: The request was malformed or missing parameters.',
          };
        case 401:
          return {
            shouldRetry: false,
            message: 'Unauthorized: Invalid or missing Breathe HR API Key.',
          };
        case 403:
          return {
            shouldRetry: false,
            message: 'Forbidden: You do not have permission for this resource.',
          };
        case 404:
          return {
            shouldRetry: false,
            message: 'Not Found: Resource does not exist.',
          };
        case 422:
          return {
            shouldRetry: false,
            message: 'Unprocessable Entity: Validation failed.',
          };
        case 429:
          return {
            shouldRetry: true,
            message: 'Rate Limit Exceeded: Please back off.',
            delayMs: 5000,
          };
        case 500:
        case 502:
        case 503:
          return {
            shouldRetry: true,
            message: 'Breathe HR Server Error.',
            delayMs: 3000,
          };
        default:
          return {
            shouldRetry: false,
            message: error.message || 'Unexpected Breathe HR Error',
          };
      }
    },
  },
};