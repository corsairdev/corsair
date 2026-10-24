import { makeRenderRequest } from './client';
import {
	deleteService,
	listServices,
	updateOwnerLogStream,
	updateRoutes,
} from './endpoints';

jest.mock('./client', () => ({
	makeRenderRequest: jest.fn(),
}));

const request = jest.mocked(makeRenderRequest);

describe('Render service endpoints', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue([
			{
				service: {
					id: 'srv-1',
					name: 'demo',
					type: 'web_service',
					ownerId: 'usr-1',
				},
			},
		]);
	});

	it('lists services with the current Render pagination endpoint', async () => {
		const result = await listServices(
			{
				key: 'secret',
				options: {},
				$getAccountId: jest.fn().mockResolvedValue('account-1'),
			} as never,
			{ limit: 20, cursor: 'next' },
		);

		expect(result[0]?.service.id).toBe('srv-1');
		expect(request).toHaveBeenCalledWith('/v1/services', 'secret', {
			method: 'GET',
			query: { limit: 20, cursor: 'next' },
		});
	});

	it('routes route updates to the current Render endpoint', async () => {
		request.mockResolvedValue({});
		await updateRoutes(
			{
				key: 'secret',
				options: {},
				$getAccountId: jest.fn().mockResolvedValue('account-1'),
			} as never,
			{ id: 'srv-1', body: [] },
		);

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/routes',
			'secret',
			{
				method: 'PUT',
				body: [],
			},
		);
	});

	it('rejects service IDs that can escape the service path', async () => {
		await expect(
			deleteService({ key: 'secret' } as never, {
				serviceId: '../registrycredentials/credential-id',
			}),
		).rejects.toThrow('Invalid Render service ID');
		expect(request).not.toHaveBeenCalled();
	});

	it('sends owner log stream updates as a request body', async () => {
		request.mockResolvedValue({});
		await updateOwnerLogStream({ key: 'secret' } as never, {
			id: 'stream-1',
			url: 'https://logs.example.test',
			labels: ['app'],
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/logs/streams/owner/stream-1',
			'secret',
			expect.objectContaining({
				method: 'PUT',
				body: { url: 'https://logs.example.test', labels: ['app'] },
			}),
		);
	});
});
