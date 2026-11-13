import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Campaigns,
	Contacts,
	Tags,
	Testimonials,
	WallOfLove,
	Widgets,
} from './endpoints';
import type { EndorsalContext } from './index';
import { endorsal, endorsalEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeEndorsalRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeEndorsalRequest);
const mockedLog = jest.mocked(logEventFromContext);
type EndpointContext = Parameters<typeof Testimonials.list>[0];

function buildContext(): EndpointContext {
	const ctx: EndorsalContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildContext();
const listResponse = { success: true, data: [] };
const itemResponse = { success: true, data: { _id: 'resource_123' } };
const updatedResponse = { success: true, message: 'Resource updated' };

type CallSpec = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
};

const endpointCases: Array<{
	name: string;
	run: () => Promise<object | string>;
	response: object | string;
	request: CallSpec;
}> = [
	{
		name: 'testimonials.get lists all testimonials',
		run: () => Testimonials.list(ctx, {}),
		response: listResponse,
		request: { method: 'GET', path: '/v1/testimonials' },
	},
	{
		name: 'testimonials.byId.get retrieves one testimonial',
		run: () => Testimonials.get(ctx, { id: 'review/123' }),
		response: itemResponse,
		request: { method: 'GET', path: '/v1/testimonials/review%2F123' },
	},
	{
		name: 'testimonials.post creates a testimonial',
		run: () =>
			Testimonials.create(ctx, {
				name: 'Jane Doe',
				propertyID: 'property_123',
				comments: 'Excellent service',
			}),
		response: itemResponse,
		request: {
			method: 'POST',
			path: '/v1/testimonials',
			body: {
				name: 'Jane Doe',
				propertyID: 'property_123',
				comments: 'Excellent service',
			},
		},
	},
	{
		name: 'testimonials.byId.patch updates fields',
		run: () =>
			Testimonials.update(ctx, { id: 'review_123', fields: { rating: 5 } }),
		response: updatedResponse,
		request: {
			method: 'PATCH',
			path: '/v1/testimonials/review_123',
			body: { fields: { rating: 5 } },
		},
	},
	{
		name: 'testimonials.byId.delete deletes a testimonial',
		run: () => Testimonials.remove(ctx, { id: 'review_123' }),
		response: updatedResponse,
		request: { method: 'DELETE', path: '/v1/testimonials/review_123' },
	},
	{
		name: 'testimonials.byId.tag.post adds new or existing tags',
		run: () =>
			Testimonials.addTags(ctx, {
				id: 'review_123',
				tags: [{ _id: 'tag_123' }],
			}),
		response: itemResponse,
		request: {
			method: 'POST',
			path: '/v1/testimonials/review_123/tag',
			body: { tags: [{ _id: 'tag_123' }] },
		},
	},
	{
		name: 'testimonials.search.post sends AND match conditions',
		run: () =>
			Testimonials.search(ctx, {
				query: [{ field: 'rating', operator: '=', value: 5 }],
			}),
		response: listResponse,
		request: {
			method: 'POST',
			path: '/v1/testimonials/search',
			body: { query: [{ field: 'rating', operator: '=', value: 5 }] },
		},
	},
	{
		name: 'contacts.get lists contacts',
		run: () => Contacts.list(ctx, {}),
		response: listResponse,
		request: { method: 'GET', path: '/v1/contacts' },
	},
	{
		name: 'contacts.post creates a contact and applies campaignID as query',
		run: () =>
			Contacts.create(ctx, {
				contact: { email: 'jane@example.com' },
				campaignID: 'campaign_123',
			}),
		response: itemResponse,
		request: {
			method: 'POST',
			path: '/v1/contacts',
			body: { email: 'jane@example.com' },
			query: { campaignID: 'campaign_123' },
		},
	},
	{
		name: 'contacts.byId.get retrieves a contact',
		run: () => Contacts.get(ctx, { id: 'contact_123' }),
		response: itemResponse,
		request: { method: 'GET', path: '/v1/contacts/contact_123' },
	},
	{
		name: 'contacts.byId.patch updates fields',
		run: () =>
			Contacts.update(ctx, {
				id: 'contact_123',
				fields: { company: 'Example' },
			}),
		response: updatedResponse,
		request: {
			method: 'PATCH',
			path: '/v1/contacts/contact_123',
			body: { fields: { company: 'Example' } },
		},
	},
	{
		name: 'contacts.byId.delete archives a contact',
		run: () => Contacts.archive(ctx, { id: 'contact_123' }),
		response: updatedResponse,
		request: { method: 'DELETE', path: '/v1/contacts/contact_123' },
	},
	{
		name: 'contacts.search.post sends search conditions',
		run: () =>
			Contacts.search(ctx, {
				query: [{ field: 'email', operator: 'contains', value: 'example.com' }],
			}),
		response: listResponse,
		request: {
			method: 'POST',
			path: '/v1/contacts/search',
			body: {
				query: [{ field: 'email', operator: 'contains', value: 'example.com' }],
			},
		},
	},
	{
		name: 'contacts.testimonials.get lists a contact testimonials',
		run: () => Testimonials.byContact(ctx, { id: 'contact_123' }),
		response: listResponse,
		request: {
			method: 'GET',
			path: '/v1/contacts/contact_123/testimonials',
		},
	},
	{
		name: 'tags.get lists tags',
		run: () => Tags.list(ctx, {}),
		response: listResponse,
		request: { method: 'GET', path: '/v1/tags' },
	},
	{
		name: 'tags.post creates a tag',
		run: () => Tags.create(ctx, { name: 'Favourite Reviews', type: 'tag' }),
		response: itemResponse,
		request: {
			method: 'POST',
			path: '/v1/tags',
			body: { name: 'Favourite Reviews', type: 'tag' },
		},
	},
	{
		name: 'tags.byId.get retrieves a tag',
		run: () => Tags.get(ctx, { id: 'tag_123' }),
		response: itemResponse,
		request: { method: 'GET', path: '/v1/tags/tag_123' },
	},
	{
		name: 'tags.byId.patch updates fields',
		run: () => Tags.update(ctx, { id: 'tag_123', fields: { name: 'Updated' } }),
		response: updatedResponse,
		request: {
			method: 'PATCH',
			path: '/v1/tags/tag_123',
			body: { fields: { name: 'Updated' } },
		},
	},
	{
		name: 'tags.byId.delete deletes a tag',
		run: () => Tags.remove(ctx, { id: 'tag_123' }),
		response: updatedResponse,
		request: { method: 'DELETE', path: '/v1/tags/tag_123' },
	},
	{
		name: 'tags.testimonials.get lists testimonials for a tag',
		run: () => Testimonials.byTag(ctx, { id: 'tag_123' }),
		response: listResponse,
		request: { method: 'GET', path: '/v1/tags/tag_123/testimonials' },
	},
	{
		name: 'widgets.get lists widgets',
		run: () => Widgets.list(ctx, {}),
		response: listResponse,
		request: { method: 'GET', path: '/v1/widgets' },
	},
	{
		name: 'widgets.byId.get retrieves a widget and forwards render',
		run: () => Widgets.get(ctx, { id: 'widget_123', render: false }),
		response: itemResponse,
		request: {
			method: 'GET',
			path: '/v1/widgets/widget_123',
			query: { render: false },
		},
	},
	{
		name: 'wallOfLove.get retrieves the Wall of Love',
		run: () => WallOfLove.get(ctx, { render: true }),
		response: { success: true, data: {} },
		request: {
			method: 'GET',
			path: '/v1/wall-of-love',
			query: { render: true },
		},
	},
	{
		name: 'autorequests.campaigns.get lists campaigns',
		run: () => Campaigns.list(ctx, {}),
		response: listResponse,
		request: { method: 'GET', path: '/v1/autorequests/campaigns' },
	},
	{
		name: 'autorequests.campaigns.byId.get retrieves a campaign',
		run: () => Campaigns.get(ctx, { id: 'campaign_123' }),
		response: itemResponse,
		request: {
			method: 'GET',
			path: '/v1/autorequests/campaigns/campaign_123',
		},
	},
];

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('Endorsal REST operations', () => {
	it.each(endpointCases)('$name', async ({ run, response, request }) => {
		mockedRequest.mockResolvedValue(response);
		await expect(run()).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			request.path,
			'test-api-key',
			expect.objectContaining({
				method: request.method,
				body: request.body,
				query: request.query,
			}),
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(mockedLog.mock.calls[0]?.[2]).toEqual({});
	});

	it('rejects invalid IDs, contact creation, and search before network I/O', async () => {
		await expect(Testimonials.get(ctx, { id: '' })).rejects.toThrow();
		await expect(Contacts.create(ctx, { contact: {} })).rejects.toThrow();
		await expect(Tags.get(ctx, { id: '' })).rejects.toThrow();
		await expect(
			Contacts.search(ctx, {
				query: [{ field: '', operator: '=', value: 5 }],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLog).not.toHaveBeenCalled();
	});

	it('rejects malformed provider responses before logging completion', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: { rating: 'six' },
		});
		await expect(
			Testimonials.get(ctx, { id: 'testimonial_123' }),
		).rejects.toThrow();
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedLog).not.toHaveBeenCalled();
	});

	it('does not log contact PII from a create operation', async () => {
		mockedRequest.mockResolvedValue(itemResponse);
		await Contacts.create(ctx, {
			contact: { email: 'private@example.com', phone: '+14172618261' },
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'endorsal.contactsCreate',
			{},
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'private@example.com',
		);
	});

	it('keeps endpoint schemas and metadata aligned with the documented surface', () => {
		const plugin = endorsal();
		expect(Object.keys(endorsalEndpointSchemas)).toHaveLength(25);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			Object.keys(endorsalEndpointSchemas).sort(),
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(endorsalEndpointSchemas).sort(),
		);
	});
});
