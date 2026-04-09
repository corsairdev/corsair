import z from 'zod';

export const SharepointList = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	itemCount: z.number().optional(),
	baseType: z.number().optional(),
	baseTemplate: z.number().optional(),
	created: z.string().optional(),
	lastItemModifiedDate: z.string().optional(),
	lastItemUserModifiedDate: z.string().optional(),
	hidden: z.boolean().optional(),
	serverRelativeUrl: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	modifiedAt: z.coerce.date().nullable().optional(),
});

export const SharepointItem = z.object({
	id: z.string(),
	listId: z.string().optional(),
	listTitle: z.string().optional(),
	title: z.string().optional(),
	authorId: z.number().optional(),
	editorId: z.number().optional(),
	created: z.string().optional(),
	modified: z.string().optional(),
	fileSystemObjectType: z.number().optional(),
	serverRedirectedEmbedUrl: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	modifiedAt: z.coerce.date().nullable().optional(),
});

export const SharepointFile = z.object({
	id: z.string(),
	name: z.string().optional(),
	serverRelativeUrl: z.string().optional(),
	timeCreated: z.string().optional(),
	timeLastModified: z.string().optional(),
	length: z.string().optional(),
	majorVersion: z.number().optional(),
	minorVersion: z.number().optional(),
	checkOutType: z.number().optional(),
	eTag: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	modifiedAt: z.coerce.date().nullable().optional(),
});

export const SharepointFolder = z.object({
	id: z.string(),
	name: z.string().optional(),
	serverRelativeUrl: z.string().optional(),
	itemCount: z.number().optional(),
	timeCreated: z.string().optional(),
	timeLastModified: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	modifiedAt: z.coerce.date().nullable().optional(),
});

export const SharepointUser = z.object({
	id: z.string(),
	loginName: z.string().optional(),
	email: z.string().optional(),
	title: z.string().optional(),
	principalType: z.number().optional(),
	isSiteAdmin: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SharepointSite = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	serverRelativeUrl: z.string().optional(),
	created: z.string().optional(),
	lastItemUserModifiedDate: z.string().optional(),
	webTemplate: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type SharepointList = z.infer<typeof SharepointList>;
export type SharepointItem = z.infer<typeof SharepointItem>;
export type SharepointFile = z.infer<typeof SharepointFile>;
export type SharepointFolder = z.infer<typeof SharepointFolder>;
export type SharepointUser = z.infer<typeof SharepointUser>;
export type SharepointSite = z.infer<typeof SharepointSite>;
