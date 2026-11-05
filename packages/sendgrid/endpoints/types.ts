import { z } from 'zod';
import {
	SendGridBounce,
	SendGridContact,
	SendGridList,
	SendGridVerifiedSender,
} from '../schema/database';

const EmailRecipientSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
});

const PersonalizationSchema = z.object({
	to: z.array(EmailRecipientSchema).min(1),
	cc: z.array(EmailRecipientSchema).optional(),
	bcc: z.array(EmailRecipientSchema).optional(),
	subject: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	substitutions: z.record(z.string(), z.string()).optional(),
	dynamic_template_data: z.record(z.string(), z.unknown()).optional(),
	custom_args: z.record(z.string(), z.string()).optional(),
	send_at: z.number().int().optional(),
});

const ContentSchema = z.object({
	type: z.string().min(1),
	value: z.string().min(1),
});

/** Official: POST /v3/mail/send */
const MailSendInputSchema = z
	.object({
		personalizations: z.array(PersonalizationSchema).min(1),
		from: EmailRecipientSchema,
		subject: z.string().optional(),
		content: z.array(ContentSchema).optional(),
		reply_to: EmailRecipientSchema.optional(),
		template_id: z.string().optional(),
		categories: z.array(z.string()).optional(),
		send_at: z.number().int().optional(),
		batch_id: z.string().optional(),
		ip_pool_name: z.string().optional(),
		asm: z
			.object({
				group_id: z.number().int(),
				groups_to_display: z.array(z.number().int()).optional(),
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		const templated =
			typeof data.template_id === 'string' && data.template_id.length > 0;
		if (templated) {
			return;
		}
		if (!data.content || data.content.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'content is required unless template_id is set',
			});
		}
		const topSubject =
			typeof data.subject === 'string' && data.subject.length > 0;
		if (
			!topSubject &&
			data.personalizations.some(
				(p) => !(typeof p.subject === 'string' && p.subject.length > 0),
			)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['subject'],
				message:
					'subject is required at the top level or on every personalization unless template_id is set',
			});
		}
	});

const EmptySchema = z.object({});
const ObjSchema = z.object({}).catchall(z.unknown());
const ArrSchema = z.array(ObjSchema);
const JobSchema = z.object({ job_id: z.string() }).catchall(z.unknown());
const IdSchema = z.object({ id: z.string() });
const IdNumSchema = z.object({ id: z.union([z.string(), z.number()]) });
const EmailSchema = z.object({ email: z.string().email() });
const BatchIdSchema = z.object({ batch_id: z.string() });
const PageSchema = z.object({
	page_size: z.number().int().positive().max(1000).optional(),
	page_token: z.string().optional(),
});
const SuppressionListSchema = z.object({
	start_time: z.number().int().optional(),
	end_time: z.number().int().optional(),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
});
const StatsSchema = z.object({
	start_date: z.string(),
	end_date: z.string().optional(),
	aggregated_by: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	mailbox_providers: z.string().optional(),
	country: z.string().optional(),
});

