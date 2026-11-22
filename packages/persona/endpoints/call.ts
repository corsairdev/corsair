import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PersonaContext } from '..';
import type { PersonaRequest } from '../client';
import { makePersonaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because inquiry records carry personal
 * data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PersonaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PersonaRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makePersonaRequest(
		ctx.key,
		toRequest(parsed),
		ctx.options?.apiVersion,
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`persona.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Builds the JSON:API body { data: { attributes } } Persona expects. */
// unknown: attributes are template- or caller-defined, so the wrapper
// stays untyped.
export function attributesBody(attributes: unknown): unknown {
	return { data: { attributes } };
}

/** Builds the `{ meta }` body the tag, decision and link routes take. */
export function metaBody(
	// unknown: each route's meta keys differ; undefined values are dropped.
	meta: Record<string, unknown>,
	// unknown: the JSON body handed to the client.
): unknown {
	const defined = Object.fromEntries(
		Object.entries(meta).filter(([, value]) => value !== undefined),
	);
	return Object.keys(defined).length > 0 ? { meta: defined } : undefined;
}

/** page[after], page[before] and page[size] from the paging inputs. */
export function pageQuery(input: {
	pageAfter?: string;
	pageBefore?: string;
	pageSize?: number;
}): Record<string, string | number | undefined> {
	return {
		'page[after]': input.pageAfter,
		'page[before]': input.pageBefore,
		'page[size]': input.pageSize,
	};
}

/**
 * Encodes one path segment. `encodeURIComponent` leaves `.` and `..` as
 * they are, and URL parsing would resolve them into another route, so those
 * are refused.
 */
export function segment(value: string): string {
	if (value === '.' || value === '..') {
		throw new Error(`Persona: "${value}" is not a valid id`);
	}
	return encodeURIComponent(value);
}
