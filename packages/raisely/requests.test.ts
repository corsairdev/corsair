import * as Endpoints from './endpoints/endpoints';
import {
	CAMPAIGN,
	CAMPAIGN_PAGE,
	CAMPAIGN_PAGE_MORE,
	CAMPAIGN_UUID,
	DESIGNATION_PAGE,
	DONATION,
	DONATION_PAGE,
	DONATION_UUID,
	PAGINATION,
	PROFILE,
	PROFILE_PAGE,
	PROFILE_UUID,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('campaigns.list', () => {
	it('sends the filters and reads the data envelope', async () => {
		respond(fetchMock, CAMPAIGN_PAGE);

		const result = (await invoke(Endpoints.campaignsList, {
			limit: 100,
			q: 'clean',
			path: 'clean-water-2026',
			status: 'active',
			prune_config: true,
		})) as Awaited<ReturnType<typeof Endpoints.campaignsList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/campaigns');
		expect(request.query).toEqual({
			limit: '100',
			q: 'clean',
			path: 'clean-water-2026',
			status: 'active',
			pruneConfig: 'true',
		});
		expect(result.campaigns).toHaveLength(1);
		expect(result.campaigns[0]?.name).toBe('Clean Water 2026');
		expect(result.next_offset).toBeNull();
	});

	it('sends order only alongside a sort, because it is ignored alone', async () => {
		respond(fetchMock, CAMPAIGN_PAGE);

		await invoke(Endpoints.campaignsList, { order: 'desc' });

		// No `sort`, so the order is not sent at all.
		expect(lastRequest(fetchMock).query).toEqual({});
	});

	it('sends the pair when both are given', async () => {
		respond(fetchMock, CAMPAIGN_PAGE);

		await invoke(Endpoints.campaignsList, {
			sort: 'createdAt',
			order: 'desc',
		});

		expect(lastRequest(fetchMock).query).toEqual({
			sort: 'createdAt',
			order: 'desc',
		});
	});

	it('offers the next offset while more remain', async () => {
		respond(fetchMock, CAMPAIGN_PAGE_MORE);

		const result = (await invoke(Endpoints.campaignsList, {
			limit: 100,
			offset: 0,
		})) as Awaited<ReturnType<typeof Endpoints.campaignsList>>;

		expect(result.next_offset).toBe(100);
		expect(result.total).toBe(250);
	});
});

describe('campaigns.get', () => {
	it('reads one campaign by uuid', async () => {
		respond(fetchMock, { data: CAMPAIGN });

		const result = (await invoke(Endpoints.campaignsGet, {
			campaign: CAMPAIGN_UUID,
		})) as Awaited<ReturnType<typeof Endpoints.campaignsGet>>;

		expect(lastRequest(fetchMock).path).toBe(`/v3/campaigns/${CAMPAIGN_UUID}`);
		expect(result.campaign.goal).toBe(100000);
		expect(result.campaign.totalPercent).toBe(42);
	});
});

describe('donations.list', () => {
	it('sends the donation filters', async () => {
		respond(fetchMock, DONATION_PAGE);

		const result = (await invoke(Endpoints.donationsList, {
			campaign: CAMPAIGN_UUID,
			campaign_uuid: undefined,
			status: 'successful',
			mode: 'LIVE',
			currency: 'USD',
		})) as Awaited<ReturnType<typeof Endpoints.donationsList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/donations');
		expect(request.query).toEqual({
			campaign: CAMPAIGN_UUID,
			status: 'successful',
			mode: 'LIVE',
			currency: 'USD',
		});
		// Amounts are integers in the smallest currency unit.
		expect(result.donations[0]?.amount).toBe(2500);
		expect(result.donations[0]?.designation?.publicName).toBe('Building wells');
	});
});

describe('donations.get', () => {
	it('reads one donation by uuid', async () => {
		respond(fetchMock, { data: DONATION });

		const result = (await invoke(Endpoints.donationsGet, {
			donation_uuid: DONATION_UUID,
		})) as Awaited<ReturnType<typeof Endpoints.donationsGet>>;

		expect(lastRequest(fetchMock).path).toBe(`/v3/donations/${DONATION_UUID}`);
		expect(result.donation.method).toBe('CREDIT_CARD');
		expect(result.donation.status).toBe('successful');
	});
});

describe('donations.create', () => {
	it('wraps the record in data with the body field names the API reads', async () => {
		respond(fetchMock, { data: DONATION }, 201);

		const result = (await invoke(Endpoints.donationsCreate, {
			amount: 2500,
			currency: 'USD',
			email: 'jordan@example.com',
			method: 'CREDIT_CARD',
			type: 'ONLINE',
			campaign_uuid: CAMPAIGN_UUID,
			profile_uuid: PROFILE_UUID,
			firstName: 'Jordan',
			lastName: 'Lee',
			anonymous: false,
		})) as Awaited<ReturnType<typeof Endpoints.donationsCreate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v3/donations');
		expect(request.json()).toEqual({
			data: {
				amount: 2500,
				currency: 'USD',
				email: 'jordan@example.com',
				method: 'CREDIT_CARD',
				type: 'ONLINE',
				campaignUuid: CAMPAIGN_UUID,
				profileUuid: PROFILE_UUID,
				firstName: 'Jordan',
				lastName: 'Lee',
				anonymous: false,
			},
		});
		expect(result.donation.uuid).toBe(DONATION_UUID);
	});

	it('rejects a donation with no amount', async () => {
		await expect(
			invoke(Endpoints.donationsCreate, {
				currency: 'USD',
				email: 'jordan@example.com',
				method: 'CREDIT_CARD',
				type: 'ONLINE',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a zero amount', async () => {
		await expect(
			invoke(Endpoints.donationsCreate, {
				amount: 0,
				currency: 'USD',
				email: 'jordan@example.com',
				method: 'CREDIT_CARD',
				type: 'ONLINE',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a currency that is not three letters', async () => {
		await expect(
			invoke(Endpoints.donationsCreate, {
				amount: 2500,
				currency: 'US',
				email: 'jordan@example.com',
				method: 'CREDIT_CARD',
				type: 'ONLINE',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a donation type the API does not define', async () => {
		await expect(
			invoke(Endpoints.donationsCreate, {
				amount: 2500,
				currency: 'USD',
				email: 'jordan@example.com',
				method: 'CREDIT_CARD',
				type: 'MANUAL',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('profiles', () => {
	it('requires a campaign on the list route', async () => {
		await expect(invoke(Endpoints.profilesList, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the campaign and reads the profiles', async () => {
		respond(fetchMock, PROFILE_PAGE);

		const result = (await invoke(Endpoints.profilesList, {
			campaign: CAMPAIGN_UUID,
			limit: 50,
		})) as Awaited<ReturnType<typeof Endpoints.profilesList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			campaign: CAMPAIGN_UUID,
			limit: '50',
		});
		expect(result.profiles[0]?.name).toBe('Jordan Lee');
		expect(result.profiles[0]?.total).toBe(2500);
	});

	it('reads one profile by its path', async () => {
		respond(fetchMock, { data: PROFILE });

		const result = (await invoke(Endpoints.profilesGet, {
			profile_path: 'jordan-lee',
		})) as Awaited<ReturnType<typeof Endpoints.profilesGet>>;

		expect(lastRequest(fetchMock).path).toBe('/v3/profiles/jordan-lee');
		expect(result.profile.exerciseTotal).toBe(42);
	});

	it('patches a profile with the body names the API reads', async () => {
		respond(fetchMock, { data: PROFILE });

		const result = (await invoke(Endpoints.profilesUpdate, {
			profile_path: 'jordan-lee',
			goal: 6000,
			description: 'Running 42km for clean water',
		})) as Awaited<ReturnType<typeof Endpoints.profilesUpdate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe('/v3/profiles/jordan-lee');
		expect(request.json()).toEqual({
			data: { goal: 6000, description: 'Running 42km for clean water' },
		});
		expect(result.profile.uuid).toBe(PROFILE_UUID);
	});

	it('rejects an update with no path', async () => {
		await expect(
			invoke(Endpoints.profilesUpdate, { goal: 6000 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('designations.list', () => {
	it('lists the designations for a campaign', async () => {
		respond(fetchMock, DESIGNATION_PAGE);

		const result = (await invoke(Endpoints.designationsList, {
			campaign: CAMPAIGN_UUID,
			status: 'active',
		})) as Awaited<ReturnType<typeof Endpoints.designationsList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/designations');
		expect(request.query).toEqual({
			campaign: CAMPAIGN_UUID,
			status: 'active',
		});
		expect(result.designations[0]?.publicName).toBe('Building wells');
	});
});

describe('page envelope', () => {
	it('fails rather than inventing an empty page when data is missing', async () => {
		respond(fetchMock, { pagination: PAGINATION });

		await expect(invoke(Endpoints.campaignsList, {})).rejects.toThrow();
	});

	it('reads the false prevUrl and nextUrl Raisely sends at either end', async () => {
		// The body an anonymous GET /v3/profiles?campaign=<unknown> returned on
		// 2026-11-12: Raisely marks a missing neighbour page with `false`.
		respond(fetchMock, {
			data: [],
			pagination: {
				total: 0,
				pages: 0,
				prevUrl: false,
				nextUrl: false,
				offset: 0,
				limit: 100,
			},
		});

		const result = (await invoke(Endpoints.profilesList, {
			campaign: CAMPAIGN_UUID,
		})) as Awaited<ReturnType<typeof Endpoints.profilesList>>;

		expect(result.profiles).toEqual([]);
		expect(result.pagination?.nextUrl).toBe(false);
		expect(result.next_offset).toBeNull();
	});
});
