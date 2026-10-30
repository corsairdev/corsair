import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { accountPath, mailtrapCall } from './shared';
import type {
	MailtrapBillingUsage,
	MailtrapPermissionResource,
	MailtrapUser,
} from './types';

/**
 * Lists every Mailtrap account the token can reach.
 *
 * The one operation in this catalog that needs no account id — it is how an
 * account id gets discovered in the first place (see `client.ts`).
 */
export const listAccounts: MailtrapEndpoints['accountListAccounts'] = async (
	ctx,
) => {
	const result = await mailtrapCall<MailtrapUser[]>(ctx, '/api/accounts');

	await logEventFromContext(
		ctx,
		'mailtrap.account.listAccounts',
		{},
		'completed',
	);
	return result ?? [];
};

/**
 * Gets every resource (inboxes, projects, domains, billing, the account
 * itself) the token has admin access to, nested by hierarchy.
 *
 * Confirmed live to 403 "Unavailable on your plan" on a free-tier account —
 * a real, correctly-routed operation that simply cannot be exercised past
 * auth without a paid plan, same treatment as Botpress's
 * `billing.chargeUnpaidInvoices`.
 */
export const getPermissionResources: MailtrapEndpoints['accountGetPermissionResources'] =
	async (ctx) => {
		const path = await accountPath(ctx, '/account_accesses');
		const result = await mailtrapCall<MailtrapPermissionResource[]>(ctx, path);

		await logEventFromContext(
			ctx,
			'mailtrap.account.getPermissionResources',
			{},
			'completed',
		);
		return result ?? [];
	};

/** Gets the account's usage against its testing/sending/marketing plan limits. */
export const getBillingUsage: MailtrapEndpoints['accountGetBillingUsage'] =
	async (ctx) => {
		const path = await accountPath(ctx, '/billing/usage');
		const result = await mailtrapCall<MailtrapBillingUsage>(ctx, path);

		await logEventFromContext(
			ctx,
			'mailtrap.account.getBillingUsage',
			{},
			'completed',
		);
		return result;
	};
