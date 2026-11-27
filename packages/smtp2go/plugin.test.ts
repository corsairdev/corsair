import { AuthMissingError } from 'corsair/core';
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

	it('registers every advertised operation', () => {
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(smtp2goEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);

		for (const operation of OPERATIONS) {
			const entry = required(smtp2goEndpointSchemas, operation);
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const entry = required(meta, operation);
			expect(entry.description.length).toBeGreaterThan(20);
			expect(entry.description).not.toMatch(/example resource/i);
		}
	});

	it('classifies sends, removals and reads correctly', () => {
		for (const operation of [
			'email.send',
			'email.sendMime',
			'email.sendBatch',
		]) {
			const entry = required(meta, operation);
			expect([operation, entry.riskLevel]).toEqual([operation, 'write']);
			expect(entry.irreversible).toBe(true);
		}

		const destructive = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel === 'destructive',
		);
		expect(destructive).toEqual([
			'email.cancelScheduled',
			'suppressions.remove',
			'domains.remove',
			'templates.delete',
			'webhooks.remove',
		]);

		const reads = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel === 'read',
		);
		expect(reads).toHaveLength(14);
	});

	it('handles no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		// A delivery for this plugin always routes nowhere.
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
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
				keys: { get_api_key: async () => key },
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

		it('throws AuthMissingError for non-endpoint sources', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
