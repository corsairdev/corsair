import { z } from 'zod';

// Shared utility schemas
export const TagSchema = z
	.object({
		tagId: z.string(),
		value: z.string(),
		_id: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Tag = z.infer<typeof TagSchema>;

export const SuccessResponseSchema = z
	.object({
		success: z.boolean().default(true),
		message: z.string().optional(),
		count: z.number().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// ==========================================
// 1. Projects
// ==========================================

export const ProjectSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		links: z.record(z.string(), z.string()).optional(),
		note: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		timeEntryEnabled: z.boolean().optional(),
		timeEntryLocked: z.boolean().optional(),
		timeEntryApproval: z.boolean().optional(),
		projectCode: z.string().optional(),
		timeEntryNoteRequired: z.boolean().optional(),
		budgetHours: z.number().optional(),
		budgetCashAmount: z.number().optional(),
		budgetCurrency: z.string().optional(),
		useStatusColor: z.boolean().optional(),
		status: z.string().optional(),
		useProjectDuration: z.boolean().optional(),
		start: z.string().nullable().optional(),
		end: z.string().nullable().optional(),
		backgroundColor: z.string().optional(),
		metadata: z.string().optional(),
		projectManagers: z.array(z.string()).optional(),
		resources: z.array(z.string()).optional(),
		tags: z.array(TagSchema).optional(),
		// `unknown` because customer objects contain provider-extensible fields
		customers: z.array(z.record(z.string(), z.unknown())).optional(),
		// `unknown` because custom fields contain arbitrary user-configured key-value pairs
		customFields: z.array(z.unknown()).optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export const ProjectsListResponseSchema = z.array(ProjectSchema);
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

export const ProjectsGetInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export const ProjectsGetResponseSchema = ProjectSchema;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

export const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1, 'Project name is required'),
	note: z.string().optional(),
	projectCode: z.string().optional(),
	timeEntryEnabled: z.boolean().optional(),
	timeEntryLocked: z.boolean().optional(),
	timeEntryApproval: z.boolean().optional(),
	timeEntryNoteRequired: z.boolean().optional(),
	budgetHours: z.number().optional(),
	budgetCashAmount: z.number().optional(),
	budgetCurrency: z.string().optional(),
	useStatusColor: z.boolean().optional(),
	status: z.string().optional(),
	useProjectDuration: z.boolean().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	backgroundColor: z.string().optional(),
	metadata: z.string().optional(),
	projectManagers: z.array(z.string()).optional(),
	resources: z.array(z.string()).optional(),
	// `unknown` because custom fields contain user-defined attributes
	customFields: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export const ProjectsCreateResponseSchema = ProjectSchema;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

export const ProjectsUpdateInputSchema = z.object({
	// Array of project objects each containing _id and fields to update
	projects: z
		.array(
			z.object({
				_id: z.string().min(1, 'Project _id is required'),
				name: z.string().optional(),
				note: z.string().optional(),
				projectCode: z.string().optional(),
				budgetCashAmount: z.number().optional(),
				budgetHours: z.number().optional(),
				budgetCurrency: z.string().optional(),
				status: z.string().optional(),
				backgroundColor: z.string().optional(),
				metadata: z.string().optional(),
			}),
		)
		.min(1, 'At least one project update object is required'),
});
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export const ProjectsUpdateResponseSchema = z.array(ProjectSchema);
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

export const ProjectsDeleteInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
});
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export const ProjectsDeleteResponseSchema = SuccessResponseSchema;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

export const ProjectsDeleteBulkInputSchema = z.object({
	projectIds: z
		.array(z.string().min(1))
		.min(1, 'At least one project ID is required'),
});
export type ProjectsDeleteBulkInput = z.infer<
	typeof ProjectsDeleteBulkInputSchema
>;
export const ProjectsDeleteBulkResponseSchema = SuccessResponseSchema;
export type ProjectsDeleteBulkResponse = z.infer<
	typeof ProjectsDeleteBulkResponseSchema
>;

export const ProjectsSearchInputSchema = z.object({
	// `unknown` because Hub Planner mongo-like search query accepts arbitrary field operators like $in, $nin
	query: z.record(z.string(), z.unknown()).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type ProjectsSearchInput = z.infer<typeof ProjectsSearchInputSchema>;
export const ProjectsSearchResponseSchema = z.array(ProjectSchema);
export type ProjectsSearchResponse = z.infer<
	typeof ProjectsSearchResponseSchema
>;

export const ProjectsAddResourcesInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
	resourceIds: z
		.array(z.string().min(1))
		.min(1, 'At least one resource ID is required'),
});
export type ProjectsAddResourcesInput = z.infer<
	typeof ProjectsAddResourcesInputSchema
>;
export const ProjectsAddResourcesResponseSchema = SuccessResponseSchema;
export type ProjectsAddResourcesResponse = z.infer<
	typeof ProjectsAddResourcesResponseSchema
>;

export const ProjectsRemoveResourceInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
	projectIds: z
		.array(z.string().min(1))
		.min(1, 'At least one project ID is required'),
});
export type ProjectsRemoveResourceInput = z.infer<
	typeof ProjectsRemoveResourceInputSchema
>;
export const ProjectsRemoveResourceResponseSchema = SuccessResponseSchema;
export type ProjectsRemoveResourceResponse = z.infer<
	typeof ProjectsRemoveResourceResponseSchema
>;

export const ProjectsAddClientsInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
	clientIds: z
		.array(z.string().min(1))
		.min(1, 'At least one client ID is required'),
});
export type ProjectsAddClientsInput = z.infer<
	typeof ProjectsAddClientsInputSchema
>;
export const ProjectsAddClientsResponseSchema = SuccessResponseSchema;
export type ProjectsAddClientsResponse = z.infer<
	typeof ProjectsAddClientsResponseSchema
>;

export const ProjectsRemoveClientInputSchema = z.object({
	clientId: z.string().min(1, 'Client ID is required'),
	projectIds: z
		.array(z.string().min(1))
		.min(1, 'At least one project ID is required'),
});
export type ProjectsRemoveClientInput = z.infer<
	typeof ProjectsRemoveClientInputSchema
>;
export const ProjectsRemoveClientResponseSchema = SuccessResponseSchema;
export type ProjectsRemoveClientResponse = z.infer<
	typeof ProjectsRemoveClientResponseSchema
>;

export const ProjectsSetProjectManagersInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
	managerIds: z.array(z.string().min(1)),
});
export type ProjectsSetProjectManagersInput = z.infer<
	typeof ProjectsSetProjectManagersInputSchema
>;
export const ProjectsSetProjectManagersResponseSchema = ProjectSchema;
export type ProjectsSetProjectManagersResponse = z.infer<
	typeof ProjectsSetProjectManagersResponseSchema
>;

export const ProjectsGetTagsInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
});
export type ProjectsGetTagsInput = z.infer<typeof ProjectsGetTagsInputSchema>;
export const ProjectsGetTagsResponseSchema = z.array(TagSchema);
export type ProjectsGetTagsResponse = z.infer<
	typeof ProjectsGetTagsResponseSchema
