import { ScreenshotOneSchema } from './schema';
import { ScreenshotOneDeviceEntity } from './schema/database';

describe('ScreenshotOne schema', () => {
	it('declares usage and devices', () => {
		expect(ScreenshotOneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(ScreenshotOneSchema.entities).sort()).toEqual([
			'devices',
			'usage',
		]);
	});

	it('rejects a device with no id', () => {
		expect(ScreenshotOneDeviceEntity.safeParse({ name: 'phone' }).success).toBe(
			false,
		);
	});
});
