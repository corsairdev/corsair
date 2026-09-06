import { logEventFromContext } from 'corsair/core';
import {
	makeChMeetingsRequest,
	unwrapData,
	unwrapEmpty,
	unwrapList,
} from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	OrganizationSchema,
	PeopleListInputSchema,
	PersonCreateInputSchema,
	PersonIdInputSchema,
	PersonOrganizationsInputSchema,
	PersonSchema,
	PersonUpdateInputSchema,
	SuccessSchema,
} from './types';

function sid(id: string | number): string {
	return String(id);
}

export const list: ChMeetingsEndpoints['peopleList'] = async (ctx, input) => {
	const query = PeopleListInputSchema.parse(input);
	const raw = await makeChMeetingsRequest('people', ctx.key, {
		query: {
			include_family_members: query.include_family_members ?? true,
			include_additional_fields: query.include_additional_fields ?? true,
			include_organizations: query.include_organizations ?? false,
			name: query.name,
			mobile: query.mobile,
			email: query.email,
			page: query.page ?? 1,
			page_size: query.page_size ?? 100,
		},
	});
	const output = unwrapList(raw, PersonSchema);
	await logEventFromContext(ctx, 'chmeetings.people.list', query, 'completed');
	return output;
};

export const get: ChMeetingsEndpoints['peopleGet'] = async (ctx, input) => {
	const { id } = PersonIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`people/${sid(id)}`, ctx.key);
	const output = unwrapData(raw, PersonSchema, `Person ${id}`);
	await logEventFromContext(ctx, 'chmeetings.people.get', { id }, 'completed');
	return output;
};

export const create: ChMeetingsEndpoints['peopleCreate'] = async (
	ctx,
	input,
) => {
	const body = PersonCreateInputSchema.parse(input);
	const raw = await makeChMeetingsRequest('people', ctx.key, {
		method: 'POST',
		body,
	});
	const output = unwrapData(raw, PersonSchema, 'Person');
	await logEventFromContext(
		ctx,
		'chmeetings.people.create',
		{ first_name: body.first_name, last_name: body.last_name },
		'completed',
	);
	return output;
};

export const update: ChMeetingsEndpoints['peopleUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = PersonUpdateInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`people/${sid(id)}`, ctx.key, {
		method: 'PUT',
		body,
		responseType: 'empty',
	});
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.people.update',
		{ id },
		'completed',
	);
	return output;
};

export const remove: ChMeetingsEndpoints['peopleDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PersonIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`people/${sid(id)}`, ctx.key, {
		method: 'DELETE',
		responseType: 'empty',
	});
	const output = SuccessSchema.parse(unwrapEmpty(raw));
	await logEventFromContext(
		ctx,
		'chmeetings.people.delete',
		{ id },
		'completed',
	);
	return output;
};

export const listOrganizations: ChMeetingsEndpoints['peopleListOrganizations'] =
	async (ctx, input) => {
		const query = PersonOrganizationsInputSchema.parse(input);
		const raw = await makeChMeetingsRequest(
			`people/${sid(query.person_id)}/organizations`,
			ctx.key,
			{
				query: {
					page: query.page ?? 1,
					page_size: query.page_size ?? 100,
				},
			},
		);
		const output = unwrapList(raw, OrganizationSchema);
		await logEventFromContext(
			ctx,
			'chmeetings.people.listOrganizations',
			query,
			'completed',
		);
		return output;
	};
