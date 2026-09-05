import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import {
	DeleteWebformInputSchema,
	DeleteWebformResponseSchema,
	GetWebformInputSchema,
	GetWebformResponseSchema,
	GetWebformsInputSchema,
	GetWebformsResponseSchema,
} from './types';

export const getWebforms: CampaynEndpoints['getWebforms'] = async (
	ctx,
	rawInput,
) => {
	const input = GetWebformsInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		`lists/${input.listId}/forms.json`,
		ctx.key,
		{
			method: 'GET',
			query: {
				'filter[form_type]': input.form_type,
			},
		},
	);
	const response = GetWebformsResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.webforms.getWebforms',
		{ listId: input.listId, form_type: input.form_type },
		'completed',
	);
	return response;
};

export const getWebform: CampaynEndpoints['getWebform'] = async (
	ctx,
	rawInput,
) => {
	const input = GetWebformInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		`lists/${input.listId}/forms/${input.webformId}.json`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = GetWebformResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.webforms.getWebform',
		{ listId: input.listId, webformId: input.webformId },
		'completed',
	);
	return response;
};

export const deleteWebform: CampaynEndpoints['deleteWebform'] = async (
	ctx,
	rawInput,
) => {
	const input = DeleteWebformInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		`lists/${input.listId}/forms/${input.webformId}.json`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = DeleteWebformResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.webforms.deleteWebform',
		{ listId: input.listId, webformId: input.webformId },
		'completed',
	);
	return response;
};
