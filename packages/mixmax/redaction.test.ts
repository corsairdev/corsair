import { mixmax } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from './client';

const logEvent = jest.mocked(logEventFromContext);
const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as never;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const loggedPayloads = (): Record<string, unknown>[] =>
	logEvent.mock.calls.map((call) => call[2] as Record<string, unknown>);

describe('Mixmax event history redaction', () => {
	beforeEach(() => {
		logEvent.mockReset().mockResolvedValue(null);
		request.mockReset().mockResolvedValue({});
	});

	it('never logs webhook action secrets when creating a rule action', async () => {
		await endpoints.rules.actions.create(ctx, {
			id: 'rule-1',
			type: 'postToWebhook',
			webhookId: 'hook-1',
			signingSecret: 'live-signing-secret-value',
			httpHeaders: [['authorization', 'Bearer live-credential']],
		});

		expect(request).toHaveBeenCalledTimes(1);
		for (const payload of loggedPayloads()) {
			expect(JSON.stringify(payload)).not.toContain(
				'live-signing-secret-value',
			);
			expect(JSON.stringify(payload)).not.toContain('live-credential');
			expect(payload['signingSecret']).toBeUndefined();
			expect(payload['httpHeaders']).toBeUndefined();
			expect(payload['webhookId']).toBeUndefined();
		}
		// The log stays useful: the rule id and action type are recorded.
		expect(loggedPayloads()[0]).toEqual({
			id: 'rule-1',
			type: 'postToWebhook',
		});
	});

	it('never logs the trigger payload (with its webhook secret) on rule create and update', async () => {
		request.mockResolvedValue({ _id: 'rule-1' });
		await endpoints.rules.create(ctx, {
			name: 'Before-meeting rule',
			trigger: {
				type: 'webhook',
				webhookId: 'hook-1',
				webhookSecret: 'live-webhook-secret-value',
			},
		} as never);
		await endpoints.rules.update(ctx, {
			id: 'rule-1',
			name: 'Renamed rule',
			trigger: {
				type: 'webhook',
				webhookId: 'hook-1',
				webhookSecret: 'live-webhook-secret-value',
			},
		} as never);

		for (const payload of loggedPayloads()) {
			expect(JSON.stringify(payload)).not.toContain(
				'live-webhook-secret-value',
			);
			expect(JSON.stringify(payload)).not.toContain('trigger');
		}
		expect(loggedPayloads()[0]).toEqual({ name: 'Before-meeting rule' });
		expect(loggedPayloads()[1]).toEqual({ id: 'rule-1', name: 'Renamed rule' });
	});

	it('never logs bodies or recipient addresses on message calls', async () => {
		request
			.mockResolvedValueOnce({ _id: 'msg-1' })
			// POST /v1/send answers 200 without a JSON body.
			.mockResolvedValueOnce(undefined);
		await endpoints.messages.create(ctx, {
			to: [{ email: 'alice@example.com' }],
			bcc: [{ email: 'hidden@example.com' }],
			subject: 'Private subject line',
			body: '<p>Private body text</p>',
		});
		await endpoints.messages.sendPlain(ctx, {
			message: {
				to: { address: 'ada@example.com' },
				subject: 'Private',
				html: '<p>Private plain body</p>',
			},
		});

		for (const payload of loggedPayloads()) {
			const serialized = JSON.stringify(payload);
			expect(serialized).not.toContain('example.com');
			expect(serialized).not.toContain('Private');
			expect(payload['body']).toBeUndefined();
			expect(payload['html']).toBeUndefined();
			expect(payload['to']).toBeUndefined();
			expect(payload['bcc']).toBeUndefined();
		}
		// Shape-only records keep the history useful without the content.
		expect(loggedPayloads()[0]).toEqual({ recipients: 2, hasBody: true });
		expect(loggedPayloads()[1]).toEqual({ hasHtml: true });
	});

	it('never logs template content or rendered email content on template calls', async () => {
		request.mockResolvedValue({ _id: 'snip-1' });
		request
			.mockResolvedValueOnce({ _id: 'snip-1' })
			// POST /v1/snippets/{id}/send answers 204.
			.mockResolvedValueOnce(undefined);
		await endpoints.snippets.update(ctx, {
			id: 'snip-1',
			title: 'Private template title',
			source: '<p>Private template body</p>',
		});
		await endpoints.snippets.send(ctx, {
			id: 'snip-1',
			to: [{ email: 'alice@example.com' }],
			variables: { greeting: 'Private variable content' },
		});

		for (const payload of loggedPayloads()) {
			const serialized = JSON.stringify(payload);
			expect(serialized).not.toContain('Private');
			expect(serialized).not.toContain('example.com');
			expect(payload['source']).toBeUndefined();
			expect(payload['title']).toBeUndefined();
			expect(payload['variables']).toBeUndefined();
		}
		expect(loggedPayloads()[0]).toEqual({ id: 'snip-1' });
		expect(loggedPayloads()[1]).toEqual({
			id: 'snip-1',
			recipients: 1,
			scheduled: false,
		});
	});
	it('never logs recipient, invitee, unsubscribe or CRM values on the other writes', async () => {
		request.mockResolvedValue(undefined);
		await endpoints.sequences.recipients.add(ctx, {
			id: 'seq-1',
			recipients: [
				{
					email: 'alice@example.com',
					variables: { firstName: 'Private variable' },
				},
			],
		} as never);
		await endpoints.unsubscribes.create(ctx, {
			email: 'bob@example.com',
			name: 'Private Name',
		});
		await endpoints.unsubscribes.create(ctx, {
			emails: ['carol@example.com', 'dan@example.com'],
		});
		await endpoints.teams.members.add(ctx, {
			id: 'team-1',
			members: [{ email: 'erin@example.com' }],
		} as never);
		await endpoints.salesforce.createContact(ctx, {
			Email: 'frank@example.com',
			LastName: 'Private',
		});
		await endpoints.salesforce.updateLead(ctx, {
			id: '00Q000000000001',
			Id: '00Q000000000001',
			Email: 'grace@example.com',
			Phone: '+1 555 0100',
		});

		const payloads = logEvent.mock.calls
			.filter((call) => !String(call[1]).endsWith('.outputMismatch'))
			.map((call) => call[2] as Record<string, unknown>);
		for (const payload of payloads) {
			const serialized = JSON.stringify(payload);
			expect(serialized).not.toContain('@');
			expect(serialized).not.toContain('Private');
			expect(serialized).not.toContain('555');
		}
		expect(payloads).toEqual([
			{ id: 'seq-1', recipients: 1, scheduled: false },
			{ addresses: 1 },
			{ addresses: 2 },
			{ id: 'team-1', members: 1 },
			{ fields: 2 },
			{ id: '00Q000000000001', fields: 3 },
		]);
	});
	it('never logs the address or search text on unsubscribe, team create and Salesforce lookups', async () => {
		// The mocked response is `{}`. A read rejects that after it has logged,
		// which is all this test looks at, so the rejection is swallowed.
		const ignoreOutput = () => undefined;
		await endpoints.unsubscribes
			.list(ctx, { email: 'ada@example.com' })
			.catch(ignoreOutput);
		await endpoints.unsubscribes.remove(ctx, { email: 'ada@example.com' });
		await endpoints.teams.create(ctx, {
			name: 'Sales',
			members: [{ email: 'grace@example.com', role: 'member' }],
		} as never);
		await endpoints.salesforce
			.getContactOrLead(ctx, { email: 'linus@example.com' } as never)
			.catch(ignoreOutput);
		await endpoints.salesforce
			.search(ctx, {
				type: 'Contact',
				q: 'Private Person',
				fields: 'Id,Name',
			} as never)
			.catch(ignoreOutput);

		const payloads = logEvent.mock.calls
			.filter((call) => !String(call[1]).endsWith('.outputMismatch'))
			.map((call) => call[2] as Record<string, unknown>);
		expect(payloads).toHaveLength(5);
		for (const payload of payloads) {
			const serialized = JSON.stringify(payload);
			expect(serialized).not.toContain('@');
			expect(serialized).not.toContain('Private');
		}
		// The log stays useful: what kind of call it was is still recorded.
		expect(payloads[0]).toMatchObject({ filteredByEmail: true });
		expect(payloads[1]).toEqual({ addresses: 1 });
		expect(payloads[2]).toMatchObject({ name: 'Sales', members: 1 });
		expect(payloads[4]).toMatchObject({ type: 'Contact' });
	});
});
