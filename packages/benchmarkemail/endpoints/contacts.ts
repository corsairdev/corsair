/**
 * Benchmark Email contacts endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Contacts folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const addContactToList: BenchmarkEmailEndpoints['contactsAddContactToList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsAddContactToList']
		>(`Contact/${encodeURIComponent(input.listID)}/ContactDetails`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.addContactToList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const cleanContactList: BenchmarkEmailEndpoints['contactsCleanContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCleanContactList']
		>(`Contact/${encodeURIComponent(input.listID)}/Clean`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.cleanContactList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const compareContacts: BenchmarkEmailEndpoints['contactsCompareContacts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCompareContacts']
		>(`Contact/${encodeURIComponent(input.listIDs)}/Compare`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.compareContacts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const copyBulkContacts: BenchmarkEmailEndpoints['contactsCopyBulkContacts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCopyBulkContacts']
		>(`Contact/CopyContacts`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.copyBulkContacts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const copyContact: BenchmarkEmailEndpoints['contactsCopyContact'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCopyContact']
		>(
			`Contact/CopyContacts/${encodeURIComponent(input.listID)}/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.copyContact',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createSegmentCriteria: BenchmarkEmailEndpoints['contactsCreateSegmentCriteria'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCreateSegmentCriteria']
		>(
			`Contact/Segments/${encodeURIComponent(input.segmentID)}/Criteria`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.createSegmentCriteria',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createSegmentFromContactIDs: BenchmarkEmailEndpoints['contactsCreateSegmentFromContactIDs'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsCreateSegmentFromContactIDs']
		>(`Contact/${encodeURIComponent(input.listID)}/Segments`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.createSegmentFromContactIDs',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactFromAllListsByID: BenchmarkEmailEndpoints['contactsDeleteContactFromAllListsByID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteContactFromAllListsByID']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/All/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'DELETE', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteContactFromAllListsByID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactFromList: BenchmarkEmailEndpoints['contactsDeleteContactFromList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteContactFromList']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteContactFromList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactFromSearch: BenchmarkEmailEndpoints['contactsDeleteContactFromSearch'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteContactFromSearch']
		>(
			`Contact/ContactDetails/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteContactFromSearch',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactsFromAllLists: BenchmarkEmailEndpoints['contactsDeleteContactsFromAllLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteContactsFromAllLists']
		>(`Contact/ContactDetails/All`, ctx.key, {
			method: 'DELETE',
			body: input.data,
			query: compactQuery({ search: input.search }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteContactsFromAllLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactsFromCurrentLists: BenchmarkEmailEndpoints['contactsDeleteContactsFromCurrentLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteContactsFromCurrentLists']
		>(`Contact/ContactDetails`, ctx.key, {
			method: 'DELETE',
			body: input.data,
			query: compactQuery({ search: input.search }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteContactsFromCurrentLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteSegment: BenchmarkEmailEndpoints['contactsDeleteSegment'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteSegment']
		>(`Contact/Segments/${encodeURIComponent(input.segmentID)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteSegment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteSegmentCriteria: BenchmarkEmailEndpoints['contactsDeleteSegmentCriteria'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteSegmentCriteria']
		>(
			`Contact/Segments/${encodeURIComponent(input.segmentID)}/Criteria`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteSegmentCriteria',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteTrashList: BenchmarkEmailEndpoints['contactsDeleteTrashList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsDeleteTrashList']
		>(`Contact/DeleteTrashList/${encodeURIComponent(input.listIDs)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.deleteTrashList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getActiveContactCount: BenchmarkEmailEndpoints['contactsGetActiveContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetActiveContactCount']
		>(`Contact/ActiveCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getActiveContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactAuditHistory: BenchmarkEmailEndpoints['contactsGetContactAuditHistory'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactAuditHistory']
		>(`Contact/${encodeURIComponent(input.listID)}/AuditHistory`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactAuditHistory',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactAuditHistoryDetail: BenchmarkEmailEndpoints['contactsGetContactAuditHistoryDetail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactAuditHistoryDetail']
		>(
			`Contact/${encodeURIComponent(input.listID)}/AuditHistoryDetails/${encodeURIComponent(input.batchID)}/${encodeURIComponent(input.groupID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactAuditHistoryDetail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactDetails: BenchmarkEmailEndpoints['contactsGetContactDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactDetails']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactImportStatus: BenchmarkEmailEndpoints['contactsGetContactImportStatus'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactImportStatus']
		>(`Contact/ContactImportStatus`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactImportStatus',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactMergeList: BenchmarkEmailEndpoints['contactsGetContactMergeList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactMergeList']
		>(`Contact/${encodeURIComponent(input.listIDs)}/MergeLists`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactMergeList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactsCount: BenchmarkEmailEndpoints['contactsGetContactsCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetContactsCount']
		>(
			`Contact/Count/${encodeURIComponent(input.listIDs)}/${encodeURIComponent(input.segmentIDs)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getContactsCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFilteredContacts: BenchmarkEmailEndpoints['contactsGetFilteredContacts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetFilteredContacts']
		>(`Contact/${encodeURIComponent(input.listID)}/ContactDetails`, ctx.key, {
			method: 'GET',
			query: compactQuery({
				page: input.page,
				pageSize: input.pageSize,
				search: input.search,
				filter: input.filter,
			}),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getFilteredContacts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFilteredContactsWithExtraFields: BenchmarkEmailEndpoints['contactsGetFilteredContactsWithExtraFields'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetFilteredContactsWithExtraFields']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/ExtraFields`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					page: input.page,
					pageSize: input.pageSize,
					search: input.search,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getFilteredContactsWithExtraFields',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getNonContactCount: BenchmarkEmailEndpoints['contactsGetNonContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetNonContactCount']
		>(`Engagement/NonContactCount`, ctx.key, {
			method: 'GET',
			query: compactQuery({ filter: input.filter }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getNonContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSegmentAutoGenerateName: BenchmarkEmailEndpoints['contactsGetSegmentAutoGenerateName'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetSegmentAutoGenerateName']
		>(`Contact/Segments/Name/${encodeURIComponent(input.listID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getSegmentAutoGenerateName',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSegmentDetails: BenchmarkEmailEndpoints['contactsGetSegmentDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetSegmentDetails']
		>(
			`Contact/Segments/${encodeURIComponent(input.segmentID)}/SegmentDetails`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					page: input.page,
					pageSize: input.pageSize,
					search: input.search,
					sort: input.sort,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getSegmentDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSegmentList: BenchmarkEmailEndpoints['contactsGetSegmentList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetSegmentList']
		>(`Contact/${encodeURIComponent(input.listID)}/SegmentLists`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getSegmentList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSegmentByID: BenchmarkEmailEndpoints['contactsGetSegmentByID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetSegmentByID']
		>(`Contact/Segments/${encodeURIComponent(input.segmentID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getSegmentByID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSegments: BenchmarkEmailEndpoints['contactsGetSegments'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetSegments']
		>(`Contact/Segments`, ctx.key, {
			method: 'GET',
			query: compactQuery({
				page: input.page,
				pageSize: input.pageSize,
				search: input.search,
				sort: input.sort,
			}),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getSegments',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTrashCount: BenchmarkEmailEndpoints['contactsGetTrashCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetTrashCount']
		>(`Contact/TrashCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getTrashCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDownloadSegmentData: BenchmarkEmailEndpoints['contactsGetDownloadSegmentData'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetDownloadSegmentData']
		>(`Contact/${encodeURIComponent(input.id)}/Segment/Download`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getDownloadSegmentData',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCleanCount: BenchmarkEmailEndpoints['contactsGetCleanCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetCleanCount']
		>(`Contact/${encodeURIComponent(input.listID)}/CleanCount`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getCleanCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUniqueContactCount: BenchmarkEmailEndpoints['contactsGetUniqueContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsGetUniqueContactCount']
		>(`Contact/UniqueCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.getUniqueContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const mergeContactsIntoExistingList: BenchmarkEmailEndpoints['contactsMergeContactsIntoExistingList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsMergeContactsIntoExistingList']
		>(
			`Contact/${encodeURIComponent(input.listIDs)}/MergeIntoExistingList`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.mergeContactsIntoExistingList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const mergeContactsIntoNewList: BenchmarkEmailEndpoints['contactsMergeContactsIntoNewList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsMergeContactsIntoNewList']
		>(
			`Contact/${encodeURIComponent(input.listIDs)}/MergeIntoListNewList`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.mergeContactsIntoNewList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const moveBulkContacts: BenchmarkEmailEndpoints['contactsMoveBulkContacts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsMoveBulkContacts']
		>(`Contact/${encodeURIComponent(input.listID)}/MoveContacts`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.moveBulkContacts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const moveContactToDoNotContactList: BenchmarkEmailEndpoints['contactsMoveContactToDoNotContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsMoveContactToDoNotContactList']
		>(
			`Contact/${encodeURIComponent(input.listID)}/MoveToDNC/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.moveContactToDoNotContactList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const moveContacts: BenchmarkEmailEndpoints['contactsMoveContacts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsMoveContacts']
		>(
			`Contact/${encodeURIComponent(input.listID)}/MoveContacts/${encodeURIComponent(input.targetListID)}/${encodeURIComponent(input.contactIDs)}`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.moveContacts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const resendEmails: BenchmarkEmailEndpoints['contactsResendEmails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsResendEmails']
		>(`Contact/${encodeURIComponent(input.listID)}/ResendEmails`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.resendEmails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const saveEmailAddress: BenchmarkEmailEndpoints['contactsSaveEmailAddress'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsSaveEmailAddress']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/CSV`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.saveEmailAddress',
			{ ...input },
			'completed',
		);
		return response;
	};

export const saveVerifiedEmailAddresses: BenchmarkEmailEndpoints['contactsSaveVerifiedEmailAddresses'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsSaveVerifiedEmailAddresses']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/CSV/Verified`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.saveVerifiedEmailAddresses',
			{ ...input },
			'completed',
		);
		return response;
	};

export const searchContactDetailsByEmail: BenchmarkEmailEndpoints['contactsSearchContactDetailsByEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsSearchContactDetailsByEmail']
		>(`Contact/ContactDetails`, ctx.key, {
			method: 'GET',
			query: compactQuery({
				search: input.search,
				page: input.page,
				pageSize: input.pageSize,
			}),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.searchContactDetailsByEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendConfirmEmailVerification: BenchmarkEmailEndpoints['contactsSendConfirmEmailVerification'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsSendConfirmEmailVerification']
		>(`Client/ConfirmedEmail/Email`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.sendConfirmEmailVerification',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateContactDetails: BenchmarkEmailEndpoints['contactsUpdateContactDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsUpdateContactDetails']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ContactDetails/${encodeURIComponent(input.contactID)}`,
			ctx.key,
			{ method: 'PATCH', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.updateContactDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateSegment: BenchmarkEmailEndpoints['contactsUpdateSegment'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['contactsUpdateSegment']
		>(`Contact/Segments/${encodeURIComponent(input.segmentID)}`, ctx.key, {
			method: 'PATCH',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.contacts.updateSegment',
			{ ...input },
			'completed',
		);
		return response;
	};
