import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const RecipientSchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
	})
	.passthrough();

const EmailAddressSchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
	})
	.passthrough();

const BodySchema = z
	.object({
		contentType: z.string().optional(),
		content: z.string().optional(),
	})
	.passthrough();

const DateTimeTimeZoneSchema = z
	.object({
		dateTime: z.string(),
		timeZone: z.string(),
	})
	.passthrough();

const LocationSchema = z
	.object({
		displayName: z.string().optional(),
		// Graph returns a physicalAddress object with highly variable regional sub-fields
		address: z.record(z.unknown()).optional(),
	})
	.passthrough();

const AttendeeSchema = z
	.object({
		type: z.string().optional(),
		// status contains { response: string, time: string } — kept loose to avoid version-drift
		status: z.record(z.unknown()).optional(),
		emailAddress: EmailAddressSchema.optional(),
	})
	.passthrough();

const OnlineMeetingSchema = z
	.object({
		joinUrl: z.string().optional(),
		conferenceId: z.string().optional(),
		tollNumber: z.string().optional(),
	})
	.passthrough()
	.nullable()
	.optional();

const MessageSchema = z
	.object({
		id: z.string().optional(),
		subject: z.string().optional(),
		body: BodySchema.optional(),
		bodyPreview: z.string().optional(),
		from: RecipientSchema.optional(),
		sender: RecipientSchema.optional(),
		toRecipients: z.array(RecipientSchema).optional(),
		ccRecipients: z.array(RecipientSchema).optional(),
		bccRecipients: z.array(RecipientSchema).optional(),
		replyTo: z.array(RecipientSchema).optional(),
		isRead: z.boolean().optional(),
		isDraft: z.boolean().optional(),
		hasAttachments: z.boolean().optional(),
		importance: z.string().optional(),
		conversationId: z.string().optional(),
		parentFolderId: z.string().optional(),
		sentDateTime: z.string().optional(),
		receivedDateTime: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		webLink: z.string().optional(),
		changeKey: z.string().optional(),
		categories: z.array(z.string()).optional(),
		// flag contains { flagStatus, completedDateTime, dueDateTime, startDateTime } sub-fields
		flag: z.record(z.unknown()).optional(),
		internetMessageId: z.string().optional(),
		conversationIndex: z.string().optional(),
		inferenceClassification: z.string().optional(),
		isReadReceiptRequested: z.boolean().nullable().optional(),
		isDeliveryReceiptRequested: z.boolean().nullable().optional(),
	})
	.passthrough();

const EventSchema = z
	.object({
		id: z.string().optional(),
		subject: z.string().optional(),
		body: BodySchema.optional(),
		bodyPreview: z.string().optional(),
		start: DateTimeTimeZoneSchema.optional(),
		end: DateTimeTimeZoneSchema.optional(),
		location: LocationSchema.optional(),
		locations: z.array(LocationSchema).optional(),
		attendees: z.array(AttendeeSchema).optional(),
		organizer: RecipientSchema.optional(),
		isAllDay: z.boolean().optional(),
		isCancelled: z.boolean().optional(),
		isOrganizer: z.boolean().optional(),
		isDraft: z.boolean().optional(),
		isOnlineMeeting: z.boolean().optional(),
		isReminderOn: z.boolean().optional(),
		showAs: z.string().optional(),
		importance: z.string().optional(),
		sensitivity: z.string().optional(),
		type: z.string().optional(),
		iCalUId: z.string().optional(),
		webLink: z.string().optional(),
		changeKey: z.string().optional(),
		categories: z.array(z.string()).optional(),
		// recurrence holds { pattern: {...}, range: {...} } — deep schema varies by recurrence type
		recurrence: z.record(z.unknown()).nullable().optional(),
		// responseStatus holds { response: string, time: string } — kept loose to avoid version-drift
		responseStatus: z.record(z.unknown()).optional(),
		responseRequested: z.boolean().optional(),
		seriesMasterId: z.string().nullable().optional(),
		transactionId: z.string().nullable().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		onlineMeeting: OnlineMeetingSchema,
		onlineMeetingProvider: z.string().optional(),
		onlineMeetingUrl: z.string().nullable().optional(),
		reminderMinutesBeforeStart: z.number().optional(),
		allowNewTimeProposals: z.boolean().optional(),
		hasAttachments: z.boolean().optional(),
		hideAttendees: z.boolean().optional(),
	})
	.passthrough();

const CalendarSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		color: z.string().optional(),
		hexColor: z.string().optional(),
		isDefaultCalendar: z.boolean().optional(),
		canEdit: z.boolean().optional(),
		canShare: z.boolean().optional(),
		canViewPrivateItems: z.boolean().optional(),
		isRemovable: z.boolean().optional(),
		isTallyingResponses: z.boolean().optional(),
		owner: RecipientSchema.optional(),
		changeKey: z.string().optional(),
		allowedOnlineMeetingProviders: z.array(z.string()).optional(),
		defaultOnlineMeetingProvider: z.string().optional(),
	})
	.passthrough();

const ContactSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		givenName: z.string().optional(),
		surname: z.string().optional(),
		middleName: z.string().nullable().optional(),
		nickName: z.string().nullable().optional(),
		emailAddresses: z.array(EmailAddressSchema).optional(),
		mobilePhone: z.string().nullable().optional(),
		homePhones: z.array(z.string()).optional(),
		businessPhones: z.array(z.string()).optional(),
		jobTitle: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		department: z.string().nullable().optional(),
		officeLocation: z.string().nullable().optional(),
		birthday: z.string().nullable().optional(),
		personalNotes: z.string().optional(),
		parentFolderId: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		changeKey: z.string().optional(),
		categories: z.array(z.string()).optional(),
	})
	.passthrough();

const MailFolderSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		parentFolderId: z.string().optional(),
		totalItemCount: z.number().optional(),
		unreadItemCount: z.number().optional(),
		childFolderCount: z.number().optional(),
		isHidden: z.boolean().optional(),
		sizeInBytes: z.number().optional(),
	})
	.passthrough();

const AttachmentSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		contentType: z.string().optional(),
		size: z.number().optional(),
		isInline: z.boolean().optional(),
		lastModifiedDateTime: z.string().optional(),
		'@odata.type': z.string().optional(),
		contentBytes: z.string().optional(),
		contentId: z.string().optional(),
		contentLocation: z.string().optional(),
	})
	.passthrough();

const BatchMoveResultSchema = z.object({
	original_message_id: z.string(),
	moved_message_id: z.string().optional(),
	success: z.boolean(),
	status: z.number().optional(),
	error_message: z.string().optional(),
});

const BatchUpdateResultSchema = z.object({
	message_id: z.string(),
	success: z.boolean(),
	status: z.number().optional(),
	error_message: z.string().optional(),
});

const MeetingSuggestionSchema = z
	.object({
		confidence: z.number().optional(),
		organizerAvailability: z.string().optional(),
		suggestionReason: z.string().optional(),
		meetingTimeSlot: z
			.object({
				start: DateTimeTimeZoneSchema.optional(),
				end: DateTimeTimeZoneSchema.optional(),
			})
			.optional(),
		attendeeAvailability: z
			.array(
				z.object({
					attendee: AttendeeSchema.optional(),
					availability: z.string().optional(),
				}),
			)
			.optional(),
		locations: z.array(LocationSchema).optional(),
	})
	.passthrough();

// ── Input Schemas ────────────────────────────────────────────────────────────

const MessagesSendInputSchema = z.object({
	to: z.string(),
	subject: z.string(),
	body: z.string(),
	user_id: z.string().optional(),
	to_name: z.string().optional(),
	is_html: z.boolean().optional(),
	cc_emails: z.array(z.string()).optional(),
	bcc_emails: z.array(z.string()).optional(),
	from_address: z.string().optional(),
	save_to_sent_items: z.boolean().optional(),
	attachment: z.record(z.unknown()).optional(),
});

const MessagesCreateDraftInputSchema = z.object({
	subject: z.string(),
	body: z.string(),
	is_html: z.boolean().optional(),
	to_recipients: z.array(z.string()).optional(),
	cc_recipients: z.array(z.string()).optional(),
	bcc_recipients: z.array(z.string()).optional(),
	attachment: z.record(z.unknown()).optional(),
});

