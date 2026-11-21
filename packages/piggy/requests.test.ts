import { logEventFromContext } from 'corsair/core';
import {
	Businesses,
	Contacts,
	Giftcards,
	Loyalty,
	Points,
	Promotions,
	Rewards,
	Vouchers,
	Webhooks,
} from './endpoints';
import {
	businessProfileAnswer,
	businessProfiles,
	contactAnswer,
	contactsList,
	createdContact,
	creditBalance,
	creditReception,
	directPointsTransaction,
	giftcard,
	giftcardPrograms,
	giftcardSent,
	giftcardsList,
	loyaltyProgram,
	loyaltyTransactions,
	prepaidBalance,
	promotionAnswer,
	promotions,
	redeemedVoucher,
	reward,
	rewardReception,
	rewards,
	tier,
	voucherAnswer,
	voucherLock,
	vouchersList,
	webhookSubscription,
	webhookSubscriptions,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'pat-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: TOKEN, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

function expectCall(expected: Partial<ReturnType<typeof lastRequest>>) {
	const sent = lastRequest();
	for (const [key, value] of Object.entries(expected)) {
		expect(sent[key as keyof typeof sent]).toEqual(value);
	}
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('contacts', () => {
	it('list sends paging, date and attribute filters', async () => {
		respond(contactsList);
		await invoke(Contacts.list, {
			limit: 25,
			page: 2,
			sort: '-created_at',
			createdAtGte: '2026-01-01',
			attributesQuery: { 'attributes[likes_pizza]': 'true' },
		});
		expectCall({
			origin: 'https://api.leat.com',
			path: '/api/v3/oauth/clients/contacts',
			query: {
				limit: '25',
				page: '2',
				sort: '-created_at',
				'created_at[gte]': '2026-01-01',
				'attributes[likes_pizza]': 'true',
			},
			method: 'GET',
		});
		expect(lastRequest().headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('create posts email and referral code', async () => {
		respond(createdContact, 201);
		const created = (await invoke(Contacts.create, {
			email: 'spongebob@bikinibottom.sea',
			referralCode: 'PAT-R-1',
		})) as { data: { uuid: string } };
		expect(created.data.uuid).toBe(createdContact.data.uuid);
		expectCall({
			path: '/api/v3/oauth/clients/contacts',
			method: 'POST',
			body: {
				email: 'spongebob@bikinibottom.sea',
				referral_code: 'PAT-R-1',
			},
		});
	});

	it('update PUTs the attribute map', async () => {
		respond(contactAnswer);
		await invoke(Contacts.update, {
			contactUuid: 'u1',
			attributes: { firstname: 'John', likes_pizza: true },
		});
		expectCall({
			path: '/api/v3/oauth/clients/contacts/u1',
			method: 'PUT',
			body: { attributes: { firstname: 'John', likes_pizza: true } },
		});
	});

	it('delete POSTs the deletion type to the delete route', async () => {
		respond({ data: null, meta: {} });
		await invoke(Contacts.deleteContact, { contactUuid: 'u1', type: 'GDPR' });
		expectCall({
			path: '/api/v3/oauth/clients/contacts/u1/delete',
			method: 'POST',
			body: { type: 'GDPR' },
		});
	});

	it('merge POSTs both UUIDs', async () => {
		respond({});
		await invoke(Contacts.merge, {
			sourceContactUuid: 's1',
			destinationContactUuid: 'd1',
		});
		expectCall({
			path: '/api/v3/oauth/clients/contacts/merge',
			method: 'POST',
			body: { source_contact_uuid: 's1', destination_contact_uuid: 'd1' },
		});
	});

	it('claim PUTs the email on the claim route', async () => {
		respond(contactAnswer);
		await invoke(Contacts.claim, {
			anonymousContactUuid: 'anon',
			email: 'real@bikinibottom.sea',
		});
		expectCall({
			path: '/api/v3/oauth/clients/contacts/anon/claim',
			method: 'PUT',
			body: { email: 'real@bikinibottom.sea' },
		});
	});

	it('findOrCreate queries by email', async () => {
		respond(contactAnswer);
		await invoke(Contacts.findOrCreate, {
			email: 'spongebob@bikinibottom.sea',
		});
		expectCall({
			path: '/api/v3/oauth/clients/contacts/find-or-create',
			query: { email: 'spongebob@bikinibottom.sea' },
			method: 'GET',
		});
	});

	it('balance routes hang off the contact UUID', async () => {
		respond(creditBalance);
		const balance = (await invoke(Contacts.getCreditBalance, {
			contactUuid: 'u1',
		})) as { data: { balance: number } };
		expect(balance.data.balance).toBe(49);
		expectCall({
			path: '/api/v3/oauth/clients/contacts/u1/credit-balance',
			method: 'GET',
		});

		respond(prepaidBalance);
		await invoke(Contacts.getPrepaidBalance, { contactUuid: 'u1' });
		expectCall({
			path: '/api/v3/oauth/clients/contacts/u1/prepaid-balance',
		});

		respond(tier);
		await invoke(Contacts.getTier, { contactUuid: 'u1' });
		expectCall({ path: '/api/v3/oauth/clients/contacts/u1/tier' });
	});
});

describe('loyalty', () => {
	it('getProgram hits the program route', async () => {
		respond(loyaltyProgram);
		const program = (await invoke(Loyalty.getProgram, {})) as {
			data: { name?: string };
		};
		expect(program.data.name).toBe('Squidward Test');
		expectCall({
			path: '/api/v3/oauth/clients/loyalty-program',
			method: 'GET',
		});
	});

	it('listTransactions sends type and shop filters', async () => {
		respond(loyaltyTransactions);
		await invoke(Loyalty.listTransactions, {
			type: 'reward_receptions',
			shopUuid: 'shop-1',
			limit: 50,
		});
		expectCall({
			path: '/api/v3/oauth/clients/loyalty-transactions',
			query: {
				type: 'reward_receptions',
				shop_uuid: 'shop-1',
				limit: '50',
			},
		});
	});
});

describe('points', () => {
	it('create wraps contact and business profile UUIDs', async () => {
		respond(directPointsTransaction, 201);
		const tx = (await invoke(Points.create, {
			contactUuid: 'c1',
			businessProfileUuid: 'b1',
			points: 50,
			customAttributes: { reason: 'bonus' },
		})) as { data: { points?: number } };
		expect(tx.data.points).toBe(50);
		expectCall({
			path: '/api/v3/oauth/clients/direct-points-transactions',
			method: 'POST',
			body: {
				contact: { uuid: 'c1' },
				business_profile: { uuid: 'b1' },
				points: 50,
				custom_attributes: { reason: 'bonus' },
			},
		});
	});

	it('reverse posts to the reverse route', async () => {
		respond(directPointsTransaction, 201);
		await invoke(Points.reverse, { uuid: 't1' });
		expectCall({
			path: '/api/v3/oauth/clients/direct-points-transactions/t1/reverse',
			method: 'POST',
		});
	});
});

describe('rewards', () => {
	it('redeem posts the reception triple', async () => {
		respond(rewardReception, 201);
		const reception = (await invoke(Rewards.redeem, {
			contactUuid: 'c1',
			rewardUuid: 'r1',
			shopUuid: 's1',
		})) as { data: { uuid?: string } };
		expect(reception.data.uuid).toBe('55537e6c-23e8-4c0c-bbce-65f587fb543a');
		expectCall({
			path: '/api/v3/oauth/clients/reward-receptions',
			method: 'POST',
			body: { contact_uuid: 'c1', reward_uuid: 'r1', shop_uuid: 's1' },
		});
	});

	it('reverse posts to the reception reverse route', async () => {
		respond(creditReception, 201);
		await invoke(Rewards.reverseRedemption, { rewardReceptionUuid: 'rr1' });
		expectCall({
			path: '/api/v3/oauth/clients/reward-receptions/rr1/reverse',
			method: 'POST',
		});
	});

	it('list sends the shop filter', async () => {
		respond(rewards);
		await invoke(Rewards.list, { shopUuid: 's1', contactUuid: 'c1' });
		expectCall({
			path: '/api/v3/oauth/clients/rewards',
			query: { shop_uuid: 's1', contact_uuid: 'c1' },
		});
	});
});

describe('promotions', () => {
	it('list and get hit the promotions routes', async () => {
		respond(promotions);
		const page = (await invoke(Promotions.list, {})) as {
			data: Array<{ uuid?: string }>;
		};
		expect(page.data[0]?.uuid).toBe('123');
		expectCall({ path: '/api/v3/oauth/clients/promotions', method: 'GET' });

		respond(promotionAnswer);
		await invoke(Promotions.get, { promotionUuid: 'p1' });
		expectCall({ path: '/api/v3/oauth/clients/promotions/p1' });
	});
});

describe('vouchers', () => {
	it('list sends the status filter and limit', async () => {
		respond(vouchersList);
		await invoke(Vouchers.list, {
			status: 'ACTIVE',
			promotionUuid: 'p1',
			limit: 100,
		});
		expectCall({
			path: '/api/v3/oauth/clients/vouchers',
			query: {
				status: 'ACTIVE',
				promotion_uuid: 'p1',
				limit: '100',
			},
		});
	});

	it('create posts the promotion link', async () => {
		respond(voucherAnswer, 201);
		await invoke(Vouchers.create, { promotionUuid: 'p1', code: 'MINE' });
		expectCall({
			path: '/api/v3/oauth/clients/vouchers',
			method: 'POST',
			body: { promotion_uuid: 'p1', code: 'MINE' },
		});
	});

	it('find queries by code', async () => {
		respond(voucherAnswer);
		await invoke(Vouchers.find, { code: 'ABC123' });
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/find',
			query: { code: 'ABC123' },
		});
	});

	it('redeem posts code, shop and release key', async () => {
		respond(redeemedVoucher);
		const voucherOut = (await invoke(Vouchers.redeem, {
			code: 'ABC123',
			shopUuid: 's1',
			releaseKey: 'rk1',
		})) as { data: { status?: string } };
		expect(voucherOut.data.status).toBe('REDEEMED');
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/redeem',
			method: 'POST',
			body: { code: 'ABC123', shop_uuid: 's1', release_key: 'rk1' },
		});
	});

	it('lock returns the release key and release posts it back', async () => {
		respond(voucherLock, 201);
		const lock = (await invoke(Vouchers.lock, {
			voucherUuid: 'v1',
		})) as { data: { lock?: { release_key?: string } } };
		expect(lock.data.lock?.release_key).toBe(
			'5cc7e94a-7aa2-4f4a-8a8c-c20ab3a086ce',
		);
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/v1/lock',
			method: 'POST',
		});

		respond(voucherLock, 201);
		await invoke(Vouchers.release, { voucherUuid: 'v1', releaseKey: 'rk1' });
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/v1/release',
			body: { release_key: 'rk1' },
		});
	});

	it('validate posts the shop and optional contact', async () => {
		respond({});
		await invoke(Vouchers.validate, {
			voucherUuid: 'v1',
			shopUuid: 's1',
			contactUuid: 'c1',
		});
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/v1/validate',
			method: 'POST',
			body: { contact_uuid: 'c1', shop_uuid: 's1' },
		});
	});
});

