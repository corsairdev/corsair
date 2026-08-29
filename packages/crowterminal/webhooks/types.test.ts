import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import type { SkillUpdatedEvent } from './types';
import {
	createCrowterminalMatch,
	hasCrowterminalWebhookSignature,
	verifyCrowterminalWebhookSignature,
} from './types';

describe('CrowTerminal webhook verification', () => {
	const secret = 'crowterminal-webhook-secret';
	const payload: SkillUpdatedEvent = {
		event: 'skill.updated',
		timestamp: '2026-02-18T12:00:00Z',
		webhookId: 'wh_123',
		agentId: 'agent_123',
		data: { clientId: 'client_123' },
	};
	const rawBody = JSON.stringify(payload);
	const signature = `sha256=${crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex')}`;

	function requestWith(
		headers: Record<string, string | string[] | undefined>,
		body: string | null = rawBody,
	): WebhookRequest<SkillUpdatedEvent> {
		return { payload, headers, rawBody: body ?? undefined };
	}

	it('matches a documented event from the payload event field', () => {
		const match = createCrowterminalMatch('skill.updated');
		expect(match({ headers: {}, body: rawBody })).toBe(true);
		expect(match({ headers: {}, body: { event: 'data.ingested' } })).toBe(
			false,
		);
	});

	it('detects the documented signature header case-insensitively', () => {
		expect(
			hasCrowterminalWebhookSignature({
				headers: { 'X-CrowTerminal-Signature': signature },
				body: rawBody,
			}),
		).toBe(true);
	});

	it('accepts a correctly signed raw payload', () => {
		expect(
			verifyCrowterminalWebhookSignature(
				requestWith({ 'x-crowterminal-signature': signature }),
				secret,
			),
		).toEqual({ valid: true });
	});

	it('rejects a missing secret, body, or signature', () => {
		expect(
			verifyCrowterminalWebhookSignature(
				requestWith({ 'x-crowterminal-signature': signature }),
			),
		).toEqual({ valid: false, error: 'Missing webhook secret' });
		expect(
			verifyCrowterminalWebhookSignature(
				requestWith({ 'x-crowterminal-signature': signature }, null),
				secret,
			),
		).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
		expect(verifyCrowterminalWebhookSignature(requestWith({}), secret)).toEqual(
			{
				valid: false,
				error: 'Missing X-CrowTerminal-Signature header',
			},
		);
	});

	it('rejects a signature with the wrong HMAC', () => {
		expect(
			verifyCrowterminalWebhookSignature(
				requestWith({
					'x-crowterminal-signature': 'sha256=not-the-expected-hmac',
				}),
				secret,
			),
		).toEqual({ valid: false, error: 'Invalid signature' });
	});
});
