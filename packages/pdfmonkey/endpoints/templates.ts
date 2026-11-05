import { logEventFromContext } from 'corsair/core';
import { makePdfMonkeyRequest } from '../client';
import type { PDFMonkeyEndpoints } from '../index';
import {
	CreateTemplateInputSchema,
	CreateTemplateOutputSchema,
	DeleteTemplateInputSchema,
	GetTemplateInputSchema,
	GetTemplateOutputSchema,
	ListTemplateCardsInputSchema,
	ListTemplateCardsOutputSchema,
	PDFMonkeyEndpointOutputSchemas,
	UpdateTemplateInputSchema,
	UpdateTemplateOutputSchema,
} from './types';

export const listTemplateCards: PDFMonkeyEndpoints['listTemplateCards'] =
	async (ctx, input) => {
		const parsed = ListTemplateCardsInputSchema.parse(input);
		const response = await makePdfMonkeyRequest<unknown>(
			'/api/v1/document_template_cards',
			{
				apiKey: ctx.key,
				method: 'GET',
				query: {
					page: { number: parsed.page },
					q: {
						workspace_id: parsed.q.workspace_id,
						folders: parsed.q.folders,
					},
					sort: parsed.sort,
				},
			},
		);

		const output = ListTemplateCardsOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'pdfmonkey.templates.listTemplateCards',
			{
				workspace_id: parsed.q.workspace_id,
				page: parsed.page,
			},
			'completed',
		);

		return output;
	};

export const getTemplate: PDFMonkeyEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = GetTemplateInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/document_templates/' + parsed.id,
		{
			apiKey: ctx.key,
			method: 'GET',
		},
	);

	const output = GetTemplateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.getTemplate',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const createTemplate: PDFMonkeyEndpoints['createTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = CreateTemplateInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/document_templates',
		{
			apiKey: ctx.key,
			method: 'POST',
			body: {
				document_template: parsed.document_template,
			},
		},
	);

	const output = CreateTemplateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.createTemplate',
		{ identifier: parsed.document_template.identifier },
		'completed',
	);

	return output;
};

export const updateTemplate: PDFMonkeyEndpoints['updateTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = UpdateTemplateInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/document_templates/' + parsed.document_template_id,
		{
			apiKey: ctx.key,
			method: 'PUT',
			body: {
				document_template: parsed.document_template,
			},
		},
	);

	const output = UpdateTemplateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.updateTemplate',
		{ template_id: parsed.document_template_id },
		'completed',
	);

	return output;
};

export const deleteTemplate: PDFMonkeyEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteTemplateInputSchema.parse(input);
	await makePdfMonkeyRequest<unknown>(
		'/api/v1/document_templates/' + parsed.id,
		{
			apiKey: ctx.key,
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.deleteTemplate',
		{ id: parsed.id },
		'completed',
	);

	return PDFMonkeyEndpointOutputSchemas.deleteTemplate.parse({ success: true });
};
