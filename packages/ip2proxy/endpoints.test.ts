import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { checkProxy } from './endpoints/proxy';
import { CheckProxyResponseSchema } from './endpoints/types';
import type { Ip2proxyContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

const PX11_SAMPLE = {
	response: 'OK',
	countryCode: 'KR',
	countryName: 'South Korea',
	regionName: 'Incheon',
	cityName: 'Incheon',
	isp: 'Amazon Technologies Inc.',
	domain: 'amazon.com',
	usageType: 'DCH',
	asn: '16509',
	as: 'Amazon.com, Inc.',
	lastSeen: 1,
	proxyType: 'DCH',
	isProxy: 'YES',
	threat: '-',
	provider: '-',
	creditsConsumed: 11,
};

function context(key: string, upsert?: jest.Mock): Ip2proxyContext {
	return {
		key,
		db: upsert ? { checks: { upsertByEntityId: upsert } } : undefined,
	} as unknown as Ip2proxyContext;
}

describe('proxy.checkProxy', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns the documented PX11 lookup and sends key, ip, package, and json', async () => {
		mockRequest.mockResolvedValue(PX11_SAMPLE);

		const result = await checkProxy(context('test-key'), {
			ip: '3.5.140.1',
			package: 'PX11',
		});

		expect(result).toEqual(PX11_SAMPLE);
		expect(CheckProxyResponseSchema.parse(result).creditsConsumed).toBe(11);

		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.ip2proxy.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/',
			query: {
				key: 'test-key',
				format: 'json',
				ip: '3.5.140.1',
				package: 'PX11',
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ip2proxy.proxy.checkProxy',
			{ package: 'PX11' },
			'completed',
		);
	});

	it('omits package when the caller does not choose one', async () => {
		mockRequest.mockResolvedValue({
			response: 'OK',
			countryCode: 'US',
			countryName: 'United States of America',
			isProxy: 'NO',
		});

		const result = await checkProxy(context('test-key'), { ip: '8.8.8.8' });

		expect(result).toEqual({
			response: 'OK',
			countryCode: 'US',
			countryName: 'United States of America',
			isProxy: 'NO',
		});
		expect(mockRequest.mock.calls[0]?.[1].query?.package).toBeUndefined();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ip2proxy.proxy.checkProxy',
			{ package: 'PX1' },
			'completed',
		);
	});

	it('accepts the DCH flag that PX2 to PX4 return for data-center addresses', async () => {
		mockRequest.mockResolvedValue({
			response: 'OK',
			countryCode: 'KR',
			countryName: 'South Korea',
			proxyType: 'DCH',
			isProxy: 'DCH',
		});

		const result = await checkProxy(context('test-key'), {
			ip: '3.5.140.1',
			package: 'PX2',
		});

		expect(result.isProxy).toBe('DCH');
	});

	it('accepts lastSeen and asn as strings, as the provider Go client reads them', async () => {
		mockRequest.mockResolvedValue({
			...PX11_SAMPLE,
			lastSeen: '1',
			asn: 16509,
		});

		const result = await checkProxy(context('test-key'), {
			ip: '3.5.140.1',
			package: 'PX11',
		});

		expect(result.lastSeen).toBe('1');
		expect(result.asn).toBe(16509);
	});

	it('refuses a missing key before any request', async () => {
		await expect(
			checkProxy(context(''), { ip: '8.8.8.8' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a package outside PX1 through PX11 before any request', async () => {
		await expect(
			checkProxy(context('test-key'), {
				ip: '8.8.8.8',
				package: 'PX12',
			} as never),
		).rejects.toThrow(/Invalid option/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a non-OK body instead of returning it as a lookup', async () => {
		mockRequest.mockResolvedValue({ response: 'INVALID IP ADDRESS' });

		await expect(
			checkProxy(context('test-key'), { ip: 'not-an-ip' }),
		).rejects.toThrow('IP2Proxy lookup failed: INVALID IP ADDRESS');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('lets a 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/' },
			{
				url: 'https://api.ip2proxy.com/?key=test-key',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { response: 'Invalid API key or insufficient credit.' },
			},
			'Invalid API key or insufficient credit.',
		);
		mockRequest.mockRejectedValue(error);

		await expect(
			checkProxy(context('test-key'), { ip: '8.8.8.8' }),
		).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a response that has no response field', async () => {
		mockRequest.mockResolvedValue({ countryCode: 'US' });
		await expect(
			checkProxy(context('test-key'), { ip: '8.8.8.8' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('stores the lookup under the queried address and does not log it', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(PX11_SAMPLE);
		await checkProxy(context('test-key', upsert), {
			ip: '3.5.140.1',
			package: 'PX11',
		});
		expect(upsert).toHaveBeenCalledWith('3.5.140.1', {
			ip: '3.5.140.1',
			...PX11_SAMPLE,
		});
		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload.ip).toBeUndefined();
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('does not store a lookup when the caller omitted the address', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ response: 'OK', isProxy: 'NO' });
		await checkProxy(context('test-key', upsert), {});
		expect(upsert).not.toHaveBeenCalled();
	});

	it('does not store a failed lookup', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ response: 'INVALID IP ADDRESS' });
		await expect(
			checkProxy(context('test-key', upsert), { ip: 'not-an-ip' }),
		).rejects.toThrow('IP2Proxy lookup failed: INVALID IP ADDRESS');
		expect(upsert).not.toHaveBeenCalled();
	});

	it('returns the lookup when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		mockRequest.mockResolvedValue(PX11_SAMPLE);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			checkProxy(context('test-key', upsert), {
				ip: '3.5.140.1',
				package: 'PX11',
			}),
		).resolves.toEqual(PX11_SAMPLE);
		warn.mockRestore();
	});
});
