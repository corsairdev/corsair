import { makeRenderRequest } from './client';
import { RenderEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.RENDER_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

describeLive('Render live API', () => {
	it('returns services for the authenticated owner', async () => {
		const response = await makeRenderRequest<unknown>('/v1/services', apiKey!);
		const services = RenderEndpointOutputSchemas.listServices.parse(response);

		expect(Array.isArray(services)).toBe(true);
		expect(services.length).toBeGreaterThanOrEqual(0);
	});
});
