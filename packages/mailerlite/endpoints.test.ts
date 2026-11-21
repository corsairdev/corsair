import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import * as client from './client';
import { Campaigns, Orders, Subscribers } from './endpoints';
import { mailerLiteOperationRegistry } from './endpoints/operation';
import type { MailerLiteContext } from './index';
import { mailerLiteEndpointSchemas, mailerlite } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMailerLiteRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMailerLiteRequest);
const mockedLog = jest.mocked(logEventFromContext);

function buildContext(): MailerLiteContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-tenant'),
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
}

const ctx = buildContext();

type SampleValue =
	| string
	| number
	| boolean
	| null
	| SampleValue[]
	| { [key: string]: SampleValue };

// ZodType keeps dynamic registry schemas at an untrusted boundary; safeParse
// validates each generated candidate before the test calls its request builder.
function makeSchemaSample(schema: z.ZodType): SampleValue | undefined {
	if (schema instanceof z.ZodOptional) return undefined;
	if (schema instanceof z.ZodNullable) return null;
	if (schema instanceof z.ZodString) {
		const candidates: SampleValue[] = [
			'1',
			'active',
			'completed',
			'canceled',
			'failed',
			'a_path',
			'b_path',
			'c_path',
			'instant',
			'simple',
			'account',
			'test',
			'USD',
			'2026-11-21',
			'test@mailerlite.test',
			'https://mailer.test',
			'<html><body>Test</body></html>',
		];
		return candidates.find((candidate) => schema.safeParse(candidate).success);
	}
	if (schema instanceof z.ZodNumber) {
		return [1, 0, 100].find((candidate) => schema.safeParse(candidate).success);
	}
	if (schema instanceof z.ZodBoolean) return true;
	if (schema instanceof z.ZodEnum) return schema.options[0];
	if (schema instanceof z.ZodLiteral) {
		const candidates: SampleValue[] = [
			'1',
			'active',
			'completed',
			'canceled',
			'failed',
			'a_path',
			'b_path',
			'c_path',
			'instant',
			'simple',
			'account',
			'test',
			'USD',
			'2026-11-21',
			true,
			false,
			0,
			1,
		];
		return candidates.find((candidate) => schema.safeParse(candidate).success);
	}
	if (schema instanceof z.ZodArray) {
		const candidates: SampleValue[] = [
			[],
			['1'],
			['subscriber.created'],
			[{ email: 'person@mailerlite.test' }],
			[{ name: 'Test resource' }],
			[{ name: 'Test resource', attributes: {} }],
			[{ ecommerce_product_id: '1' }],
		];
		return candidates.find((candidate) => schema.safeParse(candidate).success);
	}
	if (schema instanceof z.ZodRecord) return {};
	if (schema instanceof z.ZodUnion) {
		const candidates: SampleValue[] = [
			'1',
			'test',
			'test@mailerlite.test',
			'https://mailer.test',
			0,
			1,
			true,
			false,
			null,
			[],
			{},
		];
		return candidates.find((candidate) => schema.safeParse(candidate).success);
	}
	if (schema instanceof z.ZodObject) {
		const shape = schema.shape;
		const required: { [key: string]: SampleValue } = {};
		const complete: { [key: string]: SampleValue } = {};
		for (const [key, field] of Object.entries(shape)) {
			const candidate = makeSchemaSample(field);
			if (candidate !== undefined) complete[key] = candidate;
			if (!field.isOptional() && candidate !== undefined)
				required[key] = candidate;
		}
		if (schema.safeParse(required).success) return required;
		if (schema.safeParse(complete).success) return complete;
		return required;
	}
	return undefined;
}