const MessagesGetInputSchema = z.object({
	message_id: z.string(),
	user_id: z.string().optional(),
	select: z.array(z.string()).optional(),
});

const MessagesListInputSchema = z.object({
	user_id: z.string().optional(),
	folder: z.string().optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.array(z.string()).optional(),
	is_read: z.boolean().optional(),
	subject: z.string().optional(),
	subject_contains: z.string().optional(),
	subject_startswith: z.string().optional(),
	subject_endswith: z.string().optional(),
	from_address: z.string().optional(),
	has_attachments: z.boolean().optional(),
	importance: z.string().optional(),
	categories: z.array(z.string()).optional(),
	conversationId: z.string().optional(),
	sent_date_time_gt: z.string().optional(),
	sent_date_time_lt: z.string().optional(),
	received_date_time_ge: z.string().optional(),
	received_date_time_gt: z.string().optional(),
	received_date_time_le: z.string().optional(),
	received_date_time_lt: z.string().optional(),
});

const MessagesQueryInputSchema = z.object({
	user_id: z.string().optional(),
	folder: z.string().optional(),
	filter: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.string().optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
});

const MessagesSearchInputSchema = z.object({
	query: z.string().optional(),
	subject: z.string().optional(),
	fromEmail: z.string().optional(),
	hasAttachments: z.boolean().optional(),
	size: z.number().optional(),
	from_index: z.number().optional(),
	enable_top_results: z.boolean().optional(),
});

const MessagesReplyInputSchema = z.object({
	message_id: z.string(),
	comment: z.string(),
	user_id: z.string().optional(),
	cc_emails: z.array(z.string()).optional(),
	bcc_emails: z.array(z.string()).optional(),
});

const MessagesForwardInputSchema = z.object({
	message_id: z.string(),
	to_recipients: z.array(z.string()),
	comment: z.string().optional(),
	user_id: z.string().optional(),
});

const MessagesDeleteInputSchema = z.object({
	message_id: z.string(),
	user_id: z.string().optional(),
});

const MessagesMoveInputSchema = z.object({
	message_id: z.string(),
	destination_id: z.string(),
	user_id: z.string().optional(),
});

const MessagesUpdateInputSchema = z.object({
	message_id: z.string(),
	user_id: z.string().optional(),
	is_read: z.boolean().optional(),
	subject: z.string().optional(),
	importance: z.string().optional(),
	categories: z.array(z.string()).optional(),
	// Recipient/flag fields accept pre-formed Graph API objects passed through verbatim
	to_recipients: z.array(z.record(z.unknown())).optional(),
	cc_recipients: z.array(z.record(z.unknown())).optional(),
	bcc_recipients: z.array(z.record(z.unknown())).optional(),
	reply_to: z.array(z.record(z.unknown())).optional(),
	flag: z.record(z.unknown()).optional(),
	inference_classification: z.string().optional(),
	is_read_receipt_requested: z.boolean().optional(),
	is_delivery_receipt_requested: z.boolean().optional(),
});

const MessagesSendDraftInputSchema = z.object({
	message_id: z.string(),
	user_id: z.string().optional(),
});

const MessagesBatchMoveInputSchema = z.object({
	message_ids: z.array(z.string()),
	destination_id: z.string(),
	user_id: z.string().optional(),
});

const MessagesBatchUpdateInputSchema = z.object({
	updates: z.array(
		z.object({
			message_id: z.string(),
			// patch is an arbitrary PATCH body; callers construct it per the Graph API spec
			patch: z.record(z.unknown()),
		}),
	),
	user_id: z.string().optional(),
});

const MessagesAddAttachmentInputSchema = z.object({
	message_id: z.string(),
	name: z.string().optional(),
	user_id: z.string().optional(),
	odata_type: z.string().optional(),
	contentBytes: z.string().optional(),
	contentType: z.string().optional(),
	contentId: z.string().optional(),
	contentLocation: z.string().optional(),
	isInline: z.boolean().optional(),
	// item holds a pre-formed itemAttachment object passed through verbatim to Graph
	item: z.record(z.unknown()).optional(),
	attachment: z
		.object({
			name: z.string(),
			mimetype: z.string(),
			s3key: z.string(),
		})
		.optional(),
});

