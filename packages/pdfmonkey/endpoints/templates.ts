import { logEventFromContext } from 'corsair/core';
import { makePdfMonkeyRequest } from '../client';
import type { PDFMonkeyEndpoints } from '../index';
import type {
	PDFMonkeyEndpointInputs,
	PDFMonkeyEndpointOutputs,
} from './types';

/** List template cards (paginated) */
export const listTemplateCards: PDFMonkeyEndpoints['listTemplateCards'] =
	async (ctx, input) => {
		const response = await makePdfMonkeyRequest<
			PDFMonkeyEndpointOutputs['listTemplateCards']
		>('/api/v1/document_template_cards', {
			apiKey: ctx.key,
			method: 'GET',
			query: {
				q_workspace_id: input.q_workspace_id,
				q_folders: input.q_folders,
				page: input.page,
				sort: input.sort,
			},
		});

		await logEventFromContext(
			ctx,
			'pdfmonkey.templates.listTemplateCards',
			{
				q_workspace_id: input.q_workspace_id,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

/** Get a template by ID */
export const getTemplate: PDFMonkeyEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['getTemplate']
	>('/api/v1/document_templates/' + input.id, {
		apiKey: ctx.key,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.getTemplate',
		{ id: input.id },
		'completed',
	);

	return response;
};

/** Create a new template */
export const createTemplate: PDFMonkeyEndpoints['createTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['createTemplate']
	>('/api/v1/document_templates', {
		apiKey: ctx.key,
		method: 'POST',
		body: {
			document_template: {
				app_id: input.document_template.app_id,
				identifier: input.document_template.identifier,
				body: input.document_template.body,
				body_draft: input.document_template.body_draft,
				scss_style: input.document_template.scss_style,
				scss_style_draft: input.document_template.scss_style_draft,
				sample_data: input.document_template.sample_data,
				sample_data_draft: input.document_template.sample_data_draft,
				settings: input.document_template.settings,
				settings_draft: input.document_template.settings_draft,
				pdf_engine_id: input.document_template.pdf_engine_id,
				pdf_engine_draft_id: input.document_template.pdf_engine_draft_id,
				template_folder_id: input.document_template.template_folder_id,
				ttl: input.document_template.ttl,
				edition_mode: input.document_template.edition_mode,
				output_type: input.document_template.output_type,
			},
		},
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.createTemplate',
		{ identifier: input.document_template.identifier },
		'completed',
	);

	return response;
};

/** Update an existing template */
export const updateTemplate: PDFMonkeyEndpoints['updateTemplate'] = async (
	ctx,
	input,
) => {
	const document_template = input.document_template;
	if (!document_template) {
		throw new Error('document_template is required for update');
	}
	const body: Record<string, unknown> = {};
	if (document_template?.identifier !== undefined)
		body.identifier = document_template.identifier;
	if (document_template?.body !== undefined) body.body = document_template.body;
	if (document_template?.body_draft !== undefined)
		body.body_draft = document_template.body_draft;
	if (document_template?.scss_style !== undefined)
		body.scss_style = document_template.scss_style;
	if (document_template?.scss_style_draft !== undefined)
		body.scss_style_draft = document_template.scss_style_draft;
	if (document_template?.sample_data !== undefined)
		body.sample_data = document_template.sample_data;
	if (document_template?.sample_data_draft !== undefined)
		body.sample_data_draft = document_template.sample_data_draft;
	if (document_template?.settings !== undefined)
		body.settings = document_template.settings;
	if (document_template?.settings_draft !== undefined)
		body.settings_draft = document_template.settings_draft;
	if (document_template?.pdf_engine_id !== undefined)
		body.pdf_engine_id = document_template.pdf_engine_id;
	if (document_template?.pdf_engine_draft_id !== undefined)
		body.pdf_engine_draft_id = document_template.pdf_engine_draft_id;
	if (document_template?.template_folder_id !== undefined)
		body.template_folder_id = document_template.template_folder_id;
	if (document_template?.ttl !== undefined) body.ttl = document_template.ttl;
	if (document_template?.edition_mode !== undefined)
		body.edition_mode = document_template.edition_mode;
	if (document_template?.output_type !== undefined)
		body.output_type = document_template.output_type;

	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['updateTemplate']
	>('/api/v1/document_templates/' + input.document_template_id, {
		apiKey: ctx.key,
		method: 'PUT',
		body: {
			document_template: body,
		},
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.updateTemplate',
		{ template_id: input.document_template_id },
		'completed',
	);

	return response;
};

/** Delete a template */
export const deleteTemplate: PDFMonkeyEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['deleteTemplate']
	>('/api/v1/document_templates/' + input.id, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.templates.deleteTemplate',
		{ id: input.id },
		'completed',
	);

	return response;
};
