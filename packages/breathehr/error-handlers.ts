import type { CorsairErrorHandler } from 'corsair/core';
import { BreatheHRApiError } from './client';

export const errorHandlers: CorsairErrorHandler = {
  matches: (error: unknown): error is BreatheHRApiError => {
    return error instanceof BreatheHRApiError;
  },
  handle: (error: BreatheHRApiError) => {
    switch (error.status) {
      case 400:
        return { message: 'Bad Request: The request was malformed or missing parameters.', retryable: false };
      case 401:
        return { message: 'Unauthorized: Invalid or missing Breathe HR API Key.', retryable: false };
      case 403:
        return { message: 'Forbidden: You do not have permission for this resource.', retryable: false };
      case 404:
        return { message: 'Not Found: Resource does not exist.', retryable: false };
      case 422:
        return { message: 'Unprocessable Entity: Validation failed.', retryable: false };
      case 429:
        return { message: 'Rate Limit Exceeded: Please back off.', retryable: true };
      case 500:
      case 502:
      case 503:
        return { message: 'Breathe HR Server Error.', retryable: true };
      default:
        return { message: error.message || 'Unexpected Breathe HR Error', retryable: false };
    }
  },
};
