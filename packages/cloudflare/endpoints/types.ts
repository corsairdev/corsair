import { z } from 'zod';

// ── Shared schemas ────────────────────────────────────────────────────────────

const PaginationInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});

const IdDeleteResponseSchema = z.object({ id: z.string() }).passthrough();

const ZoneSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.string().optional(),
		paused: z.boolean().optional(),
		type: z.string().optional(),
		account: z.record(z.unknown()).optional(),
		name_servers: z.array(z.string()).optional(),
		original_name_servers: z.array(z.string()).optional(),
		original_registrar: z.string().optional(),
		original_dnshost: z.string().optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
		activated_on: z.string().optional(),
	})
	.passthrough();

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
		locked: z.boolean().optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
	})
	.passthrough();

const WorkerScriptSchema = z
	.object({
		id: z.string().optional(),
		created_on: z.string().optional(),
		modified_on: z.string().optional(),
	})
	.passthrough();

const WorkerRouteSchema = z
	.object({
		id: z.string(),
		pattern: z.string(),
		script: z.string().optional(),
	})
	.passthrough();

const RulesetSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		kind: z.string(),
		version: z.string().optional(),
		last_updated: z.string().optional(),
		phase: z.string(),
		rules: z.array(z.record(z.unknown())).optional(),
	})
	.passthrough();

// ── Zones ─────────────────────────────────────────────────────────────────────

const ZonesListInputSchema = PaginationInputSchema.extend({
	name: z.string().optional(),
	status: z.string().optional(),
});

const ZonesGetInputSchema = z.object({ zone_id: z.string() });

const ZonesCreateInputSchema = z.object({
	name: z.string(),
	account: z.object({ id: z.string() }),
	jump_start: z.boolean().optional(),
});

const ZonesEditInputSchema = z.object({
	zone_id: z.string(),
	paused: z.boolean().optional(),
	plan: z.object({ id: z.string() }).optional(),
	vanity_name_servers: z.array(z.string()).optional(),
});

const ZonesDeleteInputSchema = z.object({ zone_id: z.string() });

// ── DNS ───────────────────────────────────────────────────────────────────────

const DnsListInputSchema = PaginationInputSchema.extend({
	zone_id: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	content: z.string().optional(),
});

const DnsGetInputSchema = z.object({
	zone_id: z.string(),
	dns_record_id: z.string(),
});

const DnsCreateInputSchema = z.object({
	zone_id: z.string(),
	type: z.string(),
	name: z.string(),
	content: z.string(),
	ttl: z.number().optional(),
	proxied: z.boolean().optional(),
});

const DnsEditInputSchema = z.object({
	zone_id: z.string(),
	dns_record_id: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	content: z.string().optional(),
	ttl: z.number().optional(),
	proxied: z.boolean().optional(),
});

const DnsDeleteInputSchema = z.object({
	zone_id: z.string(),
	dns_record_id: z.string(),
});

// ── Workers scripts ───────────────────────────────────────────────────────────

const WorkersListInputSchema = z.object({ account_id: z.string() });

const WorkersGetInputSchema = z.object({
	account_id: z.string(),
	script_name: z.string(),
});

const WorkersUploadInputSchema = z.object({
	account_id: z.string(),
	script_name: z.string(),
	script_content: z.string(),
	bindings: z.array(z.record(z.unknown())).optional(),
	compatibility_date: z.string().optional(),
});

const WorkersDeleteInputSchema = z.object({
	account_id: z.string(),
	script_name: z.string(),
});

// ── Worker routes ─────────────────────────────────────────────────────────────

const WorkerRoutesListInputSchema = z.object({ zone_id: z.string() });

const WorkerRoutesGetInputSchema = z.object({
	zone_id: z.string(),
	route_id: z.string(),
});

const WorkerRoutesCreateInputSchema = z.object({
	zone_id: z.string(),
	pattern: z.string(),
	script: z.string().optional(),
});

const WorkerRoutesEditInputSchema = z.object({
	zone_id: z.string(),
	route_id: z.string(),
	pattern: z.string().optional(),
	script: z.string().optional(),
});

const WorkerRoutesDeleteInputSchema = z.object({
	zone_id: z.string(),
	route_id: z.string(),
});

// ── Rulesets ──────────────────────────────────────────────────────────────────

const RulesetsListInputSchema = z.object({ zone_id: z.string() });

const RulesetsGetInputSchema = z.object({
	zone_id: z.string(),
	ruleset_id: z.string(),
});

const RulesetsCreateInputSchema = z.object({
	zone_id: z.string(),
	name: z.string(),
	kind: z.string(),
	phase: z.string(),
	rules: z.array(z.record(z.unknown())).optional(),
	description: z.string().optional(),
});

const RulesetsUpdateInputSchema = z.object({
	zone_id: z.string(),
	ruleset_id: z.string(),
	rules: z.array(z.record(z.unknown())),
	description: z.string().optional(),
});

