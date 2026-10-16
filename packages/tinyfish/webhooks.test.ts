import { logEventFromContext } from 'corsair/core';
import { TinyFishRunWebhooks } from './webhooks';
import {
	createTinyFishMatch,
	matchTinyFishPluginWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockLog = jest.mocked(logEventFromContext);

type AnyHandler = (ctx: never, request: never) => Promise<unknown>;
type AnyMatcher = (request: never) => boolean;

function createContext() {
	return {
		key: '',
		options: {},
		db: {
			agentRuns: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

// never so the matcher/handler casts accept it without per-call casts.
function request(body: unknown): never {
	return { body, payload: body, headers: {} } as never;
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

beforeEach(() => {
	mockLog.mockClear();
});

describe('tinyfish webhook matching', () => {
	it('claims run.* deliveries from object and string bodies', () => {
		expect(
			(matchTinyFishPluginWebhook as AnyMatcher)(request(completedPayload)),
		).toBe(true);
		expect(
			(matchTinyFishPluginWebhook as AnyMatcher)(
				request(JSON.stringify(failedPayload)),
			),
		).toBe(true);
	});

	it('ignores other events and unparseable bodies', () => {
		expect(
			(matchTinyFishPluginWebhook as AnyMatcher)(
				request({ event: 'monitor.triggered' }),
			),
		).toBe(false);
		expect((matchTinyFishPluginWebhook as AnyMatcher)(request(null))).toBe(
			false,
		);
		expect(
			(matchTinyFishPluginWebhook as AnyMatcher)(request('not json')),
		).toBe(false);
	});

	it('routes each event matcher to its own event only', () => {
		const completed = createTinyFishMatch('run.completed') as AnyMatcher;
		const failed = createTinyFishMatch('run.failed') as AnyMatcher;

		expect(completed(request(completedPayload))).toBe(true);
		expect(completed(request(failedPayload))).toBe(false);
		expect(failed(request(failedPayload))).toBe(true);
	});
});

describe('tinyfish webhook handlers', () => {
	it('runCompleted persists the finished run and logs it', async () => {
		const ctx = createContext();
		const result = await (
			TinyFishRunWebhooks.runCompleted.handler as AnyHandler
		)(ctx as never, request(completedPayload) as never);

		expect(result).toEqual({ success: true, data: completedPayload });
		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({
				status: 'COMPLETED',
				goal: 'Get the title',
				numOfSteps: 3,
				finishedAt: new Date('2026-01-02T00:00:09.000Z'),
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
		const result = await (TinyFishRunWebhooks.runFailed.handler as AnyHandler)(
			ctx as never,
			request(failedPayload) as never,
		);

		expect(result).toEqual({ success: true, data: failedPayload });
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
		const result = await (
			TinyFishRunWebhooks.runCancelled.handler as AnyHandler
		)(ctx as never, request(cancelledPayload) as never);

		expect(result).toEqual({ success: true, data: cancelledPayload });
		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-2',
			expect.objectContaining({ status: 'CANCELLED' }),
		);
	});

	it('rejects a payload that is not a run event without touching the store', async () => {
		const ctx = createContext();
		const result = (await (
			TinyFishRunWebhooks.runCompleted.handler as AnyHandler
		)(ctx as never, request({ event: 'run.completed' }) as never)) as {
			success: boolean;
			statusCode?: number;
			error?: string;
		};

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
		expect(result.error).toBeDefined();
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
