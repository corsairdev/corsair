import type { AbyssaleBanner } from './schema/database';

type CacheCtx = {
	db: {
		banners?: {
			upsertByEntityId: (
				entityId: string,
				data: AbyssaleBanner,
			) => Promise<{ id?: string } | null | undefined>;
		};
	};
};

/**
 * Mirrors a generated visual into the plugin cache. Best-effort: a caching
 * failure must never fail an otherwise successful generation or webhook.
 * Returns the corsair entity id (empty string when caching is unavailable).
 */
export async function cacheBanner(
	ctx: CacheCtx,
	banner: AbyssaleBanner,
): Promise<string> {
	if (!ctx.db.banners) return '';

	try {
		const entity = await ctx.db.banners.upsertByEntityId(banner.id, banner);
		return entity?.id || '';
	} catch (error) {
		console.warn(`[abyssale] failed to cache banner ${banner.id}:`, error);
		return '';
	}
}
