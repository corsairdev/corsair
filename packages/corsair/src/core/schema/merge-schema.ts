import type { CorsairPluginDBSchema, DBFieldAttribute } from './types';

export type InferOptionSchema<S extends CorsairPluginDBSchema> =
	S extends Record<string, { fields: infer Fields }>
		? {
				[K in keyof S]?: {
					modelName?: string | undefined;
					fields?:
						| {
								[P in keyof Fields]?: string;
						  }
						| undefined;
				};
			}
		: never;

/**
 * Applies user-provided table/field renames onto a plugin schema.
 */
export function mergeSchema<S extends CorsairPluginDBSchema>(
	base: S,
	overrides?: InferOptionSchema<S> | undefined,
): S {
	if (!overrides) return base;
	const out: Record<
		string,
		{ modelName?: string; fields: any; order?: number }
	> = {};

	for (const [tableKey, table] of Object.entries(base)) {
		const override = (overrides as any)[tableKey] as
			| { modelName?: string; fields?: Record<string, string> }
			| undefined;
		const fields: Record<string, DBFieldAttribute> = { ...table.fields };
		if (override?.fields) {
			for (const [fieldKey, fieldName] of Object.entries(override.fields)) {
				if (fields[fieldKey]) {
					fields[fieldKey] = {
						...fields[fieldKey]!,
						fieldName,
					};
				}
			}
		}
		out[tableKey] = {
			...table,
			modelName: override?.modelName ?? table.modelName,
			fields,
		};
	}

	return out as S;
}
