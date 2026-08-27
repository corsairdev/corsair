export interface DocusignErrorResponse {
	status?: number;
	statusCode?: number;
	message?: string;
	errorCode?: string;
	response?: {
		status?: number;
		data?: unknown;
		headers?: Record<string, string>;
	};
	headers?: Record<string, string>;
}

export const docusignErrorHandlers = {
	rateLimit: {
		match: (error: unknown): boolean => {
			if (!error || typeof error !== 'object') {
				return false;
			}
			const err = error as DocusignErrorResponse;
			return (
				err.status === 429 ||
				err.statusCode === 429 ||
				err.response?.status === 429 ||
				Boolean(
					err.message &&
						(err.message.includes('429') ||
							err.message.toLowerCase().includes('rate limit') ||
							err.message.includes('RATE_LIMIT_EXCEEDED')),
				)
			);
		},
		handler: (error: unknown) => {
			const err = error as DocusignErrorResponse;
			const retryAfter =
				err.headers?.['retry-after'] ||
				err.response?.headers?.['retry-after'] ||
				'60';
			return {
				action: 'retry' as const,
				type: 'rate_limit' as const,
				retryAfter: Number.parseInt(String(retryAfter), 10) || 60,
				message: 'DocuSign API rate limit exceeded. Retry after delay.',
			};
		},
	},
	auth: {
		match: (error: unknown): boolean => {
			if (!error || typeof error !== 'object') {
				return false;
			}
			const err = error as DocusignErrorResponse;
			return (
				err.status === 401 ||
				err.statusCode === 401 ||
				err.response?.status === 401 ||
				Boolean(
					err.message &&
						(err.message.includes('401') ||
							err.message.toLowerCase().includes('unauthorized') ||
							err.message.includes('INVALID_AUTHENTICATION')),
				)
			);
		},
		handler: (error: unknown) => {
			return {
				action: 'reauthenticate' as const,
				type: 'authentication_error' as const,
				message: 'DocuSign authentication failed or access token is expired.',
			};
		},
	},
};

export const errorHandlers = docusignErrorHandlers;
export default docusignErrorHandlers;
