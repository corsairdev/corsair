import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	TemplatesCategoriesResponse,
	TemplatesCreateResponse,
	TemplatesDeleteResponse,
	TemplatesGetResponse,
	TemplatesListResponse,
	TemplatesUpdateResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const categories: HandwryttenEndpoints['templates.categories'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['templates.categories'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesCategoriesResponse>(
		'/templateCategories/list',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.categories'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.categories',
		{ count: parsed.categories?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const list: HandwryttenEndpoints['templates.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['templates.list'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesListResponse>(
		'/templates/list',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.list',
		{ count: parsed.templates?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HandwryttenEndpoints['templates.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['templates.get'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesGetResponse>(
		'/templates/view',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.get'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.get',
		{ templateId: parsedInput.template_id },
		'completed',
	);
	return parsed;
};

export const create: HandwryttenEndpoints['templates.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['templates.create'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesCreateResponse>(
		'/templates/create',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.create'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.create',
		{ templateId: parsed.id ?? parsed.template?.id },
		'completed',
	);
	return parsed;
};

export const update: HandwryttenEndpoints['templates.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['templates.update'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesUpdateResponse>(
		'/templates/update',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.update'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.update',
		{ templateId: parsedInput.template_id },
		'completed',
	);
	return parsed;
};

export const deleteTemplate: HandwryttenEndpoints['templates.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['templates.delete'].parse(input);
	const response = await makeHandwryttenRequest<TemplatesDeleteResponse>(
		'/templates/delete',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['templates.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.templates.delete',
		{ templateId: parsedInput.template_id },
		'completed',
	);
	return parsed;
};
