import { logEventFromContext } from 'corsair/core';
import type { AhrefsHttpMethod, AhrefsQueryValue } from '../client';
import { makeAhrefsRequest } from '../client';
import type { AhrefsContext } from '../index';
import type { AhrefsEndpointInputs, AhrefsEndpointOutputs } from './types';
import {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
} from './types';

export type AhrefsEndpointKey = keyof AhrefsEndpointOutputs;

export type AhrefsCall<K extends AhrefsEndpointKey> = {
	/** Key into the endpoint schema maps, e.g. `gscKeywords`. */
	endpoint: K;
	method: AhrefsHttpMethod;
	path: string;
	/** Event name logged after a successful call, e.g. `ahrefs.gsc.keywords`. */
	event: string;
	/** Input fields sent in the JSON body; every other field goes in the query. */
	bodyKeys?: readonly string[];
	/** Input fields copied into the logged event. */
	logKeys?: readonly string[];
};

// Response drift is reported once per endpoint, not on every call.
const warnedEndpoints = new Set<string>();

/**
 * Sends one Ahrefs API call. The input is parsed with the endpoint's input
 * schema first (invalid input throws before any request, unknown keys are
 * dropped), then split into query string and JSON body. The response is
 * checked against the endpoint's output schema: a match returns the parsed
 * data; a mismatch logs one warning and returns the raw response, because
 * Ahrefs' responses drift from its spec and a schema gap should not fail a
 * call that the API answered.
 */
export async function callAhrefs<K extends AhrefsEndpointKey>(
	ctx: AhrefsContext,
	call: AhrefsCall<K>,
	input: AhrefsEndpointInputs[K],
): Promise<AhrefsEndpointOutputs[K]> {
	// Each map entry is a zod object keyed by endpoint, so parse returns a
	// plain object of the endpoint's fields; it is read as a record to split it.
	const parsedInput = AhrefsEndpointInputSchemas[call.endpoint].parse(
		input,
	) as Record<string, unknown>;

	const bodyKeys = new Set(call.bodyKeys ?? []);
	const query: Record<string, AhrefsQueryValue> = {};
	// Body fields are nested objects and arrays whose shapes the input schema
	// already checked; the body is serialised as JSON as-is.
	const body: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(parsedInput)) {
		if (value === undefined) continue;
		if (bodyKeys.has(key)) {
			body[key] = value;
		} else if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = value;
		} else {
			query[key] = JSON.stringify(value);
		}
	}

	// The raw body is unknown until it is checked against the output schema.
	const raw = await makeAhrefsRequest<unknown>(call.path, ctx.key, {
		method: call.method,
		query,
		body: bodyKeys.size > 0 ? body : undefined,
	});

	const checked = AhrefsEndpointOutputSchemas[call.endpoint].safeParse(raw);
	if (!checked.success && !warnedEndpoints.has(call.event)) {
		warnedEndpoints.add(call.event);
		const issue = checked.error.issues[0];
		console.warn(
			`[ahrefs] ${call.event}: response does not match the schema at "${
				issue?.path.join('.') ?? ''
			}" (${issue?.message ?? 'unknown issue'}); returning it unchanged`,
		);
	}
	// TypeScript cannot tie the indexed schema map back to K, so the parsed
	// data (or the unchanged response on drift) is returned as K's output type.
	const response = (
		checked.success ? checked.data : raw
	) as AhrefsEndpointOutputs[K];

	const logged: Record<string, unknown> = {};
	for (const key of call.logKeys ?? []) {
		if (parsedInput[key] !== undefined) logged[key] = parsedInput[key];
	}
	const firstValue =
		response && typeof response === 'object'
			? Object.values(response)[0]
			: undefined;
	if (Array.isArray(firstValue)) logged.resultCount = firstValue.length;
	await logEventFromContext(ctx, call.event, logged, 'completed');

	return response;
}
