import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

export const list: SpondyrEndpoints['conditionsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'conditions.list',
			input: SpondyrEndpointInputSchemas.listConditions,
			output: SpondyrEndpointOutputSchemas.listConditions,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Conditions',
			query: { TransactionType: parsed.transaction_type },
		}),
		{
			log: (parsed, result) => ({
				transaction_type: parsed.transaction_type,
				conditions: result.Data.length,
			}),
		},
	);

export const get: SpondyrEndpoints['conditionsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'conditions.get',
			input: SpondyrEndpointInputSchemas.getCondition,
			output: SpondyrEndpointOutputSchemas.getCondition,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Condition',
			query: {
				TransactionType: parsed.transaction_type,
				Condition: parsed.condition,
			},
		}),
		{
			log: (parsed) => ({
				transaction_type: parsed.transaction_type,
				condition: parsed.condition,
			}),
		},
	);

const writes = adminWrites({
	resource: 'Condition',
	event: 'conditions',
	create: {
		input: SpondyrEndpointInputSchemas.createCondition,
		output: SpondyrEndpointOutputSchemas.createCondition,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateCondition,
		output: SpondyrEndpointOutputSchemas.updateCondition,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteCondition,
		output: SpondyrEndpointOutputSchemas.deleteCondition,
	},
	body: (parsed) => ({
		TransactionType: parsed.transaction_type,
		Name: parsed.name,
		FieldName: parsed.field_name,
		...(parsed.possible_values === undefined
			? {}
			: { PossibleValues: parsed.possible_values }),
		...(parsed.condition === undefined ? {} : { Condition: parsed.condition }),
	}),
	name: (parsed) => String(parsed.condition),
	filter: (parsed) => String(parsed.transaction_type),
	logCreate: (parsed) => ({
		transaction_type: parsed.transaction_type,
		condition: parsed.name ?? parsed.condition,
	}),
});

export const create: SpondyrEndpoints['conditionsCreate'] = writes.create;
export const update: SpondyrEndpoints['conditionsUpdate'] = writes.update;
export const remove: SpondyrEndpoints['conditionsDelete'] = writes.remove;
