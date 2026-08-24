import {
	AblyEndpointInputSchemas,
	AblyEndpointOutputSchemas,
} from './endpoints/types';
import { AblySchema } from './schema';

describe('Ably schema', () => {
	it('declares a semver version', () => {
		expect(AblySchema.version).toBeDefined();
		expect(AblySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AblySchema.entities).toBe('object');
		expect(AblySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AblySchema.entities))).toBe(true);
		for (const entity of Object.values(AblySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('accepts listChannels by=id names and by=value details', () => {
		expect(
			AblyEndpointInputSchemas.listChannels.parse({ by: 'id', limit: 10 }),
		).toEqual({ by: 'id', limit: 10 });
		expect(
			AblyEndpointInputSchemas.listChannels.safeParse({ by: 'occupancy' })
				.success,
		).toBe(false);
		expect(
			AblyEndpointOutputSchemas.listChannels.parse({
				items: ['room-a', 'room-b'],
			}),
		).toEqual({ items: ['room-a', 'room-b'] });
		expect(
			AblyEndpointOutputSchemas.listChannels.parse({
				items: [{ channelId: 'room-a', status: { isActive: true } }],
				next: { limit: '10', by: 'id' },
			}),
		).toEqual({
			items: [{ channelId: 'room-a', status: { isActive: true } }],
			next: { limit: '10', by: 'id' },
		});
	});
	it('requires exactly one unregisterAllPushDevices filter', () => {
		expect(
			AblyEndpointInputSchemas.unregisterAllPushDevices.parse({
				deviceId: 'device-1',
			}),
		).toEqual({ deviceId: 'device-1' });
		expect(
			AblyEndpointInputSchemas.unregisterAllPushDevices.parse({
				clientId: 'client-1',
			}),
		).toEqual({ clientId: 'client-1' });
		expect(
			AblyEndpointInputSchemas.unregisterAllPushDevices.safeParse({}).success,
		).toBe(false);
		expect(
			AblyEndpointInputSchemas.unregisterAllPushDevices.safeParse({
				deviceId: 'device-1',
				clientId: 'client-1',
			}).success,
		).toBe(false);
	});

	it('requires Ably device registration fields', () => {
		const valid = {
			id: 'device-1',
			platform: 'android' as const,
			formFactor: 'phone' as const,
			push: {
				recipient: {
					transportType: 'fcm' as const,
					registrationToken: 'token',
				},
			},
		};
		expect(AblyEndpointInputSchemas.registerPushDevice.parse(valid)).toEqual(
			valid,
		);
		expect(AblyEndpointInputSchemas.updatePushDevice.parse(valid)).toEqual(
			valid,
		);
		expect(
			AblyEndpointInputSchemas.registerPushDevice.safeParse({
				id: 'device-1',
			}).success,
		).toBe(false);
	});

	it('requires channel plus one createPushChannelSubscription target', () => {
		expect(
			AblyEndpointInputSchemas.createPushChannelSubscription.parse({
				channel: 'news',
				deviceId: 'device-1',
			}),
		).toEqual({ channel: 'news', deviceId: 'device-1' });
		expect(
			AblyEndpointInputSchemas.createPushChannelSubscription.safeParse({
				channel: 'news',
			}).success,
		).toBe(false);
		expect(
			AblyEndpointInputSchemas.createPushChannelSubscription.safeParse({
				channel: 'news',
				deviceId: 'device-1',
				clientId: 'client-1',
			}).success,
		).toBe(false);
	});
});
