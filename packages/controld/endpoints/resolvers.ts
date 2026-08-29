import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listResolvers(
	ctx: ControlDContext,
	input: Record<string, never>,
): Promise<unknown> {
	return makeControlDRequest(`/resolvers`, ctx.key, { method: 'GET' });
}
export async function getResolver(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/resolvers/${input.id}`, ctx.key, {
		method: 'GET',
	});
}
export async function createResolver(
	ctx: ControlDContext,
	input: { name: string; profile_id?: string },
): Promise<unknown> {
	return makeControlDRequest(`/resolvers`, ctx.key, {
		method: 'POST',
		body: input,
	});
}
export async function updateResolver(
	ctx: ControlDContext,
	input: { id: string; name?: string; profile_id?: string },
): Promise<unknown> {
	const { id, ...body } = input;
	return makeControlDRequest(`/resolvers/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}
export async function deleteResolver(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/resolvers/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
