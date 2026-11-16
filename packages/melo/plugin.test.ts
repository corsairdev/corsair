import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import type { MeloKeyBuilderContext } from './index';
import { melo, meloEndpointSchemas } from './index';

const OPERATIONS = [
	'properties.list',
	'properties.get',
	'properties.listSimilar',
	'indicators.pricePerMeter',
	'indicators.pointsOfInterest',
	'indicators.locations',
	'indicators.cities',
	'searches.list',
	'searches.get',
	'searches.create',
	'searches.update',
	'searches.delete',
	'webhooks.simulate',
] as const;

type KeyBuilder = (
	ctx: MeloKeyBuilderContext,
	source: string,
) => Promise<string>;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};

/** Reads a key that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

function flatten(endpoints: Record<string, object>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('melo plugin', () => {
	const plugin = melo();
	// keyBuilder is optional on the plugin type; this plugin always defines it.
	const keyBuilderOf = (candidate: ReturnType<typeof melo>): KeyBuilder => {
		if (!candidate.keyBuilder) throw new Error('melo() defines no keyBuilder');
		return candidate.keyBuilder as KeyBuilder;
	};
	const meta = plugin.endpointMeta as Record<string, EndpointMeta>;

	it('has the melo id and api_key auth by default', () => {
		expect(plugin.id).toBe('melo');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('offers api_key auth only, with no account or tenant fields', () => {
		expect(plugin).not.toHaveProperty('authConfig');
		expect(plugin).not.toHaveProperty('oauthWebhookTenantLinkResolver');
		expect(plugin).not.toHaveProperty('pluginTenantWebhookMatcher');
	});

	it('registers the 13 operations the OpenAPI spec lists, and no others', () => {
		expect(flatten(plugin.endpoints as Record<string, object>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares an input and an output schema for each operation', () => {
		expect(Object.keys(meloEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = meloEndpointSchemas[operation];
			expect(entry.input).toBeInstanceOf(z.ZodType);
			expect(entry.output).toBeInstanceOf(z.ZodType);
		}
		expect(plugin.endpointSchemas).toBe(meloEndpointSchemas);
	});

	it('keeps extra response fields instead of stripping them', () => {
		const parsed = meloEndpointSchemas['searches.get'].output.parse({
			title: 'a',
			aFieldAddedLater: { deep: true },
		});
		expect(parsed).toMatchObject({ aFieldAddedLater: { deep: true } });

		const collection = meloEndpointSchemas['properties.list'].output.parse({
			'hydra:member': [{ uuid: 'x', aNewAdvertField: 1 }],
			nextPage: null,
			aNewEnvelopeField: 'kept',
		});
		expect(collection).toMatchObject({ aNewEnvelopeField: 'kept' });
		expect(collection['hydra:member'][0]).toMatchObject({ aNewAdvertField: 1 });
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const entry = required(meta, operation);
			expect(entry.description.length).toBeGreaterThan(20);
			expect(entry.description).not.toMatch(/example resource|TODO/i);
		}
	});

	it('classifies reads, writes and the one destructive operation', () => {
		const byRisk = (risk: string) =>
			OPERATIONS.filter((op) => required(meta, op).riskLevel === risk);

		expect(byRisk('read')).toEqual([
			'properties.list',
			'properties.get',
			'properties.listSimilar',
			'indicators.pricePerMeter',
			'indicators.pointsOfInterest',
			'indicators.locations',
			'indicators.cities',
			'searches.list',
			'searches.get',
		]);
		// The simulator is a GET, but it makes Melo send a request to a URL.
		expect(byRisk('write')).toEqual([
			'searches.create',
			'searches.update',
			'webhooks.simulate',
		]);
		expect(byRisk('destructive')).toEqual(['searches.delete']);
	});

	it('marks only the delete as irreversible', () => {
		expect(required(meta, 'searches.delete').irreversible).toBe(true);
		for (const operation of OPERATIONS) {
			if (operation === 'searches.delete') continue;
			expect(required(meta, operation).irreversible).toBeUndefined();
		}
	});

	it('handles no inbound webhooks, because the simulate call is an API call', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {
					'x-melo-signature': 'a',
					'content-type': 'application/json',
				},
				body: {},
			}),
		).toBe(false);
	});

	it('appends the caller error handlers while keeping DEFAULT last', () => {
		const custom = melo({
			errorHandlers: {
				TEAPOT: {
					match: () => false,
					handler: async () => ({ maxRetries: 1 }),
				},
			},
		});
		const keys = Object.keys(custom.errorHandlers ?? {});
		expect(keys[0]).toBe('TEAPOT');
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('RATE_LIMIT_ERROR');
	});

	describe('keyBuilder', () => {
		const keyContext = (key: string | null): MeloKeyBuilderContext => ({
			authType: 'api_key',
			options: {},
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: async () => key,
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
			},
			tenantId: 'default',
		});

		it('returns the key configured inline, ahead of a stored one', async () => {
			const configured = melo({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when no key is available', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(null), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for a webhook source, which this plugin has none of', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
