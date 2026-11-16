import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	makeThinkificRequest,
	normalizeThinkificSubdomain,
	THINKIFIC_RATE_LIMIT_CONFIG,
} from './client';
import * as Bundles from './endpoints/bundles';
import * as Coupons from './endpoints/coupons';
import * as Enrollments from './endpoints/enrollments';
import * as Products from './endpoints/products';
import * as Users from './endpoints/users';
import { thinkific, thinkificAuthConfig, thinkificEndpointMeta } from './index';

const endpointContext = {
	key: 'unit-test-api-key',
	keys: {
		get_subdomain: async () => 'unit-test-school',
	},
	$getAccountId: async () => 'unit-test-account',
};

// `unknown` because each test passes a provider-shaped body.
function jsonResponse(value: unknown, status = 200): Response {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

// Thinkific's own users example (REST API Response Format guide), with its nulls and extra fields.
const documentedUsersPage = {
	items: [
		{
			id: 4,
			created_at: '2015-09-10T23:39:56.189Z',
			first_name: 'Bob',
			last_name: 'Smith',
			full_name: 'Bob Smith',
			company: 'A Company',
			email: 'something@example.com',
			roles: ['course_admin'],
			avatar_url: null,
			bio: null,
			headline: null,
			affiliate_code: null,
			affiliate_commission: null,
			affiliate_payout_email: null,
			administered_course_ids: [1, 2],
			custom_profile_fields: [
				{
					id: 1,
					value: 'Canada',
					label: 'Country',
					custom_profile_field_definition_id: 1,
				},
			],
		},
	],
	meta: {
		pagination: {
			current_page: 1,
			next_page: null,
			prev_page: null,
			total_pages: 1,
			total_items: 1,
		},
	},
};

describe('Thinkific responses', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('accepts the documented users page with null fields and null page boundaries', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse(documentedUsersPage));
		const page = await Users.list(endpointContext, {});
		expect(page.meta?.pagination?.next_page).toBeNull();
		expect(page.items?.[0]?.avatar_url).toBeNull();
		expect(page.items?.[0]?.full_name).toBe('Bob Smith');
	});

	it('accepts an enrollment that is not completed and never expires', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			jsonResponse({
				id: 1,
				user_email: 'learner@example.com',
				user_name: 'Sample Learner',
				user_id: 2,
				course_name: 'Course',
				course_id: 3,
				percentage_completed: '0.0',
				expired: false,
				is_free_trial: false,
				completed: false,
				started_at: '2026-11-01T10:00:00Z',
				activated_at: '2026-11-01T10:00:00Z',
				completed_at: null,
				updated_at: '2026-11-01T10:00:00Z',
				expiry_date: null,
			}),
		);
		const enrollment = await Enrollments.get(endpointContext, {
			path: { id: 1 },
		});
		expect(enrollment.completed_at).toBeNull();
		expect(enrollment.percentage_completed).toBe('0.0');
	});

	it('accepts coupons without a note and prices sent as strings', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			jsonResponse({
				id: 1,
				code: 'SPRING',
				note: null,
				quantity_used: 0,
				quantity: null,
				promotion_id: 2,
				created_at: '2026-11-01T10:00:00Z',
			}),
		);
		const coupon = await Coupons.get(endpointContext, { path: { id: 1 } });
		expect(coupon.note).toBeNull();

		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			jsonResponse({
				id: 5,
				name: 'Course',
				price: '49.0',
				status: 'published',
				product_prices: [{ id: 1, price: '49.0', payment_type: 'one-time' }],
			}),
		);
		const product = await Products.get(endpointContext, { path: { id: 5 } });
		expect(product.price).toBe('49.0');
	});

	it('treats an empty 201 body as success on bodyless writes', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response('', {
				status: 201,
				headers: { 'Content-Type': 'text/html' },
			}),
		);
		await expect(
			Bundles.createEnrollment(endpointContext, {
				path: { id: 1 },
				body: { user_id: 2 },
			}),
		).resolves.toBeUndefined();
	});

	it('names only the failing paths when a response really is malformed', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({ items: 'private@example.com' }));
		const failure = await Users.list(endpointContext, {}).catch(
			(caught: unknown) => caught,
		);
		expect(failure).toBeInstanceOf(Error);
		expect(String(failure)).toContain('users.list at items');
		expect(String(failure)).not.toContain('private@example.com');
	});
});

describe('Thinkific errors and account fields', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("keeps Thinkific's validation text in the error message", async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			jsonResponse(
				{
					errors: {
						email: ['has already been taken'],
						password: ['is too short (minimum is 6 characters)'],
					},
				},
				422,
			),
		);
		const failure = await makeThinkificRequest('users', 'key', 'school', {
			method: 'POST',
			body: { email: 'private@example.com' },
		}).catch((caught: unknown) => caught);
		if (!(failure instanceof ApiError)) throw new Error('Expected ApiError');
		expect(failure.status).toBe(422);
		expect(failure.message).toContain('email has already been taken');
		expect(failure.message).toContain('password is too short');
		expect(failure.message).not.toContain('private@example.com');
	});

	it('backs off past a full rate-limit minute when RateLimit-Reset is not an epoch', () => {
		const { maxRetries, initialRetryDelay, backoffMultiplier } =
			THINKIFIC_RATE_LIMIT_CONFIG;
		let total = 0;
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			total += Math.min(
				initialRetryDelay * backoffMultiplier ** (attempt - 1),
				60_000,
			);
		}
		expect(total).toBeGreaterThanOrEqual(60_000);
	});

	it('stores the site subdomain as its own account field', () => {
		expect(thinkificAuthConfig.api_key.account).toEqual(['subdomain']);
	});

	it('normalizes a pasted site address to the bare subdomain', () => {
		expect(normalizeThinkificSubdomain(' https://Acme.thinkific.com/ ')).toBe(
			'acme',
		);
		expect(normalizeThinkificSubdomain('acme.thinkific.com')).toBe('acme');
		expect(normalizeThinkificSubdomain('acme')).toBe('acme');
		expect(normalizeThinkificSubdomain('  ')).toBeUndefined();
	});

	it('asks for a connection when the subdomain is missing', async () => {
		const { keyBuilder } = thinkific();
		if (!keyBuilder) throw new Error('Expected a keyBuilder');
		// The keyBuilder only reads these two key getters; the full KeyBuilderContext isn't needed.
		const keyContext = {
			keys: {
				get_api_key: async () => 'unit-test-api-key',
				get_subdomain: async () => null,
			},
		} as unknown as Parameters<typeof keyBuilder>[0];
		await expect(
			Promise.resolve().then(() => keyBuilder(keyContext, 'endpoint')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('marks enrollments, which can email the learner, destructive', () => {
		expect(thinkificEndpointMeta['enrollments.create'].riskLevel).toBe(
			'destructive',
		);
		expect(thinkificEndpointMeta['bundles.createEnrollment'].riskLevel).toBe(
			'destructive',
		);
	});
});
