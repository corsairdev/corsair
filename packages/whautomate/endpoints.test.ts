import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import type { WhautomateHandlerContext } from './client';
import {
	addContact,
	deleteSegment,
	deleteServiceCategory,
	getAccountInfo,
	getAllWebhooks,
	getBroadcastById,
	getBroadcasts,
	getContacts,
	getMessagesOfContact,
	getSegments,
	getServiceById,
	getServiceCategories,
	getServices,
	getStaffAvailabilityBlocks,
	getStaffById,
	getStaffs,
	updateService,
} from './endpoints';
import {
	WhautomateEndpointInputSchemas,
	WhautomateEndpointOutputSchemas,
} from './endpoints/types';
import { requireWhautomateApiKey, whautomate } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const mockLogEvent = logEventFromContext as jest.Mock;

const mockRequest = request as jest.Mock;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	// jest mock.calls is an untyped tuple; only BASE/method/url/body/query
	// are asserted, so a full OpenAPIConfig union is not practical
	return {
		config: call?.[0] as { BASE: string },
		options: call?.[1] as {
			method?: string;
			url?: string;
			body?: Unused;
			query?: Unused;
		},
	};
}

// unused mock-call fields stay unknown: tests assert a few keys only, and
// each request body has a different operation-specific shape, so a
// stricter shared union is not practical
type Unused = unknown;

function expectRequest(expected: {
	method: string;
	url: string;
	body?: Unused;
	query?: Unused;
}) {
	const { options } = lastCall();
	expect(options.method).toBe(expected.method);
	expect(options.url).toBe(expected.url);
	if (expected.body !== undefined) {
		expect(options.body).toEqual(expected.body);
	}
	if (expected.query !== undefined) {
		expect(options.query).toEqual(expected.query);
	}
}

const getApiHost = jest.fn<Promise<string | null>, []>();

const mockCtx: WhautomateHandlerContext = {
	key: 'test-key',
	keys: {
		get_api_host: getApiHost,
	},
	options: {},
	$getAccountId: async () => 'acct_test',
};

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({});
	getApiHost.mockReset();
	getApiHost.mockResolvedValue('https://api.whautomate.com');
});

