import { z } from 'zod';

const EmailInputSchema = z.object({ email: z.string().email() });
const ResultSchema = z
	.object({
		Result: z.object({}).passthrough(),
	})
	.passthrough();
// batchUpdateStatus is documented without the `Result` wrapper
// ({ "Status": "Completed", "StatusCode": "200" }); its errors come wrapped.
const BatchStatusResultSchema = z.union([
	z.object({ Status: z.string(), StatusCode: z.string() }).passthrough(),
	ResultSchema,
]);

// Enginemailer documents the N8N API only through its official n8n node
// (Enginemailer-Official/n8n-nodes-enginemailer), which publishes no response
// schemas. These aliases keep that opacity explicit at the type boundary.
type N8nOpaqueResponse = unknown;
type N8nOpaqueCollection = N8nOpaqueResponse[];
const N8nOpaqueResponseSchema = z.unknown();
const N8nOpaqueCollectionSchema = z.array(N8nOpaqueResponseSchema);

// Custom field values are sent as text; dates use "dd MMM yyyy", checkboxes
// join options with "|", phones carry the country code.
const CustomFieldSchema = z.object({
	customfield_key: z.string().min(1),
	customfield_value: z.union([z.string(), z.number()]),
});
const SubscriberBodySchema = z.object({
	email: z.string().email(),
	subcategories: z.array(z.number().int()).optional(),
	customfields: z.array(CustomFieldSchema).optional(),
	sourcetype: z.string().max(256).optional(),
	// 0 keep, 1 append (default), 2 remove the listed, 3 replace all.
	subcategories_type: z.number().int().min(0).max(3).optional(),
	// 0 update the listed fields, 1 replace (default).
	customfield_type: z.number().int().min(0).max(1).optional(),
});
const BatchSubscribersBodySchema = z.object({
	subscribers: z
		.array(
			z.object({
				email: z.string().email(),
				customfields: z.array(CustomFieldSchema).optional(),
			}),
		)
		.min(1)
		.max(5000),
	subcategories: z.array(z.number().int()).optional(),
	sourcetype: z.string().max(256).optional(),
});
const CategoryBodySchema = z.object({
	categoryID: z.number().int().nonnegative(),
	categoryName: z.string().min(1).max(128),
	description: z.string().max(128).optional(),
	isvisible: z.boolean().optional(),
	subcategories: z
		.array(
			z.object({
				// 0 creates a subcategory; an existing ID renames it.
				subcategoryID: z.number().int().nonnegative(),
				subcategoryName: z.string().min(1).max(128),
				description: z.string().max(128).optional(),
			}),
		)
		.optional(),
});
const CampaignBodySchema = z.object({
	CampaignName: z.string().min(1).max(128),
	SenderName: z.string().min(1).max(128),
	SenderEmail: z.string().email(),
	ReplyTo: z.string().email().optional(),
	Subject: z.string().min(1).max(256),
	Content: z.string(),
});
const CampaignIdInputSchema = z.object({
	campaignid: z.number().int().positive(),
});
const RecipientListBodySchema = z.object({
	campaignid: z.number().int().positive(),
	// Required when FilterBy is 2.
	data: z
		.object({
			CategoryList: z.array(z.number().int()).min(1),
			FilterType: z.enum(['AND', 'OR']),
		})
		.optional(),
	// 1 assigns every subscriber, 2 filters by the subcategories in `data`.
	FilterBy: z.union([z.literal(1), z.literal(2)]).optional(),
});
const BatchStatusBodySchema = z.object({ ID: z.number().int().positive() });
const N8nEmailSchema = z.object({ email: z.string().email() });
const N8nSubscriberUpdateSchema = N8nEmailSchema.extend({
	sourcetype: z.string().optional(),
	subcategories: z.array(z.number().int()).optional(),
	customfields: z.array(CustomFieldSchema).optional(),
	updatetype: z.enum(['Overwrite', 'Append', 'Ignore']).optional(),
});
const N8nSubscriberCategorySchema = N8nEmailSchema.extend({
	subcategories: z.array(z.number().int()).min(1),
});
const N8nSendEmailSchema = N8nEmailSchema.extend({
	type: z.enum(['html', 'template']),
	html: z.string().optional(),
	subject: z.string().optional(),
	sender_email: z.string().email().optional(),
	sender_name: z.string().optional(),
	template_id: z.number().int().optional(),
	// The official n8n node sends a list of { Key, Value } pairs.
	substitution_tags: z
		.array(
			z.object({
				Key: z.string().min(1),
				Value: z.union([z.string(), z.number()]),
			}),
		)
		.optional(),
	// Up to 10 addresses; the API takes them as one comma-separated string.
	cc_emails: z
		.union([z.string(), z.array(z.string().email()).max(10)])
		.optional(),
});
const N8nPollingSchema = z.object({
	limit: z.number().int().positive().max(50).optional(),
	lastpollingdate: z
		.string()
		.refine(
			(value) =>
				z.string().datetime().safeParse(value).success ||
				/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value),
			'Expected an ISO 8601 or Enginemailer polling timestamp',
		)
		.optional(),
});

