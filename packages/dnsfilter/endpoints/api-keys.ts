import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Create an API key - POST /v1/api_keys
export const apiKeysCreate: DnsfilterEndpoints['apiKeysCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.apiKeysCreate.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysCreate']
	>('/v1/api_keys', ctx.key, {
		method: 'POST',
		body: {
			name: values.name,
			expiry: values.expiry,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.apiKeysCreate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List API keys - GET /v1/api_keys
export const apiKeysList: DnsfilterEndpoints['apiKeysList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.apiKeysList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysList']
	>('/v1/api_keys', ctx.key, {
		method: 'GET',
		query: {
			expired: values.expired,
			id: values.id,
			last_four: values.last_four,
			name: values.name,
			organization_id: values.organization_id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.apiKeysList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get an API key - GET /v1/api_keys/{id}
export const apiKeysGet: DnsfilterEndpoints['apiKeysGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.apiKeysGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysGet']
	>('/v1/api_keys/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.apiKeysGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete an API key - DELETE /v1/api_keys/{id}
export const apiKeysDelete: DnsfilterEndpoints['apiKeysDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.apiKeysDelete.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysDelete']
	>('/v1/api_keys/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.apiKeysDelete.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Revoke an API key - POST /v1/api_keys/{id}/revoke
export const apiKeysRevoke: DnsfilterEndpoints['apiKeysRevoke'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.apiKeysRevoke.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['apiKeysRevoke']
	>('/v1/api_keys/{id}/revoke', ctx.key, {
		method: 'POST',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.apiKeysRevoke.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.apiKeys.revoke',
		redactSensitive(values),
		'completed',
	);
	return result;
};
