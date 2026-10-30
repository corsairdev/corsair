import { z } from 'zod';

/**
 * Every schema below is transcribed from the OpenAPI definitions published on
 * https://docs.securitytrails.com (append `.md` to any reference page to get
 * the machine-readable version).
 *
 * Response objects are `.loose()` and their fields optional on purpose:
 * SecurityTrails omits keys it has no data for and ships fields that predate
 * the published spec (`ports` on a DSL IP record is documented only in the
 * response example, not the schema). A strict shape would turn a provider-side
 * addition into an outage, so we validate what the docs promise and let the
 * rest through untouched.
 */

const NonEmptyString = z.string().trim().min(1);

/** Shared page cursor for the classic (v1) paginated endpoints. */
const PageNumber = z.number().int().positive();

// ───────────────────────────── Ping ─────────────────────────────
// GET /v1/ping

const PingInputSchema = z.object({});

const PingResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.loose();

// ───────────────────────────── Usage ─────────────────────────────
// GET /v1/account/usage

const AccountUsageInputSchema = z.object({});

const AccountUsageResponseSchema = z
	.object({
		current_monthly_usage: z.number().int().optional(),
		allowed_monthly_usage: z.number().int().optional(),
	})
	.loose();

// ─────────────────────────── Get Domain ───────────────────────────
// GET /v1/domain/{hostname}

const DomainGetInputSchema = z.object({
	hostname: NonEmptyString,
});

const DnsRecordSetSchema = <T extends z.ZodTypeAny>(values: T) =>
	z
		.object({
			first_seen: z.string().nullable().optional(),
			values: z.array(values).optional(),
		})
		.loose();

