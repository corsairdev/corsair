import { makeRenderRequest } from './client';
import { RenderEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.RENDER_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

describeLive('Render live API', () => {
	const get = <T>(endpoint: string, query?: Record<string, unknown>) =>
		makeRenderRequest<T>(endpoint, apiKey!, {
			method: 'GET',
			query: query as Record<
				string,
				string | string[] | number | boolean | undefined
			>,
		});

	it('returns services for the authenticated owner', async () => {
		const response = await get<unknown>('/v1/services', { limit: 3 });
		const services = RenderEndpointOutputSchemas.listServices.parse(response);

		expect(services.length).toBeLessThanOrEqual(3);
	});

	it('returns the authenticated user', async () => {
		const response = await get<unknown>('/v1/users');
		const user = RenderEndpointOutputSchemas.getUser.parse(response);

		expect(user).toBeDefined();
	});

	it('returns owners and projects', async () => {
		const [ownersResponse, projectsResponse] = await Promise.all([
			get<unknown>('/v1/owners'),
			get<unknown>('/v1/projects'),
		]);

		const owners = RenderEndpointOutputSchemas.listOwners.parse(ownersResponse);
		const projects =
			RenderEndpointOutputSchemas.listProjects.parse(projectsResponse);

		expect(Array.isArray(owners)).toBe(true);
		expect(Array.isArray(projects)).toBe(true);
	});

	it('returns environment groups for the authenticated owner', async () => {
		const servicesResponse = await get<unknown>('/v1/services', { limit: 1 });
		const services =
			RenderEndpointOutputSchemas.listServices.parse(servicesResponse);
		const ownerId = services[0]?.service.ownerId;
		expect(ownerId).toBeDefined();

		const groupsResponse = await get<unknown>('/v1/env-groups', { ownerId });
		const groups =
			RenderEndpointOutputSchemas.listEnvGroups.parse(groupsResponse);
		expect(Array.isArray(groups)).toBe(true);
	});

	it('returns Postgres resources and maintenance windows', async () => {
		const [postgresResponse, maintenanceResponse] = await Promise.all([
			get<unknown>('/v1/postgres'),
			get<unknown>('/v1/maintenance'),
		]);

		const postgres =
			RenderEndpointOutputSchemas.listPostgres.parse(postgresResponse);
		const maintenance =
			RenderEndpointOutputSchemas.listMaintenance.parse(maintenanceResponse);

		expect(Array.isArray(postgres)).toBe(true);
		expect(Array.isArray(maintenance)).toBe(true);
	});

	it('returns logs and disks using current list routes', async () => {
		const servicesResponse = await get<unknown>('/v1/services', { limit: 1 });
		const services =
			RenderEndpointOutputSchemas.listServices.parse(servicesResponse);
		const service = services[0]?.service;
		expect(service).toBeDefined();

		const [logsResponse, disksResponse] = await Promise.all([
			get<unknown>('/v1/logs', {
				ownerId: service?.ownerId,
				resource: service?.id,
				limit: 3,
			}),
			get<unknown>('/v1/disks', { ownerId: service?.ownerId }),
		]);

		const logs = RenderEndpointOutputSchemas.listLogs.parse(logsResponse);
		const disks = RenderEndpointOutputSchemas.listDisks.parse(disksResponse);

		expect(logs).toBeDefined();
		expect(Array.isArray(disks)).toBe(true);
	});
});
