import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WaiverFileContext } from '..';
import type { WaiverFileRequest } from '../client';
import {
	makeWaiverFileDownload,
	makeWaiverFileRequest,
	requireWaiverFileKey,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, resolves the packed key into its apiKey/siteID pair,
 * sends the request, then shapes and validates the response.
 *
 * A waiver holds a name, an email and a date of birth, so inputs are never
 * logged wholesale; `log` picks the fields that are safe.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WaiverFileContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => WaiverFileRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = requireWaiverFileKey(ctx.key);
	const raw = await makeWaiverFileRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`waiverfile.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Reads a list field that the API may name either way. */
export function listFrom<T>(
	raw: unknown,
	keys: readonly string[],
	parse: (entry: unknown) => T,
): T[] {
	if (typeof raw !== 'object' || raw === null) return [];
	const record = raw as Record<string, unknown>;
	for (const key of keys) {
		const value = record[key];
		if (Array.isArray(value)) return value.map(parse);
	}
	return [];
}

/**
 * The one operation that returns a file. It validates the input, downloads the
 * bytes directly (the shared transport would decode them as text), parses the
 * result through the operation's output schema, and logs.
 *
 * The bytes are returned base64-encoded alongside their length, because a PDF is
 * binary and an event payload is JSON.
 */
export async function download<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: WaiverFileContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => {
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
	},
	options: {
		shape: (
			file: { bytes: Buffer; contentType: string },
			parsed: z.output<Input>,
		) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = requireWaiverFileKey(ctx.key);
	const file = await makeWaiverFileDownload(credentials, toRequest(parsed));
	const result = operation.output.parse(options.shape(file, parsed));

	await logEventFromContext(
		ctx,
		`waiverfile.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
