import { z } from 'zod';

const StandardRecordSchema = z.record(z.string(), z.unknown());

const StandardActionResponseSchema = z.object({
    data: z.array(
        z.object({
            code: z.string(),
            details: z.record(z.string(), z.unknown()),
            message: z.string(),
            status: z.string(),
        }),
    ),
});

// Records
export const AddRecordsInputSchema = z.object({
    module: z.string().describe('Target module API name e.g. Contacts, Pipelines, Accounts'),
    data: z.array(StandardRecordSchema).min(1).describe('Array of record objects to insert'),
    trigger: z.array(z.string()).optional().describe('Triggers such as approval, workflow, blueprint'),
});
export type AddRecordsInput = z.infer<typeof AddRecordsInputSchema>;
export const AddRecordsResponseSchema = StandardActionResponseSchema;
export type AddRecordsResponse = z.infer<typeof AddRecordsResponseSchema>;

export const GetRecordsInputSchema = z.object({
    module: z.string(),
    fields: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort_by: z.string().optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
});
export type GetRecordsInput = z.infer<typeof GetRecordsInputSchema>;
export const GetRecordsResponseSchema = z.object({
    data: z.array(StandardRecordSchema),
    info: z.object({
        per_page: z.number().optional(),
        count: z.number().optional(),
        page: z.number().optional(),
        more_records: z.boolean().optional(),
    }).optional(),
});
export type GetRecordsResponse = z.infer<typeof GetRecordsResponseSchema>;

export const GetRecordInputSchema = z.object({
    module: z.string(),
    id: z.string(),
});
export type GetRecordInput = z.infer<typeof GetRecordInputSchema>;
export const GetRecordResponseSchema = z.object({
    data: z.array(StandardRecordSchema),
});
export type GetRecordResponse = z.infer<typeof GetRecordResponseSchema>;

export const UpdateRecordInputSchema = z.object({
    module: z.string(),
    id: z.string(),
    data: StandardRecordSchema,
});
export type UpdateRecordInput = z.infer<typeof UpdateRecordInputSchema>;
export const UpdateRecordResponseSchema = StandardActionResponseSchema;
export type UpdateRecordResponse = z.infer<typeof UpdateRecordResponseSchema>;

export const UpdateRecordsInputSchema = z.object({
    module: z.string(),
    data: z.array(StandardRecordSchema.and(z.object({ id: z.string() }))),
});
export type UpdateRecordsInput = z.infer<typeof UpdateRecordsInputSchema>;
export const UpdateRecordsResponseSchema = StandardActionResponseSchema;
export type UpdateRecordsResponse = z.infer<typeof UpdateRecordsResponseSchema>;

export const DeleteRecordInputSchema = z.object({
    module: z.string(),
    id: z.string(),
});
export type DeleteRecordInput = z.infer<typeof DeleteRecordInputSchema>;
export const DeleteRecordResponseSchema = StandardActionResponseSchema;
export type DeleteRecordResponse = z.infer<typeof DeleteRecordResponseSchema>;

export const DeleteRecordsInputSchema = z.object({
    module: z.string(),
    ids: z.array(z.string()),
});
export type DeleteRecordsInput = z.infer<typeof DeleteRecordsInputSchema>;
export const DeleteRecordsResponseSchema = StandardActionResponseSchema;
export type DeleteRecordsResponse = z.infer<typeof DeleteRecordsResponseSchema>;

export const RecordPhotoInputSchema = z.object({
    module: z.string(),
    id: z.string(),
});
export type RecordPhotoInput = z.infer<typeof RecordPhotoInputSchema>;

export const DeleteRecordPhotoResponseSchema = z.object({
    code: z.string(),
    message: z.string(),
    status: z.string(),
});
export type DeleteRecordPhotoResponse = z.infer<typeof DeleteRecordPhotoResponseSchema>;

export const DownloadRecordPhotoResponseSchema = z.unknown();
export type DownloadRecordPhotoResponse = unknown;

export const UploadRecordPhotoInputSchema = z.object({
    module: z.string(),
    id: z.string(),
    file: z.unknown(),
});
export type UploadRecordPhotoInput = z.infer<typeof UploadRecordPhotoInputSchema>;
export const UploadRecordPhotoResponseSchema = DeleteRecordPhotoResponseSchema;
export type UploadRecordPhotoResponse = z.infer<typeof UploadRecordPhotoResponseSchema>;

