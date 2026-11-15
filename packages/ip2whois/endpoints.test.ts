import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { lookupDomain, lookupHosted } from './endpoints/whois';
import type { Ip2whoisContext } from './index';

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

const DOMAIN_SAMPLE = {
	domain: 'example.com',
	domain_id: '2336799_DOMAIN_COM-VRSN',
	status: 'client delete prohibited',
	create_date: '1995-08-14T04:00:00Z',
	update_date: '2024-08-14T07:01:38Z',
	expire_date: '2025-08-13T04:00:00Z',
	domain_age: 11323,
	whois_server: 'whois.verisign-grs.com',
	nameservers: ['a.iana-servers.net', 'b.iana-servers.net'],
};

const HOSTED_SAMPLE = {
	ip: '8.8.8.8',
	total_domains: 1,
	page: 1,
	per_page: 20,
	total_pages: 1,
	domains: [{ domain: 'dns.google' }],
};

function context(key: string): Ip2whoisContext {
	return { key } as Ip2whoisContext;
}

describe('domain.lookup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns the WHOIS record and sends the key as a query parameter', async () => {
		mockRequest.mockResolvedValue(DOMAIN_SAMPLE);
		const result = await lookupDomain(context('test-key'), {
			domain: 'example.com',
		});
		expect(result).toEqual(DOMAIN_SAMPLE);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.ip2whois.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/v2',
			query: {
				key: 'test-key',
				format: 'json',
				domain: 'example.com',
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ip2whois.domain.lookup',
			{},
			'completed',
		);
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(
			lookupDomain(context(''), { domain: 'example.com' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws the API error message from a 200 body and does not log', async () => {
		mockRequest.mockResolvedValue({
			error: { error_code: 10001, error_message: 'API key not found.' },
		});
		await expect(
			lookupDomain(context('test-key'), { domain: 'example.com' }),
		).rejects.toThrow('IP2WHOIS lookup failed: API key not found.');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v2' },
			{
				url: 'https://api.ip2whois.com/v2',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: { error_message: 'API key not found.' } },
			},
			'API key not found.',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			lookupDomain(context('test-key'), { domain: 'example.com' }),
		).rejects.toBe(error);
	});
});

describe('hosted.lookup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns hosted domains and omits page when the caller does', async () => {
		mockRequest.mockResolvedValue(HOSTED_SAMPLE);
		const result = await lookupHosted(context('test-key'), { ip: '8.8.8.8' });
		expect(result).toEqual(HOSTED_SAMPLE);
		const options = mockRequest.mock.calls[0]?.[1];
		expect(options).toMatchObject({
			url: '/hosteddomain',
			query: {
				key: 'test-key',
				format: 'json',
				ip: '8.8.8.8',
				page: undefined,
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ip2whois.hosted.lookup',
			{ page: 1 },
			'completed',
		);
		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload.ip).toBeUndefined();
	});
});
