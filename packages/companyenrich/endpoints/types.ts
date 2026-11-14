import { z } from 'zod';

// Every schema below mirrors the CompanyEnrich v2 OpenAPI document that is
// published alongside each reference page, for example
// https://docs.companyenrich.com/reference/get_v2-companies-enrich.md
// (info.version "2.0.0", servers ["https://api.companyenrich.com"]).
//
// Inputs accept exactly the documented fields, so a caller never has to write
// the wire filter syntax by hand. Output objects stay loose for forward
// compatibility while retaining the required and nullable fields in the v2
// OpenAPI schemas.

// ── Shared enums ────────────────────────────────────────────────────────────

const CompanyIdSchema = z.string().uuid();

/** Company expansion flags accepted by `expand` on company reads. */
export const CompanyExpandSchema = z.enum([
	'financial',
	'keywords',
	'naicsCodes',
	'technologies',
	'workforce',
]);

export type CompanyExpand = z.infer<typeof CompanyExpandSchema>;

/** Person expansion flags accepted by `expand` on person reads. */
export const PersonExpandSchema = z.enum(['education', 'company']);

export type PersonExpand = z.infer<typeof PersonExpandSchema>;

const CompanyTypeSchema = z.enum([
	'private',
	'public',
	'self-employed',
	'self-owned',
	'partnership',
	'nonprofit',
	'educational',
	'government',
]);

const CompanyEmployeesSchema = z.enum([
	'1-10',
	'11-50',
	'51-200',
	'201-500',
	'501-1K',
	'1K-5K',
	'5K-10K',
	'over-10K',
]);

const CompanyRevenueSchema = z.enum([
	'under-1m',
	'1m-10m',
	'10m-50m',
	'50m-100m',
	'100m-200m',
	'200m-1b',
	'over-1b',
]);

const CompanyCategorySchema = z.enum([
	'b2b',
	'b2c',
	'b2g',
	'e-commerce',
	'media',
	'service-provider',
	'mobile',
	'saas',
	'local-business',
]);

const CompanyFundingRoundSchema = z.enum([
	'seed',
	'debt_financing',
	'angel',
	'venture',
	'series_a',
	'series_b',
	'series_c',
	'series_d',
	'series_e',
	'series_f',
	'series_g',
	'series_h',
	'other',
]);

const CompanyRequiredFeatureSchema = z.enum([
	'linkedin',
	'twitter',
	'facebook',
	'instagram',
	'angellist',
	'crunchbase',
	'youtube',
	'country',
	'city',
	'state',
	'revenue',
	'foundedYear',
	'anyFunding',
]);

const PersonSenioritySchema = z.enum([
	'owner',
	'founder',
	'c-suite',
	'partner',
	'vp',
	'head',
	'director',
	'manager',
	'senior',
	'entry',
	'intern',
]);

/**
 * The documented department vocabulary: a top-level department plus its
 * sub-departments, exactly as listed by `NullableOfPersonDepartment`.
 */
