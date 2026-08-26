import { logEventFromContext } from 'corsair/core';
import {
	bulkRun,
	createMonitor,
	createWebhook,
	deleteMonitor,
	getStatus,
	getTask,
	listRobots,
	listTasks,
	listWebhooks,
	runRobot,
} from './endpoints';
import { browseaiEndpointMeta, browseaiEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof getStatus>[0];

function makeCtx() {
	return {
		key: 'test-token',
		options: { authType: 'api_key' },
	} as unknown as Ctx;
}

let captured: { url: string; method: string; body?: string } | undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function pathAndQuery(): { path: string; query: URLSearchParams } {
	const url = new URL(captured?.url ?? 'http://invalid');
	return { path: url.pathname, query: url.searchParams };
}

describe('Browse AI endpoints', () => {
	it('system.getStatus calls GET /status', async () => {
		mockFetch({
			statusCode: 200,
			messageCode: 'success',
			tasksQueueStatus: 'OK',
		});
		const out = await getStatus(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v2/status');
		expect(out.tasksQueueStatus).toBe('OK');
	});

	it('robots.list calls GET /robots', async () => {
		mockFetch({
			statusCode: 200,
			robots: { totalCount: 1, items: [{ id: 'r1', name: 'Bot' }] },
		});
		const out = await listRobots(makeCtx(), {});
		expect(pathAndQuery().path).toBe('/v2/robots');
		expect(out.robots?.items?.[0]?.id).toBe('r1');
	});

	it('robots.run POSTs /robots/{id}/tasks', async () => {
		mockFetch({ statusCode: 200, result: { id: 't1', robotId: 'r1' } });
		const out = await runRobot(makeCtx(), {
			robotId: 'r1',
			recordVideo: true,
			inputParameters: { originUrl: 'https://example.com' },
		});
		expect(captured?.method).toBe('POST');
		expect(pathAndQuery().path).toBe('/v2/robots/r1/tasks');
		expect(captured?.body).toContain('originUrl');
		expect(out.result?.id).toBe('t1');
	});

	it('robots.bulkRun POSTs /robots/{id}/bulk-runs', async () => {
		mockFetch({
			statusCode: 200,
			result: { bulkRun: { id: 'b1', robotId: 'r1' } },
		});
		await bulkRun(makeCtx(), {
			robotId: 'r1',
			title: 'Batch',
			inputParameters: [{ originUrl: 'https://example.com' }],
		});
		expect(captured?.method).toBe('POST');
		expect(pathAndQuery().path).toBe('/v2/robots/r1/bulk-runs');
		expect(captured?.body).toContain('Batch');
	});

	it('tasks.list paginates GET /robots/{id}/tasks', async () => {
		mockFetch({
			statusCode: 200,
			result: {
				robotTasks: { totalCount: 0, pageNumber: 2, hasMore: false, items: [] },
			},
		});
		await listTasks(makeCtx(), {
			robotId: 'r1',
			page: 2,
			pageSize: 10,
			status: 'successful',
			includeRetried: false,
		});
		const { path, query } = pathAndQuery();
		expect(path).toBe('/v2/robots/r1/tasks');
		expect(query.get('page')).toBe('2');
		expect(query.get('pageSize')).toBe('10');
		expect(query.get('status')).toBe('successful');
		expect(query.get('includeRetried')).toBe('false');
	});

	it('tasks.get calls GET /robots/{id}/tasks/{taskId}', async () => {
		mockFetch({ statusCode: 200, result: { id: 't1' } });
		await getTask(makeCtx(), { robotId: 'r1', taskId: 't1' });
		expect(pathAndQuery().path).toBe('/v2/robots/r1/tasks/t1');
	});

	it('monitors.create POSTs documented monitor fields', async () => {
		mockFetch({ statusCode: 200, monitor: { id: 'm1', name: 'Watch' } });
		await createMonitor(makeCtx(), {
			robotId: 'r1',
			name: 'Watch',
			inputParameters: { originUrl: 'https://example.com' },
			notifyOnCapturedScreenshotChange: true,
			notifyOnCapturedTextChange: false,
			capturedScreenshotNotificationThreshold: 15,
			schedule: 'FREQ=DAILY;INTERVAL=1',
		});
		expect(captured?.method).toBe('POST');
		expect(pathAndQuery().path).toBe('/v2/robots/r1/monitors');
		expect(captured?.body).toContain('notifyOnCapturedScreenshotChange');
		expect(captured?.body).toContain('FREQ=DAILY');
	});

	it('monitors.delete DELETEs /robots/{id}/monitors/{monitorId}', async () => {
		mockFetch({ statusCode: 200, messageCode: 'success' });
		await deleteMonitor(makeCtx(), { robotId: 'r1', monitorId: 'm1' });
		expect(captured?.method).toBe('DELETE');
		expect(pathAndQuery().path).toBe('/v2/robots/r1/monitors/m1');
	});

	it('webhooks.create POSTs hookUrl and eventType', async () => {
		mockFetch({
			statusCode: 200,
			webhook: { id: 'w1', url: 'https://example.com/hook' },
		});
		await createWebhook(makeCtx(), {
			robotId: 'r1',
			hookUrl: 'https://example.com/hook',
			eventType: 'taskFinished',
		});
		expect(captured?.method).toBe('POST');
		expect(pathAndQuery().path).toBe('/v2/robots/r1/webhooks');
		expect(captured?.body).toContain('hookUrl');
		expect(captured?.body).toContain('taskFinished');
	});

	it('webhooks.list calls GET /robots/{id}/webhooks', async () => {
		mockFetch({
			statusCode: 200,
			webhooks: { totalCount: 0, items: [] },
		});
		await listWebhooks(makeCtx(), { robotId: 'r1' });
		expect(pathAndQuery().path).toBe('/v2/robots/r1/webhooks');
	});

	it('covers every registered operation', () => {
		expect(Object.keys(browseaiEndpointMeta).sort()).toEqual(
			Object.keys(browseaiEndpointSchemas).sort(),
		);
	});
});
