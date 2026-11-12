import { z } from 'zod';

export const PathSegmentSchema = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Invalid path segment',
	);

const LinkSchema = z
	.object({
		href: z.string(),
		rel: z.string(),
		description: z.string().optional(),
	})
	.passthrough();
export const LinksSchema = z.array(LinkSchema).optional();

export const ListSchema = z
	.object({
		listId: z.number().int().optional(),
		name: z.string().max(100),
		currentStatus: z
			.enum([
				'ready',
				'draft',
				'readyToSent',
				'sent',
				'importingSubscribers',
				'exportingSubscribers',
				'mergingDestination',
				'mergingSource',
				'cancelingExportingSubscribers',
				'inCreationProcess',
				'sending',
				'inDeletingProcess',
				'deleted',
				'blocked',
			])
			.optional(),
		subscribersCount: z.number().int().optional(),
		creationDate: z.string().optional(),
		deletedDate: z.string().optional(),
		hasScheduledCampaigns: z.boolean().nullable().optional(),
		hasFormsAssociated: z.boolean().nullable().optional(),
		hasSegmentsAssociated: z.boolean().nullable().optional(),
		hasEventsAssociated: z.boolean().nullable().optional(),
		hasSynchronizationAssociated: z.boolean().optional(),
		removeAssociation: z.boolean().optional(),
		_links: LinksSchema,
	})
	.passthrough();

export const MessageResultSchema = z
	.object({
		message: z.string(),
		_links: LinksSchema,
	})
	.passthrough();
export const CreationResultSchema = MessageResultSchema.extend({
	createdResourceId: z.string().optional(),
});
export const ListCollectionSchema = z
	.object({
		items: z.array(ListSchema),
		pageSize: z.number().int().optional(),
		itemsCount: z.number().int().optional(),
		currentPage: z.number().int().optional(),
		pagesCount: z.number().int().optional(),
		lastPage: z.number().int().optional(),
		_links: LinksSchema,
	})
	.passthrough();

const account = { accountName: PathSegmentSchema };
const listId = { listId: z.number().int() };
const origin = { 'X-Doppler-List-Origin': z.string().optional() };
export const listInputSchemas = {
	list: z.object({
		...account,
		page: z.number().int().optional(),
		per_page: z.number().int().optional(),
		state: z.enum(['active', 'inactive', 'all']).optional(),
		listName: z.string().optional(),
	}),
	create: z.object({
		...account,
		list: z
			.object({
				name: z.string().min(1).max(100),
				removeAssociation: z.boolean().optional(),
			})
			.passthrough(),
		...origin,
	}),
	get: z.object({ ...account, ...listId }),
	update: z.object({
		...account,
		...listId,
		list: z
			.object({
				name: z.string().min(1).max(100),
				removeAssociation: z.boolean().optional(),
			})
			.passthrough(),
		...origin,
	}),
	delete: z.object({ ...account, ...listId }),
} as const;
export const listOutputSchemas = {
	list: ListCollectionSchema,
	create: CreationResultSchema,
	get: ListSchema,
	update: MessageResultSchema,
	delete: MessageResultSchema,
} as const;

const FieldValueSchema = z
	.object({
		name: z.string().max(50),
		value: z.string().max(400),
		predefined: z.boolean().optional(),
		private: z.boolean().optional(),
		readonly: z.boolean().optional(),
		type: z
			.enum([
				'boolean',
				'number',
				'string',
				'date',
				'email',
				'gender',
				'country',
				'consent',
				'phone',
				'permission',
			])
			.optional(),
		permissionHTML: z.string().optional(),
	})
	.passthrough();
export const SubscriberSchema = z
	.object({
		email: z.string().max(100),
		fields: z.array(FieldValueSchema).optional(),
		belongsToLists: z.array(z.string()).optional(),
		listsHistory: z
			.array(
				z
					.object({
						date: z.string().optional(),
						listId: z.number().int().optional(),
						status: z.enum(['added', 'deleted']).optional(),
						_links: LinksSchema,
					})
					.passthrough(),
			)
			.optional(),
		unsubscribedDate: z.string().nullable().optional(),
		unsubscriptionDate: z.string().nullable().optional(),
		unsubscriptionType: z
			.enum([
				'hardBounce',
				'softBounce',
				'neverOpen',
				'abuseLink',
				'feedbackLoop',
				'internalPolicies',
				'manual',
			])
			.nullable()
			.optional(),
		manualUnsubscriptionReason: z
			.enum([
				'administrative',
				'subscriberRequestNeverSubscribed',
				'subscriberRequestNotInterestingContent',
				'subscriberRequestIsSpam',
				'subscriberRequestTooManyEmails',
				'subscriberRequestOther',
			])
			.nullable()
			.optional(),
		unsubscriptionComment: z.string().nullable().optional(),
		status: z
			.enum(['active', 'pending', 'unsubscribed', 'standBy', 'archived'])
			.nullable()
			.optional(),
		canBeReactivated: z.boolean().nullable().optional(),
		isBeingReactivated: z.boolean().nullable().optional(),
		userId: z.number().int().optional(),
		score: z.number().int().optional(),
		_links: LinksSchema,
	})
	.passthrough();
export const SubscriberCollectionSchema = ListCollectionSchema.extend({
	items: z.array(SubscriberSchema),
});
const FieldHistorySchema = z
	.object({
		date: z.string().optional(),
		originIP: z.string().optional(),
		value: z.string().optional(),
		_links: LinksSchema,
	})
	.passthrough();