const inputKinds = {
	empty: EmptySchema,
	mailSend: MailSendInputSchema,
	batchId: BatchIdSchema,
	scheduledSend: z.object({
		batch_id: z.string(),
		status: z.enum(['pause', 'cancel']),
	}),
	scheduledSendUpdate: z.object({
		batch_id: z.string(),
		status: z.enum(['pause', 'cancel']),
	}),
	contactsAddOrUpdate: z.object({
		list_ids: z.array(z.string()).optional(),
		contacts: z
			.array(
				SendGridContact.refine(
					(contact) =>
						Boolean(
							contact.email ||
								contact.phone_number_id ||
								contact.external_id ||
								contact.anonymous_id,
						),
					{
						message:
							'at least one of email, phone_number_id, external_id, or anonymous_id is required',
					},
				),
			)
			.min(1),
	}),
	id: IdSchema,
	contactSearch: z.object({ query: z.string() }).catchall(z.unknown()),
	contactSearchEmails: z.object({ emails: z.array(z.string().email()).min(1) }),
	idsQuery: z.object({ ids: z.string() }),
	page: PageSchema,
	contactImport: z.object({
		file_type: z.literal('csv'),
		field_mappings: z.array(z.string().nullable()).min(1),
		list_ids: z.array(z.string()).optional(),
	}),
	contactExport: z
		.object({
			list_ids: z.array(z.string()).optional(),
			segment_ids: z.array(z.string()).optional(),
			file_type: z.enum(['csv', 'json']).optional(),
			max_file_size: z.number().int().optional(),
		})
		.catchall(z.unknown()),
	listsCreate: z.object({ name: z.string().min(1) }),
	idSample: z.object({
		id: z.string(),
		contact_sample: z.boolean().optional(),
	}),
	idName: z.object({ id: z.string(), name: z.string().min(1) }),
	idDeleteContacts: z.object({
		id: z.string(),
		delete_contacts: z.boolean().optional(),
	}),
	idContactIds: z.object({ id: z.string(), contact_ids: z.string() }),
	segment: z
		.object({
			name: z.string(),
			query_dsl: z.string().optional(),
			parent_list_id: z.string().optional(),
		})
		.catchall(z.unknown()),
	segmentsList: z.object({
		parent_list_ids: z.string().optional(),
		no_parent_list_id: z.boolean().optional(),
	}),
	idContactsSample: z.object({
		id: z.string(),
		contacts_sample: z.boolean().optional(),
	}),
	segmentUpdate: z
		.object({
			id: z.string(),
			name: z.string().optional(),
			query_dsl: z.string().optional(),
		})
		.catchall(z.unknown()),
	segmentRefresh: z.object({
		id: z.string(),
		user_time_zone: z.string(),
	}),
	fieldCreate: z.object({
		name: z.string(),
		field_type: z.string(),
	}),
	sendersGetAll: z.object({
		limit: z.number().int().positive().optional(),
		lastSeenID: z.number().int().optional(),
		id: z.number().int().optional(),
	}),
	verifiedSender: z
		.object({
			nickname: z.string(),
			from_email: z.string().email(),
			from_name: z.string().optional(),
			reply_to: z.string().email().optional(),
			address: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zip: z.string().optional(),
			country: z.string().optional(),
		})
		.catchall(z.unknown()),
	verifiedSenderUpdate: z
		.object({
			id: z.union([z.string(), z.number()]),
			nickname: z.string().optional(),
			from_email: z.string().email().optional(),
		})
		.catchall(z.unknown()),
	idNum: IdNumSchema,
	senderIdentity: z.object({}).catchall(z.unknown()),
	templateCreate: z.object({
		name: z.string(),
		generation: z.string().optional(),
	}),
	templatesList: z.object({
		generations: z.string().optional(),
		page_size: z.number().int().optional(),
	}),
	templateVersion: z
		.object({
			id: z.string(),
			name: z.string().optional(),
			subject: z.string().optional(),
			html_content: z.string().optional(),
			plain_content: z.string().optional(),
			active: z.number().int().optional(),
		})
		.catchall(z.unknown()),
	templateVersionId: z.object({ id: z.string(), version_id: z.string() }),
	templateVersionUpdate: z
		.object({
			id: z.string(),
			version_id: z.string(),
			name: z.string().optional(),
			subject: z.string().optional(),
			html_content: z.string().optional(),
			plain_content: z.string().optional(),
		})
		.catchall(z.unknown()),
	suppressionList: SuppressionListSchema,
	email: EmailSchema,
	deleteSuppressions: z.object({
		delete_all: z.boolean().optional(),
		emails: z.array(z.string().email()).optional(),
	}),
	recipientEmails: z.object({
		recipient_emails: z.array(z.string().email()).min(1),
	}),
	asmIdQuery: z.object({ id: z.number().int().optional() }),
	asmGroup: z.object({
		name: z.string(),
		description: z.string(),
		is_default: z.boolean().optional(),
	}),
	asmGroupUpdate: z
		.object({
			id: z.union([z.string(), z.number()]),
			name: z.string().optional(),
			description: z.string().optional(),
			is_default: z.boolean().optional(),
		})
		.catchall(z.unknown()),
	asmGroupEmails: z.object({
		id: z.union([z.string(), z.number()]),
		recipient_emails: z.array(z.string().email()).min(1),
	}),
	idNumEmail: z.object({
		id: z.union([z.string(), z.number()]),
		email: z.string().email(),
	}),
	stats: StatsSchema,
	statsCategories: StatsSchema.extend({
		categories: z.string(),
	}),
	apiKeyCreate: z.object({
		name: z.string(),
		scopes: z.array(z.string()).optional(),
	}),
	limit: z.object({ limit: z.number().int().positive().optional() }),
	apiKeyUpdate: z.object({
		id: z.string(),
		name: z.string().optional(),
		scopes: z.array(z.string()).optional(),
	}),
} as const;

