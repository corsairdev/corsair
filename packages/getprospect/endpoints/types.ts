import { z } from 'zod';
import * as OpenApiSchemas from '../schema/api';

export const GetProspectOperationInputSchemas = {
	people_get: z
		.object({
			path: z
				.object({ id: z.string().regex(new RegExp('^[a-fA-F0-9]{24}$')) })
				.strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	people_edits_update: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleEditsUpdateRequest,
		})
		.strict(),
	people_bulk_enrich: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleBulkEnrichRequest,
		})
		.strict(),
	people_calculate_credits: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleCreditsPreviewRequest,
		})
		.strict(),
	people_count: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleCountRequest,
		})
		.strict(),
	people_enrich: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleEnrichRequest,
		})
		.strict(),
	people_enrich_search: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleEnrichSearchRequest,
		})
		.strict(),
	people_save: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleSaveRequest,
		})
		.strict(),
	people_save_search: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleSaveSearchRequest,
		})
		.strict(),
	people_search: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleSearchRequest,
		})
		.strict(),
	companies_get: z
		.object({
			path: z
				.object({ id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')) })
				.strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	companies_edits_update: z
		.object({
			path: z
				.object({ id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')) })
				.strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesEditsUpdateRequest,
		})
		.strict(),
	companies_bulk_enrich: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesBulkEnrichRequest,
		})
		.strict(),
	companies_enrich: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesEnrichRequest,
		})
		.strict(),
	companies_save: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesSaveRequest,
		})
		.strict(),
	companies_search: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesSearchRequest,
		})
		.strict(),
	email_find_get: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					full_name: z.string().optional(),
					first_name: z.string().optional(),
					last_name: z.string().optional(),
					domain: z.string().optional(),
					company: z.string().optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
					query: z.string().max(256).optional(),
					owner: z.string().max(64).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_create: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaEmailVerificationCreateRequest,
		})
		.strict(),
	email_verifications_get: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_cancel: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_results: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(500).optional(),
					status: z
						.enum(['valid', 'invalid', 'accept_all', 'unknown'])
						.optional(),
					q: z.string().max(320).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_start: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_history_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_verifications_inspect: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaEmailFileInspectRequest,
		})
		.strict(),
	email_verify_get: z
		.object({
			path: z.undefined().optional(),
			query: z.object({ email: z.string() }).strict(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	email_find: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaEmailFindRequest,
		})
		.strict(),
	email_verify: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaEmailVerifyRequest,
		})
		.strict(),
	search_matching_titles: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaSearchMatchingTitlesRequest,
		})
		.strict(),
	search_smart_job_titles: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaSmartJobTitlesRequest,
		})
		.strict(),
	search_suggest: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaSearchSuggestRequest,
		})
		.strict(),
	enums_list: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	enums_get: z
		.object({
			path: z.object({ name: OpenApiSchemas.SchemaEnumName }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	api_logs_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					per_page: z.number().int().min(1).max(500).optional(),
					before: z.string().optional(),
					key_id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	rate_limits_get: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	companies_lists_remove: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaCompaniesListsRemoveRequest,
		})
		.strict(),
	companies_lists_set: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaCompaniesListsSetRequest,
		})
		.strict(),
	lists_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					type: OpenApiSchemas.SchemaListType.optional(),
					owner: z.string().max(64).optional(),
					query: z.string().max(100).optional(),
					sort_by: OpenApiSchemas.SchemaListSortBy.optional(),
					sort_direction: OpenApiSchemas.SchemaSortDirection.optional(),
					include_saved_views: z.enum(['true', 'false']).optional(),
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	lists_create: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaListsCreateRequest,
		})
		.strict(),
	lists_get: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	lists_delete: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({ with_records: z.enum(['true', 'false']).optional() })
				.strict()
				.optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	lists_update: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaListsUpdateRequest,
		})
		.strict(),
	people_lists_add: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleListsAddRequest,
		})
		.strict(),
	people_lists_remove: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaPeopleListsRemoveRequest,
		})
		.strict(),
	people_lists_set: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaPeopleListsSetRequest,
		})
		.strict(),
	companies_export: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaCompaniesExportRequest,
		})
		.strict(),
	exports_get: z
		.object({
			path: z
				.object({ id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')) })
				.strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	people_export: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaPeopleExportRequest,
		})
		.strict(),
	jobs_get: z
		.object({
			path: z
				.object({ id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')) })
				.strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	companies_enrichments_create: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaCompaniesEnrichmentCreateRequest,
		})
		.strict(),
	enrichments_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
					status: z
						.enum([
							'queued',
							'sampling',
							'matching',
							'awaiting_confirmation',
							'enriching',
							'finding',
							'assembling',
							'completed',
							'failed',
							'cancelled',
						])
						.optional(),
					source: z.enum(['api', 'file']).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	enrichments_get: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	enrichments_cancel: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	enrichments_results: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(500).optional(),
					status: z
						.enum([
							'matched',
							'not_matched',
							'invalid',
							'failed',
							'not_processed',
						])
						.optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	people_enrichments_create: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaPeopleEnrichmentCreateRequest,
		})
		.strict(),
	trash_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					kind: OpenApiSchemas.SchemaTrashKind,
					search: z.string().max(200).optional(),
					since: z.string().optional(),
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
				})
				.strict(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	trash_companies_add: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaTrashCompaniesRequest,
		})
		.strict(),
	trash_people_add: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaTrashPeopleRequest,
		})
		.strict(),
	trash_restore: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z
				.object({ idempotencyKey: z.string().min(1).optional() })
				.strict()
				.optional(),
			body: OpenApiSchemas.SchemaRestoreTrashRequest,
		})
		.strict(),
	me_get: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	billing_subscription_get: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	credits_get: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	usage_summary_get: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					from: z.iso.date().regex(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')),
					to: z.iso.date().regex(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')),
					users: z
						.string()
						.max(5000)
						.regex(new RegExp('^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$'))
						.optional(),
					channel: OpenApiSchemas.SchemaUsageChannel.optional(),
					action: OpenApiSchemas.SchemaUsageAction.optional(),
					entity: OpenApiSchemas.SchemaUsageEntity.optional(),
					group_by: OpenApiSchemas.SchemaUsageGroupBy,
				})
				.strict(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	blocklist_companies_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					query: z.string().min(2).max(100).optional(),
					page: z.number().min(1).optional(),
					per_page: z.number().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	blocklist_companies_delete: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	blocklist_companies_add: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaBlocklistCompaniesAddRequest,
		})
		.strict(),
	blocklist_people_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					query: z.string().min(2).max(100).optional(),
					page: z.number().min(1).optional(),
					per_page: z.number().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	blocklist_people_delete: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	blocklist_people_add: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaBlocklistPeopleAddRequest,
		})
		.strict(),
	notifications_list: z
		.object({
			path: z.undefined().optional(),
			query: z
				.object({
					page: z.number().int().min(1).optional(),
					per_page: z.number().int().min(1).max(100).optional(),
					read: z.enum(['true', 'false']).optional(),
				})
				.strict()
				.optional(),
			headers: z.undefined().optional(),
			body: z.undefined().optional(),
		})
		.strict(),
	notifications_mark_read: z
		.object({
			path: z.undefined().optional(),
			query: z.undefined().optional(),
			headers: z.undefined().optional(),
			body: OpenApiSchemas.SchemaNotificationsMarkReadRequest,
		})
		.strict(),
} as const;

