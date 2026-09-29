import { logEventFromContext } from 'corsair/core';
import {
	makeChMeetingsRequest,
	unwrapData,
	unwrapEmpty,
	unwrapList,
} from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	OrganizationIdInputSchema,
	OrganizationPeopleListInputSchema,
	OrganizationPersonInputSchema,
	OrganizationSchema,
	OrganizationsListInputSchema,
	PersonSchema,
	SuccessSchema,
} from './types';

function sid(id: string | number): string {
	return String(id);
}

export const list: ChMeetingsEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const query = OrganizationsListInputSchema.parse(input);
	const raw = await makeChMeetingsRequest('organizations', ctx.key, {
		query: {
			search_text: query.search_text,
			page: query.page ?? 1,
			page_size: query.page_size ?? 100,
		},
	});
	const output = unwrapList(raw, OrganizationSchema);
	await logEventFromContext(
		ctx,
		'chmeetings.organizations.list',
		query,
		'completed',
	);
	return output;
};

export const get: ChMeetingsEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const { organization_id } = OrganizationIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`organizations/${organization_id}`,
		ctx.key,
	);
	const output = unwrapData(
		raw,
		OrganizationSchema,
		`Organization ${organization_id}`,
	);
	await logEventFromContext(
		ctx,
		'chmeetings.organizations.get',
		{ organization_id },
		'completed',
	);
	return output;
};

export const listPeople: ChMeetingsEndpoints['organizationsListPeople'] =
	async (ctx, input) => {
		const query = OrganizationPeopleListInputSchema.parse(input);
		const raw = await makeChMeetingsRequest(
			`organizations/${query.organization_id}/people`,
			ctx.key,
			{
				query: {
					include_family_members: query.include_family_members ?? true,
					include_additional_fields: query.include_additional_fields ?? true,
					include_organizations: query.include_organizations ?? false,
					name: query.name,
					page: query.page ?? 1,
					page_size: query.page_size ?? 100,
				},
			},
		);
		const output = unwrapList(raw, PersonSchema);
		await logEventFromContext(
			ctx,
			'chmeetings.organizations.listPeople',
			query,
			'completed',
		);
		return output;
	};

export const addPerson: ChMeetingsEndpoints['organizationsAddPerson'] = async (
	ctx,
	input,
) => {
	const body = OrganizationPersonInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`organizations/${body.organization_id}/people`,
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
		'chmeetings.organizations.addPerson',
		body,
		'completed',
	);
	return output;
};

export const removePerson: ChMeetingsEndpoints['organizationsRemovePerson'] =
	async (ctx, input) => {
		const body = OrganizationPersonInputSchema.parse(input);
		const raw = await makeChMeetingsRequest(
			`organizations/${body.organization_id}/people/${sid(body.person_id)}`,
			ctx.key,
			{ method: 'DELETE', responseType: 'empty' },
		);
		const output = SuccessSchema.parse(unwrapEmpty(raw));
		await logEventFromContext(
			ctx,
			'chmeetings.organizations.removePerson',
			body,
			'completed',
		);
		return output;
	};
