import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeBannerbearRequest } from './client';
import { errorHandlers } from './error-handlers';
import type { BannerbearContext } from './index';
import { bannerbear, bannerbearEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue('mock-event-id'),
	};
});

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'bb_test_api_key_123',
	$getAccountId: () => 'test-account-id',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('bb_test_api_key_123'),
		get_webhook_signature: jest.fn().mockResolvedValue('whsec_test'),
	},
	logEvent: jest.fn(),
	database: {},
} as unknown as BannerbearContext;

function expectRequest(
	method: string,
	url: string,
	extra: Record<string, unknown> = {},
) {
	expect(mockRequest).toHaveBeenCalledWith(
		expect.objectContaining({
			BASE: 'https://api.bannerbear.com',
			HEADERS: expect.objectContaining({
				Authorization: 'Bearer bb_test_api_key_123',
			}),
		}),
		expect.objectContaining({
			method,
			url,
			...extra,
		}),
		expect.objectContaining({
			rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
		}),
	);
}

describe('Bannerbear plugin registry', () => {
	const plugin = bannerbear();

	const endpointTree = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;

	function nestedPaths(): string[] {
		const paths: string[] = [];
		for (const [group, leaves] of Object.entries(endpointTree)) {
			for (const leaf of Object.keys(leaves)) {
				paths.push(`${group}.${leaf}`);
			}
		}
		return paths.sort();
	}

	it('registers all V5 operations in the endpoint tree', () => {
		const paths = nestedPaths();
		expect(paths).toHaveLength(27);
		expect(paths).toEqual([
			'account.getAccountInfo',
			'account.getAuth',
			'animationTemplates.create',
			'animationTemplates.get',
			'animationTemplates.list',
			'animations.create',
			'animations.get',
			'animations.list',
			'images.create',
			'images.get',
			'images.list',
			'instantUrls.create',
			'instantUrls.list',
			'misc.joinPdfs',
			'templates.create',
			'templates.delete',
			'templates.get',
			'templates.import',
			'templates.list',
			'webhooksApi.create',
			'webhooksApi.delete',
			'webhooksApi.get',
			'workflows.createWorkflowRun',
			'workflows.getWorkflow',
			'workflows.getWorkflowRun',
			'workflows.listWorkflowRuns',
			'workflows.listWorkflows',
		]);
	});

	it('keeps the endpoint tree, schemas, and metadata in lockstep', () => {
		const paths = nestedPaths();
		expect(Object.keys(bannerbearEndpointSchemas).sort()).toEqual(paths);
		expect(
			Object.keys(plugin.endpointMeta as Record<string, unknown>).sort(),
		).toEqual(paths);
	});

	it('defines input and output schemas for every endpoint', () => {
		for (const [_path, schema] of Object.entries(bannerbearEndpointSchemas)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});

	it('defines metadata with riskLevel and description for every endpoint', () => {
		const metaMap = (plugin.endpointMeta ?? {}) as Record<
			string,
			{ riskLevel?: string; description?: string }
		>;
		for (const [_path, meta] of Object.entries(metaMap)) {
			expect(['read', 'write']).toContain(meta.riskLevel);
			expect(typeof meta.description).toBe('string');
			expect(meta.description?.length).toBeGreaterThan(0);
		}
	});

	it('throws AuthMissingError when no API key is configured', async () => {
		await expect(
			plugin.keyBuilder!(
				{
					...mockCtx,
					authType: 'api_key',
					keys: {
						get_api_key: jest.fn().mockResolvedValue(undefined),
						get_webhook_signature: jest.fn(),
					},
				} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0],
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Bannerbear client error wrapping and retries', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('rethrows ApiError directly without dropping status and retry metadata', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.bannerbear.com/v5/images' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.bannerbear.com/v5/images',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBannerbearRequest('/v5/images', 'test-key', {
				method: 'GET',
				retries: false,
			}),
		).rejects.toThrow(apiError);
	});

	it('wraps generic errors in BannerbearAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network error'));

		await expect(
			makeBannerbearRequest('/v5/images', 'test-key', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'BannerbearAPIError',
			message: 'Network error',
		});
	});

	it('retries GET 429s inside the client', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.bannerbear.com/v5/images' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.bannerbear.com/v5/images',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
			{ retryAfter: 0 },
		);
		mockRequest
			.mockRejectedValueOnce(apiError)
			.mockResolvedValueOnce([{ uid: 'img_1' }]);

		const result = await makeBannerbearRequest('/v5/images', 'test-key', {
			method: 'GET',
		});
		expect(result).toEqual([{ uid: 'img_1' }]);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('does not retry POST requests', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'https://api.bannerbear.com/v5/images' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.bannerbear.com/v5/images',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBannerbearRequest('/v5/images', 'test-key', {
				method: 'POST',
				body: { template: 'tmpl_1', modifications: {} },
			}),
		).rejects.toThrow(apiError);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('Bannerbear binder error handlers', () => {
	it('keeps 429 binder retries at zero', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.bannerbear.com/v5/images' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.bannerbear.com/v5/images',
				body: {},
			},
			'Too Many Requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError),
		).resolves.toMatchObject({ maxRetries: 0 });
	});
});

