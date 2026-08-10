import crypto from 'node:crypto';
import { request } from 'corsair/http';
import {
	makeCanvasRequest,
	normalizeCanvasBaseUrl,
	resolvePath,
} from './client';
import { syncCanvasOperationCache } from './endpoints/cache-sync';
import { createCanvasEndpoint } from './endpoints/factory';
import type {
	CanvasOperation,
	CanvasOperationName,
} from './endpoints/operations';
import { canvasOperations } from './endpoints/operations';
import { canvasRoutes } from './endpoints/routes';
import {
	CanvasEndpointInputSchemas,
	CanvasEndpointOutputSchemas,
	expectsListResponse,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { canvas } from './index';
import { CanvasSchema } from './schema';
import {
	accountIdFromAccountsList,
	resolveCanvasOAuthWebhookTenantLink,
} from './webhooks/oauth-tenant-link';
import { matchCanvasTenantWebhook } from './webhooks/tenant-matcher';
import { verifyCanvasWebhookSignature } from './webhooks/types';

function mockResponseFor(
	name: CanvasOperationName,
	op: CanvasOperation,
): unknown {
	if (op.path === '/api/graphql') return { data: { id: 1 } };
	if (op.method === 'DELETE') return { id: 1 };
	if (op.path.includes('/upload')) return 'id,name\n1,x';
	if (name.toLowerCase().includes('permission')) {
		return { read_roster: true, manage_grades: false };
	}
	if (name.toLowerCase().includes('unreadcount')) {
		return { unread_count: 0 };
	}
	if (name.toLowerCase().includes('quota')) {
		return { quota: 1000, quota_used: 10 };
	}
	if (name.toLowerCase().includes('submissionsummary')) {
		return { graded: 1, ungraded: 2, not_submitted: 3 };
	}
	if (
		name.toLowerCase().includes('brandvariables') ||
		name.toLowerCase().includes('customcolors') ||
		name.toLowerCase().includes('dashboardpositions') ||
		name.toLowerCase().includes('kalturaconfig') ||
		name.toLowerCase().includes('latepolicy') ||
		name.toLowerCase().includes('readstate') ||
		name.toLowerCase().includes('moduleitemsequence') ||
		name.toLowerCase().includes('helplinks') ||
		name.toLowerCase().includes('customcolor') ||
		name.toLowerCase().includes('statusoflastreport') ||
		name.toLowerCase().includes('fulltopic')
	) {
		return { ok: true };
	}
	if (name === 'getQuizStatistics') {
		return { quiz_statistics: [{ id: 1, quiz_id: 2 }] };
	}
	if (name === 'getOutcomeResults') {
		return { outcome_results: [{ id: 1 }], linked: {} };
	}
	if (name === 'createSinglePoll') return { polls: [{ id: 1 }] };
	if (name === 'createSinglePollChoice') {
		return { poll_choices: [{ id: 1 }] };
	}
	if (name === 'createSinglePollSession') {
		return { poll_sessions: [{ id: 1 }] };
	}
	if (name === 'createSinglePollSubmission') {
		return { poll_submissions: [{ id: 1 }] };
	}
	if (
		name.toLowerCase().includes('participationdata') ||
		name.toLowerCase().includes('activitystream')
	) {
		return [{ date: '2026-01-01', views: 1 }];
	}
	if (name.toLowerCase().includes('page')) {
		return { page_id: 1, url: 'home', title: 'Home' };
	}
	if (expectsListResponse(name, op)) {
		return [{ id: 1, name: name }];
	}
	return { id: 1, name: name };
}

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

function pathParamsFor(template: string): Record<string, string> {
	const params: Record<string, string> = {};
	for (const match of template.matchAll(/\{([^}]+)\}/g)) {
		params[match[1]!] = '1';
	}
	return params;
}

const operationNames = Object.keys(canvasOperations) as CanvasOperationName[];

const mockCtx = {
	key: 'test_token',
	$getAccountId: async () => 'test-account-id',
	options: { baseUrl: 'https://school.instructure.com' },
	logEvent: jest.fn(),
	db: {},
};