const operationInputOverrides: Record<string, SampleValue> = {
	'campaigns.create': {
		body: {
			name: 'Welcome note',
			type: 'regular',
			emails: [
				{
					subject: 'Welcome',
					from_name: 'Team',
					from: 'sender@mailerlite.test',
				},
			],
		},
	},
	'orders.create': {
		shopId: 'shop-1',
		body: {
			customer: { email: 'buyer@mailerlite.test', accepts_marketing: false },
			cart: { items: [{ ecommerce_product_id: 'product-1' }] },
			status: 'pending',
		},
	},
	'cartItems.create': {
		shopId: 'shop-1',
		cartId: 'cart-1',
		body: { ecommerce_product_id: 'product-1' },
	},
	'cartItems.update': {
		shopId: 'shop-1',
		cartId: 'cart-1',
		itemId: 'item-1',
		body: { ecommerce_product_id: 'product-1' },
	},
	'automationSteps.reorder': {
		automationId: 'automation-1',
		body: { dragged_step_id: 'step-1' },
	},
	'ecommerceImports.orders': {
		shopId: 'shop-1',
		body: {
			orders: [
				{
					customer_id: 'customer-1',
					cart: { items: [{ ecommerce_product_id: 'product-1' }] },
				},
			],
		},
	},
	'shops.stats': {
		shopId: '1',
		query: { start_date: '2026-11-01', end_date: '2026-11-21' },
	},
	'campaigns.schedule': { campaignId: '1', body: { delivery: 'instant' } },
	'automationEmails.setContent': {
		automationId: '1',
		emailId: '1',
		body: { html: '<html><body>Test</body></html>' },
	},
	'emails.insertBlock': {
		emailId: '1',
		body: { type: 'divider', etag: '42', editor_content: {} },
	},
	'groups.create': { body: { name: 'Newsletter subscribers' } },
	'groups.update': { groupId: '1', body: { name: 'Newsletter subscribers' } },
	'fields.create': { body: { name: 'Customer score', type: 'number' } },
	'fields.update': { fieldId: '1', body: { name: 'Customer score' } },
	'segments.update': { segmentId: '1', body: { name: 'Active subscribers' } },
	'forms.update': { formId: '1', body: { name: 'Newsletter form' } },
	'automations.addSubscribers': {
		automationId: 'automation-1',
		body: { emails: ['active@mailerlite.test'] },
	},
	'shops.create': {
		body: { name: 'Test shop', url: 'https://mailer.test', currency: 'USD' },
	},
	'shops.update': {
		shopId: 'shop-1',
		body: { name: 'Test shop', url: 'https://mailer.test', currency: 'USD' },
	},
};

function expectedMethod(operation: string): string {
	const action = operation.split('.').at(-1);
	if (operation.startsWith('automationReports.orders')) return 'GET';
	if (
		[
			'list',
			'get',
			'count',
			'activity',
			'importStatus',
			'ecommerceStats',
			'ecommerceOrders',
			'ecommerceReport',
			'stats',
			'subscriberActivity',
			'stepRunCounts',
			'stepRunCount',
			'triggerRunCounts',
			'triggerRunCount',
			'abStepStats',
			'abStepStat',
			'stepSubscribers',
			'triggerSubscribers',
			'emailTotals',
			'ecommerceTotals',
			'getContent',
			'unsubscribeReasons',
			'versions',
			'html',
			'getBlock',
			'subscribers',
		].includes(action ?? '')
	)
		return 'GET';
	if (['updateBlock', 'updateSettings'].includes(action ?? '')) return 'PATCH';
	if (
		[
			'update',
			'assign',
			'assignMultiple',
			'changeStatus',
			'selectWinner',
			'setContent',
		].includes(action ?? '')
	)
		return 'PUT';
	if (
		['delete', 'deleteBlock', 'removeFromGroup', 'unassign'].includes(
			action ?? '',
		)
	)
		return 'DELETE';
	return 'POST';
}

