import { request } from 'corsair/http';
import { thanksIoEndpointsNested } from './endpoints';
import { thanksIoEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);
const ctx = { key: 'test-token' } as never;

beforeEach(() => mockRequest.mockReset());

it.each([
	[
		'get',
		{ recipientId: 56 },
		'GET',
		'/recipients/56',
		undefined,
		{ id: 56, dob: null },
	],
	[
		'update',
		{ recipientId: 56, body: { name: 'Pat', absentee_address: null } },
		'PUT',
		'/recipients/56',
		{ name: 'Pat', absentee_address: null },
		{ id: 56, name: 'Pat', absentee_address: null },
	],
	['delete', { recipientId: 56 }, 'DELETE', '/recipients/56', undefined, {}],
	[
		'create',
		{ body: { mailing_list_id: 1, email: 'a@example.com' } },
		'POST',
		'/recipients',
		{ mailing_list_id: 1, email: 'a@example.com' },
		{ id: 56, email: 'a@example.com' },
	],
	[
		'createMultiple',
		{ body: [{ mailing_list_id: 1, address: '123 Main St' }] },
		'POST',
		'/recipients-utils/create-multiple',
		[{ mailing_list_id: 1, address: '123 Main St' }],
		[{ id: 56, address: '123 Main St' }],
	],
	[
		'deleteByAddress',
		{ body: { mailing_list_id: 1, email: 'a@example.com' } },
		'POST',
		'/recipients-utils/delete-by-address',
		{ mailing_list_id: 1, email: 'a@example.com' },
		{},
	],
] as const)(
	'recipients.%s validates the public seam and forwards the request',
	async (name, input, method, path, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.recipients[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		expect(
			thanksIoEndpointSchemas[`recipients.${name}`].input.safeParse(input)
				.success,
		).toBe(true);
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url: path, body }),
			expect.anything(),
		);
	},
);

