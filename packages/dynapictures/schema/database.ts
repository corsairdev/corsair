import { z } from 'zod';

/** Official workspace object from GET/POST/PUT/DELETE /workspaces. */
export const DynapicturesWorkspace = z
	.object({
		id: z.string().describe('The ID of a workspace.'),
		name: z.string().describe('The name of a workspace.'),
		dateCreated: z.string().describe('Creation date of a workspace.'),
		dateUpdated: z.string().describe('Last modification date of a workspace.'),
		memberRole: z.string().nullable().optional(),
	})
	.loose();

export type DynapicturesWorkspace = z.infer<typeof DynapicturesWorkspace>;

/** Official layer object from GET /templates. */
export const DynapicturesTemplateLayer = z
	.object({
		type: z.string(),
		name: z.string(),
		width: z.string().optional(),
		height: z.string().optional(),
		text: z.string().nullable().optional(),
	})
	.loose();

export type DynapicturesTemplateLayer = z.infer<
	typeof DynapicturesTemplateLayer
>;

/** Official template object from GET /templates. */
export const DynapicturesTemplate = z
	.object({
		id: z.string().describe('The ID of an image template.'),
		name: z.string().describe('The name of the template.'),
		thumbnail: z
			.string()
			.describe(
				'Thumbnail URL of the template, fitting into 300x300px square.',
			),
		dateCreated: z.string().describe('Creation date of the template.'),
		dateUpdated: z.string().describe('Last modification date of the template.'),
		layers: z
			.array(DynapicturesTemplateLayer)
			.optional()
			.describe('Template layers with type, name, width, and height.'),
	})
	.loose();

export type DynapicturesTemplate = z.infer<typeof DynapicturesTemplate>;

/** Official media asset from POST /media/{workspaceId}/assets. */
export const DynapicturesMediaAsset = z
	.object({
		id: z.string().describe('The ID of an asset.'),
		folder: z
			.boolean()
			.describe('Whether this asset is a folder instead of an image.'),
		mimeType: z.string().describe('MIME type of an image.'),
		filename: z.string().describe('Filename of an image.'),
		size: z.number().describe('Image size in bytes.'),
		animated: z.boolean().nullable().optional(),
		url: z.string().describe('Link to an image.'),
		thumbnailUrl: z.string().describe('Link to an image thumbnail.'),
		dateCreated: z.string().describe('Creation date of an asset.'),
		dateUpdated: z.string().describe('Last modification date of an asset.'),
	})
	.loose();

export type DynapicturesMediaAsset = z.infer<typeof DynapicturesMediaAsset>;

/** Official webhook object from POST /hooks. */
export const DynapicturesWebhook = z
	.object({
		uid: z.string(),
		eventType: z.string(),
		targetUrl: z.string(),
		designUid: z.string().optional(),
		dateCreated: z.string().optional(),
	})
	.loose();

export type DynapicturesWebhook = z.infer<typeof DynapicturesWebhook>;
