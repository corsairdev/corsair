/**
 * Live integration tests against the real Toggl Track API.
 *
 * These are excluded from CI (`--testPathIgnorePatterns` in pr-checks.yml)
 * because CI has no Toggl credentials. Run them locally to verify the plugin
 * against a real account:
 *
 *   TOGGL_API_TOKEN=<token> TOGGL_WORKSPACE_ID=<id> pnpm exec jest integration
 *
 * The suite skips itself when TOGGL_API_TOKEN is absent, so it never fails a
 * checkout that has no credentials.
 *
 * Everything created is registered for cleanup immediately and removed in
 * afterEach, so a failing assertion mid-test cannot leave residue behind in the
 * Toggl account.
 */
import { makeTogglRequest } from './client';
import {
	TogglClientSchema,
	TogglEndpointOutputSchemas,
	TogglProjectSchema,
	TogglTagSchema,
	TogglTimeEntrySchema,
	TogglUserSchema,
	TogglWorkspaceSchema,
} from './endpoints/types';

const TOKEN = process.env.TOGGL_API_TOKEN;
const WORKSPACE_ID = process.env.TOGGL_WORKSPACE_ID
	? Number(process.env.TOGGL_WORKSPACE_ID)
	: undefined;

const describeLive = TOKEN ? describe : describe.skip;

// Toggl paces requests at roughly 1/sec per token; keep a margin between calls.
const PACE_MS = 1100;

/**
 * Waits out Toggl's leaky bucket so a live run does not spend its retry budget
 * on self-inflicted 429s.
 */
const pace = () => new Promise((resolve) => setTimeout(resolve, PACE_MS));

describeLive('Toggl live API', () => {
	jest.setTimeout(180_000);

	const token = TOKEN as string;
	let workspaceId: number;

	/** Paths to DELETE once the current test finishes, however it finishes. */
	let cleanup: string[] = [];

	function disposable(path: string) {
		cleanup.push(path);
	}

	afterEach(async () => {
		for (const path of cleanup.reverse()) {
			try {
				await pace();
				await makeTogglRequest<unknown>(path, token, { method: 'DELETE' });
			} catch (error) {
				console.warn(`[cleanup] could not delete ${path}:`, error);
			}
		}
		cleanup = [];
	});

	beforeAll(async () => {
		if (WORKSPACE_ID) {
			workspaceId = WORKSPACE_ID;
			return;
		}
		const workspaces = await makeTogglRequest<unknown>('workspaces', token);
		const parsed = TogglEndpointOutputSchemas.workspacesList.parse(workspaces);
		const first = parsed[0];
		if (!first) {
			throw new Error(
				'The Toggl account has no workspace. Set TOGGL_WORKSPACE_ID or create one.',
			);
		}
		workspaceId = first.id;
	});

	it('returns the authenticated user matching the declared schema', async () => {
		// `beforeAll` may have just spent a request discovering the workspace, so
		// this keeps the leaky-bucket margin even for the first test.
		await pace();
		const me = await makeTogglRequest<unknown>('me', token);
		const parsed = TogglUserSchema.parse(me);
		expect(typeof parsed.id).toBe('number');
		expect(parsed.email).toContain('@');
	});

	it('never exposes the api_token through the declared user schema', async () => {
		await pace();
		const me = await makeTogglRequest<Record<string, unknown>>('me', token);
		// The raw provider response does carry the credential...
		expect(me).toHaveProperty('api_token');
		// ...but the schema the plugin returns through must drop it.
		expect(TogglUserSchema.parse(me)).not.toHaveProperty('api_token');
	});

	it('returns workspaces matching the declared schema', async () => {
		await pace();
		const workspaces = await makeTogglRequest<unknown>('workspaces', token);
		const parsed = TogglEndpointOutputSchemas.workspacesList.parse(workspaces);
		expect(parsed.length).toBeGreaterThan(0);
		const match = parsed.find((w) => w.id === workspaceId);
		expect(TogglWorkspaceSchema.parse(match).id).toBe(workspaceId);
	});

	it('round-trips a client through create, read and delete', async () => {
		await pace();
		const created = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/clients`,
			token,
			{
				method: 'POST',
				body: { name: 'Corsair Test Client', wid: workspaceId },
			},
		);
		const client = TogglClientSchema.parse(created);
		disposable(`workspaces/${workspaceId}/clients/${client.id}`);
		expect(client.name).toBe('Corsair Test Client');

		await pace();
		const fetched = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/clients/${client.id}`,
			token,
		);
		expect(TogglClientSchema.parse(fetched).id).toBe(client.id);
	});

	it('round-trips a project through create, list and delete', async () => {
		await pace();
		const created = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/projects`,
			token,
			{ method: 'POST', body: { name: 'Corsair Test Project', active: true } },
		);
		const project = TogglProjectSchema.parse(created);
		disposable(`workspaces/${workspaceId}/projects/${project.id}`);
		expect(project.name).toBe('Corsair Test Project');

		await pace();
		const listed = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/projects`,
			token,
		);
		const projects = TogglEndpointOutputSchemas.projectsList.parse(listed);
		expect(projects.some((p) => p.id === project.id)).toBe(true);
	});

	it('round-trips a tag through create, rename and delete', async () => {
		await pace();
		const created = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/tags`,
			token,
			{ method: 'POST', body: { name: 'corsair-test-tag' } },
		);
		const tag = TogglTagSchema.parse(created);
		disposable(`workspaces/${workspaceId}/tags/${tag.id}`);

		await pace();
		const renamed = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/tags/${tag.id}`,
			token,
			{ method: 'PUT', body: { name: 'corsair-test-tag-renamed' } },
		);
		expect(TogglTagSchema.parse(renamed).name).toBe('corsair-test-tag-renamed');
	});

	it('starts, stops and deletes a running time entry', async () => {
		await pace();
		const started = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/time_entries`,
			token,
			{
				method: 'POST',
				body: {
					description: 'Corsair integration test',
					start: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
					// A negative duration marks the entry as still running.
					duration: -1,
					workspace_id: workspaceId,
					created_with: 'corsair-toggl-plugin',
				},
			},
		);
		const entry = TogglTimeEntrySchema.parse(started);
		// Registered before any assertion, so a running timer cannot be orphaned.
		disposable(`workspaces/${workspaceId}/time_entries/${entry.id}`);
		expect(entry.duration).toBeLessThan(0);

		await pace();
		const current = await makeTogglRequest<unknown>(
			'me/time_entries/current',
			token,
		);
		expect(TogglTimeEntrySchema.parse(current).id).toBe(entry.id);

		await pace();
		const stopped = await makeTogglRequest<unknown>(
			`workspaces/${workspaceId}/time_entries/${entry.id}/stop`,
			token,
			{ method: 'PATCH' },
		);
		expect(TogglTimeEntrySchema.parse(stopped).duration).toBeGreaterThanOrEqual(
			0,
		);
	});

	it('lists time entries matching the declared schema', async () => {
		await pace();
		const entries = await makeTogglRequest<unknown>('me/time_entries', token);
		const parsed = TogglEndpointOutputSchemas.timeEntriesList.parse(
			entries ?? [],
		);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('surfaces a clear error for an unknown resource', async () => {
		await pace();
		// A syntactically valid id that cannot correspond to a real client,
		// rather than a low id that might legitimately exist in the workspace.
		await expect(
			makeTogglRequest<unknown>(
				`workspaces/${workspaceId}/clients/999999999999`,
				token,
			),
		).rejects.toThrow();
	});
});
