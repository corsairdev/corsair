import { randomUUID } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PolygonContext } from '..';
import type {
	PolygonCredentials,
	PolygonEnvironment,
	PolygonRequest,
} from '../client';
import {
	invalidatePolygonToken,
	makePolygonRequest,
	PolygonAPIError,
	resolvePolygonToken,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies and raw caller input, before a schema parses them. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Reads the two credentials OMS needs. They are a pair rather than one key, so
 * both live on the account and are read through the account key manager, with
 * the plugin options as an override for tests and scripts.
 */
export async function resolvePolygonCredentials(
	ctx: PolygonContext,
): Promise<PolygonCredentials> {
	const apiKey =
		ctx.options?.apiKey?.trim() || (await ctx.keys.get_api_key())?.trim();
	const apiSecret =
		ctx.options?.apiSecret?.trim() || (await ctx.keys.get_api_secret())?.trim();

	if (!apiKey || !apiSecret) {
		throw new AuthMissingError('polygon', 'api_key');
	}
	return { apiKey, apiSecret };
}

/**
 * Validates the input, sends it with a bearer token, shapes and validates the
 * result, then logs the event.
 *
 * Every non-auth POST carries an `Idempotency-Key`, which OMS requires. The
 * caller may supply one so a retry reuses the same logical attempt rather than
 * making a second transfer; otherwise one is generated per call.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PolygonContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/** True on the POSTs OMS requires the idempotency header for. */
		requiresIdempotencyKey?: boolean;
	},
	rawInput: Untyped,
	toRequest: (
		parsed: z.output<Input>,
	) => Omit<PolygonRequest, 'idempotencyKey'>,
	options: {
		// `shape` receives the body before the output schema parses it, so its
		// return value is what that schema validates.
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const environment: PolygonEnvironment = ctx.options?.environment ?? 'live';
	const credentials = await resolvePolygonCredentials(ctx);
	const accessToken = await resolvePolygonToken(environment, credentials);

	const request = toRequest(parsed);
	const idempotencyKey = operation.requiresIdempotencyKey
		? (readIdempotencyKey(parsed) ?? randomUUID())
		: undefined;

	const raw = await sendWithTokenRefresh(
		environment,
		credentials,
		accessToken,
		{
			...request,
			idempotencyKey,
		},
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`polygon.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Sends the request, and retries it once on a 401 with a freshly minted token.
 *
 * A cached token can expire or be revoked between the cache lookup and the call,
 * and OMS answers that with a 401. Dropping the cached token and retrying once
 * keeps a caller from seeing a failure the next call would have avoided; a
 * second 401 is a real credential problem and is raised. The retry is safe for a
 * read and for a write because `Idempotency-Key` is already on the request, so
 * OMS treats the second attempt as the same logical one.
 */
async function sendWithTokenRefresh(
	environment: PolygonEnvironment,
	credentials: PolygonCredentials,
	accessToken: string,
	request: PolygonRequest,
): Promise<Untyped> {
	try {
		return await makePolygonRequest(environment, accessToken, request);
	} catch (error) {
		if (!(error instanceof PolygonAPIError) || error.status !== 401) {
			throw error;
		}
		invalidatePolygonToken(environment, credentials);
		const freshToken = await resolvePolygonToken(environment, credentials);
		return makePolygonRequest(environment, freshToken, request);
	}
}

/**
 * Reads the caller's optional `idempotencyKey`. Every write schema declares it,
 * so a retry from the caller's own store reuses it instead of creating a second
 * transfer.
 */
function readIdempotencyKey(parsed: Untyped): string | undefined {
	if (parsed === null || typeof parsed !== 'object') return undefined;
	const value = (parsed as Record<string, Untyped>).idempotencyKey;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}
