import { createHmac } from 'node:crypto';
import { createCorsair } from 'corsair/core';
import { identitycheck } from './index';

const key = Buffer.from('test-secret');
const secret = `whsec_${key.toString('base64')}`;
const event = {
	type: 'verification.decision' as const,
	id: 'id-123',
	result: 'positive',
	result_info: { verification: { status: 'approved' } },
};
const rawBody = JSON.stringify(event);
const timestamp = Math.floor(Date.now() / 1000).toString();
const signature = createHmac('sha256', key)
	.update(`msg-1.${timestamp}.${rawBody}`)
	.digest('base64');
const headers = {
	'svix-id': 'msg-1',
	'svix-timestamp': timestamp,
	'svix-signature': `v1,${signature}`,
};
const plugin = identitycheck({ webhookSecret: secret });
if (!plugin.webhooks) throw new Error('Missing webhooks');
const webhook = plugin.webhooks.verification.decision;

it('matches and accepts a correctly signed decision', async () => {
	expect(
		plugin.pluginWebhookMatcher?.({ headers, body: rawBody } as never),
	).toBe(true);
	await expect(
		webhook.handler(
			{ key: secret } as never,
			{ headers, rawBody, payload: event } as never,
		),
	).resolves.toEqual({ success: true, data: event });
});
it('rejects a tampered payload and stale timestamp', async () => {
	await expect(
		webhook.handler(
			{ key: secret } as never,
			{ headers, rawBody: rawBody + ' ', payload: event } as never,
		),
	).resolves.toMatchObject({ success: false, statusCode: 401 });
	await expect(
		webhook.handler(
			{ key: secret } as never,
			{
				headers: { ...headers, 'svix-timestamp': '1' },
				rawBody,
				payload: event,
			} as never,
		),
	).resolves.toMatchObject({ success: false, statusCode: 401 });
});

it('uses the signed body even when the parsed payload differs', async () => {
	await expect(
		webhook.handler(
			{ key: secret } as never,
			{ headers, rawBody, payload: { ...event, result: 'tampered' } } as never,
		),
	).resolves.toEqual({ success: true, data: event });
});

it('accepts a Hub-verified decision through the bound webhook without looking up a secret', async () => {
	const corsair = createCorsair({ plugins: [identitycheck()] });
	await expect(
		corsair.identitycheck.webhooks.verification.decision.handler({
			headers,
			rawBody,
			payload: event,
			hubVerified: true,
		}),
	).resolves.toEqual({ success: true, data: event });
});

it('validates Hub-verified bodies and still rejects unsigned direct deliveries', async () => {
	const corsair = createCorsair({
		plugins: [identitycheck({ webhookSecret: secret })],
	});
	const handler = corsair.identitycheck.webhooks.verification.decision.handler;
	await expect(
		handler({
			headers,
			rawBody: JSON.stringify({ type: 'verification.decision' }),
			payload: event,
			hubVerified: true,
		}),
	).resolves.toMatchObject({ success: false, statusCode: 400 });
	await expect(
		handler({ headers: {}, rawBody, payload: event }),
	).resolves.toMatchObject({ success: false, statusCode: 401 });
}); // The handler reads only ctx.key (the signing secret) and the request's
// headers, rawBody and payload, so these partial objects are cast to the
// full context and request types instead of building them out.
