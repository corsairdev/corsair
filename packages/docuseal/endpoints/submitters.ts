import type { DocuSealEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DocuSealEndpointInputSchemas as Inputs,
	DocuSealEndpointOutputSchemas as Outputs,
} from './types';

export const list: DocuSealEndpoints['submittersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submitters.list',
			input: Inputs.submittersList,
			output: Outputs.submittersList,
		},
		input,
		({
			submission_id,
			q,
			slug,
			completed_after,
			completed_before,
			external_id,
			limit,
			after,
			before,
		}) => ({
			method: 'GET',
			path: '/submitters',
			query: {
				submission_id,
				q,
				slug,
				completed_after,
				completed_before,
				external_id,
				limit,
				after,
				before,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				next: result.pagination.next ?? undefined,
			}),
		},
	);

export const get: DocuSealEndpoints['submittersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submitters.get',
			input: Inputs.submittersGet,
			output: Outputs.submittersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/submitters/${segment(id)}` }),
		{ log: ({ id }) => ({ submitterId: id }) },
	);

export const update: DocuSealEndpoints['submittersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submitters.update',
			input: Inputs.submittersUpdate,
			output: Outputs.submittersUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/submitters/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ submitterId: id }) },
	);
