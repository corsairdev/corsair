import type { KeywordEndpoints } from '..';
import { segment } from '../client';
import { call, dropUndefined } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

export const get: KeywordEndpoints['sharingGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sharing.get',
			input: Inputs.sharingGet,
			output: Outputs.sharingGet,
		},
		input,
		({ projectId }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/sharing-settings`,
		}),
		{ log: ({ projectId }) => ({ projectId }) },
	);

export const update: KeywordEndpoints['sharingUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sharing.update',
			input: Inputs.sharingUpdate,
			output: Outputs.sharingUpdate,
		},
		input,
		// The settings go at the top level of the body, not in a JSON:API
		// resource. A null password is kept: it removes the protection.
		({ projectId, ...settings }) => ({
			method: 'PATCH',
			path: `/projects/${segment(projectId)}/sharing-settings`,
			body: dropUndefined(settings),
		}),
		{ log: ({ projectId }) => ({ projectId }) },
	);
