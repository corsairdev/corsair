/**
 * Endpoint registry and per-operation routing tests, modelled on the
 * merged ActiveCampaign plugin's `routing.test.ts`.
 *
 * Every registered operation is exercised through the real plugin
 * endpoint tree against a stubbed `globalThis.fetch`, so the assertions
 * observe the actual wire request: base URL, AuthToken header, method,
 * path with interpolated params, and the absence of `undefined`
 * segments. The (path, method, url) expectations encode each route's
 * documented method+path from the official collection at
 * https://developer.benchmarkemail.com/. Each fixture input is also
 * parsed against its own registered zod input schema, so a schema change
 * that invalidates a fixture fails loudly instead of testing stale data.
 */

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { compactQuery } from './endpoints/shared';
import {
	BenchmarkEmailEndpointInputSchemas,
	BenchmarkEmailEndpointOutputSchemas,
} from './endpoints/types';
import { benchmarkEmailEndpointMeta, benchmarkemail } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue('event-id'),
	};
});

const mockLogEvent = logEventFromContext as unknown as jest.Mock;

const TOKEN = 'test-api-token';
const BASE = 'https://clientapi.benchmarkemail.com';

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const SCHEMAS = BenchmarkEmailEndpointInputSchemas as unknown as Record<
	string,
	z.ZodType | undefined
>;
const OUTPUT_SCHEMAS = BenchmarkEmailEndpointOutputSchemas as unknown as Record<
	string,
	z.ZodType | undefined
>;
const META = benchmarkEmailEndpointMeta as Record<
	string,
	{ riskLevel: string; description: string }
>;

/** 'contacts.addContactToList' -> 'contactsAddContactToList' */
function toOperationKey(path: string): string {
	return path.replace(/\.(.)/g, (_match, c: string) => c.toUpperCase());
}

/** Looks an operation's input schema up, failing loudly if it is missing. */
function schemaFor(key: string): z.ZodType {
	const schema = SCHEMAS[key];
	if (!schema) throw new Error('No input schema registered for ' + key);
	return schema;
}

function outputSchemaFor(key: string): z.ZodType {
	const schema = OUTPUT_SCHEMAS[key];
	if (!schema) throw new Error('No output schema registered for ' + key);
	return schema;
}

interface Captured {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
}

function readHeaders(init?: RequestInit): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	return { ...(raw as Record<string, string>) };
}

/** Representative provider payload per response kind. */
const RESPONSE_SAMPLES: Record<string, Record<string, unknown>> = {
	contact: {
		contactID: 'contact_1',
		email: 'jane@example.com',
		firstName: 'Jane',
	},
	list: { listID: 'list_1', name: 'Newsletter', totalContacts: 3 },
	email: { id: 'email_1', name: 'Welcome', subject: 'Hi', status: 'sent' },
	report: { total: 10, opens: 5, clicks: 2, bounces: 1 },
	generic: { status: 'ok', message: 'done', total: 1, count: 1 },
};

describe('endpoint registry', () => {
	it('registers every operation exactly once', () => {
		expect(Object.keys(META)).toHaveLength(298);
	});

	it('maps every registry path onto a declared schema key', () => {
		const paths = Object.keys(META);
		expect(paths).toHaveLength(298);
		for (const path of paths) {
			expect(SCHEMAS).toHaveProperty(toOperationKey(path));
			expect(OUTPUT_SCHEMAS).toHaveProperty(toOperationKey(path));
		}
	});

	it('declares an input and output schema for every operation', () => {
		const inputs = Object.keys(SCHEMAS).sort();
		const outputs = Object.keys(OUTPUT_SCHEMAS).sort();
		expect(inputs).toEqual(outputs);
		expect(inputs).toHaveLength(298);
	});

	it('exposes every operation through the plugin endpoint tree', () => {
		const tree = benchmarkemail({ key: TOKEN }).endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
		const flattened = Object.entries(tree).flatMap(([group, leaves]) =>
			Object.keys(leaves).map((leaf) => group + '.' + leaf),
		);
		expect(flattened.sort()).toEqual(Object.keys(META).sort());
	});

	it('gives every operation a meaningful description', () => {
		const entries = Object.entries(META);
		expect(entries).toHaveLength(298);
		for (const [, meta] of entries) {
			expect(meta.description.length).toBeGreaterThan(10);
		}
	});

	it('assigns every operation a known risk level', () => {
		const levels = Object.values(META).map((m) => m.riskLevel);
		expect(levels).toHaveLength(298);
		for (const level of levels) {
			expect(['read', 'write', 'destructive']).toContain(level);
		}
	});
});

