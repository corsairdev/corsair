import type { InboxkitContext } from '..';

// A failed local write never fails the API call it follows: the InboxKit side
// already happened. Rows are built field by field, never spread from what came
// back, so a credential in a response or webhook can't reach the local database.
// `ctx.db` is optional chained because endpoint unit tests use a bare context.

type Row = {
	uid?: string | null;
	// unknown: API rows carry more fields than are stored; those read are checked.
	[field: string]: unknown;
};

// unknown: one field of an API row; each helper below checks its type before use.
const text = (value: unknown) =>
	typeof value === 'string' ? value : undefined;
// unknown: as above.
const count = (value: unknown) =>
	typeof value === 'number' ? value : undefined;
// unknown: as above.
const flag = (value: unknown) =>
	typeof value === 'boolean' ? value : undefined;

async function saveAll<T>(
	label: string,
	rows: readonly T[],
	// unknown: only whether the write settled matters, not what it returned.
	write: (row: T) => Promise<unknown> | undefined,
): Promise<void> {
	const results = await Promise.allSettled(rows.map(async (row) => write(row)));
	const failed = results.filter((result) => result.status === 'rejected');
	if (failed.length > 0) {
		console.warn(
			`Failed to save ${failed.length} of ${rows.length} InboxKit ${label}:`,
			failed[0]?.status === 'rejected' ? failed[0].reason : undefined,
		);
	}
}

export async function saveWorkspaces(
	ctx: InboxkitContext,
	workspaces: readonly Row[],
): Promise<void> {
	const store = ctx.db?.workspaces;
	if (!store) return;
	await saveAll('workspaces', workspaces, (row) =>
		row.uid
			? store.upsertByEntityId(row.uid, {
					id: row.uid,
					name: text(row.name),
					workspace_type: text(row.workspace_type),
					domains: count(row.domains),
					created_at: text(row.created_at),
				})
			: undefined,
	);
}

export async function forgetWorkspace(
	ctx: InboxkitContext,
	uid: string,
): Promise<void> {
	await ctx.db?.workspaces?.deleteByEntityId(uid);
}

export async function saveDomains(
	ctx: InboxkitContext,
	domains: readonly Row[],
	workspaceId?: string | null,
): Promise<void> {
	const store = ctx.db?.domains;
	if (!store) return;
	await saveAll('domains', domains, (row) =>
		row.uid
			? store.upsertByEntityId(row.uid, {
					id: row.uid,
					name: text(row.name),
					status: text(row.status),
					workspace_uid: workspaceId ?? undefined,
					connection_type: text(row.connection_type),
					dns_propagation_status: text(row.dns_propagation_status),
					nameserver_match_status: text(row.nameserver_match_status),
					forwarding_url: text(row.forwarding_url),
					renewal_date: text(row.renewal_date),
					renewal_status: text(row.renewal_status),
					assigned_mailboxes: count(row.assigned_mailboxes),
				})
			: undefined,
	);
}

export async function saveMailboxes(
	ctx: InboxkitContext,
	mailboxes: readonly Row[],
	workspaceId?: string | null,
): Promise<void> {
	const store = ctx.db?.mailboxes;
	if (!store) return;
	await saveAll('mailboxes', mailboxes, (row) => {
		if (!row.uid) return undefined;
		const username = text(row.username);
		const domainName = text(row.domain_name);
		return store.upsertByEntityId(row.uid, {
			id: row.uid,
			email:
				text(row.email) ??
				(username && domainName ? `${username}@${domainName}` : undefined),
			username,
			domain_name: domainName,
			first_name: text(row.first_name),
			last_name: text(row.last_name),
			platform: text(row.platform),
			status: text(row.status),
			workspace_uid: workspaceId ?? undefined,
			is_admin: flag(row.is_admin),
			renewal_date: text(row.renewal_date),
			renewal_status: text(row.renewal_status),
			sequencer_status: text(row.sequencer_status),
			forwarding_email: text(row.forwarding_email),
		});
	});
}
