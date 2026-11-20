import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Intelligence,
	Matching,
	Standardization,
	Utilities,
	Validation,
} from './endpoints';
import type {
	InterzoidEndpointInputs,
	InterzoidEndpointOutputs,
} from './endpoints/types';
import {
	InterzoidEndpointInputSchemas,
	InterzoidEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { InterzoidSchema } from './schema';

export type InterzoidPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalInterzoidPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof interzoidEndpointsNested>;
};

export type InterzoidContext = CorsairPluginContext<
	typeof InterzoidSchema,
	InterzoidPluginOptions
>;

export type InterzoidKeyBuilderContext =
	KeyBuilderContext<InterzoidPluginOptions>;

export type InterzoidBoundEndpoints = BindEndpoints<
	typeof interzoidEndpointsNested
>;

type InterzoidEndpoint<K extends keyof InterzoidEndpointOutputs> =
	CorsairEndpoint<
		InterzoidContext,
		InterzoidEndpointInputs[K],
		InterzoidEndpointOutputs[K]
	>;

export type InterzoidEndpoints = {
	getCompanyMatchAdvanced: InterzoidEndpoint<'getCompanyMatchAdvanced'>;
	getFullNameMatch: InterzoidEndpoint<'getFullNameMatch'>;
	getAddressMatchAdvanced: InterzoidEndpoint<'getAddressMatchAdvanced'>;
	getAddressAndFullNameMatch: InterzoidEndpoint<'getAddressAndFullNameMatch'>;
	getCompanyAndAddressMatch: InterzoidEndpoint<'getCompanyAndAddressMatch'>;
	getCompanyAndFullNameMatch: InterzoidEndpoint<'getCompanyAndFullNameMatch'>;
	getGlobalAddressMatch: InterzoidEndpoint<'getGlobalAddressMatch'>;
	getProductMatch: InterzoidEndpoint<'getProductMatch'>;
	getOrgMatchScore: InterzoidEndpoint<'getOrgMatchScore'>;
	getFullNameMatchScore: InterzoidEndpoint<'getFullNameMatchScore'>;
	getCompanyMatch: InterzoidEndpoint<'getCompanyMatch'>;
	getAddressMatch: InterzoidEndpoint<'getAddressMatch'>;
	getFullNameParsedMatch: InterzoidEndpoint<'getFullNameParsedMatch'>;
	getCityMatch: InterzoidEndpoint<'getCityMatch'>;
	getCountryMatch: InterzoidEndpoint<'getCountryMatch'>;
	getOrgStandard: InterzoidEndpoint<'getOrgStandard'>;
	getCountryStandard: InterzoidEndpoint<'getCountryStandard'>;
	getCountryInfo: InterzoidEndpoint<'getCountryInfo'>;
	getStateAbbreviation: InterzoidEndpoint<'getStateAbbreviation'>;
	getCityStandard: InterzoidEndpoint<'getCityStandard'>;
	getOfficialName: InterzoidEndpoint<'getOfficialName'>;
	getBusinessInfo: InterzoidEndpoint<'getBusinessInfo'>;
	getParentCompanyInfo: InterzoidEndpoint<'getParentCompanyInfo'>;
	getExecutiveProfile: InterzoidEndpoint<'getExecutiveProfile'>;
	getBusinessInfoDomain: InterzoidEndpoint<'getBusinessInfoDomain'>;
	getBusinessInfoName: InterzoidEndpoint<'getBusinessInfoName'>;
	getCompanyVerification: InterzoidEndpoint<'getCompanyVerification'>;
	getStockInfo: InterzoidEndpoint<'getStockInfo'>;
	getIndustryCodes: InterzoidEndpoint<'getIndustryCodes'>;
	getSicCodes: InterzoidEndpoint<'getSicCodes'>;
	getUniversityInfo: InterzoidEndpoint<'getUniversityInfo'>;
	getProductRecallInfo: InterzoidEndpoint<'getProductRecallInfo'>;
	getTechStack: InterzoidEndpoint<'getTechStack'>;
	getCompetitorAnalysis: InterzoidEndpoint<'getCompetitorAnalysis'>;
	getBuyingSignals: InterzoidEndpoint<'getBuyingSignals'>;
	getPrivateCompanyDealIntel: InterzoidEndpoint<'getPrivateCompanyDealIntel'>;
	getNearestCoffeeShops: InterzoidEndpoint<'getNearestCoffeeShops'>;
	getUserXHandle: InterzoidEndpoint<'getUserXHandle'>;
	getXUserProfile: InterzoidEndpoint<'getXUserProfile'>;
	getXLast3: InterzoidEndpoint<'getXLast3'>;
	getEsgProfile: InterzoidEndpoint<'getEsgProfile'>;
	getGovContracts: InterzoidEndpoint<'getGovContracts'>;
	getFacilitiesProfile: InterzoidEndpoint<'getFacilitiesProfile'>;
	getBuildingProfile: InterzoidEndpoint<'getBuildingProfile'>;
	getPropertyHistory: InterzoidEndpoint<'getPropertyHistory'>;
	getSalesUseTaxRates: InterzoidEndpoint<'getSalesUseTaxRates'>;
	getIrsPerDiemRates: InterzoidEndpoint<'getIrsPerDiemRates'>;
	getEuVatRates: InterzoidEndpoint<'getEuVatRates'>;
	getCustomsDutyRates: InterzoidEndpoint<'getCustomsDutyRates'>;
	getMuniIssuerProfile: InterzoidEndpoint<'getMuniIssuerProfile'>;
	getCustomData: InterzoidEndpoint<'getCustomData'>;
	getEmailInfo: InterzoidEndpoint<'getEmailInfo'>;
	getEmailTrustScore: InterzoidEndpoint<'getEmailTrustScore'>;
	getEmailDomainType: InterzoidEndpoint<'getEmailDomainType'>;
	getIpProfile: InterzoidEndpoint<'getIpProfile'>;
	getPhoneProfile: InterzoidEndpoint<'getPhoneProfile'>;
	getGlobalNumberInfo: InterzoidEndpoint<'getGlobalNumberInfo'>;
	getAreaCodeFromNumber: InterzoidEndpoint<'getAreaCodeFromNumber'>;
	getAreaCode: InterzoidEndpoint<'getAreaCode'>;
	getZipCodeInfo: InterzoidEndpoint<'getZipCodeInfo'>;
	addressParse: InterzoidEndpoint<'addressParse'>;
	getEntityType: InterzoidEndpoint<'getEntityType'>;
	getGender: InterzoidEndpoint<'getGender'>;
	getNameOrigin: InterzoidEndpoint<'getNameOrigin'>;
	identifyLanguage: InterzoidEndpoint<'identifyLanguage'>;
	translateToEnglish: InterzoidEndpoint<'translateToEnglish'>;
	translateToAny: InterzoidEndpoint<'translateToAny'>;
	getGlobalLatency: InterzoidEndpoint<'getGlobalLatency'>;
	getGlobalPageLoad: InterzoidEndpoint<'getGlobalPageLoad'>;
	getCurrencyRate: InterzoidEndpoint<'getCurrencyRate'>;
	convertCurrency: InterzoidEndpoint<'convertCurrency'>;
	getWeatherZipCode: InterzoidEndpoint<'getWeatherZipCode'>;
	getGlobalWeather: InterzoidEndpoint<'getGlobalWeather'>;
	getGlobalTime: InterzoidEndpoint<'getGlobalTime'>;
	getRemainingCredits: InterzoidEndpoint<'getRemainingCredits'>;
};