describe('Canvas db schema + cache sync', () => {
	it('declares LMS core entities on the plugin schema', () => {
		expect(Object.keys(CanvasSchema.entities).sort()).toEqual(
			['accounts', 'assignments', 'courses', 'enrollments', 'users'].sort(),
		);
	});

	it('upserts course cache after getSingleCourse responses', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = canvasRoutes.find((r) => r.key === 'getSingleCourse');
		expect(route).toBeDefined();

		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { courses: { upsertByEntityId } },
			} as never,
			route!,
			{ pathParams: { course_id: '1' } },
			{ id: 1, name: 'Bio 101' },
		);

		expect(upsertByEntityId).toHaveBeenCalledWith('1', {
			id: 1,
			name: 'Bio 101',
		});
	});

	it('does not cache course subresources into courses entity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = canvasRoutes.find((r) => r.key === 'getCoursePermissions');
		expect(route).toBeDefined();

		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { courses: { upsertByEntityId } },
			} as never,
			route!,
			{ pathParams: { course_id: '1' } },
			{ read_roster: true },
		);

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('upserts assignment list items into assignments cache', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const route = canvasRoutes.find((r) => r.key === 'getAllAssignments');
		expect(route).toBeDefined();

		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { assignments: { upsertByEntityId } },
			} as never,
			route!,
			{ pathParams: { course_id: '9' } },
			[
				{ id: 1, name: 'HW1' },
				{ id: 2, name: 'HW2' },
			],
		);

		expect(upsertByEntityId).toHaveBeenCalledWith('1', {
			id: 1,
			name: 'HW1',
		});
		expect(upsertByEntityId).toHaveBeenCalledWith('2', {
			id: 2,
			name: 'HW2',
		});
	});

	it('deletes assignment cache using pathParams.assignment_id', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		const route = canvasRoutes.find((r) => r.key === 'deleteAssignment');
		expect(route).toBeDefined();

		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { assignments: { deleteByEntityId } },
			} as never,
			route!,
			{ pathParams: { course_id: '9', assignment_id: '42' } },
			{ id: 42, workflow_state: 'deleted' },
		);

		expect(deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('upserts concluded/deactivated enrollments; deletes only for task=delete', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		const route = canvasRoutes.find(
			(r) => r.key === 'concludeDeactivateOrDeleteEnrollment',
		);
		expect(route).toBeDefined();
		expect(route!.method).toBe('DELETE');

		const enrollment = {
			id: 7,
			enrollment_state: 'completed',
			user_id: 3,
			course_id: 1,
		};

		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { enrollments: { upsertByEntityId, deleteByEntityId } },
			} as never,
			route!,
			{ pathParams: { course_id: '1', enrollment_id: '7' } },
			enrollment,
		);
		expect(deleteByEntityId).not.toHaveBeenCalled();
		expect(upsertByEntityId).toHaveBeenCalledWith('7', enrollment);

		upsertByEntityId.mockClear();
		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { enrollments: { upsertByEntityId, deleteByEntityId } },
			} as never,
			route!,
			{
				pathParams: { course_id: '1', enrollment_id: '7' },
				query: { task: 'deactivate' },
			},
			{ ...enrollment, enrollment_state: 'inactive' },
		);
		expect(deleteByEntityId).not.toHaveBeenCalled();
		expect(upsertByEntityId).toHaveBeenCalledWith('7', {
			...enrollment,
			enrollment_state: 'inactive',
		});

		upsertByEntityId.mockClear();
		await syncCanvasOperationCache(
			{
				key: 'tok',
				db: { enrollments: { upsertByEntityId, deleteByEntityId } },
			} as never,
			route!,
			{
				pathParams: { course_id: '1', enrollment_id: '7' },
				body: { task: 'delete' },
			},
			enrollment,
		);
		expect(upsertByEntityId).not.toHaveBeenCalled();
		expect(deleteByEntityId).toHaveBeenCalledWith('7');
	});
});

