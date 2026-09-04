import { request } from 'corsair/http';
import * as endpoints from './endpoints';
import type { ConvoloAiContext } from './index';
import { convoloAiEndpointSchemas, convoloai } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

const ctx = { key: 'test-key' } as unknown as ConvoloAiContext;

const apiKey = 'test-key';

type Case = {
	name: string;
	call: () => Promise<unknown>;
	method: string;
	url: string;
	query?: Record<string, unknown>;
};

const CASES: Case[] = [
	{
		name: 'agent.list',
		call: () => endpoints.Agent.list(ctx, { page: 1 }),
		method: 'GET',
		url: 'api/v1/agents',
		query: { page: 1 },
	},
	{
		name: 'agent.listV2',
		call: () => endpoints.Agent.listV2(ctx, {}),
		method: 'GET',
		url: 'api/v2/agents',
	},
	{
		name: 'agent.get',
		call: () => endpoints.Agent.get(ctx, { id: '7' }),
		method: 'GET',
		url: 'api/v1/agents/7',
	},
	{
		name: 'agent.create',
		call: () => endpoints.Agent.create(ctx, { body: { name: 'A' } }),
		method: 'POST',
		url: 'api/v1/agents',
	},
	{
		name: 'agent.update',
		call: () => endpoints.Agent.update(ctx, { id: '7', body: { name: 'B' } }),
		method: 'PATCH',
		url: 'api/v1/agents/7',
	},
	{
		name: 'agent.delete',
		call: () => endpoints.Agent.delete(ctx, { id: '7' }),
		method: 'DELETE',
		url: 'api/v1/agents/7',
	},
	{
		name: 'agent.updateSchedule',
		call: () => endpoints.Agent.updateSchedule(ctx, { id: '7', body: {} }),
		method: 'PATCH',
		url: 'api/v1/agents/update-schedule/7',
	},
	{
		name: 'call.list',
		call: () => endpoints.Call.list(ctx, { page: 0 }),
		method: 'GET',
		url: 'api/v1/calls/list',
		query: { page: 0 },
	},
	{
		name: 'call.listV5',
		call: () => endpoints.Call.listV5(ctx, {}),
		method: 'GET',
		url: 'api/v5/calls/list',
	},
	{
		name: 'call.listWithTags',
		call: () => endpoints.Call.listWithTags(ctx, { filter_s2l_has_tag: true }),
		method: 'GET',
		url: 'api/v1/calls/list-with-tags',
		query: { filter_s2l_has_tag: true },
	},
	{
		name: 'call.getDetails',
		call: () => endpoints.Call.getDetails(ctx, { callId: 'c1' }),
		method: 'GET',
		url: 'api/v1/calls/details/c1',
	},
	{
		name: 'call.getLog',
		call: () => endpoints.Call.getLog(ctx, { callId: 'c1' }),
		method: 'GET',
		url: 'api/v1/calls/log/c1',
	},
	{
		name: 'call.getEndWebhookPayload',
		call: () => endpoints.Call.getEndWebhookPayload(ctx, { callId: 'c1' }),
		method: 'GET',
		url: 'api/v1/calls/payload-end-call-webhook-by-call-id/c1',
	},
	{
		name: 'call.listPayloadData',
		call: () => endpoints.Call.listPayloadData(ctx, {}),
		method: 'GET',
		url: 'api/v2/calls/payload-data-list',
	},
	{
		name: 'call.setS2lTag',
		call: () => endpoints.Call.setS2lTag(ctx, { callId: 'c1', body: {} }),
		method: 'POST',
		url: 'api/v1/ext/calls/c1/s2l-tag',
	},
	{
		name: 'call.setRating',
		call: () =>
			endpoints.Call.setRating(ctx, { callId: 'c1', type: 'positive' }),
		method: 'GET',
		url: 'api/v1/ext/set-rating/c1',
		query: { type: 'positive' },
	},
	{
		name: 'call.trigger',
		call: () =>
			endpoints.Call.trigger(ctx, {
				api_key: 'acct-key',
				widget_key: 'wid-key',
				lc_number: '+15551234567',
			}),
		method: 'POST',
		url: 'rest/v1/ext/add_call_api/',
	},
	{
		name: 'lead.list',
		call: () => endpoints.Lead.list(ctx, { page: 1 }),
		method: 'GET',
		url: 'api/v1/leads',
		query: { page: 1 },
	},
	{
		name: 'lead.listByPost',
		call: () => endpoints.Lead.listByPost(ctx, { body: { page: 1 } }),
		method: 'POST',
		url: 'api/v1/get-leads',
	},
	{
		name: 'lead.getOutcomeTags',
		call: () => endpoints.Lead.getOutcomeTags(ctx, { id: 'l1' }),
		method: 'GET',
		url: 'api/v2/leads/outcome-tags/l1',
	},
	{
		name: 'widget.list',
		call: () => endpoints.Widget.list(ctx, { page: 1 }),
		method: 'GET',
		url: 'api/v1/widgets',
		query: { page: 1 },
	},
	{
		name: 'widget.create',
		call: () => endpoints.Widget.create(ctx, { body: {} }),
		method: 'POST',
		url: 'api/v1/widgets',
	},
	{
		name: 'widget.get',
		call: () => endpoints.Widget.get(ctx, { id: '3' }),
		method: 'GET',
		url: 'api/v1/widgets/3',
	},
	{
		name: 'widget.update',
		call: () => endpoints.Widget.update(ctx, { id: '3', body: {} }),
		method: 'PATCH',
		url: 'api/v1/widgets/3',
	},
	{
		name: 'widget.updateV2',
		call: () => endpoints.Widget.updateV2(ctx, { widgetId: '3', body: {} }),
		method: 'PATCH',
		url: 'api/v2/widgets/3',
	},
	{
		name: 'widget.delete',
		call: () => endpoints.Widget.delete(ctx, { id: '3' }),
		method: 'DELETE',
		url: 'api/v1/widgets/3',
	},
	{
		name: 'widget.toggle',
		call: () => endpoints.Widget.toggle(ctx, { id: 3, new_state: 1 }),
		method: 'GET',
		url: 'api/v1/widgets/toggle/3/1',
	},
	{
		name: 'widget.getHtmlSiteCode',
		call: () => endpoints.Widget.getHtmlSiteCode(ctx, { id: '3' }),
		method: 'GET',
		url: 'api/v1/widgets/html-site-code/3',
	},
	{
		name: 'widget.updateSettings',
		call: () =>
			endpoints.Widget.updateSettings(ctx, {
				widget_key: 'wk',
				api_key: 'ak',
				body: { apiUrl: 'https://x.y' },
			}),
		method: 'POST',
		url: 'api/v1/ext/update-widget-settings',
	},
	{
		name: 'getCustomWidgetParams',
		call: () =>
			endpoints.getCustomWidgetParams(ctx, { widget_key: 'wk', api_key: 'ak' }),
		method: 'GET',
		url: 'api/v2/ext/get-custom-params',
		query: { widget_key: 'wk', api_key: 'ak' },
	},
	{
		name: 'getOpenApiDocument',
		call: () => endpoints.getOpenApiDocument(ctx, {}),
		method: 'GET',
		url: 'api/v1/openapi',
	},
];

