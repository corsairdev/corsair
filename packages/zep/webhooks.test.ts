import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { zep } from './index';
import {
	matchZepWebhook,
	verifyZepSignature,
	zepWebhooksNested,
} from './webhooks';

// Svix's scheme, written out here from https://docs.svix.com/receiving/verifying-payloads/how-manual.
const KEY = Buffer.from('zep-test-signing-key-0123456789').toString('base64');
const SECRET = `whsec_${KEY}`;

function signed(
	// `unknown` because each case sends its own payload.
	payload: unknown,
	options: { secret?: string; timestamp?: number; id?: string } = {},
): WebhookRequest<unknown> & RawWebhookRequest {
	const rawBody = JSON.stringify(payload);
	const id = options.id ?? 'msg_2abc';
	const timestamp = String(options.timestamp ?? Math.floor(Date.now() / 1000));
	const key = Buffer.from((options.secret ?? SECRET).slice(6), 'base64');
	const signature = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest('base64');
	return {
		headers: {
			'svix-id': id,
			'svix-timestamp': timestamp,
			'svix-signature': `v1,${signature}`,
			'content-type': 'application/json',
		},
		body: payload,
		rawBody,
		// `unknown` because a test request fills only the fields the handler reads.
	} as unknown as WebhookRequest<unknown> & RawWebhookRequest;
}

const EPISODE = {
	event_name: 'episode.processed',
	account_uuid: '1811f9c5-336c-402a-964b-1a62faddc9c0',
	project_uuid: 'a3627577-88b1-46ed-bcb9-0e90ff32dba3',
	episode_uuid: '52caee86-759e-4bc2-8d20-c5c1a8212368',
	source: 'message',
	completed_at: '2026-05-05T18:16:34Z',
	graph_type: 'user',
	graph_uuid: '9b1c',
	user_uuid: '7d2e',
};
// The example payload on Zep's webhooks page.
const BATCH = {
	event_name: 'ingest.batch.completed',
	account_uuid: '1811f9c5-336c-402a-964b-1a62faddc9c0',
	project_uuid: 'a3627577-88b1-46ed-bcb9-0e90ff32dba3',
	batch_id: '52caee86-759e-4bc2-8d20-c5c1a8212368',
	completed_at: '2026-05-05T18:16:34Z',
};

const ctx = { key: SECRET } as never;

describe('zep webhooks', () => {
	it('verifies a Svix signature', () => {
		expect(verifyZepSignature(signed(EPISODE), SECRET)).toBe(true);
	});

	it('refuses a wrong secret, a stale timestamp and a changed body', () => {
		const other = `whsec_${Buffer.from('another-key').toString('base64')}`;
		expect(verifyZepSignature(signed(EPISODE), other)).toBe(false);
		expect(
			verifyZepSignature(
				signed(EPISODE, { timestamp: Math.floor(Date.now() / 1000) - 600 }),
				SECRET,
			),
		).toBe(false);
		const tampered = signed(EPISODE);
		(tampered as { rawBody: string }).rawBody = JSON.stringify({
			...EPISODE,
			user_uuid: 'someone-else',
		});
		expect(verifyZepSignature(tampered, SECRET)).toBe(false);
		expect(verifyZepSignature(signed(EPISODE), 'not-a-whsec')).toBe(false);
	});

	it('accepts any v1 entry of a rotated secret list', () => {
		const request = signed(EPISODE);
		const headers = request.headers as Record<string, string>;
		headers['svix-signature'] = `v1,AAAA ${headers['svix-signature']}`;
		expect(verifyZepSignature(request, SECRET)).toBe(true);
	});

	it('matches each event to its webhook only', () => {
		expect(matchZepWebhook(signed(EPISODE))).toBe(true);
		expect(zepWebhooksNested.episodes.processed.match(signed(EPISODE))).toBe(
			true,
		);
		expect(zepWebhooksNested.batches.completed.match(signed(EPISODE))).toBe(
			false,
		);
		expect(zepWebhooksNested.batches.completed.match(signed(BATCH))).toBe(true);
		const unsigned = { ...signed(EPISODE), headers: {} };
		expect(matchZepWebhook(unsigned as never)).toBe(false);
		expect(matchZepWebhook(signed({ event_name: 'something.else' }))).toBe(
			false,
		);
	});

	it('parses a verified payload and refuses an unsigned one', async () => {
		const ok = await zepWebhooksNested.batches.completed.handler(
			ctx,
			signed(BATCH) as never,
		);
		expect(ok).toEqual({ success: true, data: BATCH });
		const bad = await zepWebhooksNested.batches.completed.handler(
			ctx,
			signed(BATCH, {
				secret: `whsec_${Buffer.from('x').toString('base64')}`,
			}) as never,
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
	});

	it('reads the webhook secret from options, then the account', async () => {
		const builder = zep({ webhookSecret: SECRET }).keyBuilder as unknown as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
		await expect(builder({ keys: {} }, 'webhook')).resolves.toBe(SECRET);
		const stored = zep().keyBuilder as unknown as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
		await expect(
			stored(
				{ keys: { get_webhook_signature: () => Promise.resolve(SECRET) } },
				'webhook',
			),
		).resolves.toBe(SECRET);
		await expect(
			stored(
				{ keys: { get_webhook_signature: () => Promise.resolve(null) } },
				'webhook',
			),
		).rejects.toThrow();
	});
});
