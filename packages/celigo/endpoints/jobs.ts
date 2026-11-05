import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['jobsList'] = (ctx, input) =>
	callCeligo(ctx, 'jobs.list', In.jobsList, Out.jobsList, input, (i) => ({
		method: 'GET',
		save: 'jobs',
		path: ['jobs'],
		query: {
			_integrationId: i._integrationId,
			_exportId: i._exportId,
			_importId: i._importId,
			_flowId: i._flowId,
			_flowJobId: i._flowJobId,
			_flowId_in: i._flowId_in,
			status_in: i.status_in,
			createdAt_lte: i.createdAt_lte,
			createdAt_gte: i.createdAt_gte,
			status: i.status,
			numSuccess_lte: i.numSuccess_lte,
			numSuccess_gte: i.numSuccess_gte,
			numIgnore_lte: i.numIgnore_lte,
			numIgnore_gte: i.numIgnore_gte,
			numError_gte: i.numError_gte,
			numError_lte: i.numError_lte,
			type: i.type,
		},
		empty: [],
	}));

export const getErrors: CeligoEndpoints['jobsGetErrors'] = (ctx, input) =>
	callCeligo(
		ctx,
		'jobs.getErrors',
		In.jobsGetErrors,
		Out.jobsGetErrors,
		input,
		(i) => ({
			method: 'GET',
			path: ['jobs', i.id, 'joberrors'],
			empty: [],
		}),
	);
