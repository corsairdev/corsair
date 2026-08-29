import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';
import type { ControlDEndpointInputs, ControlDEndpointOutputs } from './types';

export async function listRules(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['listRules'],
): Promise<ControlDEndpointOutputs['listRules']> {
	return makeControlDRequest(`/profiles/${input.profile_id}/rules`, ctx.key, {
		method: 'GET',
	});
}

export async function createRule(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['createRule'],
): Promise<ControlDEndpointOutputs['createRule']> {
	const { profile_id, ...body } = input;
	return makeControlDRequest(`/profiles/${profile_id}/rules`, ctx.key, {
		method: 'POST',
		body,
	});
}

export async function updateRule(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['updateRule'],
): Promise<ControlDEndpointOutputs['updateRule']> {
	const { profile_id, id, ...body } = input;
	return makeControlDRequest(`/profiles/${profile_id}/rules/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}

export async function deleteRule(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['deleteRule'],
): Promise<ControlDEndpointOutputs['deleteRule']> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/rules/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
}
