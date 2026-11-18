import { createHash, createHmac } from 'node:crypto';
import {
	API_KEY,
	clientIdDelivery,
	consentDelivery,
	domainDelivery,
	mailboxDelivery,
	PLAINTEXT_APP_PASSWORD,
	PLAINTEXT_PASSWORD,
	PLAINTEXT_SECRET,
	SIGNATURE,
	signedHeaders,
	TEAM_ID,
} from './test-fixtures';
import { StatusWebhooks } from './webhooks';
import { matchInboxkitTenantWebhook } from './webhooks/tenant-matcher';
import {
	isInboxkitWebhook,
	removeCredentials,
	verifyInboxkitSignature,
} from './webhooks/types';

// unknown: handlers read ctx.key and optional ctx.db; the rest is the runtime's.
const ctx = (key: string | undefined = API_KEY, db?: unknown) =>
	({ key, db, $getAccountId: async () => 'account' }) as never;

const request = (
	// unknown: a delivery of any shape.
	payload: unknown,
	headers: Record<string, string> = signedHeaders('any'),
	extra: Record<string, unknown> = {},
) =>
	({
		payload,
		headers,
		rawBody: JSON.stringify(payload),
		...extra,
	}) as never;

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('the signature fixture', () => {
	it('is sha256= and the SHA-256 of the key', () => {
		expect(SIGNATURE).toBe(
			`sha256=${createHash('sha256').update(API_KEY).digest('hex')}`,
		);
	});
});

describe('verifyInboxkitSignature', () => {
	const headers = (signature: string) => ({
		'x-inboxkit-signature': signature,
	});

	it('accepts sha256= and the hex SHA-256 of the key', () => {
		expect(
			verifyInboxkitSignature(
				headers(`sha256=${createHash('sha256').update(API_KEY).digest('hex')}`),
				API_KEY,
			),
		).toEqual({ valid: true });
	});

	it('trims a stray newline from the key, the mistake the docs warn about', () => {
		expect(
			verifyInboxkitSignature(headers(SIGNATURE), `${API_KEY}\n`).valid,
		).toBe(true);
	});

	it('reads the header in any case', () => {
		expect(
			verifyInboxkitSignature({ 'X-InboxKit-Signature': SIGNATURE }, API_KEY)
				.valid,
		).toBe(true);
	});

	it.each([
		[
			'another key',
			`sha256=${createHash('sha256').update('other').digest('hex')}`,
		],
		[
			'an HMAC, which the old docs described',
			`sha256=${createHmac('sha256', API_KEY).update('{}').digest('hex')}`,
		],
		['no prefix', createHash('sha256').update(API_KEY).digest('hex')],
		[
			'upper-case hex',
			`sha256=${createHash('sha256').update(API_KEY).digest('hex').toUpperCase()}`,
		],
		['too short', 'sha256=abc'],
		['empty', ''],
	])('refuses %s', (_label, signature) => {
		expect(verifyInboxkitSignature(headers(signature), API_KEY).valid).toBe(
			false,
		);
	});

	it('refuses a missing header', () => {
		expect(verifyInboxkitSignature({}, API_KEY)).toEqual({
			valid: false,
			error: 'no x-inboxkit-signature header',
		});
	});

	it('refuses when there is no key to check against', () => {
		expect(verifyInboxkitSignature(headers(SIGNATURE), '  ')).toEqual({
			valid: false,
			error: 'no API key to check against',
		});
	});
});

describe('removeCredentials', () => {
	it('removes each credential field, at any depth, in place', () => {
		const delivery = {
			password: 'a',
			app_password: 'b',
			secret: 'c',
			refresh_token: 'd',
			access_token: 'e',
			totp_secret: 'f',
			keep: 1,
			nested: { password: 'g', keep: 2, list: [{ secret: 'h', keep: 3 }] },
		};
		removeCredentials(delivery);
		expect(delivery).toEqual({
			keep: 1,
			nested: { keep: 2, list: [{ keep: 3 }] },
		});
	});

	it('leaves other values alone', () => {
		expect(() => removeCredentials('text')).not.toThrow();
		expect(() => removeCredentials(null)).not.toThrow();
		const list = [1, 2];
		removeCredentials(list);
		expect(list).toEqual([1, 2]);
	});
});

