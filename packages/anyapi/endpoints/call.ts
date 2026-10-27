import { logEventFromContext } from 'corsair/core';
import type { AnyApiContext } from '..';
import type { AnyApiQuery } from '../client';
import { makeAnyApiRequest } from '../client';
import type {
	AnyApiEndpointInputs,
	AnyApiEndpointOutputs,
	AnyApiOperation,
} from './types';
import {
	AnyApiEndpointInputSchemas,
	AnyApiEndpointOutputSchemas,
} from './types';

type Controls = {
	maxCostUsd?: number;
	idempotencyKey?: string;
	fields?: string;
	maxItems?: number;
	summary?: boolean;
	jq?: string;
};

/** The run controls AnyAPI reads from the query string and headers. */
export function splitControls<T extends Controls>(
	parsed: T,
): {
	rest: Omit<T, keyof Controls>;
	query: AnyApiQuery;
	headers: Record<string, string>;
} {
	const { maxCostUsd, idempotencyKey, fields, maxItems, summary, jq, ...rest } =
		parsed;
	return {
		rest,
		query: {
			fields,
			max_items: maxItems,
			summary,
			jq,
			max_cost_usd: maxCostUsd === undefined ? undefined : String(maxCostUsd),
		},
		headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
	};
}

export function runPath(sku: string): string {
	return `/v1/run/${encodeURIComponent(sku)}`;
}

/**
 * Validates the input, sends the request, validates the response and logs
 * what the call cost. Inputs are not logged: they can hold names and URLs.
 */
export async function call<K extends AnyApiOperation>(
	ctx: AnyApiContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: AnyApiEndpointInputs[K]) => {
		method: 'GET' | 'POST';
		path: string;
		query?: AnyApiQuery;
		// unknown: already validated by the input schema.
		body?: unknown;
		headers?: Record<string, string>;
	},
	logFields: Record<string, string | number | boolean | undefined> = {},
): Promise<AnyApiEndpointOutputs[K]> {
	const parsed = AnyApiEndpointInputSchemas[operation].parse(
		input ?? {},
	) as AnyApiEndpointInputs[K];
	const raw = await makeAnyApiRequest(ctx.key, toRequest(parsed));
	const result = AnyApiEndpointOutputSchemas[operation].parse(
		raw,
	) as AnyApiEndpointOutputs[K];

	// A re-read echoes the original run's costUsd but is free, so only a run
	// logs what it cost.
	const record = result as Record<string, unknown>;
	const billed = operation !== 'resultsGet';
	await logEventFromContext(
		ctx,
		`anyapi.${event}`,
		{
			...logFields,
			costUsd:
				billed && typeof record.costUsd === 'number'
					? record.costUsd
					: undefined,
			items: typeof record.items === 'number' ? record.items : undefined,
		},
		'completed',
	);
	return result;
}

type TypedOperation = Exclude<
	AnyApiOperation,
	| 'apisSearch'
	| 'apisList'
	| 'apisGet'
	| 'apisQuote'
	| 'apisRun'
	| 'resultsGet'
	| 'requestsGet'
	| 'accountGetBalance'
>;

/** Runs one SKU with the typed input of `operation`. */
export function runSku<K extends TypedOperation>(
	ctx: AnyApiContext,
	operation: K,
	event: string,
	sku: string,
	// unknown: see call.
	input: unknown,
): Promise<AnyApiEndpointOutputs[K]> {
	return call(
		ctx,
		operation,
		event,
		input,
		(parsed) => {
			const { rest, query, headers } = splitControls(parsed as Controls);
			return { method: 'POST', path: runPath(sku), query, body: rest, headers };
		},
		{ sku },
	);
}
