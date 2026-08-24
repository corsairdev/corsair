/**
 * Exercises every endpoint wrapper: the request path, HTTP method, query and
 * body it builds, the normalisation it applies, and the local cache writes it
 * performs. Network access is mocked, so this runs in CI.
 */
import {
	Clients,
	Me,
	Organizations,
	Projects,
	Tags,
	Tasks,
	TimeEntries,
	Workspaces,
} from './endpoints';

const WS = 3000001;

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

/** Builds a spying entity store so cache writes and evictions can be asserted. */
function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

// The endpoints only touch `key`, `db`, and the event-logging members; a narrow
// assertion keeps the fixture readable instead of restating the whole context.
type Ctx = Parameters<typeof Me.get>[0];

/** Builds a minimal endpoint context with spying stores. */
function makeCtx() {
	const db = {
		workspaces: makeStore(),
		clients: makeStore(),
		projects: makeStore(),
		tags: makeStore(),
	};
	const ctx = {
		key: 'fake-toggl-token-for-tests-only',
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastCall: { url: string; init: RequestInit } | undefined;

/** Stubs global fetch with a single JSON response and records the request. */
function mockResponse(body: unknown, status = 200) {
	global.fetch = (async (url: string, init: RequestInit) => {
		lastCall = { url, init };
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

/** Returns the URL, method and parsed body of the last recorded request. */
function requested() {
	if (!lastCall) throw new Error('no request was made');
	return {
		url: lastCall.url,
		method: lastCall.init.method,
		body: lastCall.init.body
			? JSON.parse(String(lastCall.init.body))
			: undefined,
	};
}

const BASE = 'https://api.track.toggl.com/api/v9';

const workspace = { id: WS, organization_id: 2000001, name: 'Workspace' };
const client = { id: 4000001, wid: WS, name: 'Acme Corp' };
const project = { id: 5000001, workspace_id: WS, name: 'Website Redesign' };
const task = { id: 1, workspace_id: WS, project_id: project.id, name: 'Task' };
const tag = { id: 6000001, workspace_id: WS, name: 'billable' };
const entry = {
	id: 7000001,
	workspace_id: WS,
	start: '2026-08-09T09:50:42Z',
	duration: 3600,
};

const originalFetch = global.fetch;
afterAll(() => {
	global.fetch = originalFetch;
});
beforeEach(() => {
	lastCall = undefined;
});

describe('me', () => {
	it('gets the profile and strips the api_token', async () => {
		const { ctx } = makeCtx();
		mockResponse({ id: 1, email: 'a@b.com', api_token: 'super-secret' });

		const result = await Me.get(ctx, {});

		expect(requested().url).toBe(`${BASE}/me`);
		expect(requested().method).toBe('GET');
		expect(result).not.toHaveProperty('api_token');
		expect(result.email).toBe('a@b.com');
	});

	it('strips the api_token on update too', async () => {
		const { ctx } = makeCtx();
		mockResponse({ id: 1, email: 'a@b.com', api_token: 'super-secret' });

		const result = await Me.update(ctx, { fullname: 'New Name' });

		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ fullname: 'New Name' });
		expect(result).not.toHaveProperty('api_token');
	});

	it('reads preferences', async () => {
		const { ctx } = makeCtx();
		mockResponse({ date_format: 'YYYY-MM-DD' });
		await Me.getPreferences(ctx, {});
		expect(requested().url).toBe(`${BASE}/me/preferences`);
		expect(requested().method).toBe('GET');
	});

	it('writes preferences with POST', async () => {
		const { ctx } = makeCtx();
		mockResponse({ date_format: 'DD/MM/YYYY' });
		await Me.updatePreferences(ctx, { date_format: 'DD/MM/YYYY' });
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ date_format: 'DD/MM/YYYY' });
	});
});

describe('workspaces', () => {
	it('lists and caches each workspace', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([workspace]);

		const result = await Workspaces.list(ctx, {});

		expect(requested().url).toBe(`${BASE}/workspaces`);
		expect(result).toHaveLength(1);
		expect(db.workspaces.upsertByEntityId).toHaveBeenCalledWith(
			String(WS),
			expect.objectContaining({ id: WS, name: 'Workspace' }),
		);
	});

	it('gets one workspace and caches it', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(workspace);
		await Workspaces.get(ctx, { workspace_id: WS });
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}`);
		expect(db.workspaces.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('updates a workspace with PUT', async () => {
		const { ctx } = makeCtx();
		mockResponse(workspace);
		await Workspaces.update(ctx, { workspace_id: WS, name: 'Renamed' });
		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ name: 'Renamed' });
	});

	it('lists workspace users', async () => {
		const { ctx } = makeCtx();
		mockResponse([{ id: 1, email: 'a@b.com' }]);
		const result = await Workspaces.getUsers(ctx, { workspace_id: WS });
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/users`);
		expect(result).toHaveLength(1);
	});
});

