import { z } from 'zod';

// Inputs use WaiverFile's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field the API adds cannot fail a call.
//
// WaiverFile returns PascalCase field names — `WaiverID`, `DateSigned`,
// `SignedName` — so the schemas mirror that rather than normalising, because a
// caller reasoning from the docs will expect those names.
// Reference: https://api.waiverfile.com/swagger/v1/swagger.json

/** A waiver ID or another GUID, as a plain string. */
const GuidSchema = z.string().min(1);

const DateSchema = z
	.string()
	.describe('A date or date-time, as `yyyy-MM-dd` or ISO 8601.');

const PagingSchema = {
	pageIndex: z
		.number()
		.int()
		.min(0)
		.describe(
			'Zero-based for waiver lists and one-based for GetWaiverData — WaiverFile differs between the two.',
		),
	pageSize: z
		.number()
		.int()
		.min(10)
		.max(1000)
		.describe('Rows per page. Waiver lists cap at 500.'),
};

// ── the models ────────────────────────────────────────────────────────────

/** A participant on a waiver. A waiver can cover several people. */
const ParticipantSchema = z
	.object({
		WaiverParticipantID: z.string().nullish(),
		WaiverID: z.string().nullish(),
		ParticipantName: z.string().nullish(),
		ParticipantNameFirst: z.string().nullish(),
		DOB: z.string().nullish(),
		IsCheckedIn: z.boolean().nullish(),
		ValuesXml: z.string().nullish(),
		IsSignee: z.boolean().nullish(),
	})
	.loose();

export type WaiverFileParticipant = z.infer<typeof ParticipantSchema>;

/**
 * A signed waiver. `WaiverText` is the agreement the person accepted and
 * `FieldsXml` / `ValuesXml` hold the form answers as XML, which is how
 * WaiverFile models custom questions.
 */
