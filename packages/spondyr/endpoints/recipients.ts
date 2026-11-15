import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

/**
 * Recipients are scoped by Transaction Type. The address fields carry
 * `{FieldName}` placeholders that Spondyr merges from the transaction data.
 */
function recipientBody(
	parsed: Record<string, unknown>,
): Record<string, unknown> {
	const body: Record<string, unknown> = {
		TransactionType: parsed.transaction_type,
		Name: parsed.name,
	};
	// Only the fields the caller set: an omitted address is left alone on an
	// update rather than cleared.
	for (const [key, target] of [
		['remote_id', 'RemoteID'],
		['first_name', 'FirstName'],
		['last_name', 'LastName'],
		['address1', 'Address1'],
		['address2', 'Address2'],
		['city', 'City'],
		['state', 'State'],
		['zip', 'Zip'],
		['fax', 'Fax'],
		['email', 'Email'],
		['mobile_phone', 'MobilePhone'],
	] as const) {
		if (parsed[key] !== undefined) body[target] = parsed[key];
	}
	if (parsed.recipient !== undefined) body.Recipient = parsed.recipient;
	return body;
}

export const list: SpondyrEndpoints['recipientsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.list',
			input: SpondyrEndpointInputSchemas.listRecipients,
			output: SpondyrEndpointOutputSchemas.listRecipients,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Recipients',
			query: { TransactionType: parsed.transaction_type },
		}),
		{
			log: (parsed, result) => ({
				transaction_type: parsed.transaction_type,
				recipients: result.Data.length,
			}),
		},
	);

export const get: SpondyrEndpoints['recipientsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.get',
			input: SpondyrEndpointInputSchemas.getRecipient,
			output: SpondyrEndpointOutputSchemas.getRecipient,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Recipient',
			query: {
				TransactionType: parsed.transaction_type,
				Recipient: parsed.recipient,
			},
		}),
		{
			log: (parsed) => ({
				transaction_type: parsed.transaction_type,
				recipient: parsed.recipient,
			}),
		},
	);

const writes = adminWrites({
	resource: 'Recipient',
	event: 'recipients',
	create: {
		input: SpondyrEndpointInputSchemas.createRecipient,
		output: SpondyrEndpointOutputSchemas.createRecipient,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateRecipient,
		output: SpondyrEndpointOutputSchemas.updateRecipient,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteRecipient,
		output: SpondyrEndpointOutputSchemas.deleteRecipient,
	},
	body: recipientBody,
	name: (parsed) => String(parsed.recipient ?? parsed.name),
	filter: (parsed) => String(parsed.transaction_type),
	logCreate: (parsed) => ({
		transaction_type: parsed.transaction_type,
		recipient: parsed.name ?? parsed.recipient,
	}),
});

export const create: SpondyrEndpoints['recipientsCreate'] = writes.create;
export const update: SpondyrEndpoints['recipientsUpdate'] = writes.update;
export const remove: SpondyrEndpoints['recipientsDelete'] = writes.remove;