describe('Canvas plugin shape', () => {
	it('registers every operation with matching schemas and meta', () => {
		const plugin = canvas({ baseUrl: 'https://school.instructure.com' });
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();
		const opCount = operationNames.length;

		expect(countLeaves(endpoints)).toBe(opCount);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(opCount);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(opCount);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(paths);
		expect(Object.keys(canvasOperations).sort()).toEqual(
			paths.map((p) => p.split('.').pop()!).sort(),
		);
	});

	it('exposes api_key and oauth_2 auth with base_url account field', () => {
		const plugin = canvas({ baseUrl: 'https://school.instructure.com' });
		expect(plugin.options).toMatchObject({
			authType: 'api_key',
			baseUrl: 'https://school.instructure.com',
		});
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['base_url'] },
			oauth_2: { account: ['base_url'] },
		});
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://school.instructure.com/login/oauth2/auth',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://school.instructure.com/login/oauth2/token',
		);
	});

	it('requires options.baseUrl for oauth_2 and never falls back to public host', () => {
		expect(() => canvas({ authType: 'oauth_2' })).toThrow(
			/baseUrl is required/,
		);
		const plugin = canvas({ baseUrl: 'https://school.instructure.com' });
		expect(plugin.oauthConfig?.authUrl).not.toContain(
			'canvas.instructure.com/login',
		);
	});

	it('marks GraphQL delete ops as destructive', () => {
		const plugin = canvas({ baseUrl: 'https://school.instructure.com' });
		expect(
			plugin.endpointMeta?.['discussions.deleteDiscussionEntry']?.riskLevel,
		).toBe('destructive');
		expect(
			plugin.endpointMeta?.['discussions.deleteDiscussionTopicGraphQl']
				?.riskLevel,
		).toBe('destructive');
		expect(
			plugin.endpointMeta?.['submissions.deleteSubmissionDraft']?.riskLevel,
		).toBe('destructive');
		expect(
			plugin.endpointMeta?.['outcomes.deleteOutcomeLinks']?.riskLevel,
		).toBe('destructive');
	});

	it('registers six Live Event webhook triggers', () => {
		const plugin = canvas({ baseUrl: 'https://school.instructure.com' });
		expect(Object.keys(plugin.webhooks?.triggers ?? {}).sort()).toEqual([
			'assignmentGraded',
			'newAssignmentSubmission',
			'newCourseCreated',
			'newDiscussionMessage',
			'newDiscussionTopic',
			'newFileUploaded',
		]);
	});
});

describe('Canvas HTTP client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ id: 1 });
	});

	it('sends Bearer auth, resolves path params, and applies rate limits', async () => {
		await makeCanvasRequest('/api/v1/courses/{course_id}', 'tok', {
			method: 'GET',
			path: { course_id: '99' },
			baseUrl: 'https://school.instructure.com/',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://school.instructure.com',
				TOKEN: 'tok',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer tok',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/courses/99',
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ enabled: true }),
			}),
		);
	});

	it('resolvePath encodes path params and rejects missing ones', () => {
		expect(
			resolvePath('/api/v1/courses/{course_id}/pages/{url}', {
				course_id: '1',
				url: 'a/b',
			}),
		).toBe('/api/v1/courses/1/pages/a%2Fb');
		expect(() => resolvePath('/api/v1/courses/{course_id}', {})).toThrow(
			/Missing path param/,
		);
	});

	it('requires https base URLs', () => {
		expect(normalizeCanvasBaseUrl('https://school.instructure.com/')).toBe(
			'https://school.instructure.com',
		);
		expect(() =>
			normalizeCanvasBaseUrl('http://school.instructure.com'),
		).toThrow(/https/);
		expect(() => normalizeCanvasBaseUrl('not-a-url')).toThrow(/valid/);
	});

	it('rewrites array query keys to Canvas bracket form', async () => {
		await makeCanvasRequest('/api/v1/courses', 'tok', {
			method: 'GET',
			query: { include: ['total_scores', 'teachers'], per_page: 50 },
			baseUrl: 'https://school.instructure.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: {
					'include[]': ['total_scores', 'teachers'],
					per_page: 50,
				},
			}),
			expect.anything(),
		);
	});
});

