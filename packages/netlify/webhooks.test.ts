import { createHash, createHmac } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import {
	isNetlifyDelivery,
	netlify,
	netlifyEventTypeOf,
	verifyNetlifyWebhook,
} from './index';
import { netlifyWebhooksNested } from './webhooks';

// Real deliveries from Netlify (live 11-27), one per X-Netlify-Event, with
// their event headers; each test signs the body itself the way Netlify does.
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

const b64 = (value: string | Buffer) =>
	Buffer.from(value).toString('base64url');

/** A JWS like Netlify's: HS256 over {iss, sha256 of the body}. */
function jws(
	body: string,
	secret = SECRET,
	claims: Record<string, unknown> = {},
	alg = 'HS256',
) {
	const head = b64(JSON.stringify({ typ: 'JWT', alg }));
	const payload = b64(
		JSON.stringify({
			iss: 'netlify',
			sha256: createHash('sha256').update(body).digest('hex'),
			...claims,
		}),
	);
	const signature = createHmac('sha256', secret)
		.update(`${head}.${payload}`)
		.digest('base64url');
	return `${head}.${payload}.${signature}`;
}

function signed(name: string, secret = SECRET) {
	const delivery = deliveries[name] as Delivery;
	const body = JSON.stringify(delivery.body);
	return {
		body,
		headers: { ...delivery.headers, 'x-webhook-signature': jws(body, secret) },
	};
}

const corsair = (webhookSecret = SECRET) =>
	createCorsair({ plugins: [netlify({ key: 'nfp_test', webhookSecret })] });

describe('routing', () => {
	it('sends each real delivery to the deploy webhook', async () => {
		expect(Object.keys(deliveries).sort()).toEqual([
			'deploy_created',
			'deploy_failed',
			'deploy_locked',
			'deploy_unlocked',
		]);
		for (const name of Object.keys(deliveries)) {
			const { headers, body } = signed(name);
			const result = await processWebhook(corsair(), headers, body);
			expect([
				name,
				result.plugin,
				result.action,
				result.response?.success,
			]).toEqual([name, 'netlify', 'deploy', true]);
		}
	});

	it('routes submissions, split tests and dev servers by X-Netlify-Event', async () => {
		const cases: Array<[string, string, Record<string, unknown>]> = [
			[
				'submission_created',
				'submission',
				{ id: 's1', form_id: 'f1', email: 'ada@example.com', data: {} },
			],
			['split_test_activated', 'splitTest', { id: 't1', active: true }],
			['dev_server_live', 'devServer', { id: 'd1', state: 'live' }],
		];
		for (const [event, action, payload] of cases) {
			const body = JSON.stringify(payload);
			const result = await processWebhook(
				corsair(),
				{
					'content-type': 'application/json',
					'x-netlify-event': event,
					'x-webhook-signature': jws(body),
				},
				body,
			);
			expect([event, result.action, result.response?.success]).toEqual([
				event,
				action,
				true,
			]);
		}
	});

	it('returns the delivery parsed, unknown fields kept', async () => {
		const { headers, body } = signed('deploy_failed');
		const handler = netlifyWebhooksNested.deploy.handler;
		// `unknown` because the handler reads only the key (and logs through the context).
		const ctx = { key: SECRET } as unknown as Parameters<typeof handler>[0];
		const result = await handler(ctx, {
			payload: { ...JSON.parse(body), extra_field: 1 },
			headers,
			rawBody: body,
		});
		const data = result.data as unknown as Record<string, unknown>;
		expect(result.success).toBe(true);
		expect(data.state).toBe('error');
		expect(data.extra_field).toBe(1);
		expect(typeof data.site_id).toBe('string');
	});

	it('only claims deliveries with a Netlify event it handles', () => {
		expect(
			netlifyEventTypeOf({ headers: { 'x-netlify-event': 'deploy_created' } }),
		).toBe('deploy_created');
		expect(
			isNetlifyDelivery({
				headers: { 'x-netlify-event': 'deploy_building' },
				body: {},
			}),
		).toBe(true);
		expect(
			isNetlifyDelivery({
				headers: { 'x-netlify-event': 'site_created' },
				body: {},
			}),
		).toBe(false);
		expect(
			isNetlifyDelivery({ headers: { 'x-github-event': 'push' }, body: {} }),
		).toBe(false);
	});
});

describe('signatures', () => {
	it('refuses an unsigned, wrongly signed or tampered delivery with 401', async () => {
		const { headers, body } = signed('deploy_created');
		const { 'x-webhook-signature': _drop, ...unsigned } = headers;
		const missing = await processWebhook(corsair(), unsigned, body);
		expect(missing.response).toEqual({
			success: false,
			statusCode: 401,
			error: 'Missing X-Webhook-Signature header',
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
			body.replace('"state":"', '"state":"x'),
		);
		expect(tampered.response).toMatchObject({
			statusCode: 401,
			error: 'Netlify signature does not match the body',
		});
	});

	it('refuses another algorithm, another issuer and a malformed token', () => {
		const body = '{"id":"d1"}';
		const check = (token: string) =>
			verifyNetlifyWebhook(
				{
					payload: {},
					rawBody: body,
					headers: { 'x-webhook-signature': token },
				},
				SECRET,
			);
		expect(check(jws(body))).toEqual({ valid: true });
		expect(check(jws(body, SECRET, {}, 'none'))).toEqual({
			valid: false,
			error: 'Unexpected Netlify signature algorithm',
		});
		expect(check(jws(body, SECRET, { iss: 'someone-else' }))).toEqual({
			valid: false,
			error: 'Netlify signature has the wrong issuer',
		});
		expect(check('not-a-jwt').valid).toBe(false);
		expect(check('a.b!.c').valid).toBe(false);
		expect(
			verifyNetlifyWebhook(
				{
					payload: {},
					rawBody: body,
					headers: { 'x-webhook-signature': jws(body) },
				},
				undefined,
			).valid,
		).toBe(false);
	});

	it('refuses a payload that breaks its documented types, naming paths only', async () => {
		const delivery = deliveries.deploy_created as Delivery;
		const body = JSON.stringify({
			...delivery.body,
			title: 42,
			name: { secret: 'x' },
		});
		const result = await processWebhook(
			corsair(),
			{ ...delivery.headers, 'x-webhook-signature': jws(body) },
			body,
		);
		expect(result.response?.statusCode).toBe(400);
		expect(result.response?.error).toContain('title');
		expect(result.response?.error).not.toContain('secret');
	});
});
