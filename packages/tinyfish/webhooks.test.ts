import type { CorsairWebhookMatcher } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeTinyFishRequest } from './client';
import { TinyFishRunWebhooks } from './webhooks';
import {
	createTinyFishMatch,
	matchTinyFishPluginWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeTinyFishRequest: jest.fn(),
}));

const mockLog = jest.mocked(logEventFromContext);
const mockRequest = jest.mocked(makeTinyFishRequest);

// Handler parameters are the full Corsair context. never makes every concrete
// handler assignable. The return is unknown because success and failure
// payloads differ, so a stricter shared type is not practical.
type AnyHandler = (ctx: never, request: never) => Promise<unknown>;

type DeliveryResult = {
	success: boolean;
	statusCode?: number;
	error?: string;
	data?: {
		event: string;
		run_id: string;
		status: string;
		// Confirmed run snapshots differ by event, so a stricter data bag is
		// not practical.
		data: Record<string, unknown>;
	};
};

type TestContext = ReturnType<typeof createContext>;

function createContext({ key }: { key?: string } = {}) {
	return {
		database: {},
		key: '',
		options: key === undefined ? {} : { key },
		keys: {
			get_api_key: jest.fn().mockResolvedValue('tf-key'),
		},
		db: {
			agentRuns: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

function request(
	// Delivery bodies in these tests are raw JSON, valid or not, so a
	// stricter body type is not practical.
	body: unknown,
): never {
	// Partial stand-in for RawWebhookRequest. A full request type is not
	// practical in this fixture.
	return { body, payload: body, headers: {} } as never;
}

function matches(
	matcher: CorsairWebhookMatcher,
	// Matching tests pass objects, JSON strings, and junk, so a stricter body
	// type is not practical.
	body: unknown,
): boolean {
	return matcher(request(body));
}

async function invoke(
	handler: AnyHandler,
	ctx: TestContext,
	// Handler fixtures are raw JSON, valid or not, so a stricter body type is
	// not practical.
	body: unknown,
): Promise<DeliveryResult> {
	// The fake context is not TinyFishContext, and the handler return is a
	// success-or-failure object the Corsair type leaves generic. A stricter
	// boundary type is not practical.
	return (await handler(ctx as never, request(body))) as DeliveryResult;
}

const completedPayload = {
	event: 'run.completed',
	run_id: 'run-1',
	status: 'COMPLETED',
	data: {
		run_id: 'run-1',
		status: 'COMPLETED',
		goal: 'Get the title',
		created_at: '2026-01-02T00:00:00.000Z',
		started_at: '2026-01-02T00:00:01.000Z',
		finished_at: '2026-01-02T00:00:09.000Z',
		num_of_steps: 3,
		result: { title: 'Example' },
		error: null,
		streaming_url: null,
		steps: [
			{
				id: 'step-1',
				timestamp: '2026-01-02T00:00:02.000Z',
				status: 'COMPLETED',
				action: 'click',
				screenshot: null,
				html: null,
				duration: '1.2s',
			},
		],
	},
};

const failedPayload = {
	event: 'run.failed',
	run_id: 'run-1',
	status: 'FAILED',
	data: {
		run_id: 'run-1',
		status: 'FAILED',
		goal: 'Get the title',
		finished_at: '2026-01-02T00:00:09.000Z',
		result: null,
		error: {
			code: 'TASK_FAILED',
			message: 'selector not found',
			category: 'AGENT_FAILURE',
		},
	},
};

const cancelledPayload = {
	event: 'run.cancelled',
	run_id: 'run-2',
	status: 'CANCELLED',
	data: {
		run_id: 'run-2',
		status: 'CANCELLED',
		goal: 'Get the title',
	},
};

// What GET /v1/runs/{id} answers for each run. The handlers must store and
// return these values, never the delivery body's, so live goal and result
// deliberately differ from the payloads above.
const liveCompletedRun = {
	run_id: 'run-1',
	status: 'COMPLETED',
	goal: 'Live goal from the API',
	created_at: '2026-01-02T00:00:00.000Z',
	started_at: '2026-01-02T00:00:01.000Z',
	finished_at: '2026-01-02T00:00:09.000Z',
	num_of_steps: 3,
	result: { title: 'From the API' },
	error: null,
	profile_id: 'p-live',
	steps: [
		{
			id: 'step-1',
			timestamp: '2026-01-02T00:00:02.000Z',
			status: 'COMPLETED',
			action: 'click',
			screenshot: null,
			html: null,
			duration: '1.2s',
		},
	],
};

const liveFailedRun = {
	run_id: 'run-1',
	status: 'FAILED',
	goal: 'Get the title',
	created_at: '2026-01-02T00:00:00.000Z',
	started_at: '2026-01-02T00:00:01.000Z',
	finished_at: '2026-01-02T00:00:09.000Z',
	num_of_steps: 2,
	result: null,
	error: {
		code: 'TASK_FAILED',
		message: 'selector not found',
		category: 'AGENT_FAILURE',
	},
	profile_id: null,
	steps: [],
};

const liveCancelledRun = {
	run_id: 'run-2',
	status: 'CANCELLED',
	goal: 'Get the title',
	created_at: '2026-01-02T00:00:00.000Z',
	started_at: null,
	finished_at: '2026-01-02T00:00:05.000Z',
	num_of_steps: 0,
	result: null,
	error: null,
	profile_id: null,
	steps: [],
};

beforeEach(() => {
	mockLog.mockClear();
	mockRequest.mockReset().mockResolvedValue(liveCompletedRun);
});

describe('tinyfish webhook matching', () => {
	it('claims run.* deliveries from object and string bodies', () => {
		expect(matches(matchTinyFishPluginWebhook, completedPayload)).toBe(true);
		expect(
			matches(matchTinyFishPluginWebhook, JSON.stringify(failedPayload)),
		).toBe(true);
	});

	it('ignores other events and unparseable bodies', () => {
		expect(
			matches(matchTinyFishPluginWebhook, { event: 'monitor.triggered' }),
		).toBe(false);
		expect(matches(matchTinyFishPluginWebhook, null)).toBe(false);
		expect(matches(matchTinyFishPluginWebhook, 'not json')).toBe(false);
	});

	it('routes each event matcher to its own event only', () => {
		const completed = createTinyFishMatch('run.completed');
		const failed = createTinyFishMatch('run.failed');

		expect(matches(completed, completedPayload)).toBe(true);
		expect(matches(completed, failedPayload)).toBe(false);
		expect(matches(failed, failedPayload)).toBe(true);
	});
});

describe('tinyfish webhook handlers', () => {
	it('runCompleted persists and returns the API snapshot, never the delivery body', async () => {
		const ctx = createContext();
		const result = await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(result).toEqual({
			success: true,
			data: {
				event: 'run.completed',
				run_id: 'run-1',
				status: 'COMPLETED',
				data: liveCompletedRun,
			},
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'agent',
			'/v1/runs/run-1',
			'tf-key',
			{ method: 'GET' },
		);
		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({
				status: 'COMPLETED',
				goal: 'Live goal from the API',
				result: { title: 'From the API' },
				numOfSteps: 3,
				finishedAt: new Date('2026-01-02T00:00:09.000Z'),
				profileId: 'p-live',
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.webhook.runCompleted',
			expect.objectContaining({ runId: 'run-1', steps: 1 }),
			'completed',
		);
	});

	it('runFailed records the provider error code and message', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValue(liveFailedRun);
		const result = await invoke(
			TinyFishRunWebhooks.runFailed.handler,
			ctx,
			failedPayload,
		);

		expect(result).toEqual({
			success: true,
			data: {
				event: 'run.failed',
				run_id: 'run-1',
				status: 'FAILED',
				data: liveFailedRun,
			},
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'agent',
			'/v1/runs/run-1',
			'tf-key',
			{ method: 'GET' },
		);
		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({
				status: 'FAILED',
				errorCode: 'TASK_FAILED',
				errorMessage: 'selector not found',
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.webhook.runFailed',
			expect.objectContaining({
				runId: 'run-1',
				errorCode: 'TASK_FAILED',
			}),
			'completed',
		);
	});

	it('runCancelled stores the cancellation', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValue(liveCancelledRun);
		const result = await invoke(
			TinyFishRunWebhooks.runCancelled.handler,
			ctx,
			cancelledPayload,
		);

		expect(result).toEqual({
			success: true,
			data: {
				event: 'run.cancelled',
				run_id: 'run-2',
				status: 'CANCELLED',
				data: liveCancelledRun,
			},
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'agent',
			'/v1/runs/run-2',
			'tf-key',
			{ method: 'GET' },
		);
		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-2',
			expect.objectContaining({ status: 'CANCELLED' }),
		);
	});

	it('drops a delivery whose live status disagrees with the event', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValue({ ...liveCompletedRun, status: 'RUNNING' });
		const result = await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(409);
		expect(result.error).toContain('RUNNING');
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.webhook.runCompleted',
			expect.objectContaining({ runId: 'run-1' }),
			'failed',
		);
	});

	it('drops a delivery when the live run cannot be parsed', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValue({ status: 'COMPLETED' });
		const result = await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(409);
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('drops a delivery when the confirm request fails', async () => {
		const ctx = createContext();
		mockRequest.mockRejectedValue(new Error('upstream 502'));
		const result = await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(409);
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.webhook.runCompleted',
			expect.objectContaining({ runId: 'run-1' }),
			'failed',
		);
	});

	it('drops a delivery when no key is available to confirm it', async () => {
		const ctx = createContext();
		ctx.keys.get_api_key.mockResolvedValue('');
		const result = await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(409);
		expect(mockRequest).not.toHaveBeenCalled();
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('confirms with the configured key before the stored key', async () => {
		const ctx = createContext({ key: 'opt-key' });
		await invoke(
			TinyFishRunWebhooks.runCompleted.handler,
			ctx,
			completedPayload,
		);

		expect(mockRequest).toHaveBeenCalledWith(
			'agent',
			'/v1/runs/run-1',
			'opt-key',
			{ method: 'GET' },
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('rejects a payload that is not a run event without touching the store', async () => {
		const ctx = createContext();
		const result = await invoke(TinyFishRunWebhooks.runCompleted.handler, ctx, {
			event: 'run.completed',
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
		expect(result.error).toBeDefined();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
