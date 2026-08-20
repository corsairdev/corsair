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
}));

const mockedRequest = client.makeAblyRequest as jest.MockedFunction<
	typeof client.makeAblyRequest
>;

const ctx = {
	key: 'appId.keyId:keySecret',
	db: {},
} as any;

describe('Ably endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
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
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'keys/app.key/requestToken',
				ctx.key,
				{
					method: 'POST',
					body: {
						clientId: 'client-1',
						ttl: 60000,
					},
				},
			);
		});
	});

	describe('channels', () => {
		it('publishes a message to a channel', async () => {
			await Channels.publishMessageToChannel(ctx, {
				channelId: 'room:one',
				name: 'message',
				data: 'hello',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room%3Aone/messages',
				ctx.key,
				{
					method: 'POST',
					body: {
						name: 'message',
						data: 'hello',
					},
				},
			);
		});

		it('gets channel history', async () => {
			await Channels.getChannelHistory(ctx, {
				channelId: 'room',
				limit: 50,
				direction: 'backwards',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room/messages',
				ctx.key,
				{
					query: {
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
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'channels/room/presence',
				ctx.key,
				{
					query: {
						clientId: 'user-1',
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
	});

	describe('push', () => {
		it('gets a push device registration', async () => {
			await Push.getPushDevice(ctx, {
				deviceId: 'device:123',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device%3A123',
				ctx.key,
			);
		});

		it('registers a push device', async () => {
			const input = {
				id: 'device-1',
				clientId: 'client-1',
				platform: 'android',
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

		it('unregisters a single push device', async () => {
			await Push.unregisterPushDevice(ctx, {
				deviceId: 'device-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'push/deviceRegistrations/device-1',
				ctx.key,
				{
					method: 'DELETE',
				},
			);
		});
	});
});
