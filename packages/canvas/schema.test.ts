import crypto from 'node:crypto';
import type { CanvasOperationName } from './endpoints/operations';
import { canvasOperations } from './endpoints/operations';
import {
	CanvasEndpointInputSchemas,
	CanvasEndpointOutputSchemas,
} from './endpoints/types';
import {
	CanvasAccount,
	CanvasAssignment,
	CanvasCourse,
	CanvasEnrollment,
	CanvasSchema,
	CanvasUser,
} from './schema';
import {
	createCanvasMatch,
	verifyCanvasWebhookSignature,
} from './webhooks/types';

describe('Canvas schema', () => {
	it('declares a semver version', () => {
		expect(CanvasSchema.version).toBeDefined();
		expect(CanvasSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to Canvas REST resources', () => {
		expect(Object.keys(CanvasSchema.entities).sort()).toEqual(
			['accounts', 'assignments', 'courses', 'enrollments', 'users'].sort(),
		);
		expect(CanvasCourse.parse({ id: 1, name: 'Bio' })).toMatchObject({
			id: 1,
			name: 'Bio',
		});
		expect(CanvasAccount.parse({ id: 2, name: 'Root' })).toMatchObject({
			id: 2,
			name: 'Root',
		});
		expect(CanvasUser.parse({ id: 3, name: 'Ada' })).toMatchObject({
			id: 3,
			name: 'Ada',
		});
		expect(CanvasAssignment.parse({ id: 4, name: 'HW1' })).toMatchObject({
			id: 4,
			name: 'HW1',
		});
		expect(
			CanvasEnrollment.parse({ id: 5, user_id: 3, course_id: 1 }),
		).toMatchObject({ id: 5, user_id: 3, course_id: 1 });
	});
});

describe('Canvas operations', () => {
	it('defines at least 100 operations', () => {
		const operationNames = Object.keys(canvasOperations);
		expect(operationNames.length).toBeGreaterThanOrEqual(100);
	});

	it('every operation has method, path, and description', () => {
		for (const [name, op] of Object.entries(canvasOperations)) {
			expect(op.method).toBeDefined();
			expect(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).toContain(op.method);
			expect(op.path).toBeDefined();
			expect(typeof op.path).toBe('string');
			expect(op.description).toBeDefined();
			expect(typeof op.description).toBe('string');
		}
	});

	it('has matching input and output schemas for every operation', () => {
		const operationNames = Object.keys(
			canvasOperations,
		) as CanvasOperationName[];
		for (const name of operationNames) {
			expect(CanvasEndpointInputSchemas[name]).toBeDefined();
			expect(CanvasEndpointOutputSchemas[name]).toBeDefined();
		}
	});
});

jest.mock('./client', () => ({
	makeCanvasRequest: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
	normalizeCanvasBaseUrl: jest.requireActual('./client').normalizeCanvasBaseUrl,
}));

import { makeCanvasRequest } from './client';
import { createCanvasEndpoint } from './endpoints/factory';

describe('Canvas endpoint behavior', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('validates input, passes baseUrl to client, and validates output', async () => {
		const createCourse = createCanvasEndpoint(
			'createCourse',
			'canvas.courses.createCourse',
		);

		const mockCtx = {
			key: 'test_token',
			options: { baseUrl: 'https://test.canvas.com' },
			logEvent: jest.fn(),
		};

		const response = await createCourse(mockCtx as never, {
			query: { include: ['term'] },
			pathParams: { account_id: '1' },
			body: { course: { name: 'Test Course' } },
		});

		expect(makeCanvasRequest).toHaveBeenCalledWith(
			'/api/v1/accounts/{account_id}/courses',
			'test_token',
			expect.objectContaining({
				method: 'POST',
				query: { include: ['term'] },
				body: { course: { name: 'Test Course' } },
				baseUrl: 'https://test.canvas.com',
			}),
		);

		expect(response).toEqual({ id: 1, name: 'Test' });
	});

	it('allows bodyless mutating actions without a body field', async () => {
		const addFavorite = createCanvasEndpoint(
			'addCourseToFavorites',
			'canvas.courses.addCourseToFavorites',
		);

		await addFavorite(
			{
				key: 'test_token',
				options: { baseUrl: 'https://test.canvas.com' },
				logEvent: jest.fn(),
			} as never,
			{ pathParams: { course_id: '42' } },
		);

		expect(makeCanvasRequest).toHaveBeenCalledWith(
			'/api/v1/users/self/favorites/courses/{course_id}',
			'test_token',
			expect.objectContaining({
				method: 'POST',
				path: { course_id: '42' },
				body: {},
			}),
		);
	});

	it('rejects body-required mutations with missing or empty body', async () => {
		const createCourse = createCanvasEndpoint(
			'createCourse',
			'canvas.courses.createCourse',
		);
		const ctx = {
			key: 'test_token',
			options: { baseUrl: 'https://test.canvas.com' },
			logEvent: jest.fn(),
		} as never;

		await expect(
			// Runtime still rejects when body is omitted despite the cast.
			createCourse(ctx, {
				pathParams: { account_id: '1' },
			} as {
				pathParams: { account_id: string };
				body: Record<string, unknown>;
			}),
		).rejects.toThrow();
		await expect(
			createCourse(ctx, { pathParams: { account_id: '1' }, body: {} }),
		).rejects.toThrow();
		expect(makeCanvasRequest).not.toHaveBeenCalled();
	});

	it('accepts array responses from list endpoints', async () => {
		(makeCanvasRequest as jest.Mock).mockResolvedValueOnce([
			{ id: 1 },
			{ id: 2 },
		]);

		const getAllUsers = createCanvasEndpoint(
			'getAllUsers',
			'canvas.users.getAllUsers',
		);

		const response = await getAllUsers(
			{
				key: 'test_token',
				options: { baseUrl: 'https://test.canvas.com' },
				logEvent: jest.fn(),
			} as never,
			{ pathParams: { account_id: '1' } },
		);

		expect(response).toEqual([{ id: 1 }, { id: 2 }]);
	});

	it('resolves baseUrl from account keys when options.baseUrl is unset', async () => {
		const getCurrentUser = createCanvasEndpoint(
			'getCurrentUser',
			'canvas.users.getCurrentUser',
		);

		const mockCtx = {
			key: 'test_token',
			options: {},
			keys: {
				get_base_url: jest
					.fn()
					.mockResolvedValue('https://school.instructure.com'),
			},
			logEvent: jest.fn(),
		};

		await getCurrentUser(mockCtx as never, {});

		expect(makeCanvasRequest).toHaveBeenCalledWith(
			expect.any(String),
			'test_token',
			expect.objectContaining({
				baseUrl: 'https://school.instructure.com',
			}),
		);
	});

	it('rejects calls without a baseUrl', async () => {
		const getCurrentUser = createCanvasEndpoint(
			'getCurrentUser',
			'canvas.users.getCurrentUser',
		);

		await expect(
			getCurrentUser(
				{ key: 't', options: {}, keys: {}, logEvent: jest.fn() } as never,
				{},
			),
		).rejects.toThrow(/baseUrl is required/);
	});
});

