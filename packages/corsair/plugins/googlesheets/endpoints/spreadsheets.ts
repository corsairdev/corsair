import { logEventFromContext } from '../../utils/events';
import type { GoogleSheetsEndpoints } from '..';
import { makeSheetsRequest } from '../client';
import type { GoogleSheetsEndpointOutputs } from './types';

export const create: GoogleSheetsEndpoints['spreadsheetsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeSheetsRequest<
		GoogleSheetsEndpointOutputs['spreadsheetsCreate']
	>('/spreadsheets', ctx.key, {
		method: 'POST',
		body: {
			properties: input.properties,
		},
	});

	if (result.spreadsheetId && ctx.db.spreadsheets) {
		try {
			await ctx.db.spreadsheets.upsertByEntityId(result.spreadsheetId, {
				spreadsheetId: result.spreadsheetId,
				title: result.properties?.title,
				spreadsheetUrl: result.spreadsheetUrl,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save spreadsheet to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlesheets.spreadsheets.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSpreadsheet: GoogleSheetsEndpoints['spreadsheetsDelete'] =
	async (ctx, input) => {
		const response = await fetch(
			`https://www.googleapis.com/drive/v3/files/${input.spreadsheetId}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${ctx.key}`,
				},
			},
		);

		if (!response.ok && response.status !== 404) {
			const errorText = await response.text();
			throw new Error(
				`Failed to delete spreadsheet: ${response.status} ${errorText}`,
			);
		}

		if (ctx.db.spreadsheets) {
			try {
				await ctx.db.spreadsheets.deleteByEntityId(input.spreadsheetId);
			} catch (error) {
				console.warn('Failed to delete spreadsheet from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.spreadsheets.delete',
			{ ...input },
			'completed',
		);
	};
