import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import {
	CopyTemplateInputSchema,
	CopyTemplateOutputSchema,
	DeleteTemplateInputSchema,
	DeleteTemplateOutputSchema,
	GetTemplateInputSchema,
	GetTemplateOutputSchema,
	ListTemplatesInputSchema,
	ListTemplatesOutputSchema,
} from './types';

export const listTemplates: ParseurEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const parsed = ListTemplatesInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/template_set`,
		{
			apiKey: ctx.key,
			method: 'GET',
			query: {
				page: parsed.page,
				page_size: parsed.page_size,
				search: parsed.search,
				ordering: parsed.ordering,
			},
		},
	);

	const output = ListTemplatesOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.templates.listTemplates',
		{ mailboxId: parsed.id, page: parsed.page },
		'completed',
	);

	return output;
};

export const getTemplate: ParseurEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = GetTemplateInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(`/template/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'GET',
	});

	const output = GetTemplateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.templates.getTemplate',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const deleteTemplate: ParseurEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteTemplateInputSchema.parse(input);
	await makeParseurRequest<unknown>(`/template/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'parseur.templates.deleteTemplate',
		{ id: parsed.id },
		'completed',
	);

	return DeleteTemplateOutputSchema.parse({ success: true });
};

export const copyTemplate: ParseurEndpoints['copyTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = CopyTemplateInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/template/${parsed.id}/copy/${parsed.target_mailbox_id}`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = CopyTemplateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.templates.copyTemplate',
		{ id: parsed.id, targetMailboxId: parsed.target_mailbox_id },
		'completed',
	);

	return output;
};
