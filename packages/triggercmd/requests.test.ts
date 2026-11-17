import {
	CommandsEndpoints,
	ComputersEndpoints,
	PanelsEndpoints,
} from './endpoints';
import {
	command,
	commandsEnvelope,
	computersEnvelope,
	emptyEnvelope,
	panelButtonsEnvelope,
	runsEnvelope,
	triggerAccepted,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, when there is one.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://www.triggercmd.com');
	expect(sent.headers.get('authorization')).toBe('Bearer tc-test-token');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('commands', () => {
	it('commands.list POSTs to api/command/list', async () => {
		respond(commandsEnvelope);

		const result = (await invoke(CommandsEndpoints.list, {})) as {
			records: { name: string }[];
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/command/list',
			method: 'POST',
		});
		expect(result.records).toHaveLength(2);
		expect(result.records[0]?.name).toBe('notepad');
	});

	it('commands.list sends the computer filter when asked', async () => {
		respond(commandsEnvelope);

		await invoke(CommandsEndpoints.list, { computer_id: 7 });

		expect(lastRequest().params).toEqual({ computer_id: '7' });
	});

	it('commands.list sends no body on the POST', async () => {
		respond(emptyEnvelope);

		await invoke(CommandsEndpoints.list, {});

		expect(lastRequest().body).toBeUndefined();
	});

	it('commands.run POSTs the computer, trigger and params', async () => {
		respond(triggerAccepted);

		const result = (await invoke(CommandsEndpoints.run, {
			computer: 'laptop',
			trigger: 'notepad',
			params: 'MyNote',
		})) as { message?: string | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/run/trigger',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			computer: 'laptop',
			trigger: 'notepad',
			params: 'MyNote',
		});
		expect(result.message).toBe('Trigger sent.');
	});

	it('commands.run omits params entirely when not given', async () => {
		respond(triggerAccepted);

		await invoke(CommandsEndpoints.run, {
			computer: 'laptop',
			trigger: 'shutdown',
		});

		expect(lastRequest().body).toEqual({
			computer: 'laptop',
			trigger: 'shutdown',
		});
	});

	it('commands.run rejects an empty params string', async () => {
		// An empty string would pass an empty argument to the command, which is
		// not the same as omitting it.
		const error = await captureError(
			invoke(CommandsEndpoints.run, {
				computer: 'laptop',
				trigger: 'notepad',
				params: '',
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('commands.run rejects a missing computer', async () => {
		const error = await captureError(
			invoke(CommandsEndpoints.run, { trigger: 'notepad' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('commands.history GETs api/run/list with the command id', async () => {
		respond(runsEnvelope);

		const result = (await invoke(CommandsEndpoints.history, {
			command_id: 101,
		})) as { records: { status: string }[] };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/run/list',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({ command_id: '101' });
		expect(result.records).toHaveLength(2);
	});

	it('commands.history requires a command id', async () => {
		const error = await captureError(invoke(CommandsEndpoints.history, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('computers', () => {
	it('computers.list GETs api/computer/list', async () => {
		respond(computersEnvelope);

		const result = (await invoke(ComputersEndpoints.list, {})) as {
			records: { name: string }[];
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/computer/list',
			method: 'GET',
		});
		expect(result.records[0]?.name).toBe('laptop');
	});

	it('computers.list parses an account with no computer', async () => {
		respond(emptyEnvelope);

		const result = (await invoke(ComputersEndpoints.list, {})) as {
			records: unknown[];
		};

		expect(result.records).toEqual([]);
	});
});

describe('panels', () => {
	it('panels.list GETs api/panelbutton/list', async () => {
		respond(panelButtonsEnvelope);

		const result = (await invoke(PanelsEndpoints.list, {})) as {
			records: { name: string; panel?: { name?: string | null } }[];
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/panelbutton/list',
			method: 'GET',
		});
		expect(result.records[0]?.panel?.name).toBe('Living room');
	});

	it('panels.trigger GETs api/panel/trigger with the panel and button', async () => {
		respond(triggerAccepted);

		await invoke(PanelsEndpoints.trigger, {
			panel: 'Living room',
			button: 'Lights off',
			params: 'off',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/panel/trigger',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({
			panel: 'Living room',
			button: 'Lights off',
			params: 'off',
		});
	});

	it('panels.trigger requires both names', async () => {
		const error = await captureError(
			invoke(PanelsEndpoints.trigger, { panel: 'Living room' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('the records envelope', () => {
	it('rejects a list that lost its records key', async () => {
		respond([command]);

		const error = await captureError(invoke(CommandsEndpoints.list, {}));

		// A bare array is not the documented envelope; failing loudly beats
		// reporting an empty account.
		expect((error as Error).name).toBe('ZodError');
	});

	it('rejects a records value that is not an array', async () => {
		respond({ records: {} });

		const error = await captureError(invoke(CommandsEndpoints.list, {}));

		expect((error as Error).name).toBe('ZodError');
	});
});
