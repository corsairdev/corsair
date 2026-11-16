import type { Kysely, Selectable } from 'kysely';
import type {
	CorsairDatabase,
	CorsairKyselyDatabase,
} from '../db/kysely/database';
import {
	decryptConfig,
	decryptDEK,
	encryptConfig,
	encryptDEK,
	generateDEK,
} from './auth/encryption';
import { generateUUID } from './utils';

export type AccountConfig = Selectable<
	CorsairKyselyDatabase['corsair_accounts']
>['config'];

export type AccountLookupInput = {
	database: CorsairDatabase;
	integrationName: string;
	tenantId: string;
	ensureProvisioned?: () => Promise<void>;
	/** Strict selection by ref (2+ accounts and no ref throws). Absent = oldest. */
	account?: { ref?: string; kek: string };
};

export type IntegrationAccountRow = {
	id: string;
	config: AccountConfig;
	dek: string | null;
};

export type IntegrationAccountLookupResult = {
	integrationId: string;
	accountId: string;
	integration: IntegrationAccountRow;
	account: IntegrationAccountRow;
};

// The one ordering that defines "oldest" account.
function orderedAccountsQuery(
	db: Kysely<CorsairKyselyDatabase>,
	where: { tenantId: string; integrationId: string },
) {
	return db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', where.tenantId)
		.where('integration_id', '=', where.integrationId)
		.orderBy('created_at', 'asc')
		.orderBy('id', 'asc');
}

export async function findAccountRow(
	db: Kysely<CorsairKyselyDatabase>,
	where: { tenantId: string; integrationId: string },
): Promise<Selectable<CorsairKyselyDatabase['corsair_accounts']> | undefined> {
	return orderedAccountsQuery(db, where).executeTakeFirst();
}

