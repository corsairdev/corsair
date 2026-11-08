import { AuthMissingError } from 'corsair/core';
import { tldv, tldvAuthConfig, tldvEndpointSchemas } from './index';

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

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

describe('tldv plugin definition', () => {
	const plugin = tldv();
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as tldv with api_key auth', () => {
		expect(plugin.id).toBe('tldv');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(tldvAuthConfig)).toEqual(['api_key']);
	});

	it('exposes the webhook signature slot on the account', () => {
		// tl;dv does not sign, so the shared secret has nowhere else to live.
		expect([...tldvAuthConfig.api_key.account]).toEqual(['webhook_signature']);
	});

	it('registers exactly the six operations', () => {
		expect(flatten(plugin.endpoints as unknown as NestedMap)).toEqual([
			...OPERATIONS,
		]);
	});

	it('registers exactly the two webhook triggers', () => {
		expect(flatten(plugin.webhooks as unknown as NestedMap)).toEqual([
			...WEBHOOKS,
		]);
	});

	it('accepts every delivery at the plugin level', () => {
		// Both triggers share one route and are separated by their `event` field,
		// which each per-webhook matcher already checks.
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(true);
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

	it('rejects an import with no url', () => {
		const importOp = tldvEndpointSchemas['meetings.import'];
		expect(importOp.input.safeParse({}).success).toBe(false);
		expect(
			importOp.input.safeParse({ url: 'https://example.org/a.mp4' }).success,
		).toBe(true);
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
