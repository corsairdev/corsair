import { AuthMissingError } from 'corsair/core';
import type { MailssoKeyBuilderContext } from './index';
import { mailsso, mailssoEndpointSchemas } from './index';

const OPERATIONS = [
	'validations.batch',
	'validations.getBatch',
	'validations.single',
] as const;

function flatten(endpoints: Record<string, Record<string, object>>): string[] {
	return Object.entries(endpoints)
		.flatMap(([group, members]) =>
			Object.keys(members).map((name) => `${group}.${name}`),
		)
		.sort();
}

type KeyBuilder = (
	ctx: MailssoKeyBuilderContext,
	source: 'endpoint',
) => Promise<string>;

/** CorsairPlugin.keyBuilder is optional on the type; this plugin always sets it. */
function keyBuilderOf(candidate: { keyBuilder?: object }): KeyBuilder {
	return candidate.keyBuilder as KeyBuilder;
}

/** A key-builder context that implements only the one method the plugin calls. */
function keyContext(storedKey: string | undefined): MailssoKeyBuilderContext {
	const ctx = {
		authType: 'api_key',
		keys: { get_api_key: async () => storedKey },
	};
	return ctx as unknown as MailssoKeyBuilderContext; // unknown: a fixture cannot satisfy the full AccountKeyManager, and the key builder only calls get_api_key.
}

describe('mailsso plugin', () => {
	const plugin = mailsso();
	const meta = plugin.endpointMeta as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('has the mailsso id and api_key auth', () => {
		expect(plugin.id).toBe('mailsso');
		expect(plugin.options?.authType).toBe('api_key');
		expect(mailsso({ key: 'k' }).options?.key).toBe('k');
	});

	it('registers exactly the three documented operations', () => {
		expect(
			flatten(plugin.endpoints as Record<string, Record<string, object>>),
		).toEqual([...OPERATIONS]);
	});

	it('declares input and output schemas for every operation', () => {
		expect(Object.keys(mailssoEndpointSchemas).sort()).toEqual([...OPERATIONS]);
		for (const operation of OPERATIONS) {
			expect(mailssoEndpointSchemas[operation].input).toBeDefined();
			expect(mailssoEndpointSchemas[operation].output).toBeDefined();
		}
	});

	it('covers every operation in the risk map, with a real description', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const operation of OPERATIONS) {
			expect(meta[operation]?.description.length).toBeGreaterThan(40);
			expect(meta[operation]?.description).not.toMatch(/example/i);
		}
	});

	it('classifies the lookups as reads and the batch as a write', () => {
		expect(meta['validations.single']?.riskLevel).toBe('read');
		expect(meta['validations.getBatch']?.riskLevel).toBe('read');
		expect(meta['validations.batch']?.riskLevel).toBe('write');
	});

	it('receives no webhooks, and claims none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-mails-signature': 'anything' },
				body: {},
			}),
		).toBe(false);
	});

	it('ends the merged error handlers with DEFAULT', () => {
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('SUBSCRIPTION_REQUIRED_ERROR');
	});

	it('runs a caller handler before DEFAULT', () => {
		const custom = mailsso({
			errorHandlers: {
				TEAPOT_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(custom.errorHandlers ?? {});

		expect(keys[0]).toBe('TEAPOT_ERROR');
		expect(keys.at(-1)).toBe('DEFAULT');
	});

	describe('keyBuilder', () => {
		it('returns the inline key before looking at the stored one', async () => {
			const keyBuilder = keyBuilderOf(mailsso({ key: 'inline-key' }));

			await expect(
				keyBuilder(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when neither exists', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
