import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listServices(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/services`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function getService(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/services/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);
}
export async function updateService(
	ctx: ControlDContext,
	input: { profile_id: string; id: string; action: string },
): Promise<unknown> {
	const { profile_id, id, ...body } = input;
	return makeControlDRequest(
		`/profiles/${profile_id}/services/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);
}
export async function enableService(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/services/${input.id}/enable`,
		ctx.key,
		{ method: 'POST' },
	);
}
export async function disableService(
	ctx: ControlDContext,
	input: { profile_id: string; id: string },
): Promise<unknown> {
	return makeControlDRequest(
		`/profiles/${input.profile_id}/services/${input.id}/disable`,
		ctx.key,
		{ method: 'POST' },
	);
}
