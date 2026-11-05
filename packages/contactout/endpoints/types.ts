import { z } from 'zod';

// Shapes follow https://api.contactout.com/ (the API reference) and the
// responses the API returns for each documented example request.

const Text = z.string().nullable().optional();
const Count = z.number().nullable().optional();
const Strings = z.array(z.string()).optional();

const LinkedinProfileUrl = z
	.string()
	.regex(
		/^https?:\/\/.*linkedin\.com\/(in|pub)\//,
		'Expected a linkedin.com/in/ or linkedin.com/pub/ URL',
	);

/** Which ContactOut key to send: each key returns only its own email kind. */
export const EmailType = z.enum(['work', 'personal']);
export type EmailType = z.infer<typeof EmailType>;

const KeySelection = {
	emailType: EmailType.optional().describe(
		'Send the work-email key (default) or the personal-email key',
	),
};

const Funding = z.object({
	total_funding_usd: Count,
	rounds: z
		.array(
			z.object({
				funding_type: Text,
				announced_date: Text,
				investor_names: Strings,
				lead_investors: Strings,
				money_raised_usd: Count,
				number_of_investors: Count,
			}),
		)
		.optional(),
	funding_status: Text,
	latest_date: Text,
	number_of_funding_rounds: Count,
});

const CompanyLocation = z.union([
	z.string(),
	z.object({
		city: Text,
		line1: Text,
		line2: Text,
		state: Text,
		country: Text,
		postalCode: Text,
		description: Text,
		isPrimary: z.boolean().optional(),
	}),
]);

export const CompanySchema = z.object({
	name: Text,
	url: Text,
	li_vanity: Text,
	linkedin_company_id: Count,
	domain: Text,
	email_domain: Text,
	overview: Text,
	description: Text,
	type: Text,
	size: Count,
	country: Text,
	// Most endpoints return a number; domain enrich returns a label like "$5.4M".
	revenue: z.union([z.number(), z.string()]).nullable().optional(),
	founded_at: Count,
	industry: Text,
	headquarter: Text,
	website: Text,
	location: Text,
	logo_url: Text,
	specialties: Strings,
	technologies: Strings,
	locations: z.array(CompanyLocation).optional(),
	employees: Count,
	followers: Count,
	funding: Funding.nullable().optional(),
});

export type Company = z.infer<typeof CompanySchema>;

const DateRange = {
	start_date_year: z.union([z.number(), z.string()]).nullable().optional(),
	start_date_month: Count,
	end_date_year: z.union([z.number(), z.string()]).nullable().optional(),
	end_date_month: Count,
};

const Experience = z.object({
	title: Text,
	summary: Text,
	locality: Text,
	company_name: Text,
	linkedin_url: Text,
	domain: Text,
	logo_url: Text,
	start_date: Text,
	end_date: Text,
	is_current: z.boolean().nullable().optional(),
	...DateRange,
});

const Education = z.object({
	school_name: Text,
	degree: Text,
	field_of_study: Text,
	description: Text,
	url: Text,
	...DateRange,
});

const Certification = z.object({
	name: Text,
	title: Text,
	authority: Text,
	license: Text,
	...DateRange,
});

const Publication = z.object({
	url: Text,
	title: Text,
	description: Text,
	publisher: Text,
	authors: Strings,
	published_on_year: Count,
	published_on_month: Count,
	published_on_day: Count,
});

const Project = z.object({ title: Text, description: Text, ...DateRange });

const Volunteering = z.object({
	role: Text,
	company_name: Text,
	company_url: Text,
	cause: Text,
	company_id: Count,
	...DateRange,
});

const Language = z.object({ name: Text, proficiency: Text });

const ProfileDetails = {
	company: CompanySchema.nullable().optional(),
	location: Text,
	languages: z.array(Language).optional(),
	summary: Text,
	skills: Strings,
	certifications: z.array(Certification).optional(),
	publications: z.array(Publication).optional(),
	projects: z.array(Project).optional(),
	followers: Count,
	seniority: Text,
};

/** Profile returned by LinkedIn enrich and People enrich (snake_case). */
export const LinkedinProfileSchema = z.object({
	url: Text,
	email: Strings,
	work_email: Strings,
	personal_email: Strings,
	phone: Strings,
	github: Strings,
	twitter: Strings,
	full_name: Text,
	headline: Text,
	industry: Text,
	country: Text,
	experience: z.array(Experience).optional(),
	education: z.array(Education).optional(),
	volunteering_experiences: z.array(Volunteering).optional(),
	job_function: Text,
	work_status: Text,
	profile_picture_url: Text,
	updated_at: Text,
	...ProfileDetails,
});

