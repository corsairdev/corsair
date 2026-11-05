import { z } from 'zod';

/**
 * Shared Faraday resource fields.
 * Official: Faraday REST API resource objects
 * https://faraday.ai/docs/reference
 */
const FaradayResourceBase = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		resource_type: z.string().optional(),
		status: z
			.enum(['new', 'starting', 'running', 'ready', 'error'])
			.or(z.string())
			.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		archived_at: z.string().nullable().optional(),
		status_changed_at: z.string().optional(),
		status_error: z.string().nullable().optional(),
		last_read_input_at: z.string().optional(),
		last_updated_config_at: z.string().optional(),
		last_updated_output_at: z.string().optional(),
	})
	.loose();

/**
 * Faraday account.
 * Official: GET /v1/accounts/{account_id}
 * https://faraday.ai/docs/reference/getaccount
 */
export const FaradayAccount = FaradayResourceBase.extend({
	branding: z
		.object({
			suppress_from_reports: z.boolean().optional(),
		})
		.optional(),
	commitment: z
		.object({
			monthly_cost: z.number().optional(),
			renewal_date: z.string().optional(),
		})
		.optional(),
	contract_started_at: z.string().optional(),
	identity_graph: z
		.object({
			feature_store_id: z.string(),
		})
		.optional(),
	parent_account_id: z.string().optional(),
	stripe_customer_id: z.string().optional(),
}).loose();
export type FaradayAccount = z.infer<typeof FaradayAccount>;

/**
 * Faraday cohort.
 * Official: GET /v1/cohorts/{cohort_id}
 * https://faraday.ai/docs/reference/getcohort
 */
export const FaradayCohort = FaradayResourceBase.loose();
export type FaradayCohort = z.infer<typeof FaradayCohort>;

/**
 * Faraday dataset.
 * Official: GET /v1/datasets/{dataset_id}
 * https://faraday.ai/docs/reference/getdataset
 */
export const FaradayDataset = FaradayResourceBase.loose();
export type FaradayDataset = z.infer<typeof FaradayDataset>;

/**
 * Faraday stream.
 * Official: GET /v1/streams/{stream_id_or_name}
 * https://faraday.ai/docs/reference
 */
export const FaradayStream = FaradayResourceBase.loose();
export type FaradayStream = z.infer<typeof FaradayStream>;

/**
 * Faraday outcome.
 * Official: GET /v1/outcomes/{outcome_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayOutcome = FaradayResourceBase.loose();
export type FaradayOutcome = z.infer<typeof FaradayOutcome>;

/**
 * Faraday persona set.
 * Official: GET /v1/persona_sets/{persona_set_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayPersonaSet = FaradayResourceBase.loose();
export type FaradayPersonaSet = z.infer<typeof FaradayPersonaSet>;

/**
 * Faraday place.
 * Official: GET /v1/places/{place_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayPlace = FaradayResourceBase.loose();
export type FaradayPlace = z.infer<typeof FaradayPlace>;

/**
 * Faraday scope.
 * Official: GET /v1/scopes/{scope_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayScope = FaradayResourceBase.loose();
export type FaradayScope = z.infer<typeof FaradayScope>;

/**
 * Faraday target.
 * Official: GET /v1/targets/{target_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayTarget = FaradayResourceBase.loose();
export type FaradayTarget = z.infer<typeof FaradayTarget>;

/**
 * Faraday trait.
 * Official: GET /v1/traits/{trait_id}
 * https://faraday.ai/docs/reference
 */
export const FaradayTrait = FaradayResourceBase.loose();
export type FaradayTrait = z.infer<typeof FaradayTrait>;

/**
 * Faraday connection.
 * Official: GET /v1/connections
 * https://faraday.ai/docs/reference
 */
export const FaradayConnection = FaradayResourceBase.loose();
export type FaradayConnection = z.infer<typeof FaradayConnection>;

/**
 * Faraday webhook endpoint.
 * Official: GET /v1/webhook_endpoints/{webhook_endpoint_id}
 * https://faraday.ai/docs/reference/getwebhookendpoint
 */
export const FaradayWebhookEndpoint = z
	.object({
		id: z.string(),
		url: z.string().optional(),
		status: z.enum(['enabled', 'disabled']).or(z.string()).optional(),
		enabled_events: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();
export type FaradayWebhookEndpoint = z.infer<typeof FaradayWebhookEndpoint>;

/**
 * Faraday dependency-graph edge.
 * Official: GET /v1/graph
 * https://faraday.ai/docs/reference/getgraph
 */
export const FaradayGraphEdge = z
	.object({
		downstream_id: z.string(),
		downstream_literate: z.string().optional(),
		downstream_status: z.string().optional(),
		downstream_type: z.string().optional(),
		upstream_id: z.string(),
		upstream_literate: z.string().optional(),
		upstream_status: z.string().optional(),
		upstream_type: z.string().optional(),
	})
	.loose();
export type FaradayGraphEdge = z.infer<typeof FaradayGraphEdge>;