export async function resolveIntegrationAndAccount(
	input: AccountLookupInput,
): Promise<IntegrationAccountLookupResult> {
	let provisionAttempted = false;

	while (true) {
		const integration = await input.database.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', input.integrationName)
			.executeTakeFirst();

		if (!integration) {
			if (!provisionAttempted && input.ensureProvisioned) {
				provisionAttempted = true;
				await input.ensureProvisioned();
				continue;
			}

			throw new Error(
				`Integration "${input.integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		const where = {
			tenantId: input.tenantId,
			integrationId: integration.id,
		};
		const account = input.account
			? await resolveAccount({
					db: input.database.db,
					kek: input.account.kek,
					...where,
					ref: input.account.ref,
				})
			: await findAccountRow(input.database.db, where);

		if (!account) {
			if (!provisionAttempted && input.ensureProvisioned) {
				provisionAttempted = true;
				await input.ensureProvisioned();
				continue;
			}

			throw new Error(
				`Account not found for tenant "${input.tenantId}" and integration "${input.integrationName}". Make sure to create the account first.`,
			);
		}

		return {
			integrationId: integration.id,
			accountId: account.id,
			integration: {
				id: integration.id,
				config: integration.config,
				dek: integration.dek ?? null,
			},
			account: {
				id: account.id,
				config: account.config,
				dek: account.dek ?? null,
			},
		};
	}
}

export async function resolveIntegrationAccountIds(
	input: AccountLookupInput,
): Promise<{ integrationId: string; accountId: string }> {
	const { integrationId, accountId } =
		await resolveIntegrationAndAccount(input);

	return { integrationId, accountId };
}

export type Account = {
	id: string;
	ref?: string;
	label?: string;
	config: AccountConfig;
	dek: string | null;
};

type AccountIdentityScope = {
	db: Kysely<CorsairKyselyDatabase>;
	kek: string;
	integrationId: string;
	tenantId: string;
};

type AccountIdentity = { id: string; label?: string };
export type AccountSummary = { id: string; ref?: string; label?: string };

export class AccountSelectionError extends Error {
	code: 'account_required' | 'account_not_found' | 'account_limit';
	accounts: AccountSummary[];

	constructor(
		code: AccountSelectionError['code'],
		message: string,
		accounts: AccountSelectionError['accounts'] = [],
	) {
		super(message);
		this.name = 'AccountSelectionError';
		this.code = code;
		this.accounts = accounts;
	}
}

function parseConfig(config: AccountConfig): Record<string, string> {
	if (typeof config === 'string') {
		try {
			return JSON.parse(config);
		} catch {
			return {};
		}
	}
	return (config as Record<string, string> | null) ?? {};
}

const toAccount = (r: {
	id: string;
	config: AccountConfig;
	dek?: string | null;
}): Account => ({ id: r.id, config: r.config, dek: r.dek ?? null });

export async function readIdentity(
	row: { config: AccountConfig; dek?: string | null },
	kek: string,
): Promise<{ ref?: string; label?: string }> {
	const config = parseConfig(row.config);
	if (!row.dek || !config?.account_ref) return {};
	try {
		const plain = decryptConfig(config, await decryptDEK(row.dek, kek));
		return { ref: plain.account_ref, label: plain.account_label };
	} catch {
		return {};
	}
}

const withIdentity = (
	rows: { id: string; config: AccountConfig; dek?: string | null }[],
	kek: string,
): Promise<Account[]> =>
	Promise.all(
		rows.map(async (r) => ({
			...toAccount(r),
			...(await readIdentity(r, kek)),
		})),
	);

export async function listAccounts(
	i: AccountIdentityScope,
): Promise<Account[]> {
	return withIdentity(await orderedAccountsQuery(i.db, i).execute(), i.kek);
}

const displayName = (a: AccountSummary) => a.label ?? a.ref ?? a.id;
const summarize = ({ id, ref, label }: AccountSummary): AccountSummary => ({
	id,
	ref,
	label,
});

/**
 * Account ids of a tenant's plugin, oldest first. Labels (which cost a
 * decrypt) are returned only when there are 2+ accounts to tell apart.
 */
export async function fanOutAccounts(i: {
	db: Kysely<CorsairKyselyDatabase>;
	kek: string;
	integrationName: string;
	tenantId: string;
}): Promise<{ id: string; label?: string }[]> {
	const integration = await i.db
		.selectFrom('corsair_integrations')
		.select('id')
		.where('name', '=', i.integrationName)
		.executeTakeFirst();
	if (!integration) return [];
	const ids = await i.db
		.selectFrom('corsair_accounts')
		.select('id')
		.where('tenant_id', '=', i.tenantId)
		.where('integration_id', '=', integration.id)
		.execute();
	if (ids.length < 2) return ids;
	const list = await listAccounts({
		db: i.db,
		kek: i.kek,
		integrationId: integration.id,
		tenantId: i.tenantId,
	});
	return list.map((a) => ({ id: a.id, label: a.label ?? a.ref }));
}

/** A tenant's accounts for a plugin, oldest first. Identity only, never credentials. */
export async function listAccountSummaries(i: {
	db: Kysely<CorsairKyselyDatabase>;
	kek: string;
	integrationName: string;
	tenantId: string;
}): Promise<AccountSummary[]> {
	const integration = await i.db
		.selectFrom('corsair_integrations')
		.select('id')
		.where('name', '=', i.integrationName)
		.executeTakeFirst();
	if (!integration) return [];
	const accounts = await listAccounts({
		db: i.db,
		kek: i.kek,
		integrationId: integration.id,
		tenantId: i.tenantId,
	});
	return accounts.map(summarize);
}

async function integrationName(
	db: Kysely<CorsairKyselyDatabase>,
	integrationId: string,
): Promise<string> {
	const row = await db
		.selectFrom('corsair_integrations')
		.select('name')
		.where('id', '=', integrationId)
		.executeTakeFirst();
	return row?.name ?? integrationId;
}

export async function resolveAccount(
	i: AccountIdentityScope & { ref?: string },
): Promise<Account | undefined> {
	const rows = await orderedAccountsQuery(i.db, i).execute();
	if (rows.length === 0) return undefined;
	if (!i.ref && rows.length === 1) return toAccount(rows[0]!);

	const byId = i.ref ? rows.find((r) => r.id === i.ref) : undefined;
	if (byId) return toAccount(byId);

	const accounts = await withIdentity(rows, i.kek);
	const wanted = i.ref?.toLowerCase();
	const exact = i.ref ? accounts.find((a) => a.ref === i.ref) : undefined;
	if (exact) return exact;
	const byLabel = i.ref
		? accounts.filter((a) => a.label?.toLowerCase() === wanted)
		: [];
	if (byLabel.length === 1) return byLabel[0];

	const name = await integrationName(i.db, i.integrationId);
	if (byLabel.length > 1) {
		throw new AccountSelectionError(
			'account_required',
			`Label "${i.ref}" matches ${byLabel.length} accounts for "${name}" (tenant "${i.tenantId}"): ${byLabel.map((a) => a.ref ?? a.id).join(', ')}. Name one by its id.`,
			byLabel.map(summarize),
		);
	}
	const names = accounts.map(displayName).join(', ');
	const summary = accounts.map(summarize);
	if (!i.ref) {
		throw new AccountSelectionError(
			'account_required',
			`Plugin "${name}" has ${accounts.length} accounts for tenant "${i.tenantId}": ${names}. Name one with withTenant(tenantId, { accounts: { ${name}: "<account>" } }).`,
			summary,
		);
	}
	throw new AccountSelectionError(
		'account_not_found',
		`No account "${i.ref}" for "${name}" (tenant "${i.tenantId}"). Accounts: ${names}.`,
		summary,
	);
}

export const MAX_ACCOUNTS_PER_INTEGRATION = 5;

export async function upsertAccount(i: {
	database: CorsairDatabase;
	kek: string;
	integrationName: string;
	tenantId: string;
	identity?: AccountIdentity;
	/** Off: one account per tenant and plugin; a new identity replaces it. */
	allowMany: boolean;
}): Promise<{ accountId: string; created: boolean }> {
	const { database, kek, tenantId, identity } = i;
	return database.db.transaction().execute(async (trx) => {
		// Lock the integration row before the check-then-insert so this
		// cannot interleave with a concurrent disconnect (or another connect).
		let integrationQuery = trx
			.selectFrom('corsair_integrations')
			.select(['id'])
			.where('name', '=', i.integrationName);
		if (database.isPg === true) integrationQuery = integrationQuery.forUpdate();
		const integration = await integrationQuery.executeTakeFirst();
		if (!integration) {
			throw new Error(
				`Integration '${i.integrationName}' not found. Run setupCorsair first.`,
			);
		}

		const rows = await orderedAccountsQuery(trx, {
			tenantId,
			integrationId: integration.id,
		}).execute();

		if (!identity) {
			if (rows[0]) return { accountId: rows[0].id, created: false };
			return insertRow(trx, integration.id, tenantId, kek);
		}

		const known = await Promise.all(
			rows.map(async (r) => ({ row: r, ...(await readIdentity(r, kek)) })),
		);
		const same = known.find((k) => k.ref === identity.id);
		const target =
			same ?? known.find((k) => !k.ref) ?? (i.allowMany ? undefined : known[0]);
		if (target) {
			if (!same || (identity.label && target.label !== identity.label)) {
				// Another known identity taking the row starts it clean: its old
				// tokens belong to the account being replaced.
				const replacing = !same && target.ref !== undefined;
				await writeIdentity(trx, target.row, identity, kek, replacing);
			}
			return { accountId: target.row.id, created: false };
		}

		if (rows.length >= MAX_ACCOUNTS_PER_INTEGRATION) {
			throw new AccountSelectionError(
				'account_limit',
				`Account limit reached: tenant "${tenantId}" already has ${rows.length} accounts for "${i.integrationName}".`,
				known.map(({ row, ref, label }) =>
					summarize({ id: row.id, ref, label }),
				),
			);
		}
		return insertRow(trx, integration.id, tenantId, kek, identity);
	});
}

async function sealIdentity(
	dek: string,
	existing: Record<string, string>,
	identity: AccountIdentity,
) {
	const { account_label: _stale, ...kept } = existing;
	return encryptConfig(
		{
			...kept,
			account_ref: identity.id,
			...(identity.label ? { account_label: identity.label } : {}),
		},
		dek,
	);
}

async function writeIdentity(
	trx: Kysely<CorsairKyselyDatabase>,
	row: { id: string; config: AccountConfig; dek?: string | null },
	identity: AccountIdentity,
	kek: string,
	fresh = false,
) {
	const dek = row.dek ? await decryptDEK(row.dek, kek) : generateDEK();
	const stored = parseConfig(row.config);
	// A null-DEK row's config was never sealed, so its values are plaintext.
	const existing = fresh ? {} : row.dek ? decryptConfig(stored, dek) : stored;
	await trx
		.updateTable('corsair_accounts')
		.set({
			config: await sealIdentity(dek, existing, identity),
			dek: row.dek ?? (await encryptDEK(dek, kek)),
			updated_at: new Date(),
		})
		.where('id', '=', row.id)
		.execute();
}

async function insertRow(
	trx: Kysely<CorsairKyselyDatabase>,
	integrationId: string,
	tenantId: string,
	kek: string,
	identity?: AccountIdentity,
) {
	const dek = generateDEK();
	const now = new Date();
	const id = generateUUID();
	await trx
		.insertInto('corsair_accounts')
		.values({
			id,
			created_at: now,
			updated_at: now,
			tenant_id: tenantId,
			integration_id: integrationId,
			config: identity ? await sealIdentity(dek, {}, identity) : {},
			dek: await encryptDEK(dek, kek),
		})
		.execute();
	return { accountId: id, created: true };
}
