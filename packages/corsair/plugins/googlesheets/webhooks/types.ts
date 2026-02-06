import type { ValueRange } from '../types';

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
