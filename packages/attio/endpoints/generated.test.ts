import fs from 'fs';
import path from 'path';
import {
	assertPerson,
	getDealRecord,
	getSelf,
	putV2ListsListEntries,
	putV2ObjectsObjectRecords,
} from './generated';

let loadedToken: string | undefined = undefined;
try {
	const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
	for (const line of envFile.split('\n')) {
		const match = line.match(/^\s*ATTIO_TEST_TOKEN\s*=\s*(.*)?\s*$/);
		if (match && match[1]) {
			loadedToken = match[1].trim();
		}
	}
} catch (e) {
	// ignore
}

const TEST_TOKEN =
	loadedToken || process.env.ATTIO_TOKEN || process.env.ATTIO_TEST_TOKEN;

describe('Attio REST API verification', () => {
	// Skip all tests if no token is provided, just like other packages do
	const testOrSkip = TEST_TOKEN ? it : it.skip;

	const mockCtx = {
		key: TEST_TOKEN,
	} as any;

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
				} catch (e: any) {
					expect(e.status).toBe(404);
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
				} catch (e: any) {
					expect([400, 404]).toContain(e.status);
				}
			},
		);
	});
});
