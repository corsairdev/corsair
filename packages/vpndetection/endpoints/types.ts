import { z } from 'zod';

// Shapes follow the public OpenAPI spec
// (https://s3.vpndetection.io/vpndetection-public/openapi/openapi.json,
// version 2026.11.28) and were checked against live answers on 2026-11-28.
// A field the caller's plan does not include is absent, so every field past
// the always-present ones is optional and unknown fields pass through.

const AddressSchema = z.union([z.ipv4(), z.ipv6()]);

const UserAgentInput = z
	.string()
	.max(1024)
	.optional()
	.describe(
		"The visitor's User-Agent. With every field, the answer then carries `user_agent` with a verdict on it. Never kept.",
	);

export const LookupIpInputSchema = z.object({
	// An address, never any string: `myip` would reach the self-lookup path
	// and be saved as if the caller had named an address.
	ip: AddressSchema.optional().describe(
		'IPv4 or IPv6 address. Omit it and the service looks up the caller address.',
	),
	userAgent: UserAgentInput,
});

export type LookupIpInput = z.infer<typeof LookupIpInputSchema>;

/** Who runs a Tor node or a privacy relay, when the dataset knows. Empty otherwise. */
const NetworkDetailSchema = z
	.object({
		provider: z.string().optional(),
		provider_name: z.string().optional(),
		confidence: z.string().optional(),
		first_seen: z.string().optional(),
		last_seen: z.string().optional(),
	})
	.passthrough();

const VpnDetailSchema = NetworkDetailSchema.extend({
	method: z.string().optional(),
}).passthrough();

const ProxyDetailSchema = NetworkDetailSchema.extend({
	hits: z.number().optional(),
	hits_days_pct: z.number().optional(),
	providers_num: z.number().optional(),
}).passthrough();

const BotDetailSchema = NetworkDetailSchema.extend({
	agents: z.array(z.string()).optional(),
	categories: z.array(z.string()).optional(),
	verified: z.boolean().optional(),
	identity: z.string().optional(),
	verified_by: z.string().optional(),
}).passthrough();

// The remaining detail objects are typed loosely: each is optional, only
// present with a plan that includes it, and passes through whole.
const DetailSchema = z.object({}).passthrough();

const LocationSchema = z
	.object({
		continent: z.string().optional(),
		continent_name: z.string().optional(),
		country: z.string().optional(),
		country_name: z.string().optional(),
		timezone: z.string().optional(),
		currency_code: z.string().optional(),
		currency_name: z.string().optional(),
		currency_symbol: z.string().optional(),
		flag_emoji: z.string().optional(),
		flag_unicode: z.string().optional(),
		region: z.string().optional(),
		region_code: z.string().optional(),
		city: z.string().optional(),
		postal_code: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		accuracy_radius: z.number().optional(),
		geoname_id: z.string().optional(),
		dma_code: z.string().optional(),
		last_changed: z.string().optional(),
	})
	.passthrough();

const AsnSchema = z
	.object({
		asn: z.number().optional(),
		name: z.string().optional(),
		domain: z.string().optional(),
		type: z.string().optional(),
		prefix: z.string().optional(),
		country: z.string().optional(),
		rpki_status: z.string().optional(),
	})
	.passthrough();

/**
 * The fields every answer carries, with or without a key, plus every field a
 * paid plan adds. A field the plan does not include is absent rather than
 * `false`, so test for presence.
 * https://docs.vpndetection.io/api/lookup/lookupIp
 */
export const LookupIpResponseSchema = z
	.object({
		ip: z.string(),
		is_vpn: z.boolean(),
		is_tor: z.boolean().optional(),
		is_relay: z.boolean().optional(),
		is_bogon: z.boolean().optional(),
		is_anycast: z.boolean().optional(),
		is_hosting: z.boolean().optional(),
		is_cdn: z.boolean().optional(),
		is_bot: z.boolean().optional(),
		is_resproxy: z.boolean().optional(),
		is_dcproxy: z.boolean().optional(),
		is_mobproxy: z.boolean().optional(),
		is_pubproxy: z.boolean().optional(),
		is_carrier: z.boolean().optional(),
		is_satellite: z.boolean().optional(),
		is_ssh: z.boolean().optional(),
		is_smtp: z.boolean().optional(),
		is_web: z.boolean().optional(),
		is_dns_resolver: z.boolean().optional(),
		is_bittorrent: z.boolean().optional(),
		vpn: VpnDetailSchema.optional(),
		hosting: NetworkDetailSchema.optional(),
		tor: NetworkDetailSchema.optional(),
		relay: NetworkDetailSchema.optional(),
		cdn: NetworkDetailSchema.optional(),
		bot: BotDetailSchema.optional(),
		resproxy: ProxyDetailSchema.optional(),
		dcproxy: ProxyDetailSchema.optional(),
		mobproxy: ProxyDetailSchema.optional(),
		pubproxy: DetailSchema.optional(),
		carrier: DetailSchema.optional(),
		satellite: DetailSchema.optional(),
		ssh: DetailSchema.optional(),
		smtp: DetailSchema.optional(),
		web: z.array(DetailSchema).optional(),
		dns_resolver: DetailSchema.optional(),
		bittorrent: DetailSchema.optional(),
		location: LocationSchema.optional(),
		asn: AsnSchema.optional(),
		company: DetailSchema.optional(),
		hostname: z.string().optional(),
		abuse: DetailSchema.optional(),
		user_agent: DetailSchema.optional(),
		trial_expired: z.boolean().optional(),
		cap_reached: z.boolean().optional(),
	})
	.passthrough();

