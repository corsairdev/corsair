// Live checks against the eSputnik (Yespo) API. CI skips *api.test.ts.
//
//   ESPUTNIK_API_KEY=... npx jest api.test.ts                  reads only
//   ESPUTNIK_API_KEY=... ESPUTNIK_LIVE_WRITES=1 npx jest api   + free writes
//
// Writes create a contact on example.com, an email template and an SMS
// template, then delete them. Nothing is ever sent: no message sends, no
// subscribeContact (it fires workflow events), no events.
import type { EsputnikAPIError } from './client';
import type { EsputnikContext } from './index';
import { esputnik } from './index';

const key = process.env.ESPUTNIK_API_KEY;
const describeLive = key ? describe : describe.skip;
const describeWrites =
	key && process.env.ESPUTNIK_LIVE_WRITES === '1' ? describe : describe.skip;

const plugin = esputnik({ key });
if (!plugin.endpoints) throw new Error('eSputnik endpoints are missing');
const api = plugin.endpoints;
const ctx = { key } as unknown as EsputnikContext;

// eSputnik limits message reads to 500 an hour; stay near 2 requests a second.
const pause = () => new Promise((resolve) => setTimeout(resolve, 600));
async function live<T>(run: () => Promise<T>): Promise<T> {
	try {
		return await run();
	} finally {
		await pause();
	}
}
async function liveError(run: () => Promise<unknown>) {
	const error = await live(run).then(
		() => undefined,
		(e: unknown) => e as EsputnikAPIError,
	);
	return error;
}

// Erasing a contact finishes in the background; poll the search a few times.
async function searchUntilEmpty(email: string) {
	let found: unknown[] = [];
	for (let attempt = 0; attempt < 6; attempt++) {
		found = await live(() => api.contacts.searchContacts(ctx, { email }));
		if (found.length === 0) break;
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}
	return found;
}

const today = new Date().toISOString().slice(0, 10);
const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);

