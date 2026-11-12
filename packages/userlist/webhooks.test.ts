import { createHmac } from 'node:crypto';
import {
	companyCreated,
	companyUpdated,
	formSubmitted,
	malformed,
	messageBounced,
	messageClicked,
	messageEnqueued,
	messageOpened,
	messageReported,
	relationshipCreated,
	relationshipUpdated,
	userCreated,
	userSubscribed,
	userUnsubscribed,
	userUpdated,
} from './test-fixtures';
import { WEBHOOK_SECRET } from './test-support';
import { UserlistWebhooks } from './webhooks';
import {
	createUserlistMatch,
	USERLIST_WEBHOOK_EVENTS,
	verifyUserlistWebhookSignature,
} from './webhooks/types';

const NOW = Math.floor(Date.now() / 1000);

function sign(body: string, timestamp = NOW, secret = WEBHOOK_SECRET) {
	const signature = createHmac('sha256', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
	return `t=${timestamp},v1=${signature}`;
}

/** A request as the host would hand it to a handler. */
function request(body: unknown, options: { signature?: string } = {}) {
	const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
	return {
		payload: typeof body === 'string' ? JSON.parse(body) : body,
		rawBody,
		// The matcher reads `body`, the handler reads `payload`.
		body: rawBody,
		headers: {
			'x-userlist-signature': options.signature ?? sign(rawBody),
		},
	};
}

const context = { key: WEBHOOK_SECRET } as never;

describe('verifyUserlistWebhookSignature', () => {
	it('accepts a signature over the timestamp and raw body', () => {
		const rawBody = JSON.stringify(userCreated);
		const result = verifyUserlistWebhookSignature(
			request(userCreated) as never,
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: true });
		expect(rawBody.length).toBeGreaterThan(0);
	});

	it('refuses without a secret', () => {
		const result = verifyUserlistWebhookSignature(
			request(userCreated) as never,
			undefined,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Missing webhook secret');
	});

	it('refuses without a raw body', () => {
		const result = verifyUserlistWebhookSignature(
			{ payload: userCreated, headers: {} } as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing raw body');
	});

	it('refuses without the signature header', () => {
		const result = verifyUserlistWebhookSignature(
			{
				payload: userCreated,
				rawBody: JSON.stringify(userCreated),
				headers: {},
			} as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing X-Userlist-Signature');
	});

	it('refuses a header without a timestamp', () => {
		const result = verifyUserlistWebhookSignature(
			{
				payload: userCreated,
				rawBody: JSON.stringify(userCreated),
				headers: { 'x-userlist-signature': 'v1=abc' },
			} as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing t');
	});

	it('refuses a header without a v1 signature', () => {
		const result = verifyUserlistWebhookSignature(
			{
				payload: userCreated,
				rawBody: JSON.stringify(userCreated),
				headers: { 'x-userlist-signature': `t=${NOW}` },
			} as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing v1');
	});

	it('refuses a wrong signature', () => {
		const result = verifyUserlistWebhookSignature(
			request(userCreated, {
				signature: `t=${NOW},v1=${'0'.repeat(64)}`,
			}) as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Incorrect signature');
	});

	it('refuses a signature made with another secret', () => {
		const rawBody = JSON.stringify(userCreated);
		const result = verifyUserlistWebhookSignature(
			request(userCreated, { signature: sign(rawBody, NOW, 'other') }) as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('refuses a stale timestamp, so a captured request cannot be replayed', () => {
		const rawBody = JSON.stringify(userCreated);
		const stale = NOW - 600;
		const result = verifyUserlistWebhookSignature(
			request(userCreated, { signature: sign(rawBody, stale) }) as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('outside tolerance');
	});

	it('refuses a body changed after signing', () => {
		const original = JSON.stringify(userCreated);
		const signature = sign(original);
		const tampered = original.replace('user-123', 'user-999');
		const result = verifyUserlistWebhookSignature(
			{
				payload: JSON.parse(tampered),
				rawBody: tampered,
				headers: { 'x-userlist-signature': signature },
			} as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('reads the header when it arrives as an array', () => {
		const rawBody = JSON.stringify(userCreated);
		const result = verifyUserlistWebhookSignature(
			{
				payload: userCreated,
				rawBody,
				headers: { 'x-userlist-signature': [sign(rawBody)] },
			} as never,
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(true);
	});
});

describe('createUserlistMatch', () => {
	it('matches on the name field', () => {
		expect(
			createUserlistMatch('user_created')({
				body: JSON.stringify(userCreated),
			} as never),
		).toBe(true);
	});

	it('does not match another topic', () => {
		expect(
			createUserlistMatch('user_updated')({
				body: JSON.stringify(userCreated),
			} as never),
		).toBe(false);
	});

	it('parses a body that arrives as a string', () => {
		const match = createUserlistMatch('user_created');
		expect(match({ body: JSON.stringify(userCreated) } as never)).toBe(true);
	});

	it('does not match a body that will not parse', () => {
		const match = createUserlistMatch('user_created');
		expect(match({ body: 'not json' } as never)).toBe(false);
	});
});

describe('webhook topics', () => {
	it('documents every topic the handlers cover', () => {
		expect(Object.keys(UserlistWebhooks).length).toBe(
			USERLIST_WEBHOOK_EVENTS.length,
		);
	});

	it('has a handler for each documented name', () => {
		const handlerNames = Object.keys(UserlistWebhooks);
		expect(handlerNames.sort()).toEqual([
			'companyCreated',
			'companyUpdated',
			'formSubmitted',
			'messageBounced',
			'messageClicked',
			'messageEnqueued',
			'messageOpened',
			'messageReported',
			'relationshipCreated',
			'relationshipUpdated',
			'userCreated',
			'userSubscribed',
			'userUnsubscribed',
			'userUpdated',
		]);
	});
});

describe('webhook handlers', () => {
	it.each([
		['userCreated', userCreated],
		['userUpdated', userUpdated],
		['userSubscribed', userSubscribed],
		['userUnsubscribed', userUnsubscribed],
		['companyCreated', companyCreated],
		['companyUpdated', companyUpdated],
		['relationshipCreated', relationshipCreated],
		['relationshipUpdated', relationshipUpdated],
		['formSubmitted', formSubmitted],
		['messageEnqueued', messageEnqueued],
		['messageOpened', messageOpened],
		['messageClicked', messageClicked],
		['messageBounced', messageBounced],
		['messageReported', messageReported],
	] as const)('handles %s and returns the payload', async (name, payload) => {
		const webhook = UserlistWebhooks[name];
		const result = await webhook.handler(context, request(payload) as never);

		expect(result.success).toBe(true);
		expect(result).toHaveProperty('data');
	});

	it.each([
		['userCreated', userCreated],
		['companyCreated', companyCreated],
		['messageOpened', messageOpened],
	] as const)('rejects %s with a bad signature', async (name, payload) => {
		const webhook = UserlistWebhooks[name];
		const result = await webhook.handler(
			context,
			request(payload, { signature: `t=${NOW},v1=${'0'.repeat(64)}` }) as never,
		);

		expect(result).toMatchObject({
			success: false,
			statusCode: 401,
		});
	});

	it.each([
		['userCreated', userCreated],
		['relationshipCreated', relationshipCreated],
		['messageOpened', messageOpened],
	] as const)(
		'accepts %s that the Hub already verified, when no key was built',
		async (name, payload) => {
			const webhook = UserlistWebhooks[name];
			const result = await webhook.handler(
				{ key: undefined } as never,
				{
					...request(payload, { signature: 'not-checked' }),
					hubVerified: true,
				} as never,
			);

			expect(result.success).toBe(true);
		},
	);

	it('still checks the signature when hubVerified is absent', async () => {
		const result = await UserlistWebhooks.userCreated.handler(
			{ key: undefined } as never,
			request(userCreated) as never,
		);

		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('keeps the fields Userlist documents for each payload', async () => {
		const subscribed = await UserlistWebhooks.userSubscribed.handler(
			context,
			request(userSubscribed) as never,
		);
		expect(subscribed).toMatchObject({
			success: true,
			data: { properties: userSubscribed.properties },
		});

		const related = await UserlistWebhooks.relationshipCreated.handler(
			context,
			request(relationshipCreated) as never,
		);
		expect(related).toMatchObject({
			success: true,
			data: {
				user: { identifier: 'user-123' },
				company: { identifier: 'company-42' },
				relationship: { properties: { role: 'admin' } },
			},
		});

		const clicked = await UserlistWebhooks.messageClicked.handler(
			context,
			request(messageClicked) as never,
		);
		expect(clicked).toMatchObject({
			success: true,
			data: {
				properties: messageClicked.properties,
				user: { identifier: 'user-123' },
			},
		});

		const bounced = await UserlistWebhooks.messageBounced.handler(
			context,
			request(messageBounced) as never,
		);
		expect(bounced).toMatchObject({
			success: true,
			data: { properties: { bounce_type: 'hard' } },
		});
	});

	it('rejects a payload missing the object it promises', async () => {
		const result = await UserlistWebhooks.userCreated.handler(
			context,
			request(malformed) as never,
		);

		expect(result).toMatchObject({
			success: false,
			statusCode: 400,
		});
	});

	it('rejects a body that is not JSON at all', async () => {
		const result = await UserlistWebhooks.userCreated.handler(context, {
			payload: undefined,
			rawBody: 'not json',
			headers: { 'x-userlist-signature': sign('not json') },
		} as never);

		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('matches its own topic only', () => {
		const updated = { body: JSON.stringify(userUpdated) };
		const created = { body: JSON.stringify(userCreated) };
		expect(UserlistWebhooks.userCreated.match(updated as never)).toBe(false);
		expect(UserlistWebhooks.userCreated.match(created as never)).toBe(true);
	});
});
