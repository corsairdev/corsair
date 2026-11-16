import { z } from 'zod';

// Inputs use New Relic's own parameter names where the REST v2 API is
// case-sensitive (`from`, `to`, `names[]`, `summarize`). Outputs are `.loose()`
// and their documented fields nullish, so a field New Relic adds cannot fail a
// call that has already happened.

export const NEWRELIC_REGIONS = ['us', 'eu'] as const;

const RegionSchema = z
	.enum(NEWRELIC_REGIONS)
	.optional()
	.describe(
		'Which data centre to call. Defaults to us; an EU account must pass eu, because a key is only valid in its own region.',
	);

/** New Relic takes `from` and `to` as ISO 8601 with an offset, or RFC 3339. */
const TimeSchema = z
	.string()
	.min(1)
	.describe(
		'An ISO 8601 instant with an offset, e.g. 2026-11-16T00:00:00+00:00. Omit `to` to end at now.',
	);

const AppIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The application id, from applications.list.');

// ── applications.list ─────────────────────────────────────────────────────

const ApplicationsListInputSchema = z.object({
	region: RegionSchema,
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Only applications whose name contains this text.'),
	host: z
		.string()
		.min(1)
		.optional()
		.describe('Only applications reporting from this host.'),
	ids: z.array(AppIdSchema).optional().describe('Only these application ids.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'REST v2 pages by number and reports the page count in a Link header, which this plugin cannot read. Pass a page explicitly to walk a long list.',
		),
});

export type ApplicationsListInput = z.input<typeof ApplicationsListInputSchema>;

const ApplicationSummarySchema = z
	.object({
		response_time: z.number().nullish(),
		throughput: z.number().nullish(),
		error_rate: z.number().nullish(),
		apdex_target: z.number().nullish(),
		apdex_score: z.number().nullish(),
	})
	.loose();

const ApplicationSettingsSchema = z
	.object({
		app_apdex_threshold: z.number().nullish(),
		end_user_apdex_threshold: z.number().nullish(),
		enable_real_user_monitoring: z.boolean().nullish(),
		use_server_side_config: z.boolean().nullish(),
	})
	.loose();

const ApplicationLinksSchema = z
	.object({
		application_instances: z.array(z.number()).nullish(),
		application_hosts: z.array(z.number()).nullish(),
		servers: z.array(z.number()).nullish(),
		alert_policy: z.number().nullish(),
	})
	.loose();

/**
 * `health_status` is `green`, `orange` (the REST spelling of yellow), `red` or
 * `unknown`. It is a string here rather than an enum so a value New Relic adds
 * cannot fail a read. `reporting` is false once an app has gone ten minutes
 * without a report, and `last_reported_at` is then empty rather than a time.
 */
export const ApplicationSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		language: z.string().nullish(),
		health_status: z.string().nullish(),
		reporting: z.boolean().nullish(),
		last_reported_at: z.string().nullish(),
		application_summary: ApplicationSummarySchema.nullish(),
		end_user_summary: ApplicationSummarySchema.nullish(),
		settings: ApplicationSettingsSchema.nullish(),
		links: ApplicationLinksSchema.nullish(),
	})
	.loose();

export type NewrelicApplication = z.infer<typeof ApplicationSchema>;

const ApplicationsListResponseSchema = z.object({
	applications: z.array(ApplicationSchema),
});

export type ApplicationsListResponse = z.infer<
	typeof ApplicationsListResponseSchema
>;

// ── applications.get ──────────────────────────────────────────────────────

const ApplicationsGetInputSchema = z.object({
	region: RegionSchema,
	applicationId: AppIdSchema,
});

export type ApplicationsGetInput = z.input<typeof ApplicationsGetInputSchema>;

const ApplicationResponseSchema = z.object({ application: ApplicationSchema });

export type ApplicationsGetResponse = z.infer<typeof ApplicationResponseSchema>;

// ── metrics.data ──────────────────────────────────────────────────────────

const MetricsDataInputSchema = z.object({
	region: RegionSchema,
	applicationId: AppIdSchema,
	names: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Metric names, sent as repeated `names[]` parameters, e.g. Apdex, Errors/all, WebTransaction.',
		),
	from: TimeSchema.optional().describe(
		'Start of the window. New Relic defaults to the last 30 minutes.',
	),
	to: TimeSchema.optional().describe('End of the window. Defaults to now.'),
	period: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Seconds per data point.'),
	summarize: z
		.boolean()
		.optional()
		.describe(
			'Return one averaged value for the window rather than the series.',
		),
	values: z
		.array(z.string().min(1))
		.optional()
		.describe('Only these value fields, e.g. average_value, call_count.'),
});

