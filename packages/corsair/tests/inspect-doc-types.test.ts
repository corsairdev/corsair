import { z } from 'zod';
import type { DocSchemaFieldRow } from '../core/inspect';
import { introspectPluginForDocs } from '../core/inspect';
import type { CorsairPlugin } from '../core/plugins';

const noop = async () => ({});

type Prefetch = { prefetch?: Prefetch | Prefetch[]; limit?: number };
const PrefetchSchema: z.ZodType<Prefetch> = z.lazy(() =>
	z.object({
		prefetch: z.union([PrefetchSchema, z.array(PrefetchSchema)]).optional(),
		limit: z.number().optional(),
	}),
);

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
const JsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonSchema),
		z.record(z.string(), JsonSchema),
	]),
);

const Entity = z.object({
	id: z.string(),
	state: z.enum(['draft', 'published']),
	kind: z.union([z.literal('a'), z.literal('b')]),
	label: z.union([z.string(), z.null()]),
	mixed: z.union([z.string(), z.number()]),
	count: z.number().nullable(),
	tags: z.array(z.string()),
});

// The smallest plugin introspection reads: an endpoint tree, its meta, its schemas
// and its entities. Cast: a typed CorsairPlugin also needs a registered plugin id,
// keys, hooks and an endpoint tree built through the plugin factory, none of which
// introspection reads, and a made-up id keeps real plugins' meta out.
const plugin = {
	id: 'doctypes',
	endpoints: { things: { get: noop, query: noop, list: noop } },
	endpointMeta: {
		'things.get': { riskLevel: 'read' },
		'things.query': { riskLevel: 'read' },
		'things.list': { riskLevel: 'read' },
	},
	endpointSchemas: {
		'things.get': {
			input: z.object({
				delivery: z.enum(['', 'email', 'link']),
				roles: z.array(z.enum(['admin', 'member'])),
				cells: z.array(z.array(z.string().nullable())),
				meta: z.record(z.string(), z.number()),
				blank: z.literal(''),
				payload: JsonSchema,
				filter: z.tuple([z.string(), z.enum(['=', '<>']), z.number()]),
				first: z.number().int().default(10).describe('Page size'),
				order: z.enum(['asc', 'desc']).default('asc'),
				sort: z.string().default('name').describe('Sort key; default is name.'),
			}),
			output: z.object({
				results: z.array(z.string()).nullable(),
				next_page: z.number().nullable(),
				cursor: z.string().nullish(),
				name: z.string(),
				brand: z
					.object({ id: z.string() })
					.nullish()
					.describe('`null` when nothing matched.'),
				limit: z.number().default(5),
			}),
		},
		'things.query': {
			input: z.object({
				prefetch: z.union([PrefetchSchema, z.array(PrefetchSchema)]).optional(),
			}),
			output: z.string().nullable(),
		},
		'things.list': {
			input: z.object({}),
			output: z.array(Entity),
		},
	},
	schema: { version: '1.0.0', entities: { things: Entity } },
} as unknown as CorsairPlugin;

const introspect = () => {
	const result = introspectPluginForDocs([plugin], 'doctypes');
	if (!result.ok) throw new Error(result.error);
	return result.data;
};

const fieldsOf = (shortPath: string, side: 'input' | 'output') => {
	const ep = introspect().api.find((e) => e.shortPath === shortPath);
	const shape = ep?.[side];
	if (shape?.kind !== 'object') throw new Error(`${shortPath} ${side}`);
	return new Map<string, DocSchemaFieldRow>(
		shape.fields.map((f) => [f.key, f]),
	);
};

describe('docs introspection types', () => {
	it('shows the empty string as "" in enums and literals', () => {
		const input = fieldsOf('things.get', 'input');
		expect(input.get('delivery')?.type).toBe('"" | email | link');
		expect(input.get('blank')?.type).toBe('""');
	});

	it('groups enum and nullable array elements before []', () => {
		const input = fieldsOf('things.get', 'input');
		expect(input.get('roles')?.type).toBe('(admin | member)[]');
		expect(input.get('cells')?.type).toBe('(string | null)[][]');
	});

	it('renders records as Record<key, value>', () => {
		expect(fieldsOf('things.get', 'input').get('meta')?.type).toBe(
			'Record<string, number>',
		);
	});

	it('names the recursive JSON value schema and renders tuples', () => {
		const input = fieldsOf('things.get', 'input');
		expect(input.get('payload')?.type).toBe('JsonValue');
		expect(input.get('filter')?.type).toBe('[string, = | <>, number]');
	});

	it('keeps | null on nullable fields and marks only .optional() keys optional', () => {
		const output = fieldsOf('things.get', 'output');
		expect(output.get('results')).toMatchObject({
			type: 'string[] | null',
			optional: false,
		});
		expect(output.get('next_page')).toMatchObject({
			type: 'number | null',
			optional: false,
		});
		expect(output.get('cursor')).toMatchObject({
			type: 'string | null',
			optional: true,
		});
		expect(output.get('name')).toMatchObject({
			type: 'string',
			optional: false,
		});
	});

	it('marks inputs with a default optional and says what they default to', () => {
		const input = fieldsOf('things.get', 'input');
		expect(input.get('first')).toMatchObject({
			optional: true,
			description: 'Page size. Defaults to 10.',
		});
		expect(input.get('order')).toMatchObject({
			optional: true,
			description: 'Defaults to "asc".',
		});
		// Already says it: left alone.
		expect(input.get('sort')?.description).toBe('Sort key; default is name.');
		// Outputs always carry the value, so a default doesn't make them optional.
		expect(fieldsOf('things.get', 'output').get('limit')).toMatchObject({
			optional: false,
		});
		expect(fieldsOf('things.get', 'output').get('limit')).not.toHaveProperty(
			'description',
		);
	});

	it('keeps | null on a nullish object that has a description', () => {
		expect(fieldsOf('things.get', 'output').get('brand')).toMatchObject({
			type: '{ id: string } | null',
			optional: true,
			description: '`null` when nothing matched.',
		});
	});

	it('keeps | null on a nullable non-object output', () => {
		const ep = introspect().api.find((e) => e.shortPath === 'things.query');
		expect(ep?.output).toEqual({ kind: 'inline', type: 'string | null' });
	});

	it('expands a recursive lazy schema once instead of printing lazy', () => {
		const type = fieldsOf('things.query', 'input').get('prefetch')?.type;
		expect(type).toBe(
			'{ prefetch?: (recursive) | (recursive)[], limit?: number } | { prefetch?: (recursive) | (recursive)[], limit?: number }[]',
		);
		expect(type).not.toContain('lazy');
	});

	it('lists enum, literal-union and string|null fields as string filters', () => {
		const things = introspect().db.find((d) => d.entityName === 'things');
		const filters = new Map(things?.filters.map((f) => [f.field, f.type]));
		expect(filters.get('state')).toBe('string');
		expect(filters.get('kind')).toBe('string');
		expect(filters.get('label')).toBe('string');
		expect(filters.get('count')).toBe('number');
		// A mixed union has no single filter type, and arrays aren't filterable.
		expect(filters.has('mixed')).toBe(false);
		expect(filters.has('tags')).toBe(false);
	});
});
