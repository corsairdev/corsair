import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const AnyValueSchema = z.object({
	stringValue: z.string().optional(),
	intValue: z.number().optional(),
	boolValue: z.boolean().optional(),
	doubleValue: z.number().optional(),
	bytesValue: z.string().optional(),
	// arrayValue and kvlistValue are z.object(z.unknown()) because their nested values
	// can be any of the AnyValue types — recursive schemas cause runtime complexity
	arrayValue: z.object({ values: z.array(z.unknown()).optional() }).optional(),
	kvlistValue: z.object({ values: z.array(z.unknown()).optional() }).optional(),
});

const KeyValueSchema = z.object({
	key: z.string().optional(),
	value: AnyValueSchema.optional(),
});

const LogRecordSchema = z.object({
	timeUnixNano: z.string().optional(),
	severityNumber: z.number().optional(),
	severityText: z.string().optional(),
	body: AnyValueSchema.optional(),
	attributes: z.array(KeyValueSchema).optional(),
	flags: z.number().optional(),
	traceId: z.string().optional(),
	spanId: z.string().optional(),
	droppedAttributesCount: z.number().optional(),
});

const InstrumentationScopeSchema = z.object({
	name: z.string().optional(),
	version: z.string().optional(),
	attributes: z.array(KeyValueSchema).optional(),
});

const ScopeLogSchema = z.object({
	scope: InstrumentationScopeSchema.optional(),
	logRecords: z.array(LogRecordSchema).optional(),
});

const ResourceSchema = z.object({
	attributes: z.array(KeyValueSchema).optional(),
	droppedAttributesCount: z.number().optional(),
});

const ResourceLogSchema = z.object({
	resource: ResourceSchema.optional(),
	scopeLogs: z.array(ScopeLogSchema).optional(),
});

