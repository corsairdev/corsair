import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core/webhooks';
import { logEventFromContext } from '../../utils/events';
import type { GoogleSheetsContext } from '..';
import type {
	GoogleAppsScriptWebhookPayload,
	RowAddedEvent,
	RowUpdatedEvent,
	RowAddedOrUpdatedEvent,
} from './types';

export const rowAdded = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as GoogleAppsScriptWebhookPayload;
		return (
			body.eventType === 'rowAdded' ||
			(body.spreadsheetId !== undefined && body.values !== undefined)
		);
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleSheetsContext,
		request: WebhookRequest<GoogleAppsScriptWebhookPayload>,
	) => {
		const body = request.payload as GoogleAppsScriptWebhookPayload;

		if (!body.spreadsheetId || !body.values) {
			return {
				success: false,
				error: 'Missing required fields: spreadsheetId or values',
				data: { success: false },
			};
		}

		const values = Array.isArray(body.values[0])
			? body.values[0]
			: body.values;

		const event: RowAddedEvent = {
			type: 'rowAdded',
			spreadsheetId: body.spreadsheetId,
			sheetName: body.sheetName || 'Sheet1',
			range: body.range || 'A:Z',
			values: values as (string | number | boolean | null)[],
			timestamp: body.timestamp || new Date().toISOString(),
		};

		if (ctx.db.rows) {
			try {
				const rowId = `${body.spreadsheetId}_${body.sheetName}_${Date.now()}`;
				await ctx.db.rows.upsertByEntityId(rowId, {
					rowId,
					spreadsheetId: body.spreadsheetId,
					sheetName: body.sheetName || 'Sheet1',
					range: body.range || 'A:Z',
					values: values as (string | number | boolean | null)[],
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save row to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.webhook.rowAdded',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const rowUpdated = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as GoogleAppsScriptWebhookPayload;
		return body.eventType === 'rowUpdated';
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleSheetsContext,
		request: WebhookRequest<GoogleAppsScriptWebhookPayload>,
	) => {
		const body = request.payload as GoogleAppsScriptWebhookPayload;

		if (!body.spreadsheetId || !body.values) {
			return {
				success: false,
				error: 'Missing required fields: spreadsheetId or values',
				data: { success: false },
			};
		}

		const values = Array.isArray(body.values[0])
			? body.values[0]
			: body.values;

		const event: RowUpdatedEvent = {
			type: 'rowUpdated',
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
				console.warn('Failed to update row in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.webhook.rowUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const rowAddedOrUpdated = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as GoogleAppsScriptWebhookPayload;
		return (
			body.eventType === 'rowAddedOrUpdated' ||
			(body.spreadsheetId !== undefined && body.values !== undefined)
		);
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleSheetsContext,
		request: WebhookRequest<GoogleAppsScriptWebhookPayload>,
	) => {
		const body = request.payload as GoogleAppsScriptWebhookPayload;

		if (!body.spreadsheetId || !body.values) {
			return {
				success: false,
				error: 'Missing required fields: spreadsheetId or values',
				data: { success: false },
			};
		}

		const values = Array.isArray(body.values[0])
			? body.values[0]
			: body.values;

		const event: RowAddedOrUpdatedEvent = {
			type: 'rowAddedOrUpdated',
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
				console.warn('Failed to save/update row in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.webhook.rowAddedOrUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
