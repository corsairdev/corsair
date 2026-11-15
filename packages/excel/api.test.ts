import { makeExcelRequest } from './client';
import { worksheetListSchema } from './endpoints/types';

const TEST_API_KEY = process.env.EXCEL_ACCESS_TOKEN ?? '';
const TEST_ITEM_ID = process.env.EXCEL_ITEM_ID ?? '';
const describeIfApiKey =
	TEST_API_KEY && TEST_ITEM_ID ? describe : describe.skip;

describeIfApiKey('Excel live API', () => {
	jest.setTimeout(180_000);

	it('lists worksheets on an existing workbook', async () => {
		const listed = worksheetListSchema.parse(
			await makeExcelRequest(
				`/me/drive/items/${encodeURIComponent(TEST_ITEM_ID)}/workbook/worksheets`,
				TEST_API_KEY,
			),
		);
		expect(Array.isArray(listed.value)).toBe(true);
	});

	it('reads the used range of the first worksheet when one exists', async () => {
		const listed = worksheetListSchema.parse(
			await makeExcelRequest(
				`/me/drive/items/${encodeURIComponent(TEST_ITEM_ID)}/workbook/worksheets`,
				TEST_API_KEY,
			),
		);
		const first = listed.value[0];
		if (first === undefined) {
			return;
		}
		const used = await makeExcelRequest(
			`/me/drive/items/${encodeURIComponent(TEST_ITEM_ID)}/workbook/worksheets/${encodeURIComponent(first.id)}/usedRange(valuesOnly=true)`,
			TEST_API_KEY,
		);
		expect(used).toBeDefined();
	});
});
