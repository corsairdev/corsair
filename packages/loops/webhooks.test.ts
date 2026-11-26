import { createHmac } from 'node:crypto';
import { loops } from './index';
import { SPEC_WEBHOOK_EXAMPLES } from './spec-examples-fixtures';
import { matchLoopsWebhook, verifyLoopsWebhook } from './webhooks';

// A made-up secret in Loops' format: whsec_ + base64 of the key bytes.
const KEY = Buffer.from('loops-test-signing-key-0123456789');
const SECRET = `whsec_${KEY.toString('base64')}`;
const NOW = 1_764_000_000_000;
const TS = String(NOW / 1000);

function sign(id: string, timestamp: string, body: string, key = KEY): string {
	return createHmac('sha256', key)
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
}

// unknown: each test passes the example payload it is checking.
function delivery(payload: unknown, headers: Record<string, string> = {}) {
	const rawBody = JSON.stringify(payload);
	return {
		payload,
		rawBody,
		body: rawBody,
		headers: {
			'webhook-id': 'msg_2test',
			'webhook-timestamp': TS,
			'webhook-signature': `v1,${sign('msg_2test', TS, rawBody)}`,
			...headers,
		},
	};
}

const created = SPEC_WEBHOOK_EXAMPLES.find(
	(e) => e.eventName === 'contact.created',
)!;

describe('verifyLoopsWebhook', () => {
	it('accepts a delivery signed with the whsec_ secret', () => {
		expect(verifyLoopsWebhook(delivery(created) as never, SECRET, NOW)).toEqual(
			{ valid: true },
		);
	});

	it('accepts any v1 entry while a rolled secret is still valid', () => {
		const req = delivery(created);
		const old = sign('msg_2test', TS, req.rawBody, Buffer.from('old-key'));
		req.headers['webhook-signature'] =
			`v1,${old} ${req.headers['webhook-signature']}`;
		expect(verifyLoopsWebhook(req as never, SECRET, NOW).valid).toBe(true);
	});

	it('refuses a changed body, a wrong secret and a non-v1 entry', () => {
		const tampered = delivery(created);
		tampered.rawBody = tampered.rawBody.replace('test', 'tset');
		expect(verifyLoopsWebhook(tampered as never, SECRET, NOW).valid).toBe(
			false,
		);
		expect(
			verifyLoopsWebhook(
				delivery(created) as never,
				`whsec_${Buffer.from('other').toString('base64')}`,
				NOW,
			).valid,
		).toBe(false);
		const req = delivery(created);
		req.headers['webhook-signature'] = req.headers['webhook-signature'].replace(
			'v1,',
			'v2,',
		);
		expect(verifyLoopsWebhook(req as never, SECRET, NOW).valid).toBe(false);
	});

	it('refuses a delivery more than five minutes off, so it cannot be replayed later', () => {
		expect(
			verifyLoopsWebhook(delivery(created) as never, SECRET, NOW + 301_000),
		).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old or too new',
		});
	});

	it('refuses when no secret is configured or headers are missing', () => {
		expect(verifyLoopsWebhook(delivery(created) as never, '', NOW).valid).toBe(
			false,
		);
		const req = delivery(created);
		const { 'webhook-id': _id, ...withoutId } = req.headers;
		expect(
			verifyLoopsWebhook({ ...req, headers: withoutId } as never, SECRET, NOW)
				.valid,
		).toBe(false);
	});
});

describe('Loops webhook routing', () => {
	it('claims Loops deliveries and not another provider on the same route', () => {
		expect(matchLoopsWebhook(delivery(created) as never)).toBe(true);
		expect(
			matchLoopsWebhook(
				delivery({ type: 'task_run.status', data: {} }) as never,
			),
		).toBe(false);
		expect(
			matchLoopsWebhook({
				headers: {},
				body: JSON.stringify(created),
			} as never),
		).toBe(false);
	});

	it('has one webhook per spec event, and each parses its spec example', async () => {
		const plugin = loops({ webhookSecret: SECRET });
		const hooks = plugin.webhooks as Record<
			string,
			Record<
				string,
				{
					match: (req: unknown) => boolean;
					handler: (ctx: unknown, req: unknown) => Promise<unknown>;
				}
			>
		>;
		const all = Object.values(hooks).flatMap((group) => Object.values(group));
		expect(all).toHaveLength(SPEC_WEBHOOK_EXAMPLES.length);

		for (const example of SPEC_WEBHOOK_EXAMPLES) {
			const req = {
				...delivery(example, {
					'webhook-timestamp': String(Math.floor(Date.now() / 1000)),
				}),
			};
			req.headers['webhook-signature'] =
				`v1,${sign('msg_2test', req.headers['webhook-timestamp'], req.rawBody)}`;
			const matching = all.filter((hook) => hook.match(req));
			expect([example.eventName, matching.length]).toEqual([
				example.eventName,
				1,
			]);
			const result = await matching[0]!.handler(
				{ key: SECRET, options: {}, db: {} },
				req,
			);
			expect(result).toEqual({ success: true, data: example });
		}
	});

	it('answers 401 to a delivery with a bad signature', async () => {
		const hook = loops().webhooks!.contact.created;
		const req = delivery(created, {
			'webhook-timestamp': String(Math.floor(Date.now() / 1000)),
		});
		const result = await hook.handler(
			{ key: SECRET, options: {}, db: {} } as never,
			req as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});
});
