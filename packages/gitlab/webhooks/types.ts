import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export interface GitlabWebhookPayload {
	object_kind: string;
	event_name?: string;
	[key: string]: unknown;
}

export interface ExampleEvent extends GitlabWebhookPayload {
	object_kind: 'example';
}

export const ExampleEventSchema = z.object({
	object_kind: z.literal('example'),
});

export type GitlabWebhookOutputs = {
	example: ExampleEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

/**
 * Matches incoming webhook payloads by `object_kind`, which is the field
 * GitLab uses in all webhook event bodies to identify the event type.
 */
export function createGitlabMatch(objectKind: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody.object_kind === objectKind;
	};
}

/**
 * GitLab webhook verification uses a shared secret sent in the
 * `X-Gitlab-Token` header. The server compares the header value against
 * the configured secret — no HMAC signature involved.
 */
export function verifyGitlabWebhookSignature(
	request: WebhookRequest<GitlabWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const token = request.headers['x-gitlab-token'];

	if (!token) {
		return { valid: false, error: 'Missing X-Gitlab-Token header' };
	}

	if (token !== secret) {
		return { valid: false, error: 'X-Gitlab-Token does not match configured secret' };
	}

	return { valid: true };
}
