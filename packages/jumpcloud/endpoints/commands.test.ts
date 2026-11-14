import type { JumpCloudContext } from '../index';
import {
	commandsCreate,
	commandsGet,
	commandsList,
	commandsRun,
} from './commands';

jest.mock('corsair/core', () => {
	// unknown: core's export surface is intentionally opaque to plugin
	// tests; the record cast only preserves requireActual while stubbing
	// the event logger.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// The shared HTTP boundary of this plugin is the client's fetch transport.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures intentionally cover every family's documented response
// shapes; the endpoint output schemas, not this helper, enforce the contract.
function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

const mockCtx = { key: 'jc-test-key' } as never as JumpCloudContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('commands family (mocked JumpCloud transport)', () => {
	it('commands.list calls API v1 GET /commands with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [
						{
							_id: 'cmd-1',
							name: 'deploy',
							command: 'echo hi',
							commandType: 'linux',
						},
					],
					totalCount: 1,
				}),
			),
		);

		const result = await commandsList(mockCtx, {
			limit: 10,
			skip: 20,
			sort: 'name',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/commands?limit=10&skip=20&sort=name',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });
		expect(result).toEqual({
			results: [
				{
					_id: 'cmd-1',
					name: 'deploy',
					command: 'echo hi',
					commandType: 'linux',
				},
			],
			totalCount: 1,
		});
	});

	it('commands.create calls API v1 POST /commands forwarding the command body as JSON', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					command: 'echo hi',
					commandType: 'linux',
					name: 'echo-hi',
				}),
			),
		);

		const result = await commandsCreate(mockCtx, {
			body: { command: 'echo hi', commandType: 'linux', name: 'echo-hi' },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/commands');
		expect(init).toMatchObject({ method: 'POST' });
		// The handler forwards the command payload verbatim as the JSON body.
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			command: 'echo hi',
			commandType: 'linux',
			name: 'echo-hi',
		});
		expect(init?.headers).toMatchObject({
			'Content-Type': 'application/json',
		});
		expect(result).toEqual({
			command: 'echo hi',
			commandType: 'linux',
			name: 'echo-hi',
		});
	});

	it('commands.get calls API v1 GET /commands/{id}', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					command: 'echo hi',
					commandType: 'linux',
					name: 'deploy',
				}),
			),
		);

		const result = await commandsGet(mockCtx, { id: 'cmd-1' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/commands/cmd-1',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual({
			command: 'echo hi',
			commandType: 'linux',
			name: 'deploy',
		});
	});

	it('commands.run calls API v1 POST /runCommand with the body JSON', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ queueIds: ['queue-1'], workflowInstanceId: 'wf-1' }),
			),
		);

		const result = await commandsRun(mockCtx, {
			body: { _id: 'cmd-1', systemIds: ['sys-123'] },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/runCommand');
		expect(init).toMatchObject({ method: 'POST' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			_id: 'cmd-1',
			systemIds: ['sys-123'],
		});
		expect(result).toEqual({
			queueIds: ['queue-1'],
			workflowInstanceId: 'wf-1',
		});
	});
});
