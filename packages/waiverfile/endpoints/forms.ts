import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import { dotNetList } from './shape';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The forms currently active on the site. A form carries the questions and the
 * fields it collects, so it is what explains a waiver's `FieldsXml`.
 */
export const active: WaiverFileEndpoints['formsActive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.active',
			input: Inputs.formsActive,
			output: Outputs.formsActive,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/GetActiveWaiverForms' }),
		{
			shape: (raw) =>
				dotNetList(raw, 'WaiverForms', '/api/v1/GetActiveWaiverForms'),
			log: (_, result) => ({
				count: result.WaiverForms?.length ?? 0,
			}),
		},
	);

/**
 * Every form, including disabled and deleted ones. Useful for resolving an old
 * waiver's form, which may since have been switched off.
 */
export const all: WaiverFileEndpoints['formsAll'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'forms.all', input: Inputs.formsAll, output: Outputs.formsAll },
		input,
		() => ({ method: 'GET', path: '/api/v1/GetAllWaiverForms' }),
		{
			shape: (raw) =>
				dotNetList(raw, 'WaiverForms', '/api/v1/GetAllWaiverForms'),
			log: (_, result) => ({
				count: result.WaiverForms?.length ?? 0,
			}),
		},
	);
