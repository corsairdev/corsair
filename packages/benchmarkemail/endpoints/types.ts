import { z } from 'zod';

/**
 * Input and output schemas for the Benchmark Email classic REST API v3.0.
 *
 * Paths, methods and auth follow the official Postman collection at
 * https://developer.benchmarkemail.com/ (base
 * https://clientapi.benchmarkemail.com, header `AuthToken`).
 *
 * NOTE: BENCHMARK_EMAIL_GET_LIST_MAPPING ("Get list mapping", field mapping
 * of an uploaded contact list file) has no corresponding endpoint in the
 * published collection, so it is intentionally not implemented.
 */

const PaginationQuery = {
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number for paginated results'),
	pageSize: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Number of results per page'),
};

const SearchQuery = {
	search: z.string().optional().describe('Search string to filter results'),
	criteria: z
		.string()
		.max(50)
		.optional()
		.describe('Filter string for search results'),
	sort: z.string().optional().describe('Sorting parameter'),
	filter: z.string().optional().describe('Filter expression'),
	guid: z.string().optional().describe('GUID for the reset request'),
};

/**
 * Write-operation payload. The classic API accepts bespoke form fields per
 * endpoint; callers pass the documented fields for the target route here.
 */
const RequestData = z
	.record(z.string(), z.unknown())
	.optional()
	.describe('Request body fields for the target route');

const BenchmarkContactResponseSchema = z
	.object({
		email: z.string().email().optional(),
		contactID: z.union([z.string(), z.number()]).optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	})
	.loose();

const BenchmarkListResponseSchema = z
	.object({
		listID: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		totalContacts: z.number().optional(),
	})
	.loose();

const BenchmarkEmailResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		subject: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

const BenchmarkReportResponseSchema = z
	.object({
		total: z.number().optional(),
		opens: z.number().optional(),
		clicks: z.number().optional(),
		bounces: z.number().optional(),
	})
	.loose();

const BenchmarkGenericResponseSchema = z
	.object({
		status: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
		total: z.number().optional(),
		count: z.number().optional(),
	})
	.loose();

const contactsAddContactToListInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsAddContactToListInput = z.infer<
	typeof contactsAddContactToListInputSchema
>;

const contactsAddContactToListResponseSchema = BenchmarkContactResponseSchema;

export type contactsAddContactToListResponse = z.infer<
	typeof contactsAddContactToListResponseSchema
>;

const contactsCleanContactListInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsCleanContactListInput = z.infer<
	typeof contactsCleanContactListInputSchema
>;

const contactsCleanContactListResponseSchema = BenchmarkGenericResponseSchema;

export type contactsCleanContactListResponse = z.infer<
	typeof contactsCleanContactListResponseSchema
>;

const contactsCompareContactsInputSchema = z.object({
	listIDs: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type contactsCompareContactsInput = z.infer<
	typeof contactsCompareContactsInputSchema
>;

const contactsCompareContactsResponseSchema = BenchmarkContactResponseSchema;

export type contactsCompareContactsResponse = z.infer<
	typeof contactsCompareContactsResponseSchema
>;

const contactsCopyBulkContactsInputSchema = z.object({
	data: RequestData,
});

export type contactsCopyBulkContactsInput = z.infer<
	typeof contactsCopyBulkContactsInputSchema
>;

const contactsCopyBulkContactsResponseSchema = BenchmarkContactResponseSchema;

export type contactsCopyBulkContactsResponse = z.infer<
	typeof contactsCopyBulkContactsResponseSchema
>;

const contactsCopyContactInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
	data: RequestData,
});

export type contactsCopyContactInput = z.infer<
	typeof contactsCopyContactInputSchema
>;

const contactsCopyContactResponseSchema = BenchmarkContactResponseSchema;

export type contactsCopyContactResponse = z.infer<
	typeof contactsCopyContactResponseSchema
>;

const contactsCreateSegmentCriteriaInputSchema = z.object({
	segmentID: z.string().min(1),
	data: RequestData,
});

export type contactsCreateSegmentCriteriaInput = z.infer<
	typeof contactsCreateSegmentCriteriaInputSchema
>;

const contactsCreateSegmentCriteriaResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsCreateSegmentCriteriaResponse = z.infer<
	typeof contactsCreateSegmentCriteriaResponseSchema
>;

const contactsCreateSegmentFromContactIDsInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsCreateSegmentFromContactIDsInput = z.infer<
	typeof contactsCreateSegmentFromContactIDsInputSchema
>;

const contactsCreateSegmentFromContactIDsResponseSchema =
	BenchmarkListResponseSchema;

export type contactsCreateSegmentFromContactIDsResponse = z.infer<
	typeof contactsCreateSegmentFromContactIDsResponseSchema
>;

const contactsDeleteContactFromAllListsByIDInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
	data: RequestData,
});

export type contactsDeleteContactFromAllListsByIDInput = z.infer<
	typeof contactsDeleteContactFromAllListsByIDInputSchema
>;

const contactsDeleteContactFromAllListsByIDResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteContactFromAllListsByIDResponse = z.infer<
	typeof contactsDeleteContactFromAllListsByIDResponseSchema
>;

const contactsDeleteContactFromListInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
});

export type contactsDeleteContactFromListInput = z.infer<
	typeof contactsDeleteContactFromListInputSchema
>;

const contactsDeleteContactFromListResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteContactFromListResponse = z.infer<
	typeof contactsDeleteContactFromListResponseSchema
>;

const contactsDeleteContactFromSearchInputSchema = z.object({
	contactID: z.string().min(1),
});

export type contactsDeleteContactFromSearchInput = z.infer<
	typeof contactsDeleteContactFromSearchInputSchema
>;

const contactsDeleteContactFromSearchResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteContactFromSearchResponse = z.infer<
	typeof contactsDeleteContactFromSearchResponseSchema
>;

const contactsDeleteContactsFromAllListsInputSchema = z.object({
	search: SearchQuery.search,
	data: RequestData,
});

export type contactsDeleteContactsFromAllListsInput = z.infer<
	typeof contactsDeleteContactsFromAllListsInputSchema
>;

const contactsDeleteContactsFromAllListsResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteContactsFromAllListsResponse = z.infer<
	typeof contactsDeleteContactsFromAllListsResponseSchema
>;

const contactsDeleteContactsFromCurrentListsInputSchema = z.object({
	search: SearchQuery.search,
	data: RequestData,
});

export type contactsDeleteContactsFromCurrentListsInput = z.infer<
	typeof contactsDeleteContactsFromCurrentListsInputSchema
>;

const contactsDeleteContactsFromCurrentListsResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteContactsFromCurrentListsResponse = z.infer<
	typeof contactsDeleteContactsFromCurrentListsResponseSchema
>;

const contactsDeleteSegmentInputSchema = z.object({
	segmentID: z.string().min(1),
});

export type contactsDeleteSegmentInput = z.infer<
	typeof contactsDeleteSegmentInputSchema
>;

const contactsDeleteSegmentResponseSchema = BenchmarkGenericResponseSchema;

export type contactsDeleteSegmentResponse = z.infer<
	typeof contactsDeleteSegmentResponseSchema
>;

const contactsDeleteSegmentCriteriaInputSchema = z.object({
	segmentID: z.string().min(1),
});

export type contactsDeleteSegmentCriteriaInput = z.infer<
	typeof contactsDeleteSegmentCriteriaInputSchema
>;

const contactsDeleteSegmentCriteriaResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsDeleteSegmentCriteriaResponse = z.infer<
	typeof contactsDeleteSegmentCriteriaResponseSchema
>;

const contactsDeleteTrashListInputSchema = z.object({
	listIDs: z.string().min(1),
});

export type contactsDeleteTrashListInput = z.infer<
	typeof contactsDeleteTrashListInputSchema
>;

const contactsDeleteTrashListResponseSchema = BenchmarkGenericResponseSchema;

export type contactsDeleteTrashListResponse = z.infer<
	typeof contactsDeleteTrashListResponseSchema
>;

const contactsGetActiveContactCountInputSchema = z.object({});

export type contactsGetActiveContactCountInput = z.infer<
	typeof contactsGetActiveContactCountInputSchema
>;

const contactsGetActiveContactCountResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetActiveContactCountResponse = z.infer<
	typeof contactsGetActiveContactCountResponseSchema
>;

const contactsGetContactAuditHistoryInputSchema = z.object({
	listID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type contactsGetContactAuditHistoryInput = z.infer<
	typeof contactsGetContactAuditHistoryInputSchema
>;

const contactsGetContactAuditHistoryResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetContactAuditHistoryResponse = z.infer<
	typeof contactsGetContactAuditHistoryResponseSchema
>;

const contactsGetContactAuditHistoryDetailInputSchema = z.object({
	listID: z.string().min(1),
	batchID: z.string().min(1),
	groupID: z.string().min(1),
});

export type contactsGetContactAuditHistoryDetailInput = z.infer<
	typeof contactsGetContactAuditHistoryDetailInputSchema
>;

const contactsGetContactAuditHistoryDetailResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetContactAuditHistoryDetailResponse = z.infer<
	typeof contactsGetContactAuditHistoryDetailResponseSchema
>;

const contactsGetContactDetailsInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
});

export type contactsGetContactDetailsInput = z.infer<
	typeof contactsGetContactDetailsInputSchema
>;

const contactsGetContactDetailsResponseSchema = BenchmarkContactResponseSchema;

export type contactsGetContactDetailsResponse = z.infer<
	typeof contactsGetContactDetailsResponseSchema
>;

const contactsGetContactImportStatusInputSchema = z.object({});

export type contactsGetContactImportStatusInput = z.infer<
	typeof contactsGetContactImportStatusInputSchema
>;

const contactsGetContactImportStatusResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetContactImportStatusResponse = z.infer<
	typeof contactsGetContactImportStatusResponseSchema
>;

const contactsGetContactMergeListInputSchema = z.object({
	listIDs: z.string().min(1),
});

export type contactsGetContactMergeListInput = z.infer<
	typeof contactsGetContactMergeListInputSchema
>;

const contactsGetContactMergeListResponseSchema = BenchmarkListResponseSchema;

export type contactsGetContactMergeListResponse = z.infer<
	typeof contactsGetContactMergeListResponseSchema
>;

const contactsGetContactsCountInputSchema = z.object({
	listIDs: z.string().min(1),
	segmentIDs: z.string().min(1),
});

export type contactsGetContactsCountInput = z.infer<
	typeof contactsGetContactsCountInputSchema
>;

const contactsGetContactsCountResponseSchema = BenchmarkGenericResponseSchema;

export type contactsGetContactsCountResponse = z.infer<
	typeof contactsGetContactsCountResponseSchema
>;

const contactsGetFilteredContactsInputSchema = z.object({
	listID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	search: SearchQuery.search,
	filter: SearchQuery.filter,
});

export type contactsGetFilteredContactsInput = z.infer<
	typeof contactsGetFilteredContactsInputSchema
>;

const contactsGetFilteredContactsResponseSchema =
	BenchmarkContactResponseSchema;

export type contactsGetFilteredContactsResponse = z.infer<
	typeof contactsGetFilteredContactsResponseSchema
>;

const contactsGetFilteredContactsWithExtraFieldsInputSchema = z.object({
	listID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	search: SearchQuery.search,
});

export type contactsGetFilteredContactsWithExtraFieldsInput = z.infer<
	typeof contactsGetFilteredContactsWithExtraFieldsInputSchema
>;

const contactsGetFilteredContactsWithExtraFieldsResponseSchema =
	BenchmarkContactResponseSchema;

export type contactsGetFilteredContactsWithExtraFieldsResponse = z.infer<
	typeof contactsGetFilteredContactsWithExtraFieldsResponseSchema
>;

const contactsGetNonContactCountInputSchema = z.object({
	filter: SearchQuery.filter,
});

export type contactsGetNonContactCountInput = z.infer<
	typeof contactsGetNonContactCountInputSchema
>;

const contactsGetNonContactCountResponseSchema = BenchmarkReportResponseSchema;

export type contactsGetNonContactCountResponse = z.infer<
	typeof contactsGetNonContactCountResponseSchema
>;

const contactsGetSegmentAutoGenerateNameInputSchema = z.object({
	listID: z.string().min(1),
});

export type contactsGetSegmentAutoGenerateNameInput = z.infer<
	typeof contactsGetSegmentAutoGenerateNameInputSchema
>;

const contactsGetSegmentAutoGenerateNameResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetSegmentAutoGenerateNameResponse = z.infer<
	typeof contactsGetSegmentAutoGenerateNameResponseSchema
>;

const contactsGetSegmentDetailsInputSchema = z.object({
	segmentID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	search: SearchQuery.search,
	sort: SearchQuery.sort,
});

export type contactsGetSegmentDetailsInput = z.infer<
	typeof contactsGetSegmentDetailsInputSchema
>;

const contactsGetSegmentDetailsResponseSchema = BenchmarkContactResponseSchema;

export type contactsGetSegmentDetailsResponse = z.infer<
	typeof contactsGetSegmentDetailsResponseSchema
>;

const contactsGetSegmentListInputSchema = z.object({
	listID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type contactsGetSegmentListInput = z.infer<
	typeof contactsGetSegmentListInputSchema
>;

const contactsGetSegmentListResponseSchema = BenchmarkListResponseSchema;

export type contactsGetSegmentListResponse = z.infer<
	typeof contactsGetSegmentListResponseSchema
>;

const contactsGetSegmentByIDInputSchema = z.object({
	segmentID: z.string().min(1),
});

export type contactsGetSegmentByIDInput = z.infer<
	typeof contactsGetSegmentByIDInputSchema
>;

const contactsGetSegmentByIDResponseSchema = BenchmarkGenericResponseSchema;

export type contactsGetSegmentByIDResponse = z.infer<
	typeof contactsGetSegmentByIDResponseSchema
>;

const contactsGetSegmentsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	search: SearchQuery.search,
	sort: SearchQuery.sort,
});

export type contactsGetSegmentsInput = z.infer<
	typeof contactsGetSegmentsInputSchema
>;

const contactsGetSegmentsResponseSchema = BenchmarkGenericResponseSchema;

export type contactsGetSegmentsResponse = z.infer<
	typeof contactsGetSegmentsResponseSchema
>;

const contactsGetTrashCountInputSchema = z.object({});

export type contactsGetTrashCountInput = z.infer<
	typeof contactsGetTrashCountInputSchema
>;

const contactsGetTrashCountResponseSchema = BenchmarkGenericResponseSchema;

export type contactsGetTrashCountResponse = z.infer<
	typeof contactsGetTrashCountResponseSchema
>;

const contactsGetDownloadSegmentDataInputSchema = z.object({
	id: z.string().min(1),
});

export type contactsGetDownloadSegmentDataInput = z.infer<
	typeof contactsGetDownloadSegmentDataInputSchema
>;

const contactsGetDownloadSegmentDataResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetDownloadSegmentDataResponse = z.infer<
	typeof contactsGetDownloadSegmentDataResponseSchema
>;

const contactsGetCleanCountInputSchema = z.object({
	listID: z.string().min(1),
});

export type contactsGetCleanCountInput = z.infer<
	typeof contactsGetCleanCountInputSchema
>;

const contactsGetCleanCountResponseSchema = BenchmarkGenericResponseSchema;

export type contactsGetCleanCountResponse = z.infer<
	typeof contactsGetCleanCountResponseSchema
>;

const contactsGetUniqueContactCountInputSchema = z.object({});

export type contactsGetUniqueContactCountInput = z.infer<
	typeof contactsGetUniqueContactCountInputSchema
>;

const contactsGetUniqueContactCountResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsGetUniqueContactCountResponse = z.infer<
	typeof contactsGetUniqueContactCountResponseSchema
>;

const contactsMergeContactsIntoExistingListInputSchema = z.object({
	listIDs: z.string().min(1),
	data: RequestData,
});

export type contactsMergeContactsIntoExistingListInput = z.infer<
	typeof contactsMergeContactsIntoExistingListInputSchema
>;

const contactsMergeContactsIntoExistingListResponseSchema =
	BenchmarkListResponseSchema;

export type contactsMergeContactsIntoExistingListResponse = z.infer<
	typeof contactsMergeContactsIntoExistingListResponseSchema
>;

const contactsMergeContactsIntoNewListInputSchema = z.object({
	listIDs: z.string().min(1),
	data: RequestData,
});

export type contactsMergeContactsIntoNewListInput = z.infer<
	typeof contactsMergeContactsIntoNewListInputSchema
>;

const contactsMergeContactsIntoNewListResponseSchema =
	BenchmarkListResponseSchema;

export type contactsMergeContactsIntoNewListResponse = z.infer<
	typeof contactsMergeContactsIntoNewListResponseSchema
>;

const contactsMoveBulkContactsInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsMoveBulkContactsInput = z.infer<
	typeof contactsMoveBulkContactsInputSchema
>;

const contactsMoveBulkContactsResponseSchema = BenchmarkContactResponseSchema;

export type contactsMoveBulkContactsResponse = z.infer<
	typeof contactsMoveBulkContactsResponseSchema
>;

const contactsMoveContactToDoNotContactListInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
});

export type contactsMoveContactToDoNotContactListInput = z.infer<
	typeof contactsMoveContactToDoNotContactListInputSchema
>;

const contactsMoveContactToDoNotContactListResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsMoveContactToDoNotContactListResponse = z.infer<
	typeof contactsMoveContactToDoNotContactListResponseSchema
>;

const contactsMoveContactsInputSchema = z.object({
	listID: z.string().min(1),
	targetListID: z.string().min(1),
	contactIDs: z.string().min(1),
	data: RequestData,
});

export type contactsMoveContactsInput = z.infer<
	typeof contactsMoveContactsInputSchema
>;

const contactsMoveContactsResponseSchema = BenchmarkContactResponseSchema;

export type contactsMoveContactsResponse = z.infer<
	typeof contactsMoveContactsResponseSchema
>;

const contactsResendEmailsInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsResendEmailsInput = z.infer<
	typeof contactsResendEmailsInputSchema
>;

const contactsResendEmailsResponseSchema = BenchmarkGenericResponseSchema;

export type contactsResendEmailsResponse = z.infer<
	typeof contactsResendEmailsResponseSchema
>;

const contactsSaveEmailAddressInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsSaveEmailAddressInput = z.infer<
	typeof contactsSaveEmailAddressInputSchema
>;

const contactsSaveEmailAddressResponseSchema = BenchmarkContactResponseSchema;

export type contactsSaveEmailAddressResponse = z.infer<
	typeof contactsSaveEmailAddressResponseSchema
>;

const contactsSaveVerifiedEmailAddressesInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type contactsSaveVerifiedEmailAddressesInput = z.infer<
	typeof contactsSaveVerifiedEmailAddressesInputSchema
>;

const contactsSaveVerifiedEmailAddressesResponseSchema =
	BenchmarkContactResponseSchema;

export type contactsSaveVerifiedEmailAddressesResponse = z.infer<
	typeof contactsSaveVerifiedEmailAddressesResponseSchema
>;

const contactsSearchContactDetailsByEmailInputSchema = z.object({
	search: SearchQuery.search,
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type contactsSearchContactDetailsByEmailInput = z.infer<
	typeof contactsSearchContactDetailsByEmailInputSchema
>;

const contactsSearchContactDetailsByEmailResponseSchema =
	BenchmarkContactResponseSchema;

export type contactsSearchContactDetailsByEmailResponse = z.infer<
	typeof contactsSearchContactDetailsByEmailResponseSchema
>;

const contactsSendConfirmEmailVerificationInputSchema = z.object({
	data: RequestData,
});

export type contactsSendConfirmEmailVerificationInput = z.infer<
	typeof contactsSendConfirmEmailVerificationInputSchema
>;

const contactsSendConfirmEmailVerificationResponseSchema =
	BenchmarkGenericResponseSchema;

export type contactsSendConfirmEmailVerificationResponse = z.infer<
	typeof contactsSendConfirmEmailVerificationResponseSchema
>;

const contactsUpdateContactDetailsInputSchema = z.object({
	listID: z.string().min(1),
	contactID: z.string().min(1),
	data: RequestData,
});

export type contactsUpdateContactDetailsInput = z.infer<
	typeof contactsUpdateContactDetailsInputSchema
>;

const contactsUpdateContactDetailsResponseSchema =
	BenchmarkContactResponseSchema;

export type contactsUpdateContactDetailsResponse = z.infer<
	typeof contactsUpdateContactDetailsResponseSchema
>;

const contactsUpdateSegmentInputSchema = z.object({
	segmentID: z.string().min(1),
	data: RequestData,
});

export type contactsUpdateSegmentInput = z.infer<
	typeof contactsUpdateSegmentInputSchema
>;

const contactsUpdateSegmentResponseSchema = BenchmarkGenericResponseSchema;

export type contactsUpdateSegmentResponse = z.infer<
	typeof contactsUpdateSegmentResponseSchema
>;

const listsCreateContactListInputSchema = z.object({
	data: RequestData,
});

export type listsCreateContactListInput = z.infer<
	typeof listsCreateContactListInputSchema
>;

const listsCreateContactListResponseSchema = BenchmarkListResponseSchema;

export type listsCreateContactListResponse = z.infer<
	typeof listsCreateContactListResponseSchema
>;

const listsDeleteContactListInputSchema = z.object({
	listID: z.string().min(1),
});

export type listsDeleteContactListInput = z.infer<
	typeof listsDeleteContactListInputSchema
>;

const listsDeleteContactListResponseSchema = BenchmarkGenericResponseSchema;

export type listsDeleteContactListResponse = z.infer<
	typeof listsDeleteContactListResponseSchema
>;

const listsDeleteListInputSchema = z.object({
	listIDs: z.string().min(1),
});

export type listsDeleteListInput = z.infer<typeof listsDeleteListInputSchema>;

const listsDeleteListResponseSchema = BenchmarkGenericResponseSchema;

export type listsDeleteListResponse = z.infer<
	typeof listsDeleteListResponseSchema
>;

const listsGetContactListDeepViewInputSchema = z.object({
	listIDs: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type listsGetContactListDeepViewInput = z.infer<
	typeof listsGetContactListDeepViewInputSchema
>;

const listsGetContactListDeepViewResponseSchema = BenchmarkListResponseSchema;

export type listsGetContactListDeepViewResponse = z.infer<
	typeof listsGetContactListDeepViewResponseSchema
>;

const listsGetContactListDetailsInputSchema = z.object({
	listID: z.string().min(1),
});

export type listsGetContactListDetailsInput = z.infer<
	typeof listsGetContactListDetailsInputSchema
>;

const listsGetContactListDetailsResponseSchema = BenchmarkListResponseSchema;

export type listsGetContactListDetailsResponse = z.infer<
	typeof listsGetContactListDetailsResponseSchema
>;

const listsGetContactListFieldNamesInputSchema = z.object({
	listID: z.string().min(1),
});

export type listsGetContactListFieldNamesInput = z.infer<
	typeof listsGetContactListFieldNamesInputSchema
>;

const listsGetContactListFieldNamesResponseSchema =
	BenchmarkGenericResponseSchema;

export type listsGetContactListFieldNamesResponse = z.infer<
	typeof listsGetContactListFieldNamesResponseSchema
>;

const listsGetContactListsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type listsGetContactListsInput = z.infer<
	typeof listsGetContactListsInputSchema
>;

const listsGetContactListsResponseSchema = BenchmarkListResponseSchema;

export type listsGetContactListsResponse = z.infer<
	typeof listsGetContactListsResponseSchema
>;

const listsGetDeleteListCheckInputSchema = z.object({
	listIDs: z.string().min(1),
});

export type listsGetDeleteListCheckInput = z.infer<
	typeof listsGetDeleteListCheckInputSchema
>;

const listsGetDeleteListCheckResponseSchema = BenchmarkGenericResponseSchema;

export type listsGetDeleteListCheckResponse = z.infer<
	typeof listsGetDeleteListCheckResponseSchema
>;

const listsGetListUploadTermsInputSchema = z.object({});

export type listsGetListUploadTermsInput = z.infer<
	typeof listsGetListUploadTermsInputSchema
>;

const listsGetListUploadTermsResponseSchema = BenchmarkGenericResponseSchema;

export type listsGetListUploadTermsResponse = z.infer<
	typeof listsGetListUploadTermsResponseSchema
>;

const listsGetContactListSummaryInputSchema = z.object({
	listID: z.string().min(1),
});

export type listsGetContactListSummaryInput = z.infer<
	typeof listsGetContactListSummaryInputSchema
>;

const listsGetContactListSummaryResponseSchema = BenchmarkGenericResponseSchema;

export type listsGetContactListSummaryResponse = z.infer<
	typeof listsGetContactListSummaryResponseSchema
>;

const listsRestoreTrashListInputSchema = z.object({
	listIDs: z.string().min(1),
	data: RequestData,
});

export type listsRestoreTrashListInput = z.infer<
	typeof listsRestoreTrashListInputSchema
>;

const listsRestoreTrashListResponseSchema = BenchmarkGenericResponseSchema;

export type listsRestoreTrashListResponse = z.infer<
	typeof listsRestoreTrashListResponseSchema
>;

const listsUpdateContactListInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type listsUpdateContactListInput = z.infer<
	typeof listsUpdateContactListInputSchema
>;

const listsUpdateContactListResponseSchema = BenchmarkListResponseSchema;

export type listsUpdateContactListResponse = z.infer<
	typeof listsUpdateContactListResponseSchema
>;

const emailsAddEmailToCommunityInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsAddEmailToCommunityInput = z.infer<
	typeof emailsAddEmailToCommunityInputSchema
>;

const emailsAddEmailToCommunityResponseSchema = BenchmarkGenericResponseSchema;

export type emailsAddEmailToCommunityResponse = z.infer<
	typeof emailsAddEmailToCommunityResponseSchema
>;

const emailsCopyExistingEmailInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsCopyExistingEmailInput = z.infer<
	typeof emailsCopyExistingEmailInputSchema
>;

const emailsCopyExistingEmailResponseSchema = BenchmarkEmailResponseSchema;

export type emailsCopyExistingEmailResponse = z.infer<
	typeof emailsCopyExistingEmailResponseSchema
>;

const emailsDeleteABTestEmailInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsDeleteABTestEmailInput = z.infer<
	typeof emailsDeleteABTestEmailInputSchema
>;

const emailsDeleteABTestEmailResponseSchema = BenchmarkGenericResponseSchema;

export type emailsDeleteABTestEmailResponse = z.infer<
	typeof emailsDeleteABTestEmailResponseSchema
>;

const emailsDeleteABSplitCampaignInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsDeleteABSplitCampaignInput = z.infer<
	typeof emailsDeleteABSplitCampaignInputSchema
>;

const emailsDeleteABSplitCampaignResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsDeleteABSplitCampaignResponse = z.infer<
	typeof emailsDeleteABSplitCampaignResponseSchema
>;

const emailsDeleteEmailCampaignInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsDeleteEmailCampaignInput = z.infer<
	typeof emailsDeleteEmailCampaignInputSchema
>;

const emailsDeleteEmailCampaignResponseSchema = BenchmarkGenericResponseSchema;

export type emailsDeleteEmailCampaignResponse = z.infer<
	typeof emailsDeleteEmailCampaignResponseSchema
>;

const emailsGetABSplitDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetABSplitDetailsInput = z.infer<
	typeof emailsGetABSplitDetailsInputSchema
>;

const emailsGetABSplitDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetABSplitDetailsResponse = z.infer<
	typeof emailsGetABSplitDetailsResponseSchema
>;

const emailsGetABSplitResultsInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetABSplitResultsInput = z.infer<
	typeof emailsGetABSplitResultsInputSchema
>;

const emailsGetABSplitResultsResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetABSplitResultsResponse = z.infer<
	typeof emailsGetABSplitResultsResponseSchema
>;

const emailsGetABTestsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type emailsGetABTestsInput = z.infer<typeof emailsGetABTestsInputSchema>;

const emailsGetABTestsResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetABTestsResponse = z.infer<
	typeof emailsGetABTestsResponseSchema
>;

const emailsGetCommunityCategoryInputSchema = z.object({});

export type emailsGetCommunityCategoryInput = z.infer<
	typeof emailsGetCommunityCategoryInputSchema
>;

const emailsGetCommunityCategoryResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetCommunityCategoryResponse = z.infer<
	typeof emailsGetCommunityCategoryResponseSchema
>;

const emailsGetCommunityEmailByIDInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetCommunityEmailByIDInput = z.infer<
	typeof emailsGetCommunityEmailByIDInputSchema
>;

const emailsGetCommunityEmailByIDResponseSchema = BenchmarkEmailResponseSchema;

export type emailsGetCommunityEmailByIDResponse = z.infer<
	typeof emailsGetCommunityEmailByIDResponseSchema
>;

const emailsGetEmailPreviewInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetEmailPreviewInput = z.infer<
	typeof emailsGetEmailPreviewInputSchema
>;

const emailsGetEmailPreviewResponseSchema = BenchmarkEmailResponseSchema;

export type emailsGetEmailPreviewResponse = z.infer<
	typeof emailsGetEmailPreviewResponseSchema
>;

const emailsGetEmailRecipientCountInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetEmailRecipientCountInput = z.infer<
	typeof emailsGetEmailRecipientCountInputSchema
>;

const emailsGetEmailRecipientCountResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsGetEmailRecipientCountResponse = z.infer<
	typeof emailsGetEmailRecipientCountResponseSchema
>;

const emailsGetEmailSpamCheckInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetEmailSpamCheckInput = z.infer<
	typeof emailsGetEmailSpamCheckInputSchema
>;

const emailsGetEmailSpamCheckResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetEmailSpamCheckResponse = z.infer<
	typeof emailsGetEmailSpamCheckResponseSchema
>;

const emailsGetEmailTemplatesInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	criteria: SearchQuery.criteria,
});

export type emailsGetEmailTemplatesInput = z.infer<
	typeof emailsGetEmailTemplatesInputSchema
>;

const emailsGetEmailTemplatesResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetEmailTemplatesResponse = z.infer<
	typeof emailsGetEmailTemplatesResponseSchema
>;

const emailsGetEmailsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
	criteria: SearchQuery.criteria,
});

