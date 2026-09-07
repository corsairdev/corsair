import { z } from 'zod';

// Shared Schemas
export const QueryInputSchema = z.object({
	query: z.string(),
	count: z.number().optional(),
	kpp: z.string().optional(),
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

export const CleanInputSchema = z.object({
	queries: z.array(z.string()),
});
export type CleanInput = z.infer<typeof CleanInputSchema>;

export const SuggestResponseSchema = z.object({
	suggestions: z.array(
		z.object({
			value: z.string(),
			unrestricted_value: z.string(),
			data: z.record(z.string(), z.unknown()),
		}),
	),
});
export type SuggestResponse = z.infer<typeof SuggestResponseSchema>;

export const CleanResponseSchema = z.object({
	results: z.array(z.record(z.string(), z.unknown())),
});
export type CleanResponse = z.infer<typeof CleanResponseSchema>;

// Specific Schemas
export const CompositeCleanInputSchema = z.object({
	structure: z.array(z.string()),
	data: z.array(z.array(z.string())),
});
export type CompositeCleanInput = z.infer<typeof CompositeCleanInputSchema>;

export const CompositeCleanResponseSchema = z.object({
	structure: z.array(z.string()),
	data: z.array(z.array(z.record(z.string(), z.unknown()))),
});
export type CompositeCleanResponse = z.infer<
	typeof CompositeCleanResponseSchema
>;

export const GeolocateInputSchema = z.object({
	lat: z.number(),
	lon: z.number(),
	radius_meters: z.number().optional(),
	count: z.number().optional(),
});
export type GeolocateInput = z.infer<typeof GeolocateInputSchema>;

export const IpLocateInputSchema = z.object({
	ip: z.string().optional(),
});
export type IpLocateInput = z.infer<typeof IpLocateInputSchema>;

export const IpLocateResponseSchema = z.object({
	location: z.record(z.string(), z.unknown()).nullable(),
});
export type IpLocateResponse = z.infer<typeof IpLocateResponseSchema>;

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const BalanceResponseSchema = z.object({
	balance: z.number(),
});
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;

export const StatisticsResponseSchema = z.record(z.string(), z.unknown());
export type StatisticsResponse = z.infer<typeof StatisticsResponseSchema>;

export const VersionsResponseSchema = z.record(z.string(), z.unknown());
export type VersionsResponse = z.infer<typeof VersionsResponseSchema>;

// Endpoint maps
export type DadataruEndpointInputs = {
	// Clean
	cleanAddress: CleanInput;
	cleanBirthdate: CleanInput;
	cleanRecord: CompositeCleanInput;
	cleanEmail: CleanInput;
	cleanName: CleanInput;
	cleanPassport: CleanInput;
	cleanPhone: CleanInput;
	cleanVehicle: CleanInput;
	// Find
	findAddress: QueryInput;
	findFiasById: QueryInput;
	findBank: QueryInput;
	findPartyBy: QueryInput;
	findCarBrand: QueryInput;
	findCompanyByEmail: QueryInput;
	findParty: QueryInput;
	findCountry: QueryInput;
	findCourtById: QueryInput;
	findCurrency: QueryInput;
	findDelivery: QueryInput;
	findFmsUnit: QueryInput;
	findFnsUnit: QueryInput;
	findFtsUnit: QueryInput;
	findPartyKz: QueryInput;
	findMktu: QueryInput;
	findMedicalPositionById: QueryInput;
	findOkpd2ById: QueryInput;
	findOkpdtrPosition: QueryInput;
	findOkpdtrProfession: QueryInput;
	findOkved2: QueryInput;
	findPostalOffice: QueryInput;
	findPostalUnitById: QueryInput;
	findOktmoById: QueryInput;
	// Geolocate
	geolocateAddress: GeolocateInput;
	geolocatePostalUnit: GeolocateInput;
	// Profile
	getProfileBalance: EmptyInput;
	getProfileStatistics: EmptyInput;
	getReferenceVersions: EmptyInput;
	// IP Locate
	ipLocateAddress: IpLocateInput;
	// Suggest
	suggestAddress: QueryInput;
	suggestBank: QueryInput;
	suggestPartyBy: QueryInput;
	suggestCarBrand: QueryInput;
	suggestCountry: QueryInput;
	suggestCourt: QueryInput;
	suggestCurrency: QueryInput;
	suggestEmail: QueryInput;
	suggestFias: QueryInput;
	suggestFmsUnit: QueryInput;
	suggestFnsUnit: QueryInput;
	suggestFtsUnit: QueryInput;
	suggestPartyKz: QueryInput;
	suggestMktu: QueryInput;
	suggestMedicalPosition: QueryInput;
	suggestMetro: QueryInput;
	suggestName: QueryInput;
	suggestOkpd2: QueryInput;
	suggestOkpdtrPosition: QueryInput;
	suggestOkpdtrProfession: QueryInput;
	suggestOktmo: QueryInput;
	suggestOkved2: QueryInput;
	suggestParty: QueryInput;
	suggestPostalOffice: QueryInput;
	suggestPostalUnit: QueryInput;
};

export type DadataruEndpointOutputs = {
	// Clean
	cleanAddress: CleanResponse;
	cleanBirthdate: CleanResponse;
	cleanRecord: CompositeCleanResponse;
	cleanEmail: CleanResponse;
	cleanName: CleanResponse;
	cleanPassport: CleanResponse;
	cleanPhone: CleanResponse;
	cleanVehicle: CleanResponse;
	// Find
	findAddress: SuggestResponse;
	findFiasById: SuggestResponse;
	findBank: SuggestResponse;
	findPartyBy: SuggestResponse;
	findCarBrand: SuggestResponse;
	findCompanyByEmail: SuggestResponse;
	findParty: SuggestResponse;
	findCountry: SuggestResponse;
	findCourtById: SuggestResponse;
	findCurrency: SuggestResponse;
	findDelivery: SuggestResponse;
	findFmsUnit: SuggestResponse;
	findFnsUnit: SuggestResponse;
	findFtsUnit: SuggestResponse;
	findPartyKz: SuggestResponse;
	findMktu: SuggestResponse;
	findMedicalPositionById: SuggestResponse;
	findOkpd2ById: SuggestResponse;
	findOkpdtrPosition: SuggestResponse;
	findOkpdtrProfession: SuggestResponse;
	findOkved2: SuggestResponse;
	findPostalOffice: SuggestResponse;
	findPostalUnitById: SuggestResponse;
	findOktmoById: SuggestResponse;
	// Geolocate
	geolocateAddress: SuggestResponse;
	geolocatePostalUnit: SuggestResponse;
	// Profile
	getProfileBalance: BalanceResponse;
	getProfileStatistics: StatisticsResponse;
	getReferenceVersions: VersionsResponse;
	// IP Locate
	ipLocateAddress: IpLocateResponse;
	// Suggest
	suggestAddress: SuggestResponse;
	suggestBank: SuggestResponse;
	suggestPartyBy: SuggestResponse;
	suggestCarBrand: SuggestResponse;
	suggestCountry: SuggestResponse;
	suggestCourt: SuggestResponse;
	suggestCurrency: SuggestResponse;
	suggestEmail: SuggestResponse;
	suggestFias: SuggestResponse;
	suggestFmsUnit: SuggestResponse;
	suggestFnsUnit: SuggestResponse;
	suggestFtsUnit: SuggestResponse;
	suggestPartyKz: SuggestResponse;
	suggestMktu: SuggestResponse;
	suggestMedicalPosition: SuggestResponse;
	suggestMetro: SuggestResponse;
	suggestName: SuggestResponse;
	suggestOkpd2: SuggestResponse;
	suggestOkpdtrPosition: SuggestResponse;
	suggestOkpdtrProfession: SuggestResponse;
	suggestOktmo: SuggestResponse;
	suggestOkved2: SuggestResponse;
	suggestParty: SuggestResponse;
	suggestPostalOffice: SuggestResponse;
	suggestPostalUnit: SuggestResponse;
};

export const DadataruEndpointInputSchemas = {
	// Clean
	cleanAddress: CleanInputSchema,
	cleanBirthdate: CleanInputSchema,
	cleanRecord: CompositeCleanInputSchema,
	cleanEmail: CleanInputSchema,
	cleanName: CleanInputSchema,
	cleanPassport: CleanInputSchema,
	cleanPhone: CleanInputSchema,
	cleanVehicle: CleanInputSchema,
	// Find
	findAddress: QueryInputSchema,
	findFiasById: QueryInputSchema,
	findBank: QueryInputSchema,
	findPartyBy: QueryInputSchema,
	findCarBrand: QueryInputSchema,
	findCompanyByEmail: QueryInputSchema,
	findParty: QueryInputSchema,
	findCountry: QueryInputSchema,
	findCourtById: QueryInputSchema,
	findCurrency: QueryInputSchema,
	findDelivery: QueryInputSchema,
	findFmsUnit: QueryInputSchema,
	findFnsUnit: QueryInputSchema,
	findFtsUnit: QueryInputSchema,
	findPartyKz: QueryInputSchema,
	findMktu: QueryInputSchema,
	findMedicalPositionById: QueryInputSchema,
	findOkpd2ById: QueryInputSchema,
	findOkpdtrPosition: QueryInputSchema,
	findOkpdtrProfession: QueryInputSchema,
	findOkved2: QueryInputSchema,
	findPostalOffice: QueryInputSchema,
	findPostalUnitById: QueryInputSchema,
	findOktmoById: QueryInputSchema,
	// Geolocate
	geolocateAddress: GeolocateInputSchema,
	geolocatePostalUnit: GeolocateInputSchema,
	// Profile
	getProfileBalance: EmptyInputSchema,
	getProfileStatistics: EmptyInputSchema,
	getReferenceVersions: EmptyInputSchema,
	// IP Locate
	ipLocateAddress: IpLocateInputSchema,
	// Suggest
	suggestAddress: QueryInputSchema,
	suggestBank: QueryInputSchema,
	suggestPartyBy: QueryInputSchema,
	suggestCarBrand: QueryInputSchema,
	suggestCountry: QueryInputSchema,
	suggestCourt: QueryInputSchema,
	suggestCurrency: QueryInputSchema,
	suggestEmail: QueryInputSchema,
	suggestFias: QueryInputSchema,
	suggestFmsUnit: QueryInputSchema,
	suggestFnsUnit: QueryInputSchema,
	suggestFtsUnit: QueryInputSchema,
	suggestPartyKz: QueryInputSchema,
	suggestMktu: QueryInputSchema,
	suggestMedicalPosition: QueryInputSchema,
	suggestMetro: QueryInputSchema,
	suggestName: QueryInputSchema,
	suggestOkpd2: QueryInputSchema,
	suggestOkpdtrPosition: QueryInputSchema,
	suggestOkpdtrProfession: QueryInputSchema,
	suggestOktmo: QueryInputSchema,
	suggestOkved2: QueryInputSchema,
	suggestParty: QueryInputSchema,
	suggestPostalOffice: QueryInputSchema,
	suggestPostalUnit: QueryInputSchema,
} as const;

export const DadataruEndpointOutputSchemas = {
	// Clean
	cleanAddress: CleanResponseSchema,
	cleanBirthdate: CleanResponseSchema,
	cleanRecord: CompositeCleanResponseSchema,
	cleanEmail: CleanResponseSchema,
	cleanName: CleanResponseSchema,
	cleanPassport: CleanResponseSchema,
	cleanPhone: CleanResponseSchema,
	cleanVehicle: CleanResponseSchema,
	// Find
	findAddress: SuggestResponseSchema,
	findFiasById: SuggestResponseSchema,
	findBank: SuggestResponseSchema,
	findPartyBy: SuggestResponseSchema,
	findCarBrand: SuggestResponseSchema,
	findCompanyByEmail: SuggestResponseSchema,
	findParty: SuggestResponseSchema,
	findCountry: SuggestResponseSchema,
	findCourtById: SuggestResponseSchema,
	findCurrency: SuggestResponseSchema,
	findDelivery: SuggestResponseSchema,
	findFmsUnit: SuggestResponseSchema,
	findFnsUnit: SuggestResponseSchema,
	findFtsUnit: SuggestResponseSchema,
	findPartyKz: SuggestResponseSchema,
	findMktu: SuggestResponseSchema,
	findMedicalPositionById: SuggestResponseSchema,
	findOkpd2ById: SuggestResponseSchema,
	findOkpdtrPosition: SuggestResponseSchema,
	findOkpdtrProfession: SuggestResponseSchema,
	findOkved2: SuggestResponseSchema,
	findPostalOffice: SuggestResponseSchema,
	findPostalUnitById: SuggestResponseSchema,
	findOktmoById: SuggestResponseSchema,
	// Geolocate
	geolocateAddress: SuggestResponseSchema,
	geolocatePostalUnit: SuggestResponseSchema,
	// Profile
	getProfileBalance: BalanceResponseSchema,
	getProfileStatistics: StatisticsResponseSchema,
	getReferenceVersions: VersionsResponseSchema,
	// IP Locate
	ipLocateAddress: IpLocateResponseSchema,
	// Suggest
	suggestAddress: SuggestResponseSchema,
	suggestBank: SuggestResponseSchema,
	suggestPartyBy: SuggestResponseSchema,
	suggestCarBrand: SuggestResponseSchema,
	suggestCountry: SuggestResponseSchema,
	suggestCourt: SuggestResponseSchema,
	suggestCurrency: SuggestResponseSchema,
	suggestEmail: SuggestResponseSchema,
	suggestFias: SuggestResponseSchema,
	suggestFmsUnit: SuggestResponseSchema,
	suggestFnsUnit: SuggestResponseSchema,
	suggestFtsUnit: SuggestResponseSchema,
	suggestPartyKz: SuggestResponseSchema,
	suggestMktu: SuggestResponseSchema,
	suggestMedicalPosition: SuggestResponseSchema,
	suggestMetro: SuggestResponseSchema,
	suggestName: SuggestResponseSchema,
	suggestOkpd2: SuggestResponseSchema,
	suggestOkpdtrPosition: SuggestResponseSchema,
	suggestOkpdtrProfession: SuggestResponseSchema,
	suggestOktmo: SuggestResponseSchema,
	suggestOkved2: SuggestResponseSchema,
	suggestParty: SuggestResponseSchema,
	suggestPostalOffice: SuggestResponseSchema,
	suggestPostalUnit: SuggestResponseSchema,
} as const;
