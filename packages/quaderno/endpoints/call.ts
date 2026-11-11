import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { QuadernoContext } from '..';
import type { QuadernoRequest } from '../client';
import {
	makeQuadernoRequest,
	QuadernoAPIError,
	QuadernoError,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type ShapeOptions<Input extends z.ZodType, Output extends z.ZodType> = {
	// unknown: `raw` is the response body, or undefined for a 204.
	shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
};

/**
 * Wraps a value under a key. Quaderno answers single records **bare**, not under
 * the resource name, and lists as a **bare array**; the plugin's outputs name
 * them so a caller does not have to remember which is which. Done here rather
 * than with `.transform()`, which the docs generator cannot see.
 */
export function wrap<Key extends string, Value>(
	key: Key,
	value: Value,
): Record<Key, Value> {
	return { [key]: value } as Record<Key, Value>;
}

// unknown: `raw` is the response body, validated by the endpoint's output schema
// after this. `idOf` is only used to read the paging cursor off a page.
export function idOf(raw: unknown): number | undefined {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
	// unknown: the `id` field of an untyped body, checked for type before use.
	const id = (raw as { id?: unknown }).id;
	return typeof id === 'number' ? id : undefined;
}

/**
 * Reads a list response, which Quaderno sends as a **bare array**. A body that
 * is not an array is a bad response, not an empty page: returning `[]` there
 * would report "no records" when the truth is "this payload was wrong", and a
 * caller would stop paging without knowing anything had gone wrong. Throws, so
 * the endpoint fails loudly instead.
 */
export function requireArray(
	// unknown: the response body, narrowed to an array here.
	raw: unknown,
	resource: string,
): unknown[] {
	if (!Array.isArray(raw)) {
		throw new QuadernoAPIError(
			`Quaderno answered ${resource} with a non-array body; expected a list.`,
			{ kind: 'bad_response' },
		);
	}
	return raw;
}

/** Resolves the account subdomain: an explicit option wins over stored value. */
export async function resolveAccount(ctx: QuadernoContext): Promise<string> {
	const explicit = ctx.options?.account;
	if (explicit) return explicit;
	const stored = await ctx.keys.get_account_name();
	if (!stored)
		throw new QuadernoError(
			'A Quaderno account name is required.',
			'invalid_account',
		);
	return stored;
}

/**
 * Validates the input, sends one request, shapes and validates the response,
 * then logs. Inputs are not logged wholesale, since they carry customer names
 * and addresses; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: QuadernoContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		toRequest: (parsed: z.output<Input>) => QuadernoRequest;
		/**
		 * Skips account resolution and sends to the bare `quadernoapp.com` host.
		 * Only `/authorization` needs this, because it exists to discover the
		 * account name a caller does not have yet.
		 */
		rootHost?: boolean;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	options: ShapeOptions<Input, Output> = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// An account is not needed to reach the root host, and requiring one there
	// would break discovery for exactly the caller who needs it.
	const account = operation.rootHost ? '' : await resolveAccount(ctx);
	const raw = await makeQuadernoRequest(ctx.key, account, {
		...operation.toRequest(parsed),
		// Carried onto any error so a retry handler can tell a deliver from a read.
		operation: operation.event,
		useRootHost: operation.rootHost,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`quaderno.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