describe('operation routing', () => {
	const plugin = benchmarkemail({ key: TOKEN });
	const tree = plugin.endpoints as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;

	const originalFetch = globalThis.fetch;
	let calls: Captured[] = [];
	let warn: jest.SpyInstance;

	function makeCtx() {
		return {
			key: TOKEN,
			db: {},
			$getAccountId: async () => 'test-account',
			database: undefined,
		};
	}

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				headers: readHeaders(init),
				body: typeof init?.body === 'string' ? init.body : undefined,
			});
			return new Response(JSON.stringify({ marker: 'wire-response' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
		// The event logger has no database in this harness and warns; that
		// is expected and must not drown the output.
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		warn.mockRestore();
	});

	const cases: Array<{
		path: string;
		group: string;
		leaf: string;
		method: string;
		url: string;
		kind: string;
		input: Record<string, unknown>;
	}> = [
		{
			path: 'contacts.addContactToList',
			group: 'contacts',
			leaf: 'addContactToList',
			method: 'POST',
			url: 'Contact/test_listID/ContactDetails',
			kind: 'contact',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.cleanContactList',
			group: 'contacts',
			leaf: 'cleanContactList',
			method: 'POST',
			url: 'Contact/test_listID/Clean',
			kind: 'generic',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.compareContacts',
			group: 'contacts',
			leaf: 'compareContacts',
			method: 'GET',
			url: 'Contact/test_listIDs/Compare',
			kind: 'contact',
			input: { listIDs: 'test_listIDs', page: 1, pageSize: 25 },
		},
		{
			path: 'contacts.copyBulkContacts',
			group: 'contacts',
			leaf: 'copyBulkContacts',
			method: 'POST',
			url: 'Contact/CopyContacts',
			kind: 'contact',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'contacts.copyContact',
			group: 'contacts',
			leaf: 'copyContact',
			method: 'POST',
			url: 'Contact/CopyContacts/test_listID/test_contactID',
			kind: 'contact',
			input: {
				listID: 'test_listID',
				contactID: 'test_contactID',
				data: { name: 'Test' },
			},
		},
		{
			path: 'contacts.createSegmentCriteria',
			group: 'contacts',
			leaf: 'createSegmentCriteria',
			method: 'POST',
			url: 'Contact/Segments/test_segmentID/Criteria',
			kind: 'generic',
			input: { segmentID: 'test_segmentID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.createSegmentFromContactIDs',
			group: 'contacts',
			leaf: 'createSegmentFromContactIDs',
			method: 'POST',
			url: 'Contact/test_listID/Segments',
			kind: 'list',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.deleteContactFromAllListsByID',
			group: 'contacts',
			leaf: 'deleteContactFromAllListsByID',
			method: 'DELETE',
			url: 'Contact/test_listID/ContactDetails/All/test_contactID',
			kind: 'generic',
			input: {
				listID: 'test_listID',
				contactID: 'test_contactID',
				data: { name: 'Test' },
			},
		},
		{
			path: 'contacts.deleteContactFromList',
			group: 'contacts',
			leaf: 'deleteContactFromList',
			method: 'DELETE',
			url: 'Contact/test_listID/ContactDetails/test_contactID',
			kind: 'generic',
			input: { listID: 'test_listID', contactID: 'test_contactID' },
		},
		{
			path: 'contacts.deleteContactFromSearch',
			group: 'contacts',
			leaf: 'deleteContactFromSearch',
			method: 'DELETE',
			url: 'Contact/ContactDetails/test_contactID',
			kind: 'generic',
			input: { contactID: 'test_contactID' },
		},
		{
			path: 'contacts.deleteContactsFromAllLists',
			group: 'contacts',
			leaf: 'deleteContactsFromAllLists',
			method: 'DELETE',
			url: 'Contact/ContactDetails/All',
			kind: 'generic',
			input: { search: 'test_search', data: { name: 'Test' } },
		},
		{
			path: 'contacts.deleteContactsFromCurrentLists',
			group: 'contacts',
			leaf: 'deleteContactsFromCurrentLists',
			method: 'DELETE',
			url: 'Contact/ContactDetails',
			kind: 'generic',
			input: { search: 'test_search', data: { name: 'Test' } },
		},
		{
			path: 'contacts.deleteSegment',
			group: 'contacts',
			leaf: 'deleteSegment',
			method: 'DELETE',
			url: 'Contact/Segments/test_segmentID',
			kind: 'generic',
			input: { segmentID: 'test_segmentID' },
		},
		{
			path: 'contacts.deleteSegmentCriteria',
			group: 'contacts',
			leaf: 'deleteSegmentCriteria',
			method: 'DELETE',
			url: 'Contact/Segments/test_segmentID/Criteria',
			kind: 'generic',
			input: { segmentID: 'test_segmentID' },
		},
		{
			path: 'contacts.deleteTrashList',
			group: 'contacts',
			leaf: 'deleteTrashList',
			method: 'DELETE',
			url: 'Contact/DeleteTrashList/test_listIDs',
			kind: 'generic',
			input: { listIDs: 'test_listIDs' },
		},
		{
			path: 'contacts.getActiveContactCount',
			group: 'contacts',
			leaf: 'getActiveContactCount',
			method: 'GET',
			url: 'Contact/ActiveCount',
			kind: 'generic',
			input: {},
		},
		{
			path: 'contacts.getContactAuditHistory',
			group: 'contacts',
			leaf: 'getContactAuditHistory',
			method: 'GET',
			url: 'Contact/test_listID/AuditHistory',
			kind: 'generic',
			input: { listID: 'test_listID', page: 1, pageSize: 25 },
		},
		{
			path: 'contacts.getContactAuditHistoryDetail',
			group: 'contacts',
			leaf: 'getContactAuditHistoryDetail',
			method: 'GET',
			url: 'Contact/test_listID/AuditHistoryDetails/test_batchID/test_groupID',
			kind: 'generic',
			input: {
				listID: 'test_listID',
				batchID: 'test_batchID',
				groupID: 'test_groupID',
			},
		},
		{
			path: 'contacts.getContactDetails',
			group: 'contacts',
			leaf: 'getContactDetails',
			method: 'GET',
			url: 'Contact/test_listID/ContactDetails/test_contactID',
			kind: 'contact',
			input: { listID: 'test_listID', contactID: 'test_contactID' },
		},
		{
			path: 'contacts.getContactImportStatus',
			group: 'contacts',
			leaf: 'getContactImportStatus',
			method: 'GET',
			url: 'Contact/ContactImportStatus',
			kind: 'generic',
			input: {},
		},
		{
			path: 'contacts.getContactMergeList',
			group: 'contacts',
			leaf: 'getContactMergeList',
			method: 'GET',
			url: 'Contact/test_listIDs/MergeLists',
			kind: 'list',
			input: { listIDs: 'test_listIDs' },
		},
		{
			path: 'contacts.getContactsCount',
			group: 'contacts',
			leaf: 'getContactsCount',
			method: 'GET',
			url: 'Contact/Count/test_listIDs/test_segmentIDs',
			kind: 'generic',
			input: { listIDs: 'test_listIDs', segmentIDs: 'test_segmentIDs' },
		},
		{
			path: 'contacts.getFilteredContacts',
			group: 'contacts',
			leaf: 'getFilteredContacts',
			method: 'GET',
			url: 'Contact/test_listID/ContactDetails',
			kind: 'contact',
			input: {
				listID: 'test_listID',
				page: 1,
				pageSize: 25,
				search: 'test_search',
				filter: 'test_filter',
			},
		},
		{
			path: 'contacts.getFilteredContactsWithExtraFields',
			group: 'contacts',
			leaf: 'getFilteredContactsWithExtraFields',
			method: 'GET',
			url: 'Contact/test_listID/ContactDetails/ExtraFields',
			kind: 'contact',
			input: {
				listID: 'test_listID',
				page: 1,
				pageSize: 25,
				search: 'test_search',
			},
		},
		{
			path: 'contacts.getNonContactCount',
			group: 'contacts',
			leaf: 'getNonContactCount',
			method: 'GET',
			url: 'Engagement/NonContactCount',
			kind: 'report',
			input: { filter: 'test_filter' },
		},
		{
			path: 'contacts.getSegmentAutoGenerateName',
			group: 'contacts',
			leaf: 'getSegmentAutoGenerateName',
			method: 'GET',
			url: 'Contact/Segments/Name/test_listID',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'contacts.getSegmentDetails',
			group: 'contacts',
			leaf: 'getSegmentDetails',
			method: 'GET',
			url: 'Contact/Segments/test_segmentID/SegmentDetails',
			kind: 'contact',
			input: {
				segmentID: 'test_segmentID',
				page: 1,
				pageSize: 25,
				search: 'test_search',
				sort: 'test_sort',
			},
		},
		{
			path: 'contacts.getSegmentList',
			group: 'contacts',
			leaf: 'getSegmentList',
			method: 'GET',
			url: 'Contact/test_listID/SegmentLists',
			kind: 'list',
			input: { listID: 'test_listID', page: 1, pageSize: 25 },
		},
		{
			path: 'contacts.getSegmentByID',
			group: 'contacts',
			leaf: 'getSegmentByID',
			method: 'GET',
			url: 'Contact/Segments/test_segmentID',
			kind: 'generic',
			input: { segmentID: 'test_segmentID' },
		},
		{
			path: 'contacts.getSegments',
			group: 'contacts',
			leaf: 'getSegments',
			method: 'GET',
			url: 'Contact/Segments',
			kind: 'generic',
			input: {
				page: 1,
				pageSize: 25,
				search: 'test_search',
				sort: 'test_sort',
			},
		},
		{
			path: 'contacts.getTrashCount',
			group: 'contacts',
			leaf: 'getTrashCount',
			method: 'GET',
			url: 'Contact/TrashCount',
			kind: 'generic',
			input: {},
		},
		{
			path: 'contacts.getDownloadSegmentData',
			group: 'contacts',
			leaf: 'getDownloadSegmentData',
			method: 'GET',
			url: 'Contact/test_id/Segment/Download',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'contacts.getCleanCount',
			group: 'contacts',
			leaf: 'getCleanCount',
			method: 'GET',
			url: 'Contact/test_listID/CleanCount',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'contacts.getUniqueContactCount',
			group: 'contacts',
			leaf: 'getUniqueContactCount',
			method: 'GET',
			url: 'Contact/UniqueCount',
			kind: 'generic',
			input: {},
		},
		{
			path: 'contacts.mergeContactsIntoExistingList',
			group: 'contacts',
			leaf: 'mergeContactsIntoExistingList',
			method: 'POST',
			url: 'Contact/test_listIDs/MergeIntoExistingList',
			kind: 'list',
			input: { listIDs: 'test_listIDs', data: { name: 'Test' } },
		},
		{
			path: 'contacts.mergeContactsIntoNewList',
			group: 'contacts',
			leaf: 'mergeContactsIntoNewList',
			method: 'POST',
			url: 'Contact/test_listIDs/MergeIntoListNewList',
			kind: 'list',
			input: { listIDs: 'test_listIDs', data: { name: 'Test' } },
		},
		{
			path: 'contacts.moveBulkContacts',
			group: 'contacts',
			leaf: 'moveBulkContacts',
			method: 'POST',
			url: 'Contact/test_listID/MoveContacts',
			kind: 'contact',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.moveContactToDoNotContactList',
			group: 'contacts',
			leaf: 'moveContactToDoNotContactList',
			method: 'DELETE',
			url: 'Contact/test_listID/MoveToDNC/test_contactID',
			kind: 'generic',
			input: { listID: 'test_listID', contactID: 'test_contactID' },
		},
		{
			path: 'contacts.moveContacts',
			group: 'contacts',
			leaf: 'moveContacts',
			method: 'POST',
			url: 'Contact/test_listID/MoveContacts/test_targetListID/test_contactIDs',
			kind: 'contact',
			input: {
				listID: 'test_listID',
				targetListID: 'test_targetListID',
				contactIDs: 'test_contactIDs',
				data: { name: 'Test' },
			},
		},
		{
			path: 'contacts.resendEmails',
			group: 'contacts',
			leaf: 'resendEmails',
			method: 'POST',
			url: 'Contact/test_listID/ResendEmails',
			kind: 'generic',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.saveEmailAddress',
			group: 'contacts',
			leaf: 'saveEmailAddress',
			method: 'POST',
			url: 'Contact/test_listID/ContactDetails/CSV',
			kind: 'contact',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.saveVerifiedEmailAddresses',
			group: 'contacts',
			leaf: 'saveVerifiedEmailAddresses',
			method: 'POST',
			url: 'Contact/test_listID/ContactDetails/CSV/Verified',
			kind: 'contact',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'contacts.searchContactDetailsByEmail',
			group: 'contacts',
			leaf: 'searchContactDetailsByEmail',
			method: 'GET',
			url: 'Contact/ContactDetails',
			kind: 'contact',
			input: { search: 'test_search', page: 1, pageSize: 25 },
		},
		{
			path: 'contacts.sendConfirmEmailVerification',
			group: 'contacts',
			leaf: 'sendConfirmEmailVerification',
			method: 'POST',
			url: 'Client/ConfirmedEmail/Email',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'contacts.updateContactDetails',
			group: 'contacts',
			leaf: 'updateContactDetails',
			method: 'PATCH',
			url: 'Contact/test_listID/ContactDetails/test_contactID',
			kind: 'contact',
			input: {
				listID: 'test_listID',
				contactID: 'test_contactID',
				data: { name: 'Test' },
			},
		},
		{
			path: 'contacts.updateSegment',
			group: 'contacts',
			leaf: 'updateSegment',
			method: 'PATCH',
			url: 'Contact/Segments/test_segmentID',
			kind: 'generic',
			input: { segmentID: 'test_segmentID', data: { name: 'Test' } },
		},
		{
			path: 'lists.createContactList',
			group: 'lists',
			leaf: 'createContactList',
			method: 'POST',
			url: 'Contact/',
			kind: 'list',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'lists.deleteContactList',
			group: 'lists',
			leaf: 'deleteContactList',
			method: 'DELETE',
			url: 'Contact/test_listID',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'lists.deleteList',
			group: 'lists',
			leaf: 'deleteList',
			method: 'DELETE',
			url: 'Contact/DeleteList/test_listIDs',
			kind: 'generic',
			input: { listIDs: 'test_listIDs' },
		},
		{
			path: 'lists.getContactListDeepView',
			group: 'lists',
			leaf: 'getContactListDeepView',
			method: 'GET',
			url: 'Contact/test_listIDs/All',
			kind: 'list',
			input: { listIDs: 'test_listIDs', page: 1, pageSize: 25 },
		},
		{
			path: 'lists.getContactListDetails',
			group: 'lists',
			leaf: 'getContactListDetails',
			method: 'GET',
			url: 'Contact/test_listID',
			kind: 'list',
			input: { listID: 'test_listID' },
		},
		{
			path: 'lists.getContactListFieldNames',
			group: 'lists',
			leaf: 'getContactListFieldNames',
			method: 'GET',
			url: 'Contact/test_listID/Fields',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'lists.getContactLists',
			group: 'lists',
			leaf: 'getContactLists',
			method: 'GET',
			url: 'Contact/',
			kind: 'list',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'lists.getDeleteListCheck',
			group: 'lists',
			leaf: 'getDeleteListCheck',
			method: 'GET',
			url: 'Contact/DeleteListCheck/test_listIDs',
			kind: 'generic',
			input: { listIDs: 'test_listIDs' },
		},
		{
			path: 'lists.getListUploadTerms',
			group: 'lists',
			leaf: 'getListUploadTerms',
			method: 'GET',
			url: 'Client/ListUploadTerms',
			kind: 'generic',
			input: {},
		},
		{
			path: 'lists.getContactListSummary',
			group: 'lists',
			leaf: 'getContactListSummary',
			method: 'GET',
			url: 'Contact/test_listID/ContactSummary',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'lists.restoreTrashList',
			group: 'lists',
			leaf: 'restoreTrashList',
			method: 'PATCH',
			url: 'Contact/RestoreTrashList/test_listIDs',
			kind: 'generic',
			input: { listIDs: 'test_listIDs', data: { name: 'Test' } },
		},
		{
			path: 'lists.updateContactList',
			group: 'lists',
			leaf: 'updateContactList',
			method: 'PATCH',
			url: 'Contact/test_listID',
			kind: 'list',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'emails.addEmailToCommunity',
			group: 'emails',
			leaf: 'addEmailToCommunity',
			method: 'PATCH',
			url: 'Emails/Community/test_id',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.copyExistingEmail',
			group: 'emails',
			leaf: 'copyExistingEmail',
			method: 'POST',
			url: 'Emails/test_id',
			kind: 'email',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.deleteABTestEmail',
			group: 'emails',
			leaf: 'deleteABTestEmail',
			method: 'DELETE',
			url: 'ABSplit/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.deleteABSplitCampaign',
			group: 'emails',
			leaf: 'deleteABSplitCampaign',
			method: 'DELETE',
			url: 'Emails/test_id/ABSplit',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.deleteEmailCampaign',
			group: 'emails',
			leaf: 'deleteEmailCampaign',
			method: 'DELETE',
			url: 'Emails/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getABSplitDetails',
			group: 'emails',
			leaf: 'getABSplitDetails',
			method: 'GET',
			url: 'Emails/test_id/ABSplit',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getABSplitResults',
			group: 'emails',
			leaf: 'getABSplitResults',
			method: 'GET',
			url: 'ABSplit/test_id/Results',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getABTests',
			group: 'emails',
			leaf: 'getABTests',
			method: 'GET',
			url: 'ABSplit/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'emails.getCommunityCategory',
			group: 'emails',
			leaf: 'getCommunityCategory',
			method: 'GET',
			url: 'Emails/CommunityCategory',
			kind: 'generic',
			input: {},
		},
		{
			path: 'emails.getCommunityEmailByID',
			group: 'emails',
			leaf: 'getCommunityEmailByID',
			method: 'GET',
			url: 'Emails/CommunityGetEmail/test_id',
			kind: 'email',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getEmailPreview',
			group: 'emails',
			leaf: 'getEmailPreview',
			method: 'GET',
			url: 'Emails/test_id/Preview',
			kind: 'email',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getEmailRecipientCount',
			group: 'emails',
			leaf: 'getEmailRecipientCount',
			method: 'GET',
			url: 'Emails/test_id/RecipientCount',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getEmailSpamCheck',
			group: 'emails',
			leaf: 'getEmailSpamCheck',
			method: 'GET',
			url: 'Emails/test_id/Spam',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getEmailTemplates',
			group: 'emails',
			leaf: 'getEmailTemplates',
			method: 'GET',
			url: 'Emails/Template',
			kind: 'generic',
			input: { page: 1, pageSize: 25, criteria: 'test_criteria' },
		},
		{
			path: 'emails.getEmails',
			group: 'emails',
			leaf: 'getEmails',
			method: 'GET',
			url: 'Emails/',
			kind: 'email',
			input: { page: 1, pageSize: 25, criteria: 'test_criteria' },
		},
		{
			path: 'emails.getEmailDetails',
			group: 'emails',
			leaf: 'getEmailDetails',
			method: 'GET',
			url: 'Emails/test_id',
			kind: 'email',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.getTemplateCategoryList',
			group: 'emails',
			leaf: 'getTemplateCategoryList',
			method: 'GET',
			url: 'Emails/TemplateCategory',
			kind: 'generic',
			input: {},
		},
		{
			path: 'emails.getTemplateCategoryByID',
			group: 'emails',
			leaf: 'getTemplateCategoryByID',
			method: 'GET',
			url: 'Emails/TemplateCategory/test_categoryID',
			kind: 'generic',
			input: { categoryID: 'test_categoryID' },
		},
		{
			path: 'emails.getTemplateByID',
			group: 'emails',
			leaf: 'getTemplateByID',
			method: 'GET',
			url: 'Emails/Template/test_templateID',
			kind: 'generic',
			input: { templateID: 'test_templateID' },
		},
		{
			path: 'emails.initiateEmailScreenCapture',
			group: 'emails',
			leaf: 'initiateEmailScreenCapture',
			method: 'POST',
			url: 'Emails/test_id/ScreenCapture',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.permanentlyDeleteEmailFromTrash',
			group: 'emails',
			leaf: 'permanentlyDeleteEmailFromTrash',
			method: 'DELETE',
			url: 'Emails/test_id/Trash',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.restoreEmailFromTrash',
			group: 'emails',
			leaf: 'restoreEmailFromTrash',
			method: 'POST',
			url: 'Emails/test_id/Trash',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.scheduleEmailCampaign',
			group: 'emails',
			leaf: 'scheduleEmailCampaign',
			method: 'POST',
			url: 'Emails/test_id/Schedule',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.updateEmailCampaign',
			group: 'emails',
			leaf: 'updateEmailCampaign',
			method: 'PATCH',
			url: 'Emails/test_id',
			kind: 'email',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'emails.getBadgesList',
			group: 'emails',
			leaf: 'getBadgesList',
			method: 'GET',
			url: 'Emails/Badges',
			kind: 'generic',
			input: {},
		},
		{
			path: 'emails.getLayoutList',
			group: 'emails',
			leaf: 'getLayoutList',
			method: 'GET',
			url: 'Emails/Layout',
			kind: 'generic',
			input: {},
		},
		{
			path: 'emails.getScheme',
			group: 'emails',
			leaf: 'getScheme',
			method: 'GET',
			url: 'Emails/Scheme',
			kind: 'generic',
			input: {},
		},
		{
			path: 'emails.addOrUpdateScheme',
			group: 'emails',
			leaf: 'addOrUpdateScheme',
			method: 'PATCH',
			url: 'Emails/Scheme',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'emails.getRSSHistoryByEmailID',
			group: 'emails',
			leaf: 'getRSSHistoryByEmailID',
			method: 'GET',
			url: 'Emails/test_id/RSSHistory',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'emails.shareTemplateToSubAccounts',
			group: 'emails',
			leaf: 'shareTemplateToSubAccounts',
			method: 'POST',
			url: 'Emails/test_id/ShareTemplate',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'archive.addEmailToArchive',
			group: 'archive',
			leaf: 'addEmailToArchive',
			method: 'POST',
			url: 'Archive/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'archive.deleteEmailFromArchive',
			group: 'archive',
			leaf: 'deleteEmailFromArchive',
			method: 'DELETE',
			url: 'Archive/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'archive.getArchiveDomainName',
			group: 'archive',
			leaf: 'getArchiveDomainName',
			method: 'GET',
			url: 'Client/Archive/Domain',
			kind: 'generic',
			input: {},
		},
		{
			path: 'archive.getArchiveEmailDetails',
			group: 'archive',
			leaf: 'getArchiveEmailDetails',
			method: 'GET',
			url: 'Archive/test_archiveID/Detail',
			kind: 'generic',
			input: { archiveID: 'test_archiveID' },
		},
		{
			path: 'archive.getArchiveEmails',
			group: 'archive',
			leaf: 'getArchiveEmails',
			method: 'GET',
			url: 'Archive/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'archive.getArchiveHomeData',
			group: 'archive',
			leaf: 'getArchiveHomeData',
			method: 'GET',
			url: 'Archive/ArchiveHome/test_domain/test_type',
			kind: 'generic',
			input: { domain: 'test_domain', type: 'test_type' },
		},
		{
			path: 'archive.getArchiveHomePage',
			group: 'archive',
			leaf: 'getArchiveHomePage',
			method: 'GET',
			url: 'Archive/ArchiveHomePage',
			kind: 'generic',
			input: {},
		},
		{
			path: 'archive.getArchivePages',
			group: 'archive',
			leaf: 'getArchivePages',
			method: 'GET',
			url: 'Archive/ArchivePages',
			kind: 'generic',
			input: {},
		},
		{
			path: 'archive.getDetailsAboutArchivePage',
			group: 'archive',
			leaf: 'getDetailsAboutArchivePage',
			method: 'GET',
			url: 'Archive/Domain',
			kind: 'generic',
			input: {},
		},
		{
			path: 'archive.getHTMLForArchiveNewsletter',
			group: 'archive',
			leaf: 'getHTMLForArchiveNewsletter',
			method: 'POST',
			url: 'Archive/ArchiveEmail/test_domain',
			kind: 'generic',
			input: { domain: 'test_domain', data: { name: 'Test' } },
		},
		{
			path: 'archive.getHTMLForButton',
			group: 'archive',
			leaf: 'getHTMLForButton',
			method: 'GET',
			url: 'Archive/test_mode',
			kind: 'generic',
			input: { mode: 'test_mode' },
		},
		{
			path: 'archive.getImageForButton',
			group: 'archive',
			leaf: 'getImageForButton',
			method: 'GET',
			url: 'Archive/Image/test_mode',
			kind: 'generic',
			input: { mode: 'test_mode' },
		},
		{
			path: 'archive.updateArchiveHomePage',
			group: 'archive',
			leaf: 'updateArchiveHomePage',
			method: 'POST',
			url: 'Archive/AddArchiveHome',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'archive.updateArchiveHomePageData',
			group: 'archive',
			leaf: 'updateArchiveHomePageData',
			method: 'PATCH',
			url: 'Archive/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'automations.addEmailInAutomation',
			group: 'automations',
			leaf: 'addEmailInAutomation',
			method: 'POST',
			url: 'Automation/test_automationID/Emails',
			kind: 'generic',
			input: { automationID: 'test_automationID', data: { name: 'Test' } },
		},
		{
			path: 'automations.copyEmailInAutomation',
			group: 'automations',
			leaf: 'copyEmailInAutomation',
			method: 'POST',
			url: 'Automation/test_automationID/Emails/test_automationDetailID',
			kind: 'generic',
			input: {
				automationID: 'test_automationID',
				automationDetailID: 'test_automationDetailID',
				data: { name: 'Test' },
			},
		},
		{
			path: 'automations.createAutomationCopy',
			group: 'automations',
			leaf: 'createAutomationCopy',
			method: 'POST',
			url: 'Automation/test_automationID/Copy',
			kind: 'generic',
			input: { automationID: 'test_automationID', data: { name: 'Test' } },
		},
		{
			path: 'automations.deleteAutomation',
			group: 'automations',
			leaf: 'deleteAutomation',
			method: 'DELETE',
			url: 'Automation/test_automationID',
			kind: 'generic',
			input: { automationID: 'test_automationID' },
		},
		{
			path: 'automations.deleteAutomationEmail',
			group: 'automations',
			leaf: 'deleteAutomationEmail',
			method: 'DELETE',
			url: 'Automation/test_automationID/Emails/test_automationDetailID',
			kind: 'generic',
			input: {
				automationID: 'test_automationID',
				automationDetailID: 'test_automationDetailID',
			},
		},
		{
			path: 'automations.getAutomationEmailDetails',
			group: 'automations',
			leaf: 'getAutomationEmailDetails',
			method: 'GET',
			url: 'Automation/test_automationID/Emails/test_automationDetailID',
			kind: 'generic',
			input: {
				automationID: 'test_automationID',
				automationDetailID: 'test_automationDetailID',
			},
		},
		{
			path: 'automations.getAutomationDetails',
			group: 'automations',
			leaf: 'getAutomationDetails',
			method: 'GET',
			url: 'Automation/test_automationID',
			kind: 'generic',
			input: { automationID: 'test_automationID' },
		},
		{
			path: 'automations.getAutomationSummaryReport',
			group: 'automations',
			leaf: 'getAutomationSummaryReport',
			method: 'GET',
			url: 'Automation/test_automationID/Report',
			kind: 'report',
			input: { automationID: 'test_automationID' },
		},
		{
			path: 'automations.updateEmailContentForAutomation',
			group: 'automations',
			leaf: 'updateEmailContentForAutomation',
			method: 'PATCH',
			url: 'Automation/test_automationID/Emails/test_automationDetailID/Content',
			kind: 'generic',
			input: {
				automationID: 'test_automationID',
				automationDetailID: 'test_automationDetailID',
				data: { name: 'Test' },
			},
		},
		{
			path: 'reports.getABTestReport',
			group: 'reports',
			leaf: 'getABTestReport',
			method: 'GET',
			url: 'ABSplit/Report',
			kind: 'report',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'reports.getAbuseCampaignReportByEmailID',
			group: 'reports',
			leaf: 'getAbuseCampaignReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/AbuseCampaign',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getAbuseReport',
			group: 'reports',
			leaf: 'getAbuseReport',
			method: 'GET',
			url: 'Emails/Report/Abuse',
			kind: 'report',
			input: {},
		},
		{
			path: 'reports.getBouncesReportByEmailID',
			group: 'reports',
			leaf: 'getBouncesReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Bounces',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getCampaignEngagementList',
			group: 'reports',
			leaf: 'getCampaignEngagementList',
			method: 'GET',
			url: 'Engagement/CampaignList',
			kind: 'report',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'reports.getCampaignHistoryByEmailID',
			group: 'reports',
			leaf: 'getCampaignHistoryByEmailID',
			method: 'GET',
			url: 'Emails/test_id/CampaignHistory',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getClickContactCount',
			group: 'reports',
			leaf: 'getClickContactCount',
			method: 'GET',
			url: 'Engagement/ClickContactCount',
			kind: 'report',
			input: {},
		},
		{
			path: 'reports.getClickHeatMapByEmailID',
			group: 'reports',
			leaf: 'getClickHeatMapByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Click/HeatMap',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getClickPerformanceByEmailID',
			group: 'reports',
			leaf: 'getClickPerformanceByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/ClickPerformance',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getClickPerformanceDetailsByEmail',
			group: 'reports',
			leaf: 'getClickPerformanceDetailsByEmail',
			method: 'GET',
			url: 'Emails/test_id/Report/ClickPerformance/Details',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getClickURLContactCount',
			group: 'reports',
			leaf: 'getClickURLContactCount',
			method: 'GET',
			url: 'Engagement/ClickURLContactCount',
			kind: 'report',
			input: {},
		},
		{
			path: 'reports.getClicksReportByEmailID',
			group: 'reports',
			leaf: 'getClicksReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Clicks',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getContactReportHistory',
			group: 'reports',
			leaf: 'getContactReportHistory',
			method: 'GET',
			url: 'Contact/test_email/ContactReportHistory',
			kind: 'report',
			input: { email: 'test_email' },
		},
		{
			path: 'reports.getDownloadReport',
			group: 'reports',
			leaf: 'getDownloadReport',
			method: 'POST',
			url: 'Contact/test_id/Download',
			kind: 'report',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'reports.downloadContactReport',
			group: 'reports',
			leaf: 'downloadContactReport',
			method: 'GET',
			url: 'Contact/test_id/Download',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getEmailOpensByCountryRegion',
			group: 'reports',
			leaf: 'getEmailOpensByCountryRegion',
			method: 'GET',
			url: 'Emails/test_id/Report/Opens/test_country/test_region',
			kind: 'report',
			input: { id: 'test_id', country: 'test_country', region: 'test_region' },
		},
		{
			path: 'reports.getEmailReport',
			group: 'reports',
			leaf: 'getEmailReport',
			method: 'GET',
			url: 'Emails/Report',
			kind: 'report',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'reports.getEmailReportForwards',
			group: 'reports',
			leaf: 'getEmailReportForwards',
			method: 'GET',
			url: 'Emails/test_id/Report/Forwards',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getForwardsReportByEmailID',
			group: 'reports',
			leaf: 'getForwardsReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Forwards',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getLinkDetailByEmailID',
			group: 'reports',
			leaf: 'getLinkDetailByEmailID',
			method: 'GET',
			url: 'Emails/test_id/LinkDetail',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getOpenContactCount',
			group: 'reports',
			leaf: 'getOpenContactCount',
			method: 'GET',
			url: 'Engagement/OpenContactCount',
			kind: 'report',
			input: {},
		},
		{
			path: 'reports.getOpensHourlyReportByEmail',
			group: 'reports',
			leaf: 'getOpensHourlyReportByEmail',
			method: 'GET',
			url: 'Emails/test_id/Report/Opens/Hourly',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getOpensLocationReport',
			group: 'reports',
			leaf: 'getOpensLocationReport',
			method: 'GET',
			url: 'Emails/test_id/Report/Opens/Location',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getOpensLocationReportByEmail',
			group: 'reports',
			leaf: 'getOpensLocationReportByEmail',
			method: 'GET',
			url: 'Emails/test_id/Report/Opens/Location/test_countryCode',
			kind: 'report',
			input: { id: 'test_id', countryCode: 'test_countryCode' },
		},
		{
			path: 'reports.getOpensReport',
			group: 'reports',
			leaf: 'getOpensReport',
			method: 'GET',
			url: 'Emails/test_id/Report/Opens',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getReportDetailsByABTest',
			group: 'reports',
			leaf: 'getReportDetailsByABTest',
			method: 'GET',
			url: 'ABSplit/test_id/test_abID/Report',
			kind: 'report',
			input: { id: 'test_id', abID: 'test_abID' },
		},
		{
			path: 'reports.getReportDetailsByEmailID',
			group: 'reports',
			leaf: 'getReportDetailsByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getReportDownload',
			group: 'reports',
			leaf: 'getReportDownload',
			method: 'GET',
			url: 'Emails/test_id/test_reportType/Report/Download',
			kind: 'report',
			input: { id: 'test_id', reportType: 'test_reportType' },
		},
		{
			path: 'reports.getReportsForAutoresponders',
			group: 'reports',
			leaf: 'getReportsForAutoresponders',
			method: 'GET',
			url: 'Automation/Report',
			kind: 'report',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'reports.getSocialPerformanceReport',
			group: 'reports',
			leaf: 'getSocialPerformanceReport',
			method: 'GET',
			url: 'Emails/test_id/Report/SocialPerformance',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getURLEngagementList',
			group: 'reports',
			leaf: 'getURLEngagementList',
			method: 'GET',
			url: 'Engagement/URLList',
			kind: 'report',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'reports.getURLListByEmailID',
			group: 'reports',
			leaf: 'getURLListByEmailID',
			method: 'GET',
			url: 'Emails/test_id/URLList',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getUnopensReport',
			group: 'reports',
			leaf: 'getUnopensReport',
			method: 'GET',
			url: 'Emails/test_id/Report/Unopens',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getUnopensReportByEmailID',
			group: 'reports',
			leaf: 'getUnopensReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Unopens',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getUnsubscribeReportByEmailID',
			group: 'reports',
			leaf: 'getUnsubscribeReportByEmailID',
			method: 'GET',
			url: 'Emails/test_id/Report/Unsubscribes',
			kind: 'report',
			input: { id: 'test_id' },
		},
		{
			path: 'reports.getSaveAsList',
			group: 'reports',
			leaf: 'getSaveAsList',
			method: 'GET',
			url: 'Emails/GetSaveAsList',
			kind: 'generic',
			input: {},
		},
		{
			path: 'reports.updateListCompilationDetails',
			group: 'reports',
			leaf: 'updateListCompilationDetails',
			method: 'PATCH',
			url: 'Emails/SaveAsList',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'signupForms.copySignupForm',
			group: 'signupForms',
			leaf: 'copySignupForm',
			method: 'POST',
			url: 'SignupForm/test_id/Copy',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'signupForms.createSignupForm',
			group: 'signupForms',
			leaf: 'createSignupForm',
			method: 'POST',
			url: 'SignupForm/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'signupForms.getHTMLSignupForm',
			group: 'signupForms',
			leaf: 'getHTMLSignupForm',
			method: 'POST',
			url: 'Integration/Tumbler/test_listBuilderID',
			kind: 'generic',
			input: { listBuilderID: 'test_listBuilderID', data: { name: 'Test' } },
		},
		{
			path: 'signupForms.getMagentoHTMLSelected',
			group: 'signupForms',
			leaf: 'getMagentoHTMLSelected',
			method: 'GET',
			url: 'Integration/Magento/test_listBuilderID',
			kind: 'generic',
			input: { listBuilderID: 'test_listBuilderID' },
		},
		{
			path: 'signupForms.getMagentoHTMLDropdown',
			group: 'signupForms',
			leaf: 'getMagentoHTMLDropdown',
			method: 'GET',
			url: 'Integration/Magento',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.getSignupFormButtonCode',
			group: 'signupForms',
			leaf: 'getSignupFormButtonCode',
			method: 'GET',
			url: 'SignupForm/test_id/Code/Button',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'signupForms.getSignupFormContactFields',
			group: 'signupForms',
			leaf: 'getSignupFormContactFields',
			method: 'GET',
			url: 'SignupForm/test_id/ContactFields',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'signupForms.getSignupFormDetails',
			group: 'signupForms',
			leaf: 'getSignupFormDetails',
			method: 'GET',
			url: 'SignupForm/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'signupForms.getSignupFormLink',
			group: 'signupForms',
			leaf: 'getSignupFormLink',
			method: 'GET',
			url: 'SignupForm/test_id/Link',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'signupForms.getSignupFormList',
			group: 'signupForms',
			leaf: 'getSignupFormList',
			method: 'GET',
			url: 'SignupForm/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'signupForms.getSignupFormsForContactList',
			group: 'signupForms',
			leaf: 'getSignupFormsForContactList',
			method: 'GET',
			url: 'Contact/test_listID/ListbuilderLists',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'signupForms.getSignupFormForUnbounce',
			group: 'signupForms',
			leaf: 'getSignupFormForUnbounce',
			method: 'GET',
			url: 'Client/Integrations/SignupForm/Unbounce',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.getSignupFormTumbler',
			group: 'signupForms',
			leaf: 'getSignupFormTumbler',
			method: 'GET',
			url: 'Client/Integrations/SignupForm/Tumbler',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.getSignupFormForMagento',
			group: 'signupForms',
			leaf: 'getSignupFormForMagento',
			method: 'GET',
			url: 'Client/Integrations/SignupForm/Magento',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.getTemplatesForSignupFormClassic',
			group: 'signupForms',
			leaf: 'getTemplatesForSignupFormClassic',
			method: 'GET',
			url: 'SignupForm/Template',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.getTumblerLists',
			group: 'signupForms',
			leaf: 'getTumblerLists',
			method: 'GET',
			url: 'Integration/Tumbler',
			kind: 'generic',
			input: {},
		},
		{
			path: 'signupForms.sendTestEmailForSignupForm',
			group: 'signupForms',
			leaf: 'sendTestEmailForSignupForm',
			method: 'POST',
			url: 'SignupForm/test_id/Test',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'surveys.deleteSurvey',
			group: 'surveys',
			leaf: 'deleteSurvey',
			method: 'DELETE',
			url: 'Survey/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'surveys.getSurveyDetails',
			group: 'surveys',
			leaf: 'getSurveyDetails',
			method: 'GET',
			url: 'Survey/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'surveys.getSurveyTemplateList',
			group: 'surveys',
			leaf: 'getSurveyTemplateList',
			method: 'GET',
			url: 'Survey/TemplateList',
			kind: 'generic',
			input: {},
		},
		{
			path: 'surveys.getSurveyReportList',
			group: 'surveys',
			leaf: 'getSurveyReportList',
			method: 'GET',
			url: 'Survey/ReportList',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'surveys.getSurveyFullReport',
			group: 'surveys',
			leaf: 'getSurveyFullReport',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportFull',
			kind: 'generic',
			input: { surveyID: 'test_surveyID' },
		},
		{
			path: 'surveys.getSurveyIndividualResults',
			group: 'surveys',
			leaf: 'getSurveyIndividualResults',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportIndividual',
			kind: 'generic',
			input: { surveyID: 'test_surveyID', page: 1, pageSize: 25 },
		},
		{
			path: 'surveys.getSurveyIndividualQuestionResult',
			group: 'surveys',
			leaf: 'getSurveyIndividualQuestionResult',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportIndividual/test_emailID',
			kind: 'generic',
			input: { surveyID: 'test_surveyID', emailID: 'test_emailID' },
		},
		{
			path: 'surveys.getSurveyReportAnswerText',
			group: 'surveys',
			leaf: 'getSurveyReportAnswerText',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportAnswer/Text',
			kind: 'generic',
			input: { surveyID: 'test_surveyID', questionID: 'test_questionID' },
		},
		{
			path: 'surveys.getSurveyReportAnswerComment',
			group: 'surveys',
			leaf: 'getSurveyReportAnswerComment',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportAnswer/Comment',
			kind: 'generic',
			input: { surveyID: 'test_surveyID', questionID: 'test_questionID' },
		},
		{
			path: 'surveys.getSurveyReportAnswerOther',
			group: 'surveys',
			leaf: 'getSurveyReportAnswerOther',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportAnswer/Other',
			kind: 'generic',
			input: { surveyID: 'test_surveyID', questionID: 'test_questionID' },
		},
		{
			path: 'surveys.getSurveyReportDetail',
			group: 'surveys',
			leaf: 'getSurveyReportDetail',
			method: 'GET',
			url: 'Survey/test_surveyID/ReportDetail',
			kind: 'generic',
			input: { surveyID: 'test_surveyID' },
		},
		{
			path: 'surveys.updateSurveyStatus',
			group: 'surveys',
			leaf: 'updateSurveyStatus',
			method: 'PATCH',
			url: 'Survey/test_id/StatusUpdate/test_status',
			kind: 'generic',
			input: { id: 'test_id', status: 'test_status', data: { name: 'Test' } },
		},
		{
			path: 'polls.copyPoll',
			group: 'polls',
			leaf: 'copyPoll',
			method: 'POST',
			url: 'Poll/test_pollID/Copy',
			kind: 'generic',
			input: { pollID: 'test_pollID', data: { name: 'Test' } },
		},
		{
			path: 'polls.createPoll',
			group: 'polls',
			leaf: 'createPoll',
			method: 'POST',
			url: 'Poll/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'polls.deletePoll',
			group: 'polls',
			leaf: 'deletePoll',
			method: 'DELETE',
			url: 'Poll/test_pollID',
			kind: 'generic',
			input: { pollID: 'test_pollID' },
		},
		{
			path: 'polls.getPollDetails',
			group: 'polls',
			leaf: 'getPollDetails',
			method: 'GET',
			url: 'Poll/test_pollID',
			kind: 'generic',
			input: { pollID: 'test_pollID' },
		},
		{
			path: 'polls.getPolls',
			group: 'polls',
			leaf: 'getPolls',
			method: 'GET',
			url: 'Poll/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'polls.getPollPreview',
			group: 'polls',
			leaf: 'getPollPreview',
			method: 'GET',
			url: 'Poll/test_pollID/Render',
			kind: 'generic',
			input: { pollID: 'test_pollID' },
		},
		{
			path: 'polls.getPollResponseReport',
			group: 'polls',
			leaf: 'getPollResponseReport',
			method: 'GET',
			url: 'Poll/test_pollID/Response',
			kind: 'generic',
			input: { pollID: 'test_pollID' },
		},
		{
			path: 'polls.updatePoll',
			group: 'polls',
			leaf: 'updatePoll',
			method: 'PATCH',
			url: 'Poll/test_pollID',
			kind: 'generic',
			input: { pollID: 'test_pollID', data: { name: 'Test' } },
		},
		{
			path: 'media.deleteImage',
			group: 'media',
			leaf: 'deleteImage',
			method: 'DELETE',
			url: 'Images/test_imageID',
			kind: 'generic',
			input: { imageID: 'test_imageID' },
		},
		{
			path: 'media.deleteVideo',
			group: 'media',
			leaf: 'deleteVideo',
			method: 'DELETE',
			url: 'Video/test_videoID',
			kind: 'generic',
			input: { videoID: 'test_videoID' },
		},
		{
			path: 'media.getVideoDetails',
			group: 'media',
			leaf: 'getVideoDetails',
			method: 'GET',
			url: 'Video/test_videoID',
			kind: 'generic',
			input: { videoID: 'test_videoID' },
		},
		{
			path: 'media.getImages',
			group: 'media',
			leaf: 'getImages',
			method: 'GET',
			url: 'Images/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'media.getImageDetails',
			group: 'media',
			leaf: 'getImageDetails',
			method: 'GET',
			url: 'Images/test_imageID',
			kind: 'generic',
			input: { imageID: 'test_imageID' },
		},
		{
			path: 'media.getGiphyImages',
			group: 'media',
			leaf: 'getGiphyImages',
			method: 'GET',
			url: 'Images/Giphy/Images/List',
			kind: 'generic',
			input: {},
		},
		{
			path: 'media.shareVideo',
			group: 'media',
			leaf: 'shareVideo',
			method: 'POST',
			url: 'Video/test_videoID/Copy',
			kind: 'generic',
			input: { videoID: 'test_videoID', data: { name: 'Test' } },
		},
		{
			path: 'media.uploadVideo',
			group: 'media',
			leaf: 'uploadVideo',
			method: 'POST',
			url: 'Video',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'media.createInbox',
			group: 'media',
			leaf: 'createInbox',
			method: 'POST',
			url: 'Inbox/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'media.deleteInbox',
			group: 'media',
			leaf: 'deleteInbox',
			method: 'DELETE',
			url: 'Inbox/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'media.getInboxList',
			group: 'media',
			leaf: 'getInboxList',
			method: 'GET',
			url: 'Inbox/',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'media.getInboxMasterResult',
			group: 'media',
			leaf: 'getInboxMasterResult',
			method: 'GET',
			url: 'Inbox/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'media.getInboxDetailResult',
			group: 'media',
			leaf: 'getInboxDetailResult',
			method: 'GET',
			url: 'Inbox/Tests',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.addRemoveInboxTestsFromSubAccount',
			group: 'account',
			leaf: 'addRemoveInboxTestsFromSubAccount',
			method: 'POST',
			url: 'Client/SubAccount/test_id/Inbox',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'account.copyImageToSubAccount',
			group: 'account',
			leaf: 'copyImageToSubAccount',
			method: 'POST',
			url: 'Images/test_imageID/Copy',
			kind: 'generic',
			input: { imageID: 'test_imageID', data: { name: 'Test' } },
		},
		{
			path: 'account.deleteLinkedAgencyAccount',
			group: 'account',
			leaf: 'deleteLinkedAgencyAccount',
			method: 'DELETE',
			url: 'Client/LinkAccount/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'account.getCommissionList',
			group: 'account',
			leaf: 'getCommissionList',
			method: 'GET',
			url: 'Partner/CommissionList',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getLinkedAgencyAccountDetails',
			group: 'account',
			leaf: 'getLinkedAgencyAccountDetails',
			method: 'GET',
			url: 'Client/LinkAccount/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'account.getLinkedAgencyAccounts',
			group: 'account',
			leaf: 'getLinkedAgencyAccounts',
			method: 'GET',
			url: 'Client/LinkAccount',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getPartnerProfileDetails',
			group: 'account',
			leaf: 'getPartnerProfileDetails',
			method: 'GET',
			url: 'Partner/Profile',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getReferralsList',
			group: 'account',
			leaf: 'getReferralsList',
			method: 'GET',
			url: 'Partner/ReferralsList',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getSubAccountHistory',
			group: 'account',
			leaf: 'getSubAccountHistory',
			method: 'GET',
			url: 'Client/SubAccount/History',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'account.getSubAccounts',
			group: 'account',
			leaf: 'getSubAccounts',
			method: 'GET',
			url: 'Client/SubAccount',
			kind: 'generic',
			input: { page: 1, pageSize: 25 },
		},
		{
			path: 'account.getSubAccountsPlanList',
			group: 'account',
			leaf: 'getSubAccountsPlanList',
			method: 'GET',
			url: 'Client/SubAccount/test_id/PlanList',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'account.getReferralsLevel1List',
			group: 'account',
			leaf: 'getReferralsLevel1List',
			method: 'GET',
			url: 'Partner/ReferralsLevel1List',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getSubAccountBalance',
			group: 'account',
			leaf: 'getSubAccountBalance',
			method: 'GET',
			url: 'Client/SubAccount/test_id/Balance',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'account.getSubAccountDetails',
			group: 'account',
			leaf: 'getSubAccountDetails',
			method: 'GET',
			url: 'Client/SubAccount/test_id',
			kind: 'generic',
			input: { id: 'test_id' },
		},
		{
			path: 'account.getSubAccountHistoryDetails',
			group: 'account',
			leaf: 'getSubAccountHistoryDetails',
			method: 'GET',
			url: 'Client/SubAccount/History/test_historyID',
			kind: 'generic',
			input: { historyID: 'test_historyID' },
		},
		{
			path: 'account.linkAgencyAccount',
			group: 'account',
			leaf: 'linkAgencyAccount',
			method: 'POST',
			url: 'Client/LinkAccount/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.shareListsWithSubAccounts',
			group: 'account',
			leaf: 'shareListsWithSubAccounts',
			method: 'POST',
			url: 'Contact/test_listID/ShareLists/test_clientIDs',
			kind: 'list',
			input: {
				listID: 'test_listID',
				clientIDs: 'test_clientIDs',
				data: { name: 'Test' },
			},
		},
		{
			path: 'account.updateLinkedAgencyAccount',
			group: 'account',
			leaf: 'updateLinkedAgencyAccount',
			method: 'PATCH',
			url: 'Client/LinkAccount/test_id',
			kind: 'generic',
			input: { id: 'test_id', data: { name: 'Test' } },
		},
		{
			path: 'account.updatePartnerProfile',
			group: 'account',
			leaf: 'updatePartnerProfile',
			method: 'PATCH',
			url: 'Partner/Profile',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.changePassword',
			group: 'account',
			leaf: 'changePassword',
			method: 'PATCH',
			url: 'Client/Password',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.changeSecurityPIN',
			group: 'account',
			leaf: 'changeSecurityPIN',
			method: 'POST',
			url: 'Client/PIN',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.checkIfResponsive',
			group: 'account',
			leaf: 'checkIfResponsive',
			method: 'GET',
			url: 'Client/Responsive',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.disableSecurityPIN',
			group: 'account',
			leaf: 'disableSecurityPIN',
			method: 'POST',
			url: 'Client/PIN/Disable',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.getAllConfirmedEmails',
			group: 'account',
			leaf: 'getAllConfirmedEmails',
			method: 'GET',
			url: 'Client/ConfirmedEmail/All',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientAccountSettings',
			group: 'account',
			leaf: 'getClientAccountSettings',
			method: 'GET',
			url: 'Client/Setting',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientPlanInformation',
			group: 'account',
			leaf: 'getClientPlanInformation',
			method: 'GET',
			url: 'Client/Plan',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getCurrentEmailAtTimeOfReset',
			group: 'account',
			leaf: 'getCurrentEmailAtTimeOfReset',
			method: 'GET',
			url: 'Client/Email/Reset',
			kind: 'generic',
			input: { guid: 'test_guid' },
		},
		{
			path: 'account.getDMARCList',
			group: 'account',
			leaf: 'getDMARCList',
			method: 'GET',
			url: 'Client/DMarc',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getListOfConfirmedEmails',
			group: 'account',
			leaf: 'getListOfConfirmedEmails',
			method: 'GET',
			url: 'Client/ConfirmedEmail',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientDetails',
			group: 'account',
			leaf: 'getClientDetails',
			method: 'GET',
			url: 'Client/',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientFilterDomain',
			group: 'account',
			leaf: 'getClientFilterDomain',
			method: 'GET',
			url: 'Client/FilterDomain',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientProfileDetails',
			group: 'account',
			leaf: 'getClientProfileDetails',
			method: 'GET',
			url: 'Client/ProfileDetails',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getClientsRatingRange',
			group: 'account',
			leaf: 'getClientsRatingRange',
			method: 'GET',
			url: 'Client/RatingRange',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.loginRedirectUsingToken',
			group: 'account',
			leaf: 'loginRedirectUsingToken',
			method: 'POST',
			url: 'Client/Token',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.patchUpdateClientSettings',
			group: 'account',
			leaf: 'patchUpdateClientSettings',
			method: 'PATCH',
			url: 'Client/Setting',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.resendConfirmEmail',
			group: 'account',
			leaf: 'resendConfirmEmail',
			method: 'GET',
			url: 'Client/ConfirmedEmail/test_email',
			kind: 'generic',
			input: { email: 'test_email' },
		},
		{
			path: 'account.saveSecurityPIN',
			group: 'account',
			leaf: 'saveSecurityPIN',
			method: 'PATCH',
			url: 'Client/PIN',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.saveWebsiteDomain',
			group: 'account',
			leaf: 'saveWebsiteDomain',
			method: 'POST',
			url: 'Client/InitSurvey',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.sendPINViaEmail',
			group: 'account',
			leaf: 'sendPINViaEmail',
			method: 'POST',
			url: 'Client/PIN/Email',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.sendResetEmail',
			group: 'account',
			leaf: 'sendResetEmail',
			method: 'PATCH',
			url: 'Client/Email/ResetLink',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.setResponsive',
			group: 'account',
			leaf: 'setResponsive',
			method: 'PATCH',
			url: 'Client/Responsive',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.updateEditProfile',
			group: 'account',
			leaf: 'updateEditProfile',
			method: 'PATCH',
			url: 'Client/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.updateResetEmail',
			group: 'account',
			leaf: 'updateResetEmail',
			method: 'PATCH',
			url: 'Client/Email/Reset',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.getNotification',
			group: 'account',
			leaf: 'getNotification',
			method: 'GET',
			url: 'Client/Notification',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getWebPageAdsDetail',
			group: 'account',
			leaf: 'getWebPageAdsDetail',
			method: 'GET',
			url: 'Partner/WebPageAdsDetail',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getHelpTopics',
			group: 'account',
			leaf: 'getHelpTopics',
			method: 'GET',
			url: 'Help/',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.generateSupportTicket',
			group: 'account',
			leaf: 'generateSupportTicket',
			method: 'POST',
			url: 'Help/Ticket',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.sendSupportFeedback',
			group: 'account',
			leaf: 'sendSupportFeedback',
			method: 'POST',
			url: 'Help/',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'account.getCommunityDomain',
			group: 'account',
			leaf: 'getCommunityDomain',
			method: 'GET',
			url: 'Client/Community/Domain',
			kind: 'generic',
			input: {},
		},
		{
			path: 'account.getAccountSummary',
			group: 'account',
			leaf: 'getAccountSummary',
			method: 'GET',
			url: 'Images/Summary',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.assignProductToList',
			group: 'integrations',
			leaf: 'assignProductToList',
			method: 'POST',
			url: 'Integration/ShopifyPurchaseProductList',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'integrations.configureShopifyPurchaseList',
			group: 'integrations',
			leaf: 'configureShopifyPurchaseList',
			method: 'POST',
			url: 'Integration/ShopifyPurchaseList',
			kind: 'generic',
			input: { data: { name: 'Test' } },
		},
		{
			path: 'integrations.connectService',
			group: 'integrations',
			leaf: 'connectService',
			method: 'POST',
			url: 'Integration/AuthUrlExtra/test_site',
			kind: 'generic',
			input: { site: 'test_site', data: { name: 'Test' } },
		},
		{
			path: 'integrations.deleteProductAssociation',
			group: 'integrations',
			leaf: 'deleteProductAssociation',
			method: 'DELETE',
			url: 'Integration/ShopifyPurchaseProduct/test_productCode',
			kind: 'generic',
			input: { productCode: 'test_productCode' },
		},
		{
			path: 'integrations.disconnectEtsyIntegration',
			group: 'integrations',
			leaf: 'disconnectEtsyIntegration',
			method: 'DELETE',
			url: 'Integration/Etsy',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectEventbriteIntegration',
			group: 'integrations',
			leaf: 'disconnectEventbriteIntegration',
			method: 'DELETE',
			url: 'Integration/Eventbrite',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectFacebookEvents',
			group: 'integrations',
			leaf: 'disconnectFacebookEvents',
			method: 'DELETE',
			url: 'Integration/FacebookEvents',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectFacebookIntegration',
			group: 'integrations',
			leaf: 'disconnectFacebookIntegration',
			method: 'DELETE',
			url: 'Integration/Facebook',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectInstagramIntegration',
			group: 'integrations',
			leaf: 'disconnectInstagramIntegration',
			method: 'DELETE',
			url: 'Integration/Instagram',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectLinkedInIntegration',
			group: 'integrations',
			leaf: 'disconnectLinkedInIntegration',
			method: 'DELETE',
			url: 'Integration/LinkedIn',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectPinterestConnection',
			group: 'integrations',
			leaf: 'disconnectPinterestConnection',
			method: 'DELETE',
			url: 'Integration/Pinterest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectSalesforceIntegration',
			group: 'integrations',
			leaf: 'disconnectSalesforceIntegration',
			method: 'DELETE',
			url: 'Integration/SalesForce',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectShopify',
			group: 'integrations',
			leaf: 'disconnectShopify',
			method: 'DELETE',
			url: 'Integration/Shopify',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectTwitterIntegration',
			group: 'integrations',
			leaf: 'disconnectTwitterIntegration',
			method: 'DELETE',
			url: 'Integration/Twitter',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.disconnectEbayIntegration',
			group: 'integrations',
			leaf: 'disconnectEbayIntegration',
			method: 'DELETE',
			url: 'Integration/Ebay',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.logOutTwitterTweets',
			group: 'integrations',
			leaf: 'logOutTwitterTweets',
			method: 'DELETE',
			url: 'Integration/TwitterTweets',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getContactListsForShopify',
			group: 'integrations',
			leaf: 'getContactListsForShopify',
			method: 'GET',
			url: 'Integration/Shopify',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getDigiohUsername',
			group: 'integrations',
			leaf: 'getDigiohUsername',
			method: 'GET',
			url: 'Integration/Digioh',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getEtsyStoreName',
			group: 'integrations',
			leaf: 'getEtsyStoreName',
			method: 'GET',
			url: 'Integration/Etsy',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getEventbriteUsername',
			group: 'integrations',
			leaf: 'getEventbriteUsername',
			method: 'GET',
			url: 'Integration/Eventbrite',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getFacebookAccountHolder',
			group: 'integrations',
			leaf: 'getFacebookAccountHolder',
			method: 'GET',
			url: 'Integration/Facebook',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getFacebookAccountName',
			group: 'integrations',
			leaf: 'getFacebookAccountName',
			method: 'GET',
			url: 'Integration/FacebookEvents',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getIntegrationAuthURL',
			group: 'integrations',
			leaf: 'getIntegrationAuthURL',
			method: 'GET',
			url: 'Integration/Authurl/test_site',
			kind: 'generic',
			input: { site: 'test_site' },
		},
		{
			path: 'integrations.getIntegrationConnectionList',
			group: 'integrations',
			leaf: 'getIntegrationConnectionList',
			method: 'GET',
			url: 'Client/Integrations',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getLinkedInToken',
			group: 'integrations',
			leaf: 'getLinkedInToken',
			method: 'GET',
			url: 'Integration/LinkedIn',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getShopifyProducts',
			group: 'integrations',
			leaf: 'getShopifyProducts',
			method: 'GET',
			url: 'Integration/ShopifyProductList',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getPaypalLists',
			group: 'integrations',
			leaf: 'getPaypalLists',
			method: 'GET',
			url: 'Integration/Paypal',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getPaypalLink',
			group: 'integrations',
			leaf: 'getPaypalLink',
			method: 'GET',
			url: 'Integration/Paypal/URL/test_contactMasterID',
			kind: 'generic',
			input: { contactMasterID: 'test_contactMasterID' },
		},
		{
			path: 'integrations.getPinterestUsername',
			group: 'integrations',
			leaf: 'getPinterestUsername',
			method: 'GET',
			url: 'Integration/Pinterest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getSalesforceStatus',
			group: 'integrations',
			leaf: 'getSalesforceStatus',
			method: 'GET',
			url: 'Integration/SalesForce',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getShopifyProductGrid',
			group: 'integrations',
			leaf: 'getShopifyProductGrid',
			method: 'GET',
			url: 'Integration/ShopifyProductGrid',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getTwitterLogin',
			group: 'integrations',
			leaf: 'getTwitterLogin',
			method: 'GET',
			url: 'Integration/Twitter',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getUnbounceLink',
			group: 'integrations',
			leaf: 'getUnbounceLink',
			method: 'GET',
			url: 'Integration/Unbounce/URL/test_contactMasterID',
			kind: 'generic',
			input: { contactMasterID: 'test_contactMasterID' },
		},
		{
			path: 'integrations.getUnbounceLists',
			group: 'integrations',
			leaf: 'getUnbounceLists',
			method: 'GET',
			url: 'Integration/Unbounce',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getEbaySellerID',
			group: 'integrations',
			leaf: 'getEbaySellerID',
			method: 'GET',
			url: 'Integration/Ebay',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.getEbaySiteList',
			group: 'integrations',
			leaf: 'getEbaySiteList',
			method: 'GET',
			url: 'Client/Integrations/EbaySite',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testEtsyIntegration',
			group: 'integrations',
			leaf: 'testEtsyIntegration',
			method: 'GET',
			url: 'Integration/EtsyTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testEventbriteIntegration',
			group: 'integrations',
			leaf: 'testEventbriteIntegration',
			method: 'GET',
			url: 'Integration/EventbriteTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testFacebookEventsIntegration',
			group: 'integrations',
			leaf: 'testFacebookEventsIntegration',
			method: 'GET',
			url: 'Integration/FacebookEventsTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testFacebookIntegration',
			group: 'integrations',
			leaf: 'testFacebookIntegration',
			method: 'GET',
			url: 'Integration/FacebookTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testLinkedInConnection',
			group: 'integrations',
			leaf: 'testLinkedInConnection',
			method: 'GET',
			url: 'Integration/LinkedInTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testPinterestIntegration',
			group: 'integrations',
			leaf: 'testPinterestIntegration',
			method: 'GET',
			url: 'Integration/PinterestTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testSalesforceIntegration',
			group: 'integrations',
			leaf: 'testSalesforceIntegration',
			method: 'GET',
			url: 'Integration/SalesForceTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testTwitterIntegration',
			group: 'integrations',
			leaf: 'testTwitterIntegration',
			method: 'GET',
			url: 'Integration/TwitterTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testTwitterTweets',
			group: 'integrations',
			leaf: 'testTwitterTweets',
			method: 'GET',
			url: 'Integration/TwitterTweetsTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'integrations.testEbayIntegration',
			group: 'integrations',
			leaf: 'testEbayIntegration',
			method: 'GET',
			url: 'Integration/EbayTest',
			kind: 'generic',
			input: {},
		},
		{
			path: 'webhooks.createWebhook',
			group: 'webhooks',
			leaf: 'createWebhook',
			method: 'POST',
			url: 'Contact/test_listID/Webhooks',
			kind: 'generic',
			input: { listID: 'test_listID', data: { name: 'Test' } },
		},
		{
			path: 'webhooks.getWebhooks',
			group: 'webhooks',
			leaf: 'getWebhooks',
			method: 'GET',
			url: 'Contact/test_listID/Webhooks',
			kind: 'generic',
			input: { listID: 'test_listID' },
		},
		{
			path: 'webhooks.deleteWebhook',
			group: 'webhooks',
			leaf: 'deleteWebhook',
			method: 'DELETE',
			url: 'Contact/test_listID/Webhooks/test_id',
			kind: 'generic',
			input: { listID: 'test_listID', id: 'test_id' },
		},
		{
			path: 'webhooks.updateWebhook',
			group: 'webhooks',
			leaf: 'updateWebhook',
			method: 'PATCH',
			url: 'Contact/test_listID/Webhooks/test_id',
			kind: 'generic',
			input: { listID: 'test_listID', id: 'test_id', data: { name: 'Test' } },
		},
	];

	it('covers every registered operation exactly once', () => {
		expect(cases.map((c) => c.path).sort()).toEqual(Object.keys(META).sort());
	});

	it.each(cases)(
		'$path issues $method $url',
		async ({ path, group, leaf, method, url, kind, input }) => {
			const key = toOperationKey(path);
			// Fixture honesty: the input must satisfy its own registered schema.
			expect(schemaFor(key).safeParse(input).success).toBe(true);

			const handler = tree[group]?.[leaf];
			expect(handler).toBeDefined();
			const result = await (handler as AnyEndpoint)(makeCtx(), input);

			// The endpoint returns the transport payload untouched.
			expect(result).toEqual({ marker: 'wire-response' });
			expect(calls).toHaveLength(1);
			const call = calls[0] as Captured;

			// Documented route: exact path and method.
			expect(call.method).toBe(method);
			expect(call.url.split('?')[0]).toBe(BASE + '/' + url);

			// Risk consistency: reads never mutate, deletes always DELETE.
			const risk = META[path]?.riskLevel;
			if (risk === 'read') expect(call.method).toBe('GET');
			if (risk === 'destructive') expect(call.method).toBe('DELETE');
			if (risk === 'write')
				expect(call.method === 'POST' || call.method === 'PATCH').toBe(true);

			// Auth travels in the AuthToken header, never in the URL.
			expect(call.url.startsWith(BASE)).toBe(true);
			expect(call.headers.authtoken).toBe(TOKEN);
			expect(call.url).not.toContain(TOKEN);

			// No un-interpolated or undefined segments.
			expect(call.url).not.toContain('/undefined');
			expect(call.url).not.toContain('{');
			expect(call.url).not.toMatch(/=undefined(&|$)/);

			// The registered output schema accepts a representative payload.
			const sample = RESPONSE_SAMPLES[kind] as Record<string, unknown>;
			expect(sample).toBeDefined();
			expect(outputSchemaFor(key).parse(sample)).toEqual(sample);
		},
	);
});

