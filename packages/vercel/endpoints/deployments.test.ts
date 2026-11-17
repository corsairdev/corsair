import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { VercelDeploymentSchema } from '../schema/database';
import {
	cancelDeployment,
	createDeployment,
	deleteDeployment,
	getDeployment,
	getDeploymentEvents,
	getDeploymentFiles,
	getDeployments,
} from './deployments';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const upsert = jest.fn();
const remove = jest.fn();
const ctx = {
	key: 'test-token',
	options: {},
	db: { deployments: { upsertByEntityId: upsert, deleteByEntityId: remove } },
} as unknown as VercelContext;

// Shapes as GET /v7/deployments and GET /v13/deployments return them live.
const listItem = {
	uid: 'dpl_1',
	name: 'site',
	url: null,
	created: 10,
	createdAt: 10,
	state: 'BUILDING',
	readyState: 'BUILDING',
	target: null,
	type: 'LAMBDAS',
	projectId: 'prj_1',
	creator: { uid: 'u1', username: 'dev' },
	aliasAssigned: null,
	inspectorUrl: null,
	somethingNew: { added: 'by vercel' },
};

const deployment = {
	id: 'dpl_2',
	name: 'site',
	url: 'site-abc.vercel.app',
	createdAt: 20,
	readyState: 'READY',
	status: 'READY',
	target: 'production',
	projectId: 'prj_1',
	aliasAssigned: true,
	aliasError: null,
	routes: null,
	deletedAt: null,
	alias: ['site.vercel.app'],
	env: ['API_URL'],
	build: { env: [] },
	gitSource: { type: 'github', ref: 'main', sha: 'abc', repoId: 1, prId: null },
	newField: 1,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('deployments', () => {
	it('getDeployments sends filters as query and stores deployments by uid without nulls', async () => {
		request.mockResolvedValueOnce({
			deployments: [listItem],
			pagination: { count: 1, next: 5, prev: null },
		});

		const result = await getDeployments(ctx, {
			teamId: 'team_1',
			projectIds: ['prj_1', 'prj_2'],
			state: ['READY', 'ERROR'],
			target: 'production',
			branch: 'main',
			rollbackCandidate: true,
			limit: 20,
			until: 99,
		});

		expect(request).toHaveBeenCalledWith('/v7/deployments', ctx, {
			teamId: 'team_1',
			query: {
				projectIds: ['prj_1', 'prj_2'],
				state: 'READY,ERROR',
				target: 'production',
				branch: 'main',
				rollbackCandidate: true,
				limit: 20,
				until: 99,
			},
		});
		expect(result.deployments[0]?.url).toBeNull();
		expect(result.deployments[0]?.somethingNew).toEqual({ added: 'by vercel' });
		expect(result.pagination?.next).toBe(5);
		const [uid, stored] = upsert.mock.calls[0] ?? [];
		expect(uid).toBe('dpl_1');
		expect(stored).toMatchObject({ uid: 'dpl_1', name: 'site', created: 10 });
		expect(stored).not.toHaveProperty('url');
		expect(stored).not.toHaveProperty('target');
		// Core parses upserts with the entity schema; nulls would fail it.
		expect(() => VercelDeploymentSchema.parse(stored)).not.toThrow();
		expect(() => VercelDeploymentSchema.parse(listItem)).toThrow();
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.deployments.getDeployments',
			expect.objectContaining({ branch: 'main' }),
			'completed',
		);
	});

	it('getDeployments sends a single state as is', async () => {
		request.mockResolvedValueOnce({ deployments: [] });
		await getDeployments(ctx, { state: 'READY' });
		expect(request).toHaveBeenCalledWith('/v7/deployments', ctx, {
			teamId: undefined,
			query: { state: 'READY' },
		});
	});

	it('getDeployments rejects bad filters before calling Vercel', async () => {
		await expect(
			getDeployments(ctx, { state: 'DONE' } as unknown as Parameters<
				typeof getDeployments
			>[1]),
		).rejects.toThrow();
		await expect(
			getDeployments(ctx, {
				projectIds: Array.from({ length: 21 }, (_, i) => `prj_${i}`),
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getDeployment encodes the hostname, passes withGitRepoInfo and stores the v13 id as uid', async () => {
		request.mockResolvedValueOnce(deployment);

		const result = await getDeployment(ctx, {
			idOrUrl: 'site-abc.vercel.app/x',
			withGitRepoInfo: true,
			teamId: 'my-team',
		});

		expect(request).toHaveBeenCalledWith(
			'/v13/deployments/site-abc.vercel.app%2Fx',
			ctx,
			{ teamId: 'my-team', query: { withGitRepoInfo: true } },
		);
		expect(result.id).toBe('dpl_2');
		expect(result.newField).toBe(1);
		const [uid, stored] = upsert.mock.calls[0] ?? [];
		expect(uid).toBe('dpl_2');
		expect(stored).toMatchObject({
			uid: 'dpl_2',
			created: 20,
			readyState: 'READY',
		});
		expect(stored).not.toHaveProperty('routes');
		expect(stored).not.toHaveProperty('id');
		expect(() => VercelDeploymentSchema.parse(stored)).not.toThrow();
	});

	it('getDeployment accepts the short response and rejects one without an id', async () => {
		request.mockResolvedValueOnce({
			id: 'dpl_3',
			readyState: 'ERROR',
			aliasAssigned: false,
			duration: 0,
		});
		await expect(
			getDeployment(ctx, { idOrUrl: 'dpl_3' }),
		).resolves.toMatchObject({
			id: 'dpl_3',
		});
		expect(request).toHaveBeenCalledWith('/v13/deployments/dpl_3', ctx, {
			teamId: undefined,
			query: {},
		});

		request.mockResolvedValueOnce({ uid: 'dpl_3', readyState: 'READY' });
		await expect(getDeployment(ctx, { idOrUrl: 'dpl_3' })).rejects.toThrow();
	});

	it('createDeployment posts a Git deployment with flags as 1/0 query values', async () => {
		request.mockResolvedValueOnce({ ...deployment, readyState: 'QUEUED' });

		const result = await createDeployment(ctx, {
			teamId: 'team_1',
			name: 'site',
			project: 'prj_1',
			target: 'production',
			gitSource: { type: 'github', org: 'acme', repo: 'site', ref: 'main' },
			projectSettings: { framework: 'nextjs', nodeVersion: '22.x' },
			meta: { reason: 'release' },
			forceNew: true,
			skipAutoDetectionConfirmation: false,
		});

		expect(request).toHaveBeenCalledWith('/v13/deployments', ctx, {
			method: 'POST',
			teamId: 'team_1',
			query: { forceNew: '1', skipAutoDetectionConfirmation: '0' },
			body: {
				name: 'site',
				project: 'prj_1',
				target: 'production',
				gitSource: { type: 'github', org: 'acme', repo: 'site', ref: 'main' },
				projectSettings: { framework: 'nextjs', nodeVersion: '22.x' },
				meta: { reason: 'release' },
			},
		});
		expect(result.readyState).toBe('QUEUED');
		expect(upsert).toHaveBeenCalledWith(
			'dpl_2',
			expect.objectContaining({ uid: 'dpl_2' }),
		);
	});

	it('createDeployment sends inline files but logs only their paths, and drops undocumented env', async () => {
		request.mockResolvedValueOnce(deployment);

		await createDeployment(ctx, {
			name: 'site',
			files: [
				{ file: 'index.html', data: 'SECRET_FILE_CONTENT', encoding: 'utf-8' },
				{ file: 'logo.png', sha: 'a1b2', size: 10 },
			],
			env: { API_KEY: 'secret-env-value' },
		} as Parameters<typeof createDeployment>[1]);

		const call = request.mock.calls[0]?.[2] as {
			body: Record<string, unknown>;
		};
		expect(call.body.files).toEqual([
			{ file: 'index.html', data: 'SECRET_FILE_CONTENT', encoding: 'utf-8' },
			{ file: 'logo.png', sha: 'a1b2', size: 10 },
		]);
		expect(call.body).not.toHaveProperty('env');
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).toContain('index.html');
		expect(logged).toContain('logo.png');
		expect(logged).not.toContain('SECRET_FILE_CONTENT');
		expect(logged).not.toContain('secret-env-value');
	});

	it('createDeployment redeploys an existing deployment', async () => {
		request.mockResolvedValueOnce(deployment);
		await createDeployment(ctx, {
			name: 'site',
			deploymentId: 'dpl_1',
			withLatestCommit: true,
			target: 'production',
		});
		expect(request).toHaveBeenCalledWith('/v13/deployments', ctx, {
			method: 'POST',
			teamId: undefined,
			query: {},
			body: {
				name: 'site',
				deploymentId: 'dpl_1',
				withLatestCommit: true,
				target: 'production',
			},
		});
	});

	it('createDeployment rejects invalid input before calling Vercel', async () => {
		await expect(
			createDeployment(ctx, {
				name: 'site',
				gitSource: { type: 'github', repoId: 1, ref: 'main' },
				files: [{ file: 'a.txt', data: 'a' }],
			}),
		).rejects.toThrow();
		await expect(
			createDeployment(ctx, {
				name: 'site',
				gitSource: { type: 'github', org: 'acme', repo: 'site' },
			} as unknown as Parameters<typeof createDeployment>[1]),
		).rejects.toThrow();
		await expect(
			createDeployment(ctx, {} as Parameters<typeof createDeployment>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('cancelDeployment patches the cancel route and stores the result', async () => {
		request.mockResolvedValueOnce({ ...deployment, readyState: 'CANCELED' });
		const result = await cancelDeployment(ctx, {
			deploymentId: 'dpl_2',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v12/deployments/dpl_2/cancel', ctx, {
			method: 'PATCH',
			teamId: 'team_1',
		});
		expect(result.readyState).toBe('CANCELED');
		expect(upsert).toHaveBeenCalledWith(
			'dpl_2',
			expect.objectContaining({ readyState: 'CANCELED' }),
		);
	});

	it('deleteDeployment by id deletes and clears the local record', async () => {
		request.mockResolvedValueOnce({ uid: 'dpl_2', state: 'DELETED' });
		await expect(
			deleteDeployment(ctx, { deploymentId: 'dpl_2', teamId: 'team_1' }),
		).resolves.toEqual({ uid: 'dpl_2', state: 'DELETED' });
		expect(request).toHaveBeenCalledWith('/v13/deployments/dpl_2', ctx, {
			method: 'DELETE',
			teamId: 'team_1',
			query: {},
		});
		expect(remove).toHaveBeenCalledWith('dpl_2');
	});

	it('deleteDeployment by url sends the url query', async () => {
		request.mockResolvedValueOnce({ uid: 'dpl_9', state: 'DELETED' });
		await deleteDeployment(ctx, { url: 'site-abc.vercel.app' });
		expect(request).toHaveBeenCalledWith(
			'/v13/deployments/site-abc.vercel.app',
			ctx,
			{
				method: 'DELETE',
				teamId: undefined,
				query: { url: 'site-abc.vercel.app' },
			},
		);
		expect(remove).toHaveBeenCalledWith('dpl_9');
	});

	it('deleteDeployment needs exactly one of deploymentId or url', async () => {
		await expect(deleteDeployment(ctx, {})).rejects.toThrow();
		await expect(
			deleteDeployment(ctx, { deploymentId: 'dpl_1', url: 'other.vercel.app' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getDeploymentEvents always sends follow=0 and maps flags to 1/0', async () => {
		request.mockResolvedValueOnce([
			{
				type: 'stdout',
				created: 1,
				date: 1,
				id: 'e1',
				deploymentId: 'dpl_2',
				serial: '1',
				text: 'Building',
				info: { type: 'build', name: 'bld_1', entrypoint: '.' },
			},
			{
				type: 'deployment-state',
				created: 2,
				payload: { state: 'READY' },
				extra: true,
			},
			{
				type: 'alias-assigned',
				date: 3,
				deploymentId: 'dpl_2',
				alias: [],
				aliasError: null,
			},
		]);

		const result = await getDeploymentEvents(ctx, {
			idOrUrl: 'dpl_2',
			teamId: 'team_1',
			direction: 'backward',
			limit: -1,
			builds: true,
			delimiter: false,
			statusCode: '5xx',
		});

		expect(request).toHaveBeenCalledWith('/v3/deployments/dpl_2/events', ctx, {
			teamId: 'team_1',
			query: {
				direction: 'backward',
				limit: -1,
				statusCode: '5xx',
				builds: 1,
				delimiter: 0,
				follow: 0,
			},
		});
		expect(result).toHaveLength(3);
		expect(result[1]?.payload).toEqual({ state: 'READY' });
		expect(result[1]?.extra).toBe(true);
	});

	it('getDeploymentEvents parses a newline-delimited body and skips blank lines', async () => {
		request.mockResolvedValueOnce(
			'{"type":"stdout","text":"one"}\n\n{"type":"stderr","text":"two"}\n',
		);
		const result = await getDeploymentEvents(ctx, { idOrUrl: 'dpl_2' });
		expect(result.map((event) => event.text)).toEqual(['one', 'two']);
	});

	it('getDeploymentEvents fails on a line that is not JSON instead of returning a shorter log', async () => {
		request.mockResolvedValueOnce(
			'{"type":"stdout","text":"one"}\n{"type":"stdout","te',
		);
		await expect(
			getDeploymentEvents(ctx, { idOrUrl: 'dpl_2' }),
		).rejects.toThrow(/aren't JSON/);
		expect(logEvent).not.toHaveBeenCalled();
	});

	it('getDeploymentEvents rejects limit 0 and events without a type', async () => {
		await expect(
			getDeploymentEvents(ctx, { idOrUrl: 'dpl_2', limit: 0 }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
		request.mockResolvedValueOnce([{ text: 'no type' }]);
		await expect(
			getDeploymentEvents(ctx, { idOrUrl: 'dpl_2' }),
		).rejects.toThrow();
	});

	it('getDeploymentFiles returns the file tree', async () => {
		request.mockResolvedValueOnce([
			{
				name: 'src',
				type: 'directory',
				mode: 16877,
				children: [{ name: 'index.js', type: 'file', mode: 33188, uid: 'f1' }],
			},
			{ name: 'api', type: 'lambda', mode: 0, uid: 'l1', contentType: null },
		]);
		const result = await getDeploymentFiles(ctx, {
			deploymentId: 'dpl_2',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v6/deployments/dpl_2/files', ctx, {
			teamId: 'team_1',
		});
		expect(result[0]?.children).toHaveLength(1);
		expect(result[1]?.contentType).toBeNull();
	});
});

describe('createDeployment event payload', () => {
	beforeEach(() => jest.clearAllMocks());

	it('masks build and install commands in projectSettings', async () => {
		request.mockResolvedValueOnce({ id: 'dpl_1', url: 'site.vercel.app' });
		await createDeployment(ctx, {
			name: 'site',
			files: [{ file: 'index.html', data: '<h1>hi</h1>' }],
			projectSettings: {
				framework: null,
				installCommand: 'npm config set //r/:_authToken=npm_SECRET && npm i',
				buildCommand: 'pnpm build',
				commandForIgnoringBuildStep:
					'git diff --quiet HEAD^ HEAD ./ || TOKEN=ign_SECRET exit 1',
			},
		});
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).not.toContain('npm_SECRET');
		expect(logged).not.toContain('ign_SECRET');
		expect(logged).not.toContain('pnpm build');
		expect(logged).toContain('[redacted]');
	});
});

describe('createDeployment meta in the event', () => {
	beforeEach(() => jest.clearAllMocks());

	it('logs meta keys, not values', async () => {
		request.mockResolvedValueOnce({ id: 'dpl_1', url: 'site.vercel.app' });
		await createDeployment(ctx, {
			name: 'site',
			files: [{ file: 'index.html', data: '<h1>hi</h1>' }],
			meta: { customerEmail: 'customer@example.com' },
		});
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).toContain('customerEmail');
		expect(logged).not.toContain('customer@example.com');
	});
});
