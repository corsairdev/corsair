import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import {
	CreateContactInputSchema,
	CreateContactResponseSchema,
	DeleteContactInputSchema,
	DeleteContactResponseSchema,
	GetContactInputSchema,
	GetContactResponseSchema,
	GetContactsInputSchema,
	GetContactsResponseSchema,
	UnsubscribeContactInputSchema,
	UnsubscribeContactResponseSchema,
} from './types';

export const getContacts: CampaynEndpoints['getContacts'] = async (
	ctx,
	rawInput,
) => {
	const input = GetContactsInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest(
		`lists/${input.listId}/contacts.json`,
		ctx.key,
		{
			method: 'GET',
			query: {
				'filter[contact]': input.contactFilter,
			},
		},
	);
	const response = GetContactsResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.contacts.getContacts',
		{ listId: input.listId },
		'completed',
	);
	return response;
};

export const getContact: CampaynEndpoints['getContact'] = async (
	ctx,
	rawInput,
) => {
	const input = GetContactInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest(
		`contacts/${input.contactId}.json`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = GetContactResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.contacts.getContact',
		{ contactId: input.contactId },
		'completed',
	);
	return response;
};

export const createContact: CampaynEndpoints['createContact'] = async (
	ctx,
	rawInput,
) => {
	const input = CreateContactInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest(
		`lists/${input.listId}/contacts.json`,
		ctx.key,
		{
			method: 'POST',
			body: {
				email: input.email,
				first_name: input.first_name,
				last_name: input.last_name,
				title: input.title,
				address: input.address,
				city: input.city,
				state: input.state,
				zip: input.zip,
				company: input.company,
				country: input.country,
				phones: input.phones,
				sites: input.sites,
				social: input.social,
				custom_fields: input.custom_fields,
				failOnDuplicate: input.failOnDuplicate,
			},
		},
	);
	const response = CreateContactResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.contacts.createContact',
		{ listId: input.listId },
		'completed',
	);
	return response;
};

export const deleteContact: CampaynEndpoints['deleteContact'] = async (
	ctx,
	rawInput,
) => {
	const input = DeleteContactInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest(
		`contacts/${input.contactId}.json`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = DeleteContactResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.contacts.deleteContact',
		{ contactId: input.contactId },
		'completed',
	);
	return response;
};

export const unsubscribeContact: CampaynEndpoints['unsubscribeContact'] =
	async (ctx, rawInput) => {
		const input = UnsubscribeContactInputSchema.parse(rawInput);
		const raw = await makeCampaynRequest(
			`lists/${input.listId}/unsubscribe.json`,
			ctx.key,
			{
				method: 'POST',
				body: {
					id: input.id,
					email: input.email,
				},
			},
		);
		const response = UnsubscribeContactResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'campayn.contacts.unsubscribeContact',
			{ listId: input.listId, id: input.id },
			'completed',
		);
		return response;
	};
