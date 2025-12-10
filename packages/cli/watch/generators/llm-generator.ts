// @ts-nocheck

import type {
	GeneratedQuery,
	Query,
	SchemaDefinition,
} from '../types/state.js';

/**
 * LLM-based query generator (STUB)
 *
 * For now, this creates a basic Drizzle query.
 * Later, this will call Claude API to generate sophisticated queries.
 */
export async function generateQueryWithLLM(
	query: Query,
	schema: SchemaDefinition,
): Promise<GeneratedQuery> {
	// Simulate async LLM call
	await new Promise((resolve) => setTimeout(resolve, 500));

	const functionName = query.id;
	const typeNameResult = capitalize(functionName) + 'Result';
	const typeNameParams = capitalize(functionName) + 'Params';

	// For now, generate a simple query based on the natural language
	const queryCode = generateBasicQuery(
		query,
		schema,
		functionName,
		typeNameResult,
		typeNameParams,
	);
	const types = generateTypes(query, typeNameResult, typeNameParams);

	return {
		queryCode,
		types,
		functionName,
	};
}

function generateBasicQuery(
	query: Query,
	schema: SchemaDefinition,
	functionName: string,
	resultType: string,
	paramsType: string,
): string {
	// Simple heuristic-based generation
	const nlLower = query.nlQuery.toLowerCase();

	// Guess the table name from the query
	const tableGuess = schema.tables.find((table) => {
		return nlLower.includes(table.name.toLowerCase());
	});

	const tableName = tableGuess?.name || schema.tables[0]?.name || 'table';

	return `import { db } from '../db';
import { ${tableName} } from '../schema';
import { eq } from 'drizzle-orm';

export async function ${functionName}(params: ${paramsType}): Promise<${resultType}> {
  // TODO: LLM will generate the actual query logic
  const result = await db.select().from(${tableName}).execute();

  return result as ${resultType};
}`;
}

function generateTypes(
	query: Query,
	resultType: string,
	paramsType: string,
): string {
	const paramsFields = Object.entries(query.params)
		.map(([key, type]) => `  ${key}: ${type};`)
		.join('\n');

	const params = paramsFields
		? `export type ${paramsType} = {\n${paramsFields}\n};`
		: `export type ${paramsType} = Record<string, never>;`;

	return `${params}

export type ${resultType} = any[]; // TODO: LLM will infer the correct type
`;
}

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
