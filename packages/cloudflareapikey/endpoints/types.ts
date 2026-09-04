import { z } from 'zod';

const LooseObjectSchema = z.record(z.string(), z.unknown());
const PaginationSchema = z.object({ page: z.number().optional(), per_page: z.number().optional() });

const DeleteResponseSchema = z.object({ id: z.string() }).loose();
const ZoneSchema = z.object({ id: z.string(), name: z.string(), status: z.string().optional(), account: z.object({ id: z.string() }).loose().optional() }).loose();
const DnsRecordSchema = z.object({ id: z.string(), type: z.string(), name: z.string(), content: z.string(), zone_id: z.string().optional(), ttl: z.number().optional(), proxied: z.boolean().optional() }).loose();
const WorkerScriptSchema = z.object({ id: z.string().optional(), created_on: z.string().optional(), modified_on: z.string().optional() }).loose();
const WorkerRouteSchema = z.object({ id: z.string(), pattern: z.string(), script: z.string().optional() }).loose();
const RulesetSchema = z.object({ id: z.string(), name: z.string(), kind: z.string(), phase: z.string() }).loose();

const ZonesListInputSchema = PaginationSchema.extend({ name: z.string().optional(), status: z.string().optional() });
const ZonesGetInputSchema = z.object({ zone_id: z.string().min(1) });
const ZonesCreateInputSchema = z.object({ name: z.string().min(1), account: z.object({ id: z.string().min(1) }), jump_start: z.boolean().optional() });
const ZonesEditInputSchema = z.object({ zone_id: z.string().min(1), paused: z.boolean().optional(), plan: z.object({ id: z.string() }).optional(), vanity_name_servers: z.array(z.string()).optional() });
const ZonesDeleteInputSchema = z.object({ zone_id: z.string().min(1) });

const DnsListInputSchema = PaginationSchema.extend({ zone_id: z.string().min(1), type: z.string().optional(), name: z.string().optional(), content: z.string().optional() });
const DnsGetInputSchema = z.object({ zone_id: z.string().min(1), dns_record_id: z.string().min(1) });
const DnsCreateInputSchema = z.object({ zone_id: z.string().min(1), type: z.string().min(1), name: z.string().min(1), content: z.string(), ttl: z.number().optional(), proxied: z.boolean().optional(), priority: z.number().optional() });
const DnsEditInputSchema = z.object({ zone_id: z.string().min(1), dns_record_id: z.string().min(1), type: z.string().optional(), name: z.string().optional(), content: z.string().optional(), ttl: z.number().optional(), proxied: z.boolean().optional(), priority: z.number().optional() });
const DnsDeleteInputSchema = z.object({ zone_id: z.string().min(1), dns_record_id: z.string().min(1) });

const WorkersListInputSchema = z.object({ account_id: z.string().min(1) });
const WorkersGetInputSchema = z.object({ account_id: z.string().min(1), script_name: z.string().min(1) });
const WorkersUploadInputSchema = z.object({ account_id: z.string().min(1), script_name: z.string().min(1), script_content: z.string(), bindings: z.array(LooseObjectSchema).optional(), compatibility_date: z.string().optional() });
const WorkersDeleteInputSchema = z.object({ account_id: z.string().min(1), script_name: z.string().min(1) });

const WorkerRoutesListInputSchema = z.object({ zone_id: z.string().min(1) });
const WorkerRoutesGetInputSchema = z.object({ zone_id: z.string().min(1), route_id: z.string().min(1) });
const WorkerRoutesCreateInputSchema = z.object({ zone_id: z.string().min(1), pattern: z.string().min(1), script: z.string().optional() });
const WorkerRoutesEditInputSchema = z.object({ zone_id: z.string().min(1), route_id: z.string().min(1), pattern: z.string().optional(), script: z.string().optional() });
const WorkerRoutesDeleteInputSchema = z.object({ zone_id: z.string().min(1), route_id: z.string().min(1) });

const RulesetsListInputSchema = z.object({ zone_id: z.string().min(1) });
const RulesetsGetInputSchema = z.object({ zone_id: z.string().min(1), ruleset_id: z.string().min(1) });
const RulesetsCreateInputSchema = z.object({ zone_id: z.string().min(1), name: z.string().min(1), kind: z.string().min(1), phase: z.string().min(1), rules: z.array(LooseObjectSchema).optional(), description: z.string().optional() });
const RulesetsUpdateInputSchema = z.object({ zone_id: z.string().min(1), ruleset_id: z.string().min(1), rules: z.array(LooseObjectSchema), description: z.string().optional() });
const RulesetsDeleteInputSchema = z.object({ zone_id: z.string().min(1), ruleset_id: z.string().min(1) });

