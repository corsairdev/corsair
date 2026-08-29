import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';
import type { ControlDEndpointInputs, ControlDEndpointOutputs } from './types';

export async function listProfiles(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['listProfiles'],
): Promise<ControlDEndpointOutputs['listProfiles']> {
	return makeControlDRequest('/profiles', ctx.key, { method: 'GET' });
}

export async function getProfile(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['getProfile'],
): Promise<ControlDEndpointOutputs['getProfile']> {
	return makeControlDRequest(`/profiles/${input.id}`, ctx.key, {
		method: 'GET',
	});
}

export async function createProfile(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['createProfile'],
): Promise<ControlDEndpointOutputs['createProfile']> {
	return makeControlDRequest(`/profiles`, ctx.key, {
		method: 'POST',
		body: input,
	});
}

export async function updateProfile(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['updateProfile'],
): Promise<ControlDEndpointOutputs['updateProfile']> {
	const { id, ...body } = input;
	return makeControlDRequest(`/profiles/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}

export async function deleteProfile(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['deleteProfile'],
): Promise<ControlDEndpointOutputs['deleteProfile']> {
	return makeControlDRequest(`/profiles/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
