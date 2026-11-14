import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { SevdeskContext } from '..';
import type { SevdeskHttpMethod } from '../client';
import { makeSevdeskRequest } from '../client';

export function createSevdeskEndpoint<
	Input extends {
		path?: object;
		query?: object;
		body?: object;
		resourceVersion?: string;
	},
	Output,
>(
	inputSchema: ZodType<Input>,
	outputSchema: ZodType<Output>,
	operation: string,
	method: SevdeskHttpMethod,
	route: string,
): CorsairEndpoint<SevdeskContext, Input, Output> {
	return async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		// JSON is provider-controlled until the operation output schema validates it.
		const response = await makeSevdeskRequest<unknown>(method, route, ctx.key, {
			path: parsedInput.path,
			query: parsedInput.query,
			body: parsedInput.body,
			resourceVersion:
				parsedInput.resourceVersion ?? ctx.options.resourceVersion,
		});
		const parsedOutput = outputSchema.parse(response);
		await logEventFromContext(ctx, 'sevdesk.' + operation, {}, 'completed');
		return parsedOutput;
	};
}
