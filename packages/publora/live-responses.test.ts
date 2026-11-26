/**
 * Real Publora replies from a live run on a free Starter account with no
 * connected social account (test-data/live-responses.json, trimmed, ids
 * replaced). Each 2xx reply goes through its operation's output schema, and
 * each error reply must reach the handler that names it. No network.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApiError } from 'corsair/http';
import { PubloraEndpointOutputSchemas as Outputs } from './endpoints/types';
import { errorHandlers, publoraErrorCode } from './error-handlers';

type Op = keyof typeof Outputs;
type Name = keyof typeof errorHandlers;

const LIVE = JSON.parse(
	readFileSync(join(__dirname, 'test-data', 'live-responses.json'), 'utf8'),
) as {
	ok: Record<string, unknown>;
	errors: { op: string; status: number; handler: Name; body: unknown }[];
};

function apiError(status: number, statusText: string, body: unknown) {
	const url = 'https://api.publora.com/api/v1/x';
	return new ApiError(
		{ method: 'GET', url },
		{ url, ok: false, status, statusText, body },
		statusText,
	);
}

const STATUS_TEXT: Record<number, string> = {
	400: 'Bad Request',
	403: 'Forbidden',
	404: 'Not Found',
};

describe('real Starter replies', () => {
	it.each(Object.keys(LIVE.ok))('%s parses through its output schema', (op) => {
		expect(() => Outputs[op as Op].parse(LIVE.ok[op])).not.toThrow();
	});

	it('keeps the plan and quotas from accounts.getContext', () => {
		const result = Outputs.getContext.parse(LIVE.ok.getContext);
		expect(result.context.plan?.key).toBe('starter');
		expect(result.context.quotas).toBeDefined();
	});

	it('reads an empty Agency context list for a personal account', () => {
		const result = Outputs.companyListContexts.parse(
			LIVE.ok.companyListContexts,
		);
		expect(result.data?.accounts).toEqual([]);
	});

	it.each(LIVE.errors)(
		'$op $status reaches $handler with its code',
		({ status, handler, body }) => {
			const error = apiError(status, STATUS_TEXT[status] ?? 'Error', body);
			const first = (Object.keys(errorHandlers) as Name[]).find((name) =>
				errorHandlers[name].match(error),
			);
			expect(first).toBe(handler);
			const code = (body as { code?: unknown }).code;
			expect(publoraErrorCode(error)).toBe(
				typeof code === 'string' ? code : undefined,
			);
		},
	);
});
