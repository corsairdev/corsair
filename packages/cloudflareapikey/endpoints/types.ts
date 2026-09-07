import { z } from 'zod';

const LooseObjectSchema = z.record(z.string(), z.unknown());

const PaginationInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});

const IdDeleteResponseSchema = z.object({ id: z.string() }).loose();

const ZoneSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.string().optional(),
		paused: z.boolean().optional(),
		type: z.string().optional(),
		account: z.object({ id: z.string() }).loose().optional(),
		name_servers: z.array(z.string()).optional(),
		original_name_servers: z.array(z.string()).optional(),
		vanity_name_servers: z.array(z.string()).optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
		activated_on: z.string().optional(),
	})
	.loose();

const DnsRecordSchema = z
	.object({
		id: z.string(),
		zone_id: z.string().optional(),
		zone_name: z.string().optional(),
		type: z.string(),
		name: z.string(),
		content: z.string(),
		proxiable: z.boolean().optional(),
		proxied: z.boolean().optional(),
		ttl: z.number().optional(),
		priority: z.number().optional(),
		locked: z.boolean().optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
	})
	.loose();

const DnssecSchema = z
	.object({
		status: z.string().optional(),
		algorithm: z.string().optional(),
		digest: z.string().optional(),
		digest_algorithm: z.string().optional(),
		digest_type: z.string().optional(),
		ds: z.string().optional(),
		flags: z.number().optional(),
		key_tag: z.number().optional(),
		key_type: z.string().optional(),
		public_key: z.string().optional(),
		dnssec_multi_signer: z.boolean().optional(),
		dnssec_presigned: z.boolean().optional(),
		dnssec_use_nsec3: z.boolean().optional(),
		modified_on: z.string().optional(),
	})
	.loose();

const LockdownConfigSchema = z
	.object({
		target: z.enum(['ip', 'ip_range']).optional(),
		value: z.string().optional(),
	})
	.loose();

const LockdownSchema = z
	.object({
		id: z.string(),
		urls: z.array(z.string()),
		configurations: z.array(LockdownConfigSchema),
		description: z.string().optional(),
		paused: z.boolean().optional(),
		priority: z.number().optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
	})
	.loose();

const RulesetSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		kind: z.string(),
		version: z.string().optional(),
		last_updated: z.string().optional(),
		phase: z.string(),
		rules: z.array(LooseObjectSchema).optional(),
	})
	.loose();

const RulesetRuleSchema = z
	.object({
		id: z.string().optional(),
		action: z.string().optional(),
		expression: z.string().optional(),
		description: z.string().optional(),
		enabled: z.boolean().optional(),
		version: z.string().optional(),
	})
	.loose();

const RegionalTieredCacheSchema = z
	.object({
		id: z.literal('tc_regional').or(z.string()),
		editable: z.boolean().optional(),
		value: z.enum(['on', 'off']),
		modified_on: z.string().nullable().optional(),
	})
	.loose();

const IpsSchema = z
	.object({
		etag: z.string().optional(),
		ipv4_cidrs: z.array(z.string()).optional(),
		ipv6_cidrs: z.array(z.string()).optional(),
		jdcloud_cidrs: z.array(z.string()).optional(),
	})
	.loose();

const ScopeSchema = z
	.object({
		account_id: z.string().min(1).optional(),
		zone_id: z.string().min(1).optional(),
	})
	.refine((v) => Boolean(v.account_id) !== Boolean(v.zone_id), {
		message: 'Provide exactly one of account_id or zone_id',
	});

const ZonesListInputSchema = PaginationInputSchema.extend({
	name: z.string().optional(),
	status: z.string().optional(),
	account_id: z.string().optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	order: z.string().optional(),
	match: z.enum(['any', 'all']).optional(),
});

const ZonesGetInputSchema = z.object({ zone_id: z.string().min(1) });

const ZonesUpdateInputSchema = z
	.object({
		zone_id: z.string().min(1),
		paused: z.boolean().optional(),
		type: z.string().optional(),
		vanity_name_servers: z.array(z.string()).optional(),
	})
	.refine(
		(data) =>
			[data.paused, data.type, data.vanity_name_servers].filter(
				(value) => value !== undefined,
			).length === 1,
		{ message: 'Provide exactly one of paused, type, or vanity_name_servers' },
	);

