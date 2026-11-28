import { createHmac } from 'node:crypto';
import { docuseal } from './index';
import {
	DOCUSEAL_SIGNATURE_TOLERANCE_SECONDS,
	docuSealWebhooksNested,
	isDocuSealDelivery,
	verifyDocuSealWebhook,
	webhookIdFor,
} from './webhooks';

const SECRET = 'whsec_dGVzdC1zZWNyZXQtZm9yLWRvY3VzZWFsLXRlc3Rz';
const NOW = 1_764_320_000;

function sign(body: string, timestamp = NOW, secret = SECRET): string {
	const digest = createHmac('sha256', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
	return `${timestamp}.${digest}`;
}

// Shaped like a real form.completed delivery from self-hosted DocuSeal 3.4.0
// (11-28), with the personal fields replaced.
const formCompleted = {
	event_type: 'form.completed',
	timestamp: '2026-11-28T09:30:00Z',
	data: {
		id: 7,
		submission_id: 4,
		email: 'signer@example.com',
		role: 'First Party',
		status: 'completed',
		completed_at: '2026-11-28T09:29:59Z',
		values: [{ field: 'Name', value: 'Test Signer' }],
		documents: [{ name: 'doc', url: 'http://localhost:3000/file/x.pdf' }],
		submission: { id: 4, status: 'completed', url: 'http://x/e/abc' },
		template: { id: 3, name: 'Corsair live test' },
		some_new_field: true,
	},
};

function delivery(payload: object, signature?: string) {
	const rawBody = JSON.stringify(payload);
	return {
		payload,
		rawBody,
		headers: {
			'content-type': 'application/json',
			'user-agent': 'DocuSeal.com Webhook',
			...(signature === undefined
				? {
						'x-docuseal-signature': sign(
							rawBody,
							Math.floor(Date.now() / 1000),
						),
					}
				: signature
					? { 'x-docuseal-signature': signature }
					: {}),
		},
	};
}

describe('verifyDocuSealWebhook', () => {
	const rawBody = JSON.stringify(formCompleted);
	const base = { payload: formCompleted, rawBody };

	it('accepts a delivery signed with the secret', () => {
		const headers = { 'x-docuseal-signature': sign(rawBody) };
		expect(verifyDocuSealWebhook({ ...base, headers }, SECRET, NOW)).toEqual({
			valid: true,
		});
	});

	it('rejects a body changed after signing', () => {
		const headers = { 'x-docuseal-signature': sign(rawBody) };
		const result = verifyDocuSealWebhook(
			{ ...base, rawBody: rawBody.replace('completed', 'declined'), headers },
			SECRET,
			NOW,
		);
		expect(result.valid).toBe(false);
	});

	it('rejects a delivery signed with another secret', () => {
		const headers = {
			'x-docuseal-signature': sign(rawBody, NOW, 'whsec_other'),
		};
		expect(verifyDocuSealWebhook({ ...base, headers }, SECRET, NOW)).toEqual({
			valid: false,
			error: 'Invalid DocuSeal webhook signature',
		});
	});

	it('rejects a timestamp outside the five-minute window, both ways', () => {
		const old = NOW - DOCUSEAL_SIGNATURE_TOLERANCE_SECONDS - 1;
		const future = NOW + DOCUSEAL_SIGNATURE_TOLERANCE_SECONDS + 1;
		for (const ts of [old, future]) {
			const headers = { 'x-docuseal-signature': sign(rawBody, ts) };
			expect(
				verifyDocuSealWebhook({ ...base, headers }, SECRET, NOW).valid,
			).toBe(false);
		}
		const edge = { 'x-docuseal-signature': sign(rawBody, old + 1) };
		expect(
			verifyDocuSealWebhook({ ...base, headers: edge }, SECRET, NOW).valid,
		).toBe(true);
	});

	it.each(['', 'abc', '.abc', 'notanumber.abc', '123.'])(
		'rejects a malformed header %p',
		(header) => {
			const headers = header ? { 'x-docuseal-signature': header } : {};
			expect(
				verifyDocuSealWebhook({ ...base, headers }, SECRET, NOW).valid,
			).toBe(false);
		},
	);

	it('needs a secret and the raw body', () => {
		const headers = { 'x-docuseal-signature': sign(rawBody) };
		expect(
			verifyDocuSealWebhook({ ...base, headers }, undefined, NOW).valid,
		).toBe(false);
		expect(
			verifyDocuSealWebhook({ payload: formCompleted, headers }, SECRET, NOW)
				.valid,
		).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifyDocuSealWebhook(
				{ payload: formCompleted, headers: {}, hubVerified: true },
				undefined,
				NOW,
			),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	it('maps every DocuSeal event type to one webhook', () => {
		expect(webhookIdFor('form.completed')).toBe('formCompleted');
		expect(webhookIdFor('submission.expired')).toBe('submissionExpired');
		expect(webhookIdFor('template.archived')).toBe('templateArchived');
		expect(webhookIdFor('form.unknown')).toBeUndefined();
	});

	it('claims a delivery only with the signature header and a known event', () => {
		const headers = { 'x-docuseal-signature': '1.abc' };
		expect(isDocuSealDelivery({ headers, body: formCompleted })).toBe(true);
		expect(
			isDocuSealDelivery({ headers, body: JSON.stringify(formCompleted) }),
		).toBe(true);
		expect(isDocuSealDelivery({ headers: {}, body: formCompleted })).toBe(
			false,
		);
		expect(isDocuSealDelivery({ headers, body: { event_type: 'push' } })).toBe(
			false,
		);
		expect(isDocuSealDelivery({ headers, body: 'not json' })).toBe(false);
	});

	it('routes a delivery to the webhook of its event type only', () => {
		const request = { headers: {}, body: formCompleted };
		expect(docuSealWebhooksNested.form.completed.match(request)).toBe(true);
		expect(docuSealWebhooksNested.form.viewed.match(request)).toBe(false);
		expect(docuSealWebhooksNested.submission.completed.match(request)).toBe(
			false,
		);
	});
});

describe('handler', () => {
	// The handler only reads key and log hooks from the context.
	function ctx(key: string) {
		return { key, $log: undefined } as never;
	}

	it('returns the parsed delivery, keeping fields DocuSeal adds', async () => {
		const result = await docuSealWebhooksNested.form.completed.handler(
			ctx(SECRET),
			delivery(formCompleted) as never,
		);
		expect(result.success).toBe(true);
		if (!result.success) throw new Error(result.error);
		expect(result.data?.data.id).toBe(7);
		expect(result.data?.data.submission?.id).toBe(4);
		expect((result.data?.data as Record<string, unknown>).some_new_field).toBe(
			true,
		);
	});

	it('answers 401 for a bad signature without parsing the body', async () => {
		const result = await docuSealWebhooksNested.form.completed.handler(
			ctx(SECRET),
			delivery(formCompleted, `${NOW}.deadbeef`) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('answers 400 for a payload that is not the documented shape, naming paths only', async () => {
		const bad = { ...formCompleted, data: { email: 'signer@example.com' } };
		const result = await docuSealWebhooksNested.form.completed.handler(
			ctx(SECRET),
			delivery(bad) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
		if (result.success) throw new Error('expected failure');
		expect(result.error).toContain('data.id');
		expect(result.error).not.toContain('signer@example.com');
	});

	it('parses submission and template events', async () => {
		const submission = {
			event_type: 'submission.created',
			timestamp: '2026-11-28T09:30:00Z',
			data: { id: 4, status: 'pending', submitters: [], template: { id: 3 } },
		};
		const template = {
			event_type: 'template.updated',
			timestamp: '2026-11-28T09:30:00Z',
			data: { id: 3, name: 'Corsair live test', fields: [] },
		};
		const a = await docuSealWebhooksNested.submission.created.handler(
			ctx(SECRET),
			delivery(submission) as never,
		);
		const b = await docuSealWebhooksNested.template.updated.handler(
			ctx(SECRET),
			delivery(template) as never,
		);
		expect(a.success && b.success).toBe(true);
	});
});

describe('plugin wiring', () => {
	it('exposes the webhook schemas with descriptions', () => {
		const plugin = docuseal();
		for (const entry of Object.values(plugin.webhookSchemas ?? {})) {
			expect(entry.description).toContain('event_type');
			expect(entry.payload).toBeDefined();
		}
	});
});
