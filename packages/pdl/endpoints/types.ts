import { z } from 'zod';

// Unmodeled PDL response fields pass through parse with no shape claim.
const UnknownRecord = z.record(z.string(), z.unknown());

// Reads off an UnknownRecord narrow at the use site instead of casting, so a
// field holding a null or a wrong type degrades to null rather than leaking
// into a database row.
export const readString = (value: unknown): string | null =>
	typeof value === 'string' ? value : null;

export const readNumber = (value: unknown): number | null =>
	typeof value === 'number' ? value : null;

export const readFirstString = (value: unknown): string | null =>
	Array.isArray(value) && typeof value[0] === 'string' ? value[0] : null;

const titlecaseParam = z.boolean().optional();
const prettyParam = z.boolean().optional();

function issue(ctx: z.RefinementCtx, message: string): void {
	ctx.addIssue({ code: 'custom', message });
}

function atLeastOneOf(keys: string[]) {
	return (input: Record<string, unknown>, ctx: z.RefinementCtx): void => {
		if (!keys.some((key) => input[key] !== undefined)) {
			issue(ctx, `must include at least one of: ${keys.join(', ')}`);
		}
	};
}

function exactlyOneOf(keys: string[]) {
	return (input: Record<string, unknown>, ctx: z.RefinementCtx): void => {
		const present = keys.filter((key) => input[key] !== undefined);
		if (present.length !== 1) {
			issue(ctx, `exactly one of ${keys.join(', ')} is required`);
		}
	};
}

const personIdentityShape = {
	pdl_id: z.string().optional(),
	name: z.string().min(1).optional(),
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	middle_name: z.string().optional(),
	location: z.string().min(1).optional(),
	street_address: z.string().optional(),
	locality: z.string().min(1).optional(),
	region: z.string().min(1).optional(),
	country: z.string().optional(),
	postal_code: z.string().optional(),
	company: z.string().min(1).optional(),
	school: z.string().min(1).optional(),
	phone: z
		.string()
		.regex(/^\+/, 'phone must be E.164 and start with +')
		.optional(),
	email: z.string().min(3).optional(),
	email_hash: z.string().min(1).optional(),
	profile: z.string().min(1).optional(),
	lid: z.string().min(1).optional(),
	birth_date: z.string().optional(),
} as const;

// PDL 400s without its documented minimum, so the gate runs before the wire.
function hasEnrichmentMinimumInputs(
	input: Record<string, unknown>,
	ctx: z.RefinementCtx,
): void {
	const has = (key: string) => input[key] !== undefined;
	const direct =
		has('profile') ||
		has('email') ||
		has('phone') ||
		has('email_hash') ||
		has('lid');
	const name = (has('first_name') && has('last_name')) || has('name');
	const context =
		has('locality') ||
		has('region') ||
		has('company') ||
		has('school') ||
		has('location') ||
		has('postal_code');
	if (!(direct || (name && context))) {
		issue(
			ctx,
			'enrichment needs profile, email, phone, email_hash, or lid, or a name plus one of locality, region, company, school, location, postal_code',
		);
	}
}

