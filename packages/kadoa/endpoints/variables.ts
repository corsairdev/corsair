import type { KadoaEndpoints } from '..';
import { segment } from '../client';
import { call, definedQuery } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

export const list: KadoaEndpoints['variablesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variables.list',
			input: Inputs.variablesList,
			output: Outputs.variablesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/variables/',
			query: definedQuery({
				workflowId: parsed.workflowId,
				includeWorkflows: parsed.includeWorkflows,
			}),
		}),
		// Only the count: a variable's `value` can be a credential.
		{ log: (_, result) => ({ count: result.variables.length }) },
	);

export const get: KadoaEndpoints['variablesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variables.get',
			input: Inputs.variablesGet,
			output: Outputs.variablesGet,
		},
		input,
		({ variableId }) => ({
			method: 'GET',
			path: `/v4/variables/${segment(variableId)}`,
		}),
		{ log: (_, result) => ({ variableId: result.variable?.id }) },
	);

// Kadoa takes one of three documented bodies, picked by `dataType` and
// `managementMode`; the input schema has already checked the combination, so
// only the fields that shape defines are sent.
export const create: KadoaEndpoints['variablesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variables.create',
			input: Inputs.variablesCreate,
			output: Outputs.variablesCreate,
		},
		input,
		(parsed) => {
			const body =
				parsed.dataType === 'SECRET'
					? parsed.managementMode === 'CUSTOMER_MANAGED'
						? {
								key: parsed.key,
								dataType: 'SECRET',
								managementMode: 'CUSTOMER_MANAGED',
								providerConnectionId: parsed.providerConnectionId,
								resourceReference: parsed.resourceReference,
							}
						: {
								key: parsed.key,
								value: parsed.value,
								dataType: 'SECRET',
								managementMode: parsed.managementMode,
							}
					: {
							key: parsed.key,
							value: parsed.value,
							dataType: parsed.dataType,
						};
			return {
				method: 'POST',
				path: '/v4/variables/',
				body: Object.fromEntries(
					Object.entries(body).filter(([, value]) => value !== undefined),
				),
			};
		},
		// The key identifies the variable; neither the value nor a secret's
		// resource reference is logged.
		{ log: (_, result) => ({ variableId: result.variable?.id }) },
	);

export const update: KadoaEndpoints['variablesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variables.update',
			input: Inputs.variablesUpdate,
			output: Outputs.variablesUpdate,
		},
		input,
		({ variableId, ...changes }) => ({
			method: 'PATCH',
			path: `/v4/variables/${segment(variableId)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ variableId }) => ({ variableId }) },
	);

export const remove: KadoaEndpoints['variablesRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variables.remove',
			input: Inputs.variablesRemove,
			output: Outputs.variablesRemove,
		},
		input,
		({ variableId }) => ({
			method: 'DELETE',
			path: `/v4/variables/${segment(variableId)}`,
		}),
		{ log: ({ variableId }) => ({ variableId }) },
	);
