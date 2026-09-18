import { z } from 'zod';
import {
	CloseActivityCall,
	CloseActivityEmail,
	CloseActivityNote,
	CloseContact,
	CloseCustomField,
	CloseLead,
	CloseOpportunity,
	CloseTask,
	CloseUser,
} from '../schema/database';

// ── LEADS ───────────────────────────────────────────────────────────────────
export const LeadsListInputSchema = z
	.object({
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
		query: z.string().optional(),
		status_id: z.string().optional(),
	})
	.optional();
export type LeadsListInput = z.infer<typeof LeadsListInputSchema>;

export const LeadsListResponseSchema = z.object({
	data: z.array(CloseLead),
	has_more: z.boolean().optional(),
	total_results: z.number().optional(),
});
export type LeadsListResponse = z.infer<typeof LeadsListResponseSchema>;

export const LeadsGetInputSchema = z.object({
	id: z.string(),
});
export type LeadsGetInput = z.infer<typeof LeadsGetInputSchema>;

export const LeadsGetResponseSchema = CloseLead;
export type LeadsGetResponse = z.infer<typeof LeadsGetResponseSchema>;

export const LeadsCreateInputSchema = z.object({
	name: z.string().optional(),
	status_id: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	custom: z.record(z.string(), z.unknown()).optional(),
	contacts: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type LeadsCreateInput = z.infer<typeof LeadsCreateInputSchema>;

export const LeadsCreateResponseSchema = CloseLead;
export type LeadsCreateResponse = z.infer<typeof LeadsCreateResponseSchema>;

export const LeadsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	status_id: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	custom: z.record(z.string(), z.unknown()).optional(),
});
export type LeadsUpdateInput = z.infer<typeof LeadsUpdateInputSchema>;

export const LeadsUpdateResponseSchema = CloseLead;
export type LeadsUpdateResponse = z.infer<typeof LeadsUpdateResponseSchema>;

export const LeadsDeleteInputSchema = z.object({
	id: z.string(),
});
export type LeadsDeleteInput = z.infer<typeof LeadsDeleteInputSchema>;

export const LeadsDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type LeadsDeleteResponse = z.infer<typeof LeadsDeleteResponseSchema>;

