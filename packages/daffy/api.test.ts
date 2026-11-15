// Live API tests for the Daffy plugin (per .github/PLUGIN_PR_RULES.md R4,
// real third-party proof lives outside CI).
//
// Run with: DAFFY_API_KEY=daffy_production_xxx pnpm test api.test.ts
// Without DAFFY_API_KEY every test below is skipped — CI never touches the
// real API. Only idempotent GET reads are exercised here; POST/DELETE writes
// (gifts.create, accounts.createDonation, accounts.cancelDonation) are covered
// by endpoints.test.ts against a mocked transport and are never fired live.
import { makeDaffyRequest } from './client';
import { DaffyEndpointOutputSchemas } from './endpoints/types';

const TEST_KEY: string = process.env.DAFFY_API_KEY ?? '';
const describeLive = TEST_KEY === '' ? describe.skip : describe;

describeLive('Daffy live API', () => {
	it('accounts.getBalance returns the four documented metrics', async () => {
		const raw = await makeDaffyRequest('/users/me/balance', TEST_KEY);
		const balance = DaffyEndpointOutputSchemas.getBalance.parse(raw);
		expect(balance.amount).toEqual(expect.any(Number));
		expect(balance.available_balance).toEqual(expect.any(Number));
	});

	it('accounts.getUserProfile returns the authenticated profile', async () => {
		const raw = await makeDaffyRequest('/users/me', TEST_KEY);
		const profile = DaffyEndpointOutputSchemas.getUserProfile.parse(raw);
		expect(profile.id).toEqual(expect.any(Number));

		const causesRaw = await makeDaffyRequest(
			`/users/${profile.id}/causes`,
			TEST_KEY,
		);
		const causes = DaffyEndpointOutputSchemas.getUserCauses.parse(causesRaw);
		expect(Array.isArray(causes)).toBe(true);
	});

	it('accounts.getContributions returns paginated contributions', async () => {
		const raw = await makeDaffyRequest('/contributions', TEST_KEY, {
			query: { page: 1 },
		});
		const page = DaffyEndpointOutputSchemas.getContributions.parse(raw);
		expect(page.meta.page).toBe(1);
	});

	it('accounts.getDonations returns paginated own donations', async () => {
		const raw = await makeDaffyRequest('/donations', TEST_KEY, {
			query: { page: 1 },
		});
		const page = DaffyEndpointOutputSchemas.getDonations.parse(raw);
		expect(page.meta.page).toBe(1);
	});

	it('accounts.getDonation reads a single user donation when one exists', async () => {
		const profileRaw = await makeDaffyRequest('/users/me', TEST_KEY);
		const profile = DaffyEndpointOutputSchemas.getUserProfile.parse(profileRaw);
		const listRaw = await makeDaffyRequest(
			`/users/${profile.id}/donations`,
			TEST_KEY,
			{ query: { page: 1 } },
		);
		const list = DaffyEndpointOutputSchemas.getUserDonations.parse(listRaw);
		const first = list.items[0];
		if (first === undefined) {
			expect(list.items).toEqual([]);
			return;
		}
		const singleRaw = await makeDaffyRequest(
			`/users/${profile.id}/donations/${first.id}`,
			TEST_KEY,
		);
		const single = DaffyEndpointOutputSchemas.getDonation.parse(singleRaw);
		expect(single.id).toBe(first.id);
	});

	it('gifts.list and gifts.getByCode round-trip when a gift exists', async () => {
		const listRaw = await makeDaffyRequest('/gifts', TEST_KEY, {
			query: { page: 1 },
		});
		const list = DaffyEndpointOutputSchemas.getGifts.parse(listRaw);
		const first = list.items[0];
		if (first === undefined) {
			expect(list.items).toEqual([]);
			return;
		}
		const singleRaw = await makeDaffyRequest(`/gifts/${first.code}`, TEST_KEY);
		const single = DaffyEndpointOutputSchemas.getGiftByCode.parse(singleRaw);
		expect(single.code).toBe(first.code);
	});

	it('nonProfits.getByEin returns the documented nonprofit', async () => {
		const raw = await makeDaffyRequest('/non_profits/261544963', TEST_KEY);
		const nonprofit = DaffyEndpointOutputSchemas.getNonProfitByEin2.parse(raw);
		expect(nonprofit.ein).toBe('261544963');
	});

	it('nonProfits.search returns paginated matches', async () => {
		const raw = await makeDaffyRequest('/non_profits', TEST_KEY, {
			query: { cause_id: 1, query: 'education', page: 1 },
		});
		const page = DaffyEndpointOutputSchemas.searchNonProfits.parse(raw);
		expect(page.meta.page).toBe(1);
	});
});
