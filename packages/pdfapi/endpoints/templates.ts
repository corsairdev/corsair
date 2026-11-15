import { logEventFromContext } from 'corsair/core';
import { makePdfApiRequest } from '../client';
import type { PdfApiEndpoints } from '../index';
import { pdfApiPathParameter } from './path';
import type { PdfApiEndpointOutputs } from './types';

export const listTemplates: PdfApiEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makePdfApiRequest<
		PdfApiEndpointOutputs['listTemplates']
	>(ctx, '/templates', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'pdfapi.templates.listTemplates',
		input,
		'completed',
	);
	return response;
};

export const retrieveTemplate: PdfApiEndpoints['retrieveTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makePdfApiRequest<
		PdfApiEndpointOutputs['retrieveTemplate']
	>(
		ctx,
		pdfApiPathParameter(
			'/templates/{template}',
			'template',
			String(input.template),
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'pdfapi.templates.retrieveTemplate',
		input,
		'completed',
	);
	return response;
};

export const renderTemplate: PdfApiEndpoints['renderTemplate'] = async (
	ctx,
	input,
) => {
	const { templateId, ...body } = input;
	const response = await makePdfApiRequest<
		PdfApiEndpointOutputs['renderTemplate']
	>(
		ctx,
		pdfApiPathParameter(
			'/templates/{templateId}/pdf',
			'templateId',
			String(templateId),
		),
		{
			method: 'POST',
			// The provider defaults to Accept: application/pdf (binary); the
			// JSON envelope keeps the rendered PDF byte-exact as base64.
			accept: 'application/json',
			body,
		},
	);
	await logEventFromContext(
		ctx,
		'pdfapi.templates.renderTemplate',
		// R8: document placeholder values are customer data and stay out of
		// event history; only the template id and output mode are logged.
		{ templateId: String(templateId), output: input.output ?? 'pdf' },
		'completed',
	);
	return response;
};

export const mergeTemplates: PdfApiEndpoints['mergeTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makePdfApiRequest<
		PdfApiEndpointOutputs['mergeTemplates']
	>(ctx, '/templates/merge', {
		method: 'POST',
		accept: 'application/json',
		body: {
			...input,
			templates: input.templates.map((t) => ({ ...t, id: String(t.id) })),
		},
	});
	await logEventFromContext(
		ctx,
		'pdfapi.templates.mergeTemplates',
		// R8: per-template document values stay out of event history; only
		// the template ids and output mode are logged.
		{
			templateIds: input.templates.map((t) => String(t.id)),
			output: input.output ?? 'pdf',
		},
		'completed',
	);
	return response;
};
