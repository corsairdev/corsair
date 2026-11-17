import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

function recipientsPath(collectorId: string, messageId: string): string {
	return `/collectors/${segment(collectorId)}/messages/${segment(messageId)}/recipients`;
}

export const list: SurveymonkeyEndpoints['recipientsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.list',
			input: Inputs.recipientsList,
			output: Outputs.recipientsList,
		},
		input,
		({ collector_id, message_id, page, per_page }) => ({
			method: 'GET',
			path: recipientsPath(collector_id, message_id),
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'recipient list'),
				data: unwrapList(raw, 'recipient list'),
			}),
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				messageId: parsed.message_id,
				count: result.data.length,
			}),
		},
	);

export const create: SurveymonkeyEndpoints['recipientsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.create',
			input: Inputs.recipientsCreate,
			output: Outputs.recipientsCreate,
		},
		input,
		({ collector_id, message_id, email, first_name, last_name }) => ({
			method: 'POST',
			path: recipientsPath(collector_id, message_id),
			body: {
				email,
				...(first_name === undefined ? {} : { first_name }),
				...(last_name === undefined ? {} : { last_name }),
			},
		}),
		{
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				recipientId: result.id,
			}),
		},
	);

export const bulkCreate: SurveymonkeyEndpoints['recipientsBulkCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'recipients.bulkCreate',
			input: Inputs.recipientsBulkCreate,
			output: Outputs.recipientsBulkCreate,
		},
		input,
		({ collector_id, message_id, contacts }) => ({
			method: 'POST',
			path: `${recipientsPath(collector_id, message_id)}/bulk`,
			body: { contacts },
		}),
		{
			log: (parsed, result) => ({
				collectorId: parsed.collector_id,
				submitted: parsed.contacts.length,
				succeeded: result.succeeded?.length ?? 0,
			}),
		},
	);