describe('organizations', () => {
	it('gets an organization', async () => {
		const { ctx } = makeCtx();
		mockResponse({ id: 2000001, name: 'Example Org' });
		await Organizations.get(ctx, { organization_id: 2000001 });
		expect(requested().url).toBe(`${BASE}/organizations/2000001`);
	});

	it('renames an organization', async () => {
		const { ctx } = makeCtx();
		mockResponse({ id: 2000001, name: 'New Name' });
		await Organizations.update(ctx, {
			organization_id: 2000001,
			name: 'New Name',
		});
		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ name: 'New Name' });
	});

	it('lists organization workspaces and caches them', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([workspace]);
		await Organizations.getWorkspaces(ctx, { organization_id: 2000001 });
		expect(requested().url).toBe(`${BASE}/organizations/2000001/workspaces`);
		// Same records as workspaces.list, so the mirror must not go stale.
		expect(db.workspaces.upsertByEntityId).toHaveBeenCalledWith(
			String(WS),
			expect.objectContaining({ id: WS, name: 'Workspace' }),
		);
	});
});

describe('clients', () => {
	it('lists and caches clients', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([client]);
		const result = await Clients.list(ctx, { workspace_id: WS });
		expect(requested().url).toContain(`${BASE}/workspaces/${WS}/clients`);
		expect(result).toHaveLength(1);
		expect(db.clients.upsertByEntityId).toHaveBeenCalledWith(
			String(client.id),
			expect.objectContaining({ workspace_id: WS, name: 'Acme Corp' }),
		);
	});

	it('normalises a null client list into an empty array', async () => {
		const { ctx } = makeCtx();
		mockResponse(null);
		const result = await Clients.list(ctx, { workspace_id: WS });
		expect(result).toEqual([]);
	});

	it('gets a client', async () => {
		const { ctx } = makeCtx();
		mockResponse(client);
		await Clients.get(ctx, { workspace_id: WS, client_id: client.id });
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/clients/${client.id}`,
		);
	});

	it('creates a client without restating the workspace in the body', async () => {
		const { ctx } = makeCtx();
		mockResponse(client);
		await Clients.create(ctx, { workspace_id: WS, name: 'Acme Corp' });
		expect(requested().method).toBe('POST');
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/clients`);
		expect(requested().body).toMatchObject({ name: 'Acme Corp' });
		// The route already identifies the workspace.
		expect(requested().body).not.toHaveProperty('wid');
	});

	it('updates a client with name and notes, never archived', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...client, notes: 'updated' });
		await Clients.update(ctx, {
			workspace_id: WS,
			client_id: client.id,
			name: 'Acme Corp',
			notes: 'updated',
		});
		expect(requested().method).toBe('PUT');
		// Toggl requires name on every update; archiving is a separate route.
		expect(requested().body).toMatchObject({
			name: 'Acme Corp',
			notes: 'updated',
		});
		expect(requested().body).not.toHaveProperty('archived');
	});

	it('archives a client through its own route and caches the record', async () => {
		const { ctx, db } = makeCtx();
		mockResponse({ ...client, archived: true });
		const result = await Clients.archive(ctx, {
			workspace_id: WS,
			client_id: client.id,
		});
		expect(requested().method).toBe('POST');
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/clients/${client.id}/archive`,
		);
		expect(result).toMatchObject({ id: client.id, archived: true });
		expect(db.clients.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('re-reads the client when archive answers with an id envelope', async () => {
		// Toggl answers with the ids it touched rather than a client record. That
		// carries no fields to cache, but leaving the row untouched would keep
		// reporting the client as active, so the client is re-read instead.
		const { ctx, db } = makeCtx();
		let call = 0;
		global.fetch = (async (url: string, init: RequestInit) => {
			call += 1;
			lastCall = { url, init };
			const body =
				call === 1 ? { items: [client.id] } : { ...client, archived: true };
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => body,
				text: async () => JSON.stringify(body),
			};
		}) as unknown as typeof global.fetch;

		const result = await Clients.archive(ctx, {
			workspace_id: WS,
			client_id: client.id,
		});

		expect(result).toMatchObject({ items: [client.id] });
		expect(call).toBe(2);
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/clients/${client.id}`,
		);
		expect(db.clients.upsertByEntityId).toHaveBeenCalledWith(
			String(client.id),
			expect.objectContaining({ archived: true }),
		);
	});

	it('evicts the cached client when the re-read fails', async () => {
		const { ctx, db } = makeCtx();
		let call = 0;
		global.fetch = (async (url: string, init: RequestInit) => {
			call += 1;
			lastCall = { url, init };
			if (call > 1) throw new Error('network down');
			const body = { items: [client.id] };
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => body,
				text: async () => JSON.stringify(body),
			};
		}) as unknown as typeof global.fetch;
		jest.spyOn(console, 'warn').mockImplementation(() => {});

		await Clients.archive(ctx, { workspace_id: WS, client_id: client.id });

		// A cache miss is safe; a stale hit saying the client is active is not.
		expect(db.clients.deleteByEntityId).toHaveBeenCalledWith(String(client.id));
		expect(db.clients.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('sends notes on create', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...client, notes: 'a note' });
		await Clients.create(ctx, {
			workspace_id: WS,
			name: 'Acme Corp',
			notes: 'a note',
		});
		expect(requested().body).toMatchObject({ notes: 'a note' });
	});

	it('deletes a client and evicts it from the cache', async () => {
		const { ctx, db } = makeCtx();
		mockResponse({});
		const result = await Clients.delete(ctx, {
			workspace_id: WS,
			client_id: client.id,
		});
		expect(requested().method).toBe('DELETE');
		expect(result).toEqual({ deleted: true, id: client.id });
		expect(db.clients.deleteByEntityId).toHaveBeenCalledWith(String(client.id));
	});
});

