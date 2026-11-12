import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CraftmypdfContext } from '..';
import type { CraftmypdfClientOptions, CraftmypdfRequest } from '../client';
import { makeCraftmypdfRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * CraftMyPDF echoes the URL it was given in some error messages, for example
 * "Failed to load: <url>". A PDF URL is often a signed S3 link, so its query
 * string is a bearer credential: saving the raw message in `corsair_events`
 * would keep that credential at rest. The query string and any userinfo are
 * dropped; the scheme, host and path stay because they are what makes the
 * message useful.
 */
export function redactUrls(message: string): string {
	return message.replace(/\bhttps?:\/\/[^\s"'<>]+/gi, (match) => {
		try {
			const url = new URL(match);
			const safe = `${url.protocol}//${url.host}${url.pathname}`;
			return url.search || url.username || url.password
				? `${safe}?redacted`
				: safe;
		} catch {
			// A URL-shaped string the parser rejects: keep only its origin.
			const [origin] = match.split(/[?#]/);
			return origin ?? match;
		}
	});
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: a create call body holds the
 * template data, which is the caller's own customer data.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CraftmypdfContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => CraftmypdfRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const clientOptions: CraftmypdfClientOptions = {
		region: ctx.options.region,
	};

	// Logging is outside the request's error path so a logging failure cannot
	// mask a write that CraftMyPDF has already committed.
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`craftmypdf.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const raw = await makeCraftmypdfRequest(
			ctx.key,
			toRequest(parsed),
			clientOptions,
		);
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		// The caller still receives the unredacted error; only the saved event
		// is stripped, so a signed URL is never written to the database.
		await logSafely({ error: redactUrls(message) }, 'failed');
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}
