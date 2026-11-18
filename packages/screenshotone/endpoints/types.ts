import { z } from 'zod';
import {
	ScreenshotOneDeviceEntity,
	ScreenshotOneUsageEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({}).strict();
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

/** Page rendering options shared by take, animate and bulk. https://screenshotone.com/docs/options/ */
const RenderOptionsSchema = z.object({
	viewport_width: z.number().int().min(1).optional(),
	viewport_height: z.number().int().min(1).optional(),
	device_scale_factor: z.number().min(1).max(5).optional(),
	/** A device id from devices.list, e.g. iphone_13_pro_max. */
	viewport_device: z.string().min(1).optional(),
	viewport_mobile: z.boolean().optional(),
	delay: z.number().int().min(0).max(30).optional(),
	wait_until: z
		.array(z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']))
		.min(1)
		.optional(),
	timeout: z.number().int().min(1).max(90).optional(),
	block_ads: z.boolean().optional(),
	block_cookie_banners: z.boolean().optional(),
	block_trackers: z.boolean().optional(),
	block_chats: z.boolean().optional(),
	dark_mode: z.boolean().optional(),
});

const ImageOptionsSchema = RenderOptionsSchema.extend({
	format: z
		.enum([
			'png',
			'jpeg',
			'jpg',
			'webp',
			'gif',
			'jp2',
			'tiff',
			'avif',
			'heif',
			'pdf',
			'html',
			'markdown',
		])
		.optional(),
	full_page: z.boolean().optional(),
	/** CSS selector of one element to capture. */
	selector: z.string().min(1).optional(),
	image_quality: z.number().int().min(0).max(100).optional(),
	omit_background: z.boolean().optional(),
	cache: z.boolean().optional(),
	cache_ttl: z.number().int().min(14400).max(2592000).optional(),
});

export const TakeInputSchema = ImageOptionsSchema.extend({
	url: z.string().min(1).optional(),
	/** HTML to render instead of a url. */
	html: z.string().min(1).optional(),
	/** Markdown to render instead of a url. */
	markdown: z.string().min(1).optional(),
})
	.strict()
	.refine(
		(value) =>
			[value.url, value.html, value.markdown].filter(Boolean).length === 1,
		{
			message: 'Pass exactly one of url, html or markdown',
		},
	);
export type TakeInput = z.infer<typeof TakeInputSchema>;

export const AnimateInputSchema = RenderOptionsSchema.extend({
	url: z.string().min(1),
	scenario: z.enum(['default', 'scroll']).optional(),
	duration: z.number().int().min(1).max(30).optional(),
	format: z.enum(['mp4', 'mov', 'avi', 'webm', 'gif']).optional(),
}).strict();
export type AnimateInput = z.infer<typeof AnimateInputSchema>;

export const BulkInputSchema = z.object({
	urls: z.array(z.string().min(1)).min(1).max(20),
	execute: z.boolean().optional(),
	/** Options applied to every url, e.g. { format: 'png', cache: true }. */
	options: ImageOptionsSchema.strict().optional(),
});
export type BulkInput = z.infer<typeof BulkInputSchema>;

export const UsageResponseSchema = z.object({
	usage: ScreenshotOneUsageEntity,
});
export type UsageResponse = z.infer<typeof UsageResponseSchema>;

export const DeviceListResponseSchema = z.object({
	devices: z.array(ScreenshotOneDeviceEntity),
});
export type DeviceListResponse = z.infer<typeof DeviceListResponseSchema>;

export const ShotResponseSchema = z.object({
	screenshotUrl: z.string().min(1),
	/** Set when cache is true. */
	cacheUrl: z.string().optional(),
});
export type ShotResponse = z.infer<typeof ShotResponseSchema>;

export const BulkResponseSchema = z.object({
	/** The /take url built for each request, with access_key removed. */
	urls: z.array(z.string().min(1)),
	/** Per-url outcome; only when execute is true. */
	results: z
		.array(
			z.object({
				url: z.string(),
				isSuccessful: z.boolean().optional(),
				status: z.number().optional(),
			}),
		)
		.optional(),
});
export type BulkResponse = z.infer<typeof BulkResponseSchema>;

export const EndpointInputSchemas = {
	'usage.get': EmptyInputSchema,
	'devices.list': EmptyInputSchema,
	'shots.take': TakeInputSchema,
	'shots.animate': AnimateInputSchema,
	'shots.bulk': BulkInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'usage.get': UsageResponseSchema,
	'devices.list': DeviceListResponseSchema,
	'shots.take': ShotResponseSchema,
	'shots.animate': ShotResponseSchema,
	'shots.bulk': BulkResponseSchema,
} as const;
