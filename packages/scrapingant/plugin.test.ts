import { AuthMissingError } from 'corsair/core';
import type {
	ScrapingAntKeyBuilderContext,
	ScrapingAntPluginOptions,
} from './index';
import { scrapingAntEndpointSchemas, scrapingant } from './index';

const OPERATIONS = [
	'account.usage',
	'extract.data',
	'scrape.extended',
	'scrape.html',
	'scrape.markdown',
] as const;

type EndpointMeta = { riskLevel: string; description: string };
type KeyBuilder = (
	ctx: ScrapingAntKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

/**
 * Reads the builder off an instance. Each instance types its keyBuilder context
 * from its own options, and `scrapingant({ key: 'x' })` narrows that context to
 * `never`, so the three instances cannot share one parameter type; the cast
 * restates it as the builder every instance really is.
 */
function keyBuilderOf(plugin: object): KeyBuilder {
	return (plugin as { keyBuilder?: KeyBuilder }).keyBuilder as KeyBuilder;
}

describe('scrapingant plugin', () => {
	const plugin = scrapingant();
	const meta = plugin.endpointMeta as Record<string, EndpointMeta>;

	it('registers every operation', () => {
		expect(flatten(plugin.endpoints ?? {})).toEqual([...OPERATIONS]);
	});

	it('advertises api_key as its only auth type', () => {
		// ScrapingAnt issues a personal API token; there is no OAuth flow to
		// connect, so offering one would be a broken connection screen.
		const options: ScrapingAntPluginOptions = {};
		expect(options.authType).toBeUndefined();
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has no webhooks, because ScrapingAnt sends none', () => {
		expect(plugin.webhooks).toEqual({});
		// The matcher has to refuse every delivery: a plugin that handles no
		// webhooks must not claim one it cannot verify.
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('registers an input and output schema for every operation', () => {
		expect(Object.keys(scrapingAntEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const operation of OPERATIONS) {
			const entry = scrapingAntEndpointSchemas[operation];
			expect({ operation, hasInput: entry.input !== undefined }).toEqual({
				operation,
				hasInput: true,
			});
			expect({ operation, hasOutput: entry.output !== undefined }).toEqual({
				operation,
				hasOutput: true,
			});
		}
	});
	it('gives every operation metadata and a read risk level', () => {
		for (const operation of OPERATIONS) {
			const entry = meta[operation];
			expect(entry).toBeDefined();
			// Every operation is a GET that changes nothing at ScrapingAnt, so a
			// read-only caller can scrape without an approval prompt.
			expect({ operation, risk: entry?.riskLevel }).toEqual({
				operation,
				risk: 'read',
			});
			expect(entry?.description.length).toBeGreaterThan(20);
		}
	});

	it('declares no irreversible operation', () => {
		for (const operation of OPERATIONS) {
			expect({
				operation,
				irreversible: (meta[operation] as { irreversible?: boolean })
					.irreversible,
			}).toEqual({ operation, irreversible: undefined });
		}
	});

	it('does not carry generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			expect(meta[operation]?.description).not.toMatch(/example resource/i);
		}
	});
});

describe('keyBuilder', () => {
	function contextWith(storedKey: string | undefined): {
		ctx: ScrapingAntKeyBuilderContext;
		get_api_key: jest.Mock;
	} {
		const get_api_key = jest.fn().mockResolvedValue(storedKey);
		// unknown: a fixture cannot be a full AccountKeyManager (it needs
		// get_dek, issue_new_dek and the rest), so this implements the one
		// accessor the builder reads and casts the rest.
		return {
			ctx: {
				authType: 'api_key',
				keys: { get_api_key },
			} as unknown as ScrapingAntKeyBuilderContext,
			get_api_key,
		};
	}

	it('prefers an inline key', async () => {
		const { ctx } = contextWith('stored-key');
		await expect(
			keyBuilderOf(scrapingant({ key: 'inline-key' }))(ctx, 'endpoint'),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		const { ctx, get_api_key } = contextWith('stored-key');
		await expect(keyBuilderOf(scrapingant())(ctx, 'endpoint')).resolves.toBe(
			'stored-key',
		);
		expect(get_api_key).toHaveBeenCalledTimes(1);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const { ctx } = contextWith(undefined);
		// Failing open would send an empty x-api-key and surface ScrapingAnt's
		// generic 403 instead of Corsair's disconnected-auth flow.
		await expect(
			keyBuilderOf(scrapingant())(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('does not read the stored key when an inline one is present', async () => {
		const { ctx, get_api_key } = contextWith('stored-key');
		await keyBuilderOf(scrapingant({ key: 'inline-key' }))(ctx, 'endpoint');
		expect(get_api_key).not.toHaveBeenCalled();
	});
});
