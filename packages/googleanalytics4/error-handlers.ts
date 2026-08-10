import type { CorsairErrorHandler } from 'corsair/core';
import { GA4APIError } from './client';

export const errorHandlers: CorsairErrorHandler = (error) => {
  if (error instanceof GA4APIError) {
    switch (error.statusCode) {
      case 400:
        return {
          type: 'BAD_REQUEST_ERROR',
          message: `Invalid GA4 request: ${error.message}`,
        };
      case 401:
      case 403:
        return {
          type: 'AUTH_ERROR',
          message: 'GA4 authentication failed. Check your credentials and scopes.',
        };
      case 404:
        return {
          type: 'NOT_FOUND_ERROR',
          message: `GA4 resource not found: ${error.message}`,
        };
      case 429:
        return {
          type: 'RATE_LIMIT_ERROR',
          message: 'GA4 rate limit exceeded. Please retry after a delay.',
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'SERVER_ERROR',
          message: `GA4 server error: ${error.statusCode}`,
        };
      default:
        return {
          type: 'DEFAULT',
          message: error.message,
        };
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Network error')) {
      return {
        type: 'NETWORK_ERROR',
        message: error.message,
      };
    }

    if (error.message.includes('timeout')) {
      return {
        type: 'TIMEOUT_ERROR',
        message: error.message,
      };
    }
  }

  return null;
};
