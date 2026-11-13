import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

export class FlyGraphQLError extends Error {
	constructor(public readonly errors: { message: string }[]) {
		super(errors.map((error) => error.message).join('; '));
		this.name = 'FlyGraphQLError';
	}
}

const responseSchema = z.object({
	// The selected field differs per document; its operation-specific schema parses it later.
	data: z.record(z.string(), z.unknown()).nullable().optional(),
	errors: z.array(z.object({ message: z.string() }).passthrough()).optional(),
});

/**
 * Execute a fixed operation. Variable shapes differ across operations and are
 * validated by their input schemas before reaching this shared transport;
 * selected response values remain untyped until the caller's output schema parses them.
 */
export async function makeFlyRequest(
	token: string,
	query: string,
	variables: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	if (!token.trim()) throw new AuthMissingError('fly', 'api_key');
	const config: OpenAPIConfig = {
		BASE: 'https://api.fly.io',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Bearer ${token}` },
	};
	const options: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		mediaType: 'application/json',
		body: { query, variables },
	};
	// HTTP response bodies are untrusted until the GraphQL envelope is parsed.
	const response = responseSchema.parse(
		await request<unknown>(config, options, {
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: { retryAfter: 'retry-after' },
			},
		}),
	);
	if (response.errors?.length) throw new FlyGraphQLError(response.errors);
	if (!response.data) throw new Error('Fly GraphQL returned no data');
	return response.data;
}
