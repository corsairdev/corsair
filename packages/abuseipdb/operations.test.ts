import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from './client';
import {
	Blacklist,
	CheckBlock,
	CheckIp,
	ClearAddress,
	ReportIp,
	Reports,
} from './endpoints';
import { ReportIpInputSchema } from './endpoints/types';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeAbuseIPDBRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeAbuseIPDBRequest);
const mockLog = jest.mocked(logEventFromContext);

function createContext() {
	return {
		key: 'test-key',
		db: {
			ipChecks: {
				upsertByEntityId: jest.fn(async () => undefined),
				deleteByEntityId: jest.fn(async () => true),
			},
			reports: {
				upsertByEntityId: jest.fn(async () => undefined),
				deleteByEntityId: jest.fn(async () => true),
			},
		},
	};
}

const CHECK_DATA = {
	ipAddress: '118.25.6.39',
	isPublic: true,
	ipVersion: 4,
	isWhitelisted: false,
	abuseConfidenceScore: 100,
	countryCode: 'CN',
	usageType: 'Data Center/Web Hosting/Transit',
	isp: 'Tencent',
	domain: 'tencent.com',
	hostnames: [],
	isTor: false,
	totalReports: 1,
	numDistinctUsers: 1,
	lastReportedAt: '2024-03-22T10:09:09+00:00',
};

