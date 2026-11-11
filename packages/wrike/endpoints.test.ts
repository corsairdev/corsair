import { logEventFromContext } from 'corsair/core';
import { WrikeAPIError } from './client';
import { Contacts, Folders, Tasks, Timelogs } from './endpoints';
import {
	accountEnvelope,
	comment,
	commentsEnvelope,
	contactId,
	contactsEnvelope,
	emptyEnvelope,
	folder,
	folderId,
	foldersEnvelope,
	invalidToken,
	plainFolder,
	taskId,
	tasksEnvelope,
	timelog,
	timelogsEnvelope,
} from './test-fixtures';
import {
	euContext,
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('tasks', () => {
	it('searches tasks with comma-joined filters', async () => {
		respond(fetchMock, tasksEnvelope);

		const result = await invoke(Tasks.list, {
			pageSize: 50,
			status: ['Active', 'Completed'],
			responsibles: [contactId],
		});

		expect(result).toEqual(tasksEnvelope);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v4/tasks');
		// Wrike takes one comma-separated value, not a repeated key.
		expect(sent.query.status).toBe('Active,Completed');
		expect(sent.query.responsibles).toBe(contactId);
		expect(sent.query.pageSize).toBe('50');
	});

	it('rejects a page size above 1000', async () => {
		await expect(invoke(Tasks.list, { pageSize: 1001 })).rejects.toThrow();
	});

	it('reads one task', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.get, { id: taskId });

		expect(lastRequest(fetchMock).path).toBe(`/api/v4/tasks/${taskId}`);
	});

	it('creates a task under a folder, since Wrike has no account-level create', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.create, {
			folderId,
			title: 'Ship the new checkout',
			description: 'The cart and payment pages',
			importance: 'High',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v4/folders/${folderId}/tasks`);
		// The folder is in the path, not the body.
		expect(sent.body).toMatchObject({ title: 'Ship the new checkout' });
		expect(sent.body).not.toHaveProperty('folderId');
	});

	it('rejects a create with an empty title', async () => {
		await expect(
			invoke(Tasks.create, { folderId, title: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a task', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.update, { id: taskId, status: 'Completed' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/api/v4/tasks/${taskId}`);
		expect(sent.body).toEqual({ status: 'Completed' });
	});

	it('rejects an update with nothing to change', async () => {
		await expect(invoke(Tasks.update, { id: taskId })).rejects.toThrow(
			'Send at least one field to change.',
		);
	});

	it('restores a task from the recycle bin', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.update, { id: taskId, restore: true });

		expect(lastRequest(fetchMock).body).toEqual({ restore: true });
	});

	it('states what a delete did, since the answer is an empty list', async () => {
		respond(fetchMock, emptyEnvelope);

		await expect(invoke(Tasks.remove, { id: taskId })).resolves.toEqual({
			id: taskId,
			deleted: true,
		});
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('surfaces a bad token as a WrikeAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		await expect(invoke(Tasks.list, {})).rejects.toBeInstanceOf(WrikeAPIError);
	});
});

