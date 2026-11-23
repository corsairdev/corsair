import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MocoContext } from '..';
import type { MocoRequest } from '../client';
import { makeMocoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Moco documents several writes (deletes, invoice status changes) as
 * answering without a body. Anything else (an HTML error page, an unexpected
 * object) must fail loudly rather than look like a write that worked.
 */
export function emptyBodyShape(
	raw: unknown,
	id: number,
): { success: true; id: number } {
	const record = asRecord(raw);
	const empty =
		raw === null ||
		raw === undefined ||
		raw === '' ||
		(record !== null && Object.keys(record).length === 0);
	if (!empty) {
		throw new Error(
			`Moco write for ${id} returned an unexpected body: ${JSON.stringify(raw).slice(0, 80)}`,
		);
	}
	return { success: true, id };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because names, email addresses
 * and time entries are personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MocoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => MocoRequest | Promise<MocoRequest>,
	options: {
		// unknown: raw is the response body, or the bare list array. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMocoRequest(ctx, await toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`moco.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
