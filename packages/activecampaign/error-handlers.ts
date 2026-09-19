import type { CorsairErrorHandler } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Operations that change server state.
 *
 * Corsair replays the whole endpoint call when a handler asks for a retry, so
 * a network error raised after ActiveCampaign already committed a write would
 * duplicate it on the next attempt. ActiveCampaign has no idempotency-key
 * header, so a duplicate cannot be collapsed server-side and these operations
 * are never retried on a transport failure.
 *
 * Kept as an explicit set rather than a name pattern so that adding an
 * operation cannot silently opt it into retries; `endpoints.test.ts` asserts
 * this set equals the non-GET operations in the registry.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'contactsCreateOrUpdate',
	'contactsUpdate',
	'contactsDelete',
	'listsCreate',
	'listsDelete',
	'listsUpdateSubscription',
	'tagsCreate',
	'tagsUpdate',
	'tagsDelete',
	'tagsAddToContact',
	'tagsRemoveFromContact',
	'fieldsCreate',
	'fieldsUpdate',
	'fieldsDelete',
	'fieldOptionsCreateBulk',
	'fieldValuesSetForContact',
	'fieldValuesUpdate',
	'fieldValuesDelete',
	'fieldRelsCreate',
	'fieldRelsDelete',
	'groupMembersCreate',
	'groupMembersUpdate',
	'groupMembersDelete',
	'importsCreateBulk',
	'listGroupsCreate',
	'dealsUpdate',
	'dealsDelete',
	'dealsUpdateOwnersBulk',
	'dealGroupsCreate',
	'dealGroupsUpdate',
	'dealGroupsDelete',
	'dealStagesCreate',
	'dealStagesUpdate',
	'dealStagesDelete',
	'dealStagesMoveDeals',
	'dealStagesDeleteWithDeals',
	'dealTasksCreate',
	'dealTasksUpdate',
	'dealTasksDelete',
	'dealTaskTypesCreate',
	'dealTaskTypesUpdate',
	'taskOutcomesCreate',
	'dealRolesCreate',
	'dealRolesDelete',
	'contactDealsCreate',
	'contactDealsUpdate',
	'contactDealsDelete',
	'dealCustomFieldMetaCreate',
	'dealCustomFieldMetaUpdate',
	'dealCustomFieldMetaDelete',
	'dealCustomFieldDataUpdate',
	'dealCustomFieldDataDelete',
	'accountsCreate',
	'accountsUpdate',
	'accountsDelete',
	'accountsUpsert',
	'accountsDeleteBulk',
	'accountContactsCreate',
	'accountContactsUpdate',
	'accountContactsDelete',
	'accountCustomFieldMetaCreate',
	'accountCustomFieldMetaUpdate',
	'accountCustomFieldMetaDelete',
	'accountCustomFieldDataCreate',
	'accountCustomFieldDataUpdate',
	'accountCustomFieldDataDelete',
	'accountCustomFieldDataCreateBulk',
	'accountCustomFieldDataUpdateBulk',
	'notesCreate',
	'notesUpdate',
	'notesDelete',
	'notesAddToContact',
	'campaignsCreate',
	'campaignsUpdate',
	'campaignsDuplicate',
	'messagesCreate',
	'messagesUpdate',
	'messagesDelete',
	'savedResponsesCreate',
	'savedResponsesUpdate',
	'savedResponsesDelete',
	'formsDelete',
	'formsCreateOptin',
	'personalizationsCreate',
	'personalizationsUpdate',
	'personalizationsDelete',
	'personalizationsDeleteBulk',
	'personalizationsLock',
	'personalizationsUnlock',
	'templatesCreateShareLink',
	'contactAutomationsAdd',
	'contactAutomationsRemove',
	'segmentsCreate',
	'segmentsUpdate',
	'segmentsDelete',
	'connectionsCreate',
	'connectionsUpdate',
	'connectionsDelete',
	'ecomCustomersCreate',
	'ecomCustomersUpdate',
	'ecomCustomersDelete',
	'ecomOrdersCreate',
	'ecomOrdersUpdate',
	'ecomOrdersDelete',
	'customObjectSchemasCreate',
	'customObjectSchemasUpdate',
	'customObjectSchemasDelete',
	'customObjectRecordsUpsert',
	'customObjectRecordsDelete',
	'customObjectRecordsDeleteByExternalId',
	'webhooksCreate',
	'webhooksUpdate',
	'webhooksDelete',
	'usersCreate',
	'usersUpdate',
	'usersDelete',
	'groupsCreate',
	'groupsUpdate',
	'groupsDelete',
	'addressesCreate',
	'addressesUpdate',
	'addressesDelete',
	'calendarsCreate',
	'calendarsUpdate',
	'calendarsDelete',
	'eventTrackingEventsCreate',
	'eventTrackingEventsDelete',
	'trackingSetSiteStatus',
	'trackingSetEventStatus',
	'trackingTrackEvent',
	'trackingAddWhitelist',
	'trackingRemoveWhitelist',
	'brandingsUpdate',
	'configsUpdate',
	'productsCreate',
	'productsUpdate',
	'productsDelete',
	'productsUpsertBulk',
	'ordersUpsertBulk',
	'ordersUpsertBulkAsync',
	'recurringPaymentsUpsertBulk',
	'browseSessionsSave',
	'browseSessionsAddToCart',
	'smsBroadcastsCreateSnapshot',
	'addressGroupsDelete',
	'ecomOrdersUpsert',
	'notesCreateForAccount',
	'notesCreateForDeal',
	'notesUpdateForAccount',
	'notesUpdateForDeal',
	'contactTasksCreate',
	'segmentsV2Create',
	'segmentsV2Update',
	'segmentsV2Delete',
	'segmentsV2RevertToTimestamp',
	'segmentsV2MatchAll',
	'taskRemindersCreate',
	'customObjectSchemasCreateChild',
	'browseSessionsTestEvent',
]);

