import { z } from 'zod';
import {
	ConnecteamAccountEntity,
	ConnecteamConversationEntity,
	ConnecteamCustomFieldCategoryEntity,
	ConnecteamCustomFieldEntity,
	ConnecteamFormEntity,
	ConnecteamJobEntity,
	ConnecteamPerformanceIndicatorEntity,
	ConnecteamPolicyTypeEntity,
	ConnecteamPublisherEntity,
	ConnecteamSchedulerEntity,
	ConnecteamSmartGroupEntity,
	ConnecteamTaskBoardEntity,
	ConnecteamUserEntity,
} from '../schema/database';

const Paging = z
	.object({
		offset: z.number().optional(),
	})
	.loose()
	.optional();

const Limit = z.number().int().min(1).max(500).optional();
const ChatLimit = z.number().int().min(1).max(100).optional();
const FormsLimit = z.number().int().min(1).max(300).optional();
const Offset = z.number().int().min(0).optional();
const IsoDate = z.iso.date().optional();

function envelope<T extends z.ZodType>(data: T) {
	return z
		.object({
			requestId: z.string().optional(),
			data,
			paging: Paging,
		})
		.loose();
}

const EmptyInput = z.object({});

const GetUsersInputSchema = z.object({
	limit: Limit,
	offset: Offset,
	sort: z.enum(['created_at']).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	userIds: z.array(z.number().int().positive()).optional(),
	userStatus: z.enum(['active', 'archived', 'all']).optional(),
	fullNames: z.array(z.string()).optional(),
	phoneNumbers: z.array(z.string()).optional(),
	emailAddresses: z.array(z.string()).optional(),
	createdAt: z.number().int().min(1).optional(),
	modifiedAt: z.number().int().min(1).optional(),
	lastLogin: z.number().int().min(1).optional(),
	archivedAt: z.number().int().min(1).optional(),
});

const ArchiveUsersInputSchema = z.object({
	userIds: z.array(z.number().int().positive()).min(1),
});

const CreateUserSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().optional(),
	phoneNumber: z.string().min(1),
	email: z.string().optional(),
	userType: z.enum(['user']).optional(),
	isArchived: z.boolean().optional(),
	customFields: z.array(z.unknown()).optional(),
});

const CreateUsersInputSchema = z.object({
	users: z.array(CreateUserSchema).min(1),
	sendActivation: z.boolean().optional(),
});

const GenerateUploadUrlInputSchema = z.object({
	fileName: z.string().min(1),
	featureType: z.enum(['chat', 'shiftscheduler', 'users', 'quicktasks']),
	fileTypeHint: z.string().optional(),
});

const GetChatInputSchema = z.object({
	limit: ChatLimit,
	offset: Offset,
});

const GetCustomFieldCategoriesInputSchema = z.object({
	limit: Limit,
	offset: Offset,
	ids: z.array(z.number().int().positive()).optional(),
	names: z.array(z.string()).optional(),
});

const GetCustomFieldsInputSchema = z.object({
	limit: Limit,
	offset: Offset,
	customFieldTypes: z.array(z.string()).optional(),
	customFieldIds: z.array(z.number().int().positive()).optional(),
	names: z.array(z.string()).optional(),
	categoryIds: z.array(z.number().int().positive()).optional(),
});

const GetFormsInputSchema = z.object({
	name: z.string().optional(),
	startDate: IsoDate,
	endDate: IsoDate,
	limit: FormsLimit,
	offset: Offset,
});

const GetJobsInputSchema = z.object({
	instanceIds: z.array(z.number().int().positive()).optional(),
	jobIds: z.array(z.string()).optional(),
	jobNames: z.array(z.string()).optional(),
	jobCodes: z.array(z.string()).optional(),
	includeDeleted: z.boolean().optional(),
	sort: z.enum(['title']).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	limit: Limit,
	offset: Offset,
});

const GetSmartGroupsInputSchema = z.object({
	id: z.number().int().positive().optional(),
	name: z.string().optional(),
});

export type ConnecteamEndpointInputs = {
	listMe: z.infer<typeof EmptyInput>;
	getUsers: z.infer<typeof GetUsersInputSchema>;
	createUsers: z.infer<typeof CreateUsersInputSchema>;
	archiveUsers: z.infer<typeof ArchiveUsersInputSchema>;
	generateUploadUrl: z.infer<typeof GenerateUploadUrlInputSchema>;
	getChat: z.infer<typeof GetChatInputSchema>;
	getCustomFieldCategories: z.infer<typeof GetCustomFieldCategoriesInputSchema>;
	getCustomFields: z.infer<typeof GetCustomFieldsInputSchema>;
	getForms: z.infer<typeof GetFormsInputSchema>;
	getJobs: z.infer<typeof GetJobsInputSchema>;
	getPerformanceIndicators: z.infer<typeof EmptyInput>;
	getPolicyTypes: z.infer<typeof EmptyInput>;
	getPublishers: z.infer<typeof EmptyInput>;
	getSchedulers: z.infer<typeof EmptyInput>;
	getSmartGroups: z.infer<typeof GetSmartGroupsInputSchema>;
	getTaskBoards: z.infer<typeof EmptyInput>;
};

const ListMeResponseSchema = envelope(ConnecteamAccountEntity);
const GetUsersResponseSchema = envelope(
	z.object({ users: z.array(ConnecteamUserEntity) }).loose(),
);
const CreateUsersResponseSchema = envelope(
	z
		.object({
			results: z.array(ConnecteamUserEntity).optional(),
		})
		.loose()
		.optional(),
);
const ArchiveUsersResponseSchema = z
	.object({
		requestId: z.string().optional(),
	})
	.loose();
