import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeChMeetingsRequest, unwrapData, unwrapEmpty } from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	GroupIdInputSchema,
	GroupMemberInputSchema,
	GroupSchema,
	GroupsListInputSchema,
	GroupUpdateInputSchema,
	GroupWriteSchema,
	SuccessSchema,
} from './types';

function sid(id: string | number): string {
	return String(id);
}

const GroupListSchema = z.array(GroupSchema);

export const list: ChMeetingsEndpoints['groupsList'] = async (ctx, input) => {
	const query = GroupsListInputSchema.parse(input ?? {});
	const raw = await makeChMeetingsRequest('groups', ctx.key, {
		query: { search_text: query.search_text },
	});
	const output = unwrapData(raw, GroupListSchema, 'Groups');
	await logEventFromContext(ctx, 'chmeetings.groups.list', query, 'completed');
	return output;
};

export const get: ChMeetingsEndpoints['groupsGet'] = async (ctx, input) => {
	const { group_id } = GroupIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`groups/${sid(group_id)}`, ctx.key);
	const output = unwrapData(raw, GroupSchema, `Group ${group_id}`);
	await logEventFromContext(
		ctx,
		'chmeetings.groups.get',
		{ group_id },
		'completed',
	);
	return output;
};

export const create: ChMeetingsEndpoints['groupsCreate'] = async (
	ctx,
	input,
) => {
	const body = GroupWriteSchema.parse(input);
	const raw = await makeChMeetingsRequest('groups', ctx.key, {
		method: 'POST',
		body,
	});
	const output = unwrapData(raw, GroupSchema, 'Group');
	await logEventFromContext(
		ctx,
		'chmeetings.groups.create',
		{ name: body.name },
		'completed',
	);
	return output;
};

export const update: ChMeetingsEndpoints['groupsUpdate'] = async (
	ctx,
	input,
) => {
	const { group_id, ...body } = GroupUpdateInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`groups/${sid(group_id)}`, ctx.key, {
		method: 'PUT',
		body,
	});
	const output = unwrapData(raw, GroupSchema, `Group ${group_id}`);
	await logEventFromContext(
		ctx,
		'chmeetings.groups.update',
		{ group_id },
		'completed',
	);
	return output;
};

export const remove: ChMeetingsEndpoints['groupsDelete'] = async (
	ctx,
	input,
) => {
	const { group_id } = GroupIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`groups/${sid(group_id)}`, ctx.key, {
		method: 'DELETE',
		responseType: 'empty',
	});
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.groups.delete',
		{ group_id },
		'completed',
	);
	return output;
};

export const addMember: ChMeetingsEndpoints['groupsAddMember'] = async (
	ctx,
	input,
) => {
	const body = GroupMemberInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`groups/${sid(body.group_id)}/memberships`,
		ctx.key,
		{
			method: 'POST',
			body: { person_id: body.person_id },
			responseType: 'empty',
		},
	);
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.groups.addMember',
		body,
		'completed',
	);
	return output;
};

export const removeMember: ChMeetingsEndpoints['groupsRemoveMember'] = async (
	ctx,
	input,
) => {
	const body = GroupMemberInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`groups/${sid(body.group_id)}/memberships/${sid(body.person_id)}`,
		ctx.key,
		{ method: 'DELETE', responseType: 'empty' },
	);
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.groups.removeMember',
		body,
		'completed',
	);
	return output;
};
