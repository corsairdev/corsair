import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { saveAccounts } from './store';

export const list: InstantlyEndpoints['accountsList'] = (ctx, input) =>
	call(
		ctx,
		'accountsList',
		'accounts.list',
		input,
		({ tag_ids, ...query }) => ({
			method: 'GET',
			path: '/accounts',
			query: { ...query, tag_ids: tag_ids?.join(',') },
		}),
		{
			log: (_, result) => ({ count: result.items.length }),
			after: (result) => saveAccounts(ctx, result.items),
		},
	);

export const get: InstantlyEndpoints['accountsGet'] = (ctx, input) =>
	call(
		ctx,
		'accountsGet',
		'accounts.get',
		input,
		({ email }) => ({ method: 'GET', path: `/accounts/${segment(email)}` }),
		{
			log: ({ email }) => ({ account: email }),
			after: (result) => saveAccounts(ctx, [result]),
		},
	);

// A POST, but it only reads.
export const getWarmupAnalytics: InstantlyEndpoints['accountsGetWarmupAnalytics'] =
	(ctx, input) =>
		call(
			ctx,
			'accountsGetWarmupAnalytics',
			'accounts.getWarmupAnalytics',
			input,
			(body) => ({ method: 'POST', path: '/accounts/warmup-analytics', body }),
			{ log: ({ emails }) => ({ accounts: emails.length }) },
		);

export const pause: InstantlyEndpoints['accountsPause'] = (ctx, input) =>
	call(
		ctx,
		'accountsPause',
		'accounts.pause',
		input,
		({ email }) => ({
			method: 'POST',
			path: `/accounts/${segment(email)}/pause`,
		}),
		{
			log: ({ email }) => ({ account: email }),
			after: (result) => saveAccounts(ctx, [result]),
		},
	);

export const resume: InstantlyEndpoints['accountsResume'] = (ctx, input) =>
	call(
		ctx,
		'accountsResume',
		'accounts.resume',
		input,
		({ email }) => ({
			method: 'POST',
			path: `/accounts/${segment(email)}/resume`,
		}),
		{
			log: ({ email }) => ({ account: email }),
			after: (result) => saveAccounts(ctx, [result]),
		},
	);

// Both start a background job; the response is the job, not the accounts.
export const enableWarmup: InstantlyEndpoints['accountsEnableWarmup'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsEnableWarmup',
		'accounts.enableWarmup',
		input,
		({ emails }) => ({
			method: 'POST',
			path: '/accounts/warmup/enable',
			body: { emails },
		}),
		{ log: ({ emails }, job) => ({ accounts: emails.length, jobId: job.id }) },
	);

export const disableWarmup: InstantlyEndpoints['accountsDisableWarmup'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsDisableWarmup',
		'accounts.disableWarmup',
		input,
		({ emails }) => ({
			method: 'POST',
			path: '/accounts/warmup/disable',
			body: { emails },
		}),
		{ log: ({ emails }, job) => ({ accounts: emails.length, jobId: job.id }) },
	);
