import { z } from 'zod';

const CodeLabel = z.object({
	code: z.string(),
	label: z.string(),
});

const CodeName = z.object({
	code: z.string(),
	name: z.string(),
});

const Sources = z.array(z.string());

const PartialDate = z.object({
	year: z.number(),
	month: z.number().optional(),
	day: z.number().optional(),
});

const CompanyRef = z.object({
	uuid: z.string().optional(),
	name: z.string(),
	website: z.string().optional(),
});

const NewsRef = z.object({
	publisher: z.string().optional(),
	title: z.string().optional(),
	url: z.string(),
});

const SourcedDetail = z.object({
	headline: z.string().optional(),
	details: z.string().optional(),
	source: Sources.optional(),
});

const SourcedTypedItem = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	source: Sources.optional(),
	type: CodeLabel.optional(),
});

const CompanyStatus = z.enum([
	'public',
	'private',
	'acquired',
	'delisted',
	'unknown',
]);

export const EnrichmentSection = z.enum([
	'firmographic',
	'business_model',
	'company_assessment',
	'trust_signal',
	'company_hierarchy',
	'digital_presence',
	'financial_estimate',
	'location',
	'management_profile',
	'product_offering',
	'strategic_signal',
	'customer_profile',
	'industry',
	'technology',
	'funding_detail',
	'mna_and_investment',
]);

export type EnrichmentSection = z.infer<typeof EnrichmentSection>;

// Source: https://docs.akta.pro/api-reference/supporting-apis/company-search
export const CompanySearchResultSchema = z.object({
	uuid: z.string(),
	name: z.string(),
	website: z.string().optional(),
	product_category: z.string().optional(),
	company_status: CompanyStatus.optional(),
	parent_company: z.object({ uuid: z.string(), name: z.string() }).optional(),
	akta_rank: z.number().optional(),
});

export type CompanySearchResult = z.infer<typeof CompanySearchResultSchema>;

// Source: https://docs.akta.pro/api-reference/company-data
const FirmographicSection = z.object({
	name: z.string().optional(),
	legal_name: z.string().optional(),
	website: z.string().optional(),
	company_type: CodeLabel.optional(),
	founded_year: z.number().optional(),
	company_description: z.string().optional(),
	company_description_short: z.string().optional(),
	operating_status: CodeLabel.optional(),
	ownership_category: CodeLabel.optional(),
	headcount_range: z.string().optional(),
	logo_url: z.string().optional(),
	akta_rank: z.number().optional(),
});

