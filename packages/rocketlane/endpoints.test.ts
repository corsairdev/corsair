import { rocketlane, rocketlaneEndpointSchemas } from './index';

describe('Rocketlane official REST surface', () => {
	const plugin = rocketlane({ key: 'test-api-key' });

	it('registers all 79 operations from the official API reference', () => {
		expect(Object.keys(rocketlaneEndpointSchemas)).toHaveLength(79);
		expect(
			Object.values(plugin.endpoints ?? {}).flatMap((group) =>
				Object.keys(group),
			),
		).toHaveLength(79);
	});

	it('exposes documented page-token pagination inputs', () => {
		const result = rocketlaneEndpointSchemas[
			'projects.getAllProjects'
		].input.safeParse({
			pageSize: 25,
			pageToken: 'next-page',
		});
		expect(result.success).toBe(true);
	});

	it('uses documented wire names for dotted filters', () => {
		const result = rocketlaneEndpointSchemas[
			'invoices.searchInvoices'
		].input.safeParse({
			'companyId.eq': '42',
			pageToken: 'next-page',
		});
		expect(result.success).toBe(true);
	});

	it('requires documented request bodies and path identifiers', () => {
		expect(
			rocketlaneEndpointSchemas['companies.createCompany'].input.safeParse({}),
		).toMatchObject({ success: false });
		expect(
			rocketlaneEndpointSchemas['companies.getCompany'].input.safeParse({}),
		).toMatchObject({ success: false });
	});

	it('models documented 204 operations as no-content', () => {
		expect(
			rocketlaneEndpointSchemas['projects.deleteProject'].output.safeParse(
				undefined,
			).success,
		).toBe(true);
	});

	it('does not register inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
	});

	it('classifies permanent project deletion and placeholder search by effect', () => {
		expect(plugin.endpointMeta?.['projects.deleteProject']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(plugin.endpointMeta?.['projects.getPlaceholders']).toMatchObject({
			riskLevel: 'read',
		});
	});
});