export const GetDeletedRecordsInputSchema = z.object({
    module: z.string(),
    type: z.enum(['all', 'recycle', 'permanent']).optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
});
export type GetDeletedRecordsInput = z.infer<typeof GetDeletedRecordsInputSchema>;
export const GetDeletedRecordsResponseSchema = z.object({
    data: z.array(StandardRecordSchema),
    info: z.record(z.string(), z.unknown()).optional(),
});
export type GetDeletedRecordsResponse = z.infer<typeof GetDeletedRecordsResponseSchema>;

export const GetRecordsCountInputSchema = z.object({
    module: z.string(),
    cvid: z.string().optional(),
});
export type GetRecordsCountInput = z.infer<typeof GetRecordsCountInputSchema>;
export const GetRecordsCountResponseSchema = z.object({
    count: z.string().or(z.number()),
});
export type GetRecordsCountResponse = z.infer<typeof GetRecordsCountResponseSchema>;

export const SearchRecordsInputSchema = z.object({
    module: z.string(),
    criteria: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    word: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
});
export type SearchRecordsInput = z.infer<typeof SearchRecordsInputSchema>;
export const SearchRecordsResponseSchema = GetRecordsResponseSchema;
export type SearchRecordsResponse = z.infer<typeof SearchRecordsResponseSchema>;

export const UpsertRecordsInputSchema = z.object({
    module: z.string(),
    data: z.array(StandardRecordSchema),
    duplicate_check_fields: z.array(z.string()).optional(),
});
export type UpsertRecordsInput = z.infer<typeof UpsertRecordsInputSchema>;
export const UpsertRecordsResponseSchema = StandardActionResponseSchema;
export type UpsertRecordsResponse = z.infer<typeof UpsertRecordsResponseSchema>;

export const GetRelatedRecordsInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    relatedList: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    fields: z.string().optional(),
});
export type GetRelatedRecordsInput = z.infer<typeof GetRelatedRecordsInputSchema>;
export const GetRelatedRecordsResponseSchema = GetRecordsResponseSchema;
export type GetRelatedRecordsResponse = z.infer<typeof GetRelatedRecordsResponseSchema>;

export const UpdateRelatedRecordsInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    relatedList: z.string(),
    data: z.array(StandardRecordSchema),
});
export type UpdateRelatedRecordsInput = z.infer<typeof UpdateRelatedRecordsInputSchema>;
export const UpdateRelatedRecordsResponseSchema = StandardActionResponseSchema;
export type UpdateRelatedRecordsResponse = z.infer<typeof UpdateRelatedRecordsResponseSchema>;

export const GetTeamPipelineRecordsInputSchema = z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    fields: z.string().optional(),
});
export type GetTeamPipelineRecordsInput = z.infer<typeof GetTeamPipelineRecordsInputSchema>;
export const GetTeamPipelineRecordsResponseSchema = GetRecordsResponseSchema;
export type GetTeamPipelineRecordsResponse = z.infer<typeof GetTeamPipelineRecordsResponseSchema>;

// Notes
export const CreateNotesInputSchema = z.object({
    data: z.array(
        z.object({
            Note_Title: z.string().optional(),
            Note_Content: z.string(),
            Parent_Id: z.string().optional(),
            se_module: z.string().optional(),
        }),
    ),
});
export type CreateNotesInput = z.infer<typeof CreateNotesInputSchema>;
export const CreateNotesResponseSchema = StandardActionResponseSchema;
export type CreateNotesResponse = z.infer<typeof CreateNotesResponseSchema>;

export const CreateRecordNotesInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    data: z.object({
        Note_Title: z.string().optional(),
        Note_Content: z.string(),
    }),
});
export type CreateRecordNotesInput = z.infer<typeof CreateRecordNotesInputSchema>;
export const CreateRecordNotesResponseSchema = StandardActionResponseSchema;
export type CreateRecordNotesResponse = z.infer<typeof CreateRecordNotesResponseSchema>;

