import { makeBugherdRequest } from '../client';
import {
	AddGuestToProjectOutputSchema,
	AddMemberToProjectOutputSchema,
	CreateAttachmentOutputSchema,
	CreateColumnOutputSchema,
	CreateCommentOutputSchema,
	CreateProjectOutputSchema,
	CreateTaskOutputSchema,
	CreateWebhookOutputSchema,
	DeleteProjectOutputSchema,
	ListActiveProjectsOutputSchema,
	ListAttachmentsOutputSchema,
	ListColumnsOutputSchema,
	ListProjectsOutputSchema,
	ListUsersOutputSchema,
	ListWebhooksOutputSchema,
	ShowAttachmentOutputSchema,
	ShowColumnOutputSchema,
	ShowOrganizationOutputSchema,
	ShowProjectDetailsOutputSchema,
	ShowUserProjectsOutputSchema,
	ShowUserTasksOutputSchema,
	UpdateColumnOutputSchema,
	UpdateProjectOutputSchema,
	UpdateTaskOutputSchema,
	UploadAttachmentOutputSchema,
} from './types';

jest.mock('../client', () => ({
	makeBugherdRequest: jest.fn(),
	BugherdAPIError: class extends Error {
		constructor(message: string) {
			super(message);
			this.name = 'BugherdAPIError';
		}
	},
}));

const mockMakeRequest = makeBugherdRequest as jest.MockedFunction<
	typeof makeBugherdRequest
>;

type MockResponse<T> = T;

function mockResolvedValue<T>(value: T) {
	mockMakeRequest.mockResolvedValue(value as MockResponse<T>);
}

