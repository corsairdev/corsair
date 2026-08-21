import * as client from '../client';
import { Application, Channels, Push } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeAblyRequest: jest.fn(),
	makeAblyListRequest: jest.fn(),
}));

const mockedRequest = client.makeAblyRequest as jest.MockedFunction<
	typeof client.makeAblyRequest
>;

const mockedListRequest = client.makeAblyListRequest as jest.MockedFunction<
	typeof client.makeAblyListRequest
>;

const ctx = {
	key: 'appId.keyId:keySecret',
	db: {},
} as any;

describe('Ably endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
		mockedListRequest.mockResolvedValue({ items: [] });
	});

	describe('application', () => {
		it('gets Ably service time', async () => {
			mockedRequest.mockResolvedValueOnce([1710000000000]);

			await Application.getServiceTime(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith('time', ctx.key);
		});

		it('gets application stats with query parameters', async () => {
			const input = {
				unit: 'hour' as const,
				limit: 10,
			};

			await Application.getStats(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('stats', ctx.key, {
				method: 'GET',
				query: input,
			});
		});

		it('requests an access token', async () => {
			await Application.requestAccessToken(ctx, {
				keyName: 'app.key',
				clientId: 'client-1',
				ttl: 60000,
				capability: '{"room":["publish","subscribe"]}',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'keys/app.key/requestToken',
				ctx.key,
				{
					method: 'POST',
					body: {
						clientId: 'client-1',
						ttl: 60000,
						capability: '{"room":["publish","subscribe"]}',
					},
				},
			);
		});
	});

	describe('channels', () => {
		it('publishes batch messages using the top-level batch array', async () => {
			mockedRequest.mockResolvedValueOnce([]);

			const messages = [
				{
					channels: ['channel-a', 'channel-b'],
					messages: [{ name: 'event', data: 'hello' }],
				},
			];

			await Channels.publishBatchMessages(ctx, { messages });

			expect(mockedRequest).toHaveBeenCalledWith('messages', ctx.key, {
				method: 'POST',
				body: messages,
			});
		});

		it('gets channel details', async () => {
			await Channels.getChannelDetails(ctx, {
				channelId: 'room:one',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room%3Aone',
				ctx.key,
			);
		});

		it('gets channel history', async () => {
			await Channels.getChannelHistory(ctx, {
				channelId: 'room',
				start: 1000,
				end: 2000,
				limit: 50,
				direction: 'backwards',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room/messages',
				ctx.key,
				{
					query: {
						start: 1000,
						end: 2000,
						limit: 50,
						direction: 'backwards',
					},
				},
			);
		});

		it('gets current channel presence', async () => {
			await Channels.getChannelPresence(ctx, {
				channelId: 'room',
				clientId: 'user-1',
				connectionId: 'connection-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room/presence',
				ctx.key,
				{
					query: {
						clientId: 'user-1',
						connectionId: 'connection-1',
					},
				},
			);
		});

		it('gets channel presence history', async () => {
			await Channels.getPresenceHistory(ctx, {
				channelId: 'room:one',
				start: 1000,
				end: 2000,
				limit: 25,
				direction: 'forwards',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room%3Aone/presence/history',
				ctx.key,
				{
					query: {
						start: 1000,
						end: 2000,
						limit: 25,
						direction: 'forwards',
					},
				},
			);
		});

		it('gets message versions', async () => {
			await Channels.getMessageVersions(ctx, {
				channelId: 'room',
				serial: 'serial:1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room/messages/serial%3A1/versions',
				ctx.key,
			);
		});

		it('lists channels with query parameters', async () => {
			const input = {
				prefix: 'room',
				by: 'id' as const,
				limit: 20,
			};

			await Channels.listChannels(ctx, input);

			expect(mockedListRequest).toHaveBeenCalledWith('channels', ctx.key, {
				query: {
					prefix: 'room',
					by: 'id',
					limit: 20,
				},
			});
		});

		it('merges listChannels next query and omits the envelope', async () => {
			await Channels.listChannels(ctx, {
				prefix: 'room',
				next: {
					limit: '100',
					by: 'id',
				},
			});

			expect(mockedListRequest).toHaveBeenCalledWith('channels', ctx.key, {
				query: {
					prefix: 'room',
					limit: '100',
					by: 'id',
				},
			});
		});

		it('publishes a message to a channel', async () => {
			await Channels.publishMessageToChannel(ctx, {
				channelId: 'room:one',
				name: 'message',
				data: 'hello',
				clientId: 'client-1',
				extras: {
					source: 'test',
				},
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room%3Aone/messages',
				ctx.key,
				{
					method: 'POST',
					body: {
						name: 'message',
						data: 'hello',
						clientId: 'client-1',
						extras: {
							source: 'test',
						},
					},
				},
			);
		});

		it('queries batch presence using the channels parameter', async () => {
			mockedRequest.mockResolvedValueOnce([]);

			await Channels.batchPresence(ctx, {
				channels: ['room-a', 'room-b'],
			});

			expect(mockedRequest).toHaveBeenCalledWith('presence', ctx.key, {
				query: {
					channels: 'room-a,room-b',
				},
			});
		});

		it('gets presence history for each channel in a batch', async () => {
			mockedRequest
				.mockResolvedValueOnce([{ clientId: 'user-a' }])
				.mockResolvedValueOnce([{ clientId: 'user-b' }]);

			const result = await Channels.batchPresenceHistory(ctx, {
				channels: ['room-a', 'room:b'],
				start: 1000,
				end: 2000,
				limit: 10,
				direction: 'backwards',
			});

			expect(mockedRequest).toHaveBeenNthCalledWith(
				1,
				'channels/room-a/presence/history',
				ctx.key,
				{
					query: {
						start: 1000,
						end: 2000,
						limit: 10,
						direction: 'backwards',
					},
				},
			);

			expect(mockedRequest).toHaveBeenNthCalledWith(
				2,
				'channels/room%3Ab/presence/history',
				ctx.key,
				{
					query: {
						start: 1000,
						end: 2000,
						limit: 10,
						direction: 'backwards',
					},
				},
			);

			expect(result).toEqual([
				{
					channelId: 'room-a',
					history: [{ clientId: 'user-a' }],
				},
				{
					channelId: 'room:b',
					history: [{ clientId: 'user-b' }],
				},
			]);
		});

		it('limits concurrent batch presence history requests', async () => {
			const releases: Array<() => void> = [];

			mockedRequest.mockImplementation(
				() =>
					new Promise((resolve) => {
						releases.push(() => resolve([]));
					}) as never,
			);

			const request = Channels.batchPresenceHistory(ctx, {
				channels: ['room-1', 'room-2', 'room-3', 'room-4', 'room-5', 'room-6'],
			});

			await Promise.resolve();

			expect(mockedRequest).toHaveBeenCalledTimes(5);

			releases[0]!();

			await Promise.resolve();
			await Promise.resolve();

			expect(mockedRequest).toHaveBeenCalledTimes(6);

			for (const release of releases.slice(1)) {
				release();
			}

			await expect(request).resolves.toEqual([
				{ channelId: 'room-1', history: [] },
				{ channelId: 'room-2', history: [] },
				{ channelId: 'room-3', history: [] },
				{ channelId: 'room-4', history: [] },
				{ channelId: 'room-5', history: [] },
				{ channelId: 'room-6', history: [] },
			]);
		});
	});

	describe('push', () => {
		it('publishes batch push notifications using the batch endpoint', async () => {
			mockedRequest.mockResolvedValueOnce([]);

			const notifications = [
				{
					recipient: {
						deviceId: 'device-1',
					},
					payload: {
						notification: {
							title: 'Hello',
							body: 'World',
						},
					},
				},
			];

			await Push.publishPushNotificationsBatch(ctx, {
				notifications,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/batch/publish',
				ctx.key,
				{
					method: 'POST',
					body: notifications,
				},
			);
		});

		it('creates a push channel subscription', async () => {
			const input = {
				channel: 'news',
				deviceId: 'device-1',
			};

			await Push.createPushChannelSubscription(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/channelSubscriptions',
				ctx.key,
				{
					method: 'POST',
					body: input,
				},
			);
		});

		it('deletes a push channel subscription using query parameters', async () => {
			const input = {
				channel: 'news',
				deviceId: 'device-1',
			};

			await Push.deleteChannelSubscription(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/channelSubscriptions',
				ctx.key,
				{
					method: 'DELETE',
					query: input,
				},
			);
		});

		it('gets a push device registration', async () => {
			await Push.getPushDevice(ctx, {
				deviceId: 'device:123',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device%3A123',
				ctx.key,
			);
		});

		it('lists push channel subscriptions', async () => {
			const input = {
				channel: 'news',
				deviceId: 'device-1',
				clientId: 'client-1',
				limit: 50,
			};

			await Push.listPushChannelSubscriptions(ctx, input);

			expect(mockedListRequest).toHaveBeenCalledWith(
				'push/channelSubscriptions',
				ctx.key,
				{
					query: input,
				},
			);
		});

		it('lists push channels', async () => {
			const input = {
				prefix: 'news',
				limit: 25,
			};

			await Push.listPushChannels(ctx, input);

			expect(mockedListRequest).toHaveBeenCalledWith('push/channels', ctx.key, {
				query: input,
			});
		});

		it('lists registered push devices', async () => {
			const input = {
				deviceId: 'device-1',
				clientId: 'client-1',
				limit: 100,
			};

			await Push.listRegisteredPushDevices(ctx, input);

			expect(mockedListRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations',
				ctx.key,
				{
					query: input,
				},
			);
		});

		it('patches a push device registration', async () => {
			await Push.patchPushDeviceRegistration(ctx, {
				deviceId: 'device:1',
				clientId: 'client-1',
				metadata: {
					environment: 'test',
				},
				push: {
					state: 'active',
				},
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device%3A1',
				ctx.key,
				{
					method: 'PATCH',
					body: {
						clientId: 'client-1',
						metadata: {
							environment: 'test',
						},
						push: {
							state: 'active',
						},
					},
				},
			);
		});

		it('publishes a push notification', async () => {
			const input = {
				recipient: {
					deviceId: 'device-1',
				},
				data: {
					type: 'example',
				},
				notification: {
					title: 'Hello',
					body: 'World',
				},
			};

			await Push.publishPushNotification(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('push/publish', ctx.key, {
				method: 'POST',
				body: input,
			});
		});

		it('registers a push device', async () => {
			const input = {
				id: 'device-1',
				clientId: 'client-1',
				platform: 'android' as const,
				formFactor: 'phone' as const,
				push: {
					recipient: {
						transportType: 'fcm' as const,
						registrationToken: 'token',
					},
				},
			};

			await Push.registerPushDevice(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations',
				ctx.key,
				{
					method: 'POST',
					body: input,
				},
			);
		});

		it('unregisters push devices using query parameters', async () => {
			const input = {
				clientId: 'client-1',
			};

			await Push.unregisterAllPushDevices(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations',
				ctx.key,
				{
					method: 'DELETE',
					query: input,
				},
			);
		});

		it('unregisters a single push device', async () => {
			await Push.unregisterPushDevice(ctx, {
				deviceId: 'device:1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device%3A1',
				ctx.key,
				{
					method: 'DELETE',
				},
			);
		});

		it('updates a push device registration', async () => {
			await Push.updatePushDevice(ctx, {
				id: 'device:1',
				clientId: 'client-1',
				platform: 'android',
				formFactor: 'phone',
				metadata: {
					version: '1.0',
				},
				push: {
					recipient: {
						transportType: 'fcm',
						registrationToken: 'token',
					},
				},
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device%3A1',
				ctx.key,
				{
					method: 'PUT',
					body: {
						id: 'device:1',
						clientId: 'client-1',
						platform: 'android',
						formFactor: 'phone',
						metadata: {
							version: '1.0',
						},
						push: {
							recipient: {
								transportType: 'fcm',
								registrationToken: 'token',
							},
						},
					},
				},
			);
		});
	});
});
