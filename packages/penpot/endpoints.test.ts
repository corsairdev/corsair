import { logEventFromContext } from 'corsair/core';
import { Comments, Projects, Teams, Webhooks } from './endpoints';
import { commentThread, team } from './test-fixtures';

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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a team with its id', async () => {
		respond(team);
		const result = (await invoke(Teams.create, { name: 'Design Guild' })) as {
			id?: string;
		};
		expect(result.id).toBe(team.id);
	});

	it('parses a comment thread with its page', async () => {
		respond(commentThread);
		const result = (await invoke(Comments.threadGet, {
			fileId: file.id,
			id: commentThread.id,
		})) as { pageId?: string };
		expect(result.pageId).toBe(commentThread.pageId);
	});
});

describe('input validation', () => {
	it('rejects a create-team name over 250 characters', async () => {
		await rejects(Teams.create, { name: 'x'.repeat(251) }, '250');
	});

	it('rejects a Transit webhook format, which the receiver cannot decode', async () => {
		await rejects(
			Webhooks.create,
			{
				teamId: '5f2a1c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
				uri: 'https://example.com/hooks',
				mtype: 'application/transit+json',
			},
			'application/json',
		);
	});

	it('rejects a threadsList without a fileId', async () => {
		await rejects(Comments.threadsList, { teamId: 'x' }, 'fileId');
	});

	it('rejects a comment over 750 characters', async () => {
		await rejects(
			Comments.create,
			{ threadId: commentThread.id, content: 'x'.repeat(751) },
			'750',
		);
	});

	it('rejects a team id that is not a UUID', async () => {
		await rejects(Teams.remove, { id: 'not-a-uuid' }, 'UUID');
	});
});

describe('error envelope passthrough', () => {
	it('surfaces the documented authentication error', async () => {
		respond(
			{
				type: 'authentication',
				code: 'authentication-required',
				hint: 'authentication required for this endpoint',
			},
			401,
		);
		await rejects(Projects.listAll, {}, 'authentication required');
	});

	it('surfaces a 404 for an RPC name the instance does not serve', async () => {
		respond({ hint: 'The requested endpoint was not found' }, 404);
		await rejects(Projects.listAll, {}, 'endpoint was not found');
	});
});

// Referenced by threadGet; imported here so the fixture stays exercised.
import { file } from './test-fixtures';

const fileIdProbe = file.id;
describe('fixture sanity', () => {
	it('carries a uuid file id', () => {
		expect(fileIdProbe).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		);
	});
});
