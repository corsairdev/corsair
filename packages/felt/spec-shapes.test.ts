// Shapes taken from Felt's published OpenAPI document (https://felt.com/api/v2/openapi.json).
// Each case is a request body or response the reference documents; the plugin must accept it.
import {
	FeltEndpointInputSchemas,
	FeltEndpointOutputSchemas,
} from './endpoints/types';

const layer = {
	id: 'l_1',
	type: 'layer',
	name: 'Parcels',
	caption: null,
	geometry_type: 'Polygon',
	hide_from_legend: false,
	progress: 100,
	refresh_period: 'disabled',
	refresh_status: 'active',
	status: 'completed',
	style: {},
};

const map = {
	id: 'm_1',
	type: 'map',
	title: 'Test map',
	url: 'https://felt.com/map/m_1',
	public_access: 'private',
	project_id: 'p_1',
	created_at: '2026-11-13T00:00:00Z',
	visited_at: null,
	thumbnail_url: null,
	layers: [layer],
	layer_groups: [],
	element_groups: [],
	elements: { type: 'FeatureCollection', features: [] },
};

describe('Felt output shapes from the API reference', () => {
	it('parses a map whose elements is a FeatureCollection object', () => {
		expect(FeltEndpointOutputSchemas.mapsGet.parse(map).elements).toEqual({
			type: 'FeatureCollection',
			features: [],
		});
	});

	it('parses element groups whose elements is a FeatureCollection and name/symbol are null', () => {
		const groups = [
			{
				id: 'g_1',
				name: null,
				color: '#C93535',
				symbol: null,
				elements: { type: 'FeatureCollection', features: [] },
			},
		];
		expect(
			FeltEndpointOutputSchemas.elementsListGroups.parse(groups),
		).toHaveLength(1);
	});

	it('parses a layer refresh, which answers with an upload response', () => {
		const refresh = {
			type: 'upload_response',
			layer_id: 'l_1',
			layer_group_id: 'lg_1',
			url: null,
			presigned_attributes: null,
		};
		expect(
			FeltEndpointOutputSchemas.layersRefresh.parse(refresh).layer_id,
		).toBe('l_1');
		expect(
			FeltEndpointOutputSchemas.layersUpload.parse(refresh).url,
		).toBeNull();
	});

	it('parses sources and credentials with integer timestamps and a string automatic_sync', () => {
		const ref = {
			id: 's_1',
			type: 'source_reference',
			name: 'Warehouse',
			connection_type: 'postgresql',
			automatic_sync: 'enabled',
			sync_status: 'completed',
			created_at: 1763000000,
			updated_at: 1763000000,
			last_synced_at: null,
		};
		expect(FeltEndpointOutputSchemas.sourcesList.parse([ref])).toHaveLength(1);
		expect(FeltEndpointOutputSchemas.sourcesSync.parse(ref).id).toBe('s_1');
		const source = {
			...ref,
			type: 'source',
			datasets: [
				{
					id: 'd_1',
					name: 'parcels',
					type: 'dataset',
					created_at: 1763000000,
					updated_at: 1763000000,
					geometry_type: 'polygon',
					inspection_status: 'completed',
				},
			],
		};
		expect(FeltEndpointOutputSchemas.sourcesGet.parse(source).id).toBe('s_1');
		// Felt documents Source.connection as nullable.
		expect(
			FeltEndpointOutputSchemas.sourcesGet.parse({
				...source,
				connection: null,
			}).datasets,
		).toHaveLength(1);
		const credential = {
			id: 'c_1',
			source_id: 's_1',
			name: 'token',
			use_case: 'source_authentication',
			created_at: 1763000000,
			updated_at: null,
			credential: { type: 'snowflake_pat' },
		};
		expect(
			FeltEndpointOutputSchemas.sourcesCreateCredential.parse(credential).id,
		).toBe('c_1');
	});

	it('parses a custom export poll whose filters is an array', () => {
		const poll = {
			export_id: 'e_1',
			status: 'completed',
			download_url: 'https://example.com/export.zip',
			filters: [],
		};
		expect(
			FeltEndpointOutputSchemas.layersPollCustomExport.parse(poll).status,
		).toBe('completed');
	});

	it('parses print pages and layouts with null names, null orientation and object borders', () => {
		const page = {
			id: 'pp_1',
			name: null,
			url: 'https://felt.com/map/m_1/print/pp_1',
			page: { size: 'letter', orientation: 'landscape', units: 'in' },
			output: { format: 'pdf', dpi: 300 },
			items: [
				{
					id: 'i_1',
					type: 'text',
					color: null,
					border: { color: null, width_px: 1 },
				},
			],
			warnings: [],
		};
		expect(
			FeltEndpointOutputSchemas.printPagesGetPage.parse(page).name,
		).toBeNull();
		expect(
			FeltEndpointOutputSchemas.printPagesListPages.parse([page]),
		).toHaveLength(1);
		const layout = {
			id: 'pl_1',
			name: 'Layout',
			kind: 'workspace',
			orientation: null,
			contents: {},
		};
		expect(
			FeltEndpointOutputSchemas.printPagesListLayouts.parse([layout]),
		).toHaveLength(1);
	});

	it('accepts a csv or geojson comments export as well as the json array', () => {
		expect(
			FeltEndpointOutputSchemas.commentsExport.parse('id,text\n1,hello\n'),
		).toBe('id,text\n1,hello\n');
		expect(
			FeltEndpointOutputSchemas.commentsExport.parse({
				type: 'FeatureCollection',
				features: [],
			}),
		).toEqual({ type: 'FeatureCollection', features: [] });
		expect(
			FeltEndpointOutputSchemas.commentsExport.parse([{ id: 'c_1' }]),
		).toHaveLength(1);
	});

	it('keeps parsing when Felt adds a new value to an output enum', () => {
		expect(
			FeltEndpointOutputSchemas.layersGet.parse({
				...layer,
				geometry_type: 'Multipoint',
				legend_display: 'new_mode',
			}).geometry_type,
		).toBe('Multipoint');
		expect(
			FeltEndpointOutputSchemas.projectsGet.parse({
				id: 'p_1',
				name: 'Project',
				visibility: 'organization',
				max_inherited_permission: 'view_and_admin',
				maps: [],
			}).visibility,
		).toBe('organization');
	});
});

