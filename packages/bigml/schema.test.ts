/**
 * Guards persisted entities against dropping a field BigML actually returns
 * and against requiring a field it omits.
 *
 * Key lists come from the official property tables and were confirmed live
 * on 2026-08-18 (GET /project, GET /source).
 */

import { BigmlSchema } from './schema';
import {
	BigmlConfigurationEntity,
	BigmlGenericResourceEntity,
	BigmlProjectEntity,
	BigmlSourceEntity,
	BigmlSourceField,
	BigmlSourceParser,
	BigmlStatus,
} from './schema/database';

describe('Bigml schema', () => {
	it('declares a semver version', () => {
		expect(BigmlSchema.version).toBeDefined();
		expect(BigmlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BigmlSchema.entities).toBe('object');
		expect(BigmlSchema.entities).not.toBeNull();
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

const PROJECT_LIVE_KEYS = [
	'category',
	'code',
	'configuration',
	'configuration_status',
	'created',
	'creator',
	'description',
	'execution_id',
	'execution_status',
	'manage_permission',
	'name',
	'name_options',
	'private',
	'resource',
	'stats',
	'status',
	'tags',
	'type',
	'updated',
	'user_metadata',
	'webhook',
] as const;

const SOURCE_LIVE_KEYS = [
	'category',
	'charset',
	'closed',
	'code',
	'configuration',
	'configuration_status',
	'content_type',
	'created',
	'creator',
	'description',
	'disable_autolabel',
	'disable_datetime',
	'field_types',
	'fields',
	'fields_meta',
	'fields_preview',
	'file_name',
	'format',
	'formats',
	'image_analysis',
	'image_id',
	'item_analysis',
	'md5',
	'name',
	'name_options',
	'number_of_anomalies',
	'number_of_anomalyscores',
	'number_of_associations',
	'number_of_associationsets',
	'number_of_centroids',
	'number_of_clusters',
	'number_of_correlations',
	'number_of_datasets',
	'number_of_deepnets',
	'number_of_ensembles',
	'number_of_forecasts',
	'number_of_linearregressions',
	'number_of_logisticregressions',
	'number_of_models',
	'number_of_optimls',
	'number_of_pca',
	'number_of_predictions',
	'number_of_projections',
	'number_of_statisticaltests',
	'number_of_timeseries',
	'number_of_topicdistributions',
	'number_of_topicmodels',
	'origin',
	'original_format',
	'parent_sources',
	'private',
	'project',
	'resource',
	'shared',
	'size',
	'source_parser',
	'sources',
	'sources_count',
	'status',
	'subscription',
	'tags',
	'term_analysis',
	'type',
	'types',
	'updated',
] as const;

describe('entity schemas declare every observed field', () => {
	it('project declares all live GET keys', () => {
		for (const key of PROJECT_LIVE_KEYS) {
			expect(BigmlProjectEntity.shape).toHaveProperty(key);
		}
	});

	it('source declares all live GET keys', () => {
		for (const key of SOURCE_LIVE_KEYS) {
			expect(BigmlSourceEntity.shape).toHaveProperty(key);
		}
	});

	it('source_parser accepts official parser keys', () => {
		expect(
			BigmlSourceParser.safeParse({
				header: true,
				json_fields: ['age'],
				json_key: 'data',
				locale: 'en_US',
				missing_tokens: ['?'],
				quote: '"',
				separator: ',',
				trim: true,
			}).success,
		).toBe(true);
	});

	it('source field accepts official Source Fields keys', () => {
		expect(
			BigmlSourceField.safeParse({
				column_number: 0,
				description: 'Employment Rate',
				label: 'Employment Rate',
				name: 'Employment Rate',
				optype: 'numeric',
				order: 0,
			}).success,
		).toBe(true);
	});

	it('status accepts official status keys', () => {
		expect(
			BigmlStatus.safeParse({
				code: 5,
				message: 'The project has been created',
				progress: 1,
			}).success,
		).toBe(true);
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

	it.each(entities)(
		'drops webhook.secret on a parsed %s entity',
		(_label, entity) => {
			const parsed = entity.parse({
				resource: 'project/abc123',
				webhook: {
					url: 'https://example.com/hook',
					secret: 's3cr3t',
					extra: 1,
				},
			});
			expect(parsed.webhook).toEqual({ url: 'https://example.com/hook' });
			expect(parsed.webhook).not.toHaveProperty('secret');
		},
	);
});

describe('source fields_preview', () => {
	it('accepts the official object-of-arrays shape, not an array', () => {
		const parsed = BigmlSourceEntity.safeParse({
			resource: 'source/abc',
			fields_preview: { '000000': ['5.1', '4.9'] },
		});
		expect(parsed.success).toBe(true);
	});
});
