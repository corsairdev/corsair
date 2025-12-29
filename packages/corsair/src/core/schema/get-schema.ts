import type { CorsairOptions } from '../options';
import { getCorsairTables } from './get-tables';
import type { DBFieldAttribute } from './types';

/**
 * Normalizes schema to actual model/field names, and resolves references
 * to the final model names.
 */
export function getSchema(config: CorsairOptions) {
	const tables = getCorsairTables(config);
	let schema: Record<
		string,
		{
			fields: Record<string, DBFieldAttribute>;
			order: number;
		}
	> = {};

	for (const key in tables) {
		const table = tables[key]!;
		const fields = table.fields;
		let actualFields: Record<string, DBFieldAttribute> = {};

		Object.entries(fields).forEach(([fieldKey, field]) => {
			actualFields[field.fieldName || fieldKey] = { ...field };

			if (field.references) {
				const refTable = tables[field.references.model];
				if (refTable) {
					actualFields[field.fieldName || fieldKey]!.references = {
						...field.references,
						model: refTable.modelName,
						field: field.references.field,
					};
				}
			}
		});

		if (schema[table.modelName]) {
			schema[table.modelName]!.fields = {
				...schema[table.modelName]!.fields,
				...actualFields,
			};
			continue;
		}

		schema[table.modelName] = {
			fields: actualFields,
			order: table.order ?? Infinity,
		};
	}

	return schema;
}
