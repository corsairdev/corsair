import { logEventFromContext } from 'corsair/core';
import { makeBookingmoodRequest } from '../client';
import type { BookingmoodEndpoints } from '../index';
import type {
	OrganizationsGetResponse,
	OrganizationsListResponse,
} from './types';

export const get: BookingmoodEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const res = await makeBookingmoodRequest<
		OrganizationsGetResponse | OrganizationsListResponse
	>('organizations', ctx.key, {
		method: 'GET',
		query: { id: `eq.${input.id}`, select: '*' },
	});

	const org = Array.isArray(res) ? res[0] : res;
	if (org && ctx.db.organizations) {
		try {
			await ctx.db.organizations.upsertByEntityId(org.id, {
				id: org.id,
				name: org.name,
				created_at: org.created_at ? new Date(org.created_at) : null,
				updated_at: org.updated_at ? new Date(org.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save organization to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.organizations.get',
		{ ...input },
		'completed',
	);
	return org ?? { id: input.id };
};

export const list: BookingmoodEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		select: '*',
	};
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;

	const res = await makeBookingmoodRequest<OrganizationsListResponse>(
		'organizations',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const orgs = Array.isArray(res) ? res : [];
	if (ctx.db.organizations) {
		try {
			for (const org of orgs) {
				await ctx.db.organizations.upsertByEntityId(org.id, {
					id: org.id,
					name: org.name,
					created_at: org.created_at ? new Date(org.created_at) : null,
					updated_at: org.updated_at ? new Date(org.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save organizations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.organizations.list',
		{ ...input },
		'completed',
	);
	return orgs;
};