export type LookupIpResponse = z.infer<typeof LookupIpResponseSchema>;

export const BatchLookupInputSchema = z.object({
	ips: z
		.array(z.string().min(1))
		.min(1)
		.max(1000)
		.describe(
			'1 to 1000 addresses. Each distinct string is one lookup; a string that is not an address comes back in `errors` as a 400.',
		),
	userAgents: z
		.record(z.string(), z.string().max(1024))
		.optional()
		.describe(
			"Each address's User-Agent, keyed by the string as it appears in `ips`. Never kept.",
		),
});

export type BatchLookupInput = z.infer<typeof BatchLookupInputSchema>;

const BatchLookupErrorSchema = z
	.object({
		status: z.number().optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const BatchLookupResponseSchema = z
	.object({
		results: z.record(z.string(), LookupIpResponseSchema),
		errors: z.record(z.string(), BatchLookupErrorSchema),
	})
	.passthrough();

export type BatchLookupResponse = z.infer<typeof BatchLookupResponseSchema>;

// ── Databases ─────────────────────────────────────────────────────────────

const DatabaseFormatSchema = z.enum(['csvgz', 'mmdb']);

const DatabaseIdInput = z
	.string()
	.min(1)
	.describe(
		'A versioned database ID from databases.list `versions[].id`, e.g. `tor_ip_v1`.',
	);

export const DatabasesListInputSchema = z.object({});
export type DatabasesListInput = z.infer<typeof DatabasesListInputSchema>;

const DatabaseVersionSchema = z
	.object({
		id: z.string(),
		version: z.number().optional(),
		summary: z.string().optional(),
		formats: z
			.array(
				z
					.object({
						format: z.string(),
						bytes: z.number().nullable().optional(),
					})
					.passthrough(),
			)
			.optional(),
		sample_formats: z.array(z.string()).optional(),
	})
	.passthrough();

export const DatabasesListResponseSchema = z
	.object({
		databases: z.array(
			z
				.object({
					base: z.string(),
					name: z.string().optional(),
					summary: z.string().optional(),
					license_type: z.string().nullable().optional(),
					starts: z.string().nullable().optional(),
					expires: z.string().nullable().optional(),
					renews_at: z.string().nullable().optional(),
					notice_due_at: z.string().nullable().optional(),
					in_term: z.boolean().optional(),
					standing: z.string().optional(),
					open: z.boolean().optional(),
					versions: z.array(DatabaseVersionSchema).optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type DatabasesListResponse = z.infer<typeof DatabasesListResponseSchema>;

export const DatabasesDownloadInputSchema = z.object({
	id: DatabaseIdInput,
	format: DatabaseFormatSchema.describe(
		'`csvgz` or `mmdb`. The `_provider` catalogs come as `csvgz` only.',
	),
	build: z
		.string()
		.optional()
		.describe(
			'One build by the name a database.updated webhook gives it (kept 7 days). Omit for the live build.',
		),
});
export type DatabasesDownloadInput = z.infer<
	typeof DatabasesDownloadInputSchema
>;

export const DatabasesDownloadResponseSchema = z.object({
	url: z
		.string()
		.describe(
			'Time-limited link to the file on object storage; it only has to be valid when the download starts.',
		),
});
export type DatabasesDownloadResponse = z.infer<
	typeof DatabasesDownloadResponseSchema
>;

export const DatabasesMetadataInputSchema = z.object({ id: DatabaseIdInput });
export type DatabasesMetadataInput = z.infer<
	typeof DatabasesMetadataInputSchema
>;

export const DatabasesMetadataResponseSchema = z
	.object({
		id: z.string(),
		update_freq: z.string().optional(),
		updated: z.string().optional(),
		entries: z.number().optional(),
		schema: z.unknown().optional(),
		sample: z.unknown().optional(),
		size: z.record(z.string(), z.unknown()).optional(),
		sample_size: z.record(z.string(), z.unknown()).optional(),
		sample_entries: z.number().optional(),
	})
	.passthrough();
export type DatabasesMetadataResponse = z.infer<
	typeof DatabasesMetadataResponseSchema
>;

export const DatabasesChecksumInputSchema = z.object({
	id: DatabaseIdInput,
	format: DatabaseFormatSchema,
});
export type DatabasesChecksumInput = z.infer<
	typeof DatabasesChecksumInputSchema
>;

export const DatabasesChecksumResponseSchema = z
	.object({
		id: z.string(),
		format: z.string(),
		checksums: z
			.object({
				md5: z.string().optional(),
				sha1: z.string().optional(),
				sha256: z.string().optional(),
				sha512: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type DatabasesChecksumResponse = z.infer<
	typeof DatabasesChecksumResponseSchema
>;

export const DatabasesDownloadsInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many recent attempts to return, newest first.'),
});
export type DatabasesDownloadsInput = z.infer<
	typeof DatabasesDownloadsInputSchema
>;

export const DatabasesDownloadsResponseSchema = z
	.object({
		downloads: z.array(
			z
				.object({
					dataset_id: z.string(),
					format: z.string().optional(),
					outcome: z.string().optional(),
					sample: z.boolean().optional(),
					open: z.boolean().optional(),
					bytes: z.number().nullable().optional(),
					http_status: z.number().nullable().optional(),
					apikey_id: z.string().nullable().optional(),
					client_ip: z.string().nullable().optional(),
					user_agent: z.string().nullable().optional(),
					created: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type DatabasesDownloadsResponse = z.infer<
	typeof DatabasesDownloadsResponseSchema
>;

// ── Entitlement and account ──────────────────────────────────────────────

const NoInputSchema = z.object({});

export const EntitlementGetInputSchema = NoInputSchema;
export type EntitlementGetInput = z.infer<typeof EntitlementGetInputSchema>;

export const EntitlementGetResponseSchema = z
	.object({
		org_id: z.string(),
		apikey: z
			.object({
				id: z.string(),
				expires: z.string().nullable().optional(),
				allowed_cidrs: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		plan: z
			.object({
				key: z.string(),
				name: z.string().optional(),
				tier: z.string().optional(),
			})
			.passthrough(),
		usage: z
			.object({
				requests: z.number(),
				quota: z.number().nullable().optional(),
				hard_limit: z.number().nullable().optional(),
				window_start: z.string().optional(),
				window_end: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type EntitlementGetResponse = z.infer<
	typeof EntitlementGetResponseSchema
>;

export const AccountIdentityInputSchema = NoInputSchema;
export type AccountIdentityInput = z.infer<typeof AccountIdentityInputSchema>;

export const AccountIdentityResponseSchema = z
	.object({
		rc: z.string(),
		user: z
			.object({
				id: z.string(),
				fullname: z.string().optional(),
				email: z.string().optional(),
			})
			.passthrough()
			.optional(),
		org: z.object({ id: z.string() }).passthrough().optional(),
		credential: z.object({ kind: z.string() }).passthrough().optional(),
		scopes: z.array(z.string()).optional(),
	})
	.passthrough();
export type AccountIdentityResponse = z.infer<
	typeof AccountIdentityResponseSchema
>;

export const OrganizationGetInputSchema = NoInputSchema;
export type OrganizationGetInput = z.infer<typeof OrganizationGetInputSchema>;

export const OrganizationGetResponseSchema = z
	.object({
		rc: z.string(),
		org: z
			.object({
				id: z.string(),
				name: z.string().optional(),
				created: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type OrganizationGetResponse = z.infer<
	typeof OrganizationGetResponseSchema
>;

export const OrganizationListMembersInputSchema = NoInputSchema;
export type OrganizationListMembersInput = z.infer<
	typeof OrganizationListMembersInputSchema
>;

// The spec documents only `rc` for this answer; the member list itself
// passes through as sent.
export const OrganizationListMembersResponseSchema = z
	.object({ rc: z.string() })
	.passthrough();
export type OrganizationListMembersResponse = z.infer<
	typeof OrganizationListMembersResponseSchema
>;

// ── API keys ─────────────────────────────────────────────────────────────

const ApiKeySchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		key_prefix: z.string().optional(),
		created: z.string().optional(),
		expires: z.string().nullable().optional(),
		last_used_at: z.string().nullable().optional(),
		revoked_at: z.string().nullable().optional(),
		allowed_cidrs: z.array(z.string()).optional(),
		allowed_scopes: z.array(z.string()).optional(),
		retrievable: z.boolean().optional(),
	})
	.passthrough();

export const ApiKeysListInputSchema = NoInputSchema;
export type ApiKeysListInput = z.infer<typeof ApiKeysListInputSchema>;

export const ApiKeysListResponseSchema = z
	.object({
		rc: z.string(),
		keys: z.array(ApiKeySchema).optional(),
	})
	.passthrough();
export type ApiKeysListResponse = z.infer<typeof ApiKeysListResponseSchema>;

export const ApiKeysCreateInputSchema = z.object({
	name: z.string().min(1).describe('A name for the key, shown in the console.'),
	allowedScopes: z
		.array(z.enum(['ip.lookup', 'db.download']))
		.optional()
		.describe('What the key may do. Omit for both.'),
});
export type ApiKeysCreateInput = z.infer<typeof ApiKeysCreateInputSchema>;

const IssuedApiKeySchema = z
	.object({
		rc: z.string(),
		id: z.string(),
		name: z.string().optional(),
		key: z.string(),
		key_prefix: z.string().optional(),
		allowed_cidrs: z.array(z.string()).optional(),
		allowed_scopes: z.array(z.string()).optional(),
	})
	.passthrough();

export const ApiKeysCreateResponseSchema = IssuedApiKeySchema;
export type ApiKeysCreateResponse = z.infer<typeof ApiKeysCreateResponseSchema>;

const KeyIdInputSchema = z.object({
	id: z.string().min(1).describe('The key ID from apiKeys.list.'),
});

export const ApiKeysRotateInputSchema = KeyIdInputSchema;
export type ApiKeysRotateInput = z.infer<typeof ApiKeysRotateInputSchema>;
export const ApiKeysRotateResponseSchema = IssuedApiKeySchema;
export type ApiKeysRotateResponse = z.infer<typeof ApiKeysRotateResponseSchema>;

export const ApiKeysRevokeInputSchema = KeyIdInputSchema;
export type ApiKeysRevokeInput = z.infer<typeof ApiKeysRevokeInputSchema>;
export const ApiKeysRevokeResponseSchema = z
	.object({ rc: z.string() })
	.passthrough();
export type ApiKeysRevokeResponse = z.infer<typeof ApiKeysRevokeResponseSchema>;

export const ApiKeysRevealInputSchema = KeyIdInputSchema;
export type ApiKeysRevealInput = z.infer<typeof ApiKeysRevealInputSchema>;
export const ApiKeysRevealResponseSchema = z
	.object({ rc: z.string(), key: z.string() })
	.passthrough();
export type ApiKeysRevealResponse = z.infer<typeof ApiKeysRevealResponseSchema>;

// ── Registry ─────────────────────────────────────────────────────────────

export const VpndetectionEndpointInputSchemas = {
	lookup: LookupIpInputSchema,
	batch: BatchLookupInputSchema,
	databasesList: DatabasesListInputSchema,
	databasesDownload: DatabasesDownloadInputSchema,
	databasesMetadata: DatabasesMetadataInputSchema,
	databasesChecksum: DatabasesChecksumInputSchema,
	databasesDownloads: DatabasesDownloadsInputSchema,
	entitlementGet: EntitlementGetInputSchema,
	accountIdentity: AccountIdentityInputSchema,
	organizationGet: OrganizationGetInputSchema,
	organizationListMembers: OrganizationListMembersInputSchema,
	apiKeysList: ApiKeysListInputSchema,
	apiKeysCreate: ApiKeysCreateInputSchema,
	apiKeysRotate: ApiKeysRotateInputSchema,
	apiKeysRevoke: ApiKeysRevokeInputSchema,
	apiKeysReveal: ApiKeysRevealInputSchema,
} as const;

export const VpndetectionEndpointOutputSchemas = {
	lookup: LookupIpResponseSchema,
	batch: BatchLookupResponseSchema,
	databasesList: DatabasesListResponseSchema,
	databasesDownload: DatabasesDownloadResponseSchema,
	databasesMetadata: DatabasesMetadataResponseSchema,
	databasesChecksum: DatabasesChecksumResponseSchema,
	databasesDownloads: DatabasesDownloadsResponseSchema,
	entitlementGet: EntitlementGetResponseSchema,
	accountIdentity: AccountIdentityResponseSchema,
	organizationGet: OrganizationGetResponseSchema,
	organizationListMembers: OrganizationListMembersResponseSchema,
	apiKeysList: ApiKeysListResponseSchema,
	apiKeysCreate: ApiKeysCreateResponseSchema,
	apiKeysRotate: ApiKeysRotateResponseSchema,
	apiKeysRevoke: ApiKeysRevokeResponseSchema,
	apiKeysReveal: ApiKeysRevealResponseSchema,
} as const;

export type VpndetectionEndpointInputs = {
	[K in keyof typeof VpndetectionEndpointInputSchemas]: z.infer<
		(typeof VpndetectionEndpointInputSchemas)[K]
	>;
};

export type VpndetectionEndpointOutputs = {
	[K in keyof typeof VpndetectionEndpointOutputSchemas]: z.infer<
		(typeof VpndetectionEndpointOutputSchemas)[K]
	>;
};
