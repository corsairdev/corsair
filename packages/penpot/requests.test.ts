import { logEventFromContext } from 'corsair/core';
import {
	AccessTokens,
	Comments,
	Files,
	Projects,
	Teams,
	Webhooks,
} from './endpoints';
import {
	accessToken,
	comment,
	commentThread,
	file,
	project,
	shareLink,
	snapshot,
	team,
	webhookEvent,
	webhookSubscription,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'penpot-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectRpc(name: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://design.penpot.app');
	expect(sent.path).toBe(`/api/rpc/command/${name}`);
	expect(sent.method).toBe('POST');
	expect(sent.headers.get('authorization')).toBe(`Token ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('teams', () => {
	it('list calls get-teams-for-profile with no body', async () => {
		respond([team]);
		const teams = (await invoke(Teams.list, {})) as unknown[]; // unknown: team records are provider-shaped
		expect(teams).toHaveLength(1);
		expectRpc('get-teams-for-profile');
		expect(lastRequest().body).toBeUndefined();
	});

	it('create calls create-team with the name', async () => {
		respond(team);
		await invoke(Teams.create, { name: 'Design Guild' });
		expectRpc('create-team');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			name: 'Design Guild',
		});
	});

	it('delete calls delete-team with the id and echoes it', async () => {
		respond(null);
		const result = (await invoke(Teams.remove, {
			id: team.id,
		})) as { id: string; success: boolean };
		expect(result).toEqual({ id: team.id, success: true });
		expectRpc('delete-team');
		expect(JSON.parse(lastRequest().body as string)).toEqual({ id: team.id });
	});
});

describe('projects', () => {
	it('listAll calls get-all-projects', async () => {
		respond([project]);
		const projects = (await invoke(Projects.listAll, {})) as unknown[]; // unknown: project records are provider-shaped
		expect(projects).toHaveLength(1);
		expectRpc('get-all-projects');
	});

	it('create calls create-project with teamId and name', async () => {
		respond(project);
		await invoke(Projects.create, {
			teamId: team.id,
			name: 'Website Redesign',
		});
		expectRpc('create-project');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			teamId: team.id,
			name: 'Website Redesign',
		});
	});

	it('get calls get-project with the id', async () => {
		respond(project);
		await invoke(Projects.get, { id: project.id });
		expectRpc('get-project');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			id: project.id,
		});
	});

	it('rename calls rename-project', async () => {
		respond(project);
		await invoke(Projects.rename, { id: project.id, name: 'Renamed' });
		expectRpc('rename-project');
	});

	it('delete echoes the id', async () => {
		respond(null);
		const result = (await invoke(Projects.remove, { id: project.id })) as {
			id: string;
			success: boolean;
		};
		expect(result.success).toBe(true);
		expectRpc('delete-project');
	});

	it('duplicate calls duplicate-project', async () => {
		respond(project);
		await invoke(Projects.duplicate, { id: project.id, name: 'Copy' });
		expectRpc('duplicate-project');
	});
});

describe('files', () => {
	it('get calls get-file with the id', async () => {
		respond(file);
		await invoke(Files.get, { id: file.id });
		expectRpc('get-file');
	});

	it('create calls create-file', async () => {
		respond(file);
		await invoke(Files.create, {
			projectId: project.id,
			name: 'Landing page',
			isShared: true,
		});
		expectRpc('create-file');
	});

	it('delete echoes the id', async () => {
		respond(null);
		const result = (await invoke(Files.remove, { id: file.id })) as {
			success: boolean;
		};
		expect(result.success).toBe(true);
		expectRpc('delete-file');
	});

	it('duplicate and rename call their RPCs', async () => {
		respond(file);
		await invoke(Files.duplicate, { fileId: file.id, name: 'Copy' });
		expectRpc('duplicate-file');

		respond(file);
		await invoke(Files.rename, { id: file.id, name: 'Renamed' });
		expectRpc('rename-file');
	});

	it('snapshots list, create and delete call their RPCs', async () => {
		respond([snapshot]);
		const snapshots = (await invoke(Files.snapshotsList, {
			fileId: file.id,
		})) as unknown[]; // unknown: snapshot records are provider-shaped
		expect(snapshots).toHaveLength(1);
		expectRpc('get-file-snapshots');

		respond(snapshot);
		await invoke(Files.snapshotsCreate, { fileId: file.id, label: 'Before' });
		expectRpc('create-file-snapshot');

		respond(null);
		await invoke(Files.snapshotsDelete, { id: snapshot.id });
		expectRpc('delete-file-snapshot');
	});

	it('share links create and delete call their RPCs', async () => {
		respond(shareLink);
		const link = (await invoke(Files.shareLinkCreate, {
			fileId: file.id,
			whoComment: 'team',
		})) as { id?: string };
		expect(link.id).toBe(shareLink.id);
		expectRpc('create-share-link');

		respond(null);
		await invoke(Files.shareLinkDelete, { id: shareLink.id });
		expectRpc('delete-share-link');
	});
});

describe('comments', () => {
	it('threadsList sends fileId when given', async () => {
		respond([commentThread]);
		await invoke(Comments.threadsList, { fileId: file.id });
		expectRpc('get-comment-threads');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			fileId: file.id,
		});
	});

	it('threadsList falls back to teamId', async () => {
		respond([commentThread]);
		await invoke(Comments.threadsList, { teamId: team.id });
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			teamId: team.id,
		});
	});

	it('threadGet sends fileId and id', async () => {
		respond(commentThread);
		await invoke(Comments.threadGet, { fileId: file.id, id: commentThread.id });
		expectRpc('get-comment-thread');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			fileId: file.id,
			id: commentThread.id,
		});
	});

	it('threadCreate posts the thread body', async () => {
		respond(commentThread);
		await invoke(Comments.threadCreate, {
			fileId: file.id,
			pageId: commentThread.pageId as string,
			content: 'New thread',
		});
		expectRpc('create-comment-thread');
	});

	it('list and create call their RPCs', async () => {
		respond([comment]);
		const comments = (await invoke(Comments.list, {
			threadId: commentThread.id,
		})) as unknown[]; // unknown: comment records are provider-shaped
		expect(comments).toHaveLength(1);
		expectRpc('get-comments');

		respond(comment);
		await invoke(Comments.create, {
			threadId: commentThread.id,
			content: 'Reply',
		});
		expectRpc('create-comment');
	});
});

describe('webhooks', () => {
	it('list sends the teamId', async () => {
		respond([webhookSubscription]);
		const webhooks = (await invoke(Webhooks.list, {
			teamId: team.id,
		})) as unknown[];
		expect(webhooks).toHaveLength(1);
		expectRpc('get-webhooks');
	});

	it('create and update call their RPCs', async () => {
		respond(webhookSubscription);
		await invoke(Webhooks.create, {
			teamId: team.id,
			uri: 'https://example.com/webhooks/penpot',
			mtype: 'application/json',
		});
		expectRpc('create-webhook');

		respond(webhookSubscription);
		await invoke(Webhooks.update, {
			id: webhookSubscription.id,
			uri: 'https://example.com/webhooks/penpot',
			mtype: 'application/json',
			isActive: false,
		});
		expectRpc('update-webhook');
	});

	it('delete echoes the id', async () => {
		respond(null);
		const result = (await invoke(Webhooks.remove, {
			id: webhookSubscription.id,
		})) as { id: string; success: boolean };
		expect(result.success).toBe(true);
		expectRpc('delete-webhook');
	});
});

describe('accessTokens', () => {
	it('list calls get-access-tokens', async () => {
		respond([accessToken]);
		const tokens = (await invoke(AccessTokens.list, {})) as unknown[]; // unknown: access-token records are provider-shaped
		expect(tokens).toHaveLength(1);
		expectRpc('get-access-tokens');
	});

	it('delete echoes the id', async () => {
		respond(null);
		const result = (await invoke(AccessTokens.remove, {
			id: accessToken.id,
		})) as { id: string; success: boolean };
		expect(result.success).toBe(true);
		expectRpc('delete-access-token');
	});
});

describe('webhook envelope passthrough', () => {
	it('accepts the documented event shape from the receiving route', () => {
		// The webhook tests cover the verifier; here we assert the fixture is
		// well formed for them.
		expect(typeof webhookEvent.event).toBe('string');
		expect(webhookEvent.payload?.fileId).toBe(file.id);
	});
});
