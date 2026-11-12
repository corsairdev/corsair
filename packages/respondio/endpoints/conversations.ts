import type { RespondioEndpoints } from '..';
import { contactIdentifier } from '../client';
import { call } from './call';
import {
	RespondioEndpointInputSchemas as Inputs,
	RespondioEndpointOutputSchemas as Outputs,
} from './types';

/**
 * respond.io takes the assignee as an integer user ID or an email and answers 400
 * to an ID sent as a string, so a numeric string is sent as a number.
 */
function assigneeValue(
	assignee: string | number | null | undefined,
): string | number | null {
	if (assignee === undefined || assignee === null) return null;
	if (typeof assignee === 'string' && /^\d+$/.test(assignee)) {
		return Number(assignee);
	}
	return assignee;
}

/**
 * Assigns a user, or unassigns with a null assignee.
 *
 * The docs say a contact is unassigned by "leaving the assignee value empty", so
 * omitting the field and sending null are both treated as unassign here.
 */
export const assign: RespondioEndpoints['conversationAssign'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversation.assign',
			input: Inputs.conversationAssign,
			output: Outputs.conversationAssign,
		},
		input,
		({ identifier, assignee }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/conversation/assignee`,
			// The key is always sent: an absent assignee would read as "no change",
			// while null is what unassigns.
			body: { assignee: assigneeValue(assignee) },
			// Assigning the same user twice leaves the same assignee.
			replayable: true,
		}),
		{
			log: (parsed) => ({
				assigned: parsed.assignee !== undefined && parsed.assignee !== null,
			}),
		},
	);

/**
 * Opens or closes a conversation. A close can carry a closing note (the `category`)
 * and a `summary`, but the summary is ignored unless a category is given.
 */
export const status: RespondioEndpoints['conversationStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversation.status',
			input: Inputs.conversationStatus,
			output: Outputs.conversationStatus,
		},
		input,
		({ identifier, status: state, category, summary }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/conversation/status`,
			body: { status: state, category, summary },
			// Setting the same status again leaves the conversation in that state.
			replayable: true,
		}),
		{
			log: (parsed) => ({ status: parsed.status }),
		},
	);
