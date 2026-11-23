import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MoneybirdContext } from '..';
import type { MoneybirdRequest } from '../client';
import { makeMoneybirdRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because names, email addresses
 * and invoice data are personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MoneybirdContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		parsed: z.output<Input>,
	) => MoneybirdRequest | Promise<MoneybirdRequest>,
	options: {
		// unknown: raw is the response body, or a bare list array; deletes
		// answer 204 with no body. The output schema validates whatever this
		// returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMoneybirdRequest(ctx, await toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`moneybird.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Moneybird documents deletes as answering 204 without a body. Anything else
 * must fail loudly rather than look like a delete that worked. The id comes
 * back as the digit string it was called with.
 */
export function emptyBodyShape(
	raw: unknown,
	id: string,
): { success: true; id: string } {
	const record = asRecord(raw);
	const empty =
		raw === null ||
		raw === undefined ||
		raw === '' ||
		(record !== null && Object.keys(record).length === 0);
	if (!empty) {
		throw new Error(
			`Moneybird delete for ${id} returned an unexpected body: ${JSON.stringify(raw).slice(0, 80)}`,
		);
	}
	return { success: true, id };
}
