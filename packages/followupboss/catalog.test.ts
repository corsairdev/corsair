import { followupboss } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// jest-yaml-transform turns the yaml into a plain object; only apiExamples is
// read here.
const docs = require('./plugin-docs.yaml') as {
	apiExamples: Record<string, { call: string }>;
};

const plugin = followupboss({ key: 'fub-test-key' });

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant; the return is not read.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

const operations = Object.entries(
	plugin.endpoints as unknown as Record<string, Record<string, AnyEndpoint>>,
).flatMap(([group, ops]) =>
	Object.entries(ops).map(([name, endpoint]) => ({
		id: `${group}.${name}`,
		endpoint,
	})),
);

// The apiExamples are JavaScript object literals written for readers, e.g.
// "{ id: 123, tags: ['Hot'] }". This converts that literal subset (bare keys,
// single-quoted strings) to JSON instead of evaluating it.
function literalToJson(source: string): string {
	let out = '';
	let i = 0;
	while (i < source.length) {
		const ch = source[i] as string;
		if (ch === "'" || ch === '"') {
			let value = '';
			i += 1;
			while (i < source.length && source[i] !== ch) {
				if (source[i] === '\\') i += 1;
				value += source[i];
				i += 1;
			}
			i += 1;
			out += JSON.stringify(value);
		} else if (/[A-Za-z_$]/.test(ch)) {
			const word = /^[A-Za-z_$][\w$]*/.exec(source.slice(i))?.[0] ?? ch;
			i += word.length;
			const isKey = /^\s*:/.test(source.slice(i));
			out +=
				isKey || !['true', 'false', 'null'].includes(word)
					? JSON.stringify(word)
					: word;
		} else {
			out += ch;
			i += 1;
		}
	}
	return out.replace(/,(\s*[}\]])/g, '$1');
}

// unknown: the example is parsed as written and validated by the endpoint.
function exampleInput(id: string): unknown {
	const example = docs.apiExamples[id]?.call;
	if (!example) throw new Error(`no apiExample for ${id}`);
	return JSON.parse(literalToJson(example));
}

// The risk level a reviewer expects from the HTTP verb alone. POST and PUT
// always change data, a DELETE is never undone, and GET only reads.
function expectedRisk(method: string): string {
	if (method === 'GET') return 'read';
	if (method === 'DELETE') return 'destructive';
	return 'write';
}

describe('followupboss catalog', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(global, 'fetch').mockImplementation(
			async () =>
				new Response('{}', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);
	});

	afterEach(() => fetchMock.mockRestore());

	it('registers 156 operations', () => {
		expect(operations).toHaveLength(156);
	});

	it.each(operations.map((op) => [op.id, op.endpoint] as const))(
		'%s: the apiExample parses and the risk level matches the HTTP method',
		async (id, endpoint) => {
			const input = exampleInput(id);
			const schemas = plugin.endpointSchemas as unknown as Record<
				string,
				{ input: { safeParse: (value: unknown) => { success: boolean } } }
			>;
			expect(schemas[id]?.input.safeParse(input).success).toBe(true);

			// The empty reply may fail the output schema; only the request matters.
			await endpoint(
				{ key: 'fub-test-key', options: {} } as never,
				input as never,
			).catch(() => undefined);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new URL(url).origin).toBe('https://api.followupboss.com');
			const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
			expect(meta[id]?.riskLevel).toBe(expectedRisk(init.method ?? 'GET'));
		},
	);

	// FUB's Pagination guide: every list that returns a collection pages with
	// limit, offset and the keyset `next` cursor from `_metadata.next`.
	const collections = operations.filter(({ id }) => {
		const output = (
			plugin.endpointSchemas as unknown as Record<
				string,
				{ output: { shape?: Record<string, unknown> } }
			>
		)[id]?.output;
		return output?.shape !== undefined && '_metadata' in output.shape;
	});

	it('finds the paged collections', () => {
		expect(collections.map(({ id }) => id)).toEqual(
			expect.arrayContaining([
				'tasks.list',
				'textMessages.list',
				'groups.list',
				'automationsPeople.list',
				'teamInboxes.list',
				'emCampaigns.list',
			]),
		);
	});

	it.each(collections.map((op) => [op.id, op.endpoint] as const))(
		'%s forwards limit, offset and next to the query',
		async (id, endpoint) => {
			const input = {
				...(exampleInput(id) as Record<string, unknown>),
				limit: 25,
				offset: 50,
				next: 'a2V5c2V0Ojk1MA',
			};
			await endpoint(
				{ key: 'fub-test-key', options: {} } as never,
				input as never,
			).catch(() => undefined);

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			const query = new URL(url).searchParams;
			expect(query.get('limit')).toBe('25');
			expect(query.get('offset')).toBe('50');
			expect(query.get('next')).toBe('a2V5c2V0Ojk1MA');
		},
	);
});

// Replies shaped like the examples on FUB's reference pages, which send flags
// as 0/1 and the custom field list total as a numeric string.
describe('followupboss documented replies', () => {
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const ctx = { key: 'fub-test-key', options: {} } as never;
	let fetchMock: jest.SpyInstance;

	// unknown: the reply body is whatever FUB documents.
	function reply(body: unknown) {
		fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	}

	afterEach(() => fetchMock.mockRestore());

	it('accepts 0/1 flags on people', async () => {
		reply({
			_metadata: { collection: 'people', offset: 0, limit: 10, total: 1 },
			people: [{ id: 14412, contacted: 0, emails: [{ isPrimary: 1 }] }],
		});
		const result = await endpoints.people.list(ctx, {});
		expect(result.people[0]?.contacted).toBe(0);
	});

	it('accepts 0/1 flags on tasks and notes', async () => {
		reply({ id: 4066, isCompleted: 1 });
		await expect(endpoints.tasks.get(ctx, { id: 4066 })).resolves.toMatchObject(
			{ isCompleted: 1 },
		);
		reply({ id: 12345, isHtml: 0 });
		await expect(
			endpoints.notes.update(ctx, { id: 12345, body: 'Called back' }),
		).resolves.toMatchObject({ isHtml: 0 });
	});

	it('accepts a numeric-string total on custom field lists', async () => {
		reply({
			_metadata: {
				collection: 'customfields',
				offset: 0,
				limit: 10,
				total: '3',
			},
			customfields: [],
		});
		const result = await endpoints.customFields.list(ctx, {});
		expect(result._metadata?.total).toBe('3');
	});
});
