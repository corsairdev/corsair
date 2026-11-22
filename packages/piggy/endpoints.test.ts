import { logEventFromContext } from 'corsair/core';
import {
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
	contactsList,
	createdContact,
	loyaltyProgram,
	loyaltyTransactions,
	promotions,
	rewards,
	tier,
	voucherLock,
	vouchersList,
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a contact page with subscriptions and balances', async () => {
		respond(contactsList);
		const page = (await invoke(Contacts.list, {})) as {
			data: Array<{
				uuid?: string;
				credit_balance?: { balance?: number };
				subscriptions?: Array<{ status?: string }>;
			}>;
		};
		expect(page.data[0]?.uuid).toBe('1b7e3c4a-5f2d-4e8b-9a6c-0d2f4e6a8b1c');
		expect(page.data[0]?.credit_balance?.balance).toBe(2895);
		expect(page.data[0]?.subscriptions?.[0]?.status).toBe('SUBSCRIBED');
	});

	it('keeps a null tier nullish on a contact', async () => {
		respond({
			data: [{ ...contactsList.data[0], tier: null }],
			meta: contactsList.meta,
		});
		const page = (await invoke(Contacts.list, {})) as {
			// unknown: the tier block is provider-shaped, so the cast keeps it
			// open.
			data: Array<{ tier?: unknown }>;
		};
		expect(page.data[0]?.tier).toBeNull();
	});

	it('parses a created contact UUID', async () => {
		respond(createdContact, 201);
		const created = (await invoke(Contacts.create, {
			email: 'a@b.sea',
		})) as { data: { uuid: string } };
		expect(created.data.uuid).toBe('cd183615-d1cb-402a-b618-6472d5e13890');
	});

	it('parses the loyalty program unit block', async () => {
		respond(loyaltyProgram);
		const program = (await invoke(Loyalty.getProgram, {})) as {
			data: { unit?: { label?: string } };
		};
		expect(program.data.unit?.label).toBe('Calories');
	});

	it('parses loyalty transactions with shop refs', async () => {
		respond(loyaltyTransactions);
		const page = (await invoke(Loyalty.listTransactions, {})) as {
			data: Array<{ shop?: { name?: string }; credits?: number }>;
		};
		expect(page.data[0]?.shop?.name).toBe('Krusty Krab');
		expect(page.data[0]?.credits).toBe(1177);
	});

	it('parses the tier with perks', async () => {
		respond(tier);
		const result = (await invoke(Contacts.getTier, {
			contactUuid: 'u1',
			// unknown: the perks array is provider-shaped, so the cast keeps it
			// open.
		})) as { data: { perks?: unknown[] } };
		expect(result.data.perks).toHaveLength(1);
	});

	it('parses promotions and vouchers pages', async () => {
		respond(promotions);
		const promoPage = (await invoke(Promotions.list, {})) as {
			data: Array<{ voucher_limit?: number | null }>;
		};
		expect(promoPage.data[0]?.voucher_limit).toBe(5000);

		respond(vouchersList);
		const voucherPage = (await invoke(Vouchers.list, {})) as {
			data: Array<{ is_redeemed?: boolean }>;
		};
		expect(voucherPage.data[0]?.is_redeemed).toBe(false);
	});

	it('parses the voucher lock release key', async () => {
		respond(voucherLock, 201);
		const lock = (await invoke(Vouchers.lock, {
			voucherUuid: 'v1',
		})) as { data: { lock?: { system_release_at?: string } } };
		expect(lock.data.lock?.system_release_at).toBe('2023-11-13T10:01:46+00:00');
	});

	it('parses the rewards page', async () => {
		respond(rewards);
		const page = (await invoke(Rewards.list, {})) as {
			data: Array<{ required_credits?: number }>;
		};
		expect(page.data[0]?.required_credits).toBe(2);
	});

	it('parses webhook subscriptions with versions', async () => {
		respond(webhookSubscriptions);
		const page = (await invoke(Webhooks.list, {})) as {
			data: Array<{ version?: string }>;
		};
		expect(page.data[0]?.version).toBe('V1');
	});

	it('parses the undocumented merge answer as an open object', async () => {
		respond({ data: null, meta: {} });
		await expect(
			invoke(Contacts.merge, {
				sourceContactUuid: 's1',
				destinationContactUuid: 'd1',
			}),
		).resolves.toEqual({ data: null, meta: {} });
	});
});

describe('input validation', () => {
	it('rejects an email-less create', async () => {
		await rejects(Contacts.create, {}, 'email');
	});

	it('rejects an update without attributes', async () => {
		await rejects(Contacts.update, { contactUuid: 'u1' }, 'attributes');
	});

	it('rejects a delete type the docs do not list', async () => {
		await rejects(
			Contacts.deleteContact,
			{ contactUuid: 'u1', type: 'HARD' },
			'type',
		);
	});

	it('rejects a limit over the documented maximum', async () => {
		await rejects(Contacts.list, { limit: 101 }, '100');
		await rejects(Loyalty.listTransactions, { limit: 101 }, '100');
		await rejects(Vouchers.list, { limit: 501 }, '500');
	});

	it('rejects a transaction type the docs do not list', async () => {
		await rejects(Loyalty.listTransactions, { type: 'mystery' }, 'type');
	});

	it('rejects a points create without a business profile', async () => {
		await rejects(
			Points.create,
			{ contactUuid: 'c1', points: 10 },
			'businessProfileUuid',
		);
	});

	it('rejects a redeem without a shop', async () => {
		await rejects(
			Rewards.redeem,
			{ contactUuid: 'c1', rewardUuid: 'r1' },
			'shopUuid',
		);
	});

	it('rejects a voucher update without a status', async () => {
		await rejects(Vouchers.update, { voucherUuid: 'v1' }, 'status');
	});

	it('rejects a release without a release key', async () => {
		await rejects(Vouchers.release, { voucherUuid: 'v1' }, 'releaseKey');
	});

	it('rejects a giftcard send without a contact', async () => {
		await rejects(Giftcards.sendByEmail, { giftcardUuid: 'g1' }, 'contactUuid');
	});

	it('rejects a webhook create without an event type', async () => {
		await rejects(
			Webhooks.create,
			{ name: 'n1', url: 'https://example.com' },
			'eventType',
		);
	});

	it('rejects a webhook version the API does not document', async () => {
		await rejects(
			Webhooks.create,
			{
				name: 'n1',
				eventType: 'contact_created',
				url: 'https://example.com',
				version: 'V3',
			},
			'version',
		);
	});
});