const DomainGetResponseSchema = z
	.object({
		hostname: z.string().optional(),
		alexa_rank: z.number().int().nullable().optional(),
		current_dns: z
			.object({
				a: DnsRecordSetSchema(
					z
						.object({
							ip: z.string().optional(),
							ip_count: z.number().int().optional(),
						})
						.loose(),
				).optional(),
				aaaa: DnsRecordSetSchema(
					z
						.object({
							ip: z.string().optional(),
							ip_count: z.number().int().optional(),
						})
						.loose(),
				).optional(),
				mx: DnsRecordSetSchema(
					z
						.object({
							priority: z.number().int().optional(),
							host: z.string().optional(),
							host_count: z.number().int().optional(),
						})
						.loose(),
				).optional(),
				ns: DnsRecordSetSchema(
					z
						.object({
							nameserver: z.string().optional(),
							nameserver_count: z.number().int().optional(),
						})
						.loose(),
				).optional(),
				soa: DnsRecordSetSchema(
					z
						.object({
							ttl: z.number().int().optional(),
							email: z.string().optional(),
							email_count: z.number().int().optional(),
						})
						.loose(),
				).optional(),
				txt: DnsRecordSetSchema(
					z
						.object({
							value: z.string().optional(),
						})
						.loose(),
				).optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

// ───────────────────────── Get Domain SSL ─────────────────────────
// GET /v1/domain/{hostname}/ssl

const DomainSslInputSchema = z.object({
	hostname: NonEmptyString,
	include_subdomains: z.boolean().optional(),
	status: z.enum(['valid', 'all', 'expired']).optional(),
	page: PageNumber.optional(),
});

const SslCertificateSchema = z
	.object({
		dns_names: z.array(z.string()).optional(),
		fingerprints: z
			.object({
				sha1: z.string().optional(),
				sha256: z.string().optional(),
			})
			.loose()
			.optional(),
		issuer: z
			.object({
				common_name: z.string().optional(),
				country: z.array(z.string()).optional(),
				organization: z.array(z.string()).optional(),
			})
			.loose()
			.optional(),
		subject: z.record(z.string(), z.unknown()).optional(),
		/** Unix seconds, per the published example. */
		not_after: z.number().int().nullable().optional(),
		not_before: z.number().int().nullable().optional(),
		serial_number: z.string().optional(),
	})
	.loose();

/**
 * `meta.query.apikey` is echoed back by the provider. See `redactEchoedApiKey`
 * in `../client` — it never reaches a caller, a log line or the entity store.
 */
const DomainSslMetaSchema = z
	.object({
		max_page: z.number().int().optional(),
		page: z.number().int().optional(),
		total_pages: z.number().int().optional(),
		query: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const DomainSslResponseSchema = z
	.object({
		endpoint: z.string().optional(),
		meta: DomainSslMetaSchema.optional(),
		record_count: z.number().int().optional(),
		records: z.array(SslCertificateSchema).optional(),
	})
	.loose();

// ─────────────────────── Search IPs (DSL) ───────────────────────
// POST /v1/ips/list

const IpsSearchInputSchema = z.object({
	query: NonEmptyString,
	page: PageNumber.optional(),
});

const IpRecordSchema = z
	.object({
		ip: z.string().optional(),
		ptr: z.string().nullable().optional(),
		/** Present in the documented response example but absent from its schema. */
		ports: z.array(z.number().int()).optional(),
	})
	.loose();

const IpsSearchResponseSchema = z
	.object({
		endpoint: z.string().optional(),
		records: z.array(IpRecordSchema).optional(),
		record_count: z.number().int().optional(),
		meta: z
			.object({
				total_pages: z.number().int().optional(),
				query: z.string().optional(),
				page: z.number().int().optional(),
				max_page: z.number().int().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

// ───────────────────── IP Search statistics ─────────────────────
// POST /v1/ips/stats

const IpsStatsInputSchema = z.object({
	query: NonEmptyString,
});

const IpsStatsResponseSchema = z
	.object({
		endpoint: z.string().optional(),
		top_ptr_patterns: z
			.array(
				z
					.object({
						key: z.string().optional(),
						count: z.number().int().optional(),
					})
					.loose(),
			)
			.optional(),
		ports: z
			.array(
				z
					.object({
						key: z.number().int().optional(),
						count: z.number().int().optional(),
					})
					.loose(),
			)
			.optional(),
		total: z.number().int().optional(),
	})
	.loose();

// ───────────────────────────── Scroll ─────────────────────────────
// GET /v1/scroll/{scroll_id}

const ScrollGetInputSchema = z.object({
	scroll_id: NonEmptyString,
});

/**
 * Scroll replays whichever DSL endpoint opened the cursor, so its body is that
 * endpoint's own envelope. The docs type the 200 as `text/plain` with the note
 * "(Returns the original endpoints results)", which is why this stays open.
 */
const ScrollGetResponseSchema = z.record(z.string(), z.unknown());

// ─────────────────────────── SQL API ───────────────────────────
// POST /v1/query/scroll  and  GET /v1/query/scroll/{id}

const SqlQueryInputSchema = z.object({
	query: NonEmptyString,
	page: PageNumber.optional(),
});

const SqlScrollInputSchema = z.object({
	id: NonEmptyString,
});

const SqlQueryResponseSchema = z
	.object({
		query: z.string().optional(),
		/** Scrolling cursor; valid for only a couple of minutes per the docs. */
		id: z.string().nullable().optional(),
		total: z
			.object({
				/** Documented as a string in the example, an integer in practice. */
				value: z.union([z.string(), z.number()]).optional(),
				relation: z.string().optional(),
			})
			.loose()
			.optional(),
		/** Capped at 100 records per page by the provider. */
		records: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

// ───────────── Get Associated IPs for Company Domain ─────────────
// GET /v2/company/{domain}/associated-ips

const CompanyAssociatedIpsInputSchema = z.object({
	domain: NonEmptyString,
	page: PageNumber.optional(),
	page_size: z.number().int().positive().optional(),
});

const CompanyAssociatedIpsResponseSchema = z
	.object({
		records: z
			.array(
				z
					.object({
						cidr: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		query: z.string().optional(),
		record_count: z.number().int().optional(),
		domain: z.string().optional(),
		page: z.number().int().optional(),
		page_size: z.number().int().optional(),
		redir: z.string().nullable().optional(),
	})
	.loose();

// ────────────────────────── ASI Projects ──────────────────────────
// GET /v2/projects

const ProjectsListInputSchema = z.object({
	sort_direction: z.enum(['asc', 'desc']).optional(),
});

const ApiPaginationSchema = z
	.object({
		next_cursor: z.string().nullable().optional(),
		limit: z.number().int().optional(),
		total: z.number().int().nullable().optional(),
		sort: z.array(z.array(z.string())).nullable().optional(),
	})
	.loose();

const ApiMetaSchema = z
	.object({
		params: z.record(z.string(), z.unknown()).nullable().optional(),
		counts: z
			.object({
				total: z.number().int().nullable().optional(),
				returned: z.number().int().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		pagination: ApiPaginationSchema.nullable().optional(),
		request_id: z.string().nullable().optional(),
	})
	.loose();

const ProjectSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		scanning_enabled: z.boolean().nullable().optional(),
		last_scanned_at: z.string().nullable().optional(),
		inserted_at: z.string().nullable().optional(),
		max_exposure_score: z.number().int().nullable().optional(),
	})
	.loose();

const ProjectsListResponseSchema = z
	.object({
		data: z.array(ProjectSchema).optional(),
		meta: ApiMetaSchema.optional(),
	})
	.loose();

// ───────────────── Bulk static asset rules (ASI) ─────────────────
// POST /v2/projects/{project_id}/rules/_bulk_static_assets

const MembershipTypeSchema = z.enum(['include', 'exclude']);
const StaticTypeSchema = z.enum(['ipv4', 'hostname', 'wildcard']);

const StaticAssetRuleSchema = z.object({
	asset: NonEmptyString,
	membership_type: MembershipTypeSchema,
	static_type: StaticTypeSchema,
});

/** The provider rejects requests above this combined add + remove count. */
export const BULK_STATIC_ASSET_RULE_LIMIT = 1000;

const BulkStaticAssetRulesInputSchema = z
	.object({
		project_id: NonEmptyString,
		add_rules: z.array(StaticAssetRuleSchema).optional(),
		remove_rules: z.array(StaticAssetRuleSchema).optional(),
	})
	.refine(
		(value) =>
			(value.add_rules?.length ?? 0) + (value.remove_rules?.length ?? 0) > 0,
		{ message: 'Provide at least one rule in add_rules or remove_rules' },
	)
	.refine(
		(value) =>
			(value.add_rules?.length ?? 0) + (value.remove_rules?.length ?? 0) <=
			BULK_STATIC_ASSET_RULE_LIMIT,
		{
			message: `add_rules and remove_rules may not exceed ${BULK_STATIC_ASSET_RULE_LIMIT} rules combined`,
		},
	);

const StaticAssetRuleErrorSchema = z
	.object({
		rule: StaticAssetRuleSchema.nullable().optional(),
		failed: z.boolean().nullable().optional(),
		messages: z.array(z.string()).nullable().optional(),
	})
	.loose();

const BulkStaticAssetRulesResponseSchema = z
	.object({
		data: z
			.object({
				added: z.array(StaticAssetRuleSchema).optional(),
				removed: z.array(StaticAssetRuleSchema).optional(),
				errors: z.array(StaticAssetRuleErrorSchema).optional(),
			})
			.loose()
			.optional(),
		meta: ApiMetaSchema.nullable().optional(),
		/**
		 * Tagging and rule writes are asynchronous: the provider waits up to two
		 * seconds, then hands back task ids to poll instead of a finished result.
		 */
		complete: z.boolean().optional(),
		task_ids: z.array(z.string()).optional(),
	})
	.loose();

// ─────────────────────────── Exports ───────────────────────────

export type PingInput = z.infer<typeof PingInputSchema>;
export type PingResponse = z.infer<typeof PingResponseSchema>;
export type AccountUsageInput = z.infer<typeof AccountUsageInputSchema>;
export type AccountUsageResponse = z.infer<typeof AccountUsageResponseSchema>;
export type DomainGetInput = z.infer<typeof DomainGetInputSchema>;
export type DomainGetResponse = z.infer<typeof DomainGetResponseSchema>;
export type DomainSslInput = z.infer<typeof DomainSslInputSchema>;
export type DomainSslResponse = z.infer<typeof DomainSslResponseSchema>;
export type IpsSearchInput = z.infer<typeof IpsSearchInputSchema>;
export type IpsSearchResponse = z.infer<typeof IpsSearchResponseSchema>;
export type IpsStatsInput = z.infer<typeof IpsStatsInputSchema>;
export type IpsStatsResponse = z.infer<typeof IpsStatsResponseSchema>;
export type ScrollGetInput = z.infer<typeof ScrollGetInputSchema>;
export type ScrollGetResponse = z.infer<typeof ScrollGetResponseSchema>;
export type SqlQueryInput = z.infer<typeof SqlQueryInputSchema>;
export type SqlQueryResponse = z.infer<typeof SqlQueryResponseSchema>;
export type SqlScrollInput = z.infer<typeof SqlScrollInputSchema>;
export type CompanyAssociatedIpsInput = z.infer<
	typeof CompanyAssociatedIpsInputSchema
>;
export type CompanyAssociatedIpsResponse = z.infer<
	typeof CompanyAssociatedIpsResponseSchema
>;
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type BulkStaticAssetRulesInput = z.infer<
	typeof BulkStaticAssetRulesInputSchema
>;
export type BulkStaticAssetRulesResponse = z.infer<
	typeof BulkStaticAssetRulesResponseSchema
>;
export type StaticAssetRule = z.infer<typeof StaticAssetRuleSchema>;
export type SecuritytrailsProject = z.infer<typeof ProjectSchema>;
export type SecuritytrailsIpRecord = z.infer<typeof IpRecordSchema>;
export type SecuritytrailsSslCertificate = z.infer<typeof SslCertificateSchema>;

export type SecuritytrailsEndpointInputs = {
	ping: PingInput;
	accountUsage: AccountUsageInput;
	domainGet: DomainGetInput;
	domainSsl: DomainSslInput;
	ipsSearch: IpsSearchInput;
	ipsStats: IpsStatsInput;
	scrollGet: ScrollGetInput;
	sqlQuery: SqlQueryInput;
	sqlScroll: SqlScrollInput;
	companyAssociatedIps: CompanyAssociatedIpsInput;
	projectsList: ProjectsListInput;
	projectsBulkStaticAssetRules: BulkStaticAssetRulesInput;
};

export type SecuritytrailsEndpointOutputs = {
	ping: PingResponse;
	accountUsage: AccountUsageResponse;
	domainGet: DomainGetResponse;
	domainSsl: DomainSslResponse;
	ipsSearch: IpsSearchResponse;
	ipsStats: IpsStatsResponse;
	scrollGet: ScrollGetResponse;
	sqlQuery: SqlQueryResponse;
	sqlScroll: SqlQueryResponse;
	companyAssociatedIps: CompanyAssociatedIpsResponse;
	projectsList: ProjectsListResponse;
	projectsBulkStaticAssetRules: BulkStaticAssetRulesResponse;
};

export const SecuritytrailsEndpointInputSchemas = {
	ping: PingInputSchema,
	accountUsage: AccountUsageInputSchema,
	domainGet: DomainGetInputSchema,
	domainSsl: DomainSslInputSchema,
	ipsSearch: IpsSearchInputSchema,
	ipsStats: IpsStatsInputSchema,
	scrollGet: ScrollGetInputSchema,
	sqlQuery: SqlQueryInputSchema,
	sqlScroll: SqlScrollInputSchema,
	companyAssociatedIps: CompanyAssociatedIpsInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsBulkStaticAssetRules: BulkStaticAssetRulesInputSchema,
} as const;

export const SecuritytrailsEndpointOutputSchemas = {
	ping: PingResponseSchema,
	accountUsage: AccountUsageResponseSchema,
	domainGet: DomainGetResponseSchema,
	domainSsl: DomainSslResponseSchema,
	ipsSearch: IpsSearchResponseSchema,
	ipsStats: IpsStatsResponseSchema,
	scrollGet: ScrollGetResponseSchema,
	sqlQuery: SqlQueryResponseSchema,
	sqlScroll: SqlQueryResponseSchema,
	companyAssociatedIps: CompanyAssociatedIpsResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsBulkStaticAssetRules: BulkStaticAssetRulesResponseSchema,
} as const;
