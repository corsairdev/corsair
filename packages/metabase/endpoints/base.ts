import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MetabaseContext } from '..';
import type {
	JsonValue,
	MetabaseRequestOptions,
	MetabaseResponse,
} from '../client';
import { MetabaseAPIError, makeMetabaseRequest } from '../client';

export type MetabaseRequestPlan = MetabaseRequestOptions & {
	path: string;
};

export function buildMetabasePath(
	template: string,
	parameters: Record<string, JsonValue> = {},
): string {
	const path = template.replace(/\{([^{}]+)\}/gu, (_match, name: string) => {
		const value = parameters[name];
		if (value === undefined || value === null || typeof value === 'object') {
			throw new MetabaseAPIError('Metabase path parameter is invalid');
		}
		const segment = String(value);
		if (
			segment === '.' ||
			segment === '..' ||
			/[\\/?#\u0000-\u001f]/u.test(segment)
		) {
			throw new MetabaseAPIError('Metabase path parameter is invalid');
		}
		return encodeURIComponent(segment).replace(/\./gu, '%2E');
	});
	if (path.includes('{') || path.includes('}')) {
		throw new MetabaseAPIError('Metabase path is missing a required parameter');
	}
	return path;
}

export function encodeCollectionId(id: number | string): string {
	const value = String(id);
	if (value === '.' || value === '..' || /[\\/?#\u0000-\u001f]/u.test(value)) {
		throw new Error('Invalid collection ID path segment');
	}
	return encodeURIComponent(value).replace(/\./gu, '%2E');
}

export function createMetabaseEndpoint<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(
	operation: string,
	inputSchema: InputSchema,
	outputSchema: OutputSchema,
	buildRequest: (input: z.output<InputSchema>) => MetabaseRequestPlan,
): CorsairEndpoint<
	MetabaseContext,
	z.input<InputSchema>,
	z.output<OutputSchema>
> {
	return async (ctx, input) => {
		let parsedInput: z.output<InputSchema>;
		try {
			parsedInput = inputSchema.parse(input);
		} catch {
			throw new MetabaseAPIError('Metabase request input failed validation');
		}
		const plan = buildRequest(parsedInput);
		const { path, ...planOptions } = plan;
		const requestOptions: MetabaseRequestOptions = { ...planOptions };
		if (
			requestOptions.requestTimeoutMs === undefined &&
			ctx.options.requestTimeoutMs !== undefined
		) {
			requestOptions.requestTimeoutMs = ctx.options.requestTimeoutMs;
		}
		if (
			requestOptions.maxResponseBytes === undefined &&
			ctx.options.maxResponseBytes !== undefined
		) {
			requestOptions.maxResponseBytes = ctx.options.maxResponseBytes;
		}
		if (
			requestOptions.maxUploadBytes === undefined &&
			ctx.options.maxUploadBytes !== undefined
		) {
			requestOptions.maxUploadBytes = ctx.options.maxUploadBytes;
		}
		const response: MetabaseResponse = await makeMetabaseRequest(
			path,
			ctx.key,
			ctx.options.baseUrl,
			requestOptions,
		);
		let parsedOutput: z.output<OutputSchema>;
		try {
			parsedOutput = outputSchema.parse(response);
		} catch {
			throw new MetabaseAPIError('Metabase response failed validation');
		}
		await logEventFromContext(ctx, `metabase.${operation}`, {}, 'completed');
		return parsedOutput;
	};
}
