import { createHmac } from 'node:crypto';
import { parsedDocument } from './test-fixtures';
import { event } from './webhooks';
import {
	matchParsioWebhook,
	PARSIO_SIGNATURE_HEADER,
	ParsioWebhookPayloadSchema,
	verifyParsioWebhook,
} from './webhooks/types';

const SECRET = 'whsec_test_secret';

function sign(body: string, key: string): string {
	return createHmac('sha256', key).update(body).digest('base64');
}

function rawRequest(
	// unknown: the delivery body is untyped until the payload schema parses
	// it; the fixture passes provider-shaped objects through.
	body: unknown,
	signature?: string,
) {
	const rawBody = JSON.stringify(body);
	return {
		headers:
			signature === undefined ? {} : { [PARSIO_SIGNATURE_HEADER]: signature },
		payload: body,
		body,
		rawBody,
	};
}

// unknown: the handler reads fields the webhook fixture does not carry.
function webhookContext(secret: string | undefined) {
	return { key: secret } as never;
}

describe('verifyParsioWebhook', () => {
	it('accepts a delivery signed with the webhook secret', () => {
		const raw = rawRequest(
			parsedDocument,
			sign(JSON.stringify(parsedDocument), SECRET),
		);
		expect(verifyParsioWebhook(raw as never, SECRET)).toEqual({ valid: true });
	});

	it('rejects a signature from another secret', () => {
		const raw = rawRequest(
			parsedDocument,
			sign(JSON.stringify(parsedDocument), 'whsec_other'),
		);
		const result = verifyParsioWebhook(raw as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery without the signature header', () => {
		const result = verifyParsioWebhook(
			rawRequest(parsedDocument) as never,
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain(PARSIO_SIGNATURE_HEADER);
	});

	it('rejects when no secret is configured', () => {
		const raw = rawRequest(
			parsedDocument,
			sign(JSON.stringify(parsedDocument), SECRET),
		);
		const result = verifyParsioWebhook(raw as never, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('keys.set_webhook_signature');
	});

	it('rejects when the raw body was not captured', () => {
		const request = {
			headers: { [PARSIO_SIGNATURE_HEADER]: sign('other', SECRET) },
			body: parsedDocument,
			rawBody: undefined,
		};
		const result = verifyParsioWebhook(request as never, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('not captured');
	});

	it('accepts a hub-verified delivery without a signature', () => {
		const request = { headers: {}, body: parsedDocument, hubVerified: true };
		expect(verifyParsioWebhook(request as never, undefined)).toEqual({
			valid: true,
		});
	});
});

describe('matchParsioWebhook', () => {
	it('matches the documented document envelope', () => {
		expect(matchParsioWebhook(rawRequest(parsedDocument) as never)).toBe(true);
	});

	it('does not match bodies without doc_id, or arrays', () => {
		expect(matchParsioWebhook(rawRequest({ status: 'parsed' }) as never)).toBe(
			false,
		);
		expect(matchParsioWebhook(rawRequest([parsedDocument]) as never)).toBe(
			false,
		);
		expect(matchParsioWebhook(rawRequest('plain') as never)).toBe(false);
	});
});

describe('ParsioWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = ParsioWebhookPayloadSchema.parse(parsedDocument);
		expect(parsed.doc_id).toBe('DOC_ID');
		expect(parsed.status).toBe('parsed');
	});

	it('rejects a delivery without doc_id or status', () => {
		expect(() => ParsioWebhookPayloadSchema.parse({ json: {} })).toThrow();
	});
});

describe('parsio.event handler', () => {
	it('returns a 401 refusal for an unverified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(parsedDocument, 'bad-signature') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a body the payload schema rejects', async () => {
		const body = { json: {} };
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(body, sign(JSON.stringify(body), SECRET)) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed document for a verified delivery', async () => {
		const result = await event.handler(
			webhookContext(SECRET),
			rawRequest(
				parsedDocument,
				sign(JSON.stringify(parsedDocument), SECRET),
			) as never,
		);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed document object.
		const data = (result as { data?: { doc_id?: string } }).data;
		expect(data?.doc_id).toBe('DOC_ID');
	});
});
