import { KEY_LENGTH } from '../encryption';

/**
 * Creates a proxy that throws helpful errors when accessing keys without proper configuration.
 * Used when database or KEK is not configured in createCorsair().
 *
 * @param hasDatabase - Whether a database adapter is configured
 * @param hasKek - Whether a KEK (Key Encryption Key) is configured
 * @returns A proxy that throws an error when any property is accessed
 */
export function createMissingConfigProxy<T>(
	hasDatabase: boolean,
	hasKek: boolean,
): T {
	const missingConfig: string[] = [];
	if (!hasDatabase) missingConfig.push('database');
	if (!hasKek) missingConfig.push('kek');

	const proxyTarget = {} as Record<string, unknown>;

	return new Proxy(proxyTarget, {
		get(_target, prop) {
			const isPlural = missingConfig.length > 1;
			throw new Error(
				`corsair.keys.${String(prop)}: Cannot access keys because ${missingConfig.join(' and ')} ${isPlural ? 'are' : 'is'} not configured. ` +
					`Provide both 'database' and 'kek' in createCorsair() to enable key management.\n\n` +
					`To generate a KEK, run: openssl rand -base64 ${KEY_LENGTH}`,
			);
		},
	}) as T;
}
