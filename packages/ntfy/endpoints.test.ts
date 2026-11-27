import { logEventFromContext } from 'corsair/core';
import { Account, Messages, Server } from './endpoints';
import {
	actionsMessage,
	anonymousAccount,
	clearedMessage,
	deletedMessage,
	health,
	notFound,
	pollNdjson,
	publishedMessage,
	serverStats,
	updatedMessage,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tk_0123456789abcdefghij0123456789';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: the return value is operation-specific; each test asserts through
// its own output schema parse rather than through this alias.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: inputs differ per operation, so the helper takes the raw value
// each test builds for its endpoint's input schema.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or NDJSON text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string'
						? 'application/x-ndjson; charset=utf-8'
						: 'application/json',
			},
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing per operation', () => {
	it('messages.send parses the bare message object', async () => {
		respond(publishedMessage);

		const result = await invoke(Messages.send, { topic: 't', message: 'x' });

		expect(result).toEqual(publishedMessage);
	});

	it('messages.send parses actions with server-assigned ids', async () => {
		respond(actionsMessage);

		const result = await invoke(Messages.send, {
			topic: 't',
			actions: [
				{ action: 'view', label: 'Open portal', url: 'https://example.com' },
			],
		});

		expect(result).toEqual(actionsMessage);
	});

	it('messages.poll keeps message rows and parses each', async () => {
		respond(pollNdjson);

		const result = await invoke(Messages.poll, { topic: 't' });

		expect(result).toEqual({
			messages: [
				{
					id: 'FxMgeKMHrn69',
					time: 1795793425,
					expires: 1795836625,
					event: 'message',
					topic: 'corsair-research-x9k2f',
					title: 'Probe title',
					message: 'Raw body probe from corsair research',
					priority: 4,
					tags: ['warning', 'skull'],
				},
			],
		});
	});

	it('messages.update parses the new version', async () => {
		respond(updatedMessage);

		const result = await invoke(Messages.update, {
			topic: 't',
			sequenceId: 's',
			message: 'Seq v2',
		});

		expect(result).toEqual(updatedMessage);
	});

	it('messages.clear parses the tombstone (no message field)', async () => {
		respond(clearedMessage);

		const result = await invoke(Messages.clear, {
			topic: 't',
			sequenceId: 's',
		});

		expect(result).toEqual(clearedMessage);
		expect(result).toMatchObject({ event: 'message_clear' });
	});

	it('messages.delete parses the tombstone', async () => {
		respond(deletedMessage);

		const result = await invoke(Messages.remove, {
			topic: 't',
			sequenceId: 's',
		});

		expect(result).toEqual(deletedMessage);
		expect(result).toMatchObject({ event: 'message_delete' });
	});

	it('account.usage parses limits and stats', async () => {
		respond(anonymousAccount);

		const result = await invoke(Account.usage, {});

		expect(result).toEqual(anonymousAccount);
	});

	it('server.health parses the flag and role', async () => {
		respond(health);

		const result = await invoke(Server.health, {});

		expect(result).toEqual({ healthy: true, role: 'active' });
	});

	it('server.stats parses totals', async () => {
		respond(serverStats);

		const result = await invoke(Server.stats, {});

		expect(result).toEqual(serverStats);
	});
});

describe('rejections', () => {
	it('rejects a publish answer that is not a message object', async () => {
		respond({ unexpected: true });

		await expect(
			invoke(Messages.send, { topic: 't', message: 'x' }),
		).rejects.toThrow();
	});

	it('rejects a message object with a malformed field', async () => {
		respond({ ...publishedMessage, time: 'not-a-number' });

		await expect(
			invoke(Messages.send, { topic: 't', message: 'x' }),
		).rejects.toThrow();
	});

	it('rejects a clear tombstone whose event is a delete', async () => {
		respond(deletedMessage);

		await expect(
			invoke(Messages.clear, { topic: 't', sequenceId: 's' }),
		).rejects.toThrow(/message_clear|event/);
	});

	it('rejects an NDJSON line that is not JSON', async () => {
		respond('not-json\n');

		await expect(invoke(Messages.poll, { topic: 't' })).rejects.toThrow();
	});

	it('surfaces a 404 error body instead of parsing it as a message', async () => {
		respond(notFound, 404);

		await expect(
			invoke(Messages.send, { topic: 't', message: 'x' }),
		).rejects.toThrow(/ntfy 40101|page not found|404/);
	});
});