/**
 * Behavioural coverage for the things routing checks cannot see: what goes
 * in the request body, how query values are compacted, what reaches the
 * event log, and how the plugin factory resolves credentials.
 */
describe('endpoint behaviour', () => {
	const plugin = benchmarkemail({ key: TOKEN });
	const tree = plugin.endpoints as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;

	/** Looks an operation up, failing loudly rather than silently skipping. */
	function op(group: string, leaf: string): AnyEndpoint {
		const fn = tree[group]?.[leaf];
		if (!fn) throw new Error(`No such operation: ${group}.${leaf}`);
		return fn;
	}

	const originalFetch = globalThis.fetch;
	let behaviourCalls: Array<{ url: string; method: string; body: unknown }> =
		[];

	function makeBehaviourCtx() {
		return {
			key: TOKEN,
			db: {},
			$getAccountId: async () => 'test-account',
			database: undefined,
		};
	}

	function respondWith(body: unknown) {
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			behaviourCalls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
			});
			return new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	}

	beforeEach(() => {
		behaviourCalls = [];
		mockLogEvent.mockClear();
		respondWith({ ok: true });
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	/** The nth captured request, asserted to exist. */
	function behaviourCall(index = 0): {
		url: string;
		method: string;
		body: unknown;
	} {
		const captured = behaviourCalls[index];
		if (!captured) throw new Error(`No request captured at index ${index}`);
		return captured;
	}

	describe('write bodies', () => {
		it('forwards the data record as the POST body', async () => {
			respondWith({ id: 'contact_1' });
			const result = await op('contacts', 'addContactToList')(
				makeBehaviourCtx(),
				{
					listID: 'list_1',
					data: { email: 'jane@example.com', firstName: 'Jane' },
				},
			);
			expect(result).toEqual({ id: 'contact_1' });
			expect(behaviourCall().method).toBe('POST');
			expect(behaviourCall().body).toEqual({
				email: 'jane@example.com',
				firstName: 'Jane',
			});
		});

		it('forwards the data record as the PATCH body', async () => {
			await op('lists', 'updateContactList')(makeBehaviourCtx(), {
				listID: 'list_1',
				data: { name: 'Renamed' },
			});
			expect(behaviourCall().method).toBe('PATCH');
			expect(behaviourCall().body).toEqual({ name: 'Renamed' });
		});

		it('sends no body when no data is supplied', async () => {
			await op('emails', 'restoreEmailFromTrash')(makeBehaviourCtx(), {
				id: 'email_1',
			});
			expect(behaviourCall().method).toBe('POST');
			expect(behaviourCall().body).toBeUndefined();
		});

		it('sends no body on DELETE', async () => {
			await op('contacts', 'deleteContactFromList')(makeBehaviourCtx(), {
				listID: 'list_1',
				contactID: 'contact_1',
			});
			expect(behaviourCall().method).toBe('DELETE');
			expect(behaviourCall().body).toBeUndefined();
		});

		it('forwards an explicitly supplied data record as the DELETE body', async () => {
			await op('contacts', 'deleteContactsFromCurrentLists')(
				makeBehaviourCtx(),
				{
					data: { emails: ['jane@example.com'] },
					search: 'jane@example.com',
				},
			);
			expect(behaviourCall().method).toBe('DELETE');
			expect(behaviourCall().body).toEqual({ emails: ['jane@example.com'] });
		});
	});

	describe('query handling', () => {
		it('serialises pagination and search params on list reads', async () => {
			await op('contacts', 'getFilteredContacts')(makeBehaviourCtx(), {
				listID: 'list_1',
				page: 2,
				pageSize: 25,
				search: 'jane@example.com',
			});
			expect(behaviourCall().url).toContain('page=2');
			expect(behaviourCall().url).toContain('pageSize=25');
			expect(behaviourCall().url).toContain(
				`search=${encodeURIComponent('jane@example.com')}`,
			);
		});

		it('omits unset optional params from the query string', async () => {
			await op('contacts', 'getFilteredContacts')(makeBehaviourCtx(), {
				listID: 'list_1',
			});
			expect(behaviourCall().url).not.toContain('?');
		});
	});

	describe('compactQuery', () => {
		it('drops undefined values', () => {
			expect(compactQuery({ a: 'x', b: undefined })).toEqual({ a: 'x' });
		});

		it('keeps falsy but defined values', () => {
			expect(compactQuery({ a: 0, b: false, c: '' })).toEqual({
				a: 0,
				b: false,
				c: '',
			});
		});

		it('returns an empty object for all-undefined input', () => {
			expect(compactQuery({ a: undefined })).toEqual({});
		});
	});

	describe('audit logging', () => {
		it.each([
			['contacts', 'addContactToList'],
			['emails', 'getEmailDetails'],
			['reports', 'getOpensReport'],
			['automations', 'deleteAutomation'],
			['webhooks', 'createWebhook'],
		])('logs benchmarkemail.%s.%s as completed', async (group, leaf) => {
			const input =
				group === 'contacts'
					? { listID: 'list_1' }
					: group === 'webhooks'
						? { listID: 'list_1', data: { url: 'https://example.com/hook' } }
						: group === 'automations'
							? { automationID: 'automation_1' }
							: { id: 'email_1' };
			await op(group, leaf)(makeBehaviourCtx(), input);
			expect(mockLogEvent).toHaveBeenCalledWith(
				expect.anything(),
				`benchmarkemail.${group}.${leaf}`,
				expect.objectContaining(input as Record<string, unknown>),
				'completed',
			);
		});
	});

	describe('plugin factory and keyBuilder', () => {
		it('identifies as the benchmarkemail plugin with 13 endpoint groups', () => {
			expect(plugin.id).toBe('benchmarkemail');
			expect(Object.keys(tree).sort()).toEqual(
				[
					'account',
					'archive',
					'automations',
					'contacts',
					'emails',
					'integrations',
					'lists',
					'media',
					'polls',
					'reports',
					'signupForms',
					'surveys',
					'webhooks',
				].sort(),
			);
		});

		it('prefers the configured key without touching the key store', async () => {
			if (!plugin.keyBuilder) throw new Error('plugin keyBuilder is missing');
			const token = await plugin.keyBuilder(
				{ authType: 'api_key', keys: {} } as never,
				'endpoint',
			);
			expect(token).toBe(TOKEN);
		});

		it('falls back to the stored api_key', async () => {
			const withoutKey = benchmarkemail();
			if (!withoutKey.keyBuilder)
				throw new Error('plugin keyBuilder is missing');
			const token = await withoutKey.keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-token' },
				} as never,
				'endpoint',
			);
			expect(token).toBe('stored-token');
		});

		it('raises AuthMissingError when no key is available', async () => {
			const withoutKey = benchmarkemail();
			if (!withoutKey.keyBuilder)
				throw new Error('plugin keyBuilder is missing');
			await expect(
				withoutKey.keyBuilder(
					{
						authType: 'api_key',
						keys: { get_api_key: async () => null },
					} as never,
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
			await expect(
				withoutKey.keyBuilder({ authType: 'api_key' } as never, 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
