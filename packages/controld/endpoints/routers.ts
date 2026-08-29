import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listRouters(
	ctx: ControlDContext,
	input: Record<string, never>,
): Promise<unknown> {
	return makeControlDRequest(`/routers`, ctx.key, { method: 'GET' });
}
export async function getRouter(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/routers/${input.id}`, ctx.key, {
		method: 'GET',
	});
}
export async function createRouter(
	ctx: ControlDContext,
	input: { name: string; profile_id?: string },
): Promise<unknown> {
	return makeControlDRequest(`/routers`, ctx.key, {
		method: 'POST',
		body: input,
	});
}
export async function updateRouter(
	ctx: ControlDContext,
	input: { id: string; name?: string; profile_id?: string },
): Promise<unknown> {
	const { id, ...body } = input;
	return makeControlDRequest(`/routers/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}
export async function deleteRouter(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/routers/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
