/**
 * Exercises every one of the 45 catalog endpoint wrappers: the HTTP method
 * and path each one builds, the cache writes/evictions they perform, and
 * what reaches the event log. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Configurations,
	ExternalConnectors,
	GenericResources,
	Projects,
	Sources,
} from './endpoints';
import { compact } from './endpoints/shared';
import { bigmlEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

const GENERIC_STORE_KEYS = [
	'anomalies',
	'anomalyScores',
	'associationSets',
	'associations',
	'batchAnomalyScores',
	'batchCentroids',
	'batchPredictions',
	'batchProjections',
	'batchTopicDistributions',
	'centroids',
	'clusters',
	'composites',
	'correlations',
	'datasets',
	'deepnets',
	'ensembles',
	'evaluations',
	'executions',
	'forecasts',
	'fusions',
	'libraries',
	'linearRegressions',
	'logisticRegressions',
	'models',
	'optimls',
	'pcas',
	'predictions',
	'projections',
	'samples',
	'scripts',
	'statisticalTests',
	'timeSeries',
	'topicDistributions',
	'topicModels',
] as const;

type Ctx = Parameters<typeof Projects.list>[0];

function makeCtx() {
	const db = {
		projects: makeStore(),
		sources: makeStore(),
		configurations: makeStore(),
	} as Record<
		| 'projects'
		| 'sources'
		| 'configurations'
		| (typeof GENERIC_STORE_KEYS)[number],
		Store
	>;
	for (const key of GENERIC_STORE_KEYS) db[key] = makeStore();

	const ctx = {
		key: 'test-bigml-key',
		options: { username: 'testuser' },
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

/**
 * One response body serving every operation: carries every entity's common
 * fields (confirmed live on real project/source captures) plus the `meta`/
 * `objects` list envelope every list endpoint here uses. Every entity
 * schema requires only `resource`, so unrelated extra fields on this shared
 * body are harmless.
 */
const ENTITY = {
	resource: 'project/000000000000000000000e1',
	name: 'Test Resource',
	category: 0,
	code: 200,
	created: '2026-01-01T00:00:00.000000',
	updated: '2026-01-01T00:00:00.000000',
	creator: 'testuser',
	description: '',
	private: true,
	project: null,
	shared: false,
	tags: [],
	status: { code: 5, message: 'done', progress: 1 },
	type: 0,
	source: 'postgresql',
	connection: { host: 'db.example.com', user: 'realuser', password: 's3cr3t' },
};

