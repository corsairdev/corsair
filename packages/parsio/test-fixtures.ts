/**
 * Response fixtures shaped after the examples in the Parsio public API docs
 * (help.parsio.io/public-api).
 */

export const unauthorized = { statusCode: 401, message: 'Unauthorized' };

export const mailbox = {
	_id: 'mbx_1',
	name: 'Invoices',
	preset: 'invoice',
};

export const parsedDocument = {
	doc_id: 'DOC_ID',
	parsing_in_progress: false,
	status: 'parsed',
	name: 'receipt.pdf',
	content_type: 'application/pdf',
	created_at: '2026-04-02T12:00:00.000Z',
	processed_at: '2026-04-02T12:00:06.000Z',
	json: { field1: 'value1' },
};

export const parsingDocument = {
	doc_id: 'DOC_ID',
	parsing_in_progress: true,
	status: 'parsing',
	name: null,
	content_type: null,
	created_at: null,
	processed_at: null,
	json: null,
};

export const webhook = {
	_id: 'wh_1',
	name: 'To Sheets',
	url: 'https://example.com/webhooks/parsio',
	event: 'doc.parsed',
	enabled: true,
};

export const tableField = {
	name: 'line_items',
	type: 'table',
};

/** The base64 of "PDF" — enough to prove the multipart path. */
export const fileBase64 = Buffer.from('PDF').toString('base64');