it('rejects unsafe IDs and invalid recipient bodies before network access', async () => {
	for (const recipientId of ['', '.', '..', '/', '\\', '"', "'"]) {
		await expect(
			thanksIoEndpointsNested.recipients.get(ctx, { recipientId } as never),
		).rejects.toThrow();
	}
	await expect(
		thanksIoEndpointsNested.recipients.create(ctx, {
			body: { mailing_list_id: 1 },
		} as never),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.recipients.deleteByAddress(ctx, {
			body: { mailing_list_id: 1, address: 'Main' },
		} as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it('forwards the documented bulk mailing_list form and returns individual errors', async () => {
	const body = [{ mailing_list: 1, email: 'a@example.com' }];
	const response = [
		{
			email: 'a@example.com',
			error: 'This address is already on this mailing list.',
		},
	];
	mockRequest.mockResolvedValueOnce(response);
	await expect(
		thanksIoEndpointsNested.recipients.createMultiple(ctx, { body }),
	).resolves.toEqual(response);
	expect(mockRequest).toHaveBeenCalledWith(
		expect.anything(),
		expect.objectContaining({ body }),
		expect.anything(),
	);
});

it.each([
	[
		'list',
		{ page: 2, items_per_page: 5 },
		'GET',
		'/mailing-lists/',
		{ page: 2, items_per_page: 5 },
		undefined,
		{
			data: [{ id: 1, qrcode_url: null }],
			links: { next: null },
			meta: { current_page: 2, per_page: '5' },
		},
	],
	[
		'create',
		{ body: { description: 'Birthday List' } },
		'POST',
		'/mailing-lists/',
		undefined,
		{ description: 'Birthday List' },
		{ id: 610, description: 'Birthday List', sub_account_id: null },
	],
	[
		'get',
		{ mailingListId: 1 },
		'GET',
		'/mailing-lists/1',
		undefined,
		undefined,
		{ id: 1, qrcode_url: null },
	],
	[
		'delete',
		{ mailingListId: 1 },
		'DELETE',
		'/mailing-lists/1',
		undefined,
		undefined,
		{ message: 'success' },
	],
	[
		'listRecipients',
		{
			mailingListId: 1,
			page: 2,
			limit: 20,
			updated_since: '2020-04-06 01:55:50',
		},
		'GET',
		'/mailing-lists-utils/recipients/1',
		{ page: 2, limit: 20, updated_since: '2020-04-06 01:55:50' },
		undefined,
		{
			data: [{ id: 2, dob: null }],
			current_page: 2,
			per_page: '20',
			next_page_url: null,
		},
	],
	[
		'buyRadiusSearch',
		{
			body: {
				address: '123 Main Street',
				postal_code: '55555',
				record_count: 5,
				append_data: true,
			},
		},
		'POST',
		'/mailing-lists-utils/buy-radius-search',
		undefined,
		{
			address: '123 Main Street',
			postal_code: '55555',
			record_count: 5,
			append_data: true,
		},
		{ message: 'success', mailing_list_id: 1196, failure: false },
	],
	[
		'countRadiusSearch',
		{
			body: {
				address: '123 Main Street',
				postal_code: '55555',
				record_count: 100,
			},
		},
		'POST',
		'/mailing-lists-utils/count-radius-search',
		undefined,
		{ address: '123 Main Street', postal_code: '55555', record_count: 100 },
		{ status: 'success', count: 42, failure: false },
	],
] as const)(
	'mailingLists.%s forwards its contract and validates its response',
	async (name, input, method, url, query, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.mailingLists[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		expect(
			thanksIoEndpointSchemas[`mailingLists.${name}`].input.safeParse(input)
				.success,
		).toBe(true);
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url, query, body }),
			expect.anything(),
		);
	},
);

it('rejects invalid mailing-list IDs and out-of-range radius purchases', async () => {
	await expect(
		thanksIoEndpointsNested.mailingLists.get(ctx, {
			mailingListId: '../1',
		} as never),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.mailingLists.buyRadiusSearch(ctx, {
			body: { address: 'Main', postal_code: '12345', record_count: 2501 },
		}),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	[
		'list',
		{ page: 2, type: 'order.status_update' },
		'GET',
		'/webhooks',
		{ page: 2, type: 'order.status_update' },
		undefined,
		{
			data: [
				{
					id: 10,
					type: 'order.status_update',
					mailing_list_id: null,
					deleted_at: null,
				},
			],
			links: { next: null },
			meta: { per_page: '15' },
			can_manage_webhooks: true,
		},
	],
	[
		'create',
		{
			body: {
				url: 'https://example.com/hook',
				type: 'order.status_update',
				verb: 'post',
				mailing_list_id: null,
			},
		},
		'POST',
		'/webhooks',
		undefined,
		{
			url: 'https://example.com/hook',
			type: 'order.status_update',
			verb: 'post',
			mailing_list_id: null,
		},
		{
			id: 13,
			url: 'https://example.com/hook',
			type: 'order.status_update',
			verb: 'post',
			mailing_list_id: null,
		},
	],
	[
		'update',
		{
			webhookId: 13,
			body: {
				url: 'https://example.com/hook',
				type: 'order_item.status_update',
				verb: 'get',
			},
		},
		'PUT',
		'/webhooks/13',
		undefined,
		{
			url: 'https://example.com/hook',
			type: 'order_item.status_update',
			verb: 'get',
		},
		{
			id: 13,
			url: 'https://example.com/hook',
			type: 'order_item.status_update',
			verb: 'get',
			deleted_at: null,
		},
	],
	[
		'delete',
		{ webhookId: 13 },
		'DELETE',
		'/webhooks/13',
		undefined,
		undefined,
		{ status: 'success' },
	],
] as const)(
	'webhookDestinations.%s forwards the outbound webhook contract',
	async (name, input, method, url, query, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.webhookDestinations[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		expect(
			thanksIoEndpointSchemas[`webhookDestinations.${name}`].input.safeParse(
				input,
			).success,
		).toBe(true);
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url, query, body }),
			expect.anything(),
		);
	},
);

it('requires a stage for scan-board webhook destinations and rejects unsafe IDs', async () => {
	await expect(
		thanksIoEndpointsNested.webhookDestinations.create(ctx, {
			body: {
				url: 'https://example.com/hook',
				type: 'scan_board.status_update',
				verb: 'post',
			},
		}),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.webhookDestinations.delete(ctx, {
			webhookId: '../1',
		} as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	[
		'list',
		{},
		'GET',
		'/sub-accounts/',
		undefined,
		{ data: [{ id: 1, title: 'My Sub Account' }] },
	],
	[
		'create',
		{ body: { title: 'My Sub Account' } },
		'POST',
		'/sub-accounts/',
		{ title: 'My Sub Account' },
		{ id: 1, title: 'My Sub Account' },
	],
	[
		'get',
		{ subAccountId: 1 },
		'GET',
		'/sub-accounts/1',
		undefined,
		{ id: 1, title: 'My Sub Account' },
	],
	[
		'update',
		{ subAccountId: 1, body: { title: 'New Name', return_city: 'Denver' } },
		'PUT',
		'/sub-accounts/1',
		{ title: 'New Name', return_city: 'Denver' },
		{ id: 1, title: 'New Name', return_city: 'Denver' },
	],
	[
		'delete',
		{ subAccountId: 1 },
		'DELETE',
		'/sub-accounts/1',
		undefined,
		{ message: 'success' },
	],
] as const)(
	'subAccounts.%s forwards its documented request',
	async (name, input, method, url, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.subAccounts[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		expect(
			thanksIoEndpointSchemas[`subAccounts.${name}`].input.safeParse(input)
				.success,
		).toBe(true);
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url, body }),
			expect.anything(),
		);
	},
);

it('rejects invalid sub-account IDs and missing required titles', async () => {
	await expect(
		thanksIoEndpointsNested.subAccounts.get(ctx, {
			subAccountId: '../1',
		} as never),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.subAccounts.update(ctx, {
			subAccountId: 1,
			body: {},
		} as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	[
		'list',
		{ page: 2, items_per_page: 2, type: 'giftcard' },
		'GET',
		'/message-templates/',
		{ page: 2, items_per_page: 2, type: 'giftcard' },
		undefined,
		{
			data: [
				{
					id: 1913,
					font_size: 'auto',
					additional_pages: null,
					giftcard_amount: '2000',
				},
			],
			links: { next: null },
			meta: { per_page: '2' },
		},
	],
	[
		'create',
		{
			body: {
				type: 'giftcard',
				giftcard_brand_code: 'amazonus',
				giftcard_amount: 5000,
			},
		},
		'POST',
		'/message-templates/',
		undefined,
		{
			type: 'giftcard',
			giftcard_brand_code: 'amazonus',
			giftcard_amount: 5000,
		},
		{ id: 1912, giftcard_amount: '5000', custom_background_url: null },
	],
	[
		'get',
		{ messageTemplateId: 1912 },
		'GET',
		'/message-templates/1912',
		undefined,
		undefined,
		{ id: 1912, content: 'Hello', additional_pages: null },
	],
	[
		'update',
		{ messageTemplateId: 1912, body: { content: 'Updated' } },
		'PATCH',
		'/message-templates/1912',
		undefined,
		{ content: 'Updated' },
		{ id: 1912, content: 'Updated' },
	],
	[
		'delete',
		{ messageTemplateId: 1912 },
		'DELETE',
		'/message-templates/1912',
		undefined,
		undefined,
		{ message: 'success' },
	],
] as const)(
	'messageTemplates.%s forwards the template contract',
	async (name, input, method, url, query, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.messageTemplates[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		expect(
			thanksIoEndpointSchemas[`messageTemplates.${name}`].input.safeParse(input)
				.success,
		).toBe(true);
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url, query, body }),
			expect.anything(),
		);
	},
);

it('enforces giftcard template creation fields and safe IDs', async () => {
	await expect(
		thanksIoEndpointsNested.messageTemplates.create(ctx, {
			body: { type: 'giftcard' },
		}),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.messageTemplates.get(ctx, {
			messageTemplateId: '..',
		} as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	[
		'imageTemplates',
		'list',
		{ page: 2, type: 'postcard' },
		'/image-templates/',
		{ page: 2, type: 'postcard' },
		{
			data: [
				{
					id: 6,
					sub_account_id: null,
					canva_id: null,
					dynamic_image_url: null,
				},
			],
			links: { next: null },
			meta: { per_page: '2' },
		},
	],
	[
		'creatives',
		'list',
		{ page: 2, complete_only: true },
		'/creatives/',
		{ page: 2, complete_only: 1, include_hidden: undefined },
		{
			data: [
				{
					id: 501,
					preview_image_url: null,
					message_template: { id: 12 },
					image_template: null,
				},
			],
			links: { next: null },
		},
	],
	[
		'creatives',
		'get',
		{ creativeId: 501 },
		'/creatives/501',
		undefined,
		{
			data: {
				id: 501,
				mailer_type: 'postcard',
				sub_account_id: null,
				back_background: null,
			},
		},
	],
] as const)(
	'%s.%s preserves read response and pagination',
	async (family, name, input, url, query, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = (
			family === 'imageTemplates'
				? thanksIoEndpointsNested.imageTemplates.list
				: thanksIoEndpointsNested.creatives[name]
		) as (context: never, input: never) => Promise<unknown>;
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method: 'GET', url, query }),
			expect.anything(),
		);
	},
);

