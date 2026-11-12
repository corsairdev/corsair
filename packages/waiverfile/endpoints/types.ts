import { z } from 'zod';

// Inputs use WaiverFile's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field the API adds cannot fail a call.
//
// WaiverFile serialises its answers three ways (see `shape.ts`): .NET objects
// with a `me` column block, XML converted to JSON where every value is a
// string, and bare scalars. The endpoints flatten all three into the PascalCase
// names the reference documents (`WaiverID`, `WaiverEventID`, `Name`), and the
// schemas below describe that flattened shape. Field types were checked against
// a live trial account on 2026-11-12.
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

/**
 * A value from an XML-converted waiver: WaiverFile turns every column into a
 * string (`"true"`, `"0"`, `"1/1/1990"`), and an empty element into null.
 */
const XmlText = z.string().nullish();

// unknown: nested XML-converted nodes (the agreement text, the event, the
// form instance) have no fixed shape across waiver forms.
const XmlNode = z.record(z.string(), z.unknown()).nullish();

/** A participant on an XML-converted waiver. A waiver can cover several people. */
const ParticipantSchema = z
	.object({
		WaiverParticipantID: XmlText,
		WaiverID: XmlText,
		ParticipantName: XmlText,
		ParticipantNameFirst: XmlText,
		DOB: XmlText,
		Age: XmlText,
		IsCheckedIn: XmlText.describe('"true" or "false".'),
		IsSignee: XmlText.describe('"true" or "false".'),
		// unknown: XML-converted custom field values, `{ data: … }` or null.
		ValuesXml: z.unknown().optional(),
		CustomFields: XmlNode,
	})
	.loose();

export type WaiverFileParticipant = z.infer<typeof ParticipantSchema>;

/**
 * A signed waiver as the waiver reads return it: XML converted to JSON, so every
 * value is a string. `Particpants` (WaiverFile's spelling, missing an i) is
 * always an array here, although the API sends a single participant as an
 * object; the plugin evens that out. `GetWaiver` adds the agreement text, the
 * event and the form; the lite routes and the lists leave those out.
 */
const WaiverSchema = z
	.object({
		WaiverID: XmlText,
		SiteID: XmlText,
		WaiverEventID: XmlText,
		WaiverFormID: XmlText,
		WaiverFormInstanceID: XmlText,
		DateSigned: XmlText.describe('UTC, without an offset.'),
		DateAttending: XmlText,
		SignedName: XmlText.describe("The signer's last name."),
		SignedNameFirst: XmlText,
		Email: XmlText,
		Phone: XmlText,
		DOB: XmlText,
		Age: XmlText,
		Address: XmlText,
		Address2: XmlText,
		City: XmlText,
		State: XmlText,
		Zip: XmlText,
		OptIn: XmlText.describe('"true" or "false".'),
		HasSignature: XmlText.describe('"true" or "false".'),
		Expired: XmlText,
		WaiverIsDeleted: XmlText,
		ClientIP: XmlText,
		ClientType: XmlText,
		ReferenceID1: XmlText,
		ReferenceID2: XmlText,
		ReferenceID3: XmlText,
		FieldsXml: XmlText,
		// unknown: XML-converted custom field values, `{ data: … }` or null.
		ValuesXml: z.unknown().optional(),
		Particpants: z
			.array(ParticipantSchema)
			.nullish()
			.describe("WaiverFile's own spelling, with the missing i."),
		WaiverEvent: XmlNode,
		WaiverForm: XmlNode,
		WaiverText: XmlNode,
		CustomFields: XmlNode.describe(
			'GetWaiver only: each custom form field label mapped to its value.',
		),
	})
	.loose();

export type WaiverFileWaiver = z.infer<typeof WaiverSchema>;

/** The lite routes return the same XML-converted waiver without the large parts. */
const WaiverLiteSchema = WaiverSchema;

export type WaiverFileWaiverLite = z.infer<typeof WaiverLiteSchema>;

/**
 * A waiver from `GetWaiversForEvent`, which, unlike the waiver routes, uses
 * standard JSON: booleans and numbers keep their types and the participants are
 * `Participants`, spelled correctly.
 */