describe('Whautomate endpoints', () => {
	it('registers all endpoints with schemas and metadata', () => {
		const plugin = whautomate();
		expect(plugin.id).toBe('whautomate');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(17);
	});

	it('resolves the api host from the key store', async () => {
		mockRequest.mockResolvedValue({ name: 'Acme', ownerEmail: 'a@b.com' });
		await getAccountInfo(mockCtx, {});
		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://api.whautomate.com/v1');
		expect(options.method).toBe('GET');
	});

	it('account.getAccountInfo', async () => {
		mockRequest.mockResolvedValue({ name: 'Acme', ownerEmail: 'a@b.com' });
		const result = await getAccountInfo(mockCtx, {});
		expectRequest({ method: 'GET', url: '/account-info' });
		expect(result).toEqual({ name: 'Acme', ownerEmail: 'a@b.com' });
		expect(
			WhautomateEndpointOutputSchemas.getAccountInfo.safeParse(result).success,
		).toBe(true);
	});

	it('contacts.addContact does not log the contact payload', async () => {
		mockRequest.mockResolvedValue({ id: 'c1', name: 'Ada' });
		const result = await addContact(mockCtx, {
			name: 'Ada',
			phoneNumber: '+911234567890',
			location: { id: 'location-id' },
		});
		expectRequest({
			method: 'POST',
			url: '/contacts',
			body: {
				name: 'Ada',
				phoneNumber: '+911234567890',
				location: { id: 'location-id' },
			},
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'whautomate.contacts.add',
			{},
			'completed',
		);
		expect(
			WhautomateEndpointOutputSchemas.addContact.safeParse(result).success,
		).toBe(true);
	});

	it('contacts.getContacts', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getContacts(mockCtx, {
			page: 1,
			limit: 25,
			search: 'ada',
		});
		expectRequest({
			method: 'GET',
			url: '/contacts',
			query: { page: 1, limit: 25, search: 'ada' },
		});
	});

	it('contacts.getMessagesOfContact', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getMessagesOfContact(mockCtx, {
			contactId: 'c1',
			startDate: '2026-01-01',
		});
		expectRequest({
			method: 'GET',
			url: '/messages/c1',
			query: { startDate: '2026-01-01' },
		});
	});

	it('contacts input schema rejects a payload without a phone number', () => {
		expect(
			WhautomateEndpointInputSchemas.addContact.safeParse({
				name: 'Ada',
				location: { id: 'location-id' },
			}).success,
		).toBe(false);
	});

	it('segments.getSegments', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getSegments(mockCtx, { name: 'vip' });
		expectRequest({
			method: 'GET',
			url: '/segments',
			query: { name: 'vip' },
		});
	});

	it('segments.deleteSegment', async () => {
		mockRequest.mockResolvedValue({ id: 's1' });
		const result = await deleteSegment(mockCtx, {
			id: 's1',
		});
		expectRequest({ method: 'DELETE', url: '/segments/s1' });
		expect(
			WhautomateEndpointOutputSchemas.deleteSegment.safeParse(result).success,
		).toBe(true);
	});

	it('serviceCategories.getServiceCategories', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getServiceCategories(mockCtx, {});
		expectRequest({ method: 'GET', url: '/serviceCategories' });
	});

	it('serviceCategories.deleteServiceCategory', async () => {
		mockRequest.mockResolvedValue({ id: 'sc1' });
		const result = await deleteServiceCategory(mockCtx, { id: 'sc1' });
		expectRequest({ method: 'DELETE', url: '/serviceCategories/sc1' });
		expect(
			WhautomateEndpointOutputSchemas.deleteServiceCategory.safeParse(result)
				.success,
		).toBe(true);
	});

	it('services.getServices', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getServices(mockCtx, {
			isActive: true,
			search: 'yoga',
		});
		expectRequest({
			method: 'GET',
			url: '/services',
			query: { isActive: true, search: 'yoga' },
		});
	});

	it('services.getServiceById', async () => {
		mockRequest.mockResolvedValue({ id: 'sv1', name: 'Yoga' });
		await getServiceById(mockCtx, { id: 'sv1' });
		expectRequest({ method: 'GET', url: '/services/sv1' });
	});

	it('services.updateService', async () => {
		mockRequest.mockResolvedValue({ id: 'sv1', name: 'New name', price: 500 });
		await updateService(mockCtx, {
			id: 'sv1',
			name: 'New name',
			price: 500,
		});
		expectRequest({
			method: 'PUT',
			url: '/services/sv1',
			body: { name: 'New name', price: 500 },
		});
	});

	it('webhooks.getAllWebhooks', async () => {
		mockRequest.mockResolvedValue([
			{
				id: 'w1',
				url: 'https://example.com/hook',
				events: ['a'],
				isActive: true,
			},
		]);
		const result = await getAllWebhooks(mockCtx, {});
		expectRequest({ method: 'GET', url: '/webhooks' });
		expect(
			WhautomateEndpointOutputSchemas.getAllWebhooks.safeParse(result).success,
		).toBe(true);
	});

	it('broadcasts.getBroadcasts', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		const result = await getBroadcasts(mockCtx, {
			status: 'sent',
		});
		expectRequest({
			method: 'GET',
			url: '/broadcasts',
			query: { status: 'sent' },
		});
		expect(
			WhautomateEndpointOutputSchemas.getBroadcasts.safeParse(result).success,
		).toBe(true);
	});

	it('broadcasts.getBroadcastById', async () => {
		mockRequest.mockResolvedValue({
			id: 'b1',
			name: 'Launch',
			status: 'draft',
		});
		await getBroadcastById(mockCtx, { id: 'b1' });
		expectRequest({ method: 'GET', url: '/broadcasts/b1' });
	});

	it('staff.getStaffs', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getStaffs(mockCtx, { page: 2, limit: 10 });
		expectRequest({
			method: 'GET',
			url: '/staffs',
			query: { page: 2, limit: 10 },
		});
	});

	it('staff.getStaffById', async () => {
		mockRequest.mockResolvedValue({ id: 'st1', firstName: 'A', lastName: 'B' });
		await getStaffById(mockCtx, { id: 'st1' });
		expectRequest({ method: 'GET', url: '/staffs/st1' });
	});

	it('staff.getStaffAvailabilityBlocks', async () => {
		mockRequest.mockResolvedValue([]);
		await getStaffAvailabilityBlocks(mockCtx, {
			staffId: 'st1',
			endDate: '2026-02-01',
		});
		expectRequest({
			method: 'GET',
			url: '/staffs/st1/availabilityBlocks',
			query: { endDate: '2026-02-01' },
		});
	});

	it('forwards page 0 as a query param', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await getContacts(mockCtx, { page: 0, limit: 0 });
		expectRequest({
			method: 'GET',
			url: '/contacts',
			query: { page: 0, limit: 0 },
		});
	});

	it('accepts account info without ownerEmail', async () => {
		mockRequest.mockResolvedValue({ name: 'Acme' });
		const result = await getAccountInfo(mockCtx, {});
		expect(result).toEqual({ name: 'Acme' });
	});

	it('accepts a bare contact array from getContacts', async () => {
		mockRequest.mockResolvedValue([
			{ id: 'c1', name: 'Ada', phoneNumber: '+1' },
		]);
		const result = await getContacts(mockCtx, {});
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.name).toBe('Ada');
	});

	it('rejects a non-https stored api host before sending', async () => {
		getApiHost.mockResolvedValue('http://evil.example.com');
		await expect(getAccountInfo(mockCtx, {})).rejects.toMatchObject({
			code: 'INVALID_API_HOST',
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no api key is stored', () => {
		expect(() => requireWhautomateApiKey(null)).toThrow(AuthMissingError);
	});
});
