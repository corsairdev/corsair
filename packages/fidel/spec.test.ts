import { makeFidelRequest } from './client';
import { fidel, fidelEndpointMeta } from './index';

jest.mock('./client', () => ({
	makeFidelRequest: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const request = jest.mocked(makeFidelRequest);
const logMock = jest.requireMock('corsair/core')
	.logEventFromContext as jest.Mock;

// never: the fixture provides exactly the context fields these handlers read.
const ctx = {
	key: 'secret',
	options: {},
	$getAccountId: jest.fn().mockResolvedValue('account-1'),
} as never;

// unknown: the plugin tree is called the way the runtime calls it, with
// untyped caller input, so the leaves are read structurally.
type Operation = (context: unknown, input: unknown) => Promise<unknown>;
const api = fidel({ key: 'secret' }).endpoints as unknown as Record<
	string,
	Record<string, Operation>
>;

// Response bodies below are the success examples from the Fidel API
// reference (https://reference.fidel.uk/reference), shortened to the fields
// under test. Every documented success body carries a numeric `execution`.
describe('Fidel responses as the provider documents them', () => {
	beforeEach(() => {
		request.mockReset();
		logMock.mockClear();
	});

	it('returns a documented list with its count and pagination cursor', async () => {
		const documented = {
			count: 1,
			items: [
				{ id: '0228b979-6f7c-4238-a309-40f9d6efd3ea', name: 'Program X' },
			],
			last: {
				created: '2020-03-12T18:58:28.622Z',
				id: '57e07137-36cb-4f1d-a661-1d49f296048c',
				accountIdLiveDel: '3693ac7e-3e2b-432c-8c60-2b786453ca9b00',
			},
			resource: '/v1/programs',
			status: 200,
			execution: 47.615489,
		};
		request.mockResolvedValue(documented);
		await expect(api.programs!.listPrograms!(ctx, {})).resolves.toEqual(
			documented,
		);
	});

	it('returns the base64 cursor of a MID insights page', async () => {
		const documented = {
			items: [{ id: 'insight-1' }],
			count: 1,
			last: 'eyJpZCI6IjEifQ==',
		};
		request.mockResolvedValue(documented);
		await expect(
			api['mid-insights']!.listMidInsights!(ctx, { programId: 'program-1' }),
		).resolves.toEqual(documented);
	});

	it('keeps the exists flag of the active-offer check', async () => {
		const documented = {
			count: 0,
			items: [],
			exists: false,
			resource: '/v1/offers/offer-1/cards/card-1',
			status: 200,
			execution: 120.44427,
		};
		request.mockResolvedValue(documented);
		await expect(
			api.offers!.retrieveActiveOfferOnCard!(ctx, {
				offerId: 'offer-1',
				cardId: 'card-1',
			}),
		).resolves.toEqual(documented);
	});

	it('accepts the documented 202 acknowledgement', async () => {
		const documented = {
			status: 202,
			execution: 304.812677,
			resource: '/v1/offers/offer-1/programs/program-1/locations',
		};
		request.mockResolvedValue(documented);
		await expect(
			api.offers!.linkAllBrandLocationsToOffer!(ctx, {
				offerId: 'offer-1',
				programId: 'program-1',
			}),
		).resolves.toEqual(documented);
	});
});

describe('Fidel request bodies as the provider documents them', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue({ items: [] });
		logMock.mockClear();
	});

	it('sends searchBy as a nested object when creating a location', async () => {
		const searchBy = {
			merchantIds: { visa: ['1234567'], mastercard: ['7654321'], amex: [] },
		};
		await api.locations!.createLocation!(ctx, {
			programId: 'program-1',
			address: '55 West 46th Street',
			brandId: 'brand-1',
			city: 'New York',
			countryCode: 'USA',
			postcode: '10036',
			searchBy,
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/program-1/locations',
			{
				method: 'POST',
				body: {
					address: '55 West 46th Street',
					brandId: 'brand-1',
					city: 'New York',
					countryCode: 'USA',
					postcode: '10036',
					searchBy,
				},
			},
		);
	});

	it('sends the metadata object itself as the card metadata body', async () => {
		await api.cards!.updateCardMetadata!(ctx, {
			cardId: 'card-1',
			metadata: { customKey: 'customValue' },
		});
		expect(request).toHaveBeenLastCalledWith(ctx, '/v1/cards/card-1/metadata', {
			method: 'PUT',
			body: { customKey: 'customValue' },
		});
		await api.cards!.updateCardMetadata!(ctx, {
			cardId: 'card-1',
			metadata: {},
		});
		expect(request).toHaveBeenLastCalledWith(ctx, '/v1/cards/card-1/metadata', {
			method: 'PUT',
			body: {},
		});
	});

	it('accepts scheme and channel lists on offers', async () => {
		await api.offers!.createOffer!(ctx, {
			brandId: 'brand-1',
			countryCode: 'GBR',
			name: 'Offer',
			startDate: '2030-01-01T00:00:00',
			schemes: ['visa', 'mastercard'],
			channels: ['in-store', 'online'],
			daysOfWeek: [0, 6],
		});
		expect(request).toHaveBeenLastCalledWith(ctx, '/v1/offers', {
			method: 'POST',
			body: expect.objectContaining({
				schemes: ['visa', 'mastercard'],
				channels: ['in-store', 'online'],
				daysOfWeek: [0, 6],
			}),
		});
		await api.offers!.updateOffer!(ctx, {
			offerId: 'offer-1',
			schemes: ['amex'],
		});
		expect(request).toHaveBeenLastCalledWith(ctx, '/v1/offers/offer-1', {
			method: 'PATCH',
			body: { schemes: ['amex'] },
		});
	});

	it('retrieves a single MID by program and MID id', async () => {
		const documented = {
			items: [{ id: 'mid-1', scheme: 'visa' }],
			resource: '/v1/programs/program-1/mids/mid-1',
			status: 200,
			execution: 56.217957,
		};
		request.mockResolvedValue(documented);
		await expect(
			api.mids!.retrieveMid!(ctx, { programId: 'program-1', midId: 'mid-1' }),
		).resolves.toEqual(documented);
		expect(request).toHaveBeenLastCalledWith(
			ctx,
			'/v1/programs/program-1/mids/mid-1',
			{ method: 'GET' },
		);
	});

	it('rejects program IDs that are not strings before any request', async () => {
		await expect(
			api.marketplace!.createOfferFromMarketplaceOffer!(ctx, {
				marketplaceOfferId: 'mo-1',
				programIds: [{ id: 'program-1' }],
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});

describe('Fidel event log', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue({ items: [] });
		logMock.mockClear();
	});

	// unknown: the event-writer mock records the runtime context and the
	// payload; only the payload element is asserted.
	const lastPayload = () => {
		const calls = logMock.mock.calls as Array<
			[unknown, string, Record<string, unknown>, string]
		>;
		return calls[calls.length - 1]?.[2];
	};

	it.each([
		[
			'createBrandWebhook',
			{ event: 'brand.consent', url: 'https://example.com/hook' },
		],
		[
			'createProgramWebhook',
			{
				programId: 'program-1',
				event: 'card.linked',
				url: 'https://example.com/hook',
			},
		],
		[
			'updateWebhook',
			{
				hookId: 'hook-1',
				event: 'card.linked',
				url: 'https://example.com/hook',
			},
		],
	])(
		'keeps webhook header values out of the %s event',
		async (operation, input) => {
			const headers = { Authorization: 'Bearer receiver-secret' };
			await api.webhooks![operation]!(ctx, { ...input, headers });
			// The provider still receives the real header value.
			expect(JSON.stringify(request.mock.calls[0]?.[2])).toContain(
				'Bearer receiver-secret',
			);
			expect(JSON.stringify(lastPayload())).not.toContain('receiver-secret');
			expect(lastPayload()?.headers).toEqual({ Authorization: '[redacted]' });
			expect(lastPayload()?.url).toBe('https://example.com/hook');
		},
	);
});

describe('Fidel risk levels', () => {
	it('treats notifying a brand as a write, like other sends', () => {
		expect(fidelEndpointMeta['offers.sendOfferToBrand'].riskLevel).toBe(
			'write',
		);
	});
});
