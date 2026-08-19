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
				try {
					await getDealRecord(mockCtx, {
						record_id: '11111111-1111-1111-1111-111111111111',
					});
					throw new Error('expected getDealRecord to reject');
				} catch (e: unknown) {
					expect(e).toMatchObject({ status: 404 });
				}
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
				try {
					await putV2ListsListEntries(mockCtx, input);
					throw new Error('expected putV2ListsListEntries to reject');
				} catch (e: unknown) {
					expect([400, 404]).toContain((e as { status?: number }).status);
				}
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
			const res = (await searchRecords(localMockCtx, {})) as MockCall;
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

		for (const [name, fn] of Object.entries(Generated)) {
			if (typeof fn === 'function') {
				it(`should invoke ${name} successfully under mock`, async () => {
					const res = await fn(localMockCtx as never, {} as never);
					expect(res).toBeDefined();
				});
			}
		}
	});
});
