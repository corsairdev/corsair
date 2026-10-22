import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Create an API key - POST /v1/api_keys
export const apiKeysCreate: DnsfilterEndpoints['apiKeysCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysCreate']
	>('/v1/api_keys', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			expiry: input.expiry,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.create',
		input ?? {},
		'completed',
	);
	return response;
};

// List API keys - GET /v1/api_keys
export const apiKeysList: DnsfilterEndpoints['apiKeysList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysList']
	>('/v1/api_keys', ctx.key, {
		method: 'GET',
		query: {
			expired: input.expired,
			id: input.id,
			last_four: input.last_four,
			name: input.name,
			organization_id: input.organization_id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Get an API key - GET /v1/api_keys/{id}
export const apiKeysGet: DnsfilterEndpoints['apiKeysGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysGet']
	>('/v1/api_keys/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete an API key - DELETE /v1/api_keys/{id}
export const apiKeysDelete: DnsfilterEndpoints['apiKeysDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysDelete']
	>('/v1/api_keys/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.delete',
		input ?? {},
		'completed',
	);
	return response;
};

// Revoke an API key - POST /v1/api_keys/{id}/revoke
export const apiKeysRevoke: DnsfilterEndpoints['apiKeysRevoke'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysRevoke']
	>('/v1/api_keys/{id}/revoke', ctx.key, {
		method: 'POST',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.revoke',
		input ?? {},
		'completed',
	);
	return response;
};