const PersonDepartmentSchema = z.enum([
	'c-suite',
	'c-suite/executive',
	'c-suite/finance-executive',
	'c-suite/founder',
	'c-suite/human-resources-executive',
	'c-suite/information-technology-executive',
	'c-suite/legal-executive',
	'c-suite/marketing-executive',
	'c-suite/medical-health-executive',
	'c-suite/operations-executive',
	'c-suite/sales-executive',
	'product-management',
	'product-management/product-development',
	'product-management/product-management',
	'engineering-technical',
	'engineering-technical/artificial-intelligence-machine-learning',
	'engineering-technical/bioengineering',
	'engineering-technical/biometrics',
	'engineering-technical/business-intelligence',
	'engineering-technical/chemical-engineering',
	'engineering-technical/cloud-mobility',
	'engineering-technical/data-science',
	'engineering-technical/devops',
	'engineering-technical/digital-transformation',
	'engineering-technical/emerging-technology-innovation',
	'engineering-technical/engineering-technical',
	'engineering-technical/industrial-engineering',
	'engineering-technical/mechanic',
	'engineering-technical/mobile-development',
	'engineering-technical/project-management',
	'engineering-technical/research-development',
	'engineering-technical/scrum-master-agile-coach',
	'engineering-technical/software-development',
	'engineering-technical/support-technical-services',
	'engineering-technical/technician',
	'engineering-technical/technology-operations',
	'engineering-technical/test-quality-assurance',
	'engineering-technical/ui-ux',
	'engineering-technical/web-development',
	'design',
	'design/all-design',
	'design/product-ui-ux-design',
	'design/graphic-design',
	'education',
	'education/teacher',
	'education/principal',
	'education/superintendent',
	'education/professor',
	'finance',
	'finance/accounting',
	'finance/finance',
	'finance/financial-planning-analysis',
	'finance/financial-reporting',
	'finance/financial-strategy',
	'finance/financial-systems',
	'finance/internal-audit-control',
	'finance/investor-relations',
	'finance/mergers-acquisitions',
	'finance/real-estate-finance',
	'finance/financial-risk',
	'finance/shared-services',
	'finance/sourcing-procurement',
	'finance/tax',
	'finance/treasury',
	'human-resources',
	'human-resources/compensation-benefits',
	'human-resources/culture-diversity-inclusion',
	'human-resources/employee-labor-relations',
	'human-resources/health-safety',
	'human-resources/human-resource-information-system',
	'human-resources/human-resources',
	'human-resources/hr-business-partner',
	'human-resources/learning-development',
	'human-resources/organizational-development',
	'human-resources/recruiting-talent-acquisition',
	'human-resources/talent-management',
	'human-resources/workforce-management',
	'human-resources/people-operations',
	'information-technology',
	'information-technology/application-development',
	'information-technology/business-service-management-itsm',
	'information-technology/collaboration-web-app',
	'information-technology/data-center',
	'information-technology/data-warehouse',
	'information-technology/database-administration',
	'information-technology/ecommerce-development',
	'information-technology/enterprise-architecture',
	'information-technology/help-desk-desktop-services',
	'information-technology/hr-financial-erp-systems',
	'information-technology/information-security',
	'information-technology/information-technology',
	'information-technology/infrastructure',
	'information-technology/it-asset-management',
	'information-technology/it-audit-it-compliance',
	'information-technology/it-operations',
	'information-technology/it-procurement',
	'information-technology/it-strategy',
	'information-technology/it-training',
	'information-technology/networking',
	'information-technology/project-program-management',
	'information-technology/quality-assurance',
	'information-technology/retail-store-systems',
	'information-technology/servers',
	'information-technology/storage-disaster-recovery',
	'information-technology/telecommunications',
	'information-technology/virtualization',
	'legal',
	'legal/acquisitions',
	'legal/compliance',
	'legal/contracts',
	'legal/corporate-secretary',
	'legal/ediscovery',
	'legal/ethics',
	'legal/governance',
	'legal/governmental-affairs-regulatory-law',
	'legal/intellectual-property-patent',
	'legal/labor-employment',
	'legal/lawyer-attorney',
	'legal/legal',
	'legal/legal-counsel',
	'legal/legal-operations',
	'legal/litigation',
	'legal/privacy',
	'marketing',
	'marketing/advertising',
	'marketing/brand-management',
	'marketing/content-marketing',
	'marketing/customer-experience',
	'marketing/customer-marketing',
	'marketing/demand-generation',
	'marketing/digital-marketing',
	'marketing/ecommerce-marketing',
	'marketing/event-marketing',
	'marketing/field-marketing',
	'marketing/lead-generation',
	'marketing/marketing',
	'marketing/marketing-analytics-insights',
	'marketing/marketing-communications',
	'marketing/marketing-operations',
	'marketing/product-marketing',
	'marketing/public-relations',
	'marketing/search-engine-optimization-pay-per-click',
	'marketing/social-media-marketing',
	'marketing/strategic-communications',
	'marketing/technical-marketing',
	'medical-health',
	'medical-health/anesthesiology',
	'medical-health/chiropractics',
	'medical-health/clinical-systems',
	'medical-health/dentistry',
	'medical-health/dermatology',
	'medical-health/doctors-physicians',
	'medical-health/epidemiology',
	'medical-health/first-responder',
	'medical-health/infectious-disease',
	'medical-health/medical-administration',
	'medical-health/medical-education-training',
	'medical-health/medical-research',
	'medical-health/medicine',
	'medical-health/neurology',
	'medical-health/nursing',
	'medical-health/nutrition-dietetics',
	'medical-health/obstetrics-gynecology',
	'medical-health/oncology',
	'medical-health/opthalmology',
	'medical-health/optometry',
	'medical-health/orthopedics',
	'medical-health/pathology',
	'medical-health/pediatrics',
	'medical-health/pharmacy',
	'medical-health/physical-therapy',
	'medical-health/psychiatry',
	'medical-health/psychology',
	'medical-health/public-health',
	'medical-health/radiology',
	'medical-health/social-work',
	'operations',
	'operations/call-center',
	'operations/construction',
	'operations/corporate-strategy',
	'operations/customer-service-support',
	'operations/enterprise-resource-planning',
	'operations/facilities-management',
	'operations/leasing',
	'operations/logistics',
	'operations/office-operations',
	'operations/operations',
	'operations/physical-security',
	'operations/project-development',
	'operations/quality-management',
	'operations/real-estate',
	'operations/safety',
	'operations/store-operations',
	'operations/supply-chain',
	'sales',
	'sales/account-management',
	'sales/business-development',
	'sales/channel-sales',
	'sales/customer-retention-development',
	'sales/customer-success',
	'sales/field-outside-sales',
	'sales/inside-sales',
	'sales/partnerships',
	'sales/revenue-operations',
	'sales/sales',
	'sales/sales-enablement',
	'sales/sales-engineering',
	'sales/sales-operations',
	'sales/sales-training',
	'consulting',
	'consulting/consultant',
]);

const WorkforceGrowthPeriodSchema = z.enum(['m6', 'y1', 'y2']);

const WorkforceGrowthDepartmentSchema = z.enum([
	'overall',
	'c_suite',
	'product_management',
	'engineering_technical',
	'design',
	'education',
	'finance',
	'human_resources',
	'information_technology',
	'legal',
	'marketing',
	'medical_health',
	'operations',
	'sales',
	'consulting',
]);

// Response-only enums. CompanyEnrich adds values to these vocabularies over
// time (`local-business` joined the category list after this plugin was
// written), and a strict z.enum would fail the whole read on the first new
// value. The documented values stay listed for docs and typing; any other
// string passes through. Request enums stay strict z.enum.
function openEnum<T extends z.ZodEnum>(schema: T) {
	return z.union([schema, z.string()]);
}

// ── Documented value-filter shapes ──────────────────────────────────────────

/**
 * Scalar company/person filters accept a single value, a list of values, or
 * advanced matching rules (`in` / `notIn`). Documented at
 * https://docs.companyenrich.com/reference/post_v2-companies-search.md
 */
function valueFilter<T extends z.ZodType>(value: T) {
	return z.union([
		value,
		z.array(value).min(1),
		z
			.object({
				in: z.array(value).min(1).optional(),
				notIn: z.array(value).min(1).optional(),
			})
			.strict()
			.refine(
				(filter) => filter.in !== undefined || filter.notIn !== undefined,
				'At least one matching rule is required.',
			),
	]);
}

/** Past seniority, department and position filters do not support exclusions. */
function valueFilterWithoutExclusion<T extends z.ZodType>(value: T) {
	return z.union([
		value,
		z.array(value).min(1),
		z.object({ in: z.array(value).min(1) }).strict(),
	]);
}

/**
 * Collection filters (keywords, technologies, categories, NAICS codes) also
 * accept an `all` rule, which requires every listed value to be present.
 */
function collectionFilter<T extends z.ZodType>(value: T) {
	return z.union([
		value,
		z.array(value).min(1),
		z
			.object({
				in: z.array(value).min(1).optional(),
				notIn: z.array(value).min(1).optional(),
				all: z.array(value).min(1).optional(),
			})
			.strict()
			.refine(
				(filter) =>
					filter.in !== undefined ||
					filter.notIn !== undefined ||
					filter.all !== undefined,
				'At least one matching rule is required.',
			),
	]);
}

/** `require` only documents the `all` rule. */
function requirementFilter<T extends z.ZodType>(value: T) {
	return z.union([
		value,
		z.array(value).min(1),
		z.object({ all: z.array(value).min(1) }).strict(),
	]);
}

