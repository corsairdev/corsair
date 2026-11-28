import { appendFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { smtp2go } from './index';
import { smtp2goWebhooksNested } from './webhooks';

/**
 * Live suite: all 69 operations against a real SMTP2GO account, run with
 * `pnpm --filter @corsair-dev/smtp2go test:live`.
 *
 *   SMTP2GO_API_KEY=api-...           a key with every endpoint permission
 *   SMTP2GO_TEST_INBOX=a@example.com  a verified single sender that is also
 *                                     our own inbox: every email the suite
 *                                     sends goes from and to this address
 *   SMTP2GO_HOOK_URL=https://...      optional: a public listener that
 *                                     answers GET with the deliveries it got,
 *                                     one JSON line each ({headers, body})
 *   SMTP2GO_LIVE_LOG=/path/run.jsonl  optional: one JSON line per step
 *
 * The suite sends four emails, all to SMTP2GO_TEST_INBOX, and creates (then
 * deletes) a template, a suppression for an example.com address, an API key,
 * an SMTP user, a sender domain and a webhook. It never sends SMS: sms.send
 * spends credit and texts a real number, so it stays mock-only.
 */
const apiKey = process.env.SMTP2GO_API_KEY;
const inbox = process.env.SMTP2GO_TEST_INBOX;
const hookUrl = process.env.SMTP2GO_HOOK_URL;
const logPath = process.env.SMTP2GO_LIVE_LOG;
if (!apiKey || !inbox) {
	console.warn(
		'Skipping SMTP2GO live test: SMTP2GO_API_KEY and SMTP2GO_TEST_INBOX are not both set, so no live request runs.',
	);
}

const live = apiKey && inbox ? describe : describe.skip;

type Outcome = 'ok' | 'refused' | 'not_called' | 'error';

// unknown: whatever the step returned or threw, summarised for the log.
function record(step: string, outcome: Outcome, detail: unknown) {
	if (!logPath) return;
	appendFileSync(
		logPath,
		`${JSON.stringify({ step, outcome, detail, at: new Date().toISOString() })}\n`,
	);
}

// unknown: any operation's result; only top-level keys go to the log.
function summarise(result: unknown): unknown {
	if (result && typeof result === 'object') {
		const data = (result as { data?: unknown }).data;
		return {
			dataKeys:
				data && typeof data === 'object' ? Object.keys(data).slice(0, 8) : data,
		};
	}
	return result;
}

live('SMTP2GO live', () => {
	jest.setTimeout(600_000);
	const testDb = createTestDatabase();
	const corsair = createCorsair({
		plugins: [smtp2go({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	const api = corsair.smtp2go.api;
	const stamp = Date.now().toString(36);
	const outcomes: Record<string, Outcome> = {};
	const cleanup: Array<() => Promise<unknown>> = [];

	/**
	 * Runs one operation. `refused` covers SMTP2GO answering with a 4xx that
	 * names why (a paid feature, a made-up id the call needs): the route and
	 * auth worked. Anything else that fails fails the suite.
	 */
	async function step<T>(
		name: string,
		run: () => Promise<T>,
		options: { refusalOk?: boolean } = {},
	): Promise<T | undefined> {
		// The API throttles an IP after bursts; a short pause keeps clear of it.
		await new Promise((resolve) => setTimeout(resolve, 400));
		try {
			const result = await run();
			record(name, 'ok', summarise(result));
			outcomes[name] = 'ok';
			return result;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			const status = error instanceof ApiError ? error.status : undefined;
			if (
				options.refusalOk &&
				(status === 400 ||
					status === 403 ||
					status === 404 ||
					status === 402 ||
					// SMTP2GO answers 500 for the SMS reads on an account without SMS.
					(status === 500 && name.startsWith('sms.')))
			) {
				record(name, 'refused', message);
				outcomes[name] = 'refused';
				return undefined;
			}
			record(name, 'error', message);
			outcomes[name] = 'error';
			throw error;
		}
	}

	beforeAll(async () => {
		await createIntegrationAndAccount(testDb.db, 'smtp2go', 'default');
	});

	afterAll(async () => {
		for (const undo of cleanup.reverse()) {
			await undo().catch(() => undefined);
		}
		record('summary', 'ok', outcomes);
		testDb.cleanup();
	});

	it('stats, activity and account reads', async () => {
		await step('stats.cycle', () => api.stats.cycle({}));
		await step('stats.bounces', () => api.stats.bounces({}));
		await step('stats.spam', () => api.stats.spam({}));
		await step('stats.unsubscribes', () => api.stats.unsubscribes({}));
		await step('stats.history', () => api.stats.history({}));
		await step('stats.summary', () => api.stats.summary({}));
		await step('activity.search', () => api.activity.search({ limit: 5 }));
		await step('apiKeys.list', () => api.apiKeys.list({}));
		await step('apiKeys.permissions', () => api.apiKeys.permissions({}));
		await step('dedicatedIps.list', () => api.dedicatedIps.list({}), {
			refusalOk: true,
		});
		await step('ipAuth.list', () => api.ipAuth.list({}));
		await step('smtpUsers.list', () => api.smtpUsers.list({}));
		await step('singleSenders.list', () => api.singleSenders.list({}));
		await step('allowedSenders.list', () => api.allowedSenders.list({}));
		await step('allowedRecipients.list', () => api.allowedRecipients.list({}));
		await step('subaccounts.search', () => api.subaccounts.search({}), {
			refusalOk: true,
		});
		await step('sms.summary', () => api.sms.summary({}), { refusalOk: true });
		await step('sms.listSent', () => api.sms.listSent({}), { refusalOk: true });
		await step('sms.listReceived', () => api.sms.listReceived({}), {
			refusalOk: true,
		});
		await step('archive.search', () => api.archive.search({}), {
			refusalOk: true,
		});
		record('sms.send', 'not_called', 'texts a real number and spends credit');
		outcomes['sms.send'] = 'not_called';
	});

	let webhookId: number | string | undefined;
	const hookToken = `corsair-live-${stamp}`;

	it('webhooks: add, list, edit (then remove at the end)', async () => {
		if (!hookUrl) return;
		const added = await step('webhooks.add', () =>
			api.webhooks.add({
				url: `${hookUrl}/hook-${stamp}`,
				events: ['processed', 'delivered', 'open', 'bounce', 'reject'],
				output_format: 'json',
				auth_header_type: 'bearer',
				auth_header_value: hookToken,
			}),
		);
		const data = added?.data as { id?: number | string } | undefined;
		webhookId = data?.id;
		if (webhookId !== undefined) {
			const id = webhookId;
			cleanup.push(() => api.webhooks.remove({ id: Number(id) }));
		}
		await step('webhooks.list', () => api.webhooks.list({}));
		if (webhookId !== undefined) {
			await step('webhooks.edit', () =>
				api.webhooks.edit({
					id: Number(webhookId),
					url: `${hookUrl}/hook-${stamp}`,
					events: [
						'processed',
						'delivered',
						'open',
						'bounce',
						'reject',
						'spam',
					],
					// An edit replaces the webhook: without these the deliveries
					// lose their Authorization header (live, 11-28).
					output_format: 'json',
					auth_header_type: 'bearer',
					auth_header_value: hookToken,
				}),
			);
		}
	});

	let emailId: string | undefined;

	it('email: send, MIME, batch, scheduled + cancel, search', async () => {
		const sent = await step('email.send', () =>
			api.email.send({
				sender: `Corsair live test <${inbox}>`,
				to: [String(inbox)],
				subject: `Corsair SMTP2GO live test ${stamp}`,
				text_body: 'Sent by the Corsair smtp2go plugin live suite.',
			}),
		);
		emailId =
			(sent?.data as { email_id?: string } | undefined)?.email_id ?? undefined;

		const mime = [
			`From: ${inbox}`,
			`To: ${inbox}`,
			`Subject: Corsair SMTP2GO MIME test ${stamp}`,
			'MIME-Version: 1.0',
			'Content-Type: text/plain; charset=utf-8',
			'',
			'Sent by the Corsair smtp2go plugin live suite (MIME).',
		].join('\r\n');
		await step('email.sendMime', () =>
			api.email.sendMime({ mime_email: Buffer.from(mime).toString('base64') }),
		);
		await step('email.sendBatch', () =>
			api.email.sendBatch({
				emails: [
					{
						sender: String(inbox),
						to: [String(inbox)],
						subject: `Corsair SMTP2GO batch test ${stamp}`,
						text_body: 'Batch message from the Corsair smtp2go live suite.',
					},
				],
			}),
		);
		const scheduled = await step('email.send (scheduled)', () =>
			api.email.send({
				sender: String(inbox),
				to: [String(inbox)],
				subject: `Corsair SMTP2GO scheduled test ${stamp}`,
				text_body: 'Scheduled and cancelled by the live suite.',
				schedule: new Date(Date.now() + 24 * 3600_000).toISOString(),
			}),
		);
		const scheduleId = (scheduled?.data as { schedule_id?: string } | undefined)
			?.schedule_id;
		await step('email.searchScheduled', () => api.email.searchScheduled({}));
		if (scheduleId) {
			await step('email.cancelScheduled', () =>
				api.email.cancelScheduled({ schedule_id: scheduleId }),
			);
		}
		await step('email.searchSent', () => api.email.searchSent({ limit: 5 }));
		if (emailId) {
			const id = emailId;
			await step(
				'archive.getEmail',
				() => api.archive.getEmail({ email_id: id }),
				{
					refusalOk: true,
				},
			);
		}
	});

	it('templates, suppressions, allowed lists', async () => {
		const id = `corsair-live-${stamp}`;
		await step('templates.add', () =>
			api.templates.add({
				id,
				template_name: `Corsair live ${stamp}`,
				subject: 'Hello {{ name }}',
				html_body: '<p>Hello {{ name }}</p>',
				text_body: 'Hello {{ name }}',
			}),
		);
		cleanup.push(() => api.templates.delete({ id }));
		await step('templates.list', () => api.templates.list({}));
		await step('templates.view', () => api.templates.view({ id }));
		await step('templates.edit', () =>
			api.templates.edit({ id, subject: 'Hi {{ name }}' }),
		);
		await step('templates.delete', () => api.templates.delete({ id }));

		const blocked = `blocked-${stamp}@example.com`;
		await step('suppressions.add', () =>
			api.suppressions.add({ email_address: blocked }),
		);
		await step('suppressions.list', () => api.suppressions.list({}));
		await step('suppressions.remove', () =>
			api.suppressions.remove({ email_address: blocked }),
		);

		// The allowed lists only restrict sending when the account turns that
		// mode on; the suite adds one example.com entry and removes it again.
		const entry = `allowed-${stamp}.example.com`;
		// Both updates replace the whole list: they resend the account's own
		// entries plus the test one, and cleanup restores the originals.
		const senders = await api.allowedSenders.list({});
		const sendersData = (senders.data ?? {}) as {
			mode?: string;
			allowed_senders?: string[];
		};
		const originalSenders = sendersData.allowed_senders ?? [];
		const mode = (sendersData.mode ?? 'disabled') as 'disabled';
		cleanup.push(() =>
			api.allowedSenders.update({ allowed_senders: originalSenders, mode }),
		);
		await step('allowedSenders.add', () =>
			api.allowedSenders.add({ allowed_senders: [entry] }),
		);
		await step('allowedSenders.update', () =>
			api.allowedSenders.update({
				allowed_senders: [...originalSenders, entry],
				mode,
			}),
		);
		await step('allowedSenders.remove', () =>
			api.allowedSenders.remove({ allowed_senders: [entry] }),
		);

		const recipients = await api.allowedRecipients.list({});
		const recipientsData = (recipients.data ?? {}) as {
			enabled?: boolean;
			allowed_recipients?: string[];
		};
		const originalRecipients = recipientsData.allowed_recipients ?? [];
		const enabled = recipientsData.enabled ?? false;
		cleanup.push(() =>
			api.allowedRecipients.update({
				allowed_recipients: originalRecipients,
				enabled,
			}),
		);
		await step('allowedRecipients.add', () =>
			api.allowedRecipients.add({ allowed_recipients: [entry] }),
		);
		await step('allowedRecipients.update', () =>
			api.allowedRecipients.update({
				allowed_recipients: [...originalRecipients, entry],
				enabled,
			}),
		);
		await step('allowedRecipients.remove', () =>
			api.allowedRecipients.remove({ allowed_recipients: [entry] }),
		);
	});

	it('API keys, SMTP users, IP auth, senders, domains, subaccounts', async () => {
		const addedKey = await step('apiKeys.add', () =>
			api.apiKeys.add({ description: `corsair-live-${stamp}` }),
		);
		const newKey = addedKey?.data?.api_key ?? undefined;
		if (newKey) {
			cleanup.push(() => api.apiKeys.remove({ id: newKey }));
			await step('apiKeys.edit', () =>
				// edit replaces the whole key, permissions included.
				api.apiKeys.edit({
					id: newKey,
					description: 'edited',
					endpoints: addedKey?.data?.endpoints ?? ['/email/send'],
				} as never),
			);
			await step('apiKeys.patch', () =>
				api.apiKeys.patch({ id: newKey, description: 'patched' }),
			);
			await step('apiKeys.remove', () => api.apiKeys.remove({ id: newKey }));
		}

		const username = `corsair${stamp}`;
		const user = await step(
			'smtpUsers.add',
			() =>
				api.smtpUsers.add({
					username,
					email_password: `Cs-${stamp}-${Math.random().toString(36).slice(2)}`,
					description: 'Corsair live test',
				} as never),
			{ refusalOk: true },
		);
		if (user) {
			cleanup.push(() => api.smtpUsers.remove({ username } as never));
			await step('smtpUsers.edit', () =>
				api.smtpUsers.edit({ username, description: 'edited' } as never),
			);
			await step('smtpUsers.patch', () =>
				api.smtpUsers.patch({ username, description: 'patched' } as never),
			);
			await step('smtpUsers.remove', () =>
				api.smtpUsers.remove({ username } as never),
			);
		}

		// SMTP2GO has no IP auth "add" route: these answer for a made-up IP.
		await step(
			'ipAuth.patch',
			() =>
				api.ipAuth.patch({
					ip_address: '192.0.2.10',
					description: 'x',
				} as never),
			{ refusalOk: true },
		);
		await step(
			'ipAuth.remove',
			() => api.ipAuth.remove({ ip_address: '192.0.2.10' } as never),
			{ refusalOk: true },
		);

		// The verified inbox is re-added (SMTP2GO resends the verification only
		// when unverified); removal would unverify it, so it is called on a
		// throwaway example.com address that was never added.
		await step('singleSenders.add', () =>
			api.singleSenders.add({ email_address: String(inbox) }),
		);
		await step(
			'singleSenders.remove',
			() =>
				api.singleSenders.remove({
					email_address: `nobody-${stamp}@example.com`,
				}),
			{ refusalOk: true },
		);

		const domain = `smtp2go-live-${stamp}.corsair.dev`;
		const addedDomain = await step(
			'domains.add',
			() => api.domains.add({ domain, auto_verify: false }),
			{ refusalOk: true },
		);
		await step('domains.list', () => api.domains.list({}));
		if (addedDomain) {
			cleanup.push(() => api.domains.remove({ domain }));
			await step('domains.verify', () => api.domains.verify({ domain }), {
				refusalOk: true,
			});
			await step(
				'domains.editTracking',
				() =>
					api.domains.editTracking({
						domain,
						old_subdomain: 'link',
						new_subdomain: 'track',
					}),
				{ refusalOk: true },
			);
			await step(
				'domains.editReturnPath',
				() =>
					api.domains.editReturnPath({
						domain,
						old_subdomain: 'em',
						new_subdomain: 'bounce',
					}),
				{ refusalOk: true },
			);
			await step(
				'domains.editSubaccountAccess',
				() =>
					api.domains.editSubaccountAccess({
						domain,
						subaccounts: [],
					} as never),
				{ refusalOk: true },
			);
			await step('domains.remove', () => api.domains.remove({ domain }));
		}

		// Subaccounts need a paid plan; made-up ids for the rest.
		await step(
			'subaccounts.add',
			() =>
				api.subaccounts.add({ fullname: 'Corsair live', limit: 1 } as never),
			{ refusalOk: true },
		);
		await step(
			'subaccounts.edit',
			() => api.subaccounts.edit({ id: 'none', fullname: 'x' } as never),
			{ refusalOk: true },
		);
		await step(
			'subaccounts.close',
			() => api.subaccounts.close({ id: 'none' }),
			{
				refusalOk: true,
			},
		);
		await step(
			'subaccounts.reopen',
			() => api.subaccounts.reopen({ id: 'none' }),
			{
				refusalOk: true,
			},
		);
	});

	(hookUrl ? it : it.skip)(
		'real webhook deliveries carry the Authorization header and parse',
		async () => {
			// Only this run's deliveries: each run registers its own path.
			let deliveries: Array<{
				path: string;
				headers: Record<string, string>;
				body: string;
			}> = [];
			for (let i = 0; i < 24 && deliveries.length === 0; i++) {
				await new Promise((resolve) => setTimeout(resolve, 5_000));
				const text = await (await fetch(`${hookUrl}/`)).text();
				deliveries = text
					.split('\n')
					.filter(Boolean)
					.map((line) => JSON.parse(line))
					.filter((d: { path: string }) => d.path === `/hook-${stamp}`);
			}
			const seen = new Set<string>();
			for (const d of deliveries) {
				const headers = Object.fromEntries(
					Object.entries(d.headers).map(([k, v]) => [k.toLowerCase(), v]),
				);
				const result = await smtp2goWebhooksNested.email.event.handler(
					{ key: hookToken, $log: undefined } as never,
					{ headers, payload: JSON.parse(d.body), rawBody: d.body } as never,
				);
				expect(result.success).toBe(true);
				const wrong = await smtp2goWebhooksNested.email.event.handler(
					{ key: 'wrong-token', $log: undefined } as never,
					{ headers, payload: JSON.parse(d.body), rawBody: d.body } as never,
				);
				expect(wrong.success).toBe(false);
				if (result.success) seen.add(String(result.data?.event));
			}
			record('webhooks.deliveries', 'ok', {
				deliveries: deliveries.length,
				events: [...seen].sort(),
			});
			expect(deliveries.length).toBeGreaterThan(0);
			if (webhookId !== undefined) {
				await step('webhooks.remove', () =>
					api.webhooks.remove({ id: Number(webhookId) }),
				);
			}
		},
	);

	it('every operation answered', () => {
		const errors = Object.entries(outcomes).filter(([, o]) => o === 'error');
		expect(errors).toEqual([]);
	});
});
