import type { CorsairEndpoint } from 'corsair/core';
import type { LushaContext } from '..';
import type { LushaQuery, LushaRequest } from '../client';
import { billingLog, call } from './call';
import { LUSHA_SPEC_ROUTES } from './generated/spec-ops';
import type {
	LushaSpecInputs,
	LushaSpecOutputs,
} from './generated/spec-schemas';
import {
	LushaSpecInputSchemas,
	LushaSpecOutputSchemas,
} from './generated/spec-schemas';

export type LushaSpecKey = keyof typeof LUSHA_SPEC_ROUTES;

type Route = {
	op: string;
	method: LushaRequest['method'];
	path: string;
	/** Spec path parameter name to input field. */
	pathParams?: Readonly<Record<string, string>>;
	/** Input field to spec query parameter name. */
	query?: Readonly<Record<string, string>>;
	/** Documented body fields; any other non-path, non-query input joins them. */
	body?: readonly string[];
	replayable?: boolean;
};

/**
 * Turns a parsed input into the request: path fields fill `{name}` segments
 * (encoded), query fields go to the query string, and everything else is the
 * JSON body for routes that take one.
 */
// unknown: parsed is the loose input object; each field was validated by
// the operation's input schema.
export function buildSpecRequest(
	route: Route,
	parsed: Record<string, unknown>,
): LushaRequest {
	const used = new Set<string>();
	let path = route.path;
	for (const [specName, field] of Object.entries(route.pathParams ?? {})) {
		const value = parsed[field];
		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new Error(`Lusha ${route.op}: ${field} is required`);
		}
		path = path.replace(`{${specName}}`, encodeURIComponent(String(value)));
		used.add(field);
	}
	let query: LushaQuery | undefined;
	for (const [field, specName] of Object.entries(route.query ?? {})) {
		used.add(field);
		const value = parsed[field];
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query = { ...query, [specName]: value };
		}
	}
	let body: Record<string, unknown> | undefined;
	if (route.body !== undefined) {
		body = {};
		for (const [key, value] of Object.entries(parsed)) {
			if (!used.has(key) && value !== undefined) body[key] = value;
		}
	}
	return {
		method: route.method,
		path,
		query,
		body,
		replayable: route.replayable === true,
	};
}

/**
 * Webhook subscription responses can carry the account's signing secret
 * (on create, or when a secret was regenerated). It is a credential, so it
 * never reaches the agent; read it in the Lusha dashboard instead.
 */
// unknown: raw is the response body before parsing.
export function withoutSecrets(raw: unknown): unknown {
	if (Array.isArray(raw)) return raw.map(withoutSecrets);
	if (raw === null || typeof raw !== 'object') return raw;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(raw)) {
		if (key === 'secret') continue;
		out[key] = withoutSecrets(value);
	}
	return out;
}

/** One generated operation, validated, sent and logged like the hand-written ones. */
export function specEndpoint<K extends LushaSpecKey>(
	key: K,
): CorsairEndpoint<LushaContext, LushaSpecInputs[K], LushaSpecOutputs[K]> {
	const route: Route = LUSHA_SPEC_ROUTES[key];
	const isSubscription = route.op.startsWith('subscriptions.');
	// The schemas are read per call, so creating the plugin builds none.
	return (ctx, rawInput) =>
		call(
			ctx,
			{
				event: route.op,
				input: LushaSpecInputSchemas[key],
				output: LushaSpecOutputSchemas[key],
			},
			rawInput,
			(parsed) => buildSpecRequest(route, parsed as Record<string, unknown>),
			{
				shape: isSubscription ? withoutSecrets : undefined,
				// Only billing counters are logged: inputs and results carry
				// names, emails and phone numbers.
				log: (_parsed, result) =>
					billingLog(result as Parameters<typeof billingLog>[0]),
			},
		) as Promise<LushaSpecOutputs[K]>;
}
