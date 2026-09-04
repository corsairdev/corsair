import type { z } from 'zod';
import {
	ContentItemSchema,
	ContentModelSchema,
	PageModuleSchema,
	PageSchema,
	SitemapNodeSchema,
	SyncItemSchema,
	SyncPageSchema,
} from '../endpoints/types';

export const AgilityCmsContentItem = ContentItemSchema;
export type AgilityCmsContentItem = z.infer<typeof AgilityCmsContentItem>;

export const AgilityCmsPage = PageSchema;
export type AgilityCmsPage = z.infer<typeof AgilityCmsPage>;

export const AgilityCmsContentModel = ContentModelSchema;
export type AgilityCmsContentModel = z.infer<typeof AgilityCmsContentModel>;

export const AgilityCmsPageModule = PageModuleSchema;
export type AgilityCmsPageModule = z.infer<typeof AgilityCmsPageModule>;

export const AgilityCmsSitemapNode = SitemapNodeSchema;
export type AgilityCmsSitemapNode = z.infer<typeof AgilityCmsSitemapNode>;

export const AgilityCmsSyncItem = SyncItemSchema;
export type AgilityCmsSyncItem = z.infer<typeof AgilityCmsSyncItem>;

export const AgilityCmsSyncPage = SyncPageSchema;
export type AgilityCmsSyncPage = z.infer<typeof AgilityCmsSyncPage>;
