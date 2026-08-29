import {
	DataViewsGetInputSchema,
	DataViewsGetResponseSchema,
	SavedObjectsCreateInputSchema,
	SavedObjectsCreateResponseSchema,
	SavedObjectsDeleteInputSchema,
	SavedObjectsDeleteResponseSchema,
	SavedObjectsFindInputSchema,
	SavedObjectsFindResponseSchema,
	SavedObjectsGetInputSchema,
	SavedObjectsGetResponseSchema,
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
	});
});
