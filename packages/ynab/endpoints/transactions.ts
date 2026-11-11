import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		({ budgetId, since_date, type, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/transactions`,
			query: { since_date, type, last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({
				count: result.data.transactions?.length ?? 0,
				serverKnowledge: result.data.server_knowledge ?? undefined,
			}),
		},
	);

export const get: YnabEndpoints['transactionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
		},
		input,
		({ budgetId, transactionId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/transactions/${segment(transactionId)}`,
		}),
		{
			// The memo can name a merchant or a person, so only the amount, date
			// and cleared state are logged.
			log: (_, result) => ({
				id: result.data.transaction?.id ?? undefined,
				amount: result.data.transaction?.amount ?? undefined,
				cleared: result.data.transaction?.cleared ?? undefined,
			}),
		},
	);

/**
 * Creates one or more transactions in a single call, which is what a bulk
 * import wants: the whole batch is validated together rather than one at a
 * time.
 *
 * An `import_id` on each makes the call idempotent — a repeat with the same id
 * updates the existing transaction instead of adding a second, and the response
 * reports them in `duplicate_import_ids`.
 */
export const create: YnabEndpoints['transactionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.create',
			input: Inputs.transactionsCreate,
			output: Outputs.transactionsCreate,
		},
		input,
		({ budgetId, transactions }) => ({
			method: 'POST',
			path: `/budgets/${segment(budgetId)}/transactions`,
			body: { transactions },
		}),
		{
			log: (parsed, result) => ({
				sent: parsed.transactions.length,
				created: result.data.transaction_ids?.length ?? 0,
				duplicates: result.data.duplicate_import_ids?.length ?? 0,
			}),
		},
	);

export const update: YnabEndpoints['transactionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.update',
			input: Inputs.transactionsUpdate,
			output: Outputs.transactionsUpdate,
		},
		input,
		({ budgetId, transactionId, ...body }) => ({
			method: 'PUT',
			path: `/budgets/${segment(budgetId)}/transactions/${segment(transactionId)}`,
			body: { transaction: body },
		}),
		{
			log: (parsed, result) => ({
				id: result.data.transaction?.id ?? parsed.transactionId,
				amount: result.data.transaction?.amount ?? undefined,
			}),
		},
	);

/** Deletes a transaction, which answers the transaction as it was. */
export const remove: YnabEndpoints['transactionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.delete',
			input: Inputs.transactionsDelete,
			output: Outputs.transactionsDelete,
		},
		input,
		({ budgetId, transactionId }) => ({
			method: 'DELETE',
			path: `/budgets/${segment(budgetId)}/transactions/${segment(transactionId)}`,
		}),
		{
			log: (parsed, result) => ({
				id: result.data.transaction?.id ?? parsed.transactionId,
			}),
		},
	);

// ── scheduled transactions ────────────────────────────────────────────────

export const scheduledList: YnabEndpoints['scheduledList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.scheduledList',
			input: Inputs.scheduledList,
			output: Outputs.scheduledList,
		},
		input,
		({ budgetId, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/scheduled_transactions`,
			query: { last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({
				count: result.data.scheduled_transactions?.length ?? 0,
			}),
		},
	);

export const scheduledGet: YnabEndpoints['scheduledGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.scheduledGet',
			input: Inputs.scheduledGet,
			output: Outputs.scheduledGet,
		},
		input,
		({ budgetId, scheduledTransactionId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/scheduled_transactions/${segment(scheduledTransactionId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.scheduled_transaction?.id ?? undefined,
				frequency: result.data.scheduled_transaction?.frequency ?? undefined,
				next: result.data.scheduled_transaction?.date_next ?? undefined,
			}),
		},
	);

export const scheduledCreate: YnabEndpoints['scheduledCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.scheduledCreate',
			input: Inputs.scheduledCreate,
			output: Outputs.scheduledCreate,
		},
		input,
		({ budgetId, scheduled_transaction }) => ({
			method: 'POST',
			path: `/budgets/${segment(budgetId)}/scheduled_transactions`,
			body: { scheduled_transaction },
		}),
		{
			log: (parsed, result) => ({
				id: result.data.scheduled_transaction?.id ?? undefined,
				frequency: parsed.scheduled_transaction.frequency,
			}),
		},
	);

export const scheduledDelete: YnabEndpoints['scheduledDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.scheduledDelete',
			input: Inputs.scheduledDelete,
			output: Outputs.scheduledDelete,
		},
		input,
		({ budgetId, scheduledTransactionId }) => ({
			method: 'DELETE',
			path: `/budgets/${segment(budgetId)}/scheduled_transactions/${segment(scheduledTransactionId)}`,
		}),
		{
			log: (parsed, result) => ({
				id:
					result.data.scheduled_transaction?.id ??
					parsed.scheduledTransactionId,
			}),
		},
	);
