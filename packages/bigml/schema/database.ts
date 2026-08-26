import { z } from 'zod';
import { B, N, Obj, Resource, S, StrArray, UnknownArray } from './primitives';

/**
 * Field names match official JSON keys.
 * https://bigml.com/api/projects
 * https://bigml.com/api/sources
 * https://bigml.com/api/configurations
 * https://bigml.com/api/external_connectors
 * https://bigml.com/api/models
 *
 * Live extras confirmed 2026-08-18 against GET /project, GET /source,
 * POST /project, POST /externalconnector.
 *
 * Only `resource` is required. BigML nulls or omits the rest depending on
 * resource type, processing state, and plan. External connectors are never
 * persisted: GET echoes `connection.password` in plaintext.
 */

/**
 * Resource processing status.
 * https://bigml.com/api/sources?id=source-status
 * Same shape on every resource type.
 */
export const BigmlStatus = z
	.object({
		/** Status code of resource creation. */
		code: N,
		/** Milliseconds BigML.io spent processing the resource. */
		elapsed: N,
		/** Human-readable status explanation. */
		message: S,
		/** Build progress between 0 and 1. */
		progress: N,
	})
	.loose()
	.nullable()
	.optional();
export type BigmlStatus = z.infer<typeof BigmlStatus>;

/**
 * Outbound callback BigML may POST when a resource changes.
 * https://bigml.com/api/requests?id=webhooks
 * Catalog has 0 inbound triggers; this is a resource field, not a Corsair webhook.
 */
export const BigmlWebhook = z
	.object({
		url: S,
		secret: S,
	})
	.loose()
	.nullable()
	.optional();
export type BigmlWebhook = z.infer<typeof BigmlWebhook>;

/** Cached webhook: url only. `secret` is stripped; unknown keys are not kept. */
export const BigmlPersistedWebhook = z
	.object({
		url: S,
	})
	.nullable()
	.optional();
export type BigmlPersistedWebhook = z.infer<typeof BigmlPersistedWebhook>;

/**
 * Envelope every BigML resource carries.
 * Project: https://bigml.com/api/projects?id=project-properties
 * Model: https://bigml.com/api/models?id=model-properties
 */
const commonResourceFields = {
	/** Category code classifying the resource's domain of application. */
	category: N,
	/** HTTP status of this payload (201 on create, 200 afterwards). */
	code: N,
	/** Creation time, UTC, microsecond ISO-8601. */
	created: S,
	/** Username that created the resource. */
	creator: S,
	/** Resource description (restricted markdown). */
	description: S,
	/** Execution id that built the resource. */
	execution_id: S,
	/** Whether that execution is still available. */
	execution_status: B,
	/** Resource name. */
	name: S,
	/** Extra name info BigML appends. */
	name_options: S,
	/** Whether the resource is private. */
	private: B,
	/** project/id this resource belongs to. Absent on projects themselves. */
	project: S,
	/** Compound {type}/{hex24} id. Globally unique on the account. */
	resource: Resource,
	/** Whether the resource is shared via a private link. */
	shared: B,
	status: BigmlStatus,
	/** Whether the resource was created on a subscription plan. */
	subscription: B,
	/** User tags. */
	tags: StrArray,
	updated: S,
	webhook: BigmlPersistedWebhook,
};

/**
 * Source parser object.
 * https://bigml.com/api/sources?id=source-parser-object
 */
export const BigmlSourceParser = z
	.object({
		/** Whether the source contains a header row. */
		header: B,
		/** Columns to extract when rows are JSON dictionaries. */
		json_fields: StrArray,
		/** Top-level JSON key containing the rows. */
		json_key: S,
		/** Source locale (e.g. en-US). */
		locale: S,
		/** Tokens treated as missing values. */
		missing_tokens: StrArray,
		/** Quote character. */
		quote: S,
		/** Field separator. Empty string for a single-column source. */
		separator: S,
		/** Whether to trim field strings. */
		trim: B,
	})
	.loose()
	.nullable()
	.optional();
export type BigmlSourceParser = z.infer<typeof BigmlSourceParser>;

/**
 * One entry in source.fields, keyed by BigML's generated field id.
 * https://bigml.com/api/sources?id=source-fields
 */
export const BigmlSourceField = z
	.object({
		/** Column number in the original file. */
		column_number: N,
		/** Longer field description. */
		description: S,
		/** Item-analysis parameters when optype is items. */
		item_analysis: Obj,
		/** Longer display name. */
		label: S,
		/** Per-field locale, if different from the source locale. */
		locale: S,
		/** Per-field missing tokens. */
		missing_tokens: StrArray,
		/** Column name from the header, or an auto-generated name. */
		name: S,
		/**
		 * Live 2026-08-18: field order in the source.
		 * Not listed on the official Source Fields table.
		 */
		order: N,
		/** numeric, categorical, text, items, image, path, or regions. */
		optype: S,
		/** Text-analysis parameters when optype is text. */
		term_analysis: Obj,
	})
	.loose();