export const GetProspectOperationOutputSchemas = {
	people_get: OpenApiSchemas.SchemaPeopleGetResponse,
	people_edits_update: OpenApiSchemas.SchemaPeopleEditsUpdateResponse,
	people_bulk_enrich: OpenApiSchemas.SchemaPeopleBulkEnrichResponse,
	people_calculate_credits: OpenApiSchemas.SchemaPeopleCreditsPreviewResponse,
	people_count: OpenApiSchemas.SchemaPeopleCountResponse,
	people_enrich: OpenApiSchemas.SchemaPeopleEnrichResponse,
	people_enrich_search: OpenApiSchemas.SchemaPeopleEnrichSearchResponse,
	people_save: OpenApiSchemas.SchemaPeopleSaveResponse,
	people_save_search: OpenApiSchemas.SchemaPeopleSaveSearchResponse,
	people_search: OpenApiSchemas.SchemaPeopleSearchResponse,
	companies_get: OpenApiSchemas.SchemaCompaniesGetResponse,
	companies_edits_update: OpenApiSchemas.SchemaCompaniesEditsUpdateResponse,
	companies_bulk_enrich: OpenApiSchemas.SchemaCompaniesBulkEnrichResponse,
	companies_enrich: OpenApiSchemas.SchemaCompaniesEnrichResponse,
	companies_save: OpenApiSchemas.SchemaCompaniesSaveResponse,
	companies_search: OpenApiSchemas.SchemaCompaniesSearchResponse,
	email_find_get: OpenApiSchemas.SchemaEmailFindResponse,
	email_verifications_list: OpenApiSchemas.SchemaEmailVerificationListResponse,
	email_verifications_create: OpenApiSchemas.SchemaEmailVerificationResponse,
	email_verifications_get: OpenApiSchemas.SchemaEmailVerificationResponse,
	email_verifications_cancel: OpenApiSchemas.SchemaEmailVerificationResponse,
	email_verifications_results:
		OpenApiSchemas.SchemaEmailVerificationResultsResponse,
	email_verifications_start: OpenApiSchemas.SchemaEmailVerificationResponse,
	email_verifications_history_list:
		OpenApiSchemas.SchemaEmailVerificationHistoryListResponse,
	email_verifications_inspect: OpenApiSchemas.SchemaEmailFileInspectionResponse,
	email_verify_get: OpenApiSchemas.SchemaEmailVerifyResponse,
	email_find: OpenApiSchemas.SchemaEmailFindResponse,
	email_verify: OpenApiSchemas.SchemaEmailVerifyResponse,
	search_matching_titles: OpenApiSchemas.SchemaSearchMatchingTitlesResponse,
	search_smart_job_titles: OpenApiSchemas.SchemaSearchSmartJobTitlesResponse,
	search_suggest: OpenApiSchemas.SchemaSearchSuggestResponse,
	enums_list: OpenApiSchemas.SchemaEnumsListResponse,
	enums_get: OpenApiSchemas.SchemaEnumsGetResponse,
	api_logs_list: OpenApiSchemas.SchemaApiLogsListResponse,
	rate_limits_get: OpenApiSchemas.SchemaRateLimitsGetResponse,
	companies_lists_remove: OpenApiSchemas.SchemaCompaniesListsRemoveResponse,
	companies_lists_set: OpenApiSchemas.SchemaCompaniesListsSetResponse,
	lists_list: OpenApiSchemas.SchemaListsListResponse,
	lists_create: OpenApiSchemas.SchemaListsCreateResponse,
	lists_get: OpenApiSchemas.SchemaListsGetResponse,
	lists_delete: OpenApiSchemas.SchemaListsDeleteResponse,
	lists_update: OpenApiSchemas.SchemaListsUpdateResponse,
	people_lists_add: OpenApiSchemas.SchemaPeopleListsAddResponse,
	people_lists_remove: OpenApiSchemas.SchemaPeopleListsRemoveResponse,
	people_lists_set: OpenApiSchemas.SchemaPeopleListsSetResponse,
	companies_export: OpenApiSchemas.SchemaExportStartResponse,
	exports_get: OpenApiSchemas.SchemaExportResponse,
	people_export: OpenApiSchemas.SchemaExportStartResponse,
	jobs_get: OpenApiSchemas.SchemaJobResponse,
	companies_enrichments_create: OpenApiSchemas.SchemaEnrichmentResponse,
	enrichments_list: OpenApiSchemas.SchemaEnrichmentListResponse,
	enrichments_get: OpenApiSchemas.SchemaEnrichmentResponse,
	enrichments_cancel: OpenApiSchemas.SchemaEnrichmentResponse,
	enrichments_results: OpenApiSchemas.SchemaEnrichmentResultsResponse,
	people_enrichments_create: OpenApiSchemas.SchemaEnrichmentResponse,
	trash_list: OpenApiSchemas.SchemaTrashListResponse,
	trash_companies_add: OpenApiSchemas.SchemaTrashCompaniesAddResponse,
	trash_people_add: OpenApiSchemas.SchemaTrashPeopleAddResponse,
	trash_restore: OpenApiSchemas.SchemaTrashRestoreResponse,
	me_get: OpenApiSchemas.SchemaMeGetResponse,
	billing_subscription_get: OpenApiSchemas.SchemaBillingSubscriptionGetResponse,
	credits_get: OpenApiSchemas.SchemaCreditsGetResponse,
	usage_summary_get: OpenApiSchemas.SchemaUsageSummaryGetResponse,
	blocklist_companies_list: OpenApiSchemas.SchemaBlocklistCompaniesListResponse,
	blocklist_companies_delete:
		OpenApiSchemas.SchemaBlocklistCompaniesDeleteResponse,
	blocklist_companies_add: OpenApiSchemas.SchemaBlocklistCompaniesAddResponse,
	blocklist_people_list: OpenApiSchemas.SchemaBlocklistPeopleListResponse,
	blocklist_people_delete: OpenApiSchemas.SchemaBlocklistPeopleDeleteResponse,
	blocklist_people_add: OpenApiSchemas.SchemaBlocklistPeopleAddResponse,
	notifications_list: OpenApiSchemas.SchemaNotificationsListResponse,
	notifications_mark_read: OpenApiSchemas.SchemaNotificationsMarkReadResponse,
} as const;

