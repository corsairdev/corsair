import type { ZodType } from 'zod';

// Handlers differ per operation; `never[]`/`unknown` let one map hold them all, and the
// caller-facing types come from `pick`'s return type, not from this alias.
type Handler = (...args: never[]) => unknown;

/**
 * Builds a resource module's schemas and handlers the first time one of its
 * operations runs (or a schema is read), instead of at import. The 170 added
 * operations cost ~25 MB of heap when built at import, in every process that
 * loads the plugin. Operation ids come from the module's metadata, which stays
 * eager because it is plain data. Only `meta`'s keys ('resource.action') are
 * read, so its values are typed `unknown`.
 */
export function lazyModule<M>(build: () => M, meta: Record<string, unknown>) {
	let built: M | undefined;
	const load = (): M => {
		built ??= build();
		return built;
	};
	const ids = Object.keys(meta).map((id) => {
		const [resource, action] = id.split('.');
		if (!resource || !action) throw new Error(`Bad operation id ${id}`);
		return { id, resource, action };
	});
	return {
		endpoints<E extends Record<string, Record<string, Handler>>>(
			pick: (module: M) => E,
		): E {
			const tree: Record<string, Record<string, Handler>> = {};
			for (const { resource, action } of ids) {
				const group = tree[resource] ?? {};
				tree[resource] = group;
				group[action] = (...args: never[]) => {
					const handler = pick(load())[resource]?.[action];
					if (!handler) throw new Error(`No handler for ${resource}.${action}`);
					return handler(...args);
				};
			}
			// Safe: every module's metadata has exactly one entry per handler (the registry
			// test checks handlers, schemas and metadata line up), so the tree has E's keys.
			return tree as E;
		},
		schemas<S extends Record<string, { input: ZodType; output: ZodType }>>(
			pick: (module: M) => S,
		): S {
			const entries: Record<string, { input: ZodType; output: ZodType }> = {};
			for (const { id } of ids) {
				const entry = () => {
					const found = pick(load())[id];
					if (!found) throw new Error(`No schemas for ${id}`);
					return found;
				};
				entries[id] = {
					get input() {
						return entry().input;
					},
					get output() {
						return entry().output;
					},
				};
			}
			// Same key set as the module's schema map, for the same reason as `tree` above.
			return entries as S;
		},
	};
}