it('rejects unsafe creative IDs', async () => {
	await expect(
		thanksIoEndpointsNested.creatives.get(ctx, { creativeId: '..' } as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	[
		'handwritingStyles',
		'list',
		'/handwriting-styles',
		{
			data: [
				{ handwriting_style_id: 2, name: 'Practiced Sharpie', type: 'Bold' },
			],
		},
	],
	[
		'giftcardBrands',
		'list',
		'/giftcard-brands',
		{
			gifts: {
				title: 'Gifts',
				brands: [{ brand_code: 'amazonus', available_amounts: [500, 1000] }],
			},
		},
	],
	[
		'giftcardBrands',
		'listFlat',
		'/giftcard-brands-list',
		{
			brands: [
				{ brand_code: 'amazonus', group: 'Featured', available_amounts: [500] },
			],
		},
	],
] as const)(
	'%s.%s accepts documented catalog examples',
	async (family, name, url, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = (
			family === 'handwritingStyles'
				? thanksIoEndpointsNested.handwritingStyles.list
				: thanksIoEndpointsNested.giftcardBrands[name]
		) as (context: never, input: never) => Promise<unknown>;
		await expect(endpoint(ctx, {} as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method: 'GET', url, body: undefined }),
			expect.anything(),
		);
	},
);

it('also accepts the flat giftcard list array declared by the schema', async () => {
	const response = [
		{ brands: [{ brand_code: 'amazonus', group: 'Featured' }] },
	];
	mockRequest.mockResolvedValueOnce(response);
	await expect(
		thanksIoEndpointsNested.giftcardBrands.listFlat(ctx, {}),
	).resolves.toEqual(response);
});

it.each([
	[
		'list',
		{ page: 2, items_per_page: 1, type: '6x9-postcard' },
		'GET',
		'/orders/list',
		{ page: 2, items_per_page: 1, type: '6x9-postcard' },
		undefined,
		{
			data: [{ id: 42708, metadata: null }],
			links: { next: null },
			meta: { per_page: '1' },
		},
	],
	[
		'track',
		{ orderId: '42708' },
		'GET',
		'/orders/42708/track',
		undefined,
		undefined,
		{
			data: {
				id: 42708,
				order: { status: 'Fulfilled', metadata: null },
				stats: { delivered: 1 },
				errors: [],
				returned: [],
			},
		},
	],
	[
		'listItems',
		{ orderId: 42708, page: 2, per_page: 25 },
		'GET',
		'/orders/42708/items',
		{ page: 2, per_page: 25 },
		undefined,
		{
			data: [
				{
					id: 3,
					delivery_date: null,
					failure: null,
					recipient: { email: null },
					preview: { front: null, back: null, pdf: null },
				},
			],
			links: { next: null },
		},
	],
	[
		'cancel',
		{ orderId: '42708' },
		'PUT',
		'/orders/42708/cancel',
		undefined,
		undefined,
		{ order: { id: 42708, status: 'cancelled' } },
	],
	[
		'replay',
		{
			orderId: 42708,
			body: {
				recipients: [{ address: '123 Main Street' }],
				metadata: { campaign: 'spring' },
			},
		},
		'POST',
		'/orders/42708/replay',
		undefined,
		{
			recipients: [{ address: '123 Main Street' }],
			metadata: { campaign: 'spring' },
		},
		{
			id: 42709,
			replayed_from_order_id: 42708,
			status: 'reviewing',
			metadata: { campaign: 'spring' },
		},
	],
] as const)(
	'orders.%s preserves its request and response',
	async (name, input, method, url, query, body, response) => {
		mockRequest.mockResolvedValueOnce(response);
		const endpoint = thanksIoEndpointsNested.orders[name] as (
			context: never,
			input: never,
		) => Promise<unknown>;
		await expect(endpoint(ctx, input as never)).resolves.toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method, url, query, body }),
			expect.anything(),
		);
	},
);

