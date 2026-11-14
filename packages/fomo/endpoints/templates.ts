import { logEventFromContext } from 'corsair/core';
import type { FomoEndpoints } from '..';
import { makeFomoRequest } from '../client';
import type {
	TemplatesCreateOutput,
	TemplatesDeleteOutput,
	TemplatesGetOutput,
	TemplatesListOutput,
	TemplatesUpdateOutput,
} from './types';
import {
	TemplatesCreateInputSchema,
	TemplatesCreateOutputSchema,
	TemplatesDeleteInputSchema,
	TemplatesDeleteOutputSchema,
	TemplatesGetInputSchema,
	TemplatesGetOutputSchema,
	TemplatesListInputSchema,
	TemplatesListOutputSchema,
	TemplatesUpdateInputSchema,
	TemplatesUpdateOutputSchema,
} from './types';

export const listTemplates: FomoEndpoints['templates.list'] = async (
	ctx,
	input,
) => {
	const parsedInput = TemplatesListInputSchema.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.per !== undefined) query.per = parsedInput.per;
	if (parsedInput.page !== undefined) query.page = parsedInput.page;

	const response = await makeFomoRequest<TemplatesListOutput>(
		'/applications/me/event_types',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = TemplatesListOutputSchema.parse(response);

	const count = Array.isArray(parsed)
		? parsed.length
		: parsed.event_types.length;
	await logEventFromContext(ctx, 'fomo.templates.list', { count }, 'completed');

	return parsed;
};

export const getTemplate: FomoEndpoints['templates.get'] = async (
	ctx,
	input,
) => {
	const parsedInput = TemplatesGetInputSchema.parse(input);
	const response = await makeFomoRequest<TemplatesGetOutput>(
		`/applications/me/event_types/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = TemplatesGetOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.templates.get',
		{ templateId: parsed.id },
		'completed',
	);

	return parsed;
};

export const createTemplate: FomoEndpoints['templates.create'] = async (
	ctx,
	input,
) => {
	const parsedInput = TemplatesCreateInputSchema.parse(input);
	const response = await makeFomoRequest<TemplatesCreateOutput>(
		'/applications/me/event_types',
		ctx.key,
		{
			method: 'POST',
			body: { event_type: parsedInput },
		},
	);

	const parsed = TemplatesCreateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.templates.create',
		{ templateId: parsed.id },
		'completed',
	);

	return parsed;
};

export const updateTemplate: FomoEndpoints['templates.update'] = async (
	ctx,
	input,
) => {
	const parsedInput = TemplatesUpdateInputSchema.parse(input);
	const { id, ...templateData } = parsedInput;
	const response = await makeFomoRequest<TemplatesUpdateOutput>(
		`/applications/me/event_types/${encodeURIComponent(String(id))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { event_type: templateData },
		},
	);

	const parsed = TemplatesUpdateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.templates.update',
		{ templateId: parsed.id },
		'completed',
	);

	return parsed;
};

export const deleteTemplate: FomoEndpoints['templates.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = TemplatesDeleteInputSchema.parse(input);
	const response = await makeFomoRequest<TemplatesDeleteOutput>(
		`/applications/me/event_types/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = TemplatesDeleteOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.templates.delete',
		{ templateId: parsedInput.id },
		'completed',
	);

	return parsed;
};
