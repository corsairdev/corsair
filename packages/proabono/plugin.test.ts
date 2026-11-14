import { AuthMissingError } from 'corsair/core';
import type { ProabonoKeyBuilderContext } from './index';
import { proabono, proabonoAuthConfig, proabonoEndpointSchemas } from './index';

const OPERATIONS = [
	'customers.create',
	'customers.get',
	'customers.list',
	'customers.update',
	'customers.anonymize',
	'customers.invalidate',
	'customers.suspend',
	'offers.list',
	'offers.get',
	'features.list',
	'features.get',
	'subscriptions.create',
	'subscriptions.get',
	'subscriptions.list',
	'subscriptions.start',
	'subscriptions.suspend',
	'subscriptions.terminate',
	'subscriptions.upgrade',
	'subscriptions.updateTerm',
	'usages.list',
	'usages.get',
	'usages.increment',
	'usages.update',
	'balanceLines.create',
	'balanceLines.list',
	'invoices.list',
	'invoices.get',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: ProabonoKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Values only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): ProabonoKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys: {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: async () => apiKey,
			set_api_key: async () => {},
			get_agent_key: async () => 'agent-key',
			set_agent_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
		},
	} as Untyped as ProabonoKeyBuilderContext;
}

/** Every dot-notation path in the nested endpoint tree. */
function flatten(endpoints: Record<string, Untyped>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, Untyped>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('proabono plugin', () => {
	const plugin = proabono();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('proabono');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks, since ProAbono notifies through its own portal', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across six groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'customers',
			'offers',
			'features',
			'subscriptions',
			'usages',
			'balanceLines',
			'invoices',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks the erasure irreversible, since anonymization cannot be undone', () => {
		expect(meta['customers.anonymize']?.riskLevel).toBe('destructive');
		expect(meta['customers.anonymize']?.irreversible).toBe(true);
	});

	it('marks the operations that begin or change billing destructive', () => {
		expect(meta['subscriptions.create']?.riskLevel).toBe('destructive');
		expect(meta['subscriptions.terminate']?.riskLevel).toBe('destructive');
		expect(meta['subscriptions.upgrade']?.riskLevel).toBe('destructive');
		// Starting a subscription begins charging it, so it is not a plain write.
		expect(meta['subscriptions.start']?.riskLevel).toBe('destructive');
	});

	it('keeps a suspension at write, since it is reversible', () => {
		expect(meta['subscriptions.suspend']?.riskLevel).toBe('write');
		expect(meta['customers.suspend']?.riskLevel).toBe('write');
	});

	it('keeps every read-only operation a read', () => {
		for (const path of [
			'customers.get',
			'customers.list',
			'offers.list',
			'offers.get',
			'features.list',
			'features.get',
			'subscriptions.get',
			'subscriptions.list',
			'usages.list',
			'usages.get',
			'balanceLines.list',
			'invoices.list',
			'invoices.get',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = proabonoEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares agent_key as an account field, since Basic auth needs both halves', () => {
		expect(proabonoAuthConfig).toEqual({
			api_key: { account: ['agent_key'] },
		});
	});
});

describe('proabono keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(proabono({ apiKey: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(proabono())(keyBuilderContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(proabono())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(proabono({ apiKey: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
