import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	WhautomateEndpointInputSchemas,
	WhautomateEndpointOutputSchemas,
} from './endpoints/types';
import type { WhautomateContext } from './index';
import { whautomate } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockLogEvent = logEventFromContext as jest.Mock;

const mockRequest = request as jest.Mock;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

function expectRequest(expected: {
	method: string;
	url: string;
	body?: unknown;
	query?: unknown;
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

const mockCtx = {
	key: 'test-key',
	keys: {
		get_api_host: getApiHost,
	},
	options: {},
} as unknown as WhautomateContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({});
	getApiHost.mockReset();
	getApiHost.mockResolvedValue('https://api.example.com');
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
		await endpoints().account.getAccountInfo(mockCtx, {});
		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://api.example.com/v1');
		expect(options.method).toBe('GET');
	});

	function endpoints() {
		return whautomate().endpoints!;
	}

	it('account.getAccountInfo', async () => {
		mockRequest.mockResolvedValue({ name: 'Acme', ownerEmail: 'a@b.com' });
		const result = await endpoints().account.getAccountInfo(mockCtx, {});
		expectRequest({ method: 'GET', url: '/account' });
		expect(result).toEqual({ name: 'Acme', ownerEmail: 'a@b.com' });
		expect(
			WhautomateEndpointOutputSchemas.getAccountInfo.safeParse(result).success,
		).toBe(true);
	});

	it('contacts.addContact does not log the contact payload', async () => {
		mockRequest.mockResolvedValue({ id: 'c1', name: 'Ada' });
		const result = await endpoints().contacts.addContact(mockCtx, {
			name: 'Ada',
			phoneNumber: '+911234567890',
			location: 'location-id',
		});
		expectRequest({
			method: 'POST',
			url: '/contacts',
			body: {
				name: 'Ada',
				phoneNumber: '+911234567890',
				location: 'location-id',
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
		await endpoints().contacts.getContacts(mockCtx, {
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
		await endpoints().contacts.getMessagesOfContact(mockCtx, {
			contactId: 'c1',
			startDate: '2026-01-01',
		});
		expectRequest({
			method: 'GET',
			url: '/contacts/c1/messages',
			query: { startDate: '2026-01-01' },
		});
	});

	it('contacts input schema rejects a payload without a phone number', () => {
		expect(
			WhautomateEndpointInputSchemas.addContact.safeParse({
				name: 'Ada',
				location: 'location-id',
			}).success,
		).toBe(false);
	});

	it('segments.getSegments', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await endpoints().segments.getSegments(mockCtx, { name: 'vip' });
		expectRequest({
			method: 'GET',
			url: '/segments',
			query: { name: 'vip' },
		});
	});

	it('segments.deleteSegment', async () => {
		mockRequest.mockResolvedValue({ id: 's1' });
		const result = await endpoints().segments.deleteSegment(mockCtx, {
			id: 's1',
		});
		expectRequest({ method: 'DELETE', url: '/segments/s1' });
		expect(
			WhautomateEndpointOutputSchemas.deleteSegment.safeParse(result).success,
		).toBe(true);
	});

	it('serviceCategories.getServiceCategories', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await endpoints().serviceCategories.getServiceCategories(mockCtx, {});
		expectRequest({ method: 'GET', url: '/service-categories' });
	});

	it('serviceCategories.deleteServiceCategory', async () => {
		mockRequest.mockResolvedValue({ id: 'sc1' });
		const result = await endpoints().serviceCategories.deleteServiceCategory(
			mockCtx,
			{ id: 'sc1' },
		);
		expectRequest({ method: 'DELETE', url: '/service-categories/sc1' });
		expect(
			WhautomateEndpointOutputSchemas.deleteServiceCategory.safeParse(result)
				.success,
		).toBe(true);
	});

	it('services.getServices', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await endpoints().services.getServices(mockCtx, {
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
		await endpoints().services.getServiceById(mockCtx, { id: 'sv1' });
		expectRequest({ method: 'GET', url: '/services/sv1' });
	});

	it('services.updateService', async () => {
		mockRequest.mockResolvedValue({ id: 'sv1', name: 'New name', price: 500 });
		await endpoints().services.updateService(mockCtx, {
			id: 'sv1',
			name: 'New name',
			price: 500,
		});
		expectRequest({
			method: 'PATCH',
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
		const result = await endpoints().webhooks.getAllWebhooks(mockCtx, {});
		expectRequest({ method: 'GET', url: '/webhooks' });
		expect(
			WhautomateEndpointOutputSchemas.getAllWebhooks.safeParse(result).success,
		).toBe(true);
	});

	it('broadcasts.getBroadcasts', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		const result = await endpoints().broadcasts.getBroadcasts(mockCtx, {
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
		await endpoints().broadcasts.getBroadcastById(mockCtx, { id: 'b1' });
		expectRequest({ method: 'GET', url: '/broadcasts/b1' });
	});

	it('staff.getStaffs', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await endpoints().staff.getStaffs(mockCtx, { page: 2, limit: 10 });
		expectRequest({
			method: 'GET',
			url: '/staff',
			query: { page: 2, limit: 10 },
		});
	});

	it('staff.getStaffById', async () => {
		mockRequest.mockResolvedValue({ id: 'st1', firstName: 'A', lastName: 'B' });
		await endpoints().staff.getStaffById(mockCtx, { id: 'st1' });
		expectRequest({ method: 'GET', url: '/staff/st1' });
	});

	it('staff.getStaffAvailabilityBlocks', async () => {
		mockRequest.mockResolvedValue([]);
		await endpoints().staff.getStaffAvailabilityBlocks(mockCtx, {
			staffId: 'st1',
			endDate: '2026-02-01',
		});
		expectRequest({
			method: 'GET',
			url: '/staff/st1/availability-blocks',
			query: { endDate: '2026-02-01' },
		});
	});
});
