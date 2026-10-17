import { z } from 'zod';

// Endpoint shapes mirror the Hunter.io API v2 as documented at
// https://hunter.io/api-documentation/v2 and described by the machine-readable
// OpenAPI document at https://hunter.io/openapi.json. Several sections are
// marked Beta and the docs warn their response formats may change, so response
// objects are modelled loosely (optional fields, `.passthrough()`) and only
// the fields the docs actually promise are required.

// ── Shared helpers ──────────────────────────────────────────────────────────

// `meta` accompanies most responses. `params` echoes the request parameters
// and its shape differs per endpoint (docs examples show strings, numbers,
// arrays and nulls), so it stays wire-JSON `unknown`: we never read into it.
export const MetaSchema = z
	.object({
		total: z.number().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		results: z.number().optional(),
		params: z.unknown().optional(),
	})
	.passthrough();

// Most write endpoints return `{ data, meta? }`; newer Beta endpoints also
// include a top-level `status: "success"`. `status` stays optional so both
// envelope styles parse.
const envelope = <T extends z.ZodType>(data: T) =>
	z
		.object({
			status: z.string().optional(),
			data,
			meta: MetaSchema.optional(),
		})
		.passthrough();

// OpenAPI declares these operations as bare `generic_resource_response`
// (status/data/meta all optional) without endpoint-specific schemas and the
// docs publish no field list: any documented body must parse unchanged.
export const GenericResourceResponseSchema = z
	.object({
		status: z.string().optional(),
		data: z.unknown().optional(),
		meta: MetaSchema.optional(),
	})
	.passthrough();

export type GenericResourceResponse = z.infer<
	typeof GenericResourceResponseSchema
>;

// Hunter ids appear as integers in docs examples while the OpenAPI document
// types path identifiers as strings; both forms are accepted and stringified
// when a request builds its path.
export const IdSchema = z.union([z.number(), z.string()]);

const paginationFields = {
	limit: z.number().int().min(1).optional(),
	offset: z.number().int().min(0).optional(),
};

// ── Account ─────────────────────────────────────────────────────────────────

export const AccountRequestBucketSchema = z
	.object({
		used: z.number().optional(),
		available: z.number().optional(),
		remaining: z.number().optional(),
		over_quota: z.number().optional(),
	})
	.passthrough();

export const AccountRequestsSchema = z
	.object({
		credits: AccountRequestBucketSchema.optional(),
		searches: AccountRequestBucketSchema.optional(),
		verifications: AccountRequestBucketSchema.optional(),
	})
	.passthrough();

