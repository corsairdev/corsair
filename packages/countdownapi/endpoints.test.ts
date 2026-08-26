import { logEventFromContext } from 'corsair/core';
import { makeCountdownApiRequest } from './client';
import { get as autocomplete } from './endpoints/autocomplete';
import { get as product } from './endpoints/product';
import { get as search } from './endpoints/search';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	makeCountdownApiRequest: jest.fn(),
}));

const mockRequest = makeCountdownApiRequest as jest.MockedFunction<
	typeof makeCountdownApiRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-countdownapi-key',
} as Parameters<typeof search>[0];

describe('CountdownApi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('search sends the correct request', async () => {
		await search(ctx, {
			query: 'iphone',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'search',
				query: 'iphone',
				ebay_domain: 'ebay.com',
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('product sends the correct request', async () => {
		await product(ctx, {
			epid: '123',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'product',
				url: undefined,
				epid: '123',
				gtin: undefined,
				ebay_domain: 'ebay.com',
				include_html: undefined,
				skip_gtin_cache: undefined,
				include_parts_compatibility: undefined,
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('autocomplete uses search_term', async () => {
		await autocomplete(ctx, {
			query: 'iph',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'autocomplete',
				search_term: 'iph',
				ebay_domain: 'ebay.com',
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});
});
