import type { KitEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	KitEndpointInputSchemas as Inputs,
	KitEndpointOutputSchemas as Outputs,
} from './types';

export const list: KitEndpoints['formsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.list',
			input: Inputs.formsList,
			output: Outputs.formsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/forms',
			query: definedQuery({
				after: parsed.after,
				before: parsed.before,
				per_page: parsed.per_page,
				status: parsed.status,
				include:
					parsed.include && parsed.include.length > 0
						? parsed.include.join(',')
						: undefined,
			}),
		}),
		{ log: (_, result) => ({ count: result.forms.length }) },
	);

// Subscribing through a form applies the form's incentive and records
// `added_at` on the subscriber, which is why this route exists beside the plain
// subscriber create.
export const subscribe: KitEndpoints['formsSubscribe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.subscribe',
			input: Inputs.formsSubscribe,
			output: Outputs.formsSubscribe,
		},
		input,
		({ form_id, email_address, referrer }) => ({
			method: 'POST',
			path: `/v4/forms/${segment(form_id)}/subscribers`,
			body: Object.fromEntries(
				Object.entries({ email_address, referrer }).filter(
					([, value]) => value !== undefined,
				),
			),
		}),
		{
			// The address is personal data, so the log names the form and the
			// subscriber, never the address.
			log: ({ form_id }, result) => ({
				formId: form_id,
				subscriberId: result.subscriber.id,
			}),
		},
	);
