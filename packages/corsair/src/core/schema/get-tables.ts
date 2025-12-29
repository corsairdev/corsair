import type { CorsairOptions } from '../options';
import type { CorsairDBSchema, DBFieldAttribute } from './types';
import { coreTables } from './core-tables';

export function getCorsairTables(options: CorsairOptions): CorsairDBSchema {
	const pluginTables = (options.plugins ?? []).reduce(
		(acc, plugin) => {
			const schema = plugin.schema;
			if (!schema) return acc;
			for (const [key, value] of Object.entries(schema)) {
				acc[key] = {
					fields: {
						...acc[key]?.fields,
						...value.fields,
					},
					modelName: value.modelName || key,
					order: value.order ?? acc[key]?.order,
				};
			}
			return acc;
		},
		{} as Record<
			string,
			{
				fields: Record<string, DBFieldAttribute>;
				modelName: string;
				order?: number;
			}
		>,
	);

	return {
		...coreTables,
		...pluginTables,
	};
}
