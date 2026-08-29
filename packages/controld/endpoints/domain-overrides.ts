import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listDomainOverrides(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/overrides`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function getDomainOverride(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/overrides/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function createDomainOverride(
	ctx: ControlDContext,
	input: { profile_id: string; domain: string; ip: string },
): Promise<unknown> {
	const { profile_id, ...body } = input;
	return makeControlDRequest(`/profiles/${profile_id}/overrides`, ctx.key, {
		method: 'POST',
		body,
	});
}
export async function updateDomainOverride(
	ctx: ControlDContext,
	input: { profile_id: string; id: string; ip?: string },
): Promise<unknown> {
	const { profile_id, id, ...body } = input;
	return makeControlDRequest(
		`/profiles/${profile_id}/overrides/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);
}
export async function deleteDomainOverride(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/overrides/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
}
