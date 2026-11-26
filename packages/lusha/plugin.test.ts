import { AuthMissingError } from 'corsair/core';
import type { LushaKeyBuilderContext } from './index';
import { lusha, lushaEndpointSchemas } from './index';

const RISK_LEVELS = {
	'account.getAccountUsage': 'read',
	'auditLogs.getStats': 'read',
	'auditLogs.list': 'read',
	'company.enrichCompanies': 'destructive',
	'company.getCompanyFilterTypes': 'read',
	'company.getCompanyFilterValues': 'read',
	'company.getCompanyIcpFitScores': 'destructive',
	'company.getCompanyLookalikes': 'destructive',
	'company.getCompanyRecommendationFilters': 'read',
	'company.getCompanyRecommendations': 'destructive',
	'company.getCompanySignalFilterValues': 'read',
	'company.getCompanySignalFilters': 'read',
	'company.getCompanySignalScores': 'destructive',
	'company.getCompanySignalTypes': 'read',
	'company.getCompanySignals': 'destructive',
	'company.getWebsiteVisits': 'destructive',
	'company.prospectCompanies': 'destructive',
	'company.searchAndEnrichCompanies': 'destructive',
	'company.searchCompanies': 'destructive',
	'companyTables.addEntities': 'destructive',
	'companyTables.create': 'write',
	'companyTables.delete': 'destructive',
	'companyTables.get': 'read',
	'companyTables.getColumnCatalog': 'read',
	'companyTables.list': 'read',
	'companyTables.listEntities': 'destructive',
	'companyTables.removeColumn': 'destructive',
	'companyTables.removeEntities': 'destructive',
	'companyTables.runColumn': 'destructive',
	'companyTables.update': 'write',
	'contactTables.addColumns': 'write',
	'contactTables.addEntities': 'write',
	'contactTables.create': 'write',
	'contactTables.delete': 'destructive',
	'contactTables.get': 'read',
	'contactTables.getColumnCatalog': 'read',
	'contactTables.list': 'read',
	'contactTables.listColumns': 'read',
	'contactTables.listEntities': 'destructive',
	'contactTables.removeColumn': 'destructive',
	'contactTables.removeEntities': 'destructive',
	'contactTables.runColumn': 'destructive',
	'contactTables.update': 'write',
	'conversations.getTranscript': 'destructive',
	'conversations.search': 'destructive',
	'icp.listProfiles': 'read',
	'jobs.getContactsEnrichJob': 'read',
	'person.enrichContacts': 'destructive',
	'person.getBuyingGroup': 'destructive',
	'person.getContactFilterTypes': 'read',
	'person.getContactFilterValues': 'read',
	'person.getContactIcpFitScores': 'destructive',
	'person.getContactLookalikes': 'destructive',
	'person.getContactRecommendationFilters': 'read',
	'person.getContactRecommendations': 'destructive',
	'person.getContactSignalScores': 'destructive',
	'person.getContactSignalTypes': 'read',
	'person.getContactSignals': 'destructive',
	'person.prospectContacts': 'destructive',
	'person.searchAndEnrichContacts': 'destructive',
	'person.searchContacts': 'destructive',
	'subscriptions.create': 'destructive',
	'subscriptions.createOptOut': 'write',
	'subscriptions.delete': 'destructive',
	'subscriptions.get': 'read',
	'subscriptions.list': 'read',
	'subscriptions.test': 'write',
	'subscriptions.update': 'write',
} as const;

const OPERATIONS = Object.keys(RISK_LEVELS) as (keyof typeof RISK_LEVELS)[];

/** Every operation that charges credits or changes Lusha data. */
const DESTRUCTIVE = OPERATIONS.filter(
	(name) => RISK_LEVELS[name] === 'destructive',
);

// unknown: only the keys are walked, so the endpoint function type is never used.
type NestedMap = Record<string, Record<string, unknown>>;
type KeyBuilder = (
	ctx: LushaKeyBuilderContext,
	source: string,
) => Promise<string>;

function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('lusha plugin', () => {
	const plugin = lusha();
	type MetaEntry = { riskLevel: string; description: string; job?: unknown };
	// unknown: endpointMeta's exact generic type varies with the plugin tree,
	// and only the two string fields are read.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		MetaEntry | undefined
	>;

	/** Reads a meta entry that must exist, so a missing one fails loudly. */
	function required(name: string): MetaEntry {
		const entry = meta[name];
		if (!entry) throw new Error(`no endpointMeta for ${name}`);
		return entry;
	}
	// unknown: keyBuilder's parameterised type resolves to never on a
	// concretely instantiated plugin, so the cast pins the call signature.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	it('registers the lusha id and api_key auth', () => {
		expect(plugin.id).toBe('lusha');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers every advertised operation', () => {
		// unknown: the endpoint tree's function type varies with the plugin
		// generic, and only the group and operation keys are walked.
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(lushaEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = lushaEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('covers all 68 operations of the public reference', () => {
		// 70 in docs.lusha.com/openapi.json, less the two that return the
		// account's webhook signing secret.
		expect(OPERATIONS).toHaveLength(68);
	});

	it('sets the risk level of every operation', () => {
		for (const operation of OPERATIONS) {
			expect([operation, required(operation).riskLevel]).toEqual([
				operation,
				RISK_LEVELS[operation],
			]);
		}
	});

	it('names the cost on every credit-charging operation', () => {
		const charging = DESTRUCTIVE.filter(
			(name) => !/\.(delete|remove\w*)$/.test(name),
		);
		for (const operation of charging) {
			expect([operation, required(operation).description]).toEqual([
				operation,
				expect.stringMatching(/charge|credit|billing/i),
			]);
		}
		// account.usage and the job poll are free, and say so.
		expect(required('account.getAccountUsage').description).toMatch(/Free/);
		expect(required('jobs.getContactsEnrichJob').description).toMatch(/Free/);
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const entry = required(operation);
			expect(entry.description.length).toBeGreaterThan(20);
			expect(entry.description).not.toMatch(/example resource/i);
			expect(entry.description).not.toMatch(/TODO/);
		}
	});

	it('receives no webhooks', () => {
		// unknown: the webhook map's value type varies with the plugin generic,
		// and only the keys are asserted on.
		expect(Object.keys(plugin.webhooks as Record<string, unknown>)).toEqual([]);
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('exposes no stored entities', () => {
		// Lusha reads cost credits on every call, so nothing is synced.
		expect(plugin.schema?.entities).toEqual({});
	});

	describe('keyBuilder', () => {
		const keyContext = (key?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => key },
			}) as unknown as LushaKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const configured = lusha({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when neither key exists', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
