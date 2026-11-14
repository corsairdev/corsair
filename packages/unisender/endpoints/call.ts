import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UnisenderContext } from '..';
import type { UnisenderForm } from '../client';
import { makeUnisenderRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the method, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: a contact's address, a message body and its
 * subject are all caller content, so none of it is logged. The callbacks report ids,
 * counts and statuses.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: UnisenderContext,
	operation: {
		event: string;
		apiMethod: string;
		input: Input;
		output: Output;
		/** Whether repeating this exact call leaves the same state. */
		replayable: boolean;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toForm: (parsed: z.output<Input>) => UnisenderForm,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeUnisenderRequest(ctx.key, {
		apiMethod: operation.apiMethod,
		form: toForm(parsed),
		replayable: operation.replayable,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`unisender.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Turns a record into Unisender's bracketed form, such as `fields[city]=Berlin`.
 * A nested record or array is recursed with its index, so `data[0][1]` is built the
 * way the import method documents.
 * unknown: a value is a scalar, array or record, narrowed as it is walked.
 */
export function bracketForm(
	prefix: string,
	// unknown: the caller's value, walked here.
	value: unknown,
): UnisenderForm {
	const form: UnisenderForm = {};
	walk(form, prefix, value);
	return form;
}

// unknown: `value` is the caller's, narrowed branch by branch.
function walk(form: UnisenderForm, key: string, value: unknown): void {
	if (value === undefined || value === null) return;
	if (Array.isArray(value)) {
		value.forEach((entry, index) => walk(form, `${key}[${index}]`, entry));
		return;
	}
	if (typeof value === 'object') {
		for (const [child, childValue] of Object.entries(
			value as Record<string, unknown>,
		)) {
			walk(form, `${key}[${child}]`, childValue);
		}
		return;
	}
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		form[key] = value;
	}
}

/** Joins a list into the comma-separated form Unisender expects. */
export function csv(values: (string | number)[]): string {
	return values.join(',');
}
