import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DeeplineContext } from '../index';

export function defineEndpoint<
	I extends z.ZodType,
	O extends z.ZodType,
>(config: {
	event: string;
	input: I;
	output: O;
	// The response is untrusted JSON until the endpoint output schema parses it.
	run: (ctx: DeeplineContext, input: z.output<I>) => Promise<unknown>;
}): (ctx: DeeplineContext, input: z.input<I>) => Promise<z.output<O>> {
	return async (ctx, rawInput) => {
		const input = config.input.parse(rawInput ?? {});
		const result = config.output.parse(await config.run(ctx, input));
		// GTM inputs, search terms, results, billing details and logs may contain
		// personal data. Record the operation only, never the payload or response.
		if (ctx.database)
			await logEventFromContext(ctx, config.event, {}, 'completed');
		return result;
	};
}
