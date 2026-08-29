import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listDefaultRules(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/default-rules`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function getDefaultRule(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/default-rules/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function createDefaultRule(
	ctx: ControlDContext,
	input: { profile_id: string; domain: string; action: string },
): Promise<unknown> {
	const { profile_id, ...body } = input;
	return makeControlDRequest(`/profiles/${profile_id}/default-rules`, ctx.key, {
		method: 'POST',
		body,
	});
}
export async function updateDefaultRule(
	ctx: ControlDContext,
	input: { profile_id: string; id: string; action?: string },
): Promise<unknown> {
	const { profile_id, id, ...body } = input;
	return makeControlDRequest(
		`/profiles/${profile_id}/default-rules/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);
}
export async function deleteDefaultRule(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/default-rules/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
}
