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

export const create: InstantlyEndpoints['accountsCreate'] = (ctx, input) =>
	call(
		ctx,
		'accountsCreate',
		'accounts.create',
		input,
		(body) => ({ method: 'POST', path: '/accounts', body }),
		{},
	);

export const update: InstantlyEndpoints['accountsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'accountsUpdate',
		'accounts.update',
		input,
		({ email, ...body }) => ({
			method: 'PATCH',
			path: `/accounts/${segment(email)}`,
			body,
		}),
		{ log: ({ email }) => ({ email }) },
	);

export const remove: InstantlyEndpoints['accountsDelete'] = (ctx, input) =>
	call(
		ctx,
		'accountsDelete',
		'accounts.delete',
		input,
		({ email }) => ({ method: 'DELETE', path: `/accounts/${segment(email)}` }),
		{ log: ({ email }) => ({ email }) },
	);

export const getDailyAnalytics: InstantlyEndpoints['accountsGetDailyAnalytics'] =
	(ctx, input) =>
		call(
			ctx,
			'accountsGetDailyAnalytics',
			'accounts.getDailyAnalytics',
			input,
			(query) => ({ method: 'GET', path: '/accounts/analytics/daily', query }),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const pauseMany: InstantlyEndpoints['accountsPauseMany'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsPauseMany',
		'accounts.pauseMany',
		input,
		(body) => ({ method: 'POST', path: '/accounts/pause', body }),
		{},
	);

export const markFixed: InstantlyEndpoints['accountsMarkFixed'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsMarkFixed',
		'accounts.markFixed',
		input,
		({ email }) => ({
			method: 'POST',
			path: `/accounts/${segment(email)}/mark-fixed`,
		}),
		{ log: ({ email }) => ({ email }) },
	);

export const getTrackingDomainStatus: InstantlyEndpoints['accountsGetTrackingDomainStatus'] =
	(ctx, input) =>
		call(
			ctx,
			'accountsGetTrackingDomainStatus',
			'accounts.getTrackingDomainStatus',
			input,
			(query) => ({ method: 'GET', path: '/accounts/ctd/status', query }),
			{},
		);

export const testVitals: InstantlyEndpoints['accountsTestVitals'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsTestVitals',
		'accounts.testVitals',
		input,
		(body) => ({ method: 'POST', path: '/accounts/test/vitals', body }),
		{},
	);

export const moveToWorkspace: InstantlyEndpoints['accountsMoveToWorkspace'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsMoveToWorkspace',
		'accounts.moveToWorkspace',
		input,
		(body) => ({ method: 'POST', path: '/accounts/move', body }),
		{},
	);

export const listCampaigns: InstantlyEndpoints['accountsListCampaigns'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsListCampaigns',
		'accounts.listCampaigns',
		input,
		({ email, ...query }) => ({
			method: 'GET',
			path: `/account-campaign-mappings/${segment(email)}`,
			query,
		}),
		{ log: ({ email }) => ({ email }) },
	);
