import { z } from 'zod';

// Inputs use Remarkety's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Remarkety adds or omits cannot fail a
// call that has already happened. Shapes come from the Swagger 2.0 document at
// https://api.remarkety.com/api/v1/docs/remarkety-api-v1.json.
//
// Two things worth knowing:
//
// - Every store-scoped route needs a `storeId`, and the spec leaves that path
//   parameter undeclared while the routes clearly take it. It is required here
//   because without it the path cannot be built.
// - The email-template and rules routes declare **no** security in the
//   spec, yet they are store-scoped and the live host refuses an unauthenticated
//   call, so the plugin authenticates all of them.

/**
 * A JSON value. Used where a field's shape belongs to the caller's store data - a
 * campaign action's rules, a product's tags, a coupon - so it is described as JSON
 * rather than `unknown`, which would reach the docs as `any`.
 */
export type RemarketyJsonValue =
	| string
	| number
	| boolean
	| null
	| RemarketyJsonValue[]
	| { [key: string]: RemarketyJsonValue };

const JsonValueSchema: z.ZodType<RemarketyJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/**
 * The store ID shown on Settings > API Keys is a short string such as `AbC123xy`,
 * and that is what the store routes take. The numeric `id` that `stores.get`
 * returns is accepted too.
 */
const StoreIdSchema = z
	.union([z.string().min(1), z.number().int()])
	.describe(
		'The store ID from Settings > API Keys (a short string such as AbC123xy), or the numeric store id.',
	);

// ── stores ────────────────────────────────────────────────────────────────

/** An amount with its currency. */
const MoneySchema = z
	.object({
		amount: z.number().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

export type RemarketyMoney = z.infer<typeof MoneySchema>;

const StoreInputShape = {
	name: z.string().min(1).describe('The store name.'),
	apiKey: z
		.string()
		.describe(
			"The API key Remarkety uses to sync with the store. This is the store's key, not the token this plugin authenticates with.",
		),
	platform: z
		.string()
		.optional()
		.describe('PRESTASHOP, VIRTUEMART or MAGENTO.'),
	domain: z.string().optional().describe('The store URL.'),
} as const;

const StoresCreateInputSchema = z.object(StoreInputShape);

export type StoresCreateInput = z.infer<typeof StoresCreateInputSchema>;

/**
 * A store.
 *
 * `apiKey` here is the key Remarkety syncs the store with, which is a different
 * secret from the plugin's own token; it is returned because the API returns it.
 */
const StoreSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		apiKey: z.string().nullish().describe("The store's own sync key."),
		platform: z.string().nullish(),
		domain: z.string().nullish(),
	})
	.loose();

export type RemarketyStore = z.infer<typeof StoreSchema>;

const StoresCreateResponseSchema = StoreSchema;

export type StoresCreateResponse = z.infer<typeof StoresCreateResponseSchema>;

/**
 * Updating a store needs its `id` in the body, because the route is `PUT /stores`
 * rather than `PUT /stores/{storeId}`.
 */
const StoresUpdateInputSchema = z.object({
	id: z
		.number()
		.int()
		.describe('The numeric store id that stores.get returns.'),
	...StoreInputShape,
});

export type StoresUpdateInput = z.infer<typeof StoresUpdateInputSchema>;

const StoresUpdateResponseSchema = StoreSchema;

export type StoresUpdateResponse = z.infer<typeof StoresUpdateResponseSchema>;

const StoresGetInputSchema = z.object({
	storeId: StoreIdSchema,
});

export type StoresGetInput = z.infer<typeof StoresGetInputSchema>;

const StoresGetResponseSchema = StoreSchema;

export type StoresGetResponse = z.infer<typeof StoresGetResponseSchema>;

const StoresDeleteInputSchema = z.object({
	storeId: StoreIdSchema,
});

export type StoresDeleteInput = z.infer<typeof StoresDeleteInputSchema>;

const StoresDeleteResponseSchema = z.object({}).loose();

export type StoresDeleteResponse = z.infer<typeof StoresDeleteResponseSchema>;

// ── store status ──────────────────────────────────────────────────────────

const StoreStatusInputSchema = z.object({
	storeId: StoreIdSchema,
});

export type StoreStatusInput = z.infer<typeof StoreStatusInputSchema>;