beforeAll(() => {
	// The shared client logs a parse error whenever eSputnik labels a plain
	// sentence as JSON, which most acknowledgements do.
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describeLive('eSputnik live reads', () => {
	jest.setTimeout(60_000);

	it('reads the account', async () => {
		const info = await live(() => api.account.getAccountInfo(ctx, {}));
		expect(typeof info.orgId).toBe('number');
		const balance = await live(() => api.account.getBalance(ctx, {}));
		expect(typeof balance.currency).toBe('string');
		const history = await live(() =>
			api.account.getOrganisationBalanceHistory(ctx, {
				dateFrom: monthAgo,
				dateTo: today,
			}),
		);
		expect(typeof history).toBe('object');
	});

	it('reads contacts, segments, workflows and fields', async () => {
		expect(
			Array.isArray(
				await live(() => api.contacts.searchContacts(ctx, { maxrows: 5 })),
			),
		).toBe(true);
		const fields = await live(() => api.contacts.getAdditionalFields(ctx, {}));
		expect(fields).toHaveProperty('additionalFieldsLists');
		expect(
			Array.isArray(
				await live(() => api.contacts.getSubscriptionCategories(ctx, {})),
			),
		).toBe(true);
		const groups = (await live(() =>
			api.contacts.searchGroups(ctx, { maxrows: 20 }),
		)) as Array<{ id: number; type: string }>;
		expect(groups.length).toBeGreaterThan(0);
		const staticGroup = groups.find((group) => group.type === 'Static');
		if (staticGroup) {
			expect(
				Array.isArray(
					await live(() =>
						api.contacts.getGroupContacts(ctx, {
							id: staticGroup.id,
							maxrows: 5,
						}),
					),
				),
			).toBe(true);
		}
		const dynamicGroup = groups.find((group) => group.type === 'Dynamic');
		if (dynamicGroup) {
			// Only static segments list their contacts.
			const error = await liveError(() =>
				api.contacts.getGroupContacts(ctx, { id: dynamicGroup.id }),
			);
			expect(error?.status).toBe(400);
		}
		expect(
			Array.isArray(
				await live(() => api.contacts.searchWorkflows(ctx, { maxrows: 5 })),
			),
		).toBe(true);
		expect(
			await live(() =>
				api.contacts.contactMessages(ctx, {
					dateFrom: monthAgo,
					dateTo: today,
					email: 'nobody@example.com',
				}),
			),
		).toEqual([]);
	});

	it('reports features the account has not enabled', async () => {
		// Contact activity is switched on by eSputnik support.
		const activity = await liveError(() =>
			api.contacts.contactActivity(ctx, { dateFrom: monthAgo, dateTo: today }),
		);
		expect(activity?.status).toBe(400);
		const recoms = await liveError(() =>
			api.contacts.contactRecoms(ctx, {
				dataSourceId: 1,
				email: 'nobody@example.com',
			}),
		);
		expect(recoms?.status).toBe(404);
		expect(recoms?.message).toContain('Contact not found');
		const token = await liveError(() =>
			api.contacts.getContactIdByToken(ctx, {
				app_uuid: '00000000-0000-0000-0000-000000000000',
				token_id: 'corsair-test-token',
			}),
		);
		expect(token?.message).toContain('App not found');
		const session = await liveError(() =>
			api.contacts.getImportSessionStatus(ctx, {
				sessionId: '00000000-0000-0000-0000-000000000000',
			}),
		);
		expect(session?.status).toBe(404);
	});

	it('searches every message channel', async () => {
		for (const search of [
			() => api.emails.searchEmails(ctx, { maxrows: 3 }),
			() => api.mobilePush.searchMobilePushMessages(ctx, { maxrows: 3 }),
			() => api.viber.searchViberMessages(ctx, { maxrows: 3 }),
			() => api.appInbox.searchAppInboxMessages(ctx, { maxrows: 3 }),
			() => api.telegramBot.searchTelegramBotMessages(ctx, { maxrows: 3 }),
			() => api.sms.searchSmsMessages(ctx, { maxrows: 3 }),
			() => api.broadcasts.getBroadcasts(ctx, { maxrows: 3 }),
		]) {
			expect(Array.isArray(await live(search))).toBe(true);
		}
	});

	it('reads senders, site, product feed and promo code settings', async () => {
		const senders = (await live(() =>
			api.interfaces.getEmailInterfaces(ctx, {}),
		)) as Array<{ type: string }>;
		expect(senders[0]?.type).toBe('email');
		expect(
			Array.isArray(await live(() => api.interfaces.getSmsInterfaces(ctx, {}))),
		).toBe(true);
		const domains = await live(() => api.site.getDomains(ctx, {}));
		expect(Array.isArray(domains)).toBe(true);
		expect(typeof (await live(() => api.site.getWebPushDomains(ctx, {})))).toBe(
			'object',
		);
		if (domains.length === 0) {
			// The tracking script needs a registered domain. Before the fix the
			// request carried Content-Type: application/json and got 415.
			const script = await liveError(() => api.site.getScript(ctx, {}));
			expect(script?.status).toBe(404);
		} else {
			expect(typeof (await live(() => api.site.getScript(ctx, {})))).toBe(
				'string',
			);
		}
		const feeds = await liveError(() =>
			api.productFeeds.getProductFeedsConfiguration(ctx, {}),
		);
		if (feeds) expect(feeds.message).toContain('No feed configurations found');
		expect(
			await live(() => api.promocodes.getPromocodes(ctx, {})),
		).toBeDefined();
		expect(
			await live(() => api.promocodes.getPromocodesCount(ctx, {})),
		).toBeDefined();
	});
});

describeWrites('eSputnik live writes (free, nothing sent)', () => {
	jest.setTimeout(120_000);
	const stamp = Date.now();
	const created: { contact?: number; email?: number; sms?: number } = {};
	let externalId: string | undefined;

	afterAll(async () => {
		if (created.contact)
			await live(() =>
				api.contacts.deleteContactById(ctx, {
					id: created.contact as number,
					erase: true,
				}),
			).catch(() => undefined);
		if (externalId)
			await live(() =>
				api.contacts.deleteContactByExternalCustomerId(ctx, {
					externalCustomerId: externalId as string,
					erase: true,
				}),
			).catch(() => undefined);
		if (created.email)
			await live(() =>
				api.emails.deleteEmail(ctx, { id: created.email as number }),
			).catch(() => undefined);
		if (created.sms)
			await live(() =>
				api.sms.deleteSmsMessage(ctx, { id: created.sms as number }),
			).catch(() => undefined);
	});

	it('creates, updates, finds, segments and deletes a contact', async () => {
		const address = `corsair-plugin-test-${stamp}@example.com`;
		const channels = [{ type: 'email', value: address }];
		const { id } = await live(() =>
			api.contacts.addContact(ctx, {
				firstName: 'Corsair',
				lastName: 'PluginTest',
				channels,
			}),
		);
		created.contact = id;
		expect(
			await live(() => api.contacts.getContact(ctx, { id })),
		).toMatchObject({ id, firstName: 'Corsair' });

		// Updates answer 200 with no body.
		await expect(
			live(() =>
				api.contacts.updateContact(ctx, { id, firstName: 'Updated', channels }),
			),
		).resolves.toBeUndefined();
		const found = await live(() =>
			api.contacts.searchContacts(ctx, { email: address }),
		);
		expect(found).toEqual([
			expect.objectContaining({ id, firstName: 'Updated' }),
		]);
		expect(
			await live(() =>
				api.contacts.getContactSubscriptionCategories(ctx, { id }),
			),
		).toEqual([]);
		expect(
			await live(() => api.contacts.getContactEmails(ctx, { ids: String(id) })),
		).toEqual({ results: [{ contactId: id, email: address }] });

		const groups = (await live(() =>
			api.contacts.searchGroups(ctx, {}),
		)) as Array<{ id: number; type: string }>;
		const staticGroup = groups.find((group) => group.type === 'Static');
		if (staticGroup) {
			// Segment changes answer with a sentence labelled as JSON.
			await expect(
				live(() =>
					api.contacts.attachContactsToGroup(ctx, {
						id: staticGroup.id,
						contactIds: [id],
					}),
				),
			).resolves.toBeUndefined();
			const members = (await live(() =>
				api.contacts.getGroupContacts(ctx, { id: staticGroup.id }),
			)) as Array<{ id: number }>;
			expect(members.map((member) => member.id)).toContain(id);
			await expect(
				live(() =>
					api.contacts.detachContactsFromGroup(ctx, {
						id: staticGroup.id,
						contactIds: [id],
					}),
				),
			).resolves.toBeUndefined();
		}

		await expect(
			live(() => api.contacts.addToUnsubscribed(ctx, { emails: [address] })),
		).resolves.toBeUndefined();
		await expect(
			live(() =>
				api.contacts.deleteFromUnsubscribed(ctx, { emails: [address] }),
			),
		).resolves.toBeUndefined();

		// The delete acknowledgement is an empty 200 with no Content-Type.
		await expect(
			live(() => api.contacts.deleteContactById(ctx, { id, erase: true })),
		).resolves.toBeUndefined();
		created.contact = undefined;
		expect(await searchUntilEmpty(address)).toEqual([]);
	});

	it('deletes a contact by external customer ID', async () => {
		externalId = `corsair-plugin-test-${stamp}`;
		const address = `corsair-plugin-test-ext-${stamp}@example.com`;
		await live(() =>
			api.contacts.addContact(ctx, {
				externalCustomerId: externalId,
				channels: [{ type: 'email', value: address }],
			}),
		);
		await expect(
			live(() =>
				api.contacts.deleteContactByExternalCustomerId(ctx, {
					externalCustomerId: externalId as string,
					erase: true,
				}),
			),
		).resolves.toBeUndefined();
		externalId = undefined;
		expect(await searchUntilEmpty(address)).toEqual([]);
	});

	it('creates, reads, finds, updates and deletes an email template', async () => {
		const senders = (await live(() =>
			api.interfaces.getEmailInterfaces(ctx, {}),
		)) as Array<{ value: string }>;
		const from = senders[0]?.value;
		if (!from) return;
		const name = `corsair-plugin-test-${stamp}`;
		const body = {
			name,
			from,
			subject: 'Corsair plugin test',
			htmlText: '<p>Corsair plugin test</p>',
		};
		const { id } = await live(() => api.emails.addEmail(ctx, body));
		created.email = id;
		expect(await live(() => api.emails.getEmail(ctx, { id }))).toMatchObject({
			id,
			name,
		});
		const view = await live(() =>
			api.emails.getEmailMessageViewLink(ctx, { id }),
		);
		expect(typeof view.link).toBe('string');
		// One match comes back as a bare object; the plugin returns a list.
		expect(
			await live(() => api.emails.searchEmails(ctx, { search: name })),
		).toEqual([expect.objectContaining({ id, name })]);
		await expect(
			live(() =>
				api.emails.updateMessage(ctx, { id, ...body, name: `${name}-v2` }),
			),
		).resolves.toBeUndefined();
		// Language versions need the account's languages set up first.
		const translation = await liveError(() =>
			api.emails.updateTranslatedMessage(ctx, { id, language: 'de', ...body }),
		);
		expect(translation?.status).toBe(400);
		await expect(
			live(() => api.emails.deleteEmail(ctx, { id })),
		).resolves.toBeUndefined();
		created.email = undefined;
	});

	it('creates, finds and deletes an SMS template', async () => {
		const senders = (await live(() =>
			api.interfaces.getSmsInterfaces(ctx, {}),
		)) as Array<{ value: string }>;
		const from = senders[0]?.value;
		if (!from) return;
		const name = `corsair-plugin-test-sms-${stamp}`;
		const { id } = await live(() =>
			api.sms.addSmsMessage(ctx, { name, from, text: 'Corsair plugin test' }),
		);
		created.sms = id;
		expect(await live(() => api.sms.getSms(ctx, { id }))).toMatchObject({
			id,
			name,
		});
		expect(
			await live(() => api.sms.searchSmsMessages(ctx, { search: name })),
		).toEqual([expect.objectContaining({ id, name })]);
		await expect(
			live(() => api.sms.deleteSmsMessage(ctx, { id })),
		).resolves.toBeUndefined();
		created.sms = undefined;
	});
});
