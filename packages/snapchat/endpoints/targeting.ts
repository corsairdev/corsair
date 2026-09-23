import { createEndpoint } from './factory';

// All targeting endpoints share the pattern: GET /targeting/{category}?country_code={code}

export const getTargetingCarriersEndpoint = createEndpoint(
	'getTargetingCarriers',
	{
		path: () => '/targeting/carriers',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingConnectionTypesEndpoint = createEndpoint(
	'getTargetingConnectionTypes',
	{
		path: () => '/targeting/connection_types',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingDemographicsAdvancedDemographicsEndpoint =
	createEndpoint('getTargetingDemographicsAdvancedDemographics', {
		path: () => '/targeting/demographics/advanced_demographics',
		query: (input) => ({ country_code: input.country_code as string }),
	});

export const getTargetingDemographicsAgeGroupEndpoint = createEndpoint(
	'getTargetingDemographicsAgeGroup',
	{
		path: () => '/targeting/demographics/age_group',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingDemographicsGenderEndpoint = createEndpoint(
	'getTargetingDemographicsGender',
	{
		path: () => '/targeting/demographics/gender',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingDemographicsLanguagesEndpoint = createEndpoint(
	'getTargetingDemographicsLanguages',
	{
		path: () => '/targeting/demographics/languages',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingDeviceIosOsVersionEndpoint = createEndpoint(
	'getTargetingDeviceIosOsVersion',
	{
		path: () => '/targeting/device/ios_os_version',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingDeviceMarketingNamesEndpoint = createEndpoint(
	'getTargetingDeviceMarketingNames',
	{
		path: () => '/targeting/device/marketing_names',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingGeoPostalCodeEndpoint = createEndpoint(
	'getTargetingGeoPostalCode',
	{
		path: () => '/targeting/geo/postal_code',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingGeoRegionEndpoint = createEndpoint(
	'getTargetingGeoRegion',
	{
		path: () => '/targeting/geo/region',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingGeoUsPostalCodeEndpoint = createEndpoint(
	'getTargetingGeoUsPostalCode',
	{
		path: () => '/targeting/geo/us_postal_code',
	},
);

export const getTargetingGeoUsRegionEndpoint = createEndpoint(
	'getTargetingGeoUsRegion',
	{
		path: () => '/targeting/geo/us_region',
	},
);

export const getTargetingInterestsDlxcEndpoint = createEndpoint(
	'getTargetingInterestsDlxc',
	{
		path: () => '/targeting/interests/dlxc',
	},
);

export const getTargetingInterestsDlxpEndpoint = createEndpoint(
	'getTargetingInterestsDlxp',
	{
		path: () => '/targeting/interests/dlxp',
	},
);

export const getTargetingInterestsDlxsEndpoint = createEndpoint(
	'getTargetingInterestsDlxs',
	{
		path: () => '/targeting/interests/dlxs',
	},
);

export const getTargetingInterestsNlnEndpoint = createEndpoint(
	'getTargetingInterestsNln',
	{
		path: () => '/targeting/interests/nln',
	},
);

export const getTargetingInterestsPlcEndpoint = createEndpoint(
	'getTargetingInterestsPlc',
	{
		path: () => '/targeting/interests/plc',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingLocationCategoriesLoiEndpoint = createEndpoint(
	'getTargetingLocationCategoriesLoi',
	{
		path: () => '/targeting/location_categories/loi',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingMetrosEndpoint = createEndpoint('getTargetingMetros', {
	path: () => '/targeting/metros',
	query: (input) => ({ country_code: input.country_code as string }),
});

export const getTargetingOsTypesEndpoint = createEndpoint(
	'getTargetingOsTypes',
	{
		path: () => '/targeting/device/os_type',
	},
);

export const getTargetingOsVersionsEndpoint = createEndpoint(
	'getTargetingOsVersions',
	{
		path: () => '/targeting/device/os_version',
	},
);

export const getTargetingV1InterestsScLsEndpoint = createEndpoint(
	'getTargetingV1InterestsScLs',
	{
		path: () => '/targeting/interests/scls',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingV1InterestsShpEndpoint = createEndpoint(
	'getTargetingV1InterestsShp',
	{
		path: () => '/targeting/interests/shp',
		query: (input) => ({ country_code: input.country_code as string }),
	},
);

export const getTargetingV1InterestsVacEndpoint = createEndpoint(
	'getTargetingV1InterestsVac',
	{
		path: () => '/targeting/interests/vac',
	},
);

export const getTargetingV1OptionsEndpoint = createEndpoint(
	'getTargetingV1Options',
	{
		path: () => '/targeting',
		query: (input) => ({
			country_code: input.country_code as string | undefined,
		}),
	},
);
