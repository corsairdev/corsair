import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPaginationQuery, resolveAccount } from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * The V2 segments API: segment definitions keyed by UUID, their count history,
 * and contact match evaluation.
 *
 * ROUTE VERIFICATION STATUS - read before changing anything here.
 *
 * Every other operation in this plugin was confirmed against a live account
 * before being written. These could not be: the account used for development
 * answers 404 to `/v2/segments`, `/segments/v2`, `/segments/{id}/counts`,
 * `/segments/{id}/match` and `/api/v2/segments`, and the ActiveCampaign
 * documentation pages for the V2 segments API were not reachable either. The
 * legacy `/segments` collection - which this plugin does implement, in
 * `content.ts` - answers 200 on the same account, so the V2 surface appears to
 * be gated by plan or by feature flag rather than simply misnamed.
 *
 * The paths below therefore follow the shape the OSS catalog descriptions
 * imply, and are listed in {@link UNVERIFIED_ROUTES} so the uncertainty is
 * visible in code rather than buried in a commit message. `segments.test.ts`
 * asserts that list stays in step with this file.
 *
 * Before relying on these: run them against an account that has the V2
 * segments feature, correct the paths against what actually answers, and
 * remove the entries from UNVERIFIED_ROUTES.
 */

/**
 * Operations whose route could not be confirmed against a live account.
 *
 * Kept as an exported constant so the PR body, the docs and the tests all read
 * the same list, and so a reviewer can see the honest state at a glance.
 */
export const UNVERIFIED_ROUTES: ReadonlySet<string> = new Set([
	'segmentsV2Create',
	'segmentsV2Get',
	'segmentsV2Update',
	'segmentsV2Delete',
	'segmentsV2GetAtTimestamp',
	'segmentsV2RevertToTimestamp',
	'segmentsV2RecentCounts',
	'segmentsV2CountHistory',
	'segmentsV2CountAtTimestamp',
	'segmentsV2Match',
	'segmentsV2MatchByExternalId',
	'segmentsV2MatchAll',
	'segmentsV2MatchAllResult',
	'segmentsV2MatchSomeResult',
]);

const BASE = 'segments';

export const create: ActiveCampaignEndpoints['segmentsV2Create'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2Create']
	>(BASE, ctx.key, account, {
		method: 'POST',
		body: {
			segment: {
				name: input.name,
				...(input.description !== undefined && {
					description: input.description,
				}),
				...(input.conditions !== undefined && { conditions: input.conditions }),
			},
		},
	});

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.create',
		auditPayload(input, []),
		'completed',
	);
	return response;
};

export const get: ActiveCampaignEndpoints['segmentsV2Get'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2Get']
	>(`${BASE}/${input.id}`, ctx.key, account, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const update: ActiveCampaignEndpoints['segmentsV2Update'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2Update']
	>(`${BASE}/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: {
			segment: {
				...(input.name !== undefined && { name: input.name }),
				...(input.description !== undefined && {
					description: input.description,
				}),
				...(input.conditions !== undefined && { conditions: input.conditions }),
			},
		},
	});

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.update',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/**
 * Deleting a segment removes every historic version of it as well, so the API
 * returns the segment's final state as an audit trail.
 */
export const remove: ActiveCampaignEndpoints['segmentsV2Delete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2Delete']
	>(`${BASE}/${input.id}`, ctx.key, account, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/** The segment definition as it stood at a point in time. */
export const getAtTimestamp: ActiveCampaignEndpoints['segmentsV2GetAtTimestamp'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2GetAtTimestamp']
		>(`${BASE}/${input.id}/${input.timestamp}`, ctx.key, account, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.getAtTimestamp',
			auditPayload(input, ['id', 'timestamp']),
			'completed',
		);
		return response;
	};

/** Restores a segment to how it looked at a point in time. */
export const revertToTimestamp: ActiveCampaignEndpoints['segmentsV2RevertToTimestamp'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2RevertToTimestamp']
		>(`${BASE}/${input.id}/${input.timestamp}`, ctx.key, account, {
			method: 'PUT',
		});

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.revertToTimestamp',
			auditPayload(input, ['id', 'timestamp']),
			'completed',
		);
		return response;
	};

export const recentCounts: ActiveCampaignEndpoints['segmentsV2RecentCounts'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2RecentCounts']
		>(`${BASE}/counts`, ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.recentCounts',
			auditPayload(input, ['limit', 'offset']),
			'completed',
		);
		return response;
	};

/**
 * Historic counts for one segment. ActiveCampaign documents a cap of 50
 * results and 90 days of retention.
 */
export const countHistory: ActiveCampaignEndpoints['segmentsV2CountHistory'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2CountHistory']
		>(`${BASE}/${input.id}/counts`, ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.countHistory',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

export const countAtTimestamp: ActiveCampaignEndpoints['segmentsV2CountAtTimestamp'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2CountAtTimestamp']
		>(`${BASE}/${input.id}/counts/${input.timestamp}`, ctx.key, account, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.countAtTimestamp',
			auditPayload(input, ['id', 'timestamp']),
			'completed',
		);
		return response;
	};

/** Whether one contact matches a segment. */
export const match: ActiveCampaignEndpoints['segmentsV2Match'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2Match']
	>(`${BASE}/${input.id}/match/${input.contactId}`, ctx.key, account, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.match',
		auditPayload(input, ['id', 'contactId']),
		'completed',
	);
	return response;
};

export const matchByExternalId: ActiveCampaignEndpoints['segmentsV2MatchByExternalId'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2MatchByExternalId']
		>(
			`${BASE}/${input.id}/match/external/${encodeURIComponent(input.externalId)}`,
			ctx.key,
			account,
			{ method: 'GET' },
		);

		// The external id is the caller's own key for a person; only the field
		// name is recorded.
		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.matchByExternalId',
			{ id: input.id, fields: ['externalId'] },
			'completed',
		);
		return response;
	};

/**
 * Starts a match-all evaluation.
 *
 * ActiveCampaign answers within about four seconds if it can, and otherwise
 * returns `is_ready: false` with a run id to poll - which is what
 * `matchAllResult` is for.
 */
export const matchAll: ActiveCampaignEndpoints['segmentsV2MatchAll'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['segmentsV2MatchAll']
	>(`${BASE}/${input.id}/matchAll`, ctx.key, account, { method: 'POST' });

	await logEventFromContext(
		ctx,
		'activecampaign.segmentsV2.matchAll',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/**
 * Fetches a match-all result set by run id.
 *
 * `is_ready: false` with `run_id_end` populated means the run errored rather
 * than that it is still working - worth checking both before polling again.
 */
export const matchAllResult: ActiveCampaignEndpoints['segmentsV2MatchAllResult'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2MatchAllResult']
		>(`${BASE}/matchAll/${input.runId}`, ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.matchAllResult',
			auditPayload(input, ['runId']),
			'completed',
		);
		return response;
	};

export const matchSomeResult: ActiveCampaignEndpoints['segmentsV2MatchSomeResult'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsV2MatchSomeResult']
		>(`${BASE}/matchSome/${input.runId}`, ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.segmentsV2.matchSomeResult',
			auditPayload(input, ['runId']),
			'completed',
		);
		return response;
	};
