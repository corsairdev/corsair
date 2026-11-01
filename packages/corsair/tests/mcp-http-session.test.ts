import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { createMcpRouter } from '../../mcp/src/core/http';

const headers = {
	'content-type': 'application/json',
	accept: 'application/json, text/event-stream',
};

let server: Server | undefined;

afterEach(() => {
	server?.close();
	jest.useRealTimers();
});

async function start(): Promise<string> {
	const app = express();
	app.use(express.json());
	app.use(
		'/mcp',
		createMcpRouter(() => new McpServer({ name: 'test', version: '0.0.0' })),
	);
	server = app.listen(0);
	await new Promise((resolve) => server!.once('listening', resolve));
	return `http://127.0.0.1:${(server!.address() as AddressInfo).port}/mcp`;
}

async function initialize(url: string): Promise<string> {
	const res = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'initialize',
			params: {
				protocolVersion: '2025-03-26',
				capabilities: {},
				clientInfo: { name: 'client', version: '0.0.0' },
			},
		}),
	});
	await res.text();
	return res.headers.get('mcp-session-id')!;
}

async function ping(url: string, sessionId: string): Promise<number> {
	const res = await fetch(url, {
		method: 'POST',
		headers: { ...headers, 'mcp-session-id': sessionId },
		body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'ping' }),
	});
	await res.text();
	return res.status;
}

const tick = () => new Promise((resolve) => setImmediate(resolve));

describe('createMcpRouter sessions', () => {
	it('keeps a session alive while the client keeps using it', async () => {
		jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
		const url = await start();
		const sessionId = await initialize(url);
		await tick();

		jest.advanceTimersByTime(45_000);
		expect(await ping(url, sessionId)).toBe(200);
		await tick();

		jest.advanceTimersByTime(45_000);
		expect(await ping(url, sessionId)).toBe(200);
	});

	it('drops a session once it has been idle', async () => {
		jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
		const url = await start();
		const sessionId = await initialize(url);
		await tick();

		jest.advanceTimersByTime(120_000);
		expect(await ping(url, sessionId)).toBe(404);
	});
});
