/**
 * Live checks against a real BigML account.
 *
 * Skipped unless BIGML_USERNAME and BIGML_API_KEY are set. Default `jest`
 * also ignores this file, so CI never reaches the network. Run with:
 *   BIGML_USERNAME=… BIGML_API_KEY=… pnpm test:live
 *
 * Source get/update also need BIGML_SOURCE_ID (a source this account owns).
 * They skip when that env is absent so an empty account still passes.
 *
 * Writes: one project is created and deleted; one external connector is
 * created without a password and deleted immediately. A configured source
 * is renamed and restored.
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
const sourceId = process.env.BIGML_SOURCE_ID;
const describeLive = username && apiKey ? describe : describe.skip;
const itSource = sourceId ? it : it.skip;

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
		if (result.objects[0]) {
			expect(BigmlProjectEntity.safeParse(result.objects[0]).success).toBe(
				true,
			);
		}
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
		expect(Array.isArray(result.objects)).toBe(true);
		if (result.objects[0]) {
			expect(BigmlSourceEntity.safeParse(result.objects[0]).success).toBe(true);
		}
	});

	itSource(
		'gets a configured source including official fields_preview object',
		async () => {
			const result = await Sources.get(ctx, { sourceId: sourceId as string });
			expect(result.resource).toBe(sourceId);
			expect(BigmlSourceEntity.safeParse(result).success).toBe(true);
			if (result.fields_preview != null) {
				expect(Array.isArray(result.fields_preview)).toBe(false);
				expect(typeof result.fields_preview).toBe('object');
			}
		},
	);

	itSource('updates a configured source name and restores it', async () => {
		const original = await Sources.get(ctx, { sourceId: sourceId as string });
		const originalName = original.name ?? 'corsair-live-source';
		try {
			const updated = await Sources.update(ctx, {
				sourceId: sourceId as string,
				name: `${originalName}-pr807`,
			});
			expect(updated.resource).toBe(sourceId);
		} finally {
			await Sources.update(ctx, {
				sourceId: sourceId as string,
				name: originalName,
			});
		}
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
