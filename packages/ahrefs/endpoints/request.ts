import { logEventFromContext } from 'corsair/core';
import type { AhrefsHttpMethod, AhrefsQueryValue } from '../client';
import { makeAhrefsRequest } from '../client';
import type { AhrefsContext } from '../index';

export type AhrefsCall = {
	method: AhrefsHttpMethod;
	path: string;
	/** Event name logged after a successful call, e.g. `ahrefs.gsc.keywords`. */
	event: string;
	/** Input fields sent in the JSON body; every other field goes in the query. */
	bodyKeys?: readonly string[];
	/** Input fields copied into the logged event. */
	logKeys?: readonly string[];
};

/**
 * Sends one Ahrefs API call from an endpoint's validated input, splitting the
 * input into query string and JSON body, and logs the call.
 */
export async function callAhrefs<TResponse>(
	ctx: AhrefsContext,
	call: AhrefsCall,
	input: object,
): Promise<TResponse> {
	const bodyKeys = new Set(call.bodyKeys ?? []);
	const query: Record<string, AhrefsQueryValue> = {};
	const body: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(input)) {
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

	const response = await makeAhrefsRequest<TResponse>(call.path, ctx.key, {
		method: call.method,
		query,
		body: bodyKeys.size > 0 ? body : undefined,
	});

	const values = input as Record<string, unknown>;
	const logged: Record<string, unknown> = {};
	for (const key of call.logKeys ?? []) {
		if (values[key] !== undefined) logged[key] = values[key];
	}
	await logEventFromContext(ctx, call.event, logged, 'completed');

	return response;
}
