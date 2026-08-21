import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://docs.trajectdata.com/asindataapi
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const Id = z.string();

export const ASINDATAAPI_SCHEDULE_TYPE = [
	'monthly',
	'weekly',
	'daily',
	'minutes',
	'manual',
] as const;

export const ASINDATAAPI_PRIORITY = [
	'highest',
	'high',
	'normal',
	'low',
	'lowest',
] as const;

export const ASINDATAAPI_COLLECTION_STATUS = [
	'idle',
	'queued',
	'running',
] as const;

export const ASINDATAAPI_DESTINATION_TYPE = [
	's3',
	'gcs',
	'azure',
	'oss',
	's3compatible',
] as const;

export const ASINDATAAPI_REQUEST_TYPE = [
	'product',
	'offers',
	'category',
	'search',
	'reviews',
	'seller_profile',
	'autocomplete',
] as const;

export const AsinDataApiCollection = z
	.object({
		id: Id,
		created_at: S,
		last_run: S,
		name: S,
		schedule_type: z.enum(ASINDATAAPI_SCHEDULE_TYPE).nullable().optional(),
		priority: z.enum(ASINDATAAPI_PRIORITY).nullable().optional(),
		destination_ids: z.array(z.string()).nullable().optional(),
		enabled: B,
		status: z.enum(ASINDATAAPI_COLLECTION_STATUS).nullable().optional(),
		request_total_count: N,
		request_page_count: N,
		requests_total_count: N,
		requests_page_count: N,
		credits_required: N,
		next_result_set_id: N,
		results_count: N,
		schedule_hours: z.array(z.number()).nullable().optional(),
		schedule_days_of_week: z.array(z.number()).nullable().optional(),
		schedule_days_of_month: z.array(z.number()).nullable().optional(),
		schedule_minutes: S,
		notification_email: S,
		notification_webhook: S,
		notification_as_json: B,
		notification_as_jsonlines: B,
		notification_as_csv: B,
		notification_csv_fields: S,
		request_type: S,
		request_type_locked: B,
		requests_type: S,
	})
	.loose();
export type AsinDataApiCollection = z.infer<typeof AsinDataApiCollection>;

export const AsinDataApiDestination = z
	.object({
		id: Id,
		name: S,
		type: z.enum(ASINDATAAPI_DESTINATION_TYPE).nullable().optional(),
		enabled: B,
		used_by: N,
		s3_bucket_name: S,
		s3_path_prefix: S,
		s3_endpoint: S,
		s3_region: S,
		gcs_bucket_name: S,
		gcs_path_prefix: S,
		azure_account_name: S,
		azure_container_name: S,
		azure_path_prefix: S,
		oss_bucket_name: S,
		oss_region_id: S,
		oss_path_prefix: S,
	})
	.loose();
export type AsinDataApiDestination = z.infer<typeof AsinDataApiDestination>;

export const AsinDataApiCollectionRequest = z
	.object({
		id: Id,
		custom_id: S,
		type: z.enum(ASINDATAAPI_REQUEST_TYPE).nullable().optional(),
		amazon_domain: S,
		asin: S,
		url: S,
		gtin: S,
		search_term: S,
		category_id: S,
		refinements: S,
		sort_by: S,
		exclude_sponsored: B,
		direct_search: B,
		page: N,
		max_page: N,
		include_html: B,
		skip_gtin_cache: B,
		show_different_asins: B,
	})
	.loose();
export type AsinDataApiCollectionRequest = z.infer<
	typeof AsinDataApiCollectionRequest
>;

const DownloadLinks = z
	.object({
		pages: z.array(z.string()).nullable().optional(),
		all_pages: S,
	})
	.loose();

export const AsinDataApiResultSet = z
	.object({
		id: z.number(),
		collection_id: S,
		started_at: S,
		ended_at: S,
		expires_at: S,
		results_page_count: N,
		requests_completed: N,
		requests_failed: N,
		requests_total: N,
		download_links: z
			.object({
				json: DownloadLinks.nullable().optional(),
				jsonlines: DownloadLinks.nullable().optional(),
				csv: DownloadLinks.nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		webhook_status: z.record(z.string(), z.unknown()).nullable().optional(),
		destination_status: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type AsinDataApiResultSet = z.infer<typeof AsinDataApiResultSet>;
