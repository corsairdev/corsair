import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type {
	EndpointMetaEntry,
	EndpointSearch,
	SearchPart,
} from '../packages/corsair/core/plugins/index.ts';
import type { SearchHints } from '../packages/corsair/core/plugins/search-args.ts';
import { searchArgs } from '../packages/corsair/core/plugins/search-args.ts';
import { listPluginDirs } from './plugin-docs-requirements.ts';

// Every plugin that declares `search` on an endpointMeta entry is held to the
// shape of the operation it names: args exist, compiled args parse, result
// paths resolve. A plugin with no declaration is not checked.

const packagesDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../packages',
);

type Zod = {
	safeParse: (v: unknown) => { success: boolean; error?: { message: string } };
	_zod: { def: Record<string, unknown> };
};
type Loaded = {
	id: string;
	meta: Record<string, EndpointMetaEntry | undefined>;
	schemas: Record<string, { input?: Zod; output?: Zod } | undefined>;
	entities: string[];
};

function sourceFiles(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		if (e.name === 'node_modules' || e.name === 'dist') return [];
		const p = path.join(dir, e.name);
		if (e.isDirectory()) return sourceFiles(p);
		return e.name.endsWith('.ts') && !e.name.endsWith('.test.ts') ? [p] : [];
	});
}