const outputKinds = {
	empty: EmptySchema,
	obj: ObjSchema,
	arr: ArrSchema,
	job: JobSchema,
	mailSend: z.object({ x_message_id: z.string().optional() }),
	list: SendGridList,
	listsGetAll: z.object({
		result: z.array(SendGridList),
		_metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	sendersGetAll: z.object({
		results: z.array(SendGridVerifiedSender),
	}),
	bounces: z.object({ bounces: z.array(SendGridBounce) }),
	results: z.object({ results: z.array(ObjSchema) }),
} as const;

export const SendGridEndpointInputSchemas = {
	mailSend: inputKinds.mailSend,
	mailCreateBatchId: inputKinds.empty,
	mailValidateBatchId: inputKinds.batchId,
	mailCancelScheduledSend: inputKinds.scheduledSend,
	mailListScheduledSends: inputKinds.empty,
	mailGetScheduledSend: inputKinds.batchId,
	mailUpdateScheduledSend: inputKinds.scheduledSendUpdate,
	mailDeleteScheduledSend: inputKinds.batchId,
	contactsAddOrUpdate: inputKinds.contactsAddOrUpdate,
	contactsGet: inputKinds.id,
	contactsSearch: inputKinds.contactSearch,
	contactsSearchEmails: inputKinds.contactSearchEmails,
	contactsRemove: inputKinds.idsQuery,
	contactsGetCount: inputKinds.empty,
	contactsGetSample: inputKinds.page,
	contactsImport: inputKinds.contactImport,
	contactsImportStatus: inputKinds.id,
	contactsExport: inputKinds.contactExport,
	contactsExportStatus: inputKinds.id,
	contactsListExports: inputKinds.empty,
	listsGetAll: inputKinds.page,
	listsCreate: inputKinds.listsCreate,
	listsGet: inputKinds.idSample,
	listsUpdate: inputKinds.idName,
	listsRemove: inputKinds.idDeleteContacts,
	listsGetContactCount: inputKinds.id,
	listsRemoveContacts: inputKinds.idContactIds,
	segmentsCreate: inputKinds.segment,
	segmentsGetAll: inputKinds.segmentsList,
	segmentsGet: inputKinds.idContactsSample,
	segmentsUpdate: inputKinds.segmentUpdate,
	segmentsRemove: inputKinds.id,
	segmentsRefresh: inputKinds.segmentRefresh,
	fieldsGetAll: inputKinds.empty,
	fieldsCreate: inputKinds.fieldCreate,
	fieldsUpdate: inputKinds.idName,
	fieldsRemove: inputKinds.id,
	sendersGetAll: inputKinds.sendersGetAll,
	sendersCreate: inputKinds.verifiedSender,
	sendersUpdate: inputKinds.verifiedSenderUpdate,
	sendersRemove: inputKinds.idNum,
	sendersResend: inputKinds.idNum,
	sendersListIdentities: inputKinds.empty,
	sendersCreateIdentity: inputKinds.senderIdentity,
	sendersGetIdentity: inputKinds.idNum,
	templatesCreate: inputKinds.templateCreate,
	templatesGetAll: inputKinds.templatesList,
	templatesGet: inputKinds.id,
	templatesUpdate: inputKinds.idName,
	templatesRemove: inputKinds.id,
	templatesCreateVersion: inputKinds.templateVersion,
	templatesGetVersion: inputKinds.templateVersionId,
	templatesUpdateVersion: inputKinds.templateVersionUpdate,
	templatesRemoveVersion: inputKinds.templateVersionId,
	templatesActivateVersion: inputKinds.templateVersionId,
	suppressionsGetBounces: inputKinds.suppressionList,
	suppressionsGetBounce: inputKinds.email,
	suppressionsDeleteBounce: inputKinds.email,
	suppressionsDeleteBounces: inputKinds.deleteSuppressions,
	suppressionsGetBlocks: inputKinds.suppressionList,
	suppressionsGetBlock: inputKinds.email,
	suppressionsDeleteBlock: inputKinds.email,
	suppressionsDeleteBlocks: inputKinds.deleteSuppressions,
	suppressionsGetSpamReports: inputKinds.suppressionList,
	suppressionsGetSpamReport: inputKinds.email,
	suppressionsDeleteSpamReport: inputKinds.email,
	suppressionsDeleteSpamReports: inputKinds.deleteSuppressions,
	suppressionsGetInvalidEmails: inputKinds.suppressionList,
	suppressionsGetInvalidEmail: inputKinds.email,
	suppressionsDeleteInvalidEmail: inputKinds.email,
	suppressionsDeleteInvalidEmails: inputKinds.deleteSuppressions,
	suppressionsGetGlobalUnsubscribes: inputKinds.suppressionList,
	suppressionsAddGlobalUnsubscribes: inputKinds.recipientEmails,
	suppressionsGetGlobalUnsubscribe: inputKinds.email,
	suppressionsDeleteGlobalUnsubscribe: inputKinds.email,
	asmGetGroups: inputKinds.asmIdQuery,
	asmCreateGroup: inputKinds.asmGroup,
	asmGetGroup: inputKinds.idNum,
	asmUpdateGroup: inputKinds.asmGroupUpdate,
	asmDeleteGroup: inputKinds.idNum,
	asmAddGroupSuppressions: inputKinds.asmGroupEmails,
	asmGetGroupSuppressions: inputKinds.idNum,
	asmDeleteGroupSuppression: inputKinds.idNumEmail,
	statsGetGlobal: inputKinds.stats,
	statsGetCategory: inputKinds.statsCategories,
	statsGetMailboxProvider: inputKinds.stats,
	statsGetGeo: inputKinds.stats,
	statsGetDevice: inputKinds.stats,
	statsGetClient: inputKinds.stats,
	userGetProfile: inputKinds.empty,
	userGetAccount: inputKinds.empty,
	userGetCredits: inputKinds.empty,
	userGetUsername: inputKinds.empty,
	userGetEmail: inputKinds.empty,
	userGetScopes: inputKinds.empty,
	apiKeysCreate: inputKinds.apiKeyCreate,
	apiKeysGetAll: inputKinds.limit,
	apiKeysGet: inputKinds.id,
	apiKeysUpdate: inputKinds.apiKeyUpdate,
	apiKeysRemove: inputKinds.id,
} as const;

export const SendGridEndpointOutputSchemas = {
	mailSend: outputKinds.mailSend,
	mailCreateBatchId: outputKinds.obj,
	mailValidateBatchId: outputKinds.obj,
	mailCancelScheduledSend: outputKinds.obj,
	mailListScheduledSends: outputKinds.arr,
	mailGetScheduledSend: outputKinds.arr,
	mailUpdateScheduledSend: outputKinds.empty,
	mailDeleteScheduledSend: outputKinds.empty,
	contactsAddOrUpdate: outputKinds.job,
	contactsGet: outputKinds.obj,
	contactsSearch: outputKinds.obj,
	contactsSearchEmails: outputKinds.obj,
	contactsRemove: outputKinds.job,
	contactsGetCount: outputKinds.obj,
	contactsGetSample: outputKinds.obj,
	contactsImport: outputKinds.obj,
	contactsImportStatus: outputKinds.obj,
	contactsExport: outputKinds.obj,
	contactsExportStatus: outputKinds.obj,
	contactsListExports: outputKinds.obj,
	listsGetAll: outputKinds.listsGetAll,
	listsCreate: outputKinds.list,
	listsGet: outputKinds.obj,
	listsUpdate: outputKinds.list,
	listsRemove: outputKinds.empty,
	listsGetContactCount: outputKinds.obj,
	listsRemoveContacts: outputKinds.job,
	segmentsCreate: outputKinds.obj,
	segmentsGetAll: outputKinds.obj,
	segmentsGet: outputKinds.obj,
	segmentsUpdate: outputKinds.obj,
	segmentsRemove: outputKinds.empty,
	segmentsRefresh: outputKinds.obj,
	fieldsGetAll: outputKinds.obj,
	fieldsCreate: outputKinds.obj,
	fieldsUpdate: outputKinds.obj,
	fieldsRemove: outputKinds.empty,
	sendersGetAll: outputKinds.sendersGetAll,
	sendersCreate: outputKinds.obj,
	sendersUpdate: outputKinds.obj,
	sendersRemove: outputKinds.empty,
	sendersResend: outputKinds.empty,
	sendersListIdentities: outputKinds.obj,
	sendersCreateIdentity: outputKinds.obj,
	sendersGetIdentity: outputKinds.obj,
	templatesCreate: outputKinds.obj,
	templatesGetAll: outputKinds.obj,
	templatesGet: outputKinds.obj,
	templatesUpdate: outputKinds.obj,
	templatesRemove: outputKinds.empty,
	templatesCreateVersion: outputKinds.obj,
	templatesGetVersion: outputKinds.obj,
	templatesUpdateVersion: outputKinds.obj,
	templatesRemoveVersion: outputKinds.empty,
	templatesActivateVersion: outputKinds.obj,
	suppressionsGetBounces: outputKinds.bounces,
	suppressionsGetBounce: outputKinds.arr,
	suppressionsDeleteBounce: outputKinds.empty,
	suppressionsDeleteBounces: outputKinds.empty,
	suppressionsGetBlocks: outputKinds.results,
	suppressionsGetBlock: outputKinds.arr,
	suppressionsDeleteBlock: outputKinds.empty,
	suppressionsDeleteBlocks: outputKinds.empty,
	suppressionsGetSpamReports: outputKinds.results,
	suppressionsGetSpamReport: outputKinds.arr,
	suppressionsDeleteSpamReport: outputKinds.empty,
	suppressionsDeleteSpamReports: outputKinds.empty,
	suppressionsGetInvalidEmails: outputKinds.results,
	suppressionsGetInvalidEmail: outputKinds.arr,
	suppressionsDeleteInvalidEmail: outputKinds.empty,
	suppressionsDeleteInvalidEmails: outputKinds.empty,
	suppressionsGetGlobalUnsubscribes: outputKinds.results,
	suppressionsAddGlobalUnsubscribes: outputKinds.obj,
	suppressionsGetGlobalUnsubscribe: outputKinds.obj,
	suppressionsDeleteGlobalUnsubscribe: outputKinds.empty,
	asmGetGroups: outputKinds.arr,
	asmCreateGroup: outputKinds.obj,
	asmGetGroup: outputKinds.obj,
	asmUpdateGroup: outputKinds.obj,
	asmDeleteGroup: outputKinds.empty,
	asmAddGroupSuppressions: outputKinds.obj,
	asmGetGroupSuppressions: outputKinds.arr,
	asmDeleteGroupSuppression: outputKinds.empty,
	statsGetGlobal: outputKinds.arr,
	statsGetCategory: outputKinds.arr,
	statsGetMailboxProvider: outputKinds.arr,
	statsGetGeo: outputKinds.arr,
	statsGetDevice: outputKinds.arr,
	statsGetClient: outputKinds.arr,
	userGetProfile: outputKinds.obj,
	userGetAccount: outputKinds.obj,
	userGetCredits: outputKinds.obj,
	userGetUsername: outputKinds.obj,
	userGetEmail: outputKinds.obj,
	userGetScopes: outputKinds.obj,
	apiKeysCreate: outputKinds.obj,
	apiKeysGetAll: outputKinds.obj,
	apiKeysGet: outputKinds.obj,
	apiKeysUpdate: outputKinds.obj,
	apiKeysRemove: outputKinds.empty,
} as const;

export type SendGridEndpointInputs = {
	[K in keyof typeof SendGridEndpointInputSchemas]: z.infer<
		(typeof SendGridEndpointInputSchemas)[K]
	>;
};

export type SendGridEndpointOutputs = {
	[K in keyof typeof SendGridEndpointOutputSchemas]: z.infer<
		(typeof SendGridEndpointOutputSchemas)[K]
	>;
};

export type MailSendInput = SendGridEndpointInputs['mailSend'];
export type MailSendOutput = SendGridEndpointOutputs['mailSend'];
export type ContactsAddOrUpdateInput =
	SendGridEndpointInputs['contactsAddOrUpdate'];
export type ContactsAddOrUpdateOutput =
	SendGridEndpointOutputs['contactsAddOrUpdate'];
export type ListsGetAllInput = SendGridEndpointInputs['listsGetAll'];
export type ListsGetAllOutput = SendGridEndpointOutputs['listsGetAll'];
export type ListsCreateInput = SendGridEndpointInputs['listsCreate'];
export type ListsCreateOutput = SendGridEndpointOutputs['listsCreate'];
export type SuppressionsGetBouncesInput =
	SendGridEndpointInputs['suppressionsGetBounces'];
export type SuppressionsGetBouncesOutput =
	SendGridEndpointOutputs['suppressionsGetBounces'];
export type SendersGetAllInput = SendGridEndpointInputs['sendersGetAll'];
export type SendersGetAllOutput = SendGridEndpointOutputs['sendersGetAll'];
