import {
	CheckBlockResponseSchema,
	CheckIpResponseSchema,
	ClearAddressResponseSchema,
	GetBlacklistResponseSchema,
	GetReportsResponseSchema,
	ReportIpResponseSchema,
} from './types';

// Endpoints call these schemas on the raw provider response at runtime
// (see the `.parse(response.data)` calls in endpoints/*.ts) — this proves
// that call has real teeth: a shape AbuseIPDB's API was never observed to
// return gets rejected instead of silently trusted.
describe('runtime output validation rejects malformed provider responses', () => {
	it('accepts a real check response (the documented data envelope)', () => {
		const real = {
			data: {
				ipAddress: '118.25.6.39',
				isPublic: true,
				ipVersion: 4,
				isWhitelisted: false,
				abuseConfidenceScore: 100,
				countryCode: 'CN',
				countryName: 'China',
				usageType: 'Data Center/Web Hosting/Transit',
				isp: 'Tencent Cloud Computing (Beijing) Co. Ltd.',
				domain: 'tencent.com',
				hostnames: ['118.25.6.39'],
				isTor: false,
				totalReports: 100,
				numDistinctUsers: 87,
				lastReportedAt: '2024-03-22T10:09:09+00:00',
			},
		};

		expect(() => CheckIpResponseSchema.parse(real.data)).not.toThrow();
	});

	it('accepts a verbose check response with reports', () => {
		const verbose = {
			data: {
				ipAddress: '118.25.6.39',
				isPublic: true,
				ipVersion: 4,
				isWhitelisted: false,
				abuseConfidenceScore: 100,
				countryCode: 'CN',
				countryName: 'China',
				usageType: 'Data Center/Web Hosting/Transit',
				isp: 'Tencent Cloud Computing (Beijing) Co. Ltd.',
				domain: 'tencent.com',
				hostnames: [],
				isTor: false,
				totalReports: 100,
				numDistinctUsers: 87,
				lastReportedAt: '2024-03-22T10:09:09+00:00',
				reports: [
					{
						reportedAt: '2024-03-22T10:09:09+00:00',
						comment: 'SSH brute force',
						categories: [18, 21],
						reporterId: 12345,
						reporterCountryCode: 'US',
						reporterCountryName: 'United States',
					},
				],
			},
		};

		expect(() => CheckIpResponseSchema.parse(verbose.data)).not.toThrow();
	});

	it('rejects a check response missing required fields', () => {
		const malformed = {
			ipAddress: '118.25.6.39',
			// isPublic, abuseConfidenceScore, hostnames, ... missing — an
			// error page or a differently-shaped response would look like this.
		};

		expect(() => CheckIpResponseSchema.parse(malformed)).toThrow();
	});

	it('accepts a real reports (pagination) response', () => {
		const real = {
			data: {
				total: 1,
				page: 1,
				count: 1,
				perPage: 25,
				lastPage: 1,
				nextPageUrl: null,
				previousPageUrl: null,
				results: [
					{
						reportedAt: '2024-03-22T10:09:09+00:00',
						comment: null,
						categories: [18, 21],
						reporterId: 12345,
						reporterCountryCode: 'US',
						reporterCountryName: 'United States',
					},
				],
			},
		};

		expect(() => GetReportsResponseSchema.parse(real.data)).not.toThrow();
	});

	it('rejects a reports response with the wrong shape', () => {
		const wrongShape = {
			data: {
				reports: [{ comment: 'x', categories: [18] }],
			},
		};

		expect(() => GetReportsResponseSchema.parse(wrongShape.data)).toThrow();
	});

	it('accepts the flattened blacklist shape the endpoint returns', () => {
		const real = {
			generatedAt: '2024-03-22T00:00:00+00:00',
			entries: [
				{
					ipAddress: '118.25.6.39',
					abuseConfidenceScore: 100,
					lastReportedAt: '2024-03-22T10:09:09+00:00',
					countryCode: 'CN',
				},
			],
		};

		expect(() => GetBlacklistResponseSchema.parse(real)).not.toThrow();
	});

	it('rejects a blacklist response missing the generation timestamp', () => {
		const wrongShape = {
			entries: [{ ipAddress: '118.25.6.39', abuseConfidenceScore: 100 }],
		};

		expect(() => GetBlacklistResponseSchema.parse(wrongShape)).toThrow();
	});

	it('accepts a real report response', () => {
		const real = {
			data: {
				ipAddress: '118.25.6.39',
				abuseConfidenceScore: 100,
			},
		};

		expect(() => ReportIpResponseSchema.parse(real.data)).not.toThrow();
	});

	it('rejects a report response missing the confidence score', () => {
		const wrongShape = {
			data: { ipAddress: '118.25.6.39' },
		};

		expect(() => ReportIpResponseSchema.parse(wrongShape.data)).toThrow();
	});

	it('accepts a real check-block response', () => {
		const real = {
			data: {
				networkAddress: '118.25.6.39',
				netmask: '255.255.255.0',
				minAddress: '118.25.6.0',
				maxAddress: '118.25.6.255',
				numPossibleHosts: 256,
				addressSpaceDesc: 'Private Use IPs',
				reportedAddress: [
					{
						ipAddress: '118.25.6.39',
						numReports: 100,
						mostRecentReport: '2024-03-22T10:09:09+00:00',
						abuseConfidenceScore: 100,
						countryCode: 'CN',
					},
				],
			},
		};

		expect(() => CheckBlockResponseSchema.parse(real.data)).not.toThrow();
	});

	it('accepts a real clear-address response', () => {
		const real = {
			data: { numReportsDeleted: 4 },
		};

		expect(() => ClearAddressResponseSchema.parse(real.data)).not.toThrow();
	});

	it('rejects a clear-address response with the wrong field', () => {
		const wrongShape = {
			data: { deleted: 4 },
		};

		expect(() => ClearAddressResponseSchema.parse(wrongShape.data)).toThrow();
	});

	it('rejects a check-block response missing the reported addresses', () => {
		const wrongShape = {
			data: { networkAddress: '118.25.6.39', netmask: '255.255.255.0' },
		};

		expect(() => CheckBlockResponseSchema.parse(wrongShape.data)).toThrow();
	});
});
