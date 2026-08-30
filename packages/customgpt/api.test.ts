import * as CorsairCore from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as CorsairHttp from 'corsair/http';
import { ApiError } from 'corsair/http';
import { CustomGPTAPIError } from './client';
import {
	Conversations,
	Licenses,
	Limits,
	Messages,
	Pages,
	Personas,
	Projects,
	Reports,
	Settings,
	Sources,
	User,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { customgpt } from './index';

describe('CustomGPT Endpoint Handlers — All 40 Operations Request Mapping', () => {
	const requestSpy = jest.spyOn(CorsairHttp, 'request');
	const logSpy = jest
		.spyOn(CorsairCore, 'logEventFromContext')
		.mockImplementation(async () => undefined as any);

	const mockDb = {
		projects: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		pages: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		sources: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		conversations: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		messages: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		licenses: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		leads: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
	};

	const mockCtx = {
		key: 'test-api-key',
		db: mockDb,
		authType: 'api_key' as const,
		keys: {
			get_api_key: async () => 'test-api-key',
		},
	} as any;

	beforeEach(() => {
		requestSpy.mockReset();
		logSpy.mockReset();
		logSpy.mockResolvedValue(null as any);
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	// 1. Projects (8 ops)
	it('1. invokes projects.list (listProjects) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { current_page: 1, data: [{ id: 1, project_name: 'P1' }] },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.list(mockCtx, { page: 2, order: 'asc' });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.customgpt.ai/api/v1',
				TOKEN: 'test-api-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/projects',
				query: { page: 2, order: 'asc' },
			}),
		);
		expect(mockDb.projects.upsertByEntityId).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({ id: 1 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.list',
			{ page: 2, order: 'asc' },
			'completed',
		);
	});

	it('2. invokes projects.get (getProject) correctly', async () => {
		const mockRes = { status: 'success', data: { id: 1, project_name: 'P1' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.get(mockCtx, { projectId: 1, width: '300' });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1',
				query: { width: '300', height: undefined },
			}),
		);
		expect(mockDb.projects.upsertByEntityId).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({ id: 1 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.get',
			{ projectId: 1, width: '300' },
			'completed',
		);
	});

	it('3. invokes projects.create (createProject) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 2, project_name: 'New Project' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.create(mockCtx, {
			project_name: 'New Project',
			sitemap_path: 'https://example.com/sitemap.xml',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects',
				formData: expect.objectContaining({ project_name: 'New Project' }),
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.create',
			{
				project_name: 'New Project',
				sitemap_path: 'https://example.com/sitemap.xml',
			},
			'completed',
		);
	});

	it('4. invokes projects.update (updateProject) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 1, project_name: 'Updated' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.update(mockCtx, {
			projectId: 1,
			project_name: 'Updated',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1',
				formData: expect.objectContaining({ project_name: 'Updated' }),
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.update',
			{ projectId: 1, project_name: 'Updated' },
			'completed',
		);
	});

	it('5. invokes projects.delete (deleteProject) correctly', async () => {
		const mockRes = { status: 'success', data: { message: 'Deleted' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.delete(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'DELETE', url: '/projects/1' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.delete',
			{ projectId: 1 },
			'completed',
		);
	});

	it('6. invokes projects.clone (cloneProject) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 3, project_name: 'P1 (Copy)' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.clone(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'POST', url: '/projects/1/replicate' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.clone',
			{ projectId: 1 },
			'completed',
		);
	});

	it('7. invokes projects.stats (getStats) correctly', async () => {
		const mockRes = { status: 'success', data: { total_conversations: 10 } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.stats(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/stats' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.stats',
			{ projectId: 1 },
			'completed',
		);
	});

	it('8. invokes projects.plugins (getPlugins) correctly', async () => {
		const mockRes = { status: 'success', data: { plugins: [] } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Projects.plugins(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/actions' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.plugins',
			{ projectId: 1 },
			'completed',
		);
	});

	// 2. Pages (5 ops)
	it('9. invokes pages.list (listPages) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: {
				pages: {
					current_page: 1,
					data: [{ id: 10, page_url: 'https://doc.com' }],
				},
			},
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Pages.list(mockCtx, {
			projectId: 1,
			page: 1,
			crawl_status: 'ok',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/pages',
				query: { page: 1, crawl_status: 'ok' },
			}),
		);
		expect(mockDb.pages.upsertByEntityId).toHaveBeenCalledWith(
			'10',
			expect.objectContaining({ id: 10 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.pages.list',
			{ projectId: 1, page: 1, crawl_status: 'ok' },
			'completed',
		);
	});

	it('10. invokes pages.delete (deletePage) correctly', async () => {
		const mockRes = { status: 'success', data: { message: 'Page deleted' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Pages.delete(mockCtx, { projectId: 1, pageId: 10 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'DELETE',
				url: '/projects/1/pages/10',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.pages.delete',
			{ projectId: 1, pageId: 10 },
			'completed',
		);
	});

	it('11. invokes pages.reindex (reindexPage) correctly', async () => {
		const mockRes = { status: 'success', data: { message: 'Queued' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Pages.reindex(mockCtx, { projectId: 1, pageId: 10 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1/pages/10/reindex',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.pages.reindex',
			{ projectId: 1, pageId: 10 },
			'completed',
		);
	});

	it('12. invokes pages.getMetadata (getPageMetadata) correctly', async () => {
		const mockRes = { status: 'success', data: { title: 'Title' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Pages.getMetadata(mockCtx, { projectId: 1, pageId: 10 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/pages/10/metadata',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.pages.metadata.get',
			{ projectId: 1, pageId: 10 },
			'completed',
		);
	});

	it('13. invokes pages.updateMetadata (updatePageMetadata) correctly', async () => {
		const mockRes = { status: 'success', data: { title: 'New Title' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Pages.updateMetadata(mockCtx, {
			projectId: 1,
			pageId: 10,
			title: 'New Title',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/projects/1/pages/10/metadata',
				body: { title: 'New Title' },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.pages.metadata.update',
			{ projectId: 1, pageId: 10 },
			'completed',
		);
	});

	// 3. Sources (4 ops)
	it('14. invokes sources.list (listSources) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { sitemaps: [{ id: 5, type: 'sitemap' }] },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Sources.list(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/sources' }),
		);
		expect(mockDb.sources.upsertByEntityId).toHaveBeenCalledWith(
			'5',
			expect.objectContaining({ id: 5, project_id: 1 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.sources.list',
			{ projectId: 1 },
			'completed',
		);
	});

	it('15. invokes sources.add (addSource) correctly', async () => {
		const mockRes = { status: 'success', data: { id: 6, type: 'sitemap' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Sources.add(mockCtx, {
			projectId: 1,
			sitemap_path: 'https://example.com/sitemap.xml',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1/sources',
				formData: expect.objectContaining({
					sitemap_path: 'https://example.com/sitemap.xml',
				}),
			}),
		);
		expect(mockDb.sources.upsertByEntityId).toHaveBeenCalledWith(
			'6',
			expect.objectContaining({ id: 6, project_id: 1 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.sources.add',
			{ projectId: 1, sitemap_path: 'https://example.com/sitemap.xml' },
			'completed',
		);
	});

	it('16. invokes sources.update (updateSource) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 6, settings: { data_refresh_frequency: 'weekly' } },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Sources.update(mockCtx, {
			projectId: 1,
			sourceId: 6,
			data_refresh_frequency: 'weekly',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/projects/1/sources/6',
				body: { data_refresh_frequency: 'weekly' },
			}),
		);
		expect(mockDb.sources.upsertByEntityId).toHaveBeenCalledWith(
			'6',
			expect.objectContaining({ id: 6, project_id: 1 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.sources.update',
			{ projectId: 1, sourceId: 6 },
			'completed',
		);
	});

	it('17. invokes sources.delete (deleteSource) correctly', async () => {
		const mockRes = { status: 'success', data: { message: 'Source deleted' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Sources.delete(mockCtx, { projectId: 1, sourceId: 6 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'DELETE',
				url: '/projects/1/sources/6',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.sources.delete',
			{ projectId: 1, sourceId: 6 },
			'completed',
		);
	});

	// 4. Licenses (4 ops)
	it('18. invokes licenses.list (listProjectLicenses) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: [{ key: 'lic_1', name: 'Lic 1' }],
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Licenses.list(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/licenses' }),
		);
		expect(mockDb.licenses.upsertByEntityId).toHaveBeenCalledWith(
			'lic_1',
			expect.objectContaining({ key: 'lic_1' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.licenses.list',
			{ projectId: 1 },
			'completed',
		);
	});

	it('19. invokes licenses.get (getProjectLicense) correctly', async () => {
		const mockRes = {
			status: 'success',
			license: { key: 'lic_1', name: 'Lic 1' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Licenses.get(mockCtx, { projectId: 1, licenseId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/licenses/1' }),
		);
		expect(mockDb.licenses.upsertByEntityId).toHaveBeenCalledWith(
			'lic_1',
			expect.objectContaining({ key: 'lic_1' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.licenses.get',
			{ projectId: 1, licenseId: 1 },
			'completed',
		);
	});

	it('20. invokes licenses.update (updateProjectLicense) correctly', async () => {
		const mockRes = {
			status: 'success',
			license: { key: 'lic_1', name: 'Lic 1 Updated' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Licenses.update(mockCtx, {
			projectId: 1,
			licenseId: 1,
			name: 'Lic 1 Updated',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/projects/1/licenses/1',
				body: { name: 'Lic 1 Updated' },
			}),
		);
		expect(mockDb.licenses.upsertByEntityId).toHaveBeenCalledWith(
			'lic_1',
			expect.objectContaining({ key: 'lic_1' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.licenses.update',
			{ projectId: 1, licenseId: 1 },
			'completed',
		);
	});

	it('21. invokes licenses.delete (deleteProjectLicense) correctly', async () => {
		const mockRes = { status: 'success', data: { message: 'License deleted' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Licenses.delete(mockCtx, { projectId: 1, licenseId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'DELETE',
				url: '/projects/1/licenses/1',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.licenses.delete',
			{ projectId: 1, licenseId: 1 },
			'completed',
		);
	});

	// 5. Settings (2 ops)
	it('22. invokes settings.get (getProjectSettings) correctly', async () => {
		const mockRes = { status: 'success', data: { default_prompt: 'Hello' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Settings.get(mockCtx, { projectId: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/projects/1/settings' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.settings.get',
			{ projectId: 1 },
			'completed',
		);
	});

	it('23. invokes settings.update (updateProjectSettings) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { default_prompt: 'Updated prompt' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Settings.update(mockCtx, {
			projectId: 1,
			default_prompt: 'Updated prompt',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1/settings',
				formData: { default_prompt: 'Updated prompt' },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.settings.update',
			{ projectId: 1, fields: ['default_prompt'] },
			'completed',
		);
	});

	// 6. Personas (2 ops)
	it('24. invokes personas.list (listPersonas) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { current_page: 1, data: [{ id: 1, version: 1 }] },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Personas.list(mockCtx, { projectId: 1, page: 2 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/settings/personas',
				query: { page: 2 },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.personas.list',
			{ projectId: 1, page: 2 },
			'completed',
		);
	});

	it('25. invokes personas.activate (activatePersonaVersion) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { message: 'Persona activated' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Personas.activate(mockCtx, { projectId: 1, version: 2 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/projects/1/settings/persona-activate/2',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.personas.activate',
			{ projectId: 1, version: 2 },
			'completed',
		);
	});

	// 7. Conversations (1 op)
	it('26. invokes conversations.create (createConversation) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { session_id: 'sess_100', name: 'Chat 1' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Conversations.create(mockCtx, {
			projectId: 1,
			name: 'Chat 1',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1/conversations',
				body: { name: 'Chat 1' },
			}),
		);
		expect(mockDb.conversations.upsertByEntityId).toHaveBeenCalledWith(
			'sess_100',
			expect.objectContaining({ session_id: 'sess_100' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.conversations.create',
			{ projectId: 1, name: 'Chat 1' },
			'completed',
		);
	});

	// 8. Messages (5 ops)
	it('27. invokes messages.list (listConversationMessages) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: {
				conversation: { session_id: 'sess_100' },
				messages: { current_page: 1, data: [{ id: 50, user_query: 'Hello' }] },
			},
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Messages.list(mockCtx, {
			projectId: 1,
			sessionId: 'sess_100',
			page: 1,
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/conversations/sess_100/messages',
				query: { page: 1 },
			}),
		);
		expect(mockDb.conversations.upsertByEntityId).toHaveBeenCalledWith(
			'sess_100',
			expect.objectContaining({ session_id: 'sess_100' }),
		);
		expect(mockDb.messages.upsertByEntityId).toHaveBeenCalledWith(
			'50',
			expect.objectContaining({ id: 50 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.list',
			{ projectId: 1, sessionId: 'sess_100', page: 1 },
			'completed',
		);
	});

	it('28. invokes messages.get (getMessage) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 50, user_query: 'Hello', openai_response: 'Hi' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Messages.get(mockCtx, {
			projectId: 1,
			sessionId: 'sess_100',
			promptId: 50,
			includeInsights: true,
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/conversations/sess_100/messages/50',
				query: { includeInsights: true },
			}),
		);
		expect(mockDb.messages.upsertByEntityId).toHaveBeenCalledWith(
			'50',
			expect.objectContaining({ id: 50 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.get',
			{
				projectId: 1,
				sessionId: 'sess_100',
				promptId: 50,
				includeInsights: true,
			},
			'completed',
		);
	});

	it('29. invokes messages.getTrustScore (getMessageTrustScore) correctly', async () => {
		const mockRes = { status: 'success', data: { trust_score: 90 } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Messages.getTrustScore(mockCtx, {
			projectId: 1,
			sessionId: 'sess_100',
			promptId: 50,
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/conversations/sess_100/messages/50/trust-score',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.trust-score',
			{ projectId: 1, sessionId: 'sess_100', promptId: 50 },
			'completed',
		);
	});

	it('30. invokes messages.verify (verifyMessage) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { message: 'Verified', claims: [] },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Messages.verify(mockCtx, {
			projectId: 1,
			sessionId: 'sess_100',
			promptId: 50,
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/projects/1/conversations/sess_100/messages/50/verify',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.verify',
			{ projectId: 1, sessionId: 'sess_100', promptId: 50 },
			'completed',
		);
	});

	it('31. invokes messages.submitFeedback (submitMessageFeedback) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 50, response_feedback: { reaction: 'liked' } },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Messages.submitFeedback(mockCtx, {
			projectId: 1,
			sessionId: 'sess_100',
			promptId: 50,
			reaction: 'liked',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: '/projects/1/conversations/sess_100/messages/50/feedback',
				body: { reaction: 'liked' },
			}),
		);
		expect(mockDb.messages.upsertByEntityId).toHaveBeenCalledWith(
			'50',
			expect.objectContaining({ id: 50 }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.feedback',
			{ projectId: 1, sessionId: 'sess_100', promptId: 50, reaction: 'liked' },
			'completed',
		);
	});

	// 9. Reports (5 ops)
	it('32. invokes reports.getAnalysis (getReportAnalysis) correctly', async () => {
		const mockRes = { status: 'success', data: { chart: [] } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Reports.getAnalysis(mockCtx, {
			projectId: 1,
			filters: ['queries'],
			interval: 'daily',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/reports/analysis',
				query: { filters: ['queries'], interval: 'daily' },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.reports.analysis',
			{ projectId: 1, filters: ['queries'], interval: 'daily' },
			'completed',
		);
	});

	it('33. invokes reports.getConversations (getReportConversations) correctly', async () => {
		const mockRes = { status: 'success', data: { total_conversations: 50 } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Reports.getConversations(mockCtx, {
			projectId: 1,
			filters: ['total'],
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/reports/conversations',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.reports.conversations',
			{ projectId: 1, filters: ['total'] },
			'completed',
		);
	});

	it('34. invokes reports.getTraffic (getReportTraffic) correctly', async () => {
		const mockRes = { status: 'success', data: { unique_visitors: 120 } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Reports.getTraffic(mockCtx, {
			projectId: 1,
			filters: ['sources'],
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/reports/traffic',
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.reports.traffic',
			{ projectId: 1, filters: ['sources'] },
			'completed',
		);
	});

	it('35. invokes reports.getIntelligence (getReportIntelligence) correctly', async () => {
		const mockRes = { status: 'success', data: { insights: [] } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Reports.getIntelligence(mockCtx, {
			projectId: 1,
			page: 1,
			limit: 20,
			user_emotion: ['positive'],
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/reports/intelligence',
				query: expect.objectContaining({
					page: 1,
					limit: 20,
					'user_emotion[]': ['positive'],
				}),
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.reports.intelligence',
			{ projectId: 1, page: 1, limit: 20 },
			'completed',
		);
	});

	it('36. invokes reports.exportLeads (exportLeads) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: {
				data: [{ session_id: 'sess_100', query_id: 2, email: 'lead@test.com' }],
			},
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Reports.exportLeads(mockCtx, { projectId: 1, page: 1 });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/projects/1/reports/leads',
				query: {
					page: 1,
					limit: undefined,
					start_date: undefined,
					end_date: undefined,
					session_id: undefined,
				},
			}),
		);
		expect(mockDb.leads.upsertByEntityId).toHaveBeenCalledWith(
			'sess_100:2',
			expect.objectContaining({ id: 'sess_100:2', email: 'lead@test.com' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.reports.leads',
			{ projectId: 1, page: 1, limit: undefined },
			'completed',
		);
	});

	// 10. Limits (1 op)
	it('37. invokes limits.getUsage (getUsageLimits) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { projects: { current: 2, max: 10 } },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await Limits.getUsage(mockCtx, {});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/limits/usage' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.limits.usage',
			{},
			'completed',
		);
	});

	// 11. User (3 ops)
	it('38. invokes user.getProfile (getUserProfile) correctly', async () => {
		const mockRes = { status: 'success', data: { id: 1, name: 'Alice' } };
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await User.getProfile(mockCtx, {});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: '/user' }),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.user.get',
			{},
			'completed',
		);
	});

	it('39. invokes user.updateProfile (updateUserProfile) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 1, name: 'Alice Updated' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await User.updateProfile(mockCtx, { name: 'Alice Updated' });
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/user',
				formData: { name: 'Alice Updated' },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.user.update',
			{ updated_name: true },
			'completed',
		);
	});

	it('40. invokes user.searchTeamMembers (searchTeamMembers) correctly', async () => {
		const mockRes = {
			status: 'success',
			data: { id: 2, name: 'Bob', email: 'bob@example.com' },
		};
		requestSpy.mockResolvedValueOnce(mockRes);

		const res = await User.searchTeamMembers(mockCtx, {
			email: 'bob@example.com',
		});
		expect(res).toEqual(mockRes);
		expect(requestSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/user/search-team-member',
				query: { email: 'bob@example.com', user_id: undefined },
			}),
		);
		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.user.search-team-member',
			{ by: 'email' },
			'completed',
		);
	});
});

describe('CustomGPT Error Handlers', () => {
	it('handles rate limit 429 errors and specifies retries and retryAfter', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				body: 'rate limit',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'rate limit',
		);
		Object.defineProperty(apiError, 'retryAfter', {
			value: 2000,
			writable: true,
		});

		const wrappedError = new CustomGPTAPIError('rate limit', 429, {
			cause: apiError,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrappedError)).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(true);

		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(wrappedError);
		expect(res.maxRetries).toBe(3);
		expect(res.headersRetryAfterMs).toBe(2000);
	});

	it('handles 401 unauthorized errors with 0 retries', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 401,
				statusText: 'Unauthorized',
				ok: false,
				body: 'unauthorized',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'unauthorized',
		);
		const wrappedError = new CustomGPTAPIError('unauthorized', 401, {
			cause: apiError,
		});

		expect(errorHandlers.AUTH_ERROR.match(apiError)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(wrappedError)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'))).toBe(
			true,
		);

		const res = await errorHandlers.AUTH_ERROR.handler(wrappedError);
		expect(res.maxRetries).toBe(0);
	});

	it('handles 403 permission errors with 0 retries', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 403,
				statusText: 'Forbidden',
				ok: false,
				body: 'forbidden',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'forbidden',
		);
		expect(errorHandlers.PERMISSION_ERROR.match(apiError)).toBe(true);
		const res = await errorHandlers.PERMISSION_ERROR.handler(apiError);
		expect(res.maxRetries).toBe(0);
	});

	it('handles 404 not found errors with 0 retries', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 404,
				statusText: 'Not Found',
				ok: false,
				body: 'not found',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'not found',
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError)).toBe(true);
		const res = await errorHandlers.NOT_FOUND_ERROR.handler(apiError);
		expect(res.maxRetries).toBe(0);
	});

	it('handles 400 bad request errors with 0 retries', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: '/projects' },
			{
				status: 400,
				statusText: 'Bad Request',
				ok: false,
				body: 'invalid input',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'invalid input',
		);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError)).toBe(true);
		const res = await errorHandlers.BAD_REQUEST_ERROR.handler(apiError);
		expect(res.maxRetries).toBe(0);
	});

	it('handles 500 server errors with retries', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 500,
				statusText: 'Server Error',
				ok: false,
				body: 'server error',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'server error',
		);
		expect(errorHandlers.SERVER_ERROR.match(apiError)).toBe(true);
		const res = await errorHandlers.SERVER_ERROR.handler(apiError);
		expect(res.maxRetries).toBe(2);
	});

	it('handles default fallback with 0 retries', async () => {
		expect(errorHandlers.DEFAULT.match(new Error('other'))).toBe(true);
		const res = await errorHandlers.DEFAULT.handler(new Error('other'));
		expect(res.maxRetries).toBe(0);
	});
});

describe('CustomGPT Plugin Instance & KeyBuilder', () => {
	it('initializes customgpt plugin with default options', () => {
		const instance = customgpt({ key: 'customgpt_test_key' });
		expect(instance.id).toBe('customgpt');
		expect(instance.schema).toBeDefined();
		expect(instance.endpoints).toBeDefined();
		expect(Object.keys(instance.endpoints ?? {}).length).toBe(11);
	});

	it('resolves key from options via keyBuilder', async () => {
		const instance = customgpt({ key: 'customgpt_option_key' });
		const key = await (instance.keyBuilder as any)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(key).toBe('customgpt_option_key');
	});

	it('resolves key from context keys via keyBuilder', async () => {
		const instance = customgpt();
		const key = await (instance.keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'ctx_key_123' },
			},
			'endpoint',
		);
		expect(key).toBe('ctx_key_123');
	});

	it('throws AuthMissingError when key is not provided', async () => {
		const instance = customgpt();
		await expect(
			(instance.keyBuilder as any)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				},
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});