const JsonWebKeySchema = z.object({
	// Key is z.unknown() because the cryptographic key material varies by algorithm
	Key: z.unknown().optional(),
	Use: z.string().optional(),
	KeyID: z.string().optional(),
	Algorithm: z.string().optional(),
	Certificates: z.array(z.string()).optional(),
	CertificatesURL: z.string().optional(),
	CertificateThumbprintSHA1: z.array(z.number()).optional(),
	CertificateThumbprintSHA256: z.array(z.number()).optional(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

const LogsCreateOtlpInputSchema = z
	.object({
		resourceLogs: z.array(ResourceLogSchema),
	})
	.passthrough();

const HealthGetInputSchema = z.object({}).passthrough();

const StatusGetInputSchema = z.object({}).passthrough();

const RingGetDistributorHaTrackerInputSchema = z.object({}).passthrough();

const RingGetIndexGatewayInputSchema = z.object({}).passthrough();

const RingGetOverridesExporterInputSchema = z.object({}).passthrough();

const RingGetRulerInputSchema = z.object({}).passthrough();

const StoreGatewayGetTenantsInputSchema = z.object({}).passthrough();

const SamlPostAcsInputSchema = z
	.object({
		saml_response: z.string(),
		relay_state: z.string().optional(),
	})
	.passthrough();

const DashboardsQueryPublicInputSchema = z
	.object({
		access_token: z.string(),
		panel_id: z.number(),
		from: z.string(),
		to: z.string(),
		intervalMs: z.number().optional(),
		maxDataPoints: z.number().optional(),
		base_url_override: z.string().optional(),
	})
	.passthrough();

const JwksRetrieveInputSchema = z.object({}).passthrough();

// ── Output Schemas ────────────────────────────────────────────────────────────

const LogsCreateOtlpOutputSchema = z
	.object({
		data: z
			.object({
				success: z.boolean(),
				status_code: z.number(),
				message: z.string(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const HealthGetOutputSchema = z
	.object({
		data: z
			.object({
				version: z.string().optional(),
				commit: z.string().optional(),
				database: z.string().optional(),
				enterpriseCommit: z.string().optional(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const StatusGetOutputSchema = z
	.object({
		data: z
			.object({
				license_available: z.boolean(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const RingGetDistributorHaTrackerOutputSchema = z
	.object({
		data: z
			.object({
				html_content: z.string(),
				status_code: z.number(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const RingGetIndexGatewayOutputSchema = z
	.object({
		data: z
			.object({
				content: z.string(),
				content_type: z.string(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const RingGetOverridesExporterOutputSchema = z
	.object({
		data: z
			.object({
				html_content: z.string(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const RingGetRulerOutputSchema = z
	.object({
		data: z
			.object({
				content: z.string(),
				content_type: z.string(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const StoreGatewayGetTenantsOutputSchema = z
	.object({
		data: z
			.object({
				content: z.string(),
				content_type: z.string().optional(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const SamlPostAcsOutputSchema = z
	.object({
		data: z
			.object({
				status_code: z.number(),
				message: z.string(),
				location: z.string().optional(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const DashboardsQueryPublicOutputSchema = z
	.object({
		data: z
			.object({
				status_code: z.number(),
				message: z.string().optional(),
				// results is z.record(z.unknown()) because its keys are RefIDs and values vary by panel type
				results: z.record(z.unknown()).optional(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

const JwksRetrieveOutputSchema = z
	.object({
		data: z
			.object({
				keys: z.array(JsonWebKeySchema).optional(),
			})
			.passthrough(),
		error: z.string().optional(),
		successful: z.boolean(),
	})
	.passthrough();

// ── Schema Maps ───────────────────────────────────────────────────────────────

export const GrafanaEndpointInputSchemas = {
	logsCreateOtlp: LogsCreateOtlpInputSchema,
	healthGet: HealthGetInputSchema,
	statusGet: StatusGetInputSchema,
	ringGetDistributorHaTracker: RingGetDistributorHaTrackerInputSchema,
	ringGetIndexGateway: RingGetIndexGatewayInputSchema,
	ringGetOverridesExporter: RingGetOverridesExporterInputSchema,
	ringGetRuler: RingGetRulerInputSchema,
	storeGatewayGetTenants: StoreGatewayGetTenantsInputSchema,
	samlPostAcs: SamlPostAcsInputSchema,
	dashboardsQueryPublic: DashboardsQueryPublicInputSchema,
	jwksRetrieve: JwksRetrieveInputSchema,
};

export const GrafanaEndpointOutputSchemas = {
	logsCreateOtlp: LogsCreateOtlpOutputSchema,
	healthGet: HealthGetOutputSchema,
	statusGet: StatusGetOutputSchema,
	ringGetDistributorHaTracker: RingGetDistributorHaTrackerOutputSchema,
	ringGetIndexGateway: RingGetIndexGatewayOutputSchema,
	ringGetOverridesExporter: RingGetOverridesExporterOutputSchema,
	ringGetRuler: RingGetRulerOutputSchema,
	storeGatewayGetTenants: StoreGatewayGetTenantsOutputSchema,
	samlPostAcs: SamlPostAcsOutputSchema,
	dashboardsQueryPublic: DashboardsQueryPublicOutputSchema,
	jwksRetrieve: JwksRetrieveOutputSchema,
};

// ── Inferred Types ────────────────────────────────────────────────────────────

export type LogsCreateOtlpInput = z.infer<typeof LogsCreateOtlpInputSchema>;
export type HealthGetInput = z.infer<typeof HealthGetInputSchema>;
export type StatusGetInput = z.infer<typeof StatusGetInputSchema>;
export type RingGetDistributorHaTrackerInput = z.infer<
	typeof RingGetDistributorHaTrackerInputSchema
>;
export type RingGetIndexGatewayInput = z.infer<
	typeof RingGetIndexGatewayInputSchema
>;
export type RingGetOverridesExporterInput = z.infer<
	typeof RingGetOverridesExporterInputSchema
>;
export type RingGetRulerInput = z.infer<typeof RingGetRulerInputSchema>;
export type StoreGatewayGetTenantsInput = z.infer<
	typeof StoreGatewayGetTenantsInputSchema
>;
export type SamlPostAcsInput = z.infer<typeof SamlPostAcsInputSchema>;
export type DashboardsQueryPublicInput = z.infer<
	typeof DashboardsQueryPublicInputSchema
>;
export type JwksRetrieveInput = z.infer<typeof JwksRetrieveInputSchema>;

export type LogsCreateOtlpResponse = z.infer<typeof LogsCreateOtlpOutputSchema>;
export type HealthGetResponse = z.infer<typeof HealthGetOutputSchema>;
export type StatusGetResponse = z.infer<typeof StatusGetOutputSchema>;
export type RingGetDistributorHaTrackerResponse = z.infer<
	typeof RingGetDistributorHaTrackerOutputSchema
>;
export type RingGetIndexGatewayResponse = z.infer<
	typeof RingGetIndexGatewayOutputSchema
>;
export type RingGetOverridesExporterResponse = z.infer<
	typeof RingGetOverridesExporterOutputSchema
>;
export type RingGetRulerResponse = z.infer<typeof RingGetRulerOutputSchema>;
export type StoreGatewayGetTenantsResponse = z.infer<
	typeof StoreGatewayGetTenantsOutputSchema
>;
export type SamlPostAcsResponse = z.infer<typeof SamlPostAcsOutputSchema>;
export type DashboardsQueryPublicResponse = z.infer<
	typeof DashboardsQueryPublicOutputSchema
>;
export type JwksRetrieveResponse = z.infer<typeof JwksRetrieveOutputSchema>;

export type GrafanaEndpointInputs = {
	logsCreateOtlp: LogsCreateOtlpInput;
	healthGet: HealthGetInput;
	statusGet: StatusGetInput;
	ringGetDistributorHaTracker: RingGetDistributorHaTrackerInput;
	ringGetIndexGateway: RingGetIndexGatewayInput;
	ringGetOverridesExporter: RingGetOverridesExporterInput;
	ringGetRuler: RingGetRulerInput;
	storeGatewayGetTenants: StoreGatewayGetTenantsInput;
	samlPostAcs: SamlPostAcsInput;
	dashboardsQueryPublic: DashboardsQueryPublicInput;
	jwksRetrieve: JwksRetrieveInput;
};

export type GrafanaEndpointOutputs = {
	logsCreateOtlp: LogsCreateOtlpResponse;
	healthGet: HealthGetResponse;
	statusGet: StatusGetResponse;
	ringGetDistributorHaTracker: RingGetDistributorHaTrackerResponse;
	ringGetIndexGateway: RingGetIndexGatewayResponse;
	ringGetOverridesExporter: RingGetOverridesExporterResponse;
	ringGetRuler: RingGetRulerResponse;
	storeGatewayGetTenants: StoreGatewayGetTenantsResponse;
	samlPostAcs: SamlPostAcsResponse;
	dashboardsQueryPublic: DashboardsQueryPublicResponse;
	jwksRetrieve: JwksRetrieveResponse;
};
