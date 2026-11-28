import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { VpndetectionRequest } from '../client';
import { vpndetectionRequest } from '../client';
import type { VpndetectionContext } from '../context';

/**
 * Builds one endpoint that parses its input, sends one request, parses the
 * answer leniently and logs the event. The log carries only what `log`
 * returns, never the answer: keys, emails and member details stay out of it.
 */
export function endpoint<I extends z.ZodType, O extends z.ZodType>(config: {
	event: string;
	input: I;
	output: O;
	request: (input: z.infer<I>) => VpndetectionRequest;
	log?: (input: z.infer<I>, output: z.infer<O>) => Record<string, unknown>;
}): CorsairEndpoint<VpndetectionContext, z.infer<I>, z.infer<O>> {
	return async (ctx, input) => {
		const parsed = config.input.parse(input ?? {}) as z.infer<I>;
		// `unknown` until the output schema parses it: untrusted provider JSON.
		const body = await vpndetectionRequest<unknown>(
			ctx.key ?? '',
			config.request(parsed),
		);
		const result = config.output.parse(body) as z.infer<O>;
		await logEventFromContext(
			ctx,
			config.event,
			config.log ? config.log(parsed, result) : {},
			'completed',
		);
		return result;
	};
}