const GenerateUploadUrlResponseSchema = envelope(
	z
		.object({
			fileId: z.string(),
			uploadFileUrl: z.string(),
		})
		.loose(),
);
const GetChatResponseSchema = envelope(
	z
		.object({
			conversations: z.array(ConnecteamConversationEntity).optional(),
		})
		.loose(),
);
const GetCustomFieldCategoriesResponseSchema = envelope(
	z
		.object({
			categories: z.array(ConnecteamCustomFieldCategoryEntity),
		})
		.loose(),
);
const GetCustomFieldsResponseSchema = envelope(
	z
		.object({
			customFields: z.array(ConnecteamCustomFieldEntity),
		})
		.loose(),
);
const GetFormsResponseSchema = envelope(
	z.object({ forms: z.array(ConnecteamFormEntity) }).loose(),
);
const GetJobsResponseSchema = envelope(
	z
		.object({
			jobs: z.array(ConnecteamJobEntity),
			paging: Paging,
		})
		.loose(),
);
const GetPerformanceIndicatorsResponseSchema = envelope(
	z
		.object({
			indicators: z.array(ConnecteamPerformanceIndicatorEntity).optional(),
			performanceIndicators: z
				.array(ConnecteamPerformanceIndicatorEntity)
				.optional(),
		})
		.loose(),
);
const GetPolicyTypesResponseSchema = envelope(
	z
		.object({
			policyTypes: z.array(ConnecteamPolicyTypeEntity).optional(),
			policies: z.array(ConnecteamPolicyTypeEntity).optional(),
		})
		.loose(),
);
const GetPublishersResponseSchema = envelope(
	z
		.object({
			publishers: z.array(ConnecteamPublisherEntity).optional(),
		})
		.loose(),
);
const GetSchedulersResponseSchema = envelope(
	z
		.object({
			schedulers: z.array(ConnecteamSchedulerEntity),
		})
		.loose(),
);
const GetSmartGroupsResponseSchema = envelope(
	z
		.object({
			groups: z.array(ConnecteamSmartGroupEntity).optional(),
			smartGroups: z.array(ConnecteamSmartGroupEntity).optional(),
		})
		.loose(),
);
const GetTaskBoardsResponseSchema = envelope(
	z
		.object({
			taskBoards: z.array(ConnecteamTaskBoardEntity).optional(),
			taskboards: z.array(ConnecteamTaskBoardEntity).optional(),
		})
		.loose(),
);

export type ConnecteamEndpointOutputs = {
	listMe: z.infer<typeof ListMeResponseSchema>;
	getUsers: z.infer<typeof GetUsersResponseSchema>;
	createUsers: z.infer<typeof CreateUsersResponseSchema>;
	archiveUsers: z.infer<typeof ArchiveUsersResponseSchema>;
	generateUploadUrl: z.infer<typeof GenerateUploadUrlResponseSchema>;
	getChat: z.infer<typeof GetChatResponseSchema>;
	getCustomFieldCategories: z.infer<
		typeof GetCustomFieldCategoriesResponseSchema
	>;
	getCustomFields: z.infer<typeof GetCustomFieldsResponseSchema>;
	getForms: z.infer<typeof GetFormsResponseSchema>;
	getJobs: z.infer<typeof GetJobsResponseSchema>;
	getPerformanceIndicators: z.infer<
		typeof GetPerformanceIndicatorsResponseSchema
	>;
	getPolicyTypes: z.infer<typeof GetPolicyTypesResponseSchema>;
	getPublishers: z.infer<typeof GetPublishersResponseSchema>;
	getSchedulers: z.infer<typeof GetSchedulersResponseSchema>;
	getSmartGroups: z.infer<typeof GetSmartGroupsResponseSchema>;
	getTaskBoards: z.infer<typeof GetTaskBoardsResponseSchema>;
};

export const ConnecteamEndpointInputSchemas = {
	listMe: EmptyInput,
	getUsers: GetUsersInputSchema,
	createUsers: CreateUsersInputSchema,
	archiveUsers: ArchiveUsersInputSchema,
	generateUploadUrl: GenerateUploadUrlInputSchema,
	getChat: GetChatInputSchema,
	getCustomFieldCategories: GetCustomFieldCategoriesInputSchema,
	getCustomFields: GetCustomFieldsInputSchema,
	getForms: GetFormsInputSchema,
	getJobs: GetJobsInputSchema,
	getPerformanceIndicators: EmptyInput,
	getPolicyTypes: EmptyInput,
	getPublishers: EmptyInput,
	getSchedulers: EmptyInput,
	getSmartGroups: GetSmartGroupsInputSchema,
	getTaskBoards: EmptyInput,
} as const;

export const ConnecteamEndpointOutputSchemas = {
	listMe: ListMeResponseSchema,
	getUsers: GetUsersResponseSchema,
	createUsers: CreateUsersResponseSchema,
	archiveUsers: ArchiveUsersResponseSchema,
	generateUploadUrl: GenerateUploadUrlResponseSchema,
	getChat: GetChatResponseSchema,
	getCustomFieldCategories: GetCustomFieldCategoriesResponseSchema,
	getCustomFields: GetCustomFieldsResponseSchema,
	getForms: GetFormsResponseSchema,
	getJobs: GetJobsResponseSchema,
	getPerformanceIndicators: GetPerformanceIndicatorsResponseSchema,
	getPolicyTypes: GetPolicyTypesResponseSchema,
	getPublishers: GetPublishersResponseSchema,
	getSchedulers: GetSchedulersResponseSchema,
	getSmartGroups: GetSmartGroupsResponseSchema,
	getTaskBoards: GetTaskBoardsResponseSchema,
} as const;
