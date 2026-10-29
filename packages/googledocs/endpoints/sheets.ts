import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleRequest, SHEETS_API_BASE } from '../client';
import type { GoogleDocsEndpoints } from '../index';
import type { GoogleDocsEndpointOutputs } from './types';

/**
 * Read cell values from a spreadsheet via the Sheets API, using the googledocs
 * OAuth connection (spreadsheets.readonly scope).
 */
export const readValues: GoogleDocsEndpoints['readValues'] = async (
	ctx,
	input,
) => {
	const range = input.range ?? `${input.sheetName ?? 'Sheet1'}!A:Z`;

	const query: Record<string, string | undefined> = {
		valueRenderOption: input.valueRenderOption ?? 'FORMATTED_VALUE',
		dateTimeRenderOption: input.dateTimeRenderOption ?? 'FORMATTED_STRING',
	};
	if (input.majorDimension) {
		query.majorDimension = input.majorDimension;
	}

	const result = await makeAuthenticatedGoogleRequest<
		GoogleDocsEndpointOutputs['readValues']
	>(
		SHEETS_API_BASE,
		`/spreadsheets/${input.spreadsheetId}/values/${range}`,
		ctx,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'googledocs.sheets.readValues',
		{
			spreadsheetId: input.spreadsheetId,
			range: result.range ?? range,
		},
		'completed',
	);

	return result;
};

export const SheetsEndpoints = {
	readValues,
};
