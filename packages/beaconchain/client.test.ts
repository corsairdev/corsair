import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	BeaconchainAPIError,
	makeBeaconchainHealthRequest,
	makeBeaconchainV1Request,
	makeBeaconchainV2Request,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

describe('makeBeaconchainV1Request', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ status: 'OK', data: {} });
	});

	it('authenticates with the apikey header and leaves TOKEN unset', async () => {
		await makeBeaconchainV1Request('chart/validators', 'test-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://beaconcha.in/api/v1',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({ apikey: 'test-key' }),
			}),
			expect.objectContaining({ method: 'GET', url: 'chart/validators' }),
		);
	});

	it('uses the hoodi V1 host when chain is hoodi', async () => {
		await makeBeaconchainV1Request('epoch/1', 'test-key', { chain: 'hoodi' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://hoodi.beaconcha.in/api/v1',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({ apikey: 'test-key' }),
			}),
			expect.objectContaining({ method: 'GET', url: 'epoch/1' }),
		);
	});
});

describe('makeBeaconchainV2Request', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: {} });
	});

	it('authenticates with Bearer TOKEN and does not set an apikey header', async () => {
		await makeBeaconchainV2Request('ethereum/validators', 'test-key', {
			method: 'POST',
			body: { chain: 'mainnet' },
		});

		const call = mockRequest.mock.calls[0];
		expect(call).toBeDefined();
		const config = call?.[0];
		const options = call?.[1];
		expect(config).toEqual(
			expect.objectContaining({
				BASE: 'https://beaconcha.in/api/v2',
				TOKEN: 'test-key',
			}),
		);
		expect(config?.HEADERS).not.toEqual(
			expect.objectContaining({ apikey: expect.anything() }),
		);
		expect(options).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: 'ethereum/validators',
				body: { chain: 'mainnet' },
			}),
		);
	});

	it('copies status and retryAfter off a transport ApiError', async () => {
		const response = {
			url: 'https://beaconcha.in/api/v2/ethereum/validators',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		} satisfies ApiResult;

		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: 'ethereum/validators',
				} satisfies ApiRequestOptions,
				response,
				'Rate limit exceeded',
				{ retryAfter: 2000 },
			),
		);

		await expect(
			makeBeaconchainV2Request('ethereum/validators', 'test-key', {
				method: 'POST',
				body: { chain: 'mainnet' },
			}),
		).rejects.toMatchObject({
			constructor: BeaconchainAPIError,
			status: 429,
			retryAfter: 2000,
		});
	});
});

describe('makeBeaconchainHealthRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue('module monitoring_api: OK');
	});

	it('calls /api/healthz on the origin with V1 apikey auth', async () => {
		await makeBeaconchainHealthRequest('test-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://beaconcha.in',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({ apikey: 'test-key' }),
			}),
			expect.objectContaining({ method: 'GET', url: 'api/healthz' }),
		);
	});

	it('uses the hoodi origin when chain is hoodi', async () => {
		await makeBeaconchainHealthRequest('test-key', 'hoodi');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://hoodi.beaconcha.in',
			}),
			expect.objectContaining({ method: 'GET', url: 'api/healthz' }),
		);
	});
});