export type GetProspectOperationId =
	keyof typeof GetProspectOperationInputSchemas;
export type GetProspectEndpointInputs = {
	[K in GetProspectOperationId]: z.input<
		(typeof GetProspectOperationInputSchemas)[K]
	>;
};
export type GetProspectEndpointOutputs = {
	[K in GetProspectOperationId]: z.output<
		(typeof GetProspectOperationOutputSchemas)[K]
	>;
};

export const GetProspectEndpointInputSchemas = {
	people: {
		get: GetProspectOperationInputSchemas['people_get'],
		editsUpdate: GetProspectOperationInputSchemas['people_edits_update'],
		bulkEnrich: GetProspectOperationInputSchemas['people_bulk_enrich'],
		calculateCredits:
			GetProspectOperationInputSchemas['people_calculate_credits'],
		count: GetProspectOperationInputSchemas['people_count'],
		enrich: GetProspectOperationInputSchemas['people_enrich'],
		enrichSearch: GetProspectOperationInputSchemas['people_enrich_search'],
		save: GetProspectOperationInputSchemas['people_save'],
		saveSearch: GetProspectOperationInputSchemas['people_save_search'],
		search: GetProspectOperationInputSchemas['people_search'],
	},
	companies: {
		get: GetProspectOperationInputSchemas['companies_get'],
		editsUpdate: GetProspectOperationInputSchemas['companies_edits_update'],
		bulkEnrich: GetProspectOperationInputSchemas['companies_bulk_enrich'],
		enrich: GetProspectOperationInputSchemas['companies_enrich'],
		save: GetProspectOperationInputSchemas['companies_save'],
		search: GetProspectOperationInputSchemas['companies_search'],
	},
	email: {
		findGet: GetProspectOperationInputSchemas['email_find_get'],
		verificationsList:
			GetProspectOperationInputSchemas['email_verifications_list'],
		verificationsCreate:
			GetProspectOperationInputSchemas['email_verifications_create'],
		verificationsGet:
			GetProspectOperationInputSchemas['email_verifications_get'],
		verificationsCancel:
			GetProspectOperationInputSchemas['email_verifications_cancel'],
		verificationsResults:
			GetProspectOperationInputSchemas['email_verifications_results'],
		verificationsStart:
			GetProspectOperationInputSchemas['email_verifications_start'],
		verificationsHistoryList:
			GetProspectOperationInputSchemas['email_verifications_history_list'],
		verificationsInspect:
			GetProspectOperationInputSchemas['email_verifications_inspect'],
		verifyGet: GetProspectOperationInputSchemas['email_verify_get'],
		find: GetProspectOperationInputSchemas['email_find'],
		verify: GetProspectOperationInputSchemas['email_verify'],
	},
	search: {
		matchingTitles: GetProspectOperationInputSchemas['search_matching_titles'],
		smartJobTitles: GetProspectOperationInputSchemas['search_smart_job_titles'],
		suggest: GetProspectOperationInputSchemas['search_suggest'],
	},
	enums: {
		list: GetProspectOperationInputSchemas['enums_list'],
		get: GetProspectOperationInputSchemas['enums_get'],
	},
	developer: {
		apiLogsList: GetProspectOperationInputSchemas['api_logs_list'],
		rateLimitsGet: GetProspectOperationInputSchemas['rate_limits_get'],
	},
	lists: {
		companiesListsRemove:
			GetProspectOperationInputSchemas['companies_lists_remove'],
		companiesListsSet: GetProspectOperationInputSchemas['companies_lists_set'],
		list: GetProspectOperationInputSchemas['lists_list'],
		create: GetProspectOperationInputSchemas['lists_create'],
		get: GetProspectOperationInputSchemas['lists_get'],
		delete: GetProspectOperationInputSchemas['lists_delete'],
		update: GetProspectOperationInputSchemas['lists_update'],
		peopleListsAdd: GetProspectOperationInputSchemas['people_lists_add'],
		peopleListsRemove: GetProspectOperationInputSchemas['people_lists_remove'],
		peopleListsSet: GetProspectOperationInputSchemas['people_lists_set'],
	},
	exports: {
		companiesExport: GetProspectOperationInputSchemas['companies_export'],
		get: GetProspectOperationInputSchemas['exports_get'],
		peopleExport: GetProspectOperationInputSchemas['people_export'],
	},
	jobs: {
		get: GetProspectOperationInputSchemas['jobs_get'],
	},
	enrichments: {
		companiesEnrichmentsCreate:
			GetProspectOperationInputSchemas['companies_enrichments_create'],
		list: GetProspectOperationInputSchemas['enrichments_list'],
		get: GetProspectOperationInputSchemas['enrichments_get'],
		cancel: GetProspectOperationInputSchemas['enrichments_cancel'],
		results: GetProspectOperationInputSchemas['enrichments_results'],
		peopleEnrichmentsCreate:
			GetProspectOperationInputSchemas['people_enrichments_create'],
	},
	trash: {
		list: GetProspectOperationInputSchemas['trash_list'],
		companiesAdd: GetProspectOperationInputSchemas['trash_companies_add'],
		peopleAdd: GetProspectOperationInputSchemas['trash_people_add'],
		restore: GetProspectOperationInputSchemas['trash_restore'],
	},
	account: {
		meGet: GetProspectOperationInputSchemas['me_get'],
	},
	billing: {
		subscriptionGet:
			GetProspectOperationInputSchemas['billing_subscription_get'],
		creditsGet: GetProspectOperationInputSchemas['credits_get'],
		usageSummaryGet: GetProspectOperationInputSchemas['usage_summary_get'],
	},
	blocklist: {
		companiesList: GetProspectOperationInputSchemas['blocklist_companies_list'],
		companiesDelete:
			GetProspectOperationInputSchemas['blocklist_companies_delete'],
		companiesAdd: GetProspectOperationInputSchemas['blocklist_companies_add'],
		peopleList: GetProspectOperationInputSchemas['blocklist_people_list'],
		peopleDelete: GetProspectOperationInputSchemas['blocklist_people_delete'],
		peopleAdd: GetProspectOperationInputSchemas['blocklist_people_add'],
	},
	notifications: {
		list: GetProspectOperationInputSchemas['notifications_list'],
		markRead: GetProspectOperationInputSchemas['notifications_mark_read'],
	},
} as const;