describe('AbuseIPDB endpoint operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('throws AuthMissingError when no key is configured', async () => {
		await expect(
			CheckIp.check({ key: '', db: {} } as never, {
				ipAddress: '118.25.6.39',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('check.ip sends verbose as an empty flag and persists the result', async () => {
		mockRequest.mockResolvedValue({ data: CHECK_DATA });
		const ctx = createContext();

		const result = await CheckIp.check(ctx as never, {
			ipAddress: '118.25.6.39',
			verbose: true,
		});

		expect(mockRequest).toHaveBeenCalledWith('check', 'test-key', {
			query: {
				ipAddress: '118.25.6.39',
				maxAgeInDays: undefined,
				verbose: '',
			},
		});
		expect(ctx.db.ipChecks.upsertByEntityId).toHaveBeenCalledWith(
			'118.25.6.39',
			expect.objectContaining({
				ipAddress: '118.25.6.39',
				abuseConfidenceScore: 100,
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'abuseipdb.check.ip',
			{ ipAddress: '118.25.6.39' },
			'completed',
		);
		expect(result.ipAddress).toBe('118.25.6.39');
	});

	it('reports.list passes page and perPage', async () => {
		mockRequest.mockResolvedValue({
			data: {
				total: 1,
				page: 2,
				count: 1,
				perPage: 25,
				lastPage: 2,
				nextPageUrl: null,
				previousPageUrl: null,
				results: [
					{
						reportedAt: '2024-03-22T10:09:09+00:00',
						comment: null,
						categories: [18],
						reporterId: 1,
					},
				],
			},
		});
		const ctx = createContext();

		const result = await Reports.list(ctx as never, {
			ipAddress: '118.25.6.39',
			page: 2,
			perPage: 25,
		});

		expect(mockRequest).toHaveBeenCalledWith('reports', 'test-key', {
			query: {
				ipAddress: '118.25.6.39',
				maxAgeInDays: undefined,
				page: 2,
				perPage: 25,
			},
		});
		expect(result.page).toBe(2);
		expect(result.results).toHaveLength(1);
	});

	it('blacklist.get flattens meta/data without persisting entries', async () => {
		mockRequest.mockResolvedValue({
			meta: { generatedAt: '2024-03-22T00:00:00+00:00' },
			data: [
				{
					ipAddress: '118.25.6.39',
					abuseConfidenceScore: 100,
					lastReportedAt: '2024-03-22T10:09:09+00:00',
					countryCode: 'CN',
				},
				{
					ipAddress: '1.2.3.4',
					abuseConfidenceScore: 90,
					countryCode: 'US',
				},
			],
		});
		const ctx = createContext();

		const result = await Blacklist.get(ctx as never, {
			confidenceMinimum: 90,
			limit: 5,
		});

		expect(mockRequest).toHaveBeenCalledWith('blacklist', 'test-key', {
			query: {
				confidenceMinimum: 90,
				limit: 5,
				onlyCountries: undefined,
				exceptCountries: undefined,
				ipVersion: undefined,
			},
		});
		expect(result).toEqual({
			generatedAt: '2024-03-22T00:00:00+00:00',
			entries: [
				{
					ipAddress: '118.25.6.39',
					abuseConfidenceScore: 100,
					lastReportedAt: '2024-03-22T10:09:09+00:00',
					countryCode: 'CN',
				},
				{
					ipAddress: '1.2.3.4',
					abuseConfidenceScore: 90,
					countryCode: 'US',
				},
			],
		});
		expect(ctx.db.ipChecks.upsertByEntityId).not.toHaveBeenCalled();
		expect(ctx.db.reports.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('report.ip POSTs form fields and persists the report', async () => {
		mockRequest.mockResolvedValue({
			data: { ipAddress: '118.25.6.39', abuseConfidenceScore: 100 },
		});
		const ctx = createContext();

		const result = await ReportIp.report(ctx as never, {
			ip: '118.25.6.39',
			categories: [18, 21],
			comment: 'SSH brute force',
		});

		expect(mockRequest).toHaveBeenCalledWith('report', 'test-key', {
			method: 'POST',
			formBody: {
				ip: '118.25.6.39',
				categories: '18,21',
				comment: 'SSH brute force',
				timestamp: undefined,
			},
		});
		expect(ctx.db.reports.upsertByEntityId).toHaveBeenCalledWith(
			'118.25.6.39',
			expect.objectContaining({
				ipAddress: '118.25.6.39',
				abuseConfidenceScore: 100,
			}),
		);
		expect(result.ipAddress).toBe('118.25.6.39');
	});

	it('block.check requests the CIDR network', async () => {
		mockRequest.mockResolvedValue({
			data: {
				networkAddress: '118.25.6.0',
				netmask: '255.255.255.0',
				minAddress: '118.25.6.0',
				maxAddress: '118.25.6.255',
				numPossibleHosts: 256,
				reportedAddress: [],
			},
		});
		const ctx = createContext();

		const result = await CheckBlock.check(ctx as never, {
			network: '118.25.6.0/24',
		});

		expect(mockRequest).toHaveBeenCalledWith('check-block', 'test-key', {
			query: {
				network: '118.25.6.0/24',
				maxAgeInDays: undefined,
			},
		});
		expect(result.networkAddress).toBe('118.25.6.0');
	});

	it('address.clear DELETEs with the IP query and drops local cache rows', async () => {
		mockRequest.mockResolvedValue({ data: { numReportsDeleted: 4 } });
		const ctx = createContext();

		const result = await ClearAddress.clear(ctx as never, {
			ipAddress: '118.25.6.39',
		});

		expect(mockRequest).toHaveBeenCalledWith('clear-address', 'test-key', {
			method: 'DELETE',
			query: { ipAddress: '118.25.6.39' },
		});
		expect(ctx.db.reports.deleteByEntityId).toHaveBeenCalledWith('118.25.6.39');
		expect(ctx.db.ipChecks.deleteByEntityId).toHaveBeenCalledWith(
			'118.25.6.39',
		);
		expect(result.numReportsDeleted).toBe(4);
	});

	it('rejects a report timestamp that is not ISO-8601', () => {
		expect(() =>
			ReportIpInputSchema.parse({
				ip: '118.25.6.39',
				categories: [18],
				timestamp: 'tomorrow',
			}),
		).toThrow();
		expect(() =>
			ReportIpInputSchema.parse({
				ip: '118.25.6.39',
				categories: [18],
				timestamp: '2024-03-22T10:09:09+00:00',
			}),
		).not.toThrow();
	});
});
