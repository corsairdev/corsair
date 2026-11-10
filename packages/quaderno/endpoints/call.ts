import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { QuadernoContext } from '..';
import type { QuadernoRequest } from '../client';
import { makeQuadernoRequest, QuadernoError } from '../client';

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

/** Reads an id off a bare object or array page, for the `shape` hook. */
export function idOf(raw: unknown): number | undefined {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
	const id = (raw as { id?: unknown }).id;
	return typeof id === 'number' ? id : undefined;
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
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	options: ShapeOptions<Input, Output> = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const account = await resolveAccount(ctx);
	const raw = await makeQuadernoRequest(
		ctx.key,
		account,
		operation.toRequest(parsed),
	);
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
