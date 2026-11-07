import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { webhookEvent } from './test-fixtures';
import {
	createHappyScribeMatch,
	HAPPYSCRIBE_SIGNATURE_MAX_AGE_SECONDS,
	matchOtherEvent,
	verifyHappyScribeWebhook,
} from './webhooks/types';

const SECRET = 'whsec_test_secret_string';

const rawBody = JSON.stringify(webhookEvent);

function request(
	headers: Record<string, string>,
	body: string = rawBody,
): WebhookRequest<unknown> & RawWebhookRequest {
	// rawBody is the exact bytes HappyScribe signed; the mutated variant
	// exercises the re-serialization rejection.
	return { headers, rawBody: body, body: webhookEvent, payload: webhookEvent };
}

function sign(input: string): string {
	return createHmac('sha256', SECRET).update(input).digest('hex');
}

function stamped(secondsAgo = 0): string {
	return `t=${Math.floor(Date.now() / 1000) - secondsAgo},v1=${sign(
		`${Math.floor(Date.now() / 1000) - secondsAgo}.${rawBody}`,
	)}`;
}

beforeEach(() => {
	jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('verifyHappyScribeWebhook', () => {
	it('accepts both valid signatures', () => {
		const result = verifyHappyScribeWebhook(
			request({
				'x-webhook-signature': `sha256=${sign(rawBody)}`,
				'x-happyscribe-signature': stamped(),
			}),
			SECRET,
		);
		expect(result.valid).toBe(true);
	});

	it('accepts hub-verified deliveries without signatures', () => {
		const result = verifyHappyScribeWebhook(
			{ ...request({}), hubVerified: true },
			SECRET,
		);
		expect(result.valid).toBe(true);
	});

	// The plain signature covers only the body and carries no timestamp, so
	// a delivery accepted on it alone could be replayed forever.
	it('rejects a delivery with only the plain signature', () => {
		const result = verifyHappyScribeWebhook(
			request({ 'x-webhook-signature': `sha256=${sign(rawBody)}` }),
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing');
	});

	it('rejects a delivery with only the stamped signature', () => {
		const result = verifyHappyScribeWebhook(
			request({ 'x-happyscribe-signature': stamped() }),
			SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('rejects a body that was re-serialized', () => {
		const mutated = JSON.stringify({ ...webhookEvent, created_at: 'nope' });
		const result = verifyHappyScribeWebhook(
			request(
				{
					'x-webhook-signature': `sha256=${sign(rawBody)}`,
					'x-happyscribe-signature': stamped(),
				},
				mutated,
			),
			SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('rejects a stale timestamp-bound signature', () => {
		const result = verifyHappyScribeWebhook(
			request({
				'x-webhook-signature': `sha256=${sign(rawBody)}`,
				'x-happyscribe-signature': stamped(
					HAPPYSCRIBE_SIGNATURE_MAX_AGE_SECONDS + 10,
				),
			}),
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Stale');
	});

	it('rejects a wrong secret', () => {
		const result = verifyHappyScribeWebhook(
			request({
				'x-webhook-signature': `sha256=${sign(rawBody)}`,
				'x-happyscribe-signature': stamped(),
			}),
			'whsec_other',
		);
		expect(result.valid).toBe(false);
	});

	it('rejects unsigned deliveries and missing secrets', () => {
		const unsigned = verifyHappyScribeWebhook(request({}), SECRET);
		expect(unsigned.valid).toBe(false);
		expect(unsigned.error).toContain('Missing');

		const unconfigured = verifyHappyScribeWebhook(request({}), undefined);
		expect(unconfigured.valid).toBe(false);
		expect(unconfigured.error).toContain(
			'No HappyScribe webhook signing secret',
		);
	});
});

describe('event matching', () => {
	it('matches deliveries by header first, then body type', () => {
		expect(
			createHappyScribeMatch('summaryReady')(
				request({ 'x-happyscribe-event': 'meeting.summary_ready' }),
			),
		).toBe(true);
		expect(
			createHappyScribeMatch('summaryReady')(
				request({ 'x-happyscribe-event': 'meeting.failed' }),
			),
		).toBe(false);
		expect(createHappyScribeMatch('summaryReady')(request({}))).toBe(true);
	});

	it('routes unknown event types to the other handler', () => {
		expect(
			matchOtherEvent(
				request({ 'x-happyscribe-event': 'meeting.something_new' }),
			),
		).toBe(true);
		expect(
			matchOtherEvent(request({ 'x-happyscribe-event': 'meeting.failed' })),
		).toBe(false);
	});
});