const ZonesDeleteInputSchema = z.object({ zone_id: z.string().min(1) });

const ZonesRerunActivationCheckInputSchema = z.object({
	zone_id: z.string().min(1),
});

const DnsListInputSchema = PaginationInputSchema.extend({
	zone_id: z.string().min(1),
	type: z.string().optional(),
	name: z.string().optional(),
	content: z.string().optional(),
	proxied: z.boolean().optional(),
	search: z.string().optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	order: z.string().optional(),
	match: z.enum(['any', 'all']).optional(),
});

const DnsCreateInputSchema = z.object({
	zone_id: z.string().min(1),
	type: z.string().min(1),
	name: z.string().min(1),
	content: z.string(),
	ttl: z.number().optional(),
	proxied: z.boolean().optional(),
	priority: z.number().optional(),
	comment: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const DnsOverwriteInputSchema = z.object({
	zone_id: z.string().min(1),
	dns_record_id: z.string().min(1),
	type: z.string().min(1),
	name: z.string().min(1),
	content: z.string(),
	ttl: z.number().optional(),
	proxied: z.boolean().optional(),
	priority: z.number().optional(),
	comment: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const DnsDeleteInputSchema = z.object({
	zone_id: z.string().min(1),
	dns_record_id: z.string().min(1),
});

const DnssecUpdateInputSchema = z.object({
	zone_id: z.string().min(1),
	status: z.enum(['active', 'disabled']).optional(),
	dnssec_multi_signer: z.boolean().optional(),
	dnssec_presigned: z.boolean().optional(),
	dnssec_use_nsec3: z.boolean().optional(),
});

const DnssecDeleteInputSchema = z.object({ zone_id: z.string().min(1) });

const LockdownsCreateInputSchema = z.object({
	zone_id: z.string().min(1),
	urls: z.array(z.string().min(1)).min(1),
	configurations: z.array(LockdownConfigSchema).min(1),
	description: z.string().optional(),
	paused: z.boolean().optional(),
	priority: z.number().optional(),
});

const LockdownsGetInputSchema = z.object({
	zone_id: z.string().min(1),
	lockdown_id: z.string().min(1),
});

const LockdownsUpdateInputSchema = z.object({
	zone_id: z.string().min(1),
	lockdown_id: z.string().min(1),
	urls: z.array(z.string().min(1)).optional(),
	configurations: z.array(LockdownConfigSchema).optional(),
	description: z.string().optional(),
	paused: z.boolean().optional(),
	priority: z.number().optional(),
});

const RulesetsGetInputSchema = ScopeSchema.and(
	z.object({ ruleset_id: z.string().min(1) }),
);

const RulesetsCreateInputSchema = ScopeSchema.and(
	z.object({
		name: z.string().min(1),
		kind: z.string().min(1),
		phase: z.string().min(1),
		description: z.string().optional(),
		rules: z.array(LooseObjectSchema).optional(),
	}),
);

const RulesetsUpdateInputSchema = ScopeSchema.and(
	z.object({
		ruleset_id: z.string().min(1),
		name: z.string().optional(),
		description: z.string().optional(),
		rules: z.array(LooseObjectSchema),
	}),
);

const RulesetsDeleteInputSchema = ScopeSchema.and(
	z.object({ ruleset_id: z.string().min(1) }),
);

const RulePositionSchema = z
	.object({
		index: z.number().optional(),
		before: z.string().optional(),
		after: z.string().optional(),
	})
	.optional();

const RulesetsCreateRuleInputSchema = ScopeSchema.and(
	z.object({
		ruleset_id: z.string().min(1),
		action: z.string().min(1),
		expression: z.string().min(1),
		description: z.string().optional(),
		enabled: z.boolean().optional(),
		action_parameters: LooseObjectSchema.optional(),
		position: RulePositionSchema,
	}),
);

const RulesetsUpdateRuleInputSchema = ScopeSchema.and(
	z.object({
		ruleset_id: z.string().min(1),
		rule_id: z.string().min(1),
		action: z.string().optional(),
		expression: z.string().optional(),
		description: z.string().optional(),
		enabled: z.boolean().optional(),
		action_parameters: LooseObjectSchema.optional(),
		position: RulePositionSchema,
	}),
);

const RulesetsDeleteRuleInputSchema = ScopeSchema.and(
	z.object({
		ruleset_id: z.string().min(1),
		rule_id: z.string().min(1),
	}),
);

const RulesetsGetEntrypointVersionInputSchema = ScopeSchema.and(
	z.object({
		ruleset_phase: z.string().min(1),
		ruleset_version: z.string().min(1),
	}),
);

const CacheGetRegionalTieredCacheInputSchema = z.object({
	zone_id: z.string().min(1),
});

const IpsGetInputSchema = z.object({
	networks: z.string().optional(),
});

const R2ObjectSchema = z
	.object({
		etag: z.string().optional(),
		key: z.string().optional(),
		size: z.union([z.string(), z.number()]).optional(),
		storage_class: z.string().optional(),
		uploaded: z.string().optional(),
		version: z.string().optional(),
	})
	.loose();

const S3UploadInputSchema = z.object({
	account_id: z.string().min(1),
	bucket_name: z.string().min(1),
	object_key: z.string().min(1),
	content: z.string(),
	content_type: z.string().optional(),
});

export type CloudflareApiKeyEndpointInputs = {
	zonesList: z.infer<typeof ZonesListInputSchema>;
	zonesGet: z.infer<typeof ZonesGetInputSchema>;
	zonesUpdate: z.infer<typeof ZonesUpdateInputSchema>;
	zonesDelete: z.infer<typeof ZonesDeleteInputSchema>;
	zonesRerunActivationCheck: z.infer<
		typeof ZonesRerunActivationCheckInputSchema
	>;
	dnsList: z.infer<typeof DnsListInputSchema>;
	dnsCreate: z.infer<typeof DnsCreateInputSchema>;
	dnsOverwrite: z.infer<typeof DnsOverwriteInputSchema>;
	dnsDelete: z.infer<typeof DnsDeleteInputSchema>;
	dnssecUpdate: z.infer<typeof DnssecUpdateInputSchema>;
	dnssecDelete: z.infer<typeof DnssecDeleteInputSchema>;
	lockdownsCreate: z.infer<typeof LockdownsCreateInputSchema>;
	lockdownsGet: z.infer<typeof LockdownsGetInputSchema>;
	lockdownsUpdate: z.infer<typeof LockdownsUpdateInputSchema>;
	rulesetsGet: z.infer<typeof RulesetsGetInputSchema>;
	rulesetsCreate: z.infer<typeof RulesetsCreateInputSchema>;
	rulesetsUpdate: z.infer<typeof RulesetsUpdateInputSchema>;
	rulesetsDelete: z.infer<typeof RulesetsDeleteInputSchema>;
	rulesetsCreateRule: z.infer<typeof RulesetsCreateRuleInputSchema>;
	rulesetsUpdateRule: z.infer<typeof RulesetsUpdateRuleInputSchema>;
	rulesetsDeleteRule: z.infer<typeof RulesetsDeleteRuleInputSchema>;
	rulesetsGetEntrypointVersion: z.infer<
		typeof RulesetsGetEntrypointVersionInputSchema
	>;
	cacheGetRegionalTieredCache: z.infer<
		typeof CacheGetRegionalTieredCacheInputSchema
	>;
	ipsGet: z.infer<typeof IpsGetInputSchema>;
	s3Upload: z.infer<typeof S3UploadInputSchema>;
};

export type CloudflareApiKeyEndpointOutputs = {
	zonesList: z.infer<typeof ZoneSchema>[];
	zonesGet: z.infer<typeof ZoneSchema>;
	zonesUpdate: z.infer<typeof ZoneSchema>;
	zonesDelete: z.infer<typeof IdDeleteResponseSchema>;
	zonesRerunActivationCheck: z.infer<typeof ZoneSchema>;
	dnsList: z.infer<typeof DnsRecordSchema>[];
	dnsCreate: z.infer<typeof DnsRecordSchema>;
	dnsOverwrite: z.infer<typeof DnsRecordSchema>;
	dnsDelete: z.infer<typeof IdDeleteResponseSchema>;
	dnssecUpdate: z.infer<typeof DnssecSchema>;
	dnssecDelete: z.infer<typeof DnssecSchema>;
	lockdownsCreate: z.infer<typeof LockdownSchema>;
	lockdownsGet: z.infer<typeof LockdownSchema>;
	lockdownsUpdate: z.infer<typeof LockdownSchema>;
	rulesetsGet: z.infer<typeof RulesetSchema>;
	rulesetsCreate: z.infer<typeof RulesetSchema>;
	rulesetsUpdate: z.infer<typeof RulesetSchema>;
	rulesetsDelete: null;
	rulesetsCreateRule: z.infer<typeof RulesetRuleSchema>;
	rulesetsUpdateRule: z.infer<typeof RulesetRuleSchema>;
	rulesetsDeleteRule: z.infer<typeof RulesetRuleSchema>;
	rulesetsGetEntrypointVersion: z.infer<typeof RulesetSchema>;
	cacheGetRegionalTieredCache: z.infer<typeof RegionalTieredCacheSchema>;
	ipsGet: z.infer<typeof IpsSchema>;
	s3Upload: z.infer<typeof R2ObjectSchema>;
};

export const CloudflareApiKeyEndpointInputSchemas = {
	zonesList: ZonesListInputSchema,
	zonesGet: ZonesGetInputSchema,
	zonesUpdate: ZonesUpdateInputSchema,
	zonesDelete: ZonesDeleteInputSchema,
	zonesRerunActivationCheck: ZonesRerunActivationCheckInputSchema,
	dnsList: DnsListInputSchema,
	dnsCreate: DnsCreateInputSchema,
	dnsOverwrite: DnsOverwriteInputSchema,
	dnsDelete: DnsDeleteInputSchema,
	dnssecUpdate: DnssecUpdateInputSchema,
	dnssecDelete: DnssecDeleteInputSchema,
	lockdownsCreate: LockdownsCreateInputSchema,
	lockdownsGet: LockdownsGetInputSchema,
	lockdownsUpdate: LockdownsUpdateInputSchema,
	rulesetsGet: RulesetsGetInputSchema,
	rulesetsCreate: RulesetsCreateInputSchema,
	rulesetsUpdate: RulesetsUpdateInputSchema,
	rulesetsDelete: RulesetsDeleteInputSchema,
	rulesetsCreateRule: RulesetsCreateRuleInputSchema,
	rulesetsUpdateRule: RulesetsUpdateRuleInputSchema,
	rulesetsDeleteRule: RulesetsDeleteRuleInputSchema,
	rulesetsGetEntrypointVersion: RulesetsGetEntrypointVersionInputSchema,
	cacheGetRegionalTieredCache: CacheGetRegionalTieredCacheInputSchema,
	ipsGet: IpsGetInputSchema,
	s3Upload: S3UploadInputSchema,
} as const;

export const CloudflareApiKeyEndpointOutputSchemas = {
	zonesList: z.array(ZoneSchema),
	zonesGet: ZoneSchema,
	zonesUpdate: ZoneSchema,
	zonesDelete: IdDeleteResponseSchema,
	zonesRerunActivationCheck: ZoneSchema,
	dnsList: z.array(DnsRecordSchema),
	dnsCreate: DnsRecordSchema,
	dnsOverwrite: DnsRecordSchema,
	dnsDelete: IdDeleteResponseSchema,
	dnssecUpdate: DnssecSchema,
	dnssecDelete: DnssecSchema,
	lockdownsCreate: LockdownSchema,
	lockdownsGet: LockdownSchema,
	lockdownsUpdate: LockdownSchema,
	rulesetsGet: RulesetSchema,
	rulesetsCreate: RulesetSchema,
	rulesetsUpdate: RulesetSchema,
	rulesetsDelete: z.null(),
	rulesetsCreateRule: RulesetRuleSchema,
	rulesetsUpdateRule: RulesetRuleSchema,
	rulesetsDeleteRule: RulesetRuleSchema,
	rulesetsGetEntrypointVersion: RulesetSchema,
	cacheGetRegionalTieredCache: RegionalTieredCacheSchema,
	ipsGet: IpsSchema,
	s3Upload: R2ObjectSchema,
} as const;