describe('Canvas webhook verification', () => {
	it('rejects missing signature, empty secret, and missing raw body', () => {
		expect(
			verifyCanvasWebhookSignature(
				{
					headers: {},
					rawBody: '{}',
					payload: { type: 'course_created' },
				} as never,
				'secret',
			).valid,
		).toBe(false);

		expect(
			verifyCanvasWebhookSignature(
				{
					headers: { 'x-canvas-signature': 'x' },
					rawBody: '{}',
					payload: { type: 'course_created' },
				} as never,
				'',
			).valid,
		).toBe(false);

		expect(
			verifyCanvasWebhookSignature(
				{
					headers: { 'x-canvas-signature': 'x' },
					payload: { type: 'course_created' },
				} as never,
				'secret',
			).valid,
		).toBe(false);
	});

	it('accepts a valid HMAC-SHA256 signature', () => {
		const rawBody = '{"type":"course_created"}';
		const secret = 'webhook-secret';
		const signature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('base64');

		expect(
			verifyCanvasWebhookSignature(
				{
					headers: { 'x-canvas-signature': signature },
					rawBody,
					payload: { type: 'course_created' },
				} as never,
				secret,
			),
		).toEqual({ valid: true });
	});

	it('matches Live Event metadata.event_name and simple type', () => {
		const match = createCanvasMatch('course_created');
		expect(
			match({
				body: { metadata: { event_name: 'course_created' } },
				headers: {},
			} as never),
		).toBe(true);
		expect(
			match({
				body: { type: 'course_created' },
				headers: {},
			} as never),
		).toBe(true);
		expect(
			match({
				body: { type: 'submission_created' },
				headers: {},
			} as never),
		).toBe(false);
	});
});
