import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { ProoflyContext } from './context';
import { listActivity } from './endpoints/activity';
import { listCampaigns } from './endpoints/campaigns';
import { getUser } from './endpoints/user';

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

function context(key: string, db?: ProoflyContext['db']): ProoflyContext {
	// unknown: the endpoint reads only `key` and `db`; a full context is not needed.
	return { key, db } as unknown as ProoflyContext;
}

describe('campaigns.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores the documented campaign and sends X-Api-Key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: [
				{
					id: 464014,
					name: 'Example',
					domain: { domain: 'example.com', subdomains: true },
					enabled: true,
					created: '1970-01-01 00:00:00',
				},
			],
		});
		const result = await listCampaigns(
			context('pk_test', {
				campaigns: { upsertByEntityId: upsert },
				// unknown: a fake table with only the methods the endpoint calls.
			} as unknown as ProoflyContext['db']),
			{},
		);
		expect(result.data[0]).toMatchObject({
			id: 464014,
			name: 'Example',
			domain: { domain: 'example.com', subdomains: true },
		});
		expect(upsert).toHaveBeenCalledWith('464014', {
			id: '464014',
			name: 'Example',
			domain: 'example.com',
			subdomains: true,
			enabled: true,
			created: '1970-01-01 00:00:00',
		});
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://proofly.io/api');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({ 'X-Api-Key': 'pk_test' });
		expect(options).toMatchObject({ method: 'GET', url: '/campaigns' });
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('pk_test');
	});

	it('rejects a body with no data before writing', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({ ok: true, status: 200 });
		await expect(
			listCampaigns(
				context('pk_test', {
					campaigns: { upsertByEntityId: upsert },
					// unknown: a fake table with only the methods the endpoint calls.
				} as unknown as ProoflyContext['db']),
				{},
			),
		).rejects.toThrow();
		expect(upsert).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listCampaigns(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets the documented HTTP 400 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/campaigns' },
			{
				url: 'https://proofly.io/api/campaigns',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					ok: false,
					status: 400,
					error: 'Authentication failed: give me a X-Api-Key header',
				},
			},
			'Authentication failed: give me a X-Api-Key header',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listCampaigns(context('pk_test'), {})).rejects.toBe(error);
	});
});

describe('user.get', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores the user and drops the pixel key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: {
				name: 'John Doe',
				email: 'info@example.com',
				meta: { logins: 36, registered: '1970-01-01 00:00:00' },
				impressions: { period: 2311, total: 57642 },
				pixel: { key: 'pixel_secret', debug: false },
			},
		});
		const result = await getUser(
			context('pk_test', {
				users: { upsertByEntityId: upsert },
				// unknown: a fake table with only the methods the endpoint calls.
			} as unknown as ProoflyContext['db']),
			{},
		);
		expect(result.data.email).toBe('info@example.com');
		expect(result.data.name).toBe('John Doe');
		expect(JSON.stringify(result)).not.toContain('pixel_secret');
		expect(upsert).toHaveBeenCalledWith('info@example.com', {
			email: 'info@example.com',
			name: 'John Doe',
			logins: 36,
			registered: '1970-01-01 00:00:00',
			impressionsPeriod: 2311,
			impressionsTotal: 57642,
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('pixel_secret');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/user',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({});
	});
});

describe('activity.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns the logs and does not store the IP', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: [
				{
					type: 'login.success',
					ip: '46.101.129.76',
					date: '1970-01-01 00:00:00',
				},
			],
		});
		const result = await listActivity(
			context('pk_test', {
				activity: { upsertByEntityId: upsert },
				// unknown: a fake table with only the methods the endpoint calls.
			} as unknown as ProoflyContext['db']),
			{},
		);
		expect(result.data).toEqual([
			{
				type: 'login.success',
				ip: '46.101.129.76',
				date: '1970-01-01 00:00:00',
			},
		]);
		expect(upsert).not.toHaveBeenCalled();
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'46.101.129.76',
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/activity',
		});
	});
});