describe('Canvas input schemas', () => {
	it('requires a non-empty body for body-required mutations', () => {
		const schema = CanvasEndpointInputSchemas.createCourse;
		expect(() => schema.parse({ pathParams: { account_id: '1' } })).toThrow();
		expect(() =>
			schema.parse({ pathParams: { account_id: '1' }, body: {} }),
		).toThrow();
		expect(
			schema.parse({
				pathParams: { account_id: '1' },
				body: { course: { name: 'X' } },
			}),
		).toMatchObject({ body: { course: { name: 'X' } } });
	});

	it('allows omitting body for bodyless mutations', () => {
		const schema = CanvasEndpointInputSchemas.addCourseToFavorites;
		expect(schema.parse({ pathParams: { course_id: '1' } })).toMatchObject({
			pathParams: { course_id: '1' },
			body: {},
		});
	});

	it('requires path placeholders as non-empty strings', () => {
		const schema = CanvasEndpointInputSchemas.getSingleCourse;
		expect(() => schema.parse({})).toThrow();
		expect(() => schema.parse({ pathParams: { course_id: '' } })).toThrow();
		expect(schema.parse({ pathParams: { course_id: '9' } })).toMatchObject({
			pathParams: { course_id: '9' },
		});
	});

	it('requires path params for every operation that has placeholders', () => {
		for (const name of operationNames) {
			const op = canvasOperations[name] as CanvasOperation;
			if (!/\{[^}]+\}/.test(op.path)) continue;
			const schema = CanvasEndpointInputSchemas[name];
			expect(() => schema.parse({})).toThrow();
		}
	});

	it('accepts empty and string response bodies', () => {
		const schema = CanvasEndpointOutputSchemas.getRubricsUploadTemplate;
		expect(schema.parse(undefined)).toBeUndefined();
		expect(schema.parse('')).toBe('');
		expect(schema.parse('csv,data')).toBe('csv,data');
		expect(schema.parse({ id: 1 })).toEqual({ id: 1 });
	});

	it('uses operation-specific output schemas (GraphQL vs REST)', () => {
		expect(() =>
			CanvasEndpointOutputSchemas.getLegacyNode.parse([{ id: 1 }]),
		).toThrow();
		expect(
			CanvasEndpointOutputSchemas.getLegacyNode.parse({ data: { id: 1 } }),
		).toEqual({ data: { id: 1 } });
		expect(
			CanvasEndpointOutputSchemas.getSingleCourse.parse({
				id: 9,
				name: 'X',
				course_code: 'CS101',
				workflow_state: 'available',
			}),
		).toMatchObject({ id: 9, course_code: 'CS101' });
		// Canvas Course objects require id — empty/malformed objects fail.
		expect(() =>
			CanvasEndpointOutputSchemas.getSingleCourse.parse({ name: 'X' }),
		).toThrow();
		expect(() =>
			CanvasEndpointOutputSchemas.getSingleCourse.parse(42),
		).toThrow();
		expect(() =>
			CanvasEndpointOutputSchemas.getSingleCourse.parse('not-json'),
		).toThrow();
		expect(
			CanvasEndpointOutputSchemas.getAllUsers.parse([
				{ id: 1, name: 'Ada' },
				{ id: 2, name: 'Grace' },
			]),
		).toHaveLength(2);
		expect(() =>
			CanvasEndpointOutputSchemas.getAllUsers.parse({ id: 1 }),
		).toThrow();
		expect(
			CanvasEndpointOutputSchemas.getQuizStatistics.parse({
				quiz_statistics: [{ id: 1 }],
			}),
		).toMatchObject({ quiz_statistics: [{ id: 1 }] });
		expect(
			CanvasEndpointOutputSchemas.getOutcomeResults.parse({
				outcome_results: [],
			}),
		).toMatchObject({ outcome_results: [] });
		expect(
			CanvasEndpointOutputSchemas.createBatchOverridesInACourse.parse([
				{ id: 1 },
			]),
		).toEqual([{ id: 1 }]);
		expect(
			CanvasEndpointOutputSchemas.createSinglePoll.parse({
				polls: [{ id: 9 }],
			}),
		).toMatchObject({ polls: [{ id: 9 }] });
	});

	it('exposes a Canvas-doc route table for every operation', () => {
		expect(canvasRoutes).toHaveLength(operationNames.length);
		for (const route of canvasRoutes) {
			expect(route.path.startsWith('/api/')).toBe(true);
			expect(route.pathParams).toEqual(
				[...route.path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
			);
			expect(['read', 'write', 'destructive']).toContain(route.riskLevel);
		}
	});
});

describe('Canvas tenant matcher', () => {
	it('uses numeric ids for canvas_account_id, never UUID', () => {
		expect(
			matchCanvasTenantWebhook({
				body: {
					metadata: {
						root_account_id: '55',
						root_account_uuid: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
					},
				},
				headers: {},
			} as never),
		).toEqual({ linkType: 'canvas_account_id', externalId: '55' });

		expect(
			matchCanvasTenantWebhook({
				body: {
					metadata: {
						root_account_uuid: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
					},
				},
				headers: {},
			} as never),
		).toEqual({
			linkType: 'canvas_root_account_uuid',
			externalId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
		});
	});

	it('skips non-numeric candidates and uses the first numeric id', () => {
		expect(
			matchCanvasTenantWebhook({
				body: {
					root_account_id: 'not-a-number',
					account_id: '77',
				},
				headers: {},
			} as never),
		).toEqual({ linkType: 'canvas_account_id', externalId: '77' });
	});
});

describe('Canvas error handlers', () => {
	it('does not treat unrelated 429 substrings as rate limits', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('order-4291-failed')),
		).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429 rate limit')),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
	});
});

describe('Canvas webhook signature header', () => {
	it('accepts array-valued x-canvas-signature headers', () => {
		const rawBody = '{"type":"course_created"}';
		const secret = 'webhook-secret';
		const signature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('base64');

		expect(
			verifyCanvasWebhookSignature(
				{
					headers: { 'x-canvas-signature': [signature] },
					rawBody,
					payload: { type: 'course_created' },
				} as never,
				secret,
			),
		).toEqual({ valid: true });
	});
});

