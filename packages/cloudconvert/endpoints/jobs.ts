import type { CloudConvertEndpoints } from '..';
import { call, joinList } from './call';
import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './types';

export const jobsCreate: CloudConvertEndpoints['jobsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.create',
			input: Inputs.jobsCreate,
			output: Outputs.jobsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/jobs',
			body: {
				tasks: parsed.tasks,
				...(parsed.tag === undefined ? {} : { tag: parsed.tag }),
			},
		}),
		{ log: (parsed) => ({ taskCount: Object.keys(parsed.tasks).length }) },
	);

export const jobsCreateAndWait: CloudConvertEndpoints['jobsCreateAndWait'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'jobs.createAndWait',
			input: Inputs.jobsCreateAndWait,
			output: Outputs.jobsCreateAndWait,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/jobs',
			host: 'sync',
			body: {
				tasks: parsed.tasks,
				...(parsed.tag === undefined ? {} : { tag: parsed.tag }),
				...(parsed.redirect === undefined ? {} : { redirect: parsed.redirect }),
			},
		}),
		{ log: (parsed) => ({ taskCount: Object.keys(parsed.tasks).length }) },
	);

export const jobsGet: CloudConvertEndpoints['jobsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.get',
			input: Inputs.jobsGet,
			output: Outputs.jobsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/jobs/${encodeURIComponent(parsed.jobId)}`,
			query: { redirect: parsed.redirect },
		}),
		{ log: () => ({}) },
	);

export const jobsWait: CloudConvertEndpoints['jobsWait'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.wait',
			input: Inputs.jobsWait,
			output: Outputs.jobsWait,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/jobs/${encodeURIComponent(parsed.jobId)}`,
			host: 'sync',
			query: { redirect: parsed.redirect },
		}),
		{ log: () => ({}) },
	);

export const jobsList: CloudConvertEndpoints['jobsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.list',
			input: Inputs.jobsList,
			output: Outputs.jobsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/jobs',
			query: {
				'filter[status]': parsed.status,
				'filter[tag]': parsed.tag,
				'filter[access_token]': parsed.accessToken,
				include: joinList(parsed.include),
				per_page: parsed.perPage,
				page: parsed.page,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				page: result.meta?.current_page,
			}),
		},
	);

export const jobsRemove: CloudConvertEndpoints['jobsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.remove',
			input: Inputs.jobsRemove,
			output: Outputs.jobsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/jobs/${encodeURIComponent(parsed.jobId)}`,
		}),
		{ log: () => ({}) },
	);