describe('Felt request bodies from the API reference', () => {
	it('layers.addFromSource takes the reference body for each `from`', () => {
		expect(
			FeltEndpointInputSchemas.layersAddFromSource.parse({
				map_id: 'm_1',
				from: 'dataset',
				dataset_id: 'd_1',
			}),
		).toEqual({ map_id: 'm_1', from: 'dataset', dataset_id: 'd_1' });
		expect(
			FeltEndpointInputSchemas.layersAddFromSource.parse({
				map_id: 'm_1',
				from: 'sql',
				source_id: 's_1',
				query: 'select * from parcels',
			}).from,
		).toBe('sql');
		expect(() =>
			FeltEndpointInputSchemas.layersAddFromSource.parse({
				map_id: 'm_1',
				source_id: 's_1',
			}),
		).toThrow();
	});

	it('layers.duplicate takes source_layer_id or source_layer_group_id', () => {
		const input = {
			layers: [
				{ source_layer_id: 'l_1', destination_map_id: 'm_2' },
				{ source_layer_group_id: 'lg_1', destination_map_id: 'm_2' },
			],
		};
		expect(FeltEndpointInputSchemas.layersDuplicate.parse(input)).toEqual(
			input,
		);
		expect(() =>
			FeltEndpointInputSchemas.layersDuplicate.parse({
				layers: [{ layer_id: 'l_1', destination_map_id: 'm_2' }],
			}),
		).toThrow();
	});

	it('maps.exportImage takes the reference legend object, units and output', () => {
		const input = {
			map_id: 'm_1',
			legend: { visible: true, show_title: true },
			units: 'us_standard' as const,
			output: { format: 'svg' as const, width_px: 800, height_px: 600 },
		};
		expect(FeltEndpointInputSchemas.mapsExportImage.parse(input)).toEqual(
			input,
		);
		expect(() =>
			FeltEndpointInputSchemas.mapsExportImage.parse({
				map_id: 'm_1',
				output: { format: 'png' },
			}),
		).toThrow();
	});

	it('layers.createCustomExport sends filters as an array', () => {
		const input = {
			map_id: 'm_1',
			layer_id: 'l_1',
			output_format: 'geojson',
			filters: [['name', 'eq', 'Main St']],
		};
		expect(
			FeltEndpointInputSchemas.layersCreateCustomExport.parse(input),
		).toEqual(input);
	});

	it('printPages.createLayout requires the page to save', () => {
		expect(() =>
			FeltEndpointInputSchemas.printPagesCreateLayout.parse({
				map_id: 'm_1',
				name: 'Layout',
			}),
		).toThrow();
		expect(
			FeltEndpointInputSchemas.printPagesCreateLayout.parse({
				map_id: 'm_1',
				page_id: 'pp_1',
			}).page_id,
		).toBe('pp_1');
	});

	it('requires the fields Felt requires on projects.create and sources.createCredential', () => {
		expect(() =>
			FeltEndpointInputSchemas.projectsCreate.parse({ name: 'P' }),
		).toThrow();
		expect(() =>
			FeltEndpointInputSchemas.sourcesCreateCredential.parse({
				source_id: 's_1',
				credential: { type: 'snowflake_pat', token: 'x' },
			}),
		).toThrow();
	});
});

describe('Felt responses seen in the live run (11-13)', () => {
	it('parses an example map whose viewer permission is null', () => {
		// Trimmed from GET /api/v2/maps/:id on a workspace's example map.
		const exampleMap = {
			...map,
			table_settings: {
				default_table_layer_id: null,
				viewers_can_open_table: false,
			},
			viewer_permissions: {
				can_duplicate_map: null,
				can_export_data: false,
				can_see_map_presence: false,
			},
		};
		expect(
			FeltEndpointOutputSchemas.mapsGet.parse(exampleMap).viewer_permissions,
		).toEqual(exampleMap.viewer_permissions);
	});

	it('parses Global Library layers whose hide_from_legend is null', () => {
		// Trimmed from GET /api/v2/library?source=felt.
		const library = {
			type: 'layer_library',
			layer_groups: [],
			layers: [
				{
					id: 'nZHoOexIRbu8m3F9BalC9BuD',
					type: 'layer',
					name: 'Alternative Fuel Stations',
					status: 'completed',
					progress: 100,
					style: {},
					subtitle: '',
					caption: '',
					legend_visibility: 'show',
					hide_from_legend: null,
					last_refreshed_at: '2023-07-22T21:43:32Z',
					geometry_type: 'Point',
					is_spreadsheet: false,
					next_refresh_at: null,
					refresh_status: 'disabled',
					refresh_period: 'disabled',
					paused_reason: null,
				},
			],
		};
		expect(
			FeltEndpointOutputSchemas.layersListLibrary.parse(library).layers,
		).toHaveLength(1);
	});
});
