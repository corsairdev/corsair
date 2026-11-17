import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const get: SupportbeeEndpoints['draftsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'drafts.get',
			input: Inputs.draftsGet,
			output: Outputs.draftsGet,
		},
		input,
		({ ticket_id, quote, time_zone }) => ({
			method: 'GET',
			path: `/tickets/${segment(ticket_id)}/draft`,
			query: queryOf({ quote, time_zone }),
		}),
		{
			log: (parsed) => ({ ticketId: parsed.ticket_id }),
		},
	);

export const create: SupportbeeEndpoints['draftsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'drafts.create',
			input: Inputs.draftsCreate,
			output: Outputs.draftsCreate,
		},
		input,
		({ ticket_id, content, cc, bcc }) => ({
			method: 'POST',
			path: `/tickets/${segment(ticket_id)}/draft`,
			body: {
				draft: {
					content,
					...(cc === undefined ? {} : { cc }),
					...(bcc === undefined ? {} : { bcc }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				draftId: result.draft.id ?? undefined,
			}),
		},
	);

export const update: SupportbeeEndpoints['draftsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'drafts.update',
			input: Inputs.draftsUpdate,
			output: Outputs.draftsUpdate,
		},
		input,
		({ ticket_id, content, cc, bcc }) => ({
			method: 'PUT',
			path: `/tickets/${segment(ticket_id)}/draft`,
			body: {
				draft: {
					content,
					...(cc === undefined ? {} : { cc }),
					...(bcc === undefined ? {} : { bcc }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				ticketId: parsed.ticket_id,
				draftId: result.draft.id ?? undefined,
			}),
		},
	);

export const remove: SupportbeeEndpoints['draftsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'drafts.delete',
			input: Inputs.draftsDelete,
			output: Outputs.draftsDelete,
		},
		input,
		({ ticket_id }) => ({
			method: 'DELETE',
			path: `/tickets/${segment(ticket_id)}/draft`,
		}),
		{
			shape: (_, parsed) => ({ ticket_id: parsed.ticket_id, deleted: true }),
			log: (parsed) => ({ ticketId: parsed.ticket_id }),
		},
	);