export type LinkedinProfile = z.infer<typeof LinkedinProfileSchema>;

/** Profile returned by Email enrich (camelCase). */
export const EmailProfileSchema = z.object({
	email: Text,
	workEmail: Text,
	// Documented values: Verified, Unverified.
	workEmailStatus: Text,
	fullName: Text,
	headline: Text,
	industry: Text,
	linkedinUrl: Text,
	profilePictureUrl: Text,
	confidenceLevel: Text,
	altMatches: z.array(z.string()).optional(),
	phone: Text,
	twitter: Text,
	github: Text,
	experience: z.array(Experience).optional(),
	education: z.array(Education).optional(),
	volunteeringExperiences: z.array(Volunteering).optional(),
	jobFunction: Text,
	workStatus: Text,
	updatedAt: Text,
	...ProfileDetails,
});

export type EmailProfile = z.infer<typeof EmailProfileSchema>;

const ContactInfo = z.object({
	emails: Strings,
	personal_emails: Strings,
	work_emails: Strings,
	// Keyed by work email; documented values: Verified, Unverified.
	work_email_status: z.record(z.string(), z.string()).optional(),
	phones: Strings,
});

/** A profile row from People search and Decision makers. */
export const SearchProfileSchema = z.object({
	li_vanity: Text,
	full_name: Text,
	title: Text,
	headline: Text,
	industry: Text,
	country: Text,
	// Plain strings unless detailed_experience / detailed_education is set.
	experience: z.array(z.union([z.string(), Experience])).optional(),
	education: z.array(z.union([z.string(), Education])).optional(),
	volunteering_experiences: z.array(Volunteering).optional(),
	updated_at: Text,
	profile_picture_url: Text,
	job_function: Text,
	work_status: Text,
	contact_availability: z
		.object({
			personal_email: z.boolean().optional(),
			work_email: z.boolean().optional(),
			phone: z.boolean().optional(),
		})
		.optional(),
	contact_info: ContactInfo.optional(),
	...ProfileDetails,
});

export type SearchProfile = z.infer<typeof SearchProfileSchema>;

// A miss is `profile: []` on some endpoints and a 404 on others.
const NoProfile = z.tuple([]);

const PageMetadata = z.object({
	page: z.number(),
	page_size: z.number(),
	total_results: z.number(),
});

// Keyed by LinkedIn profile URL; an empty result is [].
const ProfilesByUrl = z.union([
	z.record(z.string(), SearchProfileSchema),
	z.tuple([]),
]);

// Inputs

const LinkedinEnrichInputSchema = z.object({
	profile: LinkedinProfileUrl,
	profile_only: z.boolean().optional(),
	...KeySelection,
});

const ContactInfoInputSchema = z.object({
	profile: LinkedinProfileUrl,
	include_phone: z.boolean().optional(),
	email_type: z.enum(['personal', 'work', 'personal,work', 'none']).optional(),
	...KeySelection,
});

const ProfileCheckInputSchema = z.object({ profile: LinkedinProfileUrl });

const EmailEnrichInputSchema = z.object({
	email: z.email(),
	include: z.literal('work_email').optional(),
	...KeySelection,
});

const EmailInputSchema = z.object({ email: z.email() });

const Limited = (max: number) => z.array(z.string().min(1)).min(1).max(max);

const PeopleEnrichInputSchema = z
	.object({
		linkedin_url: z.string().optional(),
		email: z.email().optional(),
		phone: z.string().optional(),
		full_name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company: Limited(10).optional(),
		company_domain: Limited(10).optional(),
		education: Limited(10).optional(),
		location: z.string().optional(),
		job_title: z.string().optional(),
		include: z
			.array(z.enum(['work_email', 'personal_email', 'phone']))
			.optional(),
		...KeySelection,
	})
	.refine(
		(input) => {
			if (input.linkedin_url || input.email || input.phone) return true;
			const named =
				input.full_name !== undefined ||
				(input.first_name !== undefined && input.last_name !== undefined);
			return (
				named &&
				Boolean(
					input.company ||
						input.company_domain ||
						input.education ||
						input.location,
				)
			);
		},
		{
			message:
				'Provide linkedin_url, email, or phone, or a name with company, company_domain, education, or location',
		},
	);

