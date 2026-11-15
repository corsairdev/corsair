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

export type AccountLookupInput = {
	database: CorsairDatabase;
	integrationName: string;
	tenantId: string;
	ensureProvisioned?: () => Promise<void>;
};

export type IntegrationAccountRow = {
	id: string;
	config: unknown;
	dek: string | null;
};

export type IntegrationAccountLookupResult = {
	integrationId: string;
	accountId: string;
	integration: IntegrationAccountRow;
	account: IntegrationAccountRow;
};

export async function findAccountRow(
	db: Kysely<CorsairKyselyDatabase>,
	where: { tenantId: string; integrationId: string },
): Promise<Selectable<CorsairKyselyDatabase['corsair_accounts']> | undefined> {
	return db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', where.tenantId)
		.where('integration_id', '=', where.integrationId)
		.orderBy('created_at', 'asc')
		.orderBy('id', 'asc')
		.executeTakeFirst();
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

		const account = await findAccountRow(input.database.db, {
			tenantId: input.tenantId,
			integrationId: integration.id,
		});

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
	config: unknown;
	dek: string | null;
};

type AccountIdentityScope = {
	db: Kysely<CorsairKyselyDatabase>;
	kek: string;
	integrationId: string;
	tenantId: string;
};

export class AccountSelectionError extends Error {
	code: 'account_required' | 'account_not_found' | 'account_limit';
	accounts: { id: string; ref?: string; label?: string }[];

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

function parseConfig(config: unknown): Record<string, string> {
	if (typeof config === 'string') {
		try {
			return JSON.parse(config);
		} catch {
			return {};
		}
	}
	return (config as Record<string, string> | null) ?? {};
}

async function readIdentity(
	row: { config: unknown; dek?: string | null },
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

export async function listAccounts(
	i: AccountIdentityScope,
): Promise<Account[]> {
	const rows = await i.db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', i.tenantId)
		.where('integration_id', '=', i.integrationId)
		.orderBy('created_at', 'asc')
		.orderBy('id', 'asc')
		.execute();
	return Promise.all(
		rows.map(async (r) => ({
			id: r.id,
			config: r.config,
			dek: r.dek ?? null,
			...(await readIdentity(r, i.kek)),
		})),
	);
}

const displayName = (a: { id: string; ref?: string; label?: string }) =>
	a.label ?? a.ref ?? a.id;

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
	const rows = await i.db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', i.tenantId)
		.where('integration_id', '=', i.integrationId)
		.orderBy('created_at', 'asc')
		.orderBy('id', 'asc')
		.execute();
	const plain = (r: (typeof rows)[number]): Account => ({
		id: r.id,
		config: r.config,
		dek: r.dek ?? null,
	});
	if (rows.length === 0) return undefined;
	if (!i.ref && rows.length === 1) return plain(rows[0]!);

	const byId = i.ref ? rows.find((r) => r.id === i.ref) : undefined;
	if (byId) return plain(byId);

	const accounts = await Promise.all(
		rows.map(async (r) => ({ ...plain(r), ...(await readIdentity(r, i.kek)) })),
	);
	const wanted = i.ref?.toLowerCase();
	const match = i.ref
		? (accounts.find((a) => a.ref === i.ref) ??
			accounts.find((a) => a.label?.toLowerCase() === wanted))
		: undefined;
	if (match) return match;

	const name = await integrationName(i.db, i.integrationId);
	const names = accounts.map(displayName).join(', ');
	const summary = accounts.map(({ id, ref, label }) => ({ id, ref, label }));
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
	identity?: { id: string; label?: string };
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

		const rows = await trx
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', tenantId)
			.where('integration_id', '=', integration.id)
			.orderBy('created_at', 'asc')
			.orderBy('id', 'asc')
			.execute();

		if (!identity) {
			if (rows[0]) return { accountId: rows[0].id, created: false };
			return insertRow(trx, integration.id, tenantId, kek);
		}

		const known = await Promise.all(
			rows.map(async (r) => ({ row: r, ...(await readIdentity(r, kek)) })),
		);
		const same = known.find((k) => k.ref === identity.id);
		const target = same ?? known.find((k) => !k.ref);
		if (target) {
			if (!same || target.label !== identity.label) {
				await writeIdentity(trx, target.row, identity, kek);
			}
			return { accountId: target.row.id, created: false };
		}

		if (rows.length >= MAX_ACCOUNTS_PER_INTEGRATION) {
			throw new AccountSelectionError(
				'account_limit',
				`Account limit reached: tenant "${tenantId}" already has ${rows.length} accounts for "${i.integrationName}".`,
				known.map(({ row, ref, label }) => ({ id: row.id, ref, label })),
			);
		}
		return insertRow(trx, integration.id, tenantId, kek, identity);
	});
}

async function sealIdentity(
	dek: string,
	existing: Record<string, string>,
	identity: { id: string; label?: string },
) {
	const { account_label: _drop, ...rest } = existing;
	return encryptConfig(
		{
			...rest,
			account_ref: identity.id,
			...(identity.label ? { account_label: identity.label } : {}),
		},
		dek,
	);
}

async function writeIdentity(
	trx: Kysely<CorsairKyselyDatabase>,
	row: { id: string; config: unknown; dek?: string | null },
	identity: { id: string; label?: string },
	kek: string,
) {
	const dek = row.dek ? await decryptDEK(row.dek, kek) : generateDEK();
	const stored = parseConfig(row.config);
	const existing =
		row.dek && Object.keys(stored).length > 0 ? decryptConfig(stored, dek) : {};
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
	identity?: { id: string; label?: string },
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