describe('folders', () => {
	it('lists folders and counts the projects among them', async () => {
		respond(fetchMock, {
			kind: 'folders',
			data: [folder, plainFolder],
		});

		await invoke(Folders.list, {});

		// Only the one with a `project` object is a project.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wrike.folders.list',
			{ count: 2, projects: 1 },
			'completed',
		);
	});

	it('reads one folder', async () => {
		respond(fetchMock, foldersEnvelope);

		await invoke(Folders.get, { id: folderId });

		expect(lastRequest(fetchMock).path).toBe(`/api/v4/folders/${folderId}`);
	});

	it('creates a folder inside a parent', async () => {
		respond(fetchMock, foldersEnvelope);

		await invoke(Folders.create, {
			parentId: folderId,
			title: 'Checkout revamp',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v4/folders/${folderId}/folders`);
		expect(sent.body).toMatchObject({ title: 'Checkout revamp' });
	});

	it('lists the tasks in a folder, with descendants', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Folders.tasks, { id: folderId, descendants: true });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(`/api/v4/folders/${folderId}/tasks`);
		expect(sent.query.descendants).toBe('true');
	});

	it('updates a folder', async () => {
		respond(fetchMock, foldersEnvelope);

		await invoke(Folders.update, { id: folderId, title: 'Renamed' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ title: 'Renamed' });
	});

	it('deletes a folder without recursive unless asked', async () => {
		respond(fetchMock, emptyEnvelope);

		await invoke(Folders.remove, { id: folderId });

		// The safe call: a non-empty folder is refused without the flag.
		expect(lastRequest(fetchMock).query.recursive).toBeUndefined();
	});

	it('deletes recursing only when asked', async () => {
		respond(fetchMock, emptyEnvelope);

		await invoke(Folders.remove, { id: folderId, recursive: true });

		expect(lastRequest(fetchMock).query.recursive).toBe('true');
	});
});

describe('timelogs', () => {
	it('lists time logs, summing the hours', async () => {
		respond(fetchMock, timelogsEnvelope);

		const result = await invoke(Timelogs.list, { taskId });

		expect(result).toEqual(timelogsEnvelope);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wrike.timelogs.list',
			{ count: 1, hours: 6.5 },
			'completed',
		);
	});

	it('lists the time on one task', async () => {
		respond(fetchMock, timelogsEnvelope);

		await invoke(Timelogs.task, { taskId });

		expect(lastRequest(fetchMock).path).toBe(
			`/api/v4/tasks/${taskId}/timelogs`,
		);
	});

	it('logs hours with a tracked date', async () => {
		respond(fetchMock, timelogsEnvelope);

		await invoke(Timelogs.create, {
			taskId,
			hours: 6.5,
			trackedDate: '2024-06-01',
			comment: 'Built the cart',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v4/tasks/${taskId}/timelogs`);
		expect(sent.body).toEqual({
			hours: 6.5,
			trackedDate: '2024-06-01',
			comment: 'Built the cart',
		});
	});

	it('rejects non-positive hours', async () => {
		await expect(
			invoke(Timelogs.create, {
				taskId,
				hours: 0,
				trackedDate: '2024-06-01',
			}),
		).rejects.toThrow();
	});

	it('deletes a time log', async () => {
		respond(fetchMock, emptyEnvelope);

		await expect(invoke(Timelogs.remove, { id: timelog.id })).resolves.toEqual({
			id: timelog.id,
			deleted: true,
		});
	});
});

describe('comments', () => {
	it('lists the comments on a task', async () => {
		respond(fetchMock, commentsEnvelope);

		const result = await invoke(Timelogs.taskComments, { taskId });

		expect(result).toEqual(commentsEnvelope);
		expect(lastRequest(fetchMock).path).toBe(
			`/api/v4/tasks/${taskId}/comments`,
		);
	});

	it('posts a comment, logging its length and never its text', async () => {
		respond(fetchMock, commentsEnvelope);

		await invoke(Timelogs.taskCommentsCreate, {
			taskId,
			text: 'Looks good to me.',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({ text: 'Looks good to me.' });
		// unknown: the log payload is a free-form record; only the keys asserted
		// below are relied on.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('text');
		expect(logged.length).toBe('Looks good to me.'.length);
	});

	it('updates a comment', async () => {
		respond(fetchMock, commentsEnvelope);

		await invoke(Timelogs.updateComment, {
			id: comment.id,
			text: 'Edited.',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/api/v4/comments/${comment.id}`);
	});

	it('deletes a comment', async () => {
		respond(fetchMock, emptyEnvelope);

		await invoke(Timelogs.removeComment, { id: comment.id });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists every comment in the account, paged', async () => {
		respond(fetchMock, commentsEnvelope);

		const result = (await invoke(Timelogs.listComments, {
			pageSize: 25,
			nextPageToken: 'tok-2',
		})) as { data?: { id?: string }[] };

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v4/comments');
		expect(sent.query.pageSize).toBe('25');
		expect(sent.query.nextPageToken).toBe('tok-2');
		expect(Array.isArray(result.data)).toBe(true);
	});
});

describe('contacts and account', () => {
	it('lists contacts, logging only the count', async () => {
		respond(fetchMock, contactsEnvelope);

		await invoke(Contacts.list, { active: true });

		expect(lastRequest(fetchMock).query.active).toBe('true');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wrike.contacts.list',
			{ count: 1 },
			'completed',
		);
	});

	it('reads one contact', async () => {
		respond(fetchMock, contactsEnvelope);

		await invoke(Contacts.get, { id: contactId });

		expect(lastRequest(fetchMock).path).toBe(`/api/v4/contacts/${contactId}`);
	});

	it('reads the account behind the token and its root folder', async () => {
		respond(fetchMock, accountEnvelope);

		const result = (await invoke(Contacts.account, {})) as {
			data?: { rootFolderId?: string }[];
		};

		expect(result.data?.[0]?.rootFolderId).toBeDefined();
		expect(lastRequest(fetchMock).path).toBe('/api/v4/account');
	});
});

describe('region routing', () => {
	it('calls the EU host when the context names it', async () => {
		respond(fetchMock, tasksEnvelope);

		await Tasks.list(euContext as never, {} as never);

		expect(lastRequest(fetchMock).origin).toBe('https://app-eu.wrike.com');
	});
});