const RESPONSE_BODY = {
	...ENTITY,
	meta: { limit: 20, offset: 0, total_count: 1, next: null, previous: null },
	objects: [ENTITY],
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected path] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'projects.create',
		(c) => Projects.create(c, { name: 'Acme' }),
		'POST',
		'/andromeda/project',
	],
	[
		'projects.get',
		(c) => Projects.get(c, { projectId: 'project/p1' }),
		'GET',
		'/andromeda/project/p1',
	],
	[
		'projects.delete',
		(c) => Projects.remove(c, { projectId: 'project/p1' }),
		'DELETE',
		'/andromeda/project/p1',
	],
	['projects.list', (c) => Projects.list(c, {}), 'GET', '/andromeda/project'],

	[
		'sources.get',
		(c) => Sources.get(c, { sourceId: 'source/s1' }),
		'GET',
		'/andromeda/source/s1',
	],
	[
		'sources.update',
		(c) => Sources.update(c, { sourceId: 'source/s1', name: 'Renamed' }),
		'PUT',
		'/andromeda/source/s1',
	],
	['sources.list', (c) => Sources.list(c, {}), 'GET', '/andromeda/source'],

	[
		'externalConnectors.create',
		(c) =>
			ExternalConnectors.create(c, {
				source: 'postgresql',
				connection: { host: 'db.example.com' },
			}),
		'POST',
		'/andromeda/externalconnector',
	],
	[
		'externalConnectors.get',
		(c) =>
			ExternalConnectors.get(c, {
				externalConnectorId: 'externalconnector/e1',
			}),
		'GET',
		'/andromeda/externalconnector/e1',
	],

	[
		'configurations.get',
		(c) => Configurations.get(c, { configurationId: 'configuration/c1' }),
		'GET',
		'/andromeda/configuration/c1',
	],
	[
		'configurations.list',
		(c) => Configurations.list(c, {}),
		'GET',
		'/andromeda/configuration',
	],

	[
		'anomalies.list',
		(c) => GenericResources.anomaliesList(c, {}),
		'GET',
		'/andromeda/anomaly',
	],
	[
		'anomalyScores.list',
		(c) => GenericResources.anomalyScoresList(c, {}),
		'GET',
		'/andromeda/anomalyscore',
	],
	[
		'associationSets.list',
		(c) => GenericResources.associationSetsList(c, {}),
		'GET',
		'/andromeda/associationset',
	],
	[
		'associations.list',
		(c) => GenericResources.associationsList(c, {}),
		'GET',
		'/andromeda/association',
	],
	[
		'batchAnomalyScores.list',
		(c) => GenericResources.batchAnomalyScoresList(c, {}),
		'GET',
		'/andromeda/batchanomalyscore',
	],
	[
		'batchCentroids.list',
		(c) => GenericResources.batchCentroidsList(c, {}),
		'GET',
		'/andromeda/batchcentroid',
	],
	[
		'batchPredictions.list',
		(c) => GenericResources.batchPredictionsList(c, {}),
		'GET',
		'/andromeda/batchprediction',
	],
	[
		'batchProjections.list',
		(c) => GenericResources.batchProjectionsList(c, {}),
		'GET',
		'/andromeda/batchprojection',
	],
	[
		'batchTopicDistributions.list',
		(c) => GenericResources.batchTopicDistributionsList(c, {}),
		'GET',
		'/andromeda/batchtopicdistribution',
	],
	[
		'centroids.list',
		(c) => GenericResources.centroidsList(c, {}),
		'GET',
		'/andromeda/centroid',
	],
	[
		'clusters.list',
		(c) => GenericResources.clustersList(c, {}),
		'GET',
		'/andromeda/cluster',
	],
	[
		'composites.list',
		(c) => GenericResources.compositesList(c, {}),
		'GET',
		'/andromeda/composite',
	],
	[
		'correlations.list',
		(c) => GenericResources.correlationsList(c, {}),
		'GET',
		'/andromeda/correlation',
	],
	[
		'datasets.list',
		(c) => GenericResources.datasetsList(c, {}),
		'GET',
		'/andromeda/dataset',
	],
	[
		'deepnets.list',
		(c) => GenericResources.deepnetsList(c, {}),
		'GET',
		'/andromeda/deepnet',
	],
	[
		'ensembles.list',
		(c) => GenericResources.ensemblesList(c, {}),
		'GET',
		'/andromeda/ensemble',
	],
	[
		'evaluations.list',
		(c) => GenericResources.evaluationsList(c, {}),
		'GET',
		'/andromeda/evaluation',
	],
	[
		'executions.list',
		(c) => GenericResources.executionsList(c, {}),
		'GET',
		'/andromeda/execution',
	],
	[
		'forecasts.list',
		(c) => GenericResources.forecastsList(c, {}),
		'GET',
		'/andromeda/forecast',
	],
	[
		'fusions.list',
		(c) => GenericResources.fusionsList(c, {}),
		'GET',
		'/andromeda/fusion',
	],
	[
		'libraries.list',
		(c) => GenericResources.librariesList(c, {}),
		'GET',
		'/andromeda/library',
	],
	[
		'linearRegressions.list',
		(c) => GenericResources.linearRegressionsList(c, {}),
		'GET',
		'/andromeda/linearregression',
	],
	[
		'logisticRegressions.list',
		(c) => GenericResources.logisticRegressionsList(c, {}),
		'GET',
		'/andromeda/logisticregression',
	],
	[
		'models.list',
		(c) => GenericResources.modelsList(c, {}),
		'GET',
		'/andromeda/model',
	],
	[
		'optimls.list',
		(c) => GenericResources.optimlsList(c, {}),
		'GET',
		'/andromeda/optiml',
	],
	[
		'pcas.list',
		(c) => GenericResources.pcasList(c, {}),
		'GET',
		'/andromeda/pca',
	],
	[
		'predictions.list',
		(c) => GenericResources.predictionsList(c, {}),
		'GET',
		'/andromeda/prediction',
	],
	[
		'projections.list',
		(c) => GenericResources.projectionsList(c, {}),
		'GET',
		'/andromeda/projection',
	],
	[
		'samples.list',
		(c) => GenericResources.samplesList(c, {}),
		'GET',
		'/andromeda/sample',
	],
	[
		'scripts.list',
		(c) => GenericResources.scriptsList(c, {}),
		'GET',
		'/andromeda/script',
	],
	[
		'statisticalTests.list',
		(c) => GenericResources.statisticalTestsList(c, {}),
		'GET',
		'/andromeda/statisticaltest',
	],
	[
		'timeSeries.list',
		(c) => GenericResources.timeSeriesList(c, {}),
		'GET',
		'/andromeda/timeseries',
	],
	[
		'topicDistributions.list',
		(c) => GenericResources.topicDistributionsList(c, {}),
		'GET',
		'/andromeda/topicdistribution',
	],
	[
		'topicModels.list',
		(c) => GenericResources.topicModelsList(c, {}),
		'GET',
		'/andromeda/topicmodel',
	],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every catalog operation the plugin registers', () => {
		const registered = Object.keys(bigmlEndpointSchemas).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(45);
	});
});