export const DeleteNoteInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    noteId: z.string(),
});
export type DeleteNoteInput = z.infer<typeof DeleteNoteInputSchema>;
export const DeleteNoteResponseSchema = StandardActionResponseSchema;
export type DeleteNoteResponse = z.infer<typeof DeleteNoteResponseSchema>;

export const DeleteNotesInputSchema = z.object({
    ids: z.array(z.string()),
});
export type DeleteNotesInput = z.infer<typeof DeleteNotesInputSchema>;
export const DeleteNotesResponseSchema = StandardActionResponseSchema;
export type DeleteNotesResponse = z.infer<typeof DeleteNotesResponseSchema>;

export const GetAllNotesInputSchema = z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    fields: z.string().optional(),
});
export type GetAllNotesInput = z.infer<typeof GetAllNotesInputSchema>;
export const GetAllNotesResponseSchema = z.object({
    data: z.array(StandardRecordSchema),
    info: z.record(z.string(), z.unknown()).optional(),
});
export type GetAllNotesResponse = z.infer<typeof GetAllNotesResponseSchema>;

export const GetRecordNotesInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    fields: z.string().optional(),
});
export type GetRecordNotesInput = z.infer<typeof GetRecordNotesInputSchema>;
export const GetRecordNotesResponseSchema = GetAllNotesResponseSchema;
export type GetRecordNotesResponse = z.infer<typeof GetRecordNotesResponseSchema>;

export const UpdateNoteInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    noteId: z.string(),
    data: z.object({
        Note_Title: z.string().optional(),
        Note_Content: z.string(),
    }),
});
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;
export const UpdateNoteResponseSchema = StandardActionResponseSchema;
export type UpdateNoteResponse = z.infer<typeof UpdateNoteResponseSchema>;

// Tags & Delink
export const CreateTagsInputSchema = z.object({
    module: z.string(),
    tags: z.array(z.object({ name: z.string() })),
});
export type CreateTagsInput = z.infer<typeof CreateTagsInputSchema>;
export const CreateTagsResponseSchema = StandardActionResponseSchema;
export type CreateTagsResponse = z.infer<typeof CreateTagsResponseSchema>;

export const AddTagsToRecordsInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    tags: z.array(z.object({ name: z.string() })),
    overWrite: z.boolean().optional(),
});
export type AddTagsToRecordsInput = z.infer<typeof AddTagsToRecordsInputSchema>;
export const AddTagsToRecordsResponseSchema = StandardActionResponseSchema;
export type AddTagsToRecordsResponse = z.infer<typeof AddTagsToRecordsResponseSchema>;

export const DelinkRelatedRecordsInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    relatedList: z.string(),
    relatedRecordId: z.string(),
});
export type DelinkRelatedRecordsInput = z.infer<typeof DelinkRelatedRecordsInputSchema>;
export const DelinkRelatedRecordsResponseSchema = StandardActionResponseSchema;
export type DelinkRelatedRecordsResponse = z.infer<typeof DelinkRelatedRecordsResponseSchema>;

// Attachments
export const AttachmentInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    attachmentId: z.string(),
});
export type AttachmentInput = z.infer<typeof AttachmentInputSchema>;
export const DeleteAttachmentResponseSchema = StandardActionResponseSchema;
export type DeleteAttachmentResponse = z.infer<typeof DeleteAttachmentResponseSchema>;
export const DownloadAttachmentResponseSchema = z.unknown();
export type DownloadAttachmentResponse = unknown;

export const GetAttachmentsInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    fields: z.string().optional(),
});
export type GetAttachmentsInput = z.infer<typeof GetAttachmentsInputSchema>;
export const GetAttachmentsResponseSchema = z.object({
    data: z.array(StandardRecordSchema),
    info: z.record(z.string(), z.unknown()).optional(),
});
export type GetAttachmentsResponse = z.infer<typeof GetAttachmentsResponseSchema>;

export const UploadAttachmentInputSchema = z.object({
    module: z.string(),
    recordId: z.string(),
    attachment_url: z.string().optional(),
});
export type UploadAttachmentInput = z.infer<typeof UploadAttachmentInputSchema>;
export const UploadAttachmentResponseSchema = StandardActionResponseSchema;
export type UploadAttachmentResponse = z.infer<typeof UploadAttachmentResponseSchema>;

