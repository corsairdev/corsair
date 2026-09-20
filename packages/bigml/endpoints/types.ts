import { z } from 'zod';
import {
	BigmlConfigurationEntity,
	BigmlExternalConnectorEntity,
	BigmlGenericResourceEntity,
	BigmlProjectEntity,
	BigmlSourceEntity,
} from '../schema/database';

/**
 * Shared list params. The catalog's own descriptions promise "filtering,
 * ordering, and pagination" on most list operations, and all three are
 * confirmed live, real capabilities - not decorative:
 *
 * - `limit`/`offset`: an invalid `limit` value 400s (`GET /source?limit=abc`).
 * - `orderBy` -> `order_by`: `order_by=size` and `order_by=-size` (descending)
 *   both sort by real effect; an unrecognised field name 400s with
 *   `"No matching '<field>' field for ordering"`.
 * - `filter`: arbitrary `field=value` query params narrow results by real
 *   effect (confirmed: `?name=<nonexistent>` returns `total_count: 0`).
 *   BigML does not publish a fixed per-resource-type filterable-field list
 *   (the SDK's own docstring only says "fields labeled as filterable" without
 *   naming them), so this is a passthrough rather than a named enum - the
 *   caller supplies real BigML field names, the same way the SDK's own
 *   `query_string` parameter works. `__lt`/`__lte`/`__gt`/`__gte` suffixes on
 *   a key (e.g. `size__gt`) are supported the same way, confirmed in the SDK.
 */
const PageParams = {
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	orderBy: z.string().optional(),
	filter: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
};

/**
 * The list envelope every BigML list endpoint returns, confirmed identical
 * across every resource type checked live (`project`, `source`,
 * `externalconnector`, and the 34 generic resource types via their shared
 * shape): `{meta: {limit, offset, total_count, next, previous}, objects}`.
 * `next`/`previous` are sanitised of the live credentials BigML embeds in
 * them by `client.ts`'s `redactPaginationCredentials` before this ever runs.
 */
const ListEnvelope = <T extends z.ZodTypeAny>(entity: T) =>
	z.object({
		meta: z
			.object({
				limit: z.number().nullable().optional(),
				offset: z.number().nullable().optional(),
				total_count: z.number().nullable().optional(),
				next: z.string().nullable().optional(),
				previous: z.string().nullable().optional(),
			})
			.loose(),
		objects: z.array(entity),
	});

/* -------------------------------------------------------------------------- */
/*                                   Projects                                 */
/* -------------------------------------------------------------------------- */

const ProjectsCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	/** Official category code. https://bigml.com/api/projects?id=project-arguments */
	category: z.number().int().optional(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsGetInputSchema = z.object({ projectId: z.string() });
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsDeleteInputSchema = z.object({ projectId: z.string() });
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

const ProjectsListInputSchema = z.object({ ...PageParams });
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Sources                                 */
/* -------------------------------------------------------------------------- */

const SourcesGetInputSchema = z.object({ sourceId: z.string() });
export type SourcesGetInput = z.infer<typeof SourcesGetInputSchema>;

/**
 * A single field's editable properties, keyed by BigML's own field id
 * (e.g. `"100002"`) - confirmed live from a real source's `fields` object
 * shape (`GET /source/{id}`). `.loose()` since BigML documents more
 * per-field properties (`preferred`, `term_analysis`, ...) than this
 * catalog needs to expose, and a caller may legitimately want to pass one
 * through.
 */
const SourceFieldUpdateSchema = z
	.object({
		name: z.string().optional(),
		label: z.string().optional(),
		description: z.string().optional(),
		optype: z.string().optional(),
		locale: z.string().optional(),
		missingTokens: z.array(z.string()).optional(),
	})
	.loose();

/**
 * BigML's SDK passes `update_source`'s `changes` straight through with no
 * fixed field list (`sourcehandler.py`'s `update_source` docstring: "Updates
 * remote `source` with `changes`"). The catalog's own description calls out
 * "parsing configuration" and "field properties" by name, so both are
 * modelled here - `sourceParser` (confirmed live shape:
 * `{locale, missing_tokens, separator}`) and `fields` (confirmed live shape:
 * a map from field id to a field-definition object).
 *
 * Confirmed live 2026-08-18: name/description/tags on a closed source
 * return 202; `source_parser`/`fields` return 400 `"Cannot update closed
 * source"`. Parser keys match the official Source Parser Object.
 * https://bigml.com/api/sources?id=source-parser-object
 */
const SourcesUpdateInputSchema = z.object({
	sourceId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	sourceParser: z
		.object({
			header: z.boolean().optional(),
			jsonFields: z.array(z.string()).optional(),
			jsonKey: z.string().optional(),
			locale: z.string().optional(),
			missingTokens: z.array(z.string()).optional(),
			quote: z.string().optional(),
			separator: z.string().optional(),
			trim: z.boolean().optional(),
		})
		.optional(),
	fields: z.record(z.string(), SourceFieldUpdateSchema).optional(),
});
export type SourcesUpdateInput = z.infer<typeof SourcesUpdateInputSchema>;

const SourcesListInputSchema = z.object({ ...PageParams });
export type SourcesListInput = z.infer<typeof SourcesListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                              External connectors                          */
/* -------------------------------------------------------------------------- */

/**
 * Confirmed live via BigML's own validation error on
 * `POST /externalconnector`: sending an unrecognised key inside `connection`
 * returns `"Key must be one of these: [...]"` naming exactly this set.
 */
const ExternalConnectorConnectionInputSchema = z
	.object({
		host: z.string().optional(),
		hosts: z.array(z.string()).optional(),
		port: z.number().optional(),
		database: z.string().optional(),
		use_ssl: z.boolean().optional(),
		verify_certs: z.boolean().optional(),
		user: z.string().optional(),
		password: z.string().optional(),
		http_auth: z.string().optional(),
		sslmode: z.string().optional(),
		master: z.string().optional(),
		timeout: z.number().optional(),
		indice: z.string().optional(),
	})
	.loose();

const ExternalConnectorsCreateInputSchema = z
	.object({
		/**
		 * Official GET property and live-confirmed create field
		 * (`postgresql`, `mysql`, `sqlserver`, `elasticsearch`).
		 * https://bigml.com/api/external_connectors
		 */
		source: z.string().optional(),
		/**
		 * Official create argument. Live 2026-08-18: POST with `engine` also
		 * sets `source`; POST with only `source` leaves `engine` null.
		 */
		engine: z.string().optional(),
		connection: ExternalConnectorConnectionInputSchema,
		name: z.string().optional(),
		category: z.number().int().optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		project: z.string().optional(),
	})
	.refine((value) => Boolean(value.source || value.engine), {
		message: 'source or engine is required',
		path: ['source'],
	});
export type ExternalConnectorsCreateInput = z.infer<
	typeof ExternalConnectorsCreateInputSchema
>;

const ExternalConnectorsGetInputSchema = z.object({
	externalConnectorId: z.string(),
});
export type ExternalConnectorsGetInput = z.infer<
	typeof ExternalConnectorsGetInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                Configurations                              */
/* -------------------------------------------------------------------------- */

const ConfigurationsGetInputSchema = z.object({ configurationId: z.string() });
export type ConfigurationsGetInput = z.infer<
	typeof ConfigurationsGetInputSchema
>;

const ConfigurationsListInputSchema = z.object({ ...PageParams });
export type ConfigurationsListInput = z.infer<
	typeof ConfigurationsListInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                    Generic list-only computed resources                   */
/* -------------------------------------------------------------------------- */

/** Every generic list-only resource in this catalog shares this one input shape. */
const GenericListInputSchema = z.object({ ...PageParams });
export type GenericListInput = z.infer<typeof GenericListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Registry                                  */
/* -------------------------------------------------------------------------- */

/** The 34 catalog operations that are a plain `GET {resource}` list, sharing one input/output shape. */
export const GENERIC_LIST_OPS = [
	'anomaliesList',
	'anomalyScoresList',
	'associationSetsList',
	'associationsList',
	'batchAnomalyScoresList',
	'batchCentroidsList',
	'batchPredictionsList',
	'batchProjectionsList',
	'batchTopicDistributionsList',
	'centroidsList',
	'clustersList',
	'compositesList',
	'correlationsList',
	'datasetsList',
	'deepnetsList',
	'ensemblesList',
	'evaluationsList',
	'executionsList',
	'forecastsList',
	'fusionsList',
	'librariesList',
	'linearRegressionsList',
	'logisticRegressionsList',
	'modelsList',
	'optimlsList',
	'pcasList',
	'predictionsList',
	'projectionsList',
	'samplesList',
	'scriptsList',
	'statisticalTestsList',
	'timeSeriesList',
	'topicDistributionsList',
	'topicModelsList',
] as const;
export type GenericListOp = (typeof GENERIC_LIST_OPS)[number];

export type BigmlEndpointInputs = {
	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsDelete: ProjectsDeleteInput;
	projectsList: ProjectsListInput;
	sourcesGet: SourcesGetInput;
	sourcesUpdate: SourcesUpdateInput;
	sourcesList: SourcesListInput;
	externalConnectorsCreate: ExternalConnectorsCreateInput;
	externalConnectorsGet: ExternalConnectorsGetInput;
	configurationsGet: ConfigurationsGetInput;
	configurationsList: ConfigurationsListInput;
} & Record<GenericListOp, GenericListInput>;

export type BigmlEndpointOutputs = {
	projectsCreate: z.infer<typeof BigmlProjectEntity>;
	projectsGet: z.infer<typeof BigmlProjectEntity>;
	projectsDelete: void;
	projectsList: z.infer<
		ReturnType<typeof ListEnvelope<typeof BigmlProjectEntity>>
	>;
	sourcesGet: z.infer<typeof BigmlSourceEntity>;
	sourcesUpdate: z.infer<typeof BigmlSourceEntity>;
	sourcesList: z.infer<
		ReturnType<typeof ListEnvelope<typeof BigmlSourceEntity>>
	>;
	externalConnectorsCreate: z.infer<typeof BigmlExternalConnectorEntity>;
	externalConnectorsGet: z.infer<typeof BigmlExternalConnectorEntity>;
	configurationsGet: z.infer<typeof BigmlConfigurationEntity>;
	configurationsList: z.infer<
		ReturnType<typeof ListEnvelope<typeof BigmlConfigurationEntity>>
	>;
} & Record<
	GenericListOp,
	z.infer<ReturnType<typeof ListEnvelope<typeof BigmlGenericResourceEntity>>>
>;

const genericListInputSchemas = Object.fromEntries(
	GENERIC_LIST_OPS.map((op) => [op, GenericListInputSchema]),
) as Record<GenericListOp, typeof GenericListInputSchema>;

const genericListOutputSchemas = Object.fromEntries(
	GENERIC_LIST_OPS.map((op) => [op, ListEnvelope(BigmlGenericResourceEntity)]),
) as Record<
	GenericListOp,
	ReturnType<typeof ListEnvelope<typeof BigmlGenericResourceEntity>>
>;

export const BigmlEndpointInputSchemas = {
	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	sourcesGet: SourcesGetInputSchema,
	sourcesUpdate: SourcesUpdateInputSchema,
	sourcesList: SourcesListInputSchema,
	externalConnectorsCreate: ExternalConnectorsCreateInputSchema,
	externalConnectorsGet: ExternalConnectorsGetInputSchema,
	configurationsGet: ConfigurationsGetInputSchema,
	configurationsList: ConfigurationsListInputSchema,
	...genericListInputSchemas,
} as const;

export const BigmlEndpointOutputSchemas = {
	projectsCreate: BigmlProjectEntity,
	projectsGet: BigmlProjectEntity,
	projectsDelete: z.void(),
	projectsList: ListEnvelope(BigmlProjectEntity),
	sourcesGet: BigmlSourceEntity,
	sourcesUpdate: BigmlSourceEntity,
	sourcesList: ListEnvelope(BigmlSourceEntity),
	externalConnectorsCreate: BigmlExternalConnectorEntity,
	externalConnectorsGet: BigmlExternalConnectorEntity,
	configurationsGet: BigmlConfigurationEntity,
	configurationsList: ListEnvelope(BigmlConfigurationEntity),
	...genericListOutputSchemas,
} as const;
