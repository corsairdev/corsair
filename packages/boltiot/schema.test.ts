import { BoltIotCommand, BoltIotDevice, BoltIotSchema } from './schema';

describe('BoltIot schema', () => {
	it('declares a semver version', () => {
		expect(BoltIotSchema.version).toBeDefined();
		expect(BoltIotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Cloud entities', () => {
		expect(BoltIotSchema.entities.devices).toBe(BoltIotDevice);
		expect(BoltIotSchema.entities.commands).toBe(BoltIotCommand);
	});

	it('parses official Python SDK command envelopes', () => {
		expect(
			BoltIotCommand.parse({ success: '1', value: 'alive' }),
		).toMatchObject({ success: '1', value: 'alive' });
		expect(
			BoltIotCommand.parse({
				success: '1',
				value: 'online',
				time: 'Sun 2018-05-06 08:14:43 UTC',
			}),
		).toMatchObject({ value: 'online' });
	});

	it('parses live Cloud numeric success and getDevices value object', () => {
		expect(
			BoltIotCommand.parse({
				success: 1,
				value: { device_list: [], device_count: 0 },
			}),
		).toMatchObject({ success: 1 });
	});

	it('parses official deviceName identifiers', () => {
		expect(BoltIotDevice.parse({ deviceName: 'BOLT1234567' }).deviceName).toBe(
			'BOLT1234567',
		);
	});
});
