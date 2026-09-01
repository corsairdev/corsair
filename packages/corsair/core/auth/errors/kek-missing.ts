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
 * error (similar to Better Auth's secret validation) instead of deferring to a
 * proxy on first `corsair.keys` access.
 */
export function resolveKekAtInit(
	kek: string | undefined,
	hasDatabase: boolean,
): string {
	const resolved = kek?.trim() ?? '';
	if (hasDatabase && !resolved) {
		throw new CorsairKekMissingError();
	}
	return resolved;
}
