import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

export const get: TogglEndpoints['organizationsGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsGet']
	>(`organizations/${input.organization_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.organizations.get',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

export const update: TogglEndpoints['organizationsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsUpdate']
	>(`organizations/${input.organization_id}`, ctx.key, {
		method: 'PUT',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'toggl.organizations.update',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

export const getWorkspaces: TogglEndpoints['organizationsGetWorkspaces'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['organizationsGetWorkspaces']
		>(`organizations/${input.organization_id}/workspaces`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'toggl.organizations.getWorkspaces',
			auditPayload(input, ['organization_id']),
			'completed',
		);
		return result;
	};