export const PersonEnrichInputSchema = z
	.object({
		...personIdentityShape,
		min_likelihood: z.number().int().min(1).max(10).optional(),
		include_if_matched: z.boolean().optional(),
		required: z.array(z.string()).optional(),
		data_include: z.array(z.string()).optional(),
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(hasEnrichmentMinimumInputs);

export type PersonEnrichInput = z.infer<typeof PersonEnrichInputSchema>;

export const PersonEnrichOutputSchema = z.discriminatedUnion('found', [
	z.object({
		found: z.literal(true),
		status: z.number(),
		likelihood: z.number().min(1).max(10),
		data: UnknownRecord.nullable(),
		matched: z.array(z.string()).optional(),
	}),
	z.object({
		found: z.literal(false),
	}),
]);

export type PersonEnrichOutput = z.infer<typeof PersonEnrichOutputSchema>;

// /person/identify takes the same identity params without the enrichment
// controls; PDL answers 400 for calls it cannot act on, so no client-side
// gate is imposed here.
export const PersonIdentifyInputSchema = z
	.object({
		...personIdentityShape,
		include_if_matched: z.boolean().optional(),
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict();

export type PersonIdentifyInput = z.infer<typeof PersonIdentifyInputSchema>;

export const IdentifyMatchSchema = z.object({
	match_score: z.number().min(1).max(99),
	data: z.array(UnknownRecord),
	matched_on: z.array(z.string()).optional(),
});

export type IdentifyMatch = z.infer<typeof IdentifyMatchSchema>;

export const PersonIdentifyOutputSchema = z.discriminatedUnion('found', [
	z.object({
		found: z.literal(true),
		status: z.number(),
		matches: z.array(IdentifyMatchSchema),
	}),
	z.object({
		found: z.literal(false),
	}),
]);

export type PersonIdentifyOutput = z.infer<typeof PersonIdentifyOutputSchema>;

// The Elasticsearch DSL is validated server-side, so query bodies pass
// through untouched.
const esQueryParam = z.record(z.string(), z.unknown()).optional();
const sizeParam = z.number().int().min(1).max(100).optional();
const scrollTokenParam = z.string().min(1).optional();

export const PDL_DATASETS = [
	'resume',
	'email',
	'phone',
	'mobile_phone',
	'street_address',
	'consumer_social',
	'developer',
	'all',
] as const;

const datasetToken = `(?:-?(?:${PDL_DATASETS.join('|')}))`;
const DATASET_PATTERN = new RegExp(`^${datasetToken}(,${datasetToken})*$`);

export const PersonSearchInputSchema = z
	.object({
		query: esQueryParam,
		sql: z.string().min(1).optional(),
		size: sizeParam,
		scroll_token: scrollTokenParam,
		dataset: z.string().regex(DATASET_PATTERN).optional(),
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(exactlyOneOf(['query', 'sql']));

export type PersonSearchInput = z.infer<typeof PersonSearchInputSchema>;

const SearchOutputShape = {
	status: z.number(),
	data: z.array(UnknownRecord),
	total: z.number().int().min(0),
	scroll_token: z.string().optional(),
} as const;

export const PersonSearchOutputSchema = z.object(SearchOutputShape);

export type PersonSearchOutput = z.infer<typeof PersonSearchOutputSchema>;

export const CompanySearchInputSchema = z
	.object({
		query: esQueryParam,
		sql: z.string().min(1).optional(),
		size: sizeParam,
		scroll_token: scrollTokenParam,
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(exactlyOneOf(['query', 'sql']));

export type CompanySearchInput = z.infer<typeof CompanySearchInputSchema>;

export const CompanySearchOutputSchema = z.object(SearchOutputShape);

export type CompanySearchOutput = z.infer<typeof CompanySearchOutputSchema>;

/**
 * Structured filters are combined with AND by the API; a raw Elasticsearch
 * query replaces them entirely ("if the query parameter is provided, all
 * Field Filters are ignored").
 */
const jobFilterShape = {
	id: z.string().optional(),
	title: z.string().min(1).optional(),
	company_website: z.string().min(1).optional(),
	location: z.string().min(1).optional(),
	salary_range_min: z.number().optional(),
	salary_range_max: z.number().optional(),
	remote_work_policy: z.string().min(1).optional(),
	inferred_skills: z.string().min(1).optional(),
	is_active: z.boolean().optional(),
} as const;

export const JobSearchInputSchema = z
	.object({
		...jobFilterShape,
		query: esQueryParam,
		size: sizeParam,
		scroll_token: scrollTokenParam,
		pretty: prettyParam,
	})
	.strict()
	.superRefine((input, ctx) => {
		// Object.keys widens to string[]; the keys come from jobFilterShape,
		// so the index stays inside input's own keys.
		const hasFilter = Object.keys(jobFilterShape).some(
			(key) => input[key as keyof typeof jobFilterShape] !== undefined,
		);
		const hasQuery = input.query !== undefined;
		if (hasFilter === hasQuery) {
			issue(ctx, 'exactly one of the structured filters or query is required');
		}
	});

export type JobSearchInput = z.infer<typeof JobSearchInputSchema>;

export const JobSearchOutputSchema = z.object({
	...SearchOutputShape,
	dataset_version: z.union([z.string(), z.number()]).optional(),
});

export type JobSearchOutput = z.infer<typeof JobSearchOutputSchema>;

/**
 * Per-item params are shape-checked only: PDL validates each request
 * server-side and answers inline with a per-item status.
 */
export const BulkPersonEnrichInputSchema = z
	.object({
		requests: z
			.array(
				z
					.object({
						params: UnknownRecord,
						metadata: UnknownRecord.optional(),
					})
					.strict(),
			)
			.min(1)
			.max(100),
		required: z.array(z.string()).optional(),
		include_if_matched: z.boolean().optional(),
	})
	.strict();

export type BulkPersonEnrichInput = z.infer<typeof BulkPersonEnrichInputSchema>;

export const BulkPersonEnrichOutputSchema = z.array(
	z.object({
		status: z.number(),
		likelihood: z.number().optional(),
		data: UnknownRecord.nullable().optional(),
		metadata: UnknownRecord.optional(),
		// Non-200 items carry the standard PDL error envelope instead of data.
		error: z
			.object({
				type: z.string().optional(),
				message: z.string().optional(),
			})
			.optional(),
	}),
);

export type BulkPersonEnrichOutput = z.infer<
	typeof BulkPersonEnrichOutputSchema
>;

export const CompanyEnrichInputSchema = z
	.object({
		pdl_id: z.string().optional(),
		name: z.string().min(1).optional(),
		profile: z.string().min(1).optional(),
		ticker: z.string().min(1).optional(),
		website: z.string().min(1).optional(),
		location: z.string().optional(),
		locality: z.string().optional(),
		region: z.string().optional(),
		country: z.string().optional(),
		street_address: z.string().optional(),
		postal_code: z.string().optional(),
		min_likelihood: z.number().int().min(1).max(10).optional(),
		include_if_matched: z.boolean().optional(),
		required: z.array(z.string()).optional(),
		data_include: z.array(z.string()).optional(),
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(atLeastOneOf(['name', 'ticker', 'website', 'profile']));

export type CompanyEnrichInput = z.infer<typeof CompanyEnrichInputSchema>;

// The company response is flat: company fields sit beside status and
// likelihood rather than under a data key. The endpoint reshapes the body
// into `company` at the boundary so both enrich endpoints share the
// found-discriminated shape.
export const CompanyEnrichOutputSchema = z.discriminatedUnion('found', [
	z.object({
		found: z.literal(true),
		status: z.number(),
		likelihood: z.number().min(1).max(10),
		company: UnknownRecord,
	}),
	z.object({
		found: z.literal(false),
	}),
]);

export type CompanyEnrichOutput = z.infer<typeof CompanyEnrichOutputSchema>;

export const PDL_IP_CONFIDENCES = [
	'very high',
	'high',
	'moderate',
	'low',
	'very low',
] as const;

export const IpEnrichInputSchema = z
	.object({
		ip: z.union([z.ipv4(), z.ipv6()]),
		return_ip_location: z.boolean().optional(),
		return_ip_metadata: z.boolean().optional(),
		return_if_unmatched: z.boolean().optional(),
		return_person: z.boolean().optional(),
		min_confidence: z.enum(PDL_IP_CONFIDENCES).optional(),
		pretty: prettyParam,
		titlecase: titlecaseParam,
	})
	.strict();

export type IpEnrichInput = z.infer<typeof IpEnrichInputSchema>;

export const IpEnrichOutputSchema = z.discriminatedUnion('found', [
	z.object({
		found: z.literal(true),
		status: z.number(),
		data: z.object({
			ip: z.object({
				address: z.string(),
				metadata: UnknownRecord.optional(),
				location: UnknownRecord.optional(),
			}),
			company: UnknownRecord.optional(),
			person: UnknownRecord.optional(),
		}),
		dataset_version: z.union([z.string(), z.number()]).optional(),
	}),
	z.object({
		found: z.literal(false),
	}),
]);

export type IpEnrichOutput = z.infer<typeof IpEnrichOutputSchema>;

export const AutocompleteInputSchema = z
	.object({
		field: z.string().min(1),
		text: z.string().default(''),
		size: sizeParam,
		titlecase: titlecaseParam,
		pretty: prettyParam,
	})
	.strict();

// z.input, not z.infer: text defaults on the wire, so callers may omit it.
export type AutocompleteInput = z.input<typeof AutocompleteInputSchema>;

export const AutocompleteOutputSchema = z.object({
	fields: z.array(z.string()),
	data: z.array(
		z.object({
			count: z.number().int(),
			name: z.string(),
			meta: UnknownRecord.optional(),
		}),
	),
	status: z.number(),
});

export type AutocompleteOutput = z.infer<typeof AutocompleteOutputSchema>;

const cleanerMatchShape = {
	name: z.string().min(1).optional(),
	website: z.string().min(1).optional(),
	profile: z.string().min(1).optional(),
} as const;

export const CompanyCleanInputSchema = z
	.object({
		...cleanerMatchShape,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(atLeastOneOf(['name', 'website', 'profile']));

export type CompanyCleanInput = z.infer<typeof CompanyCleanInputSchema>;

export const SchoolCleanInputSchema = z
	.object({
		...cleanerMatchShape,
		pretty: prettyParam,
	})
	.strict()
	.superRefine(atLeastOneOf(['name', 'website', 'profile']));

export type SchoolCleanInput = z.infer<typeof SchoolCleanInputSchema>;

export const LocationCleanInputSchema = z
	.object({
		location: z.string().min(1),
		pretty: prettyParam,
	})
	.strict();

export type LocationCleanInput = z.infer<typeof LocationCleanInputSchema>;

// Cleaner responses return the cleaned fields beside status; they are kept
// as a loose passthrough so consumers read whatever the API cleaned.
export const CompanyCleanOutputSchema = z.looseObject({
	status: z.number().optional(),
});

export type CompanyCleanOutput = z.infer<typeof CompanyCleanOutputSchema>;

export const SchoolCleanOutputSchema = z.looseObject({
	status: z.number().optional(),
});

export type SchoolCleanOutput = z.infer<typeof SchoolCleanOutputSchema>;

export const LocationCleanOutputSchema = z.looseObject({
	status: z.number().optional(),
});

export type LocationCleanOutput = z.infer<typeof LocationCleanOutputSchema>;

export type PdlEndpointInputs = {
	personEnrich: PersonEnrichInput;
	personSearch: PersonSearchInput;
	personIdentify: PersonIdentifyInput;
	personBulk: BulkPersonEnrichInput;
	companyEnrich: CompanyEnrichInput;
	companySearch: CompanySearchInput;
	companyClean: CompanyCleanInput;
	schoolClean: SchoolCleanInput;
	locationClean: LocationCleanInput;
	ipEnrich: IpEnrichInput;
	jobSearch: JobSearchInput;
	autocomplete: AutocompleteInput;
};

export type PdlEndpointOutputs = {
	personEnrich: PersonEnrichOutput;
	personSearch: PersonSearchOutput;
	personIdentify: PersonIdentifyOutput;
	personBulk: BulkPersonEnrichOutput;
	companyEnrich: CompanyEnrichOutput;
	companySearch: CompanySearchOutput;
	companyClean: CompanyCleanOutput;
	schoolClean: SchoolCleanOutput;
	locationClean: LocationCleanOutput;
	ipEnrich: IpEnrichOutput;
	jobSearch: JobSearchOutput;
	autocomplete: AutocompleteOutput;
};

export const PdlEndpointInputSchemas = {
	personEnrich: PersonEnrichInputSchema,
	personSearch: PersonSearchInputSchema,
	personIdentify: PersonIdentifyInputSchema,
	personBulk: BulkPersonEnrichInputSchema,
	companyEnrich: CompanyEnrichInputSchema,
	companySearch: CompanySearchInputSchema,
	companyClean: CompanyCleanInputSchema,
	schoolClean: SchoolCleanInputSchema,
	locationClean: LocationCleanInputSchema,
	ipEnrich: IpEnrichInputSchema,
	jobSearch: JobSearchInputSchema,
	autocomplete: AutocompleteInputSchema,
} as const;

export const PdlEndpointOutputSchemas = {
	personEnrich: PersonEnrichOutputSchema,
	personSearch: PersonSearchOutputSchema,
	personIdentify: PersonIdentifyOutputSchema,
	personBulk: BulkPersonEnrichOutputSchema,
	companyEnrich: CompanyEnrichOutputSchema,
	companySearch: CompanySearchOutputSchema,
	companyClean: CompanyCleanOutputSchema,
	schoolClean: SchoolCleanOutputSchema,
	locationClean: LocationCleanOutputSchema,
	ipEnrich: IpEnrichOutputSchema,
	jobSearch: JobSearchOutputSchema,
	autocomplete: AutocompleteOutputSchema,
} as const;
