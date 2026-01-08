import type { CorsairDBAdapter } from '../../../src/core/db/adapter';
import type { CorsairOptions } from '../../../src/core/options';
import { getCorsairTables } from '../../../src/core/schema/get-tables';
import type { DBFieldAttribute } from '../../../src/core/schema/types';

export async function generateDrizzleSchema(opts: {
	adapter: CorsairDBAdapter;
	file?: string;
	options: CorsairOptions;
}) {
	const fileName = opts.file ?? './corsair-schema.ts';

	const provider = opts.adapter.options?.provider as
		| 'sqlite'
		| 'pg'
		| 'mysql'
		| undefined;
	if (!provider) {
		throw new Error(
			`Drizzle provider is missing. Pass drizzleAdapter(db, { provider: 'sqlite' | 'pg' | 'mysql' }).`,
		);
	}
	if (provider !== 'sqlite') {
		throw new Error(
			`Only provider 'sqlite' is supported in Corsair's Drizzle generator right now.`,
		);
	}

	const tables = getCorsairTables(opts.options);
	const ordered = Object.entries(tables).sort(
		(a, b) => (a[1].order ?? Infinity) - (b[1].order ?? Infinity),
	);

	const tableVarName = (modelName: string) =>
		modelName.replace(/[^a-zA-Z0-9_]/g, '_');

	const col = (fieldName: string, attr: DBFieldAttribute) => {
		let expr: string;
		switch (attr.type) {
			case 'string':
				expr = `text('${fieldName}')`;
				break;
			case 'number':
				expr = `integer('${fieldName}')`;
				break;
			case 'boolean':
				expr = `integer('${fieldName}', { mode: 'boolean' })`;
				break;
			case 'date':
				expr = `integer('${fieldName}', { mode: 'timestamp_ms' })`;
				break;
			case 'json':
				expr = `text('${fieldName}')`;
				break;
			default:
				expr = `text('${fieldName}')`;
		}

		// drizzle defaults: only handle the common new Date() case as defaultNow-esque
		if (typeof attr.defaultValue === 'function' && attr.type === 'date') {
			expr += `.default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)`;
		}

		if (attr.required) expr += `.notNull()`;
		if (attr.unique) expr += `.unique()`;

		// references (assumes referenced table is declared earlier)
		if (attr.references) {
			const refTableModelName =
				tables[attr.references.model]?.modelName ?? attr.references.model;
			const refTable = tableVarName(refTableModelName);
			const refField =
				tables[attr.references.model]?.fields[attr.references.field]
					?.fieldName ?? attr.references.field;
			expr += `.references(() => ${refTable}.${refField}, { onDelete: '${attr.references.onDelete ?? 'cascade'}' })`;
		}

		return expr;
	};

	let code = `import { sql } from 'drizzle-orm';\nimport { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';\n\n`;

	for (const [, table] of ordered) {
		const modelName = table.modelName;
		const varName = tableVarName(modelName);
		const fields = table.fields;

		const lines: string[] = [];
		for (const [fieldKey, attr] of Object.entries(fields)) {
			const fieldName = attr.fieldName || fieldKey;
			if (fieldName === 'id') {
				lines.push(`\tid: text('id').primaryKey()`);
				continue;
			}
			lines.push(`\t${fieldName}: ${col(fieldName, attr)}`);
		}

		code += `export const ${varName} = sqliteTable('${modelName}', {\n${lines.join(
			',\n',
		)}\n});\n\n`;
	}

	return {
		code,
		fileName,
		overwrite: true,
	};
}
