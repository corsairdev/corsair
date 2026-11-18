import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const start: EmailOctopusEndpoints['automationsStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'automations.start',
			input: Inputs.automationsStart,
			output: Outputs.automationsStart,
		},
		input,
		({ automation_id, contact_id }) => ({
			method: 'POST',
			path: `/automations/${segment(automation_id)}/queue`,
			body: { contact_id },
		}),
		{
			shape: () => ({}),
			log: ({ automation_id, contact_id }) => ({
				automationId: automation_id,
				contactId: contact_id,
			}),
		},
	);