describe('projects', () => {
	it('lists and caches projects, passing pagination through', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([project]);
		await Projects.list(ctx, { workspace_id: WS, page: 2, per_page: 50 });
		expect(requested().url).toContain('page=2');
		expect(requested().url).toContain('per_page=50');
		expect(db.projects.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('gets a project', async () => {
		const { ctx } = makeCtx();
		mockResponse(project);
		await Projects.get(ctx, { workspace_id: WS, project_id: project.id });
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/projects/${project.id}`,
		);
	});

	it('creates a project', async () => {
		const { ctx } = makeCtx();
		mockResponse(project);
		await Projects.create(ctx, {
			workspace_id: WS,
			name: 'Website Redesign',
			client_id: client.id,
		});
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({
			name: 'Website Redesign',
			client_id: client.id,
		});
	});

	it('updates a project', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...project, active: false });
		await Projects.update(ctx, {
			workspace_id: WS,
			project_id: project.id,
			active: false,
		});
		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ active: false });
	});

	it('deletes a project and evicts it', async () => {
		const { ctx, db } = makeCtx();
		mockResponse({});
		const result = await Projects.delete(ctx, {
			workspace_id: WS,
			project_id: project.id,
		});
		expect(result).toEqual({ deleted: true, id: project.id });
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith(
			String(project.id),
		);
	});
});

describe('tasks', () => {
	it('lists tasks under a project', async () => {
		const { ctx } = makeCtx();
		mockResponse([task]);
		const result = await Tasks.list(ctx, {
			workspace_id: WS,
			project_id: project.id,
		});
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/projects/${project.id}/tasks`,
		);
		expect(result).toHaveLength(1);
	});

	it('omits page params on the project-scoped route', async () => {
		const { ctx } = makeCtx();
		mockResponse([task]);
		await Tasks.list(ctx, {
			workspace_id: WS,
			project_id: project.id,
			active: true,
			page: 2,
			per_page: 50,
		});
		// Toggl documents `active` alone on this route.
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/projects/${project.id}/tasks?active=true`,
		);
	});

	it('paginates the workspace-wide route and unwraps its envelope', async () => {
		const { ctx } = makeCtx();
		mockResponse({ data: [task] });
		const result = await Tasks.list(ctx, {
			workspace_id: WS,
			page: 2,
			per_page: 50,
		});
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/tasks?page=2&per_page=50`,
		);
		expect(result).toHaveLength(1);
	});

	it('gets a task', async () => {
		const { ctx } = makeCtx();
		mockResponse(task);
		await Tasks.get(ctx, {
			workspace_id: WS,
			project_id: project.id,
			task_id: task.id,
		});
		expect(requested().url).toContain(`/tasks/${task.id}`);
	});

	it('creates a task', async () => {
		const { ctx } = makeCtx();
		mockResponse(task);
		await Tasks.create(ctx, {
			workspace_id: WS,
			project_id: project.id,
			name: 'Task',
		});
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ name: 'Task' });
	});

	it('updates a task', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...task, active: false });
		await Tasks.update(ctx, {
			workspace_id: WS,
			project_id: project.id,
			task_id: task.id,
			active: false,
		});
		expect(requested().method).toBe('PUT');
	});

	it('deletes a task', async () => {
		const { ctx } = makeCtx();
		mockResponse({});
		const result = await Tasks.delete(ctx, {
			workspace_id: WS,
			project_id: project.id,
			task_id: task.id,
		});
		expect(requested().method).toBe('DELETE');
		expect(result).toEqual({ deleted: true, id: task.id });
	});
});