const BusinessModelSection = z.object({
	gtm_motion: z.array(SourcedTypedItem).optional(),
	revenue_model: z.array(SourcedTypedItem).optional(),
	marketing_channels: z
		.array(SourcedTypedItem.extend({ stage: CodeLabel.optional() }))
		.optional(),
	distribution_channels: z
		.array(
			SourcedTypedItem.extend({
				scope: z.string().optional(),
				target_buyer: CodeLabel.optional(),
			}),
		)
		.optional(),
	cost_components: z.array(z.string()).optional(),
	pricing_details: z
		.array(
			z.object({
				description: z.string().optional(),
				notes: z.string().optional(),
				model: CodeLabel.optional(),
				billing_cadence: CodeLabel.optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
	gtm_type: CodeLabel.optional(),
	offering_type: CodeLabel.optional(),
});

const CompanyAssessmentSection = z.object({
	market_position: z.string().optional(),
	strengths: z.array(SourcedDetail).optional(),
	weakness: z.array(SourcedDetail).optional(),
	competitive_moat: z
		.array(
			z.object({ details: z.string().optional(), type: CodeLabel.optional() }),
		)
		.optional(),
	key_risks: z.array(SourcedDetail).optional(),
	key_highlights: z.array(SourcedDetail).optional(),
	customer_concentration: z
		.object({
			details: z.string().optional(),
			classification: CodeLabel.optional(),
		})
		.optional(),
	peers: z
		.array(
			z.object({
				uuid: z.string().optional(),
				name: z.string(),
				description: z.string().optional(),
				type: CodeLabel.optional(),
			}),
		)
		.optional(),
});

const TrustSignalSection = z.object({
	compliance: z
		.array(
			z.object({
				class: CodeLabel.optional(),
				name: CodeLabel.optional(),
				description: z.string().optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
	regulatory_updates: z
		.array(
			z.object({
				title: z.string().optional(),
				type: z.string().optional(),
				description: z.string().optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
	awards: z
		.array(SourcedTypedItem.extend({ body: z.string().optional() }))
		.optional(),
	ip: z
		.array(SourcedTypedItem.extend({ status: CodeLabel.optional() }))
		.optional(),
});

const CompanyHierarchySection = z.object({
	subsidiaries: z
		.array(
			z.object({
				uuid: z.string().optional(),
				name: z.string(),
				business_focus: z.string().optional(),
				acquired_on: PartialDate.optional(),
				relationship_type: CodeLabel.optional(),
				type: CodeLabel.optional(),
			}),
		)
		.optional(),
});

const DigitalPresenceSection = z.object({
	social_media_profiles: z
		.array(z.object({ platform: z.string(), url: z.string() }))
		.optional(),
});

const FinancialEstimateSection = z.object({
	revenue_estimate: CodeLabel.optional(),
	valuation_estimate: CodeLabel.optional(),
});

const LocationSection = z.object({
	hq: z
		.object({
			city: z.string().optional(),
			country: z.string().optional(),
			region: z.string().optional(),
		})
		.optional(),
	market_served: z.object({ is_global: z.boolean().optional() }).optional(),
	offices: z
		.array(
			z.object({
				city: z.string().optional(),
				country: z.string().optional(),
				description: z.string().optional(),
				source: Sources.optional(),
				type: CodeLabel.optional(),
			}),
		)
		.optional(),
});

const ManagementProfileSection = z.object({
	number_of_profiles: z.number().optional(),
	profiles: z
		.array(
			z.object({
				name: z.string(),
				designation: z.string().optional(),
				designation_category: CodeLabel.optional(),
				overview: z.string().optional(),
				profile_commentary: z.string().optional(),
				start_date: z.string().optional(),
				previous_companies: z.array(z.string()).optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
});

const ProductOfferingSection = z.object({
	brand: z
		.array(
			z.object({
				name: z.string(),
				description: z.string().optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
	core_offering: z.string().optional(),
	differentiator: z.string().optional(),
	functional_benefit: z.string().optional(),
	problem_solved: z.string().optional(),
	quantifiable_outcome: z.array(z.string()).optional(),
	product_overview: z.string().optional(),
	product_and_service: z
		.array(
			z.object({
				name: z.string(),
				category: z.string().optional(),
				description: z.string().optional(),
				url: z.string().optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
});

const StrategicSignalSection = z.object({
	scale_indicator: z
		.array(SourcedTypedItem.extend({ value: z.string().optional() }))
		.optional(),
	partnership: z
		.array(
			SourcedTypedItem.extend({
				uuid: z.string().optional(),
				name: z.string().optional(),
				strategic_tier: z.string().optional(),
				announced_on: PartialDate.optional(),
			}),
		)
		.optional(),
	recent_move: z
		.array(SourcedTypedItem.extend({ date: PartialDate.optional() }))
		.optional(),
	leadership_change: z.array(SourcedTypedItem).optional(),
	expansion_highlight: z.array(SourcedTypedItem).optional(),
});

const CustomerProfileSection = z.object({
	segment: z
		.array(
			SourcedTypedItem.extend({
				is_primary: z.boolean().optional(),
				pain_point_addressed: z.string().optional(),
				use_case: z.string().optional(),
			}),
		)
		.optional(),
	icp: z
		.array(
			z.object({
				profile: z.string().optional(),
				description: z.string().optional(),
				buyer_persona: z.string().optional(),
				target_buyer: z.string().optional(),
				geography: z.string().optional(),
				industry_vertical: z.string().optional(),
				primary_use_case: z.string().optional(),
				pain_points: z.array(z.string()).optional(),
				evidence_proof_points: z.array(z.string()).optional(),
				buying_structure: CodeLabel.optional(),
				firmographic_size: CodeLabel.optional(),
				purchase_trigger: CodeLabel.optional(),
				sales_cycle_length: CodeLabel.optional(),
				sales_motion: CodeLabel.optional(),
			}),
		)
		.optional(),
	select_customer: z
		.array(
			z.object({
				uuid: z.string().optional(),
				name: z.string(),
				industry: z.string().optional(),
				use_case: z.string().optional(),
				source: Sources.optional(),
				type: CodeLabel.optional(),
			}),
		)
		.optional(),
});

const IndustrySection = z.object({
	keyword: z.array(z.string()).optional(),
	industry: z
		.array(CodeLabel.extend({ is_primary: z.boolean().optional() }))
		.optional(),
	naics: z.array(CodeLabel).optional(),
	sic: z.array(CodeLabel).optional(),
	product_category: z.string().optional(),
});

const TechnologySection = z.object({
	is_technology_focussed: z.boolean().optional(),
	api_detail: z
		.object({
			has_api: z.boolean().optional(),
			has_mcp: z.boolean().optional(),
			description: z.string().optional(),
			docs_url: z.string().optional(),
		})
		.optional(),
	integration: z.array(SourcedTypedItem).optional(),
	ai_capability: z.array(SourcedTypedItem).optional(),
	ai_maturity: z
		.object({
			label: z.string(),
			scale: z.number().optional(),
			description: z.string().optional(),
		})
		.optional(),
	app_detail: z
		.object({
			has_app: z.boolean().optional(),
			app_url: z
				.array(z.object({ platform: z.string(), url: z.string() }))
				.optional(),
		})
		.optional(),
	feature: z
		.array(
			z.object({
				title: z.string().optional(),
				description: z.string().optional(),
				differentiator: CodeLabel.optional(),
				source: Sources.optional(),
			}),
		)
		.optional(),
	core_technology: z.string().optional(),
});

const FundingDetailSection = z.object({
	funding_overview: z
		.object({
			funding_stage: CodeLabel.optional(),
			last_funding_date: PartialDate.optional(),
			total_funding_usd: z.number().optional(),
		})
		.optional(),
	funding_rounds: z
		.array(
			z.object({
				id: z.number(),
				round: CodeLabel.optional(),
				date: PartialDate.optional(),
				amount_usd: z.number().optional(),
				pre_money_valuation: z.number().optional(),
				total_investors: z.number().optional(),
				investors: z
					.array(
						z.object({
							uuid: z.string().optional(),
							name: z.string(),
							lead_investor: z.boolean().optional(),
							type: CodeLabel.optional(),
						}),
					)
					.optional(),
				news: z.array(NewsRef).optional(),
			}),
		)
		.optional(),
	investors: z
		.array(
			z.object({
				uuid: z.string().optional(),
				name: z.string(),
				website: z.string().optional(),
				date_of_entry: PartialDate.optional(),
				rounds_participated: z.array(CodeLabel).optional(),
				type: CodeLabel.optional(),
			}),
		)
		.optional(),
});

const MnaAndInvestmentSection = z.object({
	mna: z
		.array(
			z.object({
				id: z.number(),
				acquiree: CompanyRef,
				acquisition_type: CodeLabel.optional(),
				announced_date: PartialDate.optional(),
				status: z.string().optional(),
				amount_usd: z.number().optional(),
				news: z.array(NewsRef).optional(),
			}),
		)
		.optional(),
	investment: z
		.array(
			z.object({
				id: z.number(),
				funding_round_id: z.number().optional(),
				investee: CompanyRef,
				lead_investor: z.boolean().optional(),
				announced_date: PartialDate.optional(),
				round: CodeLabel.optional(),
				news: z.array(NewsRef).optional(),
			}),
		)
		.optional(),
});

export const CompanyEnrichmentSchema = z.object({
	uuid: z.string(),
	firmographic: FirmographicSection.optional(),
	business_model: BusinessModelSection.optional(),
	company_assessment: CompanyAssessmentSection.optional(),
	trust_signal: TrustSignalSection.optional(),
	company_hierarchy: CompanyHierarchySection.optional(),
	digital_presence: DigitalPresenceSection.optional(),
	financial_estimate: FinancialEstimateSection.optional(),
	location: LocationSection.optional(),
	management_profile: ManagementProfileSection.optional(),
	product_offering: ProductOfferingSection.optional(),
	strategic_signal: StrategicSignalSection.optional(),
	customer_profile: CustomerProfileSection.optional(),
	industry: IndustrySection.optional(),
	technology: TechnologySection.optional(),
	funding_detail: FundingDetailSection.optional(),
	mna_and_investment: MnaAndInvestmentSection.optional(),
});

export type CompanyEnrichment = z.infer<typeof CompanyEnrichmentSchema>;

// Source: https://docs.akta.pro/api-reference/alternative-data/employee-reviews
const EmployeeReviewSchema = z.object({
	id: z.number(),
	summary: z.string().optional(),
	pros: z.string().optional(),
	cons: z.string().optional(),
	rating: z.number().optional(),
	review_link: z.string().optional(),
	job_title: z.string().optional(),
	review_date: z.string().optional(),
	employment_status: z.string().optional(),
	is_current_employee: z.boolean().optional(),
	years_of_employment: z.number().optional(),
	location: z.string().optional(),
	country_code: z.string().optional(),
	helpful_count: z.number().optional(),
	not_helpful_count: z.number().optional(),
	career_opportunities_rating: z.number().optional(),
	ceo_rating: z.string().nullable().optional(),
	compensation_and_benefits_rating: z.number().optional(),
	culture_and_values_rating: z.number().optional(),
	diversity_and_inclusion_rating: z.number().optional(),
	senior_management_rating: z.number().optional(),
	work_life_balance_rating: z.number().optional(),
	language: z.string().optional(),
	provider: z.string().optional(),
});

const ProviderRating = z.object({
	type: z.string().optional(),
	provider: z.string().optional(),
	value: z.number(),
});

const ReviewTotals = {
	total: z.number().optional(),
	total_by_provider: z.record(z.string(), z.number()).optional(),
};

// Source: https://docs.akta.pro/api-reference/alternative-data/product-reviews
const ProductReviewSchema = z.object({
	review_id: z.number(),
	review_title: z.string().optional(),
	review_content: z.string().optional(),
	review_question_answers: z
		.array(z.object({ question: z.string(), answer: z.string() }))
		.optional(),
	review_rating: z.number().optional(),
	publish_date: z.string().optional(),
	reviewer_company_size: z.string().optional(),
	review_link: z.string().optional(),
	provider: z.string().optional(),
});

// The OpenAPI schema says strings; the response example returns { text, count }.
const ProsConsItem = z.union([
	z.string(),
	z.object({
		text: z.string(),
		count: z.union([z.string(), z.number()]).optional(),
	}),
]);

const ProductSchema = z.object({
	id: z.string(),
	product_name: z.string(),
	main_category: z.string().optional(),
	categories: z.array(z.string()).optional(),
	description: z.string().optional(),
	rating: z.record(z.string(), z.number()).optional(),
	star_distribution: z
		.record(z.string(), z.record(z.string(), z.number()))
		.optional(),
	pros_list: z.array(ProsConsItem).optional(),
	cons_list: z.array(ProsConsItem).optional(),
	pricing: z
		.array(
			z.object({
				package: z.string().optional(),
				price: z.string().optional(),
				price_info: z.string().optional(),
			}),
		)
		.optional(),
	reviews: z
		.object({ data: z.array(ProductReviewSchema), ...ReviewTotals })
		.optional(),
});

// Source: https://docs.akta.pro/api-reference/supporting-apis/industry-search
export const IndustryMatchSchema = z.object({
	code: z.string(),
	industry_name: z.string(),
	similarity: z.number(),
});

// Source: https://docs.akta.pro/api-reference/news-signals
export const NewsArticleSchema = z.object({
	id: z.number(),
	title: z.string(),
	url: z.string(),
	publisher: z.string().optional(),
	published_date: z.string().optional(),
	sentiment: z.string().optional(),
	sentiment_score: z.number().optional(),
	ai_summary: z.string().optional(),
	word_count: z.number().optional(),
	original_language: z.string().optional(),
	author: z.string().optional(),
	countries: z.array(z.string()).optional(),
	industries: z
		.array(CodeName.extend({ is_primary: z.boolean().optional() }))
		.optional(),
	tags: z
		.array(CodeName.extend({ is_primary: z.boolean().optional() }))
		.optional(),
	company_mentions: z
		.array(CompanyRef.extend({ is_primary: z.boolean().optional() }))
		.optional(),
	article_type: CodeLabel.optional(),
	is_press_release: z.boolean().optional(),
	is_opinion: z.boolean().optional(),
	is_breaking: z.boolean().optional(),
	iptc_codes: z.array(CodeName).optional(),
	iab_categories: z.array(CodeName).optional(),
	naics_codes: z.array(CodeName).optional(),
	sic_codes: z.array(CodeName).optional(),
	entities: z
		.object({
			person: z.array(z.string()).optional(),
			location: z.array(z.string()).optional(),
			product: z.array(z.string()).optional(),
			event: z.array(z.string()).optional(),
		})
		.optional(),
	newsworthiness_score: z.number().optional(),
	group_id: z.number().optional(),
	full_text: z.string().optional(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

const CreditsConsumed = z.number();

const Offset = z.number().int().min(0).optional();

const limitUpTo = (max: number) => z.number().int().min(1).max(max).optional();

const CompanyIdentifier = z
	.string()
	.min(1)
	.describe(
		'Company website (https://canva.com) or Akta uuid from company.search',
	);

const CompanySearchInputSchema = z.object({
	query: z.string().min(1).describe('Company name or website'),
});

const CompanyEnrichInputSchema = z.object({
	company: CompanyIdentifier,
	// The docs mark it optional, but the API answers 422 without it.
	sections: z.array(EnrichmentSection).min(1),
});

const CompanyEmployeeReviewsInputSchema = z.object({
	company: CompanyIdentifier,
	limit: limitUpTo(100),
	offset: Offset,
});

const CompanyProductReviewsInputSchema = z.object({
	company: CompanyIdentifier,
	products: z.array(z.string().min(1)).optional(),
	limit: limitUpTo(50),
	offset: Offset,
});

const IndustrySearchInputSchema = z.object({
	query: z.string().min(1),
	level: z.string().optional(),
});

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const NewsListInputSchema = z.object({
	company: z.string().min(1).optional(),
	primary_company: z.string().min(1).optional(),
	industry: z.array(z.string().min(1)).optional(),
	query: z.string().min(1).optional(),
	title: z.string().min(1).optional(),
	start_date: IsoDate.optional(),
	end_date: IsoDate.optional(),
	limit: limitUpTo(100),
	offset: Offset,
	group_articles: z.boolean().optional(),
	news_score_list: z.enum(['High', 'Medium', 'Low', 'all']).optional(),
	countries: z.array(z.string().length(3)).optional(),
	blacklisted: z.array(z.string().min(1)).optional(),
	type_list: z.array(z.string().min(1)).optional(),
	sentiment_list: z
		.array(z.enum(['positive', 'negative', 'neutral', 'all']))
		.optional(),
	entity_person_list: z.array(z.string().min(1)).optional(),
	entity_location_list: z.array(z.string().min(1)).optional(),
	entity_product_list: z.array(z.string().min(1)).optional(),
	entity_event_list: z.array(z.string().min(1)).optional(),
	naics_code_list: z.array(z.string().min(1)).optional(),
	sic_code_list: z.array(z.string().min(1)).optional(),
	iptc_code_list: z.array(z.string().min(1)).optional(),
	iab_code_list: z.array(z.string().min(1)).optional(),
});

const CompanySearchResponseSchema = z.object({
	data: z.array(CompanySearchResultSchema),
	count: z.number().optional(),
	credits_consumed: CreditsConsumed,
});

const CompanyEnrichResponseSchema = z.object({
	data: CompanyEnrichmentSchema,
	credits_consumed: CreditsConsumed,
});

const CompanyEmployeeReviewsResponseSchema = z.object({
	data: z.object({
		uuid: z.string(),
		employee_reviews: z.object({
			overall_rating: z.record(z.string(), z.number()).optional(),
			other_ratings: z.array(ProviderRating).optional(),
			reviews: z
				.object({ data: z.array(EmployeeReviewSchema), ...ReviewTotals })
				.optional(),
		}),
	}),
	limit: z.number(),
	offset: z.number(),
	credits_consumed: CreditsConsumed,
});

const CompanyProductReviewsResponseSchema = z.object({
	// The OpenAPI schema names the list product_reviews; the published example
	// returns it as product.
	data: z.object({
		uuid: z.string(),
		product_reviews: z.array(ProductSchema).optional(),
		product: z.array(ProductSchema).optional(),
	}),
	limit: z.number(),
	offset: z.number(),
	credits_consumed: CreditsConsumed,
});

const IndustrySearchResponseSchema = z.object({
	data: z.array(IndustryMatchSchema),
	count: z.number().optional(),
	credits_consumed: CreditsConsumed,
});

const NewsListResponseSchema = z.object({
	data: z.array(NewsArticleSchema),
	total: z.number(),
	count: z.number(),
	limit: z.number(),
	offset: z.number(),
	credits_consumed: CreditsConsumed,
});

export type CompanySearchInput = z.infer<typeof CompanySearchInputSchema>;
export type CompanySearchResponse = z.infer<typeof CompanySearchResponseSchema>;
export type CompanyEnrichInput = z.infer<typeof CompanyEnrichInputSchema>;
export type CompanyEnrichResponse = z.infer<typeof CompanyEnrichResponseSchema>;
export type CompanyEmployeeReviewsInput = z.infer<
	typeof CompanyEmployeeReviewsInputSchema
>;
export type CompanyEmployeeReviewsResponse = z.infer<
	typeof CompanyEmployeeReviewsResponseSchema
>;
export type CompanyProductReviewsInput = z.infer<
	typeof CompanyProductReviewsInputSchema
>;
export type CompanyProductReviewsResponse = z.infer<
	typeof CompanyProductReviewsResponseSchema
>;
export type IndustrySearchInput = z.infer<typeof IndustrySearchInputSchema>;
export type IndustrySearchResponse = z.infer<
	typeof IndustrySearchResponseSchema
>;
export type NewsListInput = z.infer<typeof NewsListInputSchema>;
export type NewsListResponse = z.infer<typeof NewsListResponseSchema>;

export type AktaEndpointInputs = {
	companySearch: CompanySearchInput;
	companyEnrich: CompanyEnrichInput;
	companyEmployeeReviews: CompanyEmployeeReviewsInput;
	companyProductReviews: CompanyProductReviewsInput;
	industrySearch: IndustrySearchInput;
	newsList: NewsListInput;
};

export type AktaEndpointOutputs = {
	companySearch: CompanySearchResponse;
	companyEnrich: CompanyEnrichResponse;
	companyEmployeeReviews: CompanyEmployeeReviewsResponse;
	companyProductReviews: CompanyProductReviewsResponse;
	industrySearch: IndustrySearchResponse;
	newsList: NewsListResponse;
};

export const AktaEndpointInputSchemas = {
	companySearch: CompanySearchInputSchema,
	companyEnrich: CompanyEnrichInputSchema,
	companyEmployeeReviews: CompanyEmployeeReviewsInputSchema,
	companyProductReviews: CompanyProductReviewsInputSchema,
	industrySearch: IndustrySearchInputSchema,
	newsList: NewsListInputSchema,
} as const;

export const AktaEndpointOutputSchemas = {
	companySearch: CompanySearchResponseSchema,
	companyEnrich: CompanyEnrichResponseSchema,
	companyEmployeeReviews: CompanyEmployeeReviewsResponseSchema,
	companyProductReviews: CompanyProductReviewsResponseSchema,
	industrySearch: IndustrySearchResponseSchema,
	newsList: NewsListResponseSchema,
} as const;