const EventsCreateInputSchema = z.object({
	subject: z.string(),
	start_datetime: z.string(),
	end_datetime: z.string(),
	time_zone: z.string(),
	user_id: z.string().optional(),
	calendar_id: z.string().optional(),
	body: z.string().optional(),
	is_html: z.boolean().optional(),
	location: z.string().optional(),
	attendees_info: z
		.array(
			z.object({
				email: z.string(),
				name: z.string().optional(),
				type: z.string().optional(),
			}),
		)
		.optional(),
	is_online_meeting: z.boolean().optional(),
	online_meeting_provider: z.string().optional(),
	show_as: z.string().optional(),
	categories: z.array(z.string()).optional(),
	importance: z.string().optional(),
});

const EventsGetInputSchema = z.object({
	event_id: z.string(),
	user_id: z.string().optional(),
	calendar_id: z.string().optional(),
});

const EventsListInputSchema = z.object({
	user_id: z.string().optional(),
	calendar_id: z.string().optional(),
	filter: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.array(z.string()).optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
	timezone: z.string().optional(),
	expand_recurring_events: z.boolean().optional(),
});

const EventsUpdateInputSchema = z.object({
	event_id: z.string(),
	user_id: z.string().optional(),
	subject: z.string().optional(),
	// body is a pre-formed { contentType, content } object or rich HTML body passed through verbatim
	body: z.record(z.unknown()).optional(),
	start_datetime: z.string().optional(),
	end_datetime: z.string().optional(),
	time_zone: z.string().optional(),
	location: z.string().optional(),
	// attendees are pre-formed Graph attendee objects passed through verbatim
	attendees: z.array(z.record(z.unknown())).optional(),
	show_as: z.string().optional(),
	categories: z.array(z.string()).optional(),
});

const EventsDeleteInputSchema = z.object({
	event_id: z.string(),
	user_id: z.string().optional(),
});

const EventsCancelInputSchema = z.object({
	event_id: z.string(),
	user_id: z.string(),
	calendar_id: z.string(),
	Comment: z.string().optional(),
});

const EventsDeclineInputSchema = z.object({
	event_id: z.string(),
	comment: z.string().optional(),
	user_id: z.string().optional(),
	sendResponse: z.boolean().optional(),
	// proposedNewTime holds { start: DateTimeTimeZone, end: DateTimeTimeZone } — passed through verbatim
	proposedNewTime: z.record(z.unknown()).optional(),
});

const EventsFindMeetingTimesInputSchema = z.object({
	user_id: z.string().optional(),
	// attendees/timeConstraint/locationConstraint are Graph API constraint objects passed through verbatim
	attendees: z.array(z.record(z.unknown())).optional(),
	timeConstraint: z.record(z.unknown()).optional(),
	locationConstraint: z.record(z.unknown()).optional(),
	meetingDuration: z.string().optional(),
	maxCandidates: z.number().optional(),
	isOrganizerOptional: z.boolean().optional(),
	returnSuggestionReasons: z.boolean().optional(),
	minimumAttendeePercentage: z.number().optional(),
	prefer_timezone: z.string().optional(),
});

const EventsGetScheduleInputSchema = z.object({
	calendar_id: z.string(),
	schedules: z.array(z.string()),
	startTime: z.object({ dateTime: z.string(), timeZone: z.string() }),
	endTime: z.object({ dateTime: z.string(), timeZone: z.string() }),
	availabilityViewInterval: z.number().optional(),
});

const CalendarsCreateInputSchema = z.object({
	name: z.string(),
	user_id: z.string().optional(),
	color: z.string().optional(),
	hexColor: z.string().optional(),
});

const CalendarsGetInputSchema = z.object({
	calendar_id: z.string(),
});

const CalendarsListInputSchema = z.object({
	user_id: z.string().optional(),
	filter: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.array(z.string()).optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
});

const CalendarsDeleteInputSchema = z.object({
	calendar_id: z.string(),
	user_id: z.string().optional(),
});