>;

export const ProjectsAddTagsInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
	tags: z.array(z.string().min(1)).min(1, 'At least one tag ID is required'),
});
export type ProjectsAddTagsInput = z.infer<typeof ProjectsAddTagsInputSchema>;
export const ProjectsAddTagsResponseSchema = ProjectSchema;
export type ProjectsAddTagsResponse = z.infer<
	typeof ProjectsAddTagsResponseSchema
>;

export const ProjectsRemoveTagInputSchema = z.object({
	projectId: z.string().min(1, 'Project ID is required'),
	tagId: z.string().min(1, 'Tag ID is required'),
});
export type ProjectsRemoveTagInput = z.infer<
	typeof ProjectsRemoveTagInputSchema
>;
export const ProjectsRemoveTagResponseSchema = SuccessResponseSchema;
export type ProjectsRemoveTagResponse = z.infer<
	typeof ProjectsRemoveTagResponseSchema
>;

// ==========================================
// 2. Resources
// ==========================================

export const ResourceSchema = z
	.object({
		_id: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.string().optional(),
		role: z.string().optional(),
		status: z.string().optional(),
		backgroundColor: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		metadata: z.string().optional(),
		tags: z.array(TagSchema).optional(),
		// `unknown` because custom fields contain user-defined key-value attributes
		customFields: z.array(z.unknown()).optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Resource = z.infer<typeof ResourceSchema>;

export const ResourcesListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type ResourcesListInput = z.infer<typeof ResourcesListInputSchema>;
export const ResourcesListResponseSchema = z.array(ResourceSchema);
export type ResourcesListResponse = z.infer<typeof ResourcesListResponseSchema>;

export const ResourcesGetInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
});
export type ResourcesGetInput = z.infer<typeof ResourcesGetInputSchema>;
export const ResourcesGetResponseSchema = ResourceSchema;
export type ResourcesGetResponse = z.infer<typeof ResourcesGetResponseSchema>;

export const ResourcesCreateInputSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email().optional(),
	role: z.string().optional(),
	status: z.string().optional(),
	autoInvite: z.boolean().optional(),
	backgroundColor: z.string().optional(),
	metadata: z.string().optional(),
	// `unknown` because custom fields contain user-defined attributes
	customFields: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type ResourcesCreateInput = z.infer<typeof ResourcesCreateInputSchema>;
export const ResourcesCreateResponseSchema = ResourceSchema;
export type ResourcesCreateResponse = z.infer<
	typeof ResourcesCreateResponseSchema
>;

export const ResourcesUpdateInputSchema = z.object({
	resources: z
		.array(
			z.object({
				_id: z.string().min(1, 'Resource _id is required'),
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				email: z.string().optional(),
				role: z.string().optional(),
				status: z.string().optional(),
				backgroundColor: z.string().optional(),
				metadata: z.string().optional(),
			}),
		)
		.min(1, 'At least one resource update object is required'),
});
export type ResourcesUpdateInput = z.infer<typeof ResourcesUpdateInputSchema>;
export const ResourcesUpdateResponseSchema = z.array(ResourceSchema);
export type ResourcesUpdateResponse = z.infer<
	typeof ResourcesUpdateResponseSchema
>;

export const ResourcesDeleteInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
});
export type ResourcesDeleteInput = z.infer<typeof ResourcesDeleteInputSchema>;
export const ResourcesDeleteResponseSchema = SuccessResponseSchema;
export type ResourcesDeleteResponse = z.infer<
	typeof ResourcesDeleteResponseSchema
>;

export const ResourcesDeleteBulkInputSchema = z.object({
	resourceIds: z
		.array(z.string().min(1))
		.min(1, 'At least one resource ID is required'),
});
export type ResourcesDeleteBulkInput = z.infer<
	typeof ResourcesDeleteBulkInputSchema
>;
export const ResourcesDeleteBulkResponseSchema = SuccessResponseSchema;
export type ResourcesDeleteBulkResponse = z.infer<
	typeof ResourcesDeleteBulkResponseSchema
>;

export const ResourcesSearchInputSchema = z.object({
	// `unknown` because search body contains provider filter expressions
	query: z.record(z.string(), z.unknown()).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type ResourcesSearchInput = z.infer<typeof ResourcesSearchInputSchema>;
export const ResourcesSearchResponseSchema = z.array(ResourceSchema);
export type ResourcesSearchResponse = z.infer<
	typeof ResourcesSearchResponseSchema
>;

export const ResourcesGetTagsInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
});
export type ResourcesGetTagsInput = z.infer<typeof ResourcesGetTagsInputSchema>;
export const ResourcesGetTagsResponseSchema = z.array(TagSchema);
export type ResourcesGetTagsResponse = z.infer<
	typeof ResourcesGetTagsResponseSchema
>;

export const ResourcesAddTagsInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
	tags: z.array(z.string().min(1)).min(1, 'At least one tag ID is required'),
});
export type ResourcesAddTagsInput = z.infer<typeof ResourcesAddTagsInputSchema>;
export const ResourcesAddTagsResponseSchema = ResourceSchema;
export type ResourcesAddTagsResponse = z.infer<
	typeof ResourcesAddTagsResponseSchema
>;

export const ResourcesRemoveTagInputSchema = z.object({
	resourceId: z.string().min(1, 'Resource ID is required'),
	tagId: z.string().min(1, 'Tag ID is required'),
});
export type ResourcesRemoveTagInput = z.infer<
	typeof ResourcesRemoveTagInputSchema
>;
export const ResourcesRemoveTagResponseSchema = SuccessResponseSchema;
export type ResourcesRemoveTagResponse = z.infer<
	typeof ResourcesRemoveTagResponseSchema
>;

// ==========================================
// 3. Bookings
// ==========================================

export const BookingSchema = z
	.object({
		_id: z.string(),
		title: z.string().optional(),
		state: z.string().optional(),
		allDay: z.boolean().optional(),
		start: z.string(),
		end: z.string(),
		stateValue: z.number().optional(),
		resource: z.string(),
		project: z.string(),
		note: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		metadata: z.string().optional(),
		type: z.string().optional(),
		categoryTemplateId: z.string().optional(),
		categoryName: z.string().optional(),
		bookingCreatorId: z.string().optional(),
		// `unknown` because customFields contains user-configured metadata
		customFields: z.array(z.unknown()).optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Booking = z.infer<typeof BookingSchema>;

export const BookingsListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	skip: z.number().int().min(0).optional(),
	cursor: z.string().optional(),
	sort: z.string().optional(),
	deleted: z.boolean().optional(),
	dependencies: z.boolean().optional(),
});
export type BookingsListInput = z.infer<typeof BookingsListInputSchema>;
export const BookingsListResponseSchema = z.array(BookingSchema);
export type BookingsListResponse = z.infer<typeof BookingsListResponseSchema>;

