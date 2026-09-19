import { makeBasinRequest } from '../client';
import {
	Domains,
	Forms,
	FormViews,
	Projects,
	Submissions,
	Webhooks,
} from '../endpoints';
import type { BasinContext } from '../index';
import { basin } from '../index';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return {
		...actual,
		makeBasinRequest: jest.fn(),
	};
});

const mockedMakeBasinRequest = makeBasinRequest as jest.MockedFunction<
	typeof makeBasinRequest
>;

const mockContext = {
	key: 'test-api-key',
	options: {},
	endpoints: {} as any,
	$getAccountId: jest.fn().mockResolvedValue('acc_123'),
} as unknown as BasinContext;

describe('Basin Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Forms endpoints', () => {
		it('forms.list sends GET request and parses response', async () => {
			const mockForms = [
				{
					id: 1,
					name: 'Contact Us',
					created_at: '2026-08-22T00:00:00Z',
				},
				{
					id: 2,
					name: 'Newsletter',
					created_at: '2026-08-22T00:00:00Z',
				},
			];
			mockedMakeBasinRequest.mockResolvedValueOnce({
				forms: mockForms,
				meta: { count: 2, page: 1, per_page: 100 },
			});

			const result = await Forms.list(mockContext, {
				page: 1,
				query: 'Contact',
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'forms',
				'test-api-key',
				{ method: 'GET', query: { page: 1, query: 'Contact' } },
			);
			expect(result.forms).toHaveLength(2);
			expect(result.forms[0]!.name).toBe('Contact Us');
			// Pagination metadata travels with every list response.
			expect(result.meta?.count).toBe(2);
		});

		it('forms.get sends GET request with form ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 10,
				name: 'Lead Gen',
				use_ajax: true,
			});

			const result = await Forms.get(mockContext, { id: 10 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'forms/10',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(result.id).toBe(10);
			expect(result.use_ajax).toBe(true);
		});

		it('forms.create sends POST request with form payload', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 15,
				name: 'New Form',
				project_id: 2,
			});

			const result = await Forms.create(mockContext, {
				name: 'New Form',
				project_id: 2,
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'forms',
				'test-api-key',
				{
					method: 'POST',
					body: { form: { name: 'New Form', project_id: 2 } },
				},
			);
			expect(result.id).toBe(15);
		});

		it('forms.update sends PUT request with updated payload', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 15,
				name: 'Renamed Form',
			});

			const result = await Forms.update(mockContext, {
				id: 15,
				name: 'Renamed Form',
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'forms/15',
				'test-api-key',
				{
					method: 'PUT',
					body: { form: { name: 'Renamed Form' } },
				},
			);
			expect(result.name).toBe('Renamed Form');
		});

		it('forms.delete sends DELETE request with ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({ success: true });

			const result = await Forms.delete(mockContext, { id: 15 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'forms/15',
				'test-api-key',
				{ method: 'DELETE' },
			);
			expect(result).toEqual({ success: true });
		});
	});

	describe('Submissions endpoints', () => {
		it('submissions.list sends GET request with filters', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				submissions: [
					{
						id: 101,
						email: 'john@example.com',
						spam: false,
					},
				],
				// The submissions list carries extra counters alongside the
				// standard pagination fields.
				meta: {
					count: 1,
					page: 1,
					per_page: 100,
					inbox_count: 1,
					spam_count: 0,
					trash_count: 0,
				},
			});

			const result = await Submissions.list(mockContext, {
				form_id: 10,
				filter_by: 'new',
				page: 1,
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions',
				'test-api-key',
				{
					method: 'GET',
					query: { form_id: 10, filter_by: 'new', page: 1 },
				},
			);
			expect(result.submissions).toHaveLength(1);
			expect(result.submissions[0]!.email).toBe('john@example.com');
			// The submissions list adds its own counters to meta.
			expect(result.meta?.inbox_count).toBe(1);
		});

		it('submissions.get sends GET request with submission ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 101,
				email: 'john@example.com',
				spam: false,
			});

			const result = await Submissions.get(mockContext, { id: 101 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(result.id).toBe(101);
		});

		it('submissions.delete sends DELETE request', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({ success: true });

			const result = await Submissions.delete(mockContext, { id: 101 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101',
				'test-api-key',
				{ method: 'DELETE' },
			);
			expect(result).toEqual({ success: true });
		});

		it('submissions.update sends PATCH request', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 101,
				read: true,
			});

			const result = await Submissions.update(mockContext, {
				id: 101,
				read: true,
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101',
				'test-api-key',
				{
					method: 'PATCH',
					body: { submission: { read: true } },
				},
			);
			expect(result.id).toBe(101);
		});

		it('submissions.markSpam marks submission as spam', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 101,
				spam: true,
			});

			const result = await Submissions.markSpam(mockContext, { id: 101 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101',
				'test-api-key',
				{
					method: 'PATCH',
					body: { submission: { spam: true } },
				},
			);
			expect(result.spam).toBe(true);
		});

		it('submissions.markHam marks submission as ham', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 101,
				spam: false,
			});

			const result = await Submissions.markHam(mockContext, { id: 101 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101',
				'test-api-key',
				{
					method: 'PATCH',
					body: { submission: { spam: false } },
				},
			);
			expect(result.spam).toBe(false);
		});

		it('submissions.refireWebhooks sends POST to refire endpoint', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				success: true,
				message: 'Webhooks queued',
			});

			const result = await Submissions.refireWebhooks(mockContext, { id: 101 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/101/refire_webhooks',
				'test-api-key',
				{ method: 'POST' },
			);
			expect(result.success).toBe(true);
		});

		it('submissions.refireWebhooksBulk sends POST to bulk refire endpoint', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				success: true,
				message: 'Bulk webhooks queued',
			});

			const result = await Submissions.refireWebhooksBulk(mockContext, {
				submission_ids: [101, 102],
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'submissions/refire_webhooks',
				'test-api-key',
				{
					method: 'POST',
					body: { submission_ids: [101, 102] },
				},
			);
			expect(result.success).toBe(true);
		});
	});

	describe('Projects endpoints', () => {
		it('projects.list retrieves all projects', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				projects: [{ id: 1, name: 'Default Project' }],
				meta: { count: 1, page: 1, per_page: 100 },
			});

			const result = await Projects.list(mockContext, {});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'projects',
				'test-api-key',
				{ method: 'GET', query: {} },
			);
			expect(result.projects).toHaveLength(1);
			expect(result.projects[0]!.name).toBe('Default Project');
			expect(result.meta?.count).toBe(1);
		});

		it('projects.get retrieves a project by ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 1,
				name: 'Default Project',
			});

			const result = await Projects.get(mockContext, { id: 1 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'projects/1',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(result.id).toBe(1);
		});

		it('projects.create creates a new project', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 2,
				name: 'New Project',
			});

			const result = await Projects.create(mockContext, {
				name: 'New Project',
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'projects',
				'test-api-key',
				{ method: 'POST', body: { project: { name: 'New Project' } } },
			);
			expect(result.id).toBe(2);
		});

		it('projects.update updates project name', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 2,
				name: 'Updated Project',
			});

			const result = await Projects.update(mockContext, {
				id: 2,
				name: 'Updated Project',
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'projects/2',
				'test-api-key',
				{ method: 'PUT', body: { project: { name: 'Updated Project' } } },
			);
			expect(result.name).toBe('Updated Project');
		});

		it('projects.delete removes a project', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({ success: true });

			const result = await Projects.delete(mockContext, { id: 2 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'projects/2',
				'test-api-key',
				{ method: 'DELETE' },
			);
			expect(result).toEqual({ success: true });
		});
	});

	describe('Webhooks endpoints', () => {
		it('webhooks.list lists all form webhooks', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				form_webhooks: [
					{ id: 1, form_id: 10, url: 'https://webhook.site/test' },
				],
				meta: { count: 1, page: 1, per_page: 100 },
			});

			const result = await Webhooks.list(mockContext, {});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_webhooks',
				'test-api-key',
				{ method: 'GET', query: {} },
			);
			expect(result.form_webhooks).toHaveLength(1);
			expect(result.form_webhooks[0]!.url).toBe('https://webhook.site/test');
		});

		it('webhooks.get retrieves a webhook by ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 1,
				form_id: 10,
				url: 'https://webhook.site/test',
			});

			const result = await Webhooks.get(mockContext, { id: 1 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_webhooks/1',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(result.id).toBe(1);
		});

		it('webhooks.create creates a webhook', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 2,
				form_id: 10,
				name: 'Slack Hook',
				url: 'https://hooks.slack.com/services/xxx',
			});

			const result = await Webhooks.create(mockContext, {
				form_id: 10,
				name: 'Slack Hook',
				url: 'https://hooks.slack.com/services/xxx',
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_webhooks',
				'test-api-key',
				{
					method: 'POST',
					body: {
						form_webhook: {
							form_id: 10,
							name: 'Slack Hook',
							url: 'https://hooks.slack.com/services/xxx',
						},
					},
				},
			);
			expect(result.id).toBe(2);
		});

		it('webhooks.update updates a webhook', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 2,
				enabled: false,
			});

			const result = await Webhooks.update(mockContext, {
				id: 2,
				enabled: false,
			});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_webhooks/2',
				'test-api-key',
				{
					method: 'PUT',
					body: { form_webhook: { enabled: false } },
				},
			);
			expect(result.enabled).toBe(false);
		});

		it('webhooks.delete deletes a webhook', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({ success: true });

			const result = await Webhooks.delete(mockContext, { id: 2 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_webhooks/2',
				'test-api-key',
				{ method: 'DELETE' },
			);
			expect(result).toEqual({ success: true });
		});
	});

	describe('Form Views endpoints', () => {
		it('formViews.list lists form views', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				form_views: [{ id: 1, form_id: 10, status: 'published' }],
				meta: { count: 1, page: 1, per_page: 100 },
			});

			const result = await FormViews.list(mockContext, {});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_views',
				'test-api-key',
				{ method: 'GET', query: {} },
			);
			expect(result.form_views).toHaveLength(1);
			expect(result.form_views[0]!.status).toBe('published');
		});

		it('formViews.get retrieves a form view by ID', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				id: 1,
				form_id: 10,
				name: 'Embedded Form',
				status: 'published',
			});

			const result = await FormViews.get(mockContext, { id: 1 });

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'form_views/1',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(result.name).toBe('Embedded Form');
		});
	});

	describe('Custom Domains endpoints', () => {
		it('domains.list lists domains', async () => {
			mockedMakeBasinRequest.mockResolvedValueOnce({
				domains: [{ id: 1, name: 'forms.example.com' }],
				meta: { count: 1, page: 1, per_page: 100 },
			});

			const result = await Domains.list(mockContext, {});

			expect(mockedMakeBasinRequest).toHaveBeenCalledWith(
				'domains',
				'test-api-key',
				{ method: 'GET', query: {} },
			);
			expect(result.domains).toHaveLength(1);
			expect(result.domains[0]!.name).toBe('forms.example.com');
		});
	});

	describe('Input Validation', () => {
		it('forms.get throws on missing id and does not call API', async () => {
			await expect(Forms.get(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('forms.delete throws on missing id and does not call API', async () => {
			await expect(Forms.delete(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('submissions.get throws on missing id and does not call API', async () => {
			await expect(Submissions.get(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('submissions.delete throws on missing id and does not call API', async () => {
			await expect(
				Submissions.delete(mockContext, {} as any),
			).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('submissions.refireWebhooks throws on missing id and does not call API', async () => {
			await expect(
				Submissions.refireWebhooks(mockContext, {} as any),
			).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('submissions.refireWebhooksBulk throws on invalid submission_ids and does not call API', async () => {
			await expect(
				Submissions.refireWebhooksBulk(mockContext, {
					submission_ids: 'not-an-array' as any,
				}),
			).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('projects.get throws on missing id and does not call API', async () => {
			await expect(Projects.get(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('projects.delete throws on missing id and does not call API', async () => {
			await expect(Projects.delete(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('webhooks.get throws on missing id and does not call API', async () => {
			await expect(Webhooks.get(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('webhooks.delete throws on missing id and does not call API', async () => {
			await expect(Webhooks.delete(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});

		it('formViews.get throws on missing id and does not call API', async () => {
			await expect(FormViews.get(mockContext, {} as any)).rejects.toThrow();
			expect(mockedMakeBasinRequest).not.toHaveBeenCalled();
		});
	});

	describe('Plugin Factory & Config', () => {
		it('initializes basin plugin properly with endpoints and empty webhooks', () => {
			const plugin = basin({ key: 'test-key' }) as any;

			expect(plugin.id).toBe('basin');
			expect(plugin.endpoints).toBeDefined();
			expect(plugin.webhooks).toEqual({});
			expect(plugin.pluginWebhookMatcher({ headers: {} })).toBe(false);
			// Basin is REST-only, so it declares no tenant matcher at all rather
			// than a stub that always returns null. The field is optional.
			expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
		});

		it('keyBuilder resolves key from options or key manager', async () => {
			const plugin = basin({ key: 'explicit-key' }) as any;
			const resolved = await plugin.keyBuilder(
				{
					authType: 'api_key',
					options: { key: 'explicit-key' },
					keys: { get_api_key: jest.fn() },
					tenantId: 'default',
				},
				'endpoint',
			);
			expect(resolved).toBe('explicit-key');
		});

		it('keyBuilder calls get_api_key when option key is omitted', async () => {
			const plugin = basin({}) as any;
			const getApiKeyMock = jest.fn().mockResolvedValue('stored-api-key');
			const resolved = await plugin.keyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: getApiKeyMock },
					tenantId: 'default',
				},
				'endpoint',
			);
			expect(getApiKeyMock).toHaveBeenCalled();
			expect(resolved).toBe('stored-api-key');
		});

		it('keyBuilder throws AuthMissingError when no key is found', async () => {
			const plugin = basin({}) as any;
			const getApiKeyMock = jest.fn().mockResolvedValue(null);
			await expect(
				plugin.keyBuilder(
					{
						authType: 'api_key',
						options: {},
						keys: { get_api_key: getApiKeyMock },
						tenantId: 'default',
					},
					'endpoint',
				),
			).rejects.toThrow();
		});
	});
});
