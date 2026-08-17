import { generateDEK } from '../core/auth/encryption';
import type { MigratedIntegration } from '../core/auth/rewrap-integration';
import { rewrapIntegrationRow } from '../core/auth/rewrap-integration';

/** An integration row as read from the local `corsair_integrations` table. */
export type DevIntegrationRow = {
	name: string;
	dek: string | null | undefined;
	config: Record<string, unknown>;
};

/** The opaque, prod-KEK-wrapped payload the CLI POSTs to the Hub for relay. */
export type MigrationPayload = {
	integrations: MigratedIntegration[];
};

/**
 * Generate a fresh prod master key (KEK): 256 bits, base64. Same primitive as a
 * DEK — an opaque high-entropy secret the developer sets as `CORSAIR_KEK` in prod.
 * It is generated on the developer's machine and never sent to the Hub.
 */
export function generateProdKek(): string {
	return generateDEK();
}

/**
 * Re-key every dev integration row for prod: re-wrap each DEK from the dev KEK to
 * the prod KEK, carrying the sealed `config` over untouched. No secret is
 * decrypted. Rows without a DEK have nothing encrypted to migrate and are skipped.
 */
export async function buildMigrationPayload(
	rows: DevIntegrationRow[],
	devKek: string,
	prodKek: string,
): Promise<MigrationPayload> {
	const integrations = await Promise.all(
		rows
			.filter((row) => Boolean(row.dek))
			.map((row) => rewrapIntegrationRow(row, devKek, prodKek)),
	);
	return { integrations };
}
