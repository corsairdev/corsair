import type { CorsairPermissionsOptions } from '../plugins';

export const DEPRECATED_APPROVAL_CONFIG_MESSAGE =
	'createCorsair({ approval: ... }) is deprecated. Rename to permissions: { timeout, onTimeout, mode }.';

export function resolveRootPermissionsConfig(config: {
	permissions?: CorsairPermissionsOptions;
	approval?: CorsairPermissionsOptions;
}): CorsairPermissionsOptions | undefined {
	const { permissions, approval } = config;

	if (permissions && approval) {
		throw new Error(
			'createCorsair was given both permissions and approval config. Use permissions only — approval is deprecated.',
		);
	}

	if (approval) {
		console.warn(`[corsair] ${DEPRECATED_APPROVAL_CONFIG_MESSAGE}`);
		return approval;
	}

	return permissions;
}
