import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const create: StannpEndpoints['selectionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'selections.create',
			input: Inputs.selectionsCreate,
			output: Outputs.selectionsCreate,
		},
		input,
		({ group_id, name, filters, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/selections/new',
			form: { group_id, name, filters },
			idempotencyKey,
		}),
		{
			log: ({ group_id }, result) => ({
				groupId: group_id,
				id: result[0]?.id ?? undefined,
			}),
		},
	);