export const BookingsGetInputSchema = z.object({
	bookingId: z.string().min(1, 'Booking ID is required'),
});
export type BookingsGetInput = z.infer<typeof BookingsGetInputSchema>;
export const BookingsGetResponseSchema = BookingSchema;
export type BookingsGetResponse = z.infer<typeof BookingsGetResponseSchema>;

export const BookingsCreateInputSchema = z.object({
	resource: z.string().min(1, 'Resource ID is required'),
	project: z.string().min(1, 'Project ID is required'),
	start: z.string().min(1, 'Start date is required'),
	end: z.string().min(1, 'End date is required'),
	state: z.string().optional(),
	stateValue: z.number().optional(),
	title: z.string().optional(),
	note: z.string().optional(),
	allDay: z.boolean().optional(),
	allowOverschedule: z.boolean().optional(),
	repeat: z.boolean().optional(),
	interval: z.string().optional(),
	repeatEndsAfterTimes: z.number().optional(),
	repeatEndsOnDate: z.string().optional(),
});
export type BookingsCreateInput = z.infer<typeof BookingsCreateInputSchema>;
export const BookingsCreateResponseSchema = BookingSchema;
export type BookingsCreateResponse = z.infer<
	typeof BookingsCreateResponseSchema
>;

export const BookingsUpdateInputSchema = z.object({
	bookingId: z.string().min(1, 'Booking ID is required'),
	resource: z.string().min(1, 'Resource ID is required'),
	project: z.string().min(1, 'Project ID is required'),
	start: z.string().min(1, 'Start date is required'),
	end: z.string().min(1, 'End date is required'),
	state: z.string().optional(),
	stateValue: z.number().optional(),
	title: z.string().optional(),
	note: z.string().optional(),
	allDay: z.boolean().optional(),
	allowOverschedule: z.boolean().optional(),
});
export type BookingsUpdateInput = z.infer<typeof BookingsUpdateInputSchema>;
export const BookingsUpdateResponseSchema = BookingSchema;
export type BookingsUpdateResponse = z.infer<
	typeof BookingsUpdateResponseSchema
>;

export const BookingsPatchInputSchema = z.object({
	bookingId: z.string().min(1, 'Booking ID is required'),
	type: z.string().optional(),
	// `unknown` because approvalInfo contains approver notes and provider-specific approval details
	approvalInfo: z.record(z.string(), z.unknown()).optional(),
	allowOverschedule: z.boolean().optional(),
	state: z.string().optional(),
	stateValue: z.number().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	title: z.string().optional(),
	note: z.string().optional(),
});
export type BookingsPatchInput = z.infer<typeof BookingsPatchInputSchema>;
export const BookingsPatchResponseSchema = BookingSchema;
export type BookingsPatchResponse = z.infer<typeof BookingsPatchResponseSchema>;

export const BookingsSearchInputSchema = z.object({
	// `unknown` because search filter expression accepts dynamic Mongo-style matchers
	query: z.record(z.string(), z.unknown()).optional(),
	dependencies: z.boolean().optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type BookingsSearchInput = z.infer<typeof BookingsSearchInputSchema>;
export const BookingsSearchResponseSchema = z.array(BookingSchema);
export type BookingsSearchResponse = z.infer<
	typeof BookingsSearchResponseSchema
>;

export const BookingsDeleteInputSchema = z.object({
	bookingId: z.string().min(1, 'Booking ID is required'),
});
export type BookingsDeleteInput = z.infer<typeof BookingsDeleteInputSchema>;
export const BookingsDeleteResponseSchema = SuccessResponseSchema;
export type BookingsDeleteResponse = z.infer<
	typeof BookingsDeleteResponseSchema
>;

export const BookingsDeleteBulkInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1).optional(),
		resourceId: z.string().trim().min(1).optional(),
		projectId: z.string().trim().min(1).optional(),
	})
	.refine(
		(input) =>
			Boolean(input.ids?.length || input.resourceId || input.projectId),
		'At least one booking ID or filter is required',
	);
export type BookingsDeleteBulkInput = z.infer<
	typeof BookingsDeleteBulkInputSchema
>;
export const BookingsDeleteBulkResponseSchema = SuccessResponseSchema;
export type BookingsDeleteBulkResponse = z.infer<
	typeof BookingsDeleteBulkResponseSchema
>;

// ==========================================
// 4. Time Entries
// ==========================================

export const TimeEntrySchema = z
	.object({
		_id: z.string(),
		resource: z.string(),
		project: z.string(),
		projectName: z.string().optional(),
		projectType: z.string().optional(),
		projectStatus: z.string().optional(),
		date: z.string(),
		minutes: z.number(),
		note: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		metadata: z.string().optional(),
		status: z.string().optional(),
		locked: z.boolean().optional(),
		creator: z.string().optional(),
		categoryTemplateId: z.string().optional(),
		categoryName: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type TimeEntry = z.infer<typeof TimeEntrySchema>;

export const TimeEntriesListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
	project: z.string().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
});
export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;
export const TimeEntriesListResponseSchema = z.array(TimeEntrySchema);
export type TimeEntriesListResponse = z.infer<
	typeof TimeEntriesListResponseSchema
>;

export const TimeEntriesGetInputSchema = z.object({
	timeEntryId: z.string().min(1, 'TimeEntry ID is required'),
});
export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;
export const TimeEntriesGetResponseSchema = TimeEntrySchema;
export type TimeEntriesGetResponse = z.infer<
	typeof TimeEntriesGetResponseSchema
>;

export const TimeEntriesCreateInputSchema = z.object({
	resource: z.string().min(1, 'Resource ID is required'),
	project: z.string().min(1, 'Project ID is required'),
	date: z.string().min(1, 'Date (YYYY-MM-DD) is required'),
	minutes: z.number().int().min(1, 'Minutes must be at least 1'),
	note: z.string().optional(),
});
export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;
export const TimeEntriesCreateResponseSchema = TimeEntrySchema;
export type TimeEntriesCreateResponse = z.infer<
	typeof TimeEntriesCreateResponseSchema
>;