describe('convoloai endpoint wiring', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it.each(CASES)('$name calls $method $url', async (testCase) => {
		await testCase.call();
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected request to be called');
		const [config, options] = call;
		expect(config.BASE).toBe('https://app.brightcall.ai');
		expect(config.HEADERS).toEqual(
			expect.objectContaining({ 'api-key': apiKey }),
		);
		expect(options.method).toBe(testCase.method);
		expect(options.url).toBe(testCase.url);
		if (testCase.query) {
			for (const [key, value] of Object.entries(testCase.query)) {
				const received = (options.query as Record<string, unknown>)?.[key];
				expect(received).toEqual(value);
			}
		}
	});

	it('posts call.trigger credentials and lc_number in the JSON body', async () => {
		await endpoints.Call.trigger(ctx, {
			api_key: 'acct-key',
			widget_key: 'wid-key',
			lc_number: '+15551234567',
			body: { lc_param_name: 'Ada' },
		});
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected request to be called');
		expect(call[1].query).toBeUndefined();
		expect(call[1].body).toEqual({
			api_key: 'acct-key',
			widget_key: 'wid-key',
			lc_number: '+15551234567',
			lc_param_name: 'Ada',
		});
	});

	it('posts widget.updateSettings credentials in the JSON body', async () => {
		await endpoints.Widget.updateSettings(ctx, {
			widget_key: 'wk',
			api_key: 'ak',
			body: { apiUrl: 'https://x.y' },
		});
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected request to be called');
		expect(call[1].query).toBeUndefined();
		expect(call[1].body).toEqual({
			widget_key: 'wk',
			api_key: 'ak',
			apiUrl: 'https://x.y',
		});
	});

	it('encodes path ids', async () => {
		await endpoints.Agent.get(ctx, { id: 'a b/c' });
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected request to be called');
		expect(call[1].url).toBe('api/v1/agents/a%20b%2Fc');
	});

	it('exposes 31 wired endpoints', () => {
		const plugin = convoloai();
		const tree = plugin.endpoints as Record<string, unknown>;
		const count = (node: unknown): number => {
			if (typeof node === 'function') return 1;
			if (node && typeof node === 'object') {
				return Object.values(node).reduce(
					(sum: number, child) => sum + count(child),
					0,
				);
			}
			return 0;
		};
		expect(count(tree)).toBe(31);
	});

	it('covers every endpoint with schemas', () => {
		const plugin = convoloai();
		const meta = plugin.endpointMeta as Record<string, unknown>;
		const schemas = convoloAiEndpointSchemas as Record<
			string,
			{ input?: unknown; output?: unknown }
		>;
		expect(Object.keys(meta)).toHaveLength(31);
		expect(Object.keys(schemas)).toHaveLength(31);
		for (const key of Object.keys(meta)) {
			expect(schemas[key]?.input).toBeDefined();
			expect(schemas[key]?.output).toBeDefined();
		}
	});
});