const ContactsCreateInputSchema = z.object({
	user_id: z.string().optional(),
	givenName: z.string().optional(),
	surname: z.string().optional(),
	displayName: z.string().optional(),
	emailAddresses: z
		.array(z.object({ address: z.string(), name: z.string().optional() }))
		.optional(),
	mobilePhone: z.string().optional(),
	homePhone: z.string().optional(),
	businessPhones: z.array(z.string()).optional(),
	jobTitle: z.string().optional(),
	companyName: z.string().optional(),
	department: z.string().optional(),
	officeLocation: z.string().optional(),
	birthday: z.string().optional(),
	notes: z.string().optional(),
	categories: z.array(z.string()).optional(),
});

const ContactsListInputSchema = z.object({
	user_id: z.string().optional(),
	contact_folder_id: z.string().optional(),
	filter: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.array(z.string()).optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
});

const ContactsUpdateInputSchema = z.object({
	contact_id: z.string(),
	user_id: z.string().optional(),
	givenName: z.string().optional(),
	surname: z.string().optional(),
	displayName: z.string().optional(),
	emailAddresses: z
		.array(z.object({ address: z.string(), name: z.string().optional() }))
		.optional(),
	mobilePhone: z.string().optional(),
	homePhones: z.array(z.string()).optional(),
	businessPhones: z.array(z.string()).optional(),
	jobTitle: z.string().optional(),
	companyName: z.string().optional(),
	department: z.string().optional(),
	officeLocation: z.string().optional(),
	birthday: z.string().optional(),
	notes: z.string().optional(),
	categories: z.array(z.string()).optional(),
});

const ContactsDeleteInputSchema = z.object({
	contact_id: z.string(),
	user_id: z.string().optional(),
});

const FoldersCreateInputSchema = z.object({
	displayName: z.string(),
	user_id: z.string().optional(),
	isHidden: z.boolean().optional(),
	return_existing_if_exists: z.boolean().optional(),
});

const FoldersGetInputSchema = z.object({
	mail_folder_id: z.string(),
	user_id: z.string().optional(),
	select: z.string().optional(),
});

const FoldersListInputSchema = z.object({
	user_id: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
	count: z.boolean().optional(),
	include_hidden_folders: z.boolean().optional(),
});

const FoldersUpdateInputSchema = z.object({
	mail_folder_id: z.string(),
	displayName: z.string(),
	user_id: z.string().optional(),
});

const FoldersDeleteInputSchema = z.object({
	folder_id: z.string(),
	user_id: z.string().optional(),
});

// ── Output Schemas ───────────────────────────────────────────────────────────

// /me/sendMail returns 202 No Content — schema is optional to handle an empty response body
const MessagesSendResponseSchema = z
	.object({
		status_code: z.number().optional(),
		// body captures any unexpected response payload; normally absent on 202
		body: z.record(z.unknown()).optional(),
	})
	.optional();

const MessagesCreateDraftResponseSchema = MessageSchema;

const MessagesGetResponseSchema = MessageSchema;

const MessagesListResponseSchema = z
	.object({
		value: z.array(MessageSchema).optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
	})
	.passthrough();

const MessagesQueryResponseSchema = z
	.object({
		value: z.array(MessageSchema).optional(),
		'@odata.count': z.number().optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
	})
	.passthrough();

const MessagesSearchResponseSchema = z
	.object({
		value: z.array(MessageSchema).optional(),
		'@odata.context': z.string().optional(),
	})
	.passthrough();

const MessagesReplyResponseSchema = z.object({
	status_code: z.number().optional(),
	// response_body captures any unexpected payload; /messages/{id}/reply normally returns 202 No Content
	response_body: z.record(z.unknown()).optional(),
});

const MessagesForwardResponseSchema = z.object({
	success: z.boolean().optional(),
});

const MessagesDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
});

const MessagesMoveResponseSchema = MessageSchema;

const MessagesUpdateResponseSchema = MessageSchema;

const MessagesSendDraftResponseSchema = z.object({
	success: z.boolean().optional(),
});

