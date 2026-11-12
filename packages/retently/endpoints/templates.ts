import type { RetentlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		() => ({ method: 'GET', path: '/templates', replayable: true }),
		{
			log: (_, result) => ({ count: result.templates?.length ?? 0 }),
		},
	);

export const get: RetentlyEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ templateId }) => ({
			method: 'GET',
			path: `/templates/${segment(templateId)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				questions: result.data?.surveyQuestions?.length ?? 0,
			}),
		},
	);
