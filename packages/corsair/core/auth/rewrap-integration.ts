import { decryptDEK, encryptDEK } from './encryption';

/**
 * An integration row prepared for dev→prod migration: the DEK re-wrapped for the
 * prod KEK, and the secret `config` ciphertext carried over untouched.
 */
export type MigratedIntegration = {
	name: string;
	dek: string;
	config: Record<string, unknown>;
};

/**
 * Unwrap a KEK-wrapped DEK with the dev KEK and re-wrap it with the prod KEK.
 *
 * The raw DEK exists only in memory inside this call; no secret is ever
 * decrypted. Throws if the dev KEK is wrong (AES-GCM auth failure) rather than
 * producing a corrupt wrapping.
 */
export async function rewrapIntegrationDek(
	wrappedDek: string,
	devKek: string,
	prodKek: string,
): Promise<string> {
	const rawDek = await decryptDEK(wrappedDek, devKek);
	return encryptDEK(rawDek, prodKek);
}

/**
 * Prepare a single `corsair_integrations` row for delivery to prod: re-wrap its
 * DEK, copy its encrypted `config` verbatim. The secrets inside `config` are
 * never decrypted — they remain sealed by the (unchanged) DEK.
 */
export async function rewrapIntegrationRow(
	row: {
		name: string;
		dek: string | null | undefined;
		config: Record<string, unknown>;
	},
	devKek: string,
	prodKek: string,
): Promise<MigratedIntegration> {
	if (!row.dek) {
		throw new Error(`Integration "${row.name}" has no DEK to migrate`);
	}
	return {
		name: row.name,
		dek: await rewrapIntegrationDek(row.dek, devKek, prodKek),
		config: row.config,
	};
}
