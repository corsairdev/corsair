import { request } from 'corsair/http';
import * as Contacts from './endpoints/contacts';
import * as Deadlines from './endpoints/deadlines';
import * as Documents from './endpoints/documents';
import * as Identity from './endpoints/identity';
import * as Notes from './endpoints/notes';
import * as Projects from './endpoints/projects';
import * as Tasks from './endpoints/tasks';
import { FilevineEndpointOutputSchemas } from './endpoints/types';
import * as Webhooks from './endpoints/webhooks';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const mockRequest = request as jest.Mock;

function createMockCtx() {
	return {
		key: 'test-token',
		db: {
			projects: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			contacts: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			documents: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			notes: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			deadlines: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			tasks: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			subscriptions: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	} as unknown as Parameters<typeof Projects.list>[0];
}

describe('Filevine endpoints - all 24 operations', () => {
	beforeEach(() => jest.clearAllMocks());

	it('projects.list parses and persists', async () => {
		const payload = {
			items: [{ projectId: 1, projectName: 'Test', phaseName: 'Intake' }],
			hasMore: false,
			totalCount: 1,
		};
		mockRequest.mockResolvedValue(payload);
		const ctx = createMockCtx();
		const result = await Projects.list(ctx, { offset: 0, limit: 50 });
		FilevineEndpointOutputSchemas.listProjects.parse(result);
		expect(result.items?.[0]?.projectId).toBe(1);
		expect(ctx.db.projects.upsertByEntityId).toHaveBeenCalled();
	});

	it('projects.get parses', async () => {
		const payload = { projectId: 1, projectName: 'Test' };
		mockRequest.mockResolvedValue(payload);
		const result = await Projects.get(createMockCtx(), { projectId: 1 });
		FilevineEndpointOutputSchemas.getProject.parse(result);
		expect(result.projectId).toBe(1);
	});

	it('projects.create parses', async () => {
		const payload = {
			projectId: 2,
			projectName: 'New Matter',
			projectTypeId: 10,
			clientId: 99,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Projects.create(createMockCtx(), {
			projectTypeId: 10,
			projectName: 'New Matter',
			clientId: 99,
		});
		FilevineEndpointOutputSchemas.createProject.parse(result);
		expect(result.projectId).toBe(2);
	});

	it('projects.update parses', async () => {
		const payload = {
			projectId: 2,
			projectName: 'Updated',
			phaseName: 'Discovery',
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Projects.update(createMockCtx(), {
			projectId: 2,
			phaseName: 'Discovery',
		});
		FilevineEndpointOutputSchemas.updateProject.parse(result);
		expect(result.phaseName).toBe('Discovery');
	});

	it('contacts.list parses', async () => {
		const payload = {
			items: [
				{
					contactId: 10,
					firstName: 'Jane',
					lastName: 'Doe',
					fullName: 'Jane Doe',
				},
			],
			hasMore: false,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Contacts.list(createMockCtx(), { limit: 50 });
		FilevineEndpointOutputSchemas.listContacts.parse(result);
		expect(result.items?.[0]?.contactId).toBe(10);
	});

	it('contacts.get parses', async () => {
		const payload = { contactId: 10, firstName: 'Jane' };
		mockRequest.mockResolvedValue(payload);
		const result = await Contacts.get(createMockCtx(), { contactId: 10 });
		FilevineEndpointOutputSchemas.getContact.parse(result);
		expect(result.contactId).toBe(10);
	});

	it('contacts.create parses', async () => {
		const payload = { contactId: 11, firstName: 'John', organization: 'Acme' };
		mockRequest.mockResolvedValue(payload);
		const result = await Contacts.create(createMockCtx(), {
			firstName: 'John',
			organization: 'Acme',
			emails: ['john@acme.com'],
		});
		FilevineEndpointOutputSchemas.createContact.parse(result);
		expect(result.contactId).toBe(11);
	});

	it('contacts.attach succeeds', async () => {
		mockRequest.mockResolvedValue({});
		const result = await Contacts.attach(createMockCtx(), {
			projectId: 1,
			contactId: 10,
			role: 'Witness',
		});
		FilevineEndpointOutputSchemas.attachProjectContact.parse(result);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: '/fv-app/v2/Projects/1/Contacts' }),
			expect.anything(),
		);
	});

	it('documents.list parses', async () => {
		const payload = {
			items: [{ documentId: 100, filename: 'contract.pdf', projectId: 1 }],
			hasMore: false,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Documents.list(createMockCtx(), { projectId: 1 });
		FilevineEndpointOutputSchemas.listProjectDocuments.parse(result);
		expect(result.items?.[0]?.documentId).toBe(100);
	});

	it('documents.get parses', async () => {
		const payload = { documentId: 100, filename: 'contract.pdf' };
		mockRequest.mockResolvedValue(payload);
		const result = await Documents.get(createMockCtx(), { documentId: 100 });
		FilevineEndpointOutputSchemas.getDocument.parse(result);
		expect(result.documentId).toBe(100);
	});

	it('documents.upload parses', async () => {
		const payload = { documentId: 101, filename: 'upload.pdf', projectId: 1 };
		mockRequest.mockResolvedValue(payload);
		const result = await Documents.upload(createMockCtx(), {
			projectId: 1,
			filename: 'upload.pdf',
		});
		FilevineEndpointOutputSchemas.uploadProjectDocument.parse(result);
		expect(result.documentId).toBe(101);
	});

	it('notes.list parses with pagination', async () => {
		const payload = {
			items: [
				{ noteId: 200, projectId: 1, body: 'Hello', kind: 'note' as const },
			],
			hasMore: false,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Notes.list(createMockCtx(), {
			projectId: 1,
			limit: 50,
		});
		FilevineEndpointOutputSchemas.listProjectNotes.parse(result);
		expect(result.items?.[0]?.noteId).toBe(200);
	});

	it('notes.create parses', async () => {
		const payload = {
			noteId: 201,
			projectId: 1,
			body: 'New note',
			kind: 'note' as const,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Notes.create(createMockCtx(), {
			projectId: 1,
			body: 'New note',
			kind: 'note',
		});
		FilevineEndpointOutputSchemas.createNote.parse(result);
		expect(result.noteId).toBe(201);
	});

	it('notes.update parses', async () => {
		const payload = { noteId: 201, body: 'Updated', pinned: true };
		mockRequest.mockResolvedValue(payload);
		const result = await Notes.update(createMockCtx(), {
			noteId: 201,
			body: 'Updated',
		});
		FilevineEndpointOutputSchemas.updateNote.parse(result);
		expect(result.body).toBe('Updated');
	});

	it('deadlines.list parses', async () => {
		const payload = {
			items: [
				{ deadlineId: 300, projectId: 1, name: 'SOL', status: 'open' as const },
			],
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Deadlines.list(createMockCtx(), { projectId: 1 });
		FilevineEndpointOutputSchemas.listProjectDeadlines.parse(result);
		expect(result.items?.[0]?.deadlineId).toBe(300);
	});

	it('deadlines.create parses', async () => {
		const payload = {
			deadlineId: 301,
			projectId: 1,
			name: 'Filing',
			dueDate: '2026-12-01T00:00:00Z',
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Deadlines.create(createMockCtx(), {
			projectId: 1,
			name: 'Filing',
			dueDate: '2026-12-01T00:00:00Z',
		});
		FilevineEndpointOutputSchemas.createDeadline.parse(result);
		expect(result.deadlineId).toBe(301);
	});

	it('tasks.list parses', async () => {
		const payload = {
			items: [
				{
					taskId: 400,
					projectId: 1,
					title: 'Review docs',
					status: 'open' as const,
				},
			],
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Tasks.list(createMockCtx(), { projectId: 1 });
		FilevineEndpointOutputSchemas.listProjectTasks.parse(result);
		expect(result.items?.[0]?.taskId).toBe(400);
	});

	it('tasks.create parses', async () => {
		const payload = {
			taskId: 401,
			projectId: 1,
			title: 'New task',
			assigneeId: 5,
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Tasks.create(createMockCtx(), {
			projectId: 1,
			title: 'New task',
			assigneeId: 5,
		});
		FilevineEndpointOutputSchemas.createTask.parse(result);
		expect(result.taskId).toBe(401);
	});

	it('tasks.update parses', async () => {
		const payload = { taskId: 401, status: 'completed' as const };
		mockRequest.mockResolvedValue(payload);
		const result = await Tasks.update(createMockCtx(), {
			taskId: 401,
			status: 'completed',
		});
		FilevineEndpointOutputSchemas.updateTask.parse(result);
		expect(result.status).toBe('completed');
	});

	it('webhooks.list parses', async () => {
		const payload = {
			items: [
				{
					subscriptionId: 'sub_1',
					name: 'Hook',
					endpoint: 'https://example.com/hook',
					events: ['project.created'],
				},
			],
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Webhooks.list(createMockCtx(), {});
		FilevineEndpointOutputSchemas.listWebhookSubscriptions.parse(result);
		expect(result.items?.[0]?.subscriptionId).toBe('sub_1');
	});

	it('webhooks.create parses', async () => {
		const payload = {
			subscriptionId: 'sub_2',
			name: 'Hook2',
			endpoint: 'https://example.com/hook2',
			events: ['note.created'],
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Webhooks.create(createMockCtx(), {
			name: 'Hook2',
			endpoint: 'https://example.com/hook2',
			events: ['note.created'],
		});
		FilevineEndpointOutputSchemas.createWebhookSubscription.parse(result);
		expect(result.subscriptionId).toBe('sub_2');
	});

	it('webhooks.delete parses', async () => {
		mockRequest.mockResolvedValue({});
		const result = await Webhooks.del(createMockCtx(), {
			subscriptionId: 'sub_2',
		});
		FilevineEndpointOutputSchemas.deleteWebhookSubscription.parse(result);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				url: '/fv-app/v2/webhooks/subscriptions/sub_2',
				method: 'DELETE',
			}),
			expect.anything(),
		);
	});

	it('documents.upload treats plain text literally by default', async () => {
		mockRequest.mockResolvedValue({
			documentId: 102,
			filename: 'note.txt',
			projectId: 1,
		});
		await Documents.upload(createMockCtx(), {
			projectId: 1,
			filename: 'note.txt',
			file: 'test',
		});
		const formData = mockRequest.mock.calls.at(-1)?.[1]?.formData as Record<
			string,
			unknown
		>;
		const blob = formData?.file as Blob;
		expect(blob).toBeInstanceOf(Blob);
		expect(await blob.text()).toBe('test');
	});

	it('documents.upload decodes base64 only with explicit fileEncoding', async () => {
		mockRequest.mockResolvedValue({
			documentId: 103,
			filename: 'note.txt',
			projectId: 1,
		});
		await Documents.upload(createMockCtx(), {
			projectId: 1,
			filename: 'note.txt',
			file: 'dGVzdA==',
			fileEncoding: 'base64',
		});
		const formData = mockRequest.mock.calls.at(-1)?.[1]?.formData as Record<
			string,
			unknown
		>;
		const blob = formData?.file as Blob;
		expect(await blob.text()).toBe('test');
	});

	it('documents.upload rejects malformed base64', async () => {
		mockRequest.mockResolvedValue({
			documentId: 104,
			filename: 'bad.txt',
			projectId: 1,
		});
		await expect(
			Documents.upload(createMockCtx(), {
				projectId: 1,
				filename: 'bad.txt',
				file: '!!!-not-base64-!!!',
				fileEncoding: 'base64',
			}),
		).rejects.toThrow(/base64/i);
	});

	it('identity.getAccessToken parses', async () => {
		const payload = {
			access_token: 'tok123',
			token_type: 'Bearer',
			expires_in: 1200,
			scope:
				'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Identity.getAccessToken(createMockCtx(), {
			token: 'pat123',
			scope:
				'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
		});
		FilevineEndpointOutputSchemas.getAccessToken.parse(result);
		expect(result.access_token).toBe('tok123');
	});

	it('identity.getUserOrgsWithToken parses', async () => {
		const payload = {
			UserId: { Native: 123 },
			FirstName: 'Test',
			Orgs: [{ OrgId: 456, Name: 'Test Org' }],
		};
		mockRequest.mockResolvedValue(payload);
		const result = await Identity.getUserOrgsWithToken(createMockCtx(), {});
		FilevineEndpointOutputSchemas.getUserOrgsWithToken.parse(result);
		expect(result).toBeDefined();
	});
});
