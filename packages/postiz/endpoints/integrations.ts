import type { PostizEndpoints } from '..';
import { segment } from '../client';
import { asList, call } from './call';
import {
	PostizEndpointInputSchemas as Inputs,
	PostizEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostizEndpoints['integrationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'integrations.list',
			input: Inputs.integrationsList,
			output: Outputs.integrationsList,
		},
		input,
		({ group }) => ({ method: 'GET', path: '/integrations', query: { group } }),
		{
			// The route answers a bare array, not an envelope.
			shape: asList('integrations'),
			log: (_, result) => ({ count: result.integrations.length }),
		},
	);

export const isConnected: PostizEndpoints['isConnected'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'integrations.isConnected',
			input: Inputs.isConnected,
			output: Outputs.isConnected,
		},
		input,
		() => ({ method: 'GET', path: '/is-connected' }),
	);

export const findSlot: PostizEndpoints['findSlot'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'integrations.findSlot',
			input: Inputs.findSlot,
			output: Outputs.findSlot,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/find-slot/${segment(id)}`,
		}),
		{ log: (_, result) => ({ date: result.date }) },
	);
