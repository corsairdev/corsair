import { z } from 'zod';

/** Credits value returned by Interzoid (numeric, string integer, or negative overage). */
export const InterzoidCreditsSchema = z.union([z.number(), z.string()]);
export type InterzoidCredits = z.infer<typeof InterzoidCreditsSchema>;

export const GetCompanyMatchAdvancedInputSchema = z
	.object({
		company: z.string().min(1, 'company is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetCompanyMatchAdvancedInput = z.infer<
	typeof GetCompanyMatchAdvancedInputSchema
>;

export const GetCompanyMatchAdvancedOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompanyMatchAdvancedOutput = z.infer<
	typeof GetCompanyMatchAdvancedOutputSchema
>;

export const GetFullNameMatchInputSchema = z
	.object({
		fullname: z.string().min(1, 'fullname is required'),
	})
	.strict();
export type GetFullNameMatchInput = z.infer<typeof GetFullNameMatchInputSchema>;

export const GetFullNameMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetFullNameMatchOutput = z.infer<
	typeof GetFullNameMatchOutputSchema
>;

export const GetAddressMatchAdvancedInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
		algorithm: z.string().optional(),
		zip: z
			.string()
			.optional()
			.describe(
				'ZIP code of the address; optional, makes the match more precise.',
			),
	})
	.strict();
export type GetAddressMatchAdvancedInput = z.infer<
	typeof GetAddressMatchAdvancedInputSchema
>;

export const GetAddressMatchAdvancedOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetAddressMatchAdvancedOutput = z.infer<
	typeof GetAddressMatchAdvancedOutputSchema
>;

export const GetAddressAndFullNameMatchInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
		fullname: z.string().min(1, 'fullname is required'),
	})
	.strict();
export type GetAddressAndFullNameMatchInput = z.infer<
	typeof GetAddressAndFullNameMatchInputSchema
>;

export const GetAddressAndFullNameMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetAddressAndFullNameMatchOutput = z.infer<
	typeof GetAddressAndFullNameMatchOutputSchema
>;

export const GetCompanyAndAddressMatchInputSchema = z
	.object({
		company: z.string().min(1, 'company is required'),
		address: z.string().min(1, 'address is required'),
	})
	.strict();
export type GetCompanyAndAddressMatchInput = z.infer<
	typeof GetCompanyAndAddressMatchInputSchema
>;

export const GetCompanyAndAddressMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompanyAndAddressMatchOutput = z.infer<
	typeof GetCompanyAndAddressMatchOutputSchema
>;

export const GetCompanyAndFullNameMatchInputSchema = z
	.object({
		company: z.string().min(1, 'company is required'),
		fullname: z.string().min(1, 'fullname is required'),
	})
	.strict();
export type GetCompanyAndFullNameMatchInput = z.infer<
	typeof GetCompanyAndFullNameMatchInputSchema
>;

export const GetCompanyAndFullNameMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompanyAndFullNameMatchOutput = z.infer<
	typeof GetCompanyAndFullNameMatchOutputSchema
>;

export const GetGlobalAddressMatchInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetGlobalAddressMatchInput = z.infer<
	typeof GetGlobalAddressMatchInputSchema
>;

export const GetGlobalAddressMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGlobalAddressMatchOutput = z.infer<
	typeof GetGlobalAddressMatchOutputSchema
>;