const YearRangeFilterSchema = z.object({
	min: z.number().int().optional(),
	max: z.number().int().optional(),
});

const AmountRangeFilterSchema = z.object({
	min: z.number().optional(),
	max: z.number().optional(),
});

const DateRangeFilterSchema = z.object({
	after: z.string().optional(),
	before: z.string().optional(),
});

const CursorSchema = z.string().max(1024);

// ── Company search request shapes ───────────────────────────────────────────

export const CompanySearchFilterSchema = z.object({
	query: valueFilter(z.string().max(250)).optional(),
	id: valueFilter(CompanyIdSchema).optional(),
	domain: valueFilter(z.string()).optional(),
	keywords: collectionFilter(z.string()).optional(),
	technologies: collectionFilter(z.string()).optional(),
	region: valueFilter(z.string()).optional(),
	country: valueFilter(z.string()).optional(),
	state: valueFilter(z.number().int()).optional(),
	city: valueFilter(z.number().int()).optional(),
	type: valueFilter(CompanyTypeSchema).optional(),
	employees: valueFilter(CompanyEmployeesSchema).optional(),
	reportedEmployees: valueFilter(CompanyEmployeesSchema).optional(),
	revenue: valueFilter(CompanyRevenueSchema).optional(),
	workforceGrowth: z
		.object({
			period: WorkforceGrowthPeriodSchema.optional(),
			department: WorkforceGrowthDepartmentSchema.optional(),
			min: z.number().optional(),
			max: z.number().optional(),
		})
		.strict()
		.optional(),
	workforceSize: z
		.array(
			z
				.object({
					department: WorkforceGrowthDepartmentSchema.optional(),
					min: z.number().int().optional(),
					max: z.number().int().optional(),
				})
				.strict(),
		)
		.optional(),
	naicsCodes: collectionFilter(z.string()).optional(),
	categories: collectionFilter(CompanyCategorySchema).optional(),
	foundedYear: YearRangeFilterSchema.optional(),
	fundingRounds: valueFilter(CompanyFundingRoundSchema).optional(),
	fundingAmount: AmountRangeFilterSchema.optional(),
	fundingYear: YearRangeFilterSchema.optional(),
	require: requirementFilter(CompanyRequiredFeatureSchema).optional(),
});

export type CompanySearchFilter = z.infer<typeof CompanySearchFilterSchema>;

export const CompanySemanticQuerySchema = z.object({
	query: z.string().max(500),
	weight: z.number().min(0).max(1).optional(),
	autoFilter: z.boolean().optional(),
});

export type CompanySemanticQuery = z.infer<typeof CompanySemanticQuerySchema>;

export const CompanyLookalikeQuerySchema = z.object({
	domains: z.array(z.string()).min(1).max(10),
	weight: z.number().min(-1).max(1).optional(),
	minScore: z.number().min(0).max(1).optional(),
});

export type CompanyLookalikeQuery = z.infer<typeof CompanyLookalikeQuerySchema>;

export const CompanySearchQuerySchema = z
	.object({
		filter: CompanySearchFilterSchema.optional(),
		semantic: CompanySemanticQuerySchema.optional(),
		lookalike: CompanyLookalikeQuerySchema.optional(),
	})
	.refine(
		(value) => value.semantic === undefined || value.lookalike === undefined,
		'Semantic and lookalike searches cannot be combined.',
	);

export type CompanySearchQuery = z.infer<typeof CompanySearchQuerySchema>;

// Semantic interpretation is a response, not a request: CompanyEnrich's v2
// response schema marks filter values nullable, including range bounds. Keep
// the request schema above non-nullable so invalid caller input still fails.
const YearRangeInterpretationSchema = z
	.object({
		min: z.number().int().nullish(),
		max: z.number().int().nullish(),
	})
	.strict()
	.nullish();

const AmountRangeInterpretationSchema = z
	.object({
		min: z.number().nullish(),
		max: z.number().nullish(),
	})
	.strict()
	.nullish();

const WorkforceGrowthInterpretationSchema = z
	.object({
		period: WorkforceGrowthPeriodSchema.nullish(),
		department: WorkforceGrowthDepartmentSchema.nullish(),
		min: z.number().nullish(),
		max: z.number().nullish(),
	})
	.strict()
	.nullish();

const WorkforceSizeInterpretationSchema = z
	.array(
		z
			.object({
				department: WorkforceGrowthDepartmentSchema.nullish(),
				min: z.number().int().nullish(),
				max: z.number().int().nullish(),
			})
			.strict(),
	)
	.nullish();

const CompanySearchInterpretationFilterSchema =
	CompanySearchFilterSchema.extend({
		query: CompanySearchFilterSchema.shape.query.nullable(),
		id: CompanySearchFilterSchema.shape.id.nullable(),
		domain: CompanySearchFilterSchema.shape.domain.nullable(),
		keywords: CompanySearchFilterSchema.shape.keywords.nullable(),
		technologies: CompanySearchFilterSchema.shape.technologies.nullable(),
		region: CompanySearchFilterSchema.shape.region.nullable(),
		country: CompanySearchFilterSchema.shape.country.nullable(),
		state: CompanySearchFilterSchema.shape.state.nullable(),
		city: CompanySearchFilterSchema.shape.city.nullable(),
		type: CompanySearchFilterSchema.shape.type.nullable(),
		employees: CompanySearchFilterSchema.shape.employees.nullable(),
		reportedEmployees:
			CompanySearchFilterSchema.shape.reportedEmployees.nullable(),
		revenue: CompanySearchFilterSchema.shape.revenue.nullable(),
		workforceGrowth: WorkforceGrowthInterpretationSchema,
		workforceSize: WorkforceSizeInterpretationSchema,
		naicsCodes: CompanySearchFilterSchema.shape.naicsCodes.nullable(),
		categories: CompanySearchFilterSchema.shape.categories.nullable(),
		foundedYear: YearRangeInterpretationSchema,
		fundingRounds: CompanySearchFilterSchema.shape.fundingRounds.nullable(),
		fundingAmount: AmountRangeInterpretationSchema,
		fundingYear: YearRangeInterpretationSchema,
		require: CompanySearchFilterSchema.shape.require.nullable(),
	});