const RulesetsDeleteInputSchema = z.object({
	zone_id: z.string(),
	ruleset_id: z.string(),
});

// ── Type exports ──────────────────────────────────────────────────────────────

export type ZonesListInput = z.infer<typeof ZonesListInputSchema>;
export type ZonesGetInput = z.infer<typeof ZonesGetInputSchema>;
export type ZonesCreateInput = z.infer<typeof ZonesCreateInputSchema>;
export type ZonesEditInput = z.infer<typeof ZonesEditInputSchema>;
export type ZonesDeleteInput = z.infer<typeof ZonesDeleteInputSchema>;

export type DnsListInput = z.infer<typeof DnsListInputSchema>;
export type DnsGetInput = z.infer<typeof DnsGetInputSchema>;
export type DnsCreateInput = z.infer<typeof DnsCreateInputSchema>;
export type DnsEditInput = z.infer<typeof DnsEditInputSchema>;
export type DnsDeleteInput = z.infer<typeof DnsDeleteInputSchema>;

export type WorkersListInput = z.infer<typeof WorkersListInputSchema>;
export type WorkersGetInput = z.infer<typeof WorkersGetInputSchema>;
export type WorkersUploadInput = z.infer<typeof WorkersUploadInputSchema>;
export type WorkersDeleteInput = z.infer<typeof WorkersDeleteInputSchema>;

export type WorkerRoutesListInput = z.infer<typeof WorkerRoutesListInputSchema>;
export type WorkerRoutesGetInput = z.infer<typeof WorkerRoutesGetInputSchema>;
export type WorkerRoutesCreateInput = z.infer<
	typeof WorkerRoutesCreateInputSchema
>;
export type WorkerRoutesEditInput = z.infer<typeof WorkerRoutesEditInputSchema>;
export type WorkerRoutesDeleteInput = z.infer<
	typeof WorkerRoutesDeleteInputSchema
>;

export type RulesetsListInput = z.infer<typeof RulesetsListInputSchema>;
export type RulesetsGetInput = z.infer<typeof RulesetsGetInputSchema>;
export type RulesetsCreateInput = z.infer<typeof RulesetsCreateInputSchema>;
export type RulesetsUpdateInput = z.infer<typeof RulesetsUpdateInputSchema>;
export type RulesetsDeleteInput = z.infer<typeof RulesetsDeleteInputSchema>;

export type ZonesListResponse = z.infer<typeof ZoneSchema>[];
export type ZonesGetResponse = z.infer<typeof ZoneSchema>;
export type ZonesCreateResponse = z.infer<typeof ZoneSchema>;
export type ZonesEditResponse = z.infer<typeof ZoneSchema>;
export type ZonesDeleteResponse = z.infer<typeof IdDeleteResponseSchema>;

export type DnsListResponse = z.infer<typeof DnsRecordSchema>[];
export type DnsGetResponse = z.infer<typeof DnsRecordSchema>;
export type DnsCreateResponse = z.infer<typeof DnsRecordSchema>;
export type DnsEditResponse = z.infer<typeof DnsRecordSchema>;
export type DnsDeleteResponse = z.infer<typeof IdDeleteResponseSchema>;

export type WorkersListResponse = z.infer<typeof WorkerScriptSchema>[];
export type WorkersGetResponse = z.infer<typeof WorkerScriptSchema>;
export type WorkersUploadResponse = z.infer<typeof WorkerScriptSchema>;
export type WorkersDeleteResponse = Record<string, never>;

export type WorkerRoutesListResponse = z.infer<typeof WorkerRouteSchema>[];
export type WorkerRoutesGetResponse = z.infer<typeof WorkerRouteSchema>;
export type WorkerRoutesCreateResponse = z.infer<typeof WorkerRouteSchema>;
export type WorkerRoutesEditResponse = z.infer<typeof WorkerRouteSchema>;
export type WorkerRoutesDeleteResponse = z.infer<typeof IdDeleteResponseSchema>;

export type RulesetsListResponse = z.infer<typeof RulesetSchema>[];
export type RulesetsGetResponse = z.infer<typeof RulesetSchema>;
export type RulesetsCreateResponse = z.infer<typeof RulesetSchema>;
export type RulesetsUpdateResponse = z.infer<typeof RulesetSchema>;
export type RulesetsDeleteResponse = Record<string, never>;