export const TimeEntriesSearchInputSchema = z.object({
	// `unknown` because search filter expression accepts dynamic range and equality matchers
	query: z.record(z.string(), z.unknown()).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type TimeEntriesSearchInput = z.infer<
	typeof TimeEntriesSearchInputSchema
>;
export const TimeEntriesSearchResponseSchema = z.array(TimeEntrySchema);
export type TimeEntriesSearchResponse = z.infer<
	typeof TimeEntriesSearchResponseSchema
>;

export const TimeEntriesUpdateInputSchema = z.object({
	timeEntryId: z.string().min(1, 'TimeEntry ID is required'),
	resource: z.string().min(1, 'Resource ID is required'),
	project: z.string().min(1, 'Project ID is required'),
	date: z.string().min(1, 'Date is required'),
	minutes: z.number().int().min(1, 'Minutes must be at least 1'),
	note: z.string().optional(),
	status: z.string().optional(),
});
export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;
export const TimeEntriesUpdateResponseSchema = TimeEntrySchema;
export type TimeEntriesUpdateResponse = z.infer<
	typeof TimeEntriesUpdateResponseSchema
>;

export const TimeEntriesDeleteInputSchema = z.object({
	timeEntryId: z.string().min(1, 'TimeEntry ID is required'),
});
export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;
export const TimeEntriesDeleteResponseSchema = SuccessResponseSchema;
export type TimeEntriesDeleteResponse = z.infer<
	typeof TimeEntriesDeleteResponseSchema
>;

export const TimeEntriesDeleteBulkInputSchema = z.object({
	ids: z
		.array(z.string().min(1))
		.min(1, 'At least one time entry ID is required'),
});
export type TimeEntriesDeleteBulkInput = z.infer<
	typeof TimeEntriesDeleteBulkInputSchema
>;
export const TimeEntriesDeleteBulkResponseSchema = SuccessResponseSchema;
export type TimeEntriesDeleteBulkResponse = z.infer<
	typeof TimeEntriesDeleteBulkResponseSchema
>;

// ==========================================
// 5. Categories
// ==========================================

export const BookingCategorySchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		gridColor: z.string().optional(),
		type: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		categoryGroupId: z.string().optional(),
		categoryGroupName: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type BookingCategory = z.infer<typeof BookingCategorySchema>;

export const CategoryGroupSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		type: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type CategoryGroup = z.infer<typeof CategoryGroupSchema>;

export const CostCategorySchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type CostCategory = z.infer<typeof CostCategorySchema>;

export const CategoriesListInputSchema = z.object({});
export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;
export const CategoriesListResponseSchema = z.array(BookingCategorySchema);
export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

export const CategoriesGetInputSchema = z.object({
	categoryId: z.string().min(1, 'Category ID is required'),
});
export type CategoriesGetInput = z.infer<typeof CategoriesGetInputSchema>;
export const CategoriesGetResponseSchema = BookingCategorySchema;
export type CategoriesGetResponse = z.infer<typeof CategoriesGetResponseSchema>;

export const CategoriesCreateInputSchema = z.object({
	groupId: z.string().min(1, 'Group ID is required'),
	name: z.string().min(1, 'Category name is required'),
	gridColor: z.string().optional(),
	type: z.enum(['NON_OPTIONAL', 'CUSTOM']).optional(),
});
export type CategoriesCreateInput = z.infer<typeof CategoriesCreateInputSchema>;
export const CategoriesCreateResponseSchema = BookingCategorySchema;
export type CategoriesCreateResponse = z.infer<
	typeof CategoriesCreateResponseSchema
>;

export const CategoriesUpdateInputSchema = z.object({
	categoryId: z.string().min(1, 'Category ID is required'),
	name: z.string().min(1, 'Category name is required'),
	gridColor: z.string().optional(),
	type: z.enum(['NON_OPTIONAL', 'CUSTOM']).optional(),
});
export type CategoriesUpdateInput = z.infer<typeof CategoriesUpdateInputSchema>;
export const CategoriesUpdateResponseSchema = BookingCategorySchema;
export type CategoriesUpdateResponse = z.infer<
	typeof CategoriesUpdateResponseSchema
>;

export const CategoriesSearchInputSchema = z.object({
	// `unknown` because search filter expression accepts dynamic Mongo-style matchers
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CategoriesSearchInput = z.infer<typeof CategoriesSearchInputSchema>;
export const CategoriesSearchResponseSchema = z.array(BookingCategorySchema);
export type CategoriesSearchResponse = z.infer<
	typeof CategoriesSearchResponseSchema
>;

export const CategoriesListGroupsInputSchema = z.object({});
export type CategoriesListGroupsInput = z.infer<
	typeof CategoriesListGroupsInputSchema
>;
export const CategoriesListGroupsResponseSchema = z.array(CategoryGroupSchema);
export type CategoriesListGroupsResponse = z.infer<
	typeof CategoriesListGroupsResponseSchema
>;

export const CategoriesListCostCategoriesInputSchema = z.object({});
export type CategoriesListCostCategoriesInput = z.infer<
	typeof CategoriesListCostCategoriesInputSchema
>;
export const CategoriesListCostCategoriesResponseSchema =
	z.array(CostCategorySchema);
export type CategoriesListCostCategoriesResponse = z.infer<
	typeof CategoriesListCostCategoriesResponseSchema
>;

export const CategoriesGetCostCategoryInputSchema = z.object({
	costCategoryId: z.string().min(1, 'Cost Category ID is required'),
});
export type CategoriesGetCostCategoryInput = z.infer<
	typeof CategoriesGetCostCategoryInputSchema
>;
export const CategoriesGetCostCategoryResponseSchema = CostCategorySchema;
export type CategoriesGetCostCategoryResponse = z.infer<
	typeof CategoriesGetCostCategoryResponseSchema
>;

export const CategoriesCreateCostCategoryInputSchema = z.object({
	name: z.string().min(1, 'Cost category name is required'),
});
export type CategoriesCreateCostCategoryInput = z.infer<
	typeof CategoriesCreateCostCategoryInputSchema
>;
export const CategoriesCreateCostCategoryResponseSchema = CostCategorySchema;
export type CategoriesCreateCostCategoryResponse = z.infer<
	typeof CategoriesCreateCostCategoryResponseSchema
>;

export const CategoriesUpdateCostCategoryInputSchema = z.object({
	costCategoryId: z.string().min(1, 'Cost Category ID is required'),
	name: z.string().min(1, 'Cost category name is required'),
});
export type CategoriesUpdateCostCategoryInput = z.infer<
	typeof CategoriesUpdateCostCategoryInputSchema
>;
export const CategoriesUpdateCostCategoryResponseSchema = CostCategorySchema;
export type CategoriesUpdateCostCategoryResponse = z.infer<
	typeof CategoriesUpdateCostCategoryResponseSchema
>;

export const CategoriesSearchCostCategoriesInputSchema = z.object({
	// `unknown` because search filter expression accepts dynamic matchers
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CategoriesSearchCostCategoriesInput = z.infer<
	typeof CategoriesSearchCostCategoriesInputSchema
>;
export const CategoriesSearchCostCategoriesResponseSchema =
	z.array(CostCategorySchema);
export type CategoriesSearchCostCategoriesResponse = z.infer<
	typeof CategoriesSearchCostCategoriesResponseSchema
>;

export const CategoriesDeleteCostCategoryInputSchema = z.object({
	costCategoryId: z.string().min(1, 'Cost Category ID is required'),
});
export type CategoriesDeleteCostCategoryInput = z.infer<
	typeof CategoriesDeleteCostCategoryInputSchema
>;
export const CategoriesDeleteCostCategoryResponseSchema = SuccessResponseSchema;
export type CategoriesDeleteCostCategoryResponse = z.infer<
	typeof CategoriesDeleteCostCategoryResponseSchema
>;

// ==========================================
// 6. Custom Fields
// ==========================================

export const CustomFieldChoiceSchema = z
	.object({
		_id: z.string().optional(),
		value: z.string(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type CustomFieldChoice = z.infer<typeof CustomFieldChoiceSchema>;

export const CustomFieldTemplateSchema = z
	.object({
		_id: z.string(),
		type: z.string(),
		label: z.string(),
		instructions: z.string().optional(),
		placeholderText: z.string().optional(),
		status: z.string().optional(),
		allowMultipleValues: z.boolean().or(z.string()).optional(),
		isRequired: z.boolean().or(z.string()).optional(),
		canResourceEdit: z.boolean().or(z.string()).optional(),
		characterLimit: z.string().optional(),
		isChoicesSortedAlphabetically: z.boolean().or(z.string()).optional(),
		choices: z.array(CustomFieldChoiceSchema).optional(),
		defaultValue: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type CustomFieldTemplate = z.infer<typeof CustomFieldTemplateSchema>;

export const CustomFieldsListInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
});
export type CustomFieldsListInput = z.infer<typeof CustomFieldsListInputSchema>;
export const CustomFieldsListResponseSchema = z.array(
	CustomFieldTemplateSchema,
);
export type CustomFieldsListResponse = z.infer<
	typeof CustomFieldsListResponseSchema
>;

export const CustomFieldsGetInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	id: z.string().min(1, 'Custom field template ID is required'),
});
export type CustomFieldsGetInput = z.infer<typeof CustomFieldsGetInputSchema>;
export const CustomFieldsGetResponseSchema = CustomFieldTemplateSchema;
export type CustomFieldsGetResponse = z.infer<
	typeof CustomFieldsGetResponseSchema
>;

export const CustomFieldsCreateInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	type: z.string().min(1, 'Field type is required'),
	label: z.string().min(1, 'Field label is required'),
	instructions: z.string().optional(),
	placeholderText: z.string().optional(),
	status: z.string().optional(),
	allowMultipleValues: z.boolean().optional(),
	isRequired: z.boolean().optional(),
	canResourceEdit: z.boolean().optional(),
	characterLimit: z.string().optional(),
	isChoicesSortedAlphabetically: z.boolean().optional(),
	choices: z.array(z.object({ value: z.string() })).optional(),
	defaultValue: z.string().optional(),
});
export type CustomFieldsCreateInput = z.infer<
	typeof CustomFieldsCreateInputSchema
>;
export const CustomFieldsCreateResponseSchema = CustomFieldTemplateSchema;
export type CustomFieldsCreateResponse = z.infer<
	typeof CustomFieldsCreateResponseSchema
>;

export const CustomFieldsUpdateInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	id: z.string().min(1, 'Custom field template ID is required'),
	type: z.string().min(1, 'Field type is required'),
	label: z.string().min(1, 'Field label is required'),
	instructions: z.string().optional(),
	placeholderText: z.string().optional(),
	status: z.string().optional(),
	allowMultipleValues: z.boolean().optional(),
	isRequired: z.boolean().optional(),
	canResourceEdit: z.boolean().optional(),
	characterLimit: z.string().optional(),
	isChoicesSortedAlphabetically: z.boolean().optional(),
	choices: z
		.array(z.object({ _id: z.string().optional(), value: z.string() }))
		.optional(),
	defaultValue: z.string().optional(),
});
export type CustomFieldsUpdateInput = z.infer<
	typeof CustomFieldsUpdateInputSchema
>;
export const CustomFieldsUpdateResponseSchema = CustomFieldTemplateSchema;
export type CustomFieldsUpdateResponse = z.infer<
	typeof CustomFieldsUpdateResponseSchema
>;

export const CustomFieldsDeleteInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	id: z.string().min(1, 'Custom field template ID is required'),
});
export type CustomFieldsDeleteInput = z.infer<
	typeof CustomFieldsDeleteInputSchema
>;
export const CustomFieldsDeleteResponseSchema = SuccessResponseSchema;
export type CustomFieldsDeleteResponse = z.infer<
	typeof CustomFieldsDeleteResponseSchema
>;

export const CustomFieldsSearchInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	// `unknown` because custom field search payload accepts arbitrary match criteria
	query: z.record(z.string(), z.unknown()).optional(),
});
export type CustomFieldsSearchInput = z.infer<
	typeof CustomFieldsSearchInputSchema
