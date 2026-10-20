import { logEventFromContext } from 'corsair/core';
import { makeOrbitRequest } from './client';
import {
	Bulk,
	Enrich,
	Faces,
	Search,
	Watchers,
	WebhooksApi,
} from './endpoints';
import type { OrbitContext } from './index';

jest.mock('./client', () => ({
	makeOrbitRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const mockRequest = makeOrbitRequest as jest.MockedFunction<
	typeof makeOrbitRequest
>;

function ctx(): OrbitContext {
	// Routing only needs the API key. The rest of the plugin context is unused.
	return { key: 'x_key_test', options: {} } as OrbitContext;
}

const search = { search_id: 'search_1', status: 'running' as const };
const enrich = {
	request_id: 'req_1',
	profile_id: 'profile_1',
	status: 'running' as const,
};
const bulk = {
	job_id: '00000000-0000-4000-8000-000000000001',
	status: 'queued' as const,
};
const watcher = { id: '00000000-0000-4000-8000-000000000002' };
const webhook = {
	id: '00000000-0000-4000-8000-000000000003',
	url: 'https://example.com/hook',
	event_types: ['profile.updated'],
	enabled: true,
};

describe('orbit routing', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		jest.mocked(logEventFromContext).mockReset();
	});

	const cases: Array<{
		name: string;
		// Each case calls a different endpoint, so there is no single return type.
		run: () => Promise<unknown>;
		// The mock body is parsed by that endpoint's own output schema.
		response: unknown;
		method: string;
		url: string;
	}> = [
		{
			name: 'search.start',
			run: () => Search.start(ctx(), { query: 'ml engineers' }),
			response: search,
			method: 'POST',
			url: '/v3/search',
		},
		{
			name: 'search.get',
			run: () => Search.get(ctx(), { search_id: 'search_1' }),
			response: search,
			method: 'GET',
			url: '/v3/search/{search_id}',
		},
		{
			name: 'search.quotePopulation',
			run: () =>
				Search.quotePopulation(ctx(), {
					population: { kind: 'company', id: '1', name: 'Orbit' },
				}),
			response: { credits: 3 },
			method: 'POST',
			url: '/v3/search/populations/quote',
		},
		{
			name: 'search.startPopulation',
			run: () =>
				Search.startPopulation(ctx(), {
					population: { kind: 'school', id: '2', name: 'State' },
				}),
			response: search,
			method: 'POST',
			url: '/v3/search/populations',
		},
		{
			name: 'enrich.read',
			run: () => Enrich.read(ctx(), { profile_id: 'profile_1' }),
			response: { profile_id: 'profile_1' },
			method: 'GET',
			url: '/v3/enrich/{profile_id}',
		},
		{
			name: 'enrich.start',
			run: () =>
				Enrich.start(ctx(), { profile_id: 'profile_1', operation: 'partial' }),
			response: enrich,
			method: 'POST',
			url: '/v3/enrich/{profile_id}',
		},
		{
			name: 'enrich.get',
			run: () => Enrich.get(ctx(), { request_id: 'req_1' }),
			response: enrich,
			method: 'GET',
			url: '/v3/enrich/requests/{request_id}',
		},
		{
			name: 'enrich.batch',
			run: () =>
				Enrich.batch(ctx(), { profile_ids: ['profile_1'], operation: 'full' }),
			response: { request_id: 'batch_1', status: 'running' },
			method: 'POST',
			url: '/v3/enrich',
		},
		{
			name: 'bulk.submit',
			run: () =>
				Bulk.submit(ctx(), {
					request_id: 'bulk-1',
					items: [{ query: 'a person' }],
				}),
			response: bulk,
			method: 'POST',
			url: '/v3/search/bulk',
		},
		{
			name: 'bulk.get',
			run: () => Bulk.get(ctx(), { job_id: bulk.job_id }),
			response: bulk,
			method: 'GET',
			url: '/v3/search/bulk/{job_id}',
		},
		{
			name: 'bulk.results',
			run: () => Bulk.results(ctx(), { job_id: bulk.job_id, offset: 0 }),
			response: { results: [] },
			method: 'GET',
			url: '/v3/search/bulk/{job_id}/results',
		},
		{
			name: 'bulk.cancel',
			run: () => Bulk.cancel(ctx(), { job_id: bulk.job_id }),
			response: { ...bulk, status: 'canceled' },
			method: 'POST',
			url: '/v3/search/bulk/{job_id}/cancel',
		},
		{
			name: 'faces.detect',
			run: () => Faces.detect(ctx(), { imageBase64: 'aGVsbG8=' }),
			response: { image_url: 'img_1', faces: [] },
			method: 'POST',
			url: '/v3/faces/detect',
		},
		{
			name: 'faces.index',
			run: () => Faces.index(ctx(), { image_url: 'img_1' }),
			response: { matches: [] },
			method: 'POST',
			url: '/v3/faces/index-search',
		},
		{
			name: 'watchers.create',
			run: () =>
				Watchers.create(ctx(), {
					orbit_id: '00000000-0000-4000-8000-000000000004',
					interval_seconds: 3600,
				}),
			response: watcher,
			method: 'POST',
			url: '/v3/watchers',
		},
		{
			name: 'watchers.list',
			run: () => Watchers.list(ctx(), {}),
			response: { watchers: [] },
			method: 'GET',
			url: '/v3/watchers',
		},
		{
			name: 'watchers.get',
			run: () => Watchers.get(ctx(), { watcher_id: watcher.id }),
			response: watcher,
			method: 'GET',
			url: '/v3/watchers/{watcher_id}',
		},
		{
			name: 'watchers.update',
			run: () =>
				Watchers.update(ctx(), { watcher_id: watcher.id, enabled: false }),
			response: watcher,
			method: 'PATCH',
			url: '/v3/watchers/{watcher_id}',
		},
		{
			name: 'watchers.delete',
			run: () => Watchers.delete(ctx(), { watcher_id: watcher.id }),
			response: { id: watcher.id, deleted: true },
			method: 'DELETE',
			url: '/v3/watchers/{watcher_id}',
		},
		{
			name: 'watchers.runs',
			run: () => Watchers.runs(ctx(), { watcher_id: watcher.id, limit: 10 }),
			response: { runs: [] },
			method: 'GET',
			url: '/v3/watchers/{watcher_id}/runs',
		},
		{
			name: 'webhooks.create',
			run: () => WebhooksApi.create(ctx(), { url: 'https://example.com/hook' }),
			response: webhook,
			method: 'POST',
			url: '/v3/webhooks',
		},
		{
			name: 'webhooks.list',
			run: () => WebhooksApi.list(ctx(), {}),
			response: { webhooks: [] },
			method: 'GET',
			url: '/v3/webhooks',
		},
		{
			name: 'webhooks.delete',
			run: () => WebhooksApi.delete(ctx(), { webhook_id: webhook.id }),
			response: { id: webhook.id, deleted: true },
			method: 'DELETE',
			url: '/v3/webhooks/{webhook_id}',
		},
		{
			name: 'webhooks.test',
			run: () => WebhooksApi.test(ctx(), { webhook_id: webhook.id }),
			response: { delivered: true },
			method: 'POST',
			url: '/v3/webhooks/{webhook_id}/test',
		},
	];

	it.each(cases)(
		'$name calls $method $url',
		async ({ run, response, method, url }) => {
			mockRequest.mockResolvedValue(response);
			await run();
			expect(mockRequest).toHaveBeenCalledWith(
				url,
				'x_key_test',
				expect.objectContaining({ method }),
			);
			expect(logEventFromContext).toHaveBeenCalled();
		},
	);
});
