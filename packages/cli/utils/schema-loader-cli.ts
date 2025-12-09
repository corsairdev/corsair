import type {
	ColumnInfo,
	CorsairConfig,
	SchemaOutput,
	TableSchema,
} from "@corsair-ai/core/config";

export const schemaLoaderCLI = (config: CorsairConfig<any>) => {
	const dbSchema: SchemaOutput = {};
	if (config.orm === "drizzle") {
		const drizzleConfig = config satisfies CorsairConfig<any>;

		const schema = drizzleConfig.db._.schema;

		if (!schema) {
			throw new Error("No schema found in drizzle instance");
		}

		for (const [tableName, table] of Object.entries(schema)) {
			const tableSchema: TableSchema = {};
			const { columns } = table as any;

			for (const [columnName] of Object.entries(columns)) {
				const column = columns[columnName as keyof typeof columns];

				const columnInfo: ColumnInfo = {
					type: column.dataType,
				};

				tableSchema[columnName] = columnInfo;
			}

			const actualTableName = (table as any).dbName || tableName;
			dbSchema[actualTableName] = tableSchema;
		}
	}
};
