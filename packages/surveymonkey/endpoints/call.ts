import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SurveymonkeyContext } from '..';
import type { SurveymonkeyRequest } from '../client';
import { makeSurveymonkeyRequest, normalizeSurveymonkeyBase } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the API host from the plugin option first, then the stored `api_host`
 * key, and falls back to the default. The OAuth token exchange reports an
 * `access_url` per account, and the vendor says an account may live on another
 * datacenter, so a caller can set one. Whatever comes back goes through
 * `normalizeSurveymonkeyBase`, which only ever returns a `surveymonkey.com` host.
 */
export async function resolveBase(ctx: SurveymonkeyContext): Promise<string> {
	const fromOptions = ctx.options?.apiHost?.trim();
	if (fromOptions) return normalizeSurveymonkeyBase(fromOptions);

	// unknown: `get_api_host` exists only when the plugin declares it in
	// authConfig, and `ctx.keys` itself is absent on a context built without a
	// key manager (as a bare `key` option does).
	const keys = ctx.keys as unknown as
		| { get_api_host?: () => Promise<string | null | undefined> }
		| undefined;
	const fromKeys = (await keys?.get_api_host?.())?.trim();
	return normalizeSurveymonkeyBase(fromKeys ?? 'api.surveymonkey.com');
}

/**
 * Validates the input, resolves the host, sends the request, validates the
 * response, then logs the event. A response carries a respondent's answers, so
 * `log` picks ids and counts rather than the body.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SurveymonkeyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => SurveymonkeyRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});

	/** Logging never decides the outcome: a log failure must not mask a result. */
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`surveymonkey.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const base = await resolveBase(ctx);
		const raw = await makeSurveymonkeyRequest(base, ctx.key, toRequest(parsed));
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		// Only the request and the response parse are inside this try. The success
		// log is outside it on purpose: `logEvent` throws when `encryptDataAtRest`
		// is configured without a kek, and if a *write* had already landed, a
		// rethrow from here would report success as failure and a retry would
		// duplicate it.
		await logSafely(
			{
				failed: true,
				error: error instanceof Error ? error.message : String(error),
			},
			'failed',
		);
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}

/**
 * Reads the `data` array off a list response, throwing when it is missing or is
 * not an array. SurveyMonkey answers a route it does not have with an HTML page,
 * so a caller that got a 200 with the wrong shape needs a named failure rather
 * than an empty list.
 * unknown: the body is untyped until this reads it.
 */
export function unwrapList(raw: unknown, label: string): unknown[] {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`SurveyMonkey returned an unexpected ${label} body`);
	}
	const value = (raw as Record<string, unknown>).data;
	if (!Array.isArray(value)) {
		throw new Error(`SurveyMonkey returned no data array for ${label}`);
	}
	return value;
}

import { asRecord } from 'corsair/core';

/**
 * Merges a list body's paging fields onto its unwrapped `data` array, so the
 * output schema sees the whole wrapper. A body that is not an object throws,
 * which is what `unwrapList` already does for the array.
 * unknown: the body is untyped until `asRecord` narrows it.
 */
export function listBody(raw: unknown, label: string): Record<string, unknown> {
	const record = asRecord(raw);
	if (!record) {
		throw new Error(`SurveyMonkey returned an unexpected ${label} body`);
	}
	return record;
}

/** Drops unset query values so nothing empty is sent. */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

/** A delete answers 200 with an empty body, so the plugin reports the id. */
export function deletion<K extends string>(
	key: K,
	id: string,
): Record<K, string> & { deleted: true } {
	return { [key]: id, deleted: true } as Record<K, string> & {
		deleted: true;
	};
}

/** Raises the same auth error the key builder does when no token is stored. */
export function missingKey(): never {
	throw new AuthMissingError('surveymonkey', 'oauth_2');
}
