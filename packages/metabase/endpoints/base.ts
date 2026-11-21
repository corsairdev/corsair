import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MetabaseContext } from '..';
import type { JsonValue, MetabaseRequestOptions } from '../client';
import { MetabaseAPIError, makeMetabaseRequest } from '../client';

export type MetabaseRequestPlan = MetabaseRequestOptions & {
	path: string;
};

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
		const { path, ...requestOptions } = plan;
		const response: JsonValue = await makeMetabaseRequest(
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
