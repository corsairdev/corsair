import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { HereContext } from '../index';

export async function runHereEndpoint<I, O>(
	ctx: HereContext,
	name: string,
	inputSchema: ZodType<I>,
	outputSchema: ZodType<O>,
	input: unknown,
	invoke: (validated: I, apiKey: string) => unknown | Promise<unknown>,
): Promise<O> {
	const validated = inputSchema.parse(input);
	const response = outputSchema.parse(await invoke(validated, ctx.key));
	await logEventFromContext(
		ctx,
		name,
		validated as Record<string, unknown>,
		'completed',
	);
	return response;
}

export function weatherQuery(
	input: {
		q?: string;
		location?: string;
		zipCode?: string;
		units?: string;
		lang?: string;
	},
	products: string,
	extra: Record<string, string | boolean | undefined> = {},
) {
	return {
		products,
		q: input.q,
		location: input.location,
		zipCode: input.zipCode,
		units: input.units,
		lang: input.lang,
		...extra,
	};
}