export const CampaignDeliverySchema = z
	.object({
		campaignId: z.number().int().optional(),
		campaignName: z.string().optional(),
		campaignSubject: z.string().optional(),
		subscriberEmail: z.string().optional(),
		deliveryStatus: z
			.enum(['opened', 'notOpened', 'hardBounced', 'softBounced'])
			.nullable()
			.optional(),
		lastOpenDate: z.string().optional(),
		sentDate: z.string().optional(),
		opensCount: z.number().int().optional(),
		clicksCount: z.number().int().optional(),
		isSendingNow: z.boolean().optional(),
		campaignType: z.string().optional(),
		_links: LinksSchema,
	})
	.passthrough();
const paging = {
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
};
const subscriberOrigin = {
	'X-Doppler-Subscriber-Origin': z.string().optional(),
};
// Doppler defines email path parameters as strings; allow apostrophes while
// retaining path-segment safeguards and leaving address validation to Doppler.
const email = {
	email: z
		.string()
		.min(1)
		.refine(
			(value) => value !== '.' && value !== '..' && !/[\\/\"]/.test(value),
			'Invalid email path segment',
		),
};
export const ImportSubscribersSchema = z
	.object({
		items: z
			.array(
				z.object({
					email: z.string(),
					fields: z.array(FieldValueSchema).optional(),
				}),
			)
			.min(1)
			.max(10000),
		fields: z.array(z.string()),
		callback: z.string().max(500).optional(),
		enableEmailNotification: z.boolean().nullable().optional(),
	})
	.passthrough();
export const subscriberInputSchemas = {
	list: z.object({
		...account,
		...paging,
		keyword: z.string().optional(),
		updatedAfter: z.string().optional(),
		resumeFrom: z.number().int().optional(),
		withFieldType: z.string().optional(),
	}),
	listForList: z.object({ ...account, ...listId, ...paging }),
	get: z.object({ ...account, ...email }),
	exists: z.object({ ...account, ...email }),
	create: z.object({
		...account,
		subscriber: SubscriberSchema,
		...subscriberOrigin,
	}),
	associate: z.object({
		...account,
		...listId,
		subscriber: SubscriberSchema,
		...subscriberOrigin,
		allowReSubscription: z.boolean().optional(),
	}),
	removeFromList: z.object({ ...account, ...listId, ...email }),
	archive: z.object({ ...account, ...email }),
	listUnsubscribed: z.object({
		...account,
		...paging,
		from: z.string().optional(),
		to: z.string().optional(),
	}),
	unsubscribe: z.object({ ...account, subscriber: SubscriberSchema }),
	import: z.object({
		...account,
		subscribers: ImportSubscribersSchema,
		...subscriberOrigin,
	}),
	importToList: z.object({
		...account,
		...listId,
		subscribers: ImportSubscribersSchema,
		...subscriberOrigin,
	}),
	importCsv: z.object({
		...account,
		...listId,
		Body: z.string(),
		...subscriberOrigin,
	}),
	doubleOptIn: z.object({
		...account,
		...listId,
		templateId: z.number().int(),
		subscriber: SubscriberSchema,
		...subscriberOrigin,
	}),
	listByOrigin: z.object({
		origin: PathSegmentSchema,
		...paging,
		updatedAfter: z.string().optional(),
		withFieldType: z.string().optional(),
		withFieldName: z.string().optional(),
	}),
	permissionsHistory: z.object({
		...account,
		...email,
		fieldName: PathSegmentSchema,
		...paging,
	}),
	deliveries: z.object({ ...account, ...email, ...paging }),
	importUnsubscribed: z.object({
		...account,
		subscribers: z.object({
			items: z
				.array(
					z.object({
						email: z.string(),
						manualUnsubscriptionReason:
							SubscriberSchema.shape.manualUnsubscriptionReason,
						unsubscriptionComment: z.string().max(200).nullable().optional(),
					}),
				)
				.min(1)
				.max(100),
		}),
	}),
} as const;
export const subscriberOutputSchemas = {
	list: SubscriberCollectionSchema,
	listForList: SubscriberCollectionSchema,
	get: SubscriberSchema,
	exists: z.void(),
	create: MessageResultSchema,
	associate: MessageResultSchema,
	removeFromList: MessageResultSchema,
	archive: MessageResultSchema,
	listUnsubscribed: SubscriberCollectionSchema,
	unsubscribe: MessageResultSchema,
	import: CreationResultSchema,
	importToList: CreationResultSchema,
	importCsv: CreationResultSchema,
	doubleOptIn: MessageResultSchema,
	listByOrigin: SubscriberCollectionSchema,
	permissionsHistory: ListCollectionSchema.extend({
		items: z.array(FieldHistorySchema),
	}),
	deliveries: ListCollectionSchema.extend({
		items: z.array(CampaignDeliverySchema),
	}),
	importUnsubscribed: MessageResultSchema,
} as const;

// Lists and subscribers share these common resource schemas; the full endpoint
// registry is exported from the plugin entry point.
export const DopplerMarketingAutomationEndpointInputSchemas = {
	lists: listInputSchemas,
	subscribers: subscriberInputSchemas,
} as const;
export const DopplerMarketingAutomationEndpointOutputSchemas = {
	lists: listOutputSchemas,
	subscribers: subscriberOutputSchemas,
} as const;
