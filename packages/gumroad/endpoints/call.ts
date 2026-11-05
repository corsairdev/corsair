import { logEventFromContext } from 'corsair/core';
import type { GumroadContext } from '..';
import type {
	GumroadForm,
	GumroadJsonBody,
	GumroadMethod,
	GumroadQuery,
} from '../client';
import { errorFromEnvelope, makeGumroadRequest } from '../client';
import type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
	GumroadOperation,
} from './types';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './types';

type CallOptions<K extends GumroadOperation> = {
	method?: GumroadMethod;
	baseUrl?: (parsed: GumroadEndpointInputs[K]) => string;
	toQuery?: (parsed: GumroadEndpointInputs[K]) => GumroadQuery;
	toForm?: (parsed: GumroadEndpointInputs[K]) => GumroadForm;
	toJson?: (parsed: GumroadEndpointInputs[K]) => GumroadJsonBody;
};

/**
 * Validates the input, sends it as the query string, form body or JSON body,
 * rejects envelopes that report a failure, validates the response and logs
 * the call.
 */
export async function call<K extends GumroadOperation>(
	ctx: GumroadContext,
	operation: K,
	event: string,
	path: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	options: CallOptions<K> = {},
): Promise<GumroadEndpointOutputs[K]> {
	// The casts stay because zod's parse returns the schema's inferred type,
	// which TypeScript cannot relate to the registry's per-K entry when K is
	// generic; the schemas themselves pin the actual shapes.
	const parsed = GumroadEndpointInputSchemas[operation].parse(
		input ?? {},
	) as GumroadEndpointInputs[K];
	const query = options.toQuery ? options.toQuery(parsed) : undefined;
	const form = options.toForm ? options.toForm(parsed) : undefined;
	const json = options.toJson ? options.toJson(parsed) : undefined;
	const baseUrl = options.baseUrl ? options.baseUrl(parsed) : undefined;
	const raw = await makeGumroadRequest(path, ctx.key, {
		method: options.method ?? 'GET',
		query,
		form,
		json,
		baseUrl,
	});

	const envelopeError = errorFromEnvelope(raw);
	if (envelopeError) throw envelopeError;

	const result = GumroadEndpointOutputSchemas[operation].parse(
		raw,
	) as GumroadEndpointOutputs[K];

	// Filters and bodies carry buyer emails and license keys; only the path,
	// which holds opaque ids, is logged.
	await logEventFromContext(ctx, `gumroad.${event}`, { path }, 'completed');
	return result;
}
