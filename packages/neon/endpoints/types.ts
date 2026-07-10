import { z } from 'zod';

// Projects
const ProjectsListInputSchema = z.object({
	limit: z.number().optional(),
	cursor: z.string().optional(),
});

const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	region_id: z.string(),
	pg_version: z.number(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSchema),
	pagination: z.object({
		cursor: z.string().optional(),
	}).optional(),
});

const ProjectCreateInputSchema = z.object({
	name: z.string().optional(),
	region_id: z.string().optional(),
	pg_version: z.number().optional(),
});

const ProjectGetInputSchema = z.object({
	projectId: z.string(),
});

// Branches
const BranchesListInputSchema = z.object({
	projectId: z.string(),
});

const BranchSchema = z.object({
	id: z.string(),
	name: z.string(),
	project_id: z.string(),
	parent_id: z.string().optional(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

const BranchesListResponseSchema = z.object({
	branches: z.array(BranchSchema),
});

const BranchCreateInputSchema = z.object({
	projectId: z.string(),
	name: z.string().optional(),
	parent_id: z.string().optional(),
});

const BranchGetInputSchema = z.object({
	projectId: z.string(),
	branchId: z.string(),
});

// Databases
const DatabasesListInputSchema = z.object({
	projectId: z.string(),
	branchId: z.string(),
});

const DatabaseSchema = z.object({
	id: z.number(),
	name: z.string(),
	owner_name: z.string(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

const DatabasesListResponseSchema = z.object({
	databases: z.array(DatabaseSchema),
});

const DatabaseCreateInputSchema = z.object({
	projectId: z.string(),
	branchId: z.string(),
	name: z.string(),
	owner_name: z.string(),
});

// Roles
const RolesListInputSchema = z.object({
	projectId: z.string(),
	branchId: z.string(),
});

const RoleSchema = z.object({
	name: z.string(),
	protected: z.boolean(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

const RolesListResponseSchema = z.object({
	roles: z.array(RoleSchema),
});

const RoleCreateInputSchema = z.object({
	projectId: z.string(),
	branchId: z.string(),
	name: z.string(),
});

// Operations
const OperationGetInputSchema = z.object({
	projectId: z.string(),
	operationId: z.string(),
});

const OperationSchema = z.object({
	id: z.string(),
	project_id: z.string(),
	action: z.string(),
	status: z.enum(['scheduling', 'running', 'finished', 'failed', 'cancelling', 'cancelled', 'skipped']),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type ProjectCreateInput = z.infer<typeof ProjectCreateInputSchema>;
export type ProjectGetInput = z.infer<typeof ProjectGetInputSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export type BranchesListInput = z.infer<typeof BranchesListInputSchema>;
export type BranchesListResponse = z.infer<typeof BranchesListResponseSchema>;
export type BranchCreateInput = z.infer<typeof BranchCreateInputSchema>;
export type BranchGetInput = z.infer<typeof BranchGetInputSchema>;
export type Branch = z.infer<typeof BranchSchema>;

export type DatabasesListInput = z.infer<typeof DatabasesListInputSchema>;
export type DatabasesListResponse = z.infer<typeof DatabasesListResponseSchema>;
export type DatabaseCreateInput = z.infer<typeof DatabaseCreateInputSchema>;
export type Database = z.infer<typeof DatabaseSchema>;

export type RolesListInput = z.infer<typeof RolesListInputSchema>;
export type RolesListResponse = z.infer<typeof RolesListResponseSchema>;
export type RoleCreateInput = z.infer<typeof RoleCreateInputSchema>;
export type Role = z.infer<typeof RoleSchema>;

export type OperationGetInput = z.infer<typeof OperationGetInputSchema>;
export type Operation = z.infer<typeof OperationSchema>;

export type NeonEndpointInputs = {
	projectsList: ProjectsListInput;
	projectsGet: ProjectGetInput;
	projectsCreate: ProjectCreateInput;
	branchesList: BranchesListInput;
	branchesGet: BranchGetInput;
	branchesCreate: BranchCreateInput;
	databasesList: DatabasesListInput;
	databasesCreate: DatabaseCreateInput;
	rolesList: RolesListInput;
	rolesCreate: RoleCreateInput;
	operationsGet: OperationGetInput;
};

export type NeonEndpointOutputs = {
	projectsList: ProjectsListResponse;
	projectsGet: Project;
	projectsCreate: Project;
	branchesList: BranchesListResponse;
	branchesGet: Branch;
	branchesCreate: Branch;
	databasesList: DatabasesListResponse;
	databasesCreate: Database;
	rolesList: RolesListResponse;
	rolesCreate: Role;
	operationsGet: Operation;
};

export const NeonEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectGetInputSchema,
	projectsCreate: ProjectCreateInputSchema,
	branchesList: BranchesListInputSchema,
	branchesGet: BranchGetInputSchema,
	branchesCreate: BranchCreateInputSchema,
	databasesList: DatabasesListInputSchema,
	databasesCreate: DatabaseCreateInputSchema,
	rolesList: RolesListInputSchema,
	rolesCreate: RoleCreateInputSchema,
	operationsGet: OperationGetInputSchema,
} as const;

export const NeonEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectSchema,
	projectsCreate: ProjectSchema,
	branchesList: BranchesListResponseSchema,
	branchesGet: BranchSchema,
	branchesCreate: BranchSchema,
	databasesList: DatabasesListResponseSchema,
	databasesCreate: DatabaseSchema,
	rolesList: RolesListResponseSchema,
	rolesCreate: RoleSchema,
	operationsGet: OperationSchema,
} as const;
