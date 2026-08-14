import { z } from 'zod';
import type { PrismaOperation } from './operations';
import { prismaOperations } from './operations';

const QuerySchema = z.record(z.string(), z.unknown());

export const PrismaEndpointInputBaseSchema = z.object({
	workspaceId: z.string().min(1).optional(),
	projectId: z.string().min(1).optional(),
	databaseId: z.string().min(1).optional(),
	connectionId: z.string().min(1).optional(),
	targetDatabaseId: z.string().min(1).optional(),
	backupId: z.string().min(1).optional(),
	regionId: z.string().min(1).optional(),
	// cursor pagination + usage period are first-class on list/usage ops
	cursor: z.string().optional(),
	limit: z.number().int().positive().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	// request bodies are operation-specific json; the prisma api validates
	// their shape, so they intentionally stay unknown at this layer
	body: z.unknown().optional(),
	query: QuerySchema.optional(),
	headers: z.record(z.string(), z.string()).optional(),
});

// direct postgres connection fields shared by the sql + schema operations
const PostgresConnectionShape = {
	host: z.string().min(1),
	port: z.number().int().positive().optional(),
	user: z.string().min(1),
	password: z.string().min(1),
	database: z.string().min(1),
	sslRejectUnauthorized: z.boolean().optional(),
} as const;

export type PrismaEndpointInput = z.infer<
	typeof PrismaEndpointInputBaseSchema
> & {
	[key: string]: unknown;
};

// responses are operation-specific json passed through to callers; they
// intentionally stay unknown here and callers narrow them as needed
export type PrismaEndpointOutput = unknown;

export type PrismaEndpointInputs = Record<string, PrismaEndpointInput>;

export type PrismaEndpointOutputs = Record<string, PrismaEndpointOutput>;

export const PrismaEndpointOutputSchema = z.unknown();

function inputSchemaForOperation(operation: PrismaOperation) {
	const requiredParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	return PrismaEndpointInputBaseSchema.extend(requiredParams);
}

export const QueryDatabaseInputSchema = PrismaEndpointInputBaseSchema.extend({
	...PostgresConnectionShape,
	sql: z.string().min(1),
	params: z.array(z.unknown()).optional(),
});

export const ExecuteDatabaseCommandInputSchema = QueryDatabaseInputSchema;

export const InspectDatabaseSchemaInputSchema =
	PrismaEndpointInputBaseSchema.extend(PostgresConnectionShape);

export const PostgresQueryResultSchema = z.object({
	rows: z.array(z.record(z.string(), z.unknown())),
	rowCount: z.number().nullable(),
	command: z.string(),
});

export const InspectDatabaseSchemaOutputSchema = z.object({
	tables: z.array(
		z.object({
			schema: z.string(),
			name: z.string(),
			columns: z.array(
				z.object({
					name: z.string(),
					type: z.string(),
					nullable: z.boolean(),
					default: z.string().nullable(),
				}),
			),
			foreignKeys: z.array(
				z.object({
					column: z.string(),
					foreignTable: z.string(),
					foreignColumn: z.string(),
				}),
			),
		}),
	),
});

// Object.fromEntries infers a value type union across all entries; assert to
// the homogeneous record the entries are built as (one zod schema per
// operation key from prismaOperations)
export const PrismaEndpointInputSchemas = Object.fromEntries(
	prismaOperations.map((operation: PrismaOperation) => [
		operation.key,
		operation.kind === 'sql'
			? operation.name === 'execute'
				? ExecuteDatabaseCommandInputSchema
				: QueryDatabaseInputSchema
			: operation.kind === 'schema'
				? InspectDatabaseSchemaInputSchema
				: inputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

// same rationale as PrismaEndpointInputSchemas above; only the direct
// postgres operations have a shaped output, everything else passes through
export const PrismaEndpointOutputSchemas = Object.fromEntries(
	prismaOperations.map((operation: PrismaOperation) => {
		if (operation.kind === 'sql') {
			return [operation.key, PostgresQueryResultSchema];
		}
		if (operation.kind === 'schema') {
			return [operation.key, InspectDatabaseSchemaOutputSchema];
		}
		return [operation.key, PrismaEndpointOutputSchema];
	}),
) as Record<string, z.ZodTypeAny>;