// Bulk
export const CreateBulkReadJobInputSchema = z.record(z.string(), z.unknown());
export type CreateBulkReadJobInput = z.infer<typeof CreateBulkReadJobInputSchema>;
export const CreateBulkReadJobResponseSchema = StandardActionResponseSchema;
export type CreateBulkReadJobResponse = z.infer<typeof CreateBulkReadJobResponseSchema>;

export const DownloadBulkReadResultInputSchema = z.object({
    jobId: z.string(),
});
export type DownloadBulkReadResultInput = z.infer<typeof DownloadBulkReadResultInputSchema>;
export const DownloadBulkReadResultResponseSchema = z.unknown();
export type DownloadBulkReadResultResponse = unknown;

export const GetBulkReadJobStatusInputSchema = z.object({
    jobId: z.string(),
});
export type GetBulkReadJobStatusInput = z.infer<typeof GetBulkReadJobStatusInputSchema>;
export const GetBulkReadJobStatusResponseSchema = StandardActionResponseSchema;
export type GetBulkReadJobStatusResponse = z.infer<typeof GetBulkReadJobStatusResponseSchema>;

// Notifications
export const DisableNotificationsInputSchema = z.object({
    channel_ids: z.array(z.string()),
});
export type DisableNotificationsInput = z.infer<typeof DisableNotificationsInputSchema>;
export const DisableNotificationsResponseSchema = StandardActionResponseSchema;
export type DisableNotificationsResponse = z.infer<typeof DisableNotificationsResponseSchema>;

export const EnableNotificationsInputSchema = z.object({
    watch: z.array(
        z.object({
            channel_id: z.string(),
            events: z.array(z.string()),
            token: z.string().optional(),
            notify_url: z.string(),
        }),
    ),
});
export type EnableNotificationsInput = z.infer<typeof EnableNotificationsInputSchema>;
export const EnableNotificationsResponseSchema = StandardActionResponseSchema;
export type EnableNotificationsResponse = z.infer<typeof EnableNotificationsResponseSchema>;

export const GetNotificationDetailsInputSchema = z.object({
    module: z.string().optional(),
    channel_id: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
});
export type GetNotificationDetailsInput = z.infer<typeof GetNotificationDetailsInputSchema>;
export const GetNotificationDetailsResponseSchema = z.object({
    watch: z.array(StandardRecordSchema),
    info: z.record(z.string(), z.unknown()).optional(),
});
export type GetNotificationDetailsResponse = z.infer<typeof GetNotificationDetailsResponseSchema>;

export const UpdateNotificationDetailsInputSchema = EnableNotificationsInputSchema;
export type UpdateNotificationDetailsInput = z.infer<typeof UpdateNotificationDetailsInputSchema>;
export const UpdateNotificationDetailsResponseSchema = StandardActionResponseSchema;
export type UpdateNotificationDetailsResponse = z.infer<typeof UpdateNotificationDetailsResponseSchema>;

export const UpdateNotificationInfoInputSchema = EnableNotificationsInputSchema;
export type UpdateNotificationInfoInput = z.infer<typeof UpdateNotificationInfoInputSchema>;
export const UpdateNotificationInfoResponseSchema = StandardActionResponseSchema;
export type UpdateNotificationInfoResponse = z.infer<typeof UpdateNotificationInfoResponseSchema>;

// Metadata & Settings
export const GetModulesResponseSchema = z.object({
    modules: z.array(StandardRecordSchema),
});
export type GetModulesResponse = z.infer<typeof GetModulesResponseSchema>;

export const GetModuleMetadataInputSchema = z.object({
    module: z.string(),
});
export type GetModuleMetadataInput = z.infer<typeof GetModuleMetadataInputSchema>;
export const GetModuleMetadataResponseSchema = z.object({
    modules: z.array(StandardRecordSchema),
});
export type GetModuleMetadataResponse = z.infer<typeof GetModuleMetadataResponseSchema>;

export const GetFieldsInputSchema = z.object({
    module: z.string(),
});
export type GetFieldsInput = z.infer<typeof GetFieldsInputSchema>;
export const GetFieldsResponseSchema = z.object({
    fields: z.array(StandardRecordSchema),
});
export type GetFieldsResponse = z.infer<typeof GetFieldsResponseSchema>;