it('invalidates an order-item giftcard without a body', async () => {
	const response = {
		data: {
			id: 2668662,
			failure: null,
			giftcard: {
				brand: 'amazonus',
				amount: 2500,
				redeemed_at: null,
				invalidated_at: '2025-09-20T14:02:11Z',
			},
		},
	};
	mockRequest.mockResolvedValueOnce(response);
	await expect(
		thanksIoEndpointsNested.orderItems.invalidateGiftcard(ctx, {
			orderItemId: 2668662,
		}),
	).resolves.toEqual(response);
	expect(mockRequest).toHaveBeenCalledWith(
		expect.anything(),
		expect.objectContaining({
			method: 'PUT',
			url: '/order-items/2668662/invalidate-giftcard',
			body: undefined,
		}),
		expect.anything(),
	);
});

it('rejects dangerous order paths, oversized pages and address-less replays', async () => {
	for (const orderId of ['', ' ', '.', '..', '1/2', '1\\2', '"', "'"])
		await expect(
			thanksIoEndpointsNested.orders.track(ctx, { orderId }),
		).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.orders.listItems(ctx, {
			orderId: 1,
			per_page: 101,
		}),
	).rejects.toThrow();
	await expect(
		thanksIoEndpointsNested.orders.replay(ctx, {
			orderId: 1,
			body: { recipients: [{}] },
		} as never),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it.each([
	['postcard', 'postcard'],
	['magnacard', 'magnacard'],
	['windowedLetter', 'windowedletter'],
	['windowlessLetter', 'windowlessletter'],
	['notecard', 'notecard'],
	['giftcard', 'giftcard'],
] as const)(
	'sends %s and estimates it with the same documented creative request',
	async (name, path) => {
		const body = {
			creative_id: 501,
			recipients: [{ address: '123 Main Street', city: 'Lenexa' }],
			metadata: { campaign: 'spring' },
		};
		const result = {
			id: 42664,
			type: path,
			status: 'reviewing',
			metadata: { campaign: 'spring' },
		};
		mockRequest.mockResolvedValueOnce(result);
		await expect(
			thanksIoEndpointsNested.send[name](ctx, { body } as never),
		).resolves.toEqual(result);
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				HEADERS: { Authorization: 'Bearer test-token' },
			}),
			expect.objectContaining({ method: 'POST', url: `/send/${path}`, body }),
			expect.anything(),
		);
		const estimate = {
			message: 'OK',
			data: {
				type: path,
				size: null,
				total_recipients: 1,
				total_cost_in_cents: 73,
				costs_in_cents: { grand_total: 73 },
			},
		};
		mockRequest.mockResolvedValueOnce(estimate);
		await expect(
			thanksIoEndpointsNested.estimate[name](ctx, { body } as never),
		).resolves.toEqual(estimate);
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: `/estimate/${path}`,
				body,
			}),
			expect.anything(),
		);
	},
);

