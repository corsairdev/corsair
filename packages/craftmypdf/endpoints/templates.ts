import { asRecord } from 'corsair/core';
import type { CraftmypdfEndpoints } from '..';
import { call } from './call';
import { nextOffsetFor, readList } from './pages';
import {
	CRAFTMYPDF_DEFAULT_PAGE_SIZE,
	CraftmypdfEndpointInputSchemas as Inputs,
	CraftmypdfEndpointOutputSchemas as Outputs,
} from './types';

export const list: CraftmypdfEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/list-templates',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				group_name: parsed.group_name,
			},
		}),
		{
			shape: (raw, parsed) => {
				const templates = readList(raw, 'templates');
				const limit = parsed.limit ?? CRAFTMYPDF_DEFAULT_PAGE_SIZE;
				return {
					...asRecord(raw),
					templates,
					next_offset: nextOffsetFor(
						templates.length,
						limit,
						parsed.offset ?? 0,
					),
				};
			},
			log: (_, result) => ({ count: result.templates.length }),
		},
	);

export const get: CraftmypdfEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/get-template',
			query: {
				template_id: parsed.template_id,
				version:
					parsed.version === undefined ? undefined : String(parsed.version),
			},
		}),
	);

export const update: CraftmypdfEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/update-template',
			body: parsed,
		}),
		{ log: (parsed) => ({ templateId: parsed.template_id }) },
	);

export const remove: CraftmypdfEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/delete-template',
			query: { template_id: parsed.template_id },
		}),
		{ log: (parsed) => ({ templateId: parsed.template_id }) },
	);

export const createFrom: CraftmypdfEndpoints['templatesCreateFrom'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.createFrom',
			input: Inputs.templatesCreateFrom,
			output: Outputs.templatesCreateFrom,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/new-template-from',
			body: {
				...parsed,
				version:
					parsed.version === undefined ? undefined : String(parsed.version),
			},
		}),
		{
			log: (parsed, result) => ({
				fromTemplateId: parsed.template_id,
				templateId: result.template_id ?? undefined,
			}),
		},
	);

export const transfer: CraftmypdfEndpoints['templatesTransfer'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.transfer',
			input: Inputs.templatesTransfer,
			output: Outputs.templatesTransfer,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/transfer-template-to',
			body: parsed,
		}),
		{
			log: (parsed) => ({
				templateId: parsed.template_id,
				teamId: parsed.team_id,
			}),
		},
	);

export const listVersions: CraftmypdfEndpoints['templatesListVersions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.listVersions',
			input: Inputs.templatesListVersions,
			output: Outputs.templatesListVersions,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/list-template-versions',
			query: { template_id: parsed.template_id },
		}),
		{
			log: (_, result) => ({ count: result.versions.length }),
		},
	);

export const retainVersions: CraftmypdfEndpoints['templatesRetainVersions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.retainVersions',
			input: Inputs.templatesRetainVersions,
			output: Outputs.templatesRetainVersions,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/retain-template-versions',
			body: parsed,
		}),
		{
			log: (parsed) => ({
				templateId: parsed.template_id,
				versions: parsed.versions.length,
				keep: parsed.keep,
			}),
		},
	);

export const queryUsage: CraftmypdfEndpoints['templatesQueryUsage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.queryUsage',
			input: Inputs.templatesQueryUsage,
			output: Outputs.templatesQueryUsage,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/query-template-usage',
			query: {
				// CraftMyPDF documents the ids as one comma-separated value.
				template_ids: parsed.template_ids.join(','),
				start_date: parsed.start_date,
				end_date: parsed.end_date,
			},
		}),
		{
			log: (parsed, result) => ({
				templates: parsed.template_ids.length,
				rows: result.results?.length,
			}),
		},
	);
