import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listOrganizations(
	ctx: ControlDContext,
	input: Record<string, never>,
): Promise<unknown> {
	return makeControlDRequest(`/organizations`, ctx.key, { method: 'GET' });
}
export async function getOrganization(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/organizations/${input.id}`, ctx.key, {
		method: 'GET',
	});
}
export async function createOrganization(
	ctx: ControlDContext,
	input: { name: string },
): Promise<unknown> {
	return makeControlDRequest(`/organizations`, ctx.key, {
		method: 'POST',
		body: input,
	});
}
export async function updateOrganization(
	ctx: ControlDContext,
	input: { id: string; name?: string },
): Promise<unknown> {
	const { id, ...body } = input;
	return makeControlDRequest(`/organizations/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}
export async function deleteOrganization(
	ctx: ControlDContext,
	input: { id: string },
): Promise<unknown> {
	return makeControlDRequest(`/organizations/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