export const GetLayoutsInputSchema = z.object({
    module: z.string(),
});
export type GetLayoutsInput = z.infer<typeof GetLayoutsInputSchema>;
export const GetLayoutsResponseSchema = z.object({
    layouts: z.array(StandardRecordSchema),
});
export type GetLayoutsResponse = z.infer<typeof GetLayoutsResponseSchema>;

export const GetLayoutInputSchema = z.object({
    module: z.string(),
    layoutId: z.string(),
});
export type GetLayoutInput = z.infer<typeof GetLayoutInputSchema>;
export const GetLayoutResponseSchema = z.object({
    layouts: z.array(StandardRecordSchema),
});
export type GetLayoutResponse = z.infer<typeof GetLayoutResponseSchema>;

export const GetCustomViewsInputSchema = z.object({
    module: z.string(),
});
export type GetCustomViewsInput = z.infer<typeof GetCustomViewsInputSchema>;
export const GetCustomViewsResponseSchema = z.object({
    custom_views: z.array(StandardRecordSchema),
});
export type GetCustomViewsResponse = z.infer<typeof GetCustomViewsResponseSchema>;

export const GetCustomViewInputSchema = z.object({
    module: z.string(),
    viewId: z.string(),
});
export type GetCustomViewInput = z.infer<typeof GetCustomViewInputSchema>;
export const GetCustomViewResponseSchema = z.object({
    custom_views: z.array(StandardRecordSchema),
});
export type GetCustomViewResponse = z.infer<typeof GetCustomViewResponseSchema>;

export const GetRelatedListsMetadataInputSchema = z.object({
    module: z.string(),
});
export type GetRelatedListsMetadataInput = z.infer<typeof GetRelatedListsMetadataInputSchema>;
export const GetRelatedListsMetadataResponseSchema = z.object({
    related_lists: z.array(StandardRecordSchema),
});
export type GetRelatedListsMetadataResponse = z.infer<typeof GetRelatedListsMetadataResponseSchema>;

// Users, Roles & Org
export const GetUsersInputSchema = z.object({
    type: z.enum(['ActiveUsers', 'DeactiveUsers', 'AdminUsers', 'AllUsers']).optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
});
export type GetUsersInput = z.infer<typeof GetUsersInputSchema>;
export const GetUsersResponseSchema = z.object({
    users: z.array(StandardRecordSchema),
    info: z.record(z.string(), z.unknown()).optional(),
});
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;

export const GetUserInputSchema = z.object({
    id: z.string(),
});
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export const GetUserResponseSchema = z.object({
    users: z.array(StandardRecordSchema),
});
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

export const UpdateUserInputSchema = z.object({
    id: z.string(),
    data: StandardRecordSchema,
});
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export const UpdateUserResponseSchema = StandardActionResponseSchema;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

export const UpdateUsersInputSchema = z.object({
    users: z.array(StandardRecordSchema.and(z.object({ id: z.string() }))),
});
export type UpdateUsersInput = z.infer<typeof UpdateUsersInputSchema>;
export const UpdateUsersResponseSchema = StandardActionResponseSchema;
export type UpdateUsersResponse = z.infer<typeof UpdateUsersResponseSchema>;

export const GetRolesResponseSchema = z.object({
    roles: z.array(StandardRecordSchema),
});
export type GetRolesResponse = z.infer<typeof GetRolesResponseSchema>;

export const GetProfilesResponseSchema = z.object({
    profiles: z.array(StandardRecordSchema),
});
export type GetProfilesResponse = z.infer<typeof GetProfilesResponseSchema>;

export const GetOrganizationResponseSchema = z.object({
    org: z.array(StandardRecordSchema),
});
export type GetOrganizationResponse = z.infer<typeof GetOrganizationResponseSchema>;

export const UploadOrganizationPhotoInputSchema = z.object({
    file: z.unknown(),
});
export type UploadOrganizationPhotoInput = z.infer<typeof UploadOrganizationPhotoInputSchema>;
export const UploadOrganizationPhotoResponseSchema = DeleteRecordPhotoResponseSchema;
export type UploadOrganizationPhotoResponse = z.infer<typeof UploadOrganizationPhotoResponseSchema>;

