import { createHmac } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { stannpWebhooksNested } from './index';
import {
	campaignStatusPayload,
	mailpieceStatusPayload,
	recipientEventsPayload,
	webhookValidation,
} from './test-fixtures';
import {
	campaignStatus,
	mailpieceStatus,
	recipientEvents,
	testUrl,
} from './webhooks';
import {
	matchStannpWebhook,
	STANNP_SIGNATURE_HEADER,
	verifyStannpWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const SECRET = 'wh-s3cret';

// unknown: each caller passes a different documented payload object.
function rawBody(payload: unknown) {
	return JSON.stringify(payload);
}

// unknown: same payload-per-caller shape as rawBody above.
function signature(
	payload: unknown,
	secret: string,
	format: 'hex' | 'base64' = 'hex',
) {
	const digest = createHmac('sha256', secret).update(rawBody(payload));
	return format === 'hex' ? digest.digest('hex') : digest.digest('base64');
}

// unknown: the delivery payload is whatever the test feeds the handler.
function request(
	payload: unknown,
	headers: Record<string, string | string[]> = {},
) {
	return {
		payload,
		headers,
		rawBody: rawBody(payload),
	};
}

// unknown: the handler context only carries what the handlers read (ctx.key).
function ctx(secret: string | undefined) {
	return { key: secret ?? '' } as never;
}

beforeEach(() => {
	mockLog.mockClear();
});

describe('verifyStannpWebhook', () => {
	it('accepts a correct hex signature', () => {
		const delivered = request(mailpieceStatusPayload, {
			[STANNP_SIGNATURE_HEADER]: signature(mailpieceStatusPayload, SECRET),
		});
		expect(verifyStannpWebhook(delivered, SECRET).valid).toBe(true);
	});

	it('accepts a correct base64 signature case-insensitively in hex', () => {
		const delivered = request(mailpieceStatusPayload, {
			[STANNP_SIGNATURE_HEADER]: signature(
				mailpieceStatusPayload,
				SECRET,
				'base64',
			),
		});
		expect(verifyStannpWebhook(delivered, SECRET).valid).toBe(true);
	});

	it('rejects a signature made with the wrong secret', () => {
		const delivered = request(mailpieceStatusPayload, {
			[STANNP_SIGNATURE_HEADER]: signature(mailpieceStatusPayload, 'other'),
		});
		const verification = verifyStannpWebhook(delivered, SECRET);
		expect(verification.valid).toBe(false);
		expect(verification.error).toBe('Invalid webhook signature');
	});

	it('rejects a tampered body', () => {
		const delivered = request(mailpieceStatusPayload, {
			[STANNP_SIGNATURE_HEADER]: signature(
				{ ...mailpieceStatusPayload, webhook_id: 9999 },
				SECRET,
			),
		});
		expect(verifyStannpWebhook(delivered, SECRET).valid).toBe(false);
	});

	it('rejects a missing signature header when a secret is configured', () => {
		const verification = verifyStannpWebhook(
			request(mailpieceStatusPayload),
			SECRET,
		);
		expect(verification.valid).toBe(false);
		expect(verification.error).toContain(STANNP_SIGNATURE_HEADER);
	});

	it('accepts unsigned deliveries when no secret is configured, matching optional signing', () => {
		expect(
			verifyStannpWebhook(request(mailpieceStatusPayload), undefined).valid,
		).toBe(true);
		expect(
			verifyStannpWebhook(request(mailpieceStatusPayload), '  ').valid,
		).toBe(true);
	});
});

describe('matchStannpWebhook', () => {
	it('matches a delivery carrying an event name and a webhook id', () => {
		// processWebhook parses string bodies before any matcher runs, so the
		// body arrives as an object.
		expect(
			matchStannpWebhook({
				body: mailpieceStatusPayload,
				headers: {},
			} as never),
		).toBe(true);
	});

	it('rejects bodies without the Stannp shape', () => {
		expect(matchStannpWebhook({ body: { foo: 1 }, headers: {} } as never)).toBe(
			false,
		);
		expect(matchStannpWebhook({ body: null, headers: {} } as never)).toBe(
			false,
		);
	});
});

describe('webhook handlers', () => {
	it.each([
		['webhooks.testUrl', testUrl, webhookValidation],
		['mailpieces.status', mailpieceStatus, mailpieceStatusPayload],
		['campaigns.status', campaignStatus, campaignStatusPayload],
		['events.created', recipientEvents, recipientEventsPayload],
	])('%s parses and returns the payload', async (_path, hook, payload) => {
		const result = await hook.handler(
			ctx(SECRET),
			request(payload, {
				[STANNP_SIGNATURE_HEADER]: signature(payload, SECRET),
			}) as never,
		);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
		expect(mockLog).toHaveBeenCalled();
	});

	it('refuses a bad signature with 401 before parsing', async () => {
		const result = await mailpieceStatus.handler(
			ctx(SECRET),
			request(mailpieceStatusPayload, {
				[STANNP_SIGNATURE_HEADER]: 'nope',
			}) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('refuses an unsigned delivery when a secret is configured', async () => {
		const result = await mailpieceStatus.handler(
			ctx(SECRET),
			request(mailpieceStatusPayload) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('answers the creation handshake with 200 when no secret is configured', async () => {
		// Stannp only saves a webhook when the validation POST gets a 200, and
		// the handshake is unsigned unless a secret was set at creation.
		const result = await testUrl.handler(
			ctx(undefined),
			request(webhookValidation) as never,
		);
		expect(result).toMatchObject({ success: true });
	});

	it('rejects a payload missing the objects array with 400', async () => {
		const incomplete = {
			webhook_id: 1234,
			event: 'mailpiece_status',
			created: '2024-01-15 10:30:00',
			retries: 0,
		};
		const result = await mailpieceStatus.handler(
			ctx(undefined),
			request(incomplete) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('routes each delivery to exactly one handler', () => {
		const webhooks = stannpWebhooksNested;
		const paths = Object.entries(webhooks).flatMap(([group, fns]) =>
			Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(paths.sort()).toEqual([
			'campaigns.status',
			'events.created',
			'mailpieces.status',
			'webhooks.testUrl',
		]);

		const matched = Object.values(webhooks)
			.flatMap((fns) => Object.values(fns))
			.filter((hook) =>
				hook.match({
					body: mailpieceStatusPayload,
					headers: {},
				} as never),
			);
		expect(matched).toHaveLength(1);
	});
});
