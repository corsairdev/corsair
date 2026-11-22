import type { ParadymEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const list: ParadymEndpoints['presentationTemplatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'presentationTemplates.list',
			input: Inputs.presentationTemplatesList,
			output: Outputs.presentationTemplatesList,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/templates/presentations`,
			query: {
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: ParadymEndpoints['presentationTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'presentationTemplates.create',
			input: Inputs.presentationTemplatesCreate,
			output: Outputs.presentationTemplatesCreate,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/templates/presentations`,
			body,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const get: ParadymEndpoints['presentationTemplatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'presentationTemplates.get',
			input: Inputs.presentationTemplatesGet,
			output: Outputs.presentationTemplatesGet,
		},
		input,
		({ presentationTemplateId }, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/templates/presentations/${encodeURIComponent(presentationTemplateId)}`,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const update: ParadymEndpoints['presentationTemplatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'presentationTemplates.update',
			input: Inputs.presentationTemplatesUpdate,
			output: Outputs.presentationTemplatesUpdate,
		},
		input,
		({ presentationTemplateId, ...body }, walletId) => ({
			method: 'PUT',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/templates/presentations/${encodeURIComponent(presentationTemplateId)}`,
			body,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const archive: ParadymEndpoints['presentationTemplatesArchive'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'presentationTemplates.archive',
			input: Inputs.presentationTemplatesArchive,
			output: Outputs.presentationTemplatesArchive,
		},
		input,
		({ presentationTemplateId }, walletId) => ({
			method: 'DELETE',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/templates/presentations/${encodeURIComponent(presentationTemplateId)}`,
		}),
		{
			shape: (raw, { presentationTemplateId }) => {
				expectEmptyBody(raw, 'presentationTemplates.archive');
				return { id: presentationTemplateId, success: true };
			},
			log: (_, result) => ({ templateId: result.id }),
		},
	);
