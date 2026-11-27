import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

export const list: Smtp2goEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(parsed) => ({
			path: '/template/search',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.templates.length }),
		},
	);

export const view: Smtp2goEndpoints['templatesView'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.view',
			input: Inputs.templatesView,
			output: Outputs.templatesView,
		},
		input,
		(parsed) => ({
			path: '/template/view',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (parsed) => ({ templateId: parsed.id }),
		},
	);

export const add: Smtp2goEndpoints['templatesAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.add',
			input: Inputs.templatesAdd,
			output: Outputs.templatesAdd,
		},
		input,
		(parsed) => ({
			path: '/template/add',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ templateId: parsed.id }),
		},
	);

export const edit: Smtp2goEndpoints['templatesEdit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.edit',
			input: Inputs.templatesEdit,
			output: Outputs.templatesEdit,
		},
		input,
		(parsed) => ({
			path: '/template/edit',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ templateId: parsed.id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// operation is registered under the delete: key.
export const remove: Smtp2goEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		(parsed) => ({
			path: '/template/delete',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ templateId: parsed.id }),
		},
	);