export const AccountSchema = z
	.object({
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		email: z.string().optional(),
		plan_name: z.string().optional(),
		plan_level: z.number().optional(),
		reset_date: z.string().optional(),
		team_id: z.number().optional(),
		requests: AccountRequestsSchema.optional(),
		// Deprecated legacy counters; kept so documented responses parse.
		calls: z
			.object({
				_deprecation_notice: z.string().optional(),
				used: z.number().optional(),
				available: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const AccountGetInputSchema = z.object({}).passthrough();
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountGetOutputSchema = envelope(AccountSchema);
export type AccountGetOutput = z.infer<typeof AccountGetOutputSchema>;

// PUT /account: the OpenAPI spec declares no request body or parameters and
// the docs do not enumerate the writable fields; first_name/last_name are the
// only profile fields the account object exposes as editable.
export const AccountUpdateInputSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
});
export type AccountUpdateInput = z.infer<typeof AccountUpdateInputSchema>;

export const AccountUpdateOutputSchema = z.undefined();
export type AccountUpdateOutput = z.infer<typeof AccountUpdateOutputSchema>;

// GET /account-stats: docs describe "identity, plan, and most used source"
// but publish no field table, so the generic envelope is the honest shape.
export const AccountStatsGetInputSchema = z.object({}).passthrough();
export type AccountStatsGetInput = z.infer<typeof AccountStatsGetInputSchema>;

export const AccountStatsGetOutputSchema = GenericResourceResponseSchema;
export type AccountStatsGetOutput = z.infer<typeof AccountStatsGetOutputSchema>;

// ── Usage ───────────────────────────────────────────────────────────────────

export const UsageGetInputSchema = z.object({
	show_overage_requests: z.boolean().optional(),
});
export type UsageGetInput = z.infer<typeof UsageGetInputSchema>;

export const UsageGetOutputSchema = envelope(
	z
		.object({
			reset_date: z.string().optional(),
			requests: AccountRequestsSchema.optional(),
		})
		.passthrough(),
);
export type UsageGetOutput = z.infer<typeof UsageGetOutputSchema>;

export const UsageHistoryGetInputSchema = z.object({
	...paginationFields,
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	user_id: z.number().int().optional(),
});
export type UsageHistoryGetInput = z.infer<typeof UsageHistoryGetInputSchema>;

export const UsageHistoryEntrySchema = z
	.object({
		id: z.number().optional(),
		type: z.string().optional(),
		product: z.string().optional(),
		source: z.string().optional(),
		credits: z.number().optional(),
		free: z.boolean().optional(),
		made_at: z.string().optional(),
		made_by: z
			.object({
				id: z.number().optional(),
				first_name: z.string().nullable().optional(),
				last_name: z.string().nullable().optional(),
				api_key_name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		request: z
			.object({
				url: z.string().optional(),
				ip: z.string().nullable().optional(),
				user_agent: z.string().nullable().optional(),
				filters: z.unknown().optional(),
				bulk_search_id: z.number().nullable().optional(),
				bulk_finder_id: z.number().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const UsageHistoryGetOutputSchema = envelope(
	z.array(UsageHistoryEntrySchema),
);
export type UsageHistoryGetOutput = z.infer<typeof UsageHistoryGetOutputSchema>;

// ── Team members ────────────────────────────────────────────────────────────

export const TeamMembersListInputSchema = z.object({
	...paginationFields,
});
export type TeamMembersListInput = z.infer<typeof TeamMembersListInputSchema>;

export const TeamMemberSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

export const TeamMembersListOutputSchema = envelope(z.array(TeamMemberSchema));
export type TeamMembersListOutput = z.infer<typeof TeamMembersListOutputSchema>;

// ── API keys ────────────────────────────────────────────────────────────────

export const ApiKeySchema = z
	.object({
		id: z.number().optional(),
		name: z.string().nullable().optional(),
		// Full token on create; masked (last 4 characters) on every other call.
		token: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const ApiKeysListInputSchema = z.object({}).passthrough();
export type ApiKeysListInput = z.infer<typeof ApiKeysListInputSchema>;

export const ApiKeysListOutputSchema = envelope(z.array(ApiKeySchema));
export type ApiKeysListOutput = z.infer<typeof ApiKeysListOutputSchema>;

export const ApiKeysCreateInputSchema = z.object({
	name: z.string().max(255).optional(),
});
export type ApiKeysCreateInput = z.infer<typeof ApiKeysCreateInputSchema>;

export const ApiKeysCreateOutputSchema = envelope(ApiKeySchema);
export type ApiKeysCreateOutput = z.infer<typeof ApiKeysCreateOutputSchema>;

export const ApiKeysUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().max(255),
});
export type ApiKeysUpdateInput = z.infer<typeof ApiKeysUpdateInputSchema>;

export const ApiKeysUpdateOutputSchema = envelope(ApiKeySchema);
export type ApiKeysUpdateOutput = z.infer<typeof ApiKeysUpdateOutputSchema>;

export const ApiKeysReplaceInputSchema = ApiKeysUpdateInputSchema;
export type ApiKeysReplaceInput = z.infer<typeof ApiKeysReplaceInputSchema>;

export const ApiKeysReplaceOutputSchema = envelope(ApiKeySchema);
export type ApiKeysReplaceOutput = z.infer<typeof ApiKeysReplaceOutputSchema>;

export const ApiKeysDeleteInputSchema = z.object({ id: IdSchema });
export type ApiKeysDeleteInput = z.infer<typeof ApiKeysDeleteInputSchema>;

export const ApiKeysDeleteOutputSchema = z.undefined();
export type ApiKeysDeleteOutput = z.infer<typeof ApiKeysDeleteOutputSchema>;

// ── Feedback ────────────────────────────────────────────────────────────────

export const FeedbackCreateInputSchema = z.object({
	feedback_type: z.enum([
		'missing_endpoint',
		'incorrect_documentation',
		'unexpected_response',
		'bug',
		'data_quality',
		'confusing_behavior',
		'feature_request',
		'other',
	]),
	summary: z.string().max(200),
	details: z.string(),
	endpoint: z.string().optional(),
	expected: z.string().optional(),
	actual: z.string().optional(),
	request_example: z.string().optional(),
	response_example: z.string().optional(),
	severity: z.enum(['low', 'medium', 'high', 'blocking']).optional(),
	agent: z.string().optional(),
});
export type FeedbackCreateInput = z.infer<typeof FeedbackCreateInputSchema>;

export const FeedbackCreateOutputSchema = envelope(
	z
		.object({
			id: z.number().optional(),
			status: z.string().optional(),
			feedback_type: z.string().optional(),
			severity: z.string().optional(),
			message: z.string().optional(),
		})
		.passthrough(),
);
export type FeedbackCreateOutput = z.infer<typeof FeedbackCreateOutputSchema>;

// ── Connected apps ──────────────────────────────────────────────────────────

export const ConnectedAppAttributeMappingSchema = z
	.object({
		target_field: z.string().optional(),
		source_field: z.string().optional(),
		// Present only when two-way CRM sync is available.
		direction: z.string().optional(),
		conflict_policy: z.string().optional(),
	})
	.passthrough();

export const ConnectedAppSchema = z
	.object({
		id: z.number().optional(),
		provider: z.string().optional(),
		name: z.string().optional(),
		category: z.string().optional(),
		provider_email: z.string().nullable().optional(),
		connected_at: z.string().optional(),
		updated_at: z.string().optional(),
		attribute_mappings: z.array(ConnectedAppAttributeMappingSchema).optional(),
	})
	.passthrough();

export const ConnectedAppsListInputSchema = z.object({
	...paginationFields,
});
export type ConnectedAppsListInput = z.infer<
	typeof ConnectedAppsListInputSchema
>;

export const ConnectedAppsListOutputSchema = envelope(
	z.array(ConnectedAppSchema),
);
export type ConnectedAppsListOutput = z.infer<
	typeof ConnectedAppsListOutputSchema
>;

export const ConnectedAppsGetInputSchema = z.object({ id: IdSchema });
export type ConnectedAppsGetInput = z.infer<typeof ConnectedAppsGetInputSchema>;

export const ConnectedAppsGetOutputSchema = envelope(ConnectedAppSchema);
export type ConnectedAppsGetOutput = z.infer<
	typeof ConnectedAppsGetOutputSchema
>;

export const ConnectedAppsPushInputSchema = z
	.object({
		id: IdSchema,
		lead_ids: z.array(z.number().int()).optional(),
		leads_list_id: IdSchema.optional(),
	})
	.refine(
		(value) =>
			value.lead_ids !== undefined || value.leads_list_id !== undefined,
		{
			message: 'Provide lead_ids or leads_list_id',
		},
	);
export type ConnectedAppsPushInput = z.infer<
	typeof ConnectedAppsPushInputSchema
>;

export const ConnectedAppsPushOutputSchema = envelope(
	z
		.object({
			connected_app_id: z.number().optional(),
			provider: z.string().optional(),
			leads_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type ConnectedAppsPushOutput = z.infer<
	typeof ConnectedAppsPushOutputSchema
>;

// ── Discover ────────────────────────────────────────────────────────────────

// Shared location filter item used by Discover and Domain Search (`location`
// on Domain Search is POST-only). Values are validated server-side against
// Hunter's live taxonomies; unknown values are rejected per endpoint docs.
export const LocationItemSchema = z.object({
	continent: z.string().optional(),
	business_region: z.string().optional(),
	country: z.string().optional(),
	state: z.string().optional(),
	city: z.string().optional(),
});

const locationFilterFields = {
	include: z.array(LocationItemSchema).optional(),
	exclude: z.array(LocationItemSchema).optional(),
};

const includeExcludeFields = {
	include: z.array(z.string()).optional(),
	exclude: z.array(z.string()).optional(),
};

export const DiscoverCompanyTypeValues = [
	'educational',
	'educational institution',
	'government agency',
	'non profit',
	'partnership',
	'privately held',
	'public company',
	'self employed',
	'self owned',
	'sole proprietorship',
] as const;

export const DiscoverHeadcountValues = [
	'1-10',
	'11-50',
	'51-200',
	'201-500',
	'501-1000',
	'1001-5000',
	'5001-10000',
	'10001+',
] as const;

export const DiscoverFundingSeriesValues = [
	'pre_seed',
	'seed',
	'pre_series_a',
	'series_a',
	'pre_series_b',
	'series_b',
	'pre_series_c',
	'series_c+',
	'other',
] as const;

// The Discover filter set (also used by /domain-count, /discover/people and
// the saved-search payload). Requirement: `query` or at least one filter.
export const DiscoverFiltersSchema = z.object({
	query: z.string().optional(),
	organization: z
		.object({
			domain: z.array(z.string()).optional(),
			name: z.array(z.string()).optional(),
		})
		.optional(),
	headquarters_location: z.object(locationFilterFields).optional(),
	industry: z.object(includeExcludeFields).optional(),
	headcount: z.array(z.enum(DiscoverHeadcountValues)).optional(),
	company_type: z.object(includeExcludeFields).optional(),
	keywords: z
		.object({
			...includeExcludeFields,
			match: z.enum(['all', 'any']).optional(),
		})
		.optional(),
	year_founded: z
		.object({
			...includeExcludeFields,
			include: z.array(z.number().int()).optional(),
			exclude: z.array(z.number().int()).optional(),
			from: z.number().int().optional(),
			to: z.number().int().optional(),
		})
		.optional(),
	technology: z
		.object({
			...includeExcludeFields,
			match: z.enum(['all', 'any']).optional(),
		})
		.optional(),
	funding: z
		.object({
			series: z.array(z.enum(DiscoverFundingSeriesValues)).optional(),
			amount: z
				.object({
					from: z.number().optional(),
					to: z.number().optional(),
				})
				.optional(),
			date: z
				.object({
					from: z.string().optional(),
					to: z.string().optional(),
				})
				.optional(),
			received: z.boolean().optional(),
		})
		.optional(),
	job_openings: z
		.object({
			hiring: z.boolean().optional(),
			department: z.array(z.string()).optional(),
			job_title: z.object(includeExcludeFields).optional(),
			posted_date: z.enum(['last7d', 'last30d', 'last90d']).optional(),
			open_roles: z
				.object({
					from: z.number().int().optional(),
					to: z.number().int().optional(),
				})
				.optional(),
			include_closed_roles: z.boolean().optional(),
		})
		.optional(),
	similar_to: z
		.object({
			domain: z.string().optional(),
			organization: z.string().optional(),
		})
		.optional(),
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).max(10000).optional(),
});

export const DiscoverCompanySchema = z
	.object({
		domain: z.string().optional(),
		organization: z.string().optional(),
		emails_count: z
			.object({
				personal: z.number().optional(),
				generic: z.number().optional(),
				total: z.number().optional(),
			})
			.passthrough()
			.optional(),
		already_saved: z.boolean().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		company_type: z.string().nullable().optional(),
		headcount: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		keywords: z.array(z.string()).optional(),
		description: z.string().nullable().optional(),
		year_founded: z.number().nullable().optional(),
		socials: z
			.object({
				facebook: z.string().nullable().optional(),
				instagram: z.string().nullable().optional(),
				twitter: z.string().nullable().optional(),
				youtube: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		technologies: z.array(z.string()).optional(),
		technology_details: z
			.array(
				z
					.object({
						category: z.string().optional(),
						category_label: z.string().optional(),
						name: z.string().optional(),
						slug: z.string().optional(),
						website: z.string().nullable().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

// `meta.filters` echoes the resolved filter set (natural-language queries are
// resolved server-side) and `meta.permalink` links to the search in the app;
// their inner shapes differ per query, so they stay wire-JSON.
const discoverMetaFields = {
	filters: z.unknown().optional(),
	permalink: z.string().optional(),
};

export const DiscoverCompaniesInputSchema = DiscoverFiltersSchema;
export type DiscoverCompaniesInput = z.infer<
	typeof DiscoverCompaniesInputSchema
>;

export const DiscoverCompaniesOutputSchema = z
	.object({
		status: z.string().optional(),
		data: z.array(DiscoverCompanySchema),
		meta: MetaSchema.extend(discoverMetaFields).optional(),
	})
	.passthrough();
export type DiscoverCompaniesOutput = z.infer<
	typeof DiscoverCompaniesOutputSchema
>;

export const DiscoverPersonCompanySchema = z
	.object({
		domain: z.string().optional(),
		organization: z.string().optional(),
		emails_count: z
			.object({
				personal: z.number().optional(),
				generic: z.number().optional(),
				total: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

// GET /discover/people sends the same filter set in the query string.
export const DiscoverPeopleInputSchema = DiscoverFiltersSchema;
export type DiscoverPeopleInput = z.infer<typeof DiscoverPeopleInputSchema>;

export const DiscoverPeoplePostInputSchema = DiscoverFiltersSchema;
export type DiscoverPeoplePostInput = z.infer<
	typeof DiscoverPeoplePostInputSchema
>;

const discoverPeopleOutput = z
	.object({
		status: z.string().optional(),
		data: z.array(DiscoverPersonCompanySchema),
		meta: MetaSchema.extend({
			...discoverMetaFields,
			// Aggregates counts across every match, not just this page.
			total_emails: z
				.object({
					personal: z.number().optional(),
					generic: z.number().optional(),
					total: z.number().optional(),
				})
				.passthrough()
				.optional(),
		}).optional(),
	})
	.passthrough();

export const DiscoverPeopleOutputSchema = discoverPeopleOutput;
export type DiscoverPeopleOutput = z.infer<typeof DiscoverPeopleOutputSchema>;

export const DiscoverPeoplePostOutputSchema = discoverPeopleOutput;
export type DiscoverPeoplePostOutput = z.infer<
	typeof DiscoverPeoplePostOutputSchema
>;

// ── Discover saved searches (views) ─────────────────────────────────────────

export const DiscoverViewSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		// Saved filter set: object of filter name -> selected options (docs
		// example), so values stay wire-JSON.
		filters: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const DiscoverViewsListInputSchema = z.object({}).passthrough();
export type DiscoverViewsListInput = z.infer<
	typeof DiscoverViewsListInputSchema
>;

export const DiscoverViewsListOutputSchema = envelope(
	z.array(DiscoverViewSchema),
);
export type DiscoverViewsListOutput = z.infer<
	typeof DiscoverViewsListOutputSchema
>;

export const DiscoverViewsCreateInputSchema = z.object({
	name: z.string(),
	filters: z.record(z.string(), z.unknown()).optional(),
});
export type DiscoverViewsCreateInput = z.infer<
	typeof DiscoverViewsCreateInputSchema
>;

export const DiscoverViewsCreateOutputSchema = envelope(DiscoverViewSchema);
export type DiscoverViewsCreateOutput = z.infer<
	typeof DiscoverViewsCreateOutputSchema
>;

export const DiscoverViewsGetInputSchema = z.object({ id: IdSchema });
export type DiscoverViewsGetInput = z.infer<typeof DiscoverViewsGetInputSchema>;

export const DiscoverViewsGetOutputSchema = envelope(DiscoverViewSchema);
export type DiscoverViewsGetOutput = z.infer<
	typeof DiscoverViewsGetOutputSchema
>;

export const DiscoverViewsDeleteInputSchema = z.object({ id: IdSchema });
export type DiscoverViewsDeleteInput = z.infer<
	typeof DiscoverViewsDeleteInputSchema
>;

export const DiscoverViewsDeleteOutputSchema = z.undefined();
export type DiscoverViewsDeleteOutput = z.infer<
	typeof DiscoverViewsDeleteOutputSchema
>;

// ── Domain count / Domain finder / Domains suggestion ───────────────────────

// /domain-count counts how many domains match the Discover filter set.
export const DomainCountGetInputSchema = DiscoverFiltersSchema;
export type DomainCountGetInput = z.infer<typeof DomainCountGetInputSchema>;

export const DomainCountGetOutputSchema = envelope(
	z.object({ total: z.number().optional() }).passthrough(),
);
export type DomainCountGetOutput = z.infer<typeof DomainCountGetOutputSchema>;

export const DomainFinderFindInputSchema = z.object({
	company: z.string(),
	limit: z.number().int().min(1).optional(),
	perfect_match: z.boolean().optional(),
});
export type DomainFinderFindInput = z.infer<typeof DomainFinderFindInputSchema>;

export const DomainFinderFindPostInputSchema = DomainFinderFindInputSchema;
export type DomainFinderFindPostInput = z.infer<
	typeof DomainFinderFindPostInputSchema
>;

export const DomainFinderResultSchema = z
	.object({
		domain: z.string().optional(),
		company_name: z.string().optional(),
	})
	.passthrough();

const domainFinderOutput = envelope(z.array(DomainFinderResultSchema));

export const DomainFinderFindOutputSchema = domainFinderOutput;
export type DomainFinderFindOutput = z.infer<
	typeof DomainFinderFindOutputSchema
>;

export const DomainFinderFindPostOutputSchema = domainFinderOutput;
export type DomainFinderFindPostOutput = z.infer<
	typeof DomainFinderFindPostOutputSchema
>;

export const DomainsSuggestionGetInputSchema = z.object({
	query: z.string(),
	limit: z.number().int().min(1).optional(),
});
export type DomainsSuggestionGetInput = z.infer<
	typeof DomainsSuggestionGetInputSchema
>;

// The docs show a `{ data, meta }` shape but do not enumerate suggestion
// fields, so the generic envelope is the honest shape.
export const DomainsSuggestionGetOutputSchema = GenericResourceResponseSchema;
export type DomainsSuggestionGetOutput = z.infer<
	typeof DomainsSuggestionGetOutputSchema
>;

// ── Domain Search ───────────────────────────────────────────────────────────

const domainSearchFields = {
	domain: z.string().optional(),
	company: z.string().optional(),
	type: z.enum(['personal', 'generic']).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	department: z.string().optional(),
	seniority: z.string().optional(),
	job_titles: z.string().optional(),
	decision_maker: z.boolean().optional(),
	required_field: z.string().optional(),
	verification_status: z.string().optional(),
	source_type: z.enum(['found', 'generated']).optional(),
	// OpenAPI-only field; semantics not documented. Passed through as
	// documented so callers can use it, but not relied on by this plugin.
	saved_leads: z.boolean().optional(),
	aggregations: z.boolean().optional(),
};

export const DomainSearchSearchInputSchema = z.object(domainSearchFields);
export type DomainSearchSearchInput = z.infer<
	typeof DomainSearchSearchInputSchema
>;

export const DomainSearchSearchPostInputSchema = z.object({
	...domainSearchFields,
	// Nested location filter is POST-only per the docs.
	location: z.object(locationFilterFields).optional(),
});
export type DomainSearchSearchPostInput = z.infer<
	typeof DomainSearchSearchPostInputSchema
>;

export const DomainSearchEmailSourceSchema = z
	.object({
		domain: z.string().optional(),
		uri: z.string().optional(),
		extracted_on: z.string().nullable().optional(),
		last_seen_on: z.string().nullable().optional(),
		still_on_page: z.boolean().optional(),
	})
	.passthrough();

export const DomainSearchEmailSchema = z
	.object({
		value: z.string().optional(),
		type: z.string().optional(),
		confidence: z.number().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		position: z.string().nullable().optional(),
		position_raw: z.string().nullable().optional(),
		seniority: z.string().nullable().optional(),
		department: z.string().nullable().optional(),
		decision_maker: z.boolean().optional(),
		linkedin: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		source_type: z.string().optional(),
		verification: z
			.object({
				date: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		sources: z.array(DomainSearchEmailSourceSchema).optional(),
	})
	.passthrough();

export const DomainSearchDataSchema = z
	.object({
		domain: z.string().optional(),
		disposable: z.boolean().optional(),
		webmail: z.boolean().optional(),
		accept_all: z.boolean().optional(),
		pattern: z.string().nullable().optional(),
		organization: z.string().nullable().optional(),
		linked_domains: z.array(z.string()).optional(),
		emails: z.array(DomainSearchEmailSchema).optional(),
	})
	.passthrough();

const domainSearchOutput = z
	.object({
		status: z.string().optional(),
		data: DomainSearchDataSchema,
		meta: MetaSchema.extend({
			results_approximate: z.boolean().optional(),
			// Breakdown map (personal/generic/departments/decision_makers)
			// varies by plan and query, so it stays wire-JSON.
			aggregations: z.unknown().optional(),
		}).optional(),
	})
	.passthrough();

export const DomainSearchSearchOutputSchema = domainSearchOutput;
export type DomainSearchSearchOutput = z.infer<
	typeof DomainSearchSearchOutputSchema
>;

export const DomainSearchSearchPostOutputSchema = domainSearchOutput;
export type DomainSearchSearchPostOutput = z.infer<
	typeof DomainSearchSearchPostOutputSchema
>;

// ── Multi-Domain Search ─────────────────────────────────────────────────────

export const MultiDomainSearchSearchInputSchema = z.object({
	domain: z.string().optional(),
	company_name: z.string().optional(),
	company_type: z.string().optional(),
	industry: z.string().optional(),
	headcount: z.string().optional(),
	founded_year: z.string().optional(),
	location: z.string().optional(),
	technology: z.string().optional(),
	department: z.string().optional(),
	seniority: z.string().optional(),
	job_title: z.string().optional(),
	type: z.string().optional(),
	verification_status: z.string().optional(),
	provenance: z.string().optional(),
	min_confidence: z.number().int().optional(),
	required_field: z.string().optional(),
	decision_maker: z.boolean().optional(),
	exclude_already_saved: z.boolean().optional(),
	per_domain: z.boolean().optional(),
	search_after: z.string().optional(),
	limit: z.number().int().min(1).optional(),
});
export type MultiDomainSearchSearchInput = z.infer<
	typeof MultiDomainSearchSearchInputSchema
>;

export const MultiDomainSearchRowSchema = z
	.object({
		name: z.string().nullable().optional(),
		position: z.string().nullable().optional(),
		department: z.string().nullable().optional(),
		seniority: z.string().nullable().optional(),
		type: z.string().optional(),
		decision_maker: z.boolean().optional(),
		domain: z.string().optional(),
		company_name: z.string().nullable().optional(),
		full_name_exists: z.boolean().optional(),
		phone_number_exists: z.boolean().optional(),
		linkedin_exists: z.boolean().optional(),
		verification: z
			.object({
				date: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		// Signed opaque handle fed to multiDomainSearchReveal.
		reveal_handle: z.string().optional(),
		provenance: z.string().optional(),
	})
	.passthrough();

export const MultiDomainSearchSearchOutputSchema = z
	.object({
		status: z.string().optional(),
		data: z.array(MultiDomainSearchRowSchema),
		meta: MetaSchema.extend({
			next_search_after: z.string().nullable().optional(),
			per_domain: z
				.array(
					z
						.object({
							domain: z.string().optional(),
							emails: z.number().optional(),
						})
						.passthrough(),
				)
				.optional(),
		}).optional(),
	})
	.passthrough();
export type MultiDomainSearchSearchOutput = z.infer<
	typeof MultiDomainSearchSearchOutputSchema
>;

export const MultiDomainSearchRevealInputSchema = z.object({
	// Docs show the handles from the masked rows submitted in the body; the
	// exact field name is described only as "submitted handles", so `handles`
	// is the most-verified reading.
	handles: z.array(z.string()).min(1).max(100),
});
export type MultiDomainSearchRevealInput = z.infer<
	typeof MultiDomainSearchRevealInputSchema
>;

export const MultiDomainSearchRevealOutputSchema =
	GenericResourceResponseSchema;
export type MultiDomainSearchRevealOutput = z.infer<
	typeof MultiDomainSearchRevealOutputSchema
>;

// ── Email Finder ────────────────────────────────────────────────────────────

const emailFinderFields = {
	domain: z.string().optional(),
	company: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	full_name: z.string().optional(),
	linkedin_handle: z.string().optional(),
	max_duration: z.number().int().min(3).max(20).optional(),
};

export const EmailFinderFindInputSchema = z.object(emailFinderFields);
export type EmailFinderFindInput = z.infer<typeof EmailFinderFindInputSchema>;

export const EmailFinderFindFoundInputSchema = z.object(emailFinderFields);
export type EmailFinderFindFoundInput = z.infer<
	typeof EmailFinderFindFoundInputSchema
>;

export const EmailFinderFindFoundPostInputSchema = z.object(emailFinderFields);
export type EmailFinderFindFoundPostInput = z.infer<
	typeof EmailFinderFindFoundPostInputSchema
>;

export const EmailFinderSourceSchema = z
	.object({
		domain: z.string().optional(),
		uri: z.string().optional(),
		extracted_on: z.string().nullable().optional(),
		last_seen_on: z.string().nullable().optional(),
		still_on_page: z.boolean().optional(),
	})
	.passthrough();

export const EmailFinderDataSchema = z
	.object({
		email: z.string().nullable().optional(),
		score: z.number().nullable().optional(),
		domain: z.string().optional(),
		company: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		position: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		accept_all: z.boolean().optional(),
		source_type: z.string().optional(),
		sources: z.array(EmailFinderSourceSchema).optional(),
		verification: z
			.object({
				date: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
				id: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

const emailFinderOutput = envelope(EmailFinderDataSchema);

export const EmailFinderFindOutputSchema = emailFinderOutput;
export type EmailFinderFindOutput = z.infer<typeof EmailFinderFindOutputSchema>;

export const EmailFinderFindFoundOutputSchema = emailFinderOutput;
export type EmailFinderFindFoundOutput = z.infer<
	typeof EmailFinderFindFoundOutputSchema
>;

export const EmailFinderFindFoundPostOutputSchema = emailFinderOutput;
export type EmailFinderFindFoundPostOutput = z.infer<
	typeof EmailFinderFindFoundPostOutputSchema
>;

// ── Email Verifier ──────────────────────────────────────────────────────────

export const EmailVerifierVerifyInputSchema = z.object({
	email: z.string(),
	// Include the domain metadata block; docs accept any non-empty value.
	domain_metadata: z.union([z.boolean(), z.string()]).optional(),
});
export type EmailVerifierVerifyInput = z.infer<
	typeof EmailVerifierVerifyInputSchema
>;

export const EmailVerifierSourceSchema = z
	.object({
		domain: z.string().optional(),
		uri: z.string().optional(),
		extracted_on: z.string().nullable().optional(),
		last_seen_on: z.string().nullable().optional(),
		still_on_page: z.boolean().optional(),
	})
	.passthrough();

export const EmailVerifierDataSchema = z
	.object({
		status: z.string().optional(),
		// Deprecated by Hunter; retained so documented responses parse.
		result: z.string().optional(),
		score: z.number().nullable().optional(),
		email: z.string().optional(),
		regexp: z.boolean().optional(),
		gibberish: z.boolean().optional(),
		disposable: z.boolean().optional(),
		webmail: z.boolean().optional(),
		mx_records: z.boolean().optional(),
		smtp_server: z.string().nullable().optional(),
		smtp_check: z.boolean().optional(),
		accept_all: z.boolean().optional(),
		block: z.boolean().optional(),
		verification: z
			.object({
				date: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
				id: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		sources: z.array(EmailVerifierSourceSchema).optional(),
		_deprecation_notice: z.string().optional(),
	})
	.passthrough();

// 202 responses to /email-verifier mean "still checking, poll again" and are
// documented without a result payload, so `data` is optional here.
export const EmailVerifierVerifyOutputSchema = z
	.object({
		status: z.string().optional(),
		data: EmailVerifierDataSchema.optional(),
		meta: MetaSchema.extend({
			company_name: z.string().nullable().optional(),
			domain: z.string().nullable().optional(),
			following_domain: z.boolean().optional(),
			webmail: z.boolean().optional(),
		}).optional(),
	})
	.passthrough();
export type EmailVerifierVerifyOutput = z.infer<
	typeof EmailVerifierVerifyOutputSchema
>;

// ── Email Insight ───────────────────────────────────────────────────────────

export const EmailInsightGetInputSchema = z.object({
	email: z.string(),
});
export type EmailInsightGetInput = z.infer<typeof EmailInsightGetInputSchema>;

export const EmailInsightGetOutputSchema = envelope(
	z
		.object({
			email: z.string().optional(),
			gibberish: z.boolean().optional(),
			pattern: z.boolean().optional(),
			mx_records: z.boolean().optional(),
			disposable: z.boolean().optional(),
			webmail: z.boolean().optional(),
			// Reserved by Hunter; always null for now.
			webmail_allowed: z.boolean().nullable().optional(),
		})
		.passthrough(),
);
export type EmailInsightGetOutput = z.infer<typeof EmailInsightGetOutputSchema>;

// ── Email Count ─────────────────────────────────────────────────────────────

export const EmailCountGetInputSchema = z.object({
	domain: z.string().optional(),
	company: z.string().optional(),
	type: z.enum(['personal', 'generic']).optional(),
	include_job_titles: z.union([z.boolean(), z.string()]).optional(),
});
export type EmailCountGetInput = z.infer<typeof EmailCountGetInputSchema>;

export const EmailCountGetOutputSchema = envelope(
	z
		.object({
			total: z.number().optional(),
			personal_emails: z.number().optional(),
			generic_emails: z.number().optional(),
			// Breakdown maps keyed by department / seniority / job title; keys
			// are open taxonomies, so the maps stay wire-JSON.
			department: z.record(z.string(), z.number()).optional(),
			seniority: z.record(z.string(), z.number()).optional(),
			job_titles: z.record(z.string(), z.number()).optional(),
		})
		.passthrough(),
);
export type EmailCountGetOutput = z.infer<typeof EmailCountGetOutputSchema>;

// ── Enrichment ──────────────────────────────────────────────────────────────

export const EnrichmentPersonSchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z
			.object({
				fullName: z.string().nullable().optional(),
				givenName: z.string().nullable().optional(),
				familyName: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		email: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		timeZone: z.string().nullable().optional(),
		utcOffset: z.number().nullable().optional(),
		geo: z
			.object({
				city: z.string().nullable().optional(),
				country: z.string().nullable().optional(),
				countryCode: z.string().nullable().optional(),
				lat: z.number().nullable().optional(),
				lng: z.number().nullable().optional(),
				state: z.string().nullable().optional(),
				stateCode: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		bio: z.string().nullable().optional(),
		site: z.string().nullable().optional(),
		avatar: z.string().nullable().optional(),
		employment: z
			.object({
				domain: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				role: z.string().nullable().optional(),
				seniority: z.string().nullable().optional(),
				subRole: z.string().nullable().optional(),
				title: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		facebook: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		linkedin: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		googleplus: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		twitter: z
			.object({
				handle: z.string().nullable().optional(),
				avatar: z.string().nullable().optional(),
				bio: z.string().nullable().optional(),
				followers: z.number().nullable().optional(),
				following: z.number().nullable().optional(),
				location: z.string().nullable().optional(),
				site: z.string().nullable().optional(),
				statuses: z.number().nullable().optional(),
				favorites: z.number().nullable().optional(),
				id: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		github: z
			.object({
				handle: z.string().nullable().optional(),
				avatar: z.string().nullable().optional(),
				blog: z.string().nullable().optional(),
				company: z.string().nullable().optional(),
				followers: z.number().nullable().optional(),
				following: z.number().nullable().optional(),
				id: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		gravatar: z
			.object({
				handle: z.string().nullable().optional(),
				avatar: z.string().nullable().optional(),
				avatars: z.array(z.unknown()).optional(),
				urls: z.array(z.unknown()).optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		fuzzy: z.boolean().optional(),
		emailProvider: z.boolean().optional(),
		phone: z.string().nullable().optional(),
		indexedAt: z.string().nullable().optional(),
		activeAt: z.string().nullable().optional(),
		inactiveAt: z.string().nullable().optional(),
	})
	.passthrough();

export const EnrichmentCompanySchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		legalName: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		domainAliases: z.array(z.string()).optional(),
		site: z
			.object({
				emailAddresses: z.array(z.string()).optional(),
				phoneNumbers: z.array(z.string()).optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		category: z
			.object({
				sector: z.string().nullable().optional(),
				industryGroup: z.string().nullable().optional(),
				industry: z.string().nullable().optional(),
				subIndustry: z.string().nullable().optional(),
				sicCode: z.string().nullable().optional(),
				sic4Codes: z.array(z.string()).optional(),
				naicsCode: z.string().nullable().optional(),
				naics6Codes: z.array(z.string()).optional(),
				naics6Codes2022: z.array(z.string()).optional(),
				gicsCode: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().nullable().optional(),
		foundedYear: z.number().nullable().optional(),
		location: z.string().nullable().optional(),
		timeZone: z.string().nullable().optional(),
		utcOffset: z.number().nullable().optional(),
		geo: z.record(z.string(), z.unknown()).nullable().optional(),
		logo: z.string().nullable().optional(),
		facebook: z
			.object({
				handle: z.string().nullable().optional(),
				likes: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		linkedin: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		twitter: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		crunchbase: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		youtube: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		instagram: z
			.object({ handle: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		emailProvider: z.boolean().optional(),
		type: z.string().nullable().optional(),
		companyType: z.string().nullable().optional(),
		ticker: z.string().nullable().optional(),
		identifiers: z
			.object({ usEIN: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		phone: z.string().nullable().optional(),
		metrics: z
			.object({
				employees: z.number().nullable().optional(),
				employeesCount: z.number().nullable().optional(),
				alexaGlobalRank: z.number().nullable().optional(),
				alexaUsRank: z.number().nullable().optional(),
				annualRevenue: z.number().nullable().optional(),
				estimatedAnnualRevenue: z.string().nullable().optional(),
				marketCap: z.string().nullable().optional(),
				raised: z.number().nullable().optional(),
				fiscalYearEnd: z.number().nullable().optional(),
				trafficRank: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		indexedAt: z.string().nullable().optional(),
		// Technology slugs and category names, open taxonomies.
		tech: z.array(z.string()).optional(),
		techCategories: z.array(z.string()).optional(),
		fundingRounds: z
			.array(
				z
					.object({
						amount: z.number().nullable().optional(),
						date: z.string().nullable().optional(),
						investors: z.array(z.string()).optional(),
						type: z.string().nullable().optional(),
					})
					.passthrough(),
			)
			.optional(),
		parent: z
			.object({ domain: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		ultimateParent: z
			.object({ domain: z.string().nullable().optional() })
			.passthrough()
			.nullable()
			.optional(),
		alreadySaved: z.boolean().optional(),
		emailsCount: z.number().optional(),
	})
	.passthrough();

const enrichmentCommonFields = {
	// Returns the data in a Clearbit-compatible shape when present.
	clearbit_format: z.union([z.boolean(), z.string()]).optional(),
};

export const EnrichmentPersonInputSchema = z.object({
	email: z.string().optional(),
	linkedin_handle: z.string().optional(),
	...enrichmentCommonFields,
});
export type EnrichmentPersonInput = z.infer<typeof EnrichmentPersonInputSchema>;

export const EnrichmentCompanyInputSchema = z.object({
	domain: z.string(),
	...enrichmentCommonFields,
});
export type EnrichmentCompanyInput = z.infer<
	typeof EnrichmentCompanyInputSchema
>;

export const EnrichmentCombinedInputSchema = z.object({
	email: z.string().optional(),
	linkedin_handle: z.string().optional(),
	...enrichmentCommonFields,
});
export type EnrichmentCombinedInput = z.infer<
	typeof EnrichmentCombinedInputSchema
>;

// The Clearbit-compatible shape replaces the envelope with the bare resource,
// so these outputs are unions: envelope first (kept when `data` is present),
// bare resource second (backwards-compatible) with a comment.
export const EnrichmentPersonOutputSchema = z.union([
	z
		.object({
			status: z.string().optional(),
			data: EnrichmentPersonSchema,
			meta: MetaSchema.optional(),
		})
		.passthrough(),
	EnrichmentPersonSchema,
]);
export type EnrichmentPersonOutput = z.infer<
	typeof EnrichmentPersonOutputSchema
>;

export const EnrichmentCompanyOutputSchema = z.union([
	z
		.object({
			status: z.string().optional(),
			data: EnrichmentCompanySchema,
			meta: MetaSchema.optional(),
		})
		.passthrough(),
	EnrichmentCompanySchema,
]);
export type EnrichmentCompanyOutput = z.infer<
	typeof EnrichmentCompanyOutputSchema
>;

export const EnrichmentCombinedOutputSchema = z.union([
	z
		.object({
			status: z.string().optional(),
			data: z
				.object({
					person: EnrichmentPersonSchema.optional(),
					company: EnrichmentCompanySchema.optional(),
				})
				.passthrough(),
			meta: MetaSchema.optional(),
		})
		.passthrough(),
	z
		.object({
			person: EnrichmentPersonSchema.optional(),
			company: EnrichmentCompanySchema.optional(),
		})
		.passthrough(),
]);
export type EnrichmentCombinedOutput = z.infer<
	typeof EnrichmentCombinedOutputSchema
>;

// ── Leads ───────────────────────────────────────────────────────────────────

export const LeadVerificationSchema = z
	.object({
		date: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
	})
	.passthrough();

export const LeadListRefSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		leads_count: z.number().optional(),
	})
	.passthrough();

export const LeadSchema = z
	.object({
		id: z.number().optional(),
		email: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		position: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		company_industry: z.string().nullable().optional(),
		company_size: z.string().nullable().optional(),
		confidence_score: z.number().nullable().optional(),
		website: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		source: z.string().nullable().optional(),
		department: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
		sync_status: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		sending_status: z.string().nullable().optional(),
		last_activity_at: z.string().nullable().optional(),
		last_contacted_at: z.string().nullable().optional(),
		verification: LeadVerificationSchema.nullable().optional(),
		leads_list: LeadListRefSchema.nullable().optional(),
		leads_lists: z.array(LeadListRefSchema).optional(),
		// Custom attribute values are keyed by slug (open set) and values are
		// string-valued per the docs, so this stays wire-JSON.
		custom_attributes: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().nullable().optional(),
		created_by: z.number().nullable().optional(),
	})
	.passthrough();

const leadWriteFields = {
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	position: z.string().optional(),
	company: z.string().optional(),
	company_industry: z.string().optional(),
	company_size: z.string().optional(),
	confidence_score: z.number().int().min(0).max(100).optional(),
	website: z.string().optional(),
	country_code: z.string().optional(),
	department: z.string().optional(),
	linkedin_url: z.string().optional(),
	phone_number: z.string().optional(),
	twitter: z.string().optional(),
	notes: z.string().optional(),
	source: z.string().optional(),
	leads_list_id: IdSchema.optional(),
	leads_list_ids: z.array(IdSchema).optional(),
	leads_list_name: z.string().max(255).optional(),
	custom_attributes: z.record(z.string(), z.string()).optional(),
};

// createLead additionally accepts company_type and the lead_-prefixed
// location fields; the OpenAPI contract note states upsertLeads rejects them.
const leadCreateExtraFields = {
	company_type: z.string().optional(),
	lead_country_code: z.string().optional(),
	lead_city: z.string().optional(),
	lead_state: z.string().optional(),
};

// The docs mark `email` required for create while the OpenAPI contract note
// describes email-less leads, so it is optional here.
export const LeadsCreateInputSchema = z.object({
	...leadWriteFields,
	...leadCreateExtraFields,
});
export type LeadsCreateInput = z.infer<typeof LeadsCreateInputSchema>;

export const LeadsUpsertInputSchema = z.object(leadWriteFields);
export type LeadsUpsertInput = z.infer<typeof LeadsUpsertInputSchema>;

export const LeadsUpdateInputSchema = z.object({
	id: IdSchema,
	...leadWriteFields,
	...leadCreateExtraFields,
});
export type LeadsUpdateInput = z.infer<typeof LeadsUpdateInputSchema>;

export const LeadsReplaceInputSchema = LeadsUpdateInputSchema;
export type LeadsReplaceInput = z.infer<typeof LeadsReplaceInputSchema>;

const dateRangeFilterShape = {
	from: z.string().optional(),
	to: z.string().optional(),
};

// Period presets accepted by the date filters in the leads listing;
// `LeadsListDateFilterSchema` accepts one of these, `*`, `~`, or a
// from/to range object.
export const LeadsListDateFilterSchema = z.union([
	z.literal('*'),
	z.literal('~'),
	z.enum(['last1h', 'today', 'this_week', 'last7d', 'last30d', 'current_year']),
	z.object(dateRangeFilterShape),
]);

export const LeadsListInputSchema = z.object({
	leads_list_id: IdSchema.optional(),
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	position: z.union([z.string(), z.array(z.string())]).optional(),
	company: z.string().optional(),
	industry: z.string().optional(),
	website: z.string().optional(),
	country_code: z.string().optional(),
	company_size: z.string().optional(),
	source: z.string().optional(),
	twitter: z.string().optional(),
	linkedin_url: z.string().optional(),
	phone_number: z.string().optional(),
	sync_status: z.enum(['pending', 'error', 'success']).optional(),
	sending_status: z
		.array(
			z.enum([
				'clicked',
				'opened',
				'sent',
				'pending',
				'error',
				'bounced',
				'unsubscribed',
				'replied',
				'~',
			]),
		)
		.optional(),
	verification_status: z
		.array(
			z.enum([
				'accept_all',
				'disposable',
				'invalid',
				'unknown',
				'valid',
				'webmail',
				'pending',
			]),
		)
		.optional(),
	last_activity_at: LeadsListDateFilterSchema.optional(),
	last_contacted_at: LeadsListDateFilterSchema.optional(),
	last_exported_at: LeadsListDateFilterSchema.optional(),
	created_at: LeadsListDateFilterSchema.optional(),
	updated_at: LeadsListDateFilterSchema.optional(),
	verification_date: LeadsListDateFilterSchema.optional(),
	department: z
		.array(
			z.enum([
				'executive',
				'it',
				'finance',
				'management',
				'sales',
				'legal',
				'support',
				'hr',
				'marketing',
				'communication',
				'education',
				'design',
				'health',
				'operations',
			]),
		)
		.optional(),
	tags: z.array(z.number().int()).optional(),
	sequence_ids: z
		.union([z.array(z.number().int()), z.literal('*'), z.literal('~')])
		.optional(),
	// Former name of sequence_ids; still accepted, sequence_ids wins.
	campaign_ids: z
		.union([z.array(z.number().int()), z.literal('*'), z.literal('~')])
		.optional(),
	user_id: z.array(z.number().int()).optional(),
	confidence_score: z
		.union([
			z.literal('*'),
			z.literal('~'),
			z.object({
				from: z.number().int().min(0).max(100).optional(),
				to: z.number().int().min(0).max(100).optional(),
			}),
		])
		.optional(),
	// Field is `custom_attributes[<slug>]`; the slug set is team-specific, so
	// this is modelled as a slug-keyed record.
	custom_attributes: z.record(z.string(), z.string()).optional(),
	query: z.string().optional(),
	location: z
		.object({
			country: z.object(includeExcludeFields).optional(),
			state: z.object(includeExcludeFields).optional(),
			city: z.object(includeExcludeFields).optional(),
			continent: z.object(includeExcludeFields).optional(),
			business_region: z.object(includeExcludeFields).optional(),
		})
		.optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).max(100000).optional(),
});
export type LeadsListInput = z.infer<typeof LeadsListInputSchema>;

export const LeadsListOutputSchema = envelope(
	z.object({ leads: z.array(LeadSchema) }).passthrough(),
);
export type LeadsListOutput = z.infer<typeof LeadsListOutputSchema>;

// create/upsert/get/enrich all return the generic resource envelope around a
// lead payload; the docs' examples show `{ data: <lead> }` with no `meta`.
export const LeadsCreateOutputSchema = envelope(LeadSchema);
export type LeadsCreateOutput = z.infer<typeof LeadsCreateOutputSchema>;

export const LeadsUpsertOutputSchema = envelope(LeadSchema);
export type LeadsUpsertOutput = z.infer<typeof LeadsUpsertOutputSchema>;

export const LeadsGetInputSchema = z.object({ id: IdSchema });
export type LeadsGetInput = z.infer<typeof LeadsGetInputSchema>;

export const LeadsGetOutputSchema = envelope(LeadSchema);
export type LeadsGetOutput = z.infer<typeof LeadsGetOutputSchema>;

export const LeadsUpdateOutputSchema = z.undefined();
export type LeadsUpdateOutput = z.infer<typeof LeadsUpdateOutputSchema>;

// PUT /leads/{id} mirrors PATCH and is also documented as 204 No Content.
export const LeadsReplaceOutputSchema = z.undefined();
export type LeadsReplaceOutput = z.infer<typeof LeadsReplaceOutputSchema>;

export const LeadsDeleteInputSchema = z.object({ id: IdSchema });
export type LeadsDeleteInput = z.infer<typeof LeadsDeleteInputSchema>;

export const LeadsDeleteOutputSchema = z.undefined();
export type LeadsDeleteOutput = z.infer<typeof LeadsDeleteOutputSchema>;

export const LeadsEnrichInputSchema = z.object({ id: IdSchema });
export type LeadsEnrichInput = z.infer<typeof LeadsEnrichInputSchema>;

export const LeadsEnrichOutputSchema = envelope(LeadSchema);
export type LeadsEnrichOutput = z.infer<typeof LeadsEnrichOutputSchema>;

export const LeadsExistInputSchema = z.object({ email: z.string() });
export type LeadsExistInput = z.infer<typeof LeadsExistInputSchema>;

export const LeadsExistOutputSchema = envelope(
	z
		.object({
			id: z.number().nullable(),
			leads_list_id: z.number().nullable(),
			leads_list_name: z.string().nullable(),
		})
		.passthrough(),
);
export type LeadsExistOutput = z.infer<typeof LeadsExistOutputSchema>;

export const LeadsBulkExistInputSchema = z.object({
	emails: z.array(z.string()).min(1).max(100),
});
export type LeadsBulkExistInput = z.infer<typeof LeadsBulkExistInputSchema>;

export const LeadsBulkExistOutputSchema = envelope(
	z.array(
		z
			.object({
				email: z.string(),
				id: z.number().nullable(),
			})
			.passthrough(),
	),
);
export type LeadsBulkExistOutput = z.infer<typeof LeadsBulkExistOutputSchema>;

export const LeadsBulkUpsertInputSchema = z.object({
	leads_list_id: IdSchema.optional(),
	leads_list_name: z.string().max(255).optional(),
	leads: z.array(LeadsUpsertInputSchema).min(1).max(100),
});
export type LeadsBulkUpsertInput = z.infer<typeof LeadsBulkUpsertInputSchema>;

export const LeadsBulkUpsertRowSchema = z
	.object({
		index: z.number().optional(),
		email: z.string().nullable().optional(),
		status: z.string().optional(),
		lead: LeadSchema.nullable().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.passthrough();

export const LeadsBulkUpsertOutputSchema = z
	.object({
		status: z.string().optional(),
		data: z.array(LeadsBulkUpsertRowSchema),
		meta: MetaSchema.extend({
			created: z.number().optional(),
			updated: z.number().optional(),
			failed: z.number().optional(),
		}).optional(),
	})
	.passthrough();
export type LeadsBulkUpsertOutput = z.infer<typeof LeadsBulkUpsertOutputSchema>;

export const LeadsBulkMoveInputSchema = z.object({
	leads_list_id: IdSchema,
	target_leads_list_id: IdSchema,
	lead_ids: z.array(z.number().int()).optional(),
});
export type LeadsBulkMoveInput = z.infer<typeof LeadsBulkMoveInputSchema>;

export const LeadsBulkMoveOutputSchema = envelope(
	z
		.object({
			source_leads_list_id: z.number().optional(),
			target_leads_list_id: z.number().optional(),
			leads_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type LeadsBulkMoveOutput = z.infer<typeof LeadsBulkMoveOutputSchema>;

export const LeadsBulkDeleteInputSchema = z.object({
	lead_ids: z.array(z.number().int()).optional(),
	leads_list_id: IdSchema.optional(),
});
export type LeadsBulkDeleteInput = z.infer<typeof LeadsBulkDeleteInputSchema>;

// Bulk delete answers 200 when it deletes inline and 202 when the work is
// queued for background processing.
export const LeadsBulkDeleteOutputSchema = GenericResourceResponseSchema;
export type LeadsBulkDeleteOutput = z.infer<typeof LeadsBulkDeleteOutputSchema>;

// Creates a *draft* import: a person must open the returned
// `configuration_url` in a browser and finish the column mapping before any
// lead is created, so this endpoint is not for unattended automation.
export const LeadsImportCsvInputSchema = z.object({
	csv_data: z.string(),
	leads_list_id: IdSchema.optional(),
	file_name: z.string().optional(),
});
export type LeadsImportCsvInput = z.infer<typeof LeadsImportCsvInputSchema>;

export const LeadsImportCsvOutputSchema = GenericResourceResponseSchema;
export type LeadsImportCsvOutput = z.infer<typeof LeadsImportCsvOutputSchema>;

// ── Lead tags ───────────────────────────────────────────────────────────────

export const TagSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		color: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const TagsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

export const TagsListOutputSchema = envelope(
	z.object({ tags: z.array(TagSchema) }).passthrough(),
);
export type TagsListOutput = z.infer<typeof TagsListOutputSchema>;

export const TagsGetInputSchema = z.object({ id: IdSchema });
export type TagsGetInput = z.infer<typeof TagsGetInputSchema>;

export const TagsGetOutputSchema = envelope(TagSchema);
export type TagsGetOutput = z.infer<typeof TagsGetOutputSchema>;

export const TagsCreateInputSchema = z.object({
	name: z.string(),
	// Hex color without the leading `#`; must be a supported palette value.
	color: z.string().optional(),
});
export type TagsCreateInput = z.infer<typeof TagsCreateInputSchema>;

export const TagsCreateOutputSchema = envelope(TagSchema);
export type TagsCreateOutput = z.infer<typeof TagsCreateOutputSchema>;

export const TagsUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	color: z.string().optional(),
});
export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;

export const TagsUpdateOutputSchema = envelope(TagSchema);
export type TagsUpdateOutput = z.infer<typeof TagsUpdateOutputSchema>;

// PUT /tags/{id} mirrors PATCH; both return the updated tag (200).
export const TagsReplaceInputSchema = TagsUpdateInputSchema;
export type TagsReplaceInput = z.infer<typeof TagsReplaceInputSchema>;

export const TagsReplaceOutputSchema = envelope(TagSchema);
export type TagsReplaceOutput = z.infer<typeof TagsReplaceOutputSchema>;

export const TagsDeleteInputSchema = z.object({ id: IdSchema });
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;

export const TagsDeleteOutputSchema = z.undefined();
export type TagsDeleteOutput = z.infer<typeof TagsDeleteOutputSchema>;

export const LeadTagsAttachInputSchema = z.object({
	id: IdSchema,
	tag_id: IdSchema,
});
export type LeadTagsAttachInput = z.infer<typeof LeadTagsAttachInputSchema>;

// Attaching is idempotent and returns the lead's current tags.
export const LeadTagsAttachOutputSchema = envelope(
	z.object({ tags: z.array(TagSchema) }).passthrough(),
);
export type LeadTagsAttachOutput = z.infer<typeof LeadTagsAttachOutputSchema>;

export const LeadTagsDetachInputSchema = z.object({
	id: IdSchema,
	tag_id: IdSchema,
});
export type LeadTagsDetachInput = z.infer<typeof LeadTagsDetachInputSchema>;

export const LeadTagsDetachOutputSchema = z.undefined();
export type LeadTagsDetachOutput = z.infer<typeof LeadTagsDetachOutputSchema>;

// ── Custom attributes ───────────────────────────────────────────────────────

export const CustomAttributeSchema = z
	.object({
		id: z.number().optional(),
		label: z.string().optional(),
		slug: z.string().optional(),
	})
	.passthrough();

export const CustomAttributesListInputSchema = z.object({}).passthrough();
export type CustomAttributesListInput = z.infer<
	typeof CustomAttributesListInputSchema
>;

export const CustomAttributesListOutputSchema = envelope(
	z.object({ leads_custom_attributes: z.array(CustomAttributeSchema) }),
);
export type CustomAttributesListOutput = z.infer<
	typeof CustomAttributesListOutputSchema
>;

export const CustomAttributesGetInputSchema = z.object({ id: IdSchema });
export type CustomAttributesGetInput = z.infer<
	typeof CustomAttributesGetInputSchema
>;

export const CustomAttributesGetOutputSchema = envelope(CustomAttributeSchema);
export type CustomAttributesGetOutput = z.infer<
	typeof CustomAttributesGetOutputSchema
>;

export const CustomAttributesCreateInputSchema = z.object({
	label: z.string(),
});
export type CustomAttributesCreateInput = z.infer<
	typeof CustomAttributesCreateInputSchema
>;

export const CustomAttributesCreateOutputSchema = envelope(
	CustomAttributeSchema,
);
export type CustomAttributesCreateOutput = z.infer<
	typeof CustomAttributesCreateOutputSchema
>;

export const CustomAttributesUpdateInputSchema = z.object({
	id: IdSchema,
	label: z.string(),
});
export type CustomAttributesUpdateInput = z.infer<
	typeof CustomAttributesUpdateInputSchema
>;

export const CustomAttributesUpdateOutputSchema = z.undefined();
export type CustomAttributesUpdateOutput = z.infer<
	typeof CustomAttributesUpdateOutputSchema
>;

export const CustomAttributesReplaceInputSchema =
	CustomAttributesUpdateInputSchema;
export type CustomAttributesReplaceInput = z.infer<
	typeof CustomAttributesReplaceInputSchema
>;

export const CustomAttributesReplaceOutputSchema = z.undefined();
export type CustomAttributesReplaceOutput = z.infer<
	typeof CustomAttributesReplaceOutputSchema
>;

export const CustomAttributesDeleteInputSchema = z.object({ id: IdSchema });
export type CustomAttributesDeleteInput = z.infer<
	typeof CustomAttributesDeleteInputSchema
>;

export const CustomAttributesDeleteOutputSchema = z.undefined();
export type CustomAttributesDeleteOutput = z.infer<
	typeof CustomAttributesDeleteOutputSchema
>;

// ── Leads lists ─────────────────────────────────────────────────────────────

export const LeadsListSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		leads_count: z.number().optional(),
		type: z.string().optional(),
		created_at: z.string().optional(),
		leads_list_folder_id: z.number().nullable().optional(),
	})
	.passthrough();

export const LeadsListsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type LeadsListsListInput = z.infer<typeof LeadsListsListInputSchema>;

export const LeadsListsListOutputSchema = envelope(
	z.object({ leads_lists: z.array(LeadsListSchema) }).passthrough(),
);
export type LeadsListsListOutput = z.infer<typeof LeadsListsListOutputSchema>;

export const LeadsListsGetInputSchema = z.object({
	id: IdSchema,
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type LeadsListsGetInput = z.infer<typeof LeadsListsGetInputSchema>;

export const LeadsListsGetOutputSchema = envelope(
	LeadsListSchema.extend({
		leads: z.array(LeadSchema.passthrough()).optional(),
	}),
);
export type LeadsListsGetOutput = z.infer<typeof LeadsListsGetOutputSchema>;

export const LeadsListsCreateInputSchema = z.object({
	name: z.string().max(255),
	leads_list_folder_id: IdSchema.nullable().optional(),
});
export type LeadsListsCreateInput = z.infer<typeof LeadsListsCreateInputSchema>;

export const LeadsListsCreateOutputSchema = envelope(LeadsListSchema);
export type LeadsListsCreateOutput = z.infer<
	typeof LeadsListsCreateOutputSchema
>;

export const LeadsListsUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().max(255),
	// Pass null to remove the list from its folder.
	leads_list_folder_id: IdSchema.nullable().optional(),
});
export type LeadsListsUpdateInput = z.infer<typeof LeadsListsUpdateInputSchema>;

export const LeadsListsUpdateOutputSchema = z.undefined();
export type LeadsListsUpdateOutput = z.infer<
	typeof LeadsListsUpdateOutputSchema
>;

// PUT /leads_lists/{id} mirrors PATCH; both documented as 204 No Content.
export const LeadsListsReplaceInputSchema = LeadsListsUpdateInputSchema;
export type LeadsListsReplaceInput = z.infer<
	typeof LeadsListsReplaceInputSchema
>;

export const LeadsListsReplaceOutputSchema = z.undefined();
export type LeadsListsReplaceOutput = z.infer<
	typeof LeadsListsReplaceOutputSchema
>;

export const LeadsListsDeleteInputSchema = z.object({ id: IdSchema });
export type LeadsListsDeleteInput = z.infer<typeof LeadsListsDeleteInputSchema>;

// Documents 204 for an inline delete; the OpenAPI contract also allows a 202
// queued acknowledgement, so both shapes parse.
export const LeadsListsDeleteOutputSchema = z.union([
	GenericResourceResponseSchema,
	z.undefined(),
]);
export type LeadsListsDeleteOutput = z.infer<
	typeof LeadsListsDeleteOutputSchema
>;

const favoriteToggleFields = z
	.object({
		id: z.number().optional(),
		favorited: z.boolean().optional(),
	})
	.passthrough();

export const LeadsListsFavoriteInputSchema = z.object({ id: IdSchema });
export type LeadsListsFavoriteInput = z.infer<
	typeof LeadsListsFavoriteInputSchema
>;

export const LeadsListsFavoriteOutputSchema = envelope(favoriteToggleFields);
export type LeadsListsFavoriteOutput = z.infer<
	typeof LeadsListsFavoriteOutputSchema
>;

export const LeadsListsUnfavoriteInputSchema = z.object({ id: IdSchema });
export type LeadsListsUnfavoriteInput = z.infer<
	typeof LeadsListsUnfavoriteInputSchema
>;

export const LeadsListsUnfavoriteOutputSchema = envelope(favoriteToggleFields);
export type LeadsListsUnfavoriteOutput = z.infer<
	typeof LeadsListsUnfavoriteOutputSchema
>;

// The OpenAPI contract declares no request body for this operation and the
// docs only describe it as merging one leads list into another without
// publishing the semantics (source of the contents, destination list, or
// which list survives), so only the path id is sent.
export const LeadsListsMergeInputSchema = z.object({ id: IdSchema });
export type LeadsListsMergeInput = z.infer<typeof LeadsListsMergeInputSchema>;

export const LeadsListsMergeOutputSchema = z.undefined();
export type LeadsListsMergeOutput = z.infer<typeof LeadsListsMergeOutputSchema>;

// ── Leads list folders ──────────────────────────────────────────────────────

// Palette documented for lead list folders; the API rejects other values.
export const LeadsListFolderColorValues = [
	'374151',
	'3489F9',
	'10B981',
	'F5BA0B',
	'EF4444',
	'7C3AED',
	'F97316',
	'E5E7EB',
	'B4D9F7',
	'BAE6B0',
	'FDE68A',
	'FBD0D0',
	'D4C4F8',
	'FFD79B',
] as const;

export const LeadsListFolderSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		color: z.string().optional(),
		leads_lists_count: z.number().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const LeadsListFoldersListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type LeadsListFoldersListInput = z.infer<
	typeof LeadsListFoldersListInputSchema
>;

export const LeadsListFoldersListOutputSchema = envelope(
	z.object({ folders: z.array(LeadsListFolderSchema) }).passthrough(),
);
export type LeadsListFoldersListOutput = z.infer<
	typeof LeadsListFoldersListOutputSchema
>;

export const LeadsListFoldersGetInputSchema = z.object({ id: IdSchema });
export type LeadsListFoldersGetInput = z.infer<
	typeof LeadsListFoldersGetInputSchema
>;

export const LeadsListFoldersGetOutputSchema = envelope(LeadsListFolderSchema);
export type LeadsListFoldersGetOutput = z.infer<
	typeof LeadsListFoldersGetOutputSchema
>;

export const LeadsListFoldersCreateInputSchema = z.object({
	name: z.string(),
	color: z.enum(LeadsListFolderColorValues),
});
export type LeadsListFoldersCreateInput = z.infer<
	typeof LeadsListFoldersCreateInputSchema
>;

export const LeadsListFoldersCreateOutputSchema = envelope(
	LeadsListFolderSchema,
);
export type LeadsListFoldersCreateOutput = z.infer<
	typeof LeadsListFoldersCreateOutputSchema
>;

export const LeadsListFoldersUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	color: z.enum(LeadsListFolderColorValues).optional(),
});
export type LeadsListFoldersUpdateInput = z.infer<
	typeof LeadsListFoldersUpdateInputSchema
>;

export const LeadsListFoldersUpdateOutputSchema = z.undefined();
export type LeadsListFoldersUpdateOutput = z.infer<
	typeof LeadsListFoldersUpdateOutputSchema
>;

// PUT /leads_lists/folders/{id} mirrors PATCH; both documented as 204.
export const LeadsListFoldersReplaceInputSchema =
	LeadsListFoldersUpdateInputSchema;
export type LeadsListFoldersReplaceInput = z.infer<
	typeof LeadsListFoldersReplaceInputSchema
>;

export const LeadsListFoldersReplaceOutputSchema = z.undefined();
export type LeadsListFoldersReplaceOutput = z.infer<
	typeof LeadsListFoldersReplaceOutputSchema
>;

export const LeadsListFoldersDeleteInputSchema = z.object({ id: IdSchema });
export type LeadsListFoldersDeleteInput = z.infer<
	typeof LeadsListFoldersDeleteInputSchema
>;

export const LeadsListFoldersDeleteOutputSchema = z.undefined();
export type LeadsListFoldersDeleteOutput = z.infer<
	typeof LeadsListFoldersDeleteOutputSchema
>;

// ── Companies ───────────────────────────────────────────────────────────────

export const CompanySchema = z
	.object({
		id: z.number().optional(),
		domain: z.string().nullable().optional(),
		leads_count: z.number().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const CompaniesListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).max(9999).optional(),
	sort: z
		.enum([
			'company_name',
			'website',
			'company_size',
			'company_type',
			'leads_count',
			'created_at',
			'updated_at',
			'last_exported_at',
			'last_funding_date',
		])
		.optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	query: z.string().optional(),
	company_name: z.string().optional(),
	website: z.string().optional(),
	// Multi-value filters are pipe-separated in one parameter and numeric
	// ranges use `from:to` (e.g. leads_count=10:100); `~`/`*` match
	// empty/present values. Values are validated server-side.
	company_size: z.string().optional(),
	company_type: z.string().optional(),
	industry: z.string().optional(),
	technology: z.string().optional(),
	keywords: z.string().optional(),
	source: z.string().optional(),
	tags: z.string().optional(),
	company_list_ids: z.string().optional(),
	leads_count: z.string().optional(),
	location: z.string().optional(),
	country: z.string().optional(),
	founded_year: z.string().optional(),
	funding_series: z.string().optional(),
	funding_amount: z.string().optional(),
	last_funding_date: z.string().optional(),
	location_country_included: z.string().optional(),
	location_country_excluded: z.string().optional(),
	location_state_included: z.string().optional(),
	location_state_excluded: z.string().optional(),
	location_city_included: z.string().optional(),
	location_city_excluded: z.string().optional(),
	location_continent_included: z.string().optional(),
	location_continent_excluded: z.string().optional(),
	location_business_region_included: z.string().optional(),
	location_business_region_excluded: z.string().optional(),
});
export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;

export const CompaniesListOutputSchema = envelope(
	z.object({ companies: z.array(CompanySchema) }).passthrough(),
);
export type CompaniesListOutput = z.infer<typeof CompaniesListOutputSchema>;

export const CompaniesGetInputSchema = z.object({ id: IdSchema });
export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;

export const CompaniesGetOutputSchema = envelope(CompanySchema);
export type CompaniesGetOutput = z.infer<typeof CompaniesGetOutputSchema>;

export const CompaniesCreateInputSchema = z.object({
	// Must be a valid domain name that already exists in Hunter's database.
	domain: z.string(),
});
export type CompaniesCreateInput = z.infer<typeof CompaniesCreateInputSchema>;

export const CompaniesCreateOutputSchema = envelope(CompanySchema);
export type CompaniesCreateOutput = z.infer<typeof CompaniesCreateOutputSchema>;

export const CompaniesDeleteInputSchema = z.object({ id: IdSchema });
export type CompaniesDeleteInput = z.infer<typeof CompaniesDeleteInputSchema>;

export const CompaniesDeleteOutputSchema = z.undefined();
export type CompaniesDeleteOutput = z.infer<typeof CompaniesDeleteOutputSchema>;

export const CompaniesTagInputSchema = z
	.object({
		id: IdSchema,
		tag_id: IdSchema.optional(),
		tag_name: z.string().optional(),
	})
	.refine(
		(value) => value.tag_id !== undefined || value.tag_name !== undefined,
		{ message: 'Provide tag_id or tag_name' },
	);
export type CompaniesTagInput = z.infer<typeof CompaniesTagInputSchema>;

// Assigning returns the assigned tag (created on the fly when tag_name is
// given and unknown).
export const CompaniesTagOutputSchema = envelope(TagSchema);
export type CompaniesTagOutput = z.infer<typeof CompaniesTagOutputSchema>;

export const CompaniesUntagInputSchema = z.object({
	id: IdSchema,
	tag_id: IdSchema,
});
export type CompaniesUntagInput = z.infer<typeof CompaniesUntagInputSchema>;

export const CompaniesUntagOutputSchema = z.undefined();
export type CompaniesUntagOutput = z.infer<typeof CompaniesUntagOutputSchema>;

export const CompaniesBulkMoveInputSchema = z.object({
	company_list_id: IdSchema,
	target_company_list_id: IdSchema,
	company_ids: z.array(z.number().int()).optional(),
});
export type CompaniesBulkMoveInput = z.infer<
	typeof CompaniesBulkMoveInputSchema
>;

export const CompaniesBulkMoveOutputSchema = envelope(
	z
		.object({
			source_company_list_id: z.number().optional(),
			target_company_list_id: z.number().optional(),
			companies_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type CompaniesBulkMoveOutput = z.infer<
	typeof CompaniesBulkMoveOutputSchema
>;

export const CompaniesBulkCopyInputSchema = z
	.object({
		target_company_list_id: IdSchema,
		company_ids: z.array(z.number().int()).optional(),
		company_list_id: IdSchema.optional(),
	})
	.refine(
		(value) =>
			value.company_ids !== undefined || value.company_list_id !== undefined,
		{ message: 'Provide company_ids or company_list_id' },
	);
export type CompaniesBulkCopyInput = z.infer<
	typeof CompaniesBulkCopyInputSchema
>;

export const CompaniesBulkCopyOutputSchema = envelope(
	z
		.object({
			target_company_list_id: z.number().optional(),
			companies_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type CompaniesBulkCopyOutput = z.infer<
	typeof CompaniesBulkCopyOutputSchema
>;

export const CompaniesBulkDeleteInputSchema = z
	.object({
		company_ids: z.array(z.number().int()).optional(),
		company_list_id: IdSchema.optional(),
	})
	.refine(
		(value) =>
			value.company_ids !== undefined || value.company_list_id !== undefined,
		{ message: 'Provide company_ids or company_list_id' },
	);
export type CompaniesBulkDeleteInput = z.infer<
	typeof CompaniesBulkDeleteInputSchema
>;

// 200 when deleted inline (<= 10 companies), 202 when queued; `deleted_count`
// is only present on the inline completion.
export const CompaniesBulkDeleteOutputSchema = envelope(
	z
		.object({
			requested_count: z.number().optional(),
			deleted_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type CompaniesBulkDeleteOutput = z.infer<
	typeof CompaniesBulkDeleteOutputSchema
>;

export const CompaniesBulkTagInputSchema = z
	.object({
		company_ids: z.array(z.number().int()).optional(),
		company_list_id: IdSchema.optional(),
		tag_id: IdSchema.optional(),
		tag_name: z.string().optional(),
	})
	.refine(
		(value) =>
			(value.company_ids !== undefined ||
				value.company_list_id !== undefined) &&
			(value.tag_id !== undefined || value.tag_name !== undefined),
		{ message: 'Provide a company selection and tag_id or tag_name' },
	);
export type CompaniesBulkTagInput = z.infer<typeof CompaniesBulkTagInputSchema>;

export const CompaniesBulkTagOutputSchema = envelope(
	z
		.object({
			tag: TagSchema.optional(),
			companies_count: z.number().optional(),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type CompaniesBulkTagOutput = z.infer<
	typeof CompaniesBulkTagOutputSchema
>;

// ── Company lists ───────────────────────────────────────────────────────────

export const CompanyListSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		companies_count: z.number().optional(),
		company_list_folder_id: z.number().nullable().optional(),
		created_at: z.string().optional(),
		// Saved filter set for dynamic lists (open shape, resolved by Hunter).
		filters: z.unknown().optional(),
	})
	.passthrough();

export const CompanyListsListInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
export type CompanyListsListInput = z.infer<typeof CompanyListsListInputSchema>;

export const CompanyListsListOutputSchema = envelope(
	z.object({ company_lists: z.array(CompanyListSchema) }).passthrough(),
);
export type CompanyListsListOutput = z.infer<
	typeof CompanyListsListOutputSchema
>;

export const CompanyListsGetInputSchema = z.object({
	id: IdSchema,
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
export type CompanyListsGetInput = z.infer<typeof CompanyListsGetInputSchema>;

export const CompanyListsGetOutputSchema = envelope(
	CompanyListSchema.extend({
		companies: z.array(CompanySchema.passthrough()).optional(),
	}),
);
export type CompanyListsGetOutput = z.infer<typeof CompanyListsGetOutputSchema>;

// dynamic lists require their saved filters.
export const CompanyListsCreateInputSchema = z
	.object({
		name: z.string(),
		type: z.enum(['static', 'dynamic']).optional(),
		filters: z.unknown().optional(),
		company_list_folder_id: IdSchema.nullable().optional(),
	})
	.refine((value) => value.type !== 'dynamic' || value.filters !== undefined, {
		message: 'filters is required when type is dynamic',
	});
export type CompanyListsCreateInput = z.infer<
	typeof CompanyListsCreateInputSchema
>;

export const CompanyListsCreateOutputSchema = envelope(CompanyListSchema);
export type CompanyListsCreateOutput = z.infer<
	typeof CompanyListsCreateOutputSchema
>;

export const CompanyListsUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	type: z.enum(['static', 'dynamic']).optional(),
	filters: z.unknown().optional(),
	company_list_folder_id: IdSchema.nullable().optional(),
});
export type CompanyListsUpdateInput = z.infer<
	typeof CompanyListsUpdateInputSchema
>;

export const CompanyListsUpdateOutputSchema = z.undefined();
export type CompanyListsUpdateOutput = z.infer<
	typeof CompanyListsUpdateOutputSchema
>;

// PUT /company-lists/{id} mirrors PATCH; both documented as 204.
export const CompanyListsReplaceInputSchema = CompanyListsUpdateInputSchema;
export type CompanyListsReplaceInput = z.infer<
	typeof CompanyListsReplaceInputSchema
>;

export const CompanyListsReplaceOutputSchema = z.undefined();
export type CompanyListsReplaceOutput = z.infer<
	typeof CompanyListsReplaceOutputSchema
>;

export const CompanyListsDeleteInputSchema = z.object({ id: IdSchema });
export type CompanyListsDeleteInput = z.infer<
	typeof CompanyListsDeleteInputSchema
>;

export const CompanyListsDeleteOutputSchema = z.union([
	GenericResourceResponseSchema,
	z.undefined(),
]);
export type CompanyListsDeleteOutput = z.infer<
	typeof CompanyListsDeleteOutputSchema
>;

export const CompanyListsAddCompanyInputSchema = z.object({
	company_list_id: IdSchema,
	company_id: IdSchema,
});
export type CompanyListsAddCompanyInput = z.infer<
	typeof CompanyListsAddCompanyInputSchema
>;

export const CompanyListsAddCompanyOutputSchema = envelope(CompanySchema);
export type CompanyListsAddCompanyOutput = z.infer<
	typeof CompanyListsAddCompanyOutputSchema
>;

export const CompanyListsRemoveCompanyInputSchema = z.object({
	company_list_id: IdSchema,
	company_id: IdSchema,
});
export type CompanyListsRemoveCompanyInput = z.infer<
	typeof CompanyListsRemoveCompanyInputSchema
>;

export const CompanyListsRemoveCompanyOutputSchema = z.undefined();
export type CompanyListsRemoveCompanyOutput = z.infer<
	typeof CompanyListsRemoveCompanyOutputSchema
>;

export const CompanyListsFavoriteInputSchema = z.object({ id: IdSchema });
export type CompanyListsFavoriteInput = z.infer<
	typeof CompanyListsFavoriteInputSchema
>;

export const CompanyListsFavoriteOutputSchema = envelope(favoriteToggleFields);
export type CompanyListsFavoriteOutput = z.infer<
	typeof CompanyListsFavoriteOutputSchema
>;

export const CompanyListsUnfavoriteInputSchema = z.object({ id: IdSchema });
export type CompanyListsUnfavoriteInput = z.infer<
	typeof CompanyListsUnfavoriteInputSchema
>;

export const CompanyListsUnfavoriteOutputSchema =
	envelope(favoriteToggleFields);
export type CompanyListsUnfavoriteOutput = z.infer<
	typeof CompanyListsUnfavoriteOutputSchema
>;

// ── Company list folders ────────────────────────────────────────────────────

export const CompanyListFolderSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		color: z.string().nullable().optional(),
		company_lists_count: z.number().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const CompanyListFoldersListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type CompanyListFoldersListInput = z.infer<
	typeof CompanyListFoldersListInputSchema
>;

export const CompanyListFoldersListOutputSchema = envelope(
	z.object({ folders: z.array(CompanyListFolderSchema) }).passthrough(),
);
export type CompanyListFoldersListOutput = z.infer<
	typeof CompanyListFoldersListOutputSchema
>;

export const CompanyListFoldersGetInputSchema = z.object({ id: IdSchema });
export type CompanyListFoldersGetInput = z.infer<
	typeof CompanyListFoldersGetInputSchema
>;

export const CompanyListFoldersGetOutputSchema = envelope(
	CompanyListFolderSchema,
);
export type CompanyListFoldersGetOutput = z.infer<
	typeof CompanyListFoldersGetOutputSchema
>;

export const CompanyListFoldersCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
});
export type CompanyListFoldersCreateInput = z.infer<
	typeof CompanyListFoldersCreateInputSchema
>;

export const CompanyListFoldersCreateOutputSchema = envelope(
	CompanyListFolderSchema,
);
export type CompanyListFoldersCreateOutput = z.infer<
	typeof CompanyListFoldersCreateOutputSchema
>;

export const CompanyListFoldersUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	color: z.string().optional(),
});
export type CompanyListFoldersUpdateInput = z.infer<
	typeof CompanyListFoldersUpdateInputSchema
>;

export const CompanyListFoldersUpdateOutputSchema = z.undefined();
export type CompanyListFoldersUpdateOutput = z.infer<
	typeof CompanyListFoldersUpdateOutputSchema
>;

// PUT /company-lists/folders/{id} mirrors PATCH; both documented as 204.
export const CompanyListFoldersReplaceInputSchema =
	CompanyListFoldersUpdateInputSchema;
export type CompanyListFoldersReplaceInput = z.infer<
	typeof CompanyListFoldersReplaceInputSchema
>;

export const CompanyListFoldersReplaceOutputSchema = z.undefined();
export type CompanyListFoldersReplaceOutput = z.infer<
	typeof CompanyListFoldersReplaceOutputSchema
>;

export const CompanyListFoldersDeleteInputSchema = z.object({ id: IdSchema });
export type CompanyListFoldersDeleteInput = z.infer<
	typeof CompanyListFoldersDeleteInputSchema
>;

export const CompanyListFoldersDeleteOutputSchema = z.undefined();
export type CompanyListFoldersDeleteOutput = z.infer<
	typeof CompanyListFoldersDeleteOutputSchema
>;

// ── Company tags ────────────────────────────────────────────────────────────

export const CompanyTagsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type CompanyTagsListInput = z.infer<typeof CompanyTagsListInputSchema>;

export const CompanyTagsListOutputSchema = envelope(
	z.object({ tags: z.array(TagSchema) }).passthrough(),
);
export type CompanyTagsListOutput = z.infer<typeof CompanyTagsListOutputSchema>;

export const CompanyTagsGetInputSchema = z.object({ id: IdSchema });
export type CompanyTagsGetInput = z.infer<typeof CompanyTagsGetInputSchema>;

export const CompanyTagsGetOutputSchema = envelope(TagSchema);
export type CompanyTagsGetOutput = z.infer<typeof CompanyTagsGetOutputSchema>;

export const CompanyTagsCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
});
export type CompanyTagsCreateInput = z.infer<
	typeof CompanyTagsCreateInputSchema
>;

export const CompanyTagsCreateOutputSchema = envelope(TagSchema);
export type CompanyTagsCreateOutput = z.infer<
	typeof CompanyTagsCreateOutputSchema
>;

export const CompanyTagsUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	color: z.string().optional(),
});
export type CompanyTagsUpdateInput = z.infer<
	typeof CompanyTagsUpdateInputSchema
>;

export const CompanyTagsUpdateOutputSchema = envelope(TagSchema);
export type CompanyTagsUpdateOutput = z.infer<
	typeof CompanyTagsUpdateOutputSchema
>;

// PUT /company-tags/{id} mirrors PATCH; both return the updated tag (200).
export const CompanyTagsReplaceInputSchema = CompanyTagsUpdateInputSchema;
export type CompanyTagsReplaceInput = z.infer<
	typeof CompanyTagsReplaceInputSchema
>;

export const CompanyTagsReplaceOutputSchema = envelope(TagSchema);
export type CompanyTagsReplaceOutput = z.infer<
	typeof CompanyTagsReplaceOutputSchema
>;

export const CompanyTagsDeleteInputSchema = z.object({ id: IdSchema });
export type CompanyTagsDeleteInput = z.infer<
	typeof CompanyTagsDeleteInputSchema
>;

export const CompanyTagsDeleteOutputSchema = z.undefined();
export type CompanyTagsDeleteOutput = z.infer<
	typeof CompanyTagsDeleteOutputSchema
>;

// ── Lookalikes ──────────────────────────────────────────────────────────────

export const LookalikesListInputSchema = z
	.object({
		company_list_id: IdSchema.optional(),
		domain: z.string().optional(),
		country: z.string().optional(),
		// Repeated bracket-encoded values; companies with unknown size or
		// industry are excluded from those filters' results.
		size: z.array(z.string()).optional(),
		industry: z.array(z.string()).optional(),
		limit: z.number().int().min(1).optional(),
	})
	.refine(
		(value) =>
			value.company_list_id !== undefined || value.domain !== undefined,
		{ message: 'Provide company_list_id or domain' },
	);
export type LookalikesListInput = z.infer<typeof LookalikesListInputSchema>;

export const LookalikeSchema = z
	.object({
		company_name: z.string().nullable().optional(),
		domain: z.string().optional(),
		industry: z.string().nullable().optional(),
		size: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		similarity_score: z.number().optional(),
	})
	.passthrough();

export const LookalikesListOutputSchema = z
	.object({
		status: z.string().optional(),
		data: z.array(LookalikeSchema),
		meta: MetaSchema.optional(),
	})
	.passthrough();
export type LookalikesListOutput = z.infer<typeof LookalikesListOutputSchema>;

// ── Sequences ───────────────────────────────────────────────────────────────

export const SequenceStatusValues = [
	'draft',
	'planned',
	'active',
	'paused',
	'completed',
	'archived',
	'preparing',
	'error',
] as const;

export const SequenceOwnerSchema = z
	.object({
		id: z.number().optional(),
		email: z.string().optional(),
	})
	.passthrough();

export const SequenceSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		status: z.enum(SequenceStatusValues).optional(),
		recipients_count: z.number().optional(),
		editable: z.boolean().optional(),
		started: z.boolean().optional(),
		paused: z.boolean().optional(),
		archived: z.boolean().optional(),
		// Read-only in the API: updates send the top-level attribute names.
		schedule: z
			.object({
				start_at: z.string().nullable().optional(),
				time_start: z.string().optional(),
				time_end: z.string().optional(),
				days: z.array(z.number().int()).optional(),
			})
			.passthrough()
			.optional(),
		settings: z
			.object({
				tracked: z.boolean().optional(),
				tracked_links: z.boolean().optional(),
				add_unsubscribe_link: z.boolean().optional(),
				ai_assistant_enabled: z.boolean().optional(),
				bcc_recipient: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		ab_testing: z
			.object({
				enabled: z.boolean().optional(),
				variant_a_percentage: z.number().nullable().optional(),
				variant_b_percentage: z.number().nullable().optional(),
				winner_variant: z.string().nullable().optional(),
				winner_selected_at: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		email_account_ids: z.array(z.number().int()).optional(),
		follow_ups: z
			.object({
				unique_steps_count: z.number().optional(),
				steps: z.array(z.number().int()).optional(),
			})
			.passthrough()
			.optional(),
		owner: SequenceOwnerSchema.nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

const sequenceWriteFields = {
	name: z.string().optional(),
	email_account_ids: z.array(z.number().int()).optional(),
	schedule_time_start: z.string().optional(),
	schedule_time_end: z.string().optional(),
	schedule_days: z.array(z.number().int().min(0).max(6)).optional(),
	add_unsubscribe_link: z.boolean().optional(),
	tracked: z.boolean().optional(),
	// Requires the premium link-tracking entitlement.
	tracked_links: z.boolean().optional(),
	ai_assistant_enabled: z.boolean().optional(),
	bcc_recipient: z.string().nullable().optional(),
	start_at: z.string().nullable().optional(),
};

export const SequencesListInputSchema = z.object({
	started: z.boolean().optional(),
	archived: z.boolean().optional(),
	...paginationFields,
});
export type SequencesListInput = z.infer<typeof SequencesListInputSchema>;

export const SequencesListOutputSchema = envelope(
	z.object({ sequences: z.array(SequenceSchema) }).passthrough(),
);
export type SequencesListOutput = z.infer<typeof SequencesListOutputSchema>;

// The create endpoint also accepts an Idempotency-Key header; the plugin's
// request layer does not expose per-request headers, so retries use the
// server-side draft semantics instead.
export const SequencesCreateInputSchema = z.object({
	...sequenceWriteFields,
	name: z.string(),
});
export type SequencesCreateInput = z.infer<typeof SequencesCreateInputSchema>;

export const SequencesCreateOutputSchema = envelope(SequenceSchema);
export type SequencesCreateOutput = z.infer<typeof SequencesCreateOutputSchema>;

export const SequencesGetInputSchema = z.object({ id: IdSchema });
export type SequencesGetInput = z.infer<typeof SequencesGetInputSchema>;

export const SequencesGetOutputSchema = envelope(SequenceSchema);
export type SequencesGetOutput = z.infer<typeof SequencesGetOutputSchema>;

// JSON null on email_account_ids, schedule_time_*, schedule_days, and the
// boolean toggles leaves the value unchanged; only bcc_recipient and start_at
// accept an explicit null to clear.
export const SequencesUpdateInputSchema = z.object({
	...sequenceWriteFields,
	id: IdSchema,
});
export type SequencesUpdateInput = z.infer<typeof SequencesUpdateInputSchema>;

export const SequencesUpdateOutputSchema = envelope(SequenceSchema);
export type SequencesUpdateOutput = z.infer<typeof SequencesUpdateOutputSchema>;

export const SequencesReplaceInputSchema = SequencesUpdateInputSchema;
export type SequencesReplaceInput = z.infer<typeof SequencesReplaceInputSchema>;

export const SequencesReplaceOutputSchema = envelope(SequenceSchema);
export type SequencesReplaceOutput = z.infer<
	typeof SequencesReplaceOutputSchema
>;

export const SequencesDeleteInputSchema = z.object({ id: IdSchema });
export type SequencesDeleteInput = z.infer<typeof SequencesDeleteInputSchema>;

// Soft-deletes a draft only; started or archived sequences return
// 422 sequence_not_destroyable and must be archived instead.
export const SequencesDeleteOutputSchema = z.undefined();
export type SequencesDeleteOutput = z.infer<typeof SequencesDeleteOutputSchema>;

// start/pause/resume/archive all answer with the same small body
// (`message` and `recipients_count`) per the docs' start example.
export const SequenceActionOutputSchema = envelope(
	z
		.object({
			message: z.string().optional(),
			recipients_count: z.number().optional(),
		})
		.passthrough(),
);
export type SequenceActionOutput = z.infer<typeof SequenceActionOutputSchema>;

export const SequencesStartInputSchema = z.object({ id: IdSchema });
export type SequencesStartInput = z.infer<typeof SequencesStartInputSchema>;

export const SequencesStartOutputSchema = SequenceActionOutputSchema;
export type SequencesStartOutput = z.infer<typeof SequencesStartOutputSchema>;

export const SequencesPauseInputSchema = z.object({ id: IdSchema });
export type SequencesPauseInput = z.infer<typeof SequencesPauseInputSchema>;

export const SequencesPauseOutputSchema = SequenceActionOutputSchema;
export type SequencesPauseOutput = z.infer<typeof SequencesPauseOutputSchema>;

// Resuming is the DELETE of the pause resource.
export const SequencesResumeInputSchema = z.object({ id: IdSchema });
export type SequencesResumeInput = z.infer<typeof SequencesResumeInputSchema>;

export const SequencesResumeOutputSchema = SequenceActionOutputSchema;
export type SequencesResumeOutput = z.infer<typeof SequencesResumeOutputSchema>;

export const SequencesArchiveInputSchema = z.object({ id: IdSchema });
export type SequencesArchiveInput = z.infer<typeof SequencesArchiveInputSchema>;

export const SequencesArchiveOutputSchema = SequenceActionOutputSchema;
export type SequencesArchiveOutput = z.infer<
	typeof SequencesArchiveOutputSchema
>;

export const SequencesTestInputSchema = z.object({
	id: IdSchema,
	email: z.string(),
});
export type SequencesTestInput = z.infer<typeof SequencesTestInputSchema>;

// Queues one test message per step (202); rate limited to 30 test emails per
// 10 minutes.
export const SequencesTestOutputSchema = GenericResourceResponseSchema;
export type SequencesTestOutput = z.infer<typeof SequencesTestOutputSchema>;

// ── Sequence recipients ─────────────────────────────────────────────────────

export const SequenceRecipientSchema = z
	.object({
		email: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		position: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		sending_status: z.string().optional(),
		sending_status_comment: z.string().nullable().optional(),
		lead_id: z.number().nullable().optional(),
	})
	.passthrough();

export const SequenceRecipientsListInputSchema = z.object({
	id: IdSchema,
	...paginationFields,
});
export type SequenceRecipientsListInput = z.infer<
	typeof SequenceRecipientsListInputSchema
>;

export const SequenceRecipientsListOutputSchema = envelope(
	z.object({ recipients: z.array(SequenceRecipientSchema) }).passthrough(),
);
export type SequenceRecipientsListOutput = z.infer<
	typeof SequenceRecipientsListOutputSchema
>;

export const SkippedRecipientSchema = z
	.object({
		email: z.string().optional(),
		reason: z.string().optional(),
	})
	.passthrough();

export const SequenceRecipientsAddInputSchema = z
	.object({
		id: IdSchema,
		// A single address may be supplied as a plain string; otherwise an
		// array of up to 50.
		emails: z.union([z.string(), z.array(z.string()).max(50)]).optional(),
		lead_ids: z.array(z.number().int()).max(50).optional(),
	})
	.refine(
		(value) => value.emails !== undefined || value.lead_ids !== undefined,
		{ message: 'Provide emails or lead_ids' },
	);
export type SequenceRecipientsAddInput = z.infer<
	typeof SequenceRecipientsAddInputSchema
>;

export const SequenceRecipientsAddOutputSchema = envelope(
	z
		.object({
			recipients_added: z.number().optional(),
			// Per-request skip report; null when nothing was skipped.
			skipped_recipients: z.array(SkippedRecipientSchema).nullable().optional(),
		})
		.passthrough(),
);
export type SequenceRecipientsAddOutput = z.infer<
	typeof SequenceRecipientsAddOutputSchema
>;

// The API models this as a DELETE carrying a JSON body; a single address may
// be a plain string, otherwise an array of up to 50.
export const SequenceRecipientsRemoveInputSchema = z.object({
	id: IdSchema,
	emails: z.union([z.string(), z.array(z.string()).max(50)]),
});
export type SequenceRecipientsRemoveInput = z.infer<
	typeof SequenceRecipientsRemoveInputSchema
>;

export const SequenceRecipientsRemoveOutputSchema = envelope(
	z
		.object({
			recipients_removed: z.array(z.string()).optional(),
			recipients_canceled: z.array(z.string()).optional(),
			messages_canceled: z.number().optional(),
			skipped_recipients: z.array(SkippedRecipientSchema).nullable().optional(),
		})
		.passthrough(),
);
export type SequenceRecipientsRemoveOutput = z.infer<
	typeof SequenceRecipientsRemoveOutputSchema
>;

// ── Sequence follow-ups ─────────────────────────────────────────────────────

export const FollowUpSchema = z
	.object({
		id: z.number().optional(),
		// Legacy field name kept by the API; mirrors the owning sequence id.
		campaign_id: z.number().optional(),
		step: z.number().int().optional(),
		wait_days: z.number().int().optional(),
		message_format: z.string().nullable().optional(),
		messages_sent: z.number().optional(),
		subject: z.string().nullable().optional(),
		body: z.string().nullable().optional(),
		variant: z.string().nullable().optional(),
	})
	.passthrough();

export const SequenceFollowUpsListInputSchema = z.object({
	sequence_id: IdSchema,
	...paginationFields,
});
export type SequenceFollowUpsListInput = z.infer<
	typeof SequenceFollowUpsListInputSchema
>;

export const SequenceFollowUpsListOutputSchema = envelope(
	z.object({ follow_ups: z.array(FollowUpSchema) }).passthrough(),
);
export type SequenceFollowUpsListOutput = z.infer<
	typeof SequenceFollowUpsListOutputSchema
>;

export const SequenceFollowUpsCreateInputSchema = z
	.object({
		sequence_id: IdSchema,
		subject: z.string().optional(),
		body: z.string().optional(),
		wait_days: z.number().int().optional(),
		// With variant "B" the follow-up is added to an existing step and
		// omitted fields are copied from Variant A, so subject/body are only
		// required for a regular new step without a message_template_id.
		step: z.number().int().optional(),
		variant: z.literal('B').optional(),
		message_format: z.enum(['text', 'html']).optional(),
		message_template_id: IdSchema.optional(),
	})
	.refine(
		(value) =>
			value.variant === 'B' ||
			value.message_template_id !== undefined ||
			(value.subject !== undefined && value.body !== undefined),
		{
			message:
				'subject and body are required unless message_template_id is provided',
		},
	);
export type SequenceFollowUpsCreateInput = z.infer<
	typeof SequenceFollowUpsCreateInputSchema
>;

export const SequenceFollowUpsCreateOutputSchema = envelope(
	z.object({ follow_up: FollowUpSchema }),
);
export type SequenceFollowUpsCreateOutput = z.infer<
	typeof SequenceFollowUpsCreateOutputSchema
>;

export const SequenceFollowUpsGetInputSchema = z.object({
	sequence_id: IdSchema,
	id: IdSchema,
});
export type SequenceFollowUpsGetInput = z.infer<
	typeof SequenceFollowUpsGetInputSchema
>;

export const SequenceFollowUpsGetOutputSchema = envelope(FollowUpSchema);
export type SequenceFollowUpsGetOutput = z.infer<
	typeof SequenceFollowUpsGetOutputSchema
>;

export const SequenceFollowUpsUpdateInputSchema = z.object({
	sequence_id: IdSchema,
	id: IdSchema,
	subject: z.string().optional(),
	body: z.string().optional(),
	wait_days: z.number().int().optional(),
	message_format: z.enum(['text', 'html']).optional(),
});
export type SequenceFollowUpsUpdateInput = z.infer<
	typeof SequenceFollowUpsUpdateInputSchema
>;

export const SequenceFollowUpsUpdateOutputSchema = envelope(FollowUpSchema);
export type SequenceFollowUpsUpdateOutput = z.infer<
	typeof SequenceFollowUpsUpdateOutputSchema
>;

// PUT /sequences/{id}/follow-ups/{follow_up_id} mirrors PATCH; the docs
// document the PUT form (200 with the follow-up).
export const SequenceFollowUpsReplaceInputSchema =
	SequenceFollowUpsUpdateInputSchema;
export type SequenceFollowUpsReplaceInput = z.infer<
	typeof SequenceFollowUpsReplaceInputSchema
>;

export const SequenceFollowUpsReplaceOutputSchema = envelope(FollowUpSchema);
export type SequenceFollowUpsReplaceOutput = z.infer<
	typeof SequenceFollowUpsReplaceOutputSchema
>;

export const SequenceFollowUpsDeleteInputSchema = z.object({
	sequence_id: IdSchema,
	id: IdSchema,
});
export type SequenceFollowUpsDeleteInput = z.infer<
	typeof SequenceFollowUpsDeleteInputSchema
>;

// Only the last step can be deleted, and only while the sequence is not
// active; 422 otherwise.
export const SequenceFollowUpsDeleteOutputSchema = z.undefined();
export type SequenceFollowUpsDeleteOutput = z.infer<
	typeof SequenceFollowUpsDeleteOutputSchema
>;

// ── Sequence stats ──────────────────────────────────────────────────────────

export const SequenceStatsGetInputSchema = z.object({ id: IdSchema });
export type SequenceStatsGetInput = z.infer<typeof SequenceStatsGetInputSchema>;

// Counts for sent/delivered/opened/clicked/replied are recipient-based;
// bounced/bounce_rate are message-based (per the docs' stats note).
export const SequenceStatsGetOutputSchema = envelope(
	z
		.object({
			id: z.number().optional(),
			name: z.string().optional(),
			recipients_count: z.number().optional(),
			sent: z.number().optional(),
			delivered: z.number().optional(),
			opened: z.number().optional(),
			clicked: z.number().optional(),
			replied: z.number().optional(),
			bounced: z.number().optional(),
			unsubscribed_recipients: z.number().optional(),
			open_rate: z.number().nullable().optional(),
			click_rate: z.number().nullable().optional(),
			reply_rate: z.number().nullable().optional(),
			bounce_rate: z.number().nullable().optional(),
			unsubscribed_recipients_rate: z.number().nullable().optional(),
			follow_ups: z
				.array(
					z
						.object({
							id: z.number().optional(),
							step: z.number().optional(),
							variant: z.string().nullable().optional(),
							messages_sent: z.number().optional(),
							delivered: z.number().optional(),
							opened: z.number().optional(),
							clicked: z.number().optional(),
							replied: z.number().optional(),
							bounced: z.number().optional(),
							unsubscribed: z.number().optional(),
							open_rate: z.number().nullable().optional(),
							click_rate: z.number().nullable().optional(),
							reply_rate: z.number().nullable().optional(),
							bounce_rate: z.number().nullable().optional(),
							unsubscribe_rate: z.number().nullable().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
export type SequenceStatsGetOutput = z.infer<
	typeof SequenceStatsGetOutputSchema
>;

// ── Messages ────────────────────────────────────────────────────────────────

export const MessageLeadRefSchema = z
	.object({
		id: z.number().optional(),
		email: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
	})
	.passthrough();

export const MessageCampaignRefSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		recipients_count: z.number().optional(),
		started: z.boolean().optional(),
		archived: z.boolean().optional(),
		paused: z.boolean().optional(),
		last_email_sent_at: z.string().nullable().optional(),
	})
	.passthrough();

export const MessageSchema = z
	.object({
		id: z.number().optional(),
		status: z.string().optional(),
		// Provider-side identifiers used to thread replies.
		message_id: z.string().nullable().optional(),
		thread_id: z.string().nullable().optional(),
		to: z.string().nullable().optional(),
		subject: z.string().nullable().optional(),
		body: z.string().nullable().optional(),
		manually_edited: z.boolean().optional(),
		opens: z.number().optional(),
		clicks: z.number().optional(),
		bounced: z.boolean().optional(),
		replied: z.boolean().optional(),
		last_activity_at: z.string().nullable().optional(),
		sent_at: z.string().nullable().optional(),
		lead: MessageLeadRefSchema.nullable().optional(),
		campaign: MessageCampaignRefSchema.nullable().optional(),
		owner: SequenceOwnerSchema.nullable().optional(),
	})
	.passthrough();

export const MessagesListInputSchema = z.object({
	// Comma-separated list of statuses, or an array which the client joins.
	status: z.union([z.string(), z.array(z.string())]).optional(),
	direction: z.enum(['outgoing', 'incoming']).optional(),
	read: z.boolean().optional(),
	replied: z.boolean().optional(),
	bounced: z.boolean().optional(),
	unsubscribed: z.boolean().optional(),
	out_of_office: z.boolean().optional(),
	lead_id: IdSchema.optional(),
	sequence_id: IdSchema.optional(),
	// Alias of sequence_id kept for backwards compatibility.
	campaign_id: IdSchema.optional(),
	email_account_id: IdSchema.optional(),
	sent_after: z.string().optional(),
	sent_before: z.string().optional(),
	received_after: z.string().optional(),
	received_before: z.string().optional(),
	q: z.string().optional(),
	...paginationFields,
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesListOutputSchema = envelope(
	z.object({ messages: z.array(MessageSchema) }).passthrough(),
);
export type MessagesListOutput = z.infer<typeof MessagesListOutputSchema>;

export const MessagesSendInputSchema = z
	.object({
		email_account_id: IdSchema,
		lead_id: IdSchema.optional(),
		to: z.string().optional(),
		subject: z.string().max(250),
		body: z.string().max(50000),
		message_format: z.enum(['text', 'html']).optional(),
	})
	.refine((value) => value.lead_id !== undefined || value.to !== undefined, {
		message: 'Provide lead_id or to',
	});
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

// Sent synchronously; the response carries the provider's message_id and the
// sent_at timestamp. The API also rejects subjects starting with "[TEST]".
export const MessagesSendOutputSchema = envelope(MessageSchema);
export type MessagesSendOutput = z.infer<typeof MessagesSendOutputSchema>;

// ── Message templates ───────────────────────────────────────────────────────

export const MessageTemplateSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		subject: z.string().nullable().optional(),
		body: z.string().nullable().optional(),
		message_format: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const MessageTemplatesListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type MessageTemplatesListInput = z.infer<
	typeof MessageTemplatesListInputSchema
>;

export const MessageTemplatesListOutputSchema = envelope(
	z.object({
		message_templates: z.array(MessageTemplateSchema),
	}),
);
export type MessageTemplatesListOutput = z.infer<
	typeof MessageTemplatesListOutputSchema
>;

export const MessageTemplatesGetInputSchema = z.object({ id: IdSchema });
export type MessageTemplatesGetInput = z.infer<
	typeof MessageTemplatesGetInputSchema
>;

export const MessageTemplatesGetOutputSchema = envelope(MessageTemplateSchema);
export type MessageTemplatesGetOutput = z.infer<
	typeof MessageTemplatesGetOutputSchema
>;

export const MessageTemplatesCreateInputSchema = z.object({
	name: z.string(),
	subject: z.string().max(255).optional(),
	body: z.string(),
	message_format: z.enum(['text', 'html']).optional(),
});
export type MessageTemplatesCreateInput = z.infer<
	typeof MessageTemplatesCreateInputSchema
>;

export const MessageTemplatesCreateOutputSchema = envelope(
	MessageTemplateSchema,
);
export type MessageTemplatesCreateOutput = z.infer<
	typeof MessageTemplatesCreateOutputSchema
>;

export const MessageTemplatesUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	subject: z.string().max(255).optional(),
	body: z.string().optional(),
	message_format: z.enum(['text', 'html']).optional(),
});
export type MessageTemplatesUpdateInput = z.infer<
	typeof MessageTemplatesUpdateInputSchema
>;

export const MessageTemplatesUpdateOutputSchema = envelope(
	MessageTemplateSchema,
);
export type MessageTemplatesUpdateOutput = z.infer<
	typeof MessageTemplatesUpdateOutputSchema
>;

// PUT /message-templates/{id} mirrors PATCH; the docs document the PUT form
// (200 with the updated template).
export const MessageTemplatesReplaceInputSchema =
	MessageTemplatesUpdateInputSchema;
export type MessageTemplatesReplaceInput = z.infer<
	typeof MessageTemplatesReplaceInputSchema
>;

export const MessageTemplatesReplaceOutputSchema = envelope(
	MessageTemplateSchema,
);
export type MessageTemplatesReplaceOutput = z.infer<
	typeof MessageTemplatesReplaceOutputSchema
>;

export const MessageTemplatesDeleteInputSchema = z.object({ id: IdSchema });
export type MessageTemplatesDeleteInput = z.infer<
	typeof MessageTemplatesDeleteInputSchema
>;

export const MessageTemplatesDeleteOutputSchema = z.undefined();
export type MessageTemplatesDeleteOutput = z.infer<
	typeof MessageTemplatesDeleteOutputSchema
>;

// ── Email accounts ──────────────────────────────────────────────────────────

export const EmailAccountSchema = z
	.object({
		id: z.number().optional(),
		email: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		sending_status: z.string().optional(),
		daily_limit: z.number().optional(),
		provider: z.string().optional(),
		// Detail fields returned by the single-account calls.
		sender_name: z.string().nullable().optional(),
		default_account: z.boolean().optional(),
		signature: z.string().nullable().optional(),
		profile_picture_url: z.string().nullable().optional(),
		custom_tracking_domain: z.string().nullable().optional(),
		sending_schedule: z
			.object({
				// 0 = Monday through 6 = Sunday.
				days: z.array(z.number().int()).optional(),
				start_time: z.string().optional(),
				end_time: z.string().optional(),
				time_zone: z.string().optional(),
			})
			.passthrough()
			.optional(),
		warmup: z
			.object({
				enabled: z.boolean().optional(),
				status: z.string().nullable().optional(),
				end_date: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const EmailAccountsListInputSchema = z.object({
	...paginationFields,
});
export type EmailAccountsListInput = z.infer<
	typeof EmailAccountsListInputSchema
>;

export const EmailAccountsListOutputSchema = envelope(
	z.array(EmailAccountSchema),
);
export type EmailAccountsListOutput = z.infer<
	typeof EmailAccountsListOutputSchema
>;

export const EmailAccountsGetInputSchema = z.object({ id: IdSchema });
export type EmailAccountsGetInput = z.infer<typeof EmailAccountsGetInputSchema>;

export const EmailAccountsGetOutputSchema = envelope(EmailAccountSchema);
export type EmailAccountsGetOutput = z.infer<
	typeof EmailAccountsGetOutputSchema
>;

// The docs' update example sends these as query parameters (the endpoint
// changes settings only), so the same fields are sent the same way here.
// daily_limit: 1-400 for gmail, 1-250 for outlook/smtp_imap, and it cannot
// change while the account is warming up.
export const EmailAccountsUpdateInputSchema = z.object({
	id: IdSchema,
	daily_limit: z.number().int().min(1).optional(),
	sender_name: z.string().optional(),
	signature: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	default_account: z.boolean().optional(),
});
export type EmailAccountsUpdateInput = z.infer<
	typeof EmailAccountsUpdateInputSchema
>;

export const EmailAccountsUpdateOutputSchema = envelope(EmailAccountSchema);
export type EmailAccountsUpdateOutput = z.infer<
	typeof EmailAccountsUpdateOutputSchema
>;

// PATCH /email-accounts/{id} mirrors the documented PUT; both return the
// account in the same shape.
export const EmailAccountsReplaceInputSchema = EmailAccountsUpdateInputSchema;
export type EmailAccountsReplaceInput = z.infer<
	typeof EmailAccountsReplaceInputSchema
>;

export const EmailAccountsReplaceOutputSchema = envelope(EmailAccountSchema);
export type EmailAccountsReplaceOutput = z.infer<
	typeof EmailAccountsReplaceOutputSchema
>;

export const EmailAccountsCapacitiesInputSchema = z.object({}).passthrough();
export type EmailAccountsCapacitiesInput = z.infer<
	typeof EmailAccountsCapacitiesInputSchema
>;

export const EmailAccountCapacitySchema = z
	.object({
		id: z.number().optional(),
		email: z.string().nullable().optional(),
		sent: z.number().optional(),
		daily_limit: z.number().optional(),
		scheduled: z.number().optional(),
	})
	.passthrough();

// Unpaginated; meta.results carries the account count.
export const EmailAccountsCapacitiesOutputSchema = envelope(
	z.array(EmailAccountCapacitySchema),
);
export type EmailAccountsCapacitiesOutput = z.infer<
	typeof EmailAccountsCapacitiesOutputSchema
>;

export const EmailAccountsHealthReportInputSchema = z.object({
	id: IdSchema,
});
export type EmailAccountsHealthReportInput = z.infer<
	typeof EmailAccountsHealthReportInputSchema
>;

// score/status/domain_score/checked_at are null without a paid plan and a
// completed deliverability check; issues stays populated.
export const EmailAccountsHealthReportOutputSchema = envelope(
	z
		.object({
			score: z.number().nullable().optional(),
			status: z.string().nullable().optional(),
			domain: z.string().nullable().optional(),
			domain_score: z.number().nullable().optional(),
			checked_at: z.string().nullable().optional(),
			issues: z
				.object({
					disconnected: z.boolean().optional(),
					no_recent_sending_activity: z.boolean().optional(),
					no_inbox_protection: z.boolean().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
);
export type EmailAccountsHealthReportOutput = z.infer<
	typeof EmailAccountsHealthReportOutputSchema
>;

export const EmailAccountsUsageInputSchema = z.object({ id: IdSchema });
export type EmailAccountsUsageInput = z.infer<
	typeof EmailAccountsUsageInputSchema
>;

export const EmailAccountsUsageOutputSchema = envelope(
	z
		.object({
			sent_today: z.number().optional(),
			sent_last_7_days: z
				.array(
					z
						.object({
							date: z.string().optional(),
							count: z.number().optional(),
							capacity: z.number().optional(),
						})
						.passthrough(),
				)
				.optional(),
			daily_limit: z.number().optional(),
			scheduled: z.number().optional(),
			available: z.number().optional(),
		})
		.passthrough(),
);
export type EmailAccountsUsageOutput = z.infer<
	typeof EmailAccountsUsageOutputSchema
>;

export const EmailAccountsWarmupReportInputSchema = z.object({
	id: IdSchema,
});
export type EmailAccountsWarmupReportInput = z.infer<
	typeof EmailAccountsWarmupReportInputSchema
>;

// 404 when the account never had a warmup mailbox; metrics is null while the
// warmup provider is unreachable.
export const EmailAccountsWarmupReportOutputSchema = envelope(
	z
		.object({
			state: z.string().optional(),
			progress: z
				.object({
					percent: z.number().optional(),
					end_date: z.string().optional(),
					current_limit: z.number().optional(),
					target_limit: z.number().optional(),
				})
				.passthrough()
				.optional(),
			metrics: z
				.object({
					emails_sent: z.number().optional(),
					interactions: z.number().optional(),
					in_spam: z.number().optional(),
				})
				.passthrough()
				.nullable()
				.optional(),
			chart_data: z
				.array(
					z
						.object({
							date: z.string().optional(),
							sent: z.number().optional(),
							scheduled: z.number().optional(),
						})
						.passthrough(),
				)
				.optional(),
			billing_cycle: z.string().nullable().optional(),
		})
		.passthrough(),
);
export type EmailAccountsWarmupReportOutput = z.infer<
	typeof EmailAccountsWarmupReportOutputSchema
>;

export const EmailAccountsSequencesInputSchema = z.object({
	email_account_id: IdSchema,
	include_archived: z.boolean().optional(),
	...paginationFields,
});
export type EmailAccountsSequencesInput = z.infer<
	typeof EmailAccountsSequencesInputSchema
>;

export const EmailAccountSequenceSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		recipients_allocated: z.number().optional(),
		emails_scheduled: z.number().optional(),
	})
	.passthrough();

export const EmailAccountsSequencesOutputSchema = envelope(
	z.array(EmailAccountSequenceSchema),
);
export type EmailAccountsSequencesOutput = z.infer<
	typeof EmailAccountsSequencesOutputSchema
>;

// ── Webhooks ────────────────────────────────────────────────────────────────

export const WebhookEventValues = [
	'lead.created',
	'message.sent',
	'message.read',
	'message.clicked',
	'message.replied',
	'export.completed',
	'import.completed',
	'sequence.paused',
	'sequence.resumed',
] as const;

export const WebhookSchema = z
	.object({
		id: z.number().optional(),
		target_url: z.string().optional(),
		event: z.string().optional(),
	})
	.passthrough();

export const WebhooksListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

export const WebhooksListOutputSchema = envelope(z.array(WebhookSchema));
export type WebhooksListOutput = z.infer<typeof WebhooksListOutputSchema>;

export const WebhooksCreateInputSchema = z.object({
	target_url: z.string().min(12).max(500),
	event: z.enum(WebhookEventValues),
	// Restrict to a single resource by global ID (for example a campaign).
	filter_on: IdSchema.optional(),
});
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

export const WebhooksCreateOutputSchema = envelope(WebhookSchema);
export type WebhooksCreateOutput = z.infer<typeof WebhooksCreateOutputSchema>;

export const WebhooksGetInputSchema = z.object({ id: IdSchema });
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

export const WebhooksGetOutputSchema = envelope(WebhookSchema);
export type WebhooksGetOutput = z.infer<typeof WebhooksGetOutputSchema>;

export const WebhooksUpdateInputSchema = z.object({
	id: IdSchema,
	target_url: z.string().min(12).max(500).optional(),
	event: z.enum(WebhookEventValues).optional(),
	filter_on: IdSchema.optional(),
});
export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

export const WebhooksUpdateOutputSchema = envelope(WebhookSchema);
export type WebhooksUpdateOutput = z.infer<typeof WebhooksUpdateOutputSchema>;

export const WebhooksReplaceInputSchema = WebhooksUpdateInputSchema;
export type WebhooksReplaceInput = z.infer<typeof WebhooksReplaceInputSchema>;

export const WebhooksReplaceOutputSchema = envelope(WebhookSchema);
export type WebhooksReplaceOutput = z.infer<typeof WebhooksReplaceOutputSchema>;

export const WebhooksDeleteInputSchema = z.object({ id: IdSchema });
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

export const WebhooksDeleteOutputSchema = z.undefined();
export type WebhooksDeleteOutput = z.infer<typeof WebhooksDeleteOutputSchema>;

// Collection delete: the docs document this query-parameter form
// (`DELETE /webhooks?id=`) as the delete operation.
export const WebhooksDeleteLegacyInputSchema = z.object({ id: IdSchema });
export type WebhooksDeleteLegacyInput = z.infer<
	typeof WebhooksDeleteLegacyInputSchema
>;

export const WebhooksDeleteLegacyOutputSchema = z.undefined();
export type WebhooksDeleteLegacyOutput = z.infer<
	typeof WebhooksDeleteLegacyOutputSchema
>;

export const HunterioEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	accountUpdate: AccountUpdateInputSchema,
	accountStatsGet: AccountStatsGetInputSchema,
	usageGet: UsageGetInputSchema,
	usageHistory: UsageHistoryGetInputSchema,
	teamMembersList: TeamMembersListInputSchema,
	apiKeysList: ApiKeysListInputSchema,
	apiKeysCreate: ApiKeysCreateInputSchema,
	apiKeysUpdate: ApiKeysUpdateInputSchema,
	apiKeysReplace: ApiKeysReplaceInputSchema,
	apiKeysDelete: ApiKeysDeleteInputSchema,
	connectedAppsList: ConnectedAppsListInputSchema,
	connectedAppsGet: ConnectedAppsGetInputSchema,
	connectedAppsPush: ConnectedAppsPushInputSchema,
	feedbackCreate: FeedbackCreateInputSchema,
	discoverCompanies: DiscoverCompaniesInputSchema,
	discoverPeople: DiscoverPeopleInputSchema,
	discoverPeoplePost: DiscoverPeoplePostInputSchema,
	discoverViewsList: DiscoverViewsListInputSchema,
	discoverViewsCreate: DiscoverViewsCreateInputSchema,
	discoverViewsGet: DiscoverViewsGetInputSchema,
	discoverViewsDelete: DiscoverViewsDeleteInputSchema,
	domainCountGet: DomainCountGetInputSchema,
	domainFinderFind: DomainFinderFindInputSchema,
	domainFinderFindPost: DomainFinderFindPostInputSchema,
	domainsSuggestionGet: DomainsSuggestionGetInputSchema,
	domainSearchSearch: DomainSearchSearchInputSchema,
	domainSearchSearchPost: DomainSearchSearchPostInputSchema,
	multiDomainSearchSearch: MultiDomainSearchSearchInputSchema,
	multiDomainSearchReveal: MultiDomainSearchRevealInputSchema,
	emailFinderFind: EmailFinderFindInputSchema,
	emailFinderFindFound: EmailFinderFindFoundInputSchema,
	emailFinderFindFoundPost: EmailFinderFindFoundPostInputSchema,
	emailVerifierVerify: EmailVerifierVerifyInputSchema,
	emailInsightGet: EmailInsightGetInputSchema,
	emailCountGet: EmailCountGetInputSchema,
	enrichmentPerson: EnrichmentPersonInputSchema,
	enrichmentCompany: EnrichmentCompanyInputSchema,
	enrichmentCombined: EnrichmentCombinedInputSchema,
	leadsList: LeadsListInputSchema,
	leadsCreate: LeadsCreateInputSchema,
	leadsUpsert: LeadsUpsertInputSchema,
	leadsGet: LeadsGetInputSchema,
	leadsUpdate: LeadsUpdateInputSchema,
	leadsReplace: LeadsReplaceInputSchema,
	leadsDelete: LeadsDeleteInputSchema,
	leadsEnrich: LeadsEnrichInputSchema,
	leadsExist: LeadsExistInputSchema,
	leadsBulkExist: LeadsBulkExistInputSchema,
	leadsBulkUpsert: LeadsBulkUpsertInputSchema,
	leadsBulkMove: LeadsBulkMoveInputSchema,
	leadsBulkDelete: LeadsBulkDeleteInputSchema,
	leadsImportCsv: LeadsImportCsvInputSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsReplace: TagsReplaceInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	leadTagsAttach: LeadTagsAttachInputSchema,
	leadTagsDetach: LeadTagsDetachInputSchema,
	customAttributesList: CustomAttributesListInputSchema,
	customAttributesCreate: CustomAttributesCreateInputSchema,
	customAttributesGet: CustomAttributesGetInputSchema,
	customAttributesUpdate: CustomAttributesUpdateInputSchema,
	customAttributesReplace: CustomAttributesReplaceInputSchema,
	customAttributesDelete: CustomAttributesDeleteInputSchema,
	leadsListsList: LeadsListsListInputSchema,
	leadsListsCreate: LeadsListsCreateInputSchema,
	leadsListsGet: LeadsListsGetInputSchema,
	leadsListsUpdate: LeadsListsUpdateInputSchema,
	leadsListsReplace: LeadsListsReplaceInputSchema,
	leadsListsDelete: LeadsListsDeleteInputSchema,
	leadsListsFavorite: LeadsListsFavoriteInputSchema,
	leadsListsUnfavorite: LeadsListsUnfavoriteInputSchema,
	leadsListsMerge: LeadsListsMergeInputSchema,
	leadsListFoldersList: LeadsListFoldersListInputSchema,
	leadsListFoldersCreate: LeadsListFoldersCreateInputSchema,
	leadsListFoldersGet: LeadsListFoldersGetInputSchema,
	leadsListFoldersUpdate: LeadsListFoldersUpdateInputSchema,
	leadsListFoldersReplace: LeadsListFoldersReplaceInputSchema,
	leadsListFoldersDelete: LeadsListFoldersDeleteInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesCreate: CompaniesCreateInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	companiesTag: CompaniesTagInputSchema,
	companiesUntag: CompaniesUntagInputSchema,
	companiesBulkMove: CompaniesBulkMoveInputSchema,
	companiesBulkCopy: CompaniesBulkCopyInputSchema,
	companiesBulkDelete: CompaniesBulkDeleteInputSchema,
	companiesBulkTag: CompaniesBulkTagInputSchema,
	companyListsList: CompanyListsListInputSchema,
	companyListsCreate: CompanyListsCreateInputSchema,
	companyListsGet: CompanyListsGetInputSchema,
	companyListsUpdate: CompanyListsUpdateInputSchema,
	companyListsReplace: CompanyListsReplaceInputSchema,
	companyListsDelete: CompanyListsDeleteInputSchema,
	companyListsAddCompany: CompanyListsAddCompanyInputSchema,
	companyListsRemoveCompany: CompanyListsRemoveCompanyInputSchema,
	companyListsFavorite: CompanyListsFavoriteInputSchema,
	companyListsUnfavorite: CompanyListsUnfavoriteInputSchema,
	companyListFoldersList: CompanyListFoldersListInputSchema,
	companyListFoldersCreate: CompanyListFoldersCreateInputSchema,
	companyListFoldersGet: CompanyListFoldersGetInputSchema,
	companyListFoldersUpdate: CompanyListFoldersUpdateInputSchema,
	companyListFoldersReplace: CompanyListFoldersReplaceInputSchema,
	companyListFoldersDelete: CompanyListFoldersDeleteInputSchema,
	companyTagsList: CompanyTagsListInputSchema,
	companyTagsCreate: CompanyTagsCreateInputSchema,
	companyTagsGet: CompanyTagsGetInputSchema,
	companyTagsUpdate: CompanyTagsUpdateInputSchema,
	companyTagsReplace: CompanyTagsReplaceInputSchema,
	companyTagsDelete: CompanyTagsDeleteInputSchema,
	lookalikesList: LookalikesListInputSchema,
	sequencesList: SequencesListInputSchema,
	sequencesCreate: SequencesCreateInputSchema,
	sequencesGet: SequencesGetInputSchema,
	sequencesUpdate: SequencesUpdateInputSchema,
	sequencesReplace: SequencesReplaceInputSchema,
	sequencesDelete: SequencesDeleteInputSchema,
	sequencesStart: SequencesStartInputSchema,
	sequencesPause: SequencesPauseInputSchema,
	sequencesResume: SequencesResumeInputSchema,
	sequencesArchive: SequencesArchiveInputSchema,
	sequencesTest: SequencesTestInputSchema,
	sequenceRecipientsList: SequenceRecipientsListInputSchema,
	sequenceRecipientsAdd: SequenceRecipientsAddInputSchema,
	sequenceRecipientsRemove: SequenceRecipientsRemoveInputSchema,
	sequenceFollowUpsList: SequenceFollowUpsListInputSchema,
	sequenceFollowUpsCreate: SequenceFollowUpsCreateInputSchema,
	sequenceFollowUpsGet: SequenceFollowUpsGetInputSchema,
	sequenceFollowUpsUpdate: SequenceFollowUpsUpdateInputSchema,
	sequenceFollowUpsReplace: SequenceFollowUpsReplaceInputSchema,
	sequenceFollowUpsDelete: SequenceFollowUpsDeleteInputSchema,
	sequenceStatsGet: SequenceStatsGetInputSchema,
	messagesList: MessagesListInputSchema,
	messagesSend: MessagesSendInputSchema,
	messageTemplatesList: MessageTemplatesListInputSchema,
	messageTemplatesCreate: MessageTemplatesCreateInputSchema,
	messageTemplatesGet: MessageTemplatesGetInputSchema,
	messageTemplatesUpdate: MessageTemplatesUpdateInputSchema,
	messageTemplatesReplace: MessageTemplatesReplaceInputSchema,
	messageTemplatesDelete: MessageTemplatesDeleteInputSchema,
	emailAccountsList: EmailAccountsListInputSchema,
	emailAccountsGet: EmailAccountsGetInputSchema,
	emailAccountsUpdate: EmailAccountsUpdateInputSchema,
	emailAccountsReplace: EmailAccountsReplaceInputSchema,
	emailAccountsCapacities: EmailAccountsCapacitiesInputSchema,
	emailAccountsHealthReport: EmailAccountsHealthReportInputSchema,
	emailAccountsUsage: EmailAccountsUsageInputSchema,
	emailAccountsWarmupReport: EmailAccountsWarmupReportInputSchema,
	emailAccountsSequences: EmailAccountsSequencesInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksReplace: WebhooksReplaceInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksDeleteLegacy: WebhooksDeleteLegacyInputSchema,
} as const;

export type HunterioEndpointInputs = {
	[K in keyof typeof HunterioEndpointInputSchemas]: z.infer<
		(typeof HunterioEndpointInputSchemas)[K]
	>;
};

export const HunterioEndpointOutputSchemas = {
	accountGet: AccountGetOutputSchema,
	accountUpdate: AccountUpdateOutputSchema,
	accountStatsGet: AccountStatsGetOutputSchema,
	usageGet: UsageGetOutputSchema,
	usageHistory: UsageHistoryGetOutputSchema,
	teamMembersList: TeamMembersListOutputSchema,
	apiKeysList: ApiKeysListOutputSchema,
	apiKeysCreate: ApiKeysCreateOutputSchema,
	apiKeysUpdate: ApiKeysUpdateOutputSchema,
	apiKeysReplace: ApiKeysReplaceOutputSchema,
	apiKeysDelete: ApiKeysDeleteOutputSchema,
	connectedAppsList: ConnectedAppsListOutputSchema,
	connectedAppsGet: ConnectedAppsGetOutputSchema,
	connectedAppsPush: ConnectedAppsPushOutputSchema,
	feedbackCreate: FeedbackCreateOutputSchema,
	discoverCompanies: DiscoverCompaniesOutputSchema,
	discoverPeople: DiscoverPeopleOutputSchema,
	discoverPeoplePost: DiscoverPeoplePostOutputSchema,
	discoverViewsList: DiscoverViewsListOutputSchema,
	discoverViewsCreate: DiscoverViewsCreateOutputSchema,
	discoverViewsGet: DiscoverViewsGetOutputSchema,
	discoverViewsDelete: DiscoverViewsDeleteOutputSchema,
	domainCountGet: DomainCountGetOutputSchema,
	domainFinderFind: DomainFinderFindOutputSchema,
	domainFinderFindPost: DomainFinderFindPostOutputSchema,
	domainsSuggestionGet: DomainsSuggestionGetOutputSchema,
	domainSearchSearch: DomainSearchSearchOutputSchema,
	domainSearchSearchPost: DomainSearchSearchPostOutputSchema,
	multiDomainSearchSearch: MultiDomainSearchSearchOutputSchema,
	multiDomainSearchReveal: MultiDomainSearchRevealOutputSchema,
	emailFinderFind: EmailFinderFindOutputSchema,
	emailFinderFindFound: EmailFinderFindFoundOutputSchema,
	emailFinderFindFoundPost: EmailFinderFindFoundPostOutputSchema,
	emailVerifierVerify: EmailVerifierVerifyOutputSchema,
	emailInsightGet: EmailInsightGetOutputSchema,
	emailCountGet: EmailCountGetOutputSchema,
	enrichmentPerson: EnrichmentPersonOutputSchema,
	enrichmentCompany: EnrichmentCompanyOutputSchema,
	enrichmentCombined: EnrichmentCombinedOutputSchema,
	leadsList: LeadsListOutputSchema,
	leadsCreate: LeadsCreateOutputSchema,
	leadsUpsert: LeadsUpsertOutputSchema,
	leadsGet: LeadsGetOutputSchema,
	leadsUpdate: LeadsUpdateOutputSchema,
	leadsReplace: LeadsReplaceOutputSchema,
	leadsDelete: LeadsDeleteOutputSchema,
	leadsEnrich: LeadsEnrichOutputSchema,
	leadsExist: LeadsExistOutputSchema,
	leadsBulkExist: LeadsBulkExistOutputSchema,
	leadsBulkUpsert: LeadsBulkUpsertOutputSchema,
	leadsBulkMove: LeadsBulkMoveOutputSchema,
	leadsBulkDelete: LeadsBulkDeleteOutputSchema,
	leadsImportCsv: LeadsImportCsvOutputSchema,
	tagsList: TagsListOutputSchema,
	tagsCreate: TagsCreateOutputSchema,
	tagsGet: TagsGetOutputSchema,
	tagsUpdate: TagsUpdateOutputSchema,
	tagsReplace: TagsReplaceOutputSchema,
	tagsDelete: TagsDeleteOutputSchema,
	leadTagsAttach: LeadTagsAttachOutputSchema,
	leadTagsDetach: LeadTagsDetachOutputSchema,
	customAttributesList: CustomAttributesListOutputSchema,
	customAttributesCreate: CustomAttributesCreateOutputSchema,
	customAttributesGet: CustomAttributesGetOutputSchema,
	customAttributesUpdate: CustomAttributesUpdateOutputSchema,
	customAttributesReplace: CustomAttributesReplaceOutputSchema,
	customAttributesDelete: CustomAttributesDeleteOutputSchema,
	leadsListsList: LeadsListsListOutputSchema,
	leadsListsCreate: LeadsListsCreateOutputSchema,
	leadsListsGet: LeadsListsGetOutputSchema,
	leadsListsUpdate: LeadsListsUpdateOutputSchema,
	leadsListsReplace: LeadsListsReplaceOutputSchema,
	leadsListsDelete: LeadsListsDeleteOutputSchema,
	leadsListsFavorite: LeadsListsFavoriteOutputSchema,
	leadsListsUnfavorite: LeadsListsUnfavoriteOutputSchema,
	leadsListsMerge: LeadsListsMergeOutputSchema,
	leadsListFoldersList: LeadsListFoldersListOutputSchema,
	leadsListFoldersCreate: LeadsListFoldersCreateOutputSchema,
	leadsListFoldersGet: LeadsListFoldersGetOutputSchema,
	leadsListFoldersUpdate: LeadsListFoldersUpdateOutputSchema,
	leadsListFoldersReplace: LeadsListFoldersReplaceOutputSchema,
	leadsListFoldersDelete: LeadsListFoldersDeleteOutputSchema,
	companiesList: CompaniesListOutputSchema,
	companiesCreate: CompaniesCreateOutputSchema,
	companiesGet: CompaniesGetOutputSchema,
	companiesDelete: CompaniesDeleteOutputSchema,
	companiesTag: CompaniesTagOutputSchema,
	companiesUntag: CompaniesUntagOutputSchema,
	companiesBulkMove: CompaniesBulkMoveOutputSchema,
	companiesBulkCopy: CompaniesBulkCopyOutputSchema,
	companiesBulkDelete: CompaniesBulkDeleteOutputSchema,
	companiesBulkTag: CompaniesBulkTagOutputSchema,
	companyListsList: CompanyListsListOutputSchema,
	companyListsCreate: CompanyListsCreateOutputSchema,
	companyListsGet: CompanyListsGetOutputSchema,
	companyListsUpdate: CompanyListsUpdateOutputSchema,
	companyListsReplace: CompanyListsReplaceOutputSchema,
	companyListsDelete: CompanyListsDeleteOutputSchema,
	companyListsAddCompany: CompanyListsAddCompanyOutputSchema,
	companyListsRemoveCompany: CompanyListsRemoveCompanyOutputSchema,
	companyListsFavorite: CompanyListsFavoriteOutputSchema,
	companyListsUnfavorite: CompanyListsUnfavoriteOutputSchema,
	companyListFoldersList: CompanyListFoldersListOutputSchema,
	companyListFoldersCreate: CompanyListFoldersCreateOutputSchema,
	companyListFoldersGet: CompanyListFoldersGetOutputSchema,
	companyListFoldersUpdate: CompanyListFoldersUpdateOutputSchema,
	companyListFoldersReplace: CompanyListFoldersReplaceOutputSchema,
	companyListFoldersDelete: CompanyListFoldersDeleteOutputSchema,
	companyTagsList: CompanyTagsListOutputSchema,
	companyTagsCreate: CompanyTagsCreateOutputSchema,
	companyTagsGet: CompanyTagsGetOutputSchema,
	companyTagsUpdate: CompanyTagsUpdateOutputSchema,
	companyTagsReplace: CompanyTagsReplaceOutputSchema,
	companyTagsDelete: CompanyTagsDeleteOutputSchema,
	lookalikesList: LookalikesListOutputSchema,
	sequencesList: SequencesListOutputSchema,
	sequencesCreate: SequencesCreateOutputSchema,
	sequencesGet: SequencesGetOutputSchema,
	sequencesUpdate: SequencesUpdateOutputSchema,
	sequencesReplace: SequencesReplaceOutputSchema,
	sequencesDelete: SequencesDeleteOutputSchema,
	sequencesStart: SequencesStartOutputSchema,
	sequencesPause: SequencesPauseOutputSchema,
	sequencesResume: SequencesResumeOutputSchema,
	sequencesArchive: SequencesArchiveOutputSchema,
	sequencesTest: SequencesTestOutputSchema,
	sequenceRecipientsList: SequenceRecipientsListOutputSchema,
	sequenceRecipientsAdd: SequenceRecipientsAddOutputSchema,
	sequenceRecipientsRemove: SequenceRecipientsRemoveOutputSchema,
	sequenceFollowUpsList: SequenceFollowUpsListOutputSchema,
	sequenceFollowUpsCreate: SequenceFollowUpsCreateOutputSchema,
	sequenceFollowUpsGet: SequenceFollowUpsGetOutputSchema,
	sequenceFollowUpsUpdate: SequenceFollowUpsUpdateOutputSchema,
	sequenceFollowUpsReplace: SequenceFollowUpsReplaceOutputSchema,
	sequenceFollowUpsDelete: SequenceFollowUpsDeleteOutputSchema,
	sequenceStatsGet: SequenceStatsGetOutputSchema,
	messagesList: MessagesListOutputSchema,
	messagesSend: MessagesSendOutputSchema,
	messageTemplatesList: MessageTemplatesListOutputSchema,
	messageTemplatesCreate: MessageTemplatesCreateOutputSchema,
	messageTemplatesGet: MessageTemplatesGetOutputSchema,
	messageTemplatesUpdate: MessageTemplatesUpdateOutputSchema,
	messageTemplatesReplace: MessageTemplatesReplaceOutputSchema,
	messageTemplatesDelete: MessageTemplatesDeleteOutputSchema,
	emailAccountsList: EmailAccountsListOutputSchema,
	emailAccountsGet: EmailAccountsGetOutputSchema,
	emailAccountsUpdate: EmailAccountsUpdateOutputSchema,
	emailAccountsReplace: EmailAccountsReplaceOutputSchema,
	emailAccountsCapacities: EmailAccountsCapacitiesOutputSchema,
	emailAccountsHealthReport: EmailAccountsHealthReportOutputSchema,
	emailAccountsUsage: EmailAccountsUsageOutputSchema,
	emailAccountsWarmupReport: EmailAccountsWarmupReportOutputSchema,
	emailAccountsSequences: EmailAccountsSequencesOutputSchema,
	webhooksList: WebhooksListOutputSchema,
	webhooksCreate: WebhooksCreateOutputSchema,
	webhooksGet: WebhooksGetOutputSchema,
	webhooksUpdate: WebhooksUpdateOutputSchema,
	webhooksReplace: WebhooksReplaceOutputSchema,
	webhooksDelete: WebhooksDeleteOutputSchema,
	webhooksDeleteLegacy: WebhooksDeleteLegacyOutputSchema,
} as const;

export type HunterioEndpointOutputs = {
	[K in keyof typeof HunterioEndpointOutputSchemas]: z.infer<
		(typeof HunterioEndpointOutputSchemas)[K]
	>;
};
