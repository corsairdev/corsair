import type { CorsairDBOptions } from './get-tables';
import { getCorsairTables } from './get-tables';
import type { DBFieldAttribute } from './type';

/**
 * Normalize the merged table map into a modelName-keyed schema and:
 * - apply fieldName remapping
 * - resolve references to target modelName
 */
export function getSchema(options: CorsairDBOptions) {
	const tables = getCorsairTables(options);
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
			actualFields[field.fieldName || fieldKey] = field;
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
			order: table.order || Infinity,
		};
	}

	return schema;
}
