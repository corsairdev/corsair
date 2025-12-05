import type { SchemaOutput } from "../../../config";

export function formattedSchema(schema: SchemaOutput): string {
	if (!schema || Object.keys(schema).length === 0) {
		return "No schema information available.";
	}

	let description = "";

	Object.entries(schema).forEach(([tableName, tableSchema], index) => {
		description += `${tableName}:\n`;

		Object.entries(tableSchema).forEach(([columnName, columnInfo]) => {
			const references = columnInfo.references
				? ` references ${columnInfo.references}`
				: "";
			description += `${columnName}: ${columnInfo.dataType}${references}\n`;
		});

		if (index < Object.keys(schema).length - 1) {
			description += "\n";
		}
	});

	return description;
}