function expectedPathPrefix(operation: string): string {
	const [resource, action] = operation.split('.');
	if (resource === 'subscribers') return '/subscribers';
	if (resource === 'groups') return '/groups';
	if (
		['fields', 'segments', 'campaigns', 'forms', 'webhooks', 'emails'].includes(
			resource ?? '',
		)
	)
		return `/${resource}`;
	if (resource === 'brandStyles') return '/brand-styles';
	if (resource === 'files') return '/files';
	if (resource === 'timezones') return '/timezones';
	if (resource === 'campaignLanguages') return '/campaigns';
	if (resource === 'automationTemplates' && action === 'list')
		return '/automation-templates';
	if (resource?.startsWith('automation')) return '/automations';
	if (resource === 'ecommerceSettings') return '/ecommerce/settings';
	if (
		[
			'shops',
			'carts',
			'cartItems',
			'categories',
			'categoryProducts',
			'customers',
			'orders',
			'products',
			'productVariants',
			'ecommerceImports',
		].includes(resource ?? '')
	)
		return '/ecommerce/shops';
	return '/';
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('MailerLite endpoint contracts', () => {
	it.each(Object.entries(mailerLiteOperationRegistry))(
		'%s validates input and builds its documented method and resource path',
		(operation, contract) => {
			const input =
				operationInputOverrides[operation] ??
				makeSchemaSample(contract.inputSchema);
			expect(input).toBeDefined();
			const parsedInput = contract.inputSchema.safeParse(input);
			expect(parsedInput.success).toBe(true);
			const request = contract.requestBuilder(input);
			expect(request.method).toBe(expectedMethod(operation));
			expect(request.url.startsWith(expectedPathPrefix(operation))).toBe(true);
			expect(request.url).not.toContain('undefined');
		},
	);

	it('fetches a subscriber by an encoded identifier and never logs subscriber PII', async () => {
		const response = {
			data: { id: 'sub-1', email: 'person+tag@mailerlite.test' },
		};
		mockedRequest.mockResolvedValue(response);

		await expect(
			Subscribers.get(ctx, { identifier: 'person+tag@mailerlite.test' }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			{ method: 'GET', url: '/subscribers/person%2Btag%40mailerlite.test' },
			'test-api-key',
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'mailerlite.subscribers.get',
			{},
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person+tag@mailerlite.test',
		);
	});

	it('rejects undocumented request keys before network I/O', () => {
		const createContract = mailerLiteOperationRegistry['subscribers.create'];
		if (!createContract) throw new Error('Missing subscribers.create contract');
		expect(() =>
			createContract.requestBuilder({
				body: {
					email: 'person@mailerlite.test',
					undocumented_field: 'reject-me',
				},
			}),
		).toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLog).not.toHaveBeenCalled();
	});

	it('sends an explicit campaign schedule request and logs no recipient criteria', async () => {
		const response = { data: { id: 'campaign-1', status: 'sent' } };
		mockedRequest.mockResolvedValue(response);
		const input = {
			campaignId: 'campaign-1',
			body: { delivery: 'instant' as const },
		};

		await expect(Campaigns.schedule(ctx, input)).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			{
				method: 'POST',
				url: '/campaigns/campaign-1/schedule',
				body: { delivery: 'instant' },
			},
			'test-api-key',
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'mailerlite.campaigns.schedule',
			{},
			'completed',
		);
	});

	it('creates an order using the documented customer/cart contract', async () => {
		const response = { data: { id: 'order-1', status: 'pending' } };
		mockedRequest.mockResolvedValue(response);
		const body = {
			customer: { email: 'buyer@mailerlite.test', accepts_marketing: false },
			cart: {
				items: [
					{ ecommerce_product_id: 'product-1', quantity: 1, price: 14.5 },
				],
			},
			status: 'pending' as const,
		};

		await expect(
			Orders.create(ctx, { shopId: 'shop-1', body }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			{ method: 'POST', url: '/ecommerce/shops/shop-1/orders', body },
			'test-api-key',
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'mailerlite.orders.create',
			{},
			'completed',
		);
	});

	it('keeps endpoint registrations, Zod contracts and metadata in sync', () => {
		const plugin = mailerlite({});
		const schemaKeys = Object.keys(mailerLiteEndpointSchemas).sort();
		const metadataKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
		expect(metadataKeys).toEqual(schemaKeys);
		expect(schemaKeys.length).toBeGreaterThan(150);
		expect(plugin.endpoints?.automations?.enable).toBeDefined();
		expect(plugin.endpoints?.emails?.insertBlock).toBeDefined();
		expect(plugin.endpoints?.ecommerceImports?.orders).toBeDefined();
	});
});
