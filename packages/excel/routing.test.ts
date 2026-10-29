import { logEventFromContext } from 'corsair/core';
import { makeExcelRequest } from './client';
import {
	Charts,
	Comments,
	Files,
	Functions,
	Names,
	Ranges,
	Sessions,
	Tables,
	Worksheets,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeExcelRequest: jest.fn(),
	XLSX_MEDIA_TYPE:
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}));

const mockRequest = jest.mocked(makeExcelRequest);
const mockLog = jest.mocked(logEventFromContext);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Promise<unknown> is the shared return; each
// endpoint's output differs, so a stricter shared type is not practical.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function createContext() {
	return { key: 'x_key_test', options: {} };
}

function invoke(
	endpoint: AnyEndpoint,
	// Negative tests pass values no schema accepts, so a stricter input is
	// not practical.
	input: unknown,
) {
	// The fake context is not ExcelContext. A stricter argument type is
	// not practical at this boundary.
	return endpoint(createContext() as never, input as never);
}

const worksheet = {
	id: '{sheet}',
	name: 'Sheet1',
	position: 0,
	visibility: 'Visible',
};

const range = {
	address: 'Sheet1!A1:B2',
	values: [
		['a', 'b'],
		['c', 'd'],
	],
};

const table = {
	id: '1',
	name: 'Table1',
	showHeaders: true,
};

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('excel routing', () => {
	it('rejects a call that sets both itemId and itemPath before any request', async () => {
		await expect(
			invoke(Sessions.create, {
				itemId: 'item-1',
				itemPath: 'Book.xlsx',
				persistChanges: true,
			}),
		).rejects.toThrow('exactly one of itemId or itemPath');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('opens a session on a drive item and sends persistChanges', async () => {
		mockRequest.mockResolvedValue({ id: 'sess-1', persistChanges: true });
		await invoke(Sessions.create, {
			driveId: 'drive-1',
			itemId: 'item 1',
			persistChanges: true,
			sessionId: 'old',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/drives/drive-1/items/item%201/workbook/createSession',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { persistChanges: true },
				headers: { 'workbook-session-id': 'old' },
			}),
		);
	});

	it('closes a session with the required session header', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Sessions.close, {
			itemPath: 'Reports/Book.xlsx',
			sessionId: 'sess-1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/root:/Reports/Book.xlsx:/workbook/closeSession',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				headers: { 'workbook-session-id': 'sess-1' },
				body: {},
			}),
		);
	});

	it('refreshes a session', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Sessions.refresh, { itemId: 'item-1', sessionId: 'sess-1' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/refreshSession',
			'x_key_test',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('lists worksheets with paging query', async () => {
		mockRequest.mockResolvedValue({ value: [worksheet] });
		await invoke(Worksheets.list, { itemId: 'item-1', top: 10, skip: 0 });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets',
			'x_key_test',
			expect.objectContaining({
				method: 'GET',
				query: { $top: 10, $skip: 0 },
			}),
		);
	});

	it('gets a worksheet and encodes brace ids', async () => {
		mockRequest.mockResolvedValue(worksheet);
		await invoke(Worksheets.get, { itemId: 'item-1', worksheet: '{sheet}' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/%7Bsheet%7D',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('adds a worksheet', async () => {
		mockRequest.mockResolvedValue(worksheet);
		await invoke(Worksheets.add, { itemId: 'item-1', name: 'Sheet2' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/add',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { name: 'Sheet2' },
			}),
		);
	});

	it('updates a worksheet name', async () => {
		mockRequest.mockResolvedValue(worksheet);
		await invoke(Worksheets.update, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			name: 'Data',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet1',
			'x_key_test',
			expect.objectContaining({
				method: 'PATCH',
				body: { name: 'Data' },
			}),
		);
	});

	it('deletes a worksheet', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Worksheets.delete, { itemId: 'item-1', worksheet: 'Sheet2' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet2',
			'x_key_test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('gets a range', async () => {
		mockRequest.mockResolvedValue(range);
		await invoke(Ranges.get, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			address: 'A1:B2',
			sessionId: 'sess-1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			"/me/drive/items/item-1/workbook/worksheets/Sheet1/range(address='A1:B2')",
			'x_key_test',
			expect.objectContaining({
				method: 'GET',
				headers: { 'workbook-session-id': 'sess-1' },
			}),
		);
	});

	it('gets a used range with valuesOnly', async () => {
		mockRequest.mockResolvedValue(range);
		await invoke(Ranges.usedRange, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			valuesOnly: true,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/usedRange(valuesOnly=true)',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('patches range values', async () => {
		mockRequest.mockResolvedValue(range);
		await invoke(Ranges.update, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			address: 'A1',
			values: [['hello']],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			"/me/drive/items/item-1/workbook/worksheets/Sheet1/range(address='A1')",
			'x_key_test',
			expect.objectContaining({
				method: 'PATCH',
				body: { values: [['hello']] },
			}),
		);
	});

	it('clears a range', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Ranges.clear, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			address: 'A1:B2',
			applyTo: 'Contents',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			"/me/drive/items/item-1/workbook/worksheets/Sheet1/range(address='A1:B2')/clear",
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { applyTo: 'Contents' },
			}),
		);
	});

	it('lists tables on one worksheet', async () => {
		mockRequest.mockResolvedValue({ value: [table] });
		await invoke(Tables.list, { itemId: 'item-1', worksheet: 'Sheet1' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/tables',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('gets, adds, updates, and deletes a table', async () => {
		mockRequest.mockResolvedValue(table);
		await invoke(Tables.get, { itemId: 'item-1', table: 'Table1' });
		await invoke(Tables.add, {
			itemId: 'item-1',
			address: 'Sheet1!A1:C3',
			hasHeaders: true,
		});
		await invoke(Tables.update, {
			itemId: 'item-1',
			table: 'Table1',
			name: 'Data',
		});
		mockRequest.mockResolvedValue(undefined);
		await invoke(Tables.delete, { itemId: 'item-1', table: 'Table1' });
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/tables/Table1',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/tables/add',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { address: 'Sheet1!A1:C3', hasHeaders: true },
			}),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/me/drive/items/item-1/workbook/tables/Table1',
			'x_key_test',
			expect.objectContaining({
				method: 'PATCH',
				body: { name: 'Data' },
			}),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			4,
			'/me/drive/items/item-1/workbook/tables/Table1',
			'x_key_test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('lists and adds table rows', async () => {
		mockRequest.mockResolvedValue({ value: [] });
		await invoke(Tables.listRows, { itemId: 'item-1', table: 'Table1' });
		mockRequest.mockResolvedValue({ index: 1, values: [[1, 2]] });
		await invoke(Tables.addRows, {
			itemId: 'item-1',
			table: 'Table1',
			values: [[1, 2]],
			index: 0,
		});
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/tables/Table1/rows',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/tables/Table1/rows',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { values: [[1, 2]], index: 0 },
			}),
		);
	});

	it('deletes a table row by index', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Tables.deleteRow, {
			itemId: 'item-1',
			table: 'Table1',
			index: 2,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/tables/Table1/rows/2',
			'x_key_test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('lists, adds, and deletes table columns', async () => {
		mockRequest.mockResolvedValue({ value: [] });
		await invoke(Tables.listColumns, { itemId: 'item-1', table: 'Table1' });
		mockRequest.mockResolvedValue({ id: '2', name: 'Status', index: 1 });
		await invoke(Tables.addColumn, {
			itemId: 'item-1',
			table: 'Table1',
			values: [['Status'], ['Open']],
		});
		mockRequest.mockResolvedValue(undefined);
		await invoke(Tables.deleteColumn, {
			itemId: 'item-1',
			table: 'Table1',
			column: 'Status',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/tables/Table1/columns/add',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { values: [['Status'], ['Open']] },
			}),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/me/drive/items/item-1/workbook/tables/Table1/columns/Status',
			'x_key_test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('calls a worksheet function', async () => {
		mockRequest.mockResolvedValue({ error: null, value: 3 });
		await invoke(Functions.calculate, {
			itemId: 'item-1',
			name: 'SUM',
			args: { number1: 1, number2: 2 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/functions/SUM',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { number1: 1, number2: 2 },
			}),
		);
	});

	it('uploads a blank xlsx by path', async () => {
		mockRequest.mockResolvedValue({ id: 'item-1', name: 'Book.xlsx' });
		await invoke(Files.create, { path: 'Reports/Book.xlsx' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/root:/Reports/Book.xlsx:/content',
			'x_key_test',
			expect.objectContaining({
				method: 'PUT',
				mediaType:
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			}),
		);
		const options = mockRequest.mock.calls[0]?.[2];
		expect(options?.body).toBeInstanceOf(Blob);
	});

	it('searches the drive and keeps only xlsx results', async () => {
		mockRequest.mockResolvedValue({
			value: [
				{ id: 'a', name: 'Budget.xlsx' },
				{ id: 'b', name: 'Notes.docx' },
			],
		});
		const found = await invoke(Files.find, { query: 'Budget report' });
		expect(mockRequest).toHaveBeenCalledWith(
			"/me/drive/root/search(q='Budget%20report')",
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(found).toEqual({ value: [{ id: 'a', name: 'Budget.xlsx' }] });
	});

	it('encodes # and ? in a file search so they stay in the path', async () => {
		mockRequest.mockResolvedValue({ value: [] });
		await invoke(Files.find, { query: 'C# what?' });
		expect(mockRequest).toHaveBeenCalledWith(
			"/me/drive/root/search(q='C%23%20what%3F')",
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('adds a chart from a range', async () => {
		mockRequest.mockResolvedValue({ id: '{chart}', name: 'Chart 1' });
		await invoke(Charts.add, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			type: 'ColumnClustered',
			sourceData: 'A1:C4',
			seriesBy: 'Auto',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/charts/add',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: {
					type: 'ColumnClustered',
					sourceData: 'A1:C4',
					seriesBy: 'Auto',
				},
			}),
		);
	});

	it('lists, updates, and deletes a chart', async () => {
		mockRequest.mockResolvedValue({
			value: [{ id: '{chart}', name: 'Chart 1' }],
		});
		await invoke(Charts.list, { itemId: 'item-1', worksheet: 'Sheet1' });
		mockRequest.mockResolvedValue({ id: '{chart}', name: 'Revenue' });
		await invoke(Charts.update, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			chart: '{chart}',
			name: 'Revenue',
		});
		mockRequest.mockResolvedValue(undefined);
		await invoke(Charts.delete, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			chart: '{chart}',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/charts/%7Bchart%7D',
			'x_key_test',
			expect.objectContaining({ method: 'PATCH', body: { name: 'Revenue' } }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/charts/%7Bchart%7D',
			'x_key_test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('points a chart at a new range', async () => {
		mockRequest.mockResolvedValue(undefined);
		await invoke(Charts.setData, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			chart: 'Chart 1',
			sourceData: 'A1:B4',
			seriesBy: 'Columns',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/charts/Chart%201/setData',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { sourceData: 'A1:B4', seriesBy: 'Columns' },
			}),
		);
	});

	it('adds a named range and reads it', async () => {
		mockRequest.mockResolvedValue({
			name: 'Sales',
			type: 'Range',
			value: 'Sheet1!$A$1:$C$4',
			visible: true,
		});
		await invoke(Names.add, {
			itemId: 'item-1',
			name: 'Sales',
			reference: '=Sheet1!$A$1:$C$4',
		});
		mockRequest.mockResolvedValue(range);
		await invoke(Names.range, { itemId: 'item-1', name: 'Sales' });
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/names/add',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { name: 'Sales', reference: '=Sheet1!$A$1:$C$4' },
			}),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/names/Sales/range',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('lists names on a worksheet and updates visibility', async () => {
		mockRequest.mockResolvedValue({ value: [] });
		await invoke(Names.list, { itemId: 'item-1', worksheet: 'Sheet1' });
		mockRequest.mockResolvedValue({ name: 'Sales', visible: false });
		await invoke(Names.update, {
			itemId: 'item-1',
			name: 'Sales',
			visible: false,
		});
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/names',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/names/Sales',
			'x_key_test',
			expect.objectContaining({
				method: 'PATCH',
				body: { visible: false },
			}),
		);
	});

	it('gets a chart, a named range, a comment, and its replies', async () => {
		mockRequest.mockResolvedValue({ id: '{chart}', name: 'Chart 1' });
		await invoke(Charts.get, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			chart: 'Chart 1',
		});
		mockRequest.mockResolvedValue({ name: 'Sales', type: 'Range' });
		await invoke(Names.get, {
			itemId: 'item-1',
			worksheet: 'Sheet1',
			name: 'Sales',
		});
		mockRequest.mockResolvedValue({ id: '{c1}', content: 'Hi' });
		await invoke(Comments.get, { itemId: 'item-1', comment: '{c1}' });
		mockRequest.mockResolvedValue({ value: [] });
		await invoke(Comments.listReplies, { itemId: 'item-1', comment: '{c1}' });
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/charts/Chart%201',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/worksheets/Sheet1/names/Sales',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/me/drive/items/item-1/workbook/comments/%7Bc1%7D',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			4,
			'/me/drive/items/item-1/workbook/comments/%7Bc1%7D/replies',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('lists comments and posts a reply', async () => {
		mockRequest.mockResolvedValue({ value: [{ id: '{c1}', content: 'Hi' }] });
		await invoke(Comments.list, { itemId: 'item-1' });
		mockRequest.mockResolvedValue({ id: '{r1}', content: 'Thanks' });
		await invoke(Comments.reply, {
			itemId: 'item-1',
			comment: '{c1}',
			content: 'Thanks',
			contentType: 'plain',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/me/drive/items/item-1/workbook/comments',
			'x_key_test',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/me/drive/items/item-1/workbook/comments/%7Bc1%7D/replies',
			'x_key_test',
			expect.objectContaining({
				method: 'POST',
				body: { content: 'Thanks', contentType: 'plain' },
			}),
		);
	});
});
