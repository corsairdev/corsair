import { randomUUID } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PostgridContext } from '..';
import type { PostgridRequest } from '../client';
import { makePostgridRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * Order creation carries an `Idempotency-Key`: PostGrid honours it for 24 hours,
 * so a retried call returns the original order instead of printing a second one.
 * The caller may supply its own so a retry across processes reuses it.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PostgridContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/** True on the order-creation routes, which support the header. */
		requiresIdempotencyKey?: boolean;
	},
	rawInput: Untyped,
	toRequest: (
		parsed: z.output<Input>,
	) => Omit<PostgridRequest, 'idempotencyKey'>,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const idempotencyKey = operation.requiresIdempotencyKey
		? (readIdempotencyKey(parsed) ?? randomUUID())
		: undefined;

	const request = toRequest(parsed);
	const raw = await makePostgridRequest(ctx.key, {
		...request,
		idempotencyKey,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`postgrid.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Reads the caller's optional `idempotencyKey`, which every order schema
 * declares, so a retry from the caller's own store reuses it.
 */
function readIdempotencyKey(parsed: Untyped): string | undefined {
	if (parsed === null || typeof parsed !== 'object') return undefined;
	const value = (parsed as Record<string, Untyped>).idempotencyKey;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** An order's `to` or `from` after input parsing. */
type ContactRefInput = string | { id?: string };

/**
 * An order's recipient or sender as PostGrid reads it: an existing contact goes
 * as its id string, and an inline contact goes as its body. PostGrid reads any
 * object as an inline contact, so an object carrying `id` is sent as the id.
 */
export function contactRef(contact: ContactRefInput): ContactRefInput {
	if (typeof contact === 'string') return contact;
	return contact.id === undefined ? contact : contact.id;
}

/** The order body with `to` and, when given, `from` as PostGrid reads them. */
export function withContactRefs<
	B extends { to: ContactRefInput; from?: ContactRefInput },
>(body: B): Untyped {
	const { to, from, ...rest } = body;
	return {
		...rest,
		to: contactRef(to),
		...(from === undefined ? {} : { from: contactRef(from) }),
	};
}
