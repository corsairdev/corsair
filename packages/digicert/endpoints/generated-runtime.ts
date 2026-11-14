import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { DigicertContext } from '..';
import { makeDigicertRequest } from '../client';

export type OpenApiFamily =
	| 'certcentral'
	| 'reportLibrary'
	| 'accountManager'
	| 'privateCA'
	| 'trustLifecycle'
	| 'contentTrust';

// The per-operation schema validates the exact shape. This envelope only
// forwards provider-defined JSON values to the transport, so each field stays
// unconstrained here.
const OpenApiCallInputSchema = z
	.object({
		// `unknown`: path values are validated by the operation schema before transport.
		path: z.record(z.string(), z.unknown()).default({}),
		// `unknown`: query values are validated by the operation schema before transport.
		query: z.record(z.string(), z.unknown()).default({}),
		// `unknown`: header values are validated by the operation schema before transport.
		headers: z.record(z.string(), z.unknown()).default({}),
		// `unknown`: cookie values are validated by the operation schema before transport.
		cookies: z.record(z.string(), z.unknown()).default({}),
		// `unknown`: body values are validated by the operation schema before transport.
		body: z.unknown().optional(),
	})
	.strict();

export type OpenApiCallInput = z.input<typeof OpenApiCallInputSchema>;

export type OpenApiEndpointConfig<
	InputSchema extends z.ZodTypeAny = z.ZodTypeAny,
	OutputSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
	family: OpenApiFamily;
	path: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	operationId: string;
	mediaType?: string;
	public?: boolean;
	oauth2Allowed?: boolean;
	/** `binary` returns the raw body bytes instead of decoding a JSON/text body. */
	responseType?: 'json' | 'binary';
	inputSchema: InputSchema;
	outputSchema: OutputSchema;
};

// Query values are provider-defined JSON scalars or arrays; the per-operation
// schema validates the exact query shape before this helper flattens it.
// `unknown`: nested shapes differ between operations and are only serialized here.
function flattenQuery(query: Record<string, unknown>): Record<string, unknown> {
	// `unknown`: callers validate query values before flattening and serialization.
	const flattened: Record<string, unknown> = {};
	// `unknown`: query values are already schema-checked; this only flattens nested objects.
	const visit = (key: string, value: unknown): void => {
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			for (const [nestedKey, nestedValue] of Object.entries(value)) {
				visit(key ? key + '[' + nestedKey + ']' : nestedKey, nestedValue);
			}
		} else {
			flattened[key] = value;
		}
	};
	for (const [key, value] of Object.entries(query)) visit(key, value);
	return flattened;
}

export function createOpenApiEndpoint<
	InputSchema extends z.ZodTypeAny,
	OutputSchema extends z.ZodTypeAny,
>(
	config: OpenApiEndpointConfig<InputSchema, OutputSchema>,
): CorsairEndpoint<
	DigicertContext,
	z.input<InputSchema>,
	z.output<OutputSchema>
> {
	return async (ctx, input) => {
		if (
			ctx.options.authType === 'oauth_2' &&
			!config.oauth2Allowed &&
			!config.public
		) {
			throw new AuthMissingError('digicert', 'api_key');
		}
		const validatedInput = config.inputSchema.parse(input);
		const call = OpenApiCallInputSchema.parse(validatedInput);
		let body = call.body;
		// `unknown`: multipart fields are provider-defined until the transport serializes them.
		let formData: Record<string, unknown> | undefined;
		let mediaType = config.mediaType;

		if (
			mediaType?.toLowerCase().startsWith('multipart/form-data') &&
			typeof body === 'object' &&
			body !== null &&
			!Array.isArray(body)
		) {
			formData = Object.fromEntries(Object.entries(body));
			body = undefined;
			mediaType = undefined;
		}
		if (
			mediaType === 'application/x-www-form-urlencoded' &&
			typeof body === 'object' &&
			body !== null &&
			!Array.isArray(body)
		) {
			body = new URLSearchParams(
				Object.fromEntries(
					Object.entries(body).map(([key, value]) => [key, String(value)]),
				),
			).toString();
		}
		if (
			mediaType === 'application/x-pki-message' &&
			Array.isArray(body) &&
			body.every((value) => typeof value === 'number')
		) {
			body = new Blob([Uint8Array.from(body.map((value) => Number(value)))]);
		}

		const response = await makeDigicertRequest(
			config.family,
			config.path,
			config.public ? undefined : ctx.key,
			{
				public: config.public,
				authScheme: ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key',
				method: config.method,
				region: ctx.options.certCentralRegion,
				reportRegion: ctx.options.reportRegion,
				digicertOneRegion: ctx.options.digicertOneRegion,
				path: call.path,
				query:
					config.family === 'certcentral'
						? flattenQuery(call.query)
						: call.query,
				headers: call.headers,
				cookies: call.cookies,
				body,
				formData,
				mediaType,
				binary: config.responseType === 'binary',
			},
		);
		const output = config.outputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.' + config.operationId,
			{ family: config.family, method: config.method },
			'completed',
		);
		return output;
	};
}
