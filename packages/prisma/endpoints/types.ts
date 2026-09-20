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
	query: QuerySchema.optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
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

// ---- POST body input schemas ----------------------------------------------

const CreateProjectBodySchema = z
	.object({
		name: z.string().min(1),
		displayName: z.string().optional(),
		region: z.string().min(1),
		createDatabase: z.boolean().optional(),
	})
	.passthrough();

const TransferProjectBodySchema = z.object({
	recipientAccessToken: z.string().min(1),
});

const CreateDatabaseBodySchema = z
	.object({
		name: z.string().min(1),
		region: z.string().min(1),
		isDefault: z.boolean().optional(),
	})
	.passthrough();

const RestoreBackupBodySchema = z.object({
	backupId: z.string().min(1),
});

const CreateConnectionBodySchema = z
	.object({
		name: z.string().min(1),
		databaseId: z.string().min(1),
	})
	.passthrough();

export const PRISMA_REST_BODY_INPUT_SCHEMAS: Record<string, z.ZodTypeAny> = {
	createProject: CreateProjectBodySchema,
	transferProject: TransferProjectBodySchema,
	createDatabase: CreateDatabaseBodySchema,
	restoreBackup: RestoreBackupBodySchema,
	createConnection: CreateConnectionBodySchema,
};

