import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moosend } from './index';

/**
 * Live run against a real Moosend account. Skipped unless MOOSEND_API_KEY is
 * set. It reads what it can, then makes and deletes a throwaway list with
 * example.com subscribers, a segment and a draft campaign. Nothing is sent:
 * no send, test send, schedule or transactional call runs here.
 *
 *   MOOSEND_API_KEY=... pnpm test:live
 */
const apiKey = process.env.MOOSEND_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('Skipping Moosend live tests: set MOOSEND_API_KEY.');
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moosend', 'default');
	const corsair = createCorsair({
		// The run deletes and unsubscribes its own throwaway data.
		plugins: [moosend({ key: apiKey, permissions: { mode: 'open' } })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const stamp = Date.now();
const email = (n: number) => `corsair-plugin-test-${stamp}-${n}@example.com`;

describeIfKey('moosend live', () => {
	jest.setTimeout(60_000);

	let client: Awaited<ReturnType<typeof createClient>>;
	let api: Awaited<
		ReturnType<typeof createClient>
	>['corsair']['moosend']['api'];
	let listId = '';
	let fieldId = '';
	let subscriberId = '';
	let segmentId = 0;
	let campaignId = '';
	let sender = '';

	beforeAll(async () => {
		client = await createClient();
		api = client.corsair.moosend.api;
	});

	afterAll(async () => {
		if (campaignId) {
			await api.campaigns.delete({ campaignId }).catch(() => undefined);
		}
		if (listId) {
			await api.lists.delete({ mailingListId: listId }).catch(() => undefined);
		}
		client?.testDb.cleanup();
	});

	it('lists.list + lists.listPaged', async () => {
		const lists = await api.lists.list({});
		expect(Array.isArray(lists.MailingLists)).toBe(true);
		const paged = await api.lists.listPaged({ page: 1, pageSize: 5 });
		expect(paged.Paging?.PageSize).toBe(5);
	});

	it('senders.list + senders.get', async () => {
		const senders = await api.senders.list({});
		sender = senders.senders[0]?.Email ?? '';
		expect(sender).toContain('@');
		const one = await api.senders.get({ email: sender });
		expect(one.Email).toBe(sender);
	});

	it('campaigns.list', async () => {
		const campaigns = await api.campaigns.list({});
		expect(Array.isArray(campaigns.Campaigns)).toBe(true);
	});

	it('lists.create + lists.update + lists.get', async () => {
		listId = (await api.lists.create({ name: `corsair-plugin-test-${stamp}` }))
			.mailingListId;
		await api.lists.update({
			mailingListId: listId,
			name: `corsair-plugin-test-${stamp}-2`,
		});
		const list = await api.lists.get({ mailingListId: listId });
		expect(list.Name).toBe(`corsair-plugin-test-${stamp}-2`);
	});

	it('customFields.create + customFields.update', async () => {
		fieldId = (
			await api.customFields.create({ mailingListId: listId, name: 'Country' })
		).customFieldId;
		await api.customFields.update({
			mailingListId: listId,
			customFieldId: fieldId,
			name: 'Country',
			isHidden: true,
		});
	});

	it('subscribers.subscribe + subscribeMany', async () => {
		const one = await api.subscribers.subscribe({
			mailingListId: listId,
			email: email(1),
			name: 'Plugin Test',
			customFields: { Country: 'NL' },
			hasExternalDoubleOptIn: true,
		});
		subscriberId = one.ID;
		expect(one.CustomFields?.[0]?.Value).toBe('NL');
		const many = await api.subscribers.subscribeMany({
			mailingListId: listId,
			hasExternalDoubleOptIn: true,
			subscribers: [{ email: email(2) }, { email: email(3) }],
		});
		expect(many.subscribers).toHaveLength(2);
	});

	it('subscribers.getByEmail + getById + getByIdAnyList + list', async () => {
		await api.subscribers.getByEmail({
			mailingListId: listId,
			email: email(1),
		});
		await api.subscribers.getById({ mailingListId: listId, subscriberId });
		const any = await api.subscribers.getByIdAnyList({ subscriberId });
		expect(any.ID).toBe(subscriberId);
		const listed = await api.subscribers.list({ mailingListId: listId });
		expect(listed.Subscribers).toHaveLength(3);
	});

	it('subscribers.update + addTags + removeTags', async () => {
		const updated = await api.subscribers.update({
			mailingListId: listId,
			subscriberId,
			email: email(1),
			name: 'Plugin Test 2',
			customFields: { Country: 'DE' },
		});
		expect(updated.Name).toBe('Plugin Test 2');
		const members = [{ subscriberId, tags: ['corsair-test'] }];
		await api.subscribers.addTags({ mailingListId: listId, members });
		await api.subscribers.removeTags({ mailingListId: listId, members });
	});

	it('segments.create + list + get + members', async () => {
		segmentId = (
			await api.segments.create({
				mailingListId: listId,
				name: 'corsair-seg',
				criteria: [
					{
						field: 'RecipientEmail',
						comparer: 'EndsWith',
						value: 'example.com',
					},
					// A custom field is filtered by its ID.
					{ field: fieldId, comparer: 'Is', value: 'DE' },
				],
			})
		).segmentId;
		const segments = await api.segments.list({ mailingListId: listId });
		expect(segments.Segments.map((s) => s.ID)).toContain(segmentId);
		await api.segments.get({ mailingListId: listId, segmentId });
		await api.segments.members({ mailingListId: listId, segmentId });
	});

	it('segments.addCriteria + updateCriteria + update', async () => {
		const { criterionNumber } = await api.segments.addCriteria({
			mailingListId: listId,
			segmentId,
			field: 'RecipientName',
			comparer: 'Contains',
			value: 'Plugin',
		});
		await api.segments.updateCriteria({
			mailingListId: listId,
			segmentId,
			criterionNumber,
			field: 'RecipientName',
			comparer: 'Contains',
			value: 'Test',
		});
		await api.segments.update({
			mailingListId: listId,
			segmentId,
			name: 'corsair-seg-2',
		});
		const segment = await api.segments.get({
			mailingListId: listId,
			segmentId,
		});
		expect(segment.Criteria?.at(-1)?.Value).toBe('Test');
	});

	it('campaigns.create + get + update + clone (drafts only)', async () => {
		campaignId = (
			await api.campaigns.create({
				name: `corsair-plugin-test-${stamp}`,
				subject: 'corsair plugin test (never sent)',
				senderEmail: sender,
				htmlContent: '<p>never sent</p>',
				mailingLists: [{ mailingListId: listId }],
			})
		).campaignId;
		await api.campaigns.get({ campaignId });
		await api.campaigns.update({
			campaignId,
			name: `corsair-plugin-test-${stamp}-2`,
			subject: 'corsair plugin test (never sent)',
			senderEmail: sender,
			htmlContent: '<p>never sent 2</p>',
			mailingLists: [{ mailingListId: listId, segmentId }],
		});
		const copy = await api.campaigns.clone({ campaignId });
		await api.campaigns.delete({ campaignId: copy.ID });
	});

	it('campaigns.summary + stats + activityByLocation + linkActivity', async () => {
		const summary = await api.campaigns.summary({ campaignId });
		expect(summary.CampaignID).toBe(campaignId);
		await api.campaigns.stats({ campaignId, type: 'Sent' });
		await api.campaigns.activityByLocation({ campaignId });
		await api.campaigns.linkActivity({ campaignId });
	});

	it('campaigns.abSummary answers 404 for a regular campaign', async () => {
		await expect(api.campaigns.abSummary({ campaignId })).rejects.toMatchObject(
			{
				status: 404,
			},
		);
	});

	it('campaigns.delete + segments.delete', async () => {
		await api.campaigns.delete({ campaignId });
		campaignId = '';
		await api.segments.delete({ mailingListId: listId, segmentId });
	});

	it('subscribers.remove + removeMany', async () => {
		// Moosend refuses to remove an unsubscribed address, so these run first.
		await api.subscribers.remove({ mailingListId: listId, email: email(1) });
		const removed = await api.subscribers.removeMany({
			mailingListId: listId,
			emails: [email(2)],
		});
		expect(removed.EmailsProcessed).toBe(1);
		const removedList = await api.subscribers.list({
			mailingListId: listId,
			status: 'Removed',
		});
		expect(removedList.Subscribers).toHaveLength(2);
	});

	it('subscribers.unsubscribe + unsubscribeFromCampaign + unsubscribeFromAccount, then delete + deleteMany + deleteFromAccount', async () => {
		await api.subscribers.subscribeMany({
			mailingListId: listId,
			hasExternalDoubleOptIn: true,
			subscribers: [{ email: email(4) }, { email: email(5) }],
		});
		await api.subscribers.unsubscribe({
			mailingListId: listId,
			email: email(4),
		});
		const unsubscribed = await api.subscribers.list({
			mailingListId: listId,
			status: 'Unsubscribed',
		});
		expect(unsubscribed.Subscribers).toHaveLength(1);
		const draft = await api.campaigns.create({
			name: `corsair-plugin-test-${stamp}-u`,
			subject: 'corsair plugin test (never sent)',
			senderEmail: sender,
			htmlContent: '<p>never sent</p>',
			mailingLists: [{ mailingListId: listId }],
		});
		await api.subscribers.unsubscribeFromCampaign({
			mailingListId: listId,
			campaignId: draft.campaignId,
			email: email(5),
		});
		await api.campaigns.delete({ campaignId: draft.campaignId });
		await api.subscribers.unsubscribeFromAccount({ email: email(3) });
		await api.subscribers.delete({ mailingListId: listId, email: email(1) });
		const deleted = await api.subscribers.deleteMany({
			mailingListId: listId,
			emails: [email(2), email(4)],
		});
		expect(deleted.EmailsProcessed).toBe(2);
		await api.subscribers.deleteFromAccount({ email: email(3) });
		await api.subscribers.deleteFromAccount({ email: email(5) });
	});

	it('customFields.delete + lists.delete', async () => {
		await api.customFields.delete({
			mailingListId: listId,
			customFieldId: fieldId,
		});
		await api.lists.delete({ mailingListId: listId });
		listId = '';
	});
});
