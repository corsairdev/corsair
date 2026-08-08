import { request } from 'corsair/http';
import { makeCanvasRequest, resolvePath } from './client';
import { createCanvasEndpoint } from './endpoints/factory';
import type {
	CanvasOperation,
	CanvasOperationName,
} from './endpoints/operations';
import { canvasOperations } from './endpoints/operations';
import { CanvasEndpointInputSchemas } from './endpoints/types';
import { canvas } from './index';
import { resolveCanvasOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

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
		expect(plugin.oauthConfig?.authUrl).toContain('/login/oauth2/auth');
		expect(plugin.oauthConfig?.tokenUrl).toContain('/login/oauth2/token');
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

	it('resolvePath encodes path params', () => {
		expect(
			resolvePath('/api/v1/courses/{course_id}/pages/{url}', {
				course_id: '1',
				url: 'a/b',
			}),
		).toBe('/api/v1/courses/1/pages/a%2Fb');
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
});

describe('Canvas endpoint API coverage', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true, id: 1 });
	});

	it(`exercises all ${operationNames.length} operations against the HTTP client`, async () => {
		for (const name of operationNames) {
			const op = canvasOperations[name] as CanvasOperation;
			const pathParams = pathParamsFor(op.path);
			const isMutation =
				op.method === 'POST' || op.method === 'PUT' || op.method === 'PATCH';

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
			const result = await endpoint(mockCtx as never, input);

			expect(result).toEqual({ ok: true, id: 1 });

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