export type BigmlSourceField = z.infer<typeof BigmlSourceField>;

/**
 * Counts of fields by type.
 * https://bigml.com/api/sources?id=source-properties
 */
export const BigmlFieldTypes = z
	.object({
		auto_generated: Obj,
		categorical: N,
		datetime: N,
		image: N,
		items: N,
		numeric: N,
		path: N,
		regions: N,
		text: N,
		total: N,
	})
	.loose()
	.nullable()
	.optional();
export type BigmlFieldTypes = z.infer<typeof BigmlFieldTypes>;

/**
 * Pagination over the fields dictionary.
 * https://bigml.com/api/sources?id=source-properties
 */
export const BigmlFieldsMeta = z
	.object({
		count: N,
		limit: N,
		offset: N,
		query_total: N,
		total: N,
	})
	.loose()
	.nullable()
	.optional();
export type BigmlFieldsMeta = z.infer<typeof BigmlFieldsMeta>;

/**
 * GET /project — official Project Properties.
 * https://bigml.com/api/projects?id=project-properties
 */
export const BigmlProjectEntity = z
	.object({
		...commonResourceFields,
		/**
		 * Live 2026-08-18: configuration/id applied to this project.
		 * Not listed on the official Project Properties table.
		 */
		configuration: S,
		/**
		 * Live 2026-08-18: whether that configuration is still available.
		 * Not listed on the official Project Properties table.
		 */
		configuration_status: B,
		/**
		 * Live 2026-08-18: permission strings for this project.
		 * Not listed on the official Project Properties table.
		 */
		manage_permission: UnknownArray,
		/** Per-resource-type counts of resources in the project. */
		stats: z
			.record(z.string(), z.object({ count: N }).loose())
			.nullable()
			.optional(),
		/**
		 * Live 2026-08-18: project type integer.
		 * Not listed on the official Project Properties table.
		 */
		type: N,
		/**
		 * Live 2026-08-18: caller-supplied metadata map.
		 * Not listed on the official Project Properties table.
		 */
		user_metadata: Obj,
	})
	.loose();
export type BigmlProjectEntity = z.infer<typeof BigmlProjectEntity>;

/**
 * GET /source — official Source Properties, plus live extras.
 * https://bigml.com/api/sources?id=source-properties
 */