function inputSchemaForOperation(operation: PrismaOperation) {
	const requiredParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	const bodySchema = PRISMA_REST_BODY_INPUT_SCHEMAS[operation.key];
	if (!bodySchema) {
		// Operations without a body schema (e.g. GET, DELETE) reject arbitrary request bodies
		return PrismaEndpointInputBaseSchema.extend({
			...requiredParams,
			body: z.undefined().optional(),
		}).passthrough();
	}
	return PrismaEndpointInputBaseSchema.extend({
		...requiredParams,
		body: bodySchema.optional(),
	}).passthrough();
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

// ---- REST output schemas ---------------------------------------------------
// Verified against the Management API (public getting-started guide returns
// bare camelCase resources, e.g. create project => { id, createdAt, name,
// databases[] }). Fields beyond the documented ones are passed through.

const PrismaApiKeySchema = z
	.object({
		id: z.string().min(1),
		createdAt: z.string().optional(),
		apiKey: z.string().optional(),
		connectionString: z.string().optional(),
		ppgDirectConnection: z
			.object({
				host: z.string().optional(),
				user: z.string().optional(),
				pass: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const PrismaDatabaseSchema = z
	.object({
		id: z.string().min(1),
		createdAt: z.string().optional(),
		name: z.string().optional(),
		connectionString: z.string().optional(),
		region: z.string().optional(),
		status: z.string().optional(),
		isDefault: z.boolean().optional(),
		apiKeys: z.array(PrismaApiKeySchema).optional(),
	})
	.passthrough();

const PrismaProjectSchema = z
	.object({
		id: z.string().min(1),
		createdAt: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().nullable().optional(),
		workspaceId: z.string().optional(),
		region: z.string().optional(),
		logicalId: z.string().optional(),
		databases: z.array(PrismaDatabaseSchema).optional(),
	})
	.passthrough();

const PrismaWorkspaceSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
	})
	.passthrough();

const PrismaConnectionSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		databaseId: z.string().optional(),
		connectionString: z.string().optional(),
		type: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

const PrismaBackupSchema = z
	.object({
		id: z.string().min(1),
		databaseId: z.string().optional(),
		status: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

const PrismaRegionSchema = z
	.object({
		id: z.string().min(1),
		region: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().optional(),
		available: z.boolean().optional(),
		status: z.string().optional(),
		product: z.string().optional(),
	})
	.passthrough();

const PrismaIntegrationSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		workspaceId: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

// a single resource or a list envelope (the API returns a bare resource for
// get/create and an array/envelope for lists)
const singleResource = <T extends z.ZodTypeAny>(schema: T) =>
	z.union([
		schema,
		z.object({ data: schema }).passthrough(),
		z.object({ project: schema }).passthrough(),
		z.object({ database: schema }).passthrough(),
		z.object({ connection: schema }).passthrough(),
	]);

const resourceOrList = <T extends z.ZodTypeAny>(schema: T) =>
	z.union([
		schema,
		z.array(schema),
		z.object({ items: z.array(schema) }).passthrough(),
		z.object({ data: z.union([schema, z.array(schema)]) }).passthrough(),
	]);

const ListWorkspacesOutputSchema = resourceOrList(PrismaWorkspaceSchema);
const CreateProjectOutputSchema = singleResource(PrismaProjectSchema);
const GetProjectOutputSchema = singleResource(PrismaProjectSchema);
const ListProjectsOutputSchema = resourceOrList(PrismaProjectSchema);
const TransferProjectOutputSchema = singleResource(PrismaProjectSchema);
const CreateDatabaseOutputSchema = singleResource(PrismaDatabaseSchema);
const GetDatabaseOutputSchema = singleResource(PrismaDatabaseSchema);
const ListDatabasesOutputSchema = resourceOrList(PrismaDatabaseSchema);
const PrismaUsageMetricPointSchema = z
	.object({
		timestamp: z.string().optional(),
		value: z.number().optional(),
	})
	.passthrough();

const PrismaUsageBreakdownSchema = z
	.object({
		reads: z.number().optional(),
		writes: z.number().optional(),
		total: z.number().optional(),
		bytes: z.number().optional(),
		history: z.array(PrismaUsageMetricPointSchema).optional(),
	})
	.passthrough();

const PrismaDatabaseUsageSchema = z
	.object({
		databaseId: z.string().optional(),
		id: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		storage: z.union([z.number(), PrismaUsageBreakdownSchema]).optional(),
		operations: z.union([z.number(), PrismaUsageBreakdownSchema]).optional(),
		reads: z.union([z.number(), PrismaUsageBreakdownSchema]).optional(),
		writes: z.union([z.number(), PrismaUsageBreakdownSchema]).optional(),
		totalOperations: z.number().optional(),
		metrics: z
			.union([
				z.array(PrismaUsageMetricPointSchema),
				z.record(z.string(), z.union([z.number(), PrismaUsageBreakdownSchema])),
			])
			.optional(),
	})
	.passthrough();

const GetDatabaseUsageOutputSchema = z.union([
	PrismaDatabaseUsageSchema,
	z.object({ data: PrismaDatabaseUsageSchema }).passthrough(),
	z.object({ usage: PrismaDatabaseUsageSchema }).passthrough(),
]);
const CreateConnectionOutputSchema = singleResource(PrismaConnectionSchema);
const ListConnectionsOutputSchema = resourceOrList(PrismaConnectionSchema);
const ListBackupsOutputSchema = resourceOrList(PrismaBackupSchema);
const ListRegionsOutputSchema = resourceOrList(PrismaRegionSchema);
const ListPostgresRegionsOutputSchema = resourceOrList(PrismaRegionSchema);
const ListAccelerateRegionsOutputSchema = resourceOrList(PrismaRegionSchema);
const ListWorkspaceIntegrationsOutputSchema = resourceOrList(
	PrismaIntegrationSchema,
);

// destructive DELETE / restore endpoints return 204 No Content (or an empty
// 202 Accepted body) — the response carries no resource payload. Only an
// actually-empty response is valid: undefined, null, or a bare `{}` — a
// non-empty object means the provider returned an incompatible payload, so it
// must fail output validation instead of passing through.
const EmptyResponseSchema = z.union([
	z.undefined(),
	z.null(),
	z.object({}).strict(),
]);

const PRISMA_REST_OUTPUT_SCHEMAS: Record<string, z.ZodTypeAny> = {
	listWorkspaces: ListWorkspacesOutputSchema,
	createProject: CreateProjectOutputSchema,
	getProject: GetProjectOutputSchema,
	listProjects: ListProjectsOutputSchema,
	transferProject: TransferProjectOutputSchema,
	deleteProject: EmptyResponseSchema,
	createDatabase: CreateDatabaseOutputSchema,
	getDatabase: GetDatabaseOutputSchema,
	listDatabases: ListDatabasesOutputSchema,
	deleteDatabase: EmptyResponseSchema,
	getDatabaseUsage: GetDatabaseUsageOutputSchema,
	createConnection: CreateConnectionOutputSchema,
	listConnections: ListConnectionsOutputSchema,
	deleteConnection: EmptyResponseSchema,
	listBackups: ListBackupsOutputSchema,
	restoreBackup: EmptyResponseSchema,
	listRegions: ListRegionsOutputSchema,
	listPostgresRegions: ListPostgresRegionsOutputSchema,
	listAccelerateRegions: ListAccelerateRegionsOutputSchema,
	listWorkspaceIntegrations: ListWorkspaceIntegrationsOutputSchema,
};

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

// operation-specific output schemas for the REST Management API operations;
// the direct-postgres operations keep their shaped (non-unknown) schemas.
// Every REST operation must have an explicit registration in
// PRISMA_REST_OUTPUT_SCHEMAS — there is no z.unknown() fallback, and a missing
// registration fails schema construction rather than accepting any payload.
export const PrismaEndpointOutputSchemas = Object.fromEntries(
	prismaOperations.map((operation: PrismaOperation) => {
		if (operation.kind === 'sql') {
			return [operation.key, PostgresQueryResultSchema];
		}
		if (operation.kind === 'schema') {
			return [operation.key, InspectDatabaseSchemaOutputSchema];
		}
		const schema = PRISMA_REST_OUTPUT_SCHEMAS[operation.key];
		if (!schema) {
			throw new Error(
				`[prisma] missing REST output schema for ${operation.key}`,
			);
		}
		return [operation.key, schema];
	}),
) as Record<string, z.ZodTypeAny>;
