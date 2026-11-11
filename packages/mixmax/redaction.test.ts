import { MeetingTypes } from './endpoints';
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
// context service is untouched by these code paths. `as never` stands in
// for MixmaxContext, whose database, key store and event services would
// need core's runtime to build, and the request and logger are mocked.
//
// Inputs below are also cast `as never` where a test sends only the fields
// it checks: these tests look at what reaches the event log, so filling in
// every required field of the provider's schema would add nothing.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as never;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

// logEventFromContext types its payload as `unknown`; every Mixmax handler
// passes a plain object, which this cast states once for all the tests.
const payloadOf = (call: unknown[]): Record<string, unknown> =>
	call[2] as Record<string, unknown>;

const loggedPayloads = (): Record<string, unknown>[] =>
	logEvent.mock.calls.map(payloadOf);

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
			.map(payloadOf);
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
			.map(payloadOf);
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

	// One sweep over every other handler whose input can carry an address,
	// search text or user content. Each call gets the same markers, and no
	// logged payload may contain them. Meeting types call the handler
	// directly: their schema needs a full weekly calendar to validate.
	it('never logs addresses, search text or content on any other handler', async () => {
		const ignoreOutput = () => undefined;
		const mark = 'Private';
		const address = 'ada@example.com';
		// Each call returns a different output type and only its log is
		// checked, so the result type is left as `unknown`.
		const calls: Array<[string, () => Promise<unknown>]> = [
			[
				'users.preferences.update',
				() =>
					endpoints.users.preferences.update(ctx, {
						emailSignature: `${mark} ${address}`,
					} as never),
			],
			[
				'autoBcc.list',
				() =>
					endpoints.users.preferences.autoBccExcludedEmails.list(ctx, {
						email: address,
					}),
			],
			[
				'autoBcc.add',
				() =>
					endpoints.users.preferences.autoBccExcludedEmails.add(ctx, {
						email: address,
						emails: [address],
					}),
			],
			[
				'autoBcc.exists',
				() =>
					endpoints.users.preferences.autoBccExcludedEmails.exists(ctx, {
						emails: [address],
					}),
			],
			[
				'livefeed.list',
				() => endpoints.livefeed.list(ctx, { query: `to:${address} ${mark}` }),
			],
			[
				'livefeed.events',
				() =>
					endpoints.livefeed.events(ctx, { contactEmail: address } as never),
			],
			[
				'sequences.search',
				() =>
					endpoints.sequences.search(ctx, {
						query: mark,
						recipients: address,
					} as never),
			],
			[
				'sequences.cancelAll',
				() =>
					endpoints.sequences.cancelAll(ctx, {
						emails: [address],
						reason: mark,
					} as never),
			],
			[
				'sequences.cancel',
				() =>
					endpoints.sequences.cancel(ctx, { id: 'seq-1', emails: [address] }),
			],
			[
				'sequences.recipients.list',
				() =>
					endpoints.sequences.recipients.list(ctx, {
						id: 'seq-1',
						query: address,
					} as never),
			],
			['snippets.list', () => endpoints.snippets.list(ctx, { search: mark })],
			[
				'snippetTags.list',
				() => endpoints.snippetTags.list(ctx, { search: mark }),
			],
			[
				'snippetTags.listSnippets',
				() =>
					endpoints.snippetTags.listSnippets(ctx, {
						id: 'tag-1',
						search: mark,
					}),
			],
			[
				'snippetTags.addSnippets',
				() =>
					endpoints.snippetTags.addSnippets(ctx, {
						id: 'tag-1',
						title: mark,
						source: `<p>${mark}</p>`,
						cc: [{ email: address }],
					} as never),
			],
			[
				'rules.events.list',
				() => endpoints.rules.events.list(ctx, { text: address } as never),
			],
			[
				'meetingTypes.create',
				() =>
					MeetingTypes.create(ctx, {
						name: 'Intro',
						defaultGuests: [{ email: address }],
						customFields: [{ label: mark }],
					} as never),
			],
			[
				'meetingTypes.update',
				() =>
					MeetingTypes.update(ctx, {
						id: 'mt-1',
						name: 'Intro',
						defaultGuests: [{ email: address }],
					} as never),
			],
			[
				'meetings.searchSummaries',
				() =>
					endpoints.meetings.searchSummaries(ctx, {
						attendee: address,
						title: mark,
					} as never),
			],
			[
				'tasks.list',
				() => endpoints.tasks.list(ctx, { search: mark, query: address }),
			],
			[
				'insightsReports.create',
				() =>
					endpoints.insightsReports.create(ctx, {
						title: 'Weekly',
						type: 'messages',
						query: `to:${address}`,
					} as never),
			],
			[
				'insightsReports.update',
				() =>
					endpoints.insightsReports.update(ctx, {
						id: 'rep-1',
						query: `to:${address}`,
					} as never),
			],
			[
				'reports.runDataTable',
				() =>
					endpoints.reports.runDataTable(ctx, {
						type: 'messages',
						query: `to:${address}`,
					} as never),
			],
			[
				'codeSnippets.create',
				() =>
					endpoints.codeSnippets.create(ctx, {
						title: 'T',
						html: `<p>${mark}</p>`,
						code: mark,
						language: 'js',
					} as never),
			],
		];
		for (const [name, call] of calls) {
			logEvent.mockClear();
			await call().catch(ignoreOutput);
			const payloads = logEvent.mock.calls
				.filter((c) => !String(c[1]).endsWith('.outputMismatch'))
				.map((c) => JSON.stringify(c[2]));
			expect([name, payloads.length]).toEqual([name, 1]);
			expect([name, payloads[0]]).not.toEqual([
				name,
				expect.stringContaining('@'),
			]);
			expect([name, payloads[0]]).not.toEqual([
				name,
				expect.stringContaining(mark),
			]);
		}
	});
});
