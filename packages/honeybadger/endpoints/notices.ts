import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

function faultPath(projectId: string, faultId: string): string {
	return `/projects/${segment(projectId)}/faults/${segment(faultId)}`;
}

export const noticesList: HoneybadgerEndpoints['noticesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notices.list',
			input: Inputs['notices.list'],
			output: Outputs['notices.list'],
		},
		input,
		({ project_id, fault_id, limit, before, after, unmapped }) => ({
			method: 'GET',
			path: `${faultPath(project_id, fault_id)}/notices`,
			query: { limit, before, after, unmapped },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: HoneybadgerEndpoints['noticesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notices.get',
			input: Inputs['notices.get'],
			output: Outputs['notices.get'],
		},
		input,
		({ uuid, unmapped }) => ({
			method: 'GET',
			path: `/notices/${segment(uuid)}`,
			query: { unmapped },
		}),
		{ log: ({ uuid }) => ({ noticeId: uuid }) },
	);
