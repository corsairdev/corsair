import { ApiError, request } from 'corsair/http';
import { makeBannerbearRequest } from './client';
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
	},
	logEvent: jest.fn(),
	database: {},
} as unknown as BannerbearContext;

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

	it('registers all 38 operations in the endpoint tree', () => {
		const paths = nestedPaths();
		expect(paths).toHaveLength(38);
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
});

describe('Bannerbear client error wrapping', () => {
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
			makeBannerbearRequest('/v5/images', 'test-key', { method: 'GET' }),
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
});

describe('Bannerbear endpoint handler invocations', () => {
	const plugin = bannerbear();
	const endpoints = plugin.endpoints!;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	// Account
	it('invokes account.getAccountInfo', async () => {
		mockRequest.mockResolvedValue({ uid: 'acc_1', plan: 'pro' });
		const result = await endpoints.account.getAccountInfo(mockCtx, {
			project_id: 'proj_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.bannerbear.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer bb_test_api_key_123',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/account',
				query: { project_id: 'proj_1' },
			}),
		);
		expect(result).toEqual({ uid: 'acc_1', plan: 'pro' });
	});

	it('invokes account.getAuth', async () => {
		mockRequest.mockResolvedValue({ uid: 'acc_1' });
		const result = await endpoints.account.getAuth(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/account',
			}),
		);
		expect(result).toEqual({ uid: 'acc_1' });
	});

	// Projects
	it('invokes projects.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'proj_1', name: 'Project 1' }]);
		const result = await endpoints.projects.list(mockCtx, { page: 2 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/projects',
				query: { page: 2 },
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes projects.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'proj_1', name: 'Project 1' });
		const result = await endpoints.projects.get(mockCtx, { uid: 'proj_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/projects/proj_1',
			}),
		);
		expect(result.name).toBe('Project 1');
	});

	it('invokes projects.create', async () => {
		mockRequest.mockResolvedValue({ uid: 'proj_new', name: 'New Project' });
		const result = await endpoints.projects.create(mockCtx, {
			name: 'New Project',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/projects',
				body: { name: 'New Project' },
			}),
		);
		expect(result.uid).toBe('proj_new');
	});

	it('invokes projects.hydrate', async () => {
		mockRequest.mockResolvedValue({ uid: 'proj_1', name: 'Hydrated' });
		const result = await endpoints.projects.hydrate(mockCtx, {
			uid: 'proj_1',
			source_project: 'src_proj',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/projects/proj_1/hydrate',
				body: { source_project: 'src_proj' },
			}),
		);
		expect(result.uid).toBe('proj_1');
	});

	// Templates
	it('invokes templates.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'tmpl_1', name: 'Template 1' }]);
		const result = await endpoints.templates.list(mockCtx, {
			page: 1,
			limit: 10,
			project_id: 'p1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/templates',
				query: { page: 1, limit: 10, project_id: 'p1' },
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes templates.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'tmpl_1', name: 'Template 1' });
		const result = await endpoints.templates.get(mockCtx, {
			uid: 'tmpl_1',
			project_id: 'p1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/templates/tmpl_1',
				query: { project_id: 'p1' },
			}),
		);
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
			project_id: 'p1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/templates',
				body: { name: 'T2', width: 1200, height: 630, project_id: 'p1' },
			}),
		);
		expect(result.width).toBe(1200);
	});

	it('invokes templates.delete', async () => {
		mockRequest.mockResolvedValue(undefined);
		const result = await endpoints.templates.delete(mockCtx, {
			uid: 'tmpl_1',
			project_id: 'p1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/v5/templates/tmpl_1',
				query: { project_id: 'p1' },
			}),
		);
		expect(result).toEqual({ success: true });
	});

	it('invokes templates.import', async () => {
		mockRequest.mockResolvedValue({ uid: 'tmpl_imp', name: 'Imported' });
		const result = await endpoints.templates.import(mockCtx, {
			publication_id: 'pub_123',
			project_id: 'p1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/templates/import',
				body: { publication_id: 'pub_123', project_id: 'p1' },
			}),
		);
		expect(result.uid).toBe('tmpl_imp');
	});

	// Template Sets
	it('invokes templateSets.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'ts_1', name: 'Set 1' }]);
		const result = await endpoints.templateSets.list(mockCtx, { page: 1 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/template_sets',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes templateSets.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'ts_1', name: 'Set 1' });
		const result = await endpoints.templateSets.get(mockCtx, { uid: 'ts_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/template_sets/ts_1',
			}),
		);
		expect(result.uid).toBe('ts_1');
	});

	it('invokes templateSets.create', async () => {
		mockRequest.mockResolvedValue({ uid: 'ts_new', name: 'Set New' });
		const result = await endpoints.templateSets.create(mockCtx, {
			name: 'Set New',
			templates: ['tmpl_1', 'tmpl_2'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/template_sets',
				body: { name: 'Set New', templates: ['tmpl_1', 'tmpl_2'] },
			}),
		);
		expect(result.uid).toBe('ts_new');
	});

	it('invokes templateSets.update', async () => {
		mockRequest.mockResolvedValue({ uid: 'ts_1', name: 'Set 1' });
		const result = await endpoints.templateSets.update(mockCtx, {
			uid: 'ts_1',
			templates: ['tmpl_3'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				url: '/v5/template_sets/ts_1',
				body: { templates: ['tmpl_3'] },
			}),
		);
		expect(result.uid).toBe('ts_1');
	});

	// Images
	it('invokes images.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'img_1', status: 'completed' }]);
		const result = await endpoints.images.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/images',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes images.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'img_1', status: 'completed' });
		const result = await endpoints.images.get(mockCtx, { uid: 'img_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/images/img_1',
			}),
		);
		expect(result.uid).toBe('img_1');
	});

	// Videos
	it('invokes videos.listVideos', async () => {
		mockRequest.mockResolvedValue([{ uid: 'vid_1', status: 'completed' }]);
		const result = await endpoints.videos.listVideos(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/videos',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes videos.listVideoTemplates', async () => {
		mockRequest.mockResolvedValue([{ uid: 'vt_1', name: 'VT 1' }]);
		const result = await endpoints.videos.listVideoTemplates(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/video_templates',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes videos.createVideoTemplate', async () => {
		mockRequest.mockResolvedValue({ uid: 'vt_new', name: 'New VT' });
		const result = await endpoints.videos.createVideoTemplate(mockCtx, {
			name: 'New VT',
			template: 'tmpl_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/video_templates',
				body: { name: 'New VT', template: 'tmpl_1' },
			}),
		);
		expect(result.uid).toBe('vt_new');
	});

	// Animations
	it('invokes animations.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'gif_1', status: 'completed' }]);
		const result = await endpoints.animations.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/animated_gifs',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes animations.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'gif_1', status: 'completed' });
		const result = await endpoints.animations.get(mockCtx, { uid: 'gif_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/animated_gifs/gif_1',
			}),
		);
		expect(result.uid).toBe('gif_1');
	});

	// Collections
	it('invokes collections.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'col_1', status: 'completed' }]);
		const result = await endpoints.collections.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/collections',
			}),
		);
		expect(result).toHaveLength(1);
	});

	// Screenshots
	it('invokes screenshots.list', async () => {
		mockRequest.mockResolvedValue([{ uid: 'ss_1', status: 'completed' }]);
		const result = await endpoints.screenshots.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/screenshots',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes screenshots.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'ss_1', status: 'completed' });
		const result = await endpoints.screenshots.get(mockCtx, { uid: 'ss_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/screenshots/ss_1',
			}),
		);
		expect(result.uid).toBe('ss_1');
	});

	// Signed URLs
	it('invokes signedUrls.getSignedBases', async () => {
		mockRequest.mockResolvedValue([
			{ base_url: 'https://on-demand.bannerbear.com/taggedurl/xxx' },
		]);
		const result = await endpoints.signedUrls.getSignedBases(mockCtx, {
			uid: 'tmpl_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/templates/tmpl_1/signed_bases',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes signedUrls.createSignedBase', async () => {
		mockRequest.mockResolvedValue({
			base_url: 'https://on-demand.bannerbear.com/taggedurl/xxx',
		});
		const result = await endpoints.signedUrls.createSignedBase(mockCtx, {
			uid: 'tmpl_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/templates/tmpl_1/signed_bases',
			}),
		);
		expect(result.base_url).toBeDefined();
	});

	// Webhooks API
	it('invokes webhooksApi.get', async () => {
		mockRequest.mockResolvedValue({ uid: 'wh_1', url: 'https://app.com/hook' });
		const result = await endpoints.webhooksApi.get(mockCtx, { uid: 'wh_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/webhooks/wh_1',
			}),
		);
		expect(result.uid).toBe('wh_1');
	});

	it('invokes webhooksApi.create', async () => {
		mockRequest.mockResolvedValue({
			uid: 'wh_new',
			url: 'https://app.com/hook',
		});
		const result = await endpoints.webhooksApi.create(mockCtx, {
			url: 'https://app.com/hook',
			event: 'image.completed',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/webhooks',
				body: { url: 'https://app.com/hook', event: 'image.completed' },
			}),
		);
		expect(result.uid).toBe('wh_new');
	});

	it('invokes webhooksApi.delete', async () => {
		mockRequest.mockResolvedValue(undefined);
		const result = await endpoints.webhooksApi.delete(mockCtx, { uid: 'wh_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/v5/webhooks/wh_1',
			}),
		);
		expect(result).toEqual({ success: true });
	});

	// Misc
	it('invokes misc.getFonts', async () => {
		mockRequest.mockResolvedValue([{ name: 'Roboto', family: 'sans-serif' }]);
		const result = await endpoints.misc.getFonts(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/fonts',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes misc.listEffects', async () => {
		mockRequest.mockResolvedValue([{ name: 'Blur', slug: 'blur' }]);
		const result = await endpoints.misc.listEffects(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/effects',
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes misc.joinPdfs', async () => {
		mockRequest.mockResolvedValue({
			uid: 'pdf_1',
			status: 'completed',
			joined_pdf_url: 'https://cdn.com/doc.pdf',
		});
		const result = await endpoints.misc.joinPdfs(mockCtx, {
			pdf_urls: ['https://cdn.com/1.pdf', 'https://cdn.com/2.pdf'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/pdfs',
				body: {
					pdf_urls: ['https://cdn.com/1.pdf', 'https://cdn.com/2.pdf'],
				},
			}),
		);
		expect(result.joined_pdf_url).toBeDefined();
	});

	// Workflows
	it('invokes workflows.listWorkflows', async () => {
		mockRequest.mockResolvedValue([{ uid: 'wf_1', name: 'Workflow 1' }]);
		const result = await endpoints.workflows.listWorkflows(mockCtx, {
			page: 1,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/workflows',
				query: { page: 1 },
			}),
		);
		expect(result).toHaveLength(1);
	});

	it('invokes workflows.getWorkflow', async () => {
		mockRequest.mockResolvedValue({ uid: 'wf_1', name: 'Workflow 1' });
		const result = await endpoints.workflows.getWorkflow(mockCtx, {
			uid: 'wf_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/workflows/wf_1',
			}),
		);
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
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v5/workflow_runs',
				body: { workflow: 'wf_1', inputs: { title: 'Test' } },
			}),
		);
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
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/workflow_runs/wfr_1',
			}),
		);
		expect(result.status).toBe('completed');
	});

	it('invokes workflows.listWorkflowRuns', async () => {
		mockRequest.mockResolvedValue([
			{ uid: 'wfr_1', status: 'completed', workflow: 'wf_1' },
		]);
		const result = await endpoints.workflows.listWorkflowRuns(mockCtx, {
			page: 1,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v5/workflow_runs',
				query: { page: 1 },
			}),
		);
	});
});