export type emailsGetEmailsInput = z.infer<typeof emailsGetEmailsInputSchema>;

const emailsGetEmailsResponseSchema = BenchmarkEmailResponseSchema;

export type emailsGetEmailsResponse = z.infer<
	typeof emailsGetEmailsResponseSchema
>;

const emailsGetEmailDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetEmailDetailsInput = z.infer<
	typeof emailsGetEmailDetailsInputSchema
>;

const emailsGetEmailDetailsResponseSchema = BenchmarkEmailResponseSchema;

export type emailsGetEmailDetailsResponse = z.infer<
	typeof emailsGetEmailDetailsResponseSchema
>;

const emailsGetTemplateCategoryListInputSchema = z.object({});

export type emailsGetTemplateCategoryListInput = z.infer<
	typeof emailsGetTemplateCategoryListInputSchema
>;

const emailsGetTemplateCategoryListResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsGetTemplateCategoryListResponse = z.infer<
	typeof emailsGetTemplateCategoryListResponseSchema
>;

const emailsGetTemplateCategoryByIDInputSchema = z.object({
	categoryID: z.string().min(1),
});

export type emailsGetTemplateCategoryByIDInput = z.infer<
	typeof emailsGetTemplateCategoryByIDInputSchema
>;

const emailsGetTemplateCategoryByIDResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsGetTemplateCategoryByIDResponse = z.infer<
	typeof emailsGetTemplateCategoryByIDResponseSchema
>;

const emailsGetTemplateByIDInputSchema = z.object({
	templateID: z.string().min(1),
});

export type emailsGetTemplateByIDInput = z.infer<
	typeof emailsGetTemplateByIDInputSchema
>;

const emailsGetTemplateByIDResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetTemplateByIDResponse = z.infer<
	typeof emailsGetTemplateByIDResponseSchema
>;

const emailsInitiateEmailScreenCaptureInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsInitiateEmailScreenCaptureInput = z.infer<
	typeof emailsInitiateEmailScreenCaptureInputSchema
>;

const emailsInitiateEmailScreenCaptureResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsInitiateEmailScreenCaptureResponse = z.infer<
	typeof emailsInitiateEmailScreenCaptureResponseSchema
>;

const emailsPermanentlyDeleteEmailFromTrashInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsPermanentlyDeleteEmailFromTrashInput = z.infer<
	typeof emailsPermanentlyDeleteEmailFromTrashInputSchema
>;

const emailsPermanentlyDeleteEmailFromTrashResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsPermanentlyDeleteEmailFromTrashResponse = z.infer<
	typeof emailsPermanentlyDeleteEmailFromTrashResponseSchema
>;

const emailsRestoreEmailFromTrashInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsRestoreEmailFromTrashInput = z.infer<
	typeof emailsRestoreEmailFromTrashInputSchema
>;

const emailsRestoreEmailFromTrashResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsRestoreEmailFromTrashResponse = z.infer<
	typeof emailsRestoreEmailFromTrashResponseSchema
>;

const emailsScheduleEmailCampaignInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsScheduleEmailCampaignInput = z.infer<
	typeof emailsScheduleEmailCampaignInputSchema
>;

const emailsScheduleEmailCampaignResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsScheduleEmailCampaignResponse = z.infer<
	typeof emailsScheduleEmailCampaignResponseSchema
>;

const emailsUpdateEmailCampaignInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsUpdateEmailCampaignInput = z.infer<
	typeof emailsUpdateEmailCampaignInputSchema
>;

const emailsUpdateEmailCampaignResponseSchema = BenchmarkEmailResponseSchema;

export type emailsUpdateEmailCampaignResponse = z.infer<
	typeof emailsUpdateEmailCampaignResponseSchema
>;

const emailsGetBadgesListInputSchema = z.object({});

export type emailsGetBadgesListInput = z.infer<
	typeof emailsGetBadgesListInputSchema
>;

const emailsGetBadgesListResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetBadgesListResponse = z.infer<
	typeof emailsGetBadgesListResponseSchema
>;

const emailsGetLayoutListInputSchema = z.object({});

export type emailsGetLayoutListInput = z.infer<
	typeof emailsGetLayoutListInputSchema
>;

const emailsGetLayoutListResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetLayoutListResponse = z.infer<
	typeof emailsGetLayoutListResponseSchema
>;

const emailsGetSchemeInputSchema = z.object({});

export type emailsGetSchemeInput = z.infer<typeof emailsGetSchemeInputSchema>;

const emailsGetSchemeResponseSchema = BenchmarkGenericResponseSchema;

export type emailsGetSchemeResponse = z.infer<
	typeof emailsGetSchemeResponseSchema
>;

const emailsAddOrUpdateSchemeInputSchema = z.object({
	data: RequestData,
});

export type emailsAddOrUpdateSchemeInput = z.infer<
	typeof emailsAddOrUpdateSchemeInputSchema
>;

const emailsAddOrUpdateSchemeResponseSchema = BenchmarkGenericResponseSchema;

export type emailsAddOrUpdateSchemeResponse = z.infer<
	typeof emailsAddOrUpdateSchemeResponseSchema
>;

const emailsGetRSSHistoryByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type emailsGetRSSHistoryByEmailIDInput = z.infer<
	typeof emailsGetRSSHistoryByEmailIDInputSchema
>;

const emailsGetRSSHistoryByEmailIDResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsGetRSSHistoryByEmailIDResponse = z.infer<
	typeof emailsGetRSSHistoryByEmailIDResponseSchema
>;

const emailsShareTemplateToSubAccountsInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type emailsShareTemplateToSubAccountsInput = z.infer<
	typeof emailsShareTemplateToSubAccountsInputSchema
>;

const emailsShareTemplateToSubAccountsResponseSchema =
	BenchmarkGenericResponseSchema;

export type emailsShareTemplateToSubAccountsResponse = z.infer<
	typeof emailsShareTemplateToSubAccountsResponseSchema
>;

const archiveAddEmailToArchiveInputSchema = z.object({
	data: RequestData,
});

export type archiveAddEmailToArchiveInput = z.infer<
	typeof archiveAddEmailToArchiveInputSchema
>;

const archiveAddEmailToArchiveResponseSchema = BenchmarkGenericResponseSchema;

export type archiveAddEmailToArchiveResponse = z.infer<
	typeof archiveAddEmailToArchiveResponseSchema
>;

const archiveDeleteEmailFromArchiveInputSchema = z.object({
	id: z.string().min(1),
});

export type archiveDeleteEmailFromArchiveInput = z.infer<
	typeof archiveDeleteEmailFromArchiveInputSchema
>;

const archiveDeleteEmailFromArchiveResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveDeleteEmailFromArchiveResponse = z.infer<
	typeof archiveDeleteEmailFromArchiveResponseSchema
>;

const archiveGetArchiveDomainNameInputSchema = z.object({});

export type archiveGetArchiveDomainNameInput = z.infer<
	typeof archiveGetArchiveDomainNameInputSchema
>;

const archiveGetArchiveDomainNameResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveGetArchiveDomainNameResponse = z.infer<
	typeof archiveGetArchiveDomainNameResponseSchema
>;

const archiveGetArchiveEmailDetailsInputSchema = z.object({
	archiveID: z.string().min(1),
});

export type archiveGetArchiveEmailDetailsInput = z.infer<
	typeof archiveGetArchiveEmailDetailsInputSchema
>;

const archiveGetArchiveEmailDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveGetArchiveEmailDetailsResponse = z.infer<
	typeof archiveGetArchiveEmailDetailsResponseSchema
>;

const archiveGetArchiveEmailsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type archiveGetArchiveEmailsInput = z.infer<
	typeof archiveGetArchiveEmailsInputSchema
>;

const archiveGetArchiveEmailsResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetArchiveEmailsResponse = z.infer<
	typeof archiveGetArchiveEmailsResponseSchema
>;

const archiveGetArchiveHomeDataInputSchema = z.object({
	domain: z.string().min(1),
	type: z.string().min(1),
});

export type archiveGetArchiveHomeDataInput = z.infer<
	typeof archiveGetArchiveHomeDataInputSchema
>;

const archiveGetArchiveHomeDataResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetArchiveHomeDataResponse = z.infer<
	typeof archiveGetArchiveHomeDataResponseSchema
>;

const archiveGetArchiveHomePageInputSchema = z.object({});

export type archiveGetArchiveHomePageInput = z.infer<
	typeof archiveGetArchiveHomePageInputSchema
>;

const archiveGetArchiveHomePageResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetArchiveHomePageResponse = z.infer<
	typeof archiveGetArchiveHomePageResponseSchema
>;

const archiveGetArchivePagesInputSchema = z.object({});

export type archiveGetArchivePagesInput = z.infer<
	typeof archiveGetArchivePagesInputSchema
>;

const archiveGetArchivePagesResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetArchivePagesResponse = z.infer<
	typeof archiveGetArchivePagesResponseSchema
>;

const archiveGetDetailsAboutArchivePageInputSchema = z.object({});

export type archiveGetDetailsAboutArchivePageInput = z.infer<
	typeof archiveGetDetailsAboutArchivePageInputSchema
>;

const archiveGetDetailsAboutArchivePageResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveGetDetailsAboutArchivePageResponse = z.infer<
	typeof archiveGetDetailsAboutArchivePageResponseSchema
>;

const archiveGetHTMLForArchiveNewsletterInputSchema = z.object({
	domain: z.string().min(1),
	data: RequestData,
});

export type archiveGetHTMLForArchiveNewsletterInput = z.infer<
	typeof archiveGetHTMLForArchiveNewsletterInputSchema
>;

const archiveGetHTMLForArchiveNewsletterResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveGetHTMLForArchiveNewsletterResponse = z.infer<
	typeof archiveGetHTMLForArchiveNewsletterResponseSchema
>;

const archiveGetHTMLForButtonInputSchema = z.object({
	mode: z.string().min(1),
});

export type archiveGetHTMLForButtonInput = z.infer<
	typeof archiveGetHTMLForButtonInputSchema
>;

const archiveGetHTMLForButtonResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetHTMLForButtonResponse = z.infer<
	typeof archiveGetHTMLForButtonResponseSchema
>;

const archiveGetImageForButtonInputSchema = z.object({
	mode: z.string().min(1),
});

export type archiveGetImageForButtonInput = z.infer<
	typeof archiveGetImageForButtonInputSchema
>;

const archiveGetImageForButtonResponseSchema = BenchmarkGenericResponseSchema;

export type archiveGetImageForButtonResponse = z.infer<
	typeof archiveGetImageForButtonResponseSchema
>;

const archiveUpdateArchiveHomePageInputSchema = z.object({
	data: RequestData,
});

export type archiveUpdateArchiveHomePageInput = z.infer<
	typeof archiveUpdateArchiveHomePageInputSchema
>;

const archiveUpdateArchiveHomePageResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveUpdateArchiveHomePageResponse = z.infer<
	typeof archiveUpdateArchiveHomePageResponseSchema
>;

const archiveUpdateArchiveHomePageDataInputSchema = z.object({
	data: RequestData,
});

export type archiveUpdateArchiveHomePageDataInput = z.infer<
	typeof archiveUpdateArchiveHomePageDataInputSchema
>;

const archiveUpdateArchiveHomePageDataResponseSchema =
	BenchmarkGenericResponseSchema;

export type archiveUpdateArchiveHomePageDataResponse = z.infer<
	typeof archiveUpdateArchiveHomePageDataResponseSchema
>;

const automationsAddEmailInAutomationInputSchema = z.object({
	automationID: z.string().min(1),
	data: RequestData,
});

export type automationsAddEmailInAutomationInput = z.infer<
	typeof automationsAddEmailInAutomationInputSchema
>;

const automationsAddEmailInAutomationResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsAddEmailInAutomationResponse = z.infer<
	typeof automationsAddEmailInAutomationResponseSchema
>;

const automationsCopyEmailInAutomationInputSchema = z.object({
	automationID: z.string().min(1),
	automationDetailID: z.string().min(1),
	data: RequestData,
});

export type automationsCopyEmailInAutomationInput = z.infer<
	typeof automationsCopyEmailInAutomationInputSchema
>;

const automationsCopyEmailInAutomationResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsCopyEmailInAutomationResponse = z.infer<
	typeof automationsCopyEmailInAutomationResponseSchema
>;

const automationsCreateAutomationCopyInputSchema = z.object({
	automationID: z.string().min(1),
	data: RequestData,
});

export type automationsCreateAutomationCopyInput = z.infer<
	typeof automationsCreateAutomationCopyInputSchema
>;

const automationsCreateAutomationCopyResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsCreateAutomationCopyResponse = z.infer<
	typeof automationsCreateAutomationCopyResponseSchema
>;

const automationsDeleteAutomationInputSchema = z.object({
	automationID: z.string().min(1),
});

export type automationsDeleteAutomationInput = z.infer<
	typeof automationsDeleteAutomationInputSchema
>;

const automationsDeleteAutomationResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsDeleteAutomationResponse = z.infer<
	typeof automationsDeleteAutomationResponseSchema
>;

const automationsDeleteAutomationEmailInputSchema = z.object({
	automationID: z.string().min(1),
	automationDetailID: z.string().min(1),
});

export type automationsDeleteAutomationEmailInput = z.infer<
	typeof automationsDeleteAutomationEmailInputSchema
>;

const automationsDeleteAutomationEmailResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsDeleteAutomationEmailResponse = z.infer<
	typeof automationsDeleteAutomationEmailResponseSchema
>;

const automationsGetAutomationEmailDetailsInputSchema = z.object({
	automationID: z.string().min(1),
	automationDetailID: z.string().min(1),
});

export type automationsGetAutomationEmailDetailsInput = z.infer<
	typeof automationsGetAutomationEmailDetailsInputSchema
>;

const automationsGetAutomationEmailDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsGetAutomationEmailDetailsResponse = z.infer<
	typeof automationsGetAutomationEmailDetailsResponseSchema
>;

const automationsGetAutomationDetailsInputSchema = z.object({
	automationID: z.string().min(1),
});

export type automationsGetAutomationDetailsInput = z.infer<
	typeof automationsGetAutomationDetailsInputSchema
>;

const automationsGetAutomationDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsGetAutomationDetailsResponse = z.infer<
	typeof automationsGetAutomationDetailsResponseSchema
>;

const automationsGetAutomationSummaryReportInputSchema = z.object({
	automationID: z.string().min(1),
});

export type automationsGetAutomationSummaryReportInput = z.infer<
	typeof automationsGetAutomationSummaryReportInputSchema
>;

const automationsGetAutomationSummaryReportResponseSchema =
	BenchmarkReportResponseSchema;

export type automationsGetAutomationSummaryReportResponse = z.infer<
	typeof automationsGetAutomationSummaryReportResponseSchema
>;

const automationsUpdateEmailContentForAutomationInputSchema = z.object({
	automationID: z.string().min(1),
	automationDetailID: z.string().min(1),
	data: RequestData,
});

export type automationsUpdateEmailContentForAutomationInput = z.infer<
	typeof automationsUpdateEmailContentForAutomationInputSchema
>;

const automationsUpdateEmailContentForAutomationResponseSchema =
	BenchmarkGenericResponseSchema;

export type automationsUpdateEmailContentForAutomationResponse = z.infer<
	typeof automationsUpdateEmailContentForAutomationResponseSchema
>;

const reportsGetABTestReportInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type reportsGetABTestReportInput = z.infer<
	typeof reportsGetABTestReportInputSchema
>;

const reportsGetABTestReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetABTestReportResponse = z.infer<
	typeof reportsGetABTestReportResponseSchema
>;

const reportsGetAbuseCampaignReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetAbuseCampaignReportByEmailIDInput = z.infer<
	typeof reportsGetAbuseCampaignReportByEmailIDInputSchema
>;

const reportsGetAbuseCampaignReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetAbuseCampaignReportByEmailIDResponse = z.infer<
	typeof reportsGetAbuseCampaignReportByEmailIDResponseSchema
>;

const reportsGetAbuseReportInputSchema = z.object({});

export type reportsGetAbuseReportInput = z.infer<
	typeof reportsGetAbuseReportInputSchema
>;

const reportsGetAbuseReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetAbuseReportResponse = z.infer<
	typeof reportsGetAbuseReportResponseSchema
>;

const reportsGetBouncesReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetBouncesReportByEmailIDInput = z.infer<
	typeof reportsGetBouncesReportByEmailIDInputSchema
>;

const reportsGetBouncesReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetBouncesReportByEmailIDResponse = z.infer<
	typeof reportsGetBouncesReportByEmailIDResponseSchema
>;

const reportsGetCampaignEngagementListInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type reportsGetCampaignEngagementListInput = z.infer<
	typeof reportsGetCampaignEngagementListInputSchema
>;

const reportsGetCampaignEngagementListResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetCampaignEngagementListResponse = z.infer<
	typeof reportsGetCampaignEngagementListResponseSchema
>;

const reportsGetCampaignHistoryByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetCampaignHistoryByEmailIDInput = z.infer<
	typeof reportsGetCampaignHistoryByEmailIDInputSchema
>;

const reportsGetCampaignHistoryByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetCampaignHistoryByEmailIDResponse = z.infer<
	typeof reportsGetCampaignHistoryByEmailIDResponseSchema
>;

const reportsGetClickContactCountInputSchema = z.object({});

export type reportsGetClickContactCountInput = z.infer<
	typeof reportsGetClickContactCountInputSchema
>;

const reportsGetClickContactCountResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetClickContactCountResponse = z.infer<
	typeof reportsGetClickContactCountResponseSchema
>;

const reportsGetClickHeatMapByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetClickHeatMapByEmailIDInput = z.infer<
	typeof reportsGetClickHeatMapByEmailIDInputSchema
>;

const reportsGetClickHeatMapByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetClickHeatMapByEmailIDResponse = z.infer<
	typeof reportsGetClickHeatMapByEmailIDResponseSchema
>;

const reportsGetClickPerformanceByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetClickPerformanceByEmailIDInput = z.infer<
	typeof reportsGetClickPerformanceByEmailIDInputSchema
>;

const reportsGetClickPerformanceByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetClickPerformanceByEmailIDResponse = z.infer<
	typeof reportsGetClickPerformanceByEmailIDResponseSchema
>;

const reportsGetClickPerformanceDetailsByEmailInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetClickPerformanceDetailsByEmailInput = z.infer<
	typeof reportsGetClickPerformanceDetailsByEmailInputSchema
>;

const reportsGetClickPerformanceDetailsByEmailResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetClickPerformanceDetailsByEmailResponse = z.infer<
	typeof reportsGetClickPerformanceDetailsByEmailResponseSchema
>;

const reportsGetClickURLContactCountInputSchema = z.object({});

export type reportsGetClickURLContactCountInput = z.infer<
	typeof reportsGetClickURLContactCountInputSchema
>;

const reportsGetClickURLContactCountResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetClickURLContactCountResponse = z.infer<
	typeof reportsGetClickURLContactCountResponseSchema
>;

const reportsGetClicksReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetClicksReportByEmailIDInput = z.infer<
	typeof reportsGetClicksReportByEmailIDInputSchema
>;

const reportsGetClicksReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetClicksReportByEmailIDResponse = z.infer<
	typeof reportsGetClicksReportByEmailIDResponseSchema
>;

const reportsGetContactReportHistoryInputSchema = z.object({
	email: z.string().min(1),
});

export type reportsGetContactReportHistoryInput = z.infer<
	typeof reportsGetContactReportHistoryInputSchema
>;

const reportsGetContactReportHistoryResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetContactReportHistoryResponse = z.infer<
	typeof reportsGetContactReportHistoryResponseSchema
>;

const reportsGetDownloadReportInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type reportsGetDownloadReportInput = z.infer<
	typeof reportsGetDownloadReportInputSchema
>;

const reportsGetDownloadReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetDownloadReportResponse = z.infer<
	typeof reportsGetDownloadReportResponseSchema
>;

const reportsDownloadContactReportInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsDownloadContactReportInput = z.infer<
	typeof reportsDownloadContactReportInputSchema
>;

const reportsDownloadContactReportResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsDownloadContactReportResponse = z.infer<
	typeof reportsDownloadContactReportResponseSchema
>;

const reportsGetEmailOpensByCountryRegionInputSchema = z.object({
	id: z.string().min(1),
	country: z.string().min(1),
	region: z.string().min(1),
});

export type reportsGetEmailOpensByCountryRegionInput = z.infer<
	typeof reportsGetEmailOpensByCountryRegionInputSchema
>;

const reportsGetEmailOpensByCountryRegionResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetEmailOpensByCountryRegionResponse = z.infer<
	typeof reportsGetEmailOpensByCountryRegionResponseSchema
>;

const reportsGetEmailReportInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type reportsGetEmailReportInput = z.infer<
	typeof reportsGetEmailReportInputSchema
>;

const reportsGetEmailReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetEmailReportResponse = z.infer<
	typeof reportsGetEmailReportResponseSchema
>;

const reportsGetEmailReportForwardsInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetEmailReportForwardsInput = z.infer<
	typeof reportsGetEmailReportForwardsInputSchema
>;

const reportsGetEmailReportForwardsResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetEmailReportForwardsResponse = z.infer<
	typeof reportsGetEmailReportForwardsResponseSchema
>;

const reportsGetForwardsReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetForwardsReportByEmailIDInput = z.infer<
	typeof reportsGetForwardsReportByEmailIDInputSchema
>;

const reportsGetForwardsReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetForwardsReportByEmailIDResponse = z.infer<
	typeof reportsGetForwardsReportByEmailIDResponseSchema
>;

const reportsGetLinkDetailByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetLinkDetailByEmailIDInput = z.infer<
	typeof reportsGetLinkDetailByEmailIDInputSchema
>;

const reportsGetLinkDetailByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetLinkDetailByEmailIDResponse = z.infer<
	typeof reportsGetLinkDetailByEmailIDResponseSchema
>;

const reportsGetOpenContactCountInputSchema = z.object({});

export type reportsGetOpenContactCountInput = z.infer<
	typeof reportsGetOpenContactCountInputSchema
>;

const reportsGetOpenContactCountResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetOpenContactCountResponse = z.infer<
	typeof reportsGetOpenContactCountResponseSchema
>;

const reportsGetOpensHourlyReportByEmailInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetOpensHourlyReportByEmailInput = z.infer<
	typeof reportsGetOpensHourlyReportByEmailInputSchema
>;

const reportsGetOpensHourlyReportByEmailResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetOpensHourlyReportByEmailResponse = z.infer<
	typeof reportsGetOpensHourlyReportByEmailResponseSchema
>;

const reportsGetOpensLocationReportInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetOpensLocationReportInput = z.infer<
	typeof reportsGetOpensLocationReportInputSchema
>;

const reportsGetOpensLocationReportResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetOpensLocationReportResponse = z.infer<
	typeof reportsGetOpensLocationReportResponseSchema
>;

const reportsGetOpensLocationReportByEmailInputSchema = z.object({
	id: z.string().min(1),
	countryCode: z.string().min(1),
});

export type reportsGetOpensLocationReportByEmailInput = z.infer<
	typeof reportsGetOpensLocationReportByEmailInputSchema
>;

const reportsGetOpensLocationReportByEmailResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetOpensLocationReportByEmailResponse = z.infer<
	typeof reportsGetOpensLocationReportByEmailResponseSchema
>;

const reportsGetOpensReportInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetOpensReportInput = z.infer<
	typeof reportsGetOpensReportInputSchema
>;

const reportsGetOpensReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetOpensReportResponse = z.infer<
	typeof reportsGetOpensReportResponseSchema
>;

const reportsGetReportDetailsByABTestInputSchema = z.object({
	id: z.string().min(1),
	abID: z.string().min(1),
});

export type reportsGetReportDetailsByABTestInput = z.infer<
	typeof reportsGetReportDetailsByABTestInputSchema
>;

const reportsGetReportDetailsByABTestResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetReportDetailsByABTestResponse = z.infer<
	typeof reportsGetReportDetailsByABTestResponseSchema
