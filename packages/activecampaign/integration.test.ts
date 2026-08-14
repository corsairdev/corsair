/**
 * Live checks against a real ActiveCampaign account.
 *
 * Skipped unless both `ACTIVECAMPAIGN_API_KEY` and `ACTIVECAMPAIGN_ACCOUNT`
 * are set, so CI and contributors without credentials are unaffected. Every
 * operation here is read-only: nothing is created, changed or deleted.
 */
import { Accounts, Contacts, Deals, Lists, Platform, Tags } from './endpoints';
import { ActiveCampaignEndpointOutputSchemas as Outputs } from './endpoints/types';
import { activecampaign } from './index';
import {
	ActiveCampaignAccount,
	ActiveCampaignContact,
	ActiveCampaignDeal,
	ActiveCampaignDealGroup,
	ActiveCampaignDealStage,
	ActiveCampaignList,
	ActiveCampaignTag,
	ActiveCampaignUser,
} from './schema/database';

const apiKey = process.env.ACTIVECAMPAIGN_API_KEY;
const account = process.env.ACTIVECAMPAIGN_ACCOUNT;

const describeLive = apiKey && account ? describe : describe.skip;

type Ctx = Parameters<typeof Contacts.list>[0];

const upserts: { store: string; id: string; data: unknown }[] = [];

function makeStore(name: string) {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ store: name, id, data });
		},
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		options: { account },
		keys: { get_account: async () => account },
		db: {
			contacts: makeStore('contacts'),
			lists: makeStore('lists'),
			tags: makeStore('tags'),
			accounts: makeStore('accounts'),
			deals: makeStore('deals'),
			dealGroups: makeStore('dealGroups'),
			dealStages: makeStore('dealStages'),
			users: makeStore('users'),
		},
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('ActiveCampaign live API', () => {
	beforeEach(() => {
		upserts.length = 0;
	});

	it('lists contacts matching the official/live schema', async () => {
		const result = await Contacts.list(makeCtx(), { limit: 1 });
		expect(() => Outputs.contactsList.parse(result)).not.toThrow();
		expect(Array.isArray(result.contacts)).toBe(true);
		if (result.contacts?.[0]) {
			const row = result.contacts[0];
			expect(ActiveCampaignContact.parse(row).id).toBe(row.id);
			expect(upserts).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						store: 'contacts',
						id: row.id,
						data: expect.objectContaining({ id: row.id }),
					}),
				]),
			);
		}
	});

	it('lists mailing lists matching the live key set', async () => {
		const result = await Lists.list(makeCtx(), { limit: 1 });
		expect(() => Outputs.listsList.parse(result)).not.toThrow();
		if (result.lists?.[0]) {
			expect(ActiveCampaignList.parse(result.lists[0]).id).toBeTruthy();
		}
	});

	it('lists tags matching the live key set', async () => {
		const result = await Tags.list(makeCtx(), { limit: 1 });
		expect(() => Outputs.tagsList.parse(result)).not.toThrow();
		if (result.tags?.[0]) {
			expect(ActiveCampaignTag.parse(result.tags[0]).id).toBeTruthy();
		}
	});

	it('lists accounts matching the official/live schema', async () => {
		const result = await Accounts.list(makeCtx(), { limit: 1 });
		expect(() => Outputs.accountsList.parse(result)).not.toThrow();
		if (result.accounts?.[0]) {
			expect(ActiveCampaignAccount.parse(result.accounts[0]).id).toBeTruthy();
		}
	});

	it('lists deals matching the official list example types', async () => {
		const result = await Deals.list(makeCtx(), { limit: 1 });
		expect(() => Outputs.dealsList.parse(result)).not.toThrow();
		if (result.deals?.[0]) {
			const parsed = ActiveCampaignDeal.parse(result.deals[0]);
			expect(parsed.id).toBeTruthy();
		}
	});

	it('lists pipelines and stages captured from a live create', async () => {
		const groups = await Deals.listGroups(makeCtx(), { limit: 1 });
		expect(() => Outputs.dealGroupsList.parse(groups)).not.toThrow();
		if (groups.dealGroups?.[0]) {
			expect(
				ActiveCampaignDealGroup.parse(groups.dealGroups[0]).id,
			).toBeTruthy();
		}
		const stages = await Deals.listStages(makeCtx(), { limit: 1 });
		expect(() => Outputs.dealStagesList.parse(stages)).not.toThrow();
		if (stages.dealStages?.[0]) {
			expect(
				ActiveCampaignDealStage.parse(stages.dealStages[0]).id,
			).toBeTruthy();
		}
	});

	it('lists users matching the live key set', async () => {
		const result = await Platform.listUsers(makeCtx(), { limit: 1 });
		expect(() => Outputs.usersList.parse(result)).not.toThrow();
		if (result.users?.[0]) {
			expect(ActiveCampaignUser.parse(result.users[0]).id).toBeTruthy();
		}
	});

	it('authenticates with Api-Token against the account subdomain', async () => {
		const plugin = activecampaign({ key: apiKey, account });
		if (!plugin.keyBuilder) {
			throw new Error('plugin keyBuilder is missing');
		}
		const token = await plugin.keyBuilder(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(token).toBe(apiKey);

		const originalFetch = globalThis.fetch;
		let captured: { url: string; token: string | null } | undefined;
		globalThis.fetch = (async (
			input: string | URL | Request,
			init?: RequestInit,
		) => {
			const headers = new Headers(init?.headers);
			captured = {
				url: String(input),
				token: headers.get('Api-Token'),
			};
			return originalFetch(input, init);
		}) as typeof fetch;
		try {
			const result = await Contacts.list(
				{ ...makeCtx(), key: token ?? '' },
				{ limit: 1 },
			);
			expect(result.meta).toBeDefined();
			expect(captured?.token).toBe(apiKey);
			expect(captured?.url).toContain(`https://${account}.api-us1.com/`);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
