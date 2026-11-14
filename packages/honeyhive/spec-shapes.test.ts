import {
	ConfigurationsCreateInputSchema,
	DatasetsAddDatapointsInputSchema,
	DatasetsCreateInputSchema,
	DatasetsUpdateLegacyInputSchema,
	EventSearchInputSchema,
	EventUpdateInputSchema,
	ExperimentsCompareResponseSchema,
	ExperimentsCreateRunInputSchema,
	ExperimentsGetSummaryResponseSchema,
	ExperimentsListRunsResponseSchema,
	ExperimentsUpdateRunInputSchema,
	MetricsCreateInputSchema,
	MetricsUpdateInputSchema,
	SessionCreateResponseSchema,
} from './endpoints/types';

// Shapes from HoneyHive's data plane OpenAPI spec (honeyhiveai/honeyhive-openapi, v1.17.0).
describe('HoneyHive request shapes match the API', () => {
	it('takes datapoint IDs as dataset membership', () => {
		expect(
			DatasetsCreateInputSchema.safeParse({
				project_id: 'p',
				name: 'ds',
				datapoints: ['dp-1'],
			}).success,
		).toBe(true);
		expect(
			DatasetsUpdateLegacyInputSchema.safeParse({
				dataset_id: 'd',
				datapoints: ['dp-1'],
			}).success,
		).toBe(true);
	});

	it('takes column-name arrays in a datapoint mapping', () => {
		expect(
			DatasetsAddDatapointsInputSchema.safeParse({
				project_id: 'p',
				dataset_id: 'd',
				data: [{ question: 'q', answer: 'a' }],
				mapping: { inputs: ['question'], ground_truth: ['answer'] },
			}).success,
		).toBe(true);
	});

	it('takes run results as an object', () => {
		expect(
			ExperimentsCreateRunInputSchema.safeParse({
				project_id: 'p',
				name: 'run',
				results: { accuracy: 0.9 },
			}).success,
		).toBe(true);
		expect(
			ExperimentsUpdateRunInputSchema.safeParse({
				project_id: 'p',
				run_id: 'r',
				results: { accuracy: 0.9 },
			}).success,
		).toBe(true);
	});

	it('takes an integer scale, threshold object, category objects and a filters wrapper', () => {
		const body = {
			name: 'm',
			type: 'PYTHON',
			criteria: 'def f(e): return 1',
			scale: 5,
			threshold: { min: 0.8 },
			categories: [{ category: 'pass', score: 1 }],
			filters: { filterArray: [] },
		};
		expect(MetricsCreateInputSchema.safeParse(body).success).toBe(true);
		expect(
			MetricsUpdateInputSchema.safeParse({ metric_id: 'm1', scale: 5 }).success,
		).toBe(true);
	});

	it('takes a list of environments on a configuration', () => {
		expect(
			ConfigurationsCreateInputSchema.safeParse({
				name: 'cfg',
				provider: 'openai',
				parameters: {},
				env: ['dev', 'prod'],
			}).success,
		).toBe(true);
	});

	it('takes the filter value type on event search (live run, 11-15)', () => {
		expect(
			EventSearchInputSchema.safeParse({
				project_id: 'p',
				filters: [
					{ field: 'session_id', operator: 'is', value: 's-1', type: 'string' },
				],
			}).success,
		).toBe(true);
	});

	it('rejects event_name on event update, which HoneyHive ignores', () => {
		expect(
			EventUpdateInputSchema.safeParse({ event_id: 'e', event_name: 'x' })
				.success,
		).toBe(false);
	});
});

describe('HoneyHive response shapes match the API', () => {
	it('parses metric names in a run list', () => {
		expect(
			ExperimentsListRunsResponseSchema.safeParse({
				evaluations: [],
				pagination: { page: 1 },
				metrics: ['accuracy'],
			}).success,
		).toBe(true);
	});

	it('parses passed/failed datapoint IDs and event_details lists in a summary', () => {
		expect(
			ExperimentsGetSummaryResponseSchema.safeParse({
				status: 'completed',
				success: true,
				passed: ['dp-1'],
				failed: [],
				metrics: {},
				datapoints: [],
				event_details: [],
				run_object: {},
			}).success,
		).toBe(true);
	});

	it('parses a run comparison', () => {
		expect(
			ExperimentsCompareResponseSchema.safeParse({
				metrics: [{ metric_name: 'accuracy' }],
				commonDatapoints: ['dp-1'],
				event_details: [],
				old_run: {},
				new_run: {},
			}).success,
		).toBe(true);
	});

	it('parses a session start with null fields', () => {
		expect(
			SessionCreateResponseSchema.safeParse({
				event_id: 'e',
				session_id: 's',
				event_type: null,
				event_name: null,
				parent_id: null,
				config: null,
				duration: null,
				org_id: 'o',
				workspace_id: 'w',
				project_id: 'p',
			}).success,
		).toBe(true);
	});
});