describe('matching', () => {
	// unknown: a delivery of any shape.
	const raw = (body: unknown) => ({ headers: {}, body }) as never;

	it.each([
		['domainStatusChanged', domainDelivery],
		['mailboxStatusChanged', mailboxDelivery],
		['consentRequestStatusChanged', consentDelivery],
		['clientIdRequestStatusChanged', clientIdDelivery],
	] as const)('%s takes only its own event', (name, delivery) => {
		for (const [other, webhook] of Object.entries(StatusWebhooks)) {
			expect(webhook.match(raw(delivery))).toBe(other === name);
		}
		expect(isInboxkitWebhook(raw(delivery))).toBe(true);
	});

	it.each([
		[{ event: 'something.else' }],
		[{ type: 'domain.status_changed' }],
		[{}],
		['not json'],
	])('%j is not InboxKit’s', (body) => {
		expect(isInboxkitWebhook(raw(body))).toBe(false);
	});
});

describe('handlers', () => {
	it('return the event once verified', async () => {
		const result = await StatusWebhooks.domainStatusChanged.handler(
			ctx(),
			request(domainDelivery),
		);
		expect(result).toMatchObject({
			success: true,
			data: { event: 'domain.status_changed', team_id: TEAM_ID },
		});
	});

	it.each([
		[
			'a wrong signature',
			ctx(),
			request(domainDelivery, signedHeaders('x', 'sha256=bad')),
		],
		['no signature', ctx(), request(domainDelivery, {})],
		['no key to check with', ctx(''), request(domainDelivery)],
	])(
		'throw on %s, so the delivery is retried rather than acknowledged',
		async (_label, context, delivery) => {
			await expect(
				StatusWebhooks.domainStatusChanged.handler(context, delivery),
			).rejects.toThrow('InboxKit webhook refused');
		},
	);

	it('skip the check only when the Hub has verified the delivery', async () => {
		await expect(
			StatusWebhooks.domainStatusChanged.handler(
				ctx(''),
				request(domainDelivery, {}, { hubVerified: true }),
			),
		).resolves.toMatchObject({ success: true });
	});

	it.each([
		['a missing uid', { event: 'domain.status_changed', data: { domain: {} } }],
		['no data', { event: 'domain.status_changed' }],
		[
			'the wrong event',
			{ event: 'mailbox.status_changed', data: { domain: { uid: 'a' } } },
		],
	])('refuse %s', async (_label, payload) => {
		await expect(
			StatusWebhooks.domainStatusChanged.handler(ctx(), request(payload)),
		).rejects.toThrow('does not match the webhook envelope');
	});

	it('accept any body with a good signature: it covers none of the delivery', async () => {
		// InboxKit's design, stated in the docs: this is why HTTPS matters here and
		// why events are prompts to look rather than facts.
		const altered = {
			...domainDelivery,
			data: {
				...domainDelivery.data,
				domain: { ...domainDelivery.data.domain, status: 'deleted' },
			},
		};
		await expect(
			StatusWebhooks.domainStatusChanged.handler(ctx(), request(altered)),
		).resolves.toMatchObject({ success: true });
	});

	it('still succeed when the local save fails: the row is only a local copy', async () => {
		const db = {
			domains: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockRejectedValue(new Error('disk full')),
			},
		};
		await expect(
			StatusWebhooks.domainStatusChanged.handler(
				ctx(API_KEY, db),
				request(domainDelivery),
			),
		).resolves.toMatchObject({ success: true });
		expect(db.domains.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('handle consent and client ID requests', async () => {
		await expect(
			StatusWebhooks.consentRequestStatusChanged.handler(
				ctx(),
				request(consentDelivery),
			),
		).resolves.toMatchObject({
			data: { data: { consent_request: { status: 'pending' } } },
		});
		await expect(
			StatusWebhooks.clientIdRequestStatusChanged.handler(
				ctx(),
				request(clientIdDelivery),
			),
		).resolves.toMatchObject({
			data: { data: { client_id_request: { status: 'completed' } } },
		});
	});
});

describe('mailbox credentials go no further than the handler', () => {
	it('leaves them out of what it returns', async () => {
		const result = await StatusWebhooks.mailboxStatusChanged.handler(
			ctx(),
			request(mailboxDelivery),
		);
		const text = JSON.stringify(result);
		expect(text).not.toContain(PLAINTEXT_PASSWORD);
		expect(text).not.toContain(PLAINTEXT_APP_PASSWORD);
		expect(text).not.toContain(PLAINTEXT_SECRET);
		expect(result).toMatchObject({
			data: { data: { mailbox: { uid: mailboxDelivery.data.mailbox.uid } } },
		});
	});

	it('takes them out of the delivery itself, which processWebhook hands back', async () => {
		const delivery = structuredClone(mailboxDelivery);
		const incoming = request(delivery);
		await StatusWebhooks.mailboxStatusChanged.handler(ctx(), incoming);
		expect(JSON.stringify(delivery)).not.toContain(PLAINTEXT_PASSWORD);
		expect(JSON.stringify(incoming)).not.toContain(PLAINTEXT_PASSWORD);
		expect(JSON.stringify(incoming)).not.toContain(PLAINTEXT_SECRET);
	});

	it('takes them out of a delivery it refuses, too', async () => {
		const delivery = structuredClone(mailboxDelivery);
		await expect(
			StatusWebhooks.mailboxStatusChanged.handler(
				ctx(),
				request(delivery, signedHeaders('x', 'sha256=rotated')),
			),
		).rejects.toThrow('refused');
		expect(JSON.stringify(delivery)).not.toContain(PLAINTEXT_PASSWORD);
	});

	it('does not store them', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const findByEntityId = jest.fn().mockResolvedValue(null);
		await StatusWebhooks.mailboxStatusChanged.handler(
			ctx(API_KEY, { mailboxes: { findByEntityId, upsertByEntityId } }),
			request(mailboxDelivery),
		);
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		const text = JSON.stringify(upsertByEntityId.mock.calls);
		expect(text).toContain('jane@example.com');
		expect(text).not.toContain(PLAINTEXT_PASSWORD);
		expect(text).not.toContain(PLAINTEXT_APP_PASSWORD);
		expect(text).not.toContain(PLAINTEXT_SECRET);
	});

	it('does not log them', async () => {
		const spies = [
			jest.spyOn(console, 'log'),
			jest.spyOn(console, 'warn'),
			jest.spyOn(console, 'error'),
		];
		await StatusWebhooks.mailboxStatusChanged.handler(
			ctx(),
			request(mailboxDelivery),
		);
		const text = JSON.stringify(spies.flatMap((spy) => spy.mock.calls));
		expect(text).not.toContain(PLAINTEXT_PASSWORD);
	});
});

describe('matchInboxkitTenantWebhook', () => {
	// unknown: a delivery of any shape.
	const raw = (body: unknown) => ({ headers: {}, body }) as never;

	it('routes by the team a delivery names', () => {
		expect(matchInboxkitTenantWebhook(raw(domainDelivery))).toEqual({
			linkType: 'tenant_external_id',
			externalId: TEAM_ID,
		});
	});

	it.each([[{}], [{ team_id: '' }], ['not json']])(
		'finds no tenant in %j',
		(body) => {
			expect(matchInboxkitTenantWebhook(raw(body))).toBeNull();
		},
	);
});