export const GetProspectEndpointOutputSchemas = {
	people: {
		get: GetProspectOperationOutputSchemas['people_get'],
		editsUpdate: GetProspectOperationOutputSchemas['people_edits_update'],
		bulkEnrich: GetProspectOperationOutputSchemas['people_bulk_enrich'],
		calculateCredits:
			GetProspectOperationOutputSchemas['people_calculate_credits'],
		count: GetProspectOperationOutputSchemas['people_count'],
		enrich: GetProspectOperationOutputSchemas['people_enrich'],
		enrichSearch: GetProspectOperationOutputSchemas['people_enrich_search'],
		save: GetProspectOperationOutputSchemas['people_save'],
		saveSearch: GetProspectOperationOutputSchemas['people_save_search'],
		search: GetProspectOperationOutputSchemas['people_search'],
	},
	companies: {
		get: GetProspectOperationOutputSchemas['companies_get'],
		editsUpdate: GetProspectOperationOutputSchemas['companies_edits_update'],
		bulkEnrich: GetProspectOperationOutputSchemas['companies_bulk_enrich'],
		enrich: GetProspectOperationOutputSchemas['companies_enrich'],
		save: GetProspectOperationOutputSchemas['companies_save'],
		search: GetProspectOperationOutputSchemas['companies_search'],
	},
	email: {
		findGet: GetProspectOperationOutputSchemas['email_find_get'],
		verificationsList:
			GetProspectOperationOutputSchemas['email_verifications_list'],
		verificationsCreate:
			GetProspectOperationOutputSchemas['email_verifications_create'],
		verificationsGet:
			GetProspectOperationOutputSchemas['email_verifications_get'],
		verificationsCancel:
			GetProspectOperationOutputSchemas['email_verifications_cancel'],
		verificationsResults:
			GetProspectOperationOutputSchemas['email_verifications_results'],
		verificationsStart:
			GetProspectOperationOutputSchemas['email_verifications_start'],
		verificationsHistoryList:
			GetProspectOperationOutputSchemas['email_verifications_history_list'],
		verificationsInspect:
			GetProspectOperationOutputSchemas['email_verifications_inspect'],
		verifyGet: GetProspectOperationOutputSchemas['email_verify_get'],
		find: GetProspectOperationOutputSchemas['email_find'],
		verify: GetProspectOperationOutputSchemas['email_verify'],
	},
	search: {
		matchingTitles: GetProspectOperationOutputSchemas['search_matching_titles'],
		smartJobTitles:
			GetProspectOperationOutputSchemas['search_smart_job_titles'],
		suggest: GetProspectOperationOutputSchemas['search_suggest'],
	},
	enums: {
		list: GetProspectOperationOutputSchemas['enums_list'],
		get: GetProspectOperationOutputSchemas['enums_get'],
	},
	developer: {
		apiLogsList: GetProspectOperationOutputSchemas['api_logs_list'],
		rateLimitsGet: GetProspectOperationOutputSchemas['rate_limits_get'],
	},
	lists: {
		companiesListsRemove:
			GetProspectOperationOutputSchemas['companies_lists_remove'],
		companiesListsSet: GetProspectOperationOutputSchemas['companies_lists_set'],
		list: GetProspectOperationOutputSchemas['lists_list'],
		create: GetProspectOperationOutputSchemas['lists_create'],
		get: GetProspectOperationOutputSchemas['lists_get'],
		delete: GetProspectOperationOutputSchemas['lists_delete'],
		update: GetProspectOperationOutputSchemas['lists_update'],
		peopleListsAdd: GetProspectOperationOutputSchemas['people_lists_add'],
		peopleListsRemove: GetProspectOperationOutputSchemas['people_lists_remove'],
		peopleListsSet: GetProspectOperationOutputSchemas['people_lists_set'],
	},
	exports: {
		companiesExport: GetProspectOperationOutputSchemas['companies_export'],
		get: GetProspectOperationOutputSchemas['exports_get'],
		peopleExport: GetProspectOperationOutputSchemas['people_export'],
	},
	jobs: {
		get: GetProspectOperationOutputSchemas['jobs_get'],
	},
	enrichments: {
		companiesEnrichmentsCreate:
			GetProspectOperationOutputSchemas['companies_enrichments_create'],
		list: GetProspectOperationOutputSchemas['enrichments_list'],
		get: GetProspectOperationOutputSchemas['enrichments_get'],
		cancel: GetProspectOperationOutputSchemas['enrichments_cancel'],
		results: GetProspectOperationOutputSchemas['enrichments_results'],
		peopleEnrichmentsCreate:
			GetProspectOperationOutputSchemas['people_enrichments_create'],
	},
	trash: {
		list: GetProspectOperationOutputSchemas['trash_list'],
		companiesAdd: GetProspectOperationOutputSchemas['trash_companies_add'],
		peopleAdd: GetProspectOperationOutputSchemas['trash_people_add'],
		restore: GetProspectOperationOutputSchemas['trash_restore'],
	},
	account: {
		meGet: GetProspectOperationOutputSchemas['me_get'],
	},
	billing: {
		subscriptionGet:
			GetProspectOperationOutputSchemas['billing_subscription_get'],
		creditsGet: GetProspectOperationOutputSchemas['credits_get'],
		usageSummaryGet: GetProspectOperationOutputSchemas['usage_summary_get'],
	},
	blocklist: {
		companiesList:
			GetProspectOperationOutputSchemas['blocklist_companies_list'],
		companiesDelete:
			GetProspectOperationOutputSchemas['blocklist_companies_delete'],
		companiesAdd: GetProspectOperationOutputSchemas['blocklist_companies_add'],
		peopleList: GetProspectOperationOutputSchemas['blocklist_people_list'],
		peopleDelete: GetProspectOperationOutputSchemas['blocklist_people_delete'],
		peopleAdd: GetProspectOperationOutputSchemas['blocklist_people_add'],
	},
	notifications: {
		list: GetProspectOperationOutputSchemas['notifications_list'],
		markRead: GetProspectOperationOutputSchemas['notifications_mark_read'],
	},
} as const;

