// Route table: every registered operation, called through the public
// endpoint with schema-valid sample input, must send exactly one request
// with the method and path below. Each entry was checked against Mixmax's
// API reference (https://developer.mixmax.com/reference/).
import { createCorsair } from 'corsair/core';
import { z } from 'zod';
import { mixmax, mixmaxEndpointSchemas } from './index';

const ROUTES: Record<keyof typeof mixmaxEndpointSchemas, string> = {
	'messages.list': 'GET /v1/messages',
	'messages.create': 'POST /v1/messages',
	'messages.get': 'GET /v1/messages/{id}',
	'messages.update': 'PATCH /v1/messages/{id}',
	'messages.send': 'POST /v1/messages/{id}/send',
	'messages.schedule': 'POST /v1/messages/{id}/schedule',
	'messages.unschedule': 'DELETE /v1/messages/{id}/schedule',
	'messages.test': 'POST /v1/messages/test',
	'messages.sendPlain': 'POST /v1/send',
	'sequences.list': 'GET /v1/sequences',
	'sequences.getRecipients': 'GET /v1/sequences/{id}/recipients',
	'sequences.addRecipients': 'POST /v1/sequences/{id}/recipients',
	'snippets.list': 'GET /v1/snippets',
	'snippets.get': 'GET /v1/snippets/{id}',
	'users.getMe': 'GET /v1/users/me',
	'userPreferences.get': 'GET /v1/userpreferences/me',
	'userPreferences.update': 'PATCH /v1/userpreferences/me',
};

type Operation = keyof typeof ROUTES;

const sample = (schema: unknown, key: string): unknown => {
	if (typeof schema !== 'object' || schema === null) return {};
	const s = schema as Record<string, unknown>;
	if (s['enum']) return (s['enum'] as unknown[])[0];
	if (s['const'] !== undefined) return s['const'];
	const branch = (s['anyOf'] as unknown[])?.[0] ?? (s['oneOf'] as unknown[])?.[0];
	if (branch !== undefined) return sample(branch, key);
	switch (s['type']) {
		case 'string':
			if (s['format'] === 'date-time') return '2026-01-01T00:00:00Z';
			if (s['format'] === 'uri') return 'https://example.com/x';
			return `X${key}`;
		case 'number':
		case 'integer':
			return 1;
		case 'boolean':
			return true;
		case 'array': {
			const items = Array.isArray(s['items'])
				? (s['items'] as unknown[])[0]
				: s['items'];
			return items === undefined ? [] : [sample(items, key)];
		}
		case 'object':
			return Object.fromEntries(
				((s['required'] as string[]) ?? []).map((name) => [
					name,
					sample(
						(s['properties'] as Record<string, unknown>)?.[name],
						name,
					),
				]),
			);
		default:
			return {};
	}
};

const INPUT_OVERRIDES: Partial<Record<Operation, unknown>> = {};

const isOperation = (path: string): path is Operation => path in ROUTES;

const flatten = (tree: object, prefix = ''): [string, Function][] =>
	Object.entries(tree).flatMap(([name, value]): [string, Function][] => {
		const path = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [[path, value]];
		if (value && typeof value === 'object') return flatten(value, path);
		return [];
	});

describe('Mixmax route table', () => {
	const operations = flatten(
		createCorsair({ plugins: [mixmax({ key: 'mixmax_test' })] }).mixmax.api,
	);
	const sent: { method: string; path: string }[] = [];

	beforeEach(() => {
		sent.length = 0;
		jest.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
			sent.push({
				method: init?.method ?? 'GET',
				path: new URL(String(url)).pathname,
			});
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('lists every registered operation exactly once', () => {
		expect(operations.map(([p]) => p).sort()).toEqual(
			Object.keys(ROUTES).sort(),
		);
	});

	it.each(Object.entries(ROUTES))('%s -> %s', async (operation, route) => {
		if (!isOperation(operation)) throw new Error(`unknown ${operation}`);
		const handler = operations.find(([p]) => p === operation)?.[1];
		if (!handler) throw new Error(`${operation} is not registered`);

		const schema = mixmaxEndpointSchemas[operation];
		const input =
			INPUT_OVERRIDES[operation] ??
			sample(
				z.toJSONSchema(schema.input, {
					io: 'input',
					unrepresentable: 'any',
				}),
				'input',
			);

		await Promise.resolve(Reflect.apply(handler, undefined, [input])).catch(
			() => undefined,
		);

		const [method, template] = route.split(' ');
		const path = template?.replace(/\{(\w+)\}/g, 'X$1');
		expect(sent).toEqual([{ method, path }]);
	});
});