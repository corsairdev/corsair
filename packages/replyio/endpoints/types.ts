import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

const PositiveIntSchema = z.number().int().positive();

const PaginationInputSchema = z.object({
	top: z.number().int().min(1).max(1000).optional(),
	skip: z.number().int().min(0).optional(),
});

const SequenceIdInputSchema = z.object({
	sequenceId: PositiveIntSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────────────────────────────────────────

const CompanySizeInputSchema = z.enum([
	'Empty',
	'SelfEmployed',
	'Ten',
	'Fifty',
	'TwoHundred',
	'FiveHundred',
	'OneThousand',
	'FiveThousand',
	'TenThousand',
	'OverTenThousand',
]);

const PhoneStatusSchema = z.enum([
	'pending',
	'invalid',
	'valid',
	'validationFailed',
	'notValidated',
]);

const CallStatusSchema = z.enum(['none', 'toCall', 'called']);

const MeetingStatusSchema = z.enum(['none', 'meetingBooked']);

const ContactCustomFieldResponseSchema = z.object({
	key: z.string(),
	value: z.string().nullable().optional(),
});

const ContactSchema = z.object({
	id: z.number().int(),
	email: z.string().email().nullable().optional(),
	domain: z.string().nullable().optional(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	company: z.string().nullable().optional(),
	companySize: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	timeZoneId: z.string().nullable().optional(),
	linkedInUrl: z.string().nullable().optional(),
	linkedInSalesNavigatorUrl: z.string().nullable().optional(),
	linkedInRecruiterUrl: z.string().nullable().optional(),
	phoneStatus: PhoneStatusSchema.nullable().optional(),
	notes: z.string().nullable().optional(),
	ownerUserId: z.number().int().nullable().optional(),
	accountId: z.number().int().nullable().optional(),
	isOptedOut: z.boolean().optional(),
	callStatus: CallStatusSchema.nullable().optional(),
	meetingStatus: MeetingStatusSchema.nullable().optional(),
	addingDate: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	lastModifiedAt: z.string().nullable().optional(),
	customFields: z.array(ContactCustomFieldResponseSchema).optional(),
});

const ContactListResponseSchema = z.object({
	items: z.array(ContactSchema),
	hasMore: z.boolean(),
});

// POST /v3/contacts — every field optional, but at least an email or a
// LinkedIn URL is required to identify the contact.
const ContactsCreateInputSchema = z
	.object({
		email: z.string().email().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		phone: z.string().optional(),
		phone2: z.string().optional(),
		title: z.string().optional(),
		company: z.string().optional(),
		companySize: CompanySizeInputSchema.optional(),
		industry: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		timeZoneId: z.string().optional(),
		linkedInUrl: z.string().url().optional(),
		linkedInSalesNavigatorUrl: z.string().url().optional(),
		linkedInRecruiterUrl: z.string().url().optional(),
		notes: z.string().optional(),
		accountId: z.number().int().nullable().optional(),
		customFields: z
			.array(
				z.object({
					key: z.string(),
					value: z.string().optional(),
				}),
			)
			.optional(),
	})
	.refine(
		(value) => value.email !== undefined || value.linkedInUrl !== undefined,
		{ message: 'Either email or linkedInUrl must be provided' },
	);

const ContactIdInputSchema = z.object({
	id: PositiveIntSchema,
});

// PATCH /v3/contacts/{id} — omitted fields are kept, null clears the field.
const ContactsUpdateInputSchema = z.object({
	id: PositiveIntSchema,
	email: z.string().email().optional(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	phone2: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	company: z.string().nullable().optional(),
	companySize: CompanySizeInputSchema.nullable().optional(),
	industry: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	timeZoneId: z.string().nullable().optional(),
	linkedInUrl: z.string().url().nullable().optional(),
	linkedInSalesNavigatorUrl: z.string().url().nullable().optional(),
	linkedInRecruiterUrl: z.string().url().nullable().optional(),
	notes: z.string().nullable().optional(),
	accountId: z.number().int().nullable().optional(),
	isOptedOut: z.boolean().nullable().optional(),
	callStatus: CallStatusSchema.nullable().optional(),
	meetingStatus: MeetingStatusSchema.nullable().optional(),
	ownerUserId: z.number().int().nullable().optional(),
	customFields: z
		.array(
			z.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				value: z.string().nullable().optional(),
			}),
		)
		.optional(),
});

const DeleteResponseSchema = z.object({
	success: z.literal(true),
});

const ContactsListInputSchema = PaginationInputSchema.extend({
	email: z.string().email().optional(),
	linkedIn: z.string().url().optional(),
}).optional();

const ContactsSearchByEmailInputSchema = z.object({
	email: z.string().email(),
	top: z.number().int().min(1).max(1000).optional(),
	skip: z.number().int().min(0).optional(),
});

const StatusInSequenceSchema = z.enum([
	'active',
	'paused',
	'inactive',
	'invalidEmail',
	'outOfOffice',
	'finished',
	'contacted',
	'opened',
	'clicked',
	'autoReplied',
	'bounced',
	'replied',
]);

const ContactStatusResponseSchema = z.object({
	contactId: z.number().int(),
	isOptedOut: z.boolean(),
	callStatus: CallStatusSchema,
	meetingStatus: MeetingStatusSchema,
	sequences: z.array(
		z.object({
			sequenceId: z.number().int(),
			sequenceName: z.string(),
			statusInSequence: StatusInSequenceSchema,
			emailDisposition: z.object({
				isReplied: z.boolean(),
				isBounced: z.boolean(),
			}),
		}),
	),
});

// POST /v3/contacts/set-status-in-sequence — replied/bounced use dedicated
// endpoints; only active/paused/finished/outOfOffice are accepted here.
const ContactsSetStatusInputSchema = z.object({
	contactIds: z.array(PositiveIntSchema).min(1).max(100),
	statusInSequence: z.enum(['active', 'paused', 'finished', 'outOfOffice']),
});

// Non-atomic result keyed by contact id: absent keys succeeded, present keys
// carry the per-contact error. An empty object means all succeeded.
const NonAtomicContactResultSchema = z.record(
	z.string(),
	z.object({
		error: z.string(),
		errorDetails: z.string().optional(),
	}),
);

// POST /v3/contacts/set-opted-out with isOptedOut=false,
// POST /v3/contacts/set-replied with isReplied=false, and
// POST /v3/contacts/set-bounced with isBounced=false all clear the
// respective flag (verified live against the Reply API). `statuses` selects
// which clearable statuses to remove; by default all three are cleared.
const ClearableStatusSchema = z.enum(['optedOut', 'replied', 'bounced']);

const ContactsClearStatusInputSchema = z.object({
	contactIds: z.array(PositiveIntSchema).min(1).max(100),
	statuses: z
		.array(ClearableStatusSchema)
		.min(1)
		.refine((statuses) => new Set(statuses).size === statuses.length, {
			message: 'statuses must not contain duplicates',
		})
		.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Sequences
// ─────────────────────────────────────────────────────────────────────────────

const SequenceStatusSchema = z.enum(['new', 'active', 'paused']);

const SequenceHealthSchema = z.enum([
	'healthy',
	'stalled',
	'degraded',
	'blocked',
]);

const SequencesListInputSchema = PaginationInputSchema.extend({
	status: z.enum(['active', 'paused', 'new']).optional(),
	ownerUserId: z.number().int().optional(),
	folderId: z.string().uuid().optional(),
	isArchived: z.boolean().optional(),
	name: z.string().optional(),
	createdAfter: z.string().optional(),
	sortBy: z.enum(['created', 'name', 'status']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
}).optional();

const SequenceListItemSchema = z.object({
	id: z.number().int(),
	ownerUserId: z.number().int().nullable().optional(),
	name: z.string(),
	created: z.string().nullable().optional(),
	status: SequenceStatusSchema,
	isArchived: z.boolean(),
	health: SequenceHealthSchema.nullable().optional(),
});

const SequencesListResponseSchema = z.object({
	items: z.array(SequenceListItemSchema),
	hasMore: z.boolean(),
});

const SequenceDetailSchema = SequenceListItemSchema.extend({
	scheduleId: z.number().int().nullable().optional(),
	emailAccounts: z
		.array(
			z.object({
				id: z.number().int(),
				email: z.string().email(),
			}),
		)
		.optional(),
	linkedInAccounts: z
		.array(
			z.object({
				id: z.number().int(),
				name: z.string().nullable().optional(),
				profileUrl: z.string().nullable().optional(),
				status: z.string().nullable().optional(),
			}),
		)
		.optional(),
	settings: z.object({}).loose().nullable().optional(),
	steps: z
		.array(
			z
				.object({
					id: z.number().int().optional(),
					type: z.string().optional(),
				})
				.loose(),
		)
		.optional(),
}).loose();

// ─────────────────────────────────────────────────────────────────────────────
// Sequence steps
// ─────────────────────────────────────────────────────────────────────────────

const StepTypeSchema = z.enum([
	'email',
	'linkedIn',
	'call',
	'sms',
	'whatsApp',
	'zapier',
	'task',
	'condition',
]);

const LinkedInActionTypeSchema = z.enum([
	'message',
	'connect',
	'inMail',
	'viewProfile',
	'endorseSkills',
	'voiceMessage',
	'likeRecentPosts',
	'followProfile',
	'commentOnRecentPost',
]);

const EmailStepInputSchema = z
	.object({
		type: z.literal('email'),
		delayInMinutes: z.number().int().min(0),
		executionMode: z.enum(['automatic', 'manual']),
		variants: z
			.array(
				z.object({
					subject: z.string().optional(),
					message: z.string().optional(),
					attachmentIds: z.array(z.number().int()).max(3).optional(),
				}),
			)
			.min(1),
	})
	.loose();

const LinkedInStepInputSchema = z
	.object({
		type: z.literal('linkedIn'),
		actionType: LinkedInActionTypeSchema,
		delayInMinutes: z.number().int().min(0),
	})
	.loose();

const CallStepInputSchema = z
	.object({
		type: z.literal('call'),
		delayInMinutes: z.number().int().min(0),
	})
	.loose();

const SmsStepInputSchema = z
	.object({
		type: z.literal('sms'),
		delayInMinutes: z.number().int().min(0),
		executionMode: z.enum(['automatic', 'manual']),
		message: z.string(),
	})
	.loose();

const WhatsAppStepInputSchema = z
	.object({
		type: z.literal('whatsApp'),
		delayInMinutes: z.number().int().min(0),
		message: z.string(),
	})
	.loose();

const ZapierStepInputSchema = z
	.object({
		type: z.literal('zapier'),
		delayInMinutes: z.number().int().min(0),
		name: z.string(),
		action: z.enum(['immediately', 'wait']),
	})
	.loose();

const TaskStepInputSchema = z
	.object({
		type: z.literal('task'),
		delayInMinutes: z.number().int().min(0),
		actionType: z.enum(['toDo', 'meeting']),
		description: z.string(),
	})
	.loose();

const ConditionStepInputSchema = z
	.object({
		type: z.literal('condition'),
		delayInMinutes: z.number().int().min(0),
		waitInMinutes: z.number().int().min(0),
		conditions: z.array(
			z.object({
				property: z.string(),
				rules: z.array(
					z.object({
						operator: z.string(),
						value: z.string(),
					}),
				),
			}),
		),
	})
	.loose();

const SequenceStepInputSchema = z.discriminatedUnion('type', [
	EmailStepInputSchema,
	LinkedInStepInputSchema,
	CallStepInputSchema,
	SmsStepInputSchema,
	WhatsAppStepInputSchema,
	ZapierStepInputSchema,
	TaskStepInputSchema,
	ConditionStepInputSchema,
]);

const StepsCreateInputSchema = SequenceIdInputSchema.extend({
	step: SequenceStepInputSchema,
});

// The step payload varies by type (and by LinkedIn actionType); responses
// always carry at least the numeric id and the step type discriminator.
const SequenceStepResponseSchema = z
	.object({
		id: z.number().int(),
		type: StepTypeSchema,
		parentId: z.number().int().nullable().optional(),
		ifConditionPositive: z.boolean().nullable().optional(),
		delayInMinutes: z.number().int().nullable().optional(),
	})
	.loose();

const StepsListResponseSchema = z.array(SequenceStepResponseSchema);

const StepIdInputSchema = SequenceIdInputSchema.extend({
	stepId: PositiveIntSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Sequence contacts
// ─────────────────────────────────────────────────────────────────────────────

const SequenceContactsAddInputSchema = SequenceIdInputSchema.extend({
	contactIds: z.array(PositiveIntSchema).min(1).max(10000),
	removeFromExisting: z.boolean().optional(),
	startStepId: z.number().int().nullable().optional(),
	ignoreStepDelay: z.boolean().optional(),
	startFrom: z.string().nullable().optional(),
});

const SequenceContactsAddResponseSchema = z.object({
	added: z.array(z.number().int()),
	notProcessed: z.record(
		z.string(),
		z.object({
			error: z.enum([
				'invalidInput',
				'contactLimitExceeded',
				'contactAlreadyInSequence',
				'contactNotFound',
				'forbidden',
			]),
			errorDetails: z.string().optional(),
		}),
	),
});

const SequenceContactRemoveInputSchema = SequenceIdInputSchema.extend({
	contactId: PositiveIntSchema,
});

const SequenceContactsBulkRemoveInputSchema = SequenceIdInputSchema.extend({
	contactIds: z
		.array(PositiveIntSchema)
		.min(1)
		.refine((ids) => new Set(ids).size === ids.length, {
			message: 'contactIds must not contain duplicates',
		}),
});

const SequenceContactsBulkRemoveResponseSchema = z.object({
	requested: z.number().int(),
	removed: z.number().int(),
	notFound: z.number().int(),
	notInSequence: z.number().int(),
	removedIds: z.array(z.number().int()),
});

// GET /v3/sequences/{id}/contacts/state — extra columns are opt-in via
// additionalColumns; top is capped at 100 by the provider.
const SequenceContactsListExtendedInputSchema = SequenceIdInputSchema.extend({
	top: z.number().int().min(1).max(100).optional(),
	skip: z.number().int().min(0).optional(),
	additionalColumns: z
		.array(z.enum(['CurrentStep', 'LastStepCompletedAt', 'Status']))
		.optional(),
});

const SequenceContactExtendedSchema = z.object({
	contactId: z.number().int(),
	email: z.string().email().nullable().optional(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	addedAt: z.string().nullable().optional(),
	currentStep: z
		.object({
			stepId: z.number().int(),
			displayStepNumber: z.string().nullable().optional(),
			stepNumber: z.number().int().nullable().optional(),
		})
		.nullable()
		.optional(),
	lastStepCompletedAt: z.string().nullable().optional(),
	status: z
		.object({
			status: z.string(),
			replied: z.boolean().optional(),
			delivered: z.boolean().optional(),
			bounced: z.boolean().optional(),
			opened: z.boolean().optional(),
			clicked: z.boolean().optional(),
		})
		.nullable()
		.optional(),
});

const SequenceContactsListExtendedResponseSchema = z.object({
	items: z.array(SequenceContactExtendedSchema),
	hasMore: z.boolean(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Email accounts
// ─────────────────────────────────────────────────────────────────────────────

const EmailAccountTypeSchema = z.enum([
	'custom',
	'gmail',
	'outlook',
	'exchange',
	'exchangeOnPremise',
]);

const ConnectionStatusSchema = z.enum(['unknown', 'connected', 'disconnected']);

const EmailAccountListItemSchema = z.object({
	id: z.number().int(),
	ownerUserId: z.number().int().nullable().optional(),
	email: z.string().email(),
	senderName: z.string().nullable().optional(),
	emailAccountType: EmailAccountTypeSchema,
	isDefault: z.boolean().optional(),
	dailyLimit: z.number().int().nullable().optional(),
	connectionStatus: ConnectionStatusSchema,
	tags: z.array(z.string()).optional(),
});

const EmailAccountsListResponseSchema = z.object({
	items: z.array(EmailAccountListItemSchema),
	hasMore: z.boolean(),
});

const EmailAccountsListInputSchema = PaginationInputSchema.extend({
	my: z.boolean().optional(),
}).optional();

// POST /v3/email-accounts/filter — used here to surface accounts whose
// connection broke (status=disconnected) so they can be troubleshot.
const EmailAccountsListDisconnectedInputSchema =
	PaginationInputSchema.optional();

const EmailAccountIdInputSchema = z.object({
	id: PositiveIntSchema,
});

// PATCH /v3/email-accounts/{id} — only included sections are updated;
// connection settings apply to Custom accounts only.
const EmailAccountsUpdateInputSchema = z.object({
	id: PositiveIntSchema,
	connection: z
		.object({
			email: z.string().email().optional(),
			senderName: z.string().optional(),
			smtpHost: z.string().optional(),
			smtpPort: z.number().int().optional(),
			smtpPassword: z.string().optional(),
			smtpSsl: z.boolean().optional(),
			imapHost: z.string().optional(),
			imapPort: z.number().int().optional(),
			imapPassword: z.string().optional(),
			imapSsl: z.boolean().optional(),
		})
		.loose()
		.optional(),
	safety: z
		.object({
			dailyLimit: z.number().int().optional(),
			isEmailsThrottlingEnabled: z.boolean().optional(),
			emailsPerInterval: z.number().int().optional(),
			emailsThrottlingSecondsInterval: z.number().int().optional(),
			isSendingDelayEnabled: z.boolean().optional(),
			maxSendingDelaySeconds: z.number().int().optional(),
			minSendingDelaySeconds: z.number().int().optional(),
		})
		.loose()
		.optional(),
	signature: z.object({ signature: z.string().optional() }).loose().optional(),
	optOut: z
		.object({
			message: z.string().optional(),
			emailFooter: z.string().optional(),
			isOptOutLinkEnabled: z.boolean().optional(),
			optOutTextBlock: z.string().optional(),
		})
		.loose()
		.optional(),
	rampUp: z
		.object({
			enabled: z.boolean().optional(),
			startValue: z.number().int().optional(),
			incrementValue: z.number().int().optional(),
		})
		.loose()
		.optional(),
	tags: z.array(z.string()).optional(),
});

const EmailAccountDetailSchema = EmailAccountListItemSchema.extend({
	isInUse: z.boolean().nullable().optional(),
	sendingConnectivityError: z.string().nullable().optional(),
	receivingConnectivityError: z.string().nullable().optional(),
	sendingLockedByProvider: z.boolean().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
}).loose();

const EmptyInputSchema = z.object({});

// GET /v3/email-accounts/connect/{gmail,office-365} answers with a 302 to the
// provider consent screen, which a server-side client must not follow and
// consume. The tool therefore returns the provider connect URL for the user
// to open in a browser instead of performing the redirect itself.
const EmailAccountsConnectGmailResponseSchema = z.object({
	url: z.string().url(),
	provider: z.literal('gmail'),
});

const EmailAccountsConnectOffice365ResponseSchema = z.object({
	url: z.string().url(),
	provider: z.literal('office-365'),
});

// ─────────────────────────────────────────────────────────────────────────────
// Schedules
// ─────────────────────────────────────────────────────────────────────────────

const ScheduleIdInputSchema = z.object({
	id: PositiveIntSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────

const CurrentUserResponseSchema = z.object({
	userId: z.number().int(),
	username: z.string(),
	teamId: z.number().int(),
});

const TeamUserSchema = z.object({
	teamId: z.number().int(),
	teamName: z.string(),
	userId: z.number().int(),
	userName: z.string(),
	userEmail: z.string().email(),
});

const TeamUsersResponseSchema = z.array(TeamUserSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Contact lists
// ─────────────────────────────────────────────────────────────────────────────

const ContactListsListInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
}).optional();

const ContactListsListResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.number().int(),
			name: z.string(),
			isShared: z.boolean(),
		}),
	),
	hasMore: z.boolean(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const ReplyioEndpointInputSchemas = {
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactIdInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactIdInputSchema,
	contactsList: ContactsListInputSchema,
	contactsSearchByEmail: ContactsSearchByEmailInputSchema,
	contactsGetStatus: ContactIdInputSchema,
	contactsSetStatus: ContactsSetStatusInputSchema,
	contactsClearStatus: ContactsClearStatusInputSchema,
	sequencesList: SequencesListInputSchema,
	sequencesGet: SequenceIdInputSchema,
	sequencesDelete: SequenceIdInputSchema,
	sequencesStart: SequenceIdInputSchema,
	sequencesPause: SequenceIdInputSchema,
	sequencesArchive: SequenceIdInputSchema,
	stepsList: SequenceIdInputSchema,
	stepsGet: StepIdInputSchema,
	stepsCreate: StepsCreateInputSchema,
	sequenceContactsAdd: SequenceContactsAddInputSchema,
	sequenceContactsRemove: SequenceContactRemoveInputSchema,
	sequenceContactsBulkRemove: SequenceContactsBulkRemoveInputSchema,
	sequenceContactsListExtended: SequenceContactsListExtendedInputSchema,
	emailAccountsList: EmailAccountsListInputSchema,
	emailAccountsListDisconnected: EmailAccountsListDisconnectedInputSchema,
	emailAccountsUpdate: EmailAccountsUpdateInputSchema,
	emailAccountsDelete: EmailAccountIdInputSchema,
	emailAccountsConnectGmail: EmptyInputSchema,
	emailAccountsConnectOffice365: EmptyInputSchema,
	schedulesDelete: ScheduleIdInputSchema,
	usersGetCurrent: EmptyInputSchema,
	usersListTeam: EmptyInputSchema,
	contactListsList: ContactListsListInputSchema,
} as const;

export type ReplyioEndpointInputs = {
	[K in keyof typeof ReplyioEndpointInputSchemas]: z.infer<
		(typeof ReplyioEndpointInputSchemas)[K]
	>;
};

export const ReplyioEndpointOutputSchemas = {
	contactsCreate: ContactSchema,
	contactsGet: ContactSchema,
	contactsUpdate: ContactSchema,
	contactsDelete: DeleteResponseSchema,
	contactsList: ContactListResponseSchema,
	contactsSearchByEmail: ContactListResponseSchema,
	contactsGetStatus: ContactStatusResponseSchema,
	contactsSetStatus: NonAtomicContactResultSchema,
	contactsClearStatus: NonAtomicContactResultSchema,
	sequencesList: SequencesListResponseSchema,
	sequencesGet: SequenceDetailSchema,
	sequencesDelete: DeleteResponseSchema,
	sequencesStart: SequenceDetailSchema,
	sequencesPause: SequenceDetailSchema,
	sequencesArchive: SequenceDetailSchema,
	stepsList: StepsListResponseSchema,
	stepsGet: SequenceStepResponseSchema,
	stepsCreate: SequenceStepResponseSchema,
	sequenceContactsAdd: SequenceContactsAddResponseSchema,
	sequenceContactsRemove: DeleteResponseSchema,
	sequenceContactsBulkRemove: SequenceContactsBulkRemoveResponseSchema,
	sequenceContactsListExtended: SequenceContactsListExtendedResponseSchema,
	emailAccountsList: EmailAccountsListResponseSchema,
	emailAccountsListDisconnected: EmailAccountsListResponseSchema,
	emailAccountsUpdate: EmailAccountDetailSchema,
	emailAccountsDelete: DeleteResponseSchema,
	emailAccountsConnectGmail: EmailAccountsConnectGmailResponseSchema,
	emailAccountsConnectOffice365: EmailAccountsConnectOffice365ResponseSchema,
	schedulesDelete: DeleteResponseSchema,
	usersGetCurrent: CurrentUserResponseSchema,
	usersListTeam: TeamUsersResponseSchema,
	contactListsList: ContactListsListResponseSchema,
} as const;

export type ReplyioEndpointOutputs = {
	[K in keyof typeof ReplyioEndpointOutputSchemas]: z.infer<
		(typeof ReplyioEndpointOutputSchemas)[K]
	>;
};

export type Contact = z.infer<typeof ContactSchema>;
export type ContactStatus = z.infer<typeof ContactStatusResponseSchema>;
export type SequenceListItem = z.infer<typeof SequenceListItemSchema>;
export type SequenceDetail = z.infer<typeof SequenceDetailSchema>;
export type SequenceStep = z.infer<typeof SequenceStepResponseSchema>;
export type SequenceContactExtended = z.infer<
	typeof SequenceContactExtendedSchema
>;
export type EmailAccountListItem = z.infer<typeof EmailAccountListItemSchema>;
export type EmailAccountDetail = z.infer<typeof EmailAccountDetailSchema>;
export type CurrentUser = z.infer<typeof CurrentUserResponseSchema>;
export type TeamUser = z.infer<typeof TeamUserSchema>;
