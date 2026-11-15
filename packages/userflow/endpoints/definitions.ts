import type { UserflowEndpoints } from '..';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Attribute and event definitions are created by Userflow itself, the first
 * time an unseen attribute or event name arrives. The API exposes only listing
 * them, which is useful for discovering what a workspace already tracks.
 */
export const listAttributes: UserflowEndpoints['attributesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attributes.list',
			input: Inputs.attributesList,
			output: Outputs.attributesList,
		},
		input,
		({ limit, starting_after, scope, event_name, order_by }) => ({
			method: 'GET',
			path: '/attribute_definitions',
			query: { limit, starting_after, scope, event_name, order_by },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);

export const listEvents: UserflowEndpoints['eventDefinitionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'eventDefinitions.list',
			input: Inputs.eventDefinitionsList,
			output: Outputs.eventDefinitionsList,
		},
		input,
		({ limit, starting_after, order_by }) => ({
			method: 'GET',
			path: '/event_definitions',
			query: { limit, starting_after, order_by },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);