/**
 * The sync state, which is how a caller checks whether Remarkety is actually
 * receiving the store's data. `syncLastError` holds the last runner message and
 * is filled in on a healthy store too (live: "Campaign runner completed ( success:
 * 0 )" with `syncStatus: OK`), so `syncStatus` is what says whether it failed.
 */
const StoreStatusResponseSchema = z
	.object({
		syncStatus: z
			.string()
			.nullish()
			.describe('The current sync status, such as OK or ERROR.'),
		syncLastError: z
			.string()
			.nullish()
			.describe(
				'The last sync or runner message. It is set on a healthy store too; read syncStatus to tell a failure.',
			),
		lastSyncSuccess: z.string().nullish(),
		lastSyncAttempt: z.string().nullish(),
	})
	.loose();

export type StoreStatusResponse = z.infer<typeof StoreStatusResponseSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsCreateInputSchema = z.object({
	storeId: StoreIdSchema,
	email: z.string().min(1),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	tags: z.array(z.string()).optional(),
	properties: JsonObjectSchema.optional().describe(
		'Custom contact properties as one object, such as { country: "US", city: "Austin", rewardsPoints: 100 }. Remarkety refuses an array.',
	),
	doubleOptin: z
		.boolean()
		.optional()
		.describe(
			'Remarkety defaults this to true, which emails the contact a confirmation request before they can be marketed to. Pass false to add the contact without that email.',
		),
	allowedMarketing: z
		.boolean()
		.optional()
		.describe('True marks the contact as marketing-allowed.'),
});

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const ContactsCreateResponseSchema = z.object({}).loose();

export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

const ContactsUnsubscribeInputSchema = z.object({
	storeId: StoreIdSchema,
	email: z.string().min(1),
});

export type ContactsUnsubscribeInput = z.infer<
	typeof ContactsUnsubscribeInputSchema
>;

const ContactsUnsubscribeResponseSchema = z.object({}).loose();

export type ContactsUnsubscribeResponse = z.infer<
	typeof ContactsUnsubscribeResponseSchema
>;

// ── campaigns ─────────────────────────────────────────────────────────────

/** One rule on a campaign action: a type, an operator and a value. */
const RuleInputSchema = z.object({
	type: z
		.string()
		.min(1)
		.describe(
			'A rule type from the store rules, such as a segment or a schedule.',
		),
	operator: z
		.string()
		.min(1)
		.describe("The operator from that rule's operators."),
	value: z.string().describe('The value to compare against.'),
});

/**
 * One action a campaign runs. An `email` action needs a subject and a base
 * template; an `api` action needs a webhook instead. The rules decide when it runs.
 */
const CampaignActionInputSchema = z
	.object({
		type: z
			.enum(['email', 'api'])
			.describe('email sends mail; api posts the event to a webhook.'),
		webhook: z.string().optional().describe('Required for an api action.'),
		subject: z.string().optional().describe('Required for an email action.'),
		baseTemplate: z
			.string()
			.optional()
			.describe('Required for an email action: the HTML base template.'),
		rules: z.array(RuleInputSchema).min(1),
	})
	.superRefine((action, ctx) => {
		if (action.type === 'api' && !action.webhook) {
			ctx.addIssue({
				code: 'custom',
				path: ['webhook'],
				message: 'An api action needs the webhook URL to post the event to.',
			});
		}
		if (action.type === 'email' && (!action.subject || !action.baseTemplate)) {
			ctx.addIssue({
				code: 'custom',
				path: ['subject'],
				message:
					'An email action needs both a subject and a baseTemplate; Remarkety has no default for either.',
			});
		}
	});

export type RemarketyCampaignActionInput = z.infer<
	typeof CampaignActionInputSchema
>;

const CampaignsCreateInputSchema = z.object({
	storeId: StoreIdSchema,
	type: z.string().min(1).describe('A campaign type from campaigns.types.'),
	actions: z
		.array(CampaignActionInputSchema)
		.length(1)
		.describe(
			'The action this campaign runs. This API version takes exactly one.',
		),
	mode: z
		.enum(['run', 'test', 'stop'])
		.optional()
		.describe(
			"run starts it, test sends a sample to testEmail, stop halts it. Defaults to Remarkety's own choice.",
		),
	testEmail: z
		.string()
		.optional()
		.describe('Where a test send goes, when mode is test.'),
});

