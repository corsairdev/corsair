import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

export class FixerAPIError extends Error {
	constructor(
		message: string,
		public readonly code: number,
		public readonly type?: string,
	) {
		super(message);
		this.name = 'FixerAPIError';
	}
}

const FIXER_CONFIG: OpenAPIConfig = {
	BASE: 'https://data.fixer.io/api',
	VERSION: 'v1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'omit',
};

// Retries belong to the plugin error handlers, so the transport must not
// retry on its own and multiply the attempts.
const FIXER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// Fixer reports most failures as HTTP 200 with `success: false`.
const FixerErrorEnvelopeSchema = z.object({
	success: z.literal(false),
	error: z.object({
		code: z.number(),
		type: z.string().optional(),
		info: z.string().optional(),
	}),
});

// Safe: every caller parses the body with its endpoint's zod output schema.
// A narrower type is not practical because each Fixer path returns a different shape.
export async function makeFixerRequest(
	path: string,
	accessKey: string,
	query: Record<string, string | number | undefined> = {},
): Promise<unknown> {
	// Safe: the body is checked against the error envelope before it is returned.
	// A narrower type is not practical because the shape depends on the path.
	const body = await request<unknown>(
		FIXER_CONFIG,
		{
			method: 'GET',
			url: `/${path}`,
			query: { access_key: accessKey, ...query },
		},
		{ rateLimitConfig: FIXER_RATE_LIMIT_CONFIG },
	);

	const failure = FixerErrorEnvelopeSchema.safeParse(body);
	if (failure.success) {
		const { code, type, info } = failure.data.error;
		throw new FixerAPIError(info ?? type ?? 'Fixer API error', code, type);
	}

	return body;
}
