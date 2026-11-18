import { z } from 'zod';
import {
	BuiltWithDomainCoverage,
	BuiltWithListSiteMeta,
	DomainAttributes,
	DomainMeta,
} from '../schema/database';

const Timestamp = z.union([z.string(), z.number()]);

const ApiErrorsSchema = z
	.array(z.looseObject({ Message: z.string(), Code: z.number() }))
	.optional();

const DomainApiOutputSchema = z.looseObject({
	Results: z
		.array(
			z.looseObject({
				Lookup: z.string().optional(),
				Result: z
					.looseObject({
						IsDB: z.string().optional(),
						Spend: z.number().optional(),
						SalesRevenue: z.number().optional(),
						Paths: z
							.array(
								z.looseObject({
									Domain: z.string().optional(),
									Url: z.string().optional(),
									SubDomain: z.string().optional(),
									FirstIndexed: Timestamp.optional(),
									LastIndexed: Timestamp.optional(),
									Technologies: z
										.array(
											z.looseObject({
												Name: z.string(),
												Id: z.number().optional(),
												Parent: z.string().optional(),
												Description: z.string().optional(),
												Link: z.string().optional(),
												confidence: z.number().optional(),
												IsPremium: z.string().optional(),
												Tag: z.string().optional(),
												Categories: z.array(z.string()).optional(),
												FirstDetected: Timestamp.optional(),
												LastDetected: Timestamp.optional(),
											}),
										)
										.optional(),
								}),
							)
							.optional(),
					})
					.optional(),
				Meta: DomainMeta.loose().optional(),
				Attributes: DomainAttributes.optional(),
				FirstIndexed: Timestamp.optional(),
				LastIndexed: Timestamp.optional(),
			}),
		)
		.optional(),
	Errors: ApiErrorsSchema,
});

const FreeApiOutputSchema = BuiltWithDomainCoverage.omit({ id: true }).loose();

const TrendsCoverage = z.looseObject({
	ten_k: z.number().optional(),
	hundred_k: z.number().optional(),
	milly: z.number().optional(),
	live: z.number().optional(),
	expired: z.number().optional(),
});

const DatasetsLookupOutputSchema = z.looseObject({
	Tech: z
		.looseObject({
			name: z.string(),
			description: z.string().optional(),
			link: z.string().optional(),
			icon: z.string().optional(),
			is_premium: z.string().optional(),
			tag: z.string().optional(),
			categories: z.array(z.string()).optional(),
			trends_link: z.string().optional(),
			coverage: TrendsCoverage.optional(),
		})
		.optional(),
	Errors: ApiErrorsSchema,
});

// Edgar block (US SEC 10-K filings), https://api.builtwith.com/financial-api
const EdgarSchema = z.looseObject({
	companyName: z.string().optional(),
	cik: z.union([z.string(), z.number()]).optional(),
	sic: z.union([z.string(), z.number()]).optional(),
	exchanges: z.array(z.string()).optional(),
	tickers: z.array(z.string()).optional(),
	financials: z
		.array(
			z.looseObject({
				periodStartDate: z.string().optional(),
				periodEndDate: z.string().optional(),
				revenue: z.number().optional(),
				operatingIncome: z.number().optional(),
				netIncome: z.number().optional(),
				assets: z.number().optional(),
				liabilities: z.number().optional(),
				cash: z.number().optional(),
				equity: z.number().optional(),
			}),
		)
		.optional(),
});

// Companies House block (UK filings), https://api.builtwith.com/financial-api
const CompaniesHouseSchema = z.looseObject({
	companyName: z.string().optional(),
	regNo: z.union([z.string(), z.number()]).optional(),
	accountingType: z.string().optional(),
	sic: z.union([z.string(), z.number()]).optional(),
	financials: z
		.array(
			z.looseObject({
				balanceSheetDate: z.string().optional(),
				debtors: z.number().optional(),
				fixedAssets: z.number().optional(),
				currentAssets: z.number().optional(),
				creditors: z.number().optional(),
			}),
		)
		.optional(),
});

const FinancialApiOutputSchema = z.looseObject({
	domain: z.string().optional(),
	companyName: z.string().optional(),
	employees: z.number().optional(),
	followers: z.number().optional(),
	products: z.number().optional(),
	spend: z.number().optional(),
	edgar: EdgarSchema.nullish(),
	companyhouse: CompaniesHouseSchema.nullish(),
	Errors: ApiErrorsSchema,
});

