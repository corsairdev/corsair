import {
	ConfigurationsCreateInputSchema,
	ConfigurationsCreateResponseSchema,
	ConfigurationsDeleteInputSchema,
	ConfigurationsListInputSchema,
	ConfigurationsUpdateInputSchema,
	DatasetsAddDatapointsInputSchema,
	DatasetsCreateInputSchema,
	DatasetsCreateResponseSchema,
	DatasetsDeleteInputSchema,
	DatasetsListInputSchema,
	DatasetsRemoveDatapointInputSchema,
	DatasetsUpdateInputSchema,
	EventCreateBatchInputSchema,
	EventCreateInputSchema,
	EventCreateResponseSchema,
	EventGetInputSchema,
	EventSearchInputSchema,
	EventUpdateInputSchema,
	ExperimentsCompareInputSchema,
	ExperimentsCreateRunInputSchema,
	ExperimentsCreateRunResponseSchema,
	ExperimentsDeleteRunInputSchema,
	ExperimentsGetMetricsInputSchema,
	ExperimentsGetRunInputSchema,
	ExperimentsGetSummaryInputSchema,
	ExperimentsListRunsInputSchema,
	ExperimentsUpdateRunInputSchema,
	MetricsCreateInputSchema,
	MetricsCreateResponseSchema,
	MetricsDeleteInputSchema,
	MetricsListInputSchema,
	MetricsRunInputSchema,
	MetricsUpdateInputSchema,
	ProjectsCreateInputSchema,
	ProjectsCreateResponseSchema,
	ProjectsDeleteInputSchema,
	ProjectsGetInputSchema,
	ProjectsUpdateInputSchema,
	SessionCreateEventBatchInputSchema,
	SessionCreateInputSchema,
	SessionCreateResponseSchema,
} from './endpoints/types';
import { honeyhive } from './index';
import { HoneyHiveSchema } from './schema';

describe('HoneyHive schema definition', () => {
	it('declares a valid semver version', () => {
		expect(HoneyHiveSchema.version).toBeDefined();
		expect(HoneyHiveSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HoneyHiveSchema.entities).toBe('object');
		expect(HoneyHiveSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HoneyHiveSchema.entities))).toBe(true);
	});
});

describe('HoneyHive metadata and endpoint sync', () => {
	const plugin = honeyhive();

	it('keeps endpoint registry, schemas, and metadata in complete sync', () => {
		const endpointKeys: string[] = [];
		for (const [groupName, group] of Object.entries(plugin.endpoints)) {
			for (const actionName of Object.keys(group)) {
				endpointKeys.push(`${groupName}.${actionName}`);
			}
		}

		const schemaKeys = Object.keys(plugin.endpointSchemas);
		const metaKeys = Object.keys(plugin.endpointMeta);

		expect(endpointKeys.sort()).toEqual(schemaKeys.sort());
		expect(endpointKeys.sort()).toEqual(metaKeys.sort());
	});

	it('assigns destructive riskLevel to state-modifying or irreversible operations', () => {
		const destructiveOperations = [
			'datasets.create',
			'datasets.update',
			'datasets.delete',
			'datasets.addDatapoints',
			'datasets.removeDatapoint',
			'datasets.createLegacy',
			'datasets.updateLegacy',
			'datasets.deleteLegacy',
			'experiments.createRun',
			'experiments.updateRun',
			'experiments.deleteRun',
			'experiments.createRunLegacy',
			'configurations.create',
			'configurations.update',
			'configurations.delete',
			'projects.create',
			'projects.update',
			'projects.delete',
			'metrics.delete',
		];

		for (const op of destructiveOperations) {
			const meta = plugin.endpointMeta[op as keyof typeof plugin.endpointMeta];
			expect(meta).toBeDefined();
			expect(meta.riskLevel).toBe('destructive');
		}
	});

	it('assigns read riskLevel to query and search operations', () => {
		const readOperations = [
			'events.get',
			'events.getLegacy',
			'events.search',
			'events.searchLegacy',
			'datasets.list',
			'datasets.listLegacy',
			'experiments.listRuns',
			'experiments.listRunsLegacy',
			'experiments.getRun',
			'experiments.getRunLegacy',
			'experiments.getSummary',
			'experiments.getMetrics',
			'experiments.getRunSchema',
			'experiments.getRunsSchema',
			'experiments.compare',
			'experiments.compareEvents',
			'metrics.list',
			'metrics.listVersions',
			'configurations.list',
			'projects.get',
		];

		for (const op of readOperations) {
			const meta = plugin.endpointMeta[op as keyof typeof plugin.endpointMeta];
			expect(meta).toBeDefined();
			expect(meta.riskLevel).toBe('read');
		}
	});
});