const MessagesBatchMoveResponseSchema = z.object({
	total_requested: z.number(),
	total_succeeded: z.number(),
	total_failed: z.number(),
	results: z.array(BatchMoveResultSchema),
});

const MessagesBatchUpdateResponseSchema = z.object({
	total_requested: z.number(),
	total_succeeded: z.number(),
	total_failed: z.number(),
	results: z.array(BatchUpdateResultSchema),
});

const MessagesAddAttachmentResponseSchema = AttachmentSchema;

const EventsCreateResponseSchema = EventSchema;

const EventsGetResponseSchema = EventSchema;

const EventsListResponseSchema = z
	.object({
		value: z.array(EventSchema).optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
	})
	.passthrough();

const EventsUpdateResponseSchema = EventSchema;

const EventsDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
});

const EventsCancelResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	user_id: z.string().optional(),
	event_id: z.string().optional(),
	calendar_id: z.string().optional(),
});

const EventsDeclineResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
});

const EventsFindMeetingTimesResponseSchema = z.object({
	'@odata.context': z.string().optional(),
	meetingTimeSuggestions: z.array(MeetingSuggestionSchema).optional(),
	emptySuggestionsReason: z.string().optional(),
});

const EventsGetScheduleResponseSchema = z
	.object({
		// Each schedule item contains availabilityView, workingHours, scheduleItems — shape varies by calendar config
		value: z.array(z.record(z.unknown())).optional(),
		'@odata.context': z.string().optional(),
	})
	.passthrough();

const CalendarsCreateResponseSchema = CalendarSchema;

const CalendarsGetResponseSchema = CalendarSchema;

const CalendarsListResponseSchema = z
	.object({
		value: z.array(CalendarSchema).optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		'@odata.deltaLink': z.string().optional(),
	})
	.passthrough();

const CalendarsDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
});

const ContactsCreateResponseSchema = ContactSchema;

const ContactsListResponseSchema = z
	.object({
		value: z.array(ContactSchema).optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
	})
	.passthrough();

const ContactsUpdateResponseSchema = ContactSchema;

const ContactsDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
});

const FoldersCreateResponseSchema = MailFolderSchema;

const FoldersGetResponseSchema = MailFolderSchema;

const FoldersListResponseSchema = z
	.object({
		value: z.array(MailFolderSchema).optional(),
		'@odata.count': z.number().optional(),
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
	})
	.passthrough();

const FoldersUpdateResponseSchema = MailFolderSchema;

const FoldersDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
});

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const OutlookEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesCreateDraft: MessagesCreateDraftInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesList: MessagesListInputSchema,
	messagesQuery: MessagesQueryInputSchema,
	messagesSearch: MessagesSearchInputSchema,
	messagesReply: MessagesReplyInputSchema,
	messagesForward: MessagesForwardInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesMove: MessagesMoveInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesSendDraft: MessagesSendDraftInputSchema,
	messagesBatchMove: MessagesBatchMoveInputSchema,
	messagesBatchUpdate: MessagesBatchUpdateInputSchema,
	messagesAddAttachment: MessagesAddAttachmentInputSchema,
	eventsCreate: EventsCreateInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsList: EventsListInputSchema,
	eventsUpdate: EventsUpdateInputSchema,
	eventsDelete: EventsDeleteInputSchema,
	eventsCancel: EventsCancelInputSchema,
	eventsDecline: EventsDeclineInputSchema,
	eventsFindMeetingTimes: EventsFindMeetingTimesInputSchema,
	eventsGetSchedule: EventsGetScheduleInputSchema,
	calendarsCreate: CalendarsCreateInputSchema,
	calendarsGet: CalendarsGetInputSchema,
	calendarsList: CalendarsListInputSchema,
	calendarsDelete: CalendarsDeleteInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsList: ContactsListInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersList: FoldersListInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
} as const;

