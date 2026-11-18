import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeE2bRequest } from '../client';
import type { E2bContext } from '../index';
import type { E2bOperationRoute } from './routes';

type RouteWithSchemas<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
> = E2bOperationRoute & {
	readonly input: InputSchema;
	readonly output: OutputSchema;
};

export function createE2bEndpoint<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(
	route: RouteWithSchemas<InputSchema, OutputSchema>,
): CorsairEndpoint<E2bContext, z.input<InputSchema>, z.output<OutputSchema>> {
	return async (ctx, input) => {
		// Operation result remains unknown because the factory is generic over route schemas.
		const response: unknown = await makeE2bRequest(route, ctx.key, input);
		const output = route.output.parse(response);
		await logEventFromContext(
			ctx,
			`e2b.${route.id}`,
			{ operation: route.id },
			'completed',
		);
		return output;
	};
}
