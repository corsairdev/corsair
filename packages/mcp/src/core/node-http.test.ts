import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { test } from 'node:test';
import { createNodeMcpHandler } from './node-http.js';

function fakeReq(method: string, headers: Record<string, string> = {}) {
	return { method, headers } as unknown as IncomingMessage;
}

function fakeRes() {
	const state = { status: 0, body: '' };
	const res = {
		writeHead(status: number) {
			state.status = status;
			return res;
		},
		end(body?: string) {
			if (body) state.body = body;
			return res;
		},
	} as unknown as ServerResponse;
	return { res, state };
}

test('createNodeMcpHandler returns a handler function', () => {
	const handler = createNodeMcpHandler({
		createServer: () => ({}) as never,
	});
	assert.equal(typeof handler, 'function');
});

test('GET without a session id is 400', async () => {
	const handler = createNodeMcpHandler({ createServer: () => ({}) as never });
	const { res, state } = fakeRes();
	await handler(fakeReq('GET'), res);
	assert.equal(state.status, 400);
	assert.match(state.body, /mcp-session-id/);
});

test('DELETE without a session is a no-op 200', async () => {
	const handler = createNodeMcpHandler({ createServer: () => ({}) as never });
	const { res, state } = fakeRes();
	await handler(fakeReq('DELETE'), res);
	assert.equal(state.status, 200);
});

test('an unknown method is 405', async () => {
	const handler = createNodeMcpHandler({ createServer: () => ({}) as never });
	const { res, state } = fakeRes();
	await handler(fakeReq('PUT'), res);
	assert.equal(state.status, 405);
});
