import type { InstantlyContext } from '..';
import type {
	InstantlyAccount,
	InstantlyCampaign,
	InstantlyEmail,
	InstantlyLead,
} from './types';

// A failed local write never fails the API call it follows: the Instantly
// side already happened. `ctx.db` is optional chained because endpoint unit
// tests call endpoints with a bare `{ key }` context.

type Partially<T> = Partial<T> & Record<string, unknown>;

export async function saveAccounts(
	ctx: InstantlyContext,
	accounts: readonly Partially<InstantlyAccount>[],
): Promise<void> {
	const store = ctx.db?.accounts;
	if (!store) return;
	for (const account of accounts) {
		if (!account.email) continue;
		try {
			await store.upsertByEntityId(account.email, {
				...account,
				id: account.email,
				email: account.email,
			});
		} catch (error) {
			console.warn('Failed to save Instantly account:', error);
		}
	}
}

export async function saveCampaigns(
	ctx: InstantlyContext,
	campaigns: readonly Partially<InstantlyCampaign>[],
): Promise<void> {
	const store = ctx.db?.campaigns;
	if (!store) return;
	for (const campaign of campaigns) {
		if (!campaign.id) continue;
		try {
			await store.upsertByEntityId(campaign.id, {
				...campaign,
				id: campaign.id,
			});
		} catch (error) {
			console.warn('Failed to save Instantly campaign:', error);
		}
	}
}

export async function saveLeads(
	ctx: InstantlyContext,
	leads: readonly Partially<InstantlyLead>[],
): Promise<void> {
	const store = ctx.db?.leads;
	if (!store) return;
	for (const lead of leads) {
		if (!lead.id) continue;
		try {
			await store.upsertByEntityId(lead.id, { ...lead, id: lead.id });
		} catch (error) {
			console.warn('Failed to save Instantly lead:', error);
		}
	}
}

export async function forgetLead(
	ctx: InstantlyContext,
	id: string,
): Promise<void> {
	try {
		await ctx.db?.leads?.deleteByEntityId(id);
	} catch (error) {
		console.warn('Failed to remove deleted Instantly lead:', error);
	}
}

export async function saveEmails(
	ctx: InstantlyContext,
	emails: readonly Partially<InstantlyEmail>[],
): Promise<void> {
	const store = ctx.db?.emails;
	if (!store) return;
	for (const email of emails) {
		if (!email.id) continue;
		try {
			await store.upsertByEntityId(email.id, { ...email, id: email.id });
		} catch (error) {
			console.warn('Failed to save Instantly email:', error);
		}
	}
}
