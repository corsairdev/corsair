import { logEventFromContext } from '../../utils/events';
import type { GoogleSheetsWebhooks } from '..';
import type { RangeUpdatedEvent } from './types';
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

		const values = Array.isArray(body.values[0]) ? body.values[0] : body.values;

		const event: RangeUpdatedEvent = {
			type: 'rangeUpdated',
			spreadsheetId: body.spreadsheetId,
			sheetName: body.sheetName || 'Sheet1',
			range: body.range || 'A:Z',
			values: values as (string | number | boolean | null)[],
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
					values: values as (string | number | boolean | null)[],
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
