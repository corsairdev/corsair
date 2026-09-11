import {
	AlertingRuleCreateInputSchema,
	AlertingRuleDeleteInputSchema,
	AlertingRulesListInputSchema,
	AlertsFindInputSchema,
	CasesCreateInputSchema,
	CasesListInputSchema,
	ConnectorsCreateInputSchema,
	ConnectorsDeleteInputSchema,
	ConnectorsGetInputSchema,
	ConnectorTypesListInputSchema,
	DashboardsCreateInputSchema,
	DashboardsDeleteInputSchema,
	DashboardsGetInputSchema,
	DashboardsSearchInputSchema,
	DashboardsUpsertInputSchema,
	DataViewsCreateInputSchema,
	DataViewsGetInputSchema,
	DataViewsGetResponseSchema,
	DataViewsListInputSchema,
	DetectionRulesFindInputSchema,
	EndpointListItemsInputSchema,
	EntityStoreEntitiesListInputSchema,
	EntityStoreStatusInputSchema,
	FleetAgentPoliciesListInputSchema,
	FleetCheckPermissionsInputSchema,
	FleetEnrollmentKeyGetInputSchema,
	FleetEpmPackageDetailsInputSchema,
	FleetOutputDeleteInputSchema,
	FleetServerHostGetInputSchema,
	IndexIndicesInputSchema,
	ListsDeleteInputSchema,
	NodeMetricsInputSchema,
	OsquerySavedQueryDeleteInputSchema,
	ReportingJobsListInputSchema,
	SavedObjectsCreateInputSchema,
	SavedObjectsCreateResponseSchema,
	SavedObjectsDeleteInputSchema,
	SavedObjectsDeleteResponseSchema,
	SavedObjectsFindInputSchema,
	SavedObjectsFindResponseSchema,
	SavedObjectsGetInputSchema,
	SavedObjectsGetResponseSchema,
	SavedObjectsUpdateInputSchema,
	SavedObjectsUpdateResponseSchema,
	StatusGetInputSchema,
	StatusGetResponseSchema,
} from './endpoints/types';
import { KibanaSchema } from './schema';
import {
	KibanaDataView,
	KibanaSavedObject,
	KibanaSpace,
} from './schema/database';