// Unified Types
export type ZohoBiginEndpointInputs = {
    addRecords: AddRecordsInput;
    getRecords: GetRecordsInput;
    getRecord: GetRecordInput;
    updateRecord: UpdateRecordInput;
    updateRecords: UpdateRecordsInput;
    deleteRecord: DeleteRecordInput;
    deleteRecords: DeleteRecordsInput;
    deleteRecordPhoto: RecordPhotoInput;
    downloadRecordPhoto: RecordPhotoInput;
    uploadRecordPhoto: UploadRecordPhotoInput;
    getDeletedRecords: GetDeletedRecordsInput;
    getRecordsCount: GetRecordsCountInput;
    searchRecords: SearchRecordsInput;
    upsertRecords: UpsertRecordsInput;
    getRelatedRecords: GetRelatedRecordsInput;
    updateRelatedRecords: UpdateRelatedRecordsInput;
    getTeamPipelineRecords: GetTeamPipelineRecordsInput;
    createNotes: CreateNotesInput;
    createRecordNotes: CreateRecordNotesInput;
    deleteNote: DeleteNoteInput;
    deleteNotes: DeleteNotesInput;
    getAllNotes: GetAllNotesInput;
    getRecordNotes: GetRecordNotesInput;
    updateNote: UpdateNoteInput;
    createTags: CreateTagsInput;
    addTagsToRecords: AddTagsToRecordsInput;
    delinkRelatedRecords: DelinkRelatedRecordsInput;
    deleteAttachment: AttachmentInput;
    downloadAttachment: AttachmentInput;
    getAttachments: GetAttachmentsInput;
    uploadAttachment: UploadAttachmentInput;
    createBulkReadJob: CreateBulkReadJobInput;
    downloadBulkReadResult: DownloadBulkReadResultInput;
    getBulkReadJobStatus: GetBulkReadJobStatusInput;
    disableNotifications: DisableNotificationsInput;
    enableNotifications: EnableNotificationsInput;
    getNotificationDetails: GetNotificationDetailsInput;
    updateNotificationDetails: UpdateNotificationDetailsInput;
    updateNotificationInfo: UpdateNotificationInfoInput;
    getModules: void;
    getModuleMetadata: GetModuleMetadataInput;
    getFields: GetFieldsInput;
    getLayouts: GetLayoutsInput;
    getLayout: GetLayoutInput;
    getCustomViews: GetCustomViewsInput;
    getCustomView: GetCustomViewInput;
    getRelatedListsMetadata: GetRelatedListsMetadataInput;
    getUsers: GetUsersInput;
    getUser: GetUserInput;
    updateUser: UpdateUserInput;
    updateUsers: UpdateUsersInput;
    getRoles: void;
    getProfiles: void;
    getOrganization: void;
    uploadOrganizationPhoto: UploadOrganizationPhotoInput;
};

