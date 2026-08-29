import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listUsers(
	ctx: ControlDContext,
	input: Record<string, never>,
): Promise<unknown> {
	return makeControlDRequest(`/users`, ctx.key, { method: 'GET' });
}
export async function getUser(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/users/${input.id}`, ctx.key, { method: 'GET' });
}
export async function createUser(
	ctx: ControlDContext,
	input: { email: string; profile_id?: string },
): Promise<unknown> {
	return makeControlDRequest(`/users`, ctx.key, {
		method: 'POST',
		body: input,
	});
}
export async function updateUser(
	ctx: ControlDContext,
	input: { id: string; email?: string; profile_id?: string },
): Promise<unknown> {
	const { id, ...body } = input;
	return makeControlDRequest(`/users/${id}`, ctx.key, { method: 'PUT', body });
}
export async function deleteUser(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/users/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
