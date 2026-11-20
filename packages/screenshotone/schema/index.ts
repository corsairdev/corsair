import {
	ScreenshotOneDeviceEntity,
	ScreenshotOneUsageEntity,
} from './database';

export const ScreenshotOneSchema = {
	version: '1.0.0',
	entities: {
		usage: ScreenshotOneUsageEntity,
		devices: ScreenshotOneDeviceEntity,
	},
} as const;