describe('BugHerd Endpoint Tests (Mocked)', () => {
	beforeEach(() => {
		mockMakeRequest.mockReset();
	});

	describe('projects', () => {
		it('addGuestToProject returns correct type', async () => {
			const mockResponse = {
				user: {
					id: 1,
					email: 'guest@example.com',
					first_name: 'Test',
					last_name: 'Guest',
					name: 'Test Guest',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/123/guests',
				'test-key',
				{
					method: 'POST',
					body: { email: 'guest@example.com', role: 'guest' },
				},
			)) as typeof mockResponse;

			AddGuestToProjectOutputSchema.parse(response);
			expect(response.user.email).toBe('guest@example.com');
		});

		it('addMemberToProject returns correct type', async () => {
			const mockResponse = {
				user: {
					id: 2,
					email: 'member@example.com',
					first_name: 'Test',
					last_name: 'Member',
					name: 'Test Member',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/123/members',
				'test-key',
				{
					method: 'POST',
					body: { user_id: 2, role: 'member' },
				},
			)) as typeof mockResponse;

			AddMemberToProjectOutputSchema.parse(response);
			expect(response.user.id).toBe(2);
		});

		it('createProject returns correct type', async () => {
			const mockResponse = {
				project: {
					id: 456,
					name: 'New Project',
					is_active: true,
					is_public: false,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					deleted_at: null,
					description: 'Test project',
					technical_contact_email: null,
					guest_default_role: null,
					settings: {},
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('projects', 'test-key', {
				method: 'POST',
				body: { name: 'New Project', is_active: true, is_public: false },
			})) as typeof mockResponse;

			CreateProjectOutputSchema.parse(response);
			expect(response.project.name).toBe('New Project');
		});

		it('deleteProject returns correct type', async () => {
			const mockResponse = {};
			mockResolvedValue(mockResponse);

			const response = await makeBugherdRequest('projects/456', 'test-key', {
				method: 'DELETE',
			});

			DeleteProjectOutputSchema.parse(response);
		});

		it('listProjects returns correct type', async () => {
			const mockResponse = {
				projects: [
					{
						id: 1,
						name: 'Project 1',
						is_active: true,
						is_public: false,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
						deleted_at: null,
						description: null,
						technical_contact_email: null,
						guest_default_role: null,
						settings: {},
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('projects', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ListProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('listActiveProjects returns correct type', async () => {
			const mockResponse = {
				projects: [
					{
						id: 1,
						name: 'Active Project',
						is_active: true,
						is_public: false,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
						deleted_at: null,
						description: null,
						technical_contact_email: null,
						guest_default_role: null,
						settings: {},
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects?is_active=true',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ListActiveProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('showProjectDetails returns correct type', async () => {
			const mockResponse = {
				project: {
					id: 1,
					name: 'Project 1',
					is_active: true,
					is_public: false,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					deleted_at: null,
					description: 'Test',
					technical_contact_email: null,
					guest_default_role: null,
					settings: {},
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('projects/1', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ShowProjectDetailsOutputSchema.parse(response);
			expect(response.project.id).toBe(1);
		});

		it('updateProject returns correct type', async () => {
			const mockResponse = {
				project: {
					id: 1,
					name: 'Updated Project',
					is_active: true,
					is_public: true,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-02T00:00:00Z',
					deleted_at: null,
					description: 'Updated',
					technical_contact_email: null,
					guest_default_role: null,
					settings: {},
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('projects/1', 'test-key', {
				method: 'PUT',
				body: { name: 'Updated Project', is_public: true },
			})) as typeof mockResponse;

			UpdateProjectOutputSchema.parse(response);
			expect(response.project.name).toBe('Updated Project');
		});
	});

	describe('columns', () => {
		it('createColumn returns correct type', async () => {
			const mockResponse = {
				column: {
					id: 10,
					name: 'Backlog',
					project_id: 1,
					position: 1,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/1/columns',
				'test-key',
				{
					method: 'POST',
					body: { name: 'Backlog', position: 1 },
				},
			)) as typeof mockResponse;

			CreateColumnOutputSchema.parse(response);
			expect(response.column.name).toBe('Backlog');
		});

		it('listColumns returns correct type', async () => {
			const mockResponse = {
				columns: [
					{
						id: 10,
						name: 'Backlog',
						project_id: 1,
						position: 1,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
					},
				],
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/1/columns',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ListColumnsOutputSchema.parse(response);
			expect(response.columns).toHaveLength(1);
		});

		it('showColumn returns correct type', async () => {
			const mockResponse = {
				column: {
					id: 10,
					name: 'Backlog',
					project_id: 1,
					position: 1,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('columns/10', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ShowColumnOutputSchema.parse(response);
			expect(response.column.id).toBe(10);
		});

		it('updateColumn returns correct type', async () => {
			const mockResponse = {
				column: {
					id: 10,
					name: 'Todo',
					project_id: 1,
					position: 2,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-02T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('columns/10', 'test-key', {
				method: 'PUT',
				body: { name: 'Todo', position: 2 },
			})) as typeof mockResponse;

			UpdateColumnOutputSchema.parse(response);
			expect(response.column.name).toBe('Todo');
		});
	});

	describe('tasks', () => {
		it('createTask returns correct type', async () => {
			const mockResponse = {
				task: {
					id: 100,
					description: 'New task',
					status: 'backlog',
					priority: 'normal',
					tag_list: ['test'],
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					closed_at: null,
					project_id: 1,
					reporter_id: 1,
					assignee_id: null,
					external_id: null,
					attachments_count: 0,
					comments_count: 0,
					due_date: null,
					duedate: null,
					column_id: 10,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/1/tasks',
				'test-key',
				{
					method: 'POST',
					body: {
						description: 'New task',
						priority: 'normal',
						status: 'backlog',
					},
				},
			)) as typeof mockResponse;

			CreateTaskOutputSchema.parse(response);
			expect(response.task.description).toBe('New task');
		});

		it('updateTask returns correct type', async () => {
			const mockResponse = {
				task: {
					id: 100,
					description: 'Updated task',
					status: 'in_progress',
					priority: 'high',
					tag_list: ['test', 'urgent'],
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-02T00:00:00Z',
					closed_at: null,
					project_id: 1,
					reporter_id: 1,
					assignee_id: 2,
					external_id: 'EXT-123',
					attachments_count: 0,
					comments_count: 0,
					due_date: '2024-12-31',
					duedate: '2024-12-31',
					column_id: 11,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('tasks/100', 'test-key', {
				method: 'PUT',
				body: { status: 'in_progress', priority: 'high' },
			})) as typeof mockResponse;

			UpdateTaskOutputSchema.parse(response);
			expect(response.task.status).toBe('in_progress');
		});

		it('listAttachments returns correct type', async () => {
			const mockResponse = {
				attachments: [
					{
						id: 200,
						file_name: 'test.txt',
						file_size: 1024,
						content_type: 'text/plain',
						url: 'https://example.com/test.txt',
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
						task_id: 100,
						user_id: 1,
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'tasks/100/attachments',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ListAttachmentsOutputSchema.parse(response);
			expect(response.attachments).toHaveLength(1);
		});

		it('showAttachment returns correct type', async () => {
			const mockResponse = {
				attachment: {
					id: 200,
					file_name: 'test.txt',
					file_size: 1024,
					content_type: 'text/plain',
					url: 'https://example.com/test.txt',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					task_id: 100,
					user_id: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'attachments/200',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ShowAttachmentOutputSchema.parse(response);
			expect(response.attachment.id).toBe(200);
		});

		it('createAttachment returns correct type', async () => {
			const mockResponse = {
				attachment: {
					id: 201,
					file_name: 'new.txt',
					file_size: 2048,
					content_type: 'text/plain',
					url: 'https://example.com/new.txt',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					task_id: 100,
					user_id: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'tasks/100/attachments',
				'test-key',
				{
					method: 'POST',
					body: {
						file_name: 'new.txt',
						file_size: 2048,
						content_type: 'text/plain',
					},
				},
			)) as typeof mockResponse;

			CreateAttachmentOutputSchema.parse(response);
			expect(response.attachment.file_name).toBe('new.txt');
		});

		it('createComment returns correct type', async () => {
			const mockResponse = {
				comment: {
					id: 300,
					body: 'Test comment',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					task_id: 100,
					user_id: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'tasks/100/comments',
				'test-key',
				{
					method: 'POST',
					body: { body: 'Test comment' },
				},
			)) as typeof mockResponse;

			CreateCommentOutputSchema.parse(response);
			expect(response.comment.body).toBe('Test comment');
		});

		it('uploadAttachment returns correct type', async () => {
			const mockResponse = {
				attachment: {
					id: 202,
					file_name: 'upload.txt',
					file_size: 4096,
					content_type: 'text/plain',
					url: 'https://example.com/upload.txt',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
					task_id: 100,
					user_id: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'tasks/100/attachments',
				'test-key',
				{
					method: 'POST',
					body: {} as Record<string, unknown>,
				},
			)) as typeof mockResponse;

			UploadAttachmentOutputSchema.parse(response);
			expect(response.attachment.id).toBe(202);
		});
	});

	describe('webhooks', () => {
		it('createWebhook returns correct type', async () => {
			const mockResponse = {
				webhook: {
					id: 500,
					url: 'https://example.com/webhook',
					project_id: 1,
					events: ['task_created', 'task_updated'],
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/1/webhooks',
				'test-key',
				{
					method: 'POST',
					body: {
						url: 'https://example.com/webhook',
						events: ['task_created'],
					},
				},
			)) as typeof mockResponse;

			CreateWebhookOutputSchema.parse(response);
			expect(response.webhook.url).toBe('https://example.com/webhook');
		});

		it('listWebhooks returns correct type', async () => {
			const mockResponse = {
				webhooks: [
					{
						id: 500,
						url: 'https://example.com/webhook',
						project_id: 1,
						events: ['task_created', 'task_updated'],
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'projects/1/webhooks',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ListWebhooksOutputSchema.parse(response);
			expect(response.webhooks).toHaveLength(1);
		});
	});

	describe('users', () => {
		it('listUsers returns correct type', async () => {
			const mockResponse = {
				users: [
					{
						id: 1,
						email: 'user@example.com',
						first_name: 'John',
						last_name: 'Doe',
						name: 'John Doe',
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('users', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ListUsersOutputSchema.parse(response);
			expect(response.users).toHaveLength(1);
		});

		it('showUserProjects returns correct type', async () => {
			const mockResponse = {
				projects: [
					{
						id: 1,
						name: 'Project 1',
						is_active: true,
						is_public: false,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
						deleted_at: null,
						description: null,
						technical_contact_email: null,
						guest_default_role: null,
						settings: {},
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest(
				'users/1/projects',
				'test-key',
				{
					method: 'GET',
				},
			)) as typeof mockResponse;

			ShowUserProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('showUserTasks returns correct type', async () => {
			const mockResponse = {
				tasks: [
					{
						id: 100,
						description: 'User task',
						status: 'backlog',
						priority: 'normal',
						tag_list: ['test'],
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z',
						closed_at: null,
						project_id: 1,
						reporter_id: 1,
						assignee_id: 1,
						external_id: null,
						attachments_count: 0,
						comments_count: 0,
						due_date: null,
						duedate: null,
						column_id: 10,
					},
				],
				meta: {
					current_page: 1,
					total_pages: 1,
					total_count: 1,
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('users/1/tasks', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ShowUserTasksOutputSchema.parse(response);
			expect(response.tasks).toHaveLength(1);
		});
	});

	describe('organization', () => {
		it('showOrganization returns correct type', async () => {
			const mockResponse = {
				organization: {
					id: 1,
					name: 'Test Org',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockResolvedValue(mockResponse);

			const response = (await makeBugherdRequest('organization', 'test-key', {
				method: 'GET',
			})) as typeof mockResponse;

			ShowOrganizationOutputSchema.parse(response);
			expect(response.organization.name).toBe('Test Org');
		});
	});

	describe('Error handling', () => {
		it('throws BugherdAPIError on failure', async () => {
			const { BugherdAPIError } = await import('../client');
			mockMakeRequest.mockRejectedValue(new BugherdAPIError('Not Found'));

			await expect(
				makeBugherdRequest('projects/999', 'test-key', { method: 'GET' }),
			).rejects.toThrow(BugherdAPIError);
		});
	});
});
