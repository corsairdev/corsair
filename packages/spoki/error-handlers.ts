import { SpokiApiError } from './client';

export async function errorHandlers(error: unknown) {
	if (error instanceof SpokiApiError) {
		return {
			message: error.message,
			code: `SPOKI_${error.status}`,
			retryable: error.status === 429 || error.status >= 500,
		};
	}

	if (error instanceof Error) {
		return {
			message: error.message,
			retryable: false,
		};
	}

	return {
		message: 'Unknown Spoki error',
		retryable: false,
	};
}