describe('caching', () => {
	it('mirrors a fetched project under its bare `resource` value', async () => {
		const { ctx, db } = makeCtx();
		await Projects.get(ctx, { projectId: 'project/000000000000000000000e1' });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'project/000000000000000000000e1',
			expect.objectContaining({ resource: 'project/000000000000000000000e1' }),
		);
	});

	it('evicts a project by the same id it was deleted with', async () => {
		const { ctx, db } = makeCtx();
		await Projects.remove(ctx, { projectId: 'project/p1' });

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('project/p1');
	});

	it('mirrors every item returned by a generic list endpoint under its own store', async () => {
		const { ctx, db } = makeCtx();
		await GenericResources.datasetsList(ctx, {});
		await GenericResources.modelsList(ctx, {});

		expect(db.datasets.upsertByEntityId).toHaveBeenCalledWith(
			'project/000000000000000000000e1',
			expect.anything(),
		);
		expect(db.models.upsertByEntityId).toHaveBeenCalledWith(
			'project/000000000000000000000e1',
			expect.anything(),
		);
	});

	/**
	 * `'externalConnectors' in db` alone only proves that key was never added
	 * to the mock - it says nothing about whether the handler wrote the
	 * connector into some *other* store by mistake (a copy-paste error, for
	 * instance). This asserts no write reached any of the 37 stores this
	 * plugin's `ctx.db` actually has, which would fail on either kind of
	 * regression.
	 */
	it('never caches an external connector - its `connection` field carries a live credential', async () => {
		const { ctx, db } = makeCtx();
		await ExternalConnectors.create(ctx, {
			source: 'postgresql',
			connection: { host: 'db.example.com', user: 'u', password: 'p' },
		});
		await ExternalConnectors.get(ctx, {
			externalConnectorId: 'externalconnector/e1',
		});

		expect('externalConnectors' in db).toBe(false);
		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});
});

describe('event log', () => {
	it('never logs an external connector connection, even though the call site never named it', async () => {
		const { ctx } = makeCtx();
		await ExternalConnectors.create(ctx, {
			source: 'postgresql',
			connection: {
				host: 'db.example.com',
				user: 'realuser',
				password: 's3cr3t',
			},
		});

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(payload).toEqual(expect.objectContaining({ source: 'postgresql' }));
		expect(JSON.stringify(payload)).not.toContain('s3cr3t');
		expect(JSON.stringify(payload)).not.toContain('realuser');
		expect(JSON.stringify(payload)).not.toContain('"connection"');
	});

	/**
	 * `logging.ts`'s `NEVER_LOG_VALUE` denies `connection` by name as a second,
	 * independent guarantee alongside `externalConnectors.create` never
	 * selecting it as an identifier key. This proves the deny-list itself still
	 * works, by passing `connection` as an identifier key directly rather than
	 * relying only on the call site never doing so.
	 */
	it('strips connection from an event even when a call site names it as an identifier', async () => {
		const { auditPayload } = jest.requireActual('./endpoints/logging');
		const payload = auditPayload(
			{ connection: { password: 'p' }, source: 'postgresql' },
			['connection', 'source'],
		);
		expect(payload).toEqual({ source: 'postgresql', fields: ['source'] });
	});
});

