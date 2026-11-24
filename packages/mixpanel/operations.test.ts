import { packMixpanelKey } from './client';
import { mixpanelEndpointsNested } from './endpoints';

// One mocked call per operation: the request each one sends (method, host and
// path) and that a documented answer passes its output schema.

const fetchMock = jest.fn();
const realFetch = global.fetch;

const ctx = {
	key: packMixpanelKey({
		username: 'svc.abc.mp-service-account',
		secret: 'svc-secret-123456',
		projectId: 11,
		region: 'us',
		projectToken: 'project-token-123456',
		gdprToken: 'gdpr-token-123456',
	}),
	$getAccountId: async () => {
		throw new Error('no account in unit tests');
	},
} as never;

const D = { from_date: '2026-11-01', to_date: '2026-11-02' };
const W = { workspace_id: 77 };
const ORG = { organization_id: 9 };
const FLAG = {
	...W,
	name: 'n',
	key: 'k',
	tags: [],
	context: 'distinct_id',
	serving_method: 'remote_or_local' as const,
	ruleset: { variants: [], rollout: [] },
};
const WH = { warehouse_source_id: 5, table_params: { table_name: 't' } };

const API = 'https://api.mixpanel.com';
const Q = 'https://mixpanel.com/api/query';
const APP = 'https://mixpanel.com/api/app';
const DATA = 'https://data.mixpanel.com/api/2.0';
const PLAT = 'https://platform-us.mixpanel.com';

