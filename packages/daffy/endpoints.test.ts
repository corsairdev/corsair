// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint has a
// request-level test that asserts its route and request options.

import { makeDaffyRequest } from './client';
import { Accounts, Gifts, NonProfits } from './endpoints';
import type { DaffyContext } from './index';

jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));
jest.mock('./client', () => ({ makeDaffyRequest: jest.fn() }));

const mockedRequest = makeDaffyRequest as jest.Mock;
const ctx = { key: 'test-key' } as unknown as DaffyContext;
const code = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const cause = {
	id: 1,
	name: 'Education',
	logo: 'https://static.daffy.org/cause.png',
	color: '#C6ADF8',
};
const nonprofit = {
	ein: '261544963',
	name: 'Khan Academy',
	website: 'https://www.khanacademy.org/',
	city: 'Mountain View',
	state: 'CA',
	public_path: '/charities/261544963-khan-academy',
	public_url: 'https://www.daffy.org/charities/261544963-khan-academy',
	logo: 'https://static.daffy.org/nonprofit.png',
	cause,
	causes: [cause],
};
const gift = {
	name: 'Jamie',
	amount: 18,
	message: null,
	code,
	ein: null,
	seen: false,
	status: 'new' as const,
	updated_at: '2022-11-02T16:15:17.827Z',
	created_at: '2022-11-02T16:15:17.827Z',
	claimed: false,
	url: `https://www.daffy.org/gift/${code}`,
};
const contribution = {
	units: 100,
	type: 'crypto_payment',
	status: 'success',
	valuation: 1,
	currency: 'USDT',
	frequency: 'OneTime',
	created_at: '2022-01-01T00:00:00Z',
	received_at: '2022-01-02T00:00:00Z',
	completed_at: '2022-01-03T00:00:00Z',
	id: 1,
};
const donation = {
	id: 1,
	amount: 20,
	status: 'completed',
	note: 'Thank you',
	scheduled_donation_id: null,
	visibility: 'public',
	created_at: '2022-11-23T01:28:17.821Z',
	mailed_at: null,
	non_profit: nonprofit,
};
const user = {
	id: 1,
	name: 'API User',
	avatar: 'https://static.daffy.org/avatar.png',
	cover_image: 'https://static.daffy.org/cover.png',
	slug: 'api-user',
	fund_name: 'API User Fund',
	current_fund: {
		id: 1,
		name: 'API User Fund',
		summary: 'A charitable fund.',
		causes: [cause],
		users: [
			{
				id: 1,
				name: 'API User',
				avatar: 'https://static.daffy.org/avatar.png',
				slug: 'api-user',
			},
		],
	},
	follows_user: false,
	follows_viewer: false,
	onboarding_status: 'none',
};
const page = (item: object) => ({
	items: [item],
	meta: { count: 1, page: 1, last: 1 },
});

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('Daffy endpoints', () => {
	it('accounts.getBalance requests the authenticated balance', async () => {
		const response = {
			amount: 1,
			pending_deposit_balance: 0,
			portfolio_balance: 1,
			available_balance: 1,
		};
		mockedRequest.mockResolvedValue(response);
		expect(await Accounts.getBalance(ctx, {})).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/users/me/balance', 'test-key');
	});

	it('accounts.getContributions passes the requested page', async () => {
		mockedRequest.mockResolvedValue(page(contribution));
		await Accounts.getContributions(ctx, { page: 2 });
		expect(mockedRequest).toHaveBeenCalledWith('/contributions', 'test-key', {
			query: { page: 2 },
		});
	});

	it('accounts.getDonations passes the requested page', async () => {
		mockedRequest.mockResolvedValue(page(donation));
		await Accounts.getDonations(ctx, { page: 3 });
		expect(mockedRequest).toHaveBeenCalledWith('/donations', 'test-key', {
			query: { page: 3 },
		});
	});

	it('accounts.getUserCauses requests causes for the supplied user', async () => {
		mockedRequest.mockResolvedValue([cause]);
		await Accounts.getUserCauses(ctx, { userId: 1 });
		expect(mockedRequest).toHaveBeenCalledWith('/users/1/causes', 'test-key');
	});

	it('accounts.getUserDonations uses the public user donation route', async () => {
		mockedRequest.mockResolvedValue(page({ ...donation, user_id: 1 }));
		await Accounts.getUserDonations(ctx, { userId: 1, page: 2 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/users/1/donations',
			'test-key',
			{
				query: { page: 2 },
			},
		);
	});

	it('accounts.getUserProfile requests the authenticated profile', async () => {
		mockedRequest.mockResolvedValue(user);
		await Accounts.getUserProfile(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/users/me', 'test-key');
	});

	it('accounts.getUserByUsername encodes the supplied username', async () => {
		mockedRequest.mockResolvedValue(user);
		await Accounts.getUserByUsername(ctx, { username: 'api user' });
		expect(mockedRequest).toHaveBeenCalledWith('/users/api%20user', 'test-key');
	});

	it('gifts.create sends the validated POST body', async () => {
		mockedRequest.mockResolvedValue(gift);
		await Gifts.create(ctx, { name: 'Jamie', amount: 18 });
		expect(mockedRequest).toHaveBeenCalledWith('/gifts', 'test-key', {
			method: 'POST',
			body: { name: 'Jamie', amount: 18 },
		});
	});

	it('gifts.getByCode encodes the gift code', async () => {
		mockedRequest.mockResolvedValue(gift);
		await Gifts.getByCode(ctx, { code });
		expect(mockedRequest).toHaveBeenCalledWith(`/gifts/${code}`, 'test-key');
	});

	it('gifts.list passes the requested page', async () => {
		mockedRequest.mockResolvedValue(page(gift));
		await Gifts.list(ctx, { page: 4 });
		expect(mockedRequest).toHaveBeenCalledWith('/gifts', 'test-key', {
			query: { page: 4 },
		});
	});

	it('nonProfits.getByEin encodes the EIN', async () => {
		mockedRequest.mockResolvedValue(nonprofit);
		await NonProfits.getByEin(ctx, { ein: '26/1544963' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/non_profits/26%2F1544963',
			'test-key',
		);
	});

	it('nonProfits.search maps filters to Daffy query parameter names', async () => {
		mockedRequest.mockResolvedValue(page(nonprofit));
		await NonProfits.search(ctx, { causeId: 1, query: 'education', page: 2 });
		expect(mockedRequest).toHaveBeenCalledWith('/non_profits', 'test-key', {
			query: { cause_id: 1, query: 'education', page: 2 },
		});
	});
});
