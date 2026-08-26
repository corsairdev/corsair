/**
 * Trigger routing and request authentication.
 *
 * The property that matters most here is that the six message triggers
 * partition the space: any single Slack message event must activate exactly one
 * of them. If two ever matched the same payload an automation would act on one
 * message twice, which is the kind of bug that only shows up in production.
 */
import { createHmac } from 'node:crypto';
import {
	createSlackbotEventMatch,
	matchBotMessage,
	matchDirectMessage,
	matchGroupDirectMessage,
	matchMessage,
	matchPrivateChannelMessage,
	matchThreadReply,
	matchUrlVerification,
	verifySlackbotWebhookSignature,
} from './webhooks/types';

const SIGNING_SECRET = 'test-signing-secret';

/** Wraps an inner event in the Events API envelope Slack actually sends. */
function envelope(event: Record<string, unknown>) {
	return {
		body: JSON.stringify({
			type: 'event_callback',
			team_id: 'T123',
			api_app_id: 'A123',
			event,
		}),
	} as never;
}

function messageEvent(over: Record<string, unknown> = {}) {
	return {
		type: 'message',
		channel: 'C1',
		channel_type: 'channel',
		user: 'U1',
		text: 'hello',
		ts: '1700000000.000100',
		...over,
	};
}

const MESSAGE_MATCHERS = {
	message: matchMessage,
	directMessage: matchDirectMessage,
	groupDirectMessage: matchGroupDirectMessage,
	privateChannelMessage: matchPrivateChannelMessage,
	botMessage: matchBotMessage,
	threadReply: matchThreadReply,
};

/** Names of every message matcher that claims the given event. */
function claimedBy(event: Record<string, unknown>): string[] {
	const request = envelope(event);
	return Object.entries(MESSAGE_MATCHERS)
		.filter(([, match]) => match(request))
		.map(([name]) => name);
}

describe('message triggers partition the event space', () => {
	it.each([
		['public channel message', { channel_type: 'channel' }, 'message'],
		['direct message', { channel_type: 'im' }, 'directMessage'],
		['multi-person DM', { channel_type: 'mpim' }, 'groupDirectMessage'],
		[
			'private channel message',
			{ channel_type: 'group' },
			'privateChannelMessage',
		],
	])('routes a %s to exactly one trigger', (_label, over, expected) => {
		expect(claimedBy(messageEvent(over))).toEqual([expected]);
	});

	it('routes a bot message to botMessage alone, not to its surface trigger', () => {
		expect(claimedBy(messageEvent({ bot_id: 'B1' }))).toEqual(['botMessage']);
	});

	it('treats the bot_message subtype as a bot message', () => {
		expect(claimedBy(messageEvent({ subtype: 'bot_message' }))).toEqual([
			'botMessage',
		]);
	});

	it('routes a thread reply to threadReply alone', () => {
		const event = messageEvent({
			ts: '1700000000.000200',
			thread_ts: '1700000000.000100',
		});
		expect(claimedBy(event)).toEqual(['threadReply']);
	});

	it('does not treat a thread parent as a reply', () => {
		// Slack stamps the parent of a thread with thread_ts === ts.
		const parent = messageEvent({
			ts: '1700000000.000100',
			thread_ts: '1700000000.000100',
		});
		expect(claimedBy(parent)).toEqual(['message']);
	});

	it('prefers botMessage over threadReply for a bot reply in a thread', () => {
		const event = messageEvent({
			bot_id: 'B1',
			ts: '1700000000.000200',
			thread_ts: '1700000000.000100',
		});
		expect(claimedBy(event)).toEqual(['botMessage']);
	});

	it('claims nothing for a non-message event', () => {
		expect(claimedBy({ type: 'reaction_added', user: 'U1' })).toEqual([]);
	});
});

describe('non-message triggers', () => {
	it('matches reaction_added', () => {
		const match = createSlackbotEventMatch('reaction_added');
		expect(match(envelope({ type: 'reaction_added', user: 'U1' }))).toBe(true);
	});

	it('matches reaction_removed', () => {
		const match = createSlackbotEventMatch('reaction_removed');
		expect(match(envelope({ type: 'reaction_removed', user: 'U1' }))).toBe(
			true,
		);
	});

	it('matches channel_created', () => {
		const match = createSlackbotEventMatch('channel_created');
		expect(match(envelope({ type: 'channel_created' }))).toBe(true);
	});

	it('does not match a different event type', () => {
		const match = createSlackbotEventMatch('reaction_added');
		expect(match(envelope({ type: 'reaction_removed' }))).toBe(false);
	});

	it('matches the bare url_verification handshake', () => {
		const request = {
			body: JSON.stringify({ type: 'url_verification', challenge: 'abc' }),
		} as never;
		expect(matchUrlVerification(request)).toBe(true);
	});

	it('does not treat an event_callback as a handshake', () => {
		expect(matchUrlVerification(envelope(messageEvent()))).toBe(false);
	});
});

describe('signature verification', () => {
	/** Reproduces Slack's v0 signing scheme over the exact raw body. */
	function sign(rawBody: string, timestamp: string, secret = SIGNING_SECRET) {
		const hmac = createHmac('sha256', secret);
		hmac.update(`v0:${timestamp}:${rawBody}`);
		return `v0=${hmac.digest('hex')}`;
	}

	function signedRequest(
		rawBody: string,
		over: { timestamp?: string; signature?: string } = {},
	) {
		const timestamp = over.timestamp ?? String(Math.floor(Date.now() / 1000));
		return {
			rawBody,
			headers: {
				'x-slack-request-timestamp': timestamp,
				'x-slack-signature': over.signature ?? sign(rawBody, timestamp),
			},
		} as never;
	}

	const RAW = JSON.stringify({ type: 'event_callback', team_id: 'T1' });

	it('accepts a correctly signed request', () => {
		expect(
			verifySlackbotWebhookSignature(signedRequest(RAW), SIGNING_SECRET).valid,
		).toBe(true);
	});

	it('rejects a tampered body', () => {
		const request = signedRequest(RAW);
		// Same signature, different bytes.
		(request as { rawBody: string }).rawBody = RAW.replace('T1', 'T2');

		const result = verifySlackbotWebhookSignature(request, SIGNING_SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid signature');
	});

	it('rejects a signature made with the wrong secret', () => {
		const timestamp = String(Math.floor(Date.now() / 1000));
		const request = signedRequest(RAW, {
			timestamp,
			signature: sign(RAW, timestamp, 'not-the-secret'),
		});
		expect(verifySlackbotWebhookSignature(request, SIGNING_SECRET).valid).toBe(
			false,
		);
	});

	it('rejects a stale timestamp, so a captured request cannot be replayed', () => {
		const stale = String(Math.floor(Date.now() / 1000) - 60 * 60);
		const request = signedRequest(RAW, {
			timestamp: stale,
			signature: sign(RAW, stale),
		});
		expect(verifySlackbotWebhookSignature(request, SIGNING_SECRET).valid).toBe(
			false,
		);
	});

	it('refuses to verify when no signing secret is configured', () => {
		const result = verifySlackbotWebhookSignature(
			signedRequest(RAW),
			undefined,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Missing Slack signing secret');
	});

	it('refuses to verify without a raw body', () => {
		const result = verifySlackbotWebhookSignature(
			{ headers: {} } as never,
			SIGNING_SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('reports missing signature headers', () => {
		const result = verifySlackbotWebhookSignature(
			{ rawBody: RAW, headers: {} } as never,
			SIGNING_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/Missing x-slack-signature/);
	});
});