const WaiverSchema = z
	.object({
		WaiverID: z.string().nullish(),
		SiteID: z.string().nullish(),
		WaiverEventID: z.string().nullish(),
		WaiverFormID: z.string().nullish(),
		DateSigned: z.string().nullish(),
		DateAttending: z.string().nullish(),
		SignedName: z.string().nullish(),
		SignedNameFirst: z.string().nullish(),
		Email: z.string().nullish(),
		Phone: z.string().nullish(),
		DOB: z.string().nullish(),
		Age: z.number().nullish(),
		Address: z.string().nullish(),
		Address2: z.string().nullish(),
		City: z.string().nullish(),
		State: z.string().nullish(),
		Zip: z.string().nullish(),
		OptIn: z.boolean().nullish(),
		HasSignature: z.boolean().nullish(),
		Expired: z.boolean().nullish(),
		WaiverIsDeleted: z.boolean().nullish(),
		ClientIP: z.string().nullish(),
		ClientType: z.string().nullish(),
		deviceID: z.number().nullish(),
		FieldsXml: z.string().nullish(),
		ValuesXml: z.string().nullish(),
		OriginalData: z.string().nullish(),
		OriginalDataVerified: z.boolean().nullish(),
		Particpants: z
			.array(ParticipantSchema)
			.nullish()
			.describe("WaiverFile's own spelling, with the missing i."),
		WaiverEvent: z.record(z.string(), z.unknown()).nullish(),
		WaiverForm: z.record(z.string(), z.unknown()).nullish(),
		Signatures: z.record(z.string(), z.unknown()).nullish(),
		Images: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type WaiverFileWaiver = z.infer<typeof WaiverSchema>;

/**
 * The lite form: the collected answers without the agreement text, event detail
 * or signatures. Smaller, and enough for a roster or an export.
 */
const WaiverLiteSchema = z
	.object({
		WaiverID: z.string().nullish(),
		SiteID: z.string().nullish(),
		WaiverEventID: z.string().nullish(),
		WaiverFormID: z.string().nullish(),
		DateSigned: z.string().nullish(),
		SignedName: z.string().nullish(),
		SignedNameFirst: z.string().nullish(),
		Email: z.string().nullish(),
		Phone: z.string().nullish(),
		OptIn: z.boolean().nullish(),
		FieldsXml: z.string().nullish(),
		ValuesXml: z.string().nullish(),
		Particpants: z.array(ParticipantSchema).nullish(),
	})
	.loose();

export type WaiverFileWaiverLite = z.infer<typeof WaiverLiteSchema>;

/** One report-style row per participant, with optional custom columns. */
const WaiverDataRowSchema = z.record(z.string(), z.unknown());

export type WaiverFileDataRow = z.infer<typeof WaiverDataRowSchema>;

const WaiverEventSchema = z
	.object({
		WaiverEventID: z.string().nullish(),
		SiteID: z.string().nullish(),
		Name: z.string().nullish(),
		DateStart: z.string().nullish(),
		DateEnd: z.string().nullish(),
		IsAllDay: z.boolean().nullish(),
		IsDeleted: z.boolean().nullish(),
		CategoryID: z.string().nullish(),
		TimeLabel: z.string().nullish(),
		NumWaiverForms: z.number().nullish(),
		NumSignedWaivers: z.number().nullish(),
		SpotsRemaining: z.number().nullish(),
		MaxParts: z.number().nullish(),
		Headcount: z.number().nullish(),
		ManagerEmailList: z.string().nullish(),
		ManagerIDs: z.array(z.string()).nullish(),
		Created: z.string().nullish(),
		LastModified: z.string().nullish(),
		WaiverEventFormIDs: z.array(z.string()).nullish(),
		WaiverForms: z.array(z.record(z.string(), z.unknown())).nullish(),
		Waivers: z.array(WaiverLiteSchema).nullish(),
		Category: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type WaiverFileEvent = z.infer<typeof WaiverEventSchema>;

const EventCategorySchema = z
	.object({
		WaiverEventCategoryID: z.string().nullish(),
		SiteID: z.string().nullish(),
		Name: z.string().nullish(),
		Status: z.unknown().nullish(),
		WPObjectStatus: z.unknown().nullish(),
	})
	.loose();

export type WaiverFileEventCategory = z.infer<typeof EventCategorySchema>;

/**
 * A waiver form: the questions and the fields it collects. `Status` says
 * whether it is active, and `GetAllWaiverForms` also returns disabled and
 * deleted ones.
 */
const WaiverFormSchema = z
	.object({
		ID: z.string().nullish(),
		SiteID: z.string().nullish(),
		Name: z.string().nullish(),
		Questions: z.string().nullish().describe('The custom questions, as JSON.'),
		NumParticipantsPerForm: z.number().nullish(),
		MinAge: z.number().nullish(),
		MaxAgeParticipant: z.number().nullish(),
		AgreementLabelText: z.string().nullish(),
		FieldInclude_Email: z.boolean().nullish(),
		FieldRequire_Email: z.boolean().nullish(),
		FieldInclude_Phone: z.boolean().nullish(),
		FieldRequire_Phone: z.boolean().nullish(),
		FieldInclude_DOB: z.boolean().nullish(),
		FieldRequire_DOB: z.boolean().nullish(),
		FieldInclude_Address: z.boolean().nullish(),
		FieldRequire_Address: z.boolean().nullish(),
		IncludeSignature: z.boolean().nullish(),
		AllowSigningForSomeoneElse: z.boolean().nullish(),
		Status: z.string().nullish(),
		Language: z.string().nullish(),
		Created: z.string().nullish(),
		LastModified: z.string().nullish(),
	})
	.loose();

export type WaiverFileForm = z.infer<typeof WaiverFormSchema>;

const SiteDetailsSchema = z
	.object({
		SiteID: z.string().nullish(),
		Name: z.string().nullish(),
		SiteName: z.string().nullish(),
		TimeZone: z.string().nullish(),
		TimeZoneID: z.string().nullish(),
		Address: z.string().nullish(),
		City: z.string().nullish(),
		State: z.string().nullish(),
		Zip: z.string().nullish(),
		Phone: z.string().nullish(),
		Email: z.string().nullish(),
		Website: z.string().nullish(),
	})
	.loose();

export type WaiverFileSite = z.infer<typeof SiteDetailsSchema>;

// ── ping and site ─────────────────────────────────────────────────────────

const PingInputSchema = z.object({});

export type PingInput = z.infer<typeof PingInputSchema>;

/**
 * `Ping` answers odd shapes: with valid credentials it reports the service is
 * online, and a bad key gets a 400 whose message starts `InvalidService`. Both
 * cases are handled, so the output is a plain flag.
 */
const PingResponseSchema = z
	.object({
		status: z.string().nullish(),
		Message: z.string().nullish(),
	})
	.loose();

export type PingResponse = z.infer<typeof PingResponseSchema>;

const SiteGetInputSchema = z.object({});

export type SiteGetInput = z.infer<typeof SiteGetInputSchema>;

const SiteGetResponseSchema = SiteDetailsSchema;

export type SiteGetResponse = z.infer<typeof SiteGetResponseSchema>;

// ── waivers ───────────────────────────────────────────────────────────────

const WaiversGetInputSchema = z.object({ waiverID: GuidSchema });

export type WaiversGetInput = z.infer<typeof WaiversGetInputSchema>;

const WaiverResponseSchema = WaiverSchema;

export type WaiverResponse = z.infer<typeof WaiverResponseSchema>;

const WaiversGetLiteInputSchema = z.object({ waiverID: GuidSchema });

export type WaiversGetLiteInput = z.infer<typeof WaiversGetLiteInputSchema>;

const WaiverLiteResponseSchema = WaiverLiteSchema;

export type WaiverLiteResponse = z.infer<typeof WaiverLiteResponseSchema>;

const WaiversSearchInputSchema = z.object({
	terms: z
		.string()
		.min(1)
		.describe(
			'A name, or whatever the site configures as its quick-search fields.',
		),
});

export type WaiversSearchInput = z.infer<typeof WaiversSearchInputSchema>;

const SearchResponseSchema = z
	.object({
		Waivers: z.array(WaiverLiteSchema).nullish(),
	})
	.loose();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

const WaiversByReferenceInputSchema = z
	.object({
		refID1: z.string().optional().describe('Exact match on Reference ID 1.'),
		refID2: z.string().optional(),
		refID3: z.string().optional(),
		refIDAny: z
			.string()
			.optional()
			.describe('Exact match on any of the three reference fields.'),
	})
	.superRefine((value, ctx) => {
		const set = [
			value.refID1,
			value.refID2,
			value.refID3,
			value.refIDAny,
		].filter((part) => part !== undefined);
		if (set.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['refIDAny'],
				message:
					'A reference lookup needs at least one of refID1, refID2, refID3 or refIDAny.',
			});
		}
	});

export type WaiversByReferenceInput = z.infer<
	typeof WaiversByReferenceInputSchema
>;

const WaiversListInputSchema = z.object({
	startDate: DateSchema,
	endDate: DateSchema,
	pageIndex: PagingSchema.pageIndex,
	pageSize: z
		.number()
		.int()
		.min(10)
		.max(500)
		.describe('Waivers per page, 10 to 500.'),
});

export type WaiversListInput = z.infer<typeof WaiversListInputSchema>;

const WaiversListResponseSchema = z
	.object({
		Waivers: z.array(WaiverSchema).nullish(),
	})
	.loose();

export type WaiversListResponse = z.infer<typeof WaiversListResponseSchema>;

const WaiversListLiteInputSchema = WaiversListInputSchema;

export type WaiversListLiteInput = z.infer<typeof WaiversListLiteInputSchema>;

const WaiversListLiteResponseSchema = z
	.object({
		Waivers: z.array(WaiverLiteSchema).nullish(),
	})
	.loose();

export type WaiversListLiteResponse = z.infer<
	typeof WaiversListLiteResponseSchema
>;

const WaiversPageCountInputSchema = z.object({
	startDate: DateSchema,
	endDate: DateSchema,
});

export type WaiversPageCountInput = z.infer<typeof WaiversPageCountInputSchema>;

/** The total, which is what a caller needs to plan the paging. */
const CountResponseSchema = z
	.object({
		Count: z.number().nullish(),
		TotalCount: z.number().nullish(),
		PageCount: z.number().nullish(),
	})
	.loose();

export type CountResponse = z.infer<typeof CountResponseSchema>;

/**
 * Report-style rows, one per participant, for a date range. `pageIndex` starts
 * at **1** here, unlike the waiver lists.
 */
const WaiversDataInputSchema = z.object({
	startDate: DateSchema,
	endDate: DateSchema,
	includeCustomColumns: z
		.boolean()
		.describe('Include custom form fields from every waiver form.'),
	consolidateParticipants: z
		.boolean()
		.describe(
			'Reserved: the API currently ignores it and still returns one row per participant.',
		),
	pageIndex: z
		.number()
		.int()
		.min(1)
		.describe(
			'The page to return, starting at **1** — unlike the waiver lists.',
		),
	pageSize: z
		.number()
		.int()
		.min(10)
		.max(1000)
		.describe('Rows per page, 10 to 1000.'),
});

export type WaiversDataInput = z.infer<typeof WaiversDataInputSchema>;

const WaiversDataResponseSchema = z
	.object({
		Data: z.array(WaiverDataRowSchema).nullish(),
		Rows: z.array(WaiverDataRowSchema).nullish(),
		TotalCount: z.number().nullish(),
	})
	.loose();

export type WaiversDataResponse = z.infer<typeof WaiversDataResponseSchema>;

const WaiversDataCountInputSchema = z.object({
	startDate: DateSchema,
	endDate: DateSchema,
});

export type WaiversDataCountInput = z.infer<typeof WaiversDataCountInputSchema>;

const WaiversPdfInputSchema = z.object({
	waiverID: GuidSchema,
});

export type WaiversPdfInput = z.infer<typeof WaiversPdfInputSchema>;

/**
 * A PDF cannot be a zod object, so the plugin reports what came back rather
 * than pretending to parse it: the response is the file, and the caller's HTTP
 * layer is what would save it.
 */
const WaiversPdfResponseSchema = z.object({
	waiverID: z.string(),
	contentType: z.string(),
	/** The byte length of the PDF, when the body was readable. */
	bytes: z.number(),
});

export type WaiversPdfResponse = z.infer<typeof WaiversPdfResponseSchema>;

// ── forms ─────────────────────────────────────────────────────────────────

const FormsActiveInputSchema = z.object({});

export type FormsActiveInput = z.infer<typeof FormsActiveInputSchema>;

const FormsResponseSchema = z
	.object({
		WaiverForms: z.array(WaiverFormSchema).nullish(),
		Forms: z.array(WaiverFormSchema).nullish(),
	})
	.loose();

export type FormsResponse = z.infer<typeof FormsResponseSchema>;

const FormsAllInputSchema = z.object({});

export type FormsAllInput = z.infer<typeof FormsAllInputSchema>;

// ── events ────────────────────────────────────────────────────────────────

const EventsByDateRangeInputSchema = z.object({
	startDateUTC: DateSchema,
	endDateUTC: DateSchema,
});

export type EventsByDateRangeInput = z.infer<
	typeof EventsByDateRangeInputSchema
>;

const EventsResponseSchema = z
	.object({
		Events: z.array(WaiverEventSchema).nullish(),
		WaiverEvents: z.array(WaiverEventSchema).nullish(),
	})
	.loose();

export type EventsResponse = z.infer<typeof EventsResponseSchema>;

const EventsByCategoryInputSchema = z.object({
	eventCategoryID: GuidSchema,
	startDateUTC: DateSchema,
	endDateUTC: DateSchema,
});

export type EventsByCategoryInput = z.infer<typeof EventsByCategoryInputSchema>;

const EventsUpcomingInputSchema = z.object({
	startDateUTC: DateSchema,
	endDateUTC: DateSchema,
});

export type EventsUpcomingInput = z.infer<typeof EventsUpcomingInputSchema>;

const EventsWaiversInputSchema = z.object({
	waiverEventID: GuidSchema,
});

export type EventsWaiversInput = z.infer<typeof EventsWaiversInputSchema>;

const EventsWaiversResponseSchema = z
	.object({
		Waivers: z.array(WaiverLiteSchema).nullish(),
	})
	.loose();

export type EventsWaiversResponse = z.infer<typeof EventsWaiversResponseSchema>;

const EventsGetInputSchema = z.object({ eventID: GuidSchema });

export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;

const EventResponseSchema = WaiverEventSchema;

export type EventResponse = z.infer<typeof EventResponseSchema>;

/**
 * Creates an event. This is the one route that carries the credentials in the
 * **body** rather than the query string, which the plugin handles so a caller
 * never sees the difference.
 */
const EventsCreateInputSchema = z.object({
	eventName: z.string().min(1),
	dateStart: DateSchema,
	dateEnd: DateSchema,
	isAllDay: z.boolean(),
	eventCategoryID: z
		.string()
		.optional()
		.describe('A category from `eventCategories.list`.'),
	managerEmailList: z
		.string()
		.optional()
		.describe('Addresses separated by commas, spaces or line breaks.'),
	managerEmailMessage: z.string().optional(),
	waiverFormIDList: z
		.string()
		.optional()
		.describe('Comma-separated form IDs. Omit to attach every active form.'),
	eventLocation: z.string().optional(),
	signingCutoff: z
		.string()
		.optional()
		.describe('After this time waivers can no longer be signed.'),
	maxParticipants: z.number().int().positive().optional(),
	workflowIDList: z.string().optional(),
});

export type EventsCreateInput = z.infer<typeof EventsCreateInputSchema>;

const EventsUpdateInputSchema = z.object({
	eventID: GuidSchema,
	eventName: z.string().min(1),
	dateStart: DateSchema,
	dateEnd: DateSchema,
	isAllDay: z.boolean(),
	eventCategoryID: z
		.string()
		.describe('To set no category, send the empty string.'),
	waiverFormIDs: z
		.array(z.string())
		.optional()
		.describe('Replaces the attached forms. Omit to leave them alone.'),
});

export type EventsUpdateInput = z.infer<typeof EventsUpdateInputSchema>;

const EventsDeleteInputSchema = z.object({ eventID: GuidSchema });

export type EventsDeleteInput = z.infer<typeof EventsDeleteInputSchema>;

/** A delete answers a flag rather than an object. */
const EventDeleteResponseSchema = z
	.object({
		Success: z.boolean().nullish(),
		Message: z.string().nullish(),
	})
	.loose();

export type EventDeleteResponse = z.infer<typeof EventDeleteResponseSchema>;

const EventsManagersInputSchema = z.object({
	eventID: GuidSchema,
	emailAddresses: z
		.string()
		.min(1)
		.describe('Addresses separated by commas, spaces or line breaks.'),
	managerEmailMessage: z
		.string()
		.optional()
		.describe('Text added to the invitation. Invite only.'),
	skipSendingEmailIfAccountExists: z
		.boolean()
		.optional()
		.describe(
			'Invite only: skip the email for people who already have an account.',
		),
});

export type EventsManagersInput = z.infer<typeof EventsManagersInputSchema>;

const EventManagersResponseSchema = z
	.object({
		Success: z.boolean().nullish(),
		Message: z.string().nullish(),
	})
	.loose();

export type EventManagersResponse = z.infer<typeof EventManagersResponseSchema>;

// ── event categories ──────────────────────────────────────────────────────

const CategoriesListInputSchema = z.object({
	includeDisabledCategories: z
		.boolean()
		.describe('Also return categories that are switched off.'),
});

export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;

const CategoriesResponseSchema = z
	.object({
		EventCategories: z.array(EventCategorySchema).nullish(),
		Categories: z.array(EventCategorySchema).nullish(),
	})
	.loose();

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

const CategoriesCreateInputSchema = z.object({
	name: z.string().min(1),
	active: z.boolean(),
});

export type CategoriesCreateInput = z.infer<typeof CategoriesCreateInputSchema>;

const CategoriesUpdateInputSchema = z.object({
	eventCategoryID: GuidSchema,
	name: z.string().min(1),
	active: z.boolean(),
});

export type CategoriesUpdateInput = z.infer<typeof CategoriesUpdateInputSchema>;

const CategoriesDeleteInputSchema = z.object({
	eventCategoryID: GuidSchema,
});

export type CategoriesDeleteInput = z.infer<typeof CategoriesDeleteInputSchema>;

const CategoryMutationResponseSchema = z
	.object({
		Success: z.boolean().nullish(),
		Message: z.string().nullish(),
		WaiverEventCategoryID: z.string().nullish(),
	})
	.loose();

export type CategoryMutationResponse = z.infer<
	typeof CategoryMutationResponseSchema
>;

// ── subscribers ───────────────────────────────────────────────────────────

const SubscribersListInputSchema = z.object({
	startDateUTC: DateSchema,
	endDateUTC: DateSchema,
});

export type SubscribersListInput = z.infer<typeof SubscribersListInputSchema>;

const SubscriberSchema = z
	.object({
		WPSMSMobileNumID: z.string().nullish(),
		Phone: z.string().nullish(),
		MobileNum: z.string().nullish(),
		Added: z.string().nullish(),
		OptOutDate: z.string().nullish(),
	})
	.loose();

export type WaiverFileSubscriber = z.infer<typeof SubscriberSchema>;

const SubscribersResponseSchema = z
	.object({
		Subscribers: z.array(SubscriberSchema).nullish(),
	})
	.loose();

export type SubscribersResponse = z.infer<typeof SubscribersResponseSchema>;

const SubscribersOptedOutInputSchema = z.object({
	startDateUTC: DateSchema,
	endDateUTC: DateSchema,
});

export type SubscribersOptedOutInput = z.infer<
	typeof SubscribersOptedOutInputSchema
>;

// ── webhook subscriptions ─────────────────────────────────────────────────

/**
 * The triggers a URL can be subscribed to. WaiverFile names each one in the
 * route rather than in a body, and each has its own subscribe and unsubscribe.
 * These are the twelve documented, taken from the API's own route table.
 */
export const WAIVERFILE_WEBHOOK_TRIGGERS = [
	'newwaiver',
	'newevent',
	'newcheckin',
	'newqrscan',
	'newbookingcheckin',
	'bookingcheckinundone',
	'bookingcheckedin',
	'newmembercheckin',
	'membercheckinundone',
	'editwaiver',
	'editevent',
	'editcheckin',
] as const;

export type WaiverFileTrigger = (typeof WAIVERFILE_WEBHOOK_TRIGGERS)[number];

const SubscribeInputSchema = z.object({
	trigger: z
		.enum(WAIVERFILE_WEBHOOK_TRIGGERS)
		.describe('The trigger whose events will be posted to `targetUrl`.'),
	targetUrl: z.string().min(1).describe('The URL WaiverFile will POST to.'),
});

export type SubscribeInput = z.infer<typeof SubscribeInputSchema>;

const SubscribeResponseSchema = z
	.object({
		Success: z.boolean().nullish(),
		Message: z.string().nullish(),
	})
	.loose();

export type SubscribeResponse = z.infer<typeof SubscribeResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WaiverFileEndpointInputs = {
	ping: PingInput;
	siteGet: SiteGetInput;
	waiversGet: WaiversGetInput;
	waiversGetLite: WaiversGetLiteInput;
	waiversSearch: WaiversSearchInput;
	waiversByReference: WaiversByReferenceInput;
	waiversList: WaiversListInput;
	waiversListLite: WaiversListLiteInput;
	waiversPageCount: WaiversPageCountInput;
	waiversData: WaiversDataInput;
	waiversDataCount: WaiversDataCountInput;
	waiversPdf: WaiversPdfInput;
	formsActive: FormsActiveInput;
	formsAll: FormsAllInput;
	eventsByDateRange: EventsByDateRangeInput;
	eventsByCategory: EventsByCategoryInput;
	eventsUpcoming: EventsUpcomingInput;
	eventsWaivers: EventsWaiversInput;
	eventsGet: EventsGetInput;
	eventsCreate: EventsCreateInput;
	eventsUpdate: EventsUpdateInput;
	eventsDelete: EventsDeleteInput;
	eventsInviteManagers: EventsManagersInput;
	eventsRemoveManagers: EventsManagersInput;
	eventCategoriesList: CategoriesListInput;
	eventCategoriesCreate: CategoriesCreateInput;
	eventCategoriesUpdate: CategoriesUpdateInput;
	eventCategoriesDelete: CategoriesDeleteInput;
	subscribersList: SubscribersListInput;
	subscribersOptedOut: SubscribersOptedOutInput;
	webhooksSubscribe: SubscribeInput;
	webhooksUnsubscribe: SubscribeInput;
};

export type WaiverFileEndpointOutputs = {
	ping: PingResponse;
	siteGet: SiteGetResponse;
	waiversGet: WaiverResponse;
	waiversGetLite: WaiverLiteResponse;
	waiversSearch: SearchResponse;
	waiversByReference: SearchResponse;
	waiversList: WaiversListResponse;
	waiversListLite: WaiversListLiteResponse;
	waiversPageCount: CountResponse;
	waiversData: WaiversDataResponse;
	waiversDataCount: CountResponse;
	waiversPdf: WaiversPdfResponse;
	formsActive: FormsResponse;
	formsAll: FormsResponse;
	eventsByDateRange: EventsResponse;
	eventsByCategory: EventsResponse;
	eventsUpcoming: EventsResponse;
	eventsWaivers: EventsWaiversResponse;
	eventsGet: EventResponse;
	eventsCreate: EventResponse;
	eventsUpdate: EventResponse;
	eventsDelete: EventDeleteResponse;
	eventsInviteManagers: EventManagersResponse;
	eventsRemoveManagers: EventManagersResponse;
	eventCategoriesList: CategoriesResponse;
	eventCategoriesCreate: CategoryMutationResponse;
	eventCategoriesUpdate: CategoryMutationResponse;
	eventCategoriesDelete: CategoryMutationResponse;
	subscribersList: SubscribersResponse;
	subscribersOptedOut: SubscribersResponse;
	webhooksSubscribe: SubscribeResponse;
	webhooksUnsubscribe: SubscribeResponse;
};

export const WaiverFileEndpointInputSchemas = {
	ping: PingInputSchema,
	siteGet: SiteGetInputSchema,
	waiversGet: WaiversGetInputSchema,
	waiversGetLite: WaiversGetLiteInputSchema,
	waiversSearch: WaiversSearchInputSchema,
	waiversByReference: WaiversByReferenceInputSchema,
	waiversList: WaiversListInputSchema,
	waiversListLite: WaiversListLiteInputSchema,
	waiversPageCount: WaiversPageCountInputSchema,
	waiversData: WaiversDataInputSchema,
	waiversDataCount: WaiversDataCountInputSchema,
	waiversPdf: WaiversPdfInputSchema,
	formsActive: FormsActiveInputSchema,
	formsAll: FormsAllInputSchema,
	eventsByDateRange: EventsByDateRangeInputSchema,
	eventsByCategory: EventsByCategoryInputSchema,
	eventsUpcoming: EventsUpcomingInputSchema,
	eventsWaivers: EventsWaiversInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsCreate: EventsCreateInputSchema,
	eventsUpdate: EventsUpdateInputSchema,
	eventsDelete: EventsDeleteInputSchema,
	eventsInviteManagers: EventsManagersInputSchema,
	eventsRemoveManagers: EventsManagersInputSchema,
	eventCategoriesList: CategoriesListInputSchema,
	eventCategoriesCreate: CategoriesCreateInputSchema,
	eventCategoriesUpdate: CategoriesUpdateInputSchema,
	eventCategoriesDelete: CategoriesDeleteInputSchema,
	subscribersList: SubscribersListInputSchema,
	subscribersOptedOut: SubscribersOptedOutInputSchema,
	webhooksSubscribe: SubscribeInputSchema,
	webhooksUnsubscribe: SubscribeInputSchema,
} as const;

export const WaiverFileEndpointOutputSchemas = {
	ping: PingResponseSchema,
	siteGet: SiteGetResponseSchema,
	waiversGet: WaiverResponseSchema,
	waiversGetLite: WaiverLiteResponseSchema,
	waiversSearch: SearchResponseSchema,
	waiversByReference: SearchResponseSchema,
	waiversList: WaiversListResponseSchema,
	waiversListLite: WaiversListLiteResponseSchema,
	waiversPageCount: CountResponseSchema,
	waiversData: WaiversDataResponseSchema,
	waiversDataCount: CountResponseSchema,
	waiversPdf: WaiversPdfResponseSchema,
	formsActive: FormsResponseSchema,
	formsAll: FormsResponseSchema,
	eventsByDateRange: EventsResponseSchema,
	eventsByCategory: EventsResponseSchema,
	eventsUpcoming: EventsResponseSchema,
	eventsWaivers: EventsWaiversResponseSchema,
	eventsGet: EventResponseSchema,
	eventsCreate: EventResponseSchema,
	eventsUpdate: EventResponseSchema,
	eventsDelete: EventDeleteResponseSchema,
	eventsInviteManagers: EventManagersResponseSchema,
	eventsRemoveManagers: EventManagersResponseSchema,
	eventCategoriesList: CategoriesResponseSchema,
	eventCategoriesCreate: CategoryMutationResponseSchema,
	eventCategoriesUpdate: CategoryMutationResponseSchema,
	eventCategoriesDelete: CategoryMutationResponseSchema,
	subscribersList: SubscribersResponseSchema,
	subscribersOptedOut: SubscribersResponseSchema,
	webhooksSubscribe: SubscribeResponseSchema,
	webhooksUnsubscribe: SubscribeResponseSchema,
} as const;
