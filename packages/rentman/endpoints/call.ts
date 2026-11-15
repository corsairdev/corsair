import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RentmanContext } from '..';
import type { RentmanRequest } from '../client';
import { makeRentmanRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Contact names and addresses are customer data, so `log`
 * records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RentmanContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RentmanRequest,
	options: {
		// unknown: raw is the response body, undefined for a 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRentmanRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`rentman.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not serialised. Rentman reads
 * `field[operator]` keys and would receive the literal string `undefined`.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}

/** The relational operators Rentman documents for a filter. */
export const RENTMAN_OPERATORS = ['lt', 'gt', 'lte', 'gte', 'neq'] as const;

/**
 * Builds a `field[operator]` query key. `corsair/http` percent-encodes the
 * brackets, which Rentman's parser accepts because it decodes the query string
 * before reading the filter name.
 */
export function operatorKey(field: string, operator: string): string {
	return `${field}[${operator}]`;
}