export type MetricsDataInput = z.input<typeof MetricsDataInputSchema>;

/**
 * `values` is a map keyed by the value names the caller asked for, e.g.
 * `average_value` or `call_count`, so it cannot be a fixed object shape.
 */
const MetricValuesSchema = z.record(z.string(), z.number().nullish());

/** One period of the window, with its aggregate under `values`. */
const MetricTimesliceSchema = z
	.object({
		from: z.string().nullish(),
		to: z.string().nullish(),
		values: MetricValuesSchema.nullish(),
	})
	.loose();

/**
 * New Relic answers with a `timeslices` array. With `summarize: true` the array
 * holds a single entry covering the whole window, so the only difference is the
 * length. A series-level `values` map is also accepted, which some metric types
 * return instead of a series.
 */
const MetricSeriesSchema = z
	.object({
		name: z.string().nullish(),
		/** The period length in seconds. */
		timeslice: z.number().nullish(),
		values: MetricValuesSchema.nullish(),
		timeslices: z.array(MetricTimesliceSchema).nullish(),
	})
	.loose();

const MetricDataSchema = z
	.object({
		from: z.string().nullish(),
		to: z.string().nullish(),
		metrics: z.array(MetricSeriesSchema).nullish(),
	})
	.loose();

const MetricsDataResponseSchema = z.object({
	metric_data: MetricDataSchema,
});

export type MetricsDataResponse = z.infer<typeof MetricsDataResponseSchema>;

// ── alerts.policies ───────────────────────────────────────────────────────

const PoliciesListInputSchema = z.object({
	region: RegionSchema,
	name: z.string().min(1).optional().describe('Only policies with this name.'),
	page: z.number().int().min(1).optional(),
});

export type PoliciesListInput = z.input<typeof PoliciesListInputSchema>;

const AlertPolicySchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		incident_preference: z.string().nullish(),
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
	})
	.loose();

export type NewrelicAlertPolicy = z.infer<typeof AlertPolicySchema>;

const PoliciesListResponseSchema = z.object({
	policies: z.array(AlertPolicySchema),
});

export type PoliciesListResponse = z.infer<typeof PoliciesListResponseSchema>;

export const NEWRELIC_INCIDENT_PREFERENCES = [
	'PER_POLICY',
	'PER_CONDITION',
	'PER_CONDITION_AND_TARGET',
] as const;

const PoliciesCreateInputSchema = z.object({
	region: RegionSchema,
	name: z.string().min(1).describe('The policy name.'),
	incident_preference: z
		.enum(NEWRELIC_INCIDENT_PREFERENCES)
		.optional()
		.describe(
			'How alerts roll up into incidents. Defaults at New Relic to PER_POLICY.',
		),
});

export type PoliciesCreateInput = z.input<typeof PoliciesCreateInputSchema>;

const PolicyResponseSchema = z.object({ policy: AlertPolicySchema });

export type PoliciesCreateResponse = z.infer<typeof PolicyResponseSchema>;

const PoliciesDeleteInputSchema = z.object({
	region: RegionSchema,
	policyId: z.number().int().positive(),
});

export type PoliciesDeleteInput = z.input<typeof PoliciesDeleteInputSchema>;

const PolicyDeletedResponseSchema = z.object({
	policy: AlertPolicySchema,
});

export type PoliciesDeleteResponse = z.infer<
	typeof PolicyDeletedResponseSchema
>;

// ── alerts.conditions ─────────────────────────────────────────────────────

const ConditionsListInputSchema = z.object({
	region: RegionSchema,
	policyId: z
		.number()
		.int()
		.positive()
		.describe('Only conditions in this policy.'),
	page: z.number().int().min(1).optional(),
});

export type ConditionsListInput = z.input<typeof ConditionsListInputSchema>;

const ConditionTermSchema = z
	.object({
		duration: z.string().nullish(),
		operator: z.string().nullish(),
		priority: z.string().nullish(),
		threshold: z.string().nullish(),
		time_function: z.string().nullish(),
	})
	.loose();

const AlertConditionSchema = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		enabled: z.boolean().nullish(),
		entities: z.array(z.number()).nullish(),
		metric: z.string().nullish(),
		condition_scope: z.string().nullish(),
		terms: z.array(ConditionTermSchema).nullish(),
		user_defined: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export type NewrelicAlertCondition = z.infer<typeof AlertConditionSchema>;

const ConditionsListResponseSchema = z.object({
	conditions: z.array(AlertConditionSchema),
});

export type ConditionsListResponse = z.infer<
	typeof ConditionsListResponseSchema
>;

