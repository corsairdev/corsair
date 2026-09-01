import { KEY_LENGTH } from '../encryption';

export class CorsairKekMissingError extends Error {
	constructor() {
		super(
			'Corsair KEK is missing. Pass `kek` to createCorsair() or set CORSAIR_KEK in your environment. ' +
				`Generate one with: openssl rand -base64 ${KEY_LENGTH}`,
		);
		this.name = 'CorsairKekMissingError';
	}
}

/**
 * Validates the KEK when a database is configured. Fails at init with a clear
 * error instead of deferring to a proxy on first `corsair.keys` access.
 *
 * The KEK is returned byte-for-byte — never trimmed. scrypt uses the raw
 * string as password input when wrapping DEKs; normalizing whitespace would
 * break decryption of credentials encrypted with the original key material.
 */
export function resolveKekAtInit(
	kek: string | undefined,
	hasDatabase: boolean,
): string {
	if (!hasDatabase) {
		return kek ?? '';
	}

	if (kek === undefined || kek === '') {
		throw new CorsairKekMissingError();
	}

	return kek;
}
