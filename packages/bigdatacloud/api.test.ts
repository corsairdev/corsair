import { makeBigDataCloudRequest } from './client';
import { BigDataCloudEndpointOutputSchemas as Schemas } from './endpoints/types';

const API_KEY = process.env.BIGDATACLOUD_API_KEY;

const describeLive = API_KEY ? describe : describe.skip;

describeLive('BigDataCloud live API integration tests', () => {
	const key = API_KEY as string;

	it('1. ASN Extended Receiving From Info API', async () => {
		const result = await makeBigDataCloudRequest(
			'asn-info-receiving-from',
			key,
			{
				method: 'GET',
				query: { asn: '13335', batchSize: 5 },
				schema: Schemas.asnExtendedReceivingFromInfo,
			},
		);

		expect(result.asnNumeric).toBe(13335);
		expect(Array.isArray(result.receivingFrom)).toBe(true);
	});

	it('2. ASN Extended Transit To Info API', async () => {
		const result = await makeBigDataCloudRequest('asn-info-transit-to', key, {
			method: 'GET',
			query: { asn: '13335', batchSize: 5 },
			schema: Schemas.asnExtendedTransitToInfo,
		});

		expect(result.asnNumeric).toBe(13335);
		expect(Array.isArray(result.transitTo)).toBe(true);
	});

	it('3. ASN Rank List API', async () => {
		const result = await makeBigDataCloudRequest('asn-rank-list', key, {
			method: 'GET',
			query: { batchSize: 5 },
			schema: Schemas.asnRankList,
		});

		expect(result.total).toBeGreaterThan(0);
		expect(result.asns.length).toBeGreaterThan(0);
	});

	it('4. BGP Active Prefixes API', async () => {
		const result = await makeBigDataCloudRequest('prefixes-list', key, {
			method: 'GET',
			query: { asn: '13335', isv4: 'true', batchSize: 5 },
			schema: Schemas.bgpActivePrefixes,
		});

		expect(result.total).toBeGreaterThan(0);
		expect(result.prefixes.length).toBeGreaterThan(0);
	});

	it('5. Network by IP Address API', async () => {
		const result = await makeBigDataCloudRequest('network-by-ip', key, {
			method: 'GET',
			query: { ip: '8.8.8.8' },
			schema: Schemas.networkByIpAddress,
		});

		expect(result.ip).toBe('8.8.8.8');
		expect(result.isReachableGlobally).toBe(true);
	});

	it('6. Networks by CIDR', async () => {
		const result = await makeBigDataCloudRequest('network-by-cidr', key, {
			method: 'GET',
			query: { cidr: '8.8.8.0/24' },
			schema: Schemas.networksByCidr,
		});

		expect(result.cidr).toBe('8.8.8.0/24');
	});

	it('7. Country Info API', async () => {
		const result = await makeBigDataCloudRequest('country-info', key, {
			method: 'GET',
			query: { code: 'US' },
			schema: Schemas.countryInfo,
		});

		expect(result.isoAlpha2).toBe('US');
		expect(result.callingCode).toBe('1');
	});

	it('8. Country by IP Address API', async () => {
		const result = await makeBigDataCloudRequest('country-by-ip', key, {
			method: 'GET',
			query: { ip: '8.8.8.8' },
			schema: Schemas.countryByIpAddress,
		});

		expect(result.ip).toBe('8.8.8.8');
		expect(result.country).toBeDefined();
	});

	it('9. Reverse Geocoding With Timezone API', async () => {
		const result = await makeBigDataCloudRequest(
			'reverse-geocode-with-timezone',
			key,
			{
				method: 'GET',
				query: { latitude: -33.8688, longitude: 151.2093 },
				schema: Schemas.reverseGeocodingWithTimezone,
			},
		);

		expect(result.city).toBe('Sydney');
		expect(result.countryCode).toBe('AU');
		expect(result.timeZone?.ianaTimeId).toBe('Australia/Sydney');
	});

	it('10. Time Zone by IP Address API', async () => {
		const result = await makeBigDataCloudRequest('timezone-by-ip', key, {
			method: 'GET',
			query: { ip: '8.8.8.8' },
			schema: Schemas.timeZoneByIpAddress,
		});

		expect(result.ianaTimeId).toBeDefined();
		expect(result.utcOffsetSeconds).toBeDefined();
	});

	it('11. Am I Roaming API', async () => {
		const result = await makeBigDataCloudRequest('am-i-roaming', key, {
			method: 'GET',
			query: { latitude: -33.8688, longitude: 151.2093, ip: '8.8.8.8' },
			schema: Schemas.amIRoaming,
		});

		expect(typeof result.isRoaming).toBe('boolean');
	});

	it('12. Hazard Report API', async () => {
		const result = await makeBigDataCloudRequest('hazard-report', key, {
			method: 'GET',
			query: { ip: '8.8.8.8' },
			schema: Schemas.hazardReport,
		});

		expect(typeof result.isKnownAsTorServer).toBe('boolean');
		expect(typeof result.isKnownAsVpn).toBe('boolean');
	});

	it('13. Tor Exit Nodes Geolocated API', async () => {
		const result = await makeBigDataCloudRequest('tor-exit-nodes-list', key, {
			method: 'GET',
			query: { batchSize: 5 },
			schema: Schemas.torExitNodesGeolocated,
		});

		expect(result.total).toBeGreaterThan(0);
		expect(result.nodes.length).toBeGreaterThan(0);
	});

	it('14. User Risk API', async () => {
		const result = await makeBigDataCloudRequest('user-risk', key, {
			method: 'GET',
			query: { ip: '8.8.8.8' },
			schema: Schemas.userRisk,
		});

		expect(typeof result.risk).toBe('string');
	});

	it('15. Email Address Verification API', async () => {
		const result = await makeBigDataCloudRequest('email-verify', key, {
			method: 'GET',
			query: { emailAddress: 'test@example.com' },
			schema: Schemas.emailAddressVerification,
		});

		expect(result.inputData).toBe('test@example.com');
		expect(typeof result.isValid).toBe('boolean');
	});

	it('16. Phone Number Validation by IP', async () => {
		const result = await makeBigDataCloudRequest(
			'phone-number-validate-by-ip',
			key,
			{
				method: 'GET',
				query: { number: '+14155552671', ip: '8.8.8.8' },
				schema: Schemas.phoneNumberValidationByIp,
			},
		);

		expect(result.isValid).toBe(true);
		expect(result.e164Format).toBe('+14155552671');
	});

	it('17. User Agent Parser API', async () => {
		const result = await makeBigDataCloudRequest('user-agent-info', key, {
			method: 'GET',
			query: {
				userAgentRaw:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
			schema: Schemas.userAgentParser,
		});

		expect(result.os).toBeDefined();
		expect(typeof result.isSpider).toBe('boolean');
	});
});