// ── query.nrql ────────────────────────────────────────────────────────────

const NrqlInputSchema = z.object({
	region: RegionSchema,
	accountId: z
		.number()
		.int()
		.positive()
		.describe('The New Relic account the query runs against.'),
	query: z
		.string()
		.min(1)
		.describe(
			'A NRQL statement, e.g. SELECT count(*) FROM Transaction SINCE 1 hour ago.',
		),
});

export type NrqlInput = z.input<typeof NrqlInputSchema>;

/**
 * A NRQL result keeps its own columns, whose names follow the query, so the row
 * keys are open. A value is not limited to a scalar: `SELECT uniques(appName)`
 * returns an array, and `percentile(duration, 50, 95)` returns an object, so the
 * cell is any JSON value and the caller reads the column it asked for.
 */
/** A NRQL cell is any JSON value: a scalar, an array, or a nested object. */
export type NrqlCell =
	| string
	| number
	| boolean
	| null
	| NrqlCell[]
	| { [key: string]: NrqlCell };

// The query decides which JSON type a cell holds, so the schema accepts any of
// them: `uniques()` returns an array and `percentile()` returns an object.
const NrqlCellSchema: z.ZodType<NrqlCell> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(NrqlCellSchema),
		z.record(z.string(), NrqlCellSchema),
	]),
);

const NrqlRowSchema = z.record(z.string(), NrqlCellSchema);

const NrqlResultSchema = z
	.object({
		results: z.array(NrqlRowSchema).nullish(),
		metadata: z
			.object({
				timeWindow: z
					.object({
						// NerdGraph answers these as epoch milliseconds.
						begin: z.number().nullish(),
						end: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const NrqlResponseSchema = z.object({
	results: z.array(NrqlRowSchema),
	metadata: z
		.object({
			// NerdGraph answers these as epoch milliseconds.
			timeWindow: z
				.object({ begin: z.number().nullish(), end: z.number().nullish() })
				.loose()
				.nullish(),
		})
		.loose()
		.nullish(),
});

export type NrqlResponse = z.infer<typeof NrqlResponseSchema>;

/** The GraphQL document the NRQL call sends. Exported so a test can pin it. */
export const NEWRELIC_NRQL_DOCUMENT = `query Nrql($accountId: Int!, $query: Nrql!) {
  actor {
    account(id: $accountId) {
      nrql(query: $query) {
        results
        metadata {
          timeWindow {
            begin
            end
          }
        }
      }
    }
  }
}`;

/** The `data.actor.account.nrql` slice of the GraphQL answer. */
export const GraphqlNrqlEnvelopeSchema = z.object({
	data: z.object({
		actor: z.object({
			account: z.object({ nrql: NrqlResultSchema.nullish() }).nullish(),
		}),
	}),
});

// ── Registry ──────────────────────────────────────────────────────────────

export type NewrelicEndpointInputs = {
	applicationsList: ApplicationsListInput;
	applicationsGet: ApplicationsGetInput;
	metricsData: MetricsDataInput;
	policiesList: PoliciesListInput;
	policiesCreate: PoliciesCreateInput;
	policiesDelete: PoliciesDeleteInput;
	conditionsList: ConditionsListInput;
	queryNrql: NrqlInput;
};

export type NewrelicEndpointOutputs = {
	applicationsList: ApplicationsListResponse;
	applicationsGet: ApplicationsGetResponse;
	metricsData: MetricsDataResponse;
	policiesList: PoliciesListResponse;
	policiesCreate: PoliciesCreateResponse;
	policiesDelete: PoliciesDeleteResponse;
	conditionsList: ConditionsListResponse;
	queryNrql: NrqlResponse;
};

export const NewrelicEndpointInputSchemas = {
	applicationsList: ApplicationsListInputSchema,
	applicationsGet: ApplicationsGetInputSchema,
	metricsData: MetricsDataInputSchema,
	policiesList: PoliciesListInputSchema,
	policiesCreate: PoliciesCreateInputSchema,
	policiesDelete: PoliciesDeleteInputSchema,
	conditionsList: ConditionsListInputSchema,
	queryNrql: NrqlInputSchema,
} as const;

export const NewrelicEndpointOutputSchemas = {
	applicationsList: ApplicationsListResponseSchema,
	applicationsGet: ApplicationResponseSchema,
	metricsData: MetricsDataResponseSchema,
	policiesList: PoliciesListResponseSchema,
	policiesCreate: PolicyResponseSchema,
	policiesDelete: PolicyDeletedResponseSchema,
	conditionsList: ConditionsListResponseSchema,
	queryNrql: NrqlResponseSchema,
} as const;