const mentionsSearch = (dir: string) =>
	sourceFiles(dir).some((f) =>
		/\bsearch:\s*\{/.test(fs.readFileSync(f, 'utf8')),
	);

async function declared(): Promise<
	Array<Loaded & { op: string; search: EndpointSearch }>
> {
	const out: Array<Loaded & { op: string; search: EndpointSearch }> = [];
	for (const dir of listPluginDirs(packagesDir)) {
		if (!mentionsSearch(path.join(packagesDir, dir))) continue;
		const mod = (await import(
			pathToFileURL(path.join(packagesDir, dir, 'index.ts')).href
		)) as Record<string, unknown>;
		const plugin = (mod[dir] as () => Record<string, unknown>)();
		const loaded: Loaded = {
			id: String(plugin.id),
			meta: (plugin.endpointMeta ?? {}) as Loaded['meta'],
			schemas: (plugin.endpointSchemas ?? {}) as Loaded['schemas'],
			entities: Object.keys(
				(plugin.schema as { entities?: object } | undefined)?.entities ?? {},
			),
		};
		for (const [op, entry] of Object.entries(loaded.meta)) {
			if (entry?.search) out.push({ ...loaded, op, search: entry.search });
		}
	}
	return out;
}

const unwrap = (s: Zod): Zod => {
	const def = s._zod.def as {
		type: string;
		innerType?: Zod;
		getter?: () => Zod;
	};
	if (def.type === 'lazy' && def.getter) return unwrap(def.getter());
	return ['optional', 'nullable', 'default', 'readonly'].includes(def.type) &&
		def.innerType
		? unwrap(def.innerType)
		: s;
};

const allowsAnyKey = (catchall: unknown) =>
	Boolean(catchall) && (catchall as Zod)._zod.def.type !== 'never';

/** The schema at a dot path, or 'open' when it passes through an object that allows any key. */
function walk(schema: Zod, dotted: string): Zod | 'open' | undefined {
	let node = unwrap(schema);
	for (const key of dotted ? dotted.split('.') : []) {
		const def = node._zod.def as {
			type: string;
			shape?: Record<string, Zod>;
			catchall?: unknown;
		};
		if (def.type !== 'object') return undefined;
		const next = def.shape?.[key];
		if (!next) return allowsAnyKey(def.catchall) ? 'open' : undefined;
		node = unwrap(next);
	}
	return node;
}

const partsOf = (s: EndpointSearch): Array<[string, SearchPart]> => {
	const h = s.hints;
	const single = (
		['topic', 'people', 'places', 'ids', 'after', 'before', 'window'] as const
	)
		.filter((k) => h[k])
		.map((k) => [k, h[k] as SearchPart] as [string, SearchPart]);
	const choices = (['kinds', 'states'] as const).flatMap((k) =>
		Object.entries(h[k]?.map ?? {}).map(
			([v, p]) => [`${k}.${v}`, p] as [string, SearchPart],
		),
	);
	return [...single, ...choices];
};

const day = '2026-11-14T08:00:00.000Z';
const next = '2026-11-15T08:00:00.000Z';

function fixtures(s: EndpointSearch): Array<[string, SearchHints]> {
	const h = s.hints;
	const everything: SearchHints = {
		topic: [
			'quarterly plan',
			'say "hi"',
			're:budget',
			'-secret',
			'OR',
			'x'.repeat(300),
		],
		people: ['ann@example.test', 'bo'],
		places: ['acme/api', 'general'],
		ids: ['ENG-123'],
		kinds: [...s.kinds],
		states: Object.keys(h.states?.map ?? {}).slice(0, 1),
		after: day,
		before: next,
		tz: 'America/Los_Angeles',
		limit: 7,
	};
	const own = (extra: SearchHints) => ({ topic: ['plan'], ...extra });
	return [
		['all hints', everything],
		['every hint with a limit past the cap', { ...everything, limit: 100_000 }],
		['one person', own({ people: ['ann@example.test'] })],
		['many people', own({ people: ['a', 'b', 'c d', 'e@example.test'] })],
		['one place', own({ places: ['acme/api'] })],
		['an id', own({ ids: ['ENG-123'] })],
		['after only', own({ after: day })],
		['before only', own({ before: next })],
		['a window', own({ after: day, before: next })],
		['a window in UTC', own({ after: day, before: next, tz: undefined })],
		[
			'an unknown kind and state',
			own({ kinds: ['nope'], states: ['nope'], people: ['ann'] }),
		],
		...Object.keys(h.states?.map ?? {}).map(
			(v) => [`state ${v}`, own({ states: [v] })] as [string, SearchHints],
		),
		...Object.keys(h.kinds?.map ?? {}).map(
			(v) => [`kind ${v}`, own({ kinds: [v] })] as [string, SearchHints],
		),
	];
}

const plugins = await declared();

describe('plugin search declarations', () => {
	for (const { id, op, search, meta, schemas, entities } of plugins) {
		describe(`${id} ${op}`, () => {
			const input = schemas[op]?.input;
			const output = schemas[op]?.output;

			it('is a read, with schemas', () => {
				assert.equal(meta[op]?.riskLevel, 'read');
				assert.ok(
					input && output,
					'the operation needs input and output schemas',
				);
			});

			it('is plain JSON', () => {
				assert.deepEqual(JSON.parse(JSON.stringify(search)), search);
			});

			it('names kinds the plugin stores', () => {
				assert.ok(search.kinds.length > 0);
				for (const k of search.kinds) {
					assert.ok(entities.includes(k), `${k} is not an entity of ${id}`);
				}
			});

			it('puts every part in an arg the operation takes', () => {
				assert.ok(input);
				const args = [
					search.limit.arg,
					...Object.keys(search.fixed ?? {}),
					...partsOf(search).map(([, p]) => p.arg),
				];
				for (const arg of args) {
					assert.ok(walk(input, arg), `${arg} is not an input of ${op}`);
				}
			});

			it('gives each part exactly one way to place its value', () => {
				for (const [name, p] of partsOf(search)) {
					const ways = [p.text, p.list, p.set].filter((x) => x !== undefined);
					assert.equal(ways.length, 1, `${name} needs one of text, list, set`);
					const open = name.startsWith('kinds.') || name.startsWith('states.');
					if (p.text !== undefined && !open) {
						const need = name === 'window' ? ['{after}', '{before}'] : ['{v}'];
						for (const token of need) {
							for (const t of ([] as string[]).concat(p.text)) {
								assert.ok(t.includes(token), `${name} lacks ${token}`);
							}
						}
					}
					assert.ok(p.max === undefined || p.max >= 1);
					assert.ok(p.cap === undefined || p.cap >= 1);
				}
				const w = search.hints.window;
				if (w)
					assert.ok(
						search.hints.after && search.hints.before,
						'window needs after and before as the fallback',
					);
			});

			it('keeps its limit coherent', () => {
				const { default: d, max } = search.limit;
				assert.ok(Number.isInteger(d) && d >= 1);
				assert.ok(max === undefined || max >= d);
			});

			it('has no two hints writing one structured arg', () => {
				const seen = new Map<string, string>();
				for (const [name, p] of partsOf(search)) {
					if (p.text !== undefined || p.list !== undefined) continue;
					const prior = seen.get(p.arg);
					assert.ok(!prior, `${name} and ${prior} both set ${p.arg}`);
					seen.set(p.arg, name);
				}
			});

			it('reaches every declared hint', () => {
				for (const [name, p] of partsOf(search)) {
					const [hint, value] = name.split('.');
					const sample: Record<string, SearchHints> = {
						topic: { topic: ['plan'] },
						people: { people: ['ann'] },
						places: { places: ['acme'] },
						ids: { ids: ['7'] },
						after: { after: day },
						before: { before: next },
						window: { after: day, before: next },
						kinds: { kinds: [value ?? ''] },
						states: { states: [value ?? ''] },
					};
					if (hint === 'topic') continue;
					assert.ok(
						searchArgs(search, sample[hint as string] as SearchHints),
						`${name} compiles to nothing (${p.arg})`,
					);
				}
			});

			for (const [label, hints] of fixtures(search)) {
				it(`compiles args its input schema accepts: ${label}`, () => {
					assert.ok(input);
					const args = searchArgs(search, hints);
					if (!args) return;
					const parsed = input.safeParse(args);
					assert.ok(
						parsed.success,
						`${JSON.stringify(args)} fails: ${parsed.error?.message}`,
					);
				});
			}

			it('compiles the same args every time', () => {
				const [, hints] = fixtures(search)[0] as [string, SearchHints];
				assert.deepEqual(searchArgs(search, hints), searchArgs(search, hints));
			});

			it('returns nothing for topic words alone', () => {
				assert.equal(searchArgs(search, { topic: ['plan'] }), null);
			});

			it('points at rows in the result, each with its id', () => {
				assert.ok(output);
				const list = walk(output, search.rows);
				assert.ok(list, `${search.rows} is not in the result of ${op}`);
				if (list === 'open') return;
				const def = list._zod.def as { type: string; element?: Zod };
				assert.equal(def.type, 'array', `${search.rows} is not a list`);
				const row = walk(def.element as Zod, search.id);
				assert.ok(row, `rows have no ${search.id}`);
			});

			it('opens one result with an operation the plugin has', () => {
				if (!search.open) return;
				const target = schemas[search.open.op];
				assert.ok(target?.input, `${search.open.op} is not an operation`);
				assert.ok(
					walk(target.input, search.open.idArg),
					`${search.open.idArg} is not an input of ${search.open.op}`,
				);
				assert.equal(meta[search.open.op]?.riskLevel, 'read');
			});
		});
	}
});
