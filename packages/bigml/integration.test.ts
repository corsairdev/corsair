/**
 * Live checks against a real BigML account.
 *
 * Skipped unless BIGML_USERNAME and BIGML_API_KEY are set. Default `jest`
 * also ignores this file, so CI never reaches the network. Run with:
 *   BIGML_USERNAME=… BIGML_API_KEY=… pnpm test:live
 *
 * Writes: one project is created and deleted; one external connector is
 * created without a password and deleted immediately.
 */
import { BigmlAPIError, makeBigmlRequest } from './client';
import {
	Configurations,
	ExternalConnectors,
	GenericResources,
	Projects,
	Sources,
} from './endpoints';
import { GENERIC_LIST_OPS } from './endpoints/types';
import {
	BigmlConfigurationEntity,
	BigmlExternalConnectorEntity,
	BigmlGenericResourceEntity,
	BigmlProjectEntity,
	BigmlSourceEntity,
} from './schema/database';

const username = process.env.BIGML_USERNAME;
const apiKey = process.env.BIGML_API_KEY;
const describeLive = username && apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Projects.list>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	const db: Record<string, ReturnType<typeof makeStore>> = {
		projects: makeStore(),
		sources: makeStore(),
		configurations: makeStore(),
	};
	for (const key of [
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
	]) {
		db[key] = makeStore();
	}

	return {
		key: apiKey ?? '',
		options: { username: username ?? '' },
		db,
		$getAccountId: async () => 'live-account',
	} as unknown as Ctx;
}

describeLive('BigML live API', () => {
	const ctx = makeCtx();

	it('lists projects matching the official project schema', async () => {
		const result = await Projects.list(ctx, { limit: 5 });
		expect(Array.isArray(result.objects)).toBe(true);
		expect(result.meta.total_count).toBeGreaterThan(0);
		expect(BigmlProjectEntity.safeParse(result.objects[0]).success).toBe(true);
	});

	it('gets a project by resource id', async () => {
		const listed = await Projects.list(ctx, { limit: 1 });
		const id = listed.objects[0]?.resource;
		expect(id).toMatch(/^project\//);
		if (!id) throw new Error('expected a project');
		const result = await Projects.get(ctx, { projectId: id });
		expect(result.resource).toBe(id);
		expect(BigmlProjectEntity.safeParse(result).success).toBe(true);
	});

	it('creates, gets, and deletes a project', async () => {
		const created = await Projects.create(ctx, {
			name: 'corsair-pr807-live',
			description: 'temporary live check',
			tags: ['corsair-live'],
			category: 0,
		});
		expect(created.resource).toMatch(/^project\//);
		expect(created.name).toBe('corsair-pr807-live');

		try {
			const fetched = await Projects.get(ctx, {
				projectId: created.resource,
			});
			expect(fetched.resource).toBe(created.resource);
		} finally {
			await Projects.remove(ctx, { projectId: created.resource });
		}

		await expect(
			Projects.get(ctx, { projectId: created.resource }),
		).rejects.toMatchObject({ status: 404 });
	});

	it('lists sources matching the official source schema', async () => {
		const result = await Sources.list(ctx, { limit: 5 });
		expect(result.meta.total_count).toBeGreaterThan(0);
		expect(BigmlSourceEntity.safeParse(result.objects[0]).success).toBe(true);
	});

	it('gets a source including official fields_preview object', async () => {
		const listed = await Sources.list(ctx, { limit: 1, filter: { type: 0 } });
		const id = listed.objects[0]?.resource;
		expect(id).toMatch(/^source\//);
		if (!id) throw new Error('expected a source');
		const result = await Sources.get(ctx, { sourceId: id });
		expect(BigmlSourceEntity.safeParse(result).success).toBe(true);
		if (result.fields_preview != null) {
			expect(Array.isArray(result.fields_preview)).toBe(false);
			expect(typeof result.fields_preview).toBe('object');
		}
	});

	it('updates a closed source name with PUT 202', async () => {
		const listed = await Sources.list(ctx, { limit: 1 });
		const source = listed.objects[0];
		if (!source?.resource) throw new Error('expected a source');
		const result = await Sources.update(ctx, {
			sourceId: source.resource,
			name: source.name ?? 'corsair-live-source',
		});
		expect(result.resource).toBe(source.resource);
	});

	it('strips credentials from list pagination links', async () => {
		const result = await Sources.list(ctx, { limit: 1 });
		const next = result.meta.next;
		if (typeof next === 'string') {
			expect(next).not.toContain('api_key=');
			expect(next).not.toContain('username=');
		}
	});

	it('lists configurations with the official envelope', async () => {
		const result = await Configurations.list(ctx, { limit: 1 });
		expect(Array.isArray(result.objects)).toBe(true);
		if (result.objects[0]) {
			expect(
				BigmlConfigurationEntity.safeParse(result.objects[0]).success,
			).toBe(true);
		}
	});

	it('creates, gets, and deletes an external connector without a password', async () => {
		const created = await ExternalConnectors.create(ctx, {
			source: 'elasticsearch',
			connection: { hosts: ['localhost:9200'] },
			name: 'corsair-pr807-live-connector',
		});
		expect(created.resource).toMatch(/^externalconnector\//);
		expect(BigmlExternalConnectorEntity.safeParse(created).success).toBe(true);

		try {
			const fetched = await ExternalConnectors.get(ctx, {
				externalConnectorId: created.resource,
			});
			expect(fetched.resource).toBe(created.resource);
			expect(fetched.source).toBe('elasticsearch');
		} finally {
			await makeBigmlRequest(created.resource, username ?? '', apiKey ?? '', {
				method: 'DELETE',
			});
		}
	});

	it.each(GENERIC_LIST_OPS)('lists %s with the shared envelope', async (op) => {
		const result = await GenericResources[op](ctx, { limit: 1 });
		expect(Array.isArray(result.objects)).toBe(true);
		if (result.objects[0]) {
			expect(
				BigmlGenericResourceEntity.safeParse(result.objects[0]).success,
			).toBe(true);
		}
	});

	it('rejects a bad api key with 401', async () => {
		await expect(
			makeBigmlRequest('project', username ?? '', 'wrong-key', {
				query: { limit: 1 },
			}),
		).rejects.toBeInstanceOf(BigmlAPIError);
		try {
			await makeBigmlRequest('project', username ?? '', 'wrong-key', {
				query: { limit: 1 },
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BigmlAPIError);
			expect((error as BigmlAPIError).status).toBe(401);
		}
	});
});