// [operation, input, method, url without query, answer (default {})]
// unknown: inputs and answers differ per operation.
const cases: [string, unknown, string, string, unknown?][] = [
	[
		'events.import',
		{
			events: [
				{
					event: 'e',
					properties: { time: 1, distinct_id: 'u', $insert_id: 'i-1' },
				},
			],
		},
		'POST',
		`${API}/import`,
	],
	['events.track', { events: [{ event: 'e' }] }, 'POST', `${API}/track`],
	[
		'events.counts',
		{ events: ['e'], type: 'general', unit: 'day', ...D },
		'GET',
		`${Q}/events`,
	],
	['events.top', { type: 'general' }, 'GET', `${Q}/events/top`],
	['events.names', { type: 'general' }, 'GET', `${Q}/events/names`, []],
	[
		'events.propertyCounts',
		{ event: 'e', name: 'p', type: 'unique', unit: 'day', ...D },
		'GET',
		`${Q}/events/properties`,
	],
	['events.topProperties', { event: 'e' }, 'GET', `${Q}/events/properties/top`],
	[
		'events.topPropertyValues',
		{ event: 'e', name: 'p' },
		'GET',
		`${Q}/events/properties/values`,
		[],
	],
	[
		'identity.createIdentity',
		{ identified_id: 'a', anon_id: 'b' },
		'POST',
		`${API}/track`,
	],
	[
		'identity.createAlias',
		{ distinct_id: 'a', alias: 'b' },
		'POST',
		`${API}/track`,
	],
	['identity.merge', { distinct_ids: ['a', 'b'] }, 'POST', `${API}/import`],
	[
		'profiles.query',
		{},
		'POST',
		`${Q}/engage`,
		{ results: [], page: 0, page_size: 1000 },
	],
	[
		'profiles.activity',
		{ distinct_ids: ['u'], ...D },
		'GET',
		`${Q}/stream/query`,
	],
	[
		'profiles.set',
		{ distinct_id: 'u', $set: { a: 1 } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.setOnce',
		{ distinct_id: 'u', $set_once: { a: 1 } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.increment',
		{ distinct_id: 'u', $add: { a: 1 } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.union',
		{ distinct_id: 'u', $union: { a: [1] } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.append',
		{ distinct_id: 'u', $append: { a: 1 } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.remove',
		{ distinct_id: 'u', $remove: { a: 1 } },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.unset',
		{ distinct_id: 'u', $unset: ['a'] },
		'POST',
		`${API}/engage`,
	],
	[
		'profiles.batchUpdate',
		{ updates: [{ $distinct_id: 'u', $set: { a: 1 } }] },
		'POST',
		`${API}/engage`,
	],
	['profiles.delete', { distinct_id: 'u' }, 'POST', `${API}/engage`],
	[
		'groups.set',
		{ group_key: 'c', group_id: 'g', $set: { a: 1 } },
		'POST',
		`${API}/groups`,
	],
	[
		'groups.setOnce',
		{ group_key: 'c', group_id: 'g', $set_once: { a: 1 } },
		'POST',
		`${API}/groups`,
	],
	[
		'groups.union',
		{ group_key: 'c', group_id: 'g', $union: { a: [1] } },
		'POST',
		`${API}/groups`,
	],
	[
		'groups.remove',
		{ group_key: 'c', group_id: 'g', $remove: { a: 1 } },
		'POST',
		`${API}/groups`,
	],
	[
		'groups.unset',
		{ group_key: 'c', group_id: 'g', $unset: ['a'] },
		'POST',
		`${API}/groups`,
	],
	[
		'groups.batchUpdate',
		{ updates: [{ $group_key: 'c', $group_id: 'g', $set: { a: 1 } }] },
		'POST',
		`${API}/groups`,
	],
	['groups.delete', { group_key: 'c', group_id: 'g' }, 'POST', `${API}/groups`],
	['lookupTables.list', {}, 'GET', `${API}/lookup-tables`],
	[
		'lookupTables.replace',
		{ id: 'lt1', csv: 'id,name\n1,a' },
		'PUT',
		`${API}/lookup-tables/lt1`,
	],
	['insights.query', { bookmark_id: 5 }, 'GET', `${Q}/insights`],
	[
		'insights.run',
		{ metrics: [{ type: 'event' }], time: { start: '2026-11-01' } },
		'POST',
		`${Q}/insights/query`,
	],
	['funnels.query', { funnel_id: 3, ...D }, 'GET', `${Q}/funnels`],
	['funnels.list', {}, 'GET', `${Q}/funnels/list`, []],
	['retention.query', { ...D, born_event: 'e' }, 'GET', `${Q}/retention`],
	[
		'retention.frequency',
		{ ...D, unit: 'week', addiction_unit: 'day' },
		'GET',
		`${Q}/retention/addiction`,
	],
	['segmentation.query', { event: 'e', ...D }, 'GET', `${Q}/segmentation`],
	[
		'segmentation.numeric',
		{ event: 'e', on: 'properties["n"]', ...D },
		'GET',
		`${Q}/segmentation/numeric`,
	],
	[
		'segmentation.sum',
		{ event: 'e', on: 'properties["n"]', ...D },
		'GET',
		`${Q}/segmentation/sum`,
	],
	[
		'segmentation.average',
		{ event: 'e', on: 'properties["n"]', ...D },
		'GET',
		`${Q}/segmentation/average`,
	],
	['cohorts.list', {}, 'POST', `${Q}/cohorts/list`, []],
	['jql.run', { script: 'function main() {}' }, 'POST', `${Q}/jql`, []],
	['export.events', D, 'GET', `${DATA}/export`, ''],
	['annotations.list', {}, 'GET', `${APP}/projects/11/annotations`],
	[
		'annotations.get',
		{ annotation_id: 4 },
		'GET',
		`${APP}/projects/11/annotations/4`,
	],
	[
		'annotations.create',
		{ date: '2026-11-01 00:00:00', description: 'd' },
		'POST',
		`${APP}/projects/11/annotations`,
	],
	[
		'annotations.update',
		{ annotation_id: 4, description: 'x' },
		'PATCH',
		`${APP}/projects/11/annotations/4`,
	],
	[
		'annotations.delete',
		{ annotation_id: 4 },
		'DELETE',
		`${APP}/projects/11/annotations/4`,
	],
	[
		'annotations.listTags',
		{},
		'GET',
		`${APP}/projects/11/annotations/tags`,
		[],
	],
	[
		'annotations.createTag',
		{ name: 't' },
		'POST',
		`${APP}/projects/11/annotations/tags`,
	],
	['lexicon.list', {}, 'GET', `${APP}/projects/11/schemas`],
	[
		'lexicon.listForEntity',
		{ entity_type: 'event' },
		'GET',
		`${APP}/projects/11/schemas/event`,
	],
	[
		'lexicon.get',
		{ entity_type: 'event', name: 'e' },
		'GET',
		`${APP}/projects/11/schemas/event/e`,
	],
	[
		'lexicon.upsert',
		{ entity_type: 'event', name: 'e', schema: {} },
		'POST',
		`${APP}/projects/11/schemas/event/e`,
	],
	[
		'lexicon.upsertMany',
		{ entries: [{ entityType: 'event', name: 'e', schemaJson: {} }] },
		'POST',
		`${APP}/projects/11/schemas`,
	],
	[
		'lexicon.delete',
		{ entity_type: 'event', name: 'e' },
		'DELETE',
		`${APP}/projects/11/schemas/event/e`,
	],
	[
		'lexicon.deleteForEntity',
		{ entity_type: 'profile' },
		'DELETE',
		`${APP}/projects/11/schemas/profile`,
	],
	['lexicon.deleteAll', {}, 'DELETE', `${APP}/projects/11/schemas`],
	[
		'serviceAccounts.list',
		ORG,
		'GET',
		`${APP}/organizations/9/service-accounts`,
	],
	[
		'serviceAccounts.listForProject',
		{},
		'GET',
		`${APP}/projects/11/service-accounts`,
	],
	[
		'serviceAccounts.get',
		{ ...ORG, service_account_id: 3 },
		'GET',
		`${APP}/organizations/9/service-accounts/3`,
	],
	[
		'serviceAccounts.create',
		{ ...ORG, username: 'bot' },
		'POST',
		`${APP}/organizations/9/service-accounts`,
	],
	[
		'serviceAccounts.delete',
		{ ...ORG, service_account_id: 3 },
		'DELETE',
		`${APP}/organizations/9/service-accounts/3`,
	],
	[
		'serviceAccounts.addToProjects',
		{ ...ORG, service_account_ids: [3], projects: [{ id: 11, role: 'admin' }] },
		'POST',
		`${APP}/organizations/9/service-accounts/add-to-project`,
	],
	[
		'serviceAccounts.removeFromProjects',
		{ ...ORG, projects: [{ id: 11, service_account_ids: [3] }] },
		'POST',
		`${APP}/organizations/9/service-accounts/remove-from-project`,
	],
	[
		'gdpr.createRetrieval',
		{ distinct_ids: ['u'] },
		'POST',
		`${APP}/data-retrievals/v3.0`,
	],
	[
		'gdpr.getRetrieval',
		{ tracking_id: 't1' },
		'GET',
		`${APP}/data-retrievals/v3.0/t1`,
	],
	[
		'gdpr.createDeletion',
		{ distinct_ids: ['u'] },
		'POST',
		`${APP}/data-deletions/v3.0`,
	],
	[
		'gdpr.getDeletion',
		{ tracking_id: 't1' },
		'GET',
		`${APP}/data-deletions/v3.0/t1`,
	],
	[
		'gdpr.cancelDeletion',
		{ tracking_id: 't1' },
		'DELETE',
		`${APP}/data-deletions/v3.0/t1`,
	],
	[
		'featureFlags.list',
		W,
		'GET',
		`${APP}/projects/11/workspaces/77/feature-flags`,
	],
	[
		'featureFlags.get',
		{ ...W, flag_id: 'f' },
		'GET',
		`${APP}/projects/11/workspaces/77/feature-flags/f`,
	],
	[
		'featureFlags.create',
		FLAG,
		'POST',
		`${APP}/projects/11/workspaces/77/feature-flags`,
	],
	[
		'featureFlags.update',
		{ ...FLAG, flag_id: 'f' },
		'PUT',
		`${APP}/projects/11/workspaces/77/feature-flags/f`,
	],
	[
		'featureFlags.delete',
		{ ...W, flag_id: 'f' },
		'DELETE',
		`${APP}/projects/11/workspaces/77/feature-flags/f`,
	],
	['featureFlags.evaluate', { distinct_id: 'u' }, 'GET', `${API}/flags`],
	['featureFlags.definitions', {}, 'GET', `${API}/flags/definitions`],
	['experiments.list', W, 'GET', `${APP}/workspaces/77/experiments`],
	[
		'experiments.get',
		{ ...W, experiment_id: 'x' },
		'GET',
		`${APP}/workspaces/77/experiments/x`,
	],
	[
		'experiments.create',
		{ ...W, name: 'n' },
		'POST',
		`${APP}/workspaces/77/experiments`,
	],
	[
		'experiments.update',
		{ ...W, experiment_id: 'x', name: 'm' },
		'PATCH',
		`${APP}/workspaces/77/experiments/x`,
	],
	[
		'experiments.delete',
		{ ...W, experiment_id: 'x' },
		'DELETE',
		`${APP}/workspaces/77/experiments/x`,
	],
	[
		'experiments.archive',
		{ ...W, experiment_id: 'x' },
		'POST',
		`${APP}/workspaces/77/experiments/x/archive`,
	],
	[
		'experiments.unarchive',
		{ ...W, experiment_id: 'x' },
		'DELETE',
		`${APP}/workspaces/77/experiments/x/archive`,
	],
	[
		'experiments.launch',
		{ ...W, experiment_id: 'x' },
		'PUT',
		`${APP}/workspaces/77/experiments/x/launch`,
	],
	[
		'experiments.decide',
		{ ...W, experiment_id: 'x', success: true },
		'PATCH',
		`${APP}/workspaces/77/experiments/x/decide`,
	],
	[
		'experiments.forceConclude',
		{ ...W, experiment_id: 'x' },
		'PUT',
		`${APP}/workspaces/77/experiments/x/force_conclude`,
	],
	[
		'warehouseImports.list',
		{},
		'GET',
		`${APP}/projects/11/warehouse-sources/imports`,
	],
	[
		'warehouseImports.get',
		{ import_id: 2 },
		'GET',
		`${APP}/projects/11/warehouse-sources/imports/2`,
	],
	[
		'warehouseImports.update',
		{ import_id: 2, paused: true, run_every: 0 },
		'PATCH',
		`${APP}/projects/11/warehouse-sources/imports/2`,
	],
	[
		'warehouseImports.delete',
		{ import_id: 2 },
		'DELETE',
		`${APP}/projects/11/warehouse-sources/imports/2`,
	],
	[
		'warehouseImports.createEventStream',
		{ ...WH, time_column_name: 'ts', sync_mode: 'time_based' },
		'POST',
		`${APP}/projects/11/warehouse-sources/imports/event-stream`,
	],
	[
		'warehouseImports.createPeople',
		{ ...WH, user_column_name: 'u', sync_mode: 'full_sync' },
		'POST',
		`${APP}/projects/11/warehouse-sources/imports/people`,
	],
	[
		'warehouseImports.createGroups',
		{ ...WH, group_key: 'c', group_id_column: 'id', sync_mode: 'full_sync' },
		'POST',
		`${APP}/projects/11/warehouse-sources/imports/groups`,
	],
	[
		'warehouseImports.createLookupTable',
		{
			...WH,
			mixpanel_property: { value: 'p', resourceType: 'Events' },
			property_key_column_name: 'k',
			sync_mode: 'full_sync',
		},
		'POST',
		`${APP}/projects/11/warehouse-sources/imports/lookup-table`,
	],
	[
		'warehouseImports.run',
		{ import_id: 2 },
		'PUT',
		`${APP}/projects/11/warehouse-sources/imports/2/manual-sync`,
	],
	[
		'warehouseImports.history',
		{ import_id: 2 },
		'GET',
		`${APP}/projects/11/warehouse-sources/imports/2/history`,
	],
	['pipelines.list', {}, 'GET', `${DATA}/nessie/pipeline/jobs`, []],
	[
		'pipelines.create',
		{
			type: 'gcs-raw',
			trial: true,
			settings: { gcs_bucket: 'b', gcs_region: 'us' },
		},
		'POST',
		`${DATA}/nessie/pipeline/create`,
	],
	[
		'pipelines.edit',
		{ name: 'p1', where: 'x' },
		'POST',
		`${DATA}/nessie/pipeline/edit`,
	],
	[
		'pipelines.delete',
		{ name: 'p1' },
		'POST',
		`${DATA}/nessie/pipeline/cancel`,
	],
	['pipelines.pause', { name: 'p1' }, 'POST', `${DATA}/nessie/pipeline/pause`],
	[
		'pipelines.resume',
		{ name: 'p1' },
		'POST',
		`${DATA}/nessie/pipeline/resume`,
	],
	['pipelines.status', { name: 'p1' }, 'GET', `${DATA}/nessie/pipeline/status`],
	[
		'pipelines.timeline',
		{ name: 'p1' },
		'GET',
		`${DATA}/nessie/pipeline/timeline`,
		[],
	],
	[
		'dataDefinitions.list',
		{},
		'GET',
		`${PLAT}/v1/projects/11/data-definitions`,
		{ results: [] },
	],
	[
		'dataDefinitions.get',
		{ definition_id: 'd1' },
		'GET',
		`${PLAT}/v1/projects/11/data-definitions/d1`,
	],
	[
		'dataDefinitions.create',
		{ type: 'event', name: 'e' },
		'POST',
		`${PLAT}/v1/projects/11/data-definitions`,
	],
	[
		'dataDefinitions.update',
		{ ...W, definition_id: 'd1', hidden: true },
		'PATCH',
		`${PLAT}/v1/workspaces/77/data-definitions/d1`,
	],
	[
		'dataDefinitions.delete',
		{ definition_id: 'd1' },
		'DELETE',
		`${PLAT}/v1/projects/11/data-definitions/d1`,
	],
	[
		'dataDefinitions.merge',
		{ type: 'event', canonical: 'a', sources: ['b'] },
		'POST',
		`${PLAT}/v1/projects/11/data-definitions/merge`,
	],
	[
		'dataDefinitions.unmerge',
		{ type: 'event', canonical: 'a' },
		'POST',
		`${PLAT}/v1/projects/11/data-definitions/unmerge`,
	],
	[
		'dataDefinitionTags.list',
		{},
		'GET',
		`${PLAT}/v1/projects/11/data-definition-tags`,
		{ results: [] },
	],
	[
		'dataDefinitionTags.get',
		{ tag_id: 't1' },
		'GET',
		`${PLAT}/v1/projects/11/data-definition-tags/t1`,
	],
	[
		'dataDefinitionTags.create',
		{ name: 't' },
		'POST',
		`${PLAT}/v1/projects/11/data-definition-tags`,
	],
	[
		'dataDefinitionTags.rename',
		{ tag_id: 't1', name: 'u' },
		'PATCH',
		`${PLAT}/v1/projects/11/data-definition-tags/t1`,
	],
	[
		'dataDefinitionTags.delete',
		{ tag_id: 't1' },
		'DELETE',
		`${PLAT}/v1/projects/11/data-definition-tags/t1`,
	],
	[
		'auditLogs.query',
		{ ...ORG, types: ['login'] },
		'POST',
		`${PLAT}/v1/organizations/9/audit-logs/query`,
		{ results: [] },
	],
];

// unknown: walks the endpoint tree structurally.
function operation(name: string) {
	return name
		.split('.')
		.reduce<unknown>(
			(node, part) => (node as Record<string, unknown>)[part],
			mixpanelEndpointsNested,
		) as (c: never, input: unknown) => Promise<unknown>;
}

// unknown: walks the endpoint tree structurally.
function allPaths(tree: unknown, prefix = ''): string[] {
	return Object.entries(tree as Record<string, unknown>).flatMap(([k, v]) =>
		typeof v === 'function' ? [`${prefix}${k}`] : allPaths(v, `${prefix}${k}.`),
	);
}

beforeAll(() => {
	global.fetch = fetchMock as never;
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => {
	global.fetch = realFetch;
});

it('covers every operation', () => {
	expect(cases.map(([name]) => name).sort()).toEqual(
		allPaths(mixpanelEndpointsNested).sort(),
	);
});

// Every row padded to five entries: jest hands a shorter row's callback a
// done function in the missing slot and then waits for it.
const rows = cases.map(
	([name, input, method, url, answer]) =>
		[name, input, method, url, answer ?? null] as const,
);

it.each(rows)(
	'%s sends %s and parses its answer',
	async (name, input, method, url, answer) => {
		fetchMock.mockReset();
		const body = answer ?? {};
		fetchMock.mockResolvedValueOnce(
			new Response(typeof body === 'string' ? body : JSON.stringify(body), {
				status: 200,
				headers: {
					'content-type':
						typeof body === 'string' ? 'text/plain' : 'application/json',
				},
			}),
		);
		await operation(name)(ctx, input);
		const [sentUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(sentUrl.split('?')[0]).toBe(url);
		expect(init.method).toBe(method);
	},
);