describe('Bannerbear endpoint handler invocations', () => {
	const plugin = bannerbear();
	const endpoints = plugin.endpoints!;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('invokes account.getAccountInfo', async () => {
		mockRequest.mockResolvedValue({ uid: 'acc_1', plan: 'pro' });
		const result = await endpoints.account.getAccountInfo(mockCtx, {});
		expectRequest('GET', '/v5/account');
		expect(result).toEqual({ uid: 'acc_1', plan: 'pro' });
	});

	it('invokes account.getAuth', async () => {
		mockRequest.mockResolvedValue({ uid: 'acc_1' });
		const result = await endpoints.account.getAuth(mockCtx, {});
		expectRequest('GET', '/v5/account');
		expect(result).toEqual({ uid: 'acc_1' });
	});

	it('invokes templates.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'tmpl_1', name: 'Template 1' }]);
		const result = await endpoints.templates.list(mockCtx, { page: 1 });
		expectRequest('GET', '/v5/image_templates', { query: { page: 1 } });
		expect(result).toHaveLength(1);
	});

	it('invokes templates.get with encoded uid', async () => {
		mockRequest.mockResolvedValue({ uid: 'tmpl/1', name: 'Template 1' });
		const result = await endpoints.templates.get(mockCtx, {
			uid: 'tmpl/1',
		});
		expectRequest('GET', '/v5/image_templates/tmpl%2F1');
		expect(result.name).toBe('Template 1');
	});

	it('invokes templates.create', async () => {
		mockRequest.mockResolvedValue({
			uid: 'tmpl_2',
			name: 'T2',
			width: 1200,
			height: 630,
		});
		const result = await endpoints.templates.create(mockCtx, {
			name: 'T2',
			width: 1200,
			height: 630,
		});
		expectRequest('POST', '/v5/image_templates', {
			body: { name: 'T2', width: 1200, height: 630 },
		});
		expect(result.width).toBe(1200);
	});

	it('invokes templates.delete', async () => {
		mockRequest.mockResolvedValue(undefined);
		const result = await endpoints.templates.delete(mockCtx, {
			uid: 'tmpl_1',
		});
		expectRequest('DELETE', '/v5/image_templates/tmpl_1');
		expect(result).toEqual({ success: true });
	});

	it('invokes templates.import via publications install', async () => {
		mockRequest.mockResolvedValue({ uid: 'tmpl_imp', name: 'Imported' });
		const result = await endpoints.templates.import(mockCtx, {
			publication_id: 'pub_123',
		});
		expectRequest('POST', '/v5/publications/pub_123/install', { body: {} });
		expect(result.uid).toBe('tmpl_imp');
	});

	it('invokes images.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'img_1', status: 'completed' }]);
		const result = await endpoints.images.list(mockCtx, {});
		expectRequest('GET', '/v5/images');
		expect(result).toHaveLength(1);
	});

	it('invokes images.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'img_1', status: 'completed' });
		const result = await endpoints.images.get(mockCtx, { uid: 'img_1' });
		expectRequest('GET', '/v5/images/img_1');
		expect(result.uid).toBe('img_1');
	});

	it('invokes images.create', async () => {
		mockRequest.mockResolvedValue({ uid: 'img_new', status: 'pending' });
		const result = await endpoints.images.create(mockCtx, {
			template: 'tmpl_1',
			modifications: { objects: [] },
		});
		expectRequest('POST', '/v5/images', {
			body: {
				template: 'tmpl_1',
				modifications: { objects: [] },
			},
		});
		expect(result.uid).toBe('img_new');
	});

	it('invokes animations.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'an_1', status: 'completed' }]);
		const result = await endpoints.animations.list(mockCtx, {});
		expectRequest('GET', '/v5/animations');
		expect(result).toHaveLength(1);
	});

	it('invokes animations.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'an_1', status: 'completed' });
		const result = await endpoints.animations.get(mockCtx, { uid: 'an_1' });
		expectRequest('GET', '/v5/animations/an_1');
		expect(result.uid).toBe('an_1');
	});

	it('invokes animations.create', async () => {
		mockRequest.mockResolvedValue({ uid: 'an_new', status: 'queued' });
		const result = await endpoints.animations.create(mockCtx, {
			template: 'at_1',
			modifications: { objects: [] },
			formats: ['mp4'],
		});
		expectRequest('POST', '/v5/animations', {
			body: {
				template: 'at_1',
				modifications: { objects: [] },
				formats: ['mp4'],
			},
		});
		expect(result.uid).toBe('an_new');
	});

	it('invokes animationTemplates.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'at_1', name: 'AT 1' }]);
		const result = await endpoints.animationTemplates.list(mockCtx, {});
		expectRequest('GET', '/v5/animation_templates');
		expect(result).toHaveLength(1);
	});

	it('invokes animationTemplates.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'at_1', name: 'AT 1' });
		const result = await endpoints.animationTemplates.get(mockCtx, {
			uid: 'at_1',
		});
		expectRequest('GET', '/v5/animation_templates/at_1');
		expect(result.uid).toBe('at_1');
	});

	it('invokes animationTemplates.create', async () => {
		mockRequest.mockResolvedValue({ uid: 'at_new', name: 'New AT' });
		const result = await endpoints.animationTemplates.create(mockCtx, {
			name: 'New AT',
		});
		expectRequest('POST', '/v5/animation_templates', {
			body: { name: 'New AT' },
		});
		expect(result.uid).toBe('at_new');
	});

	it('invokes instantUrls.list', async () => {
		mockRequest.mockResolvedValue([
			{ uid: 'iu_1', base_url: 'https://on-demand.bannerbear.com/x' },
		]);
		const result = await endpoints.instantUrls.list(mockCtx, {});
		expectRequest('GET', '/v5/instant_urls');
		expect(result).toHaveLength(1);
	});

	it('invokes instantUrls.create', async () => {
		mockRequest.mockResolvedValue({
			uid: 'iu_new',
			name: 'Share',
			template: 'tmpl_1',
			base_url: 'https://on-demand.bannerbear.com/x',
		});
		const result = await endpoints.instantUrls.create(mockCtx, {
			name: 'Share',
			template: 'tmpl_1',
		});
		expectRequest('POST', '/v5/instant_urls', {
			body: { name: 'Share', template: 'tmpl_1' },
		});
		expect(result.base_url).toBeDefined();
	});

	it('invokes webhooksApi.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'wh_1', url: 'https://app.com/hook' });
		const result = await endpoints.webhooksApi.get(mockCtx, { uid: 'wh_1' });
		expectRequest('GET', '/v5/webhooks/wh_1');
		expect(result.uid).toBe('wh_1');
	});

	it('invokes webhooksApi.create with required name', async () => {
		mockRequest.mockResolvedValue({
			uid: 'wh_new',
			name: 'Image notifications',
			url: 'https://app.com/hook',
			signing_key: 'whsec_abc',
		});
		const result = await endpoints.webhooksApi.create(mockCtx, {
			name: 'Image notifications',
			url: 'https://app.com/hook',
			resource: 'image',
			event: 'completed',
		});
		expectRequest('POST', '/v5/webhooks', {
			body: {
				name: 'Image notifications',
				url: 'https://app.com/hook',
				resource: 'image',
				event: 'completed',
			},
		});
		expect(result.uid).toBe('wh_new');
	});

	it('invokes webhooksApi.delete', async () => {
		mockRequest.mockResolvedValue(undefined);
		const result = await endpoints.webhooksApi.delete(mockCtx, { uid: 'wh_1' });
		expectRequest('DELETE', '/v5/webhooks/wh_1');
		expect(result).toEqual({ success: true });
	});

	it('invokes misc.joinPdfs', async () => {
		mockRequest.mockResolvedValue({
			uid: 'pdf_1',
			status: 'completed',
			joined_pdf_url: 'https://cdn.com/doc.pdf',
		});
		const result = await endpoints.misc.joinPdfs(mockCtx, {
			urls: ['https://cdn.com/1.pdf', 'https://cdn.com/2.pdf'],
		});
		expectRequest('POST', '/v5/tools/create_pdf', {
			body: {
				urls: ['https://cdn.com/1.pdf', 'https://cdn.com/2.pdf'],
			},
		});
		expect(result.joined_pdf_url).toBeDefined();
	});

	it('invokes workflows.listWorkflows', async () => {
		mockRequest.mockResolvedValue([{ uid: 'wf_1', name: 'Workflow 1' }]);
		const result = await endpoints.workflows.listWorkflows(mockCtx, {
			page: 1,
		});
		expectRequest('GET', '/v5/workflows', { query: { page: 1 } });
		expect(result).toHaveLength(1);
	});

	it('invokes workflows.getWorkflow', async () => {
		mockRequest.mockResolvedValue({ uid: 'wf_1', name: 'Workflow 1' });
		const result = await endpoints.workflows.getWorkflow(mockCtx, {
			uid: 'wf_1',
		});
		expectRequest('GET', '/v5/workflows/wf_1');
		expect(result.name).toBe('Workflow 1');
	});

	it('invokes workflows.createWorkflowRun', async () => {
		mockRequest.mockResolvedValue({
			uid: 'wfr_1',
			status: 'running',
			workflow: 'wf_1',
		});
		const result = await endpoints.workflows.createWorkflowRun(mockCtx, {
			workflow: 'wf_1',
			inputs: { title: 'Test' },
		});
		expectRequest('POST', '/v5/workflow_runs', {
			body: { workflow: 'wf_1', inputs: { title: 'Test' } },
		});
		expect(result.uid).toBe('wfr_1');
	});

	it('invokes workflows.getWorkflowRun', async () => {
		mockRequest.mockResolvedValue({
			uid: 'wfr_1',
			status: 'completed',
			workflow: 'wf_1',
		});
		const result = await endpoints.workflows.getWorkflowRun(mockCtx, {
			uid: 'wfr_1',
		});
		expectRequest('GET', '/v5/workflow_runs/wfr_1');
		expect(result.status).toBe('completed');
	});

	it('invokes workflows.listWorkflowRuns', async () => {
		mockRequest.mockResolvedValue([
			{ uid: 'wfr_1', status: 'completed', workflow: 'wf_1' },
		]);
		const result = await endpoints.workflows.listWorkflowRuns(mockCtx, {
			page: 1,
		});
		expectRequest('GET', '/v5/workflow_runs', { query: { page: 1 } });
		expect(result).toHaveLength(1);
	});
});
