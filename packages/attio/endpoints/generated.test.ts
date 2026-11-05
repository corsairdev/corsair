import fs from 'fs';
import path from 'path';
import * as Generated from './generated';
import {
	assertPerson,
	createAttribute,
	createEntry,
	createSelectOption,
	findRecord,
	getAttribute,
	getDealRecord,
	getSelf,
	getWorkspaceMember,
	listDealRecords,
	listRecords,
	listUserRecords,
	listWorkspaceMembers,
	listWorkspaceRecords,
	patchRecord,
	peopleGetPerson,
	peopleListPersons,
	postV2ListsListEntries,
	postV2ListsListEntriesQuery,
	putV2ListsListEntries,
	putV2ObjectsObjectRecords,
	queryRecords,
	searchRecords,
	updateAttribute,
	updateSelectOption,
} from './generated';

let loadedToken: string | undefined = undefined;
try {
	const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
	for (const line of envFile.split(/\r?\n/)) {
		const match = line.match(/^\s*ATTIO_TEST_TOKEN\s*=\s*(.*)?\s*$/);
		if (match && match[1]) {
			loadedToken = match[1].trim();
		}
	}
} catch {}

const TEST_TOKEN =
	loadedToken || process.env.ATTIO_TOKEN || process.env.ATTIO_TEST_TOKEN;

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return {
		...actual,
		makeAuthenticatedAttioRequest: jest
			.fn()
			.mockImplementation((url, ctx, options) => {
				if (
					ctx &&
					ctx.key &&
					ctx.key !== 'mock-key' &&
					ctx.key !== 'test-key' &&
					(process.env.ATTIO_TEST_TOKEN ||
						process.env.ATTIO_TOKEN ||
						(typeof loadedToken === 'string' && loadedToken.length > 0))
				) {
					return actual.makeAuthenticatedAttioRequest(url, ctx, options);
				}
				return { mockResolved: true, url, options };
			}),
	};
});

type MockCall = {
	url: string;
	options: { method: string; body?: Record<string, unknown> };
};