>;
export const CustomFieldsSearchResponseSchema = z.array(
	CustomFieldTemplateSchema,
);
export type CustomFieldsSearchResponse = z.infer<
	typeof CustomFieldsSearchResponseSchema
>;

export const CustomFieldsAddChoicesInputSchema = z.object({
	entityType: z
		.string()
		.min(1, 'Entity type is required (e.g. project or resource)'),
	id: z.string().min(1, 'Custom field template ID is required'),
	choices: z
		.array(z.object({ value: z.string().min(1) }))
		.min(1, 'At least one choice is required'),
});
export type CustomFieldsAddChoicesInput = z.infer<
	typeof CustomFieldsAddChoicesInputSchema
>;
export const CustomFieldsAddChoicesResponseSchema = CustomFieldTemplateSchema;
export type CustomFieldsAddChoicesResponse = z.infer<
	typeof CustomFieldsAddChoicesResponseSchema
>;

// ==========================================
// 7. Milestones
// ==========================================

export const MilestoneSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		date: z.string(),
		project: z.string(),
		metadata: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Milestone = z.infer<typeof MilestoneSchema>;

export const MilestonesListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type MilestonesListInput = z.infer<typeof MilestonesListInputSchema>;
export const MilestonesListResponseSchema = z.array(MilestoneSchema);
export type MilestonesListResponse = z.infer<
	typeof MilestonesListResponseSchema
>;

export const MilestonesGetInputSchema = z.object({
	milestoneId: z.string().min(1, 'Milestone ID is required'),
});
export type MilestonesGetInput = z.infer<typeof MilestonesGetInputSchema>;
export const MilestonesGetResponseSchema = MilestoneSchema;
export type MilestonesGetResponse = z.infer<typeof MilestonesGetResponseSchema>;

export const MilestonesCreateInputSchema = z.object({
	name: z.string().min(1, 'Milestone name is required'),
	date: z.string().min(1, 'Date (YYYY-MM-DD) is required'),
	project: z.string().min(1, 'Project ID is required'),
	metadata: z.string().optional(),
});
export type MilestonesCreateInput = z.infer<typeof MilestonesCreateInputSchema>;
export const MilestonesCreateResponseSchema = MilestoneSchema;
export type MilestonesCreateResponse = z.infer<
	typeof MilestonesCreateResponseSchema
>;

export const MilestonesUpdateInputSchema = z.object({
	milestoneId: z.string().min(1, 'Milestone ID is required'),
	name: z.string().min(1, 'Milestone name is required'),
	date: z.string().min(1, 'Date is required'),
	project: z.string().min(1, 'Project ID is required'),
	metadata: z.string().optional(),
});
export type MilestonesUpdateInput = z.infer<typeof MilestonesUpdateInputSchema>;
export const MilestonesUpdateResponseSchema = MilestoneSchema;
export type MilestonesUpdateResponse = z.infer<
	typeof MilestonesUpdateResponseSchema
