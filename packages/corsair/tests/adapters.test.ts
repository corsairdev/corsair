import { z } from 'zod';
import { buildCorsairTools, formFieldToZod } from '../adapters';
import { CORSAIR_INTERNAL } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import type { AnyCorsairInstance, FormFieldSchema } from '../inspect';

// A fake Corsair instance: inspect helpers only read `internal.plugins` off the
// CORSAIR_INTERNAL symbol, and invocation walks `instance[id].api.<path>`. So a
// plain object with both wired up exercises the real discovery/schema/invoke
// path with no database or network.
function makeInstance(overrides?: {
	listStub?: (args: Record<string, unknown>) => unknown;
	withTenant?: (id: string) => AnyCorsairInstance;
}): AnyCorsairInstance {
	const listStub =
		overrides?.listStub ??
		(async (args: Record<string, unknown>) => ({ ok: true, args }));
	const plugin = {
		id: 'demo',
		// Discovery walks this tree; a function leaf is an operation.
		endpoints: {
			channels: { list: () => {}, history: () => {} },
		},
		endpointMeta: {
			'channels.list': { riskLevel: 'low', description: 'List channels' },
			'channels.history': { riskLevel: 'low', description: 'Channel history' },
		},
		endpointSchemas: {
			'channels.list': {
				input: z.object({
					channel: z.string().min(1).describe('Channel id'),
					limit: z
						.number()
						.int()
						.min(1)
						.max(1000)
						.optional()
						.describe('Max results'),
				}),
				output: z.object({ ok: z.boolean() }),
			},
			// channels.history: no schemas entry → no-input tool
		},
		// Minimal fake: only the fields inspect helpers actually read are present.
	} as unknown as CorsairPlugin;

	return {
		[CORSAIR_INTERNAL]: { plugins: [plugin] },
		demo: {
			api: { channels: { list: listStub, history: async () => ({ h: true }) } },
		},
		...(overrides?.withTenant ? { withTenant: overrides.withTenant } : {}),
		// Minimal fake: satisfies only what buildCorsairTools reads at runtime.
	} as unknown as AnyCorsairInstance;
}

describe('formFieldToZod', () => {
	const f = (field: FormFieldSchema) => formFieldToZod(field);

	it('maps string, honouring enum/optional/description', () => {
		expect(f({ kind: 'string', optional: false }).parse('a')).toBe('a');
		expect(() => f({ kind: 'string', optional: false }).parse(3)).toThrow();
		expect(
			f({ kind: 'string', optional: false, enum: ['a', 'b'] }).parse('b'),
		).toBe('b');
		expect(() =>
			f({ kind: 'string', optional: false, enum: ['a', 'b'] }).parse('c'),
		).toThrow();
		expect(
			f({ kind: 'string', optional: true }).parse(undefined),
		).toBeUndefined();
	});

	it('maps number/boolean/literal/unknown', () => {
		expect(f({ kind: 'number', optional: false }).parse(2)).toBe(2);
		expect(f({ kind: 'boolean', optional: false }).parse(true)).toBe(true);
		expect(f({ kind: 'literal', optional: false, value: 'x' }).parse('x')).toBe(
			'x',
		);
		expect(
			f({ kind: 'unknown', optional: false }).parse({ anything: 1 }),
		).toEqual({ anything: 1 });
	});

	it('recurses into object and array', () => {
		const obj = f({
			kind: 'object',
			optional: false,
			fields: { a: { kind: 'string', optional: false } },
		});
		expect(obj.parse({ a: 'hi' })).toEqual({ a: 'hi' });
		const arr = f({
			kind: 'array',
			optional: false,
			items: { kind: 'number', optional: false },
		});
		expect(arr.parse([1, 2])).toEqual([1, 2]);
	});
});

describe('buildCorsairTools', () => {
	it("discovers a plugin's api operations as tools", () => {
		const tools = buildCorsairTools(makeInstance());
		const list = tools.find((t) => t.operation === 'demo.api.channels.list');
		expect(list).toBeDefined();
		expect(tools).toHaveLength(2);
	});

	it('sanitizes the LLM-facing name but keeps the dotted operation', () => {
		const [list] = buildCorsairTools(makeInstance(), {
			operations: ['demo.api.channels.list'],
		});
		expect(list.operation).toBe('demo.api.channels.list');
		expect(list.name).toBe('demo_api_channels_list');
		expect(list.name).toMatch(/^[a-zA-Z0-9_-]+$/);
	});

	it('carries the operation description and a working zod schema', () => {
		const [list] = buildCorsairTools(makeInstance(), {
			operations: ['demo.api.channels.list'],
		});
		expect(list.description).toBe('List channels');
		expect(list.schema.parse({ channel: 'C1', limit: 2 })).toEqual({
			channel: 'C1',
			limit: 2,
		});
		expect(() => list.schema.parse({})).toThrow(); // channel is required
	});

	it('falls back to an empty-object schema for a no-input operation', () => {
		const [history] = buildCorsairTools(makeInstance(), {
			operations: ['demo.api.channels.history'],
		});
		expect(history.schema.parse({})).toEqual({});
	});

	it('execute routes to the dotted method and returns the raw result', async () => {
		const calls: Record<string, unknown>[] = [];
		const [list] = buildCorsairTools(
			makeInstance({
				listStub: async (args) => {
					calls.push(args);
					return { ok: true, args };
				},
			}),
			{ operations: ['demo.api.channels.list'] },
		);
		const result = await list.execute({ channel: 'C1', limit: 2 });
		expect(calls).toEqual([{ channel: 'C1', limit: 2 }]);
		expect(result).toEqual({ ok: true, args: { channel: 'C1', limit: 2 } });
	});

	it('preserves endpoint validation constraints from the raw Zod schema', () => {
		const [list] = buildCorsairTools(makeInstance(), {
			operations: ['demo.api.channels.list'],
		});
		// min(1) on channel — empty string must fail
		expect(() => list.schema.parse({ channel: '' })).toThrow();
		// limit has int + min(1) + max(1000) constraints
		expect(() => list.schema.parse({ channel: 'C1', limit: 0 })).toThrow();
		expect(() => list.schema.parse({ channel: 'C1', limit: 1001 })).toThrow();
		expect(() => list.schema.parse({ channel: 'C1', limit: 1.5 })).toThrow();
		// valid values pass
		expect(list.schema.parse({ channel: 'C1', limit: 10 })).toEqual({
			channel: 'C1',
			limit: 10,
		});
	});

	it('scopes to a tenant via withTenant when tenantId is given', async () => {
		const scopedCalls: Record<string, unknown>[] = [];
		const scoped = {
			[CORSAIR_INTERNAL]: (makeInstance() as never)[CORSAIR_INTERNAL],
			demo: {
				api: {
					channels: {
						list: async (args: Record<string, unknown>) => {
							scopedCalls.push(args);
							return { scoped: true };
						},
						history: async () => ({}),
					},
				},
			},
			// Minimal fake: satisfies only what buildCorsairTools reads at runtime.
		} as unknown as AnyCorsairInstance;
		const base = makeInstance({ withTenant: () => scoped });
		const [list] = buildCorsairTools(base, {
			operations: ['demo.api.channels.list'],
			tenantId: 't1',
		});
		const result = await list.execute({ channel: 'C1' });
		expect(scopedCalls).toEqual([{ channel: 'C1' }]);
		expect(result).toEqual({ scoped: true });
	});
});