export const getProspectOperationDefinitions = {
	people_get: {
		group: 'people',
		leaf: 'get',
		method: 'GET',
		path: '/v2/people/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get a Person. Credit cost: none.',
	},
	people_edits_update: {
		group: 'people',
		leaf: 'editsUpdate',
		method: 'PATCH',
		path: '/v2/people/{id}/edits',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Edit a Saved Person. Credit cost: none.',
	},
	people_bulk_enrich: {
		group: 'people',
		leaf: 'bulkEnrich',
		method: 'POST',
		path: '/v2/people/bulk-enrich',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'People Bulk Enrich. Credit cost: newly revealed email; phone number found (enrich_email (on by default) / enrich_phone, per item).',
	},
	people_calculate_credits: {
		group: 'people',
		leaf: 'calculateCredits',
		method: 'POST',
		path: '/v2/people/calculate-credits',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Preview Save Credits. Credit cost: none.',
	},
	people_count: {
		group: 'people',
		leaf: 'count',
		method: 'POST',
		path: '/v2/people/count',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'People Count. Credit cost: none.',
	},
	people_enrich: {
		group: 'people',
		leaf: 'enrich',
		method: 'POST',
		path: '/v2/people/enrich',
		pathParams: [],
		timeout: 95000,
		riskLevel: 'destructive',
		description:
			'People Enrich. Credit cost: newly revealed email; phone number found (enrich_email (on by default) / enrich_phone).',
	},
	people_enrich_search: {
		group: 'people',
		leaf: 'enrichSearch',
		method: 'POST',
		path: '/v2/people/enrich-search',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Enrich Mobiles for a Search. Credit cost: phone number found (always, until the balance runs out).',
	},
	people_save: {
		group: 'people',
		leaf: 'save',
		method: 'POST',
		path: '/v2/people/save',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Save People. Credit cost: person whose valid email is handed over and was not already owned (always; a re-save of a person already paid for is free. A person answered `searching` costs nothing until the refreshed search finds an email and the balance allows it).',
	},
	people_save_search: {
		group: 'people',
		leaf: 'saveSearch',
		method: 'POST',
		path: '/v2/people/save-search',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Save a Whole Search. Credit cost: person whose stored valid email is handed over and was not already owned (always, in search order, until the balance runs out).',
	},
	people_search: {
		group: 'people',
		leaf: 'search',
		method: 'POST',
		path: '/v2/people/search',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'People Search. Credit cost: newly revealed email; phone number found (only with enrich_email / enrich_phone).',
	},
	companies_get: {
		group: 'companies',
		leaf: 'get',
		method: 'GET',
		path: '/v2/companies/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Companies Get. Credit cost: none.',
	},
	companies_edits_update: {
		group: 'companies',
		leaf: 'editsUpdate',
		method: 'PATCH',
		path: '/v2/companies/{id}/edits',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Edit Saved Company. Credit cost: none.',
	},
	companies_bulk_enrich: {
		group: 'companies',
		leaf: 'bulkEnrich',
		method: 'POST',
		path: '/v2/companies/bulk-enrich',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Companies Bulk Enrich. Credit cost: none.',
	},
	companies_enrich: {
		group: 'companies',
		leaf: 'enrich',
		method: 'POST',
		path: '/v2/companies/enrich',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Companies Enrich. Credit cost: none.',
	},
	companies_save: {
		group: 'companies',
		leaf: 'save',
		method: 'POST',
		path: '/v2/companies/save',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Companies Save. Credit cost: none.',
	},
	companies_search: {
		group: 'companies',
		leaf: 'search',
		method: 'POST',
		path: '/v2/companies/search',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Companies Search. Credit cost: none.',
	},
	email_find_get: {
		group: 'email',
		leaf: 'findGet',
		method: 'GET',
		path: '/v2/email-finder',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Find Email (GET). Credit cost: served_address (a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free)).',
	},
	email_verifications_list: {
		group: 'email',
		leaf: 'verificationsList',
		method: 'GET',
		path: '/v2/email-verifications',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Email Verifications. Credit cost: none.',
	},
	email_verifications_create: {
		group: 'email',
		leaf: 'verificationsCreate',
		method: 'POST',
		path: '/v2/email-verifications',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Create Email Verification. Credit cost: billable_row (when a `data.emails` job starts on its own after counting, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends (a `file_key` job charges at `email_verifications_start`)).',
	},
	email_verifications_get: {
		group: 'email',
		leaf: 'verificationsGet',
		method: 'GET',
		path: '/v2/email-verifications/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Email Verification. Credit cost: none.',
	},
	email_verifications_cancel: {
		group: 'email',
		leaf: 'verificationsCancel',
		method: 'POST',
		path: '/v2/email-verifications/{id}/cancel',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Cancel Email Verification. Credit cost: none.',
	},
	email_verifications_results: {
		group: 'email',
		leaf: 'verificationsResults',
		method: 'GET',
		path: '/v2/email-verifications/{id}/results',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Email Verification Results. Credit cost: none.',
	},
	email_verifications_start: {
		group: 'email',
		leaf: 'verificationsStart',
		method: 'POST',
		path: '/v2/email-verifications/{id}/start',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Start Email Verification. Credit cost: billable_row (at start, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends).',
	},
	email_verifications_history_list: {
		group: 'email',
		leaf: 'verificationsHistoryList',
		method: 'GET',
		path: '/v2/email-verifications/history',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Verification History. Credit cost: none.',
	},
	email_verifications_inspect: {
		group: 'email',
		leaf: 'verificationsInspect',
		method: 'POST',
		path: '/v2/email-verifications/inspect',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Inspect Email File. Credit cost: none.',
	},
	email_verify_get: {
		group: 'email',
		leaf: 'verifyGet',
		method: 'GET',
		path: '/v2/email-verifier',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Verify Email (GET). Credit cost: address (a valid, invalid or accept_all verdict, once per address per workspace).',
	},
	email_find: {
		group: 'email',
		leaf: 'find',
		method: 'POST',
		path: '/v2/email/find',
		pathParams: [],
		timeout: 95000,
		riskLevel: 'destructive',
		description:
			'Find Email. Credit cost: served_address (a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free)).',
	},
	email_verify: {
		group: 'email',
		leaf: 'verify',
		method: 'POST',
		path: '/v2/email/verify',
		pathParams: [],
		timeout: 80000,
		riskLevel: 'destructive',
		description:
			'Verify Email. Credit cost: address (a valid, invalid or accept_all verdict, once per address per workspace).',
	},
	search_matching_titles: {
		group: 'search',
		leaf: 'matchingTitles',
		method: 'POST',
		path: '/v2/search/matching-titles',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Matching Job Titles. Credit cost: none.',
	},
	search_smart_job_titles: {
		group: 'search',
		leaf: 'smartJobTitles',
		method: 'POST',
		path: '/v2/search/smart-job-titles',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Smart Job Titles. Credit cost: none.',
	},
	search_suggest: {
		group: 'search',
		leaf: 'suggest',
		method: 'POST',
		path: '/v2/search/suggest',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Search Suggestions. Credit cost: none.',
	},
	enums_list: {
		group: 'enums',
		leaf: 'list',
		method: 'GET',
		path: '/v2/enums',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Filter Enums. Credit cost: none.',
	},
	enums_get: {
		group: 'enums',
		leaf: 'get',
		method: 'GET',
		path: '/v2/enums/{name}',
		pathParams: ['name'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Filter Enum. Credit cost: none.',
	},
	api_logs_list: {
		group: 'developer',
		leaf: 'apiLogsList',
		method: 'GET',
		path: '/v2/api-logs',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Request Logs. Credit cost: none.',
	},
	rate_limits_get: {
		group: 'developer',
		leaf: 'rateLimitsGet',
		method: 'GET',
		path: '/v2/rate-limits',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Rate Limits. Credit cost: none.',
	},
	companies_lists_remove: {
		group: 'lists',
		leaf: 'companiesListsRemove',
		method: 'POST',
		path: '/v2/companies/lists/remove',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Remove Companies from List. Credit cost: none.',
	},
	companies_lists_set: {
		group: 'lists',
		leaf: 'companiesListsSet',
		method: 'POST',
		path: '/v2/companies/lists/set',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Set Company Lists. Credit cost: none.',
	},
	lists_list: {
		group: 'lists',
		leaf: 'list',
		method: 'GET',
		path: '/v2/lists',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Lists. Credit cost: none.',
	},
	lists_create: {
		group: 'lists',
		leaf: 'create',
		method: 'POST',
		path: '/v2/lists',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Create List. Credit cost: none.',
	},
	lists_get: {
		group: 'lists',
		leaf: 'get',
		method: 'GET',
		path: '/v2/lists/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get List. Credit cost: none.',
	},
	lists_delete: {
		group: 'lists',
		leaf: 'delete',
		method: 'DELETE',
		path: '/v2/lists/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Delete List. Credit cost: none.',
	},
	lists_update: {
		group: 'lists',
		leaf: 'update',
		method: 'PATCH',
		path: '/v2/lists/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Rename List. Credit cost: none.',
	},
	people_lists_add: {
		group: 'lists',
		leaf: 'peopleListsAdd',
		method: 'POST',
		path: '/v2/people/lists/add',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Add People to List. Credit cost: none.',
	},
	people_lists_remove: {
		group: 'lists',
		leaf: 'peopleListsRemove',
		method: 'POST',
		path: '/v2/people/lists/remove',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Remove People from List. Credit cost: none.',
	},
	people_lists_set: {
		group: 'lists',
		leaf: 'peopleListsSet',
		method: 'POST',
		path: '/v2/people/lists/set',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Set People Lists. Credit cost: none.',
	},
	companies_export: {
		group: 'exports',
		leaf: 'companiesExport',
		method: 'POST',
		path: '/v2/companies/export',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Export Companies. Credit cost: none.',
	},
	exports_get: {
		group: 'exports',
		leaf: 'get',
		method: 'GET',
		path: '/v2/exports/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get an Export. Credit cost: none.',
	},
	people_export: {
		group: 'exports',
		leaf: 'peopleExport',
		method: 'POST',
		path: '/v2/people/export',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Export People. Credit cost: revealed profile not already owned (per chunk during the run, against the balance read at that chunk; emails past it are withheld).',
	},
	jobs_get: {
		group: 'jobs',
		leaf: 'get',
		method: 'GET',
		path: '/v2/jobs/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get a Job. Credit cost: none.',
	},
	companies_enrichments_create: {
		group: 'enrichments',
		leaf: 'companiesEnrichmentsCreate',
		method: 'POST',
		path: '/v2/companies/enrichments',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Create Companies Enrichment. Credit cost: none.',
	},
	enrichments_list: {
		group: 'enrichments',
		leaf: 'list',
		method: 'GET',
		path: '/v2/enrichments',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Enrichments. Credit cost: none.',
	},
	enrichments_get: {
		group: 'enrichments',
		leaf: 'get',
		method: 'GET',
		path: '/v2/enrichments/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Enrichment. Credit cost: none.',
	},
	enrichments_cancel: {
		group: 'enrichments',
		leaf: 'cancel',
		method: 'POST',
		path: '/v2/enrichments/{id}/cancel',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Cancel Enrichment. Credit cost: none.',
	},
	enrichments_results: {
		group: 'enrichments',
		leaf: 'results',
		method: 'GET',
		path: '/v2/enrichments/{id}/results',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Enrichment Results. Credit cost: none.',
	},
	people_enrichments_create: {
		group: 'enrichments',
		leaf: 'peopleEnrichmentsCreate',
		method: 'POST',
		path: '/v2/people/enrichments',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description:
			'Create People Enrichment. Credit cost: revealed profile not already owned / address found / mobile number found (during the job).',
	},
	trash_list: {
		group: 'trash',
		leaf: 'list',
		method: 'GET',
		path: '/v2/trash',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Trash. Credit cost: none.',
	},
	trash_companies_add: {
		group: 'trash',
		leaf: 'companiesAdd',
		method: 'POST',
		path: '/v2/trash/companies',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Delete Companies to Trash. Credit cost: none.',
	},
	trash_people_add: {
		group: 'trash',
		leaf: 'peopleAdd',
		method: 'POST',
		path: '/v2/trash/people',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Delete People to Trash. Credit cost: none.',
	},
	trash_restore: {
		group: 'trash',
		leaf: 'restore',
		method: 'POST',
		path: '/v2/trash/restore',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Restore from Trash. Credit cost: none.',
	},
	me_get: {
		group: 'account',
		leaf: 'meGet',
		method: 'GET',
		path: '/v2/me',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Current User. Credit cost: none.',
	},
	billing_subscription_get: {
		group: 'billing',
		leaf: 'subscriptionGet',
		method: 'GET',
		path: '/v2/billing/subscription',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Subscription. Credit cost: none.',
	},
	credits_get: {
		group: 'billing',
		leaf: 'creditsGet',
		method: 'GET',
		path: '/v2/credits',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Credit Balances. Credit cost: none.',
	},
	usage_summary_get: {
		group: 'billing',
		leaf: 'usageSummaryGet',
		method: 'GET',
		path: '/v2/usage/summary',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'Get Usage Summary. Credit cost: none.',
	},
	blocklist_companies_list: {
		group: 'blocklist',
		leaf: 'companiesList',
		method: 'GET',
		path: '/v2/blocklist/companies',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Blocked Companies. Credit cost: none.',
	},
	blocklist_companies_delete: {
		group: 'blocklist',
		leaf: 'companiesDelete',
		method: 'DELETE',
		path: '/v2/blocklist/companies/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Unblock Company. Credit cost: none.',
	},
	blocklist_companies_add: {
		group: 'blocklist',
		leaf: 'companiesAdd',
		method: 'POST',
		path: '/v2/blocklist/companies/add',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Block Companies. Credit cost: none.',
	},
	blocklist_people_list: {
		group: 'blocklist',
		leaf: 'peopleList',
		method: 'GET',
		path: '/v2/blocklist/people',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Blocked People. Credit cost: none.',
	},
	blocklist_people_delete: {
		group: 'blocklist',
		leaf: 'peopleDelete',
		method: 'DELETE',
		path: '/v2/blocklist/people/{id}',
		pathParams: ['id'],
		timeout: 20000,
		riskLevel: 'destructive',
		description: 'Unblock Person. Credit cost: none.',
	},
	blocklist_people_add: {
		group: 'blocklist',
		leaf: 'peopleAdd',
		method: 'POST',
		path: '/v2/blocklist/people/add',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Block People. Credit cost: none.',
	},
	notifications_list: {
		group: 'notifications',
		leaf: 'list',
		method: 'GET',
		path: '/v2/notifications',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'read',
		description: 'List Notifications. Credit cost: none.',
	},
	notifications_mark_read: {
		group: 'notifications',
		leaf: 'markRead',
		method: 'POST',
		path: '/v2/notifications/mark-read',
		pathParams: [],
		timeout: 20000,
		riskLevel: 'write',
		description: 'Mark Notifications Read. Credit cost: none.',
	},
} as const;

export type GetProspectOperationDefinition =
	(typeof getProspectOperationDefinitions)[GetProspectOperationId];

export { OpenApiSchemas };
