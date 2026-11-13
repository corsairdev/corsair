import { z } from 'zod';

/**
 * Every Gender API result names the sanitized form of the name it looked up and
 * scores it with `samples` and `accuracy`. `gender` is `male`, `female` or
 * `unknown`, and `errno` is 0 on a good answer.
 */
const ResultSchema = z.object({
	/** The submitted name: lower case for one name, as sent inside a multi result. */
	name: z.string(),
	/** The name after Gender API's normalizer ran. */
	name_sanitized: z.string().optional(),
	/** `male`, `female` or `unknown`. */
	gender: z.string(),
	/** Records in the database that match the request. */
	samples: z.number(),
	/** Reliability of the database for this name, 0 to 100. */
	accuracy: z.number(),
	/** Present only when the request was localized. */
	country: z.string().optional(),
	/** Time the server took, such as `41ms`. */
	duration: z.string().optional(),
	/** Requests this call cost. */
	credits_used: z.number().optional(),
	/** 0 on a good answer. */
	errno: z.number().optional(),
	errmsg: z.string().optional(),
});

const CountryCodeSchema = z
	.string()
	.length(2, 'Use a two-letter ISO 3166-1 alpha-2 country code, such as US')
	.describe('Two-letter ISO 3166-1 alpha-2 country code, such as US or IT');

const LocaleSchema = z
	.string()
	.min(2)
	.describe(
		'Browser locale such as en_US, which Gender API turns into a country',
	);

// Gender API ignores an address it cannot read and answers unlocalized, so a
// typo would come back as a plain answer that looks localized.
const IpSchema = z
	.union([z.ipv4(), z.ipv6()])
	.describe('A valid IPv4 or IPv6 address, used to infer the country');

const NameInputSchema = z.object({
	name: z
		.string()
		.min(1, 'A name is required')
		.describe('The first name to look up'),
	country: CountryCodeSchema.optional().describe(
		'Localizes the answer, which changes it for names such as Andrea: male in Italy, female in Germany',
	),
	locale: LocaleSchema.optional().describe(
		'Localizes by browser locale instead of an explicit country',
	),
	ip: IpSchema.optional().describe(
		'Localizes by the customer IP address instead of an explicit country',
	),
});

const MultiInputSchema = z.object({
	names: z
		.array(
			z
				.string()
				.min(1, 'A name cannot be empty')
				// Gender API splits the batch on semicolons, so one name holding one
				// would come back as several rows and shift every answer after it.
				.refine((value) => !value.includes(';'), {
					message: 'A name cannot contain a semicolon',
				}),
		)
		.min(1, 'Send at least one name')
		.max(100, 'Gender API accepts at most 100 names at once')
		.describe('Names to look up together, answered in the same order'),
	countries: z
		.array(z.string().length(2))
		.optional()
		.describe(
			'One country code per name, in the same order. A single code applies to every name',
		),
});

const EmailInputSchema = z.object({
	email: z
		.string()
		.min(3)
		.describe('An email address that contains a first name'),
	country: CountryCodeSchema.optional().describe('Localizes the answer'),
});

const FullNameInputSchema = z.object({
	split: z
		.string()
		.min(1, 'A full name is required')
		.describe(
			'The full name to split into first and last name before the lookup',
		),
	country: CountryCodeSchema.optional().describe('Localizes the answer'),
	strict: z
		.boolean()
		.optional()
		.describe(
			'When true, returns a null last name if it is not in the database; when false, tries to extract it anyway',
		),
});

const CountryOfOriginInputSchema = z.object({
	name: z
		.string()
		.min(1, 'A name is required')
		.describe('The first name to look up'),
});

const StatsInputSchema = z.object({});

const MultiResponseSchema = z.object({
	/** The semicolon-joined names that were sent. */
	name: z.string(),
	result: z.array(ResultSchema),
	country: z.string().optional(),
	duration: z.string().optional(),
	credits_used: z.number().optional(),
});

const EmailResultSchema = ResultSchema.extend({
	email: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	mail_provider: z.string().optional(),
});

