import { z } from 'zod';
import {
	CampaignDeliverySchema,
	CreationResultSchema,
	LinksSchema,
	ListCollectionSchema,
	MessageResultSchema,
	PathSegmentSchema,
	SubscriberCollectionSchema,
} from './types';

const account = { accountName: PathSegmentSchema };
const campaign = { ...account, campaignId: z.number().int() };
const paging = {
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
};
const CampaignSchema = z
	.object({
		campaignId: z.number().int().optional(),
		name: z.string().max(100),
		fromName: z.string().max(100),
		fromEmail: z.string().max(100),
		subject: z.string().max(100),
		scheduledDate: z.string().nullable().optional(),
		recipientsRequired: z.boolean().nullable().optional(),
		contentRequired: z.boolean().nullable().optional(),
		preheader: z.string().nullable().optional(),
		replyTo: z.string().nullable().optional(),
		textCampaign: z.boolean().nullable().optional(),
		status: z.enum(['draft', 'scheduled', 'shipping', 'shipped']).optional(),
		_links: LinksSchema,
	})
	.passthrough();
const RecipientSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
		_links: LinksSchema,
	})
	.passthrough();
const RecipientsSchema = z
	.object({
		lists: z.array(RecipientSchema).optional(),
		segments: z.array(RecipientSchema).optional(),
		_links: LinksSchema,
	})
	.passthrough();
const TextSchema = z
	.object({ text: z.string().max(1048576), _links: LinksSchema })
	.passthrough();
const ShippingSchema = z
	.object({
		shippingId: z.string().nullable().optional(),
		type: z.enum(['immediate', 'scheduled']),
		scheduledDate: z.string().nullable().optional(),
		status: z
			.enum(['waiting', 'processing', 'sending', 'sent', 'closed'])
			.nullable()
			.optional(),
		_links: LinksSchema,
	})
	.passthrough();
const SocialSchema = z
	.object({
		share: z.array(
			z.enum([
				'facebook',
				'twitter',
				'googleplus',
				'linkedin',
				'pinterest',
				'whatsapp',
			]),
		),
		likes: z.array(z.enum(['facebook', 'googleplus'])),
		facebookWallPost: z.boolean(),
		facebookPagesPost: z.array(z.object({ pageId: z.string().max(50) })),
		twitterPost: z.boolean(),
		linkedInPost: z.boolean(),
		rssPost: z.boolean(),
		rssDescription: z.string().nullable().optional(),
		_links: LinksSchema,
	})
	.passthrough();
const SummarySchema = z
	.object({
		totalRecipients: z.number().int().optional(),
		successFullDeliveries: z.number().int().optional(),
		timesForwarded: z.number().int().optional(),
		totalTimesOpened: z.number().int().optional(),
		lastOpenDate: z.string().optional(),
		uniqueClicks: z.number().int().optional(),
		uniqueOpens: z.number().int().optional(),
		totalUnopened: z.number().int().optional(),
		totalHardBounces: z.number().int().optional(),
		totalSoftBounces: z.number().int().optional(),
		totalClicks: z.number().int().optional(),
		lastClickDate: z.string().optional(),
		totalUnsubscribers: z.number().int().optional(),
		campaignStatus: z
			.enum(['draft', 'scheduled', 'shipping', 'shipped'])
			.optional(),
		totalShipped: z.number().int().optional(),
		_links: LinksSchema,
	})
	.passthrough();

export const campaignInputSchemas = {
	list: z.object({
		...account,
		...paging,
		state: z.enum(['draft', 'scheduled', 'shipping', 'shipped']).optional(),
		scheduledDateFrom: z.string().optional(),
		scheduledDateTo: z.string().optional(),
	}),
	create: z.object({ ...account, campaign: CampaignSchema }),
	get: z.object(campaign),
	update: z.object({ ...campaign, campaign: CampaignSchema }),
	delete: z.object(campaign),
	approve: z.object(campaign),
	deliveries: z.object({
		...campaign,
		...paging,
		continuationToken: z.number().int().optional(),
		orderBy: z.enum(['subcriber', 'interactionDate']).optional(),
	}),
	preview: z.object({
		...campaign,
		Accept: z
			.enum(['text/html', 'image/jpeg', 'image/png', 'image/svg+xml'])
			.optional(),
	}),
	resultsSummary: z.object(campaign),
	unsubscribed: z.object({
		...campaign,
		...paging,
		from: z.string().optional(),
		to: z.string().optional(),
	}),
	getContent: z.object(campaign),
	updateContent: z.object({ ...campaign, Body: z.string() }),
	getTextAlternative: z.object(campaign),
	updateTextAlternative: z.object({
		...campaign,
		textAlternativeContent: TextSchema,
	}),
	deleteTextAlternative: z.object(campaign),
	getRecipients: z.object(campaign),
	updateRecipients: z.object({ ...campaign, recipients: RecipientsSchema }),
	createShipping: z.object({ ...campaign, shipping: ShippingSchema }),
	getShipping: z.object({ ...campaign, shippingId: PathSegmentSchema }),
	deleteShipping: z.object({ ...campaign, shippingId: PathSegmentSchema }),
	getSocial: z.object(campaign),
	updateSocial: z.object({ ...campaign, socialMediaPreferences: SocialSchema }),
} as const;
export const campaignOutputSchemas = {
	list: ListCollectionSchema.extend({ items: z.array(CampaignSchema) }),
	create: CreationResultSchema,
	get: CampaignSchema,
	update: MessageResultSchema,
	delete: MessageResultSchema,
	approve: MessageResultSchema,
	deliveries: ListCollectionSchema.extend({
		items: z.array(CampaignDeliverySchema),
	}),
	preview: z.union([z.string(), z.instanceof(Uint8Array)]),
	resultsSummary: SummarySchema,
	unsubscribed: SubscriberCollectionSchema,
	getContent: z.string(),
	updateContent: MessageResultSchema,
	getTextAlternative: TextSchema,
	updateTextAlternative: MessageResultSchema,
	deleteTextAlternative: MessageResultSchema,
	getRecipients: RecipientsSchema,
	updateRecipients: MessageResultSchema,
	createShipping: CreationResultSchema,
	getShipping: ShippingSchema,
	deleteShipping: MessageResultSchema,
	getSocial: SocialSchema,
	updateSocial: MessageResultSchema,
} as const;