export const OutlookEndpointOutputSchemas = {
	messagesSend: MessagesSendResponseSchema,
	messagesCreateDraft: MessagesCreateDraftResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesQuery: MessagesQueryResponseSchema,
	messagesSearch: MessagesSearchResponseSchema,
	messagesReply: MessagesReplyResponseSchema,
	messagesForward: MessagesForwardResponseSchema,
	messagesDelete: MessagesDeleteResponseSchema,
	messagesMove: MessagesMoveResponseSchema,
	messagesUpdate: MessagesUpdateResponseSchema,
	messagesSendDraft: MessagesSendDraftResponseSchema,
	messagesBatchMove: MessagesBatchMoveResponseSchema,
	messagesBatchUpdate: MessagesBatchUpdateResponseSchema,
	messagesAddAttachment: MessagesAddAttachmentResponseSchema,
	eventsCreate: EventsCreateResponseSchema,
	eventsGet: EventsGetResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsUpdate: EventsUpdateResponseSchema,
	eventsDelete: EventsDeleteResponseSchema,
	eventsCancel: EventsCancelResponseSchema,
	eventsDecline: EventsDeclineResponseSchema,
	eventsFindMeetingTimes: EventsFindMeetingTimesResponseSchema,
	eventsGetSchedule: EventsGetScheduleResponseSchema,
	calendarsCreate: CalendarsCreateResponseSchema,
	calendarsGet: CalendarsGetResponseSchema,
	calendarsList: CalendarsListResponseSchema,
	calendarsDelete: CalendarsDeleteResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersList: FoldersListResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
} as const;

export type OutlookEndpointInputs = {
	[K in keyof typeof OutlookEndpointInputSchemas]: z.infer<
		(typeof OutlookEndpointInputSchemas)[K]
	>;
};

export type OutlookEndpointOutputs = {
	[K in keyof typeof OutlookEndpointOutputSchemas]: z.infer<
		(typeof OutlookEndpointOutputSchemas)[K]
	>;
};

export type MessagesSendInput = OutlookEndpointInputs['messagesSend'];
export type MessagesCreateDraftInput =
	OutlookEndpointInputs['messagesCreateDraft'];
export type MessagesGetInput = OutlookEndpointInputs['messagesGet'];
export type MessagesListInput = OutlookEndpointInputs['messagesList'];
export type MessagesQueryInput = OutlookEndpointInputs['messagesQuery'];
export type MessagesSearchInput = OutlookEndpointInputs['messagesSearch'];
export type MessagesReplyInput = OutlookEndpointInputs['messagesReply'];
export type MessagesForwardInput = OutlookEndpointInputs['messagesForward'];
export type MessagesDeleteInput = OutlookEndpointInputs['messagesDelete'];
export type MessagesMoveInput = OutlookEndpointInputs['messagesMove'];
export type MessagesUpdateInput = OutlookEndpointInputs['messagesUpdate'];
export type MessagesSendDraftInput = OutlookEndpointInputs['messagesSendDraft'];
export type MessagesBatchMoveInput = OutlookEndpointInputs['messagesBatchMove'];
export type MessagesBatchUpdateInput =
	OutlookEndpointInputs['messagesBatchUpdate'];
export type MessagesAddAttachmentInput =
	OutlookEndpointInputs['messagesAddAttachment'];
export type EventsCreateInput = OutlookEndpointInputs['eventsCreate'];
export type EventsGetInput = OutlookEndpointInputs['eventsGet'];
export type EventsListInput = OutlookEndpointInputs['eventsList'];
export type EventsUpdateInput = OutlookEndpointInputs['eventsUpdate'];
export type EventsDeleteInput = OutlookEndpointInputs['eventsDelete'];
export type EventsCancelInput = OutlookEndpointInputs['eventsCancel'];
export type EventsDeclineInput = OutlookEndpointInputs['eventsDecline'];
export type EventsFindMeetingTimesInput =
	OutlookEndpointInputs['eventsFindMeetingTimes'];
