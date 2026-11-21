import { logEventFromContext } from 'corsair/core';
import {
	Addons,
	Invoices,
	Jobs,
	Settings,
	Sites,
	UnitRentals,
	Units,
	Users,
} from './endpoints';
import {
	addon,
	invoice,
	job,
	rental,
	site,
	unauthorized,
	unit,
	user,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sg-test-key';
const BUSINESS_CODE = 'spaceup';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key and the
	// stored business code).
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_business_code: () => Promise.resolve(BUSINESS_CODE) },
		} as never,
		input as never,
	);
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
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe(`https://${BUSINESS_CODE}.storeganise.com`);
	expect(sent.headers.get('authorization')).toBe(`ApiKey ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('settings', () => {
	it('get GETs admin/settings with no parameters', async () => {
		const settings = { brandName: { en: 'SpaceUp' }, currency: 'USD' };
		respond(settings);

		await expect(invoke(Settings.get, {})).resolves.toEqual(settings);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/settings',
		});
	});
});

describe('sites', () => {
	it('list GETs admin/sites and passes the search filter', async () => {
		respond([site]);

		await expect(invoke(Sites.list, {})).resolves.toEqual([site]);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/sites',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'storeganise.sites.list',
			{ count: 1 },
			'completed',
		);
	});

	it('sends the search term as a query parameter', async () => {
		respond([site]);

		await invoke(Sites.list, { search: 'customField:foo' });

		expect(lastRequest().query).toEqual({ search: 'customField:foo' });
	});

	it('get reads by id or code without encoding damage', async () => {
		respond(site);

		await expect(
			invoke(Sites.get, { siteIdOrCode: 'central' }),
		).resolves.toEqual(site);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/sites/central',
		});
	});

	it('rejects a site read with no id', async () => {
		await expect(invoke(Sites.get, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('units', () => {
	it('list GETs admin/units', async () => {
		respond([unit]);

		await expect(invoke(Units.list, {})).resolves.toEqual([unit]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/units',
		});
	});
});

describe('users', () => {
	it('list sends updatedAfter and comma-joined ids', async () => {
		respond([user]);

		await expect(
			invoke(Users.list, {
				updatedAfter: '2024-01-01T00:00:00.000Z',
				ids: ['5bf48bd975970f170a8e42b7', '5bf48bd975970f170a8e42b8'],
			}),
		).resolves.toEqual([user]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/users',
			query: {
				updatedAfter: '2024-01-01T00:00:00.000Z',
				ids: '5bf48bd975970f170a8e42b7,5bf48bd975970f170a8e42b8',
			},
		});
	});

	it('rejects a malformed updatedAfter before sending', async () => {
		respond([user]);

		// The docs prescribe the UTC format YYYY-MM-DDTHH:MM:SS.000Z.
		await expect(
			invoke(Users.list, { updatedAfter: '2024-01-01' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an id batch above the documented 50', async () => {
		respond([user]);

		await expect(
			invoke(Users.list, { ids: Array.from({ length: 51 }, () => 'x') }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('get reads by id or email', async () => {
		respond(user);

		await expect(
			invoke(Users.get, { userIdOrEmail: 'john@example.com' }),
		).resolves.toEqual(user);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/users/john%40example.com',
		});
	});
});

describe('invoices', () => {
	it('list sends updatedAfter and comma-joined ids', async () => {
		respond([invoice]);

		await expect(
			invoke(Invoices.list, { updatedAfter: '2023-12-31T14:00:00.000Z' }),
		).resolves.toEqual([invoice]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/invoices',
			query: { updatedAfter: '2023-12-31T14:00:00.000Z' },
		});
	});
});

describe('unitRentals', () => {
	it('list sends ids and include', async () => {
		respond([rental]);

		await expect(
			invoke(UnitRentals.list, {
				ids: ['5d9f2c8bbf3e2c0017a4b1c3'],
				include: 'unit,customFields',
			}),
		).resolves.toEqual([rental]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/unit-rentals',
			query: {
				ids: '5d9f2c8bbf3e2c0017a4b1c3',
				include: 'unit,customFields',
			},
		});
	});

	it('get reads one rental with the documented include', async () => {
		respond(rental);

		await expect(
			invoke(UnitRentals.get, {
				unitRentalId: '5d9f2c8bbf3e2c0017a4b1c3',
				include: 'owner,unit,customFields',
			}),
		).resolves.toEqual(rental);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/unit-rentals/5d9f2c8bbf3e2c0017a4b1c3',
			query: { include: 'owner,unit,customFields' },
		});
	});

	it('update PUTs the custom fields as a JSON body', async () => {
		const updated = { ...rental, customFields: { myAC_accessCode: '482913' } };
		respond(updated);

		await expect(
			invoke(UnitRentals.update, {
				unitRentalId: '5d9f2c8bbf3e2c0017a4b1c3',
				customFields: { myAC_accessCode: '482913' },
			}),
		).resolves.toEqual(updated);
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'PUT',
			path: '/api/v1/admin/unit-rentals/5d9f2c8bbf3e2c0017a4b1c3',
		});
		expect(sent.body).toBe('{"customFields":{"myAC_accessCode":"482913"}}');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'storeganise.unitRentals.update',
			{ unitRentalId: '5d9f2c8bbf3e2c0017a4b1c3' },
			'completed',
		);
	});

	it('rejects an update without custom fields before sending', async () => {
		respond(rental);

		await expect(
			invoke(UnitRentals.update, { unitRentalId: '5d9f2c8bbf3e2c0017a4b1c3' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('jobs', () => {
	it('get reads one job and keeps the nested result', async () => {
		respond(job);

		await expect(
			invoke(Jobs.get, { jobId: '5bf540e8d986a91cd713affe' }),
		).resolves.toEqual(job);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/jobs/5bf540e8d986a91cd713affe',
		});
	});
});

describe('addons', () => {
	it('list GETs admin/addons', async () => {
		respond([addon]);

		await expect(invoke(Addons.list, {})).resolves.toEqual([addon]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/addons',
		});
	});

	it('get reads one addon record', async () => {
		respond(addon);

		await expect(
			invoke(Addons.get, { addonId: '5bf48bd975970f170a8e42b8' }),
		).resolves.toEqual(addon);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/admin/addons/5bf48bd975970f170a8e42b8',
		});
	});
});

describe('output parsing', () => {
	it('accepts extra fields the access-gated reference would add', async () => {
		respond({ ...site, undiscoveredField: { nested: true } });

		await expect(
			invoke(Sites.get, { siteIdOrCode: 'central' }),
		).resolves.toMatchObject({
			id: site.id,
			undiscoveredField: { nested: true },
		});
	});

	it('rejects a record with no id rather than returning a blank row', async () => {
		respond([{ name: 'id-less' }]);

		await expect(invoke(Units.list, {})).rejects.toThrow();
	});

	it('rejects a non-array answer to a list read', async () => {
		respond(unauthorized);

		await expect(invoke(Units.list, {})).rejects.toThrow();
	});
});