>;

export const MilestonesDeleteInputSchema = z.object({
	milestoneId: z.string().min(1, 'Milestone ID is required'),
});
export type MilestonesDeleteInput = z.infer<typeof MilestonesDeleteInputSchema>;
export const MilestonesDeleteResponseSchema = SuccessResponseSchema;
export type MilestonesDeleteResponse = z.infer<
	typeof MilestonesDeleteResponseSchema
>;

export const MilestonesSearchInputSchema = z.object({
	// `unknown` because search query accepts mongo-like comparison filters
	query: z.record(z.string(), z.unknown()).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type MilestonesSearchInput = z.infer<typeof MilestonesSearchInputSchema>;
export const MilestonesSearchResponseSchema = z.array(MilestoneSchema);
export type MilestonesSearchResponse = z.infer<
	typeof MilestonesSearchResponseSchema
>;

// ==========================================
// 8. Events
// ==========================================

export const EventSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		eventCode: z.string().optional(),
		backgroundColor: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		metadata: z.string().optional(),
	})
	// `unknown` response properties preserved for forward compatibility with provider additions.
	.passthrough();
export type Event = z.infer<typeof EventSchema>;

export const EventsListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type EventsListInput = z.infer<typeof EventsListInputSchema>;
export const EventsListResponseSchema = z.array(EventSchema);
export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

export const EventsGetInputSchema = z.object({
	eventId: z.string().min(1, 'Event ID is required'),
});
export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;
export const EventsGetResponseSchema = EventSchema;
export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

export const EventsCreateInputSchema = z.object({
	name: z.string().min(1, 'Event name is required'),
	eventCode: z.string().optional(),
	backgroundColor: z.string().optional(),
	metadata: z.string().optional(),
});
export type EventsCreateInput = z.infer<typeof EventsCreateInputSchema>;
export const EventsCreateResponseSchema = EventSchema;
export type EventsCreateResponse = z.infer<typeof EventsCreateResponseSchema>;

export const EventsUpdateInputSchema = z.object({
	eventId: z.string().min(1, 'Event ID is required'),
	name: z.string().min(1, 'Event name is required'),
	eventCode: z.string().optional(),
	backgroundColor: z.string().optional(),
	metadata: z.string().optional(),
});
export type EventsUpdateInput = z.infer<typeof EventsUpdateInputSchema>;
export const EventsUpdateResponseSchema = EventSchema;
export type EventsUpdateResponse = z.infer<typeof EventsUpdateResponseSchema>;

export const EventsDeleteInputSchema = z.object({
	eventId: z.string().min(1, 'Event ID is required'),
});
export type EventsDeleteInput = z.infer<typeof EventsDeleteInputSchema>;
export const EventsDeleteResponseSchema = SuccessResponseSchema;
export type EventsDeleteResponse = z.infer<typeof EventsDeleteResponseSchema>;

export const EventsSearchInputSchema = z.object({
	// `unknown` because search filter accepts dynamic field matchers
	query: z.record(z.string(), z.unknown()).optional(),
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	sort: z.string().optional(),
});
export type EventsSearchInput = z.infer<typeof EventsSearchInputSchema>;
export const EventsSearchResponseSchema = z.array(EventSchema);
export type EventsSearchResponse = z.infer<typeof EventsSearchResponseSchema>;

// ==========================================
// Endpoint Collections
// ==========================================

export type HubPlannerEndpointInputs = {
	'projects.list': ProjectsListInput;
	'projects.get': ProjectsGetInput;
	'projects.create': ProjectsCreateInput;
	'projects.update': ProjectsUpdateInput;
	'projects.delete': ProjectsDeleteInput;
	'projects.deleteBulk': ProjectsDeleteBulkInput;
	'projects.search': ProjectsSearchInput;
	'projects.addResources': ProjectsAddResourcesInput;
	'projects.removeResource': ProjectsRemoveResourceInput;
	'projects.addClients': ProjectsAddClientsInput;
	'projects.removeClient': ProjectsRemoveClientInput;
	'projects.setProjectManagers': ProjectsSetProjectManagersInput;
	'projects.getTags': ProjectsGetTagsInput;
	'projects.addTags': ProjectsAddTagsInput;
	'projects.removeTag': ProjectsRemoveTagInput;

	'resources.list': ResourcesListInput;
	'resources.get': ResourcesGetInput;
	'resources.create': ResourcesCreateInput;
	'resources.update': ResourcesUpdateInput;
	'resources.delete': ResourcesDeleteInput;
	'resources.deleteBulk': ResourcesDeleteBulkInput;
	'resources.search': ResourcesSearchInput;
	'resources.getTags': ResourcesGetTagsInput;
	'resources.addTags': ResourcesAddTagsInput;
	'resources.removeTag': ResourcesRemoveTagInput;

	'bookings.list': BookingsListInput;
	'bookings.get': BookingsGetInput;
	'bookings.create': BookingsCreateInput;
	'bookings.update': BookingsUpdateInput;
	'bookings.patch': BookingsPatchInput;
	'bookings.search': BookingsSearchInput;
	'bookings.delete': BookingsDeleteInput;
	'bookings.deleteBulk': BookingsDeleteBulkInput;

	'timeEntries.list': TimeEntriesListInput;
	'timeEntries.get': TimeEntriesGetInput;
	'timeEntries.create': TimeEntriesCreateInput;
	'timeEntries.search': TimeEntriesSearchInput;
	'timeEntries.update': TimeEntriesUpdateInput;
	'timeEntries.delete': TimeEntriesDeleteInput;
	'timeEntries.deleteBulk': TimeEntriesDeleteBulkInput;

	'categories.list': CategoriesListInput;
	'categories.get': CategoriesGetInput;
	'categories.create': CategoriesCreateInput;
	'categories.update': CategoriesUpdateInput;
	'categories.search': CategoriesSearchInput;
	'categories.listGroups': CategoriesListGroupsInput;
	'categories.listCostCategories': CategoriesListCostCategoriesInput;
	'categories.getCostCategory': CategoriesGetCostCategoryInput;
	'categories.createCostCategory': CategoriesCreateCostCategoryInput;
	'categories.updateCostCategory': CategoriesUpdateCostCategoryInput;
	'categories.searchCostCategories': CategoriesSearchCostCategoriesInput;
	'categories.deleteCostCategory': CategoriesDeleteCostCategoryInput;

	'customFields.list': CustomFieldsListInput;
	'customFields.get': CustomFieldsGetInput;
	'customFields.create': CustomFieldsCreateInput;
	'customFields.update': CustomFieldsUpdateInput;
	'customFields.delete': CustomFieldsDeleteInput;
	'customFields.search': CustomFieldsSearchInput;
	'customFields.addChoices': CustomFieldsAddChoicesInput;

	'milestones.list': MilestonesListInput;
	'milestones.get': MilestonesGetInput;
	'milestones.create': MilestonesCreateInput;
	'milestones.update': MilestonesUpdateInput;
	'milestones.delete': MilestonesDeleteInput;
	'milestones.search': MilestonesSearchInput;

	'events.list': EventsListInput;
	'events.get': EventsGetInput;
	'events.create': EventsCreateInput;
	'events.update': EventsUpdateInput;
	'events.delete': EventsDeleteInput;
	'events.search': EventsSearchInput;
};

