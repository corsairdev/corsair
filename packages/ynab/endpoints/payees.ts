import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['payeesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'payees.list',
			input: Inputs.payeesList,
			output: Outputs.payeesList,
		},
		input,
		({ budgetId, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/payees`,
			query: { last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({ count: result.data.payees?.length ?? 0 }),
		},
	);

export const get: YnabEndpoints['payeesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'payees.get', input: Inputs.payeesGet, output: Outputs.payeesGet },
		input,
		({ budgetId, payeeId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/payees/${segment(payeeId)}`,
		}),
		{
			// A payee name can be a merchant or an employer, so only the id and
			// whether it is a transfer are logged.
			log: (_, result) => ({
				id: result.data.payee?.id ?? undefined,
				transfer: result.data.payee?.transfer_account_id != null,
			}),
		},
	);

export const create: YnabEndpoints['payeesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'payees.create',
			input: Inputs.payeesCreate,
			output: Outputs.payeesCreate,
		},
		input,
		({ budgetId, name }) => ({
			method: 'POST',
			path: `/budgets/${segment(budgetId)}/payees`,
			body: { payee: { name } },
		}),
		{
			log: (_, result) => ({ id: result.data.payee?.id ?? undefined }),
		},
	);

export const update: YnabEndpoints['payeesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'payees.update',
			input: Inputs.payeesUpdate,
			output: Outputs.payeesUpdate,
		},
		input,
		({ budgetId, payeeId, name }) => ({
			method: 'PATCH',
			path: `/budgets/${segment(budgetId)}/payees/${segment(payeeId)}`,
			body: { payee: { name } },
		}),
		{
			log: (_, result) => ({ id: result.data.payee?.id ?? undefined }),
		},
	);
