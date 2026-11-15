import { createCorsair } from 'corsair/core';
import { turbotpipes } from '../index';

export type SentRequest = {
	method: string;
	path: string;
	search: string;
	// unknown is necessary: the request body is whatever JSON the handler sent.
	body: unknown;
};
// unknown is necessary: each fake route answers with its own JSON body.
export type FakeAnswer = { status?: number; body?: unknown };

/**
 * Replaces fetch with a fake Turbot Pipes for the calling test file. Routes are
 * keyed by `METHOD /api/v1/path`; every request is recorded in `sent`.
 */
export function useFakePipes() {
	const state = {
		sent: [] as SentRequest[],
		answers: {} as Record<string, FakeAnswer>,
	};
	const originalFetch = globalThis.fetch;

	beforeAll(() => {
		globalThis.fetch = async (
			input: Parameters<typeof fetch>[0],
			init?: RequestInit,
		) => {
			const url = new URL(String(input));
			const method = init?.method ?? 'GET';
			state.sent.push({
				method,
				path: url.pathname.replace('/api/v1/', ''),
				search: url.search,
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
			});
			const answer = state.answers[`${method} ${url.pathname}`];
			if (!answer) {
				throw new Error(`unexpected request ${method} ${url.pathname}`);
			}
			if (answer.status === 204) return new Response(null, { status: 204 });
			return new Response(JSON.stringify(answer.body), {
				status: answer.status ?? 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};
	});

	afterAll(() => {
		globalThis.fetch = originalFetch;
	});

	beforeEach(() => {
		state.sent = [];
		state.answers = {};
	});

	return state;
}

export const pipesApi = () =>
	createCorsair({ plugins: [turbotpipes({ key: 'tpt_test' })] }).turbotpipes
		.api;