// ── Company response shapes ─────────────────────────────────────────────────

const CompanyCountrySchema = z
	.object({ code: z.string(), name: z.string() })
	.loose();

const CompanyStateSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		code: z.string().nullish(),
	})
	.loose();

const CompanyCitySchema = z
	.object({ id: z.number().int(), name: z.string() })
	.loose();

const CompanyLocationSchema = z
	.object({
		country: CompanyCountrySchema.nullish(),
		state: CompanyStateSchema.nullish(),
		city: CompanyCitySchema.nullish(),
		address: z.string().nullish(),
		postalCode: z.string().nullish(),
		phone: z.string().nullish(),
	})
	.loose()
	.nullish();

const CompanySocialsSchema = z
	.object({
		linkedinUrl: z.string().nullish(),
		linkedinId: z.string().nullish(),
		twitterUrl: z.string().nullish(),
		facebookUrl: z.string().nullish(),
		instagramUrl: z.string().nullish(),
		angellistUrl: z.string().nullish(),
		crunchbaseUrl: z.string().nullish(),
		youtubeUrl: z.string().nullish(),
		githubUrl: z.string().nullish(),
		g2Url: z.string().nullish(),
	})
	.loose()
	.nullish();

const CompanyFundingRoundOutputSchema = z
	.object({
		date: z.string().nullish(),
		amount: z.string().nullish(),
		type: z.string().nullish(),
		url: z.string().nullish(),
		investors: z.string().nullish(),
	})
	.loose();

const CompanyFinancialSchema = z
	.object({
		stockSymbol: z.string().nullish(),
		stockExchange: z.string().nullish(),
		totalFunding: z.number().int().nullish(),
		fundingStage: z.string().nullish(),
		fundingDate: z.string().nullish(),
		fundingRounds: z.array(CompanyFundingRoundOutputSchema).nullish(),
	})
	.loose()
	.nullish();

const CompanyWorkforceDepartmentSchema = z
	.object({
		cSuite: z.number().int().nullish(),
		productManagement: z.number().int().nullish(),
		engineeringTechnical: z.number().int().nullish(),
		design: z.number().int().nullish(),
		education: z.number().int().nullish(),
		finance: z.number().int().nullish(),
		humanResources: z.number().int().nullish(),
		informationTechnology: z.number().int().nullish(),
		legal: z.number().int().nullish(),
		marketing: z.number().int().nullish(),
		medicalHealth: z.number().int().nullish(),
		operations: z.number().int().nullish(),
		sales: z.number().int().nullish(),
		consulting: z.number().int().nullish(),
	})
	.loose();

const CompanyWorkforceHistorySchema = z
	.object({
		date: z.string(),
		observedEmployeeCount: z.number().int(),
		employeeCountRange: openEnum(CompanyEmployeesSchema).nullish(),
		departmentHeadcount: CompanyWorkforceDepartmentSchema,
		unclassifiedHeadcount: z.number().int(),
	})
	.loose();

const workforceFields = {
	companyId: CompanyIdSchema,
	domain: z.string(),
	observedEmployeeCount: z.number().int(),
	employeeCountRange: openEnum(CompanyEmployeesSchema).nullish(),
	departmentHeadcount: CompanyWorkforceDepartmentSchema,
	unclassifiedHeadcount: z.number().int(),
	historyFrom: z.string(),
	historyTo: z.string(),
	history: z.array(CompanyWorkforceHistorySchema).nullish(),
	nextCursor: z.string().nullish(),
};

/** Workforce data as embedded in a company profile. */
const CompanyWorkforceSchema = z.object(workforceFields).loose().nullish();

const companyFields = {
	id: CompanyIdSchema,
	name: z.string().nullish(),
	legalName: z.string().nullish(),
	domain: z.string(),
	website: z.string(),
	logoUrl: z.string(),
	description: z.string().nullish(),
	type: openEnum(CompanyTypeSchema).nullish(),
	foundedYear: z.number().int().nullish(),
	employees: openEnum(CompanyEmployeesSchema).nullish(),
	revenue: openEnum(CompanyRevenueSchema).nullish(),
	industry: z.string().nullish(),
	industries: z.array(z.string()).nullish(),
	categories: z.array(openEnum(CompanyCategorySchema)).nullish(),
	location: CompanyLocationSchema,
	socials: CompanySocialsSchema,
	updatedAt: z.string(),
	financial: CompanyFinancialSchema,
	keywords: z.array(z.string()).nullish(),
	naicsCodes: z.array(z.string()).nullish(),
	technologies: z.array(z.string()).nullish(),
	workforce: CompanyWorkforceSchema,
};

export const CompanyResponseSchema = z.object(companyFields).loose();

export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

// ── Person request and response shapes ──────────────────────────────────────

const PersonEducationSearchFilterSchema = z.object({
	institutionLinkedinHandle: valueFilter(z.string()).optional(),
	institutionName: valueFilter(z.string()).optional(),
});

export const PersonPastExperienceSearchFilterSchema = z.object({
	companyId: valueFilter(CompanyIdSchema).optional(),
	domain: valueFilter(z.string()).optional(),
	companyLinkedinHandle: valueFilter(z.string()).optional(),
	seniority: valueFilterWithoutExclusion(PersonSenioritySchema).optional(),
	department: valueFilterWithoutExclusion(PersonDepartmentSchema).optional(),
	position: valueFilterWithoutExclusion(z.string()).optional(),
	startDate: DateRangeFilterSchema.optional(),
	endDate: DateRangeFilterSchema.optional(),
});

export const PersonSearchFilterSchema = z.object({
	query: valueFilter(z.string().max(250)).optional(),
	companyId: valueFilter(CompanyIdSchema).optional(),
	domain: valueFilter(z.string()).optional(),
	companyLinkedinHandle: valueFilter(z.string()).optional(),
	seniority: valueFilter(PersonSenioritySchema).optional(),
	department: valueFilter(PersonDepartmentSchema).optional(),
	country: valueFilter(z.string()).optional(),
	position: valueFilter(z.string()).optional(),
	currentCompanyStartDate: DateRangeFilterSchema.optional(),
	currentPositionStartDate: DateRangeFilterSchema.optional(),
	education: PersonEducationSearchFilterSchema.optional(),
	pastExperience: PersonPastExperienceSearchFilterSchema.optional(),
});