// "All" mirrors the official n8n node; it is dropped before the request.
const N8nIdFilterSchema = z.union([z.number().int(), z.literal('All')]);
const N8nNewSubscribersSchema = N8nPollingSchema.extend({
	source: z
		.enum([
			'All',
			'API',
			'Form',
			'Import',
			'LandingPage',
			'Manual',
			'Popup',
			'WhatsApp',
		])
		.optional(),
	filter_form: N8nIdFilterSchema.optional(),
	filter_page: N8nIdFilterSchema.optional(),
	filter_popups: N8nIdFilterSchema.optional(),
});
const N8nUnsubscribedSchema = N8nPollingSchema.extend({
	filter: z.enum(['All', 'Autoresponder', 'Campaign']).optional(),
	filter_autoresponder: N8nIdFilterSchema.optional(),
	filter_campaign: N8nIdFilterSchema.optional(),
});
const N8nSubcategoryPollingSchema = N8nPollingSchema.extend({
	filter_subcategory: N8nIdFilterSchema.optional(),
});
const N8nAutoresponderPollingSchema = N8nPollingSchema.extend({
	filter_autoresponder: N8nIdFilterSchema.optional(),
});
const GetSubcategoriesInputSchema = z.object({
	// Adds active_subscriber_count per subcategory (whitelisted accounts only).
	includeActiveSubscriberCount: z.boolean().optional(),
});
const UpdateCampaignBodySchema = CampaignBodySchema.extend({
	CampaignID: z.union([z.string().regex(/^\d+$/), z.number().int().positive()]),
});

