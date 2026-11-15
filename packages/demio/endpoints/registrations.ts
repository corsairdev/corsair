import type { DemioContext } from '..';
import { callDemio } from './call';
import type { DemioEndpointInputs, DemioEndpointOutputs } from './types';
import {
	DemioRegistrationsCreateInputSchema,
	DemioRegistrationsCreateResponseSchema,
} from './types';

/**
 * One operation, sent as `POST /event/register`. Demio also accepts `PUT` on
 * the same path and the two behave identically, so wrapping both would give a
 * caller two names for one capability. `POST` is the one kept: everything else
 * in this plugin is a `GET`, and a client that cannot send `PUT` is not
 * blocked.
 */
export const create = (
	ctx: DemioContext,
	input: DemioEndpointInputs['registrationsCreate'],
): Promise<DemioEndpointOutputs['registrationsCreate']> =>
	callDemio(
		ctx,
		{
			event: 'registrations.create',
			input: DemioRegistrationsCreateInputSchema,
			output: DemioRegistrationsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/event/register',
			body: {
				...(parsed.id !== undefined ? { id: parsed.id } : {}),
				...(parsed.ref_url !== undefined ? { ref_url: parsed.ref_url } : {}),
				...(parsed.date_id !== undefined ? { date_id: parsed.date_id } : {}),
				name: parsed.name,
				email: parsed.email,
			},
		}),
		{
			// The name and email are deliberately absent: an event log is read
			// long after the call and this is a real person's address.
			log: (parsed) => ({
				registered: true,
				event_id: parsed.id,
				date_id: parsed.date_id,
			}),
		},
	);
