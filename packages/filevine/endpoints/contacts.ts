import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest, resolveFilevineOrgContext } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	AttachProjectContactResponseSchema,
	CreateContactResponseSchema,
	GetContactResponseSchema,
	ListContactsResponseSchema,
} from './types';

export const list: FilevineEndpoints['listContacts'] = async (ctx, input) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(
			ctx.key,
			(input as { orgId?: number; userId?: number }).orgId,
			(input as { orgId?: number; userId?: number }).userId,
		);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listContacts']
	>('/fv-app/v2/Contacts', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
		query: {
			offset: input.offset,
			limit: input.limit,
			q: input.q,
		},
	});
	const parsed = ListContactsResponseSchema.parse(result);
	if (parsed.items && ctx.db.contacts) {
		for (const item of parsed.items) {
			try {
				await ctx.db.contacts.upsertByEntityId(String(item.contactId), {
					id: item.contactId,
					contactId: item.contactId,
					firstName: item.firstName,
					lastName: item.lastName,
					fullName: item.fullName,
					organization: item.organization,
					emails: item.emails,
					phones: item.phones,
					createdDate: item.createdDate,
					modifiedDate: item.modifiedDate,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.contacts.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const get: FilevineEndpoints['getContact'] = async (ctx, input) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(
			ctx.key,
			(input as { orgId?: number; userId?: number }).orgId,
			(input as { orgId?: number; userId?: number }).userId,
		);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['getContact']
	>(`/fv-app/v2/Contacts/${input.contactId}`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
	});
	const parsed = GetContactResponseSchema.parse(result);
	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(String(parsed.contactId), {
				id: parsed.contactId,
				contactId: parsed.contactId,
				firstName: parsed.firstName,
				lastName: parsed.lastName,
				fullName: parsed.fullName,
				organization: parsed.organization,
				emails: parsed.emails,
				phones: parsed.phones,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.contacts.get',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const create: FilevineEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(
			ctx.key,
			(input as { orgId?: number; userId?: number }).orgId,
			(input as { orgId?: number; userId?: number }).userId,
		);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createContact']
	>('/fv-app/v2/Contacts', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'POST',
		body: input as Record<string, unknown>,
	});
	const parsed = CreateContactResponseSchema.parse(result);
	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(String(parsed.contactId), {
				id: parsed.contactId,
				contactId: parsed.contactId,
				firstName: parsed.firstName,
				lastName: parsed.lastName,
				fullName: parsed.fullName,
				organization: parsed.organization,
				emails: parsed.emails,
				phones: parsed.phones,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.contacts.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const attach: FilevineEndpoints['attachProjectContact'] = async (
	ctx,
	input,
) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(
			ctx.key,
			(input as { orgId?: number; userId?: number }).orgId,
			(input as { orgId?: number; userId?: number }).userId,
		);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['attachProjectContact']
	>(`/fv-app/v2/Projects/${input.projectId}/Contacts`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'POST',
		body: {
			contactId: input.contactId,
			role: input.role,
		} as Record<string, unknown>,
	});
	const parsed = AttachProjectContactResponseSchema.parse(result ?? {});
	await logEventFromContext(
		ctx,
		'filevine.contacts.attach',
		{ ...input },
		'completed',
	);
	return parsed;
};
