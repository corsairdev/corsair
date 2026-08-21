import type { WebhookRequest } from 'corsair/core';
import type { GitlabWebhookPayload } from './types';
import { verifyGitlabWebhookSignature } from './types';

describe('verifyGitlabWebhookSignature', () => {
	const secret = 'my-super-secret-token';
	const payload: GitlabWebhookPayload = {
		object_kind: 'push',
		event_name: 'push',
	};

	const requestWith = (
		headers: Record<string, string | string[]>,
	): WebhookRequest<GitlabWebhookPayload> => ({
		payload,
		headers,
		rawBody: JSON.stringify(payload),
	});

	it('should fail closed when secret is missing', () => {
		// The regression: verification returned { valid: true } unconditionally
		// when no secret was configured, without ever reading the token header.
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': secret }),
			'',
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should fail closed when both secret and token header are missing', () => {
		const result = verifyGitlabWebhookSignature(requestWith({}), '');
		expect(result.valid).toBe(false);
	});

	it('should return invalid if the token header is missing', () => {
		const result = verifyGitlabWebhookSignature(requestWith({}), secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing X-Gitlab-Token header',
		});
	});

	it('should return invalid if the token does not match the secret', () => {
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': 'not-the-secret' }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'X-Gitlab-Token does not match configured secret',
		});
	});

	it('should return invalid for a same-length token that differs', () => {
		const sameLength = 'my-super-secret-toXen';
		expect(sameLength).toHaveLength(secret.length);
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': sameLength }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'X-Gitlab-Token does not match configured secret',
		});
	});

	it('should return valid when the token matches the configured secret', () => {
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': secret }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should use the first value of a repeated token header', () => {
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': [secret, 'ignored'] }),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should reject a repeated token header when the first value is wrong', () => {
		const result = verifyGitlabWebhookSignature(
			requestWith({ 'x-gitlab-token': ['wrong', secret] }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'X-Gitlab-Token does not match configured secret',
		});
	});

	it('should handle a multi-byte secret without throwing', () => {
		const multiByte = 'sécret';
		expect(
			verifyGitlabWebhookSignature(
				requestWith({ 'x-gitlab-token': multiByte }),
				multiByte,
			),
		).toEqual({ valid: true });
		expect(
			verifyGitlabWebhookSignature(
				requestWith({ 'x-gitlab-token': 'secret' }),
				multiByte,
			),
		).toEqual({
			valid: false,
			error: 'X-Gitlab-Token does not match configured secret',
		});
	});
});
