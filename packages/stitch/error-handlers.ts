import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { StitchAPIError } from './client';

export const errorHandlers: CorsairErrorHandler = {
  'stitch': {
    match: (error: unknown) => error instanceof StitchAPIError,
    handler: async (error: unknown): Promise<RetryStrategy> => {
      if (error instanceof StitchAPIError) {
        if (error.status === 401) {
          return {
            maxRetries: 0,
          };
        }
        if (error.status === 429) {
          return {
            maxRetries: 3,
            retryStrategy: 'exponential_backoff_jitter',
          };
        }
        if (error.status && error.status >= 500) {
          return {
            maxRetries: 2,
            retryStrategy: 'linear_2s',
          };
        }
      }
      return {
        maxRetries: 0,
      };
    },
  },
};
