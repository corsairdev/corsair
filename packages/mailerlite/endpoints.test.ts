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
			'builder_inline_email',
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
			'builder_inline_email',
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

const operationResponseFixtures: Record<string, SampleValue> = {
	'subscribers.get': {
		data: {
			id: 'subscriber-1',
			email: 'reader@mailerlite.test',
			status: 'active',
			source: 'api',
			sent: 3,
			opens_count: 2,
			clicks_count: 1,
			open_rate: 66.67,
			click_rate: 33.33,
			ip_address: null,
			subscribed_at: '2026-11-20 09:00:00',
			unsubscribed_at: null,
			created_at: '2026-11-20 09:00:00',
			updated_at: '2026-11-20 09:00:00',
			fields: { name: 'Reader', company: null },
			groups: [
				{
					id: 'group-1',
					name: 'Newsletter',
					active_count: 20,
					sent_count: 10,
					opens_count: 6,
					open_rate: { float: 0.6, string: '60%' },
					click_rate: { float: 0.2, string: '20%' },
				},
			],
			opted_in_at: null,
			optin_ip: null,
		},
	},
	'orders.get': {
		data: {
			id: 'order-1',
			status: 'complete',
			total: 123.4,
			shop: {
				id: 'shop-1',
				name: 'Example shop',
				url: 'https://shop.mailerlite.test',
				currency: 'USD',
				enabled: true,
			},
			customer: {
				id: 'customer-1',
				email: 'buyer@mailerlite.test',
				accepts_marketing: false,
				total_spent: 123.4,
				orders_count: 1,
				subscriber: {
					id: 'subscriber-1',
					email: 'buyer@mailerlite.test',
					status: 'active',
				},
			},
			cart: {
				id: 'cart-1',
				resource_id: null,
				checkout_url: 'https://shop.mailerlite.test/checkout/1',
				cart_total: 123.4,
				items: [
					{
						id: 'item-1',
						product: {
							id: 'product-1',
							name: 'Example product',
							price: 123.4,
							url: 'https://shop.mailerlite.test/product/1',
							image: 'https://shop.mailerlite.test/product/1.png',
							exclude_from_automations: false,
							enabled: true,
							categories: [{ id: 'category-1', name: 'Accessories' }],
						},
						variant: 'Blue',
						quantity: 1,
						price: 123.4,
					},
				],
			},
			attribution: { email_id: 'email-1', type: 'campaign' },
			created_at: '2026-11-20 09:00:00',
			updated_at: '2026-11-20 09:00:00',
			completed_at: '2026-11-20 09:00:00',
		},
	},
	'emails.get': {
		data: {
			id: 'email-1',
			type: 'builder_inline_email',
			emailable_type: 'campaigns',
			emailable_id: 'campaign-1',
			settings: {
				brand: { mode: 'account', font_family: 'Inter, sans-serif' },
				layout: { width_mode: 'default', alignment: 'center' },
				typography: { heading: { font_weight: '700' } },
				button: { background_color: '#2cb191' },
				footer: {
					show_preferences: false,
					company_name: { editor_content: { content: [] } },
					address: { editor_content: { content: [] } },
					info_text: { editor_content: { content: [] } },
					social_links: [
						{
							url: 'https://mailer.test',
							type: 'website',
							label: 'Website',
							link_id: 1001,
						},
					],
				},
			},
			blocks: [
				{
					id: 'block-1',
					type: 'heading',
					editor_content: {
						attrs: { level: 1 },
						content: [{ type: 'text', text: 'October update' }],
					},
				},
			],
		},
		etag: '42',
	},
	'forms.get': {
		data: {
			id: 'form-1',
			type: 'embedded',
			slug: 'signup',
			name: 'Newsletter form',
			created_at: '2026-11-20 09:00:00',
			conversions_count: 2,
			opens_count: 0,
			conversion_rate: { float: 0.02, string: '2%' },
			settings: [],
			last_registration_at: null,
			active: true,
			is_broken: false,
			has_content: true,
			can: { update: true },
			used_in_automations: false,
			warnings: [],
			double_optin: null,
			screenshot_url: null,
		},
	},
	'automations.get': {
		data: {
			id: 'automation-1',
			name: 'Welcome series',
			enabled: false,
			trigger_data: { track_ecommerce: false, valid: true },
			triggers: [
				{
					id: 'trigger-1',
					type: 'subscriber_joins_group',
					group_ids: ['group-1'],
					groups: [{ id: 'group-1', name: 'Newsletter' }],
					broken: false,
				},
			],
			steps: [
				{
					id: 'step-1',
					type: 'email',
					parent_id: null,
					name: 'Welcome',
					subject: 'Welcome aboard',
					from: 'team@mailerlite.test',
					email_id: 'email-1',
					complete: true,
				},
			],
			complete: true,
			broken: false,
			warnings: [],
			emails_count: 1,
			stats: {
				completed_subscribers_count: 1,
				subscribers_in_queue_count: 2,
				sent: 5,
				open_rate: { float: 0.5, string: '50%' },
			},
			created_at: '2026-11-20 09:00:00',
		},
	},
	'automations.activity': {
		data: [
			{
				id: 'run-1',
				status: 'Completed',
				date: '2026-11-20 09:00:00',
				reason: null,
				reason_description: '',
				stepRuns: [
					{
						id: 'run-step-1',
						step_id: 'step-1',
						description: 'Wait for one day',
						scheduled_for: null,
					},
				],
				currentStep: { id: 'step-1', type: 'delay', complete: true },
			},
		],
	},
	'automationReports.triggerRunCounts': {
		data: {
			triggers: [{ id: 'trigger-1', completed_runs: 3, queued_runs: 1 }],
			manual_runs: null,
		},
	},
	'automationReports.abStepStats': {
		data: [
			{
				step_id: 'step-ab-1',
				name: 'Subject test',
				ab_test_winner: null,
				parent_id: 'step-parent-1',
				can_select_winner: true,
				a_path_step_id: 'step-a',
				b_path_step_id: 'step-b',
				c_path_step_id: null,
				split_percentages: [
					{ label: 'A', path: 'a_path', value: 50 },
					{ label: 'B', path: 'b_path', value: 50 },
				],
				stats: {
					a_path: {
						subscribers: 10,
						sent: 10,
						opens: 5,
						clicks: 2,
						open_rate: { float: 0.5, string: '50%' },
					},
				},
			},
		],
	},
	'automationReports.abStepStat': {
		data: {
			step_id: 'step-ab-1',
			name: 'Subject test',
			ab_test_winner: 'a_path',
			can_select_winner: false,
			stats: {
				a_path: { subscribers: 10, sent: 10, opens: 5, clicks: 2 },
			},
		},
	},
	'automationReports.stepSubscribers': {
		data: [
			{
				id: 'run-1',
				subscriber: { id: 'subscriber-1', email: 'reader@mailerlite.test' },
				date: '2026-11-20 09:00:00',
			},
		],
	},
	'automationReports.triggerSubscribers': {
		data: [
			{
				id: 'run-1',
				subscriber: { id: 'subscriber-1', email: 'reader@mailerlite.test' },
				date: '2026-11-20 09:00:00',
			},
		],
	},
	'automationReports.orders': {
		data: [
			{
				subscriber: { id: 'subscriber-1', email: 'reader@mailerlite.test' },
				total: 59.9,
				updated_at: '2026-11-20 09:00:00',
				order: 'One product',
				email: {
					id: 'email-1',
					name: 'Welcome email',
					subject: 'Welcome',
					from: 'team@mailerlite.test',
					stats: { sent: 5, opens_count: 2 },
				},
			},
		],
	},
	'automationReports.emailTotals': {
		data: {
			engagement: {
				sent: 10,
				opens_count: 7,
				clicks_count: 2,
				open_rate: { string: '70%' },
				click_rate: { string: '20%' },
			},
			deliverability: {
				sent: 10,
				delivered_count: 10,
				delivered_rate: { string: '100%' },
				spam_count: 0,
				spam_rate: { string: '0%' },
			},
		},
	},
	'automationEmails.stats': {
		data: {
			engagement: {
				sent: 10,
				opens_count: 7,
				clicks_count: 2,
				open_rate: { string: '70%' },
				click_rate: { string: '20%' },
			},
			deliverability: {
				sent: 10,
				delivered_count: 10,
				delivered_rate: { string: '100%' },
			},
		},
	},
	'automationReports.ecommerceTotals': {
		data: {
			ecommerce: {
				orders_count: 3,
				revenue: 120,
				average_order_value: 40,
				conversion_rate: '10%',
			},
			best_performing_email: null,
		},
	},
	'automationEmails.ecommerceStats': {
		data: {
			ecommerce: {
				orders_count: 3,
				revenue: 120,
				average_order_value: 40,
				conversion_rate: '10%',
			},
		},
	},
	'subscribers.activity': {
		data: [
			{
				id: 'activity-1',
				log_name: 'added_to_group',
				subject_id: 'subscriber-1',
				subject_type: 'subscribers',
				properties: { group_id: 'group-1', group_name: 'Newsletter' },
				created_at: '2026-11-20 09:00:00',
			},
		],
	},
	'campaigns.subscriberActivity': {
		data: [
			{
				id: 'activity-1',
				opens_count: 1,
				clicks_count: 0,
				subscriber: {
					id: 'subscriber-1',
					email: 'reader@mailerlite.test',
					status: 'active',
					fields: { name: 'Reader' },
				},
			},
		],
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
		'%s validates its input, full request, and response contract',
		async (operation, contract) => {
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
			expect(request).toMatchSnapshot(operation);

			const response =
				operationResponseFixtures[operation] ??
				makeSchemaSample(contract.outputSchema);
			expect(contract.outputSchema.safeParse(response).success).toBe(true);
			mockedRequest.mockResolvedValue(response);
			await expect(contract.invoke(ctx, input)).resolves.toEqual(response);
			expect(mockedRequest).toHaveBeenCalledWith(request, ctx.key);
		},
	);

	it('keeps GET subscriber routes read-only and order imports destructive', () => {
		for (const operation of [
			'groups.subscribers',
			'segments.subscribers',
			'forms.subscribers',
			'emails.html',
			'emails.getBlock',
			'emails.versions',
		]) {
			expect(mailerLiteOperationRegistry[operation]?.riskLevel).toBe('read');
		}
		expect(
			mailerLiteOperationRegistry['ecommerceImports.orders']?.riskLevel,
		).toBe('destructive');
	});

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
