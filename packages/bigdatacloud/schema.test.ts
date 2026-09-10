import {
	BigDataCloudAsn,
	BigDataCloudCountry,
	BigDataCloudEmailValidation,
	BigDataCloudHazardReport,
	BigDataCloudNetwork,
	BigDataCloudPhoneValidation,
	BigDataCloudPrefix,
	BigDataCloudReverseGeocode,
	BigDataCloudRoaming,
	BigDataCloudSchema,
	BigDataCloudTimeZone,
	BigDataCloudTorExitNode,
	BigDataCloudUserAgent,
	BigDataCloudUserRisk,
} from './schema';

describe('BigDataCloudSchema', () => {
	it('should export the schema with version 1.0.0 and all entities', () => {
		expect(BigDataCloudSchema.version).toBe('1.0.0');
		expect(BigDataCloudSchema.entities).toHaveProperty('countries');
		expect(BigDataCloudSchema.entities).toHaveProperty('asns');
		expect(BigDataCloudSchema.entities).toHaveProperty('networks');
		expect(BigDataCloudSchema.entities).toHaveProperty('bgpPrefixes');
		expect(BigDataCloudSchema.entities).toHaveProperty('hazardReports');
		expect(BigDataCloudSchema.entities).toHaveProperty('userRisks');
		expect(BigDataCloudSchema.entities).toHaveProperty('torExitNodes');
		expect(BigDataCloudSchema.entities).toHaveProperty('timezones');
		expect(BigDataCloudSchema.entities).toHaveProperty('reverseGeocodes');
		expect(BigDataCloudSchema.entities).toHaveProperty('phoneValidations');
		expect(BigDataCloudSchema.entities).toHaveProperty('emailValidations');
		expect(BigDataCloudSchema.entities).toHaveProperty('userAgents');
		expect(BigDataCloudSchema.entities).toHaveProperty('roamingStatuses');
	});

	it('should validate BigDataCloudCountry', () => {
		const parsed = BigDataCloudCountry.parse({
			id: 'US',
			isoAlpha2: 'US',
			isoAlpha3: 'USA',
			m49Code: 840,
			name: 'United States of America',
			callingCode: '1',
			countryFlagEmoji: '🇺🇸',
			isIndependent: true,
		});
		expect(parsed.isoAlpha2).toBe('US');
	});

	it('should validate BigDataCloudAsn', () => {
		const parsed = BigDataCloudAsn.parse({
			id: 'AS13335',
			asn: 'AS13335',
			asnNumeric: 13335,
			name: 'CLOUDFLARENET',
			organisation: 'Cloudflare, Inc.',
			registeredCountry: 'US',
		});
		expect(parsed.asnNumeric).toBe(13335);
	});

	it('should validate BigDataCloudNetwork', () => {
		const parsed = BigDataCloudNetwork.parse({
			id: '8.8.8.8',
			ip: '8.8.8.8',
			bgpPrefix: '8.8.8.0/24',
			organisation: 'Google LLC',
			isReachableGlobally: true,
		});
		expect(parsed.ip).toBe('8.8.8.8');
	});

	it('should validate BigDataCloudPrefix', () => {
		const parsed = BigDataCloudPrefix.parse({
			id: '1.0.0.0/24',
			bgpPrefix: '1.0.0.0/24',
			isAnnounced: true,
			asn: 'AS13335',
		});
		expect(parsed.bgpPrefix).toBe('1.0.0.0/24');
	});

	it('should validate BigDataCloudHazardReport', () => {
		const parsed = BigDataCloudHazardReport.parse({
			id: '8.8.8.8',
			ip: '8.8.8.8',
			isKnownAsTorServer: false,
			isKnownAsVpn: false,
			isKnownAsProxy: false,
			hostingLikelihood: 0,
		});
		expect(parsed.isKnownAsTorServer).toBe(false);
	});

	it('should validate BigDataCloudUserRisk', () => {
		const parsed = BigDataCloudUserRisk.parse({
			id: '8.8.8.8',
			ip: '8.8.8.8',
			risk: 'Low',
			description: 'low risk',
		});
		expect(parsed.risk).toBe('Low');
	});

	it('should validate BigDataCloudTorExitNode', () => {
		const parsed = BigDataCloudTorExitNode.parse({
			id: '101.99.88.74',
			ip: '101.99.88.74',
			countryName: 'Malaysia',
			countryCode: 'MY',
			asn: 'AS45839',
		});
		expect(parsed.ip).toBe('101.99.88.74');
	});

	it('should validate BigDataCloudTimeZone', () => {
		const parsed = BigDataCloudTimeZone.parse({
			id: 'Australia/Sydney',
			ianaTimeId: 'Australia/Sydney',
			displayName: '(UTC+10:00) Eastern Australia Time',
			utcOffset: '+10',
			utcOffsetSeconds: 36000,
			isDaylightSavingTime: false,
		});
		expect(parsed.ianaTimeId).toBe('Australia/Sydney');
	});

	it('should validate BigDataCloudReverseGeocode', () => {
		const parsed = BigDataCloudReverseGeocode.parse({
			id: '-33.8688,151.2093',
			latitude: -33.8688,
			longitude: 151.2093,
			countryName: 'Australia',
			countryCode: 'AU',
			city: 'Sydney',
		});
		expect(parsed.city).toBe('Sydney');
	});

	it('should validate BigDataCloudEmailValidation', () => {
		const parsed = BigDataCloudEmailValidation.parse({
			id: 'test@example.com',
			emailAddress: 'test@example.com',
			isValid: false,
			isSyntaxValid: true,
			isMailServerDefined: false,
		});
		expect(parsed.isValid).toBe(false);
	});

	it('should validate BigDataCloudPhoneValidation', () => {
		const parsed = BigDataCloudPhoneValidation.parse({
			id: '+14155552671',
			number: '+14155552671',
			isValid: true,
			e164Format: '+14155552671',
			lineType: 'FIXED_LINE_OR_MOBILE',
		});
		expect(parsed.isValid).toBe(true);
	});

	it('should validate BigDataCloudUserAgent', () => {
		const parsed = BigDataCloudUserAgent.parse({
			id: 'Mozilla/5.0',
			userAgentRaw: 'Mozilla/5.0',
			device: 'Desktop',
			os: 'Windows 10',
			isSpider: false,
		});
		expect(parsed.device).toBe('Desktop');
	});

	it('should validate BigDataCloudRoaming', () => {
		const parsed = BigDataCloudRoaming.parse({
			id: '8.8.8.8:-33.86,151.2',
			ip: '8.8.8.8',
			latitude: -33.86,
			longitude: 151.2,
			isRoaming: true,
		});
		expect(parsed.isRoaming).toBe(true);
	});
});
