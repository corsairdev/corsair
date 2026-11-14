import type { RampEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape, singleShape } from './shape';
import {
	RampEndpointInputSchemas as Inputs,
	RampEndpointOutputSchemas as Outputs,
} from './types';

export const list: RampEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/transactions',
			query: queryOf({
				state: parsed.state,
				sync_status: parsed.sync_status,
				from_date: parsed.from_date,
				to_date: parsed.to_date,
				user_id: parsed.user_id,
				card_id: parsed.card_id,
				merchant_id: parsed.merchant_id,
				department_id: parsed.department_id,
				location_id: parsed.location_id,
				entity_id: parsed.entity_id,
				statement_id: parsed.statement_id,
				trip_id: parsed.trip_id,
				spend_program_id: parsed.spend_program_id,
				limit_id: parsed.limit_id,
				sk_category_id: parsed.sk_category_id,
				has_been_approved: parsed.has_been_approved,
				all_requirements_met_and_approved:
					parsed.all_requirements_met_and_approved,
				requires_memo: parsed.requires_memo,
				has_statement: parsed.has_statement,
				has_no_sync_commits: parsed.has_no_sync_commits,
				min_amount: parsed.min_amount,
				max_amount: parsed.max_amount,
				synced_after: parsed.synced_after,
				include_count: parsed.include_count,
				include_merchant_data: parsed.include_merchant_data,
				start: parsed.start,
				page_size: parsed.page_size,
				// Ramp takes four separate booleans and rejects more than one
				// ordering parameter per call, so the pair is split here.
				order_by_date_asc:
					parsed.sort?.by === 'date' && parsed.sort.direction === 'asc'
						? true
						: undefined,
				order_by_date_desc:
					parsed.sort?.by === 'date' && parsed.sort.direction === 'desc'
						? true
						: undefined,
				order_by_amount_asc:
					parsed.sort?.by === 'amount' && parsed.sort.direction === 'asc'
						? true
						: undefined,
				order_by_amount_desc:
					parsed.sort?.by === 'amount' && parsed.sort.direction === 'desc'
						? true
						: undefined,
			}),
		}),
		{
			shape: pagedShape('transactions'),
			log: (_, result) => ({
				count: result.transactions.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const get: RampEndpoints['transactionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/transactions/${segment(parsed.transaction_id)}`,
			query: queryOf({
				include_merchant_data: parsed.include_merchant_data,
			}),
		}),
		{
			shape: singleShape('transaction'),
			log: (_, result) => ({ transactionId: result.transaction.id ?? '' }),
		},
	);

export const update: RampEndpoints['transactionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.update',
			input: Inputs.transactionsUpdate,
			output: Outputs.transactionsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/transactions/${segment(parsed.transaction_id)}`,
			body: { line_items: parsed.line_items },
		}),
		{
			shape: singleShape('transaction'),
			log: (parsed, result) => ({
				transactionId: parsed.transaction_id,
				lineItems: parsed.line_items.length,
				state: result.transaction.state ?? undefined,
			}),
		},
	);
