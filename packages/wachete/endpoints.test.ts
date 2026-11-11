import { logEventFromContext } from 'corsair/core';
import { WacheteAPIError } from './client';
import { Data, Folders, Notifications, Tasks } from './endpoints';
import {
	dataHistory,
	dataHistoryWithDiff,
	failedTask,
	folder,
	folderContent,
	folderId,
	invalidToken,
	notification,
	notificationHtml,
	notificationsLastPage,
	notificationsPage,
	pages,
	portalTask,
	searchResults,
	task,
	taskId,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
	respondEmpty,
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
	it('creates a monitor with a PUT on the collection', async () => {
		respond(fetchMock, task);

		const result = await invoke(Tasks.upsert, {
			name: 'My First Monitor',
			url: 'http://www.mypage.com',
			xPath: '/',
			recurrenceInSeconds: 86_400,
			alerts: [{ type: 'Error' }, { type: 'NotEq' }],
		});

		expect(result).toEqual(task);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/thirdparty/v1/task');
		expect((sent.body as { id?: string }).id).toBeUndefined();
	});

	it('sends alert names, which is the form every documented example uses', async () => {
		respond(fetchMock, task);

		await invoke(Tasks.upsert, {
			name: 'Monitor',
			url: 'http://www.mypage.com',
			recurrenceInSeconds: 60,
			alerts: [{ type: 'Error' }, { type: 'NotEq' }],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			alerts: [{ type: 'Error' }, { type: 'NotEq' }],
		});
	});

	it('also accepts the numeric alert value the schema declares', async () => {
		respond(fetchMock, task);

		await invoke(Tasks.upsert, {
			name: 'Monitor',
			url: 'http://www.mypage.com',
			recurrenceInSeconds: 60,
			alerts: [{ type: 0 }, { type: 2 }],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			alerts: [{ type: 0 }, { type: 2 }],
		});
	});

	it('updates when an id is given, keeping it in the body', async () => {
		respond(fetchMock, task);

		await invoke(Tasks.upsert, {
			id: taskId,
			name: 'Renamed',
			url: 'http://www.mypage.com',
			recurrenceInSeconds: 3600,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect((sent.body as { id?: string }).id).toBe(taskId);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.tasks.upsert',
			expect.objectContaining({ id: taskId, created: false }),
			'completed',
		);
	});

	it('sends notification endpoints, or omits them to notify everyone', async () => {
		respond(fetchMock, task);

		await invoke(Tasks.upsert, {
			name: 'Monitor',
			url: 'http://www.mypage.com',
			recurrenceInSeconds: 60,
			notificationEndpoints: [
				{ type: 'Webhook', value: 'https://www.myservice.com/callback' },
			],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			notificationEndpoints: [
				{ type: 'Webhook', value: 'https://www.myservice.com/callback' },
			],
		});
	});

	it('creates a Portal monitor with crawling settings', async () => {
		respond(fetchMock, portalTask);

		await invoke(Tasks.upsert, {
			name: 'Docs portal',
			url: 'http://www.mypage.com',
			recurrenceInSeconds: 86_400,
			jobType: 'Portal',
			crawlingDepth: 2,
			urlFilter: {
				include: [{ filter: 'http://products/catalog/', type: 'Contains' }],
			},
		});

		const body = lastRequest(fetchMock).body as Record<string, unknown>;
		expect(body.jobType).toBe('Portal');
		expect(body.crawlingDepth).toBe(2);
	});

	it('rejects crawling settings on a SinglePage monitor', async () => {
		await expect(
			invoke(Tasks.upsert, {
				name: 'One page',
				url: 'http://www.mypage.com',
				recurrenceInSeconds: 60,
				crawlingDepth: 2,
			}),
		).rejects.toThrow('crawlingDepth only applies to a Portal monitor.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a crawling depth outside 1 to 3', async () => {
		await expect(
			invoke(Tasks.upsert, {
				name: 'Portal',
				url: 'http://www.mypage.com',
				recurrenceInSeconds: 60,
				jobType: 'Portal',
				crawlingDepth: 5,
			}),
		).rejects.toThrow();
	});

	it('reads one monitor', async () => {
		respond(fetchMock, task);

		const result = await invoke(Tasks.get, { id: taskId });

		expect(result).toEqual(task);
		expect(lastRequest(fetchMock).path).toBe(`/thirdparty/v1/task/${taskId}`);
	});

	it('reports a failed last check', async () => {
		respond(fetchMock, failedTask);

		await invoke(Tasks.get, { id: taskId });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.tasks.get',
			{ id: taskId, hasError: true, recurrence: 86_400 },
			'completed',
		);
	});

	it('states what a delete did, since the answer has no body', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Tasks.remove, { id: taskId });

		expect(result).toEqual({ id: taskId, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('searches on its own route, not as a monitor id', async () => {
		respond(fetchMock, searchResults);

		const result = await invoke(Tasks.search, { query: 'docs' });

		expect(result).toEqual(searchResults);
		const sent = lastRequest(fetchMock);
		// "search" sits after "/task/{id}" in the API's own path table, so this
		// pins that it is called as /task/search and not as a lookup.
		expect(sent.path).toBe('/thirdparty/v1/task/search');
		expect(sent.query.query).toBe('docs');
	});

	it('lists the pages a Portal monitor crawls', async () => {
		respond(fetchMock, pages);

		const result = await invoke(Tasks.pages, { id: portalTask.id });

		expect(result).toEqual(pages);
		expect(lastRequest(fetchMock).path).toBe(
			`/thirdparty/v1/task/${portalTask.id}/pages`,
		);
	});

	it('surfaces a bad token as a WacheteAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		await expect(invoke(Tasks.get, { id: taskId })).rejects.toBeInstanceOf(
			WacheteAPIError,
		);
	});
});

describe('notifications', () => {
	it('lists notifications newest first', async () => {
		respond(fetchMock, notificationsPage);

		const result = await invoke(Notifications.list, { taskId });

		expect(result).toEqual(notificationsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/thirdparty/v1/notification/list');
		expect(sent.query.taskId).toBe(taskId);
	});

	it('reports more pages from the continuation token', async () => {
		respond(fetchMock, notificationsPage);

		await invoke(Notifications.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.notifications.list',
			{ count: 1, hasMore: true },
			'completed',
		);
	});

	it('reports the last page when no token comes back', async () => {
		respond(fetchMock, notificationsLastPage);

		await invoke(Notifications.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.notifications.list',
			{ count: 1, hasMore: false },
			'completed',
		);
	});

	it('sends the date range and HTML flag', async () => {
		respond(fetchMock, notificationsPage);

		await invoke(Notifications.list, {
			from: '2024-01-01T00:00:00Z',
			to: '2024-12-31T00:00:00Z',
			html: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.from).toBe('2024-01-01T00:00:00Z');
		expect(sent.query.html).toBe('true');
	});

	it('reads one notification as HTML', async () => {
		respond(fetchMock, notificationHtml);

		const result = await invoke(Notifications.get, {
			alertId: notification.id,
		});

		expect(result).toEqual(notificationHtml);
		expect(lastRequest(fetchMock).path).toBe(
			`/thirdparty/v1/notification/${notification.id}`,
		);
	});

	it('logs the HTML length, never its content', async () => {
		respond(fetchMock, notificationHtml);

		await invoke(Notifications.get, { alertId: notification.id });

		const logged = mockLog.mock.calls.at(-1)?.[2] as {
			html?: unknown;
			name?: unknown;
		};
		// The key says `html` but holds a count: the body itself is the watched
		// page's text and must never reach the event log.
		expect(logged.html).toBe(notificationHtml.html.length);
		expect(typeof logged.html).toBe('number');
		expect(logged.name).toBe('My First Monitor');
	});
});

describe('data history', () => {
	it('reads the check history of a monitor', async () => {
		respond(fetchMock, dataHistory);

		const result = await invoke(Data.list, { id: taskId });

		expect(result).toEqual(dataHistory);
		expect(lastRequest(fetchMock).path).toBe(
			`/thirdparty/v1/data/list/${taskId}`,
		);
	});

	it('asks for a diff per entry', async () => {
		respond(fetchMock, dataHistoryWithDiff);

		const result = await invoke(Data.list, { id: taskId, returnDiff: true });

		expect(result).toEqual(dataHistoryWithDiff);
		const sent = lastRequest(fetchMock);
		expect(sent.query.returnDiff).toBe('true');
	});

	it('logs whether a diff was asked for', async () => {
		respond(fetchMock, dataHistoryWithDiff);

		await invoke(Data.list, { id: taskId, returnDiff: true });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.data.list',
			{ id: taskId, count: 1, hasMore: false, diff: true },
			'completed',
		);
	});
});

describe('folders', () => {
	it('lists the root when no parent is given', async () => {
		respond(fetchMock, folderContent);

		const result = await invoke(Folders.list, {});

		expect(result).toEqual(folderContent);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/thirdparty/v1/folder/list');
		expect(sent.query.parentId).toBeUndefined();
	});

	it('lists one folder by parent id', async () => {
		respond(fetchMock, folderContent);

		await invoke(Folders.list, { parentId: folderId });

		expect(lastRequest(fetchMock).query.parentId).toBe(folderId);
	});

	it('logs the folder and task counts', async () => {
		respond(fetchMock, folderContent);

		await invoke(Folders.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'wachete.folders.list',
			{ folders: 1, tasks: 1, hasMore: false },
			'completed',
		);
	});

	it('creates a folder', async () => {
		respond(fetchMock, folder);

		const result = await invoke(Folders.upsert, { name: 'Products' });

		expect(result).toEqual(folder);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/thirdparty/v1/folder');
		expect((sent.body as { id?: string }).id).toBeUndefined();
	});

	it('updates when an id is given', async () => {
		respond(fetchMock, folder);

		await invoke(Folders.upsert, { id: folderId, name: 'Renamed' });

		expect((lastRequest(fetchMock).body as { id?: string }).id).toBe(folderId);
	});

	it('states what a folder delete did, which also removed its contents', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Folders.remove, { id: folderId });

		expect(result).toEqual({ id: folderId, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('moves monitors into a folder', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Folders.move, {
			folderId,
			taskIds: [taskId],
		});

		expect(result).toMatchObject({ moved: true });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/thirdparty/v1/folder/move');
		expect(sent.body).toEqual({ folderId, taskIds: [taskId] });
	});

	it('rejects a move with nothing to move', async () => {
		await expect(invoke(Folders.move, { folderId })).rejects.toThrow(
			'A move needs at least one taskId or folderId.',
		);
	});

	it('rejects moving a folder into itself', async () => {
		await expect(
			invoke(Folders.move, { folderId, folderIds: [folderId] }),
		).rejects.toThrow('A folder cannot be moved into itself.');
	});

	it('accepts an empty folderId as the root', async () => {
		respondEmpty(fetchMock);

		await invoke(Folders.move, { folderId: '', taskIds: [taskId] });

		expect((lastRequest(fetchMock).body as { folderId: string }).folderId).toBe(
			'',
		);
	});
});
