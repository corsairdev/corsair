import type { PandadocEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	PandadocEndpointInputSchemas as Inputs,
	PandadocEndpointOutputSchemas as Outputs,
} from './types';

export const list: PandadocEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/public/v1/templates',
			query: {
				count: query.count,
				page: query.page,
				q: query.q,
				id: query.id,
				folder_uuid: query.folderUuid,
				deleted: query.deleted,
				shared: query.shared,
				tag: query.tag,
				fields: query.fields,
			},
		}),
		{ log: (_, page) => ({ count: page.results.length }) },
	);

export const get: PandadocEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/public/v1/templates/${encodeURIComponent(id)}/details`,
		}),
		{ log: (_, template) => ({ templateId: template.id }) },
	);

export const remove: PandadocEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/public/v1/templates/${encodeURIComponent(id)}`,
		}),
		{
			shape: (raw, { id }) => {
				expectEmptyBody(raw, 'templates.delete');
				return { id, success: true };
			},
			log: (_, result) => ({ templateId: result.id }),
		},
	);