const interzoidEndpointsNested = {
	matching: {
		getCompanyMatchAdvanced: Matching.getCompanyMatchAdvanced,
		getFullNameMatch: Matching.getFullNameMatch,
		getAddressMatchAdvanced: Matching.getAddressMatchAdvanced,
		getAddressAndFullNameMatch: Matching.getAddressAndFullNameMatch,
		getCompanyAndAddressMatch: Matching.getCompanyAndAddressMatch,
		getCompanyAndFullNameMatch: Matching.getCompanyAndFullNameMatch,
		getGlobalAddressMatch: Matching.getGlobalAddressMatch,
		getProductMatch: Matching.getProductMatch,
		getOrgMatchScore: Matching.getOrgMatchScore,
		getFullNameMatchScore: Matching.getFullNameMatchScore,
		getCompanyMatch: Matching.getCompanyMatch,
		getAddressMatch: Matching.getAddressMatch,
		getFullNameParsedMatch: Matching.getFullNameParsedMatch,
		getCityMatch: Matching.getCityMatch,
		getCountryMatch: Matching.getCountryMatch,
	},
	standardization: {
		getOrgStandard: Standardization.getOrgStandard,
		getCountryStandard: Standardization.getCountryStandard,
		getCountryInfo: Standardization.getCountryInfo,
		getStateAbbreviation: Standardization.getStateAbbreviation,
		getCityStandard: Standardization.getCityStandard,
		getOfficialName: Standardization.getOfficialName,
	},
	intelligence: {
		getBusinessInfo: Intelligence.getBusinessInfo,
		getParentCompanyInfo: Intelligence.getParentCompanyInfo,
		getExecutiveProfile: Intelligence.getExecutiveProfile,
		getBusinessInfoDomain: Intelligence.getBusinessInfoDomain,
		getBusinessInfoName: Intelligence.getBusinessInfoName,
		getCompanyVerification: Intelligence.getCompanyVerification,
		getStockInfo: Intelligence.getStockInfo,
		getIndustryCodes: Intelligence.getIndustryCodes,
		getSicCodes: Intelligence.getSicCodes,
		getUniversityInfo: Intelligence.getUniversityInfo,
		getProductRecallInfo: Intelligence.getProductRecallInfo,
		getTechStack: Intelligence.getTechStack,
		getCompetitorAnalysis: Intelligence.getCompetitorAnalysis,
		getBuyingSignals: Intelligence.getBuyingSignals,
		getPrivateCompanyDealIntel: Intelligence.getPrivateCompanyDealIntel,
		getNearestCoffeeShops: Intelligence.getNearestCoffeeShops,
		getUserXHandle: Intelligence.getUserXHandle,
		getXUserProfile: Intelligence.getXUserProfile,
		getXLast3: Intelligence.getXLast3,
		getEsgProfile: Intelligence.getEsgProfile,
		getGovContracts: Intelligence.getGovContracts,
		getFacilitiesProfile: Intelligence.getFacilitiesProfile,
		getBuildingProfile: Intelligence.getBuildingProfile,
		getPropertyHistory: Intelligence.getPropertyHistory,
		getSalesUseTaxRates: Intelligence.getSalesUseTaxRates,
		getIrsPerDiemRates: Intelligence.getIrsPerDiemRates,
		getEuVatRates: Intelligence.getEuVatRates,
		getCustomsDutyRates: Intelligence.getCustomsDutyRates,
		getMuniIssuerProfile: Intelligence.getMuniIssuerProfile,
		getCustomData: Intelligence.getCustomData,
	},
	validation: {
		getEmailInfo: Validation.getEmailInfo,
		getEmailTrustScore: Validation.getEmailTrustScore,
		getEmailDomainType: Validation.getEmailDomainType,
		getIpProfile: Validation.getIpProfile,
		getPhoneProfile: Validation.getPhoneProfile,
		getGlobalNumberInfo: Validation.getGlobalNumberInfo,
		getAreaCodeFromNumber: Validation.getAreaCodeFromNumber,
		getAreaCode: Validation.getAreaCode,
		getZipCodeInfo: Validation.getZipCodeInfo,
		addressParse: Validation.addressParse,
	},
	utilities: {
		getEntityType: Utilities.getEntityType,
		getGender: Utilities.getGender,
		getNameOrigin: Utilities.getNameOrigin,
		identifyLanguage: Utilities.identifyLanguage,
		translateToEnglish: Utilities.translateToEnglish,
		translateToAny: Utilities.translateToAny,
		getGlobalLatency: Utilities.getGlobalLatency,
		getGlobalPageLoad: Utilities.getGlobalPageLoad,
		getCurrencyRate: Utilities.getCurrencyRate,
		convertCurrency: Utilities.convertCurrency,
		getWeatherZipCode: Utilities.getWeatherZipCode,
		getGlobalWeather: Utilities.getGlobalWeather,
		getGlobalTime: Utilities.getGlobalTime,
		getRemainingCredits: Utilities.getRemainingCredits,
	},
} as const;