const SearchFilters = {
	name: z.string().optional(),
	job_title: Limited(50).optional(),
	past_job_title: Limited(50).optional(),
	exclude_job_titles: z.array(z.string()).optional(),
	job_function: Limited(50).optional(),
	seniority: Limited(50).optional(),
	current_titles_only: z.boolean().optional(),
	include_related_job_titles: z.boolean().optional(),
	match_experience: z.enum(['current', 'past', 'both']).optional(),
	skills: Limited(50).optional(),
	languages: z
		.array(
			z.object({
				language: z.string(),
				proficiency: z.array(z.string()).optional(),
			}),
		)
		.max(50)
		.optional(),
	education: Limited(50).optional(),
	educations: z
		.array(
			z.object({
				school_name: z.string().optional(),
				field_of_study: z.string().optional(),
				location: z.string().optional(),
			}),
		)
		.max(50)
		.optional(),
	location: Limited(50).optional(),
	location_radius: z.number().int().min(1).max(500).optional(),
	current_work_location: Limited(50).optional(),
	past_work_location: Limited(50).optional(),
	company: Limited(50).optional(),
	past_company: Limited(50).optional(),
	company_filter: z.enum(['current', 'past', 'past_only', 'both']).optional(),
	current_company_only: z.boolean().optional(),
	exclude_companies: z.array(z.string()).optional(),
	exclude_companies_filter: z.enum(['current', 'past', 'both']).optional(),
	domain: Limited(50).optional(),
	industry: Limited(50).optional(),
	keyword: z.string().optional(),
	company_size: z.array(z.string()).optional(),
	years_of_experience: z.array(z.string().regex(/^\d+(_\d+)?$/)).optional(),
	years_in_current_role: z.array(z.string().regex(/^\d+(_\d+)?$/)).optional(),
	recently_changed_jobs: z.boolean().optional(),
	is_currently_working: z.boolean().optional(),
};

const notBoth = (input: {
	recently_changed_jobs?: boolean;
	years_in_current_role?: string[];
}) => !(input.recently_changed_jobs && input.years_in_current_role);

const notBothMessage = {
	message: 'recently_changed_jobs cannot be used with years_in_current_role',
};

const PeopleSearchInputSchema = z
	.object({
		...SearchFilters,
		page: z.number().int().min(1).optional(),
		page_size: z.number().int().min(1).max(25).optional(),
		data_types: z
			.array(z.enum(['personal_email', 'work_email', 'phone']))
			.optional(),
		reveal_info: z.boolean().optional(),
		detailed_experience: z.boolean().optional(),
		detailed_education: z.boolean().optional(),
		output_fields: z.array(z.string()).optional(),
		...KeySelection,
	})
	.refine(notBoth, notBothMessage);

const PeopleCountInputSchema = z
	.object(SearchFilters)
	.refine(notBoth, notBothMessage);

const DecisionMakersInputSchema = z
	.object({
		linkedin_url: z.string().optional(),
		domain: z.string().optional(),
		name: z.string().optional(),
		page: z.number().int().min(1).optional(),
		reveal_info: z.boolean().optional(),
		...KeySelection,
	})
	.refine((input) => input.linkedin_url || input.domain || input.name, {
		message: 'Provide linkedin_url, domain, or name',
	});

const CompanySearchInputSchema = z
	.object({
		linkedin_url: Limited(25).optional(),
		name: Limited(50).optional(),
		domain: Limited(50).optional(),
		size: z.array(z.string()).optional(),
		hq_only: z.boolean().optional(),
		location: Limited(50).optional(),
		industries: Limited(50).optional(),
		technologies: Limited(50).optional(),
		min_revenue: z.number().int().min(0).optional(),
		max_revenue: z.number().int().min(0).optional(),
		year_founded_from: z.number().int().min(1985).optional(),
		year_founded_to: z.number().int().optional(),
		page: z.number().int().min(1).optional(),
	})
	.refine(
		(input) =>
			!input.linkedin_url ||
			Object.entries(input).every(
				([key, value]) =>
					key === 'linkedin_url' || key === 'page' || value === undefined,
			),
		{ message: 'linkedin_url cannot be combined with other filters' },
	)
	.refine((input) => !input.year_founded_to || input.year_founded_from, {
		message: 'year_founded_to requires year_founded_from',
	});

const EnrichDomainsInputSchema = z.object({
	domains: z.array(z.string().min(3)).min(1).max(30),
});

const StatsInputSchema = z.object({
	period: z
		.string()
		.regex(/^\d{4}-\d{2}$/, 'Expected YYYY-MM')
		.optional(),
});

