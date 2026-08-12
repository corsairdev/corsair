import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheClient, cacheProject, cacheTag } from './persist';
import type { TogglEndpointOutputs } from './types';

/**
 * Toggl's `/me` response carries `api_token` — the caller's reusable,
 * non-expiring account credential. Returning it would hand a full-account key
 * to anything allowed to read a profile, so it is dropped before the result
 * leaves the plugin.
 */
function withoutCredentials(
	user: TogglEndpointOutputs['meGet'] & { api_token?: unknown },
): TogglEndpointOutputs['meGet'] {
	const { api_token: _discarded, ...safe } = user;
	return safe;
}

/** Reads the authenticated user's profile with the account credential stripped. */
export const get: TogglEndpoints['meGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGet']>(
		'me',
		ctx.key,
		{
			method: 'GET',
			query: { with_related_data: input.with_related_data },
		},
	);

	await logEventFromContext(
		ctx,
		'toggl.me.get',
		auditPayload(input, ['with_related_data']),
		'completed',
	);
	return withoutCredentials(result);
};

/** Updates the authenticated user's profile, answering without the credential. */
export const update: TogglEndpoints['meUpdate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meUpdate']>(
		'me',
		ctx.key,
		{
			method: 'PUT',
			body: {
				fullname: input.fullname,
				email: input.email,
				timezone: input.timezone,
				beginning_of_week: input.beginning_of_week,
				default_workspace_id: input.default_workspace_id,
			},
		},
	);

	// email and fullname are personal data; only the ids are recorded.
	await logEventFromContext(
		ctx,
		'toggl.me.update',
		auditPayload(input, ['default_workspace_id']),
		'completed',
	);
	return withoutCredentials(result);
};

/** Reads the caller's display, notification and alpha-feature preferences. */
export const getPreferences: TogglEndpoints['meGetPreferences'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['meGetPreferences']
	>('me/preferences', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.me.getPreferences',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Updates the caller's preferences. */
export const updatePreferences: TogglEndpoints['meUpdatePreferences'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['meUpdatePreferences']
	>('me/preferences', ctx.key, {
		method: 'POST',
		body: {
			timeofday_format: input.timeofday_format,
			date_format: input.date_format,
			duration_format: input.duration_format,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.me.updatePreferences',
		auditPayload(input, ['timeofday_format', 'date_format', 'duration_format']),
		'completed',
	);
	return result;
};

/** Confirms the token is valid; Toggl answers 200 with an empty body. */
export const getLogged: TogglEndpoints['meGetLogged'] = async (ctx, input) => {
	await makeTogglRequest<unknown>('me/logged', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.me.getLogged',
		auditPayload(input, []),
		'completed',
	);
	return { ok: true };
};

/** Reads the location Toggl last inferred for the caller from its request IP. */
export const getLocation: TogglEndpoints['meGetLocation'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetLocation']>(
		'me/location',
		ctx.key,
		{ method: 'GET' },
	);

	// The response is geolocation data about the user; nothing of it is logged.
	await logEventFromContext(
		ctx,
		'toggl.me.getLocation',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Reads the caller's remaining API quota, one record per organization. */
export const getQuota: TogglEndpoints['meGetQuota'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetQuota']>(
		'me/quota',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'toggl.me.getQuota',
		auditPayload(input, []),
		'completed',
	);
	return result ?? [];
};

/** Lists every client the caller can reach, across all their workspaces. */
export const getClients: TogglEndpoints['meGetClients'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetClients']>(
		'me/clients',
		ctx.key,
		{ method: 'GET', query: { since: input.since } },
	);

	const clients = result ?? [];

	// These are the same records the workspace-scoped list returns, so they feed
	// the cache the same way; otherwise reading via /me would leave it stale.
	for (const client of clients) {
		await cacheClient(ctx.db.clients, client);
	}

	await logEventFromContext(
		ctx,
		'toggl.me.getClients',
		auditPayload(input, ['since']),
		'completed',
	);
	return clients;
};

/** Lists every project the caller can reach, across all their workspaces. */
export const getProjects: TogglEndpoints['meGetProjects'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetProjects']>(
		'me/projects',
		ctx.key,
		{ method: 'GET', query: { since: input.since } },
	);

	const projects = result ?? [];

	for (const project of projects) {
		await cacheProject(ctx.db.projects, project);
	}

	await logEventFromContext(
		ctx,
		'toggl.me.getProjects',
		auditPayload(input, ['since']),
		'completed',
	);
	return projects;
};

/** Lists every tag the caller can reach, across all their workspaces. */
export const getTags: TogglEndpoints['meGetTags'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetTags']>(
		'me/tags',
		ctx.key,
		{ method: 'GET', query: { since: input.since } },
	);

	const tags = result ?? [];

	for (const tag of tags) {
		await cacheTag(ctx.db.tags, tag);
	}

	await logEventFromContext(
		ctx,
		'toggl.me.getTags',
		auditPayload(input, ['since']),
		'completed',
	);
	return tags;
};

/** Lists every task the caller can reach, across all their workspaces. */
export const getTasks: TogglEndpoints['meGetTasks'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['meGetTasks']>(
		'me/tasks',
		ctx.key,
		{ method: 'GET', query: { since: input.since } },
	);

	await logEventFromContext(
		ctx,
		'toggl.me.getTasks',
		auditPayload(input, ['since']),
		'completed',
	);
	return result ?? [];
};

/**
 * Unsubscribes the account from Toggl product emails using a code taken from an
 * unsubscribe link. Never exercised by the live suite — it would opt the test
 * account out of Toggl's mail for real.
 */
export const disableProductEmails: TogglEndpoints['meDisableProductEmails'] =
	async (ctx, input) => {
		await makeTogglRequest<unknown>('me/disable_product_emails', ctx.key, {
			method: 'POST',
			body: { disable_code: input.disable_code },
		});

		// The unsubscribe code acts as a bearer secret; keep it out of the log.
		await logEventFromContext(
			ctx,
			'toggl.me.disableProductEmails',
			auditPayload(input, []),
			'completed',
		);
		return { ok: true };
	};

/** As above, for the weekly report email. Also never live-tested. */
export const disableWeeklyReport: TogglEndpoints['meDisableWeeklyReport'] =
	async (ctx, input) => {
		await makeTogglRequest<unknown>('me/disable_weekly_report', ctx.key, {
			method: 'POST',
			body: { code: input.code },
		});

		await logEventFromContext(
			ctx,
			'toggl.me.disableWeeklyReport',
			auditPayload(input, []),
			'completed',
		);
		return { ok: true };
	};