>;

const reportsGetReportDetailsByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetReportDetailsByEmailIDInput = z.infer<
	typeof reportsGetReportDetailsByEmailIDInputSchema
>;

const reportsGetReportDetailsByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetReportDetailsByEmailIDResponse = z.infer<
	typeof reportsGetReportDetailsByEmailIDResponseSchema
>;

const reportsGetReportDownloadInputSchema = z.object({
	id: z.string().min(1),
	reportType: z.string().min(1),
});

export type reportsGetReportDownloadInput = z.infer<
	typeof reportsGetReportDownloadInputSchema
>;

const reportsGetReportDownloadResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetReportDownloadResponse = z.infer<
	typeof reportsGetReportDownloadResponseSchema
>;

const reportsGetReportsForAutorespondersInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type reportsGetReportsForAutorespondersInput = z.infer<
	typeof reportsGetReportsForAutorespondersInputSchema
>;

const reportsGetReportsForAutorespondersResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetReportsForAutorespondersResponse = z.infer<
	typeof reportsGetReportsForAutorespondersResponseSchema
>;

const reportsGetSocialPerformanceReportInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetSocialPerformanceReportInput = z.infer<
	typeof reportsGetSocialPerformanceReportInputSchema
>;

const reportsGetSocialPerformanceReportResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetSocialPerformanceReportResponse = z.infer<
	typeof reportsGetSocialPerformanceReportResponseSchema
>;

const reportsGetURLEngagementListInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type reportsGetURLEngagementListInput = z.infer<
	typeof reportsGetURLEngagementListInputSchema
>;

const reportsGetURLEngagementListResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetURLEngagementListResponse = z.infer<
	typeof reportsGetURLEngagementListResponseSchema
>;

const reportsGetURLListByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetURLListByEmailIDInput = z.infer<
	typeof reportsGetURLListByEmailIDInputSchema
>;

const reportsGetURLListByEmailIDResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetURLListByEmailIDResponse = z.infer<
	typeof reportsGetURLListByEmailIDResponseSchema
>;

const reportsGetUnopensReportInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetUnopensReportInput = z.infer<
	typeof reportsGetUnopensReportInputSchema
>;

const reportsGetUnopensReportResponseSchema = BenchmarkReportResponseSchema;

export type reportsGetUnopensReportResponse = z.infer<
	typeof reportsGetUnopensReportResponseSchema
>;

const reportsGetUnopensReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetUnopensReportByEmailIDInput = z.infer<
	typeof reportsGetUnopensReportByEmailIDInputSchema
>;

const reportsGetUnopensReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetUnopensReportByEmailIDResponse = z.infer<
	typeof reportsGetUnopensReportByEmailIDResponseSchema
>;

const reportsGetUnsubscribeReportByEmailIDInputSchema = z.object({
	id: z.string().min(1),
});

export type reportsGetUnsubscribeReportByEmailIDInput = z.infer<
	typeof reportsGetUnsubscribeReportByEmailIDInputSchema
>;

const reportsGetUnsubscribeReportByEmailIDResponseSchema =
	BenchmarkReportResponseSchema;

export type reportsGetUnsubscribeReportByEmailIDResponse = z.infer<
	typeof reportsGetUnsubscribeReportByEmailIDResponseSchema
>;

const reportsGetSaveAsListInputSchema = z.object({});

export type reportsGetSaveAsListInput = z.infer<
	typeof reportsGetSaveAsListInputSchema
>;

const reportsGetSaveAsListResponseSchema = BenchmarkGenericResponseSchema;

export type reportsGetSaveAsListResponse = z.infer<
	typeof reportsGetSaveAsListResponseSchema
>;

const reportsUpdateListCompilationDetailsInputSchema = z.object({
	data: RequestData,
});

export type reportsUpdateListCompilationDetailsInput = z.infer<
	typeof reportsUpdateListCompilationDetailsInputSchema
>;

const reportsUpdateListCompilationDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type reportsUpdateListCompilationDetailsResponse = z.infer<
	typeof reportsUpdateListCompilationDetailsResponseSchema
>;

const signupFormsCopySignupFormInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type signupFormsCopySignupFormInput = z.infer<
	typeof signupFormsCopySignupFormInputSchema
>;

const signupFormsCopySignupFormResponseSchema = BenchmarkGenericResponseSchema;

export type signupFormsCopySignupFormResponse = z.infer<
	typeof signupFormsCopySignupFormResponseSchema
>;

const signupFormsCreateSignupFormInputSchema = z.object({
	data: RequestData,
});

export type signupFormsCreateSignupFormInput = z.infer<
	typeof signupFormsCreateSignupFormInputSchema
>;

const signupFormsCreateSignupFormResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsCreateSignupFormResponse = z.infer<
	typeof signupFormsCreateSignupFormResponseSchema
>;

const signupFormsGetHTMLSignupFormInputSchema = z.object({
	listBuilderID: z.string().min(1),
	data: RequestData,
});

export type signupFormsGetHTMLSignupFormInput = z.infer<
	typeof signupFormsGetHTMLSignupFormInputSchema
>;

const signupFormsGetHTMLSignupFormResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetHTMLSignupFormResponse = z.infer<
	typeof signupFormsGetHTMLSignupFormResponseSchema
>;

const signupFormsGetMagentoHTMLSelectedInputSchema = z.object({
	listBuilderID: z.string().min(1),
});

export type signupFormsGetMagentoHTMLSelectedInput = z.infer<
	typeof signupFormsGetMagentoHTMLSelectedInputSchema
>;

const signupFormsGetMagentoHTMLSelectedResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetMagentoHTMLSelectedResponse = z.infer<
	typeof signupFormsGetMagentoHTMLSelectedResponseSchema
>;

const signupFormsGetMagentoHTMLDropdownInputSchema = z.object({});

export type signupFormsGetMagentoHTMLDropdownInput = z.infer<
	typeof signupFormsGetMagentoHTMLDropdownInputSchema
>;

const signupFormsGetMagentoHTMLDropdownResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetMagentoHTMLDropdownResponse = z.infer<
	typeof signupFormsGetMagentoHTMLDropdownResponseSchema
>;

const signupFormsGetSignupFormButtonCodeInputSchema = z.object({
	id: z.string().min(1),
});

export type signupFormsGetSignupFormButtonCodeInput = z.infer<
	typeof signupFormsGetSignupFormButtonCodeInputSchema
>;

const signupFormsGetSignupFormButtonCodeResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormButtonCodeResponse = z.infer<
	typeof signupFormsGetSignupFormButtonCodeResponseSchema
>;

const signupFormsGetSignupFormContactFieldsInputSchema = z.object({
	id: z.string().min(1),
});

export type signupFormsGetSignupFormContactFieldsInput = z.infer<
	typeof signupFormsGetSignupFormContactFieldsInputSchema
>;

const signupFormsGetSignupFormContactFieldsResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormContactFieldsResponse = z.infer<
	typeof signupFormsGetSignupFormContactFieldsResponseSchema
>;

const signupFormsGetSignupFormDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type signupFormsGetSignupFormDetailsInput = z.infer<
	typeof signupFormsGetSignupFormDetailsInputSchema
>;

const signupFormsGetSignupFormDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormDetailsResponse = z.infer<
	typeof signupFormsGetSignupFormDetailsResponseSchema
>;

const signupFormsGetSignupFormLinkInputSchema = z.object({
	id: z.string().min(1),
});

export type signupFormsGetSignupFormLinkInput = z.infer<
	typeof signupFormsGetSignupFormLinkInputSchema
>;

const signupFormsGetSignupFormLinkResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormLinkResponse = z.infer<
	typeof signupFormsGetSignupFormLinkResponseSchema
>;

const signupFormsGetSignupFormListInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type signupFormsGetSignupFormListInput = z.infer<
	typeof signupFormsGetSignupFormListInputSchema
>;

const signupFormsGetSignupFormListResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormListResponse = z.infer<
	typeof signupFormsGetSignupFormListResponseSchema
>;

const signupFormsGetSignupFormsForContactListInputSchema = z.object({
	listID: z.string().min(1),
});

export type signupFormsGetSignupFormsForContactListInput = z.infer<
	typeof signupFormsGetSignupFormsForContactListInputSchema
>;

const signupFormsGetSignupFormsForContactListResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormsForContactListResponse = z.infer<
	typeof signupFormsGetSignupFormsForContactListResponseSchema
>;

const signupFormsGetSignupFormForUnbounceInputSchema = z.object({});

export type signupFormsGetSignupFormForUnbounceInput = z.infer<
	typeof signupFormsGetSignupFormForUnbounceInputSchema
>;

const signupFormsGetSignupFormForUnbounceResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormForUnbounceResponse = z.infer<
	typeof signupFormsGetSignupFormForUnbounceResponseSchema
>;

const signupFormsGetSignupFormTumblerInputSchema = z.object({});

export type signupFormsGetSignupFormTumblerInput = z.infer<
	typeof signupFormsGetSignupFormTumblerInputSchema
>;

const signupFormsGetSignupFormTumblerResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormTumblerResponse = z.infer<
	typeof signupFormsGetSignupFormTumblerResponseSchema
>;

const signupFormsGetSignupFormForMagentoInputSchema = z.object({});

export type signupFormsGetSignupFormForMagentoInput = z.infer<
	typeof signupFormsGetSignupFormForMagentoInputSchema
>;

const signupFormsGetSignupFormForMagentoResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetSignupFormForMagentoResponse = z.infer<
	typeof signupFormsGetSignupFormForMagentoResponseSchema
>;

const signupFormsGetTemplatesForSignupFormClassicInputSchema = z.object({});

export type signupFormsGetTemplatesForSignupFormClassicInput = z.infer<
	typeof signupFormsGetTemplatesForSignupFormClassicInputSchema
>;

const signupFormsGetTemplatesForSignupFormClassicResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsGetTemplatesForSignupFormClassicResponse = z.infer<
	typeof signupFormsGetTemplatesForSignupFormClassicResponseSchema
>;

const signupFormsGetTumblerListsInputSchema = z.object({});

export type signupFormsGetTumblerListsInput = z.infer<
	typeof signupFormsGetTumblerListsInputSchema
>;

const signupFormsGetTumblerListsResponseSchema = BenchmarkGenericResponseSchema;

export type signupFormsGetTumblerListsResponse = z.infer<
	typeof signupFormsGetTumblerListsResponseSchema
>;

const signupFormsSendTestEmailForSignupFormInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type signupFormsSendTestEmailForSignupFormInput = z.infer<
	typeof signupFormsSendTestEmailForSignupFormInputSchema
>;

const signupFormsSendTestEmailForSignupFormResponseSchema =
	BenchmarkGenericResponseSchema;

export type signupFormsSendTestEmailForSignupFormResponse = z.infer<
	typeof signupFormsSendTestEmailForSignupFormResponseSchema
>;

const surveysDeleteSurveyInputSchema = z.object({
	id: z.string().min(1),
});

export type surveysDeleteSurveyInput = z.infer<
	typeof surveysDeleteSurveyInputSchema
>;

const surveysDeleteSurveyResponseSchema = BenchmarkGenericResponseSchema;

export type surveysDeleteSurveyResponse = z.infer<
	typeof surveysDeleteSurveyResponseSchema
>;

const surveysGetSurveyDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type surveysGetSurveyDetailsInput = z.infer<
	typeof surveysGetSurveyDetailsInputSchema
>;

const surveysGetSurveyDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type surveysGetSurveyDetailsResponse = z.infer<
	typeof surveysGetSurveyDetailsResponseSchema
>;

const surveysGetSurveyTemplateListInputSchema = z.object({});

export type surveysGetSurveyTemplateListInput = z.infer<
	typeof surveysGetSurveyTemplateListInputSchema
>;

const surveysGetSurveyTemplateListResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyTemplateListResponse = z.infer<
	typeof surveysGetSurveyTemplateListResponseSchema
>;

const surveysGetSurveyReportListInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type surveysGetSurveyReportListInput = z.infer<
	typeof surveysGetSurveyReportListInputSchema
>;

const surveysGetSurveyReportListResponseSchema = BenchmarkGenericResponseSchema;

export type surveysGetSurveyReportListResponse = z.infer<
	typeof surveysGetSurveyReportListResponseSchema
>;

const surveysGetSurveyFullReportInputSchema = z.object({
	surveyID: z.string().min(1),
});

export type surveysGetSurveyFullReportInput = z.infer<
	typeof surveysGetSurveyFullReportInputSchema
>;

const surveysGetSurveyFullReportResponseSchema = BenchmarkGenericResponseSchema;

export type surveysGetSurveyFullReportResponse = z.infer<
	typeof surveysGetSurveyFullReportResponseSchema
>;