describe('request bodies', () => {
	it('sends project creation fields, dropping unset optionals', async () => {
		const { ctx } = makeCtx();
		await Projects.create(ctx, { name: 'Acme' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Acme' });
	});

	it('sends only the supplied source update fields', async () => {
		const { ctx } = makeCtx();
		await Sources.update(ctx, { sourceId: 'source/s1', name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
	});

	/**
	 * The catalog's own description names "parsing configuration" and "field
	 * properties" for this operation - confirmed live (see
	 * `endpoints/types.ts`'s `SourcesUpdateInputSchema` doc comment) as
	 * `source_parser` and `fields`. This proves both are actually sent, snake
	 * cased, not silently dropped by an input schema that only modelled the
	 * three easy metadata fields.
	 */
	it('sends parsing configuration and per-field property updates, snake_cased', async () => {
		const { ctx } = makeCtx();
		await Sources.update(ctx, {
			sourceId: 'source/s1',
			sourceParser: { separator: ';', locale: 'en_US', missingTokens: ['NA'] },
			fields: { '100002': { name: 'renamed_field', optype: 'text' } },
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({
			source_parser: {
				separator: ';',
				locale: 'en_US',
				missing_tokens: ['NA'],
			},
			fields: { '100002': { name: 'renamed_field', optype: 'text' } },
		});
	});

	it('sends the connector type at the top level, alongside connection', async () => {
		const { ctx } = makeCtx();
		await ExternalConnectors.create(ctx, {
			source: 'postgresql',
			connection: { host: 'db.example.com', port: 5432 },
			name: 'My DB',
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({
			source: 'postgresql',
			connection: { host: 'db.example.com', port: 5432 },
			name: 'My DB',
		});
	});

	it('sends official engine when that is the create field provided', async () => {
		const { ctx } = makeCtx();
		await ExternalConnectors.create(ctx, {
			engine: 'postgresql',
			connection: { host: 'db.example.com' },
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({
			source: 'postgresql',
			engine: 'postgresql',
			connection: { host: 'db.example.com' },
		});
	});

	it('never sends limit/offset as literal undefined query params', async () => {
		const { ctx } = makeCtx();
		await Projects.list(ctx, {});

		const url = new URL(lastUrl);
		expect(url.searchParams.has('limit')).toBe(false);
		expect(url.searchParams.has('offset')).toBe(false);
	});

	it('sends limit/offset when supplied', async () => {
		const { ctx } = makeCtx();
		await Sources.list(ctx, { limit: 5, offset: 10 });

		const url = new URL(lastUrl);
		expect(url.searchParams.get('limit')).toBe('5');
		expect(url.searchParams.get('offset')).toBe('10');
	});

	/**
	 * The catalog promises "filtering, ordering, and pagination" on most list
	 * operations - `orderBy`/`filter` are the ordering and filtering half,
	 * confirmed live (see `endpoints/types.ts`'s `PageParams` doc comment).
	 * This proves they actually reach the query string, not just that the
	 * schema accepts them.
	 */
	it('sends orderBy as order_by and spreads filter fields into the query string', async () => {
		const { ctx } = makeCtx();
		await Sources.list(ctx, {
			orderBy: '-size',
			filter: { name: 'Acme upload', size__gt: 1024 },
		});

		const url = new URL(lastUrl);
		expect(url.searchParams.get('order_by')).toBe('-size');
		expect(url.searchParams.get('name')).toBe('Acme upload');
		expect(url.searchParams.get('size__gt')).toBe('1024');
		expect(url.searchParams.has('filter')).toBe(false);
	});

	/**
	 * `filter`'s value type (`string | number | boolean`) is the same shape
	 * `limit`/`offset`/`order_by` take, so a `filter` object that happens to
	 * contain one of those keys is a plausible mistake, not just an
	 * adversarial input. It must never win over the caller's real pagination
	 * args - `endpoints/shared.ts`'s `listQuery` spreads `filter` first for
	 * exactly this reason.
	 */
	it('never lets a filter field override the reserved limit/offset/orderBy params', async () => {
		const { ctx } = makeCtx();
		await Sources.list(ctx, {
			limit: 20,
			offset: 0,
			orderBy: 'size',
			filter: { limit: 5, offset: 999, order_by: 'name' },
		});

		const url = new URL(lastUrl);
		expect(url.searchParams.get('limit')).toBe('20');
		expect(url.searchParams.get('offset')).toBe('0');
		expect(url.searchParams.get('order_by')).toBe('size');
	});

	it('copies an own __proto__ key without changing the result prototype', () => {
		const input = Object.create(null) as Record<string, unknown>;
		input.__proto__ = { polluted: true };
		input.name = 'x';
		const result = compact(input);
		expect(Object.getPrototypeOf(result)).toBeNull();
		expect(Object.hasOwn(result, '__proto__')).toBe(true);
		expect(Object.prototype).not.toHaveProperty('polluted');
	});
});
