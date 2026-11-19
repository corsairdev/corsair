import {
	openseoEndpointMeta,
	openseoEndpointSchemas,
	openseoEndpointsNested,
} from './endpoints/catalog';
import {
	getOpenseoInputSchema,
	getOpenseoOutputSchema,
	openseoOperationFor,
} from './endpoints/json-schema';
import {
	OpenseoManifestSchema,
	openseoManifest,
	openseoOperations,
} from './endpoints/manifest';
import { OPENSEO_OPERATION_IDS } from './endpoints/operation-types';
import {
	OpenseoEndpointInputSchemas,
	OpenseoEndpointOutputSchemas,
} from './endpoints/types';
import { OpenseoSchema } from './schema';
import { openseoEntities } from './schema/database';

const ids = openseoOperations.map((operation) => operation.id);
const PROJECT = '6f1c2a9e-3b7d-4e58-9a14-2c8b5d7e0f31';

describe('Openseo schema', () => {
	it('declares a semver version and no entities', () => {
		expect(OpenseoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(OpenseoSchema.entities).toBe(openseoEntities);
		expect(OpenseoSchema.entities).toEqual({});
	});
});

describe('openseo-manifest.json', () => {
	it('matches the manifest schema', () => {
		const result = OpenseoManifestSchema.safeParse(openseoManifest);
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('has 85 operations with unique ids and unique MCP tool names', () => {
		expect(ids).toHaveLength(85);
		expect(new Set(ids).size).toBe(ids.length);
		const tools = openseoOperations.map((operation) => operation.tool);
		expect(new Set(tools).size).toBe(tools.length);
		expect([...OPENSEO_OPERATION_IDS].sort()).toEqual([...ids].sort());
	});

	it('maps operations to their MCP tools', () => {
		expect(openseoOperationFor('keywords.research').tool).toBe(
			'research_keywords',
		);
		expect(openseoOperationFor('projects.list').tool).toBe('list_projects');
		expect(openseoOperationFor('siteAudits.delete').tool).toBe(
			'delete_site_audit',
		);
		expect(() => openseoOperationFor('keywords.nope')).toThrow(
			'OpenSEO operation is unavailable',
		);
	});

	it('drops JSON Schema keywords the plugin does not use', () => {
		const text = JSON.stringify(openseoManifest);
		expect(text).not.toContain('"$schema"');
		expect(text).not.toContain('"default"');
		expect(text).not.toContain('"pattern"');
		expect(text).not.toContain('9007199254740991');
	});
});

describe('Openseo endpoint registry', () => {
	const registered = Object.entries(openseoEndpointsNested).flatMap(
		([group, actions]) =>
			Object.keys(actions).map((action) => `${group}.${action}`),
	);

	it('registers every manifest operation with schemas and meta', () => {
		expect(registered.sort()).toEqual([...ids].sort());
		expect(Object.keys(openseoEndpointSchemas).sort()).toEqual(
			registered.sort(),
		);
		expect(Object.keys(openseoEndpointMeta).sort()).toEqual(registered.sort());
	});

	it('gives every operation a description', () => {
		for (const meta of Object.values(openseoEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(10);
		}
	});

	it('marks metered lookups as reads (R8)', () => {
		for (const id of [
			'account.whoami',
			'keywords.research',
			'keywords.metrics',
			'serp.results',
			'domains.overview',
			'backlinks.list',
			'local.rankGrid',
			'aiVisibility.researchPrompts',
			'searchConsole.performance',
		] as const) {
			expect(openseoEndpointMeta[id].riskLevel).toBe('read');
		}
	});

	it('marks saved-state changes as writes', () => {
		for (const id of [
			'projects.create',
			'keywords.save',
			'rankTracking.create',
			'reports.save',
			'siteAudits.run',
		] as const) {
			expect(openseoEndpointMeta[id].riskLevel).toBe('write');
		}
	});

	it('marks deletes, paid checks and generation, schedules, sharing and IndexNow destructive', () => {
		const destructive = Object.entries(openseoEndpointMeta)
			.filter(([, meta]) => meta.riskLevel === 'destructive')
			.map(([id]) => id)
			.sort();
		expect(destructive).toEqual(
			[
				'aiVisibility.completeResearchSetup',
				'aiVisibility.explorePrompt',
				'aiVisibility.generatePrompts',
				'aiVisibility.runCheck',
				'aiVisibility.setSchedule',
				'indexNow.submitUrls',
				'keywords.removeSaved',
				'projects.researchWebsite',
				'rankTracking.removeKeywords',
				'rankTracking.run',
				'reports.delete',
				'reports.deleteTemplate',
				'reports.setSharing',
				'siteAudits.delete',
			].sort(),
		);
		expect(openseoEndpointMeta['siteAudits.delete']).toMatchObject({
			irreversible: true,
		});
		expect(
			openseoEndpointMeta['aiVisibility.explorePrompt'],
		).not.toHaveProperty('irreversible');
	});

	it('builds schemas lazily through getters on the schema entries', () => {
		const entry = openseoEndpointSchemas['keywords.research'];
		expect(entry.input).toBe(getOpenseoInputSchema('keywords.research'));
		expect(entry.output).toBe(getOpenseoOutputSchema('keywords.research'));
		expect(OpenseoEndpointInputSchemas['serp.results']).toBe(
			getOpenseoInputSchema('serp.results'),
		);
		expect(Object.keys(OpenseoEndpointOutputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('builds an input and output schema for every operation', () => {
		for (const id of ids) {
			expect(typeof getOpenseoInputSchema(id).safeParse).toBe('function');
			expect(typeof getOpenseoOutputSchema(id).safeParse).toBe('function');
		}
	});
});

describe('request schemas', () => {
	const research = () => getOpenseoInputSchema('keywords.research');

	it('requires documented required fields', () => {
		expect(research().safeParse({}).success).toBe(false);
		expect(
			research().safeParse({ projectId: PROJECT, seeds: [{ seed: 'coffee' }] })
				.success,
		).toBe(true);
	});

	it('keeps item limits, number constants and integer checks', () => {
		const seeds = Array.from({ length: 6 }, (_, i) => ({ seed: `s${i}` }));
		expect(research().safeParse({ projectId: PROJECT, seeds }).success).toBe(
			false,
		);
		expect(
			research().safeParse({ projectId: PROJECT, seeds: [] }).success,
		).toBe(false);
		expect(
			research().safeParse({
				projectId: PROJECT,
				seeds: [{ seed: 'x' }],
				resultLimit: 300,
			}).success,
		).toBe(true);
		expect(
			research().safeParse({
				projectId: PROJECT,
				seeds: [{ seed: 'x' }],
				resultLimit: 200,
			}).success,
		).toBe(false);
		expect(
			research().safeParse({
				projectId: PROJECT,
				seeds: [{ seed: 'x', locationCode: 2840.5 }],
			}).success,
		).toBe(false);
	});

	it('keeps multipleOf (SERP depth is a multiple of 10)', () => {
		const serp = getOpenseoInputSchema('serp.results');
		const base = { projectId: PROJECT, queries: [{ keyword: 'coffee' }] };
		expect(serp.safeParse({ ...base, depth: 20 }).success).toBe(true);
		expect(serp.safeParse({ ...base, depth: 15 }).success).toBe(false);
		expect(serp.safeParse({ ...base, depth: 110 }).success).toBe(false);
	});

	it('keeps closed enums', () => {
		const overview = getOpenseoInputSchema('domains.overview');
		expect(
			overview.safeParse({
				projectId: PROJECT,
				domain: 'example.com',
				scope: 'subdomains',
			}).success,
		).toBe(true);
		expect(
			overview.safeParse({
				projectId: PROJECT,
				domain: 'example.com',
				scope: 'galaxy',
			}).success,
		).toBe(false);
	});

	it('takes type lists (number or string) and nullable fields', () => {
		const backlinks = getOpenseoInputSchema('backlinks.list');
		for (const value of [10, '10']) {
			expect(
				backlinks.safeParse({
					projectId: PROJECT,
					target: 'example.com',
					filters: { minDomainRank: value },
				}).success,
			).toBe(true);
		}
		expect(
			backlinks.safeParse({
				projectId: PROJECT,
				target: 'example.com',
				filters: { minDomainRank: true },
			}).success,
		).toBe(false);
		expect(
			getOpenseoInputSchema('aiVisibility.getResults').safeParse({
				projectId: PROJECT,
				runId: null,
			}).success,
		).toBe(true);
	});

	it('rejects unknown fields where the tool schema is closed', () => {
		const pages = getOpenseoInputSchema('googleAnalytics.organicLandingPages');
		expect(pages.safeParse({ projectId: PROJECT }).success).toBe(true);
		expect(pages.safeParse({ projectId: PROJECT, extra: 1 }).success).toBe(
			false,
		);
	});

	it('takes the union shapes of project memory updates', () => {
		const update = getOpenseoInputSchema('projects.updateContext');
		expect(
			update.safeParse({
				projectId: PROJECT,
				updates: [
					{ brandName: 'Acme' },
					{ section: 'current_goal', content: 'Grow signups' },
					{ removeCompetitors: ['example.com'] },
				],
			}).success,
		).toBe(true);
		expect(
			update.safeParse({
				projectId: PROJECT,
				updates: [{ section: 'nope', content: 'x' }],
			}).success,
		).toBe(false);
	});
});

describe('response schemas', () => {
	const whoami = () => getOpenseoOutputSchema('account.whoami');

	it('accepts nulls, missing fields and unknown fields', () => {
		expect(whoami().safeParse({}).success).toBe(true);
		expect(
			whoami().safeParse({ creditsRemaining: null, brandNew: [1] }).success,
		).toBe(true);
	});

	it('still checks the declared types', () => {
		expect(whoami().safeParse({ scopes: 'mcp' }).success).toBe(false);
		expect(whoami().safeParse({ creditsRemaining: '12' }).success).toBe(false);
		expect(whoami().safeParse(null).success).toBe(false);
	});

	it('keeps enums open but of their declared type', () => {
		expect(whoami().safeParse({ mode: 'hosted' }).success).toBe(true);
		expect(whoami().safeParse({ mode: 'new-mode' }).success).toBe(true);
		expect(whoami().safeParse({ mode: 3 }).success).toBe(false);
	});

	it('checks integers in responses too', () => {
		const run = getOpenseoOutputSchema('aiVisibility.getRun');
		const ok = run.safeParse({ status: 'success', data: { pending: 1 } });
		const bad = run.safeParse({ status: 'success', data: { pending: 1.5 } });
		expect(ok.error?.issues ?? []).toEqual([]);
		expect(bad.success).toBe(false);
	});

	it('matches each result row to its own branch by its const discriminator', () => {
		const serp = getOpenseoOutputSchema('serp.results');
		const okRow = { keyword: 'coffee', ok: true, items: [] };
		const errorRow = { keyword: 'coffee', ok: false, error: 'UPSTREAM' };
		expect(serp.safeParse({ results: [okRow, errorRow] }).success).toBe(true);
		// A success row with a wrongly typed field can't pass as an error row.
		expect(
			serp.safeParse({ results: [{ ...okRow, items: 'not-an-array' }] })
				.success,
		).toBe(false);
		// The discriminator is required: a row without it matches neither branch.
		expect(
			serp.safeParse({ results: [{ keyword: 'coffee', items: [] }] }).success,
		).toBe(false);
		const research = getOpenseoOutputSchema('keywords.research');
		expect(
			research.safeParse({ results: [{ seed: 'x', ok: true, rows: 'bad' }] })
				.success,
		).toBe(false);
		expect(
			research.safeParse({ results: [{ seed: 'x', ok: false, error: 'E' }] })
				.success,
		).toBe(true);
	});

	it('parses the live list_projects shape and passes unknown fields through', () => {
		const parsed = getOpenseoOutputSchema('projects.list').parse({
			projects: [
				{
					id: PROJECT,
					name: 'acme.com',
					domain: 'acme.com',
					locationCode: 2840,
					languageCode: 'en',
					url: `https://app.openseo.so/p/${PROJECT}`,
				},
			],
			meta: { url: 'https://app.openseo.so/' },
			newField: 'x',
		}) as { projects: Array<{ id: string }>; newField?: string };
		expect(parsed.projects[0]?.id).toBe(PROJECT);
		expect(parsed.newField).toBe('x');
	});
});
