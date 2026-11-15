import { createHmac } from 'node:crypto';

export const TOKEN = 'skTestTokenNotReal0123456789';
export const PROJECT_ID = 'abc123de';
export const DATASET = 'production';
export const API = `https://${PROJECT_ID}.api.sanity.io/v2025-02-19`;
export const WEBHOOK_SECRET = 'a-webhook-secret-for-tests';

// unknown: any JSON body a mocked endpoint answers with.
export function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(body === undefined ? '' : JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

export function textResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: { 'content-type': 'text/plain' },
	});
}

/** Signs a body the way `@sanity/webhook` 4 does. */
export function sign(rawBody: string, secret: string, timestamp = Date.now()) {
	const signature = createHmac('sha256', Buffer.from(secret, 'utf8'))
		.update(`${timestamp}.${rawBody}`)
		.digest('base64url');
	return `t=${timestamp},v1=${signature}`;
}

export const DELIVERY_BODY = JSON.stringify({
	_id: 'post-1',
	_type: 'post',
	title: 'Hello',
	slug: 'hello',
});

export function deliveryHeaders(
	rawBody: string,
	options: { secret?: string; timestamp?: number; projectId?: string } = {},
): Record<string, string> {
	return {
		'content-type': 'application/json',
		'idempotency-key': '"idem-1"',
		'sanity-project-id': options.projectId ?? PROJECT_ID,
		'sanity-dataset': DATASET,
		'sanity-webhook-id': 'hook-1',
		'sanity-document-id': 'post-1',
		'sanity-operation': 'update',
		'sanity-transaction-id': 'tx-1',
		'sanity-transaction-time': '2026-11-10T18:06:08Z',
		'sanity-webhook-signature': sign(
			rawBody,
			options.secret ?? WEBHOOK_SECRET,
			options.timestamp,
		),
	};
}

/**
 * A real delivery Sanity sent on 2026-11-10, signed with a throwaway secret
 * whose webhook was deleted straight after. Verifying it checks the signature
 * code against Sanity's own bytes, not just against `sign` above.
 */
export const REAL_DELIVERY = {
	secret: '35c68d21225a494649ad5e8f291233bd200542c2e7a3e58b',
	signedAt: 1794333969323,
	rawBody:
		'{"_id":"corsair-live-40ebcfbe","_type":"post","slug":"delivery-test","title":"Delivery test"}',
	headers: {
		'user-agent': 'Sanity.io webhook delivery',
		'content-type': 'application/json',
		'idempotency-key': '"Ijl6wS57jhw9+6Jmk6KXSg"',
		'sanity-dataset': 'corsair-plugin-test',
		'sanity-document-id': 'corsair-live-40ebcfbe',
		'sanity-operation': 'create',
		'sanity-project-id': 'mlz37d9m',
		'sanity-transaction-id': '5X82i8ToXfK0Fz5m5f8ns3',
		'sanity-transaction-time': '2026-11-10T18:06:08Z',
		'sanity-webhook-id': 'v6YLvHAsMjKJDxgN',
		'sanity-webhook-signature':
			't=1794333969323,v1=Soc2yJLMV0PFdOs1jcx06P7XJROKzG0Vai2Pr4Nbc_s',
	},
} as const;
