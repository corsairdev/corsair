import crypto from 'node:crypto';
import {
	callInitiationFailureEvent,
	postCallAudioEvent,
	postCallTranscriptionEvent,
	signDelivery,
	transcriptionEvent,
	transcriptionFailedEvent,
	voiceRemovalNoticeEvent,
	voiceRemovalNoticeWithdrawnEvent,
	voiceRemovedEvent,
	WEBHOOK_SECRET,
} from './test-fixtures';
import {
	ConversationWebhooks,
	SpeechToTextWebhooks,
	VoiceWebhooks,
} from './webhooks';
import {
	ELEVENLABS_SIGNATURE_TOLERANCE_MS,
	isElevenLabsWebhook,
	matchEventType,
	verifyElevenLabsWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const request = (signed: ReturnType<typeof signDelivery>) => ({
	payload: signed.payload,
	headers: signed.headers,
	rawBody: signed.rawBody,
});

describe('verifyElevenLabsWebhookSignature', () => {
	it('accepts a signed delivery', () => {
		expect(
			verifyElevenLabsWebhookSignature(request(signDelivery()), WEBHOOK_SECRET),
		).toEqual({ valid: true });
	});

	it('accepts the header in another case', () => {
		const signed = signDelivery();
		const headers = {
			'ElevenLabs-Signature': signed.headers['elevenlabs-signature'],
		};
		expect(
			verifyElevenLabsWebhookSignature(
				{ ...request(signed), headers },
				WEBHOOK_SECRET,
			).valid,
		).toBe(true);
	});

	it('accepts any of several v0 values, as during a rotation', () => {
		const signed = signDelivery();
		const header = signed.headers['elevenlabs-signature'] as string;
		const [t, v0] = header.split(',');
		expect(
			verifyElevenLabsWebhookSignature(
				{
					...request(signed),
					headers: {
						'elevenlabs-signature': `${t},v0=${'0'.repeat(64)},${v0}`,
					},
				},
				WEBHOOK_SECRET,
			).valid,
		).toBe(true);
	});

	it('refuses a tampered body', () => {
		const signed = signDelivery();
		const result = verifyElevenLabsWebhookSignature(
			{ ...request(signed), rawBody: `${signed.rawBody} ` },
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid ElevenLabs webhook signature',
		});
	});

	it('refuses a body parsed and re-serialised, which changes the bytes', () => {
		const signed = signDelivery();
		expect(
			verifyElevenLabsWebhookSignature(
				{ ...request(signed), rawBody: JSON.stringify(signed.payload) },
				WEBHOOK_SECRET,
			).valid,
		).toBe(false);
	});

	it('refuses the wrong secret', () => {
		expect(
			verifyElevenLabsWebhookSignature(request(signDelivery()), 'other').valid,
		).toBe(false);
	});

	it('refuses a timestamp changed after signing', () => {
		const signed = signDelivery();
		const header = signed.headers['elevenlabs-signature'] as string;
		const moved = header.replace(
			/t=\d+/,
			`t=${Math.floor(Date.now() / 1000) + 5}`,
		);
		expect(
			verifyElevenLabsWebhookSignature(
				{ ...request(signed), headers: { 'elevenlabs-signature': moved } },
				WEBHOOK_SECRET,
			).valid,
		).toBe(false);
	});

	it('refuses a stale delivery, past the 30 minute tolerance', () => {
		const now = Date.now();
		const stale = signDelivery({
			timestampSeconds: Math.floor(
				(now - ELEVENLABS_SIGNATURE_TOLERANCE_MS - 5000) / 1000,
			),
		});
		const result = verifyElevenLabsWebhookSignature(
			request(stale),
			WEBHOOK_SECRET,
			{ now },
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/tolerance/);
	});

	it('accepts one just inside the tolerance', () => {
		const now = Date.now();
		const fresh = signDelivery({
			timestampSeconds: Math.floor(
				(now - ELEVENLABS_SIGNATURE_TOLERANCE_MS + 5000) / 1000,
			),
		});
		expect(
			verifyElevenLabsWebhookSignature(request(fresh), WEBHOOK_SECRET, { now })
				.valid,
		).toBe(true);
	});

	it('refuses one from far in the future', () => {
		const now = Date.now();
		const future = signDelivery({
			timestampSeconds: Math.floor(
				(now + ELEVENLABS_SIGNATURE_TOLERANCE_MS + 5000) / 1000,
			),
		});
		expect(
			verifyElevenLabsWebhookSignature(request(future), WEBHOOK_SECRET, { now })
				.valid,
		).toBe(false);
	});

	it('fails closed with no secret', () => {
		for (const secret of [undefined, '']) {
			const result = verifyElevenLabsWebhookSignature(
				request(signDelivery()),
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toMatch(/No ElevenLabs webhook secret/);
		}
	});

	it('refuses a missing raw body or header', () => {
		const signed = signDelivery();
		expect(
			verifyElevenLabsWebhookSignature(
				{ ...request(signed), rawBody: undefined },
				WEBHOOK_SECRET,
			).error,
		).toMatch(/raw body/);
		expect(
			verifyElevenLabsWebhookSignature(
				{ ...request(signed), headers: {} },
				WEBHOOK_SECRET,
			).error,
		).toMatch(/Missing ElevenLabs-Signature/);
	});

	it.each(['', 'garbage', 't=abc,v0=00', 't=123', 'v0=00', 'v1=00'])(
		'refuses the malformed header "%s"',
		(header) => {
			const signed = signDelivery();
			expect(
				verifyElevenLabsWebhookSignature(
					{ ...request(signed), headers: { 'elevenlabs-signature': header } },
					WEBHOOK_SECRET,
				).valid,
			).toBe(false);
		},
	);

	it('refuses a v0 of the wrong length or not hex without throwing', () => {
		const signed = signDelivery();
		const t = Math.floor(Date.now() / 1000);
		for (const v0 of ['abcd', 'z'.repeat(64)]) {
			expect(
				verifyElevenLabsWebhookSignature(
					{
						...request(signed),
						headers: { 'elevenlabs-signature': `t=${t},v0=${v0}` },
					},
					WEBHOOK_SECRET,
				).valid,
			).toBe(false);
		}
	});

	it('trusts Hub when it already verified the delivery', () => {
		expect(
			verifyElevenLabsWebhookSignature(
				{ payload: {}, headers: {}, hubVerified: true },
				undefined,
			).valid,
		).toBe(true);
	});

	it('matches the signature ElevenLabs’ SDK makes', () => {
		// The scheme from @elevenlabs/elevenlabs-js wrapper/webhooks.js.
		const timestamp = Math.floor(Date.now() / 1000);
		const rawBody = '{"type": "post_call_transcription"}';
		const v0 = `v0=${crypto
			.createHmac('sha256', 'secret')
			.update(`${timestamp}.${rawBody}`)
			.digest('hex')}`;
		expect(
			verifyElevenLabsWebhookSignature(
				{
					payload: JSON.parse(rawBody),
					rawBody,
					headers: { 'elevenlabs-signature': `t=${timestamp},${v0}` },
				},
				'secret',
			).valid,
		).toBe(true);
	});
});

describe('matching', () => {
	it('knows its own deliveries by the signature header', () => {
		expect(
			isElevenLabsWebhook({
				headers: { 'ElevenLabs-Signature': 't=1,v0=00' },
				body: {},
			}),
		).toBe(true);
		expect(isElevenLabsWebhook({ headers: {}, body: {} })).toBe(false);
	});

	it('matches by type, from a string or a parsed body', () => {
		const match = matchEventType('voice_removed');
		const headers = { 'elevenlabs-signature': 't=1,v0=00' };
		expect(match({ headers, body: { type: 'voice_removed' } })).toBe(true);
		expect(match({ headers, body: '{"type":"voice_removed"}' })).toBe(true);
		expect(match({ headers, body: { type: 'other' } })).toBe(false);
		expect(match({ headers, body: 'not json' })).toBe(false);
		expect(match({ headers, body: '[1]' })).toBe(false);
		// Hub routes by its own check, so the event match doesn't need the header.
		expect(match({ headers: {}, body: { type: 'voice_removed' } })).toBe(true);
	});
});

const ctx = { key: WEBHOOK_SECRET } as never;

const events = [
	[
		'postCallTranscription',
		ConversationWebhooks.postCallTranscription,
		postCallTranscriptionEvent,
	],
	['postCallAudio', ConversationWebhooks.postCallAudio, postCallAudioEvent],
	[
		'callInitiationFailure',
		ConversationWebhooks.callInitiationFailure,
		callInitiationFailureEvent,
	],
	[
		'transcriptionCompleted',
		SpeechToTextWebhooks.transcriptionCompleted,
		transcriptionEvent,
	],
	[
		'transcriptionFailed',
		SpeechToTextWebhooks.transcriptionFailed,
		transcriptionFailedEvent,
	],
	['removalNotice', VoiceWebhooks.removalNotice, voiceRemovalNoticeEvent],
	[
		'removalNoticeWithdrawn',
		VoiceWebhooks.removalNoticeWithdrawn,
		voiceRemovalNoticeWithdrawnEvent,
	],
	['removed', VoiceWebhooks.removed, voiceRemovedEvent],
] as const;

describe.each(events)('%s', (_name, webhook, body) => {
	// unknown: each webhook takes its own event type; the fixture is that event.
	const handle = webhook.handler as (
		ctx: never,
		request: unknown,
	) => Promise<{ success: boolean; statusCode?: number; data?: unknown }>;

	it('matches only its own type', () => {
		const headers = { 'elevenlabs-signature': 't=1,v0=00' };
		expect(webhook.match({ headers, body })).toBe(true);
		expect(webhook.match({ headers, body: { type: 'unrelated' } })).toBe(false);
	});

	it('hands over a signed delivery', async () => {
		const result = await handle(ctx, request(signDelivery({ body })));
		expect(result.success).toBe(true);
		expect(result.data).toMatchObject({ type: body.type });
	});

	it('throws on a forged one, so it can’t be acknowledged', async () => {
		await expect(
			handle(ctx, request(signDelivery({ body, secret: 'forged' }))),
		).rejects.toMatchObject({
			name: 'ElevenLabsWebhookRefusedError',
			statusCode: 401,
		});
	});

	it('throws when no secret is configured', async () => {
		await expect(
			handle({ key: undefined } as never, request(signDelivery({ body }))),
		).rejects.toMatchObject({
			statusCode: 401,
			message: expect.stringMatching(/No ElevenLabs webhook secret/),
		});
	});

	it('throws on a signed payload its schema refuses', async () => {
		await expect(
			handle(ctx, request(signDelivery({ body: { ...body, type: 1 } }))),
		).rejects.toMatchObject({
			name: 'ElevenLabsWebhookRefusedError',
			statusCode: 400,
		});
	});

	it('keeps fields it has not heard of', async () => {
		const result = await handle(
			ctx,
			request(signDelivery({ body: { ...body, brand_new: 1 } })),
		);
		expect(result.data).toMatchObject({ brand_new: 1 });
	});
});

describe('logs', () => {
	it('logs ids only, never a transcript or audio', async () => {
		const { logEventFromContext } = jest.requireMock('corsair/core') as {
			logEventFromContext: jest.Mock;
		};
		logEventFromContext.mockClear();
		await ConversationWebhooks.postCallTranscription.handler(
			ctx,
			request(signDelivery({ body: postCallTranscriptionEvent })) as never,
		);
		await ConversationWebhooks.postCallAudio.handler(
			ctx,
			request(signDelivery({ body: postCallAudioEvent })) as never,
		);
		await SpeechToTextWebhooks.transcriptionCompleted.handler(
			ctx,
			request(signDelivery({ body: transcriptionEvent })) as never,
		);
		const logged = JSON.stringify(
			logEventFromContext.mock.calls.map((c) => c[2]),
		);
		expect(logged).toContain('conv_abc');
		expect(logged).not.toContain('SUQzBA');
		expect(logged).not.toContain('Hello from Corsair');
		expect(logged).not.toContain('Hi.');
	});
});
