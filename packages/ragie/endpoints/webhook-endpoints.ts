import type { RagieEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RagieEndpointInputSchemas as Inputs,
	RagieEndpointOutputSchemas as Outputs,
} from './types';

// This group manages webhook registrations over the API. Ragie's deliveries
// are not handled by the plugin: there is no inbound webhook route to verify
// them against.
export const list: RagieEndpoints['webhookEndpointsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookEndpoints.list',
			input: Inputs.webhookEndpointsList,
			output: Outputs.webhookEndpointsList,
		},
		input,
		({ cursor, page_size }) => ({
			method: 'GET',
			path: '/webhook_endpoints',
			query: { cursor, page_size },
		}),
	);

// The create answer carries the endpoint's signing secret, so it is a write,
// never a read.
export const create: RagieEndpoints['webhookEndpointsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookEndpoints.create',
			input: Inputs.webhookEndpointsCreate,
			output: Outputs.webhookEndpointsCreate,
		},
		input,
		({ name, url, partition_pattern }) => ({
			method: 'POST',
			path: '/webhook_endpoints',
			body: { name, url, partition_pattern },
		}),
		{
			log: (_parsed, result) => ({ endpointId: result.id }),
		},
	);

export const get: RagieEndpoints['webhookEndpointsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookEndpoints.get',
			input: Inputs.webhookEndpointsGet,
			output: Outputs.webhookEndpointsGet,
		},
		input,
		({ endpoint_id }) => ({
			method: 'GET',
			path: `/webhook_endpoints/${segment(endpoint_id)}`,
		}),
	);

export const update: RagieEndpoints['webhookEndpointsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookEndpoints.update',
			input: Inputs.webhookEndpointsUpdate,
			output: Outputs.webhookEndpointsUpdate,
		},
		input,
		({ endpoint_id, name, url, partition_pattern, active }) => ({
			method: 'PATCH',
			path: `/webhook_endpoints/${segment(endpoint_id)}`,
			body: { name, url, partition_pattern, active },
		}),
	);

export const remove: RagieEndpoints['webhookEndpointsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhookEndpoints.delete',
			input: Inputs.webhookEndpointsDelete,
			output: Outputs.webhookEndpointsDelete,
		},
		input,
		({ endpoint_id }) => ({
			method: 'DELETE',
			path: `/webhook_endpoints/${segment(endpoint_id)}`,
		}),
		{
			// The answer is ResponseOK; an empty 200 parses as an empty object.
			shape: (raw) => Outputs.webhookEndpointsDelete.parse(raw ?? {}),
		},
	);
