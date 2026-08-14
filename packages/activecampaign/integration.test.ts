/**
 * Live checks against a real ActiveCampaign account.
 *
 * Skipped unless both `ACTIVECAMPAIGN_API_KEY` and `ACTIVECAMPAIGN_ACCOUNT`
 * are set, so CI and contributors without credentials are unaffected. Every
 * operation here is read-only: nothing is created, changed or deleted.
 */
import { Accounts, Contacts, Deals, Lists, Platform, Tags } from './endpoints';
import { ActiveCampaignEndpointOutputSchemas as Outputs } from './endpoints/types';
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

const upserts: { id: string; data: unknown }[] = [];

function makeStore() {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ id, data });
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
			contacts: makeStore(),
			lists: makeStore(),
			tags: makeStore(),
			accounts: makeStore(),
			deals: makeStore(),
			dealGroups: makeStore(),
			dealStages: makeStore(),
			users: makeStore(),
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
			expect(ActiveCampaignContact.parse(result.contacts[0]).id).toBe(
				result.contacts[0].id,
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
		const result = await Contacts.list(makeCtx(), { limit: 1 });
		expect(result.meta).toBeDefined();
	});
});
