import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['salesList'] = (ctx, input) =>
	call(ctx, 'salesList', 'sales.list', '/sales', input, {
		toQuery: (parsed) => ({
			after: parsed.after,
			before: parsed.before,
			product_id: parsed.product_id,
			email: parsed.email,
			order_id: parsed.order_id,
			name: parsed.name,
			license_key: parsed.license_key,
			page_key: parsed.page_key,
		}),
	});

export const get: GumroadEndpoints['salesGet'] = (ctx, input) =>
	call(
		ctx,
		'salesGet',
		'sales.get',
		`/sales/${encodeURIComponent(input.id)}`,
		input,
	);

export const markAsShipped: GumroadEndpoints['salesMarkAsShipped'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'salesMarkAsShipped',
		'sales.markAsShipped',
		`/sales/${encodeURIComponent(input.id)}/mark_as_shipped`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) => formEntries({ tracking_url: parsed.tracking_url }),
		},
	);

export const refund: GumroadEndpoints['salesRefund'] = (ctx, input) =>
	call(
		ctx,
		'salesRefund',
		'sales.refund',
		`/sales/${encodeURIComponent(input.id)}/refund`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) => formEntries({ amount_cents: parsed.amount_cents }),
		},
	);

export const revokeAccess: GumroadEndpoints['salesRevokeAccess'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'salesRevokeAccess',
		'sales.revokeAccess',
		`/sales/${encodeURIComponent(input.id)}/revoke_access`,
		input,
		{ method: 'PUT' },
	);

export const undoRevokeAccess: GumroadEndpoints['salesUndoRevokeAccess'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'salesUndoRevokeAccess',
		'sales.undoRevokeAccess',
		`/sales/${encodeURIComponent(input.id)}/undo_revoke_access`,
		input,
		{ method: 'PUT' },
	);

export const resendReceipt: GumroadEndpoints['salesResendReceipt'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'salesResendReceipt',
		'sales.resendReceipt',
		`/sales/${encodeURIComponent(input.id)}/resend_receipt`,
		input,
		{ method: 'POST' },
	);
