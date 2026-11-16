import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

function messagePath(collectorId: string, messageId?: string): string {
	const base = `/collectors/${segment(collectorId)}/messages`;
	return messageId === undefined ? base : `${base}/${segment(messageId)}`;
}

export const list: SurveymonkeyEndpoints['messagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.list',
			input: Inputs.messagesList,
			output: Outputs.messagesList,
		},
		input,
		({ collector_id, page, per_page }) => ({
			method: 'GET',
			path: messagePath(collector_id),
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'message list'),
				data: unwrapList(raw, 'message list'),
			}),
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				count: result.data.length,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['messagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.create',
			input: Inputs.messagesCreate,
			output: Outputs.messagesCreate,
		},
		input,
		({
			collector_id,
			type,
			subject,
			body_text,
			body_html,
			from_collector_id,
			from_message_id,
		}) => ({
			method: 'POST',
			path: messagePath(collector_id),
			body: {
				subject,
				...(type === undefined ? {} : { type }),
				...(body_text === undefined ? {} : { body_text }),
				...(body_html === undefined ? {} : { body_html }),
				...(from_collector_id === undefined ? {} : { from_collector_id }),
				...(from_message_id === undefined ? {} : { from_message_id }),
			},
		}),
		{
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				messageId: result.id,
			}),
		},
	);

export const get: SurveymonkeyEndpoints['messagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messagesGet,
			output: Outputs.messagesGet,
		},
		input,
		({ collector_id, message_id }) => ({
			method: 'GET',
			path: messagePath(collector_id, message_id),
		}),
		{
			log: (parsed) => ({
				collectorId: parsed.collector_id,
				messageId: parsed.message_id,
			}),
		},
	);

export const update: SurveymonkeyEndpoints['messagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.update',
			input: Inputs.messagesUpdate,
			output: Outputs.messagesUpdate,
		},
		input,
		({ collector_id, message_id, type, subject, body_text, body_html }) => ({
			method: 'PATCH',
			path: messagePath(collector_id, message_id),
			body: {
				...(type === undefined ? {} : { type }),
				...(subject === undefined ? {} : { subject }),
				...(body_text === undefined ? {} : { body_text }),
				...(body_html === undefined ? {} : { body_html }),
			},
		}),
		{
			log: (parsed) => ({
				collectorId: parsed.collector_id,
				messageId: parsed.message_id,
			}),
		},
	);

/**
 * Sending is the one call here that reaches real respondents: it mails every
 * recipient on the message. `scheduled_date` defers it instead of sending now.
 */
export const send: SurveymonkeyEndpoints['messagesSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messagesSend,
			output: Outputs.messagesSend,
		},
		input,
		({ collector_id, message_id, scheduled_date }) => ({
			method: 'POST',
			path: `${messagePath(collector_id, message_id)}/send`,
			body: scheduled_date === undefined ? {} : { scheduled_date },
		}),
		{
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				messageId: parsed.message_id,
				scheduled: result.is_scheduled ?? undefined,
			}),
		},
	);
