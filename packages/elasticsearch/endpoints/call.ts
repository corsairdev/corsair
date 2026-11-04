import { logEventFromContext } from 'corsair/core';
import type { ElasticsearchContext } from '..';
import {
	ElasticsearchAPIError,
	makeElasticsearchRequest,
	resolveBaseUrl,
	type ElasticsearchQuery,
} from '../client';
import type {
	ElasticsearchEndpointInputs,
	ElasticsearchEndpointOutputs,
	ElasticsearchOperation,
} from './types';
import {
	ElasticsearchEndpointInputSchemas,
	ElasticsearchEndpointOutputSchemas,
} from './types';

export type CallRequestOptions<K extends ElasticsearchOperation> = {
	method?: 'GET' | 'POST';
	path: (parsed: ElasticsearchEndpointInputs[K]) => string;
	query?: (parsed: ElasticsearchEndpointInputs[K]) => ElasticsearchQuery;
	body?: (parsed: ElasticsearchEndpointInputs[K]) => Record<string, unknown>;
	/**
	 * documents.get answers 404 with `{ found: false }` when the id (or
	 * index) does not exist — the documented no-match signal, not a failure.
	 * With this flag that body parses as the operation's output instead of
	 * throwing.
	 */
	notFoundIsResult?: boolean;
};

// unknown: the 404 body is untrusted until this guard runs.
function notFoundFoundFalse(body: unknown): boolean {
	return (
		body !== null &&
		typeof body === 'object' &&
		!Array.isArray(body) &&
		(body as Record<string, unknown>).found === false
	);
}

// unknown: parsed and result are the generic operation's input and output;
// the log reads only identifier and count fields that some operations carry.
function logFields(event: string, parsed: unknown, result: unknown) {
	const inputRecord =
		parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
		? (parsed as Record<string, unknown>)
		: undefined;
	const outputRecord =
		result !== null && typeof result === 'object' && !Array.isArray(result)
		? (result as Record<string, unknown>)
		: undefined;
	const hits =
		outputRecord?.hits !== null &&
		typeof outputRecord?.hits === 'object' &&
		!Array.isArray(outputRecord?.hits)
		? (outputRecord.hits as Record<string, unknown>)
		: undefined;
	return {
		operation: event,
		// Identifiers and counts only; search terms never reach the log.
		index: inputRecord?.index,
		found: outputRecord?.found,
		hitCount: Array.isArray(hits?.hits) ? hits.hits.length : undefined,
	};
}

/**
 * Resolves the cluster endpoint and credential, validates the input, sends
 * the request, validates the response and logs the call. Nothing crosses the
 * boundary unvalidated.
 */
export async function call<K extends ElasticsearchOperation>(
	ctx: ElasticsearchContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	requestOptions: CallRequestOptions<K>,
): Promise<ElasticsearchEndpointOutputs[K]> {
	const parsed = ElasticsearchEndpointInputSchemas[operation].parse(
		input ?? {},
	) as ElasticsearchEndpointInputs[K];
	const { method = 'GET', notFoundIsResult = false } = requestOptions;

	const baseUrl = await resolveBaseUrl(ctx);
	let raw: unknown;
	try {
		raw = await makeElasticsearchRequest(baseUrl, ctx.key, {
			method,
			path: requestOptions.path(parsed),
			query: requestOptions.query?.(parsed),
			body: requestOptions.body?.(parsed),
		});
	} catch (error) {
		if (
			notFoundIsResult &&
			error instanceof ElasticsearchAPIError &&
			error.status === 404 &&
			notFoundFoundFalse(error.body)
		) {
			raw = error.body;
		} else {
			throw error;
		}
	}

	const result = ElasticsearchEndpointOutputSchemas[operation].parse(
		raw,
	) as ElasticsearchEndpointOutputs[K];

	await logEventFromContext(
		ctx,
		`elasticsearch.${event}`,
		logFields(event, parsed, result),
		'completed',
	);
	return result;
}
