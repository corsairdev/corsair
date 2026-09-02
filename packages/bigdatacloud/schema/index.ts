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
	BigDataCloudTimeZone,
	BigDataCloudTorExitNode,
	BigDataCloudUserAgent,
	BigDataCloudUserRisk,
} from './database';

export const BigDataCloudSchema = {
	version: '1.0.0',
	entities: {
		countries: BigDataCloudCountry,
		asns: BigDataCloudAsn,
		networks: BigDataCloudNetwork,
		bgpPrefixes: BigDataCloudPrefix,
		hazardReports: BigDataCloudHazardReport,
		userRisks: BigDataCloudUserRisk,
		torExitNodes: BigDataCloudTorExitNode,
		timezones: BigDataCloudTimeZone,
		reverseGeocodes: BigDataCloudReverseGeocode,
		phoneValidations: BigDataCloudPhoneValidation,
		emailValidations: BigDataCloudEmailValidation,
		userAgents: BigDataCloudUserAgent,
		roamingStatuses: BigDataCloudRoaming,
	},
} as const;

export * from './database';
