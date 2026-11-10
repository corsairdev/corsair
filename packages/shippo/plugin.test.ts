import { AuthMissingError } from 'corsair/core';
import type { ShippoKeyBuilderContext } from './index';
import {
	ShippoAPIError,
	shippo,
	shippoEndpointMeta,
	shippoEndpointSchemas,
} from './index';

const STORED_KEY = 'shippo_test_stored';
const INLINE_KEY = 'shippo_test_inline';

/**
 * The real key manager implements a dozen account methods; the keyBuilder only
 * reads `get_api_key`, so the fixture supplies that one and is cast through
 * unknown. A fixture implementing the whole type would prove nothing about what
 * the runtime actually provides.
 */
function keyContext(keys: { api_key?: string }): ShippoKeyBuilderContext {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => keys.api_key ?? null,
		},
		// unknown: the fixture implements one key manager method, not the type.
	} as unknown as ShippoKeyBuilderContext;
}

/**
 * The fixture implements one of the key manager's methods, so it is not a full
 * `KeyBuilderContext`; the cast is at this single call site.
 */
function resolveKey(
	plugin: ReturnType<typeof shippo>,
	keys: { api_key?: string },
) {
	return plugin.keyBuilder?.(keyContext(keys) as never, 'endpoint');
}

describe('shippo plugin', () => {
	it('registers under the shippo id with api_key auth', () => {
		const plugin = shippo();

		expect(plugin.id).toBe('shippo');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('gives every advertised operation a schema and a risk level', () => {
		const paths = Object.keys(shippoEndpointSchemas);
		const meta: Record<string, { riskLevel: string }> = shippoEndpointMeta;

		expect(paths.length).toBeGreaterThanOrEqual(57);
		for (const path of paths) {
			// Indexed, not `toHaveProperty`, which reads `.` as a path separator.
			expect(meta[path]).toBeDefined();
			expect(['read', 'write', 'destructive']).toContain(meta[path]?.riskLevel);
		}
	});

	it('marks every delete destructive and irreversible', () => {
		const deletes = Object.entries(shippoEndpointMeta).filter(([path]) =>
			path.endsWith('.delete'),
		);

		expect(deletes.length).toBeGreaterThanOrEqual(2);
		for (const [path, meta] of deletes) {
			// Narrowed field by field: the map is a union of literal types, so
			// only entries that opted into `irreversible` carry the property.
			const entry: { riskLevel: string; irreversible?: boolean } = meta;
			expect({ path, risk: entry.riskLevel }).toEqual({
				path,
				risk: 'destructive',
			});
			expect({ path, irreversible: entry.irreversible }).toEqual({
				path,
				irreversible: true,
			});
		}
	});

	it('classifies buying a label and a batch as a write, never a read', () => {
		// Both spend money; a `read` would let a read-only caller buy.
		expect(shippoEndpointMeta['transactions.create'].riskLevel).toBe('write');
		expect(shippoEndpointMeta['batches.purchase'].riskLevel).toBe('write');
		expect(shippoEndpointMeta['refunds.create'].riskLevel).toBe('write');
		expect(shippoEndpointMeta['tracks.register'].riskLevel).toBe('write');
	});

	it('prefers the inline key over the stored one', async () => {
		expect(
			await resolveKey(shippo({ key: INLINE_KEY }), { api_key: STORED_KEY }),
		).toBe(INLINE_KEY);
	});

	it('falls back to the stored key when no inline key is set', async () => {
		expect(await resolveKey(shippo(), { api_key: STORED_KEY })).toBe(
			STORED_KEY,
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(resolveKey(shippo(), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves a webhook key without a credential, since Shippo signs nothing', async () => {
		// Every delivery would otherwise fail before the handler ran.
		const resolved = await shippo().keyBuilder?.(
			keyContext({}) as never,
			'webhook',
		);

		expect(resolved).toBe('');
	});

	it('matches only a Shippo delivery at the plugin level', () => {
		const matcher = shippo().pluginWebhookMatcher;

		expect(
			matcher?.({
				headers: {},
				body: { event: 'track_updated', test: true, data: {} },
			}),
		).toBe(true);
		expect(matcher?.({ headers: {}, body: { type: 'other' } })).toBe(false);
	});

	it('keeps DEFAULT last in its error handlers', () => {
		const keys = Object.keys(shippo().errorHandlers ?? {});

		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it('exports the error type so callers can branch on a code', () => {
		const error = new ShippoAPIError('failed', { status: 401 });

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('ShippoAPIError');
		expect(error.code).toBe('INVALID_TOKEN');
	});
});
