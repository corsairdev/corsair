import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Templates } from './endpoints';
import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { FlexisignContext } from './index';
import { flexisign } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLogEvent = jest.mocked(logEventFromContext);

const templateListResponse = {
	status: 'success',
	code: 200,
	data: {
		list: [
			{ _id: '6a927012137aed058249a39b', name: 'corsair Flexisign API Test' },
			{ _id: '7b038123248bfd169350b40c', name: 'Onboarding Template' },
		],
		meta: {
			total: 2,
			limit: 10,
			page: 1,
			pages: 1,
			previousPage: null,
			nextPage: null,
		},
	},
	message: 'Data Sent Sucessfully',
};

// Minimal endpoint context. listTemplates reads only `ctx.key` (event logging
// is mocked below), so the remaining context members are unneeded here. A
// full FlexisignContext also carries the endpoint tree, db clients, plugin
// options, and the account key manager (DEK ops plus field accessors), which
// cannot be meaningfully constructed in a unit test — hence one narrow
// assertion, which is safe because the endpoint never touches those members.
function createMockContext(key = 'test-api-key'): FlexisignContext {
	return {
		key,
		$getAccountId: () => Promise.resolve('test-account-id'),
	} as FlexisignContext;
}

describe('Flexisign list.templates endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns templates and logs completion', async () => {
		mockRequest.mockResolvedValueOnce(templateListResponse);
		const ctx = createMockContext();

		const result = await Templates.listTemplates(ctx, {});

		expect(result).toEqual(templateListResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://api.flexisign.io' }),
			expect.objectContaining({ method: 'GET', url: '/v1/templates/all' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'flexisign.list.templates',
			{},
			'completed',
		);
		expect(() =>
			FlexisignEndpointOutputSchemas.ListTemplates.parse(result),
		).not.toThrow();
	});

	it('forwards pagination input as query params', async () => {
		mockRequest.mockResolvedValueOnce(templateListResponse);
		const ctx = createMockContext();

		await Templates.listTemplates(ctx, { page: 2, limit: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ query: { page: 2, limit: 10 } }),
		);
	});

	it('exposes pagination metadata in the response', async () => {
		mockRequest.mockResolvedValueOnce(templateListResponse);
		const ctx = createMockContext();

		const result = await Templates.listTemplates(ctx, {});
		expect(result.data.meta.total).toBe(2);
		expect(result.data.meta.page).toBe(1);
		expect(result.data.meta.limit).toBe(10);
		expect(result.data.list).toHaveLength(2);
		expect(result.data.list[0]?.name).toBe('corsair Flexisign API Test');
	});

	it('rejects invalid pagination input before calling the API', async () => {
		const ctx = createMockContext();
		await expect(Templates.listTemplates(ctx, { page: 0 })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(() =>
			FlexisignEndpointInputSchemas.ListTemplates.parse({ page: 0 }),
		).toThrow();
	});

	it('propagates auth failures so AUTH_ERROR matches with no retries', async () => {
		const transportError = new ApiError(
			{ method: 'GET', url: '/v1/templates/all' },
			{
				body: { message: 'Unauthorized' },
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				url: 'https://api.flexisign.io/v1/templates/all',
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValueOnce(transportError);
		const ctx = createMockContext('bad-key');

		let caught: Error;
		try {
			await Templates.listTemplates(ctx, {});
			throw new Error('expected listTemplates to throw');
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('expected an Error');
			caught = error;
		}
		expect(caught).toBeInstanceOf(Error);
		expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
		const strategy = await errorHandlers.AUTH_ERROR.handler();
		expect(strategy.maxRetries).toBe(0);
	});

	it('propagates 429 so RATE_LIMIT_ERROR matches with retries', async () => {
		const transportError = new ApiError(
			{ method: 'GET', url: '/v1/templates/all' },
			{
				body: { message: 'Too Many Requests' },
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.flexisign.io/v1/templates/all',
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockRequest.mockRejectedValueOnce(transportError);
		const ctx = createMockContext();

		let caught: Error;
		try {
			await Templates.listTemplates(ctx, {});
			throw new Error('expected listTemplates to throw');
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('expected an Error');
			caught = error;
		}
		expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(caught);
		expect(strategy.maxRetries).toBe(5);
	});

	it('registers list.templates on the plugin with read metadata', () => {
		const plugin = flexisign({ key: 'test-api-key' });
		expect(plugin.id).toBe('flexisign');
		expect(plugin.endpoints?.list?.templates).toBeDefined();
		expect(plugin.endpointMeta?.['list.templates']?.riskLevel).toBe('read');
	});
});
