import { logEventFromContext } from 'corsair/core';
import type { ElasticsearchContext } from '..';
import type { ElasticsearchMethod, ElasticsearchQuery } from '../client';
import {
	ElasticsearchAPIError,
	makeElasticsearchBinaryRequest,
	makeElasticsearchRequest,
	resolveBaseUrl,
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
	method?: ElasticsearchMethod;
	path: (parsed: ElasticsearchEndpointInputs[K]) => string;
	query?: (parsed: ElasticsearchEndpointInputs[K]) => ElasticsearchQuery;
	// unknown values: the parsed query subset serialized as the JSON body; a
	// string return is a raw NDJSON payload sent verbatim.
	body?: (
		parsed: ElasticsearchEndpointInputs[K],
	) => Record<string, unknown> | string;
	/** Content-Type override for raw NDJSON string bodies (bulk, msearch). */
	mediaType?: (parsed: ElasticsearchEndpointInputs[K]) => string;
	/**
	 * Some GETs answer 404 with a body that is the documented no-match
	 * result, not a failure (documents.get: `{ found: false }`, documents
	 * .delete: `{ result: "not_found" }`). The predicate receives the 404
	 * body and decides; truthy bodies parse as the operation's output.
	 */
	notFoundIsResult?: (body: unknown) => boolean;
	/**
	 * HEAD exists checks answer 200 (found) or 404 (missing) with an empty
	 * body. The call resolves to `{ exists: boolean }` instead of throwing
	 * on 404; every other status still throws. Documented in README.md.
	 */
	existsStyle?: boolean;
	/** Binary (protobuf) response: bypass the JSON client, return base64. */
	binary?: boolean;
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

// Exported for endpoints that share the documents.get 404 contract.
export { notFoundFoundFalse };

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
		index: inputRecord?.index ?? inputRecord?.alias,
		id: inputRecord?.id,
		found: outputRecord?.found,
		exists: outputRecord?.exists,
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
	const {
		method = 'GET',
		notFoundIsResult,
		existsStyle = false,
		binary = false,
	} = requestOptions;

	const baseUrl = await resolveBaseUrl(ctx);

	if (binary) {
		const result = await makeElasticsearchBinaryRequest(baseUrl, ctx.key, {
			path: requestOptions.path(parsed),
			query: requestOptions.query?.(parsed),
		});
		const tile = ElasticsearchEndpointOutputSchemas[operation].parse(
			result,
		) as ElasticsearchEndpointOutputs[K];
		await logEventFromContext(
			ctx,
			`elasticsearch.${event}`,
			logFields(event, parsed, result),
			'completed',
		);
		return tile;
	}

	let raw: unknown;
	let resolved = false;
	try {
		raw = await makeElasticsearchRequest(baseUrl, ctx.key, {
			method,
			path: requestOptions.path(parsed),
			query: requestOptions.query?.(parsed),
			body: requestOptions.body?.(parsed),
			mediaType: requestOptions.mediaType?.(parsed),
		});
		resolved = true;
	} catch (error) {
		if (
			existsStyle &&
			error instanceof ElasticsearchAPIError &&
			error.status === 404
		) {
			raw = { exists: false };
			resolved = true;
		} else if (
			notFoundIsResult &&
			error instanceof ElasticsearchAPIError &&
			error.status === 404 &&
			notFoundIsResult(error.body)
		) {
			raw = error.body;
			resolved = true;
		} else {
			throw error;
		}
	}
	if (existsStyle && resolved && raw === undefined) {
		// HEAD answers 200 with an empty body: the status is the whole result.
		raw = { exists: true };
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
