import { BigmlSchema } from './schema';
import {
	BigmlConfigurationEntity,
	BigmlGenericResourceEntity,
	BigmlProjectEntity,
	BigmlSourceEntity,
} from './schema/database';

describe('Bigml schema', () => {
	it('declares a semver version', () => {
		expect(BigmlSchema.version).toBeDefined();
		expect(BigmlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BigmlSchema.entities).toBe('object');
		expect(BigmlSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BigmlSchema.entities))).toBe(true);
		for (const entity of Object.values(BigmlSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('declares exactly the 37 entities this plugin registers', () => {
		expect(Object.keys(BigmlSchema.entities).sort()).toEqual(
			[
				'projects',
				'sources',
				'configurations',
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
			].sort(),
		);
	});

	it('does not register externalConnectors - it is deliberately never cached', () => {
		expect('externalConnectors' in BigmlSchema.entities).toBe(false);
	});
});

describe('entity primary keys', () => {
	const entities = [
		['project', BigmlProjectEntity],
		['source', BigmlSourceEntity],
		['configuration', BigmlConfigurationEntity],
		['generic resource', BigmlGenericResourceEntity],
	] as const;

	it.each(entities)(
		'requires only `resource` on a %s entity',
		(_label, entity) => {
			expect(entity.safeParse({ resource: 'project/abc123' }).success).toBe(
				true,
			);
			expect(entity.safeParse({}).success).toBe(false);
		},
	);

	it.each(entities)('is `.loose()` on a %s entity', (_label, entity) => {
		const parsed = entity.safeParse({
			resource: 'project/abc123',
			some_undeclared_field: 'kept',
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(
				(parsed.data as Record<string, unknown>).some_undeclared_field,
			).toBe('kept');
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
