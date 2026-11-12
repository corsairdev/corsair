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

const OpenApiCallInputSchema = z
	.object({
		path: z.record(z.string(), z.unknown()).default({}),
		query: z.record(z.string(), z.unknown()).default({}),
		headers: z.record(z.string(), z.unknown()).default({}),
		cookies: z.record(z.string(), z.unknown()).default({}),
		body: z.unknown().optional(),
	})
	.strict();

export type OpenApiCallInput = z.input<typeof OpenApiCallInputSchema>;

export type OpenApiEndpointConfig = {
	family: OpenApiFamily;
	path: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
	operationId: string;
	mediaType?: string;
	public?: boolean;
	oauth2Allowed?: boolean;
	inputSchema: z.ZodTypeAny;
	outputSchema: z.ZodTypeAny;
};

function flattenQuery(query: Record<string, unknown>): Record<string, unknown> {
	const flattened: Record<string, unknown> = {};
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

export function createOpenApiEndpoint(
	config: OpenApiEndpointConfig,
): CorsairEndpoint<DigicertContext, OpenApiCallInput, unknown> {
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
