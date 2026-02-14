import { logEventFromContext } from '../../utils/events';
import type { GoogleSheetsEndpoints } from '..';
import { makeSheetsRequest } from '../client';
import type { ValueRange } from '../types';
import type { GoogleSheetsEndpointOutputs } from './types';

export const appendRow: GoogleSheetsEndpoints['sheetsAppendRow'] = async (
	ctx,
	input,
) => {
	const range = input.range || `${input.sheetName || 'Sheet1'}!A:Z`;
	const values = input.values ? [input.values] : [];

	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsAppendRow']
	>(`/spreadsheets/${input.spreadsheetId}/values/${range}:append`, ctx.key, {
		method: 'POST',
		query: {
			valueInputOption: input.valueInputOption || 'USER_ENTERED',
			insertDataOption: input.insertDataOption || 'INSERT_ROWS',
		},
		body: {
			values,
			majorDimension: 'ROWS',
		},
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.appendRow',
		{ ...input },
		'completed',
	);
	return result;
};

export const appendOrUpdateRow: GoogleSheetsEndpoints['sheetsAppendOrUpdateRow'] =
	async (ctx, input) => {
		const sheetName = input.sheetName || 'Sheet1';
		const keyColumn = input.keyColumn || 'A';
		const keyValue = input.keyValue;

		if (!keyValue) {
			throw new Error('keyValue is required for appendOrUpdateRow');
		}

		const getRange = `${sheetName}!${keyColumn}:${keyColumn}`;
		const existingRows = await makeSheetsRequest<ValueRange>(
			`/spreadsheets/${input.spreadsheetId}/values/${getRange}`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		let rowIndex = -1;
		if (existingRows.values) {
			for (let i = 0; i < existingRows.values.length; i++) {
				if (existingRows.values[i]?.[0] === String(keyValue)) {
					rowIndex = i;
					break;
				}
			}
		}

		const values = input.values ? [input.values] : [];
		const updateRange =
			rowIndex >= 0
				? `${sheetName}!${rowIndex + 1}:${rowIndex + 1}`
				: `${sheetName}!A:Z`;

		if (rowIndex >= 0) {
			const result = await makeSheetsRequest<
				GoogleSheetsEndpointOutputs['sheetsAppendOrUpdateRow']
			>(`/spreadsheets/${input.spreadsheetId}/values/${updateRange}`, ctx.key, {
				method: 'PUT',
				query: {
					valueInputOption: input.valueInputOption || 'USER_ENTERED',
				},
				body: {
					values,
					majorDimension: 'ROWS',
				},
			});

			await logEventFromContext(
				ctx,
				'googlesheets.sheets.appendOrUpdateRow',
				{ ...input, action: 'update' },
				'completed',
			);
			return result;
		} else {
			const result = await makeSheetsRequest<
				GoogleSheetsEndpointOutputs['sheetsAppendOrUpdateRow']
			>(
				`/spreadsheets/${input.spreadsheetId}/values/${updateRange}:append`,
				ctx.key,
				{
					method: 'POST',
					query: {
						valueInputOption: input.valueInputOption || 'USER_ENTERED',
						insertDataOption: input.insertDataOption || 'INSERT_ROWS',
					},
					body: {
						values,
						majorDimension: 'ROWS',
					},
				},
			);

			await logEventFromContext(
				ctx,
				'googlesheets.sheets.appendOrUpdateRow',
				{ ...input, action: 'append' },
				'completed',
			);
			return result;
		}
	};

export const getRows: GoogleSheetsEndpoints['sheetsGetRows'] = async (
	ctx,
	input,
) => {
	const range = input.range || `${input.sheetName || 'Sheet1'}!A:Z`;

	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsGetRows']
	>(`/spreadsheets/${input.spreadsheetId}/values/${range}`, ctx.key, {
		method: 'GET',
		query: {
			valueRenderOption: input.valueRenderOption || 'FORMATTED_VALUE',
			dateTimeRenderOption: input.dateTimeRenderOption || 'FORMATTED_STRING',
		},
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.getRows',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateRow: GoogleSheetsEndpoints['sheetsUpdateRow'] = async (
	ctx,
	input,
) => {
	const range =
		input.range ||
		`${input.sheetName || 'Sheet1'}!${input.rowIndex || 1}:${input.rowIndex || 1}`;
	const values = input.values ? [input.values] : [];

	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsUpdateRow']
	>(`/spreadsheets/${input.spreadsheetId}/values/${range}`, ctx.key, {
		method: 'PUT',
		query: {
			valueInputOption: input.valueInputOption || 'USER_ENTERED',
		},
		body: {
			values,
			majorDimension: 'ROWS',
		},
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.updateRow',
		{ ...input },
		'completed',
	);
	return result;
};

export const clearSheet: GoogleSheetsEndpoints['sheetsClearSheet'] = async (
	ctx,
	input,
) => {
	const range = input.range || input.sheetName || 'Sheet1';

	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsClearSheet']
	>(`/spreadsheets/${input.spreadsheetId}/values/${range}:clear`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.clearSheet',
		{ ...input },
		'completed',
	);
	return result;
};

export const createSheet: GoogleSheetsEndpoints['sheetsCreateSheet'] = async (
	ctx,
	input,
) => {
	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsCreateSheet']
	>(`/spreadsheets/${input.spreadsheetId}:batchUpdate`, ctx.key, {
		method: 'POST',
		body: {
			requests: [
				{
					addSheet: {
						properties: {
							title: input.title || 'Sheet1',
						},
					},
				},
			],
		},
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.createSheet',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSheet: GoogleSheetsEndpoints['sheetsDeleteSheet'] = async (
	ctx,
	input,
) => {
	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['sheetsDeleteSheet']
	>(`/spreadsheets/${input.spreadsheetId}:batchUpdate`, ctx.key, {
		method: 'POST',
		body: {
			requests: [
				{
					deleteSheet: {
						sheetId: input.sheetId,
					},
				},
			],
		},
	});

	await logEventFromContext(
		ctx,
		'googlesheets.sheets.deleteSheet',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteRowsOrColumns: GoogleSheetsEndpoints['sheetsDeleteRowsOrColumns'] =
	async (ctx, input) => {
		const dimension = input.dimension || 'ROWS';
		const startIndex = input.startIndex || 0;
		const endIndex = input.endIndex || startIndex + 1;

		const result = await makeSheetsRequest<
			GoogleSheetsEndpointOutputs['sheetsDeleteRowsOrColumns']
		>(`/spreadsheets/${input.spreadsheetId}:batchUpdate`, ctx.key, {
			method: 'POST',
			body: {
				requests: [
					{
						deleteDimension: {
							range: {
								sheetId: input.sheetId,
								dimension,
								startIndex,
								endIndex,
							},
						},
					},
				],
			},
		});

		await logEventFromContext(
			ctx,
			'googlesheets.sheets.deleteRowsOrColumns',
			{ ...input },
			'completed',
		);
		return result;
	};