describe('Kibana Schema & Validation', () => {
	describe('database entities', () => {
		it('declares a valid semver version', () => {
			expect(KibanaSchema.version).toBeDefined();
			expect(KibanaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		});

		it('declares all schema entities correctly', () => {
			expect(KibanaSchema.entities.savedObjects).toBeDefined();
			expect(KibanaSchema.entities.spaces).toBeDefined();
			expect(KibanaSchema.entities.dataViews).toBeDefined();
		});

		it('parses valid KibanaSavedObject', () => {
			const obj = {
				id: 'dashboard-1',
				type: 'dashboard',
				attributes: { title: 'Main Dashboard' },
			};
			const result = KibanaSavedObject.safeParse(obj);
			expect(result.success).toBe(true);
		});

		it('parses valid KibanaSpace', () => {
			const space = {
				id: 'default',
				name: 'Default Space',
				description: 'The default space in Kibana',
			};
			const result = KibanaSpace.safeParse(space);
			expect(result.success).toBe(true);
		});

		it('parses valid KibanaDataView', () => {
			const view = {
				id: 'view-1',
				title: 'logs-*',
				timeFieldName: '@timestamp',
			};
			const result = KibanaDataView.safeParse(view);
			expect(result.success).toBe(true);
		});
	});

	describe('endpoint schemas', () => {
		it('validates savedObjectsFind input and output schemas', () => {
			const input = {
				type: 'index-pattern',
				search: 'logs',
				page: 1,
				per_page: 20,
			};
			expect(SavedObjectsFindInputSchema.safeParse(input).success).toBe(true);

			const output = {
				total: 1,
				page: 1,
				per_page: 20,
				saved_objects: [
					{
						id: '1',
						type: 'index-pattern',
						attributes: { title: 'logs-*' },
					},
				],
			};
			expect(SavedObjectsFindResponseSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('validates savedObjectsGet input and output schemas', () => {
			const input = { type: 'dashboard', id: 'my-dash' };
			expect(SavedObjectsGetInputSchema.safeParse(input).success).toBe(true);

			const output = {
				id: 'my-dash',
				type: 'dashboard',
				attributes: { title: 'Analytics' },
			};
			expect(SavedObjectsGetResponseSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('validates savedObjectsCreate input and output schemas', () => {
			const input = {
				type: 'visualization',
				attributes: { title: 'Pie Chart' },
			};
			expect(SavedObjectsCreateInputSchema.safeParse(input).success).toBe(true);

			const output = {
				id: 'vis-1',
				type: 'visualization',
				attributes: { title: 'Pie Chart' },
			};
			expect(SavedObjectsCreateResponseSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('validates savedObjectsDelete input and output schemas', () => {
			const input = { type: 'dashboard', id: 'dash-to-delete' };
			expect(SavedObjectsDeleteInputSchema.safeParse(input).success).toBe(true);

			const output = {};
			expect(SavedObjectsDeleteResponseSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('validates dataViewsGet input and output schemas', () => {
			const input = { id: 'view-1' };
			expect(DataViewsGetInputSchema.safeParse(input).success).toBe(true);

			const output = {
				data_view: {
					id: 'view-1',
					title: 'metricbeat-*',
				},
			};
			expect(DataViewsGetResponseSchema.safeParse(output).success).toBe(true);
		});

		it('validates statusGet input and output schemas', () => {
			expect(StatusGetInputSchema.safeParse({}).success).toBe(true);

			const output = {
				name: 'kibana-cluster',
				version: { number: '8.15.0', build_number: 12345 },
				status: { overall: { state: 'green', title: 'Green' } },
			};
			expect(StatusGetResponseSchema.safeParse(output).success).toBe(true);
		});

		it('validates savedObjectsUpdate input and output schemas', () => {
			const input = {
				type: 'dashboard',
				id: 'dash-1',
				attributes: { title: 'Updated' },
			};
			expect(SavedObjectsUpdateInputSchema.safeParse(input).success).toBe(true);

			const output = {
				id: 'dash-1',
				type: 'dashboard',
				attributes: { title: 'Updated' },
			};
			expect(SavedObjectsUpdateResponseSchema.safeParse(output).success).toBe(
				true,
			);
		});

		it('rejects invalid inputs', () => {
			expect(
				SavedObjectsGetInputSchema.safeParse({ type: 'dashboard' }).success,
			).toBe(false);
			expect(
				SavedObjectsCreateInputSchema.safeParse({ type: 'dashboard' }).success,
			).toBe(false);
			expect(
				SavedObjectsUpdateInputSchema.safeParse({
					type: 'dashboard',
					id: 'dash-1',
				}).success,
			).toBe(false);
			expect(DataViewsGetInputSchema.safeParse({}).success).toBe(false);
			expect(
				SavedObjectsFindResponseSchema.safeParse({
					total: 1,
					saved_objects: [{ id: '1' }],
				}).success,
			).toBe(false);
		});

		it('validates dashboards schemas', () => {
			expect(DashboardsSearchInputSchema.safeParse({ page: 1 }).success).toBe(
				true,
			);
			expect(
				DashboardsCreateInputSchema.safeParse({ title: 'T' }).success,
			).toBe(true);
			expect(DashboardsCreateInputSchema.safeParse({}).success).toBe(false);
			expect(DashboardsGetInputSchema.safeParse({}).success).toBe(false);
			expect(DashboardsUpsertInputSchema.safeParse({ id: 'd1' }).success).toBe(
				true,
			);
			expect(DashboardsDeleteInputSchema.safeParse({ id: 'd1' }).success).toBe(
				true,
			);
			expect(DashboardsUpsertInputSchema.safeParse({}).success).toBe(false);
		});

		it('validates alerting schemas', () => {
			expect(
				AlertingRuleCreateInputSchema.safeParse({ id: 'r', body: {} }).success,
			).toBe(true);
			expect(AlertingRuleCreateInputSchema.safeParse({ id: 'r' }).success).toBe(
				false,
			);
			expect(AlertingRulesListInputSchema.safeParse({ page: 1 }).success).toBe(
				true,
			);
			expect(AlertingRuleDeleteInputSchema.safeParse({}).success).toBe(false);
			expect(AlertingRuleDeleteInputSchema.safeParse({ id: 'r' }).success).toBe(
				true,
			);
		});

		it('validates cases + connectors schemas', () => {
			expect(
				CasesCreateInputSchema.safeParse({
					title: 'T',
					description: 'D',
					owner: 'observability',
					connector: { id: 'none', type: '.none' },
					settings: { syncAlerts: false },
					tags: ['t1'],
				}).success,
			).toBe(true);
			expect(CasesCreateInputSchema.safeParse({ title: 'T' }).success).toBe(
				false,
			);
			expect(
				CasesCreateInputSchema.safeParse({
					title: 'T',
					description: 'D',
					owner: 'cases',
					connector: {},
					settings: { syncAlerts: true },
					tags: [],
				}).success,
			).toBe(true);
			expect(CasesListInputSchema.safeParse({ status: 'open' }).success).toBe(
				true,
			);
			expect(
				ConnectorsCreateInputSchema.safeParse({
					id: 'k',
					connector_type_id: '.webhook',
					name: 'N',
				}).success,
			).toBe(true);
			expect(ConnectorsCreateInputSchema.safeParse({ id: 'k' }).success).toBe(
				false,
			);
			expect(ConnectorsGetInputSchema.safeParse({}).success).toBe(false);
			expect(ConnectorsDeleteInputSchema.safeParse({ id: 'k' }).success).toBe(
				true,
			);
			expect(ConnectorTypesListInputSchema.safeParse({}).success).toBe(true);
		});

		it('validates fleet schemas', () => {
			expect(FleetCheckPermissionsInputSchema.safeParse({}).success).toBe(true);
			expect(
				FleetAgentPoliciesListInputSchema.safeParse({ page: 1 }).success,
			).toBe(true);
			expect(FleetEnrollmentKeyGetInputSchema.safeParse({}).success).toBe(
				false,
			);
			expect(
				FleetEnrollmentKeyGetInputSchema.safeParse({ keyId: 'k' }).success,
			).toBe(true);
			expect(FleetServerHostGetInputSchema.safeParse({}).success).toBe(false);
			expect(
				FleetOutputDeleteInputSchema.safeParse({ outputId: 'o' }).success,
			).toBe(true);
			expect(
				FleetEpmPackageDetailsInputSchema.safeParse({ pkgName: 'x' }).success,
			).toBe(false);
			expect(
				FleetEpmPackageDetailsInputSchema.safeParse({
					pkgName: 'x',
					pkgVersion: '1',
				}).success,
			).toBe(true);
		});

		it('validates detection + security + lists schemas', () => {
			expect(DetectionRulesFindInputSchema.safeParse({ page: 1 }).success).toBe(
				true,
			);
			expect(
				DetectionRulesFindInputSchema.safeParse({ page: 'x' }).success,
			).toBe(false);
			expect(AlertsFindInputSchema.safeParse({}).success).toBe(true);
			expect(EndpointListItemsInputSchema.safeParse({}).success).toBe(true);
			expect(EntityStoreStatusInputSchema.safeParse({}).success).toBe(true);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ size: 5 }).success,
			).toBe(true);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ size: 'x' }).success,
			).toBe(false);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ page: 0 }).success,
			).toBe(false);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ per_page: 10001 })
					.success,
			).toBe(false);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ size: 1.5 }).success,
			).toBe(false);
			expect(
				EntityStoreEntitiesListInputSchema.safeParse({ per_page: 10000 })
					.success,
			).toBe(true);
			expect(ListsDeleteInputSchema.safeParse({ id: 'l' }).success).toBe(true);
			expect(ListsDeleteInputSchema.safeParse({}).success).toBe(false);
			expect(
				OsquerySavedQueryDeleteInputSchema.safeParse({ id: 'q' }).success,
			).toBe(true);
			expect(OsquerySavedQueryDeleteInputSchema.safeParse({}).success).toBe(
				false,
			);
		});

		it('validates data views list/create + reporting/metrics/index schemas', () => {
			expect(DataViewsListInputSchema.safeParse({}).success).toBe(true);
			expect(
				DataViewsCreateInputSchema.safeParse({ title: 'logs-*' }).success,
			).toBe(true);
			expect(DataViewsCreateInputSchema.safeParse({}).success).toBe(false);
			expect(ReportingJobsListInputSchema.safeParse({}).success).toBe(true);
			expect(NodeMetricsInputSchema.safeParse({}).success).toBe(true);
			expect(NodeMetricsInputSchema.safeParse({ node_id: 5 }).success).toBe(
				false,
			);
			expect(IndexIndicesInputSchema.safeParse({}).success).toBe(true);
		});
	});
});
