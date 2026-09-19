import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactQuery } from './shared';
import type { BotpressEndpointOutputs } from './types';

/** Lists invoices billed to a workspace. */
export const listInvoices: BotpressEndpoints['billingListInvoices'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		invoices: BotpressEndpointOutputs['billingListInvoices'];
	}>(
		ctx,
		`/v1/admin/workspaces/${encodeURIComponent(input.workspaceId)}/billing/invoices`,
	);

	await logEventFromContext(
		ctx,
		'botpress.billing.listInvoices',
		auditPayload(input, ['workspaceId']),
		'completed',
	);
	return result.invoices ?? [];
};

/** Previews the upcoming invoice for a workspace before it is billed. */
export const getUpcomingInvoice: BotpressEndpoints['billingGetUpcomingInvoice'] =
	async (ctx, input) => {
		const result = await botpressCall<
			BotpressEndpointOutputs['billingGetUpcomingInvoice']
		>(
			ctx,
			`/v1/admin/workspaces/${encodeURIComponent(input.workspaceId)}/billing/upcoming-invoice`,
		);

		await logEventFromContext(
			ctx,
			'botpress.billing.getUpcomingInvoice',
			auditPayload(input, ['workspaceId']),
			'completed',
		);
		return result;
	};

/**
 * Charges outstanding invoices for a workspace.
 *
 * A real financial action — see `error-handlers.ts` (`isNonIdempotent`).
 * Verified structurally (request shape, auth, error handling) rather than by
 * actually charging anything against a live account with a real payment
 * method.
 */
export const chargeUnpaidInvoices: BotpressEndpoints['billingChargeUnpaidInvoices'] =
	async (ctx, input) => {
		const result = await botpressCall<
			BotpressEndpointOutputs['billingChargeUnpaidInvoices']
		>(
			ctx,
			`/v1/admin/workspaces/${encodeURIComponent(input.workspaceId)}/billing/invoices/charge-unpaid`,
			{ method: 'POST', body: { invoiceIds: input.invoiceIds } },
		);

		await logEventFromContext(
			ctx,
			'botpress.billing.chargeUnpaidInvoices',
			{
				...auditPayload(input, ['workspaceId']),
				invoiceCount: input.invoiceIds.length,
			},
			'completed',
		);
		return result;
	};

/** Lists usage history for a workspace or bot id against a quota type. */
export const listUsageHistory: BotpressEndpoints['billingListUsageHistory'] =
	async (ctx, input) => {
		const result = await botpressCall<{
			usages: BotpressEndpointOutputs['billingListUsageHistory'];
		}>(ctx, `/v1/admin/usages/${encodeURIComponent(input.id)}/history`, {
			method: 'GET',
			query: compactQuery({ type: input.type }),
		});

		await logEventFromContext(
			ctx,
			'botpress.billing.listUsageHistory',
			auditPayload(input, ['id', 'type']),
			'completed',
		);
		return result.usages ?? [];
	};