describe('giftcards', () => {
	it('create always sends the digital type', async () => {
		respond(giftcard, 201);
		const card = (await invoke(Giftcards.create, {
			giftcardProgramUuid: 'gp1',
		})) as { data: { type?: string } };
		expect(card.data.type).toBe('DIGITAL');
		expectCall({
			path: '/api/v3/oauth/clients/giftcards',
			method: 'POST',
			body: { type: 1, giftcard_program_uuid: 'gp1' },
		});
	});

	it('findOneByHash queries by hash', async () => {
		respond(giftcard);
		await invoke(Giftcards.findOneByHash, { hash: '41654' });
		expectCall({
			path: '/api/v3/oauth/clients/giftcards/find-one-by',
			query: { hash: '41654' },
		});
	});

	it('sendByEmail posts the contact and merge tags', async () => {
		respond(giftcardSent);
		const sent = (await invoke(Giftcards.sendByEmail, {
			giftcardUuid: 'g1',
			contactUuid: 'c1',
			mergeTags: { 'custom.message': 'Hello' },
		})) as { data: { message?: string } };
		expect(sent.data.message).toBe('success');
		expectCall({
			path: '/api/v3/oauth/clients/giftcards/g1/send-by-email',
			method: 'POST',
			body: {
				contact_uuid: 'c1',
				merge_tags: { 'custom.message': 'Hello' },
			},
		});
	});

	it('listPrograms hits the programs route', async () => {
		respond(giftcardPrograms);
		const page = (await invoke(Giftcards.listPrograms, {})) as {
			data: Array<{ name?: string }>;
		};
		expect(page.data[0]?.name).toBe('Bikini Bottom Bucks');
		expectCall({ path: '/api/v3/oauth/clients/giftcard-programs' });
	});

	it('list sends the program filter', async () => {
		respond(giftcardsList);
		await invoke(Giftcards.list, { giftcardProgramUuid: 'gp1' });
		expectCall({
			query: { giftcard_program_uuid: 'gp1' },
		});
	});
});

