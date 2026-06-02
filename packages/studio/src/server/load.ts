import { getCorsairInstance } from '@corsair-dev/cli';
import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL } from 'corsair/core';
import type { CorsairHandle } from './types';

/**
 * Loads the user's corsair instance from their project by delegating to the
 * CLI's loader. Returns a handle with the internal config extracted.
 *
 * Memoised per cwd so we only pay the jiti/c12 cost once per studio session.
 */
const cache = new Map<string, Promise<CorsairHandle>>();

export function loadCorsair(
	cwd: string,
	options: { force?: boolean } = {},
): Promise<CorsairHandle> {
	if (options.force) {
		cache.delete(cwd);
	}
	const cached = cache.get(cwd);
	if (cached) return cached;

	const pending = (async (): Promise<CorsairHandle> => {
		const instance = await getCorsairInstance({
			cwd,
			shouldThrowOnError: true,
		});
		const internal = (instance as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
			| CorsairInternalConfig
			| undefined;

		if (!internal) {
			throw new Error(
				'Could not read internal config from Corsair instance. Upgrade the `corsair` package to the latest version.',
			);
		}

		const handle: CorsairHandle = {
			instance,
			internal,
			resolveClient(tenantId) {
				const obj = instance as Record<string, unknown>;
				if (typeof obj.withTenant === 'function') {
					const tid = tenantId ?? 'default';
					return (obj.withTenant as (id: string) => Record<string, unknown>)(
						tid,
					);
				}
				return obj;
			},
		};

		return handle;
	})();

	cache.set(cwd, pending);
	pending.catch(() => cache.delete(cwd));
	return pending;
}