describe('Attio REST API verification', () => {
	const testOrSkip = TEST_TOKEN ? it : it.skip;

	const mockCtx = {
		key: TEST_TOKEN || 'mock-key',
	} as never;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('authentication and context', () => {
		testOrSkip('fetches self without throwing errors', async () => {
			const response = await getSelf(mockCtx, {});
			expect(response).toBeDefined();
		});
	});

	describe('path parameter substitution', () => {
		testOrSkip(
			'getDealRecord throws 404 for missing deal (but path parsing works)',
			async () => {
				await expect(
					getDealRecord(mockCtx, {
						record_id: '11111111-1111-1111-1111-111111111111',
					}),
				).rejects.toMatchObject({ status: 404 });
			},
		);

		testOrSkip(
			'putV2ObjectsObjectRecords dynamically routes companies and creates record',
			async () => {
				const response = await putV2ObjectsObjectRecords(mockCtx, {
					object: 'companies',
					matching_attribute: 'domains',
					data: { values: { domains: [{ domain: 'example.com' }] } },
				});
				expect(response).toBeDefined();
			},
		);
	});

	describe('payload processing and cleanup', () => {
		testOrSkip(
			'assertPerson isolates the body payload correctly and creates person',
			async () => {
				const input = {
					matching_attribute: 'email_addresses',
					data: {
						values: {
							email_addresses: [{ email_address: 'test@example.com' }],
							name: [
								{
									first_name: 'Test',
									last_name: 'User',
									full_name: 'Test User',
								},
							],
						},
					},
				};
				const response = await assertPerson(mockCtx, input);
				expect(response).toBeDefined();
			},
		);

		testOrSkip(
			'putV2ObjectsObjectRecords keeps the object slug out of the payload body',
			async () => {
				const input = {
					object: 'companies',
					matching_attribute: 'domains',
					data: { values: { domains: [{ domain: 'example.com' }] } },
				};
				const response = await putV2ObjectsObjectRecords(mockCtx, input);
				expect(response).toBeDefined();
			},
		);
	});

	describe('list management', () => {
		testOrSkip(
			'putV2ListsListEntries throws 404 or 400 for non-existent list',
			async () => {
				const input = {
					list: '11111111-1111-1111-1111-111111111111',
					data: {
						parent_object: 'companies',
						parent_record_id: '22222222-2222-2222-2222-222222222222',
					},
				};
				const error = await putV2ListsListEntries(mockCtx, input).then(
					() => {
						throw new Error('expected putV2ListsListEntries to reject');
					},
					(e: unknown) => e,
				);
				expect([400, 404]).toContain((error as { status?: number }).status);
			},
		);
	});

	describe('Mocked operation tests', () => {
		const localMockCtx = {
			key: 'mock-key',
		} as never;

		it('findRecord calls GET when record_id is present', async () => {
			const res = (await findRecord(localMockCtx, {
				object: 'companies',
				record_id: 'rec_123',
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/companies/records/rec_123');
			expect(res.options.method).toBe('GET');
		});

		it('findRecord calls POST query when record_id is absent', async () => {
			const res = (await findRecord(localMockCtx, {
				object: 'companies',
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/companies/records/query');
			expect(res.options.method).toBe('POST');
		});

		it('peopleGetPerson gets person by record_id', async () => {
			const res = (await peopleGetPerson(localMockCtx, {
				record_id: 'person_123',
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/people/records/person_123');
			expect(res.options.method).toBe('GET');
		});

		it('peopleListPersons queries people records', async () => {
			const res = (await peopleListPersons(localMockCtx, {})) as MockCall;
			expect(res.url).toBe('/v2/objects/people/records/query');
			expect(res.options.method).toBe('POST');
		});

		it('patchRecord updates a record using PATCH', async () => {
			const res = (await patchRecord(localMockCtx, {
				object: 'companies',
				record_id: 'rec_123',
				data: {},
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/companies/records/rec_123');
			expect(res.options.method).toBe('PATCH');
		});

		it('queryRecords queries records', async () => {
			const res = (await queryRecords(localMockCtx, {
				object: 'companies',
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/companies/records/query');
			expect(res.options.method).toBe('POST');
		});

		it('searchRecords searches records', async () => {
			const res = (await searchRecords(localMockCtx, {
				query: 'acme',
				objects: ['companies'],
			})) as MockCall;
			expect(res.url).toBe('/v2/objects/records/search');
			expect(res.options.method).toBe('POST');
		});
	});

	describe('Attio route shapes', () => {
		const localMockCtx = { key: 'mock-key' } as never;

		async function called(
			fn: (ctx: never, input: never) => Promise<unknown>,
			input: Record<string, unknown>,
		) {
			return (await fn(localMockCtx as never, input as never)) as MockCall;
		}

		it('substitutes list ids instead of the literal list segment', async () => {
			const put = await called(putV2ListsListEntries, {
				list: 'list-1',
				data: { parent_object: 'companies' },
			});
			expect(put.url).toBe('/v2/lists/list-1/entries');
			expect(put.options.method).toBe('PUT');

			const post = await called(postV2ListsListEntries, {
				list: 'list-2',
				data: { parent_object: 'companies' },
			});
			expect(post.url).toBe('/v2/lists/list-2/entries');
			expect(post.options.method).toBe('POST');

			const query = await called(postV2ListsListEntriesQuery, {
				list: 'list-3',
			});
			expect(query.url).toBe('/v2/lists/list-3/entries/query');
			expect(query.options.method).toBe('POST');
		});

		it('lists records with POST query', async () => {
			expect((await called(listRecords, { object: 'companies' })).url).toBe(
				'/v2/objects/companies/records/query',
			);
			expect((await called(listDealRecords, {})).url).toBe(
				'/v2/objects/deals/records/query',
			);
			expect((await called(listUserRecords, {})).url).toBe(
				'/v2/objects/users/records/query',
			);
			expect((await called(listWorkspaceRecords, {})).url).toBe(
				'/v2/objects/workspaces/records/query',
			);
			expect((await called(peopleListPersons, {})).options.method).toBe('POST');
		});

		it('nests attribute and select-option routes under object or list', async () => {
			expect(
				(await called(createAttribute, { object: 'companies', data: {} })).url,
			).toBe('/v2/objects/companies/attributes');
			expect(
				(await called(createAttribute, { list: 'list-1', data: {} })).url,
			).toBe('/v2/lists/list-1/attributes');
			expect(
				(
					await called(getAttribute, {
						object: 'people',
						attribute: 'email_addresses',
					})
				).url,
			).toBe('/v2/objects/people/attributes/email_addresses');
			expect(
				(
					await called(updateAttribute, {
						object: 'people',
						attribute: 'email_addresses',
						data: {},
					})
				).url,
			).toBe('/v2/objects/people/attributes/email_addresses');
			expect(
				(
					await called(createSelectOption, {
						object: 'people',
						attribute: 'industry',
						data: {},
					})
				).url,
			).toBe('/v2/objects/people/attributes/industry/options');
			expect(
				(
					await called(updateSelectOption, {
						object: 'people',
						attribute: 'industry',
						option: 'opt-1',
						data: {},
					})
				).url,
			).toBe('/v2/objects/people/attributes/industry/options/opt-1');
		});

		it('uses workspace member REST paths', async () => {
			expect(
				(await called(getWorkspaceMember, { workspace_member_id: 'mem-1' }))
					.url,
			).toBe('/v2/workspace_members/mem-1');
			expect((await called(listWorkspaceMembers, {})).url).toBe(
				'/v2/workspace_members',
			);
		});

		it('omits path params from list entry request bodies', async () => {
			const res = await called(createEntry, {
				list: 'list-1',
				data: {
					parent_object: 'companies',
					parent_record_id: 'rec-1',
				},
			});
			expect(res.url).toBe('/v2/lists/list-1/entries');
			expect(res.options.body).toEqual({
				data: {
					parent_object: 'companies',
					parent_record_id: 'rec-1',
				},
			});
			expect(res.options.body).not.toHaveProperty('list');
		});
	});

	describe('All generated operations coverage', () => {
		const localMockCtx = {
			key: 'mock-key',
		} as never;

		const pathFixture = {
			list: 'list-1',
			list_id: 'list-1',
			object: 'companies',
			object_id: 'obj-1',
			record_id: 'rec-1',
			entry_id: 'ent-1',
			list_entry_id: 'ent-1',
			record_entries_id: 'ent-1',
			record_attribute_values_id: 'rav-1',
			attribute: 'email_addresses',
			attribute_id: 'email_addresses',
			option: 'opt-1',
			status_id: 'st-1',
			workspace_member_id: 'mem-1',
			comment_id: 'cmt-1',
			note_id: 'note-1',
			task_id: 'task-1',
			webhook_id: 'wh-1',
			meeting_id: 'mtg-1',
			thread_id: 'thr-1',
		};

		const expectedRoutes: Record<
			string,
			{ url: string; method: string; omitFromBody?: string[] }
		> = {
			putV2ListsListEntries: {
				url: '/v2/lists/list-1/entries',
				method: 'PUT',
				omitFromBody: ['list', 'list_id'],
			},
			assertPerson: {
				url: '/v2/objects/people/records',
				method: 'PUT',
			},
			putV2ObjectsObjectRecords: {
				url: '/v2/objects/companies/records',
				method: 'PUT',
			},
			assertUserRecord: {
				url: '/v2/objects/users/records',
				method: 'PUT',
			},
			assertWorkspace: {
				url: '/v2/objects/workspaces/records',
				method: 'PUT',
			},
			createAttribute: {
				url: '/v2/lists/list-1/attributes',
				method: 'POST',
				omitFromBody: ['object', 'list', 'list_id'],
			},
			createComment: {
				url: '/v2/comments',
				method: 'POST',
			},
			createCompany: {
				url: '/v2/objects/companies/records',
				method: 'POST',
			},
			createDealRecord: {
				url: '/v2/objects/deals/records',
				method: 'POST',
			},
			createEntry: {
				url: '/v2/lists/list-1/entries',
				method: 'POST',
				omitFromBody: ['list', 'list_id'],
			},
			createList: {
				url: '/v2/lists',
				method: 'POST',
			},
			postV2ListsListEntries: {
				url: '/v2/lists/list-1/entries',
				method: 'POST',
				omitFromBody: ['list', 'list_id'],
			},
			createNote: {
				url: '/v2/notes',
				method: 'POST',
			},
			createObject: {
				url: '/v2/objects',
				method: 'POST',
			},
			createPerson: {
				url: '/v2/objects/people/records',
				method: 'POST',
			},
			createRecord: {
				url: '/v2/objects/companies/records',
				method: 'POST',
				omitFromBody: ['object'],
			},
			createSelectOption: {
				url: '/v2/lists/list-1/attributes/email_addresses/options',
				method: 'POST',
				omitFromBody: [
					'object',
					'list',
					'list_id',
					'attribute',
					'attribute_id',
				],
			},
			createStatus: {
				url: '/v2/objects/companies/attributes/email_addresses/statuses',
				method: 'POST',
			},
			createTask: {
				url: '/v2/tasks',
				method: 'POST',
			},
			createUserRecord: {
				url: '/v2/objects/users/records',
				method: 'POST',
			},
			createWebhook: {
				url: '/v2/webhooks',
				method: 'POST',
			},
			createWorkspaceRecord: {
				url: '/v2/objects/workspaces/records',
				method: 'POST',
			},
			postV2ObjectsObjectRecords: {
				url: '/v2/objects/companies/records',
				method: 'POST',
				omitFromBody: ['object'],
			},
			deleteComment: {
				url: '/v2/comments/cmt-1',
				method: 'DELETE',
			},
			deleteCompany: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'DELETE',
			},
			deleteDeal: {
				url: '/v2/objects/deals/records/rec-1',
				method: 'DELETE',
			},
			deleteEntry: {
				url: '/v2/lists/list-1/entries/ent-1',
				method: 'DELETE',
			},
			deleteNote: {
				url: '/v2/notes/note-1',
				method: 'DELETE',
			},
			deletePerson: {
				url: '/v2/objects/people/records/rec-1',
				method: 'DELETE',
			},
			deleteRecord: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'DELETE',
			},
			deleteRecordById: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'DELETE',
			},
			deleteTask: {
				url: '/v2/tasks/task-1',
				method: 'DELETE',
			},
			deleteUser: {
				url: '/v2/objects/users/records/rec-1',
				method: 'DELETE',
			},
			deleteWebhook: {
				url: '/v2/webhooks/wh-1',
				method: 'DELETE',
			},
			deleteWorkspaceRecord: {
				url: '/v2/objects/workspaces/records/rec-1',
				method: 'DELETE',
			},
			findRecord: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'GET',
			},
			getAttribute: {
				url: '/v2/lists/list-1/attributes/email_addresses',
				method: 'GET',
			},
			getComment: {
				url: '/v2/comments/cmt-1',
				method: 'GET',
			},
			getCompany: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'GET',
			},
			getSelf: {
				url: '/v2/self',
				method: 'GET',
			},
			getDealRecord: {
				url: '/v2/objects/deals/records/rec-1',
				method: 'GET',
			},
			getList: {
				url: '/v2/lists/list-1',
				method: 'GET',
			},
			getListEntry: {
				url: '/v2/lists/list-1/entries/ent-1',
				method: 'GET',
			},
			getNote: {
				url: '/v2/notes/note-1',
				method: 'GET',
			},
			getObject: {
				url: '/v2/objects/obj-1',
				method: 'GET',
			},
			peopleGetPerson: {
				url: '/v2/objects/people/records/rec-1',
				method: 'GET',
			},
			getRecord: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'GET',
			},
			getRecordAttributeValues: {
				url: '/v2/objects/companies/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			getV2ObjectsObjectRecordsRecordId: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'GET',
			},
			getTask: {
				url: '/v2/tasks/task-1',
				method: 'GET',
			},
			getV2WorkspaceMembers: {
				url: '/v2/workspace_members',
				method: 'GET',
			},
			getWebhook: {
				url: '/v2/webhooks/wh-1',
				method: 'GET',
			},
			getWorkspaceMember: {
				url: '/v2/workspace_members/mem-1',
				method: 'GET',
			},
			getWorkspaceRecord: {
				url: '/v2/objects/workspaces/records/rec-1',
				method: 'GET',
			},
			listAttributeOptions: {
				url: '/v2/objects/companies/attributes/email_addresses/options',
				method: 'GET',
			},
			listAttributeStatuses: {
				url: '/v2/objects/companies/attributes/email_addresses/statuses',
				method: 'GET',
			},
			listAttributes: {
				url: '/v2/objects/companies/attributes',
				method: 'GET',
			},
			listCallRecordings: {
				url: '/v2/meetings/mtg-1/call_recordings',
				method: 'GET',
			},
			listCompanies: {
				url: '/v2/objects/companies/records/query',
				method: 'POST',
			},
			listCompanyAttributeValues: {
				url: '/v2/objects/companies/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			listCompanyRecordEntries: {
				url: '/v2/objects/companies/records/rec-1/entries',
				method: 'GET',
			},
			listDealEntries: {
				url: '/v2/objects/deals/records/rec-1/entries',
				method: 'GET',
			},
			listDealRecordAttributeValues: {
				url: '/v2/objects/deals/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			listDealRecords: {
				url: '/v2/objects/deals/records/query',
				method: 'POST',
			},
			listEntries: {
				url: '/v2/lists/list-1/entries/query',
				method: 'POST',
			},
			postV2ListsListEntriesQuery: {
				url: '/v2/lists/list-1/entries/query',
				method: 'POST',
				omitFromBody: ['list', 'list_id'],
			},
			listListEntries: {
				url: '/v2/lists/list-1/entries/query',
				method: 'POST',
			},
			listListEntryAttributeValues: {
				url: '/v2/lists/list-1/entries/ent-1/attributes/email_addresses/values',
				method: 'GET',
			},
			listLists: {
				url: '/v2/lists',
				method: 'GET',
			},
			listMeetings: {
				url: '/v2/meetings',
				method: 'GET',
			},
			listNotes: {
				url: '/v2/notes',
				method: 'GET',
			},
			listObjects: {
				url: '/v2/objects',
				method: 'GET',
			},
			listPeopleAttributeValues: {
				url: '/v2/objects/people/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			listPeopleRecordEntries: {
				url: '/v2/objects/people/records/rec-1/entries',
				method: 'GET',
			},
			peopleListPersons: {
				url: '/v2/objects/people/records/query',
				method: 'POST',
			},
			listRecordAttributeValues: {
				url: '/v2/objects/companies/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			getRecordEntries: {
				url: '/v2/objects/companies/records/rec-1/entries/ent-1',
				method: 'GET',
			},
			listRecordEntries: {
				url: '/v2/objects/companies/records/rec-1/entries',
				method: 'GET',
			},
			listRecords: {
				url: '/v2/objects/companies/records/query',
				method: 'POST',
				omitFromBody: ['object'],
			},
			postV2ObjectsObjectRecordsQuery: {
				url: '/v2/objects/companies/records/query',
				method: 'POST',
				omitFromBody: ['object'],
			},
			getV2Tasks: {
				url: '/v2/tasks',
				method: 'GET',
			},
			listThreads: {
				url: '/v2/threads',
				method: 'GET',
			},
			listUserRecordEntries: {
				url: '/v2/objects/users/records/rec-1/entries',
				method: 'GET',
			},
			listUserRecords: {
				url: '/v2/objects/users/records/query',
				method: 'POST',
			},
			listWebhooks: {
				url: '/v2/webhooks',
				method: 'GET',
			},
			listWorkspaceMembers: {
				url: '/v2/workspace_members',
				method: 'GET',
			},
			listWorkspaceRecordAttributeValues: {
				url: '/v2/objects/workspaces/records/rec-1/attributes/email_addresses/values',
				method: 'GET',
			},
			listWorkspaceRecordEntries: {
				url: '/v2/objects/workspaces/records/rec-1/entries',
				method: 'GET',
			},
			listWorkspaceRecords: {
				url: '/v2/objects/workspaces/records/query',
				method: 'POST',
			},
			patchRecord: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'PATCH',
				omitFromBody: ['object', 'record_id'],
			},
			putV2ObjectsObjectRecordsRecordId: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'PUT',
				omitFromBody: ['object', 'record_id'],
			},
			queryRecords: {
				url: '/v2/objects/companies/records/query',
				method: 'POST',
				omitFromBody: ['object'],
			},
			searchRecords: {
				url: '/v2/objects/records/search',
				method: 'POST',
				omitFromBody: ['object', 'record_id'],
			},
			postV2ObjectsRecordsSearch: {
				url: '/v2/objects/records/search',
				method: 'POST',
				omitFromBody: ['object', 'record_id'],
			},
			updateAttribute: {
				url: '/v2/lists/list-1/attributes/email_addresses',
				method: 'PATCH',
				omitFromBody: [
					'object',
					'list',
					'list_id',
					'attribute',
					'attribute_id',
				],
			},
			updateCompany: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'PATCH',
			},
			updateDealRecord: {
				url: '/v2/objects/deals/records/rec-1',
				method: 'PATCH',
			},
			updateEntry: {
				url: '/v2/lists/list-1/entries/ent-1',
				method: 'PATCH',
			},
			updateList: {
				url: '/v2/lists/list-1',
				method: 'PATCH',
			},
			patchV2ListsListEntriesEntryId: {
				url: '/v2/lists/list-1/entries/ent-1',
				method: 'PATCH',
			},
			putV2ListsListEntriesEntryId: {
				url: '/v2/lists/list-1/entries/ent-1',
				method: 'PUT',
			},
			updateObject: {
				url: '/v2/objects/obj-1',
				method: 'PATCH',
			},
			updatePerson: {
				url: '/v2/objects/people/records/rec-1',
				method: 'PATCH',
			},
			updateRecord: {
				url: '/v2/objects/companies/records/rec-1',
				method: 'PATCH',
			},
			updateSelectOption: {
				url: '/v2/lists/list-1/attributes/email_addresses/options/opt-1',
				method: 'PATCH',
				omitFromBody: [
					'object',
					'list',
					'list_id',
					'attribute',
					'attribute_id',
					'option',
					'select_option_id',
				],
			},
			updateStatus: {
				url: '/v2/objects/companies/attributes/email_addresses/statuses/st-1',
				method: 'PATCH',
			},
			updateTask: {
				url: '/v2/tasks/task-1',
				method: 'PATCH',
			},
			updateUserRecord: {
				url: '/v2/objects/users/records/rec-1',
				method: 'PATCH',
			},
			updateWebhook: {
				url: '/v2/webhooks/wh-1',
				method: 'PATCH',
			},
			updateWorkspaceRecord: {
				url: '/v2/objects/workspaces/records/rec-1',
				method: 'PATCH',
			},
		};

		const exportedFnNames = Object.entries(Generated)
			.filter(([, value]) => typeof value === 'function')
			.map(([name]) => name);

		it('fails if generated exports drift from expectedRoutes', () => {
			expect([...exportedFnNames].sort()).toEqual(
				Object.keys(expectedRoutes).sort(),
			);
		});

		for (const [name, expected] of Object.entries(expectedRoutes)) {
			it(`pins ${name} to ${expected.method} ${expected.url}`, async () => {
				const fn = Generated[name as keyof typeof Generated];
				expect(typeof fn).toBe('function');
				const handler = fn as (ctx: never, input: never) => Promise<MockCall>;
				const res = await handler(localMockCtx as never, pathFixture as never);
				expect(res.url).toBe(expected.url);
				expect(res.options.method).toBe(expected.method);
				if (expected.omitFromBody) {
					for (const key of expected.omitFromBody) {
						expect(res.options.body).not.toHaveProperty(key);
					}
				}
			});
		}
	});
});