export type EnginemailerEndpointInputs = {
	getSubscriber: z.infer<typeof EmailInputSchema>;
	activateSubscriber: z.infer<typeof EmailInputSchema>;
	insertSubscriber: z.infer<typeof SubscriberBodySchema>;
	updateSubscriber: z.infer<typeof SubscriberBodySchema>;
	unsubscribeSubscriber: z.infer<typeof EmailInputSchema>;
	getSubcategories: z.infer<typeof GetSubcategoriesInputSchema>;
	updateCategory: z.infer<typeof CategoryBodySchema>;
	getCustomFields: Record<string, never>;
	batchUpdateSubscribers: z.infer<typeof BatchSubscribersBodySchema>;
	batchUpdateStatus: z.infer<typeof BatchStatusBodySchema>;
	deleteSubscriber: z.infer<typeof EmailInputSchema>;
	listCampaigns: Record<string, never>;
	createCampaign: z.infer<typeof CampaignBodySchema>;
	updateCampaign: z.infer<typeof UpdateCampaignBodySchema>;
	deleteCampaign: z.infer<typeof CampaignIdInputSchema>;
	assignRecipientList: z.infer<typeof RecipientListBodySchema>;
	deleteRecipientList: z.infer<typeof CampaignIdInputSchema>;
	pauseCampaign: z.infer<typeof CampaignIdInputSchema>;
	sendCampaign: z.infer<typeof CampaignIdInputSchema>;
	addOrUpdateSubscriber: z.infer<typeof N8nSubscriberUpdateSchema>;
	findSubscriber: z.infer<typeof N8nEmailSchema>;
	deactivateSubscriber: z.infer<typeof N8nEmailSchema>;
	deleteN8nSubscriber: z.infer<typeof N8nEmailSchema>;
	sendEmail: z.infer<typeof N8nSendEmailSchema>;
	tagSubscriber: z.infer<typeof N8nSubscriberCategorySchema>;
	untagSubscriber: z.infer<typeof N8nSubscriberCategorySchema>;
	newSubscribers: z.infer<typeof N8nNewSubscribersSchema>;
	unsubscribedSubscribers: z.infer<typeof N8nUnsubscribedSchema>;
	taggedSubscribers: z.infer<typeof N8nSubcategoryPollingSchema>;
	deletedSubscribers: z.infer<typeof N8nPollingSchema>;
	untaggedSubscribers: z.infer<typeof N8nSubcategoryPollingSchema>;
	modifiedSubscribers: z.infer<typeof N8nPollingSchema>;
	autoresponderTriggered: z.infer<typeof N8nAutoresponderPollingSchema>;
	autoresponderCompleted: z.infer<typeof N8nAutoresponderPollingSchema>;
	connect: Record<string, never>;
	listForms: Record<string, never>;
	listPages: Record<string, never>;
	listPopups: Record<string, never>;
};

export type EnginemailerEndpointOutputs = {
	getSubscriber: z.infer<typeof ResultSchema>;
	activateSubscriber: z.infer<typeof ResultSchema>;
	insertSubscriber: z.infer<typeof ResultSchema>;
	updateSubscriber: z.infer<typeof ResultSchema>;
	unsubscribeSubscriber: z.infer<typeof ResultSchema>;
	getSubcategories: z.infer<typeof ResultSchema>;
	updateCategory: z.infer<typeof ResultSchema>;
	getCustomFields: z.infer<typeof ResultSchema>;
	batchUpdateSubscribers: z.infer<typeof ResultSchema>;
	batchUpdateStatus: z.infer<typeof BatchStatusResultSchema>;
	deleteSubscriber: z.infer<typeof ResultSchema>;
	listCampaigns: z.infer<typeof ResultSchema>;
	createCampaign: z.infer<typeof ResultSchema>;
	updateCampaign: z.infer<typeof ResultSchema>;
	deleteCampaign: z.infer<typeof ResultSchema>;
	assignRecipientList: z.infer<typeof ResultSchema>;
	deleteRecipientList: z.infer<typeof ResultSchema>;
	pauseCampaign: z.infer<typeof ResultSchema>;
	sendCampaign: z.infer<typeof ResultSchema>;
	addOrUpdateSubscriber: N8nOpaqueResponse;
	findSubscriber: N8nOpaqueResponse;
	deactivateSubscriber: N8nOpaqueResponse;
	deleteN8nSubscriber: N8nOpaqueResponse;
	sendEmail: N8nOpaqueResponse;
	tagSubscriber: N8nOpaqueResponse;
	untagSubscriber: N8nOpaqueResponse;
	newSubscribers: N8nOpaqueCollection;
	unsubscribedSubscribers: N8nOpaqueCollection;
	taggedSubscribers: N8nOpaqueCollection;
	deletedSubscribers: N8nOpaqueCollection;
	untaggedSubscribers: N8nOpaqueCollection;
	modifiedSubscribers: N8nOpaqueCollection;
	autoresponderTriggered: N8nOpaqueCollection;
	autoresponderCompleted: N8nOpaqueCollection;
	connect: N8nOpaqueResponse;
	listForms: N8nOpaqueCollection;
	listPages: N8nOpaqueCollection;
	listPopups: N8nOpaqueCollection;
};