const surveysGetSurveyIndividualResultsInputSchema = z.object({
	surveyID: z.string().min(1),
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type surveysGetSurveyIndividualResultsInput = z.infer<
	typeof surveysGetSurveyIndividualResultsInputSchema
>;

const surveysGetSurveyIndividualResultsResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyIndividualResultsResponse = z.infer<
	typeof surveysGetSurveyIndividualResultsResponseSchema
>;

const surveysGetSurveyIndividualQuestionResultInputSchema = z.object({
	surveyID: z.string().min(1),
	emailID: z.string().min(1),
});

export type surveysGetSurveyIndividualQuestionResultInput = z.infer<
	typeof surveysGetSurveyIndividualQuestionResultInputSchema
>;

const surveysGetSurveyIndividualQuestionResultResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyIndividualQuestionResultResponse = z.infer<
	typeof surveysGetSurveyIndividualQuestionResultResponseSchema
>;

const surveysGetSurveyReportAnswerTextInputSchema = z.object({
	surveyID: z.string().min(1),
});

export type surveysGetSurveyReportAnswerTextInput = z.infer<
	typeof surveysGetSurveyReportAnswerTextInputSchema
>;

const surveysGetSurveyReportAnswerTextResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyReportAnswerTextResponse = z.infer<
	typeof surveysGetSurveyReportAnswerTextResponseSchema
>;

const surveysGetSurveyReportAnswerCommentInputSchema = z.object({
	surveyID: z.string().min(1),
});

export type surveysGetSurveyReportAnswerCommentInput = z.infer<
	typeof surveysGetSurveyReportAnswerCommentInputSchema
>;

const surveysGetSurveyReportAnswerCommentResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyReportAnswerCommentResponse = z.infer<
	typeof surveysGetSurveyReportAnswerCommentResponseSchema
>;

const surveysGetSurveyReportAnswerOtherInputSchema = z.object({
	surveyID: z.string().min(1),
});

export type surveysGetSurveyReportAnswerOtherInput = z.infer<
	typeof surveysGetSurveyReportAnswerOtherInputSchema
>;

const surveysGetSurveyReportAnswerOtherResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyReportAnswerOtherResponse = z.infer<
	typeof surveysGetSurveyReportAnswerOtherResponseSchema
>;

const surveysGetSurveyReportDetailInputSchema = z.object({
	surveyID: z.string().min(1),
});

export type surveysGetSurveyReportDetailInput = z.infer<
	typeof surveysGetSurveyReportDetailInputSchema
>;

const surveysGetSurveyReportDetailResponseSchema =
	BenchmarkGenericResponseSchema;

export type surveysGetSurveyReportDetailResponse = z.infer<
	typeof surveysGetSurveyReportDetailResponseSchema
>;

const surveysUpdateSurveyStatusInputSchema = z.object({
	id: z.string().min(1),
	status: z.string().min(1),
	data: RequestData,
});

export type surveysUpdateSurveyStatusInput = z.infer<
	typeof surveysUpdateSurveyStatusInputSchema
>;

const surveysUpdateSurveyStatusResponseSchema = BenchmarkGenericResponseSchema;

export type surveysUpdateSurveyStatusResponse = z.infer<
	typeof surveysUpdateSurveyStatusResponseSchema
>;

const pollsCopyPollInputSchema = z.object({
	pollID: z.string().min(1),
	data: RequestData,
});

export type pollsCopyPollInput = z.infer<typeof pollsCopyPollInputSchema>;

const pollsCopyPollResponseSchema = BenchmarkGenericResponseSchema;

export type pollsCopyPollResponse = z.infer<typeof pollsCopyPollResponseSchema>;

const pollsCreatePollInputSchema = z.object({
	data: RequestData,
});

export type pollsCreatePollInput = z.infer<typeof pollsCreatePollInputSchema>;

const pollsCreatePollResponseSchema = BenchmarkGenericResponseSchema;

export type pollsCreatePollResponse = z.infer<
	typeof pollsCreatePollResponseSchema
>;

const pollsDeletePollInputSchema = z.object({
	pollID: z.string().min(1),
});

export type pollsDeletePollInput = z.infer<typeof pollsDeletePollInputSchema>;

const pollsDeletePollResponseSchema = BenchmarkGenericResponseSchema;

export type pollsDeletePollResponse = z.infer<
	typeof pollsDeletePollResponseSchema
>;

const pollsGetPollDetailsInputSchema = z.object({
	pollID: z.string().min(1),
});

export type pollsGetPollDetailsInput = z.infer<
	typeof pollsGetPollDetailsInputSchema
>;

const pollsGetPollDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type pollsGetPollDetailsResponse = z.infer<
	typeof pollsGetPollDetailsResponseSchema
>;

const pollsGetPollsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type pollsGetPollsInput = z.infer<typeof pollsGetPollsInputSchema>;

const pollsGetPollsResponseSchema = BenchmarkGenericResponseSchema;

export type pollsGetPollsResponse = z.infer<typeof pollsGetPollsResponseSchema>;

const pollsGetPollPreviewInputSchema = z.object({
	pollID: z.string().min(1),
});

export type pollsGetPollPreviewInput = z.infer<
	typeof pollsGetPollPreviewInputSchema
>;

const pollsGetPollPreviewResponseSchema = BenchmarkGenericResponseSchema;

export type pollsGetPollPreviewResponse = z.infer<
	typeof pollsGetPollPreviewResponseSchema
>;

const pollsGetPollResponseReportInputSchema = z.object({
	pollID: z.string().min(1),
});

export type pollsGetPollResponseReportInput = z.infer<
	typeof pollsGetPollResponseReportInputSchema
>;

const pollsGetPollResponseReportResponseSchema = BenchmarkGenericResponseSchema;

export type pollsGetPollResponseReportResponse = z.infer<
	typeof pollsGetPollResponseReportResponseSchema
>;

const pollsUpdatePollInputSchema = z.object({
	pollID: z.string().min(1),
	data: RequestData,
});

export type pollsUpdatePollInput = z.infer<typeof pollsUpdatePollInputSchema>;

const pollsUpdatePollResponseSchema = BenchmarkGenericResponseSchema;

export type pollsUpdatePollResponse = z.infer<
	typeof pollsUpdatePollResponseSchema
>;

const mediaDeleteImageInputSchema = z.object({
	imageID: z.string().min(1),
});

export type mediaDeleteImageInput = z.infer<typeof mediaDeleteImageInputSchema>;

const mediaDeleteImageResponseSchema = BenchmarkGenericResponseSchema;

export type mediaDeleteImageResponse = z.infer<
	typeof mediaDeleteImageResponseSchema
>;

const mediaDeleteVideoInputSchema = z.object({
	videoID: z.string().min(1),
});

export type mediaDeleteVideoInput = z.infer<typeof mediaDeleteVideoInputSchema>;

const mediaDeleteVideoResponseSchema = BenchmarkGenericResponseSchema;

export type mediaDeleteVideoResponse = z.infer<
	typeof mediaDeleteVideoResponseSchema
>;

const mediaGetVideoDetailsInputSchema = z.object({
	videoID: z.string().min(1),
});

export type mediaGetVideoDetailsInput = z.infer<
	typeof mediaGetVideoDetailsInputSchema
>;

const mediaGetVideoDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetVideoDetailsResponse = z.infer<
	typeof mediaGetVideoDetailsResponseSchema
>;

const mediaGetImagesInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type mediaGetImagesInput = z.infer<typeof mediaGetImagesInputSchema>;

const mediaGetImagesResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetImagesResponse = z.infer<
	typeof mediaGetImagesResponseSchema
>;

const mediaGetImageDetailsInputSchema = z.object({
	imageID: z.string().min(1),
});

export type mediaGetImageDetailsInput = z.infer<
	typeof mediaGetImageDetailsInputSchema
>;

const mediaGetImageDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetImageDetailsResponse = z.infer<
	typeof mediaGetImageDetailsResponseSchema
>;

const mediaGetGiphyImagesInputSchema = z.object({});

export type mediaGetGiphyImagesInput = z.infer<
	typeof mediaGetGiphyImagesInputSchema
>;

const mediaGetGiphyImagesResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetGiphyImagesResponse = z.infer<
	typeof mediaGetGiphyImagesResponseSchema
>;

const mediaShareVideoInputSchema = z.object({
	videoID: z.string().min(1),
	data: RequestData,
});

export type mediaShareVideoInput = z.infer<typeof mediaShareVideoInputSchema>;

const mediaShareVideoResponseSchema = BenchmarkGenericResponseSchema;

export type mediaShareVideoResponse = z.infer<
	typeof mediaShareVideoResponseSchema
>;

const mediaUploadVideoInputSchema = z.object({
	data: RequestData,
});

export type mediaUploadVideoInput = z.infer<typeof mediaUploadVideoInputSchema>;

const mediaUploadVideoResponseSchema = BenchmarkGenericResponseSchema;

export type mediaUploadVideoResponse = z.infer<
	typeof mediaUploadVideoResponseSchema
>;

const mediaCreateInboxInputSchema = z.object({
	data: RequestData,
});

export type mediaCreateInboxInput = z.infer<typeof mediaCreateInboxInputSchema>;

const mediaCreateInboxResponseSchema = BenchmarkGenericResponseSchema;

export type mediaCreateInboxResponse = z.infer<
	typeof mediaCreateInboxResponseSchema
>;

const mediaDeleteInboxInputSchema = z.object({
	id: z.string().min(1),
});

export type mediaDeleteInboxInput = z.infer<typeof mediaDeleteInboxInputSchema>;

const mediaDeleteInboxResponseSchema = BenchmarkGenericResponseSchema;

export type mediaDeleteInboxResponse = z.infer<
	typeof mediaDeleteInboxResponseSchema
>;

const mediaGetInboxListInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type mediaGetInboxListInput = z.infer<
	typeof mediaGetInboxListInputSchema
>;

const mediaGetInboxListResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetInboxListResponse = z.infer<
	typeof mediaGetInboxListResponseSchema
>;

const mediaGetInboxMasterResultInputSchema = z.object({
	id: z.string().min(1),
});

export type mediaGetInboxMasterResultInput = z.infer<
	typeof mediaGetInboxMasterResultInputSchema
>;

const mediaGetInboxMasterResultResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetInboxMasterResultResponse = z.infer<
	typeof mediaGetInboxMasterResultResponseSchema
>;

const mediaGetInboxDetailResultInputSchema = z.object({});

export type mediaGetInboxDetailResultInput = z.infer<
	typeof mediaGetInboxDetailResultInputSchema
>;

const mediaGetInboxDetailResultResponseSchema = BenchmarkGenericResponseSchema;

export type mediaGetInboxDetailResultResponse = z.infer<
	typeof mediaGetInboxDetailResultResponseSchema
>;

const accountAddRemoveInboxTestsFromSubAccountInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type accountAddRemoveInboxTestsFromSubAccountInput = z.infer<
	typeof accountAddRemoveInboxTestsFromSubAccountInputSchema
>;

const accountAddRemoveInboxTestsFromSubAccountResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountAddRemoveInboxTestsFromSubAccountResponse = z.infer<
	typeof accountAddRemoveInboxTestsFromSubAccountResponseSchema
>;

const accountCopyImageToSubAccountInputSchema = z.object({
	imageID: z.string().min(1),
	data: RequestData,
});

export type accountCopyImageToSubAccountInput = z.infer<
	typeof accountCopyImageToSubAccountInputSchema
>;

const accountCopyImageToSubAccountResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountCopyImageToSubAccountResponse = z.infer<
	typeof accountCopyImageToSubAccountResponseSchema
>;

const accountDeleteLinkedAgencyAccountInputSchema = z.object({
	id: z.string().min(1),
});

export type accountDeleteLinkedAgencyAccountInput = z.infer<
	typeof accountDeleteLinkedAgencyAccountInputSchema
>;

const accountDeleteLinkedAgencyAccountResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountDeleteLinkedAgencyAccountResponse = z.infer<
	typeof accountDeleteLinkedAgencyAccountResponseSchema
>;

const accountGetCommissionListInputSchema = z.object({});

export type accountGetCommissionListInput = z.infer<
	typeof accountGetCommissionListInputSchema
>;

const accountGetCommissionListResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetCommissionListResponse = z.infer<
	typeof accountGetCommissionListResponseSchema
>;

const accountGetLinkedAgencyAccountDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type accountGetLinkedAgencyAccountDetailsInput = z.infer<
	typeof accountGetLinkedAgencyAccountDetailsInputSchema
>;

const accountGetLinkedAgencyAccountDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetLinkedAgencyAccountDetailsResponse = z.infer<
	typeof accountGetLinkedAgencyAccountDetailsResponseSchema
>;

const accountGetLinkedAgencyAccountsInputSchema = z.object({});

export type accountGetLinkedAgencyAccountsInput = z.infer<
	typeof accountGetLinkedAgencyAccountsInputSchema
>;

const accountGetLinkedAgencyAccountsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetLinkedAgencyAccountsResponse = z.infer<
	typeof accountGetLinkedAgencyAccountsResponseSchema
>;

const accountGetPartnerProfileDetailsInputSchema = z.object({});

export type accountGetPartnerProfileDetailsInput = z.infer<
	typeof accountGetPartnerProfileDetailsInputSchema
>;

const accountGetPartnerProfileDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetPartnerProfileDetailsResponse = z.infer<
	typeof accountGetPartnerProfileDetailsResponseSchema
>;

const accountGetReferralsListInputSchema = z.object({});

export type accountGetReferralsListInput = z.infer<
	typeof accountGetReferralsListInputSchema
>;

const accountGetReferralsListResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetReferralsListResponse = z.infer<
	typeof accountGetReferralsListResponseSchema
>;

const accountGetSubAccountHistoryInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type accountGetSubAccountHistoryInput = z.infer<
	typeof accountGetSubAccountHistoryInputSchema
>;

const accountGetSubAccountHistoryResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetSubAccountHistoryResponse = z.infer<
	typeof accountGetSubAccountHistoryResponseSchema
>;

const accountGetSubAccountsInputSchema = z.object({
	page: PaginationQuery.page,
	pageSize: PaginationQuery.pageSize,
});

export type accountGetSubAccountsInput = z.infer<
	typeof accountGetSubAccountsInputSchema
>;

const accountGetSubAccountsResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetSubAccountsResponse = z.infer<
	typeof accountGetSubAccountsResponseSchema
>;

const accountGetSubAccountsPlanListInputSchema = z.object({
	id: z.string().min(1),
});

export type accountGetSubAccountsPlanListInput = z.infer<
	typeof accountGetSubAccountsPlanListInputSchema
>;

const accountGetSubAccountsPlanListResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetSubAccountsPlanListResponse = z.infer<
	typeof accountGetSubAccountsPlanListResponseSchema
>;

const accountGetReferralsLevel1ListInputSchema = z.object({});

export type accountGetReferralsLevel1ListInput = z.infer<
	typeof accountGetReferralsLevel1ListInputSchema
>;

const accountGetReferralsLevel1ListResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetReferralsLevel1ListResponse = z.infer<
	typeof accountGetReferralsLevel1ListResponseSchema
>;

const accountGetSubAccountBalanceInputSchema = z.object({
	id: z.string().min(1),
});

export type accountGetSubAccountBalanceInput = z.infer<
	typeof accountGetSubAccountBalanceInputSchema
>;

const accountGetSubAccountBalanceResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetSubAccountBalanceResponse = z.infer<
	typeof accountGetSubAccountBalanceResponseSchema
>;

const accountGetSubAccountDetailsInputSchema = z.object({
	id: z.string().min(1),
});

export type accountGetSubAccountDetailsInput = z.infer<
	typeof accountGetSubAccountDetailsInputSchema
>;

const accountGetSubAccountDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetSubAccountDetailsResponse = z.infer<
	typeof accountGetSubAccountDetailsResponseSchema
>;

const accountGetSubAccountHistoryDetailsInputSchema = z.object({
	historyID: z.string().min(1),
});

export type accountGetSubAccountHistoryDetailsInput = z.infer<
	typeof accountGetSubAccountHistoryDetailsInputSchema
>;

const accountGetSubAccountHistoryDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetSubAccountHistoryDetailsResponse = z.infer<
	typeof accountGetSubAccountHistoryDetailsResponseSchema
>;

const accountLinkAgencyAccountInputSchema = z.object({
	data: RequestData,
});

export type accountLinkAgencyAccountInput = z.infer<
	typeof accountLinkAgencyAccountInputSchema
>;

const accountLinkAgencyAccountResponseSchema = BenchmarkGenericResponseSchema;

export type accountLinkAgencyAccountResponse = z.infer<
	typeof accountLinkAgencyAccountResponseSchema
>;

const accountShareListsWithSubAccountsInputSchema = z.object({
	listID: z.string().min(1),
	clientIDs: z.string().min(1),
	data: RequestData,
});

export type accountShareListsWithSubAccountsInput = z.infer<
	typeof accountShareListsWithSubAccountsInputSchema
>;

const accountShareListsWithSubAccountsResponseSchema =
	BenchmarkListResponseSchema;

export type accountShareListsWithSubAccountsResponse = z.infer<
	typeof accountShareListsWithSubAccountsResponseSchema
>;

const accountUpdateLinkedAgencyAccountInputSchema = z.object({
	id: z.string().min(1),
	data: RequestData,
});

export type accountUpdateLinkedAgencyAccountInput = z.infer<
	typeof accountUpdateLinkedAgencyAccountInputSchema
>;

const accountUpdateLinkedAgencyAccountResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountUpdateLinkedAgencyAccountResponse = z.infer<
	typeof accountUpdateLinkedAgencyAccountResponseSchema
>;

const accountUpdatePartnerProfileInputSchema = z.object({
	data: RequestData,
});

export type accountUpdatePartnerProfileInput = z.infer<
	typeof accountUpdatePartnerProfileInputSchema
>;

const accountUpdatePartnerProfileResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountUpdatePartnerProfileResponse = z.infer<
	typeof accountUpdatePartnerProfileResponseSchema
>;

const accountChangePasswordInputSchema = z.object({
	data: RequestData,
});

export type accountChangePasswordInput = z.infer<
	typeof accountChangePasswordInputSchema
>;

const accountChangePasswordResponseSchema = BenchmarkGenericResponseSchema;

export type accountChangePasswordResponse = z.infer<
	typeof accountChangePasswordResponseSchema
>;

const accountChangeSecurityPINInputSchema = z.object({
	data: RequestData,
});

export type accountChangeSecurityPINInput = z.infer<
	typeof accountChangeSecurityPINInputSchema
>;

const accountChangeSecurityPINResponseSchema = BenchmarkGenericResponseSchema;

export type accountChangeSecurityPINResponse = z.infer<
	typeof accountChangeSecurityPINResponseSchema
>;

const accountCheckIfResponsiveInputSchema = z.object({});

export type accountCheckIfResponsiveInput = z.infer<
	typeof accountCheckIfResponsiveInputSchema
>;

const accountCheckIfResponsiveResponseSchema = BenchmarkGenericResponseSchema;

export type accountCheckIfResponsiveResponse = z.infer<
	typeof accountCheckIfResponsiveResponseSchema
>;

const accountDisableSecurityPINInputSchema = z.object({
	data: RequestData,
});

export type accountDisableSecurityPINInput = z.infer<
	typeof accountDisableSecurityPINInputSchema
>;

const accountDisableSecurityPINResponseSchema = BenchmarkGenericResponseSchema;

export type accountDisableSecurityPINResponse = z.infer<
	typeof accountDisableSecurityPINResponseSchema
>;

const accountGetAllConfirmedEmailsInputSchema = z.object({});

export type accountGetAllConfirmedEmailsInput = z.infer<
	typeof accountGetAllConfirmedEmailsInputSchema
>;

const accountGetAllConfirmedEmailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetAllConfirmedEmailsResponse = z.infer<
	typeof accountGetAllConfirmedEmailsResponseSchema
>;

const accountGetClientAccountSettingsInputSchema = z.object({});

export type accountGetClientAccountSettingsInput = z.infer<
	typeof accountGetClientAccountSettingsInputSchema
>;

const accountGetClientAccountSettingsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetClientAccountSettingsResponse = z.infer<
	typeof accountGetClientAccountSettingsResponseSchema
>;

const accountGetClientPlanInformationInputSchema = z.object({});

export type accountGetClientPlanInformationInput = z.infer<
	typeof accountGetClientPlanInformationInputSchema
>;

const accountGetClientPlanInformationResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetClientPlanInformationResponse = z.infer<
	typeof accountGetClientPlanInformationResponseSchema
>;

const accountGetCurrentEmailAtTimeOfResetInputSchema = z.object({
	guid: SearchQuery.guid,
});

export type accountGetCurrentEmailAtTimeOfResetInput = z.infer<
	typeof accountGetCurrentEmailAtTimeOfResetInputSchema
>;

const accountGetCurrentEmailAtTimeOfResetResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetCurrentEmailAtTimeOfResetResponse = z.infer<
	typeof accountGetCurrentEmailAtTimeOfResetResponseSchema
>;

const accountGetDMARCListInputSchema = z.object({});

export type accountGetDMARCListInput = z.infer<
	typeof accountGetDMARCListInputSchema
>;

const accountGetDMARCListResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetDMARCListResponse = z.infer<
	typeof accountGetDMARCListResponseSchema
>;

const accountGetListOfConfirmedEmailsInputSchema = z.object({});

export type accountGetListOfConfirmedEmailsInput = z.infer<
	typeof accountGetListOfConfirmedEmailsInputSchema
>;

const accountGetListOfConfirmedEmailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetListOfConfirmedEmailsResponse = z.infer<
	typeof accountGetListOfConfirmedEmailsResponseSchema
>;

const accountGetClientDetailsInputSchema = z.object({});

export type accountGetClientDetailsInput = z.infer<
	typeof accountGetClientDetailsInputSchema
>;

const accountGetClientDetailsResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetClientDetailsResponse = z.infer<
	typeof accountGetClientDetailsResponseSchema
>;

const accountGetClientFilterDomainInputSchema = z.object({});

export type accountGetClientFilterDomainInput = z.infer<
	typeof accountGetClientFilterDomainInputSchema
>;

const accountGetClientFilterDomainResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetClientFilterDomainResponse = z.infer<
	typeof accountGetClientFilterDomainResponseSchema
>;

const accountGetClientProfileDetailsInputSchema = z.object({});

export type accountGetClientProfileDetailsInput = z.infer<
	typeof accountGetClientProfileDetailsInputSchema
>;

const accountGetClientProfileDetailsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetClientProfileDetailsResponse = z.infer<
	typeof accountGetClientProfileDetailsResponseSchema
>;

const accountGetClientsRatingRangeInputSchema = z.object({});

export type accountGetClientsRatingRangeInput = z.infer<
	typeof accountGetClientsRatingRangeInputSchema
>;

const accountGetClientsRatingRangeResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGetClientsRatingRangeResponse = z.infer<
	typeof accountGetClientsRatingRangeResponseSchema
>;

const accountLoginRedirectUsingTokenInputSchema = z.object({
	data: RequestData,
});

export type accountLoginRedirectUsingTokenInput = z.infer<
	typeof accountLoginRedirectUsingTokenInputSchema
>;

const accountLoginRedirectUsingTokenResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountLoginRedirectUsingTokenResponse = z.infer<
	typeof accountLoginRedirectUsingTokenResponseSchema
>;

const accountPatchUpdateClientSettingsInputSchema = z.object({
	data: RequestData,
});

export type accountPatchUpdateClientSettingsInput = z.infer<
	typeof accountPatchUpdateClientSettingsInputSchema
>;

const accountPatchUpdateClientSettingsResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountPatchUpdateClientSettingsResponse = z.infer<
	typeof accountPatchUpdateClientSettingsResponseSchema
>;

const accountResendConfirmEmailInputSchema = z.object({
	email: z.string().min(1),
});

export type accountResendConfirmEmailInput = z.infer<
	typeof accountResendConfirmEmailInputSchema
>;

const accountResendConfirmEmailResponseSchema = BenchmarkGenericResponseSchema;

export type accountResendConfirmEmailResponse = z.infer<
	typeof accountResendConfirmEmailResponseSchema
>;

const accountSaveSecurityPINInputSchema = z.object({
	data: RequestData,
});

export type accountSaveSecurityPINInput = z.infer<
	typeof accountSaveSecurityPINInputSchema
>;

const accountSaveSecurityPINResponseSchema = BenchmarkGenericResponseSchema;

export type accountSaveSecurityPINResponse = z.infer<
	typeof accountSaveSecurityPINResponseSchema
>;

const accountSaveWebsiteDomainInputSchema = z.object({
	data: RequestData,
});

export type accountSaveWebsiteDomainInput = z.infer<
	typeof accountSaveWebsiteDomainInputSchema
>;

const accountSaveWebsiteDomainResponseSchema = BenchmarkGenericResponseSchema;

export type accountSaveWebsiteDomainResponse = z.infer<
	typeof accountSaveWebsiteDomainResponseSchema
>;

const accountSendPINViaEmailInputSchema = z.object({
	data: RequestData,
});

export type accountSendPINViaEmailInput = z.infer<
	typeof accountSendPINViaEmailInputSchema
>;

const accountSendPINViaEmailResponseSchema = BenchmarkGenericResponseSchema;

export type accountSendPINViaEmailResponse = z.infer<
	typeof accountSendPINViaEmailResponseSchema
>;

const accountSendResetEmailInputSchema = z.object({
	data: RequestData,
});

export type accountSendResetEmailInput = z.infer<
	typeof accountSendResetEmailInputSchema
>;

const accountSendResetEmailResponseSchema = BenchmarkGenericResponseSchema;

export type accountSendResetEmailResponse = z.infer<
	typeof accountSendResetEmailResponseSchema
>;

const accountSetResponsiveInputSchema = z.object({
	data: RequestData,
});

export type accountSetResponsiveInput = z.infer<
	typeof accountSetResponsiveInputSchema
>;

const accountSetResponsiveResponseSchema = BenchmarkGenericResponseSchema;

export type accountSetResponsiveResponse = z.infer<
	typeof accountSetResponsiveResponseSchema
>;

const accountUpdateEditProfileInputSchema = z.object({
	data: RequestData,
});

export type accountUpdateEditProfileInput = z.infer<
	typeof accountUpdateEditProfileInputSchema
>;

const accountUpdateEditProfileResponseSchema = BenchmarkGenericResponseSchema;

export type accountUpdateEditProfileResponse = z.infer<
	typeof accountUpdateEditProfileResponseSchema
>;

const accountUpdateResetEmailInputSchema = z.object({
	data: RequestData,
});

export type accountUpdateResetEmailInput = z.infer<
	typeof accountUpdateResetEmailInputSchema
>;

const accountUpdateResetEmailResponseSchema = BenchmarkGenericResponseSchema;

export type accountUpdateResetEmailResponse = z.infer<
	typeof accountUpdateResetEmailResponseSchema
>;

const accountGetNotificationInputSchema = z.object({});

export type accountGetNotificationInput = z.infer<
	typeof accountGetNotificationInputSchema
>;

const accountGetNotificationResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetNotificationResponse = z.infer<
	typeof accountGetNotificationResponseSchema
>;

const accountGetWebPageAdsDetailInputSchema = z.object({});

export type accountGetWebPageAdsDetailInput = z.infer<
	typeof accountGetWebPageAdsDetailInputSchema
>;

const accountGetWebPageAdsDetailResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetWebPageAdsDetailResponse = z.infer<
	typeof accountGetWebPageAdsDetailResponseSchema
>;

const accountGetHelpTopicsInputSchema = z.object({});

export type accountGetHelpTopicsInput = z.infer<
	typeof accountGetHelpTopicsInputSchema
>;

const accountGetHelpTopicsResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetHelpTopicsResponse = z.infer<
	typeof accountGetHelpTopicsResponseSchema
>;

const accountGenerateSupportTicketInputSchema = z.object({
	data: RequestData,
});

export type accountGenerateSupportTicketInput = z.infer<
	typeof accountGenerateSupportTicketInputSchema
>;

const accountGenerateSupportTicketResponseSchema =
	BenchmarkGenericResponseSchema;

export type accountGenerateSupportTicketResponse = z.infer<
	typeof accountGenerateSupportTicketResponseSchema
>;

const accountSendSupportFeedbackInputSchema = z.object({
	data: RequestData,
});

export type accountSendSupportFeedbackInput = z.infer<
	typeof accountSendSupportFeedbackInputSchema
>;

const accountSendSupportFeedbackResponseSchema = BenchmarkGenericResponseSchema;

export type accountSendSupportFeedbackResponse = z.infer<
	typeof accountSendSupportFeedbackResponseSchema
>;

const accountGetCommunityDomainInputSchema = z.object({});

export type accountGetCommunityDomainInput = z.infer<
	typeof accountGetCommunityDomainInputSchema
>;

const accountGetCommunityDomainResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetCommunityDomainResponse = z.infer<
	typeof accountGetCommunityDomainResponseSchema
>;

const accountGetAccountSummaryInputSchema = z.object({});

export type accountGetAccountSummaryInput = z.infer<
	typeof accountGetAccountSummaryInputSchema
>;

const accountGetAccountSummaryResponseSchema = BenchmarkGenericResponseSchema;

export type accountGetAccountSummaryResponse = z.infer<
	typeof accountGetAccountSummaryResponseSchema
>;

const integrationsAssignProductToListInputSchema = z.object({
	data: RequestData,
});

export type integrationsAssignProductToListInput = z.infer<
	typeof integrationsAssignProductToListInputSchema
>;

const integrationsAssignProductToListResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsAssignProductToListResponse = z.infer<
	typeof integrationsAssignProductToListResponseSchema
>;

const integrationsConfigureShopifyPurchaseListInputSchema = z.object({
	data: RequestData,
});

export type integrationsConfigureShopifyPurchaseListInput = z.infer<
	typeof integrationsConfigureShopifyPurchaseListInputSchema
>;

const integrationsConfigureShopifyPurchaseListResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsConfigureShopifyPurchaseListResponse = z.infer<
	typeof integrationsConfigureShopifyPurchaseListResponseSchema
>;

const integrationsConnectServiceInputSchema = z.object({
	site: z.string().min(1),
	data: RequestData,
});

export type integrationsConnectServiceInput = z.infer<
	typeof integrationsConnectServiceInputSchema
>;

const integrationsConnectServiceResponseSchema = BenchmarkGenericResponseSchema;

export type integrationsConnectServiceResponse = z.infer<
	typeof integrationsConnectServiceResponseSchema
>;

const integrationsDeleteProductAssociationInputSchema = z.object({
	productCode: z.string().min(1),
});

export type integrationsDeleteProductAssociationInput = z.infer<
	typeof integrationsDeleteProductAssociationInputSchema
>;

const integrationsDeleteProductAssociationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDeleteProductAssociationResponse = z.infer<
	typeof integrationsDeleteProductAssociationResponseSchema
>;

const integrationsDisconnectEtsyIntegrationInputSchema = z.object({});

export type integrationsDisconnectEtsyIntegrationInput = z.infer<
	typeof integrationsDisconnectEtsyIntegrationInputSchema
>;

const integrationsDisconnectEtsyIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectEtsyIntegrationResponse = z.infer<
	typeof integrationsDisconnectEtsyIntegrationResponseSchema
>;

const integrationsDisconnectEventbriteIntegrationInputSchema = z.object({});

export type integrationsDisconnectEventbriteIntegrationInput = z.infer<
	typeof integrationsDisconnectEventbriteIntegrationInputSchema
>;

const integrationsDisconnectEventbriteIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectEventbriteIntegrationResponse = z.infer<
	typeof integrationsDisconnectEventbriteIntegrationResponseSchema
>;

const integrationsDisconnectFacebookEventsInputSchema = z.object({});

export type integrationsDisconnectFacebookEventsInput = z.infer<
	typeof integrationsDisconnectFacebookEventsInputSchema
>;

const integrationsDisconnectFacebookEventsResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectFacebookEventsResponse = z.infer<
	typeof integrationsDisconnectFacebookEventsResponseSchema
>;

const integrationsDisconnectFacebookIntegrationInputSchema = z.object({});

export type integrationsDisconnectFacebookIntegrationInput = z.infer<
	typeof integrationsDisconnectFacebookIntegrationInputSchema
>;

const integrationsDisconnectFacebookIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectFacebookIntegrationResponse = z.infer<
	typeof integrationsDisconnectFacebookIntegrationResponseSchema
>;

const integrationsDisconnectInstagramIntegrationInputSchema = z.object({});

export type integrationsDisconnectInstagramIntegrationInput = z.infer<
	typeof integrationsDisconnectInstagramIntegrationInputSchema
>;

const integrationsDisconnectInstagramIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectInstagramIntegrationResponse = z.infer<
	typeof integrationsDisconnectInstagramIntegrationResponseSchema
>;

const integrationsDisconnectLinkedInIntegrationInputSchema = z.object({});

export type integrationsDisconnectLinkedInIntegrationInput = z.infer<
	typeof integrationsDisconnectLinkedInIntegrationInputSchema
>;

const integrationsDisconnectLinkedInIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectLinkedInIntegrationResponse = z.infer<
	typeof integrationsDisconnectLinkedInIntegrationResponseSchema
>;

const integrationsDisconnectPinterestConnectionInputSchema = z.object({});

export type integrationsDisconnectPinterestConnectionInput = z.infer<
	typeof integrationsDisconnectPinterestConnectionInputSchema
>;

const integrationsDisconnectPinterestConnectionResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectPinterestConnectionResponse = z.infer<
	typeof integrationsDisconnectPinterestConnectionResponseSchema
>;

const integrationsDisconnectSalesforceIntegrationInputSchema = z.object({});

export type integrationsDisconnectSalesforceIntegrationInput = z.infer<
	typeof integrationsDisconnectSalesforceIntegrationInputSchema
>;

const integrationsDisconnectSalesforceIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectSalesforceIntegrationResponse = z.infer<
	typeof integrationsDisconnectSalesforceIntegrationResponseSchema
>;

const integrationsDisconnectShopifyInputSchema = z.object({});

export type integrationsDisconnectShopifyInput = z.infer<
	typeof integrationsDisconnectShopifyInputSchema
>;

const integrationsDisconnectShopifyResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectShopifyResponse = z.infer<
	typeof integrationsDisconnectShopifyResponseSchema
>;

const integrationsDisconnectTwitterIntegrationInputSchema = z.object({});

export type integrationsDisconnectTwitterIntegrationInput = z.infer<
	typeof integrationsDisconnectTwitterIntegrationInputSchema
>;

const integrationsDisconnectTwitterIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectTwitterIntegrationResponse = z.infer<
	typeof integrationsDisconnectTwitterIntegrationResponseSchema
>;

const integrationsDisconnectEbayIntegrationInputSchema = z.object({});

export type integrationsDisconnectEbayIntegrationInput = z.infer<
	typeof integrationsDisconnectEbayIntegrationInputSchema
>;

const integrationsDisconnectEbayIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsDisconnectEbayIntegrationResponse = z.infer<
	typeof integrationsDisconnectEbayIntegrationResponseSchema
>;

const integrationsLogOutTwitterTweetsInputSchema = z.object({});

export type integrationsLogOutTwitterTweetsInput = z.infer<
	typeof integrationsLogOutTwitterTweetsInputSchema
>;

const integrationsLogOutTwitterTweetsResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsLogOutTwitterTweetsResponse = z.infer<
	typeof integrationsLogOutTwitterTweetsResponseSchema
>;

const integrationsGetContactListsForShopifyInputSchema = z.object({});

export type integrationsGetContactListsForShopifyInput = z.infer<
	typeof integrationsGetContactListsForShopifyInputSchema
>;

const integrationsGetContactListsForShopifyResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetContactListsForShopifyResponse = z.infer<
	typeof integrationsGetContactListsForShopifyResponseSchema
>;

const integrationsGetDigiohUsernameInputSchema = z.object({});

export type integrationsGetDigiohUsernameInput = z.infer<
	typeof integrationsGetDigiohUsernameInputSchema
>;

const integrationsGetDigiohUsernameResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetDigiohUsernameResponse = z.infer<
	typeof integrationsGetDigiohUsernameResponseSchema
>;

const integrationsGetEtsyStoreNameInputSchema = z.object({});

export type integrationsGetEtsyStoreNameInput = z.infer<
	typeof integrationsGetEtsyStoreNameInputSchema
>;

const integrationsGetEtsyStoreNameResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetEtsyStoreNameResponse = z.infer<
	typeof integrationsGetEtsyStoreNameResponseSchema
>;

const integrationsGetEventbriteUsernameInputSchema = z.object({});

export type integrationsGetEventbriteUsernameInput = z.infer<
	typeof integrationsGetEventbriteUsernameInputSchema
>;

const integrationsGetEventbriteUsernameResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetEventbriteUsernameResponse = z.infer<
	typeof integrationsGetEventbriteUsernameResponseSchema
>;

const integrationsGetFacebookAccountHolderInputSchema = z.object({});

export type integrationsGetFacebookAccountHolderInput = z.infer<
	typeof integrationsGetFacebookAccountHolderInputSchema
>;

const integrationsGetFacebookAccountHolderResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetFacebookAccountHolderResponse = z.infer<
	typeof integrationsGetFacebookAccountHolderResponseSchema
>;

const integrationsGetFacebookAccountNameInputSchema = z.object({});

export type integrationsGetFacebookAccountNameInput = z.infer<
	typeof integrationsGetFacebookAccountNameInputSchema
>;

const integrationsGetFacebookAccountNameResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetFacebookAccountNameResponse = z.infer<
	typeof integrationsGetFacebookAccountNameResponseSchema
>;

const integrationsGetIntegrationAuthURLInputSchema = z.object({
	site: z.string().min(1),
});

export type integrationsGetIntegrationAuthURLInput = z.infer<
	typeof integrationsGetIntegrationAuthURLInputSchema
>;

const integrationsGetIntegrationAuthURLResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetIntegrationAuthURLResponse = z.infer<
	typeof integrationsGetIntegrationAuthURLResponseSchema
>;

const integrationsGetIntegrationConnectionListInputSchema = z.object({});

export type integrationsGetIntegrationConnectionListInput = z.infer<
	typeof integrationsGetIntegrationConnectionListInputSchema
>;

const integrationsGetIntegrationConnectionListResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetIntegrationConnectionListResponse = z.infer<
	typeof integrationsGetIntegrationConnectionListResponseSchema
>;

const integrationsGetLinkedInTokenInputSchema = z.object({});

export type integrationsGetLinkedInTokenInput = z.infer<
	typeof integrationsGetLinkedInTokenInputSchema
>;

const integrationsGetLinkedInTokenResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetLinkedInTokenResponse = z.infer<
	typeof integrationsGetLinkedInTokenResponseSchema
>;

const integrationsGetShopifyProductsInputSchema = z.object({});

export type integrationsGetShopifyProductsInput = z.infer<
	typeof integrationsGetShopifyProductsInputSchema
>;

const integrationsGetShopifyProductsResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetShopifyProductsResponse = z.infer<
	typeof integrationsGetShopifyProductsResponseSchema
>;

const integrationsGetPaypalListsInputSchema = z.object({});

export type integrationsGetPaypalListsInput = z.infer<
	typeof integrationsGetPaypalListsInputSchema
>;

const integrationsGetPaypalListsResponseSchema = BenchmarkGenericResponseSchema;

export type integrationsGetPaypalListsResponse = z.infer<
	typeof integrationsGetPaypalListsResponseSchema
>;

const integrationsGetPaypalLinkInputSchema = z.object({
	contactMasterID: z.string().min(1),
});

export type integrationsGetPaypalLinkInput = z.infer<
	typeof integrationsGetPaypalLinkInputSchema
>;

const integrationsGetPaypalLinkResponseSchema = BenchmarkGenericResponseSchema;

export type integrationsGetPaypalLinkResponse = z.infer<
	typeof integrationsGetPaypalLinkResponseSchema
>;

const integrationsGetPinterestUsernameInputSchema = z.object({});

export type integrationsGetPinterestUsernameInput = z.infer<
	typeof integrationsGetPinterestUsernameInputSchema
>;

const integrationsGetPinterestUsernameResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetPinterestUsernameResponse = z.infer<
	typeof integrationsGetPinterestUsernameResponseSchema
>;

const integrationsGetSalesforceStatusInputSchema = z.object({});

export type integrationsGetSalesforceStatusInput = z.infer<
	typeof integrationsGetSalesforceStatusInputSchema
>;

const integrationsGetSalesforceStatusResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetSalesforceStatusResponse = z.infer<
	typeof integrationsGetSalesforceStatusResponseSchema
>;

const integrationsGetShopifyProductGridInputSchema = z.object({});

export type integrationsGetShopifyProductGridInput = z.infer<
	typeof integrationsGetShopifyProductGridInputSchema
>;

const integrationsGetShopifyProductGridResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetShopifyProductGridResponse = z.infer<
	typeof integrationsGetShopifyProductGridResponseSchema
>;

const integrationsGetTwitterLoginInputSchema = z.object({});

export type integrationsGetTwitterLoginInput = z.infer<
	typeof integrationsGetTwitterLoginInputSchema
>;

const integrationsGetTwitterLoginResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetTwitterLoginResponse = z.infer<
	typeof integrationsGetTwitterLoginResponseSchema
>;

const integrationsGetUnbounceLinkInputSchema = z.object({
	contactMasterID: z.string().min(1),
});

export type integrationsGetUnbounceLinkInput = z.infer<
	typeof integrationsGetUnbounceLinkInputSchema
>;

const integrationsGetUnbounceLinkResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetUnbounceLinkResponse = z.infer<
	typeof integrationsGetUnbounceLinkResponseSchema
>;

const integrationsGetUnbounceListsInputSchema = z.object({});

export type integrationsGetUnbounceListsInput = z.infer<
	typeof integrationsGetUnbounceListsInputSchema
>;

const integrationsGetUnbounceListsResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetUnbounceListsResponse = z.infer<
	typeof integrationsGetUnbounceListsResponseSchema
>;

const integrationsGetEbaySellerIDInputSchema = z.object({});

export type integrationsGetEbaySellerIDInput = z.infer<
	typeof integrationsGetEbaySellerIDInputSchema
>;

const integrationsGetEbaySellerIDResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetEbaySellerIDResponse = z.infer<
	typeof integrationsGetEbaySellerIDResponseSchema
>;

const integrationsGetEbaySiteListInputSchema = z.object({});

export type integrationsGetEbaySiteListInput = z.infer<
	typeof integrationsGetEbaySiteListInputSchema
>;

const integrationsGetEbaySiteListResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsGetEbaySiteListResponse = z.infer<
	typeof integrationsGetEbaySiteListResponseSchema
>;

const integrationsTestEtsyIntegrationInputSchema = z.object({});

export type integrationsTestEtsyIntegrationInput = z.infer<
	typeof integrationsTestEtsyIntegrationInputSchema
>;

const integrationsTestEtsyIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestEtsyIntegrationResponse = z.infer<
	typeof integrationsTestEtsyIntegrationResponseSchema
>;

const integrationsTestEventbriteIntegrationInputSchema = z.object({});

export type integrationsTestEventbriteIntegrationInput = z.infer<
	typeof integrationsTestEventbriteIntegrationInputSchema
>;

const integrationsTestEventbriteIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestEventbriteIntegrationResponse = z.infer<
	typeof integrationsTestEventbriteIntegrationResponseSchema
>;

const integrationsTestFacebookEventsIntegrationInputSchema = z.object({});

export type integrationsTestFacebookEventsIntegrationInput = z.infer<
	typeof integrationsTestFacebookEventsIntegrationInputSchema
>;

const integrationsTestFacebookEventsIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestFacebookEventsIntegrationResponse = z.infer<
	typeof integrationsTestFacebookEventsIntegrationResponseSchema
>;

const integrationsTestFacebookIntegrationInputSchema = z.object({});

export type integrationsTestFacebookIntegrationInput = z.infer<
	typeof integrationsTestFacebookIntegrationInputSchema
>;

const integrationsTestFacebookIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestFacebookIntegrationResponse = z.infer<
	typeof integrationsTestFacebookIntegrationResponseSchema
>;

const integrationsTestLinkedInConnectionInputSchema = z.object({});

export type integrationsTestLinkedInConnectionInput = z.infer<
	typeof integrationsTestLinkedInConnectionInputSchema
>;

const integrationsTestLinkedInConnectionResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestLinkedInConnectionResponse = z.infer<
	typeof integrationsTestLinkedInConnectionResponseSchema
>;

const integrationsTestPinterestIntegrationInputSchema = z.object({});

export type integrationsTestPinterestIntegrationInput = z.infer<
	typeof integrationsTestPinterestIntegrationInputSchema
>;

const integrationsTestPinterestIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestPinterestIntegrationResponse = z.infer<
	typeof integrationsTestPinterestIntegrationResponseSchema
>;

const integrationsTestSalesforceIntegrationInputSchema = z.object({});

export type integrationsTestSalesforceIntegrationInput = z.infer<
	typeof integrationsTestSalesforceIntegrationInputSchema
>;

const integrationsTestSalesforceIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestSalesforceIntegrationResponse = z.infer<
	typeof integrationsTestSalesforceIntegrationResponseSchema
>;

const integrationsTestTwitterIntegrationInputSchema = z.object({});

export type integrationsTestTwitterIntegrationInput = z.infer<
	typeof integrationsTestTwitterIntegrationInputSchema
>;

const integrationsTestTwitterIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestTwitterIntegrationResponse = z.infer<
	typeof integrationsTestTwitterIntegrationResponseSchema
>;

const integrationsTestTwitterTweetsInputSchema = z.object({});

export type integrationsTestTwitterTweetsInput = z.infer<
	typeof integrationsTestTwitterTweetsInputSchema
>;

const integrationsTestTwitterTweetsResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestTwitterTweetsResponse = z.infer<
	typeof integrationsTestTwitterTweetsResponseSchema
>;

const integrationsTestEbayIntegrationInputSchema = z.object({});

export type integrationsTestEbayIntegrationInput = z.infer<
	typeof integrationsTestEbayIntegrationInputSchema
>;

const integrationsTestEbayIntegrationResponseSchema =
	BenchmarkGenericResponseSchema;

export type integrationsTestEbayIntegrationResponse = z.infer<
	typeof integrationsTestEbayIntegrationResponseSchema
>;

const webhooksCreateWebhookInputSchema = z.object({
	listID: z.string().min(1),
	data: RequestData,
});

export type webhooksCreateWebhookInput = z.infer<
	typeof webhooksCreateWebhookInputSchema
>;

const webhooksCreateWebhookResponseSchema = BenchmarkGenericResponseSchema;

export type webhooksCreateWebhookResponse = z.infer<
	typeof webhooksCreateWebhookResponseSchema
>;

const webhooksGetWebhooksInputSchema = z.object({
	listID: z.string().min(1),
});

export type webhooksGetWebhooksInput = z.infer<
	typeof webhooksGetWebhooksInputSchema
>;

const webhooksGetWebhooksResponseSchema = BenchmarkGenericResponseSchema;

export type webhooksGetWebhooksResponse = z.infer<
	typeof webhooksGetWebhooksResponseSchema
>;

const webhooksDeleteWebhookInputSchema = z.object({
	listID: z.string().min(1),
	id: z.string().min(1),
});

export type webhooksDeleteWebhookInput = z.infer<
	typeof webhooksDeleteWebhookInputSchema
>;

const webhooksDeleteWebhookResponseSchema = BenchmarkGenericResponseSchema;

export type webhooksDeleteWebhookResponse = z.infer<
	typeof webhooksDeleteWebhookResponseSchema
>;

const webhooksUpdateWebhookInputSchema = z.object({
	listID: z.string().min(1),
	id: z.string().min(1),
	data: RequestData,
});

export type webhooksUpdateWebhookInput = z.infer<
	typeof webhooksUpdateWebhookInputSchema
>;

const webhooksUpdateWebhookResponseSchema = BenchmarkGenericResponseSchema;

export type webhooksUpdateWebhookResponse = z.infer<
	typeof webhooksUpdateWebhookResponseSchema
>;

export type BenchmarkEmailEndpointInputs = {
	contactsAddContactToList: contactsAddContactToListInput;
	contactsCleanContactList: contactsCleanContactListInput;
	contactsCompareContacts: contactsCompareContactsInput;
	contactsCopyBulkContacts: contactsCopyBulkContactsInput;
	contactsCopyContact: contactsCopyContactInput;
	contactsCreateSegmentCriteria: contactsCreateSegmentCriteriaInput;
	contactsCreateSegmentFromContactIDs: contactsCreateSegmentFromContactIDsInput;
	contactsDeleteContactFromAllListsByID: contactsDeleteContactFromAllListsByIDInput;
	contactsDeleteContactFromList: contactsDeleteContactFromListInput;
	contactsDeleteContactFromSearch: contactsDeleteContactFromSearchInput;
	contactsDeleteContactsFromAllLists: contactsDeleteContactsFromAllListsInput;
	contactsDeleteContactsFromCurrentLists: contactsDeleteContactsFromCurrentListsInput;
	contactsDeleteSegment: contactsDeleteSegmentInput;
	contactsDeleteSegmentCriteria: contactsDeleteSegmentCriteriaInput;
	contactsDeleteTrashList: contactsDeleteTrashListInput;
	contactsGetActiveContactCount: contactsGetActiveContactCountInput;
	contactsGetContactAuditHistory: contactsGetContactAuditHistoryInput;
	contactsGetContactAuditHistoryDetail: contactsGetContactAuditHistoryDetailInput;
	contactsGetContactDetails: contactsGetContactDetailsInput;
	contactsGetContactImportStatus: contactsGetContactImportStatusInput;
	contactsGetContactMergeList: contactsGetContactMergeListInput;
	contactsGetContactsCount: contactsGetContactsCountInput;
	contactsGetFilteredContacts: contactsGetFilteredContactsInput;
	contactsGetFilteredContactsWithExtraFields: contactsGetFilteredContactsWithExtraFieldsInput;
	contactsGetNonContactCount: contactsGetNonContactCountInput;
	contactsGetSegmentAutoGenerateName: contactsGetSegmentAutoGenerateNameInput;
	contactsGetSegmentDetails: contactsGetSegmentDetailsInput;
	contactsGetSegmentList: contactsGetSegmentListInput;
	contactsGetSegmentByID: contactsGetSegmentByIDInput;
	contactsGetSegments: contactsGetSegmentsInput;
	contactsGetTrashCount: contactsGetTrashCountInput;
	contactsGetDownloadSegmentData: contactsGetDownloadSegmentDataInput;
	contactsGetCleanCount: contactsGetCleanCountInput;
	contactsGetUniqueContactCount: contactsGetUniqueContactCountInput;
	contactsMergeContactsIntoExistingList: contactsMergeContactsIntoExistingListInput;
	contactsMergeContactsIntoNewList: contactsMergeContactsIntoNewListInput;
	contactsMoveBulkContacts: contactsMoveBulkContactsInput;
	contactsMoveContactToDoNotContactList: contactsMoveContactToDoNotContactListInput;
	contactsMoveContacts: contactsMoveContactsInput;
	contactsResendEmails: contactsResendEmailsInput;
	contactsSaveEmailAddress: contactsSaveEmailAddressInput;
	contactsSaveVerifiedEmailAddresses: contactsSaveVerifiedEmailAddressesInput;
	contactsSearchContactDetailsByEmail: contactsSearchContactDetailsByEmailInput;
	contactsSendConfirmEmailVerification: contactsSendConfirmEmailVerificationInput;
	contactsUpdateContactDetails: contactsUpdateContactDetailsInput;
	contactsUpdateSegment: contactsUpdateSegmentInput;
	listsCreateContactList: listsCreateContactListInput;
	listsDeleteContactList: listsDeleteContactListInput;
	listsDeleteList: listsDeleteListInput;
	listsGetContactListDeepView: listsGetContactListDeepViewInput;
	listsGetContactListDetails: listsGetContactListDetailsInput;
	listsGetContactListFieldNames: listsGetContactListFieldNamesInput;
	listsGetContactLists: listsGetContactListsInput;
	listsGetDeleteListCheck: listsGetDeleteListCheckInput;
	listsGetListUploadTerms: listsGetListUploadTermsInput;
	listsGetContactListSummary: listsGetContactListSummaryInput;
	listsRestoreTrashList: listsRestoreTrashListInput;
	listsUpdateContactList: listsUpdateContactListInput;
	emailsAddEmailToCommunity: emailsAddEmailToCommunityInput;
	emailsCopyExistingEmail: emailsCopyExistingEmailInput;
	emailsDeleteABTestEmail: emailsDeleteABTestEmailInput;
	emailsDeleteABSplitCampaign: emailsDeleteABSplitCampaignInput;
	emailsDeleteEmailCampaign: emailsDeleteEmailCampaignInput;
	emailsGetABSplitDetails: emailsGetABSplitDetailsInput;
	emailsGetABSplitResults: emailsGetABSplitResultsInput;
	emailsGetABTests: emailsGetABTestsInput;
	emailsGetCommunityCategory: emailsGetCommunityCategoryInput;
	emailsGetCommunityEmailByID: emailsGetCommunityEmailByIDInput;
	emailsGetEmailPreview: emailsGetEmailPreviewInput;
	emailsGetEmailRecipientCount: emailsGetEmailRecipientCountInput;
	emailsGetEmailSpamCheck: emailsGetEmailSpamCheckInput;
	emailsGetEmailTemplates: emailsGetEmailTemplatesInput;
	emailsGetEmails: emailsGetEmailsInput;
	emailsGetEmailDetails: emailsGetEmailDetailsInput;
	emailsGetTemplateCategoryList: emailsGetTemplateCategoryListInput;
	emailsGetTemplateCategoryByID: emailsGetTemplateCategoryByIDInput;
	emailsGetTemplateByID: emailsGetTemplateByIDInput;
	emailsInitiateEmailScreenCapture: emailsInitiateEmailScreenCaptureInput;
	emailsPermanentlyDeleteEmailFromTrash: emailsPermanentlyDeleteEmailFromTrashInput;
	emailsRestoreEmailFromTrash: emailsRestoreEmailFromTrashInput;
	emailsScheduleEmailCampaign: emailsScheduleEmailCampaignInput;
	emailsUpdateEmailCampaign: emailsUpdateEmailCampaignInput;
	emailsGetBadgesList: emailsGetBadgesListInput;
	emailsGetLayoutList: emailsGetLayoutListInput;
	emailsGetScheme: emailsGetSchemeInput;
	emailsAddOrUpdateScheme: emailsAddOrUpdateSchemeInput;
	emailsGetRSSHistoryByEmailID: emailsGetRSSHistoryByEmailIDInput;
	emailsShareTemplateToSubAccounts: emailsShareTemplateToSubAccountsInput;
	archiveAddEmailToArchive: archiveAddEmailToArchiveInput;
	archiveDeleteEmailFromArchive: archiveDeleteEmailFromArchiveInput;
	archiveGetArchiveDomainName: archiveGetArchiveDomainNameInput;
	archiveGetArchiveEmailDetails: archiveGetArchiveEmailDetailsInput;
	archiveGetArchiveEmails: archiveGetArchiveEmailsInput;
	archiveGetArchiveHomeData: archiveGetArchiveHomeDataInput;
	archiveGetArchiveHomePage: archiveGetArchiveHomePageInput;
	archiveGetArchivePages: archiveGetArchivePagesInput;
	archiveGetDetailsAboutArchivePage: archiveGetDetailsAboutArchivePageInput;
	archiveGetHTMLForArchiveNewsletter: archiveGetHTMLForArchiveNewsletterInput;
	archiveGetHTMLForButton: archiveGetHTMLForButtonInput;
	archiveGetImageForButton: archiveGetImageForButtonInput;
	archiveUpdateArchiveHomePage: archiveUpdateArchiveHomePageInput;
	archiveUpdateArchiveHomePageData: archiveUpdateArchiveHomePageDataInput;
	automationsAddEmailInAutomation: automationsAddEmailInAutomationInput;
	automationsCopyEmailInAutomation: automationsCopyEmailInAutomationInput;
	automationsCreateAutomationCopy: automationsCreateAutomationCopyInput;
	automationsDeleteAutomation: automationsDeleteAutomationInput;
	automationsDeleteAutomationEmail: automationsDeleteAutomationEmailInput;
	automationsGetAutomationEmailDetails: automationsGetAutomationEmailDetailsInput;
	automationsGetAutomationDetails: automationsGetAutomationDetailsInput;
	automationsGetAutomationSummaryReport: automationsGetAutomationSummaryReportInput;
	automationsUpdateEmailContentForAutomation: automationsUpdateEmailContentForAutomationInput;
	reportsGetABTestReport: reportsGetABTestReportInput;
	reportsGetAbuseCampaignReportByEmailID: reportsGetAbuseCampaignReportByEmailIDInput;
	reportsGetAbuseReport: reportsGetAbuseReportInput;
	reportsGetBouncesReportByEmailID: reportsGetBouncesReportByEmailIDInput;
	reportsGetCampaignEngagementList: reportsGetCampaignEngagementListInput;
	reportsGetCampaignHistoryByEmailID: reportsGetCampaignHistoryByEmailIDInput;
	reportsGetClickContactCount: reportsGetClickContactCountInput;
	reportsGetClickHeatMapByEmailID: reportsGetClickHeatMapByEmailIDInput;
	reportsGetClickPerformanceByEmailID: reportsGetClickPerformanceByEmailIDInput;
	reportsGetClickPerformanceDetailsByEmail: reportsGetClickPerformanceDetailsByEmailInput;
	reportsGetClickURLContactCount: reportsGetClickURLContactCountInput;
	reportsGetClicksReportByEmailID: reportsGetClicksReportByEmailIDInput;
	reportsGetContactReportHistory: reportsGetContactReportHistoryInput;
	reportsGetDownloadReport: reportsGetDownloadReportInput;
	reportsDownloadContactReport: reportsDownloadContactReportInput;
	reportsGetEmailOpensByCountryRegion: reportsGetEmailOpensByCountryRegionInput;
	reportsGetEmailReport: reportsGetEmailReportInput;
	reportsGetEmailReportForwards: reportsGetEmailReportForwardsInput;
	reportsGetForwardsReportByEmailID: reportsGetForwardsReportByEmailIDInput;
	reportsGetLinkDetailByEmailID: reportsGetLinkDetailByEmailIDInput;
	reportsGetOpenContactCount: reportsGetOpenContactCountInput;
	reportsGetOpensHourlyReportByEmail: reportsGetOpensHourlyReportByEmailInput;
	reportsGetOpensLocationReport: reportsGetOpensLocationReportInput;
	reportsGetOpensLocationReportByEmail: reportsGetOpensLocationReportByEmailInput;
	reportsGetOpensReport: reportsGetOpensReportInput;
	reportsGetReportDetailsByABTest: reportsGetReportDetailsByABTestInput;
	reportsGetReportDetailsByEmailID: reportsGetReportDetailsByEmailIDInput;
	reportsGetReportDownload: reportsGetReportDownloadInput;
	reportsGetReportsForAutoresponders: reportsGetReportsForAutorespondersInput;
	reportsGetSocialPerformanceReport: reportsGetSocialPerformanceReportInput;
	reportsGetURLEngagementList: reportsGetURLEngagementListInput;
	reportsGetURLListByEmailID: reportsGetURLListByEmailIDInput;
	reportsGetUnopensReport: reportsGetUnopensReportInput;
	reportsGetUnopensReportByEmailID: reportsGetUnopensReportByEmailIDInput;
	reportsGetUnsubscribeReportByEmailID: reportsGetUnsubscribeReportByEmailIDInput;
	reportsGetSaveAsList: reportsGetSaveAsListInput;
	reportsUpdateListCompilationDetails: reportsUpdateListCompilationDetailsInput;
	signupFormsCopySignupForm: signupFormsCopySignupFormInput;
	signupFormsCreateSignupForm: signupFormsCreateSignupFormInput;
	signupFormsGetHTMLSignupForm: signupFormsGetHTMLSignupFormInput;
	signupFormsGetMagentoHTMLSelected: signupFormsGetMagentoHTMLSelectedInput;
	signupFormsGetMagentoHTMLDropdown: signupFormsGetMagentoHTMLDropdownInput;
	signupFormsGetSignupFormButtonCode: signupFormsGetSignupFormButtonCodeInput;
	signupFormsGetSignupFormContactFields: signupFormsGetSignupFormContactFieldsInput;
	signupFormsGetSignupFormDetails: signupFormsGetSignupFormDetailsInput;
	signupFormsGetSignupFormLink: signupFormsGetSignupFormLinkInput;
	signupFormsGetSignupFormList: signupFormsGetSignupFormListInput;
	signupFormsGetSignupFormsForContactList: signupFormsGetSignupFormsForContactListInput;
	signupFormsGetSignupFormForUnbounce: signupFormsGetSignupFormForUnbounceInput;
	signupFormsGetSignupFormTumbler: signupFormsGetSignupFormTumblerInput;
	signupFormsGetSignupFormForMagento: signupFormsGetSignupFormForMagentoInput;
	signupFormsGetTemplatesForSignupFormClassic: signupFormsGetTemplatesForSignupFormClassicInput;
	signupFormsGetTumblerLists: signupFormsGetTumblerListsInput;
	signupFormsSendTestEmailForSignupForm: signupFormsSendTestEmailForSignupFormInput;
	surveysDeleteSurvey: surveysDeleteSurveyInput;
	surveysGetSurveyDetails: surveysGetSurveyDetailsInput;
	surveysGetSurveyTemplateList: surveysGetSurveyTemplateListInput;
	surveysGetSurveyReportList: surveysGetSurveyReportListInput;
	surveysGetSurveyFullReport: surveysGetSurveyFullReportInput;
	surveysGetSurveyIndividualResults: surveysGetSurveyIndividualResultsInput;
	surveysGetSurveyIndividualQuestionResult: surveysGetSurveyIndividualQuestionResultInput;
	surveysGetSurveyReportAnswerText: surveysGetSurveyReportAnswerTextInput;
	surveysGetSurveyReportAnswerComment: surveysGetSurveyReportAnswerCommentInput;
	surveysGetSurveyReportAnswerOther: surveysGetSurveyReportAnswerOtherInput;
	surveysGetSurveyReportDetail: surveysGetSurveyReportDetailInput;
	surveysUpdateSurveyStatus: surveysUpdateSurveyStatusInput;
	pollsCopyPoll: pollsCopyPollInput;
	pollsCreatePoll: pollsCreatePollInput;
	pollsDeletePoll: pollsDeletePollInput;
	pollsGetPollDetails: pollsGetPollDetailsInput;
	pollsGetPolls: pollsGetPollsInput;
	pollsGetPollPreview: pollsGetPollPreviewInput;
	pollsGetPollResponseReport: pollsGetPollResponseReportInput;
	pollsUpdatePoll: pollsUpdatePollInput;
	mediaDeleteImage: mediaDeleteImageInput;
	mediaDeleteVideo: mediaDeleteVideoInput;
	mediaGetVideoDetails: mediaGetVideoDetailsInput;
	mediaGetImages: mediaGetImagesInput;
	mediaGetImageDetails: mediaGetImageDetailsInput;
	mediaGetGiphyImages: mediaGetGiphyImagesInput;
	mediaShareVideo: mediaShareVideoInput;
	mediaUploadVideo: mediaUploadVideoInput;
	mediaCreateInbox: mediaCreateInboxInput;
	mediaDeleteInbox: mediaDeleteInboxInput;
	mediaGetInboxList: mediaGetInboxListInput;
	mediaGetInboxMasterResult: mediaGetInboxMasterResultInput;
	mediaGetInboxDetailResult: mediaGetInboxDetailResultInput;
	accountAddRemoveInboxTestsFromSubAccount: accountAddRemoveInboxTestsFromSubAccountInput;
	accountCopyImageToSubAccount: accountCopyImageToSubAccountInput;
	accountDeleteLinkedAgencyAccount: accountDeleteLinkedAgencyAccountInput;
	accountGetCommissionList: accountGetCommissionListInput;
	accountGetLinkedAgencyAccountDetails: accountGetLinkedAgencyAccountDetailsInput;
	accountGetLinkedAgencyAccounts: accountGetLinkedAgencyAccountsInput;
	accountGetPartnerProfileDetails: accountGetPartnerProfileDetailsInput;
	accountGetReferralsList: accountGetReferralsListInput;
	accountGetSubAccountHistory: accountGetSubAccountHistoryInput;
	accountGetSubAccounts: accountGetSubAccountsInput;
	accountGetSubAccountsPlanList: accountGetSubAccountsPlanListInput;
	accountGetReferralsLevel1List: accountGetReferralsLevel1ListInput;
	accountGetSubAccountBalance: accountGetSubAccountBalanceInput;
	accountGetSubAccountDetails: accountGetSubAccountDetailsInput;
	accountGetSubAccountHistoryDetails: accountGetSubAccountHistoryDetailsInput;
	accountLinkAgencyAccount: accountLinkAgencyAccountInput;
	accountShareListsWithSubAccounts: accountShareListsWithSubAccountsInput;
	accountUpdateLinkedAgencyAccount: accountUpdateLinkedAgencyAccountInput;
	accountUpdatePartnerProfile: accountUpdatePartnerProfileInput;
	accountChangePassword: accountChangePasswordInput;
	accountChangeSecurityPIN: accountChangeSecurityPINInput;
	accountCheckIfResponsive: accountCheckIfResponsiveInput;
	accountDisableSecurityPIN: accountDisableSecurityPINInput;
	accountGetAllConfirmedEmails: accountGetAllConfirmedEmailsInput;
	accountGetClientAccountSettings: accountGetClientAccountSettingsInput;
	accountGetClientPlanInformation: accountGetClientPlanInformationInput;
	accountGetCurrentEmailAtTimeOfReset: accountGetCurrentEmailAtTimeOfResetInput;
	accountGetDMARCList: accountGetDMARCListInput;
	accountGetListOfConfirmedEmails: accountGetListOfConfirmedEmailsInput;
	accountGetClientDetails: accountGetClientDetailsInput;
	accountGetClientFilterDomain: accountGetClientFilterDomainInput;
	accountGetClientProfileDetails: accountGetClientProfileDetailsInput;
	accountGetClientsRatingRange: accountGetClientsRatingRangeInput;
	accountLoginRedirectUsingToken: accountLoginRedirectUsingTokenInput;
	accountPatchUpdateClientSettings: accountPatchUpdateClientSettingsInput;
	accountResendConfirmEmail: accountResendConfirmEmailInput;
	accountSaveSecurityPIN: accountSaveSecurityPINInput;
	accountSaveWebsiteDomain: accountSaveWebsiteDomainInput;
	accountSendPINViaEmail: accountSendPINViaEmailInput;
	accountSendResetEmail: accountSendResetEmailInput;
	accountSetResponsive: accountSetResponsiveInput;
	accountUpdateEditProfile: accountUpdateEditProfileInput;
	accountUpdateResetEmail: accountUpdateResetEmailInput;
	accountGetNotification: accountGetNotificationInput;
	accountGetWebPageAdsDetail: accountGetWebPageAdsDetailInput;
	accountGetHelpTopics: accountGetHelpTopicsInput;
	accountGenerateSupportTicket: accountGenerateSupportTicketInput;
	accountSendSupportFeedback: accountSendSupportFeedbackInput;
	accountGetCommunityDomain: accountGetCommunityDomainInput;
	accountGetAccountSummary: accountGetAccountSummaryInput;
	integrationsAssignProductToList: integrationsAssignProductToListInput;
	integrationsConfigureShopifyPurchaseList: integrationsConfigureShopifyPurchaseListInput;
	integrationsConnectService: integrationsConnectServiceInput;
	integrationsDeleteProductAssociation: integrationsDeleteProductAssociationInput;
	integrationsDisconnectEtsyIntegration: integrationsDisconnectEtsyIntegrationInput;
	integrationsDisconnectEventbriteIntegration: integrationsDisconnectEventbriteIntegrationInput;
	integrationsDisconnectFacebookEvents: integrationsDisconnectFacebookEventsInput;
	integrationsDisconnectFacebookIntegration: integrationsDisconnectFacebookIntegrationInput;
	integrationsDisconnectInstagramIntegration: integrationsDisconnectInstagramIntegrationInput;
	integrationsDisconnectLinkedInIntegration: integrationsDisconnectLinkedInIntegrationInput;
	integrationsDisconnectPinterestConnection: integrationsDisconnectPinterestConnectionInput;
	integrationsDisconnectSalesforceIntegration: integrationsDisconnectSalesforceIntegrationInput;
	integrationsDisconnectShopify: integrationsDisconnectShopifyInput;
	integrationsDisconnectTwitterIntegration: integrationsDisconnectTwitterIntegrationInput;
	integrationsDisconnectEbayIntegration: integrationsDisconnectEbayIntegrationInput;
	integrationsLogOutTwitterTweets: integrationsLogOutTwitterTweetsInput;
	integrationsGetContactListsForShopify: integrationsGetContactListsForShopifyInput;
	integrationsGetDigiohUsername: integrationsGetDigiohUsernameInput;
	integrationsGetEtsyStoreName: integrationsGetEtsyStoreNameInput;
	integrationsGetEventbriteUsername: integrationsGetEventbriteUsernameInput;
	integrationsGetFacebookAccountHolder: integrationsGetFacebookAccountHolderInput;
	integrationsGetFacebookAccountName: integrationsGetFacebookAccountNameInput;
	integrationsGetIntegrationAuthURL: integrationsGetIntegrationAuthURLInput;
	integrationsGetIntegrationConnectionList: integrationsGetIntegrationConnectionListInput;
	integrationsGetLinkedInToken: integrationsGetLinkedInTokenInput;
	integrationsGetShopifyProducts: integrationsGetShopifyProductsInput;
	integrationsGetPaypalLists: integrationsGetPaypalListsInput;
	integrationsGetPaypalLink: integrationsGetPaypalLinkInput;
	integrationsGetPinterestUsername: integrationsGetPinterestUsernameInput;
	integrationsGetSalesforceStatus: integrationsGetSalesforceStatusInput;
	integrationsGetShopifyProductGrid: integrationsGetShopifyProductGridInput;
	integrationsGetTwitterLogin: integrationsGetTwitterLoginInput;
	integrationsGetUnbounceLink: integrationsGetUnbounceLinkInput;
	integrationsGetUnbounceLists: integrationsGetUnbounceListsInput;
	integrationsGetEbaySellerID: integrationsGetEbaySellerIDInput;
	integrationsGetEbaySiteList: integrationsGetEbaySiteListInput;
	integrationsTestEtsyIntegration: integrationsTestEtsyIntegrationInput;
	integrationsTestEventbriteIntegration: integrationsTestEventbriteIntegrationInput;
	integrationsTestFacebookEventsIntegration: integrationsTestFacebookEventsIntegrationInput;
	integrationsTestFacebookIntegration: integrationsTestFacebookIntegrationInput;
	integrationsTestLinkedInConnection: integrationsTestLinkedInConnectionInput;
	integrationsTestPinterestIntegration: integrationsTestPinterestIntegrationInput;
	integrationsTestSalesforceIntegration: integrationsTestSalesforceIntegrationInput;
	integrationsTestTwitterIntegration: integrationsTestTwitterIntegrationInput;
	integrationsTestTwitterTweets: integrationsTestTwitterTweetsInput;
	integrationsTestEbayIntegration: integrationsTestEbayIntegrationInput;
	webhooksCreateWebhook: webhooksCreateWebhookInput;
	webhooksGetWebhooks: webhooksGetWebhooksInput;
	webhooksDeleteWebhook: webhooksDeleteWebhookInput;
	webhooksUpdateWebhook: webhooksUpdateWebhookInput;
};

export type BenchmarkEmailEndpointOutputs = {
	contactsAddContactToList: contactsAddContactToListResponse;
	contactsCleanContactList: contactsCleanContactListResponse;
	contactsCompareContacts: contactsCompareContactsResponse;
	contactsCopyBulkContacts: contactsCopyBulkContactsResponse;
	contactsCopyContact: contactsCopyContactResponse;
	contactsCreateSegmentCriteria: contactsCreateSegmentCriteriaResponse;
	contactsCreateSegmentFromContactIDs: contactsCreateSegmentFromContactIDsResponse;
	contactsDeleteContactFromAllListsByID: contactsDeleteContactFromAllListsByIDResponse;
	contactsDeleteContactFromList: contactsDeleteContactFromListResponse;
	contactsDeleteContactFromSearch: contactsDeleteContactFromSearchResponse;
	contactsDeleteContactsFromAllLists: contactsDeleteContactsFromAllListsResponse;
	contactsDeleteContactsFromCurrentLists: contactsDeleteContactsFromCurrentListsResponse;
	contactsDeleteSegment: contactsDeleteSegmentResponse;
	contactsDeleteSegmentCriteria: contactsDeleteSegmentCriteriaResponse;
	contactsDeleteTrashList: contactsDeleteTrashListResponse;
	contactsGetActiveContactCount: contactsGetActiveContactCountResponse;
	contactsGetContactAuditHistory: contactsGetContactAuditHistoryResponse;
	contactsGetContactAuditHistoryDetail: contactsGetContactAuditHistoryDetailResponse;
	contactsGetContactDetails: contactsGetContactDetailsResponse;
	contactsGetContactImportStatus: contactsGetContactImportStatusResponse;
	contactsGetContactMergeList: contactsGetContactMergeListResponse;
	contactsGetContactsCount: contactsGetContactsCountResponse;
	contactsGetFilteredContacts: contactsGetFilteredContactsResponse;
	contactsGetFilteredContactsWithExtraFields: contactsGetFilteredContactsWithExtraFieldsResponse;
	contactsGetNonContactCount: contactsGetNonContactCountResponse;
	contactsGetSegmentAutoGenerateName: contactsGetSegmentAutoGenerateNameResponse;
	contactsGetSegmentDetails: contactsGetSegmentDetailsResponse;
	contactsGetSegmentList: contactsGetSegmentListResponse;
	contactsGetSegmentByID: contactsGetSegmentByIDResponse;
	contactsGetSegments: contactsGetSegmentsResponse;
	contactsGetTrashCount: contactsGetTrashCountResponse;
	contactsGetDownloadSegmentData: contactsGetDownloadSegmentDataResponse;
	contactsGetCleanCount: contactsGetCleanCountResponse;
	contactsGetUniqueContactCount: contactsGetUniqueContactCountResponse;
	contactsMergeContactsIntoExistingList: contactsMergeContactsIntoExistingListResponse;
	contactsMergeContactsIntoNewList: contactsMergeContactsIntoNewListResponse;
	contactsMoveBulkContacts: contactsMoveBulkContactsResponse;
	contactsMoveContactToDoNotContactList: contactsMoveContactToDoNotContactListResponse;
	contactsMoveContacts: contactsMoveContactsResponse;
	contactsResendEmails: contactsResendEmailsResponse;
	contactsSaveEmailAddress: contactsSaveEmailAddressResponse;
	contactsSaveVerifiedEmailAddresses: contactsSaveVerifiedEmailAddressesResponse;
	contactsSearchContactDetailsByEmail: contactsSearchContactDetailsByEmailResponse;
	contactsSendConfirmEmailVerification: contactsSendConfirmEmailVerificationResponse;
	contactsUpdateContactDetails: contactsUpdateContactDetailsResponse;
	contactsUpdateSegment: contactsUpdateSegmentResponse;
	listsCreateContactList: listsCreateContactListResponse;
	listsDeleteContactList: listsDeleteContactListResponse;
	listsDeleteList: listsDeleteListResponse;
	listsGetContactListDeepView: listsGetContactListDeepViewResponse;
	listsGetContactListDetails: listsGetContactListDetailsResponse;
	listsGetContactListFieldNames: listsGetContactListFieldNamesResponse;
	listsGetContactLists: listsGetContactListsResponse;
	listsGetDeleteListCheck: listsGetDeleteListCheckResponse;
	listsGetListUploadTerms: listsGetListUploadTermsResponse;
	listsGetContactListSummary: listsGetContactListSummaryResponse;
	listsRestoreTrashList: listsRestoreTrashListResponse;
	listsUpdateContactList: listsUpdateContactListResponse;
	emailsAddEmailToCommunity: emailsAddEmailToCommunityResponse;
	emailsCopyExistingEmail: emailsCopyExistingEmailResponse;
	emailsDeleteABTestEmail: emailsDeleteABTestEmailResponse;
	emailsDeleteABSplitCampaign: emailsDeleteABSplitCampaignResponse;
	emailsDeleteEmailCampaign: emailsDeleteEmailCampaignResponse;
	emailsGetABSplitDetails: emailsGetABSplitDetailsResponse;
	emailsGetABSplitResults: emailsGetABSplitResultsResponse;
	emailsGetABTests: emailsGetABTestsResponse;
	emailsGetCommunityCategory: emailsGetCommunityCategoryResponse;
	emailsGetCommunityEmailByID: emailsGetCommunityEmailByIDResponse;
	emailsGetEmailPreview: emailsGetEmailPreviewResponse;
	emailsGetEmailRecipientCount: emailsGetEmailRecipientCountResponse;
	emailsGetEmailSpamCheck: emailsGetEmailSpamCheckResponse;
	emailsGetEmailTemplates: emailsGetEmailTemplatesResponse;
	emailsGetEmails: emailsGetEmailsResponse;
	emailsGetEmailDetails: emailsGetEmailDetailsResponse;
	emailsGetTemplateCategoryList: emailsGetTemplateCategoryListResponse;
	emailsGetTemplateCategoryByID: emailsGetTemplateCategoryByIDResponse;
	emailsGetTemplateByID: emailsGetTemplateByIDResponse;
	emailsInitiateEmailScreenCapture: emailsInitiateEmailScreenCaptureResponse;
	emailsPermanentlyDeleteEmailFromTrash: emailsPermanentlyDeleteEmailFromTrashResponse;
	emailsRestoreEmailFromTrash: emailsRestoreEmailFromTrashResponse;
	emailsScheduleEmailCampaign: emailsScheduleEmailCampaignResponse;
	emailsUpdateEmailCampaign: emailsUpdateEmailCampaignResponse;
	emailsGetBadgesList: emailsGetBadgesListResponse;
	emailsGetLayoutList: emailsGetLayoutListResponse;
	emailsGetScheme: emailsGetSchemeResponse;
	emailsAddOrUpdateScheme: emailsAddOrUpdateSchemeResponse;
	emailsGetRSSHistoryByEmailID: emailsGetRSSHistoryByEmailIDResponse;
	emailsShareTemplateToSubAccounts: emailsShareTemplateToSubAccountsResponse;
	archiveAddEmailToArchive: archiveAddEmailToArchiveResponse;
	archiveDeleteEmailFromArchive: archiveDeleteEmailFromArchiveResponse;
	archiveGetArchiveDomainName: archiveGetArchiveDomainNameResponse;
	archiveGetArchiveEmailDetails: archiveGetArchiveEmailDetailsResponse;
	archiveGetArchiveEmails: archiveGetArchiveEmailsResponse;
	archiveGetArchiveHomeData: archiveGetArchiveHomeDataResponse;
	archiveGetArchiveHomePage: archiveGetArchiveHomePageResponse;
	archiveGetArchivePages: archiveGetArchivePagesResponse;
	archiveGetDetailsAboutArchivePage: archiveGetDetailsAboutArchivePageResponse;
	archiveGetHTMLForArchiveNewsletter: archiveGetHTMLForArchiveNewsletterResponse;
	archiveGetHTMLForButton: archiveGetHTMLForButtonResponse;
	archiveGetImageForButton: archiveGetImageForButtonResponse;
	archiveUpdateArchiveHomePage: archiveUpdateArchiveHomePageResponse;
	archiveUpdateArchiveHomePageData: archiveUpdateArchiveHomePageDataResponse;
	automationsAddEmailInAutomation: automationsAddEmailInAutomationResponse;
	automationsCopyEmailInAutomation: automationsCopyEmailInAutomationResponse;
	automationsCreateAutomationCopy: automationsCreateAutomationCopyResponse;
	automationsDeleteAutomation: automationsDeleteAutomationResponse;
	automationsDeleteAutomationEmail: automationsDeleteAutomationEmailResponse;
	automationsGetAutomationEmailDetails: automationsGetAutomationEmailDetailsResponse;
	automationsGetAutomationDetails: automationsGetAutomationDetailsResponse;
	automationsGetAutomationSummaryReport: automationsGetAutomationSummaryReportResponse;
	automationsUpdateEmailContentForAutomation: automationsUpdateEmailContentForAutomationResponse;
	reportsGetABTestReport: reportsGetABTestReportResponse;
	reportsGetAbuseCampaignReportByEmailID: reportsGetAbuseCampaignReportByEmailIDResponse;
	reportsGetAbuseReport: reportsGetAbuseReportResponse;
	reportsGetBouncesReportByEmailID: reportsGetBouncesReportByEmailIDResponse;
	reportsGetCampaignEngagementList: reportsGetCampaignEngagementListResponse;
	reportsGetCampaignHistoryByEmailID: reportsGetCampaignHistoryByEmailIDResponse;
	reportsGetClickContactCount: reportsGetClickContactCountResponse;
	reportsGetClickHeatMapByEmailID: reportsGetClickHeatMapByEmailIDResponse;
	reportsGetClickPerformanceByEmailID: reportsGetClickPerformanceByEmailIDResponse;
	reportsGetClickPerformanceDetailsByEmail: reportsGetClickPerformanceDetailsByEmailResponse;
	reportsGetClickURLContactCount: reportsGetClickURLContactCountResponse;
	reportsGetClicksReportByEmailID: reportsGetClicksReportByEmailIDResponse;
	reportsGetContactReportHistory: reportsGetContactReportHistoryResponse;
	reportsGetDownloadReport: reportsGetDownloadReportResponse;
	reportsDownloadContactReport: reportsDownloadContactReportResponse;
	reportsGetEmailOpensByCountryRegion: reportsGetEmailOpensByCountryRegionResponse;
	reportsGetEmailReport: reportsGetEmailReportResponse;
	reportsGetEmailReportForwards: reportsGetEmailReportForwardsResponse;
	reportsGetForwardsReportByEmailID: reportsGetForwardsReportByEmailIDResponse;
	reportsGetLinkDetailByEmailID: reportsGetLinkDetailByEmailIDResponse;
	reportsGetOpenContactCount: reportsGetOpenContactCountResponse;
	reportsGetOpensHourlyReportByEmail: reportsGetOpensHourlyReportByEmailResponse;
	reportsGetOpensLocationReport: reportsGetOpensLocationReportResponse;
	reportsGetOpensLocationReportByEmail: reportsGetOpensLocationReportByEmailResponse;
	reportsGetOpensReport: reportsGetOpensReportResponse;
	reportsGetReportDetailsByABTest: reportsGetReportDetailsByABTestResponse;
	reportsGetReportDetailsByEmailID: reportsGetReportDetailsByEmailIDResponse;
	reportsGetReportDownload: reportsGetReportDownloadResponse;
	reportsGetReportsForAutoresponders: reportsGetReportsForAutorespondersResponse;
	reportsGetSocialPerformanceReport: reportsGetSocialPerformanceReportResponse;
	reportsGetURLEngagementList: reportsGetURLEngagementListResponse;
	reportsGetURLListByEmailID: reportsGetURLListByEmailIDResponse;
	reportsGetUnopensReport: reportsGetUnopensReportResponse;
	reportsGetUnopensReportByEmailID: reportsGetUnopensReportByEmailIDResponse;
	reportsGetUnsubscribeReportByEmailID: reportsGetUnsubscribeReportByEmailIDResponse;
	reportsGetSaveAsList: reportsGetSaveAsListResponse;
	reportsUpdateListCompilationDetails: reportsUpdateListCompilationDetailsResponse;
	signupFormsCopySignupForm: signupFormsCopySignupFormResponse;
	signupFormsCreateSignupForm: signupFormsCreateSignupFormResponse;
	signupFormsGetHTMLSignupForm: signupFormsGetHTMLSignupFormResponse;
	signupFormsGetMagentoHTMLSelected: signupFormsGetMagentoHTMLSelectedResponse;
	signupFormsGetMagentoHTMLDropdown: signupFormsGetMagentoHTMLDropdownResponse;
	signupFormsGetSignupFormButtonCode: signupFormsGetSignupFormButtonCodeResponse;
	signupFormsGetSignupFormContactFields: signupFormsGetSignupFormContactFieldsResponse;
	signupFormsGetSignupFormDetails: signupFormsGetSignupFormDetailsResponse;
	signupFormsGetSignupFormLink: signupFormsGetSignupFormLinkResponse;
	signupFormsGetSignupFormList: signupFormsGetSignupFormListResponse;
	signupFormsGetSignupFormsForContactList: signupFormsGetSignupFormsForContactListResponse;
	signupFormsGetSignupFormForUnbounce: signupFormsGetSignupFormForUnbounceResponse;
	signupFormsGetSignupFormTumbler: signupFormsGetSignupFormTumblerResponse;
	signupFormsGetSignupFormForMagento: signupFormsGetSignupFormForMagentoResponse;
	signupFormsGetTemplatesForSignupFormClassic: signupFormsGetTemplatesForSignupFormClassicResponse;
	signupFormsGetTumblerLists: signupFormsGetTumblerListsResponse;
	signupFormsSendTestEmailForSignupForm: signupFormsSendTestEmailForSignupFormResponse;
	surveysDeleteSurvey: surveysDeleteSurveyResponse;
	surveysGetSurveyDetails: surveysGetSurveyDetailsResponse;
	surveysGetSurveyTemplateList: surveysGetSurveyTemplateListResponse;
	surveysGetSurveyReportList: surveysGetSurveyReportListResponse;
	surveysGetSurveyFullReport: surveysGetSurveyFullReportResponse;
	surveysGetSurveyIndividualResults: surveysGetSurveyIndividualResultsResponse;
	surveysGetSurveyIndividualQuestionResult: surveysGetSurveyIndividualQuestionResultResponse;
	surveysGetSurveyReportAnswerText: surveysGetSurveyReportAnswerTextResponse;
	surveysGetSurveyReportAnswerComment: surveysGetSurveyReportAnswerCommentResponse;
	surveysGetSurveyReportAnswerOther: surveysGetSurveyReportAnswerOtherResponse;
	surveysGetSurveyReportDetail: surveysGetSurveyReportDetailResponse;
	surveysUpdateSurveyStatus: surveysUpdateSurveyStatusResponse;
	pollsCopyPoll: pollsCopyPollResponse;
	pollsCreatePoll: pollsCreatePollResponse;
	pollsDeletePoll: pollsDeletePollResponse;
	pollsGetPollDetails: pollsGetPollDetailsResponse;
	pollsGetPolls: pollsGetPollsResponse;
	pollsGetPollPreview: pollsGetPollPreviewResponse;
	pollsGetPollResponseReport: pollsGetPollResponseReportResponse;
	pollsUpdatePoll: pollsUpdatePollResponse;
	mediaDeleteImage: mediaDeleteImageResponse;
	mediaDeleteVideo: mediaDeleteVideoResponse;
	mediaGetVideoDetails: mediaGetVideoDetailsResponse;
	mediaGetImages: mediaGetImagesResponse;
	mediaGetImageDetails: mediaGetImageDetailsResponse;
	mediaGetGiphyImages: mediaGetGiphyImagesResponse;
	mediaShareVideo: mediaShareVideoResponse;
	mediaUploadVideo: mediaUploadVideoResponse;
	mediaCreateInbox: mediaCreateInboxResponse;
	mediaDeleteInbox: mediaDeleteInboxResponse;
	mediaGetInboxList: mediaGetInboxListResponse;
	mediaGetInboxMasterResult: mediaGetInboxMasterResultResponse;
	mediaGetInboxDetailResult: mediaGetInboxDetailResultResponse;
	accountAddRemoveInboxTestsFromSubAccount: accountAddRemoveInboxTestsFromSubAccountResponse;
	accountCopyImageToSubAccount: accountCopyImageToSubAccountResponse;
	accountDeleteLinkedAgencyAccount: accountDeleteLinkedAgencyAccountResponse;
	accountGetCommissionList: accountGetCommissionListResponse;
	accountGetLinkedAgencyAccountDetails: accountGetLinkedAgencyAccountDetailsResponse;
	accountGetLinkedAgencyAccounts: accountGetLinkedAgencyAccountsResponse;
	accountGetPartnerProfileDetails: accountGetPartnerProfileDetailsResponse;
	accountGetReferralsList: accountGetReferralsListResponse;
	accountGetSubAccountHistory: accountGetSubAccountHistoryResponse;
	accountGetSubAccounts: accountGetSubAccountsResponse;
	accountGetSubAccountsPlanList: accountGetSubAccountsPlanListResponse;
	accountGetReferralsLevel1List: accountGetReferralsLevel1ListResponse;
	accountGetSubAccountBalance: accountGetSubAccountBalanceResponse;
	accountGetSubAccountDetails: accountGetSubAccountDetailsResponse;
	accountGetSubAccountHistoryDetails: accountGetSubAccountHistoryDetailsResponse;
	accountLinkAgencyAccount: accountLinkAgencyAccountResponse;
	accountShareListsWithSubAccounts: accountShareListsWithSubAccountsResponse;
	accountUpdateLinkedAgencyAccount: accountUpdateLinkedAgencyAccountResponse;
	accountUpdatePartnerProfile: accountUpdatePartnerProfileResponse;
	accountChangePassword: accountChangePasswordResponse;
	accountChangeSecurityPIN: accountChangeSecurityPINResponse;
	accountCheckIfResponsive: accountCheckIfResponsiveResponse;
	accountDisableSecurityPIN: accountDisableSecurityPINResponse;
	accountGetAllConfirmedEmails: accountGetAllConfirmedEmailsResponse;
	accountGetClientAccountSettings: accountGetClientAccountSettingsResponse;
	accountGetClientPlanInformation: accountGetClientPlanInformationResponse;
	accountGetCurrentEmailAtTimeOfReset: accountGetCurrentEmailAtTimeOfResetResponse;
	accountGetDMARCList: accountGetDMARCListResponse;
	accountGetListOfConfirmedEmails: accountGetListOfConfirmedEmailsResponse;
	accountGetClientDetails: accountGetClientDetailsResponse;
	accountGetClientFilterDomain: accountGetClientFilterDomainResponse;
	accountGetClientProfileDetails: accountGetClientProfileDetailsResponse;
	accountGetClientsRatingRange: accountGetClientsRatingRangeResponse;
	accountLoginRedirectUsingToken: accountLoginRedirectUsingTokenResponse;
	accountPatchUpdateClientSettings: accountPatchUpdateClientSettingsResponse;
	accountResendConfirmEmail: accountResendConfirmEmailResponse;
	accountSaveSecurityPIN: accountSaveSecurityPINResponse;
	accountSaveWebsiteDomain: accountSaveWebsiteDomainResponse;
	accountSendPINViaEmail: accountSendPINViaEmailResponse;
	accountSendResetEmail: accountSendResetEmailResponse;
	accountSetResponsive: accountSetResponsiveResponse;
	accountUpdateEditProfile: accountUpdateEditProfileResponse;
	accountUpdateResetEmail: accountUpdateResetEmailResponse;
	accountGetNotification: accountGetNotificationResponse;
	accountGetWebPageAdsDetail: accountGetWebPageAdsDetailResponse;
	accountGetHelpTopics: accountGetHelpTopicsResponse;
	accountGenerateSupportTicket: accountGenerateSupportTicketResponse;
	accountSendSupportFeedback: accountSendSupportFeedbackResponse;
	accountGetCommunityDomain: accountGetCommunityDomainResponse;
	accountGetAccountSummary: accountGetAccountSummaryResponse;
	integrationsAssignProductToList: integrationsAssignProductToListResponse;
	integrationsConfigureShopifyPurchaseList: integrationsConfigureShopifyPurchaseListResponse;
	integrationsConnectService: integrationsConnectServiceResponse;
	integrationsDeleteProductAssociation: integrationsDeleteProductAssociationResponse;
	integrationsDisconnectEtsyIntegration: integrationsDisconnectEtsyIntegrationResponse;
	integrationsDisconnectEventbriteIntegration: integrationsDisconnectEventbriteIntegrationResponse;
	integrationsDisconnectFacebookEvents: integrationsDisconnectFacebookEventsResponse;
	integrationsDisconnectFacebookIntegration: integrationsDisconnectFacebookIntegrationResponse;
	integrationsDisconnectInstagramIntegration: integrationsDisconnectInstagramIntegrationResponse;
	integrationsDisconnectLinkedInIntegration: integrationsDisconnectLinkedInIntegrationResponse;
	integrationsDisconnectPinterestConnection: integrationsDisconnectPinterestConnectionResponse;
	integrationsDisconnectSalesforceIntegration: integrationsDisconnectSalesforceIntegrationResponse;
	integrationsDisconnectShopify: integrationsDisconnectShopifyResponse;
	integrationsDisconnectTwitterIntegration: integrationsDisconnectTwitterIntegrationResponse;
	integrationsDisconnectEbayIntegration: integrationsDisconnectEbayIntegrationResponse;
	integrationsLogOutTwitterTweets: integrationsLogOutTwitterTweetsResponse;
	integrationsGetContactListsForShopify: integrationsGetContactListsForShopifyResponse;
	integrationsGetDigiohUsername: integrationsGetDigiohUsernameResponse;
	integrationsGetEtsyStoreName: integrationsGetEtsyStoreNameResponse;
	integrationsGetEventbriteUsername: integrationsGetEventbriteUsernameResponse;
	integrationsGetFacebookAccountHolder: integrationsGetFacebookAccountHolderResponse;
	integrationsGetFacebookAccountName: integrationsGetFacebookAccountNameResponse;
	integrationsGetIntegrationAuthURL: integrationsGetIntegrationAuthURLResponse;
	integrationsGetIntegrationConnectionList: integrationsGetIntegrationConnectionListResponse;
	integrationsGetLinkedInToken: integrationsGetLinkedInTokenResponse;
	integrationsGetShopifyProducts: integrationsGetShopifyProductsResponse;
	integrationsGetPaypalLists: integrationsGetPaypalListsResponse;
	integrationsGetPaypalLink: integrationsGetPaypalLinkResponse;
	integrationsGetPinterestUsername: integrationsGetPinterestUsernameResponse;
	integrationsGetSalesforceStatus: integrationsGetSalesforceStatusResponse;
	integrationsGetShopifyProductGrid: integrationsGetShopifyProductGridResponse;
	integrationsGetTwitterLogin: integrationsGetTwitterLoginResponse;
	integrationsGetUnbounceLink: integrationsGetUnbounceLinkResponse;
	integrationsGetUnbounceLists: integrationsGetUnbounceListsResponse;
	integrationsGetEbaySellerID: integrationsGetEbaySellerIDResponse;
	integrationsGetEbaySiteList: integrationsGetEbaySiteListResponse;
	integrationsTestEtsyIntegration: integrationsTestEtsyIntegrationResponse;
	integrationsTestEventbriteIntegration: integrationsTestEventbriteIntegrationResponse;
	integrationsTestFacebookEventsIntegration: integrationsTestFacebookEventsIntegrationResponse;
	integrationsTestFacebookIntegration: integrationsTestFacebookIntegrationResponse;
	integrationsTestLinkedInConnection: integrationsTestLinkedInConnectionResponse;
	integrationsTestPinterestIntegration: integrationsTestPinterestIntegrationResponse;
	integrationsTestSalesforceIntegration: integrationsTestSalesforceIntegrationResponse;
	integrationsTestTwitterIntegration: integrationsTestTwitterIntegrationResponse;
	integrationsTestTwitterTweets: integrationsTestTwitterTweetsResponse;
	integrationsTestEbayIntegration: integrationsTestEbayIntegrationResponse;
	webhooksCreateWebhook: webhooksCreateWebhookResponse;
	webhooksGetWebhooks: webhooksGetWebhooksResponse;
	webhooksDeleteWebhook: webhooksDeleteWebhookResponse;
	webhooksUpdateWebhook: webhooksUpdateWebhookResponse;
};

export const BenchmarkEmailEndpointInputSchemas = {
	contactsAddContactToList: contactsAddContactToListInputSchema,
	contactsCleanContactList: contactsCleanContactListInputSchema,
	contactsCompareContacts: contactsCompareContactsInputSchema,
	contactsCopyBulkContacts: contactsCopyBulkContactsInputSchema,
	contactsCopyContact: contactsCopyContactInputSchema,
	contactsCreateSegmentCriteria: contactsCreateSegmentCriteriaInputSchema,
	contactsCreateSegmentFromContactIDs:
		contactsCreateSegmentFromContactIDsInputSchema,
	contactsDeleteContactFromAllListsByID:
		contactsDeleteContactFromAllListsByIDInputSchema,
	contactsDeleteContactFromList: contactsDeleteContactFromListInputSchema,
	contactsDeleteContactFromSearch: contactsDeleteContactFromSearchInputSchema,
	contactsDeleteContactsFromAllLists:
		contactsDeleteContactsFromAllListsInputSchema,
	contactsDeleteContactsFromCurrentLists:
		contactsDeleteContactsFromCurrentListsInputSchema,
	contactsDeleteSegment: contactsDeleteSegmentInputSchema,
	contactsDeleteSegmentCriteria: contactsDeleteSegmentCriteriaInputSchema,
	contactsDeleteTrashList: contactsDeleteTrashListInputSchema,
	contactsGetActiveContactCount: contactsGetActiveContactCountInputSchema,
	contactsGetContactAuditHistory: contactsGetContactAuditHistoryInputSchema,
	contactsGetContactAuditHistoryDetail:
		contactsGetContactAuditHistoryDetailInputSchema,
	contactsGetContactDetails: contactsGetContactDetailsInputSchema,
	contactsGetContactImportStatus: contactsGetContactImportStatusInputSchema,
	contactsGetContactMergeList: contactsGetContactMergeListInputSchema,
	contactsGetContactsCount: contactsGetContactsCountInputSchema,
	contactsGetFilteredContacts: contactsGetFilteredContactsInputSchema,
	contactsGetFilteredContactsWithExtraFields:
		contactsGetFilteredContactsWithExtraFieldsInputSchema,
	contactsGetNonContactCount: contactsGetNonContactCountInputSchema,
	contactsGetSegmentAutoGenerateName:
		contactsGetSegmentAutoGenerateNameInputSchema,
	contactsGetSegmentDetails: contactsGetSegmentDetailsInputSchema,
	contactsGetSegmentList: contactsGetSegmentListInputSchema,
	contactsGetSegmentByID: contactsGetSegmentByIDInputSchema,
	contactsGetSegments: contactsGetSegmentsInputSchema,
	contactsGetTrashCount: contactsGetTrashCountInputSchema,
	contactsGetDownloadSegmentData: contactsGetDownloadSegmentDataInputSchema,
	contactsGetCleanCount: contactsGetCleanCountInputSchema,
	contactsGetUniqueContactCount: contactsGetUniqueContactCountInputSchema,
	contactsMergeContactsIntoExistingList:
		contactsMergeContactsIntoExistingListInputSchema,
	contactsMergeContactsIntoNewList: contactsMergeContactsIntoNewListInputSchema,
	contactsMoveBulkContacts: contactsMoveBulkContactsInputSchema,
	contactsMoveContactToDoNotContactList:
		contactsMoveContactToDoNotContactListInputSchema,
	contactsMoveContacts: contactsMoveContactsInputSchema,
	contactsResendEmails: contactsResendEmailsInputSchema,
	contactsSaveEmailAddress: contactsSaveEmailAddressInputSchema,
	contactsSaveVerifiedEmailAddresses:
		contactsSaveVerifiedEmailAddressesInputSchema,
	contactsSearchContactDetailsByEmail:
		contactsSearchContactDetailsByEmailInputSchema,
	contactsSendConfirmEmailVerification:
		contactsSendConfirmEmailVerificationInputSchema,
	contactsUpdateContactDetails: contactsUpdateContactDetailsInputSchema,
	contactsUpdateSegment: contactsUpdateSegmentInputSchema,
	listsCreateContactList: listsCreateContactListInputSchema,
	listsDeleteContactList: listsDeleteContactListInputSchema,
	listsDeleteList: listsDeleteListInputSchema,
	listsGetContactListDeepView: listsGetContactListDeepViewInputSchema,
	listsGetContactListDetails: listsGetContactListDetailsInputSchema,
	listsGetContactListFieldNames: listsGetContactListFieldNamesInputSchema,
	listsGetContactLists: listsGetContactListsInputSchema,
	listsGetDeleteListCheck: listsGetDeleteListCheckInputSchema,
	listsGetListUploadTerms: listsGetListUploadTermsInputSchema,
	listsGetContactListSummary: listsGetContactListSummaryInputSchema,
	listsRestoreTrashList: listsRestoreTrashListInputSchema,
	listsUpdateContactList: listsUpdateContactListInputSchema,
	emailsAddEmailToCommunity: emailsAddEmailToCommunityInputSchema,
	emailsCopyExistingEmail: emailsCopyExistingEmailInputSchema,
	emailsDeleteABTestEmail: emailsDeleteABTestEmailInputSchema,
	emailsDeleteABSplitCampaign: emailsDeleteABSplitCampaignInputSchema,
	emailsDeleteEmailCampaign: emailsDeleteEmailCampaignInputSchema,
	emailsGetABSplitDetails: emailsGetABSplitDetailsInputSchema,
	emailsGetABSplitResults: emailsGetABSplitResultsInputSchema,
	emailsGetABTests: emailsGetABTestsInputSchema,
	emailsGetCommunityCategory: emailsGetCommunityCategoryInputSchema,
	emailsGetCommunityEmailByID: emailsGetCommunityEmailByIDInputSchema,
	emailsGetEmailPreview: emailsGetEmailPreviewInputSchema,
	emailsGetEmailRecipientCount: emailsGetEmailRecipientCountInputSchema,
	emailsGetEmailSpamCheck: emailsGetEmailSpamCheckInputSchema,
	emailsGetEmailTemplates: emailsGetEmailTemplatesInputSchema,
	emailsGetEmails: emailsGetEmailsInputSchema,
	emailsGetEmailDetails: emailsGetEmailDetailsInputSchema,
	emailsGetTemplateCategoryList: emailsGetTemplateCategoryListInputSchema,
	emailsGetTemplateCategoryByID: emailsGetTemplateCategoryByIDInputSchema,
	emailsGetTemplateByID: emailsGetTemplateByIDInputSchema,
	emailsInitiateEmailScreenCapture: emailsInitiateEmailScreenCaptureInputSchema,
	emailsPermanentlyDeleteEmailFromTrash:
		emailsPermanentlyDeleteEmailFromTrashInputSchema,
	emailsRestoreEmailFromTrash: emailsRestoreEmailFromTrashInputSchema,
	emailsScheduleEmailCampaign: emailsScheduleEmailCampaignInputSchema,
	emailsUpdateEmailCampaign: emailsUpdateEmailCampaignInputSchema,
	emailsGetBadgesList: emailsGetBadgesListInputSchema,
	emailsGetLayoutList: emailsGetLayoutListInputSchema,
	emailsGetScheme: emailsGetSchemeInputSchema,
	emailsAddOrUpdateScheme: emailsAddOrUpdateSchemeInputSchema,
	emailsGetRSSHistoryByEmailID: emailsGetRSSHistoryByEmailIDInputSchema,
	emailsShareTemplateToSubAccounts: emailsShareTemplateToSubAccountsInputSchema,
	archiveAddEmailToArchive: archiveAddEmailToArchiveInputSchema,
	archiveDeleteEmailFromArchive: archiveDeleteEmailFromArchiveInputSchema,
	archiveGetArchiveDomainName: archiveGetArchiveDomainNameInputSchema,
	archiveGetArchiveEmailDetails: archiveGetArchiveEmailDetailsInputSchema,
	archiveGetArchiveEmails: archiveGetArchiveEmailsInputSchema,
	archiveGetArchiveHomeData: archiveGetArchiveHomeDataInputSchema,
	archiveGetArchiveHomePage: archiveGetArchiveHomePageInputSchema,
	archiveGetArchivePages: archiveGetArchivePagesInputSchema,
	archiveGetDetailsAboutArchivePage:
		archiveGetDetailsAboutArchivePageInputSchema,
	archiveGetHTMLForArchiveNewsletter:
		archiveGetHTMLForArchiveNewsletterInputSchema,
	archiveGetHTMLForButton: archiveGetHTMLForButtonInputSchema,
	archiveGetImageForButton: archiveGetImageForButtonInputSchema,
	archiveUpdateArchiveHomePage: archiveUpdateArchiveHomePageInputSchema,
	archiveUpdateArchiveHomePageData: archiveUpdateArchiveHomePageDataInputSchema,
	automationsAddEmailInAutomation: automationsAddEmailInAutomationInputSchema,
	automationsCopyEmailInAutomation: automationsCopyEmailInAutomationInputSchema,
	automationsCreateAutomationCopy: automationsCreateAutomationCopyInputSchema,
	automationsDeleteAutomation: automationsDeleteAutomationInputSchema,
	automationsDeleteAutomationEmail: automationsDeleteAutomationEmailInputSchema,
	automationsGetAutomationEmailDetails:
		automationsGetAutomationEmailDetailsInputSchema,
	automationsGetAutomationDetails: automationsGetAutomationDetailsInputSchema,
	automationsGetAutomationSummaryReport:
		automationsGetAutomationSummaryReportInputSchema,
	automationsUpdateEmailContentForAutomation:
		automationsUpdateEmailContentForAutomationInputSchema,
	reportsGetABTestReport: reportsGetABTestReportInputSchema,
	reportsGetAbuseCampaignReportByEmailID:
		reportsGetAbuseCampaignReportByEmailIDInputSchema,
	reportsGetAbuseReport: reportsGetAbuseReportInputSchema,
	reportsGetBouncesReportByEmailID: reportsGetBouncesReportByEmailIDInputSchema,
	reportsGetCampaignEngagementList: reportsGetCampaignEngagementListInputSchema,
	reportsGetCampaignHistoryByEmailID:
		reportsGetCampaignHistoryByEmailIDInputSchema,
	reportsGetClickContactCount: reportsGetClickContactCountInputSchema,
	reportsGetClickHeatMapByEmailID: reportsGetClickHeatMapByEmailIDInputSchema,
	reportsGetClickPerformanceByEmailID:
		reportsGetClickPerformanceByEmailIDInputSchema,
	reportsGetClickPerformanceDetailsByEmail:
		reportsGetClickPerformanceDetailsByEmailInputSchema,
	reportsGetClickURLContactCount: reportsGetClickURLContactCountInputSchema,
	reportsGetClicksReportByEmailID: reportsGetClicksReportByEmailIDInputSchema,
	reportsGetContactReportHistory: reportsGetContactReportHistoryInputSchema,
	reportsGetDownloadReport: reportsGetDownloadReportInputSchema,
	reportsDownloadContactReport: reportsDownloadContactReportInputSchema,
	reportsGetEmailOpensByCountryRegion:
		reportsGetEmailOpensByCountryRegionInputSchema,
	reportsGetEmailReport: reportsGetEmailReportInputSchema,
	reportsGetEmailReportForwards: reportsGetEmailReportForwardsInputSchema,
	reportsGetForwardsReportByEmailID:
		reportsGetForwardsReportByEmailIDInputSchema,
	reportsGetLinkDetailByEmailID: reportsGetLinkDetailByEmailIDInputSchema,
	reportsGetOpenContactCount: reportsGetOpenContactCountInputSchema,
	reportsGetOpensHourlyReportByEmail:
		reportsGetOpensHourlyReportByEmailInputSchema,
	reportsGetOpensLocationReport: reportsGetOpensLocationReportInputSchema,
	reportsGetOpensLocationReportByEmail:
		reportsGetOpensLocationReportByEmailInputSchema,
	reportsGetOpensReport: reportsGetOpensReportInputSchema,
	reportsGetReportDetailsByABTest: reportsGetReportDetailsByABTestInputSchema,
	reportsGetReportDetailsByEmailID: reportsGetReportDetailsByEmailIDInputSchema,
	reportsGetReportDownload: reportsGetReportDownloadInputSchema,
	reportsGetReportsForAutoresponders:
		reportsGetReportsForAutorespondersInputSchema,
	reportsGetSocialPerformanceReport:
		reportsGetSocialPerformanceReportInputSchema,
	reportsGetURLEngagementList: reportsGetURLEngagementListInputSchema,
	reportsGetURLListByEmailID: reportsGetURLListByEmailIDInputSchema,
	reportsGetUnopensReport: reportsGetUnopensReportInputSchema,
	reportsGetUnopensReportByEmailID: reportsGetUnopensReportByEmailIDInputSchema,
	reportsGetUnsubscribeReportByEmailID:
		reportsGetUnsubscribeReportByEmailIDInputSchema,
	reportsGetSaveAsList: reportsGetSaveAsListInputSchema,
	reportsUpdateListCompilationDetails:
		reportsUpdateListCompilationDetailsInputSchema,
	signupFormsCopySignupForm: signupFormsCopySignupFormInputSchema,
	signupFormsCreateSignupForm: signupFormsCreateSignupFormInputSchema,
	signupFormsGetHTMLSignupForm: signupFormsGetHTMLSignupFormInputSchema,
	signupFormsGetMagentoHTMLSelected:
		signupFormsGetMagentoHTMLSelectedInputSchema,
	signupFormsGetMagentoHTMLDropdown:
		signupFormsGetMagentoHTMLDropdownInputSchema,
	signupFormsGetSignupFormButtonCode:
		signupFormsGetSignupFormButtonCodeInputSchema,
	signupFormsGetSignupFormContactFields:
		signupFormsGetSignupFormContactFieldsInputSchema,
	signupFormsGetSignupFormDetails: signupFormsGetSignupFormDetailsInputSchema,
	signupFormsGetSignupFormLink: signupFormsGetSignupFormLinkInputSchema,
	signupFormsGetSignupFormList: signupFormsGetSignupFormListInputSchema,
	signupFormsGetSignupFormsForContactList:
		signupFormsGetSignupFormsForContactListInputSchema,
	signupFormsGetSignupFormForUnbounce:
		signupFormsGetSignupFormForUnbounceInputSchema,
	signupFormsGetSignupFormTumbler: signupFormsGetSignupFormTumblerInputSchema,
	signupFormsGetSignupFormForMagento:
		signupFormsGetSignupFormForMagentoInputSchema,
	signupFormsGetTemplatesForSignupFormClassic:
		signupFormsGetTemplatesForSignupFormClassicInputSchema,
	signupFormsGetTumblerLists: signupFormsGetTumblerListsInputSchema,
	signupFormsSendTestEmailForSignupForm:
		signupFormsSendTestEmailForSignupFormInputSchema,
	surveysDeleteSurvey: surveysDeleteSurveyInputSchema,
	surveysGetSurveyDetails: surveysGetSurveyDetailsInputSchema,
	surveysGetSurveyTemplateList: surveysGetSurveyTemplateListInputSchema,
	surveysGetSurveyReportList: surveysGetSurveyReportListInputSchema,
	surveysGetSurveyFullReport: surveysGetSurveyFullReportInputSchema,
	surveysGetSurveyIndividualResults:
		surveysGetSurveyIndividualResultsInputSchema,
	surveysGetSurveyIndividualQuestionResult:
		surveysGetSurveyIndividualQuestionResultInputSchema,
	surveysGetSurveyReportAnswerText: surveysGetSurveyReportAnswerTextInputSchema,
	surveysGetSurveyReportAnswerComment:
		surveysGetSurveyReportAnswerCommentInputSchema,
	surveysGetSurveyReportAnswerOther:
		surveysGetSurveyReportAnswerOtherInputSchema,
	surveysGetSurveyReportDetail: surveysGetSurveyReportDetailInputSchema,
	surveysUpdateSurveyStatus: surveysUpdateSurveyStatusInputSchema,
	pollsCopyPoll: pollsCopyPollInputSchema,
	pollsCreatePoll: pollsCreatePollInputSchema,
	pollsDeletePoll: pollsDeletePollInputSchema,
	pollsGetPollDetails: pollsGetPollDetailsInputSchema,
	pollsGetPolls: pollsGetPollsInputSchema,
	pollsGetPollPreview: pollsGetPollPreviewInputSchema,
	pollsGetPollResponseReport: pollsGetPollResponseReportInputSchema,
	pollsUpdatePoll: pollsUpdatePollInputSchema,
	mediaDeleteImage: mediaDeleteImageInputSchema,
	mediaDeleteVideo: mediaDeleteVideoInputSchema,
	mediaGetVideoDetails: mediaGetVideoDetailsInputSchema,
	mediaGetImages: mediaGetImagesInputSchema,
	mediaGetImageDetails: mediaGetImageDetailsInputSchema,
	mediaGetGiphyImages: mediaGetGiphyImagesInputSchema,
	mediaShareVideo: mediaShareVideoInputSchema,
	mediaUploadVideo: mediaUploadVideoInputSchema,
	mediaCreateInbox: mediaCreateInboxInputSchema,
	mediaDeleteInbox: mediaDeleteInboxInputSchema,
	mediaGetInboxList: mediaGetInboxListInputSchema,
	mediaGetInboxMasterResult: mediaGetInboxMasterResultInputSchema,
	mediaGetInboxDetailResult: mediaGetInboxDetailResultInputSchema,
	accountAddRemoveInboxTestsFromSubAccount:
		accountAddRemoveInboxTestsFromSubAccountInputSchema,
	accountCopyImageToSubAccount: accountCopyImageToSubAccountInputSchema,
	accountDeleteLinkedAgencyAccount: accountDeleteLinkedAgencyAccountInputSchema,
	accountGetCommissionList: accountGetCommissionListInputSchema,
	accountGetLinkedAgencyAccountDetails:
		accountGetLinkedAgencyAccountDetailsInputSchema,
	accountGetLinkedAgencyAccounts: accountGetLinkedAgencyAccountsInputSchema,
	accountGetPartnerProfileDetails: accountGetPartnerProfileDetailsInputSchema,
	accountGetReferralsList: accountGetReferralsListInputSchema,
	accountGetSubAccountHistory: accountGetSubAccountHistoryInputSchema,
	accountGetSubAccounts: accountGetSubAccountsInputSchema,
	accountGetSubAccountsPlanList: accountGetSubAccountsPlanListInputSchema,
	accountGetReferralsLevel1List: accountGetReferralsLevel1ListInputSchema,
	accountGetSubAccountBalance: accountGetSubAccountBalanceInputSchema,
	accountGetSubAccountDetails: accountGetSubAccountDetailsInputSchema,
	accountGetSubAccountHistoryDetails:
		accountGetSubAccountHistoryDetailsInputSchema,
	accountLinkAgencyAccount: accountLinkAgencyAccountInputSchema,
	accountShareListsWithSubAccounts: accountShareListsWithSubAccountsInputSchema,
	accountUpdateLinkedAgencyAccount: accountUpdateLinkedAgencyAccountInputSchema,
	accountUpdatePartnerProfile: accountUpdatePartnerProfileInputSchema,
	accountChangePassword: accountChangePasswordInputSchema,
	accountChangeSecurityPIN: accountChangeSecurityPINInputSchema,
	accountCheckIfResponsive: accountCheckIfResponsiveInputSchema,
	accountDisableSecurityPIN: accountDisableSecurityPINInputSchema,
	accountGetAllConfirmedEmails: accountGetAllConfirmedEmailsInputSchema,
	accountGetClientAccountSettings: accountGetClientAccountSettingsInputSchema,
	accountGetClientPlanInformation: accountGetClientPlanInformationInputSchema,
	accountGetCurrentEmailAtTimeOfReset:
		accountGetCurrentEmailAtTimeOfResetInputSchema,
	accountGetDMARCList: accountGetDMARCListInputSchema,
	accountGetListOfConfirmedEmails: accountGetListOfConfirmedEmailsInputSchema,
	accountGetClientDetails: accountGetClientDetailsInputSchema,
	accountGetClientFilterDomain: accountGetClientFilterDomainInputSchema,
	accountGetClientProfileDetails: accountGetClientProfileDetailsInputSchema,
	accountGetClientsRatingRange: accountGetClientsRatingRangeInputSchema,
	accountLoginRedirectUsingToken: accountLoginRedirectUsingTokenInputSchema,
	accountPatchUpdateClientSettings: accountPatchUpdateClientSettingsInputSchema,
	accountResendConfirmEmail: accountResendConfirmEmailInputSchema,
	accountSaveSecurityPIN: accountSaveSecurityPINInputSchema,
	accountSaveWebsiteDomain: accountSaveWebsiteDomainInputSchema,
	accountSendPINViaEmail: accountSendPINViaEmailInputSchema,
	accountSendResetEmail: accountSendResetEmailInputSchema,
	accountSetResponsive: accountSetResponsiveInputSchema,
	accountUpdateEditProfile: accountUpdateEditProfileInputSchema,
	accountUpdateResetEmail: accountUpdateResetEmailInputSchema,
	accountGetNotification: accountGetNotificationInputSchema,
	accountGetWebPageAdsDetail: accountGetWebPageAdsDetailInputSchema,
	accountGetHelpTopics: accountGetHelpTopicsInputSchema,
	accountGenerateSupportTicket: accountGenerateSupportTicketInputSchema,
	accountSendSupportFeedback: accountSendSupportFeedbackInputSchema,
	accountGetCommunityDomain: accountGetCommunityDomainInputSchema,
	accountGetAccountSummary: accountGetAccountSummaryInputSchema,
	integrationsAssignProductToList: integrationsAssignProductToListInputSchema,
	integrationsConfigureShopifyPurchaseList:
		integrationsConfigureShopifyPurchaseListInputSchema,
	integrationsConnectService: integrationsConnectServiceInputSchema,
	integrationsDeleteProductAssociation:
		integrationsDeleteProductAssociationInputSchema,
	integrationsDisconnectEtsyIntegration:
		integrationsDisconnectEtsyIntegrationInputSchema,
	integrationsDisconnectEventbriteIntegration:
		integrationsDisconnectEventbriteIntegrationInputSchema,
	integrationsDisconnectFacebookEvents:
		integrationsDisconnectFacebookEventsInputSchema,
	integrationsDisconnectFacebookIntegration:
		integrationsDisconnectFacebookIntegrationInputSchema,
	integrationsDisconnectInstagramIntegration:
		integrationsDisconnectInstagramIntegrationInputSchema,
	integrationsDisconnectLinkedInIntegration:
		integrationsDisconnectLinkedInIntegrationInputSchema,
	integrationsDisconnectPinterestConnection:
		integrationsDisconnectPinterestConnectionInputSchema,
	integrationsDisconnectSalesforceIntegration:
		integrationsDisconnectSalesforceIntegrationInputSchema,
	integrationsDisconnectShopify: integrationsDisconnectShopifyInputSchema,
	integrationsDisconnectTwitterIntegration:
		integrationsDisconnectTwitterIntegrationInputSchema,
	integrationsDisconnectEbayIntegration:
		integrationsDisconnectEbayIntegrationInputSchema,
	integrationsLogOutTwitterTweets: integrationsLogOutTwitterTweetsInputSchema,
	integrationsGetContactListsForShopify:
		integrationsGetContactListsForShopifyInputSchema,
	integrationsGetDigiohUsername: integrationsGetDigiohUsernameInputSchema,
	integrationsGetEtsyStoreName: integrationsGetEtsyStoreNameInputSchema,
	integrationsGetEventbriteUsername:
		integrationsGetEventbriteUsernameInputSchema,
	integrationsGetFacebookAccountHolder:
		integrationsGetFacebookAccountHolderInputSchema,
	integrationsGetFacebookAccountName:
		integrationsGetFacebookAccountNameInputSchema,
	integrationsGetIntegrationAuthURL:
		integrationsGetIntegrationAuthURLInputSchema,
	integrationsGetIntegrationConnectionList:
		integrationsGetIntegrationConnectionListInputSchema,
	integrationsGetLinkedInToken: integrationsGetLinkedInTokenInputSchema,
	integrationsGetShopifyProducts: integrationsGetShopifyProductsInputSchema,
	integrationsGetPaypalLists: integrationsGetPaypalListsInputSchema,
	integrationsGetPaypalLink: integrationsGetPaypalLinkInputSchema,
	integrationsGetPinterestUsername: integrationsGetPinterestUsernameInputSchema,
	integrationsGetSalesforceStatus: integrationsGetSalesforceStatusInputSchema,
	integrationsGetShopifyProductGrid:
		integrationsGetShopifyProductGridInputSchema,
	integrationsGetTwitterLogin: integrationsGetTwitterLoginInputSchema,
	integrationsGetUnbounceLink: integrationsGetUnbounceLinkInputSchema,
	integrationsGetUnbounceLists: integrationsGetUnbounceListsInputSchema,
	integrationsGetEbaySellerID: integrationsGetEbaySellerIDInputSchema,
	integrationsGetEbaySiteList: integrationsGetEbaySiteListInputSchema,
	integrationsTestEtsyIntegration: integrationsTestEtsyIntegrationInputSchema,
	integrationsTestEventbriteIntegration:
		integrationsTestEventbriteIntegrationInputSchema,
	integrationsTestFacebookEventsIntegration:
		integrationsTestFacebookEventsIntegrationInputSchema,
	integrationsTestFacebookIntegration:
		integrationsTestFacebookIntegrationInputSchema,
	integrationsTestLinkedInConnection:
		integrationsTestLinkedInConnectionInputSchema,
	integrationsTestPinterestIntegration:
		integrationsTestPinterestIntegrationInputSchema,
	integrationsTestSalesforceIntegration:
		integrationsTestSalesforceIntegrationInputSchema,
	integrationsTestTwitterIntegration:
		integrationsTestTwitterIntegrationInputSchema,
	integrationsTestTwitterTweets: integrationsTestTwitterTweetsInputSchema,
	integrationsTestEbayIntegration: integrationsTestEbayIntegrationInputSchema,
	webhooksCreateWebhook: webhooksCreateWebhookInputSchema,
	webhooksGetWebhooks: webhooksGetWebhooksInputSchema,
	webhooksDeleteWebhook: webhooksDeleteWebhookInputSchema,
	webhooksUpdateWebhook: webhooksUpdateWebhookInputSchema,
} as const;

export const BenchmarkEmailEndpointOutputSchemas = {
	contactsAddContactToList: contactsAddContactToListResponseSchema,
	contactsCleanContactList: contactsCleanContactListResponseSchema,
	contactsCompareContacts: contactsCompareContactsResponseSchema,
	contactsCopyBulkContacts: contactsCopyBulkContactsResponseSchema,
	contactsCopyContact: contactsCopyContactResponseSchema,
	contactsCreateSegmentCriteria: contactsCreateSegmentCriteriaResponseSchema,
	contactsCreateSegmentFromContactIDs:
		contactsCreateSegmentFromContactIDsResponseSchema,
	contactsDeleteContactFromAllListsByID:
		contactsDeleteContactFromAllListsByIDResponseSchema,
	contactsDeleteContactFromList: contactsDeleteContactFromListResponseSchema,
	contactsDeleteContactFromSearch:
		contactsDeleteContactFromSearchResponseSchema,
	contactsDeleteContactsFromAllLists:
		contactsDeleteContactsFromAllListsResponseSchema,
	contactsDeleteContactsFromCurrentLists:
		contactsDeleteContactsFromCurrentListsResponseSchema,
	contactsDeleteSegment: contactsDeleteSegmentResponseSchema,
	contactsDeleteSegmentCriteria: contactsDeleteSegmentCriteriaResponseSchema,
	contactsDeleteTrashList: contactsDeleteTrashListResponseSchema,
	contactsGetActiveContactCount: contactsGetActiveContactCountResponseSchema,
	contactsGetContactAuditHistory: contactsGetContactAuditHistoryResponseSchema,
	contactsGetContactAuditHistoryDetail:
		contactsGetContactAuditHistoryDetailResponseSchema,
	contactsGetContactDetails: contactsGetContactDetailsResponseSchema,
	contactsGetContactImportStatus: contactsGetContactImportStatusResponseSchema,
	contactsGetContactMergeList: contactsGetContactMergeListResponseSchema,
	contactsGetContactsCount: contactsGetContactsCountResponseSchema,
	contactsGetFilteredContacts: contactsGetFilteredContactsResponseSchema,
	contactsGetFilteredContactsWithExtraFields:
		contactsGetFilteredContactsWithExtraFieldsResponseSchema,
	contactsGetNonContactCount: contactsGetNonContactCountResponseSchema,
	contactsGetSegmentAutoGenerateName:
		contactsGetSegmentAutoGenerateNameResponseSchema,
	contactsGetSegmentDetails: contactsGetSegmentDetailsResponseSchema,
	contactsGetSegmentList: contactsGetSegmentListResponseSchema,
	contactsGetSegmentByID: contactsGetSegmentByIDResponseSchema,
	contactsGetSegments: contactsGetSegmentsResponseSchema,
	contactsGetTrashCount: contactsGetTrashCountResponseSchema,
	contactsGetDownloadSegmentData: contactsGetDownloadSegmentDataResponseSchema,
	contactsGetCleanCount: contactsGetCleanCountResponseSchema,
	contactsGetUniqueContactCount: contactsGetUniqueContactCountResponseSchema,
	contactsMergeContactsIntoExistingList:
		contactsMergeContactsIntoExistingListResponseSchema,
	contactsMergeContactsIntoNewList:
		contactsMergeContactsIntoNewListResponseSchema,
	contactsMoveBulkContacts: contactsMoveBulkContactsResponseSchema,
	contactsMoveContactToDoNotContactList:
		contactsMoveContactToDoNotContactListResponseSchema,
	contactsMoveContacts: contactsMoveContactsResponseSchema,
	contactsResendEmails: contactsResendEmailsResponseSchema,
	contactsSaveEmailAddress: contactsSaveEmailAddressResponseSchema,
	contactsSaveVerifiedEmailAddresses:
		contactsSaveVerifiedEmailAddressesResponseSchema,
	contactsSearchContactDetailsByEmail:
		contactsSearchContactDetailsByEmailResponseSchema,
	contactsSendConfirmEmailVerification:
		contactsSendConfirmEmailVerificationResponseSchema,
	contactsUpdateContactDetails: contactsUpdateContactDetailsResponseSchema,
	contactsUpdateSegment: contactsUpdateSegmentResponseSchema,
	listsCreateContactList: listsCreateContactListResponseSchema,
	listsDeleteContactList: listsDeleteContactListResponseSchema,
	listsDeleteList: listsDeleteListResponseSchema,
	listsGetContactListDeepView: listsGetContactListDeepViewResponseSchema,
	listsGetContactListDetails: listsGetContactListDetailsResponseSchema,
	listsGetContactListFieldNames: listsGetContactListFieldNamesResponseSchema,
	listsGetContactLists: listsGetContactListsResponseSchema,
	listsGetDeleteListCheck: listsGetDeleteListCheckResponseSchema,
	listsGetListUploadTerms: listsGetListUploadTermsResponseSchema,
	listsGetContactListSummary: listsGetContactListSummaryResponseSchema,
	listsRestoreTrashList: listsRestoreTrashListResponseSchema,
	listsUpdateContactList: listsUpdateContactListResponseSchema,
	emailsAddEmailToCommunity: emailsAddEmailToCommunityResponseSchema,
	emailsCopyExistingEmail: emailsCopyExistingEmailResponseSchema,
	emailsDeleteABTestEmail: emailsDeleteABTestEmailResponseSchema,
	emailsDeleteABSplitCampaign: emailsDeleteABSplitCampaignResponseSchema,
	emailsDeleteEmailCampaign: emailsDeleteEmailCampaignResponseSchema,
	emailsGetABSplitDetails: emailsGetABSplitDetailsResponseSchema,
	emailsGetABSplitResults: emailsGetABSplitResultsResponseSchema,
	emailsGetABTests: emailsGetABTestsResponseSchema,
	emailsGetCommunityCategory: emailsGetCommunityCategoryResponseSchema,
	emailsGetCommunityEmailByID: emailsGetCommunityEmailByIDResponseSchema,
	emailsGetEmailPreview: emailsGetEmailPreviewResponseSchema,
	emailsGetEmailRecipientCount: emailsGetEmailRecipientCountResponseSchema,
	emailsGetEmailSpamCheck: emailsGetEmailSpamCheckResponseSchema,
	emailsGetEmailTemplates: emailsGetEmailTemplatesResponseSchema,
	emailsGetEmails: emailsGetEmailsResponseSchema,
	emailsGetEmailDetails: emailsGetEmailDetailsResponseSchema,
	emailsGetTemplateCategoryList: emailsGetTemplateCategoryListResponseSchema,
	emailsGetTemplateCategoryByID: emailsGetTemplateCategoryByIDResponseSchema,
	emailsGetTemplateByID: emailsGetTemplateByIDResponseSchema,
	emailsInitiateEmailScreenCapture:
		emailsInitiateEmailScreenCaptureResponseSchema,
	emailsPermanentlyDeleteEmailFromTrash:
		emailsPermanentlyDeleteEmailFromTrashResponseSchema,
	emailsRestoreEmailFromTrash: emailsRestoreEmailFromTrashResponseSchema,
	emailsScheduleEmailCampaign: emailsScheduleEmailCampaignResponseSchema,
	emailsUpdateEmailCampaign: emailsUpdateEmailCampaignResponseSchema,
	emailsGetBadgesList: emailsGetBadgesListResponseSchema,
	emailsGetLayoutList: emailsGetLayoutListResponseSchema,
	emailsGetScheme: emailsGetSchemeResponseSchema,
	emailsAddOrUpdateScheme: emailsAddOrUpdateSchemeResponseSchema,
	emailsGetRSSHistoryByEmailID: emailsGetRSSHistoryByEmailIDResponseSchema,
	emailsShareTemplateToSubAccounts:
		emailsShareTemplateToSubAccountsResponseSchema,
	archiveAddEmailToArchive: archiveAddEmailToArchiveResponseSchema,
	archiveDeleteEmailFromArchive: archiveDeleteEmailFromArchiveResponseSchema,
	archiveGetArchiveDomainName: archiveGetArchiveDomainNameResponseSchema,
	archiveGetArchiveEmailDetails: archiveGetArchiveEmailDetailsResponseSchema,
	archiveGetArchiveEmails: archiveGetArchiveEmailsResponseSchema,
	archiveGetArchiveHomeData: archiveGetArchiveHomeDataResponseSchema,
	archiveGetArchiveHomePage: archiveGetArchiveHomePageResponseSchema,
	archiveGetArchivePages: archiveGetArchivePagesResponseSchema,
	archiveGetDetailsAboutArchivePage:
		archiveGetDetailsAboutArchivePageResponseSchema,
	archiveGetHTMLForArchiveNewsletter:
		archiveGetHTMLForArchiveNewsletterResponseSchema,
	archiveGetHTMLForButton: archiveGetHTMLForButtonResponseSchema,
	archiveGetImageForButton: archiveGetImageForButtonResponseSchema,
	archiveUpdateArchiveHomePage: archiveUpdateArchiveHomePageResponseSchema,
	archiveUpdateArchiveHomePageData:
		archiveUpdateArchiveHomePageDataResponseSchema,
	automationsAddEmailInAutomation:
		automationsAddEmailInAutomationResponseSchema,
	automationsCopyEmailInAutomation:
		automationsCopyEmailInAutomationResponseSchema,
	automationsCreateAutomationCopy:
		automationsCreateAutomationCopyResponseSchema,
	automationsDeleteAutomation: automationsDeleteAutomationResponseSchema,
	automationsDeleteAutomationEmail:
		automationsDeleteAutomationEmailResponseSchema,
	automationsGetAutomationEmailDetails:
		automationsGetAutomationEmailDetailsResponseSchema,
	automationsGetAutomationDetails:
		automationsGetAutomationDetailsResponseSchema,
	automationsGetAutomationSummaryReport:
		automationsGetAutomationSummaryReportResponseSchema,
	automationsUpdateEmailContentForAutomation:
		automationsUpdateEmailContentForAutomationResponseSchema,
	reportsGetABTestReport: reportsGetABTestReportResponseSchema,
	reportsGetAbuseCampaignReportByEmailID:
		reportsGetAbuseCampaignReportByEmailIDResponseSchema,
	reportsGetAbuseReport: reportsGetAbuseReportResponseSchema,
	reportsGetBouncesReportByEmailID:
		reportsGetBouncesReportByEmailIDResponseSchema,
	reportsGetCampaignEngagementList:
		reportsGetCampaignEngagementListResponseSchema,
	reportsGetCampaignHistoryByEmailID:
		reportsGetCampaignHistoryByEmailIDResponseSchema,
	reportsGetClickContactCount: reportsGetClickContactCountResponseSchema,
	reportsGetClickHeatMapByEmailID:
		reportsGetClickHeatMapByEmailIDResponseSchema,
	reportsGetClickPerformanceByEmailID:
		reportsGetClickPerformanceByEmailIDResponseSchema,
	reportsGetClickPerformanceDetailsByEmail:
		reportsGetClickPerformanceDetailsByEmailResponseSchema,
	reportsGetClickURLContactCount: reportsGetClickURLContactCountResponseSchema,
	reportsGetClicksReportByEmailID:
		reportsGetClicksReportByEmailIDResponseSchema,
	reportsGetContactReportHistory: reportsGetContactReportHistoryResponseSchema,
	reportsGetDownloadReport: reportsGetDownloadReportResponseSchema,
	reportsDownloadContactReport: reportsDownloadContactReportResponseSchema,
	reportsGetEmailOpensByCountryRegion:
		reportsGetEmailOpensByCountryRegionResponseSchema,
	reportsGetEmailReport: reportsGetEmailReportResponseSchema,
	reportsGetEmailReportForwards: reportsGetEmailReportForwardsResponseSchema,
	reportsGetForwardsReportByEmailID:
		reportsGetForwardsReportByEmailIDResponseSchema,
	reportsGetLinkDetailByEmailID: reportsGetLinkDetailByEmailIDResponseSchema,
	reportsGetOpenContactCount: reportsGetOpenContactCountResponseSchema,
	reportsGetOpensHourlyReportByEmail:
		reportsGetOpensHourlyReportByEmailResponseSchema,
	reportsGetOpensLocationReport: reportsGetOpensLocationReportResponseSchema,
	reportsGetOpensLocationReportByEmail:
		reportsGetOpensLocationReportByEmailResponseSchema,
	reportsGetOpensReport: reportsGetOpensReportResponseSchema,
	reportsGetReportDetailsByABTest:
		reportsGetReportDetailsByABTestResponseSchema,
	reportsGetReportDetailsByEmailID:
		reportsGetReportDetailsByEmailIDResponseSchema,
	reportsGetReportDownload: reportsGetReportDownloadResponseSchema,
	reportsGetReportsForAutoresponders:
		reportsGetReportsForAutorespondersResponseSchema,
	reportsGetSocialPerformanceReport:
		reportsGetSocialPerformanceReportResponseSchema,
	reportsGetURLEngagementList: reportsGetURLEngagementListResponseSchema,
	reportsGetURLListByEmailID: reportsGetURLListByEmailIDResponseSchema,
	reportsGetUnopensReport: reportsGetUnopensReportResponseSchema,
	reportsGetUnopensReportByEmailID:
		reportsGetUnopensReportByEmailIDResponseSchema,
	reportsGetUnsubscribeReportByEmailID:
		reportsGetUnsubscribeReportByEmailIDResponseSchema,
	reportsGetSaveAsList: reportsGetSaveAsListResponseSchema,
	reportsUpdateListCompilationDetails:
		reportsUpdateListCompilationDetailsResponseSchema,
	signupFormsCopySignupForm: signupFormsCopySignupFormResponseSchema,
	signupFormsCreateSignupForm: signupFormsCreateSignupFormResponseSchema,
	signupFormsGetHTMLSignupForm: signupFormsGetHTMLSignupFormResponseSchema,
	signupFormsGetMagentoHTMLSelected:
		signupFormsGetMagentoHTMLSelectedResponseSchema,
	signupFormsGetMagentoHTMLDropdown:
		signupFormsGetMagentoHTMLDropdownResponseSchema,
	signupFormsGetSignupFormButtonCode:
		signupFormsGetSignupFormButtonCodeResponseSchema,
	signupFormsGetSignupFormContactFields:
		signupFormsGetSignupFormContactFieldsResponseSchema,
	signupFormsGetSignupFormDetails:
		signupFormsGetSignupFormDetailsResponseSchema,
	signupFormsGetSignupFormLink: signupFormsGetSignupFormLinkResponseSchema,
	signupFormsGetSignupFormList: signupFormsGetSignupFormListResponseSchema,
	signupFormsGetSignupFormsForContactList:
		signupFormsGetSignupFormsForContactListResponseSchema,
	signupFormsGetSignupFormForUnbounce:
		signupFormsGetSignupFormForUnbounceResponseSchema,
	signupFormsGetSignupFormTumbler:
		signupFormsGetSignupFormTumblerResponseSchema,
	signupFormsGetSignupFormForMagento:
		signupFormsGetSignupFormForMagentoResponseSchema,
	signupFormsGetTemplatesForSignupFormClassic:
		signupFormsGetTemplatesForSignupFormClassicResponseSchema,
	signupFormsGetTumblerLists: signupFormsGetTumblerListsResponseSchema,
	signupFormsSendTestEmailForSignupForm:
		signupFormsSendTestEmailForSignupFormResponseSchema,
	surveysDeleteSurvey: surveysDeleteSurveyResponseSchema,
	surveysGetSurveyDetails: surveysGetSurveyDetailsResponseSchema,
	surveysGetSurveyTemplateList: surveysGetSurveyTemplateListResponseSchema,
	surveysGetSurveyReportList: surveysGetSurveyReportListResponseSchema,
	surveysGetSurveyFullReport: surveysGetSurveyFullReportResponseSchema,
	surveysGetSurveyIndividualResults:
		surveysGetSurveyIndividualResultsResponseSchema,
	surveysGetSurveyIndividualQuestionResult:
		surveysGetSurveyIndividualQuestionResultResponseSchema,
	surveysGetSurveyReportAnswerText:
		surveysGetSurveyReportAnswerTextResponseSchema,
	surveysGetSurveyReportAnswerComment:
		surveysGetSurveyReportAnswerCommentResponseSchema,
	surveysGetSurveyReportAnswerOther:
		surveysGetSurveyReportAnswerOtherResponseSchema,
	surveysGetSurveyReportDetail: surveysGetSurveyReportDetailResponseSchema,
	surveysUpdateSurveyStatus: surveysUpdateSurveyStatusResponseSchema,
	pollsCopyPoll: pollsCopyPollResponseSchema,
	pollsCreatePoll: pollsCreatePollResponseSchema,
	pollsDeletePoll: pollsDeletePollResponseSchema,
	pollsGetPollDetails: pollsGetPollDetailsResponseSchema,
	pollsGetPolls: pollsGetPollsResponseSchema,
	pollsGetPollPreview: pollsGetPollPreviewResponseSchema,
	pollsGetPollResponseReport: pollsGetPollResponseReportResponseSchema,
	pollsUpdatePoll: pollsUpdatePollResponseSchema,
	mediaDeleteImage: mediaDeleteImageResponseSchema,
	mediaDeleteVideo: mediaDeleteVideoResponseSchema,
	mediaGetVideoDetails: mediaGetVideoDetailsResponseSchema,
	mediaGetImages: mediaGetImagesResponseSchema,
	mediaGetImageDetails: mediaGetImageDetailsResponseSchema,
	mediaGetGiphyImages: mediaGetGiphyImagesResponseSchema,
	mediaShareVideo: mediaShareVideoResponseSchema,
	mediaUploadVideo: mediaUploadVideoResponseSchema,
	mediaCreateInbox: mediaCreateInboxResponseSchema,
	mediaDeleteInbox: mediaDeleteInboxResponseSchema,
	mediaGetInboxList: mediaGetInboxListResponseSchema,
	mediaGetInboxMasterResult: mediaGetInboxMasterResultResponseSchema,
	mediaGetInboxDetailResult: mediaGetInboxDetailResultResponseSchema,
	accountAddRemoveInboxTestsFromSubAccount:
		accountAddRemoveInboxTestsFromSubAccountResponseSchema,
	accountCopyImageToSubAccount: accountCopyImageToSubAccountResponseSchema,
	accountDeleteLinkedAgencyAccount:
		accountDeleteLinkedAgencyAccountResponseSchema,
	accountGetCommissionList: accountGetCommissionListResponseSchema,
	accountGetLinkedAgencyAccountDetails:
		accountGetLinkedAgencyAccountDetailsResponseSchema,
	accountGetLinkedAgencyAccounts: accountGetLinkedAgencyAccountsResponseSchema,
	accountGetPartnerProfileDetails:
		accountGetPartnerProfileDetailsResponseSchema,
	accountGetReferralsList: accountGetReferralsListResponseSchema,
	accountGetSubAccountHistory: accountGetSubAccountHistoryResponseSchema,
	accountGetSubAccounts: accountGetSubAccountsResponseSchema,
	accountGetSubAccountsPlanList: accountGetSubAccountsPlanListResponseSchema,
	accountGetReferralsLevel1List: accountGetReferralsLevel1ListResponseSchema,
	accountGetSubAccountBalance: accountGetSubAccountBalanceResponseSchema,
	accountGetSubAccountDetails: accountGetSubAccountDetailsResponseSchema,
	accountGetSubAccountHistoryDetails:
		accountGetSubAccountHistoryDetailsResponseSchema,
	accountLinkAgencyAccount: accountLinkAgencyAccountResponseSchema,
	accountShareListsWithSubAccounts:
		accountShareListsWithSubAccountsResponseSchema,
	accountUpdateLinkedAgencyAccount:
		accountUpdateLinkedAgencyAccountResponseSchema,
	accountUpdatePartnerProfile: accountUpdatePartnerProfileResponseSchema,
	accountChangePassword: accountChangePasswordResponseSchema,
	accountChangeSecurityPIN: accountChangeSecurityPINResponseSchema,
	accountCheckIfResponsive: accountCheckIfResponsiveResponseSchema,
	accountDisableSecurityPIN: accountDisableSecurityPINResponseSchema,
	accountGetAllConfirmedEmails: accountGetAllConfirmedEmailsResponseSchema,
	accountGetClientAccountSettings:
		accountGetClientAccountSettingsResponseSchema,
	accountGetClientPlanInformation:
		accountGetClientPlanInformationResponseSchema,
	accountGetCurrentEmailAtTimeOfReset:
		accountGetCurrentEmailAtTimeOfResetResponseSchema,
	accountGetDMARCList: accountGetDMARCListResponseSchema,
	accountGetListOfConfirmedEmails:
		accountGetListOfConfirmedEmailsResponseSchema,
	accountGetClientDetails: accountGetClientDetailsResponseSchema,
	accountGetClientFilterDomain: accountGetClientFilterDomainResponseSchema,
	accountGetClientProfileDetails: accountGetClientProfileDetailsResponseSchema,
	accountGetClientsRatingRange: accountGetClientsRatingRangeResponseSchema,
	accountLoginRedirectUsingToken: accountLoginRedirectUsingTokenResponseSchema,
	accountPatchUpdateClientSettings:
		accountPatchUpdateClientSettingsResponseSchema,
	accountResendConfirmEmail: accountResendConfirmEmailResponseSchema,
	accountSaveSecurityPIN: accountSaveSecurityPINResponseSchema,
	accountSaveWebsiteDomain: accountSaveWebsiteDomainResponseSchema,
	accountSendPINViaEmail: accountSendPINViaEmailResponseSchema,
	accountSendResetEmail: accountSendResetEmailResponseSchema,
	accountSetResponsive: accountSetResponsiveResponseSchema,
	accountUpdateEditProfile: accountUpdateEditProfileResponseSchema,
	accountUpdateResetEmail: accountUpdateResetEmailResponseSchema,
	accountGetNotification: accountGetNotificationResponseSchema,
	accountGetWebPageAdsDetail: accountGetWebPageAdsDetailResponseSchema,
	accountGetHelpTopics: accountGetHelpTopicsResponseSchema,
	accountGenerateSupportTicket: accountGenerateSupportTicketResponseSchema,
	accountSendSupportFeedback: accountSendSupportFeedbackResponseSchema,
	accountGetCommunityDomain: accountGetCommunityDomainResponseSchema,
	accountGetAccountSummary: accountGetAccountSummaryResponseSchema,
	integrationsAssignProductToList:
		integrationsAssignProductToListResponseSchema,
	integrationsConfigureShopifyPurchaseList:
		integrationsConfigureShopifyPurchaseListResponseSchema,
	integrationsConnectService: integrationsConnectServiceResponseSchema,
	integrationsDeleteProductAssociation:
		integrationsDeleteProductAssociationResponseSchema,
	integrationsDisconnectEtsyIntegration:
		integrationsDisconnectEtsyIntegrationResponseSchema,
	integrationsDisconnectEventbriteIntegration:
		integrationsDisconnectEventbriteIntegrationResponseSchema,
	integrationsDisconnectFacebookEvents:
		integrationsDisconnectFacebookEventsResponseSchema,
	integrationsDisconnectFacebookIntegration:
		integrationsDisconnectFacebookIntegrationResponseSchema,
	integrationsDisconnectInstagramIntegration:
		integrationsDisconnectInstagramIntegrationResponseSchema,
	integrationsDisconnectLinkedInIntegration:
		integrationsDisconnectLinkedInIntegrationResponseSchema,
	integrationsDisconnectPinterestConnection:
		integrationsDisconnectPinterestConnectionResponseSchema,
	integrationsDisconnectSalesforceIntegration:
		integrationsDisconnectSalesforceIntegrationResponseSchema,
	integrationsDisconnectShopify: integrationsDisconnectShopifyResponseSchema,
	integrationsDisconnectTwitterIntegration:
		integrationsDisconnectTwitterIntegrationResponseSchema,
	integrationsDisconnectEbayIntegration:
		integrationsDisconnectEbayIntegrationResponseSchema,
	integrationsLogOutTwitterTweets:
		integrationsLogOutTwitterTweetsResponseSchema,
	integrationsGetContactListsForShopify:
		integrationsGetContactListsForShopifyResponseSchema,
	integrationsGetDigiohUsername: integrationsGetDigiohUsernameResponseSchema,
	integrationsGetEtsyStoreName: integrationsGetEtsyStoreNameResponseSchema,
	integrationsGetEventbriteUsername:
		integrationsGetEventbriteUsernameResponseSchema,
	integrationsGetFacebookAccountHolder:
		integrationsGetFacebookAccountHolderResponseSchema,
	integrationsGetFacebookAccountName:
		integrationsGetFacebookAccountNameResponseSchema,
	integrationsGetIntegrationAuthURL:
		integrationsGetIntegrationAuthURLResponseSchema,
	integrationsGetIntegrationConnectionList:
		integrationsGetIntegrationConnectionListResponseSchema,
	integrationsGetLinkedInToken: integrationsGetLinkedInTokenResponseSchema,
	integrationsGetShopifyProducts: integrationsGetShopifyProductsResponseSchema,
	integrationsGetPaypalLists: integrationsGetPaypalListsResponseSchema,
	integrationsGetPaypalLink: integrationsGetPaypalLinkResponseSchema,
	integrationsGetPinterestUsername:
		integrationsGetPinterestUsernameResponseSchema,
	integrationsGetSalesforceStatus:
		integrationsGetSalesforceStatusResponseSchema,
	integrationsGetShopifyProductGrid:
		integrationsGetShopifyProductGridResponseSchema,
	integrationsGetTwitterLogin: integrationsGetTwitterLoginResponseSchema,
	integrationsGetUnbounceLink: integrationsGetUnbounceLinkResponseSchema,
	integrationsGetUnbounceLists: integrationsGetUnbounceListsResponseSchema,
	integrationsGetEbaySellerID: integrationsGetEbaySellerIDResponseSchema,
	integrationsGetEbaySiteList: integrationsGetEbaySiteListResponseSchema,
	integrationsTestEtsyIntegration:
		integrationsTestEtsyIntegrationResponseSchema,
	integrationsTestEventbriteIntegration:
		integrationsTestEventbriteIntegrationResponseSchema,
	integrationsTestFacebookEventsIntegration:
		integrationsTestFacebookEventsIntegrationResponseSchema,
	integrationsTestFacebookIntegration:
		integrationsTestFacebookIntegrationResponseSchema,
	integrationsTestLinkedInConnection:
		integrationsTestLinkedInConnectionResponseSchema,
	integrationsTestPinterestIntegration:
		integrationsTestPinterestIntegrationResponseSchema,
	integrationsTestSalesforceIntegration:
		integrationsTestSalesforceIntegrationResponseSchema,
	integrationsTestTwitterIntegration:
		integrationsTestTwitterIntegrationResponseSchema,
	integrationsTestTwitterTweets: integrationsTestTwitterTweetsResponseSchema,
	integrationsTestEbayIntegration:
		integrationsTestEbayIntegrationResponseSchema,
	webhooksCreateWebhook: webhooksCreateWebhookResponseSchema,
	webhooksGetWebhooks: webhooksGetWebhooksResponseSchema,
	webhooksDeleteWebhook: webhooksDeleteWebhookResponseSchema,
	webhooksUpdateWebhook: webhooksUpdateWebhookResponseSchema,
} as const;
