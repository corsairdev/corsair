import type { WatiEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

/** The approved and pending message templates on the workspace. */
export const list: WatiEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({ page_number, page_size, channel }) => ({
			method: 'GET',
			path: '/messageTemplates',
			query: { page_number, page_size, channel },
		}),
		{
			log: (_, result) => ({
				count:
					(
						result.templates ??
						result.messageTemplates ??
						result.message_templates
					)?.length ?? 0,
				total: result.total ?? undefined,
			}),
		},
	);

export const get: WatiEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ template_id }) => ({
			method: 'GET',
			path: `/messageTemplates/${segment(template_id)}`,
		}),
		{
			log: (_, result) => ({
				name: result.name ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