export const EnginemailerEndpointInputSchemas = {
	getSubscriber: EmailInputSchema,
	activateSubscriber: EmailInputSchema,
	insertSubscriber: SubscriberBodySchema,
	updateSubscriber: SubscriberBodySchema,
	unsubscribeSubscriber: EmailInputSchema,
	getSubcategories: GetSubcategoriesInputSchema,
	updateCategory: CategoryBodySchema,
	getCustomFields: z.object({}),
	batchUpdateSubscribers: BatchSubscribersBodySchema,
	batchUpdateStatus: BatchStatusBodySchema,
	deleteSubscriber: EmailInputSchema,
	listCampaigns: z.object({}),
	createCampaign: CampaignBodySchema,
	updateCampaign: UpdateCampaignBodySchema,
	deleteCampaign: CampaignIdInputSchema,
	assignRecipientList: RecipientListBodySchema,
	deleteRecipientList: CampaignIdInputSchema,
	pauseCampaign: CampaignIdInputSchema,
	sendCampaign: CampaignIdInputSchema,
	addOrUpdateSubscriber: N8nSubscriberUpdateSchema,
	findSubscriber: N8nEmailSchema,
	deactivateSubscriber: N8nEmailSchema,
	deleteN8nSubscriber: N8nEmailSchema,
	sendEmail: N8nSendEmailSchema,
	tagSubscriber: N8nSubscriberCategorySchema,
	untagSubscriber: N8nSubscriberCategorySchema,
	newSubscribers: N8nNewSubscribersSchema,
	unsubscribedSubscribers: N8nUnsubscribedSchema,
	taggedSubscribers: N8nSubcategoryPollingSchema,
	deletedSubscribers: N8nPollingSchema,
	untaggedSubscribers: N8nSubcategoryPollingSchema,
	modifiedSubscribers: N8nPollingSchema,
	autoresponderTriggered: N8nAutoresponderPollingSchema,
	autoresponderCompleted: N8nAutoresponderPollingSchema,
	connect: z.object({}),
	listForms: z.object({}),
	listPages: z.object({}),
	listPopups: z.object({}),
} as const;

export const EnginemailerEndpointOutputSchemas = {
	getSubscriber: ResultSchema,
	activateSubscriber: ResultSchema,
	insertSubscriber: ResultSchema,
	updateSubscriber: ResultSchema,
	unsubscribeSubscriber: ResultSchema,
	getSubcategories: ResultSchema,
	updateCategory: ResultSchema,
	getCustomFields: ResultSchema,
	batchUpdateSubscribers: ResultSchema,
	batchUpdateStatus: BatchStatusResultSchema,
	deleteSubscriber: ResultSchema,
	listCampaigns: ResultSchema,
	createCampaign: ResultSchema,
	updateCampaign: ResultSchema,
	deleteCampaign: ResultSchema,
	assignRecipientList: ResultSchema,
	deleteRecipientList: ResultSchema,
	pauseCampaign: ResultSchema,
	sendCampaign: ResultSchema,
	addOrUpdateSubscriber: N8nOpaqueResponseSchema,
	findSubscriber: N8nOpaqueResponseSchema,
	deactivateSubscriber: N8nOpaqueResponseSchema,
	deleteN8nSubscriber: N8nOpaqueResponseSchema,
	sendEmail: N8nOpaqueResponseSchema,
	tagSubscriber: N8nOpaqueResponseSchema,
	untagSubscriber: N8nOpaqueResponseSchema,
	newSubscribers: N8nOpaqueCollectionSchema,
	unsubscribedSubscribers: N8nOpaqueCollectionSchema,
	taggedSubscribers: N8nOpaqueCollectionSchema,
	deletedSubscribers: N8nOpaqueCollectionSchema,
	untaggedSubscribers: N8nOpaqueCollectionSchema,
	modifiedSubscribers: N8nOpaqueCollectionSchema,
	autoresponderTriggered: N8nOpaqueCollectionSchema,
	autoresponderCompleted: N8nOpaqueCollectionSchema,
	connect: N8nOpaqueResponseSchema,
	listForms: N8nOpaqueCollectionSchema,
	listPages: N8nOpaqueCollectionSchema,
	listPopups: N8nOpaqueCollectionSchema,
} as const;