const EventWaiverSchema = z
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
		DOB: z.string().nullish(),
		Age: z.number().nullish(),
		HasSignature: z.boolean().nullish(),
		OptIn: z.boolean().nullish(),
		WaiverIsDeleted: z.boolean().nullish(),
		ReferenceID1: z.string().nullish(),
		ReferenceID2: z.string().nullish(),
		ReferenceID3: z.string().nullish(),
		Participants: z
			.array(
				z
					.object({
						WaiverParticipantID: z.string().nullish(),
						ParticipantName: z.string().nullish(),
						ParticipantNameFirst: z.string().nullish(),
						DOB: z.string().nullish(),
						IsCheckedIn: z.boolean().nullish(),
						IsSignee: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type WaiverFileEventWaiver = z.infer<typeof EventWaiverSchema>;

/**
 * One report-style row per participant. The columns depend on the site's forms
 * (custom columns are named after them), so a row is an open record.
 */
// unknown: column names and types vary by site and form.
const WaiverDataRowSchema = z.record(z.string(), z.unknown());

export type WaiverFileDataRow = z.infer<typeof WaiverDataRowSchema>;

/**
 * An event. `DateStart` and `DateEnd` are UTC everywhere except in the answers to
 * `InsertEvent`, `InviteEventManagers` and `RemoveEventManagers`, which give
 * them in the site's time zone.
 */
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
		WaiverEventFormIDs: z
			.array(
				z.union([
					z.string(),
					z
						.object({
							WaiverEventID: z.string().nullish(),
							WaiverFormID: z.string().nullish(),
						})
						.loose(),
				]),
			)
			.nullish()
			.describe('The forms attached to the event.'),
		// unknown: nested .NET objects whose columns depend on the form.
		WaiverForms: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: the event's waivers, when the route includes them.
		Waivers: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: the category object, or null.
		Category: z.record(z.string(), z.unknown()).nullish(),
		Settings: z
			.object({
				MaxParticipants: z.number().nullish(),
				Location: z.string().nullish(),
				SigningCutoff: z.string().nullish(),
				Description: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type WaiverFileEvent = z.infer<typeof WaiverEventSchema>;

const EventCategorySchema = z
	.object({
		ID: z.string().nullish(),
		SiteID: z.string().nullish(),
		Name: z.string().nullish(),
		Status: z
			.number()
			.nullish()
			.describe('0 = active, 1 = disabled, 2 = deleted.'),
		OrderNum: z.number().nullish(),
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
		Status: z
			.number()
			.nullish()
			.describe(
				'0 = active, 1 = disabled, 2 = deleted, 3 = unpublished draft.',
			),
		Language: z.string().nullish(),
		Created: z.string().nullish(),
		LastModified: z.string().nullish(),
	})
	.loose();

export type WaiverFileForm = z.infer<typeof WaiverFormSchema>;

/**
 * The site. WaiverFile also sends every label and setting the site has (over a
 * megabyte); the plugin drops `Labels` and `LabelData` and keeps the rest.
 */
const SiteDetailsSchema = z
	.object({
		ID: z.string().nullish(),
		Name: z.string().nullish(),
		Url: z.string().nullish().describe('The site path on app.waiverfile.com.'),
		DefaultTimezone: z.string().nullish(),
		Status: z.number().nullish(),
		DateAdded: z.string().nullish(),
		ReplyToEmail: z.string().nullish(),
	})
	.loose();

export type WaiverFileSite = z.infer<typeof SiteDetailsSchema>;

// ── ping and site ─────────────────────────────────────────────────────────

const PingInputSchema = z.object({});

export type PingInput = z.infer<typeof PingInputSchema>;

/**
 * `Ping` answers the bare string `"Service online"`; the plugin returns it as
 * `Message`. A bad key is a 400 whose message starts `InvalidService`, which
 * surfaces as an error rather than a result.
 */
const PingResponseSchema = z
	.object({
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

/**
 * The total. WaiverFile answers a bare number; despite its route name,
 * `GetAllWaiversByDateRangePageCount` counts waivers, not pages.
 */
const CountResponseSchema = z
	.object({
		Count: z.number().nullish(),
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
		Table: z.array(WaiverDataRowSchema).nullish(),
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
 * The PDF, base64-encoded so it survives a JSON payload, with its real length.
 */
const WaiversPdfResponseSchema = z.object({
	waiverID: z.string(),
	contentType: z.string(),
	/** The real byte length of the file that was received. */
	bytes: z.number(),
	/** The file itself, base64-encoded, so it survives a JSON payload. */
	content: z.string().describe('Base64. Decode it to get the PDF bytes.'),
});

export type WaiversPdfResponse = z.infer<typeof WaiversPdfResponseSchema>;

// ── forms ─────────────────────────────────────────────────────────────────

const FormsActiveInputSchema = z.object({});

export type FormsActiveInput = z.infer<typeof FormsActiveInputSchema>;

const FormsResponseSchema = z
	.object({
		WaiverForms: z.array(WaiverFormSchema).nullish(),
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
		Waivers: z.array(EventWaiverSchema).nullish(),
	})
	.loose();

export type EventsWaiversResponse = z.infer<typeof EventsWaiversResponseSchema>;

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
		.describe(
			'To set no category, send the empty GUID 00000000-0000-0000-0000-000000000000.',
		),
	waiverFormIDs: z
		.array(z.string())
		.optional()
		.describe(
			'Replaces the attached forms. Omitted or empty attaches every active form: WaiverFile cannot leave them unchanged, so pass the current IDs to keep them.',
		),
});

export type EventsUpdateInput = z.infer<typeof EventsUpdateInputSchema>;

const EventsDeleteInputSchema = z.object({ eventID: GuidSchema });

export type EventsDeleteInput = z.infer<typeof EventsDeleteInputSchema>;

/** A delete answers the deleted event, with `IsDeleted` true. */
const EventDeleteResponseSchema = WaiverEventSchema;

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

/** Both manager routes answer the event, with `ManagerIDs` as it now stands. */
const EventManagersResponseSchema = WaiverEventSchema;

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

/** Create, update and delete all answer the category as it now stands. */
const CategoryMutationResponseSchema = EventCategorySchema;

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

/**
 * Both routes answer the string `"OK"`; the plugin returns `Success: true` with
 * it. An unknown subscription is a 400 ("Subscription not found or already
 * deleted."), raised as an error.
 */
const SubscribeResponseSchema = z
	.object({
		Success: z.boolean(),
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
