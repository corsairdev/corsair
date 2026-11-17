import { KlipfolioEndpointOutputSchemas } from './endpoints/types';

// Real Klipfolio replies from the 11-16 live run on a Klips trial account,
// trimmed, with ids replaced. Each one failed the plugin's output schema
// before the fixes in this PR.
const meta = { status: 200, success: true };

describe('Klipfolio live response shapes', () => {
	it('parses lists keyed by resource name', () => {
		const users = {
			data: {
				users: [
					{
						id: 'u1',
						first_name: 'Corsair',
						last_name: 'Ops',
						date_last_login: '2026-11-16T01:31:00Z',
					},
				],
			},
			meta: { ...meta, count: 1, total: 1 },
		};
		expect(KlipfolioEndpointOutputSchemas.listUsers.parse(users)).toEqual(
			users,
		);
		const tabs = { data: { tabs: [] }, meta: { ...meta, count: 0, total: 0 } };
		expect(KlipfolioEndpointOutputSchemas.listTabs.parse(tabs)).toEqual(tabs);
		const groupUsers = {
			data: { users: [{ id: 'u1', first_name: 'Corsair' }] },
			meta,
		};
		expect(
			KlipfolioEndpointOutputSchemas.retrieveGroupUsers.parse(groupUsers),
		).toEqual(groupUsers);
	});

	it('parses data source instances under "instances", not "datasources"', () => {
		const instances = {
			data: {
				instances: [
					{
						id: 'i1',
						datasource_id: 'd1',
						datasource_name: 'Sample data',
						date_last_refresh: '2026-11-16T01:31:00Z',
						refresh_fail_count: 0,
						data_size: 1024,
					},
				],
			},
			meta: {
				...meta,
				count: 2,
				total: 6,
				next: '/datasource-instances?limit=2&offset=2',
			},
		};
		expect(
			KlipfolioEndpointOutputSchemas.listDatasourceInstances.parse(instances),
		).toEqual(instances);
		expect(
			KlipfolioEndpointOutputSchemas.listDatasourceInstances.safeParse({
				data: { datasources: instances.data.instances },
				meta,
			}).success,
		).toBe(false);
	});

	it('parses published links as a list', () => {
		const links = {
			data: {
				published_links: [
					{
						id: 'p1',
						published_link_name: 'corsair-plugin-test',
						dashboard_url: 'app.klipfolio.com/published/p1/corsairplugintest',
						visibility: 'anyone_with_link',
						date_created: '2026-11-15T20:08:54Z',
						created_by: { user_public_id: 'u1', user_name: 'Corsair Ops' },
						date_last_accessed: null,
					},
				],
			},
			meta,
		};
		expect(
			KlipfolioEndpointOutputSchemas.listDashboardPublishedLinks.parse(links),
		).toEqual(links);
	});

	it('returns instance data as the raw uploaded text', () => {
		// GET /datasource-instances/{id}/data answers application/octet-stream.
		const csv =
			'Billing,Product,Shipping location,Units\nQuarterly,Bread,Warehouse,9\n';
		expect(
			KlipfolioEndpointOutputSchemas.retrieveDatasourceInstancesData.parse(csv),
		).toBe(csv);
	});

	it('parses write replies that carry the new resource in meta.location', () => {
		const created = {
			data: {},
			meta: {
				status: 201,
				success: true,
				location: '/datasources/d1',
				instance_location: '/datasource-instances/d1',
			},
		};
		expect(
			KlipfolioEndpointOutputSchemas.createDatasource.parse(created),
		).toEqual(created);
	});
});
