import type { KeywordEndpoints } from '..';
import { segment } from '../client';
import { call, dropUndefined, resourceBody } from './call';
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
		({ projectId, ...attributes }) => ({
			method: 'PATCH',
			path: `/projects/${segment(projectId)}/sharing-settings`,
			body: resourceBody('sharing-setting', dropUndefined(attributes)),
		}),
		{ log: ({ projectId }) => ({ projectId }) },
	);
