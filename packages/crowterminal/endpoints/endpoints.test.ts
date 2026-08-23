import type { CrowterminalContext } from '..';
import * as client from '../client';
import { register } from './agent';
import { getTypes, ingest, ingestBulk } from './data';
import { getByokPlatform, getPlatform } from './intelligence';
import {
	compareMd,
	engagementAnalysis,
	getBulk as getBulkMemory,
	getChangelog,
	get as getMemory,
	getPattern,
	validateChanges,
} from './memory';
import {
	getClient as sandboxClient,
	engagementAnalysis as sandboxEngagement,
	getMemory as sandboxMemory,
	validate as sandboxValidate,
} from './sandbox';
import { describeInput } from './shared';
import {
	getComponents,
	getHistory,
	getIncidents,
	get as getStatus,
	getUptime,
	ping,
} from './status';
import {
	create as createWebhook,
	deleteWebhook,
	list as listWebhooks,
	test as testWebhook,
	update as updateWebhook,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const { logEventFromContext } = jest.requireMock('corsair/core') as {
	logEventFromContext: jest.Mock;
};

const requestSpy = jest.spyOn(client, 'makeCrowterminalRequest');

const ctx = () => ({ key: 'ct_test_key' }) as unknown as CrowterminalContext;

beforeEach(() => {
	requestSpy.mockReset().mockResolvedValue({ success: true });
	logEventFromContext.mockClear();
});

const lastCall = () => requestSpy.mock.calls[0];

describe('request routing', () => {
	// Paths below were confirmed against live api.crowterminal.com.
	it.each([
		['statusGet', '/api/agent/status', getStatus],
		['statusPing', '/api/agent/status/ping', ping],
		['statusGetComponents', '/api/agent/status/components', getComponents],
		['statusGetIncidents', '/api/agent/status/incidents', getIncidents],
		['statusGetHistory', '/api/agent/status/history', getHistory],
		['statusGetUptime', '/api/agent/status/uptime', getUptime],
		['dataGetTypes', '/api/agent/data/types', getTypes],
		['intelGetPlatform', '/api/agent/platform-intel', getPlatform],
		['intelGetByok', '/api/agent/byok/platform-intel', getByokPlatform],
		['sandboxGetClient', '/api/agent/sandbox/client', sandboxClient],
		['sandboxGetMemory', '/api/agent/sandbox/memory', sandboxMemory],
		[
			'sandboxEngagement',
			'/api/agent/sandbox/engagement-analysis',
			sandboxEngagement,
		],
		['webhooksList', '/api/agent/webhooks', listWebhooks],
	])('routes %s to %s', async (_name, path, endpoint) => {
		requestSpy.mockResolvedValue({
			success: true,
			status: 'ok',
			pong: true,
			webhooks: [],
			components: [],
			incidents: [],
			dataPoints: [],
			uptime: {},
			dataTypes: {},
		});

		await (
			endpoint as (c: CrowterminalContext, i: unknown) => Promise<unknown>
		)(ctx(), {});

		expect(lastCall()?.[0]).toBe(path);
		expect(lastCall()?.[1]).toBe('ct_test_key');
	});

	it('routes the client-scoped memory reads', async () => {
		requestSpy.mockResolvedValue({ success: true, changelog: [] });
		await getChangelog(ctx(), { clientId: 'c1' });
		expect(lastCall()?.[0]).toBe('/api/agent/memory/c1/changelog');
	});

	it('sends the pattern field as a query parameter', async () => {
		requestSpy.mockResolvedValue({ success: true, dataPoints: [] });

		await getPattern(ctx(), { clientId: 'c1', field: 'primaryNiche' });

		expect(lastCall()?.[0]).toBe('/api/agent/memory/c1/pattern');
		expect(lastCall()?.[2]?.query).toEqual({ field: 'primaryNiche' });
	});

	it('posts compare-md to the documented hyphenated path', async () => {
		await compareMd(ctx(), { clientId: 'c1', agentMd: { a: 1 } });

		expect(lastCall()?.[0]).toBe('/api/agent/memory/c1/compare-md');
		expect(lastCall()?.[2]).toMatchObject({
			method: 'POST',
			body: { agentMd: { a: 1 } },
		});
	});

	it('names the bulk ingest array items, as the API requires', async () => {
		await ingestBulk(ctx(), {
			items: [
				{
					clientId: 'c1',
					platform: 'TIKTOK',
					dataType: 'retention',
					data: { avgWatchTime: 12 },
				},
			],
		});

		expect(lastCall()?.[0]).toBe('/api/agent/data/ingest/bulk');
		expect(Object.keys(lastCall()?.[2]?.body ?? {})).toEqual(['items']);
	});

	it('drops webhookId from the update body and puts it in the path', async () => {
		await updateWebhook(ctx(), { webhookId: 'wh_1', isActive: false });

		expect(lastCall()?.[0]).toBe('/api/agent/webhooks/wh_1');
		expect(lastCall()?.[2]?.method).toBe('PATCH');
		expect(lastCall()?.[2]?.body).toEqual({ isActive: false });
	});

	it('sends no body when deleting a webhook', async () => {
		await deleteWebhook(ctx(), { webhookId: 'wh_1' });

		expect(lastCall()?.[0]).toBe('/api/agent/webhooks/wh_1');
		expect(lastCall()?.[2]?.method).toBe('DELETE');
		expect(lastCall()?.[2]?.body).toBeUndefined();
	});

	it('registers an agent against the documented path', async () => {
		await register(ctx(), { agentName: 'MyBot' });

		expect(lastCall()?.[0]).toBe('/api/agent/register');
		expect(lastCall()?.[2]?.method).toBe('POST');
	});
});

describe('path segment encoding', () => {
	// A raw clientId of ../status retargets the credentialed request at a
	// different endpoint; the live API answers it with real status data.
	it('rejects an id that would escape its route', async () => {
		await expect(getMemory(ctx(), { clientId: '../status' })).rejects.toThrow();
		await expect(
			getChangelog(ctx(), { clientId: 'x/changelog' }),
		).rejects.toThrow();
		await expect(
			deleteWebhook(ctx(), { webhookId: '../../agent/webhooks' }),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	// encodeURIComponent leaves dots alone, so `..` survives escaping and URL
	// normalisation collapses the path onto a different route.
	it('rejects bare dot segments that encoding cannot neutralise', async () => {
		await expect(getMemory(ctx(), { clientId: '..' })).rejects.toThrow();
		await expect(getChangelog(ctx(), { clientId: '.' })).rejects.toThrow();
		await expect(deleteWebhook(ctx(), { webhookId: '..' })).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('still accepts ids that merely contain dots', async () => {
		requestSpy.mockResolvedValue({ success: true, changelog: [] });

		await getChangelog(ctx(), { clientId: 'a..b' });

		expect(lastCall()?.[0]).toBe('/api/agent/memory/a..b/changelog');
	});

	it('percent-encodes characters that are legal but reserved', async () => {
		requestSpy.mockResolvedValue({ success: true, changelog: [] });

		await getChangelog(ctx(), { clientId: 'a b&c' });

		expect(lastCall()?.[0]).toBe('/api/agent/memory/a%20b%26c/changelog');
	});
});

describe('input validation', () => {
	it('rejects a bulk read over the documented 50-client limit', async () => {
		await expect(
			getBulkMemory(ctx(), {
				clientIds: Array.from({ length: 51 }, (_v, i) => `c${i}`),
			}),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('rejects an unknown platform', async () => {
		await expect(
			ingest(ctx(), {
				clientId: 'c1',
				platform: 'MYSPACE',
				dataType: 'retention',
				data: {},
			} as never),
		).rejects.toThrow();
	});

	it('rejects a confidence outside 0-1', async () => {
		await expect(
			ingest(ctx(), {
				clientId: 'c1',
				platform: 'TIKTOK',
				dataType: 'retention',
				data: {},
				confidence: 1.5,
			}),
		).rejects.toThrow();
	});

	it('rejects a webhook url that is not a url', async () => {
		await expect(
			createWebhook(ctx(), { url: 'not-a-url', events: ['skill.updated'] }),
		).rejects.toThrow();
	});

	it('rejects an unknown webhook event name', async () => {
		await expect(
			createWebhook(ctx(), {
				url: 'https://example.com/hook',
				events: ['skill.exploded'],
			} as never),
		).rejects.toThrow();
	});

	it('requires at least one proposed change', async () => {
		await expect(
			validateChanges(ctx(), { clientId: 'c1', proposedChanges: [] }),
		).rejects.toThrow();
	});
});

describe('output validation', () => {
	it('accepts the live status shape', async () => {
		requestSpy.mockResolvedValue({
			status: 'outage',
			timestamp: '2026-08-23T15:00:00.935Z',
			version: '2.0.0',
			services: { redis: { status: 'outage', description: 'fallback' } },
			metrics: { uptime: '181d' },
		});

		const result = await getStatus(ctx(), {});

		expect(result.status).toBe('outage');
		expect(result.services?.redis?.status).toBe('outage');
	});

	it('accepts the live webhook listing shape', async () => {
		requestSpy.mockResolvedValue({
			success: true,
			webhooks: [],
			_tip: 'Use POST /api/agent/webhooks to register a new webhook',
		});

		await expect(listWebhooks(ctx(), {})).resolves.toMatchObject({
			webhooks: [],
		});
	});

	it('accepts an insufficient-data engagement analysis', async () => {
		requestSpy.mockResolvedValue({
			success: true,
			clientId: 'c1',
			analysis: 'insufficient_data',
			message: 'Only 0 versions stored',
		});

		await expect(
			engagementAnalysis(ctx(), { clientId: 'c1', agentMd: {} }),
		).resolves.toMatchObject({ analysis: 'insufficient_data' });
	});

	it('accepts a blocked sandbox validation', async () => {
		requestSpy.mockResolvedValue({
			success: true,
			_sandbox: true,
			validation: 'blocked',
			warnings: [{ field: 'hookPatterns', severity: 'critical' }],
			recommendations: [],
		});

		const result = await sandboxValidate(ctx(), {
			proposedChanges: [{ field: 'hookPatterns', newValue: 'tutorial' }],
		});

		expect(result.validation).toBe('blocked');
		expect(result.warnings).toHaveLength(1);
	});

	it('keeps advisory fields the service adds', async () => {
		requestSpy.mockResolvedValue({
			success: true,
			dataTypes: { TIKTOK: ['retention'] },
			_docs: 'https://crowterminal.com/llms.txt',
		});

		await expect(getTypes(ctx(), {})).resolves.toMatchObject({
			_docs: 'https://crowterminal.com/llms.txt',
		});
	});

	it('rejects a status response missing its required field', async () => {
		requestSpy.mockResolvedValue({ currentStatus: 'operational' });

		await expect(getStatus(ctx(), {})).rejects.toThrow();
	});
});

describe('event logging', () => {
	it('never logs a webhook signing secret', async () => {
		await createWebhook(ctx(), {
			url: 'https://example.com/hook',
			events: ['skill.updated'],
			secret: 'super-secret-signing-key',
		});

		const [, event, payload] = logEventFromContext.mock.calls[0];
		expect(event).toBe('crowterminal.webhooks.create');
		expect(JSON.stringify(payload)).not.toContain('super-secret-signing-key');
		expect(payload).toMatchObject({
			url: 'https://example.com/hook',
			secretPresent: true,
		});
	});

	it('never logs the secret from a webhook test', async () => {
		await testWebhook(ctx(), {
			url: 'https://example.com/hook',
			secret: 'another-secret',
		});

		const [, , payload] = logEventFromContext.mock.calls[0];
		expect(JSON.stringify(payload)).not.toContain('another-secret');
	});

	it('records ingest metadata without the payload body', async () => {
		await ingest(ctx(), {
			clientId: 'c1',
			platform: 'TIKTOK',
			dataType: 'retention',
			videoId: 'v9',
			data: { avgWatchTime: 12.5, viewerIds: ['u1', 'u2'] },
		});

		const [, , payload] = logEventFromContext.mock.calls[0];
		expect(payload).toMatchObject({
			clientId: 'c1',
			platform: 'TIKTOK',
			dataType: 'retention',
			videoId: 'v9',
			dataKeys: 2,
		});
		expect(JSON.stringify(payload)).not.toContain('avgWatchTime');
		expect(JSON.stringify(payload)).not.toContain('u1');
	});

	it('does not log a call that failed validation', async () => {
		await expect(getMemory(ctx(), { clientId: '../status' })).rejects.toThrow();

		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('summarises payload fields by size only', () => {
		expect(
			describeInput({
				clientId: 'c1',
				agentMd: { a: 1, b: 2 },
				proposedChanges: [{ field: 'x' }],
				secret: 's3cret',
			}),
		).toEqual({
			clientId: 'c1',
			agentMdKeys: 2,
			proposedChangesCount: 1,
			secretPresent: true,
		});
	});
});

describe('sandbox engagement analysis', () => {
	it('omits agentMd from the body when the caller sends none', async () => {
		requestSpy.mockResolvedValue({ success: true });

		await sandboxEngagement(ctx(), {});

		expect(lastCall()?.[0]).toBe('/api/agent/sandbox/engagement-analysis');
		expect(lastCall()?.[2]?.method).toBe('POST');
		expect(lastCall()?.[2]?.body).toEqual({});
	});

	it('sends agentMd when the caller supplies it', async () => {
		requestSpy.mockResolvedValue({ success: true, versionsAnalyzed: 47 });

		const result = await sandboxEngagement(ctx(), {
			agentMd: { hookPatterns: ['confession'] },
		});

		expect(lastCall()?.[2]?.body).toEqual({
			agentMd: { hookPatterns: ['confession'] },
		});
		expect(result.versionsAnalyzed).toBe(47);
	});
});

describe('failure logging', () => {
	it('records a failed event when the request throws', async () => {
		requestSpy.mockRejectedValue(new Error('502 upstream'));

		await expect(getStatus(ctx(), {})).rejects.toThrow('502 upstream');

		const [, event, , status] = logEventFromContext.mock.calls[0];
		expect(event).toBe('crowterminal.status.get');
		expect(status).toBe('failed');
	});

	it('records a failed event when the response fails its schema', async () => {
		requestSpy.mockResolvedValue({ currentStatus: 'operational' });

		await expect(getStatus(ctx(), {})).rejects.toThrow();

		expect(logEventFromContext.mock.calls[0][3]).toBe('failed');
	});

	it('redacts the same fields on a failed call', async () => {
		requestSpy.mockRejectedValue(new Error('boom'));

		await expect(
			createWebhook(ctx(), {
				url: 'https://example.com/hook',
				events: ['skill.updated'],
				secret: 'leaky-secret',
			}),
		).rejects.toThrow();

		const [, , payload, status] = logEventFromContext.mock.calls[0];
		expect(status).toBe('failed');
		expect(JSON.stringify(payload)).not.toContain('leaky-secret');
	});
});
