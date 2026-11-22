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
			segment === '' ||
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

// Schema paths and zod's messages only. Unrecognized keys come from the caller's input (a key can be an
// email address), so they are counted, not named; nothing from input or response values is copied.
function describeIssues(error: z.ZodError): string {
	return error.issues
		.slice(0, 5)
		.map((issue) => {
			const at = issue.path.join('.') || '(root)';
			if (issue.code === 'unrecognized_keys') {
				return `${at}: ${issue.keys.length} unrecognized field(s)`;
			}
			return `${at}: ${issue.message}`;
		})
		.join('; ');
}

export function encodeCollectionId(id: number | string): string {
	const value = String(id);
	if (
		value === '' ||
		value === '.' ||
		value === '..' ||
		/[\\/?#\u0000-\u001f]/u.test(value)
	) {
		throw new MetabaseAPIError('Invalid collection ID path segment');
	}
	return encodeURIComponent(value).replace(/\./gu, '%2E');
}

/**
 * Builds a schema on first use and caches it. The generated operations wrap every schema in
 * this so importing the plugin doesn't construct hundreds of zod objects up front.
 */
export function lazySchema<Schema extends z.ZodType>(
	build: () => Schema,
): () => Schema {
	let cached: Schema | undefined;
	return () => {
		cached ??= build();
		return cached;
	};
}

type SchemaSource<Schema extends z.ZodType> = Schema | (() => Schema);

function resolveSchema<Schema extends z.ZodType>(
	source: SchemaSource<Schema>,
): Schema {
	return typeof source === 'function' ? source() : source;
}

export function createMetabaseEndpoint<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(
	operation: string,
	inputSchemaSource: SchemaSource<InputSchema>,
	outputSchemaSource: SchemaSource<OutputSchema>,
	buildRequest: (input: z.output<InputSchema>) => MetabaseRequestPlan,
): CorsairEndpoint<
	MetabaseContext,
	z.input<InputSchema>,
	z.output<OutputSchema>
> {
	return async (ctx, input) => {
		const inputSchema = resolveSchema(inputSchemaSource);
		const outputSchema = resolveSchema(outputSchemaSource);
		const parsedInput = inputSchema.safeParse(input);
		if (!parsedInput.success) {
			throw new MetabaseAPIError(
				`Metabase request input failed validation: ${describeIssues(parsedInput.error)}`,
			);
		}
		const plan = buildRequest(parsedInput.data);
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
		const baseUrl =
			ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? undefined;
		const response: MetabaseResponse = await makeMetabaseRequest(
			path,
			ctx.key,
			baseUrl,
			requestOptions,
		);
		const parsedOutput = outputSchema.safeParse(response);
		if (!parsedOutput.success) {
			throw new MetabaseAPIError(
				`Metabase response failed validation: ${describeIssues(parsedOutput.error)}`,
			);
		}
		await logEventFromContext(ctx, `metabase.${operation}`, {}, 'completed');
		return parsedOutput.data;
	};
}
