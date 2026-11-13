import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
} from './endpoints/types';
import {
	gigasheet,
	gigasheetAuthConfig,
	gigasheetEndpointSchemas,
	PUBLIC_ENDPOINTS,
} from './index';
import { GigasheetSchema } from './schema';

describe('Gigasheet Schema & Types', () => {
	it('exports GigasheetSchema with version and entities', () => {
		expect(GigasheetSchema.version).toBe('1.0.0');
		expect(GigasheetSchema.entities).toEqual({});
	});

	it('configures api_key authConfig correctly', () => {
		expect(gigasheetAuthConfig).toEqual({
			api_key: {},
		});
	});

	it('registers user.whoami as a public endpoint', () => {
		expect(PUBLIC_ENDPOINTS.has('user.whoami')).toBe(true);
	});

	it('keeps endpoint registry, schema map, and metadata keys in perfect sync', () => {
		const plugin = gigasheet();
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpointSchemas).toBeDefined();
		expect(plugin.endpointMeta).toBeDefined();

		const endpoints = plugin.endpoints ?? {};
		const endpointSchemas = plugin.endpointSchemas ?? {};
		const endpointMeta = plugin.endpointMeta ?? {};

		const nestedKeys: string[] = [];

		for (const [group, groupObj] of Object.entries(endpoints)) {
			// `unknown` because groupObj is a nested object of endpoints.
			for (const action of Object.keys(groupObj as Record<string, unknown>)) {
				nestedKeys.push(`${group}.${action}`);
			}
		}

		const schemaKeys = Object.keys(endpointSchemas).sort();
		const metaKeys = Object.keys(endpointMeta).sort();
		nestedKeys.sort();

		expect(schemaKeys).toEqual(nestedKeys);
		expect(metaKeys).toEqual(nestedKeys);
		expect(nestedKeys.length).toBe(18);
	});

	// --------------------------------------------------------------------------
	// User Schemas
	// --------------------------------------------------------------------------
	describe('User Schemas', () => {
		it('validates user.whoami schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['user.whoami'].safeParse({}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.whoami'].safeParse({
					username: 'test',
					authenticated: true,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.whoami'].safeParse({
					username: 123,
				}).success,
			).toBe(false);
		});

		it('validates user.getDetails schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['user.getDetails'].safeParse({}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.getDetails'].safeParse({
					username: 'user1',
					email: 'user1@example.com',
					extraProperty: 'allowedViaPassthrough',
				}).success,
			).toBe(true);
		});

		it('validates user.getSpaceUsed schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['user.getSpaceUsed'].safeParse({}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.getSpaceUsed'].safeParse({
					bytesUsed: 500000,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.getSpaceUsed'].safeParse({
					bytesUsed: -1,
				}).success,
			).toBe(false);
		});

		it('validates user.getEnrichmentCredits schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['user.getEnrichmentCredits'].safeParse({}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.getEnrichmentCredits'].safeParse({
					Limit: 1000,
					Used: 100,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['user.getEnrichmentCredits'].safeParse({
					Limit: -1,
					Used: 0,
				}).success,
			).toBe(false);
		});
	});

	// --------------------------------------------------------------------------
	// Upload Schemas
	// --------------------------------------------------------------------------
	describe('Upload Schemas', () => {
		it('validates upload.fromUrl schemas', () => {
			const valid = {
				url: 'https://example.com/data.csv',
				name: 'Dataset',
				folderHandle: 'folder_123',
			};
			expect(
				GigasheetEndpointInputSchemas['upload.fromUrl'].safeParse(valid).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['upload.fromUrl'].safeParse({
					url: 'invalid-url',
					name: 'Dataset',
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['upload.fromUrl'].safeParse({
					Handle: 'h_123',
					Success: true,
				}).success,
			).toBe(true);
		});

		it('validates upload.direct schemas', () => {
			const validString = {
				name: 'data.csv',
				contents: 'col1,col2',
			};
			const validBytes = {
				name: 'data.bin',
				contents: [1, 2, 3, 4],
			};
			expect(
				GigasheetEndpointInputSchemas['upload.direct'].safeParse(validString).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['upload.direct'].safeParse(validBytes).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['upload.direct'].safeParse({
					name: '',
					contents: 'test',
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['upload.direct'].safeParse({
					Handle: 'h_direct',
				}).success,
			).toBe(true);
		});
	});

	// --------------------------------------------------------------------------
	// Datasets Schemas
	// --------------------------------------------------------------------------
	describe('Datasets Schemas', () => {
		it('validates datasets.get schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['datasets.get'].safeParse({
					handle: 'h_abc',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['datasets.get'].safeParse({
					handle: '',
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['datasets.get'].safeParse({
					FileUuid: 'h_abc',
					Status: 'processed',
					FileRows: 100,
					CustomField: 'passthrough',
				}).success,
			).toBe(true);
		});

		it('validates datasets.delete schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['datasets.delete'].safeParse({
					handle: 'h_del',
					recursive: true,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.delete'].safeParse({
					Success: true,
					Message: 'Deleted',
				}).success,
			).toBe(true);
		});

		it('validates datasets.getColumns schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['datasets.getColumns'].safeParse({
					handle: 'h_cols',
					showHidden: true,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.getColumns'].safeParse([
					{ Id: 'A', Name: 'Header A', FieldType: 'string' },
				]).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.getColumns'].safeParse([
					{ Id: 123 },
				]).success,
			).toBe(false);
		});

		it('validates datasets.list schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['datasets.list'].safeParse({}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.list'].safeParse([
					{
						metadata: { FileName: 'file.csv' },
						within_quota: true,
					},
				]).success,
			).toBe(true);
		});

		it('validates datasets.getOperationStatus schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['datasets.getOperationStatus'].safeParse({
					handle: 'h_status',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.getOperationStatus'].safeParse({
					Status: 'Done',
					Message: 'All rows processed',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['datasets.getOperationStatus'].safeParse({
					Status: 'InvalidStatus',
				}).success,
			).toBe(false);
		});
	});

	// --------------------------------------------------------------------------
	// Rows Schemas
	// --------------------------------------------------------------------------
	describe('Rows Schemas', () => {
		it('validates rows.appendByName schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['rows.appendByName'].safeParse({
					handle: 'h_append',
					records: [{ name: 'Alice', score: 100 }],
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['rows.appendByName'].safeParse({
					handle: '',
					records: [],
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['rows.appendByName'].safeParse({
					Success: true,
				}).success,
			).toBe(true);
		});

		it('validates rows.insertBlankRow schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['rows.insertBlankRow'].safeParse({
					handle: 'h_blank',
					index: 0,
					num_rows: 5,
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['rows.insertBlankRow'].safeParse({
					handle: 'h_blank',
					index: -1,
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['rows.insertBlankRow'].safeParse({
					Success: true,
				}).success,
			).toBe(true);
		});

		it('validates rows.deleteRows schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['rows.deleteRows'].safeParse({
					handle: 'h_del_rows',
					rows: [1, 2, 3],
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['rows.deleteRows'].safeParse({
					Success: true,
				}).success,
			).toBe(true);
		});
	});

	// --------------------------------------------------------------------------
	// Views Schemas
	// --------------------------------------------------------------------------
	describe('Views Schemas', () => {
		it('validates views.list schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['views.list'].safeParse({
					handle: 'h_view',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['views.list'].safeParse([
					{ id: 'v1', name: 'Default View' },
				]).success,
			).toBe(true);
		});

		it('validates views.get schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['views.get'].safeParse({
					handle: 'h_view',
					view: 'v1',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['views.get'].safeParse({
					id: 'v1',
					name: 'My View',
				}).success,
			).toBe(true);
		});
	});

	// --------------------------------------------------------------------------
	// Exports Schemas
	// --------------------------------------------------------------------------
	describe('Exports Schemas', () => {
		it('validates exports.create schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['exports.create'].safeParse({
					handle: 'h_export',
					filename: 'export.csv',
					compressionType: 'zip',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointInputSchemas['exports.create'].safeParse({
					handle: 'h_export',
					compressionType: 'rar', // invalid enum
				}).success,
			).toBe(false);
			expect(
				GigasheetEndpointOutputSchemas['exports.create'].safeParse({
					handle: 'export_job_id',
				}).success,
			).toBe(true);
		});

		it('validates exports.download schemas', () => {
			expect(
				GigasheetEndpointInputSchemas['exports.download'].safeParse({
					handle: 'export_job_id',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['exports.download'].safeParse({
					presignedUrl: 'https://example.com/download.zip',
				}).success,
			).toBe(true);
			expect(
				GigasheetEndpointOutputSchemas['exports.download'].safeParse({
					presignedUrl: 'not-a-url',
				}).success,
			).toBe(false);
		});
	});
});
