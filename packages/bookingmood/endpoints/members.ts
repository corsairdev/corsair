import { logEventFromContext } from 'corsair/core';
import { makeBookingmoodRequest } from '../client';
import type { BookingmoodEndpoints } from '../index';
import type { MembersGetResponse, MembersListResponse } from './types';

export const get: BookingmoodEndpoints['membersGet'] = async (ctx, input) => {
	const res = await makeBookingmoodRequest<
		MembersGetResponse | MembersListResponse
	>('members', ctx.key, {
		method: 'GET',
		query: { id: `eq.${input.id}`, select: '*' },
	});

	const member = Array.isArray(res) ? res[0] : res;
	if (member && ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(member.id, {
				id: member.id,
				email: member.email,
				name: member.name,
				role: member.role,
				created_at: member.created_at ? new Date(member.created_at) : null,
				updated_at: member.updated_at ? new Date(member.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save member to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.members.get',
		{ ...input },
		'completed',
	);
	return member ?? { id: input.id };
};

export const list: BookingmoodEndpoints['membersList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {
		select: '*',
	};
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;

	const res = await makeBookingmoodRequest<MembersListResponse>(
		'members',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const members = Array.isArray(res) ? res : [];
	if (ctx.db.members) {
		try {
			for (const member of members) {
				await ctx.db.members.upsertByEntityId(member.id, {
					id: member.id,
					email: member.email,
					name: member.name,
					role: member.role,
					created_at: member.created_at ? new Date(member.created_at) : null,
					updated_at: member.updated_at ? new Date(member.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save members to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.members.list',
		{ ...input },
		'completed',
	);
	return members;
};