// Outputs

const Status = { status_code: z.number() };

const LinkedinEnrichResponseSchema = z.object({
	...Status,
	profile: z.union([LinkedinProfileSchema, NoProfile]),
});

const ContactInfoResponseSchema = z.object({
	...Status,
	profile: z.object({
		url: Text,
		email: Strings,
		work_email: Strings,
		work_email_status: z.record(z.string(), z.string()).optional(),
		personal_email: Strings,
		phone: Strings,
		github: Strings,
	}),
});

const WorkEmailStatusResponseSchema = z.object({
	...Status,
	profile: z.object({
		email: z.boolean(),
		// Documented values: Verified, Unverified, or null.
		email_status: Text,
	}),
});

const PersonalEmailStatusResponseSchema = z.object({
	...Status,
	profile: z.object({ email: z.boolean() }),
});

const PhoneStatusResponseSchema = z.object({
	...Status,
	profile: z.object({ phone: z.boolean() }),
});

const EmailEnrichResponseSchema = z.object({
	...Status,
	profile: EmailProfileSchema,
});

const EmailVerifyResponseSchema = z.object({
	...Status,
	data: z.object({
		status: z.enum(['valid', 'invalid', 'accept_all', 'disposable', 'unknown']),
	}),
});

const EmailToLinkedinResponseSchema = z.object({
	...Status,
	profile: z.object({ email: Text, linkedin: Text }),
});

const PeopleEnrichResponseSchema = z.object({
	...Status,
	profile: LinkedinProfileSchema,
});

const PeopleSearchResponseSchema = z.object({
	...Status,
	metadata: PageMetadata,
	profiles: ProfilesByUrl,
});

const PeopleCountResponseSchema = z.object({
	...Status,
	total_results: z.number(),
	estimated_personal_emails: Count,
	estimated_work_emails: Count,
	estimated_phones: Count,
});

const CompanySearchResponseSchema = z.object({
	...Status,
	metadata: PageMetadata,
	companies: z.array(CompanySchema),
});

// A domain with no match maps to {}.
const CompaniesByDomain = z.record(z.string(), CompanySchema);

const EnrichDomainsResponseSchema = z.object({
	...Status,
	// The reference documents an object keyed by domain; the API has also
	// returned it wrapped in an array.
	companies: z.union([CompaniesByDomain, z.array(CompaniesByDomain)]),
});

const StatsResponseSchema = z.object({
	...Status,
	period: z.object({ start: z.string(), end: z.string() }),
	usage: z.object({
		count: z.number(),
		quota: z.number(),
		remaining: Count,
		over_quota: Count,
		phone_count: z.number(),
		phone_quota: z.number(),
		phone_remaining: Count,
		phone_over_quota: Count,
		search_count: z.number(),
		search_quota: z.number(),
		search_remaining: Count,
		search_over_quota: Count,
	}),
});

export type LinkedinEnrichInput = z.infer<typeof LinkedinEnrichInputSchema>;
export type LinkedinEnrichResponse = z.infer<
	typeof LinkedinEnrichResponseSchema
>;
export type ContactInfoInput = z.infer<typeof ContactInfoInputSchema>;
export type ContactInfoResponse = z.infer<typeof ContactInfoResponseSchema>;
export type ProfileCheckInput = z.infer<typeof ProfileCheckInputSchema>;
export type WorkEmailStatusResponse = z.infer<
	typeof WorkEmailStatusResponseSchema
>;
export type PersonalEmailStatusResponse = z.infer<
	typeof PersonalEmailStatusResponseSchema
>;
export type PhoneStatusResponse = z.infer<typeof PhoneStatusResponseSchema>;
export type EmailEnrichInput = z.infer<typeof EmailEnrichInputSchema>;
export type EmailEnrichResponse = z.infer<typeof EmailEnrichResponseSchema>;
export type EmailInput = z.infer<typeof EmailInputSchema>;
export type EmailVerifyResponse = z.infer<typeof EmailVerifyResponseSchema>;
export type EmailToLinkedinResponse = z.infer<
	typeof EmailToLinkedinResponseSchema
