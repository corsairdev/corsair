import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { teamcamp } from './index';
import { project, projectDetail, task, workspace } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'teamcamp', 'default');
	const corsair = createCorsair({
		plugins: [teamcamp()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.teamcamp.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are a bare array, an object, or a bare JSON string.
function respond(raw: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof raw === 'string' ? raw : JSON.stringify(raw), {
			status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Teamcamp through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.teamcamp.api.projects.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the workspace with the stored key in the apiKey header', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.teamcamp.keys.set_api_key('stored-key');
			respond(workspace);

			const result = await corsair.teamcamp.api.account.verify({});

			expect(result.workspaceId).toBe('5-YTy0zgMFoXJSV4joyB5');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new URL(url).pathname).toBe('/v1.0/verify');
			const headers = new Headers(init.headers);
			expect(headers.get('apikey')).toBe('stored-key');
			expect(headers.get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('creates a project and returns its workflow', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.teamcamp.keys.set_api_key('stored-key');
			respond(project);

			const result = await corsair.teamcamp.api.projects.create({
				projectName: 'Corsair Probe Project',
			});

			expect(result.projectId).toBe('0uUAD4N11-tUA00rNE2EB');
			expect(result.status).toHaveLength(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a project and its tasks through the bound client', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.teamcamp.keys.set_api_key('stored-key');
			respond(projectDetail);
			respond([
				{ taskId: task.taskId, taskName: task.taskName, status: false },
			]);

			const read = await corsair.teamcamp.api.projects.get({
				projectId: 'iPSOnKVs4zSOR5-vQTK_3',
			});
			const tasks = await corsair.teamcamp.api.tasks.list({
				projectId: read.projectId,
			});

			expect(tasks.tasks[0]?.taskId).toBe(task.taskId);
			const [url] = fetchMock.mock.calls[1] as [string];
			expect(new URL(url).searchParams.get('projectId')).toBe(
				'iPSOnKVs4zSOR5-vQTK_3',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