export type CloudflareApiKeyEndpointInputs = {
	zonesList: z.infer<typeof ZonesListInputSchema>; zonesGet: z.infer<typeof ZonesGetInputSchema>; zonesCreate: z.infer<typeof ZonesCreateInputSchema>; zonesEdit: z.infer<typeof ZonesEditInputSchema>; zonesDelete: z.infer<typeof ZonesDeleteInputSchema>;
	dnsList: z.infer<typeof DnsListInputSchema>; dnsGet: z.infer<typeof DnsGetInputSchema>; dnsCreate: z.infer<typeof DnsCreateInputSchema>; dnsEdit: z.infer<typeof DnsEditInputSchema>; dnsDelete: z.infer<typeof DnsDeleteInputSchema>;
	workersList: z.infer<typeof WorkersListInputSchema>; workersGet: z.infer<typeof WorkersGetInputSchema>; workersUpload: z.infer<typeof WorkersUploadInputSchema>; workersDelete: z.infer<typeof WorkersDeleteInputSchema>;
	workerRoutesList: z.infer<typeof WorkerRoutesListInputSchema>; workerRoutesGet: z.infer<typeof WorkerRoutesGetInputSchema>; workerRoutesCreate: z.infer<typeof WorkerRoutesCreateInputSchema>; workerRoutesEdit: z.infer<typeof WorkerRoutesEditInputSchema>; workerRoutesDelete: z.infer<typeof WorkerRoutesDeleteInputSchema>;
	rulesetsList: z.infer<typeof RulesetsListInputSchema>; rulesetsGet: z.infer<typeof RulesetsGetInputSchema>; rulesetsCreate: z.infer<typeof RulesetsCreateInputSchema>; rulesetsUpdate: z.infer<typeof RulesetsUpdateInputSchema>; rulesetsDelete: z.infer<typeof RulesetsDeleteInputSchema>;
};

export type CloudflareApiKeyEndpointOutputs = {
	zonesList: z.infer<typeof ZoneSchema>[]; zonesGet: z.infer<typeof ZoneSchema>; zonesCreate: z.infer<typeof ZoneSchema>; zonesEdit: z.infer<typeof ZoneSchema>; zonesDelete: z.infer<typeof DeleteResponseSchema>;
	dnsList: z.infer<typeof DnsRecordSchema>[]; dnsGet: z.infer<typeof DnsRecordSchema>; dnsCreate: z.infer<typeof DnsRecordSchema>; dnsEdit: z.infer<typeof DnsRecordSchema>; dnsDelete: z.infer<typeof DeleteResponseSchema>;
	workersList: z.infer<typeof WorkerScriptSchema>[]; workersGet: string; workersUpload: z.infer<typeof WorkerScriptSchema>; workersDelete: null;
	workerRoutesList: z.infer<typeof WorkerRouteSchema>[]; workerRoutesGet: z.infer<typeof WorkerRouteSchema>; workerRoutesCreate: z.infer<typeof WorkerRouteSchema>; workerRoutesEdit: z.infer<typeof WorkerRouteSchema>; workerRoutesDelete: z.infer<typeof DeleteResponseSchema>;
	rulesetsList: z.infer<typeof RulesetSchema>[]; rulesetsGet: z.infer<typeof RulesetSchema>; rulesetsCreate: z.infer<typeof RulesetSchema>; rulesetsUpdate: z.infer<typeof RulesetSchema>; rulesetsDelete: null;
};

export const CloudflareApiKeyEndpointInputSchemas = {
	zonesList: ZonesListInputSchema, zonesGet: ZonesGetInputSchema, zonesCreate: ZonesCreateInputSchema, zonesEdit: ZonesEditInputSchema, zonesDelete: ZonesDeleteInputSchema,
	dnsList: DnsListInputSchema, dnsGet: DnsGetInputSchema, dnsCreate: DnsCreateInputSchema, dnsEdit: DnsEditInputSchema, dnsDelete: DnsDeleteInputSchema,
	workersList: WorkersListInputSchema, workersGet: WorkersGetInputSchema, workersUpload: WorkersUploadInputSchema, workersDelete: WorkersDeleteInputSchema,
	workerRoutesList: WorkerRoutesListInputSchema, workerRoutesGet: WorkerRoutesGetInputSchema, workerRoutesCreate: WorkerRoutesCreateInputSchema, workerRoutesEdit: WorkerRoutesEditInputSchema, workerRoutesDelete: WorkerRoutesDeleteInputSchema,
	rulesetsList: RulesetsListInputSchema, rulesetsGet: RulesetsGetInputSchema, rulesetsCreate: RulesetsCreateInputSchema, rulesetsUpdate: RulesetsUpdateInputSchema, rulesetsDelete: RulesetsDeleteInputSchema,
} as const;

export const CloudflareApiKeyEndpointOutputSchemas = {
	zonesList: z.array(ZoneSchema), zonesGet: ZoneSchema, zonesCreate: ZoneSchema, zonesEdit: ZoneSchema, zonesDelete: DeleteResponseSchema,
	dnsList: z.array(DnsRecordSchema), dnsGet: DnsRecordSchema, dnsCreate: DnsRecordSchema, dnsEdit: DnsRecordSchema, dnsDelete: DeleteResponseSchema,
	workersList: z.array(WorkerScriptSchema), workersGet: z.string(), workersUpload: WorkerScriptSchema, workersDelete: z.null(),
	workerRoutesList: z.array(WorkerRouteSchema), workerRoutesGet: WorkerRouteSchema, workerRoutesCreate: WorkerRouteSchema, workerRoutesEdit: WorkerRouteSchema, workerRoutesDelete: DeleteResponseSchema,
	rulesetsList: z.array(RulesetSchema), rulesetsGet: RulesetSchema, rulesetsCreate: RulesetSchema, rulesetsUpdate: RulesetSchema, rulesetsDelete: z.null(),
} as const;
