import { createHmac } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import {
	gitea,
	giteaEventTypeOf,
	isGiteaDelivery,
	verifyGiteaWebhook,
} from './index';
import { giteaWebhooksNested } from './webhooks';

// Real deliveries from Gitea 28.4 (live 11-27), one per X-Gitea-Event-Type,
// with their event headers; each test signs the body itself.
const FIXTURES = join(__dirname, '__fixtures__', 'webhooks');
type Delivery = {
	headers: Record<string, string>;
	body: Record<string, unknown>;
};
const deliveries: Record<string, Delivery> = Object.fromEntries(
	readdirSync(FIXTURES).map((file) => [
		file.replace(/\.json$/, ''),
		JSON.parse(readFileSync(join(FIXTURES, file), 'utf8')) as Delivery,
	]),
);

const SECRET = 'a-long-random-secret';

function signed(name: string, secret = SECRET) {
	const delivery = deliveries[name] as Delivery;
	const body = JSON.stringify(delivery.body);
	const signature = createHmac('sha256', secret).update(body).digest('hex');
	return {
		body,
		headers: {
			...delivery.headers,
			'x-gitea-signature': signature,
			'x-hub-signature-256': `sha256=${signature}`,
		},
	};
}

const corsair = (webhookSecret = SECRET) =>
	createCorsair({
		plugins: [
			gitea({
				key: 'gt_test',
				instanceUrl: 'https://git.example.com',
				webhookSecret,
			}),
		],
	});

describe('routing', () => {
	it('sends each real delivery to its webhook', async () => {
		const expected: Record<string, string> = {
			push: 'push',
			create: 'refCreated',
			delete: 'refDeleted',
			issues: 'issues',
			issue_label: 'issues',
			issue_comment: 'issueComment',
			pull_request: 'pullRequest',
			pull_request_sync: 'pullRequest',
			pull_request_review_approved: 'pullRequestReview',
			pull_request_review_comment: 'pullRequestReview',
			release: 'release',
			wiki: 'wiki',
			status: 'status',
		};
		expect(Object.keys(deliveries).sort()).toEqual(
			Object.keys(expected).sort(),
		);
		for (const [name, action] of Object.entries(expected)) {
			const { headers, body } = signed(name);
			const result = await processWebhook(corsair(), headers, body);
			expect([
				name,
				result.plugin,
				result.action,
				result.response?.success,
			]).toEqual([name, 'gitea', action, true]);
		}
	});

	it('returns the delivery parsed, unknown fields kept', async () => {
		const { headers, body } = signed('push');
		const handler = giteaWebhooksNested.push.handler;
		// `unknown` because the handler reads only the key (and logs through the context).
		const ctx = { key: SECRET } as unknown as Parameters<typeof handler>[0];
		const result = await handler(ctx, {
			payload: { ...JSON.parse(body), extra_field: 1 },
			headers,
			rawBody: body,
		});
		const data = result.data as unknown as Record<string, unknown>;
		expect(result.success).toBe(true);
		expect(data.ref).toBe('refs/heads/hook/one');
		expect(data.extra_field).toBe(1);
		expect((data.repository as Record<string, unknown>).full_name).toBeTruthy();
		expect(Array.isArray(data.commits)).toBe(true);
	});

	it('reads the event type from Gitea or Forgejo headers, never GitHub’s alone', () => {
		expect(
			giteaEventTypeOf({
				headers: {
					'x-gitea-event-type': 'issue_label',
					'x-gitea-event': 'issues',
				},
			}),
		).toBe('issue_label');
		expect(giteaEventTypeOf({ headers: { 'x-gitea-event': 'push' } })).toBe(
			'push',
		);
		expect(
			giteaEventTypeOf({ headers: { 'x-forgejo-event': 'release' } }),
		).toBe('release');
		expect(
			isGiteaDelivery({ headers: { 'x-github-event': 'push' }, body: {} }),
		).toBe(false);
		expect(
			isGiteaDelivery({ headers: { 'x-gitea-event': 'schedule' }, body: {} }),
		).toBe(false);
		expect(
			isGiteaDelivery({ headers: { 'x-gitea-event-type': 'push' }, body: {} }),
		).toBe(true);
	});
});

describe('signatures', () => {
	it('refuses an unsigned or wrongly signed delivery with 401', async () => {
		const { headers, body } = signed('push');
		const {
			'x-gitea-signature': _a,
			'x-hub-signature-256': _b,
			...unsigned
		} = headers;
		const missing = await processWebhook(corsair(), unsigned, body);
		expect(missing.response).toEqual({
			success: false,
			statusCode: 401,
			error: 'Missing Gitea signature header',
		});
		const forged = await processWebhook(
			corsair('another-secret'),
			headers,
			body,
		);
		expect(forged.response?.statusCode).toBe(401);
		const tampered = await processWebhook(
			corsair(),
			headers,
			body.replace('main', 'evil'),
		);
		expect(tampered.response?.statusCode).toBe(401);
	});

	it('takes X-Forgejo-Signature or X-Hub-Signature-256 when X-Gitea-Signature is absent', () => {
		const { headers, body } = signed('release');
		const signature = headers['x-gitea-signature'];
		expect(
			verifyGiteaWebhook(
				{
					payload: {},
					rawBody: body,
					headers: { 'x-forgejo-signature': signature },
				},
				SECRET,
			),
		).toEqual({ valid: true });
		expect(
			verifyGiteaWebhook(
				{
					payload: {},
					rawBody: body,
					headers: { 'x-hub-signature-256': `sha256=${signature}` },
				},
				SECRET,
			),
		).toEqual({ valid: true });
		expect(
			verifyGiteaWebhook(
				{
					payload: {},
					rawBody: body,
					headers: { 'x-gitea-signature': signature },
				},
				undefined,
			).valid,
		).toBe(false);
	});

	it('refuses a payload that breaks its documented types, naming paths only', async () => {
		const delivery = deliveries.issues as Delivery;
		const body = JSON.stringify({ ...delivery.body, number: 'four-secret' });
		const signature = createHmac('sha256', SECRET).update(body).digest('hex');
		const result = await processWebhook(
			corsair(),
			{ ...delivery.headers, 'x-gitea-signature': signature },
			body,
		);
		expect(result.response?.statusCode).toBe(400);
		expect(result.response?.error).toContain('number');
		expect(result.response?.error).not.toContain('four-secret');
	});
});
