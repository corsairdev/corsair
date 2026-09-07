import { z } from 'zod';

const DatabaseSchema = z.object({
	name: z.string(),
	dbId: z.string().optional(),
	hostname: z.string().optional(),
	group: z.string().optional(),
	regions: z.array(z.string()).optional(),
});

export type Database = z.infer<typeof DatabaseSchema>;

// List databases
const ListDatabasesInputSchema = z.object({
	organizationSlug: z.string(),
});

export type ListDatabasesInput = z.infer<typeof ListDatabasesInputSchema>;

const ListDatabasesResponseSchema = z.object({
	databases: z.array(DatabaseSchema),
});

export type ListDatabasesResponse = z.infer<typeof ListDatabasesResponseSchema>;

// Create database
const CreateDatabaseInputSchema = z.object({
	organizationSlug: z.string(),
	name: z.string(),
	group: z.string(),
});

export type CreateDatabaseInput = z.infer<typeof CreateDatabaseInputSchema>;

const CreateDatabaseResponseSchema = DatabaseSchema;

export type CreateDatabaseResponse = z.infer<
	typeof CreateDatabaseResponseSchema
>;

// Delete database
const DeleteDatabaseInputSchema = z.object({
	organizationSlug: z.string(),
	databaseName: z.string(),
});

export type DeleteDatabaseInput = z.infer<typeof DeleteDatabaseInputSchema>;

const DeleteDatabaseResponseSchema = z.object({
	name: z.string(),
});

export type DeleteDatabaseResponse = z.infer<
	typeof DeleteDatabaseResponseSchema
>;

export type TursoEndpointInputs = {
	listDatabases: ListDatabasesInput;
	createDatabase: CreateDatabaseInput;
	deleteDatabase: DeleteDatabaseInput;
};

export type TursoEndpointOutputs = {
	listDatabases: ListDatabasesResponse;
	createDatabase: CreateDatabaseResponse;
	deleteDatabase: DeleteDatabaseResponse;
};

export const TursoEndpointInputSchemas = {
	listDatabases: ListDatabasesInputSchema,
	createDatabase: CreateDatabaseInputSchema,
	deleteDatabase: DeleteDatabaseInputSchema,
} as const;

export const TursoEndpointOutputSchemas = {
	listDatabases: ListDatabasesResponseSchema,
	createDatabase: CreateDatabaseResponseSchema,
	deleteDatabase: DeleteDatabaseResponseSchema,
} as const;