export type HubPlannerEndpointOutputs = {
	'projects.list': ProjectsListResponse;
	'projects.get': ProjectsGetResponse;
	'projects.create': ProjectsCreateResponse;
	'projects.update': ProjectsUpdateResponse;
	'projects.delete': ProjectsDeleteResponse;
	'projects.deleteBulk': ProjectsDeleteBulkResponse;
	'projects.search': ProjectsSearchResponse;
	'projects.addResources': ProjectsAddResourcesResponse;
	'projects.removeResource': ProjectsRemoveResourceResponse;
	'projects.addClients': ProjectsAddClientsResponse;
	'projects.removeClient': ProjectsRemoveClientResponse;
	'projects.setProjectManagers': ProjectsSetProjectManagersResponse;
	'projects.getTags': ProjectsGetTagsResponse;
	'projects.addTags': ProjectsAddTagsResponse;
	'projects.removeTag': ProjectsRemoveTagResponse;

	'resources.list': ResourcesListResponse;
	'resources.get': ResourcesGetResponse;
	'resources.create': ResourcesCreateResponse;
	'resources.update': ResourcesUpdateResponse;
	'resources.delete': ResourcesDeleteResponse;
	'resources.deleteBulk': ResourcesDeleteBulkResponse;
	'resources.search': ResourcesSearchResponse;
	'resources.getTags': ResourcesGetTagsResponse;
	'resources.addTags': ResourcesAddTagsResponse;
	'resources.removeTag': ResourcesRemoveTagResponse;

	'bookings.list': BookingsListResponse;
	'bookings.get': BookingsGetResponse;
	'bookings.create': BookingsCreateResponse;
	'bookings.update': BookingsUpdateResponse;
	'bookings.patch': BookingsPatchResponse;
	'bookings.search': BookingsSearchResponse;
	'bookings.delete': BookingsDeleteResponse;
	'bookings.deleteBulk': BookingsDeleteBulkResponse;

	'timeEntries.list': TimeEntriesListResponse;
	'timeEntries.get': TimeEntriesGetResponse;
	'timeEntries.create': TimeEntriesCreateResponse;
	'timeEntries.search': TimeEntriesSearchResponse;
	'timeEntries.update': TimeEntriesUpdateResponse;
	'timeEntries.delete': TimeEntriesDeleteResponse;
	'timeEntries.deleteBulk': TimeEntriesDeleteBulkResponse;

	'categories.list': CategoriesListResponse;
	'categories.get': CategoriesGetResponse;
	'categories.create': CategoriesCreateResponse;
	'categories.update': CategoriesUpdateResponse;
	'categories.search': CategoriesSearchResponse;
	'categories.listGroups': CategoriesListGroupsResponse;
	'categories.listCostCategories': CategoriesListCostCategoriesResponse;
	'categories.getCostCategory': CategoriesGetCostCategoryResponse;
	'categories.createCostCategory': CategoriesCreateCostCategoryResponse;
	'categories.updateCostCategory': CategoriesUpdateCostCategoryResponse;
	'categories.searchCostCategories': CategoriesSearchCostCategoriesResponse;
	'categories.deleteCostCategory': CategoriesDeleteCostCategoryResponse;

	'customFields.list': CustomFieldsListResponse;
	'customFields.get': CustomFieldsGetResponse;
	'customFields.create': CustomFieldsCreateResponse;
	'customFields.update': CustomFieldsUpdateResponse;
	'customFields.delete': CustomFieldsDeleteResponse;
	'customFields.search': CustomFieldsSearchResponse;
	'customFields.addChoices': CustomFieldsAddChoicesResponse;

	'milestones.list': MilestonesListResponse;
	'milestones.get': MilestonesGetResponse;
	'milestones.create': MilestonesCreateResponse;
	'milestones.update': MilestonesUpdateResponse;
	'milestones.delete': MilestonesDeleteResponse;
	'milestones.search': MilestonesSearchResponse;

	'events.list': EventsListResponse;
	'events.get': EventsGetResponse;
	'events.create': EventsCreateResponse;
	'events.update': EventsUpdateResponse;
	'events.delete': EventsDeleteResponse;
	'events.search': EventsSearchResponse;
};

