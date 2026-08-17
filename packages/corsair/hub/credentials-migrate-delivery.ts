import { randomUUID } from 'node:crypto';
import type { MigratedIntegration } from '../core/auth/rewrap-integration';
import { getCorsairInternal } from '../core/utils/corsair-instance';

export type CredentialsMigrateDeliveryErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'invalid_payload';

export class CredentialsMigrateDeliveryError extends Error {
	readonly code: CredentialsMigrateDeliveryErrorCode;

	constructor(code: CredentialsMigrateDeliveryErrorCode, message: string) {
		super(message);
		this.name = 'CredentialsMigrateDeliveryError';
		this.code = code;
	}
}

export type ProcessCredentialsMigrateDeliveryOptions = {
	integrations: MigratedIntegration[];
};

export type ProcessCredentialsMigrateDeliveryResult = {
	migrated: number;
};

/**
 * Store integration rows delivered from a developer's `npx corsair prod`
 * migration. The rows arrive already sealed — the `dek` re-wrapped for this
 * app's (prod) KEK and the `config` ciphertext untouched — so this writes them
 * verbatim and never decrypts anything. The whole batch is upserted in one
 * transaction so a partial or malformed delivery cannot leave prod half-migrated.
 */
export async function processCredentialsMigrateDelivery(
	corsair: unknown,
	options: ProcessCredentialsMigrateDeliveryOptions,
): Promise<ProcessCredentialsMigrateDeliveryResult> {
	const internal = getCorsairInternal(
		corsair,
		() =>
			new CredentialsMigrateDeliveryError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	if (!internal.database) {
		throw new CredentialsMigrateDeliveryError(
			'no_database',
			'Database not configured',
		);
	}

	const integrations = options?.integrations;
	if (!Array.isArray(integrations)) {
		throw new CredentialsMigrateDeliveryError(
			'invalid_payload',
			'credentials.migrate payload requires an "integrations" array',
		);
	}

	// Validate the whole batch before writing anything.
	for (const row of integrations) {
		if (!row?.name?.trim() || !row?.dek?.trim()) {
			throw new CredentialsMigrateDeliveryError(
				'invalid_payload',
				'Each migrated integration requires a non-empty "name" and "dek"',
			);
		}
	}

	const { db } = internal.database;

	// ponytail: select-then-insert per name, matching the existing setup path
	// (core/auth/key-manager + setup). corsair_integrations has no UNIQUE(name),
	// so two migrations racing the same name could double-insert. Migrations are
	// developer-initiated and serial, so this is fine; if that ever changes, add
	// UNIQUE(name) + onConflict.
	await db.transaction().execute(async (trx) => {
		for (const row of integrations) {
			const now = new Date();
			const existing = await trx
				.selectFrom('corsair_integrations')
				.select('id')
				.where('name', '=', row.name)
				.executeTakeFirst();

			if (existing) {
				await trx
					.updateTable('corsair_integrations')
					.set({ config: row.config, dek: row.dek, updated_at: now })
					.where('id', '=', existing.id)
					.execute();
			} else {
				await trx
					.insertInto('corsair_integrations')
					.values({
						id: randomUUID(),
						name: row.name,
						config: row.config,
						dek: row.dek,
						created_at: now,
						updated_at: now,
					})
					.execute();
			}
		}
	});

	return { migrated: integrations.length };
}
