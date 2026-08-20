import { generateDEK } from '../core/auth/encryption';
import type { MigratedIntegration } from '../core/auth/rewrap-integration';
import { rewrapIntegrationRow } from '../core/auth/rewrap-integration';
import { hubApiPost } from './client/http';
import type { HubConfig } from './types';

/** Hub REST path that relays a migration to the caller's production environment. */
export const MIGRATE_HUB_PATH = '/credentials/migrate';

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

/** A dev row that was not migrated, with the reason, so the CLI can report it
 * instead of silently reducing the payload. */
export type SkippedIntegration = {
	name: string;
	reason: string;
};

/** Result of preparing a migration: the rows to deliver plus the ones skipped. */
export type MigrationBuild = {
	integrations: MigratedIntegration[];
	skipped: SkippedIntegration[];
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
 * decrypted. Rows without a DEK, or with no sealed config, have nothing to
 * migrate — they're skipped (and reported, never silently dropped) so a re-run
 * can't overwrite a populated prod row with an empty config.
 */
export async function buildMigrationPayload(
	rows: DevIntegrationRow[],
	devKek: string,
	prodKek: string,
): Promise<MigrationBuild> {
	const toMigrate: DevIntegrationRow[] = [];
	const skipped: SkippedIntegration[] = [];
	for (const row of rows) {
		if (!row.dek) {
			skipped.push({ name: row.name, reason: 'no stored credentials' });
		} else if (Object.keys(row.config ?? {}).length === 0) {
			skipped.push({ name: row.name, reason: 'empty config' });
		} else {
			toMigrate.push(row);
		}
	}
	const integrations = await Promise.all(
		toMigrate.map((row) => rewrapIntegrationRow(row, devKek, prodKek)),
	);
	return { integrations, skipped };
}

/** Result of a migration relay: prod's outcome, surfaced back to the CLI. */
export type MigrationResult = {
	ok: boolean;
	migrated?: number;
	error?: string;
};

/**
 * POST the opaque migration payload to the Hub, which relays it (HMAC-signed) to
 * the caller's production environment and returns prod's outcome. The Hub never
 * sees the prod KEK, so it cannot open the rows it relays.
 */
export async function postMigrationToHub(input: {
	hub: HubConfig;
	payload: MigrationPayload;
}): Promise<MigrationResult> {
	return hubApiPost({
		hub: input.hub,
		path: MIGRATE_HUB_PATH,
		notFoundMessage:
			'Hub migration endpoint not found. Update your Hub deployment or check the API URL.',
		body: input.payload,
		parseResponse: (raw): MigrationResult => {
			const record = (raw ?? {}) as Record<string, unknown>;
			return {
				ok: record.ok === true,
				migrated:
					typeof record.migrated === 'number' ? record.migrated : undefined,
				error: typeof record.error === 'string' ? record.error : undefined,
			};
		},
	});
}
