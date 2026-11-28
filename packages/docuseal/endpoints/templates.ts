import type { DocuSealEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DocuSealEndpointInputSchemas as Inputs,
	DocuSealEndpointOutputSchemas as Outputs,
} from './types';

export const list: DocuSealEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({
			q,
			slug,
			external_id,
			folder,
			archived,
			shared,
			limit,
			after,
			before,
		}) => ({
			method: 'GET',
			path: '/templates',
			query: {
				q,
				slug,
				external_id,
				folder,
				archived,
				shared,
				limit,
				after,
				before,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				next: result.pagination.next ?? undefined,
			}),
		},
	);

export const get: DocuSealEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/templates/${segment(id)}` }),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const update: DocuSealEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/templates/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const archive: DocuSealEndpoints['templatesArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.archive',
			input: Inputs.templatesArchive,
			output: Outputs.templatesArchive,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/templates/${segment(id)}` }),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const createFromHtml: DocuSealEndpoints['templatesCreateFromHtml'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.createFromHtml',
			input: Inputs.templatesCreateFromHtml,
			output: Outputs.templatesCreateFromHtml,
		},
		input,
		({
			html,
			html_header,
			html_footer,
			name,
			size,
			external_id,
			folder_name,
			shared_link,
			documents,
		}) => {
			if (!html && !documents?.length) {
				throw new Error(
					'templates.createFromHtml needs html or a non-empty documents array',
				);
			}
			return {
				method: 'POST',
				path: '/templates/html',
				body: {
					html,
					html_header,
					html_footer,
					name,
					size,
					external_id,
					folder_name,
					shared_link,
					documents,
				},
			};
		},
	);

export const createFromPdf: DocuSealEndpoints['templatesCreateFromPdf'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.createFromPdf',
			input: Inputs.templatesCreateFromPdf,
			output: Outputs.templatesCreateFromPdf,
		},
		input,
		({
			name,
			folder_name,
			external_id,
			shared_link,
			documents,
			flatten,
			remove_tags,
		}) => ({
			method: 'POST',
			path: '/templates/pdf',
			body: {
				name,
				folder_name,
				external_id,
				shared_link,
				documents,
				flatten,
				remove_tags,
			},
		}),
	);

export const createFromDocx: DocuSealEndpoints['templatesCreateFromDocx'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.createFromDocx',
			input: Inputs.templatesCreateFromDocx,
			output: Outputs.templatesCreateFromDocx,
		},
		input,
		({ name, external_id, folder_name, shared_link, documents }) => ({
			method: 'POST',
			path: '/templates/docx',
			body: { name, external_id, folder_name, shared_link, documents },
		}),
	);

export const clone: DocuSealEndpoints['templatesClone'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.clone',
			input: Inputs.templatesClone,
			output: Outputs.templatesClone,
		},
		input,
		({ id, name, folder_name, external_id }) => ({
			method: 'POST',
			path: `/templates/${segment(id)}/clone`,
			body: { name, folder_name, external_id },
		}),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const merge: DocuSealEndpoints['templatesMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.merge',
			input: Inputs.templatesMerge,
			output: Outputs.templatesMerge,
		},
		input,
		({ template_ids, name, folder_name, external_id, shared_link, roles }) => ({
			method: 'POST',
			path: '/templates/merge',
			body: {
				template_ids,
				name,
				folder_name,
				external_id,
				shared_link,
				roles,
			},
		}),
	);

export const updateDocuments: DocuSealEndpoints['templatesUpdateDocuments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.updateDocuments',
			input: Inputs.templatesUpdateDocuments,
			output: Outputs.templatesUpdateDocuments,
		},
		input,
		({ id, documents, merge }) => ({
			method: 'PUT',
			path: `/templates/${segment(id)}/documents`,
			body: { documents, merge },
		}),
		{ log: ({ id }) => ({ templateId: id }) },
	);
