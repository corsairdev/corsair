import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

const GraphErrorSchema = z.object({
	error: z.object({
		message: z.string(),
		type: z.string().optional(),
		code: z.number().optional(),
		error_subcode: z.number().optional(),
		fbtrace_id: z.string().optional(),
		error_data: z
			.object({
				details: z.string().optional(),
				messaging_product: z.string().optional(),
			})
			.loose()
			.optional(),
	}),
});

export class WhatsappAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: number,
		public readonly subcode?: number,
		public readonly traceId?: string,
	) {
		super(message);
		this.name = 'WhatsappAPIError';
	}
}

const WHATSAPP_API_BASE = 'https://graph.facebook.com';
export const WHATSAPP_GRAPH_API_VERSION = 'v24.0';

const WHATSAPP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
	isRateLimitError: (status, body) => {
		if (status === 429) return true;
		const parsed = GraphErrorSchema.safeParse(body);
		return (
			parsed.success &&
			[4, 17, 32, 613, 80007].includes(parsed.data.error.code ?? 0)
		);
	},
};

export type WhatsappRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Graph request bodies can vary by endpoint; endpoint schemas validate them before this boundary.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeWhatsappRequest<T>(
	endpoint: string,
	accessToken: string,
	options: WhatsappRequestOptions = {},
): Promise<T> {
	if (!accessToken.trim()) {
		throw new WhatsappAPIError('WhatsApp access token is required', 401);
	}

	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: WHATSAPP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${WHATSAPP_GRAPH_API_VERSION}/${endpoint.replace(/^\//, '')}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: WHATSAPP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof WhatsappAPIError) throw error;
		if (error instanceof ApiError) {
			const parsed = GraphErrorSchema.safeParse(error.body);
			if (parsed.success) {
				const graphError = parsed.data.error;
				throw new WhatsappAPIError(
					graphError.error_data?.details ?? graphError.message,
					error.status,
					graphError.code,
					graphError.error_subcode,
					graphError.fbtrace_id,
				);
			}
			throw new WhatsappAPIError(error.message, error.status);
		}
		if (error instanceof Error) {
			throw new WhatsappAPIError(error.message);
		}
		throw new WhatsappAPIError('Unknown WhatsApp API error');
	}
}
