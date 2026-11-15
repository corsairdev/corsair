import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KlaviyoContext } from '..';
import type { KlaviyoRequest } from '../client';
import { makeKlaviyoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KlaviyoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KlaviyoRequest,
	options: {
		// unknown: the response body before the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKlaviyoRequest(ctx.key, toRequest(parsed));
	// A successful body can also arrive unparsed: the shared client only reads
	// `application/json`, and Klaviyo answers `application/vnd.api+json`.
	const body = typeof raw === 'string' ? parseBody(raw) : raw;
	const result = operation.output.parse(
		options.shape ? options.shape(body, parsed) : body,
	);

	await logEventFromContext(
		ctx,
		`klaviyo.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The cursor query keys, from the caller's flat `cursor`/`pageSize` fields.
 *
 * Klaviyo names these `page[cursor]` and `page[size]`, and the bracket must be
 * percent-encoded on the wire; `corsair/http` encodes the key it is given, so
 * the literal bracket form is passed through.
 */
export function pageQuery(parsed: {
	cursor?: string;
	pageSize?: number;
}): Record<string, string | number | undefined> {
	return {
		'page[cursor]': parsed.cursor,
		'page[size]': parsed.pageSize,
	};
}

/** The `fields[resource]` sparse fieldset, comma-joined. */
export function fieldsQuery(
	fields: readonly string[] | undefined,
): string | undefined {
	return fields?.length ? fields.join(',') : undefined;
}

/** The `additional-fields[resource]` parameter, comma-joined. */
export function additionalFieldsQuery(
	fields: readonly string[] | undefined,
): string | undefined {
	return fields?.length ? fields.join(',') : undefined;
}

/** The `include` relationship list, comma-joined. */
export function includeQuery(
	include: readonly string[] | undefined,
): string | undefined {
	return include?.length ? include.join(',') : undefined;
}

/** Klaviyo deletes answer 204 with no body. */
export const deleted = { success: true } as const;

/**
 * A response body Klaviyo left as text.
 *
 * `corsair/http` only parses `application/json` and
 * `application/problem+json`, while every Klaviyo response is
 * `application/vnd.api+json`, so both success and error bodies arrive as
 * strings. Parsing here keeps the schemas working; a body that is not JSON
 * stays as text so the caller sees a parse failure rather than silence.
 */
// unknown: the text is provider output and may not be JSON at all.
export function parseBody(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/**
 * The attributes object from flat caller fields, dropping anything unset.
 *
 * JSON:API wants `{ data: { type, attributes } }`, and sending a key with an
 * `undefined` value fails the request, so only set keys are copied.
 */
export function attributesOf(
	type: string,
	fields: Record<string, unknown>, // unknown: one helper serves every resource's attributes.
	options: { id?: string } = {},
): Record<string, unknown> {
	// unknown: the relationship envelope is assembled here. // unknown: the JSON:API envelope is assembled here.
	const attributes: Record<string, unknown> = {}; // unknown: see fields.
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) attributes[key] = value;
	}
	return {
		data: {
			type,
			...(options.id !== undefined ? { id: options.id } : {}),
			attributes,
		},
	};
}

/**
 * A JSON:API relationship body: `{ data: [{ type, id }, ...] }`.
 *
 * Used by the list-member routes and any other relationship write.
 */
export function relationshipBody(
	type: string,
	ids: readonly string[],
): Record<string, unknown> {
	// unknown: the relationship envelope.
	// unknown: see attributesOf.
	return { data: ids.map((id) => ({ type, id })) };
}
