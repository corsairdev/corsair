import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InstantlyEndpoints['backgroundJobsList'] = (ctx, input) =>
	call(
		ctx,
		'backgroundJobsList',
		'backgroundJobs.list',
		input,
		(query) => ({ method: 'GET', path: '/background-jobs', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const get: InstantlyEndpoints['backgroundJobsGet'] = (ctx, input) =>
	call(
		ctx,
		'backgroundJobsGet',
		'backgroundJobs.get',
		input,
		({ id, ...query }) => ({
			method: 'GET',
			path: `/background-jobs/${segment(id)}`,
			query,
		}),
		{ log: ({ id }) => ({ id }) },
	);