describe('tags', () => {
	it('lists and caches tags', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([tag]);
		await Tags.list(ctx, { workspace_id: WS });
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/tags`);
		expect(db.tags.upsertByEntityId).toHaveBeenCalledWith(
			String(tag.id),
			expect.objectContaining({ name: 'billable' }),
		);
	});

	it('creates a tag', async () => {
		const { ctx } = makeCtx();
		mockResponse(tag);
		await Tags.create(ctx, { workspace_id: WS, name: 'billable' });
		expect(requested().method).toBe('POST');
		expect(requested().body).toMatchObject({ name: 'billable' });
	});

	it('renames a tag', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...tag, name: 'renamed' });
		await Tags.update(ctx, {
			workspace_id: WS,
			tag_id: tag.id,
			name: 'renamed',
		});
		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ name: 'renamed' });
	});

	it('deletes a tag and evicts it', async () => {
		const { ctx, db } = makeCtx();
		mockResponse({});
		const result = await Tags.delete(ctx, { workspace_id: WS, tag_id: tag.id });
		expect(result).toEqual({ deleted: true, id: tag.id });
		expect(db.tags.deleteByEntityId).toHaveBeenCalledWith(String(tag.id));
	});
});

describe('time entries', () => {
	it('lists the current user entries', async () => {
		const { ctx } = makeCtx();
		mockResponse([entry]);
		const result = await TimeEntries.list(ctx, {
			start_date: '2026-08-01',
			end_date: '2026-08-12',
		});
		expect(requested().url).toContain(`${BASE}/me/time_entries`);
		expect(requested().url).toContain('start_date=2026-08-01');
		expect(result).toHaveLength(1);
	});

	it('normalises a null entry list into an empty array', async () => {
		const { ctx } = makeCtx();
		mockResponse(null);
		expect(await TimeEntries.list(ctx, {})).toEqual([]);
	});

	it('returns null when no timer is running', async () => {
		const { ctx } = makeCtx();
		mockResponse(null);
		expect(await TimeEntries.getCurrent(ctx, {})).toBeNull();
	});

	it('gets one entry', async () => {
		const { ctx } = makeCtx();
		mockResponse(entry);
		await TimeEntries.get(ctx, { time_entry_id: entry.id });
		expect(requested().url).toBe(`${BASE}/me/time_entries/${entry.id}`);
	});

	it('creates an entry and defaults created_with', async () => {
		const { ctx } = makeCtx();
		mockResponse(entry);
		await TimeEntries.create(ctx, {
			workspace_id: WS,
			start: '2026-08-12T10:00:00Z',
			duration: -1,
		});
		expect(requested().url).toBe(`${BASE}/workspaces/${WS}/time_entries`);
		expect(requested().body).toMatchObject({
			workspace_id: WS,
			duration: -1,
			created_with: 'corsair',
		});
	});

	it('respects an explicit created_with', async () => {
		const { ctx } = makeCtx();
		mockResponse(entry);
		await TimeEntries.create(ctx, {
			workspace_id: WS,
			start: '2026-08-12T10:00:00Z',
			duration: 60,
			created_with: 'my-app',
		});
		expect(requested().body).toMatchObject({ created_with: 'my-app' });
	});

	it('updates an entry', async () => {
		const { ctx } = makeCtx();
		mockResponse({ ...entry, description: 'Updated' });
		await TimeEntries.update(ctx, {
			workspace_id: WS,
			time_entry_id: entry.id,
			description: 'Updated',
		});
		expect(requested().method).toBe('PUT');
		expect(requested().body).toMatchObject({ description: 'Updated' });
	});

	it('stops a running entry with PATCH', async () => {
		const { ctx } = makeCtx();
		mockResponse(entry);
		await TimeEntries.stop(ctx, {
			workspace_id: WS,
			time_entry_id: entry.id,
		});
		expect(requested().method).toBe('PATCH');
		expect(requested().url).toBe(
			`${BASE}/workspaces/${WS}/time_entries/${entry.id}/stop`,
		);
	});

	it('deletes an entry', async () => {
		const { ctx } = makeCtx();
		mockResponse({});
		const result = await TimeEntries.delete(ctx, {
			workspace_id: WS,
			time_entry_id: entry.id,
		});
		expect(requested().method).toBe('DELETE');
		expect(result).toEqual({ deleted: true, id: entry.id });
	});
});