export const BigmlSourceEntity = z
	.object({
		...commonResourceFields,
		/**
		 * Live 2026-08-18: detected file charset (e.g. UTF-8).
		 * Not listed on the official Source Properties table.
		 */
		charset: S,
		/** Whether the source is closed. Closed sources reject parser/field updates. */
		closed: B,
		/**
		 * Live 2026-08-18: configuration/id applied to this source.
		 * Not listed on the official Source Properties table.
		 */
		configuration: S,
		/**
		 * Live 2026-08-18: whether that configuration is still available.
		 * Not listed on the official Source Properties table.
		 */
		configuration_status: B,
		/** MIME content-type as provided by the HTTP client. */
		content_type: S,
		/**
		 * Live 2026-08-18: whether autolabel is disabled.
		 * Not listed on the official Source Properties table.
		 */
		disable_autolabel: B,
		/** False when BigML did not generate fields from datetime columns. */
		disable_datetime: B,
		/** Counts of fields by type. */
		field_types: BigmlFieldTypes,
		/** Per-column field dictionary, keyed by BigML field id. */
		fields: z.record(z.string(), BigmlSourceField).nullable().optional(),
		/** Pagination over `fields`. */
		fields_meta: BigmlFieldsMeta,
		/** Sample values per field id. Official type is Object, live is a dict of arrays. */
		fields_preview: z
			.record(z.string(), z.array(z.unknown()))
			.nullable()
			.optional(),
		/** Uploaded file name. */
		file_name: S,
		/** Source format. */
		format: S,
		/**
		 * Live 2026-08-18 GET: extra format metadata.
		 * Not listed on the official Source Properties table.
		 */
		formats: Obj,
		/** Height in pixels of the normalized image. */
		height: N,
		/** Image-analysis parameters. */
		image_analysis: Obj,
		/**
		 * Live 2026-08-18: image identifier on image sources.
		 * Not listed on the official Source Properties table.
		 */
		image_id: S,
		/** Item-analysis defaults for items fields. */
		item_analysis: Obj,
		/** MD5 of the uploaded file. */
		md5: S,
		/** Label fields added to an image composite. */
		new_fields: UnknownArray,
		number_of_anomalies: N,
		number_of_anomalyscores: N,
		number_of_associations: N,
		number_of_associationsets: N,
		number_of_centroids: N,
		number_of_clusters: N,
		number_of_correlations: N,
		number_of_datasets: N,
		/**
		 * Live 2026-08-18: deepnets that use this source.
		 * Not listed on the official Source Properties table.
		 */
		number_of_deepnets: N,
		number_of_ensembles: N,
		number_of_forecasts: N,
		number_of_linearregressions: N,
		number_of_logisticregressions: N,
		number_of_models: N,
		number_of_optimls: N,
		number_of_pca: N,
		number_of_predictions: N,
		/**
		 * Live 2026-08-18: projections that use this source.
		 * Not listed on the official Source Properties table.
		 */
		number_of_projections: N,
		number_of_statisticaltests: N,
		number_of_timeseries: N,
		number_of_topicdistributions: N,
		number_of_topicmodels: N,
		/** source/id of the original source. */
		origin: S,
		/** Image height before normalization. */
		original_height: N,
		/**
		 * Live 2026-08-18: original file format.
		 * Not listed on the official Source Properties table.
		 */
		original_format: S,
		/** Image size before normalization. */
		original_size: N,
		/** Image width before normalization. */
		original_width: N,
		/** Source ids for which this source is a component. */
		parent_sources: StrArray,
		/** URL of a remote data source. */
		remote: S,
		/** Whether a shared source can be cloned. */
		shared_clonable: B,
		/** Hash giving access to a privately shared source. */
		shared_hash: S,
		/** Alternative key giving read access. */
		sharing_key: S,
		/** Size in bytes. */
		size: N,
		/** For csv+image composites, the csv component. */
		source_csv: S,
		/** Parsing parameters. */
		source_parser: BigmlSourceParser,
		/** Component source ids. */
		sources: StrArray,
		/**
		 * Live 2026-08-18 GET: number of component sources.
		 * Not listed on the official Source Properties table.
		 */
		sources_count: N,
		/** Parameters used to generate a synthetic source. */
		synthetic: Obj,
		/** Text-analysis defaults for text fields. */
		term_analysis: Obj,
		/**
		 * 0 local file, 1 remote URL, 2 inline, 3 synthetic, 4 external
		 * repository, 5 composite.
		 */
		type: N,
		/**
		 * Live 2026-08-18 GET: component type list.
		 * Not listed on the official Source Properties table.
		 */
		types: StrArray,
		/** Width in pixels of the normalized image. */
		width: N,
	})
	.loose();
export type BigmlSourceEntity = z.infer<typeof BigmlSourceEntity>;

/**
 * GET /configuration — official Configuration Properties.
 * https://bigml.com/api/configurations
 */
export const BigmlConfigurationEntity = z
	.object({
		...commonResourceFields,
		/** Default arguments keyed by resource type, plus `any`. */
		configurations: Obj,
		/**
		 * Live example in official docs: configuration type integer.
		 * Not listed on the official Configuration Properties table.
		 */
		type: N,
	})
	.loose();
export type BigmlConfigurationEntity = z.infer<typeof BigmlConfigurationEntity>;

/**
 * GET /externalconnector — official External Connector Properties.
 * https://bigml.com/api/external_connectors
 *
 * Never persisted. `connection` echoes password/user in plaintext.
 */
export const BigmlExternalConnectorEntity = z
	.object({
		...commonResourceFields,
		/** Connection parameters. May include plaintext password. */
		connection: Obj,
		/**
		 * Live 2026-08-18: engine name when created with `engine`.
		 * Official create arguments list `engine`; GET properties list `source`.
		 */
		engine: S,
		/** Whether the connector is public within the organization. */
		public_in_organization: B,
		/** External data source name: elasticsearch, postgresql, mysql, sqlserver. */
		source: S,
		/**
		 * Live 2026-08-18: connector type integer.
		 * Not listed on the official External Connector Properties table.
		 */
		type: N,
	})
	.loose();
export type BigmlExternalConnectorEntity = z.infer<
	typeof BigmlExternalConnectorEntity
>;

/**
 * Shared list envelope for the 34 catalog list-only resource types.
 *
 * Official model/dataset/etc. tables add type-specific fields (objective_field,
 * dataset, size, …). This plugin only lists those types, so the persisted row
 * is the common official envelope; type-specific keys pass through `.loose()`.
 * https://bigml.com/api/models?id=model-properties
 */
export const BigmlGenericResourceEntity = z
	.object({
		...commonResourceFields,
		/**
		 * Live 2026-08-18 on project/source: resource-type integer.
		 * Present on most BigML resources.
		 */
		type: N,
	})
	.loose();
export type BigmlGenericResourceEntity = z.infer<
	typeof BigmlGenericResourceEntity
>;
