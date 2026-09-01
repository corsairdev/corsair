import { z } from 'zod';

const ConnecteamUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phoneNumber: z.string().optional(),
	userType: z.string().optional(),
	email: z.string().optional(),
	customFields: z.array(z.unknown()).optional(),
	isArchived: z.boolean().optional(),
	userId: z.number(),
	createdAt: z.number().optional(),
	modifiedAt: z.number().optional(),
	lastLogin: z.number().optional(),
	smartGroupsIds: z.array(z.number()).optional(),
});

// ==================== GET USERS ====================

const GetUsersInputSchema = z.object({
	limit: z.number().int().min(1).max(500).optional(),
	offset: z.number().int().min(0).optional(),
	sort: z.enum(['created_at']).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	userIds: z.array(z.number()).optional(),
	userStatus: z.enum(['active', 'archived', 'all']).optional(),
	fullNames: z.array(z.string()).optional(),
	phoneNumbers: z.array(z.string()).optional(),
	emailAddresses: z.array(z.string()).optional(),
	createdAt: z.number().int().min(1).optional(),
	modifiedAt: z.number().int().min(1).optional(),
	lastLogin: z.number().int().min(1).optional(),
	archivedAt: z.number().int().min(1).optional(),
});

export type GetUsersInput = z.infer<typeof GetUsersInputSchema>;

const GetUsersResponseSchema = z.object({
	requestId: z.string().optional(),
	data: z.object({
		users: z.array(ConnecteamUserSchema),
	}),
	paging: z
		.object({
			offset: z.number().optional(),
		})
		.optional(),
});

export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;

// ==================== GET USER BY ID ====================

const GetUserByIdInputSchema = z.object({
	userId: z.number().int().positive(),
});

export type GetUserByIdInput = z.infer<typeof GetUserByIdInputSchema>;

const GetUserByIdResponseSchema = z.object({
	requestId: z.string().optional(),
	data: z.object({
		user: ConnecteamUserSchema,
	}),
});

export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseSchema>;

// ==================== ARCHIVE USERS ====================

const ArchiveUsersInputSchema = z.object({
	userIds: z.array(z.number().int().positive()).min(1),
	deletionType: z.enum(['archive', 'delete']).optional(),
});

export type ArchiveUsersInput = z.infer<typeof ArchiveUsersInputSchema>;

const ArchiveUsersResponseSchema = z.object({
	requestId: z.string().optional(),
});

export type ArchiveUsersResponse = z.infer<typeof ArchiveUsersResponseSchema>;

// ==================== CREATE USERS ====================

const CreateUserSchema = z.object({
	firstName: z.string(),
	lastName: z.string().optional(),
	phoneNumber: z.string().optional(),
	email: z.string().optional(),
	userType: z.string().optional(),
});

const CreateUsersInputSchema = z.object({
	users: z.array(CreateUserSchema).min(1),
});

export type CreateUsersInput = z.infer<typeof CreateUsersInputSchema>;

const CreateUsersResponseSchema = z.object({
	requestId: z.string().optional(),
	data: z
		.object({
			results: z.array(ConnecteamUserSchema).optional(),
		})
		.optional(),
});

export type CreateUsersResponse = z.infer<typeof CreateUsersResponseSchema>;

// ==================== UPDATE USERS ====================

const UpdateUserSchema = z.object({
	userId: z.number().int().positive().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phoneNumber: z.string().optional(),
	userType: z.string().optional(),
	email: z.string().optional(),
	customFields: z.array(z.unknown()).optional(),
	isArchived: z.boolean().optional(),
});

const UpdateUsersInputSchema = z.object({
	users: z.array(UpdateUserSchema).min(1),
	editUsersByPhone: z.boolean().optional(),
	includeSmartGroupIds: z.boolean().optional(),
});

export type UpdateUsersInput = z.infer<typeof UpdateUsersInputSchema>;

const UpdateUsersResponseSchema = z.object({
	requestId: z.string().optional(),
	data: z
		.object({
			count: z.number().optional(),
			users: z.array(ConnecteamUserSchema).optional(),
		})
		.optional(),
});

export type UpdateUsersResponse = z.infer<typeof UpdateUsersResponseSchema>;

// ==================== ENDPOINT INPUTS ====================

export type ConnecteamEndpointInputs = {
	getUsers: GetUsersInput;
	getUserById: GetUserByIdInput;
	archiveUsers: ArchiveUsersInput;
	createUsers: CreateUsersInput;
	updateUsers: UpdateUsersInput;
};

// ==================== ENDPOINT OUTPUTS ====================

export type ConnecteamEndpointOutputs = {
	getUsers: GetUsersResponse;
	getUserById: GetUserByIdResponse;
	archiveUsers: ArchiveUsersResponse;
	createUsers: CreateUsersResponse;
	updateUsers: UpdateUsersResponse;
};

// ==================== INPUT SCHEMAS ====================

export const ConnecteamEndpointInputSchemas = {
	getUsers: GetUsersInputSchema,
	getUserById: GetUserByIdInputSchema,
	archiveUsers: ArchiveUsersInputSchema,
	createUsers: CreateUsersInputSchema,
	updateUsers: UpdateUsersInputSchema,
} as const;

// ==================== OUTPUT SCHEMAS ====================

export const ConnecteamEndpointOutputSchemas = {
	getUsers: GetUsersResponseSchema,
	getUserById: GetUserByIdResponseSchema,
	archiveUsers: ArchiveUsersResponseSchema,
	createUsers: CreateUsersResponseSchema,
	updateUsers: UpdateUsersResponseSchema,
} as const;