export type EventsGetScheduleInput = OutlookEndpointInputs['eventsGetSchedule'];
export type CalendarsCreateInput = OutlookEndpointInputs['calendarsCreate'];
export type CalendarsGetInput = OutlookEndpointInputs['calendarsGet'];
export type CalendarsListInput = OutlookEndpointInputs['calendarsList'];
export type CalendarsDeleteInput = OutlookEndpointInputs['calendarsDelete'];
export type ContactsCreateInput = OutlookEndpointInputs['contactsCreate'];
export type ContactsListInput = OutlookEndpointInputs['contactsList'];
export type ContactsUpdateInput = OutlookEndpointInputs['contactsUpdate'];
export type ContactsDeleteInput = OutlookEndpointInputs['contactsDelete'];
export type FoldersCreateInput = OutlookEndpointInputs['foldersCreate'];
export type FoldersGetInput = OutlookEndpointInputs['foldersGet'];
export type FoldersListInput = OutlookEndpointInputs['foldersList'];
export type FoldersUpdateInput = OutlookEndpointInputs['foldersUpdate'];
export type FoldersDeleteInput = OutlookEndpointInputs['foldersDelete'];

export type MessagesSendResponse = OutlookEndpointOutputs['messagesSend'];
export type MessagesCreateDraftResponse =
	OutlookEndpointOutputs['messagesCreateDraft'];
export type MessagesGetResponse = OutlookEndpointOutputs['messagesGet'];
export type MessagesListResponse = OutlookEndpointOutputs['messagesList'];
export type MessagesQueryResponse = OutlookEndpointOutputs['messagesQuery'];
export type MessagesSearchResponse = OutlookEndpointOutputs['messagesSearch'];
export type MessagesReplyResponse = OutlookEndpointOutputs['messagesReply'];
export type MessagesForwardResponse = OutlookEndpointOutputs['messagesForward'];
export type MessagesDeleteResponse = OutlookEndpointOutputs['messagesDelete'];
export type MessagesMoveResponse = OutlookEndpointOutputs['messagesMove'];
export type MessagesUpdateResponse = OutlookEndpointOutputs['messagesUpdate'];
export type MessagesSendDraftResponse =
	OutlookEndpointOutputs['messagesSendDraft'];
export type MessagesBatchMoveResponse =
	OutlookEndpointOutputs['messagesBatchMove'];
export type MessagesBatchUpdateResponse =
	OutlookEndpointOutputs['messagesBatchUpdate'];
export type MessagesAddAttachmentResponse =
	OutlookEndpointOutputs['messagesAddAttachment'];
export type EventsCreateResponse = OutlookEndpointOutputs['eventsCreate'];
export type EventsGetResponse = OutlookEndpointOutputs['eventsGet'];
export type EventsListResponse = OutlookEndpointOutputs['eventsList'];
export type EventsUpdateResponse = OutlookEndpointOutputs['eventsUpdate'];
export type EventsDeleteResponse = OutlookEndpointOutputs['eventsDelete'];
export type EventsCancelResponse = OutlookEndpointOutputs['eventsCancel'];
export type EventsDeclineResponse = OutlookEndpointOutputs['eventsDecline'];
export type EventsFindMeetingTimesResponse =
	OutlookEndpointOutputs['eventsFindMeetingTimes'];
export type EventsGetScheduleResponse =
	OutlookEndpointOutputs['eventsGetSchedule'];
export type CalendarsCreateResponse = OutlookEndpointOutputs['calendarsCreate'];
export type CalendarsGetResponse = OutlookEndpointOutputs['calendarsGet'];
export type CalendarsListResponse = OutlookEndpointOutputs['calendarsList'];
export type CalendarsDeleteResponse = OutlookEndpointOutputs['calendarsDelete'];
export type ContactsCreateResponse = OutlookEndpointOutputs['contactsCreate'];
export type ContactsListResponse = OutlookEndpointOutputs['contactsList'];
export type ContactsUpdateResponse = OutlookEndpointOutputs['contactsUpdate'];
export type ContactsDeleteResponse = OutlookEndpointOutputs['contactsDelete'];
export type FoldersCreateResponse = OutlookEndpointOutputs['foldersCreate'];
export type FoldersGetResponse = OutlookEndpointOutputs['foldersGet'];
export type FoldersListResponse = OutlookEndpointOutputs['foldersList'];
export type FoldersUpdateResponse = OutlookEndpointOutputs['foldersUpdate'];
export type FoldersDeleteResponse = OutlookEndpointOutputs['foldersDelete'];
