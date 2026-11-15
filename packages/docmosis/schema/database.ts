import { z } from 'zod';

const BooleanLike = z.union([z.boolean(), z.string()]);
const NumberLike = z.union([z.number(), z.string()]);

/**
 * Template, as returned by listTemplates and getTemplateDetails. `id` is the template path.
 * https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf (2.7, 2.9)
 */
export const DocmosisTemplate = z.object({
	id: z.string(),
	name: z.string(),
	lastModifiedMillisSinceEpoch: z.number().optional(),
	lastModifiedISO8601: z.string().optional(),
	sizeBytes: z.number().optional(),
	templatePlainTextFieldPrefix: z.string().optional(),
	templatePlainTextFieldSuffix: z.string().optional(),
	templateDevMode: z.boolean().optional(),
	templateHasErrors: z.boolean().optional(),
	templateDescription: z.string().optional(),
	md5: z.string().optional(),
});

/**
 * Stored image, as returned by listImages. `id` is the image path.
 * https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf (2.15)
 */
export const DocmosisImage = z.object({
	id: z.string(),
	name: z.string(),
	lastModifiedMillisSinceEpoch: z.number().optional(),
	lastModifiedISO8601: z.string().optional(),
	sizeBytes: z.number().optional(),
	md5: z.string().optional(),
});

/**
 * Template batch upload job (`jobStatus`). `id` is the userJobId.
 * https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf (2.12)
 */
export const DocmosisBatchUploadJob = z.object({
	id: z.string(),
	isEnded: z.boolean().optional(),
	status: z.string().optional(),
	type: z.string().optional(),
	processingMsg: z.string().optional(),
	startedTime: z.number().optional(),
	finishedTime: z.number().optional(),
	duration: z.number().optional(),
	pctComplete: z.number().optional(),
	jobResult: z
		.object({
			errorsDetected: z.boolean().optional(),
			uploadedIntoFolder: z.string().optional(),
			devMode: z.boolean().optional(),
			uploadedTotalCount: z.number().optional(),
			processedWithErrorsCount: z.number().optional(),
			processedWithoutErrorsCount: z.number().optional(),
		})
		.optional(),
});

/**
 * Environment, as returned by environment/summary (`accountEnvironmentSummary`). `id` is the environment name.
 * https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf (2.24)
 */
export const DocmosisEnvironment = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	ready: BooleanLike.optional(),
	isActivated: BooleanLike.optional(),
	isDisabled: BooleanLike.optional(),
	isDeleted: BooleanLike.optional(),
	pageQuota: z
		.object({
			used: NumberLike.optional(),
			quota: NumberLike.optional(),
			pctUsed: NumberLike.optional(),
			pctUsedStr: z.string().optional(),
			isHardLimited: BooleanLike.optional(),
		})
		.optional(),
	planName: z.string().optional(),
});

/**
 * Metadata of a document produced by render. The document bytes are returned to the caller, not stored.
 * https://resources.docmosis.com/Documentation/Cloud/DWS4/Cloud-Web-Services-Guide-DWS4.pdf (2.4)
 */
export const DocmosisRender = z.object({
	id: z.string(),
	templateName: z.string(),
	outputName: z.string(),
	outputFormat: z.string().optional(),
	contentType: z.string(),
	byteLength: z.number(),
	devMode: z.boolean().optional(),
	tags: z.string().optional(),
	createdAt: z.coerce.date(),
});
