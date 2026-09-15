import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { makeCdpRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// POST /v1/batch (CDP API, up to 500KB total with 32KB per call)
// Docs: https://docs.customer.io/integrations/api/cdp/
export const sendBatch: CustomerioEndpoints['sendBatch'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		batch: input.batch,
	};
	if (input.context !== undefined) {
		body.context = input.context;
	}
	const response = await makeCdpRequest<CustomerioEndpointOutputs['sendBatch']>(
		'/v1/batch',
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'customerio.cdp.sendBatch',
		{ ...input },
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
	const response = await makeCdpRequest<CustomerioEndpointOutputs['trackPage']>(
		'/v1/page',
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'customerio.cdp.trackPage',
		{ ...input },
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
	const response = await makeCdpRequest<
		CustomerioEndpointOutputs['trackScreen']
	>('/v1/screen', ctx.key, { method: 'POST', body });
	await logEventFromContext(
		ctx,
		'customerio.cdp.trackScreen',
		{ ...input },
		'completed',
	);
	return response;
};
