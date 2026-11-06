import {
	ChartsAddInputSchema,
	emptyOutputSchema,
	FilesCreateInputSchema,
	FilesFindInputSchema,
	functionResultSchema,
	RangesClearInputSchema,
	RangesUpdateInputSchema,
	rangeSchema,
	SessionsCloseInputSchema,
	SessionsCreateInputSchema,
	WorksheetsAddInputSchema,
	worksheetListSchema,
} from './endpoints/types';

const target = { itemId: 'item-1' };

describe('excel endpoint schemas', () => {
	it('accepts a 31-character worksheet name and rejects 32', () => {
		const name = 'a'.repeat(31);
		expect(WorksheetsAddInputSchema.parse({ ...target, name })).toMatchObject({
			name,
		});
		expect(() =>
			WorksheetsAddInputSchema.parse({ ...target, name: `${name}b` }),
		).toThrow();
	});

	it('rejects a worksheet name with a slash', () => {
		expect(() =>
			WorksheetsAddInputSchema.parse({ ...target, name: 'A/B' }),
		).toThrow();
	});

	it('accepts All and rejects an unknown clear mode', () => {
		expect(
			RangesClearInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A1',
				applyTo: 'All',
			}).applyTo,
		).toBe('All');
		expect(() =>
			RangesClearInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A1',
				applyTo: 'Nope',
			}),
		).toThrow();
	});

	it('rejects a range update with no values, formulas, or number formats', () => {
		expect(() =>
			RangesUpdateInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A1',
			}),
		).toThrow('values, formulas, or numberFormat');
	});

	it('accepts a formula grid that leaves some cells unchanged', () => {
		expect(
			RangesUpdateInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A1:B2',
				formulas: [
					[null, null],
					[null, '=B1*2'],
				],
			}).formulas,
		).toEqual([
			[null, null],
			[null, '=B1*2'],
		]);
	});

	it('accepts a single-cell fill value', () => {
		expect(
			RangesUpdateInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A1:B100',
				values: 'Sample text',
			}).values,
		).toBe('Sample text');
	});

	it('rejects a row number of 0 and an 8-digit row', () => {
		expect(() =>
			RangesUpdateInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A0',
				values: 1,
			}),
		).toThrow();
		expect(() =>
			RangesUpdateInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				address: 'A10000000',
				values: 1,
			}),
		).toThrow();
	});

	it('requires a session id to close a session', () => {
		expect(() => SessionsCloseInputSchema.parse(target)).toThrow(
			'sessionId is required',
		);
		expect(
			SessionsCreateInputSchema.parse({ ...target, persistChanges: false })
				.persistChanges,
		).toBe(false);
	});

	it('rejects an xls path', () => {
		expect(() => FilesCreateInputSchema.parse({ path: 'Book.xls' })).toThrow();
		expect(FilesCreateInputSchema.parse({ path: 'Book.xlsx' }).path).toBe(
			'Book.xlsx',
		);
	});

	it('parses an empty worksheet list and a 204 body', () => {
		expect(worksheetListSchema.parse({ value: [] }).value).toEqual([]);
		expect(emptyOutputSchema.parse(undefined)).toEqual({});
		expect(emptyOutputSchema.parse(null)).toEqual({});
	});

	it('rejects an unknown chart series layout and a quote in a file search', () => {
		expect(() =>
			ChartsAddInputSchema.parse({
				...target,
				worksheet: 'Sheet1',
				type: 'ColumnClustered',
				sourceData: 'A1:C4',
				seriesBy: 'Diagonal',
			}),
		).toThrow();
		expect(() => FilesFindInputSchema.parse({ query: "O'Brien" })).toThrow();
		expect(FilesFindInputSchema.parse({ query: 'Budget' }).query).toBe(
			'Budget',
		);
		expect(() => FilesFindInputSchema.parse({})).toThrow(
			'Provide query or nextLink',
		);
		expect(
			FilesFindInputSchema.parse({
				nextLink:
					"https://graph.microsoft.com/v1.0/me/drive/root/search(q='Budget')?$skiptoken=2",
			}).nextLink,
		).toContain('skiptoken=2');
		expect(() =>
			FilesFindInputSchema.parse({ nextLink: 'https://example.com/search' }),
		).toThrow();
	});
	it('parses a range and a function result', () => {
		expect(
			rangeSchema.parse({
				address: 'Sheet1!A1',
				values: [['']],
			}).address,
		).toBe('Sheet1!A1');
		expect(functionResultSchema.parse({ error: null, value: 3 }).value).toBe(3);
	});
});
