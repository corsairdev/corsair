import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
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