export type CampaignsCreateInput = z.infer<typeof CampaignsCreateInputSchema>;

/**
 * A campaign.
 *
 * `mode` is what state it is in, and a campaign with `mode: run` is contacting
 * shoppers, which is worth checking before an update.
 */
const CampaignSchema = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		actions: z.array(JsonObjectSchema).nullish(),
		mode: z.string().nullish().describe('run, test or stop.'),
		testEmail: z.string().nullish(),
	})
	.loose();

export type RemarketyCampaign = z.infer<typeof CampaignSchema>;

const CampaignsCreateResponseSchema = CampaignSchema;

export type CampaignsCreateResponse = z.infer<
	typeof CampaignsCreateResponseSchema
>;

/** Updating takes the campaign `id` in the body, on the store's campaigns route. */
const CampaignsUpdateInputSchema = z.object({
	storeId: StoreIdSchema,
	id: z.number().int().describe('The campaign to update.'),
	type: z.string().min(1).optional(),
	actions: z
		.array(CampaignActionInputSchema)
		.length(1)
		.optional()
		.describe(
			'The action this campaign runs. This API version takes exactly one.',
		),
	mode: z.enum(['run', 'test', 'stop']).optional(),
	testEmail: z.string().optional(),
});

export type CampaignsUpdateInput = z.infer<typeof CampaignsUpdateInputSchema>;

const CampaignsUpdateResponseSchema = CampaignSchema;

export type CampaignsUpdateResponse = z.infer<
	typeof CampaignsUpdateResponseSchema
>;

const CampaignsGetInputSchema = z.object({
	storeId: StoreIdSchema,
	campaignId: z.number().int(),
});

export type CampaignsGetInput = z.infer<typeof CampaignsGetInputSchema>;

const CampaignsGetResponseSchema = CampaignSchema;

export type CampaignsGetResponse = z.infer<typeof CampaignsGetResponseSchema>;

const CampaignsDeleteInputSchema = z.object({
	storeId: StoreIdSchema,
	campaignId: z.number().int(),
});

export type CampaignsDeleteInput = z.infer<typeof CampaignsDeleteInputSchema>;

const CampaignsDeleteResponseSchema = z.object({}).loose();

export type CampaignsDeleteResponse = z.infer<
	typeof CampaignsDeleteResponseSchema
>;

const CampaignsTypesInputSchema = z.object({
	storeId: StoreIdSchema,
	type: z
		.string()
		.optional()
		.describe('Only the options for this campaign type.'),
});

export type CampaignsTypesInput = z.infer<typeof CampaignsTypesInputSchema>;

/** A JSON map keyed by campaign type, whose values differ per type. */
const CampaignsTypesResponseSchema = JsonObjectSchema;

export type CampaignsTypesResponse = z.infer<
	typeof CampaignsTypesResponseSchema
>;

// ── campaign email templates ──────────────────────────────────────────────

const EmailTemplateGetInputSchema = z.object({
	storeId: StoreIdSchema,
	campaignId: z.number().int(),
	ruleId: z.number().int(),
});

export type EmailTemplateGetInput = z.infer<typeof EmailTemplateGetInputSchema>;

/**
 * A campaign's email template. `type` decides how to read it: an `html` template
 * uses `html` directly, while an `editor-v1` template carries its design plus the
 * `masterTemplate` it is based on.
 */
const EmailTemplateSchema = z
	.object({
		type: z.string().nullish().describe('editor-v1 or html.'),
		html: z.string().nullish(),
		masterTemplate: JsonObjectSchema.nullish(),
	})
	.loose();

export type RemarketyEmailTemplate = z.infer<typeof EmailTemplateSchema>;

const EmailTemplateGetResponseSchema = EmailTemplateSchema;

export type EmailTemplateGetResponse = z.infer<
	typeof EmailTemplateGetResponseSchema
>;

const EmailTemplateUpdateInputSchema = z.object({
	storeId: StoreIdSchema,
	campaignId: z.number().int(),
	ruleId: z.number().int(),
	type: z.string().describe('editor-v1 or html.'),
	html: z.string().describe('The template HTML, including its head tags.'),
	masterTemplate: JsonObjectSchema.optional(),
});

