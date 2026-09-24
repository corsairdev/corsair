import {
	DaffyEndpointInputSchemas,
	DaffyEndpointOutputSchemas,
} from './endpoints/types';

const pagination = { items: [], meta: { count: 0, page: 1, last: 1 } };

describe('Daffy endpoint schemas', () => {
	it('validates gift creation and its documented minimum amount', () => {
		expect(
			DaffyEndpointInputSchemas.createGift.parse({ name: 'Jamie', amount: 18 }),
		).toEqual({ name: 'Jamie', amount: 18 });
		expect(() =>
			DaffyEndpointInputSchemas.createGift.parse({
				name: 'Jamie',
				amount: 17.99,
			}),
		).toThrow();
	});

	it('validates balance, contribution, donation, and gift-list inputs', () => {
		expect(DaffyEndpointInputSchemas.getBalance.parse({})).toEqual({});
		expect(
			DaffyEndpointInputSchemas.getContributions.parse({ page: 2 }),
		).toEqual({ page: 2 });
		expect(DaffyEndpointInputSchemas.getDonations.parse({ page: 3 })).toEqual({
			page: 3,
		});
		expect(DaffyEndpointInputSchemas.getGifts.parse({ page: 4 })).toEqual({
			page: 4,
		});
	});

	it('validates the documented gift code format', () => {
		expect(
			DaffyEndpointInputSchemas.getGiftByCode.parse({
				code: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
			}),
		).toEqual({ code: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' });
		expect(() =>
			DaffyEndpointInputSchemas.getGiftByCode.parse({ code: 'not-a-code' }),
		).toThrow();
	});

	it('validates nonprofit lookup and search inputs', () => {
		expect(
			DaffyEndpointInputSchemas.getNonProfitByEin2.parse({ ein: '261544963' }),
		).toEqual({ ein: '261544963' });
		expect(
			DaffyEndpointInputSchemas.searchNonProfits.parse({
				causeId: 1,
				query: 'education',
				page: 2,
			}),
		).toEqual({ causeId: 1, query: 'education', page: 2 });
	});

	it('validates user causes, donations, profile, and username inputs', () => {
		expect(
			DaffyEndpointInputSchemas.getUserCauses.parse({ userId: 1 }),
		).toEqual({ userId: 1 });
		expect(
			DaffyEndpointInputSchemas.getUserDonations.parse({ userId: 1, page: 2 }),
		).toEqual({ userId: 1, page: 2 });
		expect(DaffyEndpointInputSchemas.getUserProfile.parse({})).toEqual({});
		expect(
			DaffyEndpointInputSchemas.getUserByUsername.parse({
				username: 'api-user',
			}),
		).toEqual({ username: 'api-user' });
	});

	it('requires the documented balance fields and pagination metadata', () => {
		expect(
			DaffyEndpointOutputSchemas.getBalance.parse({
				amount: 1,
				pending_deposit_balance: 0,
				portfolio_balance: 1,
				available_balance: 1,
			}),
		).toMatchObject({ amount: 1 });
		expect(
			DaffyEndpointOutputSchemas.getContributions.parse(pagination),
		).toEqual(pagination);
		expect(DaffyEndpointOutputSchemas.getDonations.parse(pagination)).toEqual(
			pagination,
		);
		expect(DaffyEndpointOutputSchemas.getGifts.parse(pagination)).toEqual(
			pagination,
		);
		expect(
			DaffyEndpointOutputSchemas.getUserDonations.parse(pagination),
		).toEqual(pagination);
		expect(
			DaffyEndpointOutputSchemas.searchNonProfits.parse(pagination),
		).toEqual(pagination);
	});
});
