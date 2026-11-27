import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FreshBooksContext } from '..';
import type { FreshBooksRequest } from '../client';
import { FreshBooksAPIError, makeFreshBooksRequest, readFreshBooksErrors } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type FreshBooksEnvelope = 'accounting' | 'bare';

/**
 * The accounting family wraps every answer in
 * `{ response: { result | errors } }`; an errors array is a failure whatever
 * the HTTP status said. Returns `response.result`, which is undefined only
 * where a caller's shape allows it (projects.delete answers `{ response: {} }`).
 */
export function unwrapAccountingEnvelope(raw: unknown): unknown {
	const errors = readFreshBooksErrors(raw);
	const first = errors[0];
	if (first) {
		const { message, errno } = first;
		throw new FreshBooksAPIError(
			errno === undefined ? message : `FreshBooks errno ${errno}: ${message}`,
			{ errno },
		);
	}
	const response = asRecord(asRecord(raw)?.response);
	if (!response) {
		throw new FreshBooksAPIError(
			'Unexpected FreshBooks accounting response: missing the response object',
		);
	}
	return response.result;
}

/**
 * Validates the input, sends the request, unwraps the family envelope, shapes
 * and validates the response, then logs the event. Inputs are not logged,
 * because client and invoice records hold personal data; `log` picks the safe
 * fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: FreshBooksContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		envelope: FreshBooksEnvelope;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => FreshBooksRequest,
	options: {
		// unknown: raw is the response body after envelope unwrapping,
		// undefined when there is none. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeFreshBooksRequest(ctx.key, toRequest(parsed));
	const payload =
		operation.envelope === 'accounting'
			? unwrapAccountingEnvelope(raw)
			: raw;
	const result = operation.output.parse(
		options.shape ? options.shape(payload, parsed) : payload,
	);

	await logEventFromContext(
		ctx,
		`freshbooks.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
