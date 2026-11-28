import type { RawWebhookRequest } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { generatedEndpointMeta } from './endpoints/generated';
import type { Smtp2goKeyBuilderContext } from './index';
import { smtp2go, smtp2goEndpointSchemas } from './index';

const OPERATIONS = [
	'email.send',
	'email.sendMime',
	'email.sendBatch',
	'email.searchSent',
	'email.searchScheduled',
	'email.cancelScheduled',
	'activity.search',
	'suppressions.list',
	'suppressions.add',
	'suppressions.remove',
	'domains.list',
	'domains.add',
	'domains.verify',
	'domains.remove',
	'stats.bounces',
	'stats.cycle',
	'stats.spam',
	'stats.unsubscribes',
	'stats.history',
	'stats.summary',
	'templates.list',
	'templates.view',
	'templates.add',
	'templates.edit',
	'templates.delete',
	'webhooks.list',
	'webhooks.add',
	'webhooks.edit',
	'webhooks.remove',
] as const;

// The 29 hand-written operations above and the 40 generated ones: all 69
// operations of SMTP2GO's API reference.
const ALL_OPERATIONS = [
	...OPERATIONS,
	...Object.keys(generatedEndpointMeta),
].sort();

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type KeyBuilder = (
	ctx: Smtp2goKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Reads a key that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

// unknown: the endpoints literal is generic at the type level; tests read
// its group and operation names as strings.
function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('smtp2go plugin', () => {
	const plugin = smtp2go();
	// unknown: the meta map is typed generically; tests read single fields.
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>;

	it('registers all 69 operations of the API reference', () => {
		expect(ALL_OPERATIONS).toHaveLength(69);
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			ALL_OPERATIONS,
		);
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(smtp2goEndpointSchemas).sort()).toEqual(ALL_OPERATIONS);

		for (const operation of ALL_OPERATIONS) {
			const entry = required(smtp2goEndpointSchemas, operation);
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of ALL_OPERATIONS) {
			const entry = required(meta, operation);
			expect(entry.description.length).toBeGreaterThan(20);
			expect(entry.description).not.toMatch(/example resource/i);
		}
	});

	it('marks sends, deletions and credential changes destructive', () => {
		for (const operation of [
			'email.send',
			'email.sendMime',
			'email.sendBatch',
			'sms.send',
			'singleSenders.add',
			'apiKeys.add',
			'apiKeys.remove',
			'smtpUsers.remove',
			'subaccounts.close',
		]) {
			expect([operation, required(meta, operation).riskLevel]).toEqual([
				operation,
				'destructive',
			]);
		}
		for (const operation of [
			'email.send',
			'email.sendMime',
			'email.sendBatch',
		]) {
			expect(required(meta, operation).irreversible).toBe(true);
		}
		const reads = ALL_OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel === 'read',
		);
		expect(reads).toHaveLength(28);
		for (const operation of reads) {
			expect(operation).toMatch(
				/\.(list|search\w*|view|get\w*|permissions|summary|cycle|bounces|spam|unsubscribes|history|listReceived|listSent)$/,
			);
		}
	});

	it('handles email and SMS webhook events', () => {
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual([
			'email.event',
			'sms.event',
		]);
		const other = { headers: {}, body: { event: 'push' } } as RawWebhookRequest;
		expect(plugin.pluginWebhookMatcher?.(other)).toBe(false);
		const delivered = {
			headers: {},
			body: { event: 'delivered' },
		} as RawWebhookRequest;
		expect(plugin.pluginWebhookMatcher?.(delivered)).toBe(true);
	});

	it('offers api_key auth only', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	describe('keyBuilder', () => {
		// unknown: keyBuilder is typed through the plugin's generic options.
		const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
			candidate.keyBuilder as KeyBuilder;
		const keyContext = (key?: string) =>
			// unknown: the fixture only implements the one accessor the
			// keyBuilder reads; a full AccountKeyManager is not needed.
			({
				authType: 'api_key',
				keys: {
					get_api_key: async () => key,
					get_webhook_signature: async () => 'stored-webhook-token',
				},
			}) as unknown as Smtp2goKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const configured = smtp2go({ key: 'inline-key' });
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
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('gives webhooks the auth header value, from the option first', async () => {
			await expect(
				keyBuilderOf(smtp2go({ webhookSecret: 'option-token' }))(
					keyContext('stored-key'),
					'webhook',
				),
			).resolves.toBe('option-token');
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).resolves.toBe('stored-webhook-token');
		});
	});
});