export const GetProductMatchInputSchema = z
	.object({
		product: z.string().min(1, 'product is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetProductMatchInput = z.infer<typeof GetProductMatchInputSchema>;

export const GetProductMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetProductMatchOutput = z.infer<typeof GetProductMatchOutputSchema>;

export const GetOrgMatchScoreInputSchema = z
	.object({
		org1: z.string().min(1, 'org1 is required'),
		org2: z.string().min(1, 'org2 is required'),
	})
	.strict();
export type GetOrgMatchScoreInput = z.infer<typeof GetOrgMatchScoreInputSchema>;

export const GetOrgMatchScoreOutputSchema = z
	.object({
		Score: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetOrgMatchScoreOutput = z.infer<
	typeof GetOrgMatchScoreOutputSchema
>;

export const GetFullNameMatchScoreInputSchema = z
	.object({
		fullname1: z.string().min(1, 'fullname1 is required'),
		fullname2: z.string().min(1, 'fullname2 is required'),
	})
	.strict();
export type GetFullNameMatchScoreInput = z.infer<
	typeof GetFullNameMatchScoreInputSchema
>;

export const GetFullNameMatchScoreOutputSchema = z
	.object({
		Score: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetFullNameMatchScoreOutput = z.infer<
	typeof GetFullNameMatchScoreOutputSchema
>;

export const GetCompanyMatchInputSchema = z
	.object({
		company: z.string().min(1, 'company is required'),
	})
	.strict();
export type GetCompanyMatchInput = z.infer<typeof GetCompanyMatchInputSchema>;

export const GetCompanyMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Simkey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompanyMatchOutput = z.infer<typeof GetCompanyMatchOutputSchema>;

export const GetAddressMatchInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
	})
	.strict();
export type GetAddressMatchInput = z.infer<typeof GetAddressMatchInputSchema>;

export const GetAddressMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Simkey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetAddressMatchOutput = z.infer<typeof GetAddressMatchOutputSchema>;

export const GetFullNameParsedMatchInputSchema = z
	.object({
		firstname: z.string().min(1, 'firstname is required'),
		lastname: z.string().min(1, 'lastname is required'),
	})
	.strict();
export type GetFullNameParsedMatchInput = z.infer<
	typeof GetFullNameParsedMatchInputSchema
>;

export const GetFullNameParsedMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Simkey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetFullNameParsedMatchOutput = z.infer<
	typeof GetFullNameParsedMatchOutputSchema
>;

export const GetCityMatchInputSchema = z
	.object({
		city: z.string().min(1, 'city is required'),
	})
	.strict();
export type GetCityMatchInput = z.infer<typeof GetCityMatchInputSchema>;

export const GetCityMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Simkey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCityMatchOutput = z.infer<typeof GetCityMatchOutputSchema>;

export const GetCountryMatchInputSchema = z
	.object({
		country: z.string().min(1, 'country is required'),
	})
	.strict();
export type GetCountryMatchInput = z.infer<typeof GetCountryMatchInputSchema>;

export const GetCountryMatchOutputSchema = z
	.object({
		SimKey: z.string().optional(),
		Simkey: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCountryMatchOutput = z.infer<typeof GetCountryMatchOutputSchema>;

export const GetOrgStandardInputSchema = z
	.object({
		org: z.string().min(1, 'org is required'),
	})
	.strict();
export type GetOrgStandardInput = z.infer<typeof GetOrgStandardInputSchema>;

export const GetOrgStandardOutputSchema = z
	.object({
		Standard: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetOrgStandardOutput = z.infer<typeof GetOrgStandardOutputSchema>;

export const GetCountryStandardInputSchema = z
	.object({
		country: z.string().min(1, 'country is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetCountryStandardInput = z.infer<
	typeof GetCountryStandardInputSchema
>;

export const GetCountryStandardOutputSchema = z
	.object({
		CountryStandard: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCountryStandardOutput = z.infer<
	typeof GetCountryStandardOutputSchema
>;

export const GetCountryInfoInputSchema = z
	.object({
		country: z.string().min(1, 'country is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetCountryInfoInput = z.infer<typeof GetCountryInfoInputSchema>;

export const GetCountryInfoOutputSchema = z
	.object({
		CountryStandard: z.string().optional(),
		TwoLetterCode: z.string().optional(),
		ThreeLetterCode: z.string().optional(),
		ThreeDigitCode: z.string().optional(),
		CurrencyCode: z.string().optional(),
		CurrencyName: z.string().optional(),
		CurrencySubUnit: z.string().optional(),
		CurrencySymbol: z.string().optional(),
		InternetCode: z.string().optional(),
		CallingCode: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCountryInfoOutput = z.infer<typeof GetCountryInfoOutputSchema>;

export const GetStateAbbreviationInputSchema = z
	.object({
		state: z.string().min(1, 'state is required'),
		algorithm: z.string().optional(),
	})
	.strict();
export type GetStateAbbreviationInput = z.infer<
	typeof GetStateAbbreviationInputSchema
>;

export const GetStateAbbreviationOutputSchema = z
	.object({
		State: z.string().optional(),
		Abbreviation: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetStateAbbreviationOutput = z.infer<
	typeof GetStateAbbreviationOutputSchema
>;

export const GetCityStandardInputSchema = z
	.object({
		city: z.string().min(1, 'city is required'),
		algorithm: z.string().optional(),
		state: z
			.string()
			.optional()
			.describe(
				'State or province of the city; optional, makes the result more precise.',
			),
	})
	.strict();
export type GetCityStandardInput = z.infer<typeof GetCityStandardInputSchema>;

export const GetCityStandardOutputSchema = z
	.object({
		CityStandard: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCityStandardOutput = z.infer<typeof GetCityStandardOutputSchema>;

export const GetOfficialNameInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
	})
	.strict();
export type GetOfficialNameInput = z.infer<typeof GetOfficialNameInputSchema>;

export const GetOfficialNameOutputSchema = z
	.object({
		OfficialNameEnglish: z.string().optional(),
		CommercialName: z.string().optional(),
		OfficialNameLocal: z.string().optional(),
		OfficialNameLocalRomanized: z.string().optional(),
		LegalForm: z.string().optional(),
		EntityCategory: z.string().optional(),
		CountryOfIncorporation: z.string().optional(),
		CountryCodeISO2: z.string().optional(),
		IncorporationRegistryName: z.string().optional(),
		RegistryIdentifier: z.string().optional(),
		AlsoKnownAs: z.string().optional(),
		Status: z.string().optional(),
		OfficialDocumentationURL: z.string().optional(),
		SourceType: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetOfficialNameOutput = z.infer<typeof GetOfficialNameOutputSchema>;

export const GetBusinessInfoInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetBusinessInfoInput = z.infer<typeof GetBusinessInfoInputSchema>;

export const GetBusinessInfoOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		CompanyLocation: z.string().optional(),
		CompanyDescription: z.string().optional(),
		Revenue: z.string().optional(),
		NumberEmployees: z.string().optional(),
		NAICS: z.string().optional(),
		TopExecutive: z.string().optional(),
		TopExecutiveTitle: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetBusinessInfoOutput = z.infer<typeof GetBusinessInfoOutputSchema>;

export const GetParentCompanyInfoInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetParentCompanyInfoInput = z.infer<
	typeof GetParentCompanyInfoInputSchema
>;

export const GetParentCompanyInfoOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		ParentCompany: z.string().optional(),
		ParentCompanyLocation: z.string().optional(),
		ParentCompanyURL: z.string().optional(),
		ParentCompanyDescription: z.string().optional(),
		ParentCompanyReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetParentCompanyInfoOutput = z.infer<
	typeof GetParentCompanyInfoOutputSchema
>;

export const GetExecutiveProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetExecutiveProfileInput = z.infer<
	typeof GetExecutiveProfileInputSchema
>;

export const GetExecutiveProfileOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		ExecutiveName: z.string().optional(),
		ExecutiveTitle: z.string().optional(),
		LinkedInURL: z.string().optional(),
		BiographyURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetExecutiveProfileOutput = z.infer<
	typeof GetExecutiveProfileOutputSchema
>;

export const GetBusinessInfoDomainInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
	})
	.strict();
export type GetBusinessInfoDomainInput = z.infer<
	typeof GetBusinessInfoDomainInputSchema
>;

export const GetBusinessInfoDomainOutputSchema = z
	.object({
		Domain: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetBusinessInfoDomainOutput = z.infer<
	typeof GetBusinessInfoDomainOutputSchema
>;

export const GetBusinessInfoNameInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetBusinessInfoNameInput = z.infer<
	typeof GetBusinessInfoNameInputSchema
>;

export const GetBusinessInfoNameOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetBusinessInfoNameOutput = z.infer<
	typeof GetBusinessInfoNameOutputSchema
>;

export const GetCompanyVerificationInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetCompanyVerificationInput = z.infer<
	typeof GetCompanyVerificationInputSchema
>;

export const GetCompanyVerificationOutputSchema = z
	.object({
		Score: z.string().optional(),
		Reasoning: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompanyVerificationOutput = z.infer<
	typeof GetCompanyVerificationOutputSchema
>;

export const GetStockInfoInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetStockInfoInput = z.infer<typeof GetStockInfoInputSchema>;

export const GetStockInfoOutputSchema = z
	.object({
		Ticker: z.string().optional(),
		Exchange: z.string().optional(),
		Company: z.string().optional(),
		Website: z.string().optional(),
		Description: z.string().optional(),
		MarketCap: z.string().optional(),
		CurrentPrice: z.string().optional(),
		AnalystAssessment: z.string().optional(),
		PERatio: z.string().optional(),
		EPS: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetStockInfoOutput = z.infer<typeof GetStockInfoOutputSchema>;

export const GetIndustryCodesInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetIndustryCodesInput = z.infer<typeof GetIndustryCodesInputSchema>;

export const GetIndustryCodesOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		PrimaryIndustry: z.string().optional(),
		NAICSCode: z.string().optional(),
		NAICSCodeTitle: z.string().optional(),
		SICCode: z.string().optional(),
		SICCodeTitle: z.string().optional(),
		Sector: z.string().optional(),
		Subsector: z.string().optional(),
		IndustryDefinition: z.string().optional(),
		ConfidenceScore: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetIndustryCodesOutput = z.infer<
	typeof GetIndustryCodesOutputSchema
>;

export const GetSicCodesInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
	})
	.strict();
export type GetSicCodesInput = z.infer<typeof GetSicCodesInputSchema>;

export const GetSicCodesOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		PrimarySICCode: z.string().optional(),
		PrimarySICCodeTitle: z.string().optional(),
		PrimarySICBasis: z.string().optional(),
		AdditionalSICCodes: z.string().optional(),
		AdditionalSICCodeTitles: z.string().optional(),
		SICSourceType: z.string().optional(),
		SICSourceReferenceURL: z.string().optional(),
		ConfidenceScore: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetSicCodesOutput = z.infer<typeof GetSicCodesOutputSchema>;

export const GetUniversityInfoInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetUniversityInfoInput = z.infer<
	typeof GetUniversityInfoInputSchema
>;

export const GetUniversityInfoOutputSchema = z
	.object({
		InstitutionName: z.string().optional(),
		Location: z.string().optional(),
		InstitutionType: z.string().optional(),
		FoundedYear: z.string().optional(),
		TotalEnrollment: z.string().optional(),
		AcceptanceRate: z.string().optional(),
		TuitionInState: z.string().optional(),
		TuitionOutOfState: z.string().optional(),
		NotablePrograms: z.string().optional(),
		WebsiteURL: z.string().optional(),
		EndowmentSize: z.string().optional(),
		AthleticConference: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetUniversityInfoOutput = z.infer<
	typeof GetUniversityInfoOutputSchema
>;

export const GetProductRecallInfoInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
	})
	.strict();
export type GetProductRecallInfoInput = z.infer<
	typeof GetProductRecallInfoInputSchema
>;

export const GetProductRecallInfoOutputSchema = z
	.object({
		ProductName: z.string().optional(),
		Brand: z.string().optional(),
		RecallDate: z.string().optional(),
		RecallingAgency: z.string().optional(),
		RecallReason: z.string().optional(),
		SeverityLevel: z.string().optional(),
		UnitsAffected: z.string().optional(),
		RemedyAction: z.string().optional(),
		RecallStatus: z.string().optional(),
		AdditionalDetails: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetProductRecallInfoOutput = z.infer<
	typeof GetProductRecallInfoOutputSchema
>;

export const GetTechStackInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetTechStackInput = z.infer<typeof GetTechStackInputSchema>;

export const GetTechStackOutputSchema = z
	.object({
		DomainName: z.string().optional(),
		CMSPlatform: z.string().optional(),
		FrontendFrameworks: z.string().optional(),
		BackendTechnologies: z.string().optional(),
		WebServer: z.string().optional(),
		HostingProvider: z.string().optional(),
		CDNProvider: z.string().optional(),
		AnalyticsTools: z.string().optional(),
		SecurityTechnologies: z.string().optional(),
		EcommercePlatform: z.string().optional(),
		AdditionalTechnologies: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetTechStackOutput = z.infer<typeof GetTechStackOutputSchema>;

export const GetCompetitorAnalysisInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetCompetitorAnalysisInput = z.infer<
	typeof GetCompetitorAnalysisInputSchema
>;

export const GetCompetitorAnalysisOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		Industry: z.string().optional(),
		MarketPosition: z.string().optional(),
		TopCompetitors: z.string().optional(),
		IndirectCompetitors: z.string().optional(),
		CompetitiveAdvantages: z.string().optional(),
		CompetitiveWeaknesses: z.string().optional(),
		MarketDynamics: z.string().optional(),
		StrategicOutlook: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCompetitorAnalysisOutput = z.infer<
	typeof GetCompetitorAnalysisOutputSchema
>;

export const GetBuyingSignalsInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetBuyingSignalsInput = z.infer<typeof GetBuyingSignalsInputSchema>;

export const GetBuyingSignalsOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		Industry: z.string().optional(),
		CompanySize: z.string().optional(),
		LeadershipChanges: z.string().optional(),
		FundingEvents: z.string().optional(),
		HiringSignals: z.string().optional(),
		TechnologyChanges: z.string().optional(),
		ExpansionSignals: z.string().optional(),
		PainPointIndicators: z.string().optional(),
		BudgetIndicators: z.string().optional(),
		SignalStrengthScore: z.string().optional(),
		RecommendedTiming: z.string().optional(),
		KeyDecisionMakers: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetBuyingSignalsOutput = z.infer<
	typeof GetBuyingSignalsOutputSchema
>;

export const GetPrivateCompanyDealIntelInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetPrivateCompanyDealIntelInput = z.infer<
	typeof GetPrivateCompanyDealIntelInputSchema
>;

export const GetPrivateCompanyDealIntelOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		FoundedYear: z.string().optional(),
		Headquarters: z.string().optional(),
		Industry: z.string().optional(),
		LatestValuation: z.string().optional(),
		TotalFundingRaised: z.string().optional(),
		FundingRounds: z.string().optional(),
		KeyInvestors: z.string().optional(),
		EmployeeCountEstimate: z.string().optional(),
		RevenueEstimate: z.string().optional(),
		GrowthMetrics: z.string().optional(),
		RecentDealsAndExits: z.string().optional(),
		ComparableCompanies: z.string().optional(),
		DataConfidenceNotes: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetPrivateCompanyDealIntelOutput = z.infer<
	typeof GetPrivateCompanyDealIntelOutputSchema
>;

export const GetNearestCoffeeShopsInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
	})
	.strict();
export type GetNearestCoffeeShopsInput = z.infer<
	typeof GetNearestCoffeeShopsInputSchema
>;

export const GetNearestCoffeeShopsOutputSchema = z
	.object({
		SearchLocation: z.string().optional(),
		Shop1Name: z.string().optional(),
		Shop1Address: z.string().optional(),
		Shop1Distance: z.string().optional(),
		Shop1Rating: z.string().optional(),
		Shop1Hours: z.string().optional(),
		Shop2Name: z.string().optional(),
		Shop2Address: z.string().optional(),
		Shop2Distance: z.string().optional(),
		Shop2Rating: z.string().optional(),
		Shop2Hours: z.string().optional(),
		Shop3Name: z.string().optional(),
		Shop3Address: z.string().optional(),
		Shop3Distance: z.string().optional(),
		Shop3Rating: z.string().optional(),
		Shop3Hours: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetNearestCoffeeShopsOutput = z.infer<
	typeof GetNearestCoffeeShopsOutputSchema
>;

export const GetUserXHandleInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetUserXHandleInput = z.infer<typeof GetUserXHandleInputSchema>;

export const GetUserXHandleOutputSchema = z
	.object({
		Handle: z.string().optional(),
		ConfidenceScore: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetUserXHandleOutput = z.infer<typeof GetUserXHandleOutputSchema>;

export const GetXUserProfileInputSchema = z
	.object({
		handle: z.string().min(1, 'handle is required'),
	})
	.strict();
export type GetXUserProfileInput = z.infer<typeof GetXUserProfileInputSchema>;

export const GetXUserProfileOutputSchema = z
	.object({
		Handle: z.string().optional(),
		DisplayName: z.string().optional(),
		Description: z.string().optional(),
		CreateDate: z.string().optional(),
		Following: z.string().optional(),
		Followers: z.string().optional(),
		PostCount: z.string().optional(),
		WebsiteURL: z.string().optional(),
		Location: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetXUserProfileOutput = z.infer<typeof GetXUserProfileOutputSchema>;

export const GetXLast3InputSchema = z
	.object({
		handle: z.string().min(1, 'handle is required'),
	})
	.strict();
export type GetXLast3Input = z.infer<typeof GetXLast3InputSchema>;

export const GetXLast3OutputSchema = z
	.object({
		Handle: z.string().optional(),
		Tweet1: z.string().optional(),
		Tweet1Date: z.string().optional(),
		Tweet2: z.string().optional(),
		Tweet2Date: z.string().optional(),
		Tweet3: z.string().optional(),
		Tweet3Date: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetXLast3Output = z.infer<typeof GetXLast3OutputSchema>;

export const GetEsgProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetEsgProfileInput = z.infer<typeof GetEsgProfileInputSchema>;

export const GetEsgProfileOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		ESGRiskRating: z.string().optional(),
		EnvironmentalScore: z.string().optional(),
		SocialScore: z.string().optional(),
		GovernanceScore: z.string().optional(),
		CarbonEmissionsScopes: z.string().optional(),
		NetZeroTarget: z.string().optional(),
		RenewableEnergyPercent: z.string().optional(),
		ESGControversies: z.string().optional(),
		SustainabilityFrameworks: z.string().optional(),
		ESGReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEsgProfileOutput = z.infer<typeof GetEsgProfileOutputSchema>;

export const GetGovContractsInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetGovContractsInput = z.infer<typeof GetGovContractsInputSchema>;

export const GetGovContractsOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		LifetimeContractValue: z.string().optional(),
		TTMContractValue: z.string().optional(),
		TopAwardingAgencies: z.string().optional(),
		ActiveContractVehicles: z.string().optional(),
		SetAsideStatus: z.string().optional(),
		RecentMajorAwards: z.string().optional(),
		PrimeSubMix: z.string().optional(),
		TopNAICSCodes: z.string().optional(),
		CAGECode: z.string().optional(),
		SAMReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGovContractsOutput = z.infer<typeof GetGovContractsOutputSchema>;

export const GetFacilitiesProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetFacilitiesProfileInput = z.infer<
	typeof GetFacilitiesProfileInputSchema
>;

export const GetFacilitiesProfileOutputSchema = z
	.object({
		CompanyName: z.string().optional(),
		CompanyURL: z.string().optional(),
		HeadquartersLocation: z.string().optional(),
		TotalFacilityCount: z.string().optional(),
		TotalSquareFootage: z.string().optional(),
		OwnedLeasedMix: z.string().optional(),
		FacilityTypeBreakdown: z.string().optional(),
		TopGeographicMarkets: z.string().optional(),
		RecentOpenings: z.string().optional(),
		RecentClosures: z.string().optional(),
		WorkPolicy: z.string().optional(),
		FacilitiesReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetFacilitiesProfileOutput = z.infer<
	typeof GetFacilitiesProfileOutputSchema
>;

export const GetBuildingProfileInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetBuildingProfileInput = z.infer<
	typeof GetBuildingProfileInputSchema
>;

export const GetBuildingProfileOutputSchema = z
	.object({
		PropertyAddress: z.string().optional(),
		BuildingClass: z.string().optional(),
		YearBuilt: z.string().optional(),
		TotalSquareFootage: z.string().optional(),
		FloorCount: z.string().optional(),
		PrimaryTenants: z.string().optional(),
		PropertyManager: z.string().optional(),
		OwnershipEntity: z.string().optional(),
		RecentRenovations: z.string().optional(),
		ParkingRatio: z.string().optional(),
		TransitAccess: z.string().optional(),
		BuildingReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetBuildingProfileOutput = z.infer<
	typeof GetBuildingProfileOutputSchema
>;

export const GetPropertyHistoryInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetPropertyHistoryInput = z.infer<
	typeof GetPropertyHistoryInputSchema
>;

export const GetPropertyHistoryOutputSchema = z
	.object({
		PropertyAddress: z.string().optional(),
		PropertyType: z.string().optional(),
		LastSaleDate: z.string().optional(),
		LastSalePrice: z.string().optional(),
		PriorTransactions: z.string().optional(),
		PricePerSqFtTrajectory: z.string().optional(),
		OwnershipChain: z.string().optional(),
		DeedTypes: z.string().optional(),
		MortgageHistory: z.string().optional(),
		CurrentOwner: z.string().optional(),
		AssessorParcelNumber: z.string().optional(),
		PropertyReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetPropertyHistoryOutput = z.infer<
	typeof GetPropertyHistoryOutputSchema
>;

export const GetSalesUseTaxRatesInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetSalesUseTaxRatesInput = z.infer<
	typeof GetSalesUseTaxRatesInputSchema
>;

export const GetSalesUseTaxRatesOutputSchema = z
	.object({
		Jurisdiction: z.string().optional(),
		JurisdictionLevel: z.string().optional(),
		LookupType: z.string().optional(),
		State: z.string().optional(),
		County: z.string().optional(),
		City: z.string().optional(),
		StateRate: z.string().optional(),
		CountyRate: z.string().optional(),
		CityRate: z.string().optional(),
		DistrictSpecialRate: z.string().optional(),
		CombinedRate: z.string().optional(),
		RateEffectiveDate: z.string().optional(),
		TaxAuthorityReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetSalesUseTaxRatesOutput = z.infer<
	typeof GetSalesUseTaxRatesOutputSchema
>;

export const GetIrsPerDiemRatesInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetIrsPerDiemRatesInput = z.infer<
	typeof GetIrsPerDiemRatesInputSchema
>;

export const GetIrsPerDiemRatesOutputSchema = z
	.object({
		Jurisdiction: z.string().optional(),
		JurisdictionLevel: z.string().optional(),
		LookupType: z.string().optional(),
		State: z.string().optional(),
		County: z.string().optional(),
		City: z.string().optional(),
		IRSClassification: z.string().optional(),
		TotalPerDiem: z.string().optional(),
		LodgingAllowance: z.string().optional(),
		MealsIncidentalAllowance: z.string().optional(),
		IncidentalExpensesOnlyRate: z.string().optional(),
		EffectivePeriod: z.string().optional(),
		IRSReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetIrsPerDiemRatesOutput = z.infer<
	typeof GetIrsPerDiemRatesOutputSchema
>;

export const GetEuVatRatesInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetEuVatRatesInput = z.infer<typeof GetEuVatRatesInputSchema>;

export const GetEuVatRatesOutputSchema = z
	.object({
		CountryName: z.string().optional(),
		CountryCodeISO2: z.string().optional(),
		TaxSystem: z.string().optional(),
		TaxSystemLocalName: z.string().optional(),
		StandardRate: z.string().optional(),
		ReducedRates: z.string().optional(),
		SuperReducedRate: z.string().optional(),
		ZeroRatedCategories: z.string().optional(),
		ExemptCategories: z.string().optional(),
		TerritorialExceptions: z.string().optional(),
		EUMemberStatus: z.string().optional(),
		RegistrationThreshold: z.string().optional(),
		TaxAuthorityReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEuVatRatesOutput = z.infer<typeof GetEuVatRatesOutputSchema>;

export const GetCustomsDutyRatesInputSchema = z
	.object({
		origin: z.string().min(1, 'origin is required'),
		lookup: z.string().min(1, 'lookup is required'),
		hscode: z.string().min(1, 'hscode is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetCustomsDutyRatesInput = z.infer<
	typeof GetCustomsDutyRatesInputSchema
>;

export const GetCustomsDutyRatesOutputSchema = z
	.object({
		OriginCountry: z.string().optional(),
		DestinationCountry: z.string().optional(),
		CountryCodeISO2: z.string().optional(),
		HSCode: z.string().optional(),
		HSCodeDescription: z.string().optional(),
		MFNAppliedRate: z.string().optional(),
		DutyBasis: z.string().optional(),
		ApplicablePreferentialRate: z.string().optional(),
		TradeRemedyDuties: z.string().optional(),
		SafeguardMeasures: z.string().optional(),
		ImportVATOrGST: z.string().optional(),
		SpecialOrAdditionalTaxes: z.string().optional(),
		DeMinimisThreshold: z.string().optional(),
		RestrictionsNotes: z.string().optional(),
		EffectivePeriod: z.string().optional(),
		CustomsAuthorityReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCustomsDutyRatesOutput = z.infer<
	typeof GetCustomsDutyRatesOutputSchema
>;

export const GetMuniIssuerProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetMuniIssuerProfileInput = z.infer<
	typeof GetMuniIssuerProfileInputSchema
>;

export const GetMuniIssuerProfileOutputSchema = z
	.object({
		IssuerName: z.string().optional(),
		IssuerType: z.string().optional(),
		State: z.string().optional(),
		Population: z.string().optional(),
		IssuerProfile: z.string().optional(),
		TypicalSecurityTypes: z.string().optional(),
		GeneralCreditStanding: z.string().optional(),
		OutstandingDebtOverview: z.string().optional(),
		NotableEvents: z.string().optional(),
		PensionAndOPEBNotes: z.string().optional(),
		KeyRevenueSources: z.string().optional(),
		EMMAReferenceURL: z.string().optional(),
		MSRBReferenceURL: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetMuniIssuerProfileOutput = z.infer<
	typeof GetMuniIssuerProfileOutputSchema
>;

export const GetCustomDataInputSchema = z
	.object({
		topic: z.string().min(1, 'topic is required'),
		lookup: z
			.string()
			.min(1, 'lookup is required')
			.describe(
				'The record to look up for this topic, such as a company name. Interzoid refuses a call without it.',
			),
		output: z.string().min(1, 'output is required'),
		model: z
			.string()
			.optional()
			.describe(
				'Interzoid AI model, such as `model-a` (1 credit). The `-premium` models cost 10 to 25 credits per call.',
			),
	})
	.strict();
export type GetCustomDataInput = z.infer<typeof GetCustomDataInputSchema>;

// `unknown` because the custom data endpoint returns dynamic user-requested column fields.
export const GetCustomDataOutputSchema = z.record(z.string(), z.unknown());
export type GetCustomDataOutput = z.infer<typeof GetCustomDataOutputSchema>;

export const GetEmailInfoInputSchema = z
	.object({
		email: z.string().min(1, 'email is required'),
	})
	.strict();
export type GetEmailInfoInput = z.infer<typeof GetEmailInfoInputSchema>;

export const GetEmailInfoOutputSchema = z
	.object({
		Email: z.string().optional(),
		Response: z.string().optional(),
		Info: z.string().optional(),
		Domain: z.string().optional(),
		IsGovernment: z.string().optional(),
		IsEducational: z.string().optional(),
		IsOrganizational: z.string().optional(),
		IsDisposable: z.string().optional(),
		IsVulgar: z.string().optional(),
		IsGeneric: z.string().optional(),
		Geolocation: z.string().optional(),
		DomainOwner: z.string().optional(),
		XHandle: z.string().optional(),
		Organization: z.string().optional(),
		Revenue: z.string().optional(),
		Employees: z.string().optional(),
		HeadquartersCountry: z.string().optional(),
		HeadquartersCity: z.string().optional(),
		Currency: z.string().optional(),
		Rate: z.string().optional(),
		Description: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEmailInfoOutput = z.infer<typeof GetEmailInfoOutputSchema>;

export const GetEmailTrustScoreInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetEmailTrustScoreInput = z.infer<
	typeof GetEmailTrustScoreInputSchema
>;

export const GetEmailTrustScoreOutputSchema = z
	.object({
		Email: z.string().optional(),
		Score: z.string().optional(),
		Reasoning: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEmailTrustScoreOutput = z.infer<
	typeof GetEmailTrustScoreOutputSchema
>;

export const GetEmailDomainTypeInputSchema = z
	.object({
		email: z.string().min(1, 'email is required'),
	})
	.strict();
export type GetEmailDomainTypeInput = z.infer<
	typeof GetEmailDomainTypeInputSchema
>;

export const GetEmailDomainTypeOutputSchema = z
	.object({
		DomainType: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEmailDomainTypeOutput = z.infer<
	typeof GetEmailDomainTypeOutputSchema
>;

export const GetIpProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetIpProfileInput = z.infer<typeof GetIpProfileInputSchema>;

export const GetIpProfileOutputSchema = z
	.object({
		Version: z.string().optional(),
		ASN: z.string().optional(),
		Organization: z.string().optional(),
		CIDR: z.string().optional(),
		Hostname: z.string().optional(),
		Geolocation: z.string().optional(),
		AbuseContact: z.string().optional(),
		Reputation: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetIpProfileOutput = z.infer<typeof GetIpProfileOutputSchema>;

export const GetPhoneProfileInputSchema = z
	.object({
		lookup: z.string().min(1, 'lookup is required'),
		language: z
			.string()
			.optional()
			.describe(
				'Return the values in this language, as a two-letter code such as `fr`. English when omitted.',
			),
	})
	.strict();
export type GetPhoneProfileInput = z.infer<typeof GetPhoneProfileInputSchema>;

export const GetPhoneProfileOutputSchema = z
	.object({
		Normalized: z.string().optional(),
		Country: z.string().optional(),
		Organization: z.string().optional(),
		Type: z.string().optional(),
		Carrier: z.string().optional(),
		TimeZone: z.string().optional(),
		Region: z.string().optional(),
		IsValid: z.string().optional(),
		RiskAssessment: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetPhoneProfileOutput = z.infer<typeof GetPhoneProfileOutputSchema>;

export const GetGlobalNumberInfoInputSchema = z
	.object({
		intlnumber: z.string().min(1, 'intlnumber is required'),
	})
	.strict();
export type GetGlobalNumberInfoInput = z.infer<
	typeof GetGlobalNumberInfoInputSchema
>;

export const GetGlobalNumberInfoOutputSchema = z
	.object({
		// Interzoid sends the primary language as `Language1` (live, 11-20).
		Language1: z.string().optional(),
		Code: z.string().optional(),
		Country: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		Language2: z.string().optional(),
		Language3: z.string().optional(),
		Mobile: z.string().optional(),
		PrimaryCity: z.string().optional(),
		PrimaryLanguage: z.string().optional(),
		Region: z.string().optional(),
		Wealth: z.string().optional(),
	})
	.loose();
export type GetGlobalNumberInfoOutput = z.infer<
	typeof GetGlobalNumberInfoOutputSchema
>;

export const GetAreaCodeFromNumberInputSchema = z
	.object({
		number: z.string().min(1, 'number is required'),
	})
	.strict();
export type GetAreaCodeFromNumberInput = z.infer<
	typeof GetAreaCodeFromNumberInputSchema
>;

export const GetAreaCodeFromNumberOutputSchema = z
	.object({
		Abbreviation: z.string().optional(),
		AreaCode: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		Locale: z.string().optional(),
		PrimaryCity: z.string().optional(),
	})
	.loose();
export type GetAreaCodeFromNumberOutput = z.infer<
	typeof GetAreaCodeFromNumberOutputSchema
>;

export const GetAreaCodeInputSchema = z
	.object({
		areacode: z.string().min(1, 'areacode is required'),
	})
	.strict();
export type GetAreaCodeInput = z.infer<typeof GetAreaCodeInputSchema>;

export const GetAreaCodeOutputSchema = z
	.object({
		Abbreviation: z.string().optional(),
		AreaCode: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		Locale: z.string().optional(),
		PrimaryCity: z.string().optional(),
	})
	.loose();
export type GetAreaCodeOutput = z.infer<typeof GetAreaCodeOutputSchema>;

export const GetZipCodeInfoInputSchema = z
	.object({
		zip: z.string().min(1, 'zip is required'),
	})
	.strict();
export type GetZipCodeInfoInput = z.infer<typeof GetZipCodeInfoInputSchema>;

export const GetZipCodeInfoOutputSchema = z
	.object({
		AreaSquareMiles: z.string().optional(),
		City: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		ElderlyHouseholdPercent: z.string().optional(),
		FarmerHouseholdPercent: z.string().optional(),
		IncomePercent100k: z.string().optional(),
		IncomePercent200k: z.string().optional(),
		IncomePercent50k: z.string().optional(),
		Latitude: z.string().optional(),
		Longitude: z.string().optional(),
		MarriedHouseholdPercent: z.string().optional(),
		Population: z.string().optional(),
		State: z.string().optional(),
		ZipCode: z.string().optional(),
	})
	.loose();
export type GetZipCodeInfoOutput = z.infer<typeof GetZipCodeInfoOutputSchema>;

export const AddressParseInputSchema = z
	.object({
		address: z.string().min(1, 'address is required'),
	})
	.strict();
export type AddressParseInput = z.infer<typeof AddressParseInputSchema>;

export const AddressParseOutputSchema = z
	.object({
		StreetNumber: z.string().optional(),
		PreDirection: z.string().optional(),
		StreetName: z.string().optional(),
		StreetSuffix: z.string().optional(),
		PostDirection: z.string().optional(),
		UnitType: z.string().optional(),
		UnitNumber: z.string().optional(),
		City: z.string().optional(),
		StateProvince: z.string().optional(),
		PostalCode: z.string().optional(),
		Country: z.string().optional(),
		Special: z.string().optional(),
		BuildingName: z.string().optional(),
		Organization: z.string().optional(),
		AdditionalInformation: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type AddressParseOutput = z.infer<typeof AddressParseOutputSchema>;

export const GetEntityTypeInputSchema = z
	.object({
		text: z.string().min(1, 'text is required'),
	})
	.strict();
export type GetEntityTypeInput = z.infer<typeof GetEntityTypeInputSchema>;

export const GetEntityTypeOutputSchema = z
	.object({
		Result: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetEntityTypeOutput = z.infer<typeof GetEntityTypeOutputSchema>;

export const GetGenderInputSchema = z
	.object({
		name: z.string().min(1, 'name is required'),
	})
	.strict();
export type GetGenderInput = z.infer<typeof GetGenderInputSchema>;

export const GetGenderOutputSchema = z
	.object({
		Gender: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGenderOutput = z.infer<typeof GetGenderOutputSchema>;

export const GetNameOriginInputSchema = z
	.object({
		name: z.string().min(1, 'name is required'),
	})
	.strict();
export type GetNameOriginInput = z.infer<typeof GetNameOriginInputSchema>;

export const GetNameOriginOutputSchema = z
	.object({
		Origin: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetNameOriginOutput = z.infer<typeof GetNameOriginOutputSchema>;

export const IdentifyLanguageInputSchema = z
	.object({
		text: z.string().min(1, 'text is required'),
	})
	.strict();
export type IdentifyLanguageInput = z.infer<typeof IdentifyLanguageInputSchema>;

export const IdentifyLanguageOutputSchema = z
	.object({
		Language: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type IdentifyLanguageOutput = z.infer<
	typeof IdentifyLanguageOutputSchema
>;

export const TranslateToEnglishInputSchema = z
	.object({
		text: z.string().min(1, 'text is required'),
	})
	.strict();
export type TranslateToEnglishInput = z.infer<
	typeof TranslateToEnglishInputSchema
>;

export const TranslateToEnglishOutputSchema = z
	.object({
		Result: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type TranslateToEnglishOutput = z.infer<
	typeof TranslateToEnglishOutputSchema
>;

export const TranslateToAnyInputSchema = z
	.object({
		text: z.string().min(1, 'text is required'),
		to: z.string().min(1, 'to is required'),
	})
	.strict();
export type TranslateToAnyInput = z.infer<typeof TranslateToAnyInputSchema>;

export const TranslateToAnyOutputSchema = z
	.object({
		Result: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type TranslateToAnyOutput = z.infer<typeof TranslateToAnyOutputSchema>;

export const GetGlobalLatencyInputSchema = z
	.object({
		origin: z.string().min(1, 'origin is required'),
		url: z.string().min(1, 'url is required'),
	})
	.strict();
export type GetGlobalLatencyInput = z.infer<typeof GetGlobalLatencyInputSchema>;

export const GetGlobalLatencyOutputSchema = z
	.object({
		Origin: z.string().optional(),
		Seconds: z.string().optional(),
		PageResponseStatus: z.string().optional(),
		Contents: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGlobalLatencyOutput = z.infer<
	typeof GetGlobalLatencyOutputSchema
>;

export const GetGlobalPageLoadInputSchema = z
	.object({
		origin: z.string().min(1, 'origin is required'),
		url: z.string().min(1, 'url is required'),
	})
	.strict();
export type GetGlobalPageLoadInput = z.infer<
	typeof GetGlobalPageLoadInputSchema
>;

export const GetGlobalPageLoadOutputSchema = z
	.object({
		Origin: z.string().optional(),
		Seconds: z.string().optional(),
		PageResponseStatus: z.string().optional(),
		Contents: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGlobalPageLoadOutput = z.infer<
	typeof GetGlobalPageLoadOutputSchema
>;

export const GetCurrencyRateInputSchema = z
	.object({
		symbol: z.string().min(1, 'symbol is required'),
	})
	.strict();
export type GetCurrencyRateInput = z.infer<typeof GetCurrencyRateInputSchema>;

export const GetCurrencyRateOutputSchema = z
	.object({
		Symbol: z.string().optional(),
		Name: z.string().optional(),
		Country: z.string().optional(),
		Rate: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetCurrencyRateOutput = z.infer<typeof GetCurrencyRateOutputSchema>;

export const ConvertCurrencyInputSchema = z
	.object({
		from: z.string().min(1, 'from is required'),
		to: z.string().min(1, 'to is required'),
		amount: z.string().min(1, 'amount is required'),
	})
	.strict();
export type ConvertCurrencyInput = z.infer<typeof ConvertCurrencyInputSchema>;

export const ConvertCurrencyOutputSchema = z
	.object({
		Code: z.string().optional(),
		Converted: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		Currency: z.string().optional(),
	})
	.loose();
export type ConvertCurrencyOutput = z.infer<typeof ConvertCurrencyOutputSchema>;

export const GetWeatherZipCodeInputSchema = z
	.object({
		zip: z.string().min(1, 'zip is required'),
	})
	.strict();
export type GetWeatherZipCodeInput = z.infer<
	typeof GetWeatherZipCodeInputSchema
>;

export const GetWeatherZipCodeOutputSchema = z
	.object({
		City: z.string().optional(),
		State: z.string().optional(),
		TempF: z.string().optional(),
		TempC: z.string().optional(),
		Weather: z.string().optional(),
		WindMPH: z.string().optional(),
		WindDir: z.string().optional(),
		RelativeHumidity: z.string().optional(),
		VisibilityMiles: z.string().optional(),
		PrecipitationLastHour: z.string().optional(),
		WindChill: z.string().optional(),
		HeatIndex: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetWeatherZipCodeOutput = z.infer<
	typeof GetWeatherZipCodeOutputSchema
>;

export const GetGlobalWeatherInputSchema = z
	.object({
		location: z.string().min(1, 'location is required'),
	})
	.strict();
export type GetGlobalWeatherInput = z.infer<typeof GetGlobalWeatherInputSchema>;

export const GetGlobalWeatherOutputSchema = z
	.object({
		TempF: z.string().optional(),
		TempC: z.string().optional(),
		Weather: z.string().optional(),
		WindSpeed: z.string().optional(),
		WindDir: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetGlobalWeatherOutput = z.infer<
	typeof GetGlobalWeatherOutputSchema
>;

export const GetGlobalTimeInputSchema = z
	.object({
		locale: z.string().min(1, 'locale is required'),
	})
	.strict();
export type GetGlobalTimeInput = z.infer<typeof GetGlobalTimeInputSchema>;

export const GetGlobalTimeOutputSchema = z
	.object({
		ClockTime: z.string().optional(),
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
		CurrentDate: z.string().optional(),
		CurrentTime: z.string().optional(),
		Day: z.string().optional(),
		Hour: z.string().optional(),
		Locale: z.string().optional(),
		Minute: z.string().optional(),
		Month: z.string().optional(),
		MonthNumber: z.string().optional(),
		Second: z.string().optional(),
		TimeStamp: z.string().optional(),
		Weekday: z.string().optional(),
		Year: z.string().optional(),
		Zone: z.string().optional(),
	})
	.loose();
export type GetGlobalTimeOutput = z.infer<typeof GetGlobalTimeOutputSchema>;

export const GetRemainingCreditsInputSchema = z.object({}).strict();
export type GetRemainingCreditsInput = z.infer<
	typeof GetRemainingCreditsInputSchema
>;

export const GetRemainingCreditsOutputSchema = z
	.object({
		Code: z.string().optional(),
		Credits: InterzoidCreditsSchema.optional(),
	})
	.loose();
export type GetRemainingCreditsOutput = z.infer<
	typeof GetRemainingCreditsOutputSchema
>;

export const InterzoidEndpointInputSchemas = {
	getCompanyMatchAdvanced: GetCompanyMatchAdvancedInputSchema,
	getFullNameMatch: GetFullNameMatchInputSchema,
	getAddressMatchAdvanced: GetAddressMatchAdvancedInputSchema,
	getAddressAndFullNameMatch: GetAddressAndFullNameMatchInputSchema,
	getCompanyAndAddressMatch: GetCompanyAndAddressMatchInputSchema,
	getCompanyAndFullNameMatch: GetCompanyAndFullNameMatchInputSchema,
	getGlobalAddressMatch: GetGlobalAddressMatchInputSchema,
	getProductMatch: GetProductMatchInputSchema,
	getOrgMatchScore: GetOrgMatchScoreInputSchema,
	getFullNameMatchScore: GetFullNameMatchScoreInputSchema,
	getCompanyMatch: GetCompanyMatchInputSchema,
	getAddressMatch: GetAddressMatchInputSchema,
	getFullNameParsedMatch: GetFullNameParsedMatchInputSchema,
	getCityMatch: GetCityMatchInputSchema,
	getCountryMatch: GetCountryMatchInputSchema,
	getOrgStandard: GetOrgStandardInputSchema,
	getCountryStandard: GetCountryStandardInputSchema,
	getCountryInfo: GetCountryInfoInputSchema,
	getStateAbbreviation: GetStateAbbreviationInputSchema,
	getCityStandard: GetCityStandardInputSchema,
	getOfficialName: GetOfficialNameInputSchema,
	getBusinessInfo: GetBusinessInfoInputSchema,
	getParentCompanyInfo: GetParentCompanyInfoInputSchema,
	getExecutiveProfile: GetExecutiveProfileInputSchema,
	getBusinessInfoDomain: GetBusinessInfoDomainInputSchema,
	getBusinessInfoName: GetBusinessInfoNameInputSchema,
	getCompanyVerification: GetCompanyVerificationInputSchema,
	getStockInfo: GetStockInfoInputSchema,
	getIndustryCodes: GetIndustryCodesInputSchema,
	getSicCodes: GetSicCodesInputSchema,
	getUniversityInfo: GetUniversityInfoInputSchema,
	getProductRecallInfo: GetProductRecallInfoInputSchema,
	getTechStack: GetTechStackInputSchema,
	getCompetitorAnalysis: GetCompetitorAnalysisInputSchema,
	getBuyingSignals: GetBuyingSignalsInputSchema,
	getPrivateCompanyDealIntel: GetPrivateCompanyDealIntelInputSchema,
	getNearestCoffeeShops: GetNearestCoffeeShopsInputSchema,
	getUserXHandle: GetUserXHandleInputSchema,
	getXUserProfile: GetXUserProfileInputSchema,
	getXLast3: GetXLast3InputSchema,
	getEsgProfile: GetEsgProfileInputSchema,
	getGovContracts: GetGovContractsInputSchema,
	getFacilitiesProfile: GetFacilitiesProfileInputSchema,
	getBuildingProfile: GetBuildingProfileInputSchema,
	getPropertyHistory: GetPropertyHistoryInputSchema,
	getSalesUseTaxRates: GetSalesUseTaxRatesInputSchema,
	getIrsPerDiemRates: GetIrsPerDiemRatesInputSchema,
	getEuVatRates: GetEuVatRatesInputSchema,
	getCustomsDutyRates: GetCustomsDutyRatesInputSchema,
	getMuniIssuerProfile: GetMuniIssuerProfileInputSchema,
	getCustomData: GetCustomDataInputSchema,
	getEmailInfo: GetEmailInfoInputSchema,
	getEmailTrustScore: GetEmailTrustScoreInputSchema,
	getEmailDomainType: GetEmailDomainTypeInputSchema,
	getIpProfile: GetIpProfileInputSchema,
	getPhoneProfile: GetPhoneProfileInputSchema,
	getGlobalNumberInfo: GetGlobalNumberInfoInputSchema,
	getAreaCodeFromNumber: GetAreaCodeFromNumberInputSchema,
	getAreaCode: GetAreaCodeInputSchema,
	getZipCodeInfo: GetZipCodeInfoInputSchema,
	addressParse: AddressParseInputSchema,
	getEntityType: GetEntityTypeInputSchema,
	getGender: GetGenderInputSchema,
	getNameOrigin: GetNameOriginInputSchema,
	identifyLanguage: IdentifyLanguageInputSchema,
	translateToEnglish: TranslateToEnglishInputSchema,
	translateToAny: TranslateToAnyInputSchema,
	getGlobalLatency: GetGlobalLatencyInputSchema,
	getGlobalPageLoad: GetGlobalPageLoadInputSchema,
	getCurrencyRate: GetCurrencyRateInputSchema,
	convertCurrency: ConvertCurrencyInputSchema,
	getWeatherZipCode: GetWeatherZipCodeInputSchema,
	getGlobalWeather: GetGlobalWeatherInputSchema,
	getGlobalTime: GetGlobalTimeInputSchema,
	getRemainingCredits: GetRemainingCreditsInputSchema,
} as const;

export const InterzoidEndpointOutputSchemas = {
	getCompanyMatchAdvanced: GetCompanyMatchAdvancedOutputSchema,
	getFullNameMatch: GetFullNameMatchOutputSchema,
	getAddressMatchAdvanced: GetAddressMatchAdvancedOutputSchema,
	getAddressAndFullNameMatch: GetAddressAndFullNameMatchOutputSchema,
	getCompanyAndAddressMatch: GetCompanyAndAddressMatchOutputSchema,
	getCompanyAndFullNameMatch: GetCompanyAndFullNameMatchOutputSchema,
	getGlobalAddressMatch: GetGlobalAddressMatchOutputSchema,
	getProductMatch: GetProductMatchOutputSchema,
	getOrgMatchScore: GetOrgMatchScoreOutputSchema,
	getFullNameMatchScore: GetFullNameMatchScoreOutputSchema,
	getCompanyMatch: GetCompanyMatchOutputSchema,
	getAddressMatch: GetAddressMatchOutputSchema,
	getFullNameParsedMatch: GetFullNameParsedMatchOutputSchema,
	getCityMatch: GetCityMatchOutputSchema,
	getCountryMatch: GetCountryMatchOutputSchema,
	getOrgStandard: GetOrgStandardOutputSchema,
	getCountryStandard: GetCountryStandardOutputSchema,
	getCountryInfo: GetCountryInfoOutputSchema,
	getStateAbbreviation: GetStateAbbreviationOutputSchema,
	getCityStandard: GetCityStandardOutputSchema,
	getOfficialName: GetOfficialNameOutputSchema,
	getBusinessInfo: GetBusinessInfoOutputSchema,
	getParentCompanyInfo: GetParentCompanyInfoOutputSchema,
	getExecutiveProfile: GetExecutiveProfileOutputSchema,
	getBusinessInfoDomain: GetBusinessInfoDomainOutputSchema,
	getBusinessInfoName: GetBusinessInfoNameOutputSchema,
	getCompanyVerification: GetCompanyVerificationOutputSchema,
	getStockInfo: GetStockInfoOutputSchema,
	getIndustryCodes: GetIndustryCodesOutputSchema,
	getSicCodes: GetSicCodesOutputSchema,
	getUniversityInfo: GetUniversityInfoOutputSchema,
	getProductRecallInfo: GetProductRecallInfoOutputSchema,
	getTechStack: GetTechStackOutputSchema,
	getCompetitorAnalysis: GetCompetitorAnalysisOutputSchema,
	getBuyingSignals: GetBuyingSignalsOutputSchema,
	getPrivateCompanyDealIntel: GetPrivateCompanyDealIntelOutputSchema,
	getNearestCoffeeShops: GetNearestCoffeeShopsOutputSchema,
	getUserXHandle: GetUserXHandleOutputSchema,
	getXUserProfile: GetXUserProfileOutputSchema,
	getXLast3: GetXLast3OutputSchema,
	getEsgProfile: GetEsgProfileOutputSchema,
	getGovContracts: GetGovContractsOutputSchema,
	getFacilitiesProfile: GetFacilitiesProfileOutputSchema,
	getBuildingProfile: GetBuildingProfileOutputSchema,
	getPropertyHistory: GetPropertyHistoryOutputSchema,
	getSalesUseTaxRates: GetSalesUseTaxRatesOutputSchema,
	getIrsPerDiemRates: GetIrsPerDiemRatesOutputSchema,
	getEuVatRates: GetEuVatRatesOutputSchema,
	getCustomsDutyRates: GetCustomsDutyRatesOutputSchema,
	getMuniIssuerProfile: GetMuniIssuerProfileOutputSchema,
	getCustomData: GetCustomDataOutputSchema,
	getEmailInfo: GetEmailInfoOutputSchema,
	getEmailTrustScore: GetEmailTrustScoreOutputSchema,
	getEmailDomainType: GetEmailDomainTypeOutputSchema,
	getIpProfile: GetIpProfileOutputSchema,
	getPhoneProfile: GetPhoneProfileOutputSchema,
	getGlobalNumberInfo: GetGlobalNumberInfoOutputSchema,
	getAreaCodeFromNumber: GetAreaCodeFromNumberOutputSchema,
	getAreaCode: GetAreaCodeOutputSchema,
	getZipCodeInfo: GetZipCodeInfoOutputSchema,
	addressParse: AddressParseOutputSchema,
	getEntityType: GetEntityTypeOutputSchema,
	getGender: GetGenderOutputSchema,
	getNameOrigin: GetNameOriginOutputSchema,
	identifyLanguage: IdentifyLanguageOutputSchema,
	translateToEnglish: TranslateToEnglishOutputSchema,
	translateToAny: TranslateToAnyOutputSchema,
	getGlobalLatency: GetGlobalLatencyOutputSchema,
	getGlobalPageLoad: GetGlobalPageLoadOutputSchema,
	getCurrencyRate: GetCurrencyRateOutputSchema,
	convertCurrency: ConvertCurrencyOutputSchema,
	getWeatherZipCode: GetWeatherZipCodeOutputSchema,
	getGlobalWeather: GetGlobalWeatherOutputSchema,
	getGlobalTime: GetGlobalTimeOutputSchema,
	getRemainingCredits: GetRemainingCreditsOutputSchema,
} as const;

export type InterzoidEndpointInputs = {
	getCompanyMatchAdvanced: GetCompanyMatchAdvancedInput;
	getFullNameMatch: GetFullNameMatchInput;
	getAddressMatchAdvanced: GetAddressMatchAdvancedInput;
	getAddressAndFullNameMatch: GetAddressAndFullNameMatchInput;
	getCompanyAndAddressMatch: GetCompanyAndAddressMatchInput;
	getCompanyAndFullNameMatch: GetCompanyAndFullNameMatchInput;
	getGlobalAddressMatch: GetGlobalAddressMatchInput;
	getProductMatch: GetProductMatchInput;
	getOrgMatchScore: GetOrgMatchScoreInput;
	getFullNameMatchScore: GetFullNameMatchScoreInput;
	getCompanyMatch: GetCompanyMatchInput;
	getAddressMatch: GetAddressMatchInput;
	getFullNameParsedMatch: GetFullNameParsedMatchInput;
	getCityMatch: GetCityMatchInput;
	getCountryMatch: GetCountryMatchInput;
	getOrgStandard: GetOrgStandardInput;
	getCountryStandard: GetCountryStandardInput;
	getCountryInfo: GetCountryInfoInput;
	getStateAbbreviation: GetStateAbbreviationInput;
	getCityStandard: GetCityStandardInput;
	getOfficialName: GetOfficialNameInput;
	getBusinessInfo: GetBusinessInfoInput;
	getParentCompanyInfo: GetParentCompanyInfoInput;
	getExecutiveProfile: GetExecutiveProfileInput;
	getBusinessInfoDomain: GetBusinessInfoDomainInput;
	getBusinessInfoName: GetBusinessInfoNameInput;
	getCompanyVerification: GetCompanyVerificationInput;
	getStockInfo: GetStockInfoInput;
	getIndustryCodes: GetIndustryCodesInput;
	getSicCodes: GetSicCodesInput;
	getUniversityInfo: GetUniversityInfoInput;
	getProductRecallInfo: GetProductRecallInfoInput;
	getTechStack: GetTechStackInput;
	getCompetitorAnalysis: GetCompetitorAnalysisInput;
	getBuyingSignals: GetBuyingSignalsInput;
	getPrivateCompanyDealIntel: GetPrivateCompanyDealIntelInput;
	getNearestCoffeeShops: GetNearestCoffeeShopsInput;
	getUserXHandle: GetUserXHandleInput;
	getXUserProfile: GetXUserProfileInput;
	getXLast3: GetXLast3Input;
	getEsgProfile: GetEsgProfileInput;
	getGovContracts: GetGovContractsInput;
	getFacilitiesProfile: GetFacilitiesProfileInput;
	getBuildingProfile: GetBuildingProfileInput;
	getPropertyHistory: GetPropertyHistoryInput;
	getSalesUseTaxRates: GetSalesUseTaxRatesInput;
	getIrsPerDiemRates: GetIrsPerDiemRatesInput;
	getEuVatRates: GetEuVatRatesInput;
	getCustomsDutyRates: GetCustomsDutyRatesInput;
	getMuniIssuerProfile: GetMuniIssuerProfileInput;
	getCustomData: GetCustomDataInput;
	getEmailInfo: GetEmailInfoInput;
	getEmailTrustScore: GetEmailTrustScoreInput;
	getEmailDomainType: GetEmailDomainTypeInput;
	getIpProfile: GetIpProfileInput;
	getPhoneProfile: GetPhoneProfileInput;
	getGlobalNumberInfo: GetGlobalNumberInfoInput;
	getAreaCodeFromNumber: GetAreaCodeFromNumberInput;
	getAreaCode: GetAreaCodeInput;
	getZipCodeInfo: GetZipCodeInfoInput;
	addressParse: AddressParseInput;
	getEntityType: GetEntityTypeInput;
	getGender: GetGenderInput;
	getNameOrigin: GetNameOriginInput;
	identifyLanguage: IdentifyLanguageInput;
	translateToEnglish: TranslateToEnglishInput;
	translateToAny: TranslateToAnyInput;
	getGlobalLatency: GetGlobalLatencyInput;
	getGlobalPageLoad: GetGlobalPageLoadInput;
	getCurrencyRate: GetCurrencyRateInput;
	convertCurrency: ConvertCurrencyInput;
	getWeatherZipCode: GetWeatherZipCodeInput;
	getGlobalWeather: GetGlobalWeatherInput;
	getGlobalTime: GetGlobalTimeInput;
	getRemainingCredits: GetRemainingCreditsInput;
};

export type InterzoidEndpointOutputs = {
	getCompanyMatchAdvanced: GetCompanyMatchAdvancedOutput;
	getFullNameMatch: GetFullNameMatchOutput;
	getAddressMatchAdvanced: GetAddressMatchAdvancedOutput;
	getAddressAndFullNameMatch: GetAddressAndFullNameMatchOutput;
	getCompanyAndAddressMatch: GetCompanyAndAddressMatchOutput;
	getCompanyAndFullNameMatch: GetCompanyAndFullNameMatchOutput;
	getGlobalAddressMatch: GetGlobalAddressMatchOutput;
	getProductMatch: GetProductMatchOutput;
	getOrgMatchScore: GetOrgMatchScoreOutput;
	getFullNameMatchScore: GetFullNameMatchScoreOutput;
	getCompanyMatch: GetCompanyMatchOutput;
	getAddressMatch: GetAddressMatchOutput;
	getFullNameParsedMatch: GetFullNameParsedMatchOutput;
	getCityMatch: GetCityMatchOutput;
	getCountryMatch: GetCountryMatchOutput;
	getOrgStandard: GetOrgStandardOutput;
	getCountryStandard: GetCountryStandardOutput;
	getCountryInfo: GetCountryInfoOutput;
	getStateAbbreviation: GetStateAbbreviationOutput;
	getCityStandard: GetCityStandardOutput;
	getOfficialName: GetOfficialNameOutput;
	getBusinessInfo: GetBusinessInfoOutput;
	getParentCompanyInfo: GetParentCompanyInfoOutput;
	getExecutiveProfile: GetExecutiveProfileOutput;
	getBusinessInfoDomain: GetBusinessInfoDomainOutput;
	getBusinessInfoName: GetBusinessInfoNameOutput;
	getCompanyVerification: GetCompanyVerificationOutput;
	getStockInfo: GetStockInfoOutput;
	getIndustryCodes: GetIndustryCodesOutput;
	getSicCodes: GetSicCodesOutput;
	getUniversityInfo: GetUniversityInfoOutput;
	getProductRecallInfo: GetProductRecallInfoOutput;
	getTechStack: GetTechStackOutput;
	getCompetitorAnalysis: GetCompetitorAnalysisOutput;
	getBuyingSignals: GetBuyingSignalsOutput;
	getPrivateCompanyDealIntel: GetPrivateCompanyDealIntelOutput;
	getNearestCoffeeShops: GetNearestCoffeeShopsOutput;
	getUserXHandle: GetUserXHandleOutput;
	getXUserProfile: GetXUserProfileOutput;
	getXLast3: GetXLast3Output;
	getEsgProfile: GetEsgProfileOutput;
	getGovContracts: GetGovContractsOutput;
	getFacilitiesProfile: GetFacilitiesProfileOutput;
	getBuildingProfile: GetBuildingProfileOutput;
	getPropertyHistory: GetPropertyHistoryOutput;
	getSalesUseTaxRates: GetSalesUseTaxRatesOutput;
	getIrsPerDiemRates: GetIrsPerDiemRatesOutput;
	getEuVatRates: GetEuVatRatesOutput;
	getCustomsDutyRates: GetCustomsDutyRatesOutput;
	getMuniIssuerProfile: GetMuniIssuerProfileOutput;
	getCustomData: GetCustomDataOutput;
	getEmailInfo: GetEmailInfoOutput;
	getEmailTrustScore: GetEmailTrustScoreOutput;
	getEmailDomainType: GetEmailDomainTypeOutput;
	getIpProfile: GetIpProfileOutput;
	getPhoneProfile: GetPhoneProfileOutput;
	getGlobalNumberInfo: GetGlobalNumberInfoOutput;
	getAreaCodeFromNumber: GetAreaCodeFromNumberOutput;
	getAreaCode: GetAreaCodeOutput;
	getZipCodeInfo: GetZipCodeInfoOutput;
	addressParse: AddressParseOutput;
	getEntityType: GetEntityTypeOutput;
	getGender: GetGenderOutput;
	getNameOrigin: GetNameOriginOutput;
	identifyLanguage: IdentifyLanguageOutput;
	translateToEnglish: TranslateToEnglishOutput;
	translateToAny: TranslateToAnyOutput;
	getGlobalLatency: GetGlobalLatencyOutput;
	getGlobalPageLoad: GetGlobalPageLoadOutput;
	getCurrencyRate: GetCurrencyRateOutput;
	convertCurrency: ConvertCurrencyOutput;
	getWeatherZipCode: GetWeatherZipCodeOutput;
	getGlobalWeather: GetGlobalWeatherOutput;
	getGlobalTime: GetGlobalTimeOutput;
	getRemainingCredits: GetRemainingCreditsOutput;
};
