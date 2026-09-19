import { z } from 'zod';

export const WebflowSite = z
	.object({
		id: z.string().optional(),
		workspaceId: z.string().optional(),
		displayName: z.string().optional(),
		shortName: z.string().optional(),
		previewUrl: z.string().nullable().optional(),
		timeZone: z.string().optional(),
		lastPublished: z.string().nullable().optional(),
		createdOn: z.string().optional(),
	})
	.passthrough();

export const WebflowCollection = z
	.object({
		id: z.string().optional(),
		siteId: z.string().optional(),
		displayName: z.string().optional(),
		singularName: z.string().optional(),
		slug: z.string().optional(),
		createdOn: z.string().optional(),
		lastUpdated: z.string().optional(),
	})
	.passthrough();

export const WebflowCollectionItem = z
	.object({
		id: z.string().optional(),
		// not part of the webflow item response; stamped from the request at
		// cache time so collection deletes can cascade-evict cached items
		collectionId: z.string().optional(),
		cmsLocaleId: z.string().nullable().optional(),
		lastPublished: z.string().nullable().optional(),
		lastUpdated: z.string().optional(),
		createdOn: z.string().optional(),
		isArchived: z.boolean().optional(),
		isDraft: z.boolean().optional(),
		fieldData: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const WebflowAsset = z
	.object({
		id: z.string().optional(),
		contentType: z.string().optional(),
		size: z.number().optional(),
		siteId: z.string().optional(),
		hostedUrl: z.string().optional(),
		originalFileName: z.string().optional(),
		displayName: z.string().optional(),
		createdOn: z.string().optional(),
	})
	.passthrough();

export const WebflowAssetFolder = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		parentFolder: z.string().nullable().optional(),
		siteId: z.string().optional(),
		createdOn: z.string().optional(),
		lastUpdated: z.string().optional(),
	})
	.passthrough();

export const WebflowPage = z
	.object({
		id: z.string().optional(),
		siteId: z.string().optional(),
		title: z.string().optional(),
		slug: z.string().nullable().optional(),
		parentId: z.string().nullable().optional(),
		collectionId: z.string().nullable().optional(),
		createdOn: z.string().optional(),
		lastUpdated: z.string().optional(),
	})
	.passthrough();

export const WebflowOrder = z
	.object({
		orderId: z.string().optional(),
		status: z.string().optional(),
		acceptedOn: z.string().nullable().optional(),
		fulfilledOn: z.string().nullable().optional(),
		refundedOn: z.string().nullable().optional(),
		customerInfo: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const WebflowWebhook = z
	.object({
		id: z.string().optional(),
		triggerType: z.string().optional(),
		siteId: z.string().optional(),
		url: z.string().optional(),
		workspaceId: z.string().optional(),
		createdOn: z.string().optional(),
	})
	.passthrough();

export type WebflowSite = z.infer<typeof WebflowSite>;
export type WebflowCollection = z.infer<typeof WebflowCollection>;
export type WebflowCollectionItem = z.infer<typeof WebflowCollectionItem>;
export type WebflowAsset = z.infer<typeof WebflowAsset>;
export type WebflowAssetFolder = z.infer<typeof WebflowAssetFolder>;
export type WebflowPage = z.infer<typeof WebflowPage>;
export type WebflowOrder = z.infer<typeof WebflowOrder>;
export type WebflowWebhook = z.infer<typeof WebflowWebhook>;
