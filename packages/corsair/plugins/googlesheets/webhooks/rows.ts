import { logEventFromContext } from '../../utils/events';
import type { GoogleSheetsWebhooks } from '..';
import { createGoogleSheetsWebhookMatcher } from './types';

export const rangeUpdated: GoogleSheetsWebhooks['rangeUpdated'] = {
	match: createGoogleSheetsWebhookMatcher('rangeUpdated'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.spreadsheetId || !body.values) {
			return {
				success: false,
				error: 'Missing required fields: spreadsheetId or values',
			};
		}

		const event = {
			eventType: 'rangeUpdated' as const,
			spreadsheetId: body.spreadsheetId,
			sheetName: body.sheetName || 'Sheet1',
			range: body.range || 'A:Z',
			values: body.values,
			timestamp: body.timestamp || new Date().toISOString(),
		};

		if (ctx.db.rows) {
			try {
				const rowId = `${body.spreadsheetId}_${body.sheetName}_${body.range || 'A:Z'}`;
				await ctx.db.rows.upsertByEntityId(rowId, {
					rowId,
					spreadsheetId: body.spreadsheetId,
					sheetName: body.sheetName || 'Sheet1',
					range: body.range || 'A:Z',
					values: body.values,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save/update range in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.webhook.rangeUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
