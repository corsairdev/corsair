import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { CustomerioAPIError, makeCdpRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// Pipelines limits per https://docs.customer.io/integrations/api/track-vs-cdp-api
// (Sept 2026): 64KB per single request, 1MB per batch request. Payloads are
// rejected here — before logging completion or sending — so oversized calls
// fail fast instead of surfacing as silent server-side drops.
const CDP_SINGLE_CALL_MAX_BYTES = 64 * 1024;
const CDP_BATCH_MAX_BYTES = 1024 * 1024;

function utf8ByteLength(value: CustomerioJsonObject): number {
	return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

function assertCdpCallSize(call: CustomerioJsonObject): void {
	const size: number = utf8ByteLength(call);
	if (size > CDP_SINGLE_CALL_MAX_BYTES) {
		throw new CustomerioAPIError(
			`CDP call exceeds the 64KB single-request limit (${size} bytes)`,
		);
	}
}

// POST /v1/batch (CDP API, up to 1MB total with 64KB per call)
// Docs: https://docs.customer.io/integrations/api/cdp/
export const sendBatch: CustomerioEndpoints['sendBatch'] = async (
	ctx,
	input,
) => {
	for (const call of input.batch) {
		assertCdpCallSize(call);
	}
	const body: CustomerioJsonObject = {
		batch: input.batch,
	};
	if (input.context !== undefined) {
		body.context = input.context;
	}
	if (utf8ByteLength(body) > CDP_BATCH_MAX_BYTES) {
		throw new CustomerioAPIError(
			`CDP batch exceeds the 1MB total-request limit (${utf8ByteLength(body)} bytes)`,
		);
	}
	const response = await makeCdpRequest<CustomerioEndpointOutputs['sendBatch']>(
		'/v1/batch',
		ctx.key,
		{ method: 'POST', body },
	);
	// Minimal logging: batch contents carry user identities and traits, so
	// only the aggregate count is persisted.
	await logEventFromContext(
		ctx,
		'customerio.cdp.sendBatch',
		{ batch_size: input.batch.length },
		'completed',
	);
	return response;
};

// POST /v1/page (CDP API)
// Docs: https://docs.customer.io/integrations/api/cdp/
export const trackPage: CustomerioEndpoints['trackPage'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {};
	if (input.userId !== undefined) {
		body.userId = input.userId;
	}
	if (input.anonymousId !== undefined) {
		body.anonymousId = input.anonymousId;
	}
	if (input.name !== undefined) {
		body.name = input.name;
	}
	if (input.properties !== undefined) {
		body.properties = input.properties;
	}
	if (input.context !== undefined) {
		body.context = input.context;
	}
	if (input.timestamp !== undefined) {
		body.timestamp = input.timestamp;
	}
	assertCdpCallSize(body);
	const response = await makeCdpRequest<CustomerioEndpointOutputs['trackPage']>(
		'/v1/page',
		ctx.key,
		{ method: 'POST', body },
	);
	// Minimal logging: only the page name is persisted; identifiers,
	// properties and context are excluded.
	await logEventFromContext(
		ctx,
		'customerio.cdp.trackPage',
		{ name: input.name },
		'completed',
	);
	return response;
};

// POST /v1/screen (CDP API)
// Docs: https://docs.customer.io/integrations/api/cdp/
export const trackScreen: CustomerioEndpoints['trackScreen'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		name: input.name,
	};
	if (input.userId !== undefined) {
		body.userId = input.userId;
	}
	if (input.anonymousId !== undefined) {
		body.anonymousId = input.anonymousId;
	}
	if (input.properties !== undefined) {
		body.properties = input.properties;
	}
	if (input.context !== undefined) {
		body.context = input.context;
	}
	if (input.timestamp !== undefined) {
		body.timestamp = input.timestamp;
	}
	assertCdpCallSize(body);
	const response = await makeCdpRequest<
		CustomerioEndpointOutputs['trackScreen']
	>('/v1/screen', ctx.key, { method: 'POST', body });
	// Minimal logging: only the screen name is persisted; identifiers,
	// properties and context are excluded.
	await logEventFromContext(
		ctx,
		'customerio.cdp.trackScreen',
		{ name: input.name },
		'completed',
	);
	return response;
};
