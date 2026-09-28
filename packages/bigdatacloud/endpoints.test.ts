import { Asn, Location, Network, Security, Validation } from './endpoints';
import { createContext, installFetchHarness } from './test-harness';

describe('BigDataCloud Endpoints Unit Tests', () => {
	let harness: ReturnType<typeof installFetchHarness>;
	let warn: jest.SpyInstance;

	beforeEach(() => {
		harness = installFetchHarness();
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		harness.restore();
		warn.mockRestore();
	});

	// =========================================================================
	// ASN Operations
	// =========================================================================
	describe('asn.asnExtendedReceivingFromInfo', () => {
		it('calls asn-info-receiving-from with correct parameters and persists asn', async () => {
			harness.queue({
				body: {
					asn: 'AS13335',
					asnNumeric: 13335,
					organisation: 'Cloudflare, Inc.',
					name: 'CLOUDFLARENET',
					totalReceivingFrom: 1,
					receivingFrom: [
						{
							asn: 'AS174',
							asnNumeric: 174,
							organisation: 'Cogent Communications',
							name: 'COGENT-174',
						},
					],
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Asn.asnExtendedReceivingFromInfo(ctx, {
				asn: 'AS13335',
				batchSize: 10,
			});

			const req = harness.requestAt(0);
			expect(req.method).toBe('GET');
			expect(req.url).toContain('/asn-info-receiving-from');
			expect(req.url).toContain('asn=AS13335');
			expect(req.url).toContain('batchSize=10');
			expect(req.url).toContain('key=test-api-key');
			expect(result.asn).toBe('AS13335');
			expect(upserts.asns?.[0]?.entityId).toBe('AS13335');
		});
	});

	describe('asn.asnExtendedTransitToInfo', () => {
		it('calls asn-info-transit-to with correct parameters', async () => {
			harness.queue({
				body: {
					asn: 'AS13335',
					asnNumeric: 13335,
					organisation: 'Cloudflare, Inc.',
					name: 'CLOUDFLARENET',
					totalTransitTo: 5,
					transitTo: [],
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Asn.asnExtendedTransitToInfo(ctx, {
				asn: '13335',
			});

			const req = harness.requestAt(0);
			expect(req.method).toBe('GET');
			expect(req.url).toContain('/asn-info-transit-to');
			expect(req.url).toContain('asn=13335');
			expect(result.asnNumeric).toBe(13335);
			expect(upserts.asns?.[0]?.entityId).toBe('AS13335');
		});
	});

	describe('asn.asnRankList', () => {
		it('calls asn-rank-list and persists returned ASNs', async () => {
			harness.queue({
				body: {
					total: 80000,
					offset: 0,
					batch: 2,
					asns: [
						{
							asn: 'AS749',
							asnNumeric: 749,
							organisation: 'DoD',
							name: 'DNIC-AS-00749',
						},
						{
							asn: 'AS16509',
							asnNumeric: 16509,
							organisation: 'Amazon',
							name: 'AMAZON-02',
						},
					],
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Asn.asnRankList(ctx, { batchSize: 2 });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/asn-rank-list');
			expect(result.asns).toHaveLength(2);
			expect(upserts.asns).toHaveLength(2);
		});
	});

	describe('asn.bgpActivePrefixes', () => {
		it('calls prefixes-list with ASN and persists bgpPrefixes', async () => {
			harness.queue({
				body: {
					total: 100,
					offset: 0,
					batch: 1,
					prefixes: [
						{
							bgpPrefix: '1.0.0.0/24',
							bgpPrefixNetworkAddress: '1.0.0.0',
							bgpPrefixLastAddress: '1.0.0.255',
							registryStatus: 'Assigned',
							isBogon: false,
							isAnnounced: true,
						},
					],
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Asn.bgpActivePrefixes(ctx, {
				asn: 'AS13335',
				isv4: true,
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/prefixes-list');
			expect(req.url).toContain('asn=AS13335');
			expect(req.url).toContain('isv4=true');
			expect(result.prefixes).toHaveLength(1);
			expect(upserts.bgpPrefixes?.[0]?.entityId).toBe('1.0.0.0/24');
		});
	});

	// =========================================================================
	// Network Operations
	// =========================================================================
	describe('network.networkByIpAddress', () => {
		it('calls network-by-ip and persists network entity', async () => {
			harness.queue({
				body: {
					ip: '8.8.8.8',
					registry: 'ARIN',
					registryStatus: 'assigned',
					registeredCountry: 'US',
					organisation: 'Google LLC',
					isReachableGlobally: true,
					isBogon: false,
					bgpPrefix: '8.8.8.0/24',
					totalAddresses: 256,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Network.networkByIpAddress(ctx, { ip: '8.8.8.8' });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/network-by-ip');
			expect(req.url).toContain('ip=8.8.8.8');
			expect(result.organisation).toBe('Google LLC');
			expect(upserts.networks?.[0]?.entityId).toBe('8.8.8.8');
		});
	});

	describe('network.networksByCidr', () => {
		it('calls network-by-cidr and returns subnet announcement data', async () => {
			harness.queue({
				body: {
					cidr: '8.8.8.0/24',
					network: {
						cidr: '8.8.8.0/24',
						type: 'allocated',
					},
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Network.networksByCidr(ctx, {
				cidr: '8.8.8.0/24',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/network-by-cidr');
			expect(req.url).toContain('cidr=8.8.8.0%2F24');
			expect(result.cidr).toBe('8.8.8.0/24');
			expect(upserts.networks?.[0]?.entityId).toBe('8.8.8.0/24');
		});
	});

	// =========================================================================
	// Location Operations
	// =========================================================================
	describe('location.countryInfo', () => {
		it('calls country-info and persists country', async () => {
			harness.queue({
				body: {
					isoAlpha2: 'US',
					isoAlpha3: 'USA',
					m49Code: 840,
					name: 'United States of America',
					callingCode: '1',
					countryFlagEmoji: '🇺🇸',
					isIndependent: true,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Location.countryInfo(ctx, { code: 'US' });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/country-info');
			expect(req.url).toContain('code=US');
			expect(result.isoAlpha2).toBe('US');
			expect(upserts.countries?.[0]?.entityId).toBe('US');
		});
	});

	describe('location.countryByIpAddress', () => {
		it('calls country-by-ip and persists country from IP', async () => {
			harness.queue({
				body: {
					ip: '8.8.8.8',
					isReachableGlobally: true,
					country: {
						isoAlpha2: 'US',
						isoAlpha3: 'USA',
						name: 'United States',
					},
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Location.countryByIpAddress(ctx, { ip: '8.8.8.8' });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/country-by-ip');
			expect(req.url).toContain('ip=8.8.8.8');
			expect(result.country?.isoAlpha2).toBe('US');
			expect(upserts.countries?.[0]?.entityId).toBe('US');
		});
	});

	describe('location.reverseGeocodingWithTimezone', () => {
		it('calls reverse-geocode-with-timezone and persists geocode and timezone', async () => {
			harness.queue({
				body: {
					latitude: -33.8688,
					longitude: 151.2093,
					countryName: 'Australia',
					countryCode: 'AU',
					city: 'Sydney',
					timeZone: {
						ianaTimeId: 'Australia/Sydney',
						displayName: 'AEST',
					},
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Location.reverseGeocodingWithTimezone(ctx, {
				latitude: -33.8688,
				longitude: 151.2093,
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/reverse-geocode-with-timezone');
			expect(result.city).toBe('Sydney');
			expect(upserts.reverseGeocodes).toHaveLength(1);
			expect(upserts.timezones?.[0]?.entityId).toBe('Australia/Sydney');
		});
	});

	describe('location.timeZoneByIpAddress', () => {
		it('calls timezone-by-ip and persists timezone', async () => {
			harness.queue({
				body: {
					ianaTimeId: 'America/New_York',
					displayName: '(UTC-05:00) Eastern Time',
					utcOffset: '-05',
					utcOffsetSeconds: -18000,
					isDaylightSavingTime: false,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Location.timeZoneByIpAddress(ctx, {
				ip: '8.8.8.8',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/timezone-by-ip');
			expect(req.url).toContain('ip=8.8.8.8');
			expect(result.ianaTimeId).toBe('America/New_York');
			expect(upserts.timezones?.[0]?.entityId).toBe('America/New_York');
		});
	});

	describe('location.amIRoaming', () => {
		it('calls am-i-roaming and persists roaming status', async () => {
			harness.queue({
				body: {
					isRoaming: true,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Location.amIRoaming(ctx, {
				latitude: -33.8688,
				longitude: 151.2093,
				ip: '8.8.8.8',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/am-i-roaming');
			expect(result.isRoaming).toBe(true);
			expect(upserts.roamingStatuses).toHaveLength(1);
		});
	});

	// =========================================================================
	// Security Operations
	// =========================================================================
	describe('security.hazardReport', () => {
		it('calls hazard-report and persists threat report', async () => {
			harness.queue({
				body: {
					isKnownAsTorServer: false,
					isKnownAsVpn: false,
					isKnownAsProxy: false,
					isSpamhausDrop: false,
					hostingLikelihood: 0,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Security.hazardReport(ctx, { ip: '8.8.8.8' });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/hazard-report');
			expect(req.url).toContain('ip=8.8.8.8');
			expect(result.isKnownAsTorServer).toBe(false);
			expect(upserts.hazardReports).toHaveLength(1);
		});
	});

	describe('security.torExitNodesGeolocated', () => {
		it('calls tor-exit-nodes-list and persists nodes', async () => {
			harness.queue({
				body: {
					total: 1800,
					offset: 0,
					batch: 1,
					nodes: [
						{
							ip: '101.99.88.74',
							countryName: 'Malaysia',
							countryCode: 'MY',
							carriers: [{ asn: 'AS45839', organisation: 'Shinjiru' }],
						},
					],
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Security.torExitNodesGeolocated(ctx, {
				batchSize: 1,
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/tor-exit-nodes-list');
			expect(result.nodes).toHaveLength(1);
			expect(upserts.torExitNodes).toHaveLength(1);
		});
	});

	describe('security.userRisk', () => {
		it('calls user-risk and persists risk score', async () => {
			harness.queue({
				body: {
					risk: 'Low',
					description: 'low risk',
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Security.userRisk(ctx, { ip: '8.8.8.8' });

			const req = harness.requestAt(0);
			expect(req.url).toContain('/user-risk');
			expect(result.risk).toBe('Low');
			expect(upserts.userRisks).toHaveLength(1);
		});
	});

	// =========================================================================
	// Validation Operations
	// =========================================================================
	describe('validation.emailAddressVerification', () => {
		it('calls email-verify and persists email validation result', async () => {
			harness.queue({
				body: {
					inputData: 'test@example.com',
					isValid: false,
					isSyntaxValid: true,
					isMailServerDefined: false,
					isKnownSpammerDomain: false,
					isDisposable: false,
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Validation.emailAddressVerification(ctx, {
				emailAddress: 'test@example.com',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/email-verify');
			expect(req.url).toContain('emailAddress=test%40example.com');
			expect(result.isSyntaxValid).toBe(true);
			expect(upserts.emailValidations).toHaveLength(1);
		});
	});

	describe('validation.phoneNumberValidationByIp', () => {
		it('calls phone-number-validate-by-ip and persists phone result', async () => {
			harness.queue({
				body: {
					isValid: true,
					e164Format: '+14155552671',
					internationalFormat: '+1 415-555-2671',
					nationalFormat: '(415) 555-2671',
					location: 'San Francisco, CA',
					lineType: 'FIXED_LINE_OR_MOBILE',
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Validation.phoneNumberValidationByIp(ctx, {
				phoneNumber: '+14155552671',
				ip: '8.8.8.8',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/phone-number-validate-by-ip');
			expect(result.isValid).toBe(true);
			expect(upserts.phoneValidations).toHaveLength(1);
		});

		it('falls back from empty number to phoneNumber', async () => {
			harness.queue({
				body: {
					isValid: true,
					e164Format: '+14155552671',
				},
			});
			const { ctx } = createContext();

			const result = await Validation.phoneNumberValidationByIp(ctx, {
				number: '',
				phoneNumber: '+14155552671',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('number=%2B14155552671');
			expect(result.isValid).toBe(true);
		});
	});

	describe('validation.userAgentParser', () => {
		it('calls user-agent-info and persists parsed device info', async () => {
			harness.queue({
				body: {
					device: 'Mobile',
					os: 'Android',
					userAgent: 'Chrome',
					family: 'Chrome Mobile',
					isSpider: false,
					isMobile: true,
					userAgentDisplay: 'Android Chrome Mobile',
				},
			});
			const { ctx, upserts } = createContext();

			const result = await Validation.userAgentParser(ctx, {
				userAgentRaw: 'Mozilla/5.0 (Linux; Android 10)',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('/user-agent-info');
			expect(result.device).toBe('Mobile');
			expect(upserts.userAgents).toHaveLength(1);
		});

		it('falls back from empty userAgentRaw to userAgent', async () => {
			harness.queue({
				body: {
					device: 'Desktop',
					os: 'Windows 10',
					userAgent: 'Firefox',
				},
			});
			const { ctx } = createContext();

			const result = await Validation.userAgentParser(ctx, {
				userAgentRaw: '',
				userAgent: 'Mozilla/5.0 Firefox',
			});

			const req = harness.requestAt(0);
			expect(req.url).toContain('userAgentRaw=Mozilla%2F5.0%20Firefox');
			expect(result.device).toBe('Desktop');
		});
	});

	// =========================================================================
	// Error Handling & DB Resilience Tests
	// =========================================================================
	describe('DB resilience', () => {
		it('does not throw when DB upsert fails', async () => {
			harness.queue({
				body: {
					isoAlpha2: 'US',
					name: 'United States',
				},
			});
			const { ctx } = createContext({ failingEntities: ['countries'] });

			const result = await Location.countryInfo(ctx, { code: 'US' });
			expect(result.isoAlpha2).toBe('US');
		});
	});
});