const FullNameResultSchema = ResultSchema.extend({
	first_name: z.string(),
	/**
	 * Null when `strict` is true and the last name is not in the database. The
	 * API itself sends an empty string; the endpoint turns that into null.
	 */
	last_name: z.string().nullable().optional(),
	strict: z.boolean().optional(),
});

/**
 * The live route answers these in snake_case (`country_name`,
 * `continental_region`, `statistical_region`), while the reference shows them
 * in camelCase. Both spellings are optional so either one parses.
 */
const CountryOfOriginEntrySchema = z.object({
	country_name: z.string().optional(),
	/** `--` for the catch-all entry. */
	country: z.string(),
	probability: z.number(),
	continental_region: z.string().optional(),
	statistical_region: z.string().optional(),
	/** The reference's spelling of `country_name`. */
	countryName: z.string().optional(),
	continentalRegion: z.string().optional(),
	statisticalRegion: z.string().optional(),
});

const CountryOfOriginResponseSchema = z.object({
	name: z.string(),
	country_of_origin: z.array(CountryOfOriginEntrySchema),
	name_sanitized: z.string().optional(),
	gender: z.string().optional(),
	samples: z.number().optional(),
	accuracy: z.number().optional(),
	/** A link to a map image, when Gender API offers one. */
	country_of_origin_map_url: z.string().optional(),
	credits_used: z.number().optional(),
	duration: z.string().optional(),
});

// The route also echoes the account's server key as `key`. It is left out so
// the secret never reaches an agent through a read operation; zod drops it.
const StatsResponseSchema = z.object({
	/** True when no requests are left. */
	is_limit_reached: z.boolean(),
	remaining_requests: z.number(),
	/** Requests left at the start of the month. */
	amount_month_start: z.number().optional(),
	/** Requests bought this month. */
	amount_month_bought: z.number().optional(),
	duration: z.string().optional(),
});

export type GenderApiNameInput = z.infer<typeof NameInputSchema>;
export type GenderApiNameResponse = z.infer<typeof ResultSchema>;
export type GenderApiMultiInput = z.infer<typeof MultiInputSchema>;
export type GenderApiMultiResponse = z.infer<typeof MultiResponseSchema>;
export type GenderApiEmailInput = z.infer<typeof EmailInputSchema>;
export type GenderApiEmailResponse = z.infer<typeof EmailResultSchema>;
export type GenderApiFullNameInput = z.infer<typeof FullNameInputSchema>;
export type GenderApiFullNameResponse = z.infer<typeof FullNameResultSchema>;
export type GenderApiCountryOfOriginInput = z.infer<
	typeof CountryOfOriginInputSchema
>;
export type GenderApiCountryOfOriginResponse = z.infer<
	typeof CountryOfOriginResponseSchema
>;
export type GenderApiStatsInput = z.infer<typeof StatsInputSchema>;
export type GenderApiStatsResponse = z.infer<typeof StatsResponseSchema>;
export type GenderApiCountryOfOriginEntry = z.infer<
	typeof CountryOfOriginEntrySchema
>;

export type GenderApiEndpointInputs = {
	name: GenderApiNameInput;
	multi: GenderApiMultiInput;
	email: GenderApiEmailInput;
	fullName: GenderApiFullNameInput;
	countryOfOrigin: GenderApiCountryOfOriginInput;
	stats: GenderApiStatsInput;
};

export type GenderApiEndpointOutputs = {
	name: GenderApiNameResponse;
	multi: GenderApiMultiResponse;
	email: GenderApiEmailResponse;
	fullName: GenderApiFullNameResponse;
	countryOfOrigin: GenderApiCountryOfOriginResponse;
	stats: GenderApiStatsResponse;
};

export const GenderApiEndpointInputSchemas = {
	name: NameInputSchema,
	multi: MultiInputSchema,
	email: EmailInputSchema,
	fullName: FullNameInputSchema,
	countryOfOrigin: CountryOfOriginInputSchema,
	stats: StatsInputSchema,
} as const;

export const GenderApiEndpointOutputSchemas = {
	name: ResultSchema,
	multi: MultiResponseSchema,
	email: EmailResultSchema,
	fullName: FullNameResultSchema,
	countryOfOrigin: CountryOfOriginResponseSchema,
	stats: StatsResponseSchema,
} as const;
