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
	testContext,
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

describe('event privacy', () => {
	it.each([
		['folders.get', Folders.get, { id: folderId }, foldersEnvelope],
		[
			'folders.create',
			Folders.create,
			{ parentId: folderId, title: 'Confidential client' },
			foldersEnvelope,
		],
		[
			'folders.update',
			Folders.update,
			{ id: folderId, title: 'Confidential client' },
			foldersEnvelope,
		],
		['account.get', Contacts.account, {}, accountEnvelope],
	] as const)(
		'omits names and titles from %s events',
		async (event, endpoint, input, response) => {
			respond(fetchMock, response);
			const result = await invoke(endpoint, input);
			expect(result).toEqual(response);
			expect(mockLog.mock.calls.at(-1)?.[1]).toBe(`wrike.${event}`);
			const fields = mockLog.mock.calls.at(-1)?.[2];
			expect(fields).toHaveProperty('id', response.data[0]?.id);
			expect(fields).not.toHaveProperty('title');
			expect(fields).not.toHaveProperty('name');
		},
	);
});

describe('tasks', () => {
	it('searches tasks with list filters as JSON arrays', async () => {
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
		// Wrike reads a list filter as a JSON array; the live API answers
		// `Parameter 'status' value is invalid` to `Active,Completed`.
		expect(sent.query.status).toBe('["Active","Completed"]');
		expect(sent.query.responsibles).toBe(`["${contactId}"]`);
		expect(sent.query.pageSize).toBe('50');
	});

	it('sends authors as a JSON array too', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.list, { authors: [contactId, 'KUBBBBBB'] });

		expect(lastRequest(fetchMock).query.authors).toBe(
			`["${contactId}","KUBBBBBB"]`,
		);
	});

	it('sorts by the start-to-finish interval, not a StartDate Wrike refuses', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.list, { sortField: 'StartFinishInterval' });

		expect(lastRequest(fetchMock).query.sortField).toBe('StartFinishInterval');
		await expect(
			invoke(Tasks.list, { sortField: 'StartDate' }),
		).rejects.toThrow();
	});

	it('returns the paging token typed, so the next call can pass it on', async () => {
		respond(fetchMock, {
			...tasksEnvelope,
			nextPageToken: 'ADE7SXYAAAAAUAAAAAAQAAAAAAAAAAAA',
			responseSize: 5,
		});

		const result = await Tasks.list(
			testContext as never,
			{ pageSize: 2 } as never,
		);

		expect(result.nextPageToken).toBe('ADE7SXYAAAAAUAAAAAAQAAAAAAAAAAAA');
		expect(result.responseSize).toBe(5);
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
		expect(sent.body).not.toHaveProperty('dates');
	});

	it('folds start and due dates into the dates object Wrike schedules by', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.create, {
			folderId,
			title: 'Ship the new checkout',
			startDate: '2026-11-12',
			dueDate: '2026-11-20',
			parents: ['IEABBBBB'],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.body).toEqual({
			title: 'Ship the new checkout',
			dates: { start: '2026-11-12', due: '2026-11-20' },
			parents: ['IEABBBBB'],
		});
		expect(sent.body).not.toHaveProperty('startDate');
		expect(sent.body).not.toHaveProperty('parentIds');
	});

	it('lets an explicit dates object win over the shorthands', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.create, {
			folderId,
			title: 'Launch',
			dueDate: '2026-11-20',
			dates: { type: 'Milestone', due: '2026-12-01' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			dates: { type: 'Milestone', due: '2026-12-01' },
		});
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

	it('reschedules through dates on an update', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.update, { id: taskId, dueDate: '2030-01-15' });

		expect(lastRequest(fetchMock).body).toEqual({
			dates: { due: '2030-01-15' },
		});
	});

	it('moves a task to the backlog with dates.type', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.update, { id: taskId, dates: { type: 'Backlog' } });

		expect(lastRequest(fetchMock).body).toEqual({
			dates: { type: 'Backlog' },
		});
	});

	it('does not send removeFollowers, which Wrike has no parameter for', async () => {
		respond(fetchMock, tasksEnvelope);

		await invoke(Tasks.update, {
			id: taskId,
			title: 'Renamed',
			removeFollowers: [contactId],
		});

		expect(lastRequest(fetchMock).body).toEqual({ title: 'Renamed' });
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

		expect(lastRequest(fetchMock).query).toEqual({});
		// Only the one with a `project` object is a project.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wrike.folders.list',
			{ count: 2, projects: 1 },
			'completed',
		);
	});

	it('pages folders only with a filter, since the unfiltered tree is not paged', async () => {
		respond(fetchMock, foldersEnvelope);

		await invoke(Folders.list, { project: false, pageSize: 1 });

		const sent = lastRequest(fetchMock);
		expect(sent.query.project).toBe('false');
		expect(sent.query.pageSize).toBe('1');

		// The live API answers `'pageSize' or 'nextPageToken' parameter is not
		// supported for 'folderTree' kind` when no filter is set.
		await expect(invoke(Folders.list, { pageSize: 1 })).rejects.toThrow(
			'Wrike pages folders only when a filter is set',
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
		expect(sent.query).toEqual({});
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

	it('deletes a folder with no recursive flag, which Wrike does not have', async () => {
		respond(fetchMock, emptyEnvelope);

		await expect(
			invoke(Folders.remove, { id: folderId, recursive: true }),
		).resolves.toEqual({ id: folderId, deleted: true });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe(`/api/v4/folders/${folderId}`);
		expect(sent.query).toEqual({});
	});
});

describe('timelogs', () => {
	it('lists time logs, summing the hours', async () => {
		respond(fetchMock, timelogsEnvelope);

		const result = await invoke(Timelogs.list, { me: true, taskId });

		expect(result).toEqual(timelogsEnvelope);
		// Wrike answers `Parameter 'taskId' is not allowed` on /timelogs.
		expect(lastRequest(fetchMock).query).toEqual({ me: 'true' });
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
				comment: '',
			}),
		).rejects.toThrow();
	});

	it('requires the comment Wrike marks as required, while allowing an empty one', async () => {
		await expect(
			invoke(Timelogs.create, { taskId, hours: 1, trackedDate: '2024-06-01' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();

		respond(fetchMock, timelogsEnvelope);
		await invoke(Timelogs.create, {
			taskId,
			hours: 1,
			trackedDate: '2024-06-01',
			comment: '',
		});
		expect(lastRequest(fetchMock).body).toMatchObject({ comment: '' });
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
		expect(lastRequest(fetchMock).query).toEqual({});
	});

	it('posts a comment, logging its length and never its text', async () => {
		respond(fetchMock, commentsEnvelope);

		await invoke(Timelogs.taskCommentsCreate, {
			taskId,
			text: 'Looks good to me.',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		// Without plainText Wrike reads the text as HTML.
		expect(sent.body).toEqual({ text: 'Looks good to me.', plainText: true });
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
		expect(sent.body).toEqual({ text: 'Edited.', plainText: true });
	});

	it('deletes a comment', async () => {
		respond(fetchMock, emptyEnvelope);

		await invoke(Timelogs.removeComment, { id: comment.id });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists every comment in the account, capped by limit', async () => {
		respond(fetchMock, commentsEnvelope);

		const result = (await invoke(Timelogs.listComments, {
			limit: 25,
			pageSize: 25,
		})) as { data?: { id?: string }[] };

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v4/comments');
		// Wrike answers `Parameter 'pageSize' is not allowed` on /comments.
		expect(sent.query).toEqual({ limit: '25' });
		expect(Array.isArray(result.data)).toBe(true);
	});
});

describe('contacts and account', () => {
	it('lists contacts, logging only the count', async () => {
		respond(fetchMock, contactsEnvelope);

		await invoke(Contacts.list, { active: true, pageSize: 5 });

		// Wrike answers `Parameter 'pageSize' is not allowed` on /contacts.
		expect(lastRequest(fetchMock).query).toEqual({ active: 'true' });
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

	it('reads `me` through the me filter, since Wrike refuses it as an id', async () => {
		respond(fetchMock, contactsEnvelope);

		const result = await invoke(Contacts.get, { id: 'me' });

		// The live API answers `Invalid ContactOrInvitation ID` to /contacts/me.
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v4/contacts');
		expect(sent.query).toEqual({ me: 'true' });
		expect(result).toEqual(contactsEnvelope);
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
