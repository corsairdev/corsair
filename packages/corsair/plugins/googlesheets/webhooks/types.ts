import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from '../../../core/webhooks';

export type GoogleAppsScriptWebhookPayload = {
	spreadsheetId?: string;
	sheetName?: string;
	range?: string;
	values?: (string | number | boolean | null)[][];
	eventType?: 'rowAdded' | 'rowUpdated' | 'rowAddedOrUpdated';
	timestamp?: string;
};

export type RowAddedEvent = {
	type: 'rowAdded';
	spreadsheetId: string;
	sheetName: string;
	range: string;
	values: (string | number | boolean | null)[];
	timestamp: string;
};

export type RowUpdatedEvent = {
	type: 'rowUpdated';
	spreadsheetId: string;
	sheetName: string;
	range: string;
	values: (string | number | boolean | null)[];
	timestamp: string;
};

export type RowAddedOrUpdatedEvent = {
	type: 'rowAddedOrUpdated';
	spreadsheetId: string;
	sheetName: string;
	range: string;
	values: (string | number | boolean | null)[];
	timestamp: string;
};

export type GoogleSheetsWebhookEvent =
	| RowAddedEvent
	| RowUpdatedEvent
	| RowAddedOrUpdatedEvent;

export type GoogleSheetsEventName =
	| 'rowAdded'
	| 'rowUpdated'
	| 'rowAddedOrUpdated';

export interface GoogleSheetsEventMap {
	rowAdded: RowAddedEvent;
	rowUpdated: RowUpdatedEvent;
	rowAddedOrUpdated: RowAddedOrUpdatedEvent;
}

export type GoogleSheetsWebhookPayload = GoogleAppsScriptWebhookPayload;

export type GoogleSheetsWebhookOutputs = {
	rowAdded: RowAddedEvent;
	rowUpdated: RowUpdatedEvent;
	rowAddedOrUpdated: RowAddedOrUpdatedEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}
export function createGoogleSheetsWebhookMatcher(
	eventType: GoogleSheetsEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body) as Record<string, unknown>;
		return (
			body.eventType === eventType ||
			(body.spreadsheetId !== undefined && body.values !== undefined)
		);
	};
}
