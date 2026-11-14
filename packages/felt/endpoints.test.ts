import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Comments,
	Elements,
	LayerComponents,
	LayerGroups,
	Layers,
	Maps,
	PrintPages,
	Projects,
	Sources,
	Users,
} from './endpoints';
import { felt, feltEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	// `unknown` because jest.requireActual dynamically returns untyped module exports.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	// `unknown` because jest.requireActual dynamically returns untyped module exports.
	const actual = jest.requireActual('./client') as Record<string, unknown>;
	return { ...actual, makeFeltRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeFeltRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Users.getCurrent>[0];

function buildCtx(): Ctx {
	return {
		endpoints: {},
		$getAccountId: async () => 'acc-123',
		key: 'test-token',
		options: { key: 'test-token' },
		keys: {
			get_dek: async () => 'dek-123',
			issue_new_dek: async () => 'dek-123',
			get_api_key: async () => 'test-token',
			set_api_key: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
		},
		db: {},
		// `unknown` because Ctx type assertion is needed for mocking complete Corsair plugin context.
	} as unknown as Ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Felt plugin endpoints registry symmetry', () => {
	it('matches endpoint hierarchy against schema registry', () => {
		const instance = felt({ key: 'test-token' });
		const endpoints = instance.endpoints!;
		const flatEndpoints: string[] = [];
		for (const [group, ops] of Object.entries(endpoints)) {
			// `unknown` because ops map is dynamically inspected across endpoint groups.
			for (const op of Object.keys(ops as Record<string, unknown>)) {
				flatEndpoints.push(`${group}.${op}`);
			}
		}
		const schemaKeys = Object.keys(feltEndpointSchemas);
		const metaKeys = Object.keys(instance.endpointMeta ?? {});

		expect(flatEndpoints.sort()).toEqual(schemaKeys.sort());
		expect(flatEndpoints.sort()).toEqual(metaKeys.sort());
	});

	it('configures keyBuilder to throw AuthMissingError when key is not present', async () => {
		const instance = felt();
		await expect(
			instance.keyBuilder!(
				{
					authType: 'api_key',
					options: {},
					keys: {
						get_api_key: async () => undefined,
					},
					tenantId: 't-123',
					meteredOperationId: 'felt.maps.get',
					// `unknown` because keyBuilder context is mocked for error handling tests.
				} as unknown as Parameters<NonNullable<typeof instance.keyBuilder>>[0],
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns configured options.key directly in keyBuilder', async () => {
		const instance = felt({ key: 'my-manual-key' });
		const res = await instance.keyBuilder!(
			{
				authType: 'api_key',
				options: { key: 'my-manual-key' },
				keys: {
					get_api_key: async () => undefined,
				},
				tenantId: 't-123',
				meteredOperationId: 'felt.maps.get',
				// `unknown` because keyBuilder context is mocked for credential verification.
			} as unknown as Parameters<NonNullable<typeof instance.keyBuilder>>[0],
			'endpoint',
		);
		expect(res).toBe('my-manual-key');
	});
});

describe('Users endpoints', () => {
	it('users.getCurrent calls GET /user', async () => {
		const mockUser = { id: 'u_1', name: 'Alice', email: 'alice@example.com' };
		mockedRequest.mockResolvedValue(mockUser);

		const result = await Users.getCurrent(ctx, {});
		expect(result).toEqual(mockUser);
		expect(mockedRequest).toHaveBeenCalledWith('/user', 'test-token', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'felt.users.getCurrent',
			{},
			'completed',
		);
	});
});

describe('Maps endpoints', () => {
	it('maps.create calls POST /maps', async () => {
		const mockMap = { id: 'm_1', title: 'New Map' };
		mockedRequest.mockResolvedValue(mockMap);

		const result = await Maps.create(ctx, { title: 'New Map' });
		expect(result).toEqual(mockMap);
		expect(mockedRequest).toHaveBeenCalledWith('/maps', 'test-token', {
			method: 'POST',
			body: { title: 'New Map' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'felt.maps.create',
			{ id: 'm_1' },
			'completed',
		);
	});

	it('maps.get calls GET /maps/:id', async () => {
		const mockMap = { id: 'm_1', title: 'Existing Map' };
		mockedRequest.mockResolvedValue(mockMap);

		const result = await Maps.get(ctx, { map_id: 'm_1' });
		expect(result).toEqual(mockMap);
		expect(mockedRequest).toHaveBeenCalledWith('/maps/m_1', 'test-token', {
			method: 'GET',
		});
	});

	it('maps.update calls POST /maps/:id/update', async () => {
		const mockMap = { id: 'm_1', title: 'Updated' };
		mockedRequest.mockResolvedValue(mockMap);

		const result = await Maps.update(ctx, { map_id: 'm_1', title: 'Updated' });
		expect(result).toEqual(mockMap);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/update',
			'test-token',
			{
				method: 'POST',
				body: { title: 'Updated' },
			},
		);
	});

	it('maps.delete calls DELETE /maps/:id', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Maps.delete(ctx, { map_id: 'm_1' });
		expect(result).toEqual({ success: true, id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/maps/m_1', 'test-token', {
			method: 'DELETE',
		});
	});

	it('maps.duplicate calls POST /maps/:id/duplicate', async () => {
		const mockMap = { id: 'm_2', title: 'Copy' };
		mockedRequest.mockResolvedValue(mockMap);

		const result = await Maps.duplicate(ctx, { map_id: 'm_1', title: 'Copy' });
		expect(result).toEqual(mockMap);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/duplicate',
			'test-token',
			{
				method: 'POST',
				body: { title: 'Copy' },
			},
		);
	});

	it('maps.move calls POST /maps/:id/move', async () => {
		const mockMap = { id: 'm_1', project_id: 'p_1' };
		mockedRequest.mockResolvedValue(mockMap);

		const result = await Maps.move(ctx, { map_id: 'm_1', project_id: 'p_1' });
		expect(result).toEqual(mockMap);
		expect(mockedRequest).toHaveBeenCalledWith('/maps/m_1/move', 'test-token', {
			method: 'POST',
			body: { project_id: 'p_1' },
		});
	});

	it('maps.exportImage calls POST /maps/:id/image_exports', async () => {
		const mockExp = { id: 'exp_1', status: 'pending' };
		mockedRequest.mockResolvedValue(mockExp);

		const result = await Maps.exportImage(ctx, {
			map_id: 'm_1',
			legend: { visible: true },
			output: { width_px: 800, height_px: 600 },
		});
		expect(result).toEqual(mockExp);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/image_exports',
			'test-token',
			{
				method: 'POST',
				body: {
					legend: { visible: true },
					output: { width_px: 800, height_px: 600 },
				},
				// Felt holds a synchronous export open for up to 55 s.
				timeoutMs: 70_000,
			},
		);
	});

	it('maps.createEmbedToken calls POST /maps/:id/embed_token', async () => {
		const mockTok = { token: 'tok_1' };
		mockedRequest.mockResolvedValue(mockTok);

		const result = await Maps.createEmbedToken(ctx, {
			map_id: 'm_1',
			user_email: 'embed@example.com',
		});
		expect(result).toEqual(mockTok);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/embed_token',
			'test-token',
			{
				method: 'POST',
				query: { user_email: 'embed@example.com' },
			},
		);
	});

	it('rejects invalid map input before making network request', async () => {
		// `unknown` because invalid parameters are tested against Zod schema.
		const err = await Maps.get(
			ctx,
			// `unknown` because invalid parameters are tested against Zod schema.
			{ map_id: '' } as unknown as Parameters<typeof Maps.get>[1],
		).catch(
			// `unknown` because rejection caught value has no static type.
			(e: unknown) => e,
		);
		expect(err).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Layers endpoints', () => {
	it('layers.list calls GET /maps/:id/layers', async () => {
		mockedRequest.mockResolvedValue([{ id: 'l_1', name: 'Layer 1' }]);

		const result = await Layers.list(ctx, { map_id: 'm_1' });
		expect(result).toEqual([{ id: 'l_1', name: 'Layer 1' }]);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers',
			'test-token',
			{
				method: 'GET',
				query: undefined,
			},
		);
	});

	it('layers.get calls GET /maps/:id/layers/:layer_id', async () => {
		mockedRequest.mockResolvedValue({ id: 'l_1', name: 'Layer 1' });

		const result = await Layers.get(ctx, { map_id: 'm_1', layer_id: 'l_1' });
		expect(result).toEqual({ id: 'l_1', name: 'Layer 1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1',
			'test-token',
			{
				method: 'GET',
			},
		);
	});

	it('layers.update calls POST /maps/:id/layers', async () => {
		mockedRequest.mockResolvedValue([{ id: 'l_1', name: 'Updated' }]);

		const result = await Layers.update(ctx, {
			map_id: 'm_1',
			layers: [{ id: 'l_1', name: 'Updated' }],
		});
		expect(result).toEqual([{ id: 'l_1', name: 'Updated' }]);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers',
			'test-token',
			{
				method: 'POST',
				body: [{ id: 'l_1', name: 'Updated' }],
			},
		);
	});

	it('layers.delete calls DELETE /maps/:id/layers/:layer_id', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Layers.delete(ctx, { map_id: 'm_1', layer_id: 'l_1' });
		expect(result).toEqual({ success: true, id: 'l_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1',
			'test-token',
			{
				method: 'DELETE',
			},
		);
	});

	it('layers.upload calls POST /maps/:id/upload', async () => {
		const mockRes = { layer_id: 'l_1', url: 'https://s3.example.com' };
		mockedRequest.mockResolvedValue(mockRes);

		const result = await Layers.upload(ctx, {
			map_id: 'm_1',
			name: 'Upload Layer',
		});
		expect(result).toEqual(mockRes);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/upload',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Upload Layer' },
			},
		);
	});

	it('layers.addFromSource calls POST /maps/:id/add_source_layer', async () => {
		mockedRequest.mockResolvedValue({ status: 'accepted' });

		const result = await Layers.addFromSource(ctx, {
			map_id: 'm_1',
			from: 'sql',
			source_id: 's_1',
			query: 'select * from parcels',
		});
		expect(result).toEqual({ status: 'accepted' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/add_source_layer',
			'test-token',
			{
				method: 'POST',
				body: {
					from: 'sql',
					source_id: 's_1',
					query: 'select * from parcels',
				},
			},
		);
	});

	it('layers.refresh calls POST /maps/:id/layers/:layer_id/refresh', async () => {
		const refreshRes = {
			type: 'upload_response',
			layer_id: 'l_1',
			url: null,
			presigned_attributes: null,
		};
		mockedRequest.mockResolvedValue(refreshRes);

		const result = await Layers.refresh(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
		});
		expect(result).toEqual(refreshRes);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/refresh',
			'test-token',
			{
				method: 'POST',
			},
		);
	});

	it('layers.updateStyle calls POST /maps/:id/layers/:layer_id/update_style', async () => {
		mockedRequest.mockResolvedValue({ id: 'l_1' });

		const result = await Layers.updateStyle(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			style: { color: 'blue' },
		});
		expect(result).toEqual({ id: 'l_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/update_style',
			'test-token',
			{
				method: 'POST',
				body: { style: { color: 'blue' } },
			},
		);
	});

	it('layers.publish calls POST /maps/:id/layers/:layer_id/publish', async () => {
		mockedRequest.mockResolvedValue({ id: 'l_1' });

		const result = await Layers.publish(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			name: 'Public Layer',
		});
		expect(result).toEqual({ id: 'l_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/publish',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Public Layer' },
			},
		);
	});

	it('layers.createCustomExport calls POST /maps/:id/layers/:layer_id/custom_export', async () => {
		mockedRequest.mockResolvedValue({ export_request_id: 'exp_req_1' });

		const result = await Layers.createCustomExport(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			output_format: 'geojson',
		});
		expect(result).toEqual({ export_request_id: 'exp_req_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/custom_export',
			'test-token',
			{
				method: 'POST',
				body: { output_format: 'geojson' },
			},
		);
	});

	it('layers.pollCustomExport calls GET /maps/:id/layers/:layer_id/custom_exports/:export_id', async () => {
		mockedRequest.mockResolvedValue({
			export_id: 'exp_req_1',
			status: 'completed',
		});

		const result = await Layers.pollCustomExport(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			export_id: 'exp_req_1',
		});
		expect(result).toEqual({ export_id: 'exp_req_1', status: 'completed' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/custom_exports/exp_req_1',
			'test-token',
			{
				method: 'GET',
			},
		);
	});

	it('layers.getExportLink calls GET /maps/:id/layers/:layer_id/get_export_link', async () => {
		mockedRequest.mockResolvedValue({ export_link: 'https://example.com/dl' });

		const result = await Layers.getExportLink(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
		});
		expect(result).toEqual({ export_link: 'https://example.com/dl' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/get_export_link',
			'test-token',
			{
				method: 'GET',
			},
		);
	});

	it('layers.duplicate calls POST /duplicate_layers', async () => {
		mockedRequest.mockResolvedValue({ layers: [{ id: 'l_2' }] });

		const result = await Layers.duplicate(ctx, {
			layers: [{ source_layer_id: 'l_1', destination_map_id: 'm_2' }],
		});
		expect(result).toEqual({ layers: [{ id: 'l_2' }] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/duplicate_layers',
			'test-token',
			{
				method: 'POST',
				body: [{ source_layer_id: 'l_1', destination_map_id: 'm_2' }],
			},
		);
	});

	it('layers.listLibrary calls GET /library', async () => {
		mockedRequest.mockResolvedValue({ layers: [] });

		const result = await Layers.listLibrary(ctx, { source: 'felt' });
		expect(result).toEqual({ layers: [] });
		expect(mockedRequest).toHaveBeenCalledWith('/library', 'test-token', {
			method: 'GET',
			query: { source: 'felt' },
		});
	});
});

