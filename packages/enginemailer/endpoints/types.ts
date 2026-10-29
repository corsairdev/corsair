import { z } from 'zod';

const EmailInputSchema = z.object({ email: z.string().email() });
const IdInputSchema = z.object({ id: z.number().int().positive() });
const JsonBodySchema = z.record(z.string(), z.unknown());
const ResultSchema = z
	.object({
		Result: z.object({}).passthrough(),
	})
	.passthrough();

const SubscriberBodySchema = z.object({
	email: z.string().email(),
	subcategories: z.array(z.number().int()).optional(),
	customfields: z.array(z.record(z.string(), z.unknown())).optional(),
	sourcetype: z.string().max(256).optional(),
	subcategories_type: z.number().int().optional(),
	customfield_type: z.number().int().optional(),
});
const BatchSubscribersBodySchema = z.object({
	subscribers: z.array(z.record(z.string(), z.unknown())).min(1).max(5000),
	subcategories: z.array(z.number().int()).optional(),
	sourcetype: z.string().max(256).optional(),
});
const CategoryBodySchema = z.object({
	categoryID: z.number().int().nonnegative(),
	categoryName: z.string().min(1).max(128),
	description: z.string().max(128).optional(),
	isvisible: z.boolean().optional(),
	subcategories: z.array(z.record(z.string(), z.unknown())).optional(),
});
const CampaignBodySchema = z.object({
	CampaignName: z.string().min(1).max(128),
	SenderName: z.string().min(1).max(128),
	SenderEmail: z.string().email(),
	ReplyTo: z.string().email().optional(),
	Subject: z.string().min(1).max(256),
	Content: z.string(),
	CampaignID: z.union([z.string(), z.number()]).optional(),
});
const CampaignIdInputSchema = z.object({
	campaignid: z.number().int().positive(),
});
const RecipientListBodySchema = z.object({
	campaignid: z.number().int().positive(),
	data: z.record(z.string(), z.unknown()).optional(),
	FilterBy: z.number().int().optional(),
});
const BatchStatusBodySchema = z.object({ ID: z.number().int().positive() });
// N8N response payloads are intentionally opaque because the official Swagger
// documents paths but publishes no response schemas for these operations.
const N8nEmailSchema = z.object({ email: z.string().email() });
const N8nSubscriberUpdateSchema = N8nEmailSchema.extend({
	sourcetype: z.string().optional(),
	subcategories: z.array(z.number().int()).optional(),
	customfields: z.array(z.record(z.string(), z.unknown())).optional(),
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
	substitution_tags: z.record(z.string(), z.unknown()).optional(),
	cc_emails: z.array(z.string().email()).optional(),
});
const N8nPollingSchema = z.object({
	limit: z.number().int().positive().optional(),
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

export type EnginemailerEndpointInputs = {
	getSubscriber: z.infer<typeof EmailInputSchema>;
	activateSubscriber: z.infer<typeof EmailInputSchema>;
	insertSubscriber: z.infer<typeof SubscriberBodySchema>;
	updateSubscriber: z.infer<typeof SubscriberBodySchema>;
	unsubscribeSubscriber: z.infer<typeof EmailInputSchema>;
	getSubcategories: Record<string, never>;
	updateCategory: z.infer<typeof CategoryBodySchema>;
	getCustomFields: Record<string, never>;
	batchUpdateSubscribers: z.infer<typeof BatchSubscribersBodySchema>;
	batchUpdateStatus: z.infer<typeof BatchStatusBodySchema>;
	deleteSubscriber: z.infer<typeof EmailInputSchema>;
	listCampaigns: Record<string, never>;
	createCampaign: z.infer<typeof CampaignBodySchema>;
	updateCampaign: z.infer<typeof CampaignBodySchema> & {
		CampaignID: string | number;
	};
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
	newSubscribers: z.infer<typeof N8nPollingSchema> & {
		source?: string;
		filter_form?: number | 'All';
		filter_page?: number | 'All';
		filter_popups?: number | 'All';
	};
	unsubscribedSubscribers: z.infer<typeof N8nPollingSchema> & {
		filter?: string;
	};
	taggedSubscribers: z.infer<typeof N8nPollingSchema> & {
		filter_subcategory?: number;
	};
	deletedSubscribers: z.infer<typeof N8nPollingSchema>;
	untaggedSubscribers: z.infer<typeof N8nPollingSchema> & {
		filter_subcategory?: number;
	};
	modifiedSubscribers: z.infer<typeof N8nPollingSchema>;
	autoresponderTriggered: z.infer<typeof N8nPollingSchema> & {
		filter_autoresponder?: number;
	};
	autoresponderCompleted: z.infer<typeof N8nPollingSchema> & {
		filter_autoresponder?: number;
	};
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
	batchUpdateStatus: z.infer<typeof ResultSchema>;
	deleteSubscriber: z.infer<typeof ResultSchema>;
	listCampaigns: z.infer<typeof ResultSchema>;
	createCampaign: z.infer<typeof ResultSchema>;
	updateCampaign: z.infer<typeof ResultSchema>;
	deleteCampaign: z.infer<typeof ResultSchema>;
	assignRecipientList: z.infer<typeof ResultSchema>;
	deleteRecipientList: z.infer<typeof ResultSchema>;
	pauseCampaign: z.infer<typeof ResultSchema>;
	sendCampaign: z.infer<typeof ResultSchema>;
	// The official N8N API publishes no response schemas. Keep these values
	// provider-opaque until its response contracts are documented.
	addOrUpdateSubscriber: unknown;
	findSubscriber: unknown;
	deactivateSubscriber: unknown;
	deleteN8nSubscriber: unknown;
	sendEmail: unknown;
	tagSubscriber: unknown;
	untagSubscriber: unknown;
	newSubscribers: unknown[];
	unsubscribedSubscribers: unknown[];
	taggedSubscribers: unknown[];
	deletedSubscribers: unknown[];
	untaggedSubscribers: unknown[];
	modifiedSubscribers: unknown[];
	autoresponderTriggered: unknown[];
	autoresponderCompleted: unknown[];
	connect: unknown;
	listForms: unknown[];
	listPages: unknown[];
	listPopups: unknown[];
};

export const EnginemailerEndpointInputSchemas = {
	getSubscriber: EmailInputSchema,
	activateSubscriber: EmailInputSchema,
	insertSubscriber: SubscriberBodySchema,
	updateSubscriber: SubscriberBodySchema,
	unsubscribeSubscriber: EmailInputSchema,
	getSubcategories: z.object({}),
	updateCategory: CategoryBodySchema,
	getCustomFields: z.object({}),
	batchUpdateSubscribers: BatchSubscribersBodySchema,
	batchUpdateStatus: BatchStatusBodySchema,
	deleteSubscriber: EmailInputSchema,
	listCampaigns: z.object({}),
	createCampaign: CampaignBodySchema,
	updateCampaign: CampaignBodySchema.extend({
		CampaignID: z.union([z.string(), z.number()]),
	}),
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
	newSubscribers: N8nPollingSchema.extend({
		source: z.string().optional(),
		filter_form: z.union([z.number().int(), z.literal('All')]).optional(),
		filter_page: z.union([z.number().int(), z.literal('All')]).optional(),
		filter_popups: z.union([z.number().int(), z.literal('All')]).optional(),
	}),
	unsubscribedSubscribers: N8nPollingSchema.extend({
		filter: z.string().optional(),
	}),
	taggedSubscribers: N8nPollingSchema.extend({
		filter_subcategory: z.number().int().optional(),
	}),
	deletedSubscribers: N8nPollingSchema,
	untaggedSubscribers: N8nPollingSchema.extend({
		filter_subcategory: z.number().int().optional(),
	}),
	modifiedSubscribers: N8nPollingSchema,
	autoresponderTriggered: N8nPollingSchema.extend({
		filter_autoresponder: z.number().int().optional(),
	}),
	autoresponderCompleted: N8nPollingSchema.extend({
		filter_autoresponder: z.number().int().optional(),
	}),
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
	batchUpdateStatus: ResultSchema,
	deleteSubscriber: ResultSchema,
	listCampaigns: ResultSchema,
	createCampaign: ResultSchema,
	updateCampaign: ResultSchema,
	deleteCampaign: ResultSchema,
	assignRecipientList: ResultSchema,
	deleteRecipientList: ResultSchema,
	pauseCampaign: ResultSchema,
	sendCampaign: ResultSchema,
	// N8N response shapes are provider-defined and absent from its published
	// Swagger contract, so these schemas intentionally validate any JSON value.
	addOrUpdateSubscriber: z.unknown(),
	findSubscriber: z.unknown(),
	deactivateSubscriber: z.unknown(),
	deleteN8nSubscriber: z.unknown(),
	sendEmail: z.unknown(),
	tagSubscriber: z.unknown(),
	untagSubscriber: z.unknown(),
	newSubscribers: z.array(z.unknown()),
	unsubscribedSubscribers: z.array(z.unknown()),
	taggedSubscribers: z.array(z.unknown()),
	deletedSubscribers: z.array(z.unknown()),
	untaggedSubscribers: z.array(z.unknown()),
	modifiedSubscribers: z.array(z.unknown()),
	autoresponderTriggered: z.array(z.unknown()),
	autoresponderCompleted: z.array(z.unknown()),
	connect: z.unknown(),
	listForms: z.array(z.unknown()),
	listPages: z.array(z.unknown()),
	listPopups: z.array(z.unknown()),
} as const;
