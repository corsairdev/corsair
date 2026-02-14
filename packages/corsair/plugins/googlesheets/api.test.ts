import dotenv from 'dotenv';
import { makeSheetsRequest } from './client';
import { GoogleSheetsEndpointOutputSchemas } from './endpoints/types';
import type {
	BatchUpdateSpreadsheetResponse,
	BatchUpdateValuesResponse,
	ClearValuesResponse,
	Spreadsheet,
	ValueRange,
} from './types';

dotenv.config();

const TEST_TOKEN = process.env.GOOGLE_ACCESS_TOKEN!;
const TEST_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_TEST_SPREADSHEET_ID;

async function listSpreadsheets(accessToken: string): Promise<string | null> {
	try {
		const response = await fetch(
			'https://www.googleapis.com/drive/v3/files?' +
				new URLSearchParams({
					q: "mimeType='application/vnd.google-apps.spreadsheet'",
					pageSize: '1',
					fields: 'files(id)',
					orderBy: 'modifiedTime desc',
				}).toString(),
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		if (data.files && data.files.length > 0 && data.files[0]?.id) {
			return data.files[0].id;
		}
		return null;
	} catch (error) {
		return null;
	}
}

async function deleteSpreadsheetViaDrive(
	spreadsheetId: string,
	accessToken: string,
): Promise<void> {
	await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

async function getOrCreateTestSpreadsheet(
	accessToken: string,
): Promise<string> {
	if (TEST_SPREADSHEET_ID) {
		return TEST_SPREADSHEET_ID;
	}

	const existingSpreadsheetId = await listSpreadsheets(accessToken);
	if (existingSpreadsheetId) {
		return existingSpreadsheetId;
	}

	const response = await makeSheetsRequest<Spreadsheet>(
		'/spreadsheets',
		accessToken,
		{
			method: 'POST',
			body: {
				properties: {
					title: `Test Spreadsheet ${Date.now()}`,
				},
			},
		},
	);

	if (!response.spreadsheetId) {
		throw new Error('Failed to create test spreadsheet');
	}

	return response.spreadsheetId;
}

describe('Google Sheets API Type Tests', () => {
	describe('spreadsheets', () => {
		it('spreadsheetsCreate returns correct type', async () => {
			const response = await makeSheetsRequest<Spreadsheet>(
				'/spreadsheets',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							title: `Test Spreadsheet ${Date.now()}`,
						},
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.spreadsheetsCreate.parse(result);

			if (result.spreadsheetId) {
				await deleteSpreadsheetViaDrive(result.spreadsheetId, TEST_TOKEN);
			}
		});

		it('spreadsheetsDelete returns correct type', async () => {
			const createResponse = await makeSheetsRequest<Spreadsheet>(
				'/spreadsheets',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						properties: {
							title: `Test Spreadsheet for Delete ${Date.now()}`,
						},
					},
				},
			);

			if (!createResponse.spreadsheetId) {
				throw new Error('Failed to create test spreadsheet');
			}

			await deleteSpreadsheetViaDrive(createResponse.spreadsheetId, TEST_TOKEN);
		});
	});

	describe('sheets', () => {
		let testSpreadsheetId: string;
		let testSheetName: string;
		let createdSpreadsheet = false;

		beforeAll(async () => {
			testSpreadsheetId = await getOrCreateTestSpreadsheet(TEST_TOKEN);
			if (!TEST_SPREADSHEET_ID) {
				createdSpreadsheet = true;
			}

			const spreadsheetInfo = await makeSheetsRequest<Spreadsheet>(
				`/spreadsheets/${testSpreadsheetId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);

			testSheetName =
				spreadsheetInfo.sheets?.[0]?.properties?.title || 'Sheet1';
		});

		afterAll(async () => {
			if (createdSpreadsheet && testSpreadsheetId) {
				try {
					await deleteSpreadsheetViaDrive(testSpreadsheetId, TEST_TOKEN);
				} catch (error) {
					console.warn('Failed to cleanup test spreadsheet:', error);
				}
			}
		});

		it('sheetsAppendRow returns correct type', async () => {
			try {
				const response = await makeSheetsRequest<BatchUpdateValuesResponse>(
					`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
					TEST_TOKEN,
					{
						method: 'POST',
						query: {
							valueInputOption: 'USER_ENTERED',
							insertDataOption: 'INSERT_ROWS',
						},
						body: {
							values: [['Test', 'Row', Date.now()]],
							majorDimension: 'ROWS',
						},
					},
				);
				const result = response;

				GoogleSheetsEndpointOutputSchemas.sheetsAppendRow.parse(result);
			} catch (error: any) {
				console.error('AppendRow Error Details:', {
					url: error.url,
					status: error.status,
					body: error.body,
				});
				throw error;
			}
		});

		it('sheetsAppendOrUpdateRow returns correct type', async () => {
			const keyValue = `key-${Date.now()}`;
			const testValues = [keyValue, 'Test', 'Value'];

			await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
				TEST_TOKEN,
				{
					method: 'POST',
					query: {
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'INSERT_ROWS',
					},
					body: {
						values: [testValues],
						majorDimension: 'ROWS',
					},
				},
			);

			const response = await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A1:C1')}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					query: {
						valueInputOption: 'USER_ENTERED',
					},
					body: {
						values: [[keyValue, 'Updated', 'Value']],
						majorDimension: 'ROWS',
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsAppendOrUpdateRow.parse(result);
		});

		it('sheetsGetRows returns correct type', async () => {
			await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
				TEST_TOKEN,
				{
					method: 'POST',
					query: {
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'INSERT_ROWS',
					},
					body: {
						values: [['Get', 'Rows', 'Test']],
						majorDimension: 'ROWS',
					},
				},
			);

			const response = await makeSheetsRequest<ValueRange>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}`,
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						valueRenderOption: 'FORMATTED_VALUE',
						dateTimeRenderOption: 'FORMATTED_STRING',
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsGetRows.parse(result);
		});

		it('sheetsUpdateRow returns correct type', async () => {
			await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
				TEST_TOKEN,
				{
					method: 'POST',
					query: {
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'INSERT_ROWS',
					},
					body: {
						values: [['Update', 'Row', 'Test']],
						majorDimension: 'ROWS',
					},
				},
			);

			const response = await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A1:C1')}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					query: {
						valueInputOption: 'USER_ENTERED',
					},
					body: {
						values: [['Updated', 'Row', 'Value']],
						majorDimension: 'ROWS',
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsUpdateRow.parse(result);
		});

		it('sheetsClearSheet returns correct type', async () => {
			await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
				TEST_TOKEN,
				{
					method: 'POST',
					query: {
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'INSERT_ROWS',
					},
					body: {
						values: [['Clear', 'Sheet', 'Test']],
						majorDimension: 'ROWS',
					},
				},
			);

			const response = await makeSheetsRequest<ClearValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName)}:clear`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsClearSheet.parse(result);
		});

		it('sheetsCreateSheet returns correct type', async () => {
			const response = await makeSheetsRequest<BatchUpdateSpreadsheetResponse>(
				`/spreadsheets/${testSpreadsheetId}:batchUpdate`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						requests: [
							{
								addSheet: {
									properties: {
										title: `Test Sheet ${Date.now()}`,
									},
								},
							},
						],
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsCreateSheet.parse(result);

			const sheetId = result.replies?.[0]?.addSheet?.properties?.sheetId;
			if (sheetId) {
				await makeSheetsRequest<BatchUpdateSpreadsheetResponse>(
					`/spreadsheets/${testSpreadsheetId}:batchUpdate`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							requests: [
								{
									deleteSheet: {
										sheetId,
									},
								},
							],
						},
					},
				);
			}
		});

		it('sheetsDeleteSheet returns correct type', async () => {
			const createResponse =
				await makeSheetsRequest<BatchUpdateSpreadsheetResponse>(
					`/spreadsheets/${testSpreadsheetId}:batchUpdate`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							requests: [
								{
									addSheet: {
										properties: {
											title: `Test Sheet for Delete ${Date.now()}`,
										},
									},
								},
							],
						},
					},
				);

			const sheetId =
				createResponse.replies?.[0]?.addSheet?.properties?.sheetId;
			if (!sheetId) {
				throw new Error('Failed to create test sheet');
			}

			const response = await makeSheetsRequest<BatchUpdateSpreadsheetResponse>(
				`/spreadsheets/${testSpreadsheetId}:batchUpdate`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						requests: [
							{
								deleteSheet: {
									sheetId,
								},
							},
						],
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsDeleteSheet.parse(result);
		});

		it('sheetsDeleteRowsOrColumns returns correct type', async () => {
			const getResponse = await makeSheetsRequest<Spreadsheet>(
				`/spreadsheets/${testSpreadsheetId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);

			const sheetId = getResponse.sheets?.find(
				(sheet) => sheet.properties?.title === testSheetName,
			)?.properties?.sheetId;
			if (!sheetId) {
				throw new Error('No sheet found');
			}

			await makeSheetsRequest<BatchUpdateValuesResponse>(
				`/spreadsheets/${testSpreadsheetId}/values/${encodeURIComponent(testSheetName + '!A:Z')}:append`,
				TEST_TOKEN,
				{
					method: 'POST',
					query: {
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'INSERT_ROWS',
					},
					body: {
						values: [['Delete', 'Row', 'Test']],
						majorDimension: 'ROWS',
					},
				},
			);

			const response = await makeSheetsRequest<BatchUpdateSpreadsheetResponse>(
				`/spreadsheets/${testSpreadsheetId}:batchUpdate`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						requests: [
							{
								deleteDimension: {
									range: {
										sheetId,
										dimension: 'ROWS',
										startIndex: 1,
										endIndex: 2,
									},
								},
							},
						],
					},
				},
			);
			const result = response;

			GoogleSheetsEndpointOutputSchemas.sheetsDeleteRowsOrColumns.parse(result);
		});
	});
});
