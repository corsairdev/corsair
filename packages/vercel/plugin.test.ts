import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { vercel } from './index';

// End to end through createCorsair with Vercel's HTTP mocked: the binder, the
// keyBuilder reading the stored token, the stored team, the local store and
// the event log, the way an app runs the plugin.

const fetchMock = jest.fn();

beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock as unknown as typeof fetch;
});

async function setup() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'vercel', 'default');
	const corsair = createCorsair({
		plugins: [vercel()],
		database: testDb.db,
		kek: 'test-kek-12345678901234567890123456789012',
	});
	await corsair.vercel.keys.issue_new_dek();
	await corsair.vercel.keys.set_api_key('stored-token');
	return { corsair, testDb };
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) ?? [];
	return { url: new URL(String(url)), init: init as RequestInit };
}

describe('Vercel plugin through createCorsair', () => {
	it('sends the stored token, stores projects without env values and logs the call', async () => {
		const { corsair, testDb } = await setup();
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					projects: [
						{
							id: 'prj_1',
							name: 'site',
							framework: 'nextjs',
							env: [{ key: 'API_KEY', value: 'very-secret' }],
						},
					],
					pagination: { count: 1, next: null, prev: null },
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const result = await corsair.vercel.api.projects.getProjects({ limit: 1 });
		expect(result.projects[0]?.name).toBe('site');

		const { url, init } = lastRequest();
		expect(url.pathname).toBe('/v10/projects');
		expect(new Headers(init.headers).get('Authorization')).toBe(
			'Bearer stored-token',
		);

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.projects.getProjects' },
		});
		expect(events.length).toBe(1);

		const stored = await corsair.vercel.db.projects.findByEntityId('prj_1');
		expect(stored?.data).toMatchObject({ name: 'site', framework: 'nextjs' });
		expect(JSON.stringify(stored)).not.toContain('very-secret');

		testDb.cleanup();
	});

	it('scopes calls to the team saved on the connection', async () => {
		const { corsair, testDb } = await setup();
		// team_id is declared in vercelAuthConfig, so the key manager has a setter
		// for it at runtime; the generic key-manager type doesn't list it.
		const keys = corsair.vercel.keys as unknown as {
			set_team_id: (value: string) => Promise<void>;
		};
		await keys.set_team_id('team_saved');
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 'prj_1', name: 'site' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await corsair.vercel.api.projects.getProject({ idOrName: 'site' });
		expect(lastRequest().url.searchParams.get('teamId')).toBe('team_saved');

		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 'prj_1', name: 'site' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await corsair.vercel.api.projects.getProject({
			idOrName: 'site',
			teamId: 'other-team',
		});
		expect(lastRequest().url.searchParams.get('slug')).toBe('other-team');
		expect(lastRequest().url.searchParams.has('teamId')).toBe(false);

		testDb.cleanup();
	});
});