export type PersonSearchFilter = z.infer<typeof PersonSearchFilterSchema>;

/**
 * Natural-language people query: CompanyEnrich infers person filters and a
 * semantic company query from it and reports them in `interpretation`.
 */
export const PersonSemanticQuerySchema = z.object({
	query: z.string().max(500),
});

export const PersonSearchRequestSchema = z.object({
	pageSize: z.number().int().min(1).max(100).optional(),
	cursor: CursorSchema.optional(),
	expand: z.array(PersonExpandSchema).optional(),
	filter: PersonSearchFilterSchema.optional(),
	semantic: PersonSemanticQuerySchema.optional(),
	company: CompanySearchQuerySchema.optional(),
});

const PersonCountrySchema = z
	.object({ code: z.string(), name: z.string() })
	.loose();

const PersonLocationSchema = z
	.object({
		country: PersonCountrySchema.nullish(),
		address: z.string().nullish(),
	})
	.loose()
	.nullish();

const PersonCompanySchema = z
	.object({
		id: CompanyIdSchema,
		name: z.string().nullish(),
		domain: z.string().nullish(),
		logoUrl: z.string().nullish(),
		industry: z.string().nullish(),
	})
	.loose()
	.nullish();

const PersonExperienceSchema = z
	.object({
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		isCurrent: z.boolean(),
		isMatched: z.boolean(),
		position: z.string().nullish(),
		seniority: openEnum(PersonSenioritySchema).nullish(),
		department: openEnum(PersonDepartmentSchema).nullish(),
		company: PersonCompanySchema,
		companyName: z.string().nullish(),
	})
	.loose();

const PersonSocialsSchema = z
	.object({ linkedinUrl: z.string().nullish() })
	.loose();

const PersonEducationSchema = z
	.object({
		institutionName: z.string(),
		institution: PersonCompanySchema,
		socialHandle: z.string().nullish(),
		degree: z.array(z.string()).nullish(),
		startYear: z.number().int().nullish(),
		endYear: z.number().int().nullish(),
	})
	.loose();

export const PersonResponseSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		imageUrl: z.string().nullish(),
		position: z.string().nullish(),
		seniority: openEnum(PersonSenioritySchema).nullish(),
		department: openEnum(PersonDepartmentSchema).nullish(),
		location: PersonLocationSchema,
		socials: PersonSocialsSchema,
		experiences: z.array(PersonExperienceSchema),
		updatedAt: z.string().nullish(),
		education: z.array(PersonEducationSchema).nullish(),
	})
	.loose();

export type PersonResponse = z.infer<typeof PersonResponseSchema>;

// ── Company endpoints ───────────────────────────────────────────────────────

export const CompaniesGetInputSchema = z.object({
	companyId: CompanyIdSchema,
	expand: z.array(CompanyExpandSchema).optional(),
});

export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;

export const CompaniesEnrichByDomainInputSchema = z.object({
	domain: z.string().max(1024),
	expand: z.array(CompanyExpandSchema).optional(),
	waitForEnrichment: z.boolean().optional(),
});

export type CompaniesEnrichByDomainInput = z.infer<
	typeof CompaniesEnrichByDomainInputSchema
>;

export const CompaniesEnrichByPropertiesInputSchema = z
	.object({
		name: z.string().max(250).optional(),
		linkedinUrl: z.string().max(2048).optional(),
		linkedinId: z.string().max(100).optional(),
		twitterUrl: z.string().max(2048).optional(),
		facebookUrl: z.string().max(2048).optional(),
		instagramUrl: z.string().max(2048).optional(),
		youtubeUrl: z.string().max(2048).optional(),
		expand: z.array(CompanyExpandSchema).optional(),
	})
	.refine(
		(value) =>
			value.name !== undefined ||
			value.linkedinUrl !== undefined ||
			value.linkedinId !== undefined ||
			value.twitterUrl !== undefined ||
			value.facebookUrl !== undefined ||
			value.instagramUrl !== undefined ||
			value.youtubeUrl !== undefined,
		'Provide at least one identifying company property.',
	);

export type CompaniesEnrichByPropertiesInput = z.infer<
	typeof CompaniesEnrichByPropertiesInputSchema
>;

export const CompaniesEnrichBatchInputSchema = z.object({
	domains: z.array(z.string()).min(1).max(50),
	expand: z.array(CompanyExpandSchema).optional(),
	waitForEnrichment: z.boolean().optional(),
});

export type CompaniesEnrichBatchInput = z.infer<
	typeof CompaniesEnrichBatchInputSchema
>;

export const CompaniesAutocompleteInputSchema = z.object({
	query: z.string().max(100),
});

export type CompaniesAutocompleteInput = z.infer<
	typeof CompaniesAutocompleteInputSchema
>;

export const CompaniesWorkforceInputSchema = z
	.object({
		id: CompanyIdSchema.optional(),
		domain: z.string().max(1024).optional(),
		cursor: CursorSchema.optional(),
	})
	.refine(
		(value) => (value.id === undefined) !== (value.domain === undefined),
		'Provide exactly one of id or domain.',
	);

export type CompaniesWorkforceInput = z.infer<
	typeof CompaniesWorkforceInputSchema
>;

export const CompanyAutocompleteResponseSchema = z
	.object({
		id: CompanyIdSchema,
		name: z.string().nullish(),
		domain: z.string(),
		logoUrl: z.string(),
	})
	.loose();

export type CompanyAutocompleteResponse = z.infer<
	typeof CompanyAutocompleteResponseSchema
>;

export const CompaniesAutocompleteResponseSchema = z.object({
	items: z.array(CompanyAutocompleteResponseSchema),
});

export type CompaniesAutocompleteResponse = z.infer<
	typeof CompaniesAutocompleteResponseSchema
>;

export const CompaniesEnrichBatchResponseSchema = z.object({
	items: z.array(
		z
			.object({
				domain: z.string(),
				status: openEnum(
					z.enum(['found', 'not-found', 'invalid-domain', 'pending']),
				),
				company: CompanyResponseSchema.nullish(),
			})
			.loose(),
	),
});

export type CompaniesEnrichBatchResponse = z.infer<
	typeof CompaniesEnrichBatchResponseSchema
>;