export type EmailTemplateUpdateInput = z.infer<
	typeof EmailTemplateUpdateInputSchema
>;

const EmailTemplateUpdateResponseSchema = EmailTemplateSchema;

export type EmailTemplateUpdateResponse = z.infer<
	typeof EmailTemplateUpdateResponseSchema
>;

// ── master templates ──────────────────────────────────────────────────────

const MasterTemplatesListInputSchema = z.object({
	storeId: StoreIdSchema,
	q: z.string().optional().describe('A term to search the templates for.'),
});

export type MasterTemplatesListInput = z.infer<
	typeof MasterTemplatesListInputSchema
>;

const MasterTemplateMetadataSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		author: z.string().nullish(),
		date_uploaded: z.string().nullish(),
		public: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		thumbnail: z.string().nullish(),
		editor: z.string().nullish(),
		campaignTypes: z.array(z.number()).nullish(),
	})
	.loose();

/** Each listed template wraps its details in `metadata`. */
const MasterTemplatesListResponseSchema = z.array(
	z.object({ metadata: MasterTemplateMetadataSchema.nullish() }).loose(),
);

export type MasterTemplatesListResponse = z.infer<
	typeof MasterTemplatesListResponseSchema
>;

// ── products ──────────────────────────────────────────────────────────────

const ProductsListInputSchema = z.object({
	storeId: StoreIdSchema,
	q: z.string().optional().describe('A product name or SKU to search for.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Defaults to 100, maximum 1000.'),
	page: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-indexed page number.'),
	minUpdate: z
		.string()
		.optional()
		.describe('Only products updated at or after this datetime.'),
});

export type ProductsListInput = z.infer<typeof ProductsListInputSchema>;