describe('businesses', () => {
	it('listProfiles and getProfile hit the profile routes', async () => {
		respond(businessProfiles);
		const page = (await invoke(Businesses.listProfiles, {})) as {
			data: Array<{ uuid?: string }>;
		};
		expect(page.data[0]?.uuid).toBe('123123');
		expectCall({
			path: '/api/v3/oauth/clients/business-profiles',
			method: 'GET',
		});

		respond(businessProfileAnswer);
		await invoke(Businesses.getProfile, { uuid: 'bp1' });
		expectCall({ path: '/api/v3/oauth/clients/business-profiles/bp1' });
	});
});

describe('webhooks', () => {
	it('create posts the subscription and never logs the secret', async () => {
		respond({ data: { uuid: 'ws1' }, meta: [] }, 201);
		await invoke(Webhooks.create, {
			name: 'n1',
			eventType: 'contact_created',
			url: 'https://example.com/hook',
			secret: 'super-secret-value',
			version: 'V2',
		});
		expectCall({
			path: '/api/v3/oauth/clients/webhook-subscriptions',
			method: 'POST',
			body: {
				name: 'n1',
				event_type: 'contact_created',
				url: 'https://example.com/hook',
				secret: 'super-secret-value',
				version: 'V2',
			},
		});
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('super-secret-value');
	});

	it('delete sends DELETE to the subscription route', async () => {
		respond({ data: [], meta: [] });
		await invoke(Webhooks.deleteSubscription, {
			webhookSubscriptionUuid: 'ws1',
		});
		expectCall({
			path: '/api/v3/oauth/clients/webhook-subscriptions/ws1',
			method: 'DELETE',
		});
	});

	it('list sends event type and status filters', async () => {
		respond(webhookSubscriptions);
		await invoke(Webhooks.list, { status: 'ACTIVE' });
		expectCall({
			query: { status: 'ACTIVE' },
		});
	});
});