function isNonIdempotent(operation: string): boolean {
	return NON_IDEMPOTENT_OPERATIONS.has(operation);
}

export const errorHandlers = {
	/**
	 * A missing or malformed credential is a configuration fault, not a
	 * transient one. Matched first so that it is never retried and never
	 * reported as a generic failure.
	 */
	CONFIGURATION_ERROR: {
		match: (error) => {
			// The client raises ActiveCampaignAPIError with a code; the shared
			// account resolver raises the core's AuthMissingError. Both mean the
			// integration is misconfigured rather than that the API failed, and
			// neither becomes valid on a retry.
			if (error instanceof AuthMissingError) {
				return true;
			}
			const code = (error as { code?: string }).code;
			return (
				code === 'MISSING_API_TOKEN' ||
				code === 'MISSING_ACCOUNT' ||
				code === 'INVALID_ACCOUNT'
			);
		},
		handler: async (error, context) => {
			console.error(
				`[ACTIVECAMPAIGN:${context.operation}] Configuration error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * ActiveCampaign allows 5 requests per second per account across both the
	 * REST and GraphQL surfaces and returns 429 with a `Retry-After` once the
	 * budget is exhausted. The request was rejected rather than applied, so
	 * replaying it is safe even for writes.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('too many requests') || message.includes('rate limit')
			);
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			return error.message.toLowerCase().includes('authentication');
		},
		handler: async (error, context) => {
			console.warn(
				`[ACTIVECAMPAIGN:${context.operation}] Authentication failed - check the API token and account name under Settings > Developer`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 403,
		handler: async (error, context) => {
			console.warn(
				`[ACTIVECAMPAIGN:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			// DNS failures say "no such host"; those must reach NETWORK_ERROR.
			if (!(error instanceof ApiError)) {
				return false;
			}
			const message = error.message.toLowerCase();
			return message.includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[ACTIVECAMPAIGN:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * ActiveCampaign reports field-level rejections as 422 with an `errors`
	 * array, and malformed requests as 400. Neither becomes valid on a replay.
	 */
	VALIDATION_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				`[ACTIVECAMPAIGN:${context.operation}] Invalid request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A transport failure gives no evidence about whether the server applied
	 * the change, so only reads are replayed. See NON_IDEMPOTENT_OPERATIONS.
	 */
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('connection') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed') ||
				message.includes('aborted')
			);
		},
		handler: async (error, context) => {
			if (isNonIdempotent(context.operation)) {
				console.warn(
					`[ACTIVECAMPAIGN:${context.operation}] Network error on a write operation - not retried, because ActiveCampaign offers no idempotency key and the write may already have been applied: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			console.warn(
				`[ACTIVECAMPAIGN:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[ACTIVECAMPAIGN:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
