import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from '../../../core/webhooks';

export type GoogleAppsScriptWebhookPayload<TEvent = unknown> = {
	spreadsheetId?: string;
	sheetName?: string;
	range?: string;
	values?: (string | number | boolean | null)[];
	eventType?: 'rangeUpdated';
	timestamp?: string;
	event?: TEvent;
};

export type RangeUpdatedEvent = {
	eventType: 'rangeUpdated';
	spreadsheetId: string;
	sheetName: string;
	range: string;
	values: (string | number | boolean | null)[];
	timestamp: string;
};

export type GoogleSheetsWebhookEvent = RangeUpdatedEvent;

export type GoogleSheetsEventName = 'rangeUpdated';

export interface GoogleSheetsEventMap {
	rangeUpdated: RangeUpdatedEvent;
}

export type GoogleSheetsWebhookPayload<TEvent = unknown> = GoogleAppsScriptWebhookPayload<TEvent>;

export type GoogleSheetsWebhookOutputs = {
	rangeUpdated: RangeUpdatedEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}
export function createGoogleSheetsWebhookMatcher(
	eventType: GoogleSheetsEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body) as Record<string, unknown>;
		return body.eventType === eventType;
	};
}