describe('reads and updates the review listed', () => {
	it('contacts.createAnonymous posts the identifier value', async () => {
		respond(createdContact, 201);
		await invoke(Contacts.createAnonymous, {
			contactIdentifierValue: 'card-123',
		});
		expectCall({
			path: '/api/v3/oauth/clients/contacts/anonymous',
			method: 'POST',
			body: { contact_identifier_value: 'card-123' },
		});
	});

	it('contacts.findOneByEmail sends the email as a query', async () => {
		respond(contactAnswer);
		await invoke(Contacts.findOneByEmail, { email: 'jane@example.com' });
		expectCall({
			path: '/api/v3/oauth/clients/contacts/find-one-by',
			method: 'GET',
			query: { email: 'jane@example.com' },
		});
	});

	it('contacts.get reads one contact by UUID', async () => {
		respond(contactAnswer);
		const contact = (await invoke(Contacts.get, { contactUuid: 'c1' })) as {
			data: { uuid?: string };
		};
		expect(contact.data.uuid).toBeTruthy();
		expectCall({ path: '/api/v3/oauth/clients/contacts/c1', method: 'GET' });
	});

	it('contacts.list keeps the validated paging over attribute filters', async () => {
		respond(contactsList);
		await invoke(Contacts.list, {
			limit: 25,
			page: 2,
			attributesQuery: { page: 1, city: 'Bikini Bottom' },
		});
		const sent = lastRequest();
		expect(sent.query.page).toBe('2');
		expect(sent.query.limit).toBe('25');
		expect(sent.query.city).toBe('Bikini Bottom');
	});

	it('points.get reads one transaction', async () => {
		respond(directPointsTransaction);
		await invoke(Points.get, { uuid: 't1' });
		expectCall({
			path: '/api/v3/oauth/clients/direct-points-transactions/t1',
			method: 'GET',
		});
	});

	it('rewards.get and rewards.update hang off the reward UUID', async () => {
		respond({ data: reward, meta: [] });
		await invoke(Rewards.get, { rewardUuid: 'r1' });
		expectCall({ path: '/api/v3/oauth/clients/rewards/r1', method: 'GET' });

		respond({ data: reward, meta: [] });
		await invoke(Rewards.update, { rewardUuid: 'r1', title: 'New title' });
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v3/oauth/clients/rewards/r1');
		expect(sent.method).toBe('PUT');
		expect(sent.body).toMatchObject({ title: 'New title' });
	});

	it('vouchers.reverseRedemption posts to the reverse route', async () => {
		respond({});
		await invoke(Vouchers.reverseRedemption, { voucherUuid: 'v1' });
		expectCall({
			path: '/api/v3/oauth/clients/vouchers/v1/reverse',
			method: 'POST',
		});
	});

	it('giftcards.get reads one giftcard', async () => {
		respond(giftcard);
		await invoke(Giftcards.get, { giftcardUuid: 'g1' });
		expectCall({ path: '/api/v3/oauth/clients/giftcards/g1', method: 'GET' });
	});

	it('webhooks.get and webhooks.update hang off the subscription UUID', async () => {
		respond({ data: webhookSubscription, meta: [] });
		await invoke(Webhooks.get, { webhookSubscriptionUuid: 'w1' });
		expectCall({
			path: '/api/v3/oauth/clients/webhook-subscriptions/w1',
			method: 'GET',
		});

		respond({ data: webhookSubscription, meta: [] });
		await invoke(Webhooks.update, {
			webhookSubscriptionUuid: 'w1',
			name: 'Renamed',
		});
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v3/oauth/clients/webhook-subscriptions/w1');
		expect(sent.method).toBe('PUT');
		expect(sent.body).toMatchObject({ name: 'Renamed' });
	});

	it('vouchers.lock keeps the release key out of the event log', async () => {
		respond(voucherLock);
		await invoke(Vouchers.lock, { voucherUuid: 'v1' });
		const logged = JSON.stringify(mockLog.mock.calls);
		const key = (voucherLock as { data: { lock?: { release_key?: string } } })
			.data.lock?.release_key;
		expect(key).toBeTruthy();
		expect(logged).not.toContain(key as string);
	});
});