const ProductApiOutputSchema = z.looseObject({
	query: z.string().optional(),
	is_more: z.boolean().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	results: z.number().optional(),
	shop_count: z.number().optional(),
	credits: z.number().optional(),
	used: z.number().optional(),
	remaining: z.number().optional(),
	used_this_query: z.number().optional(),
	next_page: z.string().optional(),
	shops: z
		.array(
			z.looseObject({
				Domain: z.string(),
				Products: z
					.array(
						z.looseObject({
							Title: z.string(),
							Url: z.string().optional(),
							Indexed: z.string().optional(),
							FirstIndexed: z.string().optional(),
							Price: z.number().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
});

const RecommendationsApiOutputSchema = z.looseObject({
	Recommendations: z
		.array(
			z.looseObject({
				Domain: z.string(),
				Compiled: z.string().optional(),
				Recommendations: z
					.array(
						z.looseObject({
							name: z.string(),
							link: z.string().optional(),
							tag: z.string().optional(),
							categories: z.array(z.string()).optional(),
							stars: z.number().optional(),
							match: z.number().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	Errors: ApiErrorsSchema,
});

const RedirectDirection = z.array(
	z.looseObject({
		Domain: z.string(),
		FirstDetected: z.string().optional(),
		LastDetected: z.string().optional(),
	}),
);

const RedirectsApiOutputSchema = z.looseObject({
	Lookup: z.string().optional(),
	Inbound: RedirectDirection.optional(),
	Outbound: RedirectDirection.optional(),
	Errors: ApiErrorsSchema,
});

const SocialApiOutputSchema = z.looseObject({
	Socials: z
		.array(
			z.looseObject({
				Name: z.string().optional(),
				Results: z
					.array(
						z.looseObject({
							SocialUrl: z.string(),
							Domains: z
								.array(
									z.looseObject({
										Root: z.string(),
										BuiltWithRank: z.number().optional(),
									}),
								)
								.optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	Errors: ApiErrorsSchema,
});

const CreateDomainListFileInputSchema = z.object({
	domains: z.array(z.string().trim().min(1)).min(1),
	fileName: z.string().optional(),
	format: z.enum(['txt', 'zip']).optional().default('txt'),
});

const ListsApiGetListOutputSchema = z.looseObject({
	NextOffset: z.string().optional(),
	Results: z
		.array(
			z.looseObject({
				D: z.string(),
				LOS: z.array(z.string()).optional(),
				FD: z.number().optional(),
				LD: z.number().optional(),
				S: z.number().optional(),
				SKU: z.number().optional(),
				R: z.number().optional(),
				F: z.number().optional(),
				E: z.number().optional(),
				A: z.number().optional(),
				Q: z.number().optional(),
				M: z.number().optional(),
				U: z.number().optional(),
				META: BuiltWithListSiteMeta.loose().optional(),
			}),
		)
		.optional(),
	Errors: ApiErrorsSchema,
});

const McpEndpoint = z.looseObject({
	Endpoint: z.string(),
	AuthRequired: z.boolean().optional(),
	Tools: z
		.array(
			z.looseObject({ Name: z.string(), Description: z.string().optional() }),
		)
		.optional(),
});

const McpApiLookupOutputSchema = z.array(
	z.looseObject({
		Domain: z.string().optional(),
		Category: z.string().optional(),
		Description: z.string().optional(),
		Endpoints: z.array(McpEndpoint).optional(),
	}),
);

const CreateDomainListFileOutputSchema = z.object({
	fileName: z.string(),
	format: z.enum(['txt', 'zip']),
	content: z.string(),
	encoding: z.enum(['utf8', 'base64']),
	domainCount: z.number().int().nonnegative(),
	domains: z.array(z.string()),
});

const DatasetsLookupInputSchema = z.object({
	tech: z.string().min(1),
	date: z.string().optional(),
});

const DomainApiLookupInputSchema = z.object({
	lookup: z.string(),
	hidedl: z.boolean().optional(),
	hidetext: z.boolean().optional(),
	liveonly: z.boolean().optional(),
	nometa: z.boolean().optional(),
	nopii: z.boolean().optional(),
	noattr: z.boolean().optional(),
	trust: z.boolean().optional(),
	fdrange: z.string().optional(),
	ldrange: z.string().optional(),
});

const FinancialApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const FreeApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const ListsApiGetListInputSchema = z
	.object({
		tech: z.string().min(1),
		otherTechs: z.array(z.string().min(1)).max(16).optional(),
		all: z.boolean().optional(),
		country: z.string().optional(),
		meta: z.boolean().optional(),
		offset: z.string().optional(),
		since: z.string().optional(),
	})
	.refine((input) => !(input.all && input.since), {
		message: 'all cannot be combined with since',
	});

const McpApiLookupInputSchema = z
	.object({
		search: z.string().min(1).optional(),
		category: z.string().min(1).optional(),
		offset: z.number().int().nonnegative().optional(),
	})
	.refine((input) => input.search || input.category, {
		message: 'search or category is required',
	});

const ProductApiLookupInputSchema = z.object({
	query: z.string(),
	limit: z.number().int().positive().max(500).optional(),
	page: z.number().int().nonnegative().optional(),
});

const RecommendationsApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const RedirectsApiLookupInputSchema = z.object({
	lookup: z.string(),
});

const SocialApiLookupInputSchema = z.object({
	lookup: z.string(),
});

export type CreateDomainListFileInput = z.infer<
	typeof CreateDomainListFileInputSchema
>;
export type DatasetsLookupInput = z.infer<typeof DatasetsLookupInputSchema>;
export type DomainApiLookupInput = z.infer<typeof DomainApiLookupInputSchema>;
export type FinancialApiLookupInput = z.infer<
	typeof FinancialApiLookupInputSchema
>;
export type FreeApiLookupInput = z.infer<typeof FreeApiLookupInputSchema>;
export type ListsApiGetListInput = z.infer<typeof ListsApiGetListInputSchema>;
export type McpApiLookupInput = z.infer<typeof McpApiLookupInputSchema>;
export type ProductApiLookupInput = z.infer<typeof ProductApiLookupInputSchema>;
export type RecommendationsApiLookupInput = z.infer<
	typeof RecommendationsApiLookupInputSchema
>;
export type RedirectsApiLookupInput = z.infer<
	typeof RedirectsApiLookupInputSchema
>;
export type SocialApiLookupInput = z.infer<typeof SocialApiLookupInputSchema>;

export type CreateDomainListFileResponse = z.infer<
	typeof CreateDomainListFileOutputSchema
>;
export type DatasetsLookupResponse = z.infer<typeof DatasetsLookupOutputSchema>;
export type DomainApiLookupResponse = z.infer<typeof DomainApiOutputSchema>;
export type FinancialApiLookupResponse = z.infer<
	typeof FinancialApiOutputSchema
>;
export type FreeApiLookupResponse = z.infer<typeof FreeApiOutputSchema>;
export type ListsApiGetListResponse = z.infer<
	typeof ListsApiGetListOutputSchema
>;
export type McpApiLookupResponse = z.infer<typeof McpApiLookupOutputSchema>;
export type ProductApiLookupResponse = z.infer<typeof ProductApiOutputSchema>;
export type RecommendationsApiLookupResponse = z.infer<
	typeof RecommendationsApiOutputSchema
>;
export type RedirectsApiLookupResponse = z.infer<
	typeof RedirectsApiOutputSchema
>;
export type SocialApiLookupResponse = z.infer<typeof SocialApiOutputSchema>;

export type BuiltWithEndpointInputs = {
	createDomainListFile: CreateDomainListFileInput;
	datasetsLookup: DatasetsLookupInput;
	domainApiLookup: DomainApiLookupInput;
	financialApiLookup: FinancialApiLookupInput;
	freeApiLookup: FreeApiLookupInput;
	listsApiGetList: ListsApiGetListInput;
	mcpApiLookup: McpApiLookupInput;
	productApiLookup: ProductApiLookupInput;
	recommendationsApiLookup: RecommendationsApiLookupInput;
	redirectsApiLookup: RedirectsApiLookupInput;
	socialApiLookup: SocialApiLookupInput;
};

export type BuiltWithEndpointOutputs = {
	createDomainListFile: CreateDomainListFileResponse;
	datasetsLookup: DatasetsLookupResponse;
	domainApiLookup: DomainApiLookupResponse;
	financialApiLookup: FinancialApiLookupResponse;
	freeApiLookup: FreeApiLookupResponse;
	listsApiGetList: ListsApiGetListResponse;
	mcpApiLookup: McpApiLookupResponse;
	productApiLookup: ProductApiLookupResponse;
	recommendationsApiLookup: RecommendationsApiLookupResponse;
	redirectsApiLookup: RedirectsApiLookupResponse;
	socialApiLookup: SocialApiLookupResponse;
};

export const BuiltWithEndpointInputSchemas = {
	createDomainListFile: CreateDomainListFileInputSchema,
	datasetsLookup: DatasetsLookupInputSchema,
	domainApiLookup: DomainApiLookupInputSchema,
	financialApiLookup: FinancialApiLookupInputSchema,
	freeApiLookup: FreeApiLookupInputSchema,
	listsApiGetList: ListsApiGetListInputSchema,
	mcpApiLookup: McpApiLookupInputSchema,
	productApiLookup: ProductApiLookupInputSchema,
	recommendationsApiLookup: RecommendationsApiLookupInputSchema,
	redirectsApiLookup: RedirectsApiLookupInputSchema,
	socialApiLookup: SocialApiLookupInputSchema,
} as const;

export const BuiltWithEndpointOutputSchemas = {
	createDomainListFile: CreateDomainListFileOutputSchema,
	datasetsLookup: DatasetsLookupOutputSchema,
	domainApiLookup: DomainApiOutputSchema,
	financialApiLookup: FinancialApiOutputSchema,
	freeApiLookup: FreeApiOutputSchema,
	listsApiGetList: ListsApiGetListOutputSchema,
	mcpApiLookup: McpApiLookupOutputSchema,
	productApiLookup: ProductApiOutputSchema,
	recommendationsApiLookup: RecommendationsApiOutputSchema,
	redirectsApiLookup: RedirectsApiOutputSchema,
	socialApiLookup: SocialApiOutputSchema,
} as const;
