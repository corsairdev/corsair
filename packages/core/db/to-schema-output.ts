import type { SchemaOutput } from '../config';
import type { DBFieldAttribute, DBFieldType } from './type';

function mapFieldTypeToSql(type: DBFieldType): string {
	// support literal union arrays and user-provided strings (fallback to text)
	if (Array.isArray(type)) return 'text';
	if (type === 'string') return 'text';
	if (type === 'number') return 'integer';
	if (type === 'boolean') return 'boolean';
	if (type === 'date') return 'timestamp';
	if (type === 'json') return 'jsonb';
	if (type === 'string[]') return 'text[]';
	if (type === 'number[]') return 'integer[]';
	return 'text';
}

/**
 * Convert Corsair's DB schema into the CLI-friendly `SchemaOutput` format.
 *
 * This intentionally discards non-serializable/function-y metadata like defaultValue/onUpdate.
 */
export function toSchemaOutput(
	schema: Record<string, { fields: Record<string, DBFieldAttribute> }>,
): SchemaOutput {
	const out: SchemaOutput = {};
	for (const [tableName, table] of Object.entries(schema)) {
		out[tableName] = {};
		for (const [columnName, field] of Object.entries(table.fields)) {
			out[tableName]![columnName] = {
				type: mapFieldTypeToSql(field.type),
			};
		}
	}
	return out;
}