const ProductSchema = z
	.object({
		price: MoneySchema.nullish(),
		title: z.string().nullish(),
		sku: z.string().nullish(),
		thumbnailUrl: z.string().nullish(),
		productPageUrl: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

const ProductsListResponseSchema = z.array(ProductSchema);

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

// ── rules ─────────────────────────────────────────────────────────────────

const RulesListInputSchema = z.object({
	storeId: StoreIdSchema,
});

export type RulesListInput = z.infer<typeof RulesListInputSchema>;

/**
 * What one rule accepts: its input type, operators and possible values.
 *
 * Live, `possibleValues` is an empty string for a free-text rule, a map such as
 * `{"1": "Opened", "2": "Clicked"}` for a select, an array, or null, so it is any
 * JSON value.
 */
const RuleDefinitionSchema = z
	.object({
		inputType: z.string().nullish(),
		displayName: z.string().nullish(),
		operators: z.array(z.string()).nullish(),
		details: z.string().nullish(),
		possibleValues: JsonValueSchema.nullish().describe(
			'A string, a map of value to label, or a list, depending on the rule.',
		),
		defaultValue: JsonValueSchema.nullish(),
	})
	.loose();

/** Every rule the store supports, keyed by rule type (CART_FOLLOWUP_TIME, …). */
const RulesListResponseSchema = z.record(z.string(), RuleDefinitionSchema);

export type RulesListResponse = z.infer<typeof RulesListResponseSchema>;

const RulesGetInputSchema = z.object({
	storeId: StoreIdSchema,
	ruleType: z.string().min(1).describe('A rule type from rules.list.'),
});

export type RulesGetInput = z.infer<typeof RulesGetInputSchema>;

const RulesGetResponseSchema = RuleDefinitionSchema;

export type RulesGetResponse = z.infer<typeof RulesGetResponseSchema>;

// ── segments ──────────────────────────────────────────────────────────────

const SegmentsCountInputSchema = z.object({
	storeId: StoreIdSchema,
});

export type SegmentsCountInput = z.infer<typeof SegmentsCountInputSchema>;

const SegmentsCountResponseSchema = z
	.object({
		count: z.number().nullish(),
	})
	.loose();

export type SegmentsCountResponse = z.infer<typeof SegmentsCountResponseSchema>;

const SegmentsListInputSchema = z.object({
	storeId: StoreIdSchema,
	page: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-indexed page number.'),
	limit: z.number().int().min(1).optional().describe('Results per page.'),
});

export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;

const SegmentContactSchema = z
	.object({
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
	})
	.loose();

const SegmentsListResponseSchema = z.array(SegmentContactSchema);

export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RemarketyEndpointInputs = {
	storesCreate: StoresCreateInput;
	storesUpdate: StoresUpdateInput;
	storesGet: StoresGetInput;
	storesDelete: StoresDeleteInput;
	storeStatus: StoreStatusInput;
	contactsCreate: ContactsCreateInput;
	contactsUnsubscribe: ContactsUnsubscribeInput;
	campaignsCreate: CampaignsCreateInput;
	campaignsUpdate: CampaignsUpdateInput;
	campaignsGet: CampaignsGetInput;
	campaignsDelete: CampaignsDeleteInput;
	campaignsTypes: CampaignsTypesInput;
	emailTemplateGet: EmailTemplateGetInput;
	emailTemplateUpdate: EmailTemplateUpdateInput;
	masterTemplatesList: MasterTemplatesListInput;
	productsList: ProductsListInput;
	rulesList: RulesListInput;
	rulesGet: RulesGetInput;
	segmentsCount: SegmentsCountInput;
	segmentsList: SegmentsListInput;
};

export type RemarketyEndpointOutputs = {
	storesCreate: StoresCreateResponse;
	storesUpdate: StoresUpdateResponse;
	storesGet: StoresGetResponse;
	storesDelete: StoresDeleteResponse;
	storeStatus: StoreStatusResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUnsubscribe: ContactsUnsubscribeResponse;
	campaignsCreate: CampaignsCreateResponse;
	campaignsUpdate: CampaignsUpdateResponse;
	campaignsGet: CampaignsGetResponse;
	campaignsDelete: CampaignsDeleteResponse;
	campaignsTypes: CampaignsTypesResponse;
	emailTemplateGet: EmailTemplateGetResponse;
	emailTemplateUpdate: EmailTemplateUpdateResponse;
	masterTemplatesList: MasterTemplatesListResponse;
	productsList: ProductsListResponse;
	rulesList: RulesListResponse;
	rulesGet: RulesGetResponse;
	segmentsCount: SegmentsCountResponse;
	segmentsList: SegmentsListResponse;
};

export const RemarketyEndpointInputSchemas = {
	storesCreate: StoresCreateInputSchema,
	storesUpdate: StoresUpdateInputSchema,
	storesGet: StoresGetInputSchema,
	storesDelete: StoresDeleteInputSchema,
	storeStatus: StoreStatusInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUnsubscribe: ContactsUnsubscribeInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsDelete: CampaignsDeleteInputSchema,
	campaignsTypes: CampaignsTypesInputSchema,
	emailTemplateGet: EmailTemplateGetInputSchema,
	emailTemplateUpdate: EmailTemplateUpdateInputSchema,
	masterTemplatesList: MasterTemplatesListInputSchema,
	productsList: ProductsListInputSchema,
	rulesList: RulesListInputSchema,
	rulesGet: RulesGetInputSchema,
	segmentsCount: SegmentsCountInputSchema,
	segmentsList: SegmentsListInputSchema,
} as const;

export const RemarketyEndpointOutputSchemas = {
	storesCreate: StoresCreateResponseSchema,
	storesUpdate: StoresUpdateResponseSchema,
	storesGet: StoresGetResponseSchema,
	storesDelete: StoresDeleteResponseSchema,
	storeStatus: StoreStatusResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUnsubscribe: ContactsUnsubscribeResponseSchema,
	campaignsCreate: CampaignsCreateResponseSchema,
	campaignsUpdate: CampaignsUpdateResponseSchema,
	campaignsGet: CampaignsGetResponseSchema,
	campaignsDelete: CampaignsDeleteResponseSchema,
	campaignsTypes: CampaignsTypesResponseSchema,
	emailTemplateGet: EmailTemplateGetResponseSchema,
	emailTemplateUpdate: EmailTemplateUpdateResponseSchema,
	masterTemplatesList: MasterTemplatesListResponseSchema,
	productsList: ProductsListResponseSchema,
	rulesList: RulesListResponseSchema,
	rulesGet: RulesGetResponseSchema,
	segmentsCount: SegmentsCountResponseSchema,
	segmentsList: SegmentsListResponseSchema,
} as const;
