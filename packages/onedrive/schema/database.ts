import { z } from 'zod';

export const OnedriveDriveItem = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number().optional(),
	webUrl: z.string().optional(),
	eTag: z.string().optional(),
	cTag: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
	createdBy: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
	lastModifiedBy: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
	parentReference: z
		.object({
			driveId: z.string().optional(),
			id: z.string().optional(),
			path: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
	file: z
		.object({
			mimeType: z.string().optional(),
		})
		.optional(),
	folder: z
		.object({
			childCount: z.number().optional(),
		})
		.optional(),
	deleted: z
		.object({
			state: z.string().optional(),
		})
		.optional(),
});

export const OnedriveDrive = z.object({
	id: z.string(),
	name: z.string(),
	driveType: z.string(),
	webUrl: z.string(),
	description: z.string().optional(),
	createdDateTime: z.string(),
	lastModifiedDateTime: z.string(),
	owner: z
		.object({
			user: z
				.object({
					id: z.string().optional(),
					displayName: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	quota: z
		.object({
			deleted: z.number().optional(),
			remaining: z.number().optional(),
			total: z.number().optional(),
			used: z.number().optional(),
			state: z.string().optional(),
		})
		.optional(),
});

export type OnedriveDriveItem = z.infer<typeof OnedriveDriveItem>;
export type OnedriveDrive = z.infer<typeof OnedriveDrive>;
