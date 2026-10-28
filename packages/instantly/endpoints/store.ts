import type { InstantlyContext } from '..';
import type {
	InstantlyAccount,
	InstantlyCampaign,
	InstantlyEmail,
	InstantlyLead,
} from './types';

// A failed local write never fails the API call it follows: the Instantly
// side already happened. Rows are written concurrently and failures are
// counted into one warning. `ctx.db` is optional chained because endpoint
// unit tests call endpoints with a bare `{ key }` context.

type Partially<T> = Partial<T> & Record<string, unknown>;

async function saveAll<T>(
	label: string,
	rows: readonly T[],
	write: (row: T) => Promise<unknown> | undefined,
): Promise<void> {
	const results = await Promise.allSettled(rows.map(async (row) => write(row)));
	const failed = results.filter((result) => result.status === 'rejected');
	if (failed.length > 0) {
		console.warn(
			`Failed to save ${failed.length} of ${rows.length} Instantly ${label}:`,
			failed[0]?.status === 'rejected' ? failed[0].reason : undefined,
		);
	}
}

export async function saveAccounts(
	ctx: InstantlyContext,
	accounts: readonly Partially<InstantlyAccount>[],
): Promise<void> {
	const store = ctx.db?.accounts;
	if (!store) return;
	await saveAll('accounts', accounts, (account) =>
		account.email
			? store.upsertByEntityId(account.email, {
					...account,
					id: account.email,
					email: account.email,
				})
			: undefined,
	);
}

export async function saveCampaigns(
	ctx: InstantlyContext,
	campaigns: readonly Partially<InstantlyCampaign>[],
): Promise<void> {
	const store = ctx.db?.campaigns;
	if (!store) return;
	await saveAll('campaigns', campaigns, (campaign) =>
		campaign.id
			? store.upsertByEntityId(campaign.id, { ...campaign, id: campaign.id })
			: undefined,
	);
}

export async function saveLeads(
	ctx: InstantlyContext,
	leads: readonly Partially<InstantlyLead>[],
): Promise<void> {
	const store = ctx.db?.leads;
	if (!store) return;
	await saveAll('leads', leads, (lead) =>
		lead.id
			? store.upsertByEntityId(lead.id, { ...lead, id: lead.id })
			: undefined,
	);
}

export async function forgetLead(
	ctx: InstantlyContext,
	id: string,
): Promise<void> {
	const store = ctx.db?.leads;
	if (!store) return;
	await saveAll('leads', [id], (leadId) => store.deleteByEntityId(leadId));
}

export async function saveEmails(
	ctx: InstantlyContext,
	emails: readonly Partially<InstantlyEmail>[],
): Promise<void> {
	const store = ctx.db?.emails;
	if (!store) return;
	await saveAll('emails', emails, (email) =>
		email.id
			? store.upsertByEntityId(email.id, { ...email, id: email.id })
			: undefined,
	);
}
