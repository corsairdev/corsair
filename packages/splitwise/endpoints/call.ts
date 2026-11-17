import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SplitwiseContext } from '..';
import type { SplitwiseRequest } from '../client';
import { makeSplitwiseRequest, SplitwiseOperationError } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged as-is: an expense carries notes
 * and a user update carries an email address, so `log` names the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SplitwiseContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown, // unknown: parsed below by the operation's input schema.
	toRequest: (parsed: z.output<Input>) => SplitwiseRequest,
	options: {
		// raw is the response body; the return is what the output schema validates.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: both sides.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
		/**
		 * Runs on the shaped result. Splitwise answers some writes with 200 and
		 * `success: false`, so the operation has to be checked against the body,
		 * not the status code.
		 */
		assert?: (result: z.output<Output>) => void;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSplitwiseRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);
	options.assert?.(result);

	await logEventFromContext(
		ctx,
		`splitwise.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Reads the `success` flag every conditional-write route returns. */
export function requireSuccess(
	result: {
		success: boolean;
		errors?: Record<string, string[]> | string[] | null;
	},
	action: string,
): void {
	if (result.success) return;
	const errors = Array.isArray(result.errors)
		? { base: result.errors }
		: (result.errors ?? {});
	const detail = Object.entries(errors)
		.flatMap(([field, messages]) =>
			messages.map((entry) => `${field}: ${entry}`),
		)
		.join('; ');
	throw new SplitwiseOperationError(
		detail
			? `Splitwise did not ${action}: ${detail}`
			: `Splitwise did not ${action}`,
		errors,
	);
}

/**
 * Reads the `errors` map on the routes that answer 200 with an empty errors
 * object on success and a populated one on failure.
 */
export function requireNoErrors(
	result: { errors?: Record<string, string[]> | null },
	action: string,
): void {
	const entries = Object.entries(result.errors ?? {}).filter(
		([, messages]) => messages.length > 0,
	);
	if (entries.length === 0) return;
	const detail = entries
		.flatMap(([field, messages]) =>
			messages.map((entry) => `${field}: ${entry}`),
		)
		.join('; ');
	throw new SplitwiseOperationError(`Splitwise did not ${action}: ${detail}`, {
		...result.errors,
	});
}

/**
 * `undelete_group` reports failures as a bare string array instead of the
 * `{ field: [message] }` map, so it needs its own check.
 */
export function requireSuccessWithMessages(
	result: { success: boolean; errors?: string[] | null },
	action: string,
): void {
	if (result.success) return;
	const messages = result.errors ?? [];
	throw new SplitwiseOperationError(
		messages.length > 0
			? `Splitwise did not ${action}: ${messages.join('; ')}`
			: `Splitwise did not ${action}`,
		{ base: messages },
	);
}

/** Renders a number as the two-decimal string Splitwise expects for money. */
export function toMoneyString(value: number): string {
	return value.toFixed(2);
}
