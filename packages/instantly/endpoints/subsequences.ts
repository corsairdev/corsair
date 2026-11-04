import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { withInstantlyTimezones } from './campaign-schedule';

export const create: InstantlyEndpoints['subsequencesCreate'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesCreate',
		'subsequences.create',
		input,
		({ subsequence_schedule, ...body }) => ({
			method: 'POST',
			path: '/subsequences',
			body: {
				...body,
				subsequence_schedule: subsequence_schedule
					? withInstantlyTimezones(subsequence_schedule)
					: undefined,
			},
		}),
		{},
	);

export const list: InstantlyEndpoints['subsequencesList'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesList',
		'subsequences.list',
		input,
		(query) => ({ method: 'GET', path: '/subsequences', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const get: InstantlyEndpoints['subsequencesGet'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesGet',
		'subsequences.get',
		input,
		({ id }) => ({ method: 'GET', path: `/subsequences/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const update: InstantlyEndpoints['subsequencesUpdate'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesUpdate',
		'subsequences.update',
		input,
		({ id, subsequence_schedule, ...body }) => ({
			method: 'PATCH',
			path: `/subsequences/${segment(id)}`,
			body: {
				...body,
				subsequence_schedule: subsequence_schedule
					? withInstantlyTimezones(subsequence_schedule)
					: undefined,
			},
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const remove: InstantlyEndpoints['subsequencesDelete'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesDelete',
		'subsequences.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/subsequences/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const duplicate: InstantlyEndpoints['subsequencesDuplicate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'subsequencesDuplicate',
		'subsequences.duplicate',
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/subsequences/${segment(id)}/duplicate`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const pause: InstantlyEndpoints['subsequencesPause'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesPause',
		'subsequences.pause',
		input,
		({ id }) => ({
			method: 'POST',
			path: `/subsequences/${segment(id)}/pause`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const resume: InstantlyEndpoints['subsequencesResume'] = (ctx, input) =>
	call(
		ctx,
		'subsequencesResume',
		'subsequences.resume',
		input,
		({ id }) => ({
			method: 'POST',
			path: `/subsequences/${segment(id)}/resume`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const getAnalytics: InstantlyEndpoints['subsequencesGetAnalytics'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'subsequencesGetAnalytics',
		'subsequences.getAnalytics',
		input,
		(query) => ({ method: 'GET', path: '/subsequences/analytics', query }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const getStepAnalytics: InstantlyEndpoints['subsequencesGetStepAnalytics'] =
	(ctx, input) =>
		call(
			ctx,
			'subsequencesGetStepAnalytics',
			'subsequences.getStepAnalytics',
			input,
			({ id, ...query }) => ({
				method: 'GET',
				path: `/subsequences/${segment(id)}/analytics/steps`,
				query,
			}),
			{ log: ({ id }) => ({ id }) },
		);

export const getSendingStatus: InstantlyEndpoints['subsequencesGetSendingStatus'] =
	(ctx, input) =>
		call(
			ctx,
			'subsequencesGetSendingStatus',
			'subsequences.getSendingStatus',
			input,
			({ id, ...query }) => ({
				method: 'GET',
				path: `/subsequences/${segment(id)}/sending-status`,
				query,
			}),
			{ log: ({ id }) => ({ id }) },
		);
