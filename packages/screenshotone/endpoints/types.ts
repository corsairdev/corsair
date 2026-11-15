import { z } from 'zod';
import {
	ScreenshotOneDeviceEntity,
	ScreenshotOneUsageEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const UrlInputSchema = z.object({
	url: z.string().min(1),
	scenario: z.string().min(1).optional(),
	duration: z.number().int().min(1).max(30).optional(),
	format: z.string().min(1).optional(),
});
export type UrlInput = z.infer<typeof UrlInputSchema>;

export const BulkInputSchema = z.object({
	urls: z.array(z.string().min(1)).min(1).max(20),
	execute: z.boolean().optional(),
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
});
export type ShotResponse = z.infer<typeof ShotResponseSchema>;

export const BulkResponseSchema = z.object({
	urls: z.array(z.string().min(1)),
});
export type BulkResponse = z.infer<typeof BulkResponseSchema>;

export const EndpointInputSchemas = {
	'usage.get': EmptyInputSchema,
	'devices.list': EmptyInputSchema,
	'shots.take': UrlInputSchema,
	'shots.animate': UrlInputSchema,
	'shots.bulk': BulkInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'usage.get': UsageResponseSchema,
	'devices.list': DeviceListResponseSchema,
	'shots.take': ShotResponseSchema,
	'shots.animate': ShotResponseSchema,
	'shots.bulk': BulkResponseSchema,
} as const;
