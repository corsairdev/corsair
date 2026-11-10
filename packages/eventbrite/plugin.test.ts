import { AuthMissingError } from 'corsair/core';
import type { EventbriteKeyBuilderContext } from './index';
import {
	EventbriteAPIError,
	eventbrite,
	eventbriteEndpointMeta,
	eventbriteEndpointSchemas,
} from './index';

const STORED_KEY = 'stored-private-token';
const INLINE_KEY = 'inline-private-token';

/**
 * The real key manager implements a dozen account methods; the keyBuilder only
 * reads `get_api_key`, so the fixture supplies that one and is cast through
 * unknown. A fixture that implemented the whole type would prove nothing about
 * what the runtime actually provides.
 */
function keyContext(keys: { api_key?: string }): EventbriteKeyBuilderContext {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => keys.api_key ?? null,
		},
		// unknown: the fixture implements one of the key manager methods, not the full type.
	} as unknown as EventbriteKeyBuilderContext;
}

/**
 * The fixture implements one of the key manager's methods, so it is not a full
 * `KeyBuilderContext`; the cast is at this single call site rather than at
 * every assertion.
 */
function resolveKey(
	plugin: ReturnType<typeof eventbrite>,
	keys: { api_key?: string },
) {
	return plugin.keyBuilder?.(keyContext(keys) as never, 'endpoint');
}

describe('eventbrite plugin', () => {
	it('registers under the eventbrite id with api_key auth', () => {
		const plugin = eventbrite();

		expect(plugin.id).toBe('eventbrite');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes every endpoint it advertises, with a schema and a risk level', () => {
		const plugin = eventbrite();
		const paths = Object.keys(eventbriteEndpointSchemas);
		const meta: Record<string, { riskLevel: string }> = eventbriteEndpointMeta;

		expect(paths.length).toBeGreaterThan(40);
		for (const path of paths) {
			// Indexed, not `toHaveProperty`, which reads `.` as a path separator.
			expect(meta[path]).toBeDefined();
			expect(['read', 'write', 'destructive']).toContain(meta[path]?.riskLevel);
		}
	});

	it('marks every delete destructive and irreversible', () => {
		const deletes = Object.entries(eventbriteEndpointMeta).filter(([path]) =>
			path.endsWith('.delete'),
		);

		expect(deletes.length).toBeGreaterThanOrEqual(5);
		for (const [path, meta] of deletes) {
			// Narrowed field by field: the map is a union of literal types, so only
			// the entries that opted into `irreversible` carry the property at all.
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

	it('registers no webhook delivery as a read, since it is not one', () => {
		const plugin = eventbrite();

		// The notification handler is not an endpoint, so it never enters the
		// risk map; this pins that it stays that way.
		expect(Object.keys(plugin.endpoints ?? {})).toContain('events');
		expect(
			Object.keys(eventbriteEndpointMeta).some((path) =>
				path.startsWith('notifications.'),
			),
		).toBe(false);
	});

	it('prefers the inline key over the stored one', async () => {
		const plugin = eventbrite({ key: INLINE_KEY });

		expect(await resolveKey(plugin, { api_key: STORED_KEY })).toBe(INLINE_KEY);
	});

	it('falls back to the stored key when no inline key is set', async () => {
		const plugin = eventbrite();

		expect(await resolveKey(plugin, { api_key: STORED_KEY })).toBe(STORED_KEY);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = eventbrite();

		await expect(resolveKey(plugin, {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('does not attach a caller error handler key before the builtins', () => {
		const plugin = eventbrite();
		const keys = Object.keys(plugin.errorHandlers ?? {});

		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it('matches only a notification delivery at the plugin level', () => {
		const plugin = eventbrite();
		const matcher = plugin.pluginWebhookMatcher;

		expect(
			matcher?.({
				headers: {},
				body: { api_url: 'https://www.eventbriteapi.com/v3/orders/1/' },
			}),
		).toBe(true);
		expect(
			matcher?.({ headers: {}, body: { type: 'some-other-plugin' } }),
		).toBe(false);
	});

	it('exports the error type so callers can branch on a code', () => {
		const error = new EventbriteAPIError('failed', { status: 404 });

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('EventbriteAPIError');
		expect(error.status).toBe(404);
	});
});