describe('LayerGroups endpoints', () => {
	it('supports full LayerGroups CRUD operations', async () => {
		mockedRequest.mockResolvedValue([{ id: 'lg_1', name: 'Group 1' }]);
		await LayerGroups.list(ctx, { map_id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'lg_1', name: 'Group 1' });
		await LayerGroups.get(ctx, { map_id: 'm_1', layer_group_id: 'lg_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups/lg_1',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'lg_1', name: 'Renamed' });
		await LayerGroups.update(ctx, {
			map_id: 'm_1',
			layer_group_id: 'lg_1',
			name: 'Renamed',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups/lg_1',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Renamed' },
			},
		);

		mockedRequest.mockResolvedValue([{ id: 'lg_1', name: 'Bulk Group' }]);
		await LayerGroups.updateBulk(ctx, {
			map_id: 'm_1',
			layer_groups: [{ id: 'lg_1', name: 'Bulk' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups',
			'test-token',
			{
				method: 'POST',
				body: [{ id: 'lg_1', name: 'Bulk' }],
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await LayerGroups.delete(ctx, { map_id: 'm_1', layer_group_id: 'lg_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups/lg_1',
			'test-token',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValue({ id: 'lg_1', name: 'Published Group' });
		await LayerGroups.publish(ctx, {
			map_id: 'm_1',
			layer_group_id: 'lg_1',
			name: 'Published',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layer_groups/lg_1/publish',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Published' },
			},
		);
	});
});

describe('LayerComponents endpoints', () => {
	it('supports LayerComponents CRUD operations', async () => {
		mockedRequest.mockResolvedValue([{ id: 'c_1' }]);
		await LayerComponents.list(ctx, { map_id: 'm_1', layer_id: 'l_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/components',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'c_1' });
		await LayerComponents.create(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			component: { type: 'card' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/components',
			'test-token',
			{
				method: 'POST',
				body: { type: 'card' },
			},
		);

		mockedRequest.mockResolvedValue({ id: 'c_1' });
		await LayerComponents.get(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			component_id: 'c_1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/components/c_1',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'c_1' });
		await LayerComponents.update(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			component_id: 'c_1',
			component: { title: 'Updated' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/components/c_1',
			'test-token',
			{
				method: 'POST',
				body: { title: 'Updated' },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await LayerComponents.delete(ctx, {
			map_id: 'm_1',
			layer_id: 'l_1',
			component_id: 'c_1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/layers/l_1/components/c_1',
			'test-token',
			{ method: 'DELETE' },
		);
	});
});

describe('Elements endpoints', () => {
	it('supports Elements and Groups operations', async () => {
		mockedRequest.mockResolvedValue({
			type: 'FeatureCollection',
			features: [],
		});
		await Elements.list(ctx, { map_id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/elements',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			type: 'FeatureCollection',
			features: [],
		});
		await Elements.upsert(ctx, { map_id: 'm_1', features: [] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/elements',
			'test-token',
			{
				method: 'POST',
				body: { type: 'FeatureCollection', features: [] },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await Elements.delete(ctx, { map_id: 'm_1', element_id: 'el_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/elements/el_1',
			'test-token',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValue([{ id: 'eg_1' }]);
		await Elements.listGroups(ctx, { map_id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/element_groups',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({
			type: 'FeatureCollection',
			features: [],
		});
		await Elements.getGroup(ctx, { map_id: 'm_1', group_id: 'eg_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/element_groups/eg_1',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue([{ id: 'eg_1' }]);
		await Elements.upsertGroups(ctx, {
			map_id: 'm_1',
			groups: [{ id: 'eg_1', name: 'Pins' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/element_groups',
			'test-token',
			{
				method: 'POST',
				body: [{ id: 'eg_1', name: 'Pins' }],
			},
		);
	});
});

describe('Comments endpoints', () => {
	it('comments.export parses a geojson export that Felt sends as text', async () => {
		// Live run 11-13: format=geojson came back as a JSON string, not a parsed object.
		mockedRequest.mockResolvedValue(
			'{"type":"FeatureCollection","features":[]}',
		);
		const result = await Comments.export(ctx, {
			map_id: 'm_1',
			format: 'geojson',
		});
		expect(result).toEqual({ type: 'FeatureCollection', features: [] });

		mockedRequest.mockResolvedValue('thread_id,comment_id\n');
		const csv = await Comments.export(ctx, { map_id: 'm_1', format: 'csv' });
		expect(csv).toBe('thread_id,comment_id\n');
	});

	it('supports Comments export, resolve and delete operations', async () => {
		mockedRequest.mockResolvedValue([{ id: 'c_1', text: 'Hello' }]);
		await Comments.export(ctx, { map_id: 'm_1', format: 'json' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/comments/export',
			'test-token',
			{
				method: 'GET',
				query: { format: 'json' },
			},
		);

		mockedRequest.mockResolvedValue({ comment_id: 'c_1' });
		await Comments.resolve(ctx, { map_id: 'm_1', comment_id: 'c_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/comments/c_1/resolve',
			'test-token',
			{
				method: 'POST',
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await Comments.delete(ctx, { map_id: 'm_1', comment_id: 'c_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/comments/c_1',
			'test-token',
			{
				method: 'DELETE',
			},
		);
	});
});

describe('Projects endpoints', () => {
	it('supports Projects CRUD operations', async () => {
		mockedRequest.mockResolvedValue([{ id: 'p_1', name: 'Q1 Maps' }]);
		await Projects.list(ctx, { workspace_id: 'w_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/projects', 'test-token', {
			method: 'GET',
			query: { workspace_id: 'w_1' },
		});

		mockedRequest.mockResolvedValue({ id: 'p_1', name: 'New Project' });
		await Projects.create(ctx, { name: 'New Project', visibility: 'private' });
		expect(mockedRequest).toHaveBeenCalledWith('/projects', 'test-token', {
			method: 'POST',
			body: { name: 'New Project', visibility: 'private' },
		});

		mockedRequest.mockResolvedValue({ id: 'p_1', name: 'My Project' });
		await Projects.get(ctx, { project_id: 'p_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/projects/p_1', 'test-token', {
			method: 'GET',
		});

		mockedRequest.mockResolvedValue({ id: 'p_1', name: 'Updated' });
		await Projects.update(ctx, { project_id: 'p_1', name: 'Updated' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/projects/p_1/update',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Updated' },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await Projects.delete(ctx, { project_id: 'p_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/projects/p_1', 'test-token', {
			method: 'DELETE',
		});
	});
});

describe('Sources endpoints', () => {
	it('supports Sources CRUD and Credential management with privacy logging', async () => {
		mockedRequest.mockResolvedValue([{ id: 's_1', name: 'DB' }]);
		await Sources.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/sources', 'test-token', {
			method: 'GET',
			query: undefined,
		});

		mockedRequest.mockResolvedValue({ id: 's_1' });
		await Sources.create(ctx, {
			name: 'DB',
			connection: { host: 'db.example.com' },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/sources', 'test-token', {
			method: 'POST',
			body: { name: 'DB', connection: { host: 'db.example.com' } },
		});

		mockedRequest.mockResolvedValue({ id: 's_1', name: 'DB' });
		await Sources.get(ctx, { source_id: 's_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/sources/s_1', 'test-token', {
			method: 'GET',
		});

		mockedRequest.mockResolvedValue({ id: 's_1' });
		await Sources.update(ctx, { source_id: 's_1', name: 'DB2' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sources/s_1/update',
			'test-token',
			{
				method: 'POST',
				body: { name: 'DB2' },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await Sources.delete(ctx, { source_id: 's_1' });
		expect(mockedRequest).toHaveBeenCalledWith('/sources/s_1', 'test-token', {
			method: 'DELETE',
		});

		mockedRequest.mockResolvedValue({ id: 's_1' });
		await Sources.sync(ctx, { source_id: 's_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sources/s_1/sync',
			'test-token',
			{ method: 'POST' },
		);

		mockedRequest.mockResolvedValue({ id: 'cred_1' });
		await Sources.createCredential(ctx, {
			source_id: 's_1',
			name: 'Cred',
			use_case: 'source_authentication',
			credential: { password: 'top-secret-password' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sources/s_1/credentials',
			'test-token',
			{
				method: 'POST',
				body: {
					name: 'Cred',
					use_case: 'source_authentication',
					credential: { password: 'top-secret-password' },
				},
			},
		);
		// Ensure secret credentials are NOT logged in event context
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'felt.sources.createCredential',
			{ source_id: 's_1', credential_id: 'cred_1' },
			'completed',
		);
		const lastLogCall =
			mockedLogEvent.mock.calls[mockedLogEvent.mock.calls.length - 1];
		expect(JSON.stringify(lastLogCall)).not.toContain('top-secret-password');

		mockedRequest.mockResolvedValue({ id: 'cred_1' });
		await Sources.updateCredential(ctx, {
			source_id: 's_1',
			credential_id: 'cred_1',
			credential: { password: 'new-secret' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sources/s_1/credentials/cred_1/update',
			'test-token',
			{
				method: 'POST',
				body: { credential: { password: 'new-secret' } },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await Sources.deleteCredential(ctx, {
			source_id: 's_1',
			credential_id: 'cred_1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sources/s_1/credentials/cred_1',
			'test-token',
			{
				method: 'DELETE',
			},
		);
	});
});

describe('PrintPages endpoints', () => {
	it('supports PrintLayouts and PrintPages CRUD operations', async () => {
		mockedRequest.mockResolvedValue([{ id: 'pl_1' }]);
		await PrintPages.listLayouts(ctx, { map_id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_layouts',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'pl_1' });
		await PrintPages.createLayout(ctx, {
			map_id: 'm_1',
			page_id: 'pp_1',
			name: 'Layout 1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_layouts',
			'test-token',
			{
				method: 'POST',
				body: { page_id: 'pp_1', name: 'Layout 1' },
			},
		);

		mockedRequest.mockResolvedValue({ id: 'pl_1' });
		await PrintPages.updateLayout(ctx, {
			map_id: 'm_1',
			layout_id: 'pl_1',
			name: 'Layout Updated',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_layouts/pl_1',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Layout Updated' },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await PrintPages.deleteLayout(ctx, { map_id: 'm_1', layout_id: 'pl_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_layouts/pl_1',
			'test-token',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValue([{ id: 'pp_1' }]);
		await PrintPages.listPages(ctx, { map_id: 'm_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'pp_1' });
		await PrintPages.createPage(ctx, { map_id: 'm_1', name: 'Page 1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Page 1' },
			},
		);

		mockedRequest.mockResolvedValue({ id: 'pp_1' });
		await PrintPages.getPage(ctx, { map_id: 'm_1', page_id: 'pp_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1',
			'test-token',
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValue({ id: 'pp_1' });
		await PrintPages.updatePage(ctx, {
			map_id: 'm_1',
			page_id: 'pp_1',
			name: 'Page Updated',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1',
			'test-token',
			{
				method: 'POST',
				body: { name: 'Page Updated' },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await PrintPages.deletePage(ctx, { map_id: 'm_1', page_id: 'pp_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1',
			'test-token',
			{ method: 'DELETE' },
		);

		mockedRequest.mockResolvedValue({ id: 'pexp_1', page_id: 'pp_1' });
		await PrintPages.exportPage(ctx, { map_id: 'm_1', page_id: 'pp_1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1/exports',
			'test-token',
			{
				method: 'POST',
				timeoutMs: 70_000,
			},
		);

		mockedRequest.mockResolvedValue({ id: 'pp_1' });
		await PrintPages.upsertItems(ctx, {
			map_id: 'm_1',
			page_id: 'pp_1',
			items: [{ type: 'legend' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1/items',
			'test-token',
			{
				method: 'POST',
				body: { items: [{ type: 'legend' }] },
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await PrintPages.deleteItem(ctx, {
			map_id: 'm_1',
			page_id: 'pp_1',
			item_id: 'pi_1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/maps/m_1/print_pages/pp_1/items/pi_1',
			'test-token',
			{
				method: 'DELETE',
			},
		);
	});
});
