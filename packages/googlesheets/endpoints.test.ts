import { request } from 'corsair/http';
import { appendRow } from './endpoints/sheets';
import { GoogleSheetsEndpointOutputSchemas } from './endpoints/types';
import type { GoogleSheetsContext } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

const makeStore = (): Store => ({
	upsertByEntityId: jest.fn(async () => undefined),
	deleteByEntityId: jest.fn(async () => true),
});

function makeCtx(db: Record<string, Store>) {
	// unknown cast needed because the mock only implements the ctx subset
	// exercised by the sheets handlers (key/$getAccountId/db) — building a
	// full CorsairPluginContext (hub/keys/database/oauth) is not feasible here.
	return {
		key: 'test-token',
		$getAccountId: async () => 'test-account-id',
		db,
	} as unknown as GoogleSheetsContext;
}

describe('googlesheets sheets.appendRow db persistence (issue #1835)', () => {
	let warnSpy: jest.SpyInstance;

	beforeEach(() => {
		mockRequest.mockReset();
		warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterEach(() => {
		warnSpy.mockRestore();
		jest.restoreAllMocks();
	});

	it('persists the row using updates.updatedRange from AppendValuesResponse', async () => {
		mockRequest.mockResolvedValue({
			spreadsheetId: 'sheet-1',
			tableRange: 'Sheet1!A1:Z100',
			updates: {
				spreadsheetId: 'sheet-1',
				updatedRange: 'Sheet1!A101:Z101',
				updatedRows: 1,
				updatedColumns: 3,
				updatedCells: 3,
			},
		});
		const rows = makeStore();
		const ctx = makeCtx({ rows });

		const result = await appendRow(ctx, {
			spreadsheetId: 'sheet-1',
			sheetName: 'Sheet1',
			values: ['a', 'b', 'c'],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.updates?.updatedRange).toBe('Sheet1!A101:Z101');
		expect(rows.upsertByEntityId).toHaveBeenCalledWith(
			'sheet-1_Sheet1_Sheet1!A101:Z101',
			expect.objectContaining({
				spreadsheetId: 'sheet-1',
				sheetName: 'Sheet1',
				range: 'Sheet1!A101:Z101',
				values: ['a', 'b', 'c'],
			}),
		);
	});

	it('derives the sheet name from the range when sheetName is absent', async () => {
		mockRequest.mockResolvedValue({
			spreadsheetId: 'sheet-1',
			tableRange: 'Expenses!A1:Z100',
			updates: {
				spreadsheetId: 'sheet-1',
				updatedRange: 'Expenses!A101:C101',
				updatedRows: 1,
				updatedColumns: 3,
				updatedCells: 3,
			},
		});
		const rows = makeStore();
		const ctx = makeCtx({ rows });

		await appendRow(ctx, {
			spreadsheetId: 'sheet-1',
			range: 'Expenses!A:Z',
			values: ['rent', '100', 'usd'],
		});

		expect(rows.upsertByEntityId).toHaveBeenCalledWith(
			'sheet-1_Expenses_Expenses!A101:C101',
			expect.objectContaining({
				sheetName: 'Expenses',
				range: 'Expenses!A101:C101',
			}),
		);
	});

	it('skips persistence when the response has no updatedRange', async () => {
		mockRequest.mockResolvedValue({ spreadsheetId: 'sheet-2' });
		const rows = makeStore();
		const ctx = makeCtx({ rows });

		const result = await appendRow(ctx, {
			spreadsheetId: 'sheet-2',
			sheetName: 'Sheet1',
			values: ['x'],
		});

		expect(result.spreadsheetId).toBe('sheet-2');
		expect(rows.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('posts to the :append endpoint with values wrapped as ROWS', async () => {
		mockRequest.mockResolvedValue({
			spreadsheetId: 'sheet-3',
			updates: { updatedRange: 'Sheet1!A2:Z2' },
		});
		const ctx = makeCtx({ rows: makeStore() });

		await appendRow(ctx, {
			spreadsheetId: 'sheet-3',
			values: ['a', 1, true],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: expect.stringContaining('google') }),
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining(':append'),
				query: expect.objectContaining({
					valueInputOption: 'USER_ENTERED',
					insertDataOption: 'INSERT_ROWS',
				}),
				body: { values: [['a', 1, true]], majorDimension: 'ROWS' },
			}),
		);
	});

	it('tolerates db failures and still returns the result', async () => {
		mockRequest.mockResolvedValue({
			spreadsheetId: 'sheet-4',
			updates: { updatedRange: 'Sheet1!A5:Z5' },
		});
		const rows = makeStore();
		rows.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		const ctx = makeCtx({ rows });

		const result = await appendRow(ctx, {
			spreadsheetId: 'sheet-4',
			values: ['flaky'],
		});

		expect(result.updates?.updatedRange).toBe('Sheet1!A5:Z5');
		expect(rows.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('sheetsAppendRow output schema accepts a real AppendValuesResponse', () => {
		const parsed = GoogleSheetsEndpointOutputSchemas.sheetsAppendRow.parse({
			spreadsheetId: 'sheet-5',
			tableRange: 'Sheet1!A1:Z100',
			updates: {
				spreadsheetId: 'sheet-5',
				updatedRange: 'Sheet1!A101:Z101',
				updatedRows: 1,
				updatedColumns: 2,
				updatedCells: 2,
			},
		});

		// The old BatchUpdateValuesResponse shape strips unknown fields, so
		// assert the append-specific fields survive parsing.
		expect(parsed.tableRange).toBe('Sheet1!A1:Z100');
		expect(parsed.updates?.updatedRange).toBe('Sheet1!A101:Z101');
	});
});