export type CloudflareEndpointInputs = {
	zonesList: ZonesListInput;
	zonesGet: ZonesGetInput;
	zonesCreate: ZonesCreateInput;
	zonesEdit: ZonesEditInput;
	zonesDelete: ZonesDeleteInput;
	dnsList: DnsListInput;
	dnsGet: DnsGetInput;
	dnsCreate: DnsCreateInput;
	dnsEdit: DnsEditInput;
	dnsDelete: DnsDeleteInput;
	workersList: WorkersListInput;
	workersGet: WorkersGetInput;
	workersUpload: WorkersUploadInput;
	workersDelete: WorkersDeleteInput;
	workerRoutesList: WorkerRoutesListInput;
	workerRoutesGet: WorkerRoutesGetInput;
	workerRoutesCreate: WorkerRoutesCreateInput;
	workerRoutesEdit: WorkerRoutesEditInput;
	workerRoutesDelete: WorkerRoutesDeleteInput;
	rulesetsList: RulesetsListInput;
	rulesetsGet: RulesetsGetInput;
	rulesetsCreate: RulesetsCreateInput;
	rulesetsUpdate: RulesetsUpdateInput;
	rulesetsDelete: RulesetsDeleteInput;
};

export type CloudflareEndpointOutputs = {
	zonesList: ZonesListResponse;
	zonesGet: ZonesGetResponse;
	zonesCreate: ZonesCreateResponse;
	zonesEdit: ZonesEditResponse;
	zonesDelete: ZonesDeleteResponse;
	dnsList: DnsListResponse;
	dnsGet: DnsGetResponse;
	dnsCreate: DnsCreateResponse;
	dnsEdit: DnsEditResponse;
	dnsDelete: DnsDeleteResponse;
	workersList: WorkersListResponse;
	workersGet: WorkersGetResponse;
	workersUpload: WorkersUploadResponse;
	workersDelete: WorkersDeleteResponse;
	workerRoutesList: WorkerRoutesListResponse;
	workerRoutesGet: WorkerRoutesGetResponse;
	workerRoutesCreate: WorkerRoutesCreateResponse;
	workerRoutesEdit: WorkerRoutesEditResponse;
	workerRoutesDelete: WorkerRoutesDeleteResponse;
	rulesetsList: RulesetsListResponse;
	rulesetsGet: RulesetsGetResponse;
	rulesetsCreate: RulesetsCreateResponse;
	rulesetsUpdate: RulesetsUpdateResponse;
	rulesetsDelete: RulesetsDeleteResponse;
};

export const CloudflareEndpointInputSchemas = {
	zonesList: ZonesListInputSchema,
	zonesGet: ZonesGetInputSchema,
	zonesCreate: ZonesCreateInputSchema,
	zonesEdit: ZonesEditInputSchema,
	zonesDelete: ZonesDeleteInputSchema,
	dnsList: DnsListInputSchema,
	dnsGet: DnsGetInputSchema,
	dnsCreate: DnsCreateInputSchema,
	dnsEdit: DnsEditInputSchema,
	dnsDelete: DnsDeleteInputSchema,
	workersList: WorkersListInputSchema,
	workersGet: WorkersGetInputSchema,
	workersUpload: WorkersUploadInputSchema,
	workersDelete: WorkersDeleteInputSchema,
	workerRoutesList: WorkerRoutesListInputSchema,
	workerRoutesGet: WorkerRoutesGetInputSchema,
	workerRoutesCreate: WorkerRoutesCreateInputSchema,
	workerRoutesEdit: WorkerRoutesEditInputSchema,
	workerRoutesDelete: WorkerRoutesDeleteInputSchema,
	rulesetsList: RulesetsListInputSchema,
	rulesetsGet: RulesetsGetInputSchema,
	rulesetsCreate: RulesetsCreateInputSchema,
	rulesetsUpdate: RulesetsUpdateInputSchema,
	rulesetsDelete: RulesetsDeleteInputSchema,
} as const;

export const CloudflareEndpointOutputSchemas = {
	zonesList: z.array(ZoneSchema),
	zonesGet: ZoneSchema,
	zonesCreate: ZoneSchema,
	zonesEdit: ZoneSchema,
	zonesDelete: IdDeleteResponseSchema,
	dnsList: z.array(DnsRecordSchema),
	dnsGet: DnsRecordSchema,
	dnsCreate: DnsRecordSchema,
	dnsEdit: DnsRecordSchema,
	dnsDelete: IdDeleteResponseSchema,
	workersList: z.array(WorkerScriptSchema),
	workersGet: WorkerScriptSchema,
	workersUpload: WorkerScriptSchema,
	workersDelete: z.object({}).passthrough(),
	workerRoutesList: z.array(WorkerRouteSchema),
	workerRoutesGet: WorkerRouteSchema,
	workerRoutesCreate: WorkerRouteSchema,
	workerRoutesEdit: WorkerRouteSchema,
	workerRoutesDelete: IdDeleteResponseSchema,
	rulesetsList: z.array(RulesetSchema),
	rulesetsGet: RulesetSchema,
	rulesetsCreate: RulesetSchema,
	rulesetsUpdate: RulesetSchema,
	rulesetsDelete: z.object({}).passthrough(),
} as const;
