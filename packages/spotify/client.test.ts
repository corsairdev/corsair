import { request } from 'corsair/http';
import { makeSpotifyRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(async () => ({})),
}));

const mockRequest = jest.mocked(request);

describe('makeSpotifyRequest body forwarding', () => {
	beforeEach(() => mockRequest.mockClear());

	it.each(['POST', 'PUT', 'PATCH', 'DELETE'] as const)(
		'sends the body on %s',
		async (method) => {
			const body = { tracks: [{ uri: 'spotify:track:1' }] };
			await makeSpotifyRequest('playlists/p/tracks', 'token', {
				method,
				body,
			});

			expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({ method, body });
		},
	);

	it('does not send a body on GET', async () => {
		await makeSpotifyRequest('me', 'token', {
			method: 'GET',
			body: { a: 1 },
		});

		expect(mockRequest.mock.calls[0]?.[1].body).toBeUndefined();
	});
});
