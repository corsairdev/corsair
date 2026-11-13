import type { RampEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape, singleShape } from './shape';
import {
	RampEndpointInputSchemas as Inputs,
	RampEndpointOutputSchemas as Outputs,
} from './types';

export const list: RampEndpoints['merchantsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'merchants.list',
			input: Inputs.merchantsList,
			output: Outputs.merchantsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/merchants',
			query: queryOf({
				merchant_name: parsed.merchant_name,
				merchant_url: parsed.merchant_url,
				transaction_from_date: parsed.transaction_from_date,
				transaction_to_date: parsed.transaction_to_date,
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('merchants'),
			log: (_, result) => ({
				count: result.merchants.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const listVirtual: RampEndpoints['cardsListVirtual'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.listVirtual',
			input: Inputs.cardsListVirtual,
			output: Outputs.cardsListVirtual,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/cards/virtual',
			query: queryOf({
				entity_id: parsed.entity_id,
				user_id: parsed.user_id,
				is_terminated: parsed.is_terminated,
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('cards'),
			log: (_, result) => ({
				count: result.cards.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const billsList: RampEndpoints['billsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bills.list',
			input: Inputs.billsList,
			output: Outputs.billsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/bills',
			query: queryOf({
				vendor_id: parsed.vendor_id,
				entity_id: parsed.entity_id,
				invoice_number: parsed.invoice_number,
				// Ramp takes this one as a comma-separated list.
				status_summaries: parsed.status_summaries?.join(','),
				approval_status: parsed.approval_status,
				payment_status: parsed.payment_status,
				sync_status: parsed.sync_status,
				is_archived: parsed.is_archived,
				sync_ready: parsed.sync_ready,
				payment_details_missing: parsed.payment_details_missing,
				from_created_at: parsed.from_created_at,
				to_created_at: parsed.to_created_at,
				from_due_date: parsed.from_due_date,
				to_due_date: parsed.to_due_date,
				from_paid_at: parsed.from_paid_at,
				to_paid_at: parsed.to_paid_at,
				min_amount: parsed.min_amount,
				max_amount: parsed.max_amount,
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('bills'),
			log: (_, result) => ({
				count: result.bills.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const billsGet: RampEndpoints['billsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bills.get',
			input: Inputs.billsGet,
			output: Outputs.billsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/bills/${segment(parsed.bill_id)}`,
		}),
		{
			shape: singleShape('bill'),
			log: (_, result) => ({ billId: result.bill.id ?? '' }),
		},
	);

export const billsUpdate: RampEndpoints['billsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bills.update',
			input: Inputs.billsUpdate,
			output: Outputs.billsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/bills/${segment(parsed.bill_id)}`,
			body: queryOf({
				memo: parsed.memo,
				vendor_memo: parsed.vendor_memo,
				invoice_number: parsed.invoice_number,
				due_at: parsed.due_at,
			}),
		}),
		{
			shape: singleShape('bill'),
			log: (parsed, result) => ({
				billId: parsed.bill_id,
				status: result.bill.status ?? undefined,
			}),
		},
	);