// ── CONTACTS ────────────────────────────────────────────────────────────────
export const ContactsListInputSchema = z
	.object({
		lead_id: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z.object({
	data: z.array(CloseContact),
	has_more: z.boolean().optional(),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsGetInputSchema = z.object({
	id: z.string(),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactsGetResponseSchema = CloseContact;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

export const ContactsCreateInputSchema = z.object({
	lead_id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	emails: z
		.array(z.object({ email: z.string(), type: z.string().optional() }))
		.optional(),
	phones: z
		.array(z.object({ phone: z.string(), type: z.string().optional() }))
		.optional(),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ContactsCreateResponseSchema = CloseContact;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	emails: z
		.array(z.object({ email: z.string(), type: z.string().optional() }))
		.optional(),
	phones: z
		.array(z.object({ phone: z.string(), type: z.string().optional() }))
		.optional(),
});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

export const ContactsUpdateResponseSchema = CloseContact;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

export const ContactsDeleteInputSchema = z.object({
	id: z.string(),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

export const ContactsDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

// ── OPPORTUNITIES ───────────────────────────────────────────────────────────
export const OpportunitiesListInputSchema = z
	.object({
		lead_id: z.string().optional(),
		status_id: z.string().optional(),
		user_id: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type OpportunitiesListInput = z.infer<
	typeof OpportunitiesListInputSchema
>;

export const OpportunitiesListResponseSchema = z.object({
	data: z.array(CloseOpportunity),
	has_more: z.boolean().optional(),
});
export type OpportunitiesListResponse = z.infer<
	typeof OpportunitiesListResponseSchema
>;

export const OpportunitiesGetInputSchema = z.object({
	id: z.string(),
});
export type OpportunitiesGetInput = z.infer<typeof OpportunitiesGetInputSchema>;

export const OpportunitiesGetResponseSchema = CloseOpportunity;
export type OpportunitiesGetResponse = z.infer<
	typeof OpportunitiesGetResponseSchema
>;

export const OpportunitiesCreateInputSchema = z.object({
	lead_id: z.string(),
	status_id: z.string(),
	value: z.number().optional(),
	value_period: z.string().optional(),
	confidence: z.number().optional(),
	user_id: z.string().optional(),
	note: z.string().optional(),
});
export type OpportunitiesCreateInput = z.infer<
	typeof OpportunitiesCreateInputSchema
>;

export const OpportunitiesCreateResponseSchema = CloseOpportunity;
export type OpportunitiesCreateResponse = z.infer<
	typeof OpportunitiesCreateResponseSchema
>;

export const OpportunitiesUpdateInputSchema = z.object({
	id: z.string(),
	status_id: z.string().optional(),
	value: z.number().optional(),
	value_period: z.string().optional(),
	confidence: z.number().optional(),
	user_id: z.string().optional(),
});
export type OpportunitiesUpdateInput = z.infer<
	typeof OpportunitiesUpdateInputSchema
>;

export const OpportunitiesUpdateResponseSchema = CloseOpportunity;
export type OpportunitiesUpdateResponse = z.infer<
	typeof OpportunitiesUpdateResponseSchema
>;

export const OpportunitiesDeleteInputSchema = z.object({
	id: z.string(),
});
export type OpportunitiesDeleteInput = z.infer<
	typeof OpportunitiesDeleteInputSchema
>;

export const OpportunitiesDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type OpportunitiesDeleteResponse = z.infer<
	typeof OpportunitiesDeleteResponseSchema
>;

// ── TASKS ───────────────────────────────────────────────────────────────────
export const TasksListInputSchema = z
	.object({
		lead_id: z.string().optional(),
		is_complete: z.boolean().optional(),
		assigned_to: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

export const TasksListResponseSchema = z.object({
	data: z.array(CloseTask),
	has_more: z.boolean().optional(),
});
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksGetInputSchema = z.object({
	id: z.string(),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

export const TasksGetResponseSchema = CloseTask;
export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

export const TasksCreateInputSchema = z.object({
	lead_id: z.string(),
	text: z.string(),
	due_date: z.string().optional(),
	assigned_to: z.string().optional(),
	type: z.string().optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = CloseTask;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

export const TasksUpdateInputSchema = z.object({
	id: z.string(),
	text: z.string().optional(),
	due_date: z.string().optional(),
	is_complete: z.boolean().optional(),
	assigned_to: z.string().optional(),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

export const TasksUpdateResponseSchema = CloseTask;
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

export const TasksDeleteInputSchema = z.object({
	id: z.string(),
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

export const TasksDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

// ── ACTIVITIES ──────────────────────────────────────────────────────────────
export const ActivitiesListNotesInputSchema = z
	.object({
		lead_id: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type ActivitiesListNotesInput = z.infer<
	typeof ActivitiesListNotesInputSchema
>;

export const ActivitiesListNotesResponseSchema = z.object({
	data: z.array(CloseActivityNote),
	has_more: z.boolean().optional(),
});
export type ActivitiesListNotesResponse = z.infer<
	typeof ActivitiesListNotesResponseSchema
>;

export const ActivitiesCreateNoteInputSchema = z.object({
	lead_id: z.string(),
	note: z.string(),
});
export type ActivitiesCreateNoteInput = z.infer<
	typeof ActivitiesCreateNoteInputSchema
>;

export const ActivitiesCreateNoteResponseSchema = CloseActivityNote;
export type ActivitiesCreateNoteResponse = z.infer<
	typeof ActivitiesCreateNoteResponseSchema
>;

export const ActivitiesListCallsInputSchema = z
	.object({
		lead_id: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type ActivitiesListCallsInput = z.infer<
	typeof ActivitiesListCallsInputSchema
>;

export const ActivitiesListCallsResponseSchema = z.object({
	data: z.array(CloseActivityCall),
	has_more: z.boolean().optional(),
});
export type ActivitiesListCallsResponse = z.infer<
	typeof ActivitiesListCallsResponseSchema
>;

export const ActivitiesListEmailsInputSchema = z
	.object({
		lead_id: z.string().optional(),
		_limit: z.number().int().positive().optional(),
		_skip: z.number().int().nonnegative().optional(),
	})
	.optional();
export type ActivitiesListEmailsInput = z.infer<
	typeof ActivitiesListEmailsInputSchema
>;

export const ActivitiesListEmailsResponseSchema = z.object({
	data: z.array(CloseActivityEmail),
	has_more: z.boolean().optional(),
});
export type ActivitiesListEmailsResponse = z.infer<
	typeof ActivitiesListEmailsResponseSchema
>;

// ── USERS ───────────────────────────────────────────────────────────────────
export const UsersGetMeInputSchema = z.object({}).optional();
export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;

export const UsersGetMeResponseSchema = CloseUser;
export type UsersGetMeResponse = z.infer<typeof UsersGetMeResponseSchema>;

export const UsersListInputSchema = z
	.object({
		_limit: z.number().int().positive().optional(),
	})
	.optional();
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UsersListResponseSchema = z.object({
	data: z.array(CloseUser),
});
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── CUSTOM FIELDS ───────────────────────────────────────────────────────────
export const CustomFieldsListLeadInputSchema = z.object({}).optional();
export type CustomFieldsListLeadInput = z.infer<
	typeof CustomFieldsListLeadInputSchema
>;

export const CustomFieldsListLeadResponseSchema = z.object({
	data: z.array(CloseCustomField),
});
export type CustomFieldsListLeadResponse = z.infer<
	typeof CustomFieldsListLeadResponseSchema
>;

export const CustomFieldsListContactInputSchema = z.object({}).optional();
export type CustomFieldsListContactInput = z.infer<
	typeof CustomFieldsListContactInputSchema
>;

export const CustomFieldsListContactResponseSchema = z.object({
	data: z.array(CloseCustomField),
});
export type CustomFieldsListContactResponse = z.infer<
	typeof CustomFieldsListContactResponseSchema
>;

// ── ALL ENDPOINTS MAP ───────────────────────────────────────────────────────
export type CloseEndpointInputs = {
	leadsList: LeadsListInput;
	leadsGet: LeadsGetInput;
	leadsCreate: LeadsCreateInput;
	leadsUpdate: LeadsUpdateInput;
	leadsDelete: LeadsDeleteInput;
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	opportunitiesList: OpportunitiesListInput;
	opportunitiesGet: OpportunitiesGetInput;
	opportunitiesCreate: OpportunitiesCreateInput;
	opportunitiesUpdate: OpportunitiesUpdateInput;
	opportunitiesDelete: OpportunitiesDeleteInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	activitiesListNotes: ActivitiesListNotesInput;
	activitiesCreateNote: ActivitiesCreateNoteInput;
	activitiesListCalls: ActivitiesListCallsInput;
	activitiesListEmails: ActivitiesListEmailsInput;
	usersGetMe: UsersGetMeInput;
	usersList: UsersListInput;
	customFieldsListLead: CustomFieldsListLeadInput;
	customFieldsListContact: CustomFieldsListContactInput;
};

export type CloseEndpointOutputs = {
	leadsList: LeadsListResponse;
	leadsGet: LeadsGetResponse;
	leadsCreate: LeadsCreateResponse;
	leadsUpdate: LeadsUpdateResponse;
	leadsDelete: LeadsDeleteResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	opportunitiesList: OpportunitiesListResponse;
	opportunitiesGet: OpportunitiesGetResponse;
	opportunitiesCreate: OpportunitiesCreateResponse;
	opportunitiesUpdate: OpportunitiesUpdateResponse;
	opportunitiesDelete: OpportunitiesDeleteResponse;
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
	activitiesListNotes: ActivitiesListNotesResponse;
	activitiesCreateNote: ActivitiesCreateNoteResponse;
	activitiesListCalls: ActivitiesListCallsResponse;
	activitiesListEmails: ActivitiesListEmailsResponse;
	usersGetMe: UsersGetMeResponse;
	usersList: UsersListResponse;
	customFieldsListLead: CustomFieldsListLeadResponse;
	customFieldsListContact: CustomFieldsListContactResponse;
};

export const CloseEndpointInputSchemas = {
	leadsList: LeadsListInputSchema,
	leadsGet: LeadsGetInputSchema,
	leadsCreate: LeadsCreateInputSchema,
	leadsUpdate: LeadsUpdateInputSchema,
	leadsDelete: LeadsDeleteInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	opportunitiesList: OpportunitiesListInputSchema,
	opportunitiesGet: OpportunitiesGetInputSchema,
	opportunitiesCreate: OpportunitiesCreateInputSchema,
	opportunitiesUpdate: OpportunitiesUpdateInputSchema,
	opportunitiesDelete: OpportunitiesDeleteInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	activitiesListNotes: ActivitiesListNotesInputSchema,
	activitiesCreateNote: ActivitiesCreateNoteInputSchema,
	activitiesListCalls: ActivitiesListCallsInputSchema,
	activitiesListEmails: ActivitiesListEmailsInputSchema,
	usersGetMe: UsersGetMeInputSchema,
	usersList: UsersListInputSchema,
	customFieldsListLead: CustomFieldsListLeadInputSchema,
	customFieldsListContact: CustomFieldsListContactInputSchema,
} as const;

export const CloseEndpointOutputSchemas = {
	leadsList: LeadsListResponseSchema,
	leadsGet: LeadsGetResponseSchema,
	leadsCreate: LeadsCreateResponseSchema,
	leadsUpdate: LeadsUpdateResponseSchema,
	leadsDelete: LeadsDeleteResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	opportunitiesList: OpportunitiesListResponseSchema,
	opportunitiesGet: OpportunitiesGetResponseSchema,
	opportunitiesCreate: OpportunitiesCreateResponseSchema,
	opportunitiesUpdate: OpportunitiesUpdateResponseSchema,
	opportunitiesDelete: OpportunitiesDeleteResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	activitiesListNotes: ActivitiesListNotesResponseSchema,
	activitiesCreateNote: ActivitiesCreateNoteResponseSchema,
	activitiesListCalls: ActivitiesListCallsResponseSchema,
	activitiesListEmails: ActivitiesListEmailsResponseSchema,
	usersGetMe: UsersGetMeResponseSchema,
	usersList: UsersListResponseSchema,
	customFieldsListLead: CustomFieldsListLeadResponseSchema,
	customFieldsListContact: CustomFieldsListContactResponseSchema,
} as const;