export const CompaniesWorkforceResponseSchema = z
	.object(workforceFields)
	.loose();

export type CompaniesWorkforceResponse = z.infer<
	typeof CompaniesWorkforceResponseSchema
>;

// ── Company search endpoints ────────────────────────────────────────────────

export const CompaniesSearchInputSchema = z
	.object({
		pageSize: z.number().int().min(1).max(100).optional(),
		cursor: CursorSchema.optional(),
		expand: z.array(CompanyExpandSchema).optional(),
		filter: CompanySearchFilterSchema.optional(),
		semantic: CompanySemanticQuerySchema.optional(),
		lookalike: CompanyLookalikeQuerySchema.optional(),
	})
	.refine(
		(value) => value.semantic === undefined || value.lookalike === undefined,
		'Semantic and lookalike searches cannot be combined.',
	);

export type CompaniesSearchInput = z.infer<typeof CompaniesSearchInputSchema>;

export const CompaniesSearchCountInputSchema = CompanySearchQuerySchema;

export type CompaniesSearchCountInput = z.infer<
	typeof CompaniesSearchCountInputSchema
>;

export const CompaniesSearchPreviewInputSchema = CompanySearchQuerySchema;

export type CompaniesSearchPreviewInput = z.infer<
	typeof CompaniesSearchPreviewInputSchema
>;