export type ZohoBiginEndpointOutputs = {
    addRecords: AddRecordsResponse;
    getRecords: GetRecordsResponse;
    getRecord: GetRecordResponse;
    updateRecord: UpdateRecordResponse;
    updateRecords: UpdateRecordsResponse;
    deleteRecord: DeleteRecordResponse;
    deleteRecords: DeleteRecordsResponse;
    deleteRecordPhoto: DeleteRecordPhotoResponse;
    downloadRecordPhoto: DownloadRecordPhotoResponse;
    uploadRecordPhoto: UploadRecordPhotoResponse;
    getDeletedRecords: GetDeletedRecordsResponse;
    getRecordsCount: GetRecordsCountResponse;
    searchRecords: SearchRecordsResponse;
    upsertRecords: UpsertRecordsResponse;
    getRelatedRecords: GetRelatedRecordsResponse;
    updateRelatedRecords: UpdateRelatedRecordsResponse;
    getTeamPipelineRecords: GetTeamPipelineRecordsResponse;
    createNotes: CreateNotesResponse;
    createRecordNotes: CreateRecordNotesResponse;
    deleteNote: DeleteNoteResponse;
    deleteNotes: DeleteNotesResponse;
    getAllNotes: GetAllNotesResponse;
    getRecordNotes: GetRecordNotesResponse;
    updateNote: UpdateNoteResponse;
    createTags: CreateTagsResponse;
    addTagsToRecords: AddTagsToRecordsResponse;
    delinkRelatedRecords: DelinkRelatedRecordsResponse;
    deleteAttachment: DeleteAttachmentResponse;
    downloadAttachment: DownloadAttachmentResponse;
    getAttachments: GetAttachmentsResponse;
    uploadAttachment: UploadAttachmentResponse;
    createBulkReadJob: CreateBulkReadJobResponse;
    downloadBulkReadResult: DownloadBulkReadResultResponse;
    getBulkReadJobStatus: GetBulkReadJobStatusResponse;
    disableNotifications: DisableNotificationsResponse;
    enableNotifications: EnableNotificationsResponse;
    getNotificationDetails: GetNotificationDetailsResponse;
    updateNotificationDetails: UpdateNotificationDetailsResponse;
    updateNotificationInfo: UpdateNotificationInfoResponse;
    getModules: GetModulesResponse;
    getModuleMetadata: GetModuleMetadataResponse;
    getFields: GetFieldsResponse;
    getLayouts: GetLayoutsResponse;
    getLayout: GetLayoutResponse;
    getCustomViews: GetCustomViewsResponse;
    getCustomView: GetCustomViewResponse;
    getRelatedListsMetadata: GetRelatedListsMetadataResponse;
    getUsers: GetUsersResponse;
    getUser: GetUserResponse;
    updateUser: UpdateUserResponse;
    updateUsers: UpdateUsersResponse;
    getRoles: GetRolesResponse;
    getProfiles: GetProfilesResponse;
    getOrganization: GetOrganizationResponse;
    uploadOrganizationPhoto: UploadOrganizationPhotoResponse;
};

export const ZohoBiginEndpointInputSchemas = {
    addRecords: AddRecordsInputSchema,
    getRecords: GetRecordsInputSchema,
    getRecord: GetRecordInputSchema,
    updateRecord: UpdateRecordInputSchema,
    updateRecords: UpdateRecordsInputSchema,
    deleteRecord: DeleteRecordInputSchema,
    deleteRecords: DeleteRecordsInputSchema,
    deleteRecordPhoto: RecordPhotoInputSchema,
    downloadRecordPhoto: RecordPhotoInputSchema,
    uploadRecordPhoto: UploadRecordPhotoInputSchema,
    getDeletedRecords: GetDeletedRecordsInputSchema,
    getRecordsCount: GetRecordsCountInputSchema,
    searchRecords: SearchRecordsInputSchema,
    upsertRecords: UpsertRecordsInputSchema,
    getRelatedRecords: GetRelatedRecordsInputSchema,
    updateRelatedRecords: UpdateRelatedRecordsInputSchema,
    getTeamPipelineRecords: GetTeamPipelineRecordsInputSchema,
    createNotes: CreateNotesInputSchema,
    createRecordNotes: CreateRecordNotesInputSchema,
    deleteNote: DeleteNoteInputSchema,
    deleteNotes: DeleteNotesInputSchema,
    getAllNotes: GetAllNotesInputSchema,
    getRecordNotes: GetRecordNotesInputSchema,
    updateNote: UpdateNoteInputSchema,
    createTags: CreateTagsInputSchema,
    addTagsToRecords: AddTagsToRecordsInputSchema,
    delinkRelatedRecords: DelinkRelatedRecordsInputSchema,
    deleteAttachment: AttachmentInputSchema,
    downloadAttachment: AttachmentInputSchema,
    getAttachments: GetAttachmentsInputSchema,
    uploadAttachment: UploadAttachmentInputSchema,
    createBulkReadJob: CreateBulkReadJobInputSchema,
    downloadBulkReadResult: DownloadBulkReadResultInputSchema,
    getBulkReadJobStatus: GetBulkReadJobStatusInputSchema,
    disableNotifications: DisableNotificationsInputSchema,
    enableNotifications: EnableNotificationsInputSchema,
    getNotificationDetails: GetNotificationDetailsInputSchema,
    updateNotificationDetails: UpdateNotificationDetailsInputSchema,
    updateNotificationInfo: UpdateNotificationInfoInputSchema,
    getModules: z.void(),
    getModuleMetadata: GetModuleMetadataInputSchema,
    getFields: GetFieldsInputSchema,
    getLayouts: GetLayoutsInputSchema,
    getLayout: GetLayoutInputSchema,
    getCustomViews: GetCustomViewsInputSchema,
    getCustomView: GetCustomViewInputSchema,
    getRelatedListsMetadata: GetRelatedListsMetadataInputSchema,
    getUsers: GetUsersInputSchema,
    getUser: GetUserInputSchema,
    updateUser: UpdateUserInputSchema,
    updateUsers: UpdateUsersInputSchema,
    getRoles: z.void(),
    getProfiles: z.void(),
    getOrganization: z.void(),
    uploadOrganizationPhoto: UploadOrganizationPhotoInputSchema,
} as const;

