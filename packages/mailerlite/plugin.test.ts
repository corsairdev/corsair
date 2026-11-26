import { AuthMissingError } from 'corsair/core';
import type { MailerLiteKeyBuilderContext } from './index';
import { mailerlite, mailerLiteEndpointSchemas } from './index';

const OPERATIONS = [
	'campaigns.activity',
	'campaigns.cancel',
	'campaigns.create',
	'campaigns.list',
	'campaigns.schedule',
	'fields.list',
	'groups.create',
	'groups.delete',
	'groups.list',
	'subscribers.addToGroup',
	'subscribers.delete',
	'subscribers.get',
	'subscribers.list',
	'subscribers.removeFromGroup',
	'subscribers.update',
	'subscribers.upsert',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type KeyBuilder = (
	ctx: MailerLiteKeyBuilderContext,
	source: string,
) => Promise<string>;

function flatten(endpoints: Record<string, unknown>): string[] { // unknown: only keys are walked, handler leaf types never used
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) { // unknown: keys only, no leaf types
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('mailerlite plugin definition', () => {
	const plugin = mailerlite();
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>; // unknown: meta map is generic in core, narrowed per entry

	it('registers as mailerlite with api_key auth only', () => {
		expect(plugin.id).toBe('mailerlite');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers exactly the sixteen operations', () => {
		// unknown: only the keys are walked, never the handler leaf type.
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual([ // unknown: keys only, no leaf types
			...OPERATIONS,
		]);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(mailerLiteEndpointSchemas).sort()).toEqual([...OPERATIONS]);
		for (const schemas of Object.values(mailerLiteEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	/** Reads a meta entry that must exist, so a missing one fails the test. */
	function metaOf(name: string): EndpointMeta {
		const entry = meta[name];
		if (!entry) throw new Error(`Expected "${name}" in endpointMeta`);
		return entry;
	}

	it('marks the two deletes destructive and irreversible', () => {
		expect(metaOf('subscribers.delete')).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(metaOf('groups.delete')).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
	});

	it('marks every other operation read or write, none destructive', () => {
		for (const [name, entry] of Object.entries(meta)) {
			if (name === 'subscribers.delete' || name === 'groups.delete') continue;
			expect(['read', 'write']).toContain(entry.riskLevel);
			expect(entry.irreversible).toBeUndefined();
		}
		// schedule stays a write: a scheduled campaign can still be cancelled
		// until sending starts, and campaigns.cancel exists for exactly that.
		expect(metaOf('campaigns.schedule').riskLevel).toBe('write');
		expect(metaOf('campaigns.schedule').description).toContain(
			'emails real recipients',
		);
	});

	it('describes every operation beyond a bare label', () => {
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
			expect(name).toBe(name.trim());
		}
	});

	it('declares no webhooks, because no inbound deliveries are handled', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(false);
	});
});

describe('mailerlite keyBuilder', () => {
	const plugin = mailerlite();
	// unknown: keyBuilder is read off the plugin object, whose type hides it.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder => // unknown: read off the plugin object, whose type hides it
		candidate.keyBuilder as KeyBuilder;

	// A fixture only implements get_api_key; a full AccountKeyManager carries
	// get_dek, issue_new_dek and the rest, so the cast is required.
	const keyContext = (key?: string) =>
		// unknown: a test only implements get_api_key, so the fixture cannot
		// satisfy the full AccountKeyManager type.
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as unknown as MailerLiteKeyBuilderContext; // unknown: fixture implements one key-manager method only

	it('returns the explicitly configured key', async () => {
		const configured = mailerlite({ key: 'inline-key' });
		await expect(
			keyBuilderOf(configured)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	// Failing open would send an empty bearer token and surface the provider's
	// generic 401 instead of Corsair's disconnected-auth flow.
	it('throws AuthMissingError when no key is available', async () => {
		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, because there are no webhooks', async () => {
		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
