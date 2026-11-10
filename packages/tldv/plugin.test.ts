import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { tldv, tldvAuthConfig, tldvEndpointSchemas } from './index';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

const OPERATIONS = [
	'folders.list',
	'meetings.get',
	'meetings.import',
	'meetings.list',
	'meetings.notes',
	'meetings.transcript',
] as const;

const WEBHOOKS = [
	'meetings.meetingReady',
	'transcripts.transcriptReady',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

/**
 * `endpointMeta`, `endpoints` and `webhooks` are typed as optionals on
 * `CorsairPlugin`, so the assertions below widen them one cast at a time.
 * unknown: only their keys are walked or their risk fields read, so typing each
 * leaf precisely would mean restating the whole plugin surface in the test.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

describe('tldv plugin definition', () => {
	const plugin = tldv();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as tldv with api_key auth', () => {
		expect(plugin.id).toBe('tldv');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(tldvAuthConfig)).toEqual(['api_key']);
	});

	it('exposes the webhook secret and tenant link slots on the account', () => {
		// tl;dv does not sign, so the shared secret has nowhere else to live. The
		// tenant matcher answers `tenant_external_id`, so the account needs that
		// field too or there is no setter to store the organizer email with.
		// `webhook_signature` comes from the base api_key fields; listing it here
		// again made it show twice in the catalog's account fields.
		expect([...tldvAuthConfig.api_key.account]).toEqual(['tenant_external_id']);
	});

	it('registers exactly the six operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
	});

	it('registers exactly the two webhook triggers', () => {
		expect(flatten(asNested(plugin.webhooks))).toEqual([...WEBHOOKS]);
	});

	it('claims only tl;dv deliveries at the plugin level', () => {
		// Tenant discovery stops at the first plugin whose matcher says yes, so
		// the matcher must say no to a body that is not a tl;dv trigger.
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: { event: 'MeetingReady' },
			}),
		).toBe(true);
	});

	it('gives every operation a description and the right risk level', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		const risks = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risks).toEqual({
			'folders.list': 'read',
			'meetings.get': 'read',
			'meetings.import': 'write',
			'meetings.list': 'read',
			'meetings.notes': 'read',
			'meetings.transcript': 'read',
		});
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(tldvEndpointSchemas).sort()).toEqual([...OPERATIONS]);
		for (const schemas of Object.values(tldvEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects a list filter outside the documented enum', () => {
		const list = tldvEndpointSchemas['meetings.list'];
		expect(list.input.safeParse({ meetingType: 'internal' }).success).toBe(
			true,
		);
		// An invalid value is a 400 from the API; reject it before sending.
		expect(list.input.safeParse({ meetingType: 'bogus' }).success).toBe(false);
	});

	it('rejects a page size above the documented cap', () => {
		const list = tldvEndpointSchemas['meetings.list'];
		expect(list.input.safeParse({ limit: 100 }).success).toBe(true);
		expect(list.input.safeParse({ limit: 101 }).success).toBe(false);
	});

	it('rejects an import with no url or no name', () => {
		// The spec's MeetingImportControllerBody requires both, so tl;dv answers
		// 400 to a body with only one of them.
		const importOp = tldvEndpointSchemas['meetings.import'];
		const url = 'https://example.org/a.mp4';
		expect(importOp.input.safeParse({}).success).toBe(false);
		expect(importOp.input.safeParse({ name: 'Call' }).success).toBe(false);
		expect(importOp.input.safeParse({ url }).success).toBe(false);
		expect(importOp.input.safeParse({ url, name: '' }).success).toBe(false);
		expect(importOp.input.safeParse({ url, name: 'Call' }).success).toBe(true);
	});

	it('keeps import metadata to the flat values tl;dv stores', () => {
		const importOp = tldvEndpointSchemas['meetings.import'];
		const base = { url: 'https://example.org/a.mp4', name: 'Call' };
		const parse = (metadata: Record<string, unknown>) =>
			importOp.input.safeParse({ ...base, metadata }).success;

		expect(parse({ crmRecordId: 'rec_123', callId: 42, inbound: true })).toBe(
			true,
		);
		// Nested objects and arrays are refused by the API.
		expect(parse({ crm: { id: 'rec_123' } })).toBe(false);
		expect(parse({ tags: ['a', 'b'] })).toBe(false);
		expect(parse({ note: 'x'.repeat(257) })).toBe(false);
		// Keys must match ^[A-Za-z0-9_-]{1,64}$ and there can be at most 20.
		expect(parse({ 'crm id': 'rec_123' })).toBe(false);
		expect(
			parse(
				Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`k${i}`, i])),
			),
		).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = tldv({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('tldv tenant link', () => {
	it('stores the organizer email the tenant matcher looks up', async () => {
		const testDb = createTestDatabase();
		try {
			await createIntegrationAndAccount(testDb.db, 'tldv', 'default');
			const corsair = createCorsair({
				plugins: [tldv({ key: 'test-key' })],
				database: testDb.db,
				kek: KEK,
			});
			// unknown: the key manager's field setters are generated from the auth
			// config, so the test reads them by name to prove the field exists.
			const keys = corsair.tldv.keys as unknown as Record<
				string,
				((value?: string) => Promise<string | null | undefined>) | undefined
			>;

			expect(typeof keys.set_tenant_external_id).toBe('function');
			await keys.issue_new_dek?.();
			await keys.set_tenant_external_id?.('jordan@example.org');
			await expect(keys.get_tenant_external_id?.()).resolves.toBe(
				'jordan@example.org',
			);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('tldv key builder', () => {
	function ctx(
		stored: { apiKey?: string | null; webhookSecret?: string | null } = {},
	) {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(stored.apiKey ?? null),
				get_webhook_signature: jest
					.fn()
					.mockResolvedValue(stored.webhookSecret ?? null),
			},
		};
	}

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx({ apiKey: 'stored' });

		const key = await tldv({ key: 'explicit' }).keyBuilder?.(
			fixture as never,
			'endpoint',
		);

		expect(key).toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored API key', async () => {
		const fixture = ctx({ apiKey: 'stored' });

		await expect(
			tldv().keyBuilder?.(fixture as never, 'endpoint'),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		await expect(
			tldv().keyBuilder?.(ctx() as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('resolves the webhook secret, not the API key, for a delivery', async () => {
		const fixture = ctx({ apiKey: 'stored', webhookSecret: 'hook-secret' });

		await expect(
			tldv().keyBuilder?.(fixture as never, 'webhook'),
		).resolves.toBe('hook-secret');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('prefers the webhookSecret option over the stored one', async () => {
		const fixture = ctx({ webhookSecret: 'stored-secret' });

		await expect(
			tldv({ webhookSecret: 'option-secret' }).keyBuilder?.(
				fixture as never,
				'webhook',
			),
		).resolves.toBe('option-secret');
		expect(fixture.keys.get_webhook_signature).not.toHaveBeenCalled();
	});

	it('returns an empty secret so verification fails closed', async () => {
		// The key builder must return a string, and the verifier treats a falsy
		// secret as unset, so a delivery is refused rather than compared to ''.
		await expect(tldv().keyBuilder?.(ctx() as never, 'webhook')).resolves.toBe(
			'',
		);
	});
});
