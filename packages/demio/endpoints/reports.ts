import type { DemioContext } from '..';
import { segment } from '../client';
import { callDemio } from './call';
import type { DemioEndpointInputs, DemioEndpointOutputs } from './types';
import {
	DemioReportsParticipantsInputSchema,
	DemioReportsParticipantsResponseSchema,
} from './types';

/**
 * Returns everyone registered for one date. The filter takes hyphenated values
 * (`did-not-attend`) while each participant's `status` comes back with spaces
 * (`did not attend`); both spellings are declared in `types.ts`.
 */
export const participants = (
	ctx: DemioContext,
	input: DemioEndpointInputs['reportsParticipants'],
): Promise<DemioEndpointOutputs['reportsParticipants']> =>
	callDemio(
		ctx,
		{
			event: 'reports.participants',
			input: DemioReportsParticipantsInputSchema,
			output: DemioReportsParticipantsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/report/${segment(parsed.date_id)}/participants`,
			query: parsed.status ? { status: parsed.status } : undefined,
		}),
		{
			log: (parsed, result) => ({
				date_id: parsed.date_id,
				status: parsed.status,
				participants: result.participants.length,
			}),
		},
	);