export const interzoidEndpointSchemas = {
	'matching.getCompanyMatchAdvanced': {
		input: InterzoidEndpointInputSchemas.getCompanyMatchAdvanced,
		output: InterzoidEndpointOutputSchemas.getCompanyMatchAdvanced,
	},
	'matching.getFullNameMatch': {
		input: InterzoidEndpointInputSchemas.getFullNameMatch,
		output: InterzoidEndpointOutputSchemas.getFullNameMatch,
	},
	'matching.getAddressMatchAdvanced': {
		input: InterzoidEndpointInputSchemas.getAddressMatchAdvanced,
		output: InterzoidEndpointOutputSchemas.getAddressMatchAdvanced,
	},
	'matching.getAddressAndFullNameMatch': {
		input: InterzoidEndpointInputSchemas.getAddressAndFullNameMatch,
		output: InterzoidEndpointOutputSchemas.getAddressAndFullNameMatch,
	},
	'matching.getCompanyAndAddressMatch': {
		input: InterzoidEndpointInputSchemas.getCompanyAndAddressMatch,
		output: InterzoidEndpointOutputSchemas.getCompanyAndAddressMatch,
	},
	'matching.getCompanyAndFullNameMatch': {
		input: InterzoidEndpointInputSchemas.getCompanyAndFullNameMatch,
		output: InterzoidEndpointOutputSchemas.getCompanyAndFullNameMatch,
	},
	'matching.getGlobalAddressMatch': {
		input: InterzoidEndpointInputSchemas.getGlobalAddressMatch,
		output: InterzoidEndpointOutputSchemas.getGlobalAddressMatch,
	},
	'matching.getProductMatch': {
		input: InterzoidEndpointInputSchemas.getProductMatch,
		output: InterzoidEndpointOutputSchemas.getProductMatch,
	},
	'matching.getOrgMatchScore': {
		input: InterzoidEndpointInputSchemas.getOrgMatchScore,
		output: InterzoidEndpointOutputSchemas.getOrgMatchScore,
	},
	'matching.getFullNameMatchScore': {
		input: InterzoidEndpointInputSchemas.getFullNameMatchScore,
		output: InterzoidEndpointOutputSchemas.getFullNameMatchScore,
	},
	'matching.getCompanyMatch': {
		input: InterzoidEndpointInputSchemas.getCompanyMatch,
		output: InterzoidEndpointOutputSchemas.getCompanyMatch,
	},
	'matching.getAddressMatch': {
		input: InterzoidEndpointInputSchemas.getAddressMatch,
		output: InterzoidEndpointOutputSchemas.getAddressMatch,
	},
	'matching.getFullNameParsedMatch': {
		input: InterzoidEndpointInputSchemas.getFullNameParsedMatch,
		output: InterzoidEndpointOutputSchemas.getFullNameParsedMatch,
	},
	'matching.getCityMatch': {
		input: InterzoidEndpointInputSchemas.getCityMatch,
		output: InterzoidEndpointOutputSchemas.getCityMatch,
	},
	'matching.getCountryMatch': {
		input: InterzoidEndpointInputSchemas.getCountryMatch,
		output: InterzoidEndpointOutputSchemas.getCountryMatch,
	},
	'standardization.getOrgStandard': {
		input: InterzoidEndpointInputSchemas.getOrgStandard,
		output: InterzoidEndpointOutputSchemas.getOrgStandard,
	},
	'standardization.getCountryStandard': {
		input: InterzoidEndpointInputSchemas.getCountryStandard,
		output: InterzoidEndpointOutputSchemas.getCountryStandard,
	},
	'standardization.getCountryInfo': {
		input: InterzoidEndpointInputSchemas.getCountryInfo,
		output: InterzoidEndpointOutputSchemas.getCountryInfo,
	},
	'standardization.getStateAbbreviation': {
		input: InterzoidEndpointInputSchemas.getStateAbbreviation,
		output: InterzoidEndpointOutputSchemas.getStateAbbreviation,
	},
	'standardization.getCityStandard': {
		input: InterzoidEndpointInputSchemas.getCityStandard,
		output: InterzoidEndpointOutputSchemas.getCityStandard,
	},
	'standardization.getOfficialName': {
		input: InterzoidEndpointInputSchemas.getOfficialName,
		output: InterzoidEndpointOutputSchemas.getOfficialName,
	},
	'intelligence.getBusinessInfo': {
		input: InterzoidEndpointInputSchemas.getBusinessInfo,
		output: InterzoidEndpointOutputSchemas.getBusinessInfo,
	},
	'intelligence.getParentCompanyInfo': {
		input: InterzoidEndpointInputSchemas.getParentCompanyInfo,
		output: InterzoidEndpointOutputSchemas.getParentCompanyInfo,
	},
	'intelligence.getExecutiveProfile': {
		input: InterzoidEndpointInputSchemas.getExecutiveProfile,
		output: InterzoidEndpointOutputSchemas.getExecutiveProfile,
	},
	'intelligence.getBusinessInfoDomain': {
		input: InterzoidEndpointInputSchemas.getBusinessInfoDomain,
		output: InterzoidEndpointOutputSchemas.getBusinessInfoDomain,
	},
	'intelligence.getBusinessInfoName': {
		input: InterzoidEndpointInputSchemas.getBusinessInfoName,
		output: InterzoidEndpointOutputSchemas.getBusinessInfoName,
	},
	'intelligence.getCompanyVerification': {
		input: InterzoidEndpointInputSchemas.getCompanyVerification,
		output: InterzoidEndpointOutputSchemas.getCompanyVerification,
	},
	'intelligence.getStockInfo': {
		input: InterzoidEndpointInputSchemas.getStockInfo,
		output: InterzoidEndpointOutputSchemas.getStockInfo,
	},
	'intelligence.getIndustryCodes': {
		input: InterzoidEndpointInputSchemas.getIndustryCodes,
		output: InterzoidEndpointOutputSchemas.getIndustryCodes,
	},
	'intelligence.getSicCodes': {
		input: InterzoidEndpointInputSchemas.getSicCodes,
		output: InterzoidEndpointOutputSchemas.getSicCodes,
	},
	'intelligence.getUniversityInfo': {
		input: InterzoidEndpointInputSchemas.getUniversityInfo,
		output: InterzoidEndpointOutputSchemas.getUniversityInfo,
	},
	'intelligence.getProductRecallInfo': {
		input: InterzoidEndpointInputSchemas.getProductRecallInfo,
		output: InterzoidEndpointOutputSchemas.getProductRecallInfo,
	},
	'intelligence.getTechStack': {
		input: InterzoidEndpointInputSchemas.getTechStack,
		output: InterzoidEndpointOutputSchemas.getTechStack,
	},
	'intelligence.getCompetitorAnalysis': {
		input: InterzoidEndpointInputSchemas.getCompetitorAnalysis,
		output: InterzoidEndpointOutputSchemas.getCompetitorAnalysis,
	},
	'intelligence.getBuyingSignals': {
		input: InterzoidEndpointInputSchemas.getBuyingSignals,
		output: InterzoidEndpointOutputSchemas.getBuyingSignals,
	},
	'intelligence.getPrivateCompanyDealIntel': {
		input: InterzoidEndpointInputSchemas.getPrivateCompanyDealIntel,
		output: InterzoidEndpointOutputSchemas.getPrivateCompanyDealIntel,
	},
	'intelligence.getNearestCoffeeShops': {
		input: InterzoidEndpointInputSchemas.getNearestCoffeeShops,
		output: InterzoidEndpointOutputSchemas.getNearestCoffeeShops,
	},
	'intelligence.getUserXHandle': {
		input: InterzoidEndpointInputSchemas.getUserXHandle,
		output: InterzoidEndpointOutputSchemas.getUserXHandle,
	},
	'intelligence.getXUserProfile': {
		input: InterzoidEndpointInputSchemas.getXUserProfile,
		output: InterzoidEndpointOutputSchemas.getXUserProfile,
	},
	'intelligence.getXLast3': {
		input: InterzoidEndpointInputSchemas.getXLast3,
		output: InterzoidEndpointOutputSchemas.getXLast3,
	},
	'intelligence.getEsgProfile': {
		input: InterzoidEndpointInputSchemas.getEsgProfile,
		output: InterzoidEndpointOutputSchemas.getEsgProfile,
	},
	'intelligence.getGovContracts': {
		input: InterzoidEndpointInputSchemas.getGovContracts,
		output: InterzoidEndpointOutputSchemas.getGovContracts,
	},
	'intelligence.getFacilitiesProfile': {
		input: InterzoidEndpointInputSchemas.getFacilitiesProfile,
		output: InterzoidEndpointOutputSchemas.getFacilitiesProfile,
	},
	'intelligence.getBuildingProfile': {
		input: InterzoidEndpointInputSchemas.getBuildingProfile,
		output: InterzoidEndpointOutputSchemas.getBuildingProfile,
	},
	'intelligence.getPropertyHistory': {
		input: InterzoidEndpointInputSchemas.getPropertyHistory,
		output: InterzoidEndpointOutputSchemas.getPropertyHistory,
	},
	'intelligence.getSalesUseTaxRates': {
		input: InterzoidEndpointInputSchemas.getSalesUseTaxRates,
		output: InterzoidEndpointOutputSchemas.getSalesUseTaxRates,
	},
	'intelligence.getIrsPerDiemRates': {
		input: InterzoidEndpointInputSchemas.getIrsPerDiemRates,
		output: InterzoidEndpointOutputSchemas.getIrsPerDiemRates,
	},
	'intelligence.getEuVatRates': {
		input: InterzoidEndpointInputSchemas.getEuVatRates,
		output: InterzoidEndpointOutputSchemas.getEuVatRates,
	},
	'intelligence.getCustomsDutyRates': {
		input: InterzoidEndpointInputSchemas.getCustomsDutyRates,
		output: InterzoidEndpointOutputSchemas.getCustomsDutyRates,
	},
	'intelligence.getMuniIssuerProfile': {
		input: InterzoidEndpointInputSchemas.getMuniIssuerProfile,
		output: InterzoidEndpointOutputSchemas.getMuniIssuerProfile,
	},
	'intelligence.getCustomData': {
		input: InterzoidEndpointInputSchemas.getCustomData,
		output: InterzoidEndpointOutputSchemas.getCustomData,
	},
	'validation.getEmailInfo': {
		input: InterzoidEndpointInputSchemas.getEmailInfo,
		output: InterzoidEndpointOutputSchemas.getEmailInfo,
	},
	'validation.getEmailTrustScore': {
		input: InterzoidEndpointInputSchemas.getEmailTrustScore,
		output: InterzoidEndpointOutputSchemas.getEmailTrustScore,
	},
	'validation.getEmailDomainType': {
		input: InterzoidEndpointInputSchemas.getEmailDomainType,
		output: InterzoidEndpointOutputSchemas.getEmailDomainType,
	},
	'validation.getIpProfile': {
		input: InterzoidEndpointInputSchemas.getIpProfile,
		output: InterzoidEndpointOutputSchemas.getIpProfile,
	},
	'validation.getPhoneProfile': {
		input: InterzoidEndpointInputSchemas.getPhoneProfile,
		output: InterzoidEndpointOutputSchemas.getPhoneProfile,
	},
	'validation.getGlobalNumberInfo': {
		input: InterzoidEndpointInputSchemas.getGlobalNumberInfo,
		output: InterzoidEndpointOutputSchemas.getGlobalNumberInfo,
	},
	'validation.getAreaCodeFromNumber': {
		input: InterzoidEndpointInputSchemas.getAreaCodeFromNumber,
		output: InterzoidEndpointOutputSchemas.getAreaCodeFromNumber,
	},
	'validation.getAreaCode': {
		input: InterzoidEndpointInputSchemas.getAreaCode,
		output: InterzoidEndpointOutputSchemas.getAreaCode,
	},
	'validation.getZipCodeInfo': {
		input: InterzoidEndpointInputSchemas.getZipCodeInfo,
		output: InterzoidEndpointOutputSchemas.getZipCodeInfo,
	},
	'validation.addressParse': {
		input: InterzoidEndpointInputSchemas.addressParse,
		output: InterzoidEndpointOutputSchemas.addressParse,
	},
	'utilities.getEntityType': {
		input: InterzoidEndpointInputSchemas.getEntityType,
		output: InterzoidEndpointOutputSchemas.getEntityType,
	},
	'utilities.getGender': {
		input: InterzoidEndpointInputSchemas.getGender,
		output: InterzoidEndpointOutputSchemas.getGender,
	},
	'utilities.getNameOrigin': {
		input: InterzoidEndpointInputSchemas.getNameOrigin,
		output: InterzoidEndpointOutputSchemas.getNameOrigin,
	},
	'utilities.identifyLanguage': {
		input: InterzoidEndpointInputSchemas.identifyLanguage,
		output: InterzoidEndpointOutputSchemas.identifyLanguage,
	},
	'utilities.translateToEnglish': {
		input: InterzoidEndpointInputSchemas.translateToEnglish,
		output: InterzoidEndpointOutputSchemas.translateToEnglish,
	},
	'utilities.translateToAny': {
		input: InterzoidEndpointInputSchemas.translateToAny,
		output: InterzoidEndpointOutputSchemas.translateToAny,
	},
	'utilities.getGlobalLatency': {
		input: InterzoidEndpointInputSchemas.getGlobalLatency,
		output: InterzoidEndpointOutputSchemas.getGlobalLatency,
	},
	'utilities.getGlobalPageLoad': {
		input: InterzoidEndpointInputSchemas.getGlobalPageLoad,
		output: InterzoidEndpointOutputSchemas.getGlobalPageLoad,
	},
	'utilities.getCurrencyRate': {
		input: InterzoidEndpointInputSchemas.getCurrencyRate,
		output: InterzoidEndpointOutputSchemas.getCurrencyRate,
	},
	'utilities.convertCurrency': {
		input: InterzoidEndpointInputSchemas.convertCurrency,
		output: InterzoidEndpointOutputSchemas.convertCurrency,
	},
	'utilities.getWeatherZipCode': {
		input: InterzoidEndpointInputSchemas.getWeatherZipCode,
		output: InterzoidEndpointOutputSchemas.getWeatherZipCode,
	},
	'utilities.getGlobalWeather': {
		input: InterzoidEndpointInputSchemas.getGlobalWeather,
		output: InterzoidEndpointOutputSchemas.getGlobalWeather,
	},
	'utilities.getGlobalTime': {
		input: InterzoidEndpointInputSchemas.getGlobalTime,
		output: InterzoidEndpointOutputSchemas.getGlobalTime,
	},
	'utilities.getRemainingCredits': {
		input: InterzoidEndpointInputSchemas.getRemainingCredits,
		output: InterzoidEndpointOutputSchemas.getRemainingCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof interzoidEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const interzoidEndpointMeta = {
	'matching.getCompanyMatchAdvanced': {
		riskLevel: 'read',
		description:
			'Generate an AI-powered similarity key for a company or organization name to identify duplicates',
	},
	'matching.getFullNameMatch': {
		riskLevel: 'read',
		description:
			'Generate an AI-powered similarity key for an individual full name to identify duplicates',
	},
	'matching.getAddressMatchAdvanced': {
		riskLevel: 'read',
		description:
			'Generate an AI-powered similarity key for a street address to identify duplicates',
	},
	'matching.getAddressAndFullNameMatch': {
		riskLevel: 'read',
		description:
			'Generate a composite similarity key based on both address and full name',
	},
	'matching.getCompanyAndAddressMatch': {
		riskLevel: 'read',
		description:
			'Generate a composite similarity key based on both company name and street address',
	},
	'matching.getCompanyAndFullNameMatch': {
		riskLevel: 'read',
		description:
			'Generate a composite similarity key based on both company name and individual full name',
	},
	'matching.getGlobalAddressMatch': {
		riskLevel: 'read',
		description:
			'Generate an AI-powered similarity key for global addresses worldwide',
	},
	'matching.getProductMatch': {
		riskLevel: 'read',
		description:
			'Generate an AI-powered similarity key for product names to detect duplicate items',
	},
	'matching.getOrgMatchScore': {
		riskLevel: 'read',
		description:
			'Calculate a match similarity score between two organization names (0-100)',
	},
	'matching.getFullNameMatchScore': {
		riskLevel: 'read',
		description:
			'Calculate a match similarity score between two individual names (0-100)',
	},
	'matching.getCompanyMatch': {
		riskLevel: 'read',
		description:
			'Generate a standard similarity key for company name matching and deduplication',
	},
	'matching.getAddressMatch': {
		riskLevel: 'read',
		description:
			'Generate a standard similarity key for street address matching and deduplication',
	},
	'matching.getFullNameParsedMatch': {
		riskLevel: 'read',
		description: 'Generate a similarity key from separate first and last names',
	},
	'matching.getCityMatch': {
		riskLevel: 'read',
		description:
			'Generate a similarity key for city name matching and deduplication',
	},
	'matching.getCountryMatch': {
		riskLevel: 'read',
		description:
			'Generate a similarity key for country name matching and deduplication',
	},
	'standardization.getOrgStandard': {
		riskLevel: 'read',
		description:
			'Standardize an organization name to its canonical English form',
	},
	'standardization.getCountryStandard': {
		riskLevel: 'read',
		description: 'Standardize a country name or alias to canonical form',
	},
	'standardization.getCountryInfo': {
		riskLevel: 'read',
		description:
			'Get standardized country metadata including ISO codes, currency, and calling code',
	},
	'standardization.getStateAbbreviation': {
		riskLevel: 'read',
		description:
			'Standardize a US state or Canadian province name into its two-letter abbreviation',
	},
	'standardization.getCityStandard': {
		riskLevel: 'read',
		description: 'Standardize a city name to its canonical form',
	},
	'standardization.getOfficialName': {
		riskLevel: 'read',
		description:
			'Resolve commercial or colloquial brand name into official legal entity registration',
	},
	'intelligence.getBusinessInfo': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive business intelligence and firmographic profile',
	},
	'intelligence.getParentCompanyInfo': {
		riskLevel: 'read',
		description:
			'Retrieve corporate ownership and ultimate parent company intelligence',
	},
	'intelligence.getExecutiveProfile': {
		riskLevel: 'read',
		description:
			'Retrieve executive profile details based on company name and title',
	},
	'intelligence.getBusinessInfoDomain': {
		riskLevel: 'read',
		description:
			'Resolve company name, ticker, or brand into primary internet domain',
	},
	'intelligence.getBusinessInfoName': {
		riskLevel: 'read',
		description: 'Resolve domain or brand name into standard company name',
	},
	'intelligence.getCompanyVerification': {
		riskLevel: 'read',
		description:
			'Verify the legitimacy, existence, and reputability of a company',
	},
	'intelligence.getStockInfo': {
		riskLevel: 'read',
		description:
			'Retrieve financial stock metrics, market cap, and analyst consensus for a ticker',
	},
	'intelligence.getIndustryCodes': {
		riskLevel: 'read',
		description:
			'Retrieve NAICS and SIC industry classification codes for a company',
	},
	'intelligence.getSicCodes': {
		riskLevel: 'read',
		description:
			'Retrieve primary and secondary SIC codes with SEC filing provenance',
	},
	'intelligence.getUniversityInfo': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive higher education profile and statistics for a university',
	},
	'intelligence.getProductRecallInfo': {
		riskLevel: 'read',
		description:
			'Retrieve consumer safety recall intelligence for products and brands',
	},
	'intelligence.getTechStack': {
		riskLevel: 'read',
		description:
			'Retrieve technology stack and web infrastructure detected for a domain',
	},
	'intelligence.getCompetitorAnalysis': {
		riskLevel: 'read',
		description:
			'Retrieve structured competitive intelligence, advantages, and market dynamics',
	},
	'intelligence.getBuyingSignals': {
		riskLevel: 'read',
		description:
			'Retrieve real-time B2B purchase intent signals and expansion indicators',
	},
	'intelligence.getPrivateCompanyDealIntel': {
		riskLevel: 'read',
		description:
			'Retrieve venture capital and private equity deal intelligence for private firms',
	},
	'intelligence.getNearestCoffeeShops': {
		riskLevel: 'read',
		description: 'Find nearest coffee shops and proximity data for a location',
	},
	'intelligence.getUserXHandle': {
		riskLevel: 'read',
		description: 'Lookup X/Twitter handle for a person, company, or team',
	},
	'intelligence.getXUserProfile': {
		riskLevel: 'read',
		description:
			'Retrieve public profile statistics and bio for an X/Twitter handle',
	},
	'intelligence.getXLast3': {
		riskLevel: 'read',
		description: 'Retrieve the latest three posts from an X/Twitter account',
	},
	'intelligence.getEsgProfile': {
		riskLevel: 'read',
		description:
			'Retrieve ESG, carbon scope emissions, and corporate sustainability intelligence',
	},
	'intelligence.getGovContracts': {
		riskLevel: 'read',
		description:
			'Retrieve US federal government contracting intelligence and major awards',
	},
	'intelligence.getFacilitiesProfile': {
		riskLevel: 'read',
		description:
			'Retrieve corporate facilities and real estate portfolio intelligence',
	},
	'intelligence.getBuildingProfile': {
		riskLevel: 'read',
		description:
			'Retrieve commercial building intelligence, class, square footage, and tenants',
	},
	'intelligence.getPropertyHistory': {
		riskLevel: 'read',
		description:
			'Retrieve historical real estate property sales, deeds, and mortgages',
	},
	'intelligence.getSalesUseTaxRates': {
		riskLevel: 'read',
		description:
			'Retrieve US sales and use tax rates by address, zip code, or city',
	},
	'intelligence.getIrsPerDiemRates': {
		riskLevel: 'read',
		description:
			'Retrieve official IRS per diem reimbursement rates for travel',
	},
	'intelligence.getEuVatRates': {
		riskLevel: 'read',
		description:
			'Retrieve European VAT tax rates, standard/reduced categories, and thresholds',
	},
	'intelligence.getCustomsDutyRates': {
		riskLevel: 'read',
		description:
			'Retrieve international customs duty rates based on origin, destination, and HS code',
	},
	'intelligence.getMuniIssuerProfile': {
		riskLevel: 'read',
		description:
			'Retrieve municipal bond issuer profiles and credit diligence intelligence',
	},
	'intelligence.getCustomData': {
		riskLevel: 'read',
		description:
			'Query custom AI-powered dataset attributes specified by topic and requested columns',
	},
	'validation.getEmailInfo': {
		riskLevel: 'read',
		description:
			'Validate and enrich an email address with deliverability and demographic details',
	},
	'validation.getEmailTrustScore': {
		riskLevel: 'read',
		description: 'Compute a trust and quality score for an email address',
	},
	'validation.getEmailDomainType': {
		riskLevel: 'read',
		description:
			'Classify email domain into Business, Government, Education, Generic, or Disposable',
	},
	'validation.getIpProfile': {
		riskLevel: 'read',
		description:
			'Retrieve IP intelligence, geolocation, ASN, and reputation profile',
	},
	'validation.getPhoneProfile': {
		riskLevel: 'read',
		description:
			'Retrieve phone number intelligence, carrier, time zone, and risk assessment',
	},
	'validation.getGlobalNumberInfo': {
		riskLevel: 'read',
		description:
			'Retrieve demographic and geographic information for an international phone number',
	},
	'validation.getAreaCodeFromNumber': {
		riskLevel: 'read',
		description:
			'Extract area code and locale information from a telephone number',
	},
	'validation.getAreaCode': {
		riskLevel: 'read',
		description:
			'Retrieve geographic locale and city for a telephone area code',
	},
	'validation.getZipCodeInfo': {
		riskLevel: 'read',
		description:
			'Retrieve detailed demographics, city, state, and geographic data for a US ZIP code',
	},
	'validation.addressParse': {
		riskLevel: 'read',
		description:
			'Parse a free-form address string into structured postal components',
	},
	'utilities.getEntityType': {
		riskLevel: 'read',
		description:
			'Classify text into entity type (Location, Organization, Individual, or Text)',
	},
	'utilities.getGender': {
		riskLevel: 'read',
		description: 'Infer the likely gender from an individual first name',
	},
	'utilities.getNameOrigin': {
		riskLevel: 'read',
		description:
			'Infer the likely geographic country or region of origin from a personal name',
	},
	'utilities.identifyLanguage': {
		riskLevel: 'read',
		description: 'Detect the natural language of a text string',
	},
	'utilities.translateToEnglish': {
		riskLevel: 'read',
		description: 'Translate non-English text to English',
	},
	'utilities.translateToAny': {
		riskLevel: 'read',
		description:
			'Translate text from any language into a specified target language',
	},
	'utilities.getGlobalLatency': {
		riskLevel: 'read',
		description:
			'Measure website or API URL latency from a specified worldwide location',
	},
	'utilities.getGlobalPageLoad': {
		riskLevel: 'read',
		description:
			'Measure browser page load performance from a specified global geography',
	},
	'utilities.getCurrencyRate': {
		riskLevel: 'read',
		description:
			'Retrieve live USD foreign exchange rate for a currency symbol',
	},
	'utilities.convertCurrency': {
		riskLevel: 'read',
		description: 'Convert an amount from one foreign currency into another',
	},
	'utilities.getWeatherZipCode': {
		riskLevel: 'read',
		description: 'Retrieve current live weather conditions for a US ZIP code',
	},
	'utilities.getGlobalWeather': {
		riskLevel: 'read',
		description:
			'Retrieve current weather conditions for worldwide city locations',
	},
	'utilities.getGlobalTime': {
		riskLevel: 'read',
		description: 'Retrieve current date and time for a global city or locale',
	},
	'utilities.getRemainingCredits': {
		riskLevel: 'read',
		description:
			'Retrieve the remaining API credits balance for the active API license key',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof interzoidEndpointsNested
>;

export const interzoidAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseInterzoidPlugin<T extends InterzoidPluginOptions> =
	CorsairPlugin<
		'interzoid',
		typeof InterzoidSchema,
		typeof interzoidEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalInterzoidPlugin =
	BaseInterzoidPlugin<InterzoidPluginOptions>;

export type ExternalInterzoidPlugin<T extends InterzoidPluginOptions> =
	BaseInterzoidPlugin<T>;

export function interzoid<const T extends InterzoidPluginOptions>(
	incomingOptions: InterzoidPluginOptions & T = {} as InterzoidPluginOptions &
		T,
): ExternalInterzoidPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};

	return {
		id: 'interzoid',
		authConfig: interzoidAuthConfig,
		schema: InterzoidSchema,
		options,
		hooks: options.hooks,
		endpoints: interzoidEndpointsNested,
		webhooks: {},
		endpointMeta: interzoidEndpointMeta,
		endpointSchemas: interzoidEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: InterzoidKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('interzoid', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('interzoid', 'api_key');
			return apiKey;
		},
	} satisfies InternalInterzoidPlugin;
}

export * from './endpoints/types';