>;
export type PeopleEnrichInput = z.infer<typeof PeopleEnrichInputSchema>;
export type PeopleEnrichResponse = z.infer<typeof PeopleEnrichResponseSchema>;
export type PeopleSearchInput = z.infer<typeof PeopleSearchInputSchema>;
export type PeopleSearchResponse = z.infer<typeof PeopleSearchResponseSchema>;
export type PeopleCountInput = z.infer<typeof PeopleCountInputSchema>;
export type PeopleCountResponse = z.infer<typeof PeopleCountResponseSchema>;
export type DecisionMakersInput = z.infer<typeof DecisionMakersInputSchema>;
export type DecisionMakersResponse = z.infer<typeof PeopleSearchResponseSchema>;
export type CompanySearchInput = z.infer<typeof CompanySearchInputSchema>;
export type CompanySearchResponse = z.infer<typeof CompanySearchResponseSchema>;
export type EnrichDomainsInput = z.infer<typeof EnrichDomainsInputSchema>;
export type EnrichDomainsResponse = z.infer<typeof EnrichDomainsResponseSchema>;
export type StatsInput = z.infer<typeof StatsInputSchema>;
export type StatsResponse = z.infer<typeof StatsResponseSchema>;

export type ContactOutEndpointInputs = {
	linkedinEnrich: LinkedinEnrichInput;
	linkedinContactInfo: ContactInfoInput;
	linkedinWorkEmailStatus: ProfileCheckInput;
	linkedinPersonalEmailStatus: ProfileCheckInput;
	linkedinPhoneStatus: ProfileCheckInput;
	emailEnrich: EmailEnrichInput;
	emailVerify: EmailInput;
	emailToLinkedin: EmailInput;
	peopleEnrich: PeopleEnrichInput;
	peopleSearch: PeopleSearchInput;
	peopleCount: PeopleCountInput;
	peopleDecisionMakers: DecisionMakersInput;
	companySearch: CompanySearchInput;
	companyEnrichDomains: EnrichDomainsInput;
	accountStats: StatsInput;
};

export type ContactOutEndpointOutputs = {
	linkedinEnrich: LinkedinEnrichResponse;
	linkedinContactInfo: ContactInfoResponse;
	linkedinWorkEmailStatus: WorkEmailStatusResponse;
	linkedinPersonalEmailStatus: PersonalEmailStatusResponse;
	linkedinPhoneStatus: PhoneStatusResponse;
	emailEnrich: EmailEnrichResponse;
	emailVerify: EmailVerifyResponse;
	emailToLinkedin: EmailToLinkedinResponse;
	peopleEnrich: PeopleEnrichResponse;
	peopleSearch: PeopleSearchResponse;
	peopleCount: PeopleCountResponse;
	peopleDecisionMakers: DecisionMakersResponse;
	companySearch: CompanySearchResponse;
	companyEnrichDomains: EnrichDomainsResponse;
	accountStats: StatsResponse;
};

export const ContactOutEndpointInputSchemas = {
	linkedinEnrich: LinkedinEnrichInputSchema,
	linkedinContactInfo: ContactInfoInputSchema,
	linkedinWorkEmailStatus: ProfileCheckInputSchema,
	linkedinPersonalEmailStatus: ProfileCheckInputSchema,
	linkedinPhoneStatus: ProfileCheckInputSchema,
	emailEnrich: EmailEnrichInputSchema,
	emailVerify: EmailInputSchema,
	emailToLinkedin: EmailInputSchema,
	peopleEnrich: PeopleEnrichInputSchema,
	peopleSearch: PeopleSearchInputSchema,
	peopleCount: PeopleCountInputSchema,
	peopleDecisionMakers: DecisionMakersInputSchema,
	companySearch: CompanySearchInputSchema,
	companyEnrichDomains: EnrichDomainsInputSchema,
	accountStats: StatsInputSchema,
} as const;

export const ContactOutEndpointOutputSchemas = {
	linkedinEnrich: LinkedinEnrichResponseSchema,
	linkedinContactInfo: ContactInfoResponseSchema,
	linkedinWorkEmailStatus: WorkEmailStatusResponseSchema,
	linkedinPersonalEmailStatus: PersonalEmailStatusResponseSchema,
	linkedinPhoneStatus: PhoneStatusResponseSchema,
	emailEnrich: EmailEnrichResponseSchema,
	emailVerify: EmailVerifyResponseSchema,
	emailToLinkedin: EmailToLinkedinResponseSchema,
	peopleEnrich: PeopleEnrichResponseSchema,
	peopleSearch: PeopleSearchResponseSchema,
	peopleCount: PeopleCountResponseSchema,
	peopleDecisionMakers: PeopleSearchResponseSchema,
	companySearch: CompanySearchResponseSchema,
	companyEnrichDomains: EnrichDomainsResponseSchema,
	accountStats: StatsResponseSchema,
} as const;
