import * as Contacts from './endpoints/contacts';
import * as Dispatch from './endpoints/dispatch';
import * as Optimizations from './endpoints/optimizations';
import * as Routes from './endpoints/routes';
import {
	ADDRESS_ID,
	ADDRESS_PAGE,
	CREATED_ADDRESS,
	CREATED_OPTIMIZATION,
	CREATED_ORDER,
	CREATED_VEHICLE,
	MEMBER,
	MEMBER_ARRAY,
	OPTIMIZATION,
	OPTIMIZATION_ID,
	OPTIMIZATION_LIST,
	ORDER,
	ORDER_PAGE,
	ROUTE_DETAIL,
	ROUTE_ID,
	ROUTE_PAGE,
	ROUTE_PAGE_MORE,
	VEHICLE_ARRAY,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('routes.list', () => {
	it('posts the filters and reads the data envelope', async () => {
		respond(fetchMock, ROUTE_PAGE);

		const result = (await invoke(Routes.list, {
			query: 'north',
			facility_ids: ['facility-1'],
			route_id: ROUTE_ID,
			timezone: 'Europe/Amsterdam',
			page: 1,
			per_page: 50,
		})) as Awaited<ReturnType<typeof Routes.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/routes/list');
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({
			query: 'north',
			filtersfacility_ids: ['facility-1'],
			filtersroute_id: ROUTE_ID,
			timezone: 'Europe/Amsterdam',
			page: 1,
			per_page: 50,
		});
		expect(result.routes).toHaveLength(1);
		expect(result.routes[0]?.route_name).toBe('Amsterdam deliveries');
		expect(result.next_page).toBeNull();
	});

	it('sends order_by as an array of [field, direction] pairs', async () => {
		respond(fetchMock, ROUTE_PAGE);

		await invoke(Routes.list, {
			order_by: { field: 'route_created_unix', direction: 'desc' },
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			order_by: [['route_created_unix', 'desc']],
		});
	});

	it('reports the next page while more remain', async () => {
		respond(fetchMock, ROUTE_PAGE_MORE);

		const result = (await invoke(Routes.list, {})) as Awaited<
			ReturnType<typeof Routes.list>
		>;

		expect(result.next_page).toBe(2);
		expect(result.last_page).toBe(3);
	});

	it('rejects a page size above the documented maximum', async () => {
		await expect(invoke(Routes.list, { per_page: 501 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a sort direction the API does not accept', async () => {
		await expect(
			invoke(Routes.list, { order_by: { field: 'x', direction: 'up' } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('routes.get', () => {
	it('reads one route with its sequenced stops', async () => {
		respond(fetchMock, ROUTE_DETAIL);

		const result = (await invoke(Routes.get, {
			route_id: ROUTE_ID,
			per_page: 100,
		})) as Awaited<ReturnType<typeof Routes.get>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.path).toBe(`/modules/api/v5.0/routes/${ROUTE_ID}`);
		expect(request.query).toEqual({
			per_page: '100',
			api_key: 'route4me-test-key',
		});
		expect(result.addresses).toHaveLength(2);
		expect(result.addresses?.[1]?.sequence_no).toBe(1);
		expect(result.addresses?.[0]?.is_depot).toBe(true);
	});

	it('fails rather than reading a non-object body as an empty route', async () => {
		respond(fetchMock, 'Redirecting to login');

		await expect(invoke(Routes.get, { route_id: ROUTE_ID })).rejects.toThrow();
	});

	it('rejects a route id that is not 32 characters', async () => {
		await expect(invoke(Routes.get, { route_id: 'short' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('orders.list', () => {
	it('posts the filters and reads the meta envelope', async () => {
		respond(fetchMock, ORDER_PAGE);

		const result = (await invoke(Dispatch.ordersList, {
			page: 0,
			per_page: 50,
			search_query: 'jordan',
			statuses: ['0', '1'],
		})) as Awaited<ReturnType<typeof Dispatch.ordersList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/orders/list');
		expect(request.json()).toEqual({
			page: 0,
			per_page: 50,
			search_query: 'jordan',
			filters: { search_query: 'jordan' },
			statuses: ['0', '1'],
		});
		expect(result.orders[0]?.address_alias).toBe('Canal stop');
	});

	it('fails rather than inventing an empty page when data is missing', async () => {
		respond(fetchMock, { meta: { current_page: 1, last_page: 1 } });

		await expect(invoke(Dispatch.ordersList, {})).rejects.toThrow();
	});
});

describe('orders.create', () => {
	it('renames the contact fields to the EXT_FIELD spelling the API wants', async () => {
		respond(fetchMock, CREATED_ORDER);

		const result = (await invoke(Dispatch.ordersCreate, {
			address_1: 'Prinsengracht 100',
			address_alias: 'Canal stop',
			first_name: 'Jordan',
			last_name: 'Lee',
			email: 'jordan@example.com',
			phone: '+31 20 555 0100',
			address_stop_type: 'DELIVERY',
		})) as Awaited<ReturnType<typeof Dispatch.ordersCreate>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/orders');
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({
			address_1: 'Prinsengracht 100',
			address_alias: 'Canal stop',
			EXT_FIELD_first_name: 'Jordan',
			EXT_FIELD_last_name: 'Lee',
			EXT_FIELD_email: 'jordan@example.com',
			EXT_FIELD_phone: '+31 20 555 0100',
			address_stop_type: 'DELIVERY',
		});
		expect(result.order.order_id).toBe(445566);
	});

	it('rejects an empty address before sending anything', async () => {
		await expect(
			invoke(Dispatch.ordersCreate, { address_1: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a stop type the API does not define', async () => {
		await expect(
			invoke(Dispatch.ordersCreate, {
				address_1: 'x',
				address_stop_type: 'DROP',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects coordinates outside the valid range', async () => {
		await expect(
			invoke(Dispatch.ordersCreate, { address_1: 'x', cached_lat: 91 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('vehicles.list', () => {
	it('reads a bare array, not a page envelope', async () => {
		respond(fetchMock, VEHICLE_ARRAY);

		const result = (await invoke(Dispatch.vehiclesList, {
			is_operational: true,
			facility_ids: ['facility-1'],
		})) as Awaited<ReturnType<typeof Dispatch.vehiclesList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/vehicles');
		expect(request.query).toEqual({
			is_operational: 'true',
			facility_ids: 'facility-1',
			api_key: 'route4me-test-key',
		});
		expect(result.vehicles).toHaveLength(1);
		expect(result.vehicles[0]?.vehicle_alias).toBe('Van 1');
	});

	it('fails rather than turning a wrong-shaped body into an empty fleet', async () => {
		respond(fetchMock, { data: [] });

		await expect(invoke(Dispatch.vehiclesList, {})).rejects.toThrow();
	});
});

describe('vehicles.create', () => {
	it('posts the vehicle fields', async () => {
		respond(fetchMock, CREATED_VEHICLE);

		const result = (await invoke(Dispatch.vehiclesCreate, {
			vehicle_alias: 'Van 1',
			vehicle_license_plate: 'AB-123-CD',
			vehicle_make: 'Ford',
			is_operational: true,
		})) as Awaited<ReturnType<typeof Dispatch.vehiclesCreate>>;

		expect(lastRequest(fetchMock).json()).toEqual({
			vehicle_alias: 'Van 1',
			vehicle_license_plate: 'AB-123-CD',
			vehicle_make: 'Ford',
			is_operational: true,
		});
		expect(result.vehicle.vehicle_license_plate).toBe('AB-123-CD');
	});

	it('rejects an empty alias', async () => {
		await expect(
			invoke(Dispatch.vehiclesCreate, { vehicle_alias: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('addresses.list', () => {
	it('reads the address book envelope and derives the next offset', async () => {
		respond(fetchMock, ADDRESS_PAGE);

		const result = (await invoke(Contacts.addressesList, {
			display: 'unrouted',
			query: 'canal',
			fields: ['address_id', 'address_1'],
			limit: 10,
			offset: 0,
		})) as Awaited<ReturnType<typeof Contacts.addressesList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(
			'/modules/api/v5.0/address-book/addresses/index/all',
		);
		// `query` keeps one value per name, so the repeated parameter is read
		// through allQuery.
		expect(request.query).toEqual({
			display: 'unrouted',
			query: 'canal',
			limit: '10',
			offset: '0',
			api_key: 'route4me-test-key',
			fields: 'address_1',
		});
		expect(request.allQuery('fields')).toEqual(['address_id', 'address_1']);
		expect(result.addresses[0]?.address_alias).toBe('Canal stop');
		expect(result.total).toBe(1);
		expect(result.next_offset).toBeNull();
	});

	it('offers the next offset when a full page came back with more to read', async () => {
		respond(fetchMock, { results: [{ address_id: ADDRESS_ID }], total: 25 });

		const result = (await invoke(Contacts.addressesList, {
			limit: 1,
			offset: 10,
		})) as Awaited<ReturnType<typeof Contacts.addressesList>>;

		expect(result.next_offset).toBe(11);
	});

	it('offers the next offset when no limit was sent and more remain', async () => {
		respond(fetchMock, { results: [{ address_id: ADDRESS_ID }], total: 25 });

		const result = (await invoke(Contacts.addressesList, {
			offset: 4,
		})) as Awaited<ReturnType<typeof Contacts.addressesList>>;

		expect(result.next_offset).toBe(5);
	});

	it('stops paging on a short page even when records remain', async () => {
		respond(fetchMock, { results: [{ address_id: ADDRESS_ID }], total: 25 });

		const result = (await invoke(Contacts.addressesList, {
			limit: 10,
			offset: 0,
		})) as Awaited<ReturnType<typeof Contacts.addressesList>>;

		expect(result.next_offset).toBeNull();
	});

	it('rejects a display value the API does not define', async () => {
		await expect(
			invoke(Contacts.addressesList, { display: 'some' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above the documented 10,000 maximum', async () => {
		await expect(
			invoke(Contacts.addressesList, { limit: 10_001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('addresses.create', () => {
	it('posts the contact, requiring coordinates', async () => {
		respond(fetchMock, CREATED_ADDRESS);

		const result = (await invoke(Contacts.addressesCreate, {
			address_1: 'Prinsengracht 100',
			cached_lat: 52.373066,
			cached_lng: 4.886445,
			address_email: 'jordan@example.com',
		})) as Awaited<ReturnType<typeof Contacts.addressesCreate>>;

		expect(lastRequest(fetchMock).json()).toEqual({
			address_1: 'Prinsengracht 100',
			cached_lat: 52.373066,
			cached_lng: 4.886445,
			address_email: 'jordan@example.com',
		});
		expect(result.address.address_id).toBe(ADDRESS_ID);
	});

	it('rejects a contact with no coordinates', async () => {
		await expect(
			invoke(Contacts.addressesCreate, { address_1: 'x' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('team.me', () => {
	it('reads the account behind the key', async () => {
		respond(fetchMock, MEMBER);

		const result = (await invoke(Contacts.teamMe, {})) as Awaited<
			ReturnType<typeof Contacts.teamMe>
		>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/team/users/me');
		expect(request.query).toEqual({ api_key: 'route4me-test-key' });
		expect(result.member.owner_member_name).toBe('Sam Rivera');
		expect(result.member.timezone).toBe('Europe/Amsterdam');
	});
});

describe('team.list', () => {
	it('reads a bare array of members', async () => {
		respond(fetchMock, MEMBER_ARRAY);

		const result = (await invoke(Contacts.teamList, {
			drivers_only: true,
		})) as Awaited<ReturnType<typeof Contacts.teamList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/modules/api/v5.0/team/users');
		expect(request.query).toEqual({
			drivers_only: 'true',
			api_key: 'route4me-test-key',
		});
		expect(result.members).toHaveLength(1);
	});
});

describe('optimizations.list', () => {
	it('reads the v4 collection shape', async () => {
		respond(fetchMock, OPTIMIZATION_LIST);

		const result = (await invoke(Optimizations.list, {
			state: 4,
			limit: 10,
			offset: 0,
		})) as Awaited<ReturnType<typeof Optimizations.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api.v4/optimization_problem.php');
		expect(request.query).toEqual({
			state: '4',
			limit: '10',
			offset: '0',
			api_key: 'route4me-test-key',
		});
		expect(result.optimizations).toHaveLength(1);
		expect(result.total_records).toBe(1);
		expect(result.next_offset).toBeNull();
	});

	it('fails rather than inventing an empty list when optimizations is missing', async () => {
		respond(fetchMock, { totalRecords: 3 });

		await expect(invoke(Optimizations.list, {})).rejects.toThrow();
	});

	it('normalises the single-object form into one row', async () => {
		respond(fetchMock, OPTIMIZATION);

		const result = (await invoke(Optimizations.list, {
			optimization_problem_id: OPTIMIZATION_ID,
		})) as Awaited<ReturnType<typeof Optimizations.list>>;

		expect(result.optimizations).toHaveLength(1);
		expect(result.optimizations[0]?.optimization_problem_id).toBe(
			OPTIMIZATION_ID,
		);
		expect(result.total_records).toBe(1);
	});

	it('offers the next offset when a full page came back with more to read', async () => {
		respond(fetchMock, {
			optimizations: [{ optimization_problem_id: OPTIMIZATION_ID }],
			totalRecords: 40,
		});

		const result = (await invoke(Optimizations.list, {
			limit: 1,
			offset: 10,
		})) as Awaited<ReturnType<typeof Optimizations.list>>;

		expect(result.next_offset).toBe(11);
	});

	it('offers the next offset when no limit was sent and more remain', async () => {
		respond(fetchMock, {
			optimizations: [{ optimization_problem_id: OPTIMIZATION_ID }],
			totalRecords: 40,
		});

		const result = (await invoke(Optimizations.list, {})) as Awaited<
			ReturnType<typeof Optimizations.list>
		>;

		expect(result.next_offset).toBe(1);
	});
});

describe('optimizations.get', () => {
	it('reads one optimization with its state', async () => {
		respond(fetchMock, OPTIMIZATION);

		const result = (await invoke(Optimizations.get, {
			optimization_problem_id: OPTIMIZATION_ID,
		})) as Awaited<ReturnType<typeof Optimizations.get>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.query).toEqual({
			optimization_problem_id: OPTIMIZATION_ID,
			api_key: 'route4me-test-key',
		});
		expect(result.optimization.state).toBe(4);
		expect(result.optimization.optimization_problem_id).toBe(OPTIMIZATION_ID);
	});
});

describe('optimizations.create', () => {
	it('submits the addresses and parameters', async () => {
		respond(fetchMock, CREATED_OPTIMIZATION);

		const result = (await invoke(Optimizations.create, {
			addresses: [
				{ lat: 52.373066, lng: 4.856445 },
				{ lat: 52.281774, lng: 4.828886 },
			],
			route_max_duration: 1800,
			algorithm_type: 'TSP',
			optimize: 'Distance',
			travel_mode: 'Driving',
		})) as Awaited<ReturnType<typeof Optimizations.create>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({
			addresses: [
				{ lat: 52.373066, lng: 4.856445 },
				{ lat: 52.281774, lng: 4.828886 },
			],
			parameters: {
				route_max_duration: 1800,
				algorithm_type: 'TSP',
				optimize: 'Distance',
				travel_mode: 'Driving',
			},
		});
		// A newly queued problem reports state 0, not a solved route list.
		expect(result.optimization.state).toBe(0);
		expect(result.optimization.sent_to_background).toBe(true);
	});

	it('accepts a street address instead of coordinates', async () => {
		respond(fetchMock, CREATED_OPTIMIZATION);

		await invoke(Optimizations.create, {
			addresses: [{ address: 'Damrak 1, Amsterdam' }],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('rejects a stop with neither coordinates nor an address', async () => {
		await expect(
			invoke(Optimizations.create, { addresses: [{ alias: 'nowhere' }] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a latitude without a longitude', async () => {
		await expect(
			invoke(Optimizations.create, {
				addresses: [{ lat: 52.373066 }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty address list', async () => {
		await expect(
			invoke(Optimizations.create, { addresses: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an algorithm the API does not define', async () => {
		await expect(
			invoke(Optimizations.create, {
				addresses: [{ lat: 1, lng: 1 }],
				algorithm_type: 'GENETIC',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('order fixtures', () => {
	it('keeps the order id and a null-able field as the API sent them', async () => {
		respond(fetchMock, ORDER_PAGE);

		const result = (await invoke(Dispatch.ordersList, {})) as Awaited<
			ReturnType<typeof Dispatch.ordersList>
		>;

		expect(result.orders[0]?.order_id).toBe(ORDER.order_id);
		expect(result.orders[0]?.order_uuid).toBe(ORDER.order_uuid);
	});
});
