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

	// Validate and normalize the whole batch before writing anything. Trim the
	// name once and use the trimmed value for both lookup and write, so " slack"
	// and "slack" can't upsert into two rows for the same integration.
	const normalized = integrations.map((row) => {
		const name = row?.name?.trim();
		const dek = row?.dek?.trim();
		if (!name || !dek) {
			throw new CredentialsMigrateDeliveryError(
				'invalid_payload',
				'Each migrated integration requires a non-empty "name" and "dek"',
			);
		}
		const config = row.config;
		if (
			typeof config !== 'object' ||
			config === null ||
			Array.isArray(config)
		) {
			throw new CredentialsMigrateDeliveryError(
				'invalid_payload',
				`Integration "${name}" config must be an object`,
			);
		}
		return { name, dek, config };
	});

	const { db } = internal.database;

	await db.transaction().execute(async (trx) => {
		for (const row of normalized) {
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

	return { migrated: normalized.length };
}
