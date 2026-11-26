import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

export const list: SpondyrEndpoints['transactionTypesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transactionTypes.list',
			input: SpondyrEndpointInputSchemas.listTransactionTypes,
			output: SpondyrEndpointOutputSchemas.listTransactionTypes,
		},
		input,
		() => ({ method: 'GET', path: 'TransactionTypes' }),
		{ log: (_parsed, result) => ({ types: result.Data.length }) },
	);

export const get: SpondyrEndpoints['transactionTypesGet'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transactionTypes.get',
			input: SpondyrEndpointInputSchemas.getTransactionType,
			output: SpondyrEndpointOutputSchemas.getTransactionType,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'TransactionType',
			query: { TransactionType: parsed.transaction_type },
		}),
		{ log: (parsed) => ({ transaction_type: parsed.transaction_type }) },
	);

const writes = adminWrites({
	resource: 'TransactionType',
	event: 'transactionTypes',
	create: {
		input: SpondyrEndpointInputSchemas.createTransactionType,
		output: SpondyrEndpointOutputSchemas.createTransactionType,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateTransactionType,
		output: SpondyrEndpointOutputSchemas.updateTransactionType,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteTransactionType,
		output: SpondyrEndpointOutputSchemas.deleteTransactionType,
	},
	body: (parsed) => ({
		Name: parsed.name,
		TemplateJSON: parsed.template_json,
		// The rename selector only exists on an update, and Spondyr wants it
		// under `TransactionType` there.
		...(parsed.transaction_type === undefined
			? {}
			: { TransactionType: parsed.transaction_type }),
	}),
	name: (parsed) => String(parsed.transaction_type),
	logCreate: (parsed) => ({
		transaction_type: parsed.name ?? parsed.transaction_type,
	}),
});

export const create: SpondyrEndpoints['transactionTypesCreate'] = writes.create;
export const update: SpondyrEndpoints['transactionTypesUpdate'] = writes.update;
export const remove: SpondyrEndpoints['transactionTypesDelete'] = writes.remove;
