import { createCorsair } from 'corsair/core';
import { render } from './index';

describe('Render environment operations', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('forwards selected resource IDs in the environment removal DELETE query', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(null, { status: 204 }));
		const api = createCorsair({ plugins: [render({ key: 'rnd_test' })] }).render
			.api;

		await api.services.environments.removeResources({
			environmentId: 'env-1',
			resourceIds: ['srv-1', 'pg-1'],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		const sent = new URL(String(url));
		expect(init?.method).toBe('DELETE');
		expect(sent.pathname).toBe('/v1/environments/env-1/resources');
		expect(sent.searchParams.getAll('resourceIds')).toEqual(['srv-1', 'pg-1']);
	});
});
