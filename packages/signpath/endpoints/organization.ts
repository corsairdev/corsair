import type { SignpathEndpoints } from '..';
import { call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignpathEndpoints['organizationGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'organization.get',
			input: Inputs.organizationGet,
			output: Outputs.organizationGet,
		},
		input,
		(_, organizationId) => ({
			method: 'GET',
			path: orgPath(organizationId, '/Organization'),
		}),
		{
			log: (_, result) => ({
				subscriptionType: result.subscriptionType,
			}),
		},
	);
