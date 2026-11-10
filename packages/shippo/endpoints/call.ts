import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ShippoContext } from '..';
import type { ShippoRequest } from '../client';
import { makeShippoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Shippo's delete routes answer 204 with no body, so there is nothing to read
 * an id from; when a route does send one, it is returned. The success itself is
 * the status code, which `corsair/http` has already checked.
 */
// unknown: a 204 body is literally absent, and a 200 delete body is untyped.
export function readObjectId(raw: unknown): string | undefined {
	if (typeof raw !== 'object' || raw === null) return undefined;
	const id = (raw as Record<string, unknown>).object_id;
	return typeof id === 'string' ? id : undefined;
}

/** Joined for the query parameters Shippo takes as `key[]`. */
export function bracketList(
	key: string,
	values: ReadonlyArray<string | number> | undefined,
): Record<string, string | undefined> {
	if (!values || values.length === 0) return {};
	return { [`${key}[]`]: values.join(',') };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * Inputs are not logged: they carry street addresses, phone numbers, email
 * addresses and carrier credentials, so `log` names only the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ShippoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ShippoRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeShippoRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`shippo.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
