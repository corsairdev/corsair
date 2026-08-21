import { request } from 'corsair/http';
import {
	Domains,
	Forms,
	FormViews,
	Projects,
	Submissions,
	Webhooks,
} from '../endpoints';
import type { BasinContext } from '../index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Basin API Endpoints', () => {
	let mockCtx: BasinContext;
	let mockDbFormsUpsert: jest.Mock;
	let mockDbFormsDelete: jest.Mock;
	let mockDbSubmissionsUpsert: jest.Mock;
	let mockDbSubmissionsDelete: jest.Mock;
	let mockDbProjectsUpsert: jest.Mock;
	let mockDbProjectsDelete: jest.Mock;
	let mockDbWebhooksUpsert: jest.Mock;
	let mockDbWebhooksDelete: jest.Mock;
	let mockDbDomainsUpsert: jest.Mock;
	let mockDbFormViewsUpsert: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockDbFormsUpsert = jest.fn();
		mockDbFormsDelete = jest.fn();
		mockDbSubmissionsUpsert = jest.fn();
		mockDbSubmissionsDelete = jest.fn();
		mockDbProjectsUpsert = jest.fn();
		mockDbProjectsDelete = jest.fn();
		mockDbWebhooksUpsert = jest.fn();
		mockDbWebhooksDelete = jest.fn();
		mockDbDomainsUpsert = jest.fn();
		mockDbFormViewsUpsert = jest.fn();

		mockCtx = {
			key: 'test-api-key',
			authType: 'api_key',
			$getAccountId: jest.fn().mockResolvedValue('acc_123'),
			database: {
				db: {
					insertInto: jest.fn().mockReturnValue({
						values: jest.fn().mockReturnValue({
							execute: jest.fn().mockResolvedValue({}),
						}),
					}),
				},
			} as unknown as BasinContext['database'],
			db: {
				forms: {
					upsertByEntityId: mockDbFormsUpsert,
					deleteByEntityId: mockDbFormsDelete,
				},
				submissions: {
					upsertByEntityId: mockDbSubmissionsUpsert,
					deleteByEntityId: mockDbSubmissionsDelete,
				},
				projects: {
					upsertByEntityId: mockDbProjectsUpsert,
					deleteByEntityId: mockDbProjectsDelete,
				},
				webhooks: {
					upsertByEntityId: mockDbWebhooksUpsert,
					deleteByEntityId: mockDbWebhooksDelete,
				},
				domains: {
					upsertByEntityId: mockDbDomainsUpsert,
				},
				formViews: {
					upsertByEntityId: mockDbFormViewsUpsert,
				},
			},
			logger: {
				info: jest.fn(),
				error: jest.fn(),
				warn: jest.fn(),
				debug: jest.fn(),
			},
		} as unknown as BasinContext;
	});

	// ─────────────────────────────────────────────────────────────────────────────
	// 1. Forms (5 operations)
	// ─────────────────────────────────────────────────────────────────────────────
	describe('Forms', () => {
		it('forms.create creates a form and upserts to db', async () => {
			const mockForm = { id: 'form_123', name: 'Contact Us', use_ajax: true };
			mockRequest.mockResolvedValueOnce(mockForm);

			const result = await Forms.create(mockCtx, {
				name: 'Contact Us',
				use_ajax: true,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: 'forms',
					body: { name: 'Contact Us', use_ajax: true },
				}),
			);
			expect(result).toEqual(mockForm);
			expect(mockDbFormsUpsert).toHaveBeenCalledWith(
				'form_123',
				expect.objectContaining({ id: 'form_123', name: 'Contact Us' }),
			);
		});

		it('forms.list lists forms with query params and upserts to db', async () => {
			const mockForms = [
				{ id: 'form_1', name: 'Form 1' },
				{ id: 'form_2', name: 'Form 2' },
			];
			mockRequest.mockResolvedValueOnce(mockForms);

			const result = await Forms.list(mockCtx, { page: 1, query: 'test' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'forms',
					query: { page: 1, query: 'test' },
				}),
			);
			expect(result).toEqual(mockForms);
			expect(mockDbFormsUpsert).toHaveBeenCalledTimes(2);
		});

		it('forms.get retrieves a form by ID and upserts to db', async () => {
			const mockForm = { id: 'form_123', name: 'Details Form' };
			mockRequest.mockResolvedValueOnce(mockForm);

			const result = await Forms.get(mockCtx, { id: 'form_123' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'forms/form_123',
				}),
			);
			expect(result).toEqual(mockForm);
			expect(mockDbFormsUpsert).toHaveBeenCalledWith(
				'form_123',
				expect.anything(),
			);
		});

		it('forms.update updates a form and upserts to db', async () => {
			const mockForm = { id: 'form_123', name: 'Updated Name' };
			mockRequest.mockResolvedValueOnce(mockForm);

			const result = await Forms.update(mockCtx, {
				id: 'form_123',
				name: 'Updated Name',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PUT',
					url: 'forms/form_123',
					body: { name: 'Updated Name' },
				}),
			);
			expect(result).toEqual(mockForm);
			expect(mockDbFormsUpsert).toHaveBeenCalledWith(
				'form_123',
				expect.anything(),
			);
		});

		it('forms.delete deletes a form and removes from db', async () => {
			mockRequest.mockResolvedValueOnce({ success: true, id: 'form_123' });

			const result = await Forms.delete(mockCtx, { id: 'form_123' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'DELETE',
					url: 'forms/form_123',
				}),
			);
			expect(result).toEqual({ success: true, id: 'form_123' });
			expect(mockDbFormsDelete).toHaveBeenCalledWith('form_123');
		});
	});

	// ─────────────────────────────────────────────────────────────────────────────
	// 2. Submissions (2 operations)
	// ─────────────────────────────────────────────────────────────────────────────
	describe('Submissions', () => {
		it('submissions.list lists submissions with query filters and upserts to db', async () => {
			const mockSubmissions = [
				{ id: 101, email: 'a@example.com', form_id: 'form_1' },
				{ id: 102, email: 'b@example.com', form_id: 'form_1' },
			];
			mockRequest.mockResolvedValueOnce(mockSubmissions);

			const result = await Submissions.list(mockCtx, {
				form_id: 'form_1',
				filter_by: 'new',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'submissions',
					query: { form_id: 'form_1', filter_by: 'new' },
				}),
			);
			expect(result).toEqual(mockSubmissions);
			expect(mockDbSubmissionsUpsert).toHaveBeenCalledTimes(2);
		});

		it('submissions.delete destroys submission and removes from db', async () => {
			mockRequest.mockResolvedValueOnce({ success: true, id: 101 });

			const result = await Submissions.delete(mockCtx, { id: 101 });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'DELETE',
					url: 'submissions/101',
				}),
			);
			expect(result).toEqual({ success: true, id: 101 });
			expect(mockDbSubmissionsDelete).toHaveBeenCalledWith('101');
		});
	});

	// ─────────────────────────────────────────────────────────────────────────────
	// 3. Projects (5 operations)
	// ─────────────────────────────────────────────────────────────────────────────
	describe('Projects', () => {
		it('projects.create creates a project and upserts to db', async () => {
			const mockProject = { id: 'proj_1', name: 'Main Site' };
			mockRequest.mockResolvedValueOnce(mockProject);

			const result = await Projects.create(mockCtx, { name: 'Main Site' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: 'projects',
					body: { name: 'Main Site' },
				}),
			);
			expect(result).toEqual(mockProject);
			expect(mockDbProjectsUpsert).toHaveBeenCalledWith(
				'proj_1',
				expect.anything(),
			);
		});

		it('projects.list lists projects and upserts to db', async () => {
			const mockProjects = [{ id: 'proj_1', name: 'P1' }];
			mockRequest.mockResolvedValueOnce(mockProjects);

			const result = await Projects.list(mockCtx, { page: 1 });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'projects',
					query: { page: 1 },
				}),
			);
			expect(result).toEqual(mockProjects);
			expect(mockDbProjectsUpsert).toHaveBeenCalledTimes(1);
		});

		it('projects.get retrieves project details and upserts to db', async () => {
			const mockProject = { id: 'proj_1', name: 'P1' };
			mockRequest.mockResolvedValueOnce(mockProject);

			const result = await Projects.get(mockCtx, { id: 'proj_1' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/proj_1',
				}),
			);
			expect(result).toEqual(mockProject);
			expect(mockDbProjectsUpsert).toHaveBeenCalledWith(
				'proj_1',
				expect.anything(),
			);
		});

		it('projects.update updates project and upserts to db', async () => {
			const mockProject = { id: 'proj_1', name: 'Updated Project' };
			mockRequest.mockResolvedValueOnce(mockProject);

			const result = await Projects.update(mockCtx, {
				id: 'proj_1',
				name: 'Updated Project',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PUT',
					url: 'projects/proj_1',
					body: { name: 'Updated Project' },
				}),
			);
			expect(result).toEqual(mockProject);
			expect(mockDbProjectsUpsert).toHaveBeenCalledWith(
				'proj_1',
				expect.anything(),
			);
		});

		it('projects.delete deletes a project and removes from db', async () => {
			mockRequest.mockResolvedValueOnce({ success: true, id: 'proj_1' });

			const result = await Projects.delete(mockCtx, { id: 'proj_1' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'DELETE',
					url: 'projects/proj_1',
				}),
			);
			expect(result).toEqual({ success: true, id: 'proj_1' });
			expect(mockDbProjectsDelete).toHaveBeenCalledWith('proj_1');
		});
	});

	// ─────────────────────────────────────────────────────────────────────────────
	// 4. Webhooks (6 operations)
	// ─────────────────────────────────────────────────────────────────────────────
	describe('Webhooks', () => {
		it('webhooks.create creates a form webhook and upserts to db', async () => {
			const mockWebhook = {
				id: 'wh_1',
				form_id: 'form_1',
				url: 'https://example.com/webhook',
				enabled: true,
			};
			mockRequest.mockResolvedValueOnce(mockWebhook);

			const result = await Webhooks.create(mockCtx, {
				form_id: 'form_1',
				url: 'https://example.com/webhook',
				enabled: true,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: 'form_webhooks',
					body: {
						form_id: 'form_1',
						url: 'https://example.com/webhook',
						enabled: true,
					},
				}),
			);
			expect(result).toEqual(mockWebhook);
			expect(mockDbWebhooksUpsert).toHaveBeenCalledWith(
				'wh_1',
				expect.anything(),
			);
		});

		it('webhooks.listForForm lists webhooks for specific form and upserts to db', async () => {
			const mockWebhooks = [
				{ id: 'wh_1', form_id: 'form_1', url: 'https://example.com/1' },
			];
			mockRequest.mockResolvedValueOnce(mockWebhooks);

			const result = await Webhooks.listForForm(mockCtx, { form_id: 'form_1' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'form_webhooks',
					query: { query: 'form_1' },
				}),
			);
			expect(result).toEqual(mockWebhooks);
			expect(mockDbWebhooksUpsert).toHaveBeenCalledWith(
				'wh_1',
				expect.anything(),
			);
		});

		it('webhooks.get retrieves webhook details and upserts to db', async () => {
			const mockWebhook = { id: 'wh_1', url: 'https://example.com/1' };
			mockRequest.mockResolvedValueOnce(mockWebhook);

			const result = await Webhooks.get(mockCtx, { id: 'wh_1' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'form_webhooks/wh_1',
				}),
			);
			expect(result).toEqual(mockWebhook);
			expect(mockDbWebhooksUpsert).toHaveBeenCalledWith(
				'wh_1',
				expect.anything(),
			);
		});

		it('webhooks.list lists all form webhooks across account', async () => {
			const mockWebhooks = [{ id: 'wh_1' }, { id: 'wh_2' }];
			mockRequest.mockResolvedValueOnce(mockWebhooks);

			const result = await Webhooks.list(mockCtx, { page: 1 });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'form_webhooks',
					query: { page: 1 },
				}),
			);
			expect(result).toEqual(mockWebhooks);
			expect(mockDbWebhooksUpsert).toHaveBeenCalledTimes(2);
		});

		it('webhooks.update updates webhook settings and upserts to db', async () => {
			const mockWebhook = { id: 'wh_1', url: 'https://example.com/new-url' };
			mockRequest.mockResolvedValueOnce(mockWebhook);

			const result = await Webhooks.update(mockCtx, {
				id: 'wh_1',
				url: 'https://example.com/new-url',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PUT',
					url: 'form_webhooks/wh_1',
					body: { url: 'https://example.com/new-url' },
				}),
			);
			expect(result).toEqual(mockWebhook);
			expect(mockDbWebhooksUpsert).toHaveBeenCalledWith(
				'wh_1',
				expect.anything(),
			);
		});

		it('webhooks.delete deletes a webhook and removes from db', async () => {
			mockRequest.mockResolvedValueOnce({ success: true, id: 'wh_1' });

			const result = await Webhooks.delete(mockCtx, { id: 'wh_1' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'DELETE',
					url: 'form_webhooks/wh_1',
				}),
			);
			expect(result).toEqual({ success: true, id: 'wh_1' });
			expect(mockDbWebhooksDelete).toHaveBeenCalledWith('wh_1');
		});
	});

	// ─────────────────────────────────────────────────────────────────────────────
	// 5. Form Views & Domains (2 operations)
	// ─────────────────────────────────────────────────────────────────────────────
	describe('Form Views & Domains', () => {
		it('formViews.list lists form views and upserts to db', async () => {
			const mockViews = [{ id: 'view_1', name: 'Custom View' }];
			mockRequest.mockResolvedValueOnce(mockViews);

			const result = await FormViews.list(mockCtx, {
				page: 1,
				query: 'custom',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'form_views',
					query: { page: 1, query: 'custom' },
				}),
			);
			expect(result).toEqual(mockViews);
			expect(mockDbFormViewsUpsert).toHaveBeenCalledWith(
				'view_1',
				expect.anything(),
			);
		});

		it('domains.list lists domains and upserts to db', async () => {
			const mockDomains = [{ id: 'dom_1', domain: 'mysite.com' }];
			mockRequest.mockResolvedValueOnce(mockDomains);

			const result = await Domains.list(mockCtx, { query: 'mysite' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'domains',
					query: { query: 'mysite' },
				}),
			);
			expect(result).toEqual(mockDomains);
			expect(mockDbDomainsUpsert).toHaveBeenCalledWith(
				'dom_1',
				expect.anything(),
			);
		});
	});
});