it('preserves send previews and does not lose mailer-specific fields', async () => {
	const body = {
		preview: true,
		recipients: [{ email: 'a@example.com', custom1: 'hello' }],
		front_image_url: 'https://example.com/front.png',
		message: 'Hi',
		size: '6x9' as const,
		email_lookup: false,
	};
	const response = {
		message: 'OK',
		data: { previews: ['https://example.com/preview.png'] },
	};
	mockRequest.mockResolvedValueOnce(response);
	await expect(
		thanksIoEndpointsNested.send.postcard(ctx, { body }),
	).resolves.toEqual(response);
	expect(mockRequest).toHaveBeenCalledWith(
		expect.anything(),
		expect.objectContaining({ body }),
		expect.anything(),
	);
});

it('rejects recipient entries without an address or email', async () => {
	await expect(
		thanksIoEndpointsNested.send.postcard(ctx, {
			body: { recipients: [{ name: 'Pat' }] },
		}),
	).rejects.toThrow();
	expect(mockRequest).not.toHaveBeenCalled();
});

it('returns PNG bytes from the image builder with the documented query and bearer token', async () => {
	const bytes = Uint8Array.from([137, 80, 78, 71, 0, 255]);
	const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
		new Response(bytes, {
			status: 200,
			headers: { 'content-type': 'image/png' },
		}),
	);
	try {
		const result = await thanksIoEndpointsNested.imageBuilder.create(ctx, {
			id: 8,
			header: 'Hello & welcome',
			size: '6x9',
		});
		expect(result.type).toBe('image/png');
		expect(new Uint8Array(await result.arrayBuffer())).toEqual(bytes);
		const [url, options] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://api.thanks.io/api/v2/build/image-template?id=8&header=Hello+%26+welcome&size=6x9',
		);
		expect(options).toEqual({
			method: 'GET',
			headers: { Authorization: 'Bearer test-token' },
		});
	} finally {
		fetchMock.mockRestore();
	}
});

it('returns image-builder rate-limit details without retrying', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
		new Response(JSON.stringify({ message: 'slow down' }), {
			status: 429,
			headers: { 'content-type': 'application/json', 'retry-after': '3' },
		}),
	);
	try {
		await expect(
			thanksIoEndpointsNested.imageBuilder.create(ctx, { id: 8 }),
		).rejects.toMatchObject({
			name: 'ThanksIoAPIError',
			status: 429,
			retryAfter: 3000,
			body: { message: 'slow down' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	} finally {
		fetchMock.mockRestore();
	}
});
