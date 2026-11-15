import type { InboxkitContext } from '..';

// Rows are built field by field, never spread from what came back, so a credential
// in a response or webhook can't reach the local database. A row is merged into
// what is already saved, because a status webhook carries fewer fields than a list.
// A failed local write never fails the call or delivery it follows: this is only a
// local copy, the InboxKit side already happened, and the next list corrects it.
// `ctx.db` is optional chained because endpoint unit tests use a bare context.

type Row = {
	uid?: string | null;
	// unknown: API rows carry more fields than are stored; those read are checked.
	[field: string]: unknown;
};

// unknown: one field of an API row. Each helper below checks its type before use,
// and keeps null, so a list can clear a value. undefined means "not in this row".
const text = (value: unknown) =>
	typeof value === 'string' ? value : value === null ? null : undefined;
// unknown: as above.
const count = (value: unknown) =>
	typeof value === 'number' ? value : value === null ? null : undefined;
// unknown: as above.
const flag = (value: unknown) =>
	typeof value === 'boolean' ? value : value === null ? null : undefined;

async function saveAll<T>(
	label: string,
	rows: readonly T[],
	// unknown: only whether the write settled matters, not what it returned.
	write: (row: T) => Promise<unknown> | undefined,
): Promise<void> {
	const results = await Promise.allSettled(rows.map(async (row) => write(row)));
	const failed = results.filter((result) => result.status === 'rejected');
	if (failed.length === 0) return;
	const reason =
		failed[0]?.status === 'rejected' ? failed[0].reason : undefined;
	console.warn(
		`Failed to save ${failed.length} of ${rows.length} InboxKit ${label}:`,
		reason,
	);
}

/** Overlays the fields this row has on what is saved. */
async function merge<TData extends { id: string }>(
	store: {
		findByEntityId: (id: string) => Promise<{ data: TData } | null>;
		// unknown: only whether the write settled matters.
		upsertByEntityId: (id: string, data: TData) => Promise<unknown>;
	},
	fields: TData,
) {
	const existing = await store.findByEntityId(fields.id);
	const present = Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
	return store.upsertByEntityId(fields.id, {
		...existing?.data,
		...present,
	} as TData);
}

export async function saveWorkspaces(
	ctx: InboxkitContext,
	workspaces: readonly Row[],
): Promise<void> {
	const store = ctx.db?.workspaces;
	if (!store) return;
	await saveAll('workspaces', workspaces, (row) =>
		row.uid
			? merge(store, {
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
			? merge(store, {
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
		return merge(store, {
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
