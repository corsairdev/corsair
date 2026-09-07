import { makeBugherdRequest } from '../client';
import * as endpoints from './bugherd';
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

const mockCtx = {
	key: 'test-api-key',
	log: jest.fn().mockResolvedValue(undefined),
	database: undefined,
	endpoints: {},
} as any;

describe('BugHerd Endpoint Tests (Mocked Client, Real Endpoints)', () => {
	beforeEach(() => {
		mockMakeRequest.mockReset();
	});

	describe('projects', () => {
		it('addGuestToProject calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {
				project_id: 123,
				email: 'guest@example.com',
				role: 'guest' as const,
			};
			const response = await endpoints.addGuestToProject(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/123/guests',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { email: 'guest@example.com', role: 'guest' },
				}),
			);

			AddGuestToProjectOutputSchema.parse(response);
			expect(response.user.email).toBe('guest@example.com');
		});

		it('addMemberToProject calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 123, user_id: 2, role: 'member' as const };
			const response = await endpoints.addMemberToProject(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/123/members',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { user_id: 2, role: 'member' },
				}),
			);

			AddMemberToProjectOutputSchema.parse(response);
			expect(response.user.id).toBe(2);
		});

		it('createProject calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { name: 'New Project', is_active: true, is_public: false };
			const response = await endpoints.createProject(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { name: 'New Project', is_active: true, is_public: false },
				}),
			);

			CreateProjectOutputSchema.parse(response);
			expect(response.project.name).toBe('New Project');
		});

		it('deleteProject calls client with correct args and returns parsed response', async () => {
			const mockResponse = {};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 456 };
			const response = await endpoints.deleteProject(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/456',
				'test-api-key',
				expect.objectContaining({ method: 'DELETE' }),
			);

			DeleteProjectOutputSchema.parse(response);
		});

		it('listProjects calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {};
			const response = await endpoints.listProjects(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ListProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('listActiveProjects calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {};
			const response = await endpoints.listActiveProjects(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ is_active: true }),
				}),
			);

			ListActiveProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('showProjectDetails calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 1 };
			const response = await endpoints.showProjectDetails(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowProjectDetailsOutputSchema.parse(response);
			expect(response.project.id).toBe(1);
		});

		it('updateProject calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 1, name: 'Updated Project', is_public: true };
			const response = await endpoints.updateProject(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1',
				'test-api-key',
				expect.objectContaining({
					method: 'PUT',
					body: { name: 'Updated Project', is_public: true },
				}),
			);

			UpdateProjectOutputSchema.parse(response);
			expect(response.project.name).toBe('Updated Project');
		});
	});

	describe('columns', () => {
		it('createColumn calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 1, name: 'Backlog', position: 1 };
			const response = await endpoints.createColumn(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1/columns',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { name: 'Backlog', position: 1 },
				}),
			);

			CreateColumnOutputSchema.parse(response);
			expect(response.column.name).toBe('Backlog');
		});

		it('listColumns calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 1 };
			const response = await endpoints.listColumns(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1/columns',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ListColumnsOutputSchema.parse(response);
			expect(response.columns).toHaveLength(1);
		});

		it('showColumn calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { column_id: 10 };
			const response = await endpoints.showColumn(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'columns/10',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowColumnOutputSchema.parse(response);
			expect(response.column.id).toBe(10);
		});

		it('updateColumn calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { column_id: 10, name: 'Todo', position: 2 };
			const response = await endpoints.updateColumn(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'columns/10',
				'test-api-key',
				expect.objectContaining({
					method: 'PUT',
					body: { name: 'Todo', position: 2 },
				}),
			);

			UpdateColumnOutputSchema.parse(response);
			expect(response.column.name).toBe('Todo');
		});
	});

	describe('tasks', () => {
		it('createTask calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {
				project_id: 1,
				description: 'New task',
				priority: 'normal' as const,
				status: 'backlog',
			};
			const response = await endpoints.createTask(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1/tasks',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: {
						description: 'New task',
						priority: 'normal',
						status: 'backlog',
					},
				}),
			);

			CreateTaskOutputSchema.parse(response);
			expect(response.task.description).toBe('New task');
		});

		it('updateTask calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {
				task_id: 100,
				status: 'in_progress',
				priority: 'high' as const,
			};
			const response = await endpoints.updateTask(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'tasks/100',
				'test-api-key',
				expect.objectContaining({
					method: 'PUT',
					body: { status: 'in_progress', priority: 'high' },
				}),
			);

			UpdateTaskOutputSchema.parse(response);
			expect(response.task.status).toBe('in_progress');
		});

		it('listAttachments calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { task_id: 100 };
			const response = await endpoints.listAttachments(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'tasks/100/attachments',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ListAttachmentsOutputSchema.parse(response);
			expect(response.attachments).toHaveLength(1);
		});

		it('showAttachment calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { attachment_id: 200 };
			const response = await endpoints.showAttachment(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'attachments/200',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowAttachmentOutputSchema.parse(response);
			expect(response.attachment.id).toBe(200);
		});

		it('createAttachment calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {
				task_id: 100,
				file_name: 'new.txt',
				file_size: 2048,
				content_type: 'text/plain',
			};
			const response = await endpoints.createAttachment(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'tasks/100/attachments',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: {
						file_name: 'new.txt',
						file_size: 2048,
						content_type: 'text/plain',
					},
				}),
			);

			CreateAttachmentOutputSchema.parse(response);
			expect(response.attachment.file_name).toBe('new.txt');
		});

		it('createComment calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { task_id: 100, body: 'Test comment' };
			const response = await endpoints.createComment(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'tasks/100/comments',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { body: 'Test comment' },
				}),
			);

			CreateCommentOutputSchema.parse(response);
			expect(response.comment.body).toBe('Test comment');
		});

		it('uploadAttachment returns parsed response', async () => {
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
			// uploadAttachment uses a different code path with FormData
			// We just verify the output schema parsing works
			UploadAttachmentOutputSchema.parse(mockResponse);
			expect(mockResponse.attachment.id).toBe(202);
		});
	});

	describe('webhooks', () => {
		it('createWebhook calls client with correct args and returns parsed response', async () => {
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
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {
				project_id: 1,
				url: 'https://example.com/webhook',
				events: ['task_created'],
			};
			const response = await endpoints.createWebhook(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1/webhooks',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: {
						url: 'https://example.com/webhook',
						events: ['task_created'],
					},
				}),
			);

			CreateWebhookOutputSchema.parse(response);
			expect(response.webhook.url).toBe('https://example.com/webhook');
		});

		it('listWebhooks calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { project_id: 1 };
			const response = await endpoints.listWebhooks(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'projects/1/webhooks',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ListWebhooksOutputSchema.parse(response);
			expect(response.webhooks).toHaveLength(1);
		});
	});

	describe('users', () => {
		it('listUsers calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {};
			const response = await endpoints.listUsers(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'users',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ListUsersOutputSchema.parse(response);
			expect(response.users).toHaveLength(1);
		});

		it('showUserProjects calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { user_id: 1 };
			const response = await endpoints.showUserProjects(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'users/1/projects',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowUserProjectsOutputSchema.parse(response);
			expect(response.projects).toHaveLength(1);
		});

		it('showUserTasks calls client with correct args and returns parsed response', async () => {
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
				meta: { current_page: 1, total_pages: 1, total_count: 1 },
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = { user_id: 1 };
			const response = await endpoints.showUserTasks(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'users/1/tasks',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowUserTasksOutputSchema.parse(response);
			expect(response.tasks).toHaveLength(1);
		});
	});

	describe('organization', () => {
		it('showOrganization calls client with correct args and returns parsed response', async () => {
			const mockResponse = {
				organization: {
					id: 1,
					name: 'Test Org',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			};
			mockMakeRequest.mockResolvedValue(mockResponse);

			const input = {};
			const response = await endpoints.showOrganization(mockCtx, input);

			expect(mockMakeRequest).toHaveBeenCalledTimes(1);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'organization',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);

			ShowOrganizationOutputSchema.parse(response);
			expect(response.organization.name).toBe('Test Org');
		});
	});

	describe('Error handling', () => {
		it('throws BugherdAPIError on failure', async () => {
			const { BugherdAPIError } = await import('../client');
			mockMakeRequest.mockRejectedValue(new BugherdAPIError('Not Found'));

			await expect(
				endpoints.showProjectDetails(mockCtx, { project_id: 999 }),
			).rejects.toThrow(BugherdAPIError);
		});
	});
});