describe('Canvas OAuth webhook tenant link', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('uses account id from the token when present', async () => {
		await expect(
			resolveCanvasOAuthWebhookTenantLink({
				access_token: 'tok',
				account_id: '55',
			}),
		).resolves.toEqual({
			linkType: 'canvas_account_id',
			externalId: '55',
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('fetches /api/v1/accounts when token has access_token + base_url', async () => {
		mockRequest.mockResolvedValueOnce([{ id: 7, name: 'Root' }]);

		await expect(
			resolveCanvasOAuthWebhookTenantLink({
				access_token: 'tok',
				base_url: 'https://school.instructure.com',
			}),
		).resolves.toEqual({
			linkType: 'canvas_account_id',
			externalId: '7',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://school.instructure.com',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/accounts',
			}),
			expect.anything(),
		);
	});

	it('returns null when account cannot be resolved', async () => {
		await expect(
			resolveCanvasOAuthWebhookTenantLink({ access_token: 'tok' }),
		).resolves.toBeNull();
	});

	it('does not pick an arbitrary accounts[0] when multiple accounts are returned', async () => {
		mockRequest.mockResolvedValueOnce([
			{ id: 7, name: 'Sub', parent_account_id: 1 },
			{ id: 1, name: 'Root', parent_account_id: null },
		]);

		await expect(
			resolveCanvasOAuthWebhookTenantLink({
				access_token: 'tok',
				base_url: 'https://school.instructure.com',
			}),
		).resolves.toEqual({
			linkType: 'canvas_account_id',
			externalId: '1',
		});

		expect(accountIdFromAccountsList([{ id: 7 }, { id: 1 }])).toBeNull();
		expect(
			accountIdFromAccountsList([
				{ id: 7, parent_account_id: 1 },
				{ id: 9, parent_account_id: 1 },
			]),
		).toBeNull();
	});

	it('does not use a singleton child account id as the tenant', () => {
		expect(
			accountIdFromAccountsList([
				{ id: 7, parent_account_id: 1, root_account_id: 1 },
			]),
		).toBe('1');
		expect(
			accountIdFromAccountsList([{ id: 7, parent_account_id: 1 }]),
		).toBeNull();
	});

	it('skips non-numeric token account fields', async () => {
		await expect(
			resolveCanvasOAuthWebhookTenantLink({
				access_token: 'tok',
				account_id: 'acct_abc',
				root_account_id: '42',
			}),
		).resolves.toEqual({
			linkType: 'canvas_account_id',
			externalId: '42',
		});
	});
});

describe('Canvas endpoint API coverage', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it(`exercises all ${operationNames.length} operations against the HTTP client`, async () => {
		for (const name of operationNames) {
			const op = canvasOperations[name] as CanvasOperation;
			const pathParams = pathParamsFor(op.path);
			const isMutation =
				op.method === 'POST' || op.method === 'PUT' || op.method === 'PATCH';
			const mockBody = mockResponseFor(name, op);
			mockRequest.mockResolvedValueOnce(mockBody);

			const input: {
				pathParams?: Record<string, string>;
				body?: Record<string, unknown>;
			} = {};
			if (Object.keys(pathParams).length > 0) {
				input.pathParams = pathParams;
			}
			if (isMutation && op.bodyless !== true) {
				input.body = { _test: true, name };
			}

			const endpoint = createCanvasEndpoint(name, `canvas.test.${name}`);
			const result = await endpoint(mockCtx as never, input as never);

			expect(result).toEqual(mockBody);

			const lastCall = mockRequest.mock.calls.at(-1);
			expect(lastCall).toBeDefined();
			const [config, requestOptions] = lastCall as [
				{ BASE: string; TOKEN: string },
				{ method: string; url: string; body?: unknown },
			];

			expect(config.BASE).toBe('https://school.instructure.com');
			expect(config.TOKEN).toBe('test_token');
			expect(requestOptions.method).toBe(op.method);
			expect(requestOptions.url).toBe(resolvePath(op.path, pathParams));
			expect(requestOptions.url).not.toMatch(/\{[^}]+\}/);

			if (isMutation) {
				if (op.bodyless === true) {
					expect(requestOptions.body).toEqual({});
				} else {
					expect(requestOptions.body).toEqual({ _test: true, name });
				}
			} else {
				expect(requestOptions.body).toBeUndefined();
			}
		}

		expect(mockRequest).toHaveBeenCalledTimes(operationNames.length);
	});
});
