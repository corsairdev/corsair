import type { CorsairDBAdapter } from '../../core/db/adapter';

export type DrizzleAdapterOptions = {
	/**
	 * Adapter identifier override.
	 */
	id?: string | undefined;
	/**
	 * Drizzle dialect/provider.
	 * Matches Better Auth’s convention for generator selection.
	 */
	provider?: 'sqlite' | 'pg' | 'mysql' | undefined;
};

/**
 * Minimal Drizzle DB adapter placeholder.
 *
 * This will evolve to generate/migrate Drizzle tables from the internal schema.
 */
export function drizzleAdapter(
	db: unknown,
	options?: DrizzleAdapterOptions | undefined,
): CorsairDBAdapter {
	return {
		id: options?.id ?? 'drizzle',
		client: db,
		options: {
			provider: options?.provider,
		},
	};
}