export const ZohoBiginEndpointOutputSchemas = {
    addRecords: AddRecordsResponseSchema,
    getRecords: GetRecordsResponseSchema,
    getRecord: GetRecordResponseSchema,
    updateRecord: UpdateRecordResponseSchema,
    updateRecords: UpdateRecordsResponseSchema,
    deleteRecord: DeleteRecordResponseSchema,
    deleteRecords: DeleteRecordsResponseSchema,
    deleteRecordPhoto: DeleteRecordPhotoResponseSchema,
    downloadRecordPhoto: DownloadRecordPhotoResponseSchema,
    uploadRecordPhoto: UploadRecordPhotoResponseSchema,
    getDeletedRecords: GetDeletedRecordsResponseSchema,
    getRecordsCount: GetRecordsCountResponseSchema,
    searchRecords: SearchRecordsResponseSchema,
    upsertRecords: UpsertRecordsResponseSchema,
    getRelatedRecords: GetRelatedRecordsResponseSchema,
    updateRelatedRecords: UpdateRelatedRecordsResponseSchema,
    getTeamPipelineRecords: GetTeamPipelineRecordsResponseSchema,
    createNotes: CreateNotesResponseSchema,
    createRecordNotes: CreateRecordNotesResponseSchema,
    deleteNote: DeleteNoteResponseSchema,
    deleteNotes: DeleteNotesResponseSchema,
    getAllNotes: GetAllNotesResponseSchema,
    getRecordNotes: GetRecordNotesResponseSchema,
    updateNote: UpdateNoteResponseSchema,
    createTags: CreateTagsResponseSchema,
    addTagsToRecords: AddTagsToRecordsResponseSchema,
    delinkRelatedRecords: DelinkRelatedRecordsResponseSchema,
    deleteAttachment: DeleteAttachmentResponseSchema,
    downloadAttachment: DownloadAttachmentResponseSchema,
    getAttachments: GetAttachmentsResponseSchema,
    uploadAttachment: UploadAttachmentResponseSchema,
    createBulkReadJob: CreateBulkReadJobResponseSchema,
    downloadBulkReadResult: DownloadBulkReadResultResponseSchema,
    getBulkReadJobStatus: GetBulkReadJobStatusResponseSchema,
    disableNotifications: DisableNotificationsResponseSchema,
    enableNotifications: EnableNotificationsResponseSchema,
    getNotificationDetails: GetNotificationDetailsResponseSchema,
    updateNotificationDetails: UpdateNotificationDetailsResponseSchema,
    updateNotificationInfo: UpdateNotificationInfoResponseSchema,
    getModules: GetModulesResponseSchema,
    getModuleMetadata: GetModuleMetadataResponseSchema,
    getFields: GetFieldsResponseSchema,
    getLayouts: GetLayoutsResponseSchema,
    getLayout: GetLayoutResponseSchema,
    getCustomViews: GetCustomViewsResponseSchema,
    getCustomView: GetCustomViewResponseSchema,
    getRelatedListsMetadata: GetRelatedListsMetadataResponseSchema,
    getUsers: GetUsersResponseSchema,
    getUser: GetUserResponseSchema,
    updateUser: UpdateUserResponseSchema,
    updateUsers: UpdateUsersResponseSchema,
    getRoles: GetRolesResponseSchema,
    getProfiles: GetProfilesResponseSchema,
    getOrganization: GetOrganizationResponseSchema,
    uploadOrganizationPhoto: UploadOrganizationPhotoResponseSchema,
} as const;
