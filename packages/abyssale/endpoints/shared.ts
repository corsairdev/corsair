import type { AbyssaleContext } from '..';
import {
	AbyssaleEndpointInputSchemas,
	AbyssaleEndpointOutputSchemas,
} from './types';

/**
 * The shared endpoint binder does not parse `endpointSchemas` — they are
 * metadata for introspection only. Validating here is what actually enforces
 * the declared contract, so malformed input never reaches the API and a
 * provider payload that breaks the contract surfaces as a clear error.
 */
export function parseInput<K extends keyof typeof AbyssaleEndpointInputSchemas>(
	operation: K,
	input: unknown,
) {
	return AbyssaleEndpointInputSchemas[operation].parse(
		input ?? {},
	) as ReturnType<(typeof AbyssaleEndpointInputSchemas)[K]['parse']>;
}

export function parseOutput<
	K extends keyof typeof AbyssaleEndpointOutputSchemas,
>(operation: K, data: unknown) {
	return AbyssaleEndpointOutputSchemas[operation].parse(data) as ReturnType<
		(typeof AbyssaleEndpointOutputSchemas)[K]['parse']
	>;
}

type EntityClient = {
	upsertByEntityId?: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
};

/**
 * Mirrors an API result into the plugin cache. Best-effort: a caching failure
 * must never fail an otherwise successful API call.
 *
 * `ctx.db` narrows each client to its own entity schema; this helper is
 * entity-agnostic, so the map is widened through `unknown`.
 */
export async function cacheEntities(
	ctx: AbyssaleContext,
	entity: 'projects' | 'designs' | 'fonts' | 'banners',
	items: ReadonlyArray<{ id?: string }>,
): Promise<void> {
	const db = ctx.db as unknown as
		| Record<string, EntityClient | undefined>
		| undefined;
	const client = db?.[entity];
	if (!client?.upsertByEntityId) return;

	for (const item of items) {
		if (!item?.id) continue;
		try {
			await client.upsertByEntityId(item.id, item as Record<string, unknown>);
		} catch (error) {
			console.warn(`[abyssale] failed to cache ${entity} ${item.id}:`, error);
		}
	}
}