export const HubPlannerEndpointInputSchemas = {
	'projects.list': ProjectsListInputSchema,
	'projects.get': ProjectsGetInputSchema,
	'projects.create': ProjectsCreateInputSchema,
	'projects.update': ProjectsUpdateInputSchema,
	'projects.delete': ProjectsDeleteInputSchema,
	'projects.deleteBulk': ProjectsDeleteBulkInputSchema,
	'projects.search': ProjectsSearchInputSchema,
	'projects.addResources': ProjectsAddResourcesInputSchema,
	'projects.removeResource': ProjectsRemoveResourceInputSchema,
	'projects.addClients': ProjectsAddClientsInputSchema,
	'projects.removeClient': ProjectsRemoveClientInputSchema,
	'projects.setProjectManagers': ProjectsSetProjectManagersInputSchema,
	'projects.getTags': ProjectsGetTagsInputSchema,
	'projects.addTags': ProjectsAddTagsInputSchema,
	'projects.removeTag': ProjectsRemoveTagInputSchema,

	'resources.list': ResourcesListInputSchema,
	'resources.get': ResourcesGetInputSchema,
	'resources.create': ResourcesCreateInputSchema,
	'resources.update': ResourcesUpdateInputSchema,
	'resources.delete': ResourcesDeleteInputSchema,
	'resources.deleteBulk': ResourcesDeleteBulkInputSchema,
	'resources.search': ResourcesSearchInputSchema,
	'resources.getTags': ResourcesGetTagsInputSchema,
	'resources.addTags': ResourcesAddTagsInputSchema,
	'resources.removeTag': ResourcesRemoveTagInputSchema,

	'bookings.list': BookingsListInputSchema,
	'bookings.get': BookingsGetInputSchema,
	'bookings.create': BookingsCreateInputSchema,
	'bookings.update': BookingsUpdateInputSchema,
	'bookings.patch': BookingsPatchInputSchema,
	'bookings.search': BookingsSearchInputSchema,
	'bookings.delete': BookingsDeleteInputSchema,
	'bookings.deleteBulk': BookingsDeleteBulkInputSchema,

	'timeEntries.list': TimeEntriesListInputSchema,
	'timeEntries.get': TimeEntriesGetInputSchema,
	'timeEntries.create': TimeEntriesCreateInputSchema,
	'timeEntries.search': TimeEntriesSearchInputSchema,
	'timeEntries.update': TimeEntriesUpdateInputSchema,
	'timeEntries.delete': TimeEntriesDeleteInputSchema,
	'timeEntries.deleteBulk': TimeEntriesDeleteBulkInputSchema,

	'categories.list': CategoriesListInputSchema,
	'categories.get': CategoriesGetInputSchema,
	'categories.create': CategoriesCreateInputSchema,
	'categories.update': CategoriesUpdateInputSchema,
	'categories.search': CategoriesSearchInputSchema,
	'categories.listGroups': CategoriesListGroupsInputSchema,
	'categories.listCostCategories': CategoriesListCostCategoriesInputSchema,
	'categories.getCostCategory': CategoriesGetCostCategoryInputSchema,
	'categories.createCostCategory': CategoriesCreateCostCategoryInputSchema,
	'categories.updateCostCategory': CategoriesUpdateCostCategoryInputSchema,
	'categories.searchCostCategories': CategoriesSearchCostCategoriesInputSchema,
	'categories.deleteCostCategory': CategoriesDeleteCostCategoryInputSchema,

	'customFields.list': CustomFieldsListInputSchema,
	'customFields.get': CustomFieldsGetInputSchema,
	'customFields.create': CustomFieldsCreateInputSchema,
	'customFields.update': CustomFieldsUpdateInputSchema,
	'customFields.delete': CustomFieldsDeleteInputSchema,
	'customFields.search': CustomFieldsSearchInputSchema,
	'customFields.addChoices': CustomFieldsAddChoicesInputSchema,

	'milestones.list': MilestonesListInputSchema,
	'milestones.get': MilestonesGetInputSchema,
	'milestones.create': MilestonesCreateInputSchema,
	'milestones.update': MilestonesUpdateInputSchema,
	'milestones.delete': MilestonesDeleteInputSchema,
	'milestones.search': MilestonesSearchInputSchema,

	'events.list': EventsListInputSchema,
	'events.get': EventsGetInputSchema,
	'events.create': EventsCreateInputSchema,
	'events.update': EventsUpdateInputSchema,
	'events.delete': EventsDeleteInputSchema,
	'events.search': EventsSearchInputSchema,
} as const;

export const HubPlannerEndpointOutputSchemas = {
	'projects.list': ProjectsListResponseSchema,
	'projects.get': ProjectsGetResponseSchema,
	'projects.create': ProjectsCreateResponseSchema,
	'projects.update': ProjectsUpdateResponseSchema,
	'projects.delete': ProjectsDeleteResponseSchema,
	'projects.deleteBulk': ProjectsDeleteBulkResponseSchema,
	'projects.search': ProjectsSearchResponseSchema,
	'projects.addResources': ProjectsAddResourcesResponseSchema,
	'projects.removeResource': ProjectsRemoveResourceResponseSchema,
	'projects.addClients': ProjectsAddClientsResponseSchema,
	'projects.removeClient': ProjectsRemoveClientResponseSchema,
	'projects.setProjectManagers': ProjectsSetProjectManagersResponseSchema,
	'projects.getTags': ProjectsGetTagsResponseSchema,
	'projects.addTags': ProjectsAddTagsResponseSchema,
	'projects.removeTag': ProjectsRemoveTagResponseSchema,

	'resources.list': ResourcesListResponseSchema,
	'resources.get': ResourcesGetResponseSchema,
	'resources.create': ResourcesCreateResponseSchema,
	'resources.update': ResourcesUpdateResponseSchema,
	'resources.delete': ResourcesDeleteResponseSchema,
	'resources.deleteBulk': ResourcesDeleteBulkResponseSchema,
	'resources.search': ResourcesSearchResponseSchema,
	'resources.getTags': ResourcesGetTagsResponseSchema,
	'resources.addTags': ResourcesAddTagsResponseSchema,
	'resources.removeTag': ResourcesRemoveTagResponseSchema,

	'bookings.list': BookingsListResponseSchema,
	'bookings.get': BookingsGetResponseSchema,
	'bookings.create': BookingsCreateResponseSchema,
	'bookings.update': BookingsUpdateResponseSchema,
	'bookings.patch': BookingsPatchResponseSchema,
	'bookings.search': BookingsSearchResponseSchema,
	'bookings.delete': BookingsDeleteResponseSchema,
	'bookings.deleteBulk': BookingsDeleteBulkResponseSchema,

	'timeEntries.list': TimeEntriesListResponseSchema,
	'timeEntries.get': TimeEntriesGetResponseSchema,
	'timeEntries.create': TimeEntriesCreateResponseSchema,
	'timeEntries.search': TimeEntriesSearchResponseSchema,
	'timeEntries.update': TimeEntriesUpdateResponseSchema,
	'timeEntries.delete': TimeEntriesDeleteResponseSchema,
	'timeEntries.deleteBulk': TimeEntriesDeleteBulkResponseSchema,

	'categories.list': CategoriesListResponseSchema,
	'categories.get': CategoriesGetResponseSchema,
	'categories.create': CategoriesCreateResponseSchema,
	'categories.update': CategoriesUpdateResponseSchema,
	'categories.search': CategoriesSearchResponseSchema,
	'categories.listGroups': CategoriesListGroupsResponseSchema,
	'categories.listCostCategories': CategoriesListCostCategoriesResponseSchema,
	'categories.getCostCategory': CategoriesGetCostCategoryResponseSchema,
	'categories.createCostCategory': CategoriesCreateCostCategoryResponseSchema,
	'categories.updateCostCategory': CategoriesUpdateCostCategoryResponseSchema,
	'categories.searchCostCategories':
		CategoriesSearchCostCategoriesResponseSchema,
	'categories.deleteCostCategory': CategoriesDeleteCostCategoryResponseSchema,

	'customFields.list': CustomFieldsListResponseSchema,
	'customFields.get': CustomFieldsGetResponseSchema,
	'customFields.create': CustomFieldsCreateResponseSchema,
	'customFields.update': CustomFieldsUpdateResponseSchema,
	'customFields.delete': CustomFieldsDeleteResponseSchema,
	'customFields.search': CustomFieldsSearchResponseSchema,
	'customFields.addChoices': CustomFieldsAddChoicesResponseSchema,

	'milestones.list': MilestonesListResponseSchema,
	'milestones.get': MilestonesGetResponseSchema,
	'milestones.create': MilestonesCreateResponseSchema,
	'milestones.update': MilestonesUpdateResponseSchema,
	'milestones.delete': MilestonesDeleteResponseSchema,
	'milestones.search': MilestonesSearchResponseSchema,

	'events.list': EventsListResponseSchema,
	'events.get': EventsGetResponseSchema,
	'events.create': EventsCreateResponseSchema,
	'events.update': EventsUpdateResponseSchema,
	'events.delete': EventsDeleteResponseSchema,
	'events.search': EventsSearchResponseSchema,
} as const;
