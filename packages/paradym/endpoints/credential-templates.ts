import type { ParadymEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

const TEMPLATES = (walletId: string) =>
	`/v1/wallets/${encodeURIComponent(walletId)}/templates/credentials/sd-jwt-vc`;

export const list: ParadymEndpoints['credentialTemplatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.list',
			input: Inputs.credentialTemplatesList,
			output: Outputs.credentialTemplatesList,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: TEMPLATES(walletId),
			query: {
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: ParadymEndpoints['credentialTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.create',
			input: Inputs.credentialTemplatesCreate,
			output: Outputs.credentialTemplatesCreate,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: TEMPLATES(walletId),
			body,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const get: ParadymEndpoints['credentialTemplatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.get',
			input: Inputs.credentialTemplatesGet,
			output: Outputs.credentialTemplatesGet,
		},
		input,
		({ credentialTemplateId }, walletId) => ({
			method: 'GET',
			path: `${TEMPLATES(walletId)}/${encodeURIComponent(credentialTemplateId)}`,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const update: ParadymEndpoints['credentialTemplatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.update',
			input: Inputs.credentialTemplatesUpdate,
			output: Outputs.credentialTemplatesUpdate,
		},
		input,
		({ credentialTemplateId, ...body }, walletId) => ({
			method: 'PUT',
			path: `${TEMPLATES(walletId)}/${encodeURIComponent(credentialTemplateId)}`,
			body,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);

export const archive: ParadymEndpoints['credentialTemplatesArchive'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.archive',
			input: Inputs.credentialTemplatesArchive,
			output: Outputs.credentialTemplatesArchive,
		},
		input,
		({ credentialTemplateId }, walletId) => ({
			method: 'DELETE',
			path: `${TEMPLATES(walletId)}/${encodeURIComponent(credentialTemplateId)}`,
		}),
		{
			shape: (raw, { credentialTemplateId }) => {
				expectEmptyBody(raw, 'credentialTemplates.archive');
				return { id: credentialTemplateId, success: true };
			},
			log: (_, result) => ({ templateId: result.id }),
		},
	);

export const unarchive: ParadymEndpoints['credentialTemplatesUnarchive'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentialTemplates.unarchive',
			input: Inputs.credentialTemplatesUnarchive,
			output: Outputs.credentialTemplatesUnarchive,
		},
		input,
		({ credentialTemplateId }, walletId) => ({
			method: 'POST',
			path: `${TEMPLATES(walletId)}/${encodeURIComponent(credentialTemplateId)}/unarchive`,
		}),
		{ log: (_, template) => ({ templateId: template.id ?? undefined }) },
	);