const CompanySemanticInterpretationSchema = z
	.object({
		filter: CompanySearchInterpretationFilterSchema.nullish(),
		boost: z
			.object({
				names: z.array(z.string()).nullish(),
				categories: z.array(openEnum(CompanyCategorySchema)).nullish(),
				revenue: z.array(openEnum(CompanyRevenueSchema)).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose()
	.nullish();

const ScoresSchema = z.record(z.string(), z.number()).nullish();

export const CompaniesSearchResponseSchema = z.object({
	items: z.array(CompanyResponseSchema),
	nextCursor: z.string().nullish(),
	scores: ScoresSchema,
	interpretation: CompanySemanticInterpretationSchema,
});

export type CompaniesSearchResponse = z.infer<
	typeof CompaniesSearchResponseSchema
>;

export const CompaniesSearchCountResponseSchema = z.object({
	count: z.number().int(),
	total: z.number().int(),
	interpretation: CompanySemanticInterpretationSchema,
});

export type CompaniesSearchCountResponse = z.infer<
	typeof CompaniesSearchCountResponseSchema
>;

export const CompanySearchPreviewItemSchema = z
	.object({
		id: CompanyIdSchema,
		name: z.string().nullish(),
		logoUrl: z.string(),
		industry: z.string().nullish(),
		updatedAt: z.string(),
	})
	.loose();

export const CompaniesSearchPreviewResponseSchema = z.object({
	items: z.array(CompanySearchPreviewItemSchema),
	total: z.number().int(),
	scores: ScoresSchema,
	interpretation: CompanySemanticInterpretationSchema,
});

export type CompaniesSearchPreviewResponse = z.infer<
	typeof CompaniesSearchPreviewResponseSchema
>;

// ── People endpoints ────────────────────────────────────────────────────────

export const PeopleGetInputSchema = z.object({
	personId: z.number().int(),
	expand: z.array(PersonExpandSchema).optional(),
});

export type PeopleGetInput = z.infer<typeof PeopleGetInputSchema>;

export const PeopleEnrichInputSchema = z.object({
	email: z.string().email().max(320),
	expand: z.array(PersonExpandSchema).optional(),
});

export type PeopleEnrichInput = z.infer<typeof PeopleEnrichInputSchema>;

export const PeopleFindEmailInputSchema = z.object({
	personId: z.number().int(),
	domain: z.string().max(1024).optional(),
});

export type PeopleFindEmailInput = z.infer<typeof PeopleFindEmailInputSchema>;

export const PeopleFindEmailResponseSchema = z
	.object({
		personId: z.number().int(),
		domain: z.string(),
		status: openEnum(z.enum(['found', 'not-found', 'unavailable', 'pending'])),
		email: z.string().nullish(),
		certainty: openEnum(
			z.enum(['unknown', 'medium', 'high', 'very-high']),
		).nullish(),
	})
	.loose();

export type PeopleFindEmailResponse = z.infer<
	typeof PeopleFindEmailResponseSchema
>;

export const PeopleSearchInputSchema = PersonSearchRequestSchema;

export type PeopleSearchInput = z.infer<typeof PeopleSearchInputSchema>;

export const PeopleSearchCountInputSchema = z.object({
	filter: PersonSearchFilterSchema.optional(),
	semantic: PersonSemanticQuerySchema.optional(),
	company: CompanySearchQuerySchema.optional(),
});

export type PeopleSearchCountInput = z.infer<
	typeof PeopleSearchCountInputSchema
>;

export const PeopleSearchPreviewInputSchema = PeopleSearchCountInputSchema;

export type PeopleSearchPreviewInput = z.infer<
	typeof PeopleSearchPreviewInputSchema
>;

// What CompanyEnrich inferred from `semantic.query`; present only on semantic
// people searches. The inferred filters echo the request filter vocabulary and
// are kept loose (unvalidated records) so a newly inferred field never fails
// the search itself.
const PersonSemanticInterpretationSchema = z
	.object({
		companyNames: z.array(z.string()).nullish(),
		filter: z.record(z.string(), z.unknown()).nullish(),
		company: z
			.object({
				query: z.string(),
				filter: z.record(z.string(), z.unknown()).nullish(),
				boost: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose()
	.nullish();

export const PeopleSearchResponseSchema = z.object({
	items: z.array(PersonResponseSchema),
	nextCursor: z.string().nullish(),
	interpretation: PersonSemanticInterpretationSchema,
});

export type PeopleSearchResponse = z.infer<typeof PeopleSearchResponseSchema>;

export const PeopleSearchCountResponseSchema = z.object({
	count: z.number().int(),
	total: z.number().int(),
	interpretation: PersonSemanticInterpretationSchema,
});

export type PeopleSearchCountResponse = z.infer<
	typeof PeopleSearchCountResponseSchema
>;

export const PersonSearchPreviewItemSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
		position: z.string().nullish(),
		department: z.string().nullish(),
		experiences: z.array(
			z
				.object({
					isCurrent: z.boolean(),
					position: z.string().nullish(),
					company: z
						.object({
							id: CompanyIdSchema,
							name: z.string().nullish(),
							logoUrl: z.string().nullish(),
							industry: z.string().nullish(),
						})
						.loose()
						.nullish(),
				})
				.loose(),
		),
	})
	.loose();

export const PeopleSearchPreviewResponseSchema = z.object({
	items: z.array(PersonSearchPreviewItemSchema),
	total: z.number().int(),
	interpretation: PersonSemanticInterpretationSchema,
});

export type PeopleSearchPreviewResponse = z.infer<
	typeof PeopleSearchPreviewResponseSchema
>;

// ── Geo endpoints ───────────────────────────────────────────────────────────

export const GeoRegionsInputSchema = z.object({});

export type GeoRegionsInput = z.infer<typeof GeoRegionsInputSchema>;

export const GeoGetCountryInputSchema = z.object({
	countryCode: z.string().regex(/^[A-Za-z]{2}$/),
});

export type GeoGetCountryInput = z.infer<typeof GeoGetCountryInputSchema>;

export const GeoSearchCountriesInputSchema = z.object({
	query: z.string().max(100).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	cursor: z.string().max(2048).optional(),
});

export type GeoSearchCountriesInput = z.infer<
	typeof GeoSearchCountriesInputSchema
>;

export const GeoSearchStatesInputSchema = z.object({
	countryCodes: z.array(z.string()).max(250).optional(),
	query: z.string().max(100).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	cursor: z.string().max(2048).optional(),
});

export type GeoSearchStatesInput = z.infer<typeof GeoSearchStatesInputSchema>;

export const GeoSearchCitiesInputSchema = z.object({
	stateIds: z.array(z.number().int()).max(100).optional(),
	countryCodes: z.array(z.string()).max(250).optional(),
	query: z.string().max(100).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	cursor: z.string().max(2048).optional(),
});

export type GeoSearchCitiesInput = z.infer<typeof GeoSearchCitiesInputSchema>;

export const GeoRegionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		parentId: z.string().nullish(),
		countryCodes: z.array(z.string()),
	})
	.loose();

export const GeoRegionsResponseSchema = z.object({
	items: z.array(GeoRegionSchema),
});

export type GeoRegionsResponse = z.infer<typeof GeoRegionsResponseSchema>;

export const GeoCountrySchema = z
	.object({
		code: z.string(),
		name: z.string(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
	})
	.loose();

export type GeoCountry = z.infer<typeof GeoCountrySchema>;

export const GeoStateSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		code: z.string().nullish(),
		countryCode: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
	})
	.loose();

export type GeoState = z.infer<typeof GeoStateSchema>;

export const GeoCitySchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		countryCode: z.string().nullish(),
		stateId: z.number().int().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
	})
	.loose();

export type GeoCity = z.infer<typeof GeoCitySchema>;

export const GeoSearchCountriesResponseSchema = z.object({
	items: z.array(GeoCountrySchema),
	nextCursor: z.string().nullish(),
});

export type GeoSearchCountriesResponse = z.infer<
	typeof GeoSearchCountriesResponseSchema
>;

export const GeoSearchStatesResponseSchema = z.object({
	items: z.array(GeoStateSchema),
	nextCursor: z.string().nullish(),
});

export type GeoSearchStatesResponse = z.infer<
	typeof GeoSearchStatesResponseSchema
>;

export const GeoSearchCitiesResponseSchema = z.object({
	items: z.array(GeoCitySchema),
	nextCursor: z.string().nullish(),
});

export type GeoSearchCitiesResponse = z.infer<
	typeof GeoSearchCitiesResponseSchema
>;

// ── Reference data endpoints ────────────────────────────────────────────────

export const IndustriesListInputSchema = z.object({});

export type IndustriesListInput = z.infer<typeof IndustriesListInputSchema>;

export const IndustrySchema = z
	.object({
		name: z.string(),
		naicsCodes: z.array(z.string()),
	})
	.loose();

export const IndustriesListResponseSchema = z.object({
	items: z.array(IndustrySchema),
});

export type IndustriesListResponse = z.infer<
	typeof IndustriesListResponseSchema
>;

const autocompleteQuery = z.object({ query: z.string().max(100) });

const stringListResponse = z.object({ items: z.array(z.string()) });

export const KeywordsAutocompleteInputSchema = autocompleteQuery;

export type KeywordsAutocompleteInput = z.infer<
	typeof KeywordsAutocompleteInputSchema
>;

export const KeywordsAutocompleteResponseSchema = stringListResponse;

export type KeywordsAutocompleteResponse = z.infer<
	typeof KeywordsAutocompleteResponseSchema
>;

export const TechnologiesAutocompleteInputSchema = autocompleteQuery;

export type TechnologiesAutocompleteInput = z.infer<
	typeof TechnologiesAutocompleteInputSchema
>;

export const TechnologiesAutocompleteResponseSchema = stringListResponse;

export type TechnologiesAutocompleteResponse = z.infer<
	typeof TechnologiesAutocompleteResponseSchema
>;

export const PositionsAutocompleteInputSchema = autocompleteQuery;

export type PositionsAutocompleteInput = z.infer<
	typeof PositionsAutocompleteInputSchema
>;

export const PositionsAutocompleteResponseSchema = stringListResponse;

export type PositionsAutocompleteResponse = z.infer<
	typeof PositionsAutocompleteResponseSchema
>;

// ── Account endpoint ────────────────────────────────────────────────────────

export const AccountMeInputSchema = z.object({});

export type AccountMeInput = z.infer<typeof AccountMeInputSchema>;

export const AccountMeResponseSchema = z.object({
	userId: z.string().uuid(),
	// ApiCreditV2Info: doubles, fractional credits included.
	credits: z.object({ used: z.number(), total: z.number() }).loose(),
	capabilities: z
		.object({
			lists: z.boolean(),
			previews: z.boolean(),
			companySearchLimit: z.number().int(),
			companySearchAsyncLimit: z.number().int(),
			peopleSearchLimit: z.number().int(),
			searchTermLimit: z.number().int(),
		})
		.loose(),
});

export type AccountMeResponse = z.infer<typeof AccountMeResponseSchema>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type CompanyenrichEndpointInputs = {
	companiesGet: CompaniesGetInput;
	companiesEnrichByDomain: CompaniesEnrichByDomainInput;
	companiesEnrichByProperties: CompaniesEnrichByPropertiesInput;
	companiesEnrichBatch: CompaniesEnrichBatchInput;
	companiesAutocomplete: CompaniesAutocompleteInput;
	companiesWorkforce: CompaniesWorkforceInput;
	companiesSearch: CompaniesSearchInput;
	companiesSearchCount: CompaniesSearchCountInput;
	companiesSearchPreview: CompaniesSearchPreviewInput;
	peopleGet: PeopleGetInput;
	peopleEnrich: PeopleEnrichInput;
	peopleFindEmail: PeopleFindEmailInput;
	peopleSearch: PeopleSearchInput;
	peopleSearchCount: PeopleSearchCountInput;
	peopleSearchPreview: PeopleSearchPreviewInput;
	geoRegions: GeoRegionsInput;
	geoGetCountry: GeoGetCountryInput;
	geoSearchCountries: GeoSearchCountriesInput;
	geoSearchStates: GeoSearchStatesInput;
	geoSearchCities: GeoSearchCitiesInput;
	industriesList: IndustriesListInput;
	keywordsAutocomplete: KeywordsAutocompleteInput;
	technologiesAutocomplete: TechnologiesAutocompleteInput;
	positionsAutocomplete: PositionsAutocompleteInput;
	accountMe: AccountMeInput;
};

export type CompanyenrichEndpointOutputs = {
	companiesGet: CompanyResponse;
	companiesEnrichByDomain: CompanyResponse;
	companiesEnrichByProperties: CompanyResponse;
	companiesEnrichBatch: CompaniesEnrichBatchResponse;
	companiesAutocomplete: CompaniesAutocompleteResponse;
	companiesWorkforce: CompaniesWorkforceResponse;
	companiesSearch: CompaniesSearchResponse;
	companiesSearchCount: CompaniesSearchCountResponse;
	companiesSearchPreview: CompaniesSearchPreviewResponse;
	peopleGet: PersonResponse;
	peopleEnrich: PersonResponse;
	peopleFindEmail: PeopleFindEmailResponse;
	peopleSearch: PeopleSearchResponse;
	peopleSearchCount: PeopleSearchCountResponse;
	peopleSearchPreview: PeopleSearchPreviewResponse;
	geoRegions: GeoRegionsResponse;
	geoGetCountry: GeoCountry;
	geoSearchCountries: GeoSearchCountriesResponse;
	geoSearchStates: GeoSearchStatesResponse;
	geoSearchCities: GeoSearchCitiesResponse;
	industriesList: IndustriesListResponse;
	keywordsAutocomplete: KeywordsAutocompleteResponse;
	technologiesAutocomplete: TechnologiesAutocompleteResponse;
	positionsAutocomplete: PositionsAutocompleteResponse;
	accountMe: AccountMeResponse;
};

export const CompanyenrichEndpointInputSchemas = {
	companiesGet: CompaniesGetInputSchema,
	companiesEnrichByDomain: CompaniesEnrichByDomainInputSchema,
	companiesEnrichByProperties: CompaniesEnrichByPropertiesInputSchema,
	companiesEnrichBatch: CompaniesEnrichBatchInputSchema,
	companiesAutocomplete: CompaniesAutocompleteInputSchema,
	companiesWorkforce: CompaniesWorkforceInputSchema,
	companiesSearch: CompaniesSearchInputSchema,
	companiesSearchCount: CompaniesSearchCountInputSchema,
	companiesSearchPreview: CompaniesSearchPreviewInputSchema,
	peopleGet: PeopleGetInputSchema,
	peopleEnrich: PeopleEnrichInputSchema,
	peopleFindEmail: PeopleFindEmailInputSchema,
	peopleSearch: PeopleSearchInputSchema,
	peopleSearchCount: PeopleSearchCountInputSchema,
	peopleSearchPreview: PeopleSearchPreviewInputSchema,
	geoRegions: GeoRegionsInputSchema,
	geoGetCountry: GeoGetCountryInputSchema,
	geoSearchCountries: GeoSearchCountriesInputSchema,
	geoSearchStates: GeoSearchStatesInputSchema,
	geoSearchCities: GeoSearchCitiesInputSchema,
	industriesList: IndustriesListInputSchema,
	keywordsAutocomplete: KeywordsAutocompleteInputSchema,
	technologiesAutocomplete: TechnologiesAutocompleteInputSchema,
	positionsAutocomplete: PositionsAutocompleteInputSchema,
	accountMe: AccountMeInputSchema,
} as const;

export const CompanyenrichEndpointOutputSchemas = {
	companiesGet: CompanyResponseSchema,
	companiesEnrichByDomain: CompanyResponseSchema,
	companiesEnrichByProperties: CompanyResponseSchema,
	companiesEnrichBatch: CompaniesEnrichBatchResponseSchema,
	companiesAutocomplete: CompaniesAutocompleteResponseSchema,
	companiesWorkforce: CompaniesWorkforceResponseSchema,
	companiesSearch: CompaniesSearchResponseSchema,
	companiesSearchCount: CompaniesSearchCountResponseSchema,
	companiesSearchPreview: CompaniesSearchPreviewResponseSchema,
	peopleGet: PersonResponseSchema,
	peopleEnrich: PersonResponseSchema,
	peopleFindEmail: PeopleFindEmailResponseSchema,
	peopleSearch: PeopleSearchResponseSchema,
	peopleSearchCount: PeopleSearchCountResponseSchema,
	peopleSearchPreview: PeopleSearchPreviewResponseSchema,
	geoRegions: GeoRegionsResponseSchema,
	geoGetCountry: GeoCountrySchema,
	geoSearchCountries: GeoSearchCountriesResponseSchema,
	geoSearchStates: GeoSearchStatesResponseSchema,
	geoSearchCities: GeoSearchCitiesResponseSchema,
	industriesList: IndustriesListResponseSchema,
	keywordsAutocomplete: KeywordsAutocompleteResponseSchema,
	technologiesAutocomplete: TechnologiesAutocompleteResponseSchema,
	positionsAutocomplete: PositionsAutocompleteResponseSchema,
	accountMe: AccountMeResponseSchema,
} as const;
