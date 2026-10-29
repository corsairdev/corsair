import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import {
	createGithubEventMatch,
	verifyGithubWebhookSignature,
} from './webhooks/types';

describe('verifyGithubWebhookSignature', () => {
	const secret = 'github-webhook-secret';
	const payload = { action: 'opened', issue: { id: 12345 } };
	const rawBody = JSON.stringify(payload);

	const sign = (key: string, body: string = rawBody) =>
		`sha256=${crypto.createHmac('sha256', key).update(body).digest('hex')}`;

	it('returns valid when the delivery is hub-verified, even with no secret', () => {
		const request: WebhookRequest = {
			payload,
			headers: {},
			rawBody,
			hubVerified: true,
		};
		expect(verifyGithubWebhookSignature(request, undefined)).toEqual({
			valid: true,
		});
	});

	it('returns error when webhook secret is undefined', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': sign(secret) },
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, undefined)).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when webhook secret is empty string', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': sign(secret) },
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, '')).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when raw body is missing', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': sign(secret) },
			rawBody: undefined as unknown as string,
		};
		expect(verifyGithubWebhookSignature(request, secret)).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('returns error when x-hub-signature-256 header is missing', () => {
		const request: WebhookRequest = {
			payload,
			headers: {},
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, secret)).toEqual({
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		});
	});

	it('returns error when signature is invalid', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': sign('wrong-secret') },
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, secret)).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns valid for a correctly signed request', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': sign(secret) },
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, secret)).toEqual({
			valid: true,
		});
	});

	it('accepts signature header as an array', () => {
		const request: WebhookRequest = {
			payload,
			headers: { 'x-hub-signature-256': [sign(secret)] },
			rawBody,
		};
		expect(verifyGithubWebhookSignature(request, secret)).toEqual({
			valid: true,
		});
	});
});

describe('createGithubEventMatch', () => {
	it('matches request with correct x-github-event header', () => {
		const matcher = createGithubEventMatch('issues');
		const request: RawWebhookRequest = {
			headers: { 'x-github-event': 'issues' },
			body: { action: 'opened' },
		};
		expect(matcher(request)).toBe(true);
	});

	it('returns false when x-github-event does not match', () => {
		const matcher = createGithubEventMatch('issues');
		const request: RawWebhookRequest = {
			headers: { 'x-github-event': 'push' },
			body: {},
		};
		expect(matcher(request)).toBe(false);
	});

	it('matches request with both event type and action', () => {
		const matcher = createGithubEventMatch('issues', 'opened');
		const request: RawWebhookRequest = {
			headers: { 'x-github-event': 'issues' },
			body: { action: 'opened' },
		};
		expect(matcher(request)).toBe(true);
	});

	it('returns false when action does not match', () => {
		const matcher = createGithubEventMatch('issues', 'closed');
		const request: RawWebhookRequest = {
			headers: { 'x-github-event': 'issues' },
			body: { action: 'opened' },
		};
		expect(matcher(request)).toBe(false);
	});

	it('parses JSON string body when checking action', () => {
		const matcher = createGithubEventMatch('pull_request', 'opened');
		const request: RawWebhookRequest = {
			headers: { 'x-github-event': 'pull_request' },
			body: JSON.stringify({ action: 'opened' }),
		};
		expect(matcher(request)).toBe(true);
	});
});
