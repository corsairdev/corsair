import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Configurations,
	Datasets,
	Events,
	Experiments,
	Metrics,
	Projects,
	Sessions,
} from './endpoints';
import type { HoneyHiveContext } from './index';

jest.mock('corsair/core', () => {
	// `unknown` because jest.requireActual returns an untyped module object.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('./client', () => {
	// `unknown` because jest.requireActual returns an untyped module object.
	const actual = jest.requireActual('./client') as Record<string, unknown>;
	return {
		...actual,
		makeHoneyHiveRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeHoneyHiveRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildMockContext(): HoneyHiveContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'hh-api-key-test',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('hh-api-key-test'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildMockContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('1. Sessions endpoints', () => {
	it('creates a session', async () => {
		const mockResponse = { session_id: 's-1', event_id: 'e-1' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.create(ctx, {
			session_id: 's-1',
			session_name: 'test-session',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/sessions',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { session_id: 's-1', session_name: 'test-session' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'honeyhive.sessions.create',
			{ session_id: 's-1', event_id: 'e-1' },
			'completed',
		);
	});

	it('creates a batch of events for a session with encoded ID', async () => {
		const mockResponse = { success: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.createEventBatch(ctx, {
			session_id: 'sess/123:test',
			events: [{ event_type: 'model', inputs: { query: 'hi' } }],
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/sessions/sess%2F123%3Atest/events/batch',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { events: [{ event_type: 'model', inputs: { query: 'hi' } }] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'honeyhive.sessions.createEventBatch',
			{ session_id: 'sess/123:test', count: 1 },
			'completed',
		);
	});
});

describe('2. Events endpoints', () => {
	it('creates a single trace event', async () => {
		mockedRequest.mockResolvedValue({ success: true, event_id: 'evt-1' });

		const result = await Events.create(ctx, {
			project_id: 'proj-1',
			event_name: 'llm_call',
		});

		expect(result).toEqual({ success: true, event_id: 'evt-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/events',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { project_id: 'proj-1', event_name: 'llm_call' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'honeyhive.events.create',
			{ event_id: 'evt-1' },
			'completed',
		);
	});

	it('creates a batch of trace events', async () => {
		mockedRequest.mockResolvedValue({ success: true, event_ids: ['e1', 'e2'] });

		const result = await Events.createBatch(ctx, {
			events: [{ event_name: 'e1' }, { event_name: 'e2' }],
		});

		expect(result).toEqual({ success: true, event_ids: ['e1', 'e2'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/events/batch',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { events: [{ event_name: 'e1' }, { event_name: 'e2' }] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'honeyhive.events.createBatch',
			{ count: 2 },
			'completed',
		);
	});

	it('gets an event by project and event ID', async () => {
		mockedRequest.mockResolvedValue({ event: { id: 'evt-1' } });

		const result = await Events.get(ctx, {
			project_id: 'p/1',
			event_id: 'e/1',
		});

		expect(result).toEqual({ event: { id: 'evt-1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/p%2F1/events/e%2F1',
			'hh-api-key-test',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'honeyhive.events.get',
			{ project_id: 'p/1', event_id: 'e/1' },
			'completed',
		);
	});

	it('gets an event via legacy route', async () => {
		mockedRequest.mockResolvedValue({ event: { id: 'evt-1' } });

		const result = await Events.getLegacy(ctx, { event_id: 'e-1' });

		expect(result).toEqual({ event: { id: 'evt-1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/events/e-1',
			'hh-api-key-test',
			{ method: 'GET' },
		);
	});

	it('updates an event', async () => {
		mockedRequest.mockResolvedValue({ success: true, event_id: 'evt-1' });

		const result = await Events.update(ctx, {
			event_id: 'evt-1',
			event_name: 'renamed',
		});

		expect(result).toEqual({ success: true, event_id: 'evt-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/events/evt-1',
			'hh-api-key-test',
			{
				method: 'PUT',
				body: { event_name: 'renamed' },
			},
		);
	});

	it('searches events within a project', async () => {
		mockedRequest.mockResolvedValue({ events: [], count: 0 });

		const result = await Events.search(ctx, {
			project_id: 'proj-1',
			limit: 10,
		});

		expect(result).toEqual({ events: [], count: 0 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/events/search',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { limit: 10 },
			},
		);
	});

	it('searches events via legacy route', async () => {
		mockedRequest.mockResolvedValue({ events: [], count: 0 });

		const result = await Events.searchLegacy(ctx, { limit: 5 });

		expect(result).toEqual({ events: [], count: 0 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/events/search',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { limit: 5 },
			},
		);
	});
});

describe('3. Datasets endpoints', () => {
	it('lists datasets in a project', async () => {
		mockedRequest.mockResolvedValue({ datasets: [{ id: 'ds-1' }] });

		const result = await Datasets.list(ctx, {
			project_id: 'proj-1',
			name: 'eval_set',
		});

		expect(result).toEqual({ datasets: [{ id: 'ds-1' }] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets',
			'hh-api-key-test',
			{
				method: 'GET',
				query: { name: 'eval_set' },
			},
		);
	});

	it('creates a dataset in a project', async () => {
		mockedRequest.mockResolvedValue({ inserted: true });

		const result = await Datasets.create(ctx, {
			project_id: 'proj-1',
			name: 'new_dataset',
		});

		expect(result).toEqual({ inserted: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { name: 'new_dataset' },
			},
		);
	});

	it('updates a dataset', async () => {
		mockedRequest.mockResolvedValue({ updated: true });

		const result = await Datasets.update(ctx, {
			project_id: 'proj-1',
			dataset_id: 'ds-1',
			name: 'updated_dataset',
		});

		expect(result).toEqual({ updated: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets/ds-1',
			'hh-api-key-test',
			{
				method: 'PATCH',
				body: { name: 'updated_dataset' },
			},
		);
	});

	it('deletes a dataset', async () => {
		mockedRequest.mockResolvedValue({ deleted: true });

		const result = await Datasets.delete(ctx, {
			project_id: 'proj-1',
			dataset_id: 'ds-1',
		});

		expect(result).toEqual({ deleted: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets/ds-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});

	it('adds datapoints to a dataset', async () => {
		mockedRequest.mockResolvedValue({ inserted: true });

		const result = await Datasets.addDatapoints(ctx, {
			project_id: 'proj-1',
			dataset_id: 'ds-1',
			data: [{ prompt: 'hi' }],
		});

		expect(result).toEqual({ inserted: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets/ds-1/datapoints',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { data: [{ prompt: 'hi' }] },
			},
		);
	});

	it('removes a datapoint from a dataset', async () => {
		mockedRequest.mockResolvedValue({ deleted: true });

		const result = await Datasets.removeDatapoint(ctx, {
			project_id: 'proj-1',
			dataset_id: 'ds-1',
			datapoint_id: 'dp-1',
		});

		expect(result).toEqual({ deleted: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/datasets/ds-1/datapoints/dp-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});

	it('handles legacy dataset operations', async () => {
		mockedRequest.mockResolvedValue({ datasets: [] });
		await Datasets.listLegacy(ctx, { name: 'legacy' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/datasets',
			'hh-api-key-test',
			{ method: 'GET', query: { name: 'legacy' } },
		);

		mockedRequest.mockResolvedValue({ inserted: true });
		await Datasets.createLegacy(ctx, { name: 'legacy' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/datasets',
			'hh-api-key-test',
			{ method: 'POST', body: { name: 'legacy' } },
		);

		mockedRequest.mockResolvedValue({ updated: true });
		await Datasets.updateLegacy(ctx, { dataset_id: 'ds-1', name: 'new' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/datasets/ds-1',
			'hh-api-key-test',
			{ method: 'PUT', body: { name: 'new' } },
		);

		mockedRequest.mockResolvedValue({ deleted: true });
		await Datasets.deleteLegacy(ctx, { dataset_id: 'ds-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/datasets/ds-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});
});

describe('4. Experiments endpoints', () => {
	it('lists evaluation runs in a project', async () => {
		mockedRequest.mockResolvedValue({ runs: [] });

		const result = await Experiments.listRuns(ctx, { project_id: 'proj-1' });

		expect(result).toEqual({ runs: [] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs',
			'hh-api-key-test',
			{ method: 'GET', query: {} },
		);
	});

	it('creates an evaluation run', async () => {
		mockedRequest.mockResolvedValue({ run_id: 'r-1', status: 'running' });

		const result = await Experiments.createRun(ctx, {
			project_id: 'proj-1',
			name: 'eval_run_1',
		});

		expect(result).toEqual({ run_id: 'r-1', status: 'running' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { name: 'eval_run_1' },
			},
		);
	});

	it('gets and updates an evaluation run', async () => {
		mockedRequest.mockResolvedValue({ run_id: 'r-1' });
		await Experiments.getRun(ctx, { project_id: 'proj-1', run_id: 'r-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1',
			'hh-api-key-test',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ updated: true });
		await Experiments.updateRun(ctx, {
			project_id: 'proj-1',
			run_id: 'r-1',
			status: 'completed',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1',
			'hh-api-key-test',
			{ method: 'PATCH', body: { status: 'completed' } },
		);
	});

	it('deletes an evaluation run', async () => {
		mockedRequest.mockResolvedValue({ deleted: true });
		await Experiments.deleteRun(ctx, { project_id: 'proj-1', run_id: 'r-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});

	it('gets run summary, metrics, and schemas', async () => {
		mockedRequest.mockResolvedValue({ summary: {} });
		await Experiments.getSummary(ctx, {
			project_id: 'proj-1',
			run_id: 'r-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1/summary',
			'hh-api-key-test',
			{ method: 'GET', query: {} },
		);

		mockedRequest.mockResolvedValue({ metrics: [] });
		await Experiments.getMetrics(ctx, {
			project_id: 'proj-1',
			run_id: 'r-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1/metrics',
			'hh-api-key-test',
			{ method: 'GET', query: {} },
		);

		mockedRequest.mockResolvedValue({ schema: {} });
		await Experiments.getRunSchema(ctx, {
			project_id: 'proj-1',
			run_id: 'r-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-1/schema',
			'hh-api-key-test',
			{ method: 'GET', query: {} },
		);

		mockedRequest.mockResolvedValue({ schema: {} });
		await Experiments.getRunsSchema(ctx, { project_id: 'proj-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/schema',
			'hh-api-key-test',
			{ method: 'GET', query: {} },
		);
	});

	it('compares runs and events', async () => {
		mockedRequest.mockResolvedValue({ comparison: {} });
		await Experiments.compare(ctx, {
			project_id: 'proj-1',
			new_run_id: 'r-new',
			old_run_id: 'r-old',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-new/compare/r-old',
			'hh-api-key-test',
			{
				method: 'GET',
				query: {},
			},
		);

		mockedRequest.mockResolvedValue({ events: [] });
		await Experiments.compareEvents(ctx, {
			project_id: 'proj-1',
			new_run_id: 'r-new',
			old_run_id: 'r-old',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/proj-1/runs/r-new/compare/r-old/events',
			'hh-api-key-test',
			{
				method: 'GET',
				query: {},
			},
		);
	});

	it('handles legacy run operations', async () => {
		mockedRequest.mockResolvedValue({ runs: [] });
		await Experiments.listRunsLegacy(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/v1/runs', 'hh-api-key-test', {
			method: 'GET',
			query: {},
		});

		mockedRequest.mockResolvedValue({ run_id: 'r-1' });
		await Experiments.createRunLegacy(ctx, { name: 'legacy' });
		expect(mockedRequest).toHaveBeenCalledWith('/v1/runs', 'hh-api-key-test', {
			method: 'POST',
			body: { name: 'legacy' },
		});

		mockedRequest.mockResolvedValue({ run_id: 'r-1' });
		await Experiments.getRunLegacy(ctx, { run_id: 'r-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/runs/r-1',
			'hh-api-key-test',
			{ method: 'GET' },
		);
	});
});

describe('5. Metrics endpoints', () => {
	it('lists metrics', async () => {
		mockedRequest.mockResolvedValue({ metrics: [] });
		const result = await Metrics.list(ctx, { type: 'eval' });
		expect(result).toEqual({ metrics: [] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics',
			'hh-api-key-test',
			{ method: 'GET', query: { type: 'eval' } },
		);
	});

	it('creates, updates, deletes, and runs metrics', async () => {
		mockedRequest.mockResolvedValue({ insertedId: 'm-1' });
		await Metrics.create(ctx, { name: 'metric_1', type: 'deterministic' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { name: 'metric_1', type: 'deterministic' },
			},
		);

		mockedRequest.mockResolvedValue({ updated: true });
		await Metrics.update(ctx, { metric_id: 'm-1', description: 'updated' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/m-1',
			'hh-api-key-test',
			{ method: 'PUT', body: { description: 'updated' } },
		);

		mockedRequest.mockResolvedValue({ deleted: true });
		await Metrics.delete(ctx, { metric_id: 'm-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/m-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValue({ result: 'pass' });
		await Metrics.run(ctx, { metric: { id: 'm-1' }, event: { query: 'test' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/run',
			'hh-api-key-test',
			{
				method: 'POST',
				body: { metric: { id: 'm-1' }, event: { query: 'test' } },
			},
		);
	});

	it('manages metric versions', async () => {
		mockedRequest.mockResolvedValue({ versions: [] });
		await Metrics.listVersions(ctx, { metric_id: 'm-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/m-1/versions',
			'hh-api-key-test',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ version_id: 'v-1' });
		await Metrics.createVersion(ctx, { metric_id: 'm-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/m-1/versions',
			'hh-api-key-test',
			{ method: 'POST', body: {} },
		);

		mockedRequest.mockResolvedValue({ deployed: true });
		await Metrics.deployVersion(ctx, {
			metric_id: 'm-1',
			version_name: 'v-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/metrics/m-1/versions/v-1/deploy',
			'hh-api-key-test',
			{ method: 'POST' },
		);
	});
});

describe('6. Configurations endpoints', () => {
	it('lists, creates, updates, and deletes configurations', async () => {
		mockedRequest.mockResolvedValue({ configurations: [] });
		await Configurations.list(ctx, { name: 'cfg_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/configurations',
			'hh-api-key-test',
			{ method: 'GET', query: { name: 'cfg_1' } },
		);

		mockedRequest.mockResolvedValue({ insertedId: 'c-1' });
		await Configurations.create(ctx, { name: 'cfg_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/configurations',
			'hh-api-key-test',
			{ method: 'POST', body: { name: 'cfg_1' } },
		);

		mockedRequest.mockResolvedValue({ updated: true });
		await Configurations.update(ctx, { configId: 'c-1', name: 'cfg_2' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/configurations/c-1',
			'hh-api-key-test',
			{ method: 'PUT', body: { name: 'cfg_2' } },
		);

		mockedRequest.mockResolvedValue({ deleted: true });
		await Configurations.delete(ctx, { configId: 'c-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/configurations/c-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});
});

describe('7. Projects endpoints', () => {
	it('creates, gets, updates, and deletes projects', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await Projects.create(ctx, {
			workspace_id: 'ws-1',
			name: 'Project Alpha',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/workspaces/ws-1/projects',
			'hh-api-key-test',
			{ method: 'POST', body: { name: 'Project Alpha' } },
		);

		mockedRequest.mockResolvedValue({ project: { id: 'p-1' } });
		await Projects.get(ctx, { project_id: 'p-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/p-1',
			'hh-api-key-test',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ updated: true });
		await Projects.update(ctx, { project_id: 'p-1', name: 'Project Beta' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/p-1',
			'hh-api-key-test',
			{ method: 'PUT', body: { name: 'Project Beta' } },
		);

		mockedRequest.mockResolvedValue({ deleted: true });
		await Projects.delete(ctx, { project_id: 'p-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/p-1',
			'hh-api-key-test',
			{ method: 'DELETE' },
		);
	});
});