describe('HoneyHive Zod schemas validation', () => {
	it('validates sessionsCreate input and response', () => {
		const validInput = {
			session_id: 'sess-123',
			session_name: 'test-session',
			source: 'api',
			inputs: { prompt: 'hello' },
		};
		expect(SessionCreateInputSchema.safeParse(validInput).success).toBe(true);

		// strictObject rejects unallowed extra fields
		const invalidInput = {
			...validInput,
			extra_field: 'disallowed',
		};
		expect(SessionCreateInputSchema.safeParse(invalidInput).success).toBe(
			false,
		);

		const validResponse = {
			session_id: 'sess-123',
			event_id: 'evt-456',
			event_type: 'session',
		};
		expect(SessionCreateResponseSchema.safeParse(validResponse).success).toBe(
			true,
		);
	});

	it('validates sessionsCreateEventBatch input and enum event_type', () => {
		const validInput = {
			session_id: 'sess-123',
			events: [
				{
					event_type: 'model' as const,
					inputs: { model: 'gpt-4o' },
					duration: 120,
				},
			],
		};
		expect(
			SessionCreateEventBatchInputSchema.safeParse(validInput).success,
		).toBe(true);

		const invalidInput = {
			session_id: 'sess-123',
			events: [
				{
					// Invalid event_type outside the enum
					event_type: 'unknown_type',
					inputs: {},
				},
			],
		};
		expect(
			SessionCreateEventBatchInputSchema.safeParse(invalidInput).success,
		).toBe(false);
	});

	it('validates eventsCreate input and response', () => {
		const validInput = {
			project_id: 'proj-123',
			event_name: 'llm_call',
			inputs: { prompt: 'summarize text' },
		};
		expect(EventCreateInputSchema.safeParse(validInput).success).toBe(true);

		const validResponse = {
			success: true,
			event_id: 'evt-789',
		};
		expect(EventCreateResponseSchema.safeParse(validResponse).success).toBe(
			true,
		);
	});

	it('validates eventsCreateBatch input', () => {
		const validInput = {
			events: [
				{
					project_id: 'proj-123',
					event_name: 'batch_event_1',
				},
			],
			single_session: true,
		};
		expect(EventCreateBatchInputSchema.safeParse(validInput).success).toBe(
			true,
		);
	});

	it('validates eventsGet and eventsUpdate input requirements', () => {
		expect(
			EventGetInputSchema.safeParse({ project_id: 'proj-1', event_id: 'evt-1' })
				.success,
		).toBe(true);
		expect(
			EventGetInputSchema.safeParse({ project_id: 'proj-1' }).success,
		).toBe(false);

		expect(
			EventUpdateInputSchema.safeParse({
				event_id: 'evt-1',
				event_name: 'renamed',
			}).success,
		).toBe(true);
		expect(
			EventUpdateInputSchema.safeParse({ event_name: 'no_id' }).success,
		).toBe(false);
	});

	it('validates eventsSearch input structure', () => {
		const validInput = {
			project_id: 'proj-1',
			filters: [{ field: 'status', operator: 'equals', value: 'completed' }],
			limit: 50,
			page: 1,
		};
		expect(EventSearchInputSchema.safeParse(validInput).success).toBe(true);
		expect(EventSearchInputSchema.safeParse({}).success).toBe(false);
	});

	it('validates datasets endpoints inputs and responses', () => {
		expect(
			DatasetsListInputSchema.safeParse({ project_id: 'proj-1' }).success,
		).toBe(true);
		expect(DatasetsListInputSchema.safeParse({}).success).toBe(false);

		const createInput = {
			project_id: 'proj-1',
			name: 'eval-dataset',
			description: 'Dataset for test evals',
			datapoints: [{ input: 'hello', expected: 'world' }],
		};
		expect(DatasetsCreateInputSchema.safeParse(createInput).success).toBe(true);
		expect(
			DatasetsCreateInputSchema.safeParse({ project_id: 'proj-1' }).success,
		).toBe(false);

		expect(
			DatasetsCreateResponseSchema.safeParse({ inserted: true, result: {} })
				.success,
		).toBe(true);

		expect(
			DatasetsUpdateInputSchema.safeParse({
				project_id: 'proj-1',
				dataset_id: 'ds-1',
				name: 'updated-name',
			}).success,
		).toBe(true);

		expect(
			DatasetsDeleteInputSchema.safeParse({
				project_id: 'proj-1',
				dataset_id: 'ds-1',
			}).success,
		).toBe(true);

		expect(
			DatasetsAddDatapointsInputSchema.safeParse({
				project_id: 'proj-1',
				dataset_id: 'ds-1',
				data: [{ text: 'sample' }],
			}).success,
		).toBe(true);

		expect(
			DatasetsRemoveDatapointInputSchema.safeParse({
				project_id: 'proj-1',
				dataset_id: 'ds-1',
				datapoint_id: 'dp-1',
			}).success,
		).toBe(true);
	});

	it('validates experiments endpoints inputs and responses', () => {
		expect(
			ExperimentsListRunsInputSchema.safeParse({ project_id: 'proj-1' })
				.success,
		).toBe(true);

		const createRunInput = {
			project_id: 'proj-1',
			name: 'run-alpha',
			dataset_id: 'ds-1',
		};
		expect(
			ExperimentsCreateRunInputSchema.safeParse(createRunInput).success,
		).toBe(true);
		expect(
			ExperimentsCreateRunResponseSchema.safeParse({
				run_id: 'run-1',
				status: 'running',
			}).success,
		).toBe(true);

		expect(
			ExperimentsGetRunInputSchema.safeParse({
				project_id: 'proj-1',
				run_id: 'run-1',
			}).success,
		).toBe(true);
		expect(
			ExperimentsUpdateRunInputSchema.safeParse({
				project_id: 'proj-1',
				run_id: 'run-1',
				status: 'completed',
			}).success,
		).toBe(true);
		expect(
			ExperimentsDeleteRunInputSchema.safeParse({
				project_id: 'proj-1',
				run_id: 'run-1',
			}).success,
		).toBe(true);
		expect(
			ExperimentsGetSummaryInputSchema.safeParse({
				project_id: 'proj-1',
				run_id: 'run-1',
			}).success,
		).toBe(true);
		expect(
			ExperimentsGetMetricsInputSchema.safeParse({
				project_id: 'proj-1',
				run_id: 'run-1',
			}).success,
		).toBe(true);
		expect(
			ExperimentsCompareInputSchema.safeParse({
				project_id: 'proj-1',
				new_run_id: 'run-1',
				old_run_id: 'run-2',
			}).success,
		).toBe(true);
	});

	it('validates metrics endpoints inputs and responses', () => {
		expect(
			MetricsListInputSchema.safeParse({ type: 'evaluator' }).success,
		).toBe(true);

		const createMetricInput = {
			name: 'exact_match',
			type: 'deterministic',
			description: 'Exact match evaluator',
		};
		expect(MetricsCreateInputSchema.safeParse(createMetricInput).success).toBe(
			true,
		);
		expect(
			MetricsCreateResponseSchema.safeParse({ insertedId: 'metric-1' }).success,
		).toBe(true);

		expect(
			MetricsUpdateInputSchema.safeParse({
				metric_id: 'metric-1',
				description: 'new desc',
			}).success,
		).toBe(true);

		expect(
			MetricsDeleteInputSchema.safeParse({ metric_id: 'metric-1' }).success,
		).toBe(true);

		expect(
			MetricsRunInputSchema.safeParse({
				metric: { id: 'm-1' },
				event: { input: 'hi' },
			}).success,
		).toBe(true);
	});

	it('validates configurations endpoints inputs and responses', () => {
		expect(
			ConfigurationsListInputSchema.safeParse({ name: 'prompt_v1' }).success,
		).toBe(true);

		const createConfigInput = {
			name: 'prompt_v1',
			parameters: { temperature: 0.7 },
		};
		expect(
			ConfigurationsCreateInputSchema.safeParse(createConfigInput).success,
		).toBe(true);
		expect(
			ConfigurationsCreateResponseSchema.safeParse({ insertedId: 'cfg-1' })
				.success,
		).toBe(true);

		expect(
			ConfigurationsUpdateInputSchema.safeParse({
				configId: 'cfg-1',
				name: 'prompt_v2',
			}).success,
		).toBe(true);

		expect(
			ConfigurationsDeleteInputSchema.safeParse({ configId: 'cfg-1' }).success,
		).toBe(true);
	});

	it('validates projects endpoints inputs and responses', () => {
		const createProjectInput = {
			workspace_id: 'ws-1',
			name: 'Customer Support Bot',
			description: 'Support assistant eval project',
		};
		expect(
			ProjectsCreateInputSchema.safeParse(createProjectInput).success,
		).toBe(true);
		expect(
			ProjectsCreateResponseSchema.safeParse({
				success: true,
				data: { project_id: 'proj-1', name: 'Customer Support Bot' },
			}).success,
		).toBe(true);

		expect(
			ProjectsGetInputSchema.safeParse({ project_id: 'proj-1' }).success,
		).toBe(true);
		expect(
			ProjectsUpdateInputSchema.safeParse({
				project_id: 'proj-1',
				name: 'Updated Bot',
			}).success,
		).toBe(true);
		expect(
			ProjectsDeleteInputSchema.safeParse({ project_id: 'proj-1' }).success,
		).toBe(true);
	});
});
