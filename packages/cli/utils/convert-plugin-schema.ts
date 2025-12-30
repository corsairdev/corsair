import type { CorsairDBSchema, DBFieldAttribute } from '@corsair-ai/core/db';

type ResolvedSchema = Record<string, Record<string, string | boolean | number>>;

function convertFieldType(
	value: string | boolean | number,
): DBFieldAttribute['type'] {
	if (value === 'string') return 'string';
	if (value === 'number') return 'number';
	if (value === 'boolean') return 'boolean';
	return 'string';
}

function convertTableSchema(
	tableName: string,
	tableSchema: Record<string, string | boolean | number>,
): {
	fields: Record<string, DBFieldAttribute>;
	modelName: string;
} {
	const fields: Record<string, DBFieldAttribute> = {};

	for (const [fieldName, fieldType] of Object.entries(tableSchema)) {
		fields[fieldName] = {
			type: convertFieldType(fieldType),
			required: true,
		};
	}

	return {
		fields,
		modelName: tableName,
	};
}

export function convertPluginSchemasToDBSchema(
	resolvedSchemas: Record<string, ResolvedSchema>,
): CorsairDBSchema {
	const dbSchema: CorsairDBSchema = {};

	for (const [pluginName, pluginSchema] of Object.entries(resolvedSchemas)) {
		for (const [tableName, tableSchema] of Object.entries(pluginSchema)) {
			const fullTableName = `${pluginName}_${tableName}`;
			const converted = convertTableSchema(fullTableName, tableSchema);

			if (dbSchema[fullTableName]) {
				dbSchema[fullTableName]!.fields = {
					...dbSchema[fullTableName]!.fields,
					...converted.fields,
				};
			} else {
				dbSchema[fullTableName] = converted;
			}
		}
	}

	return dbSchema;
}
