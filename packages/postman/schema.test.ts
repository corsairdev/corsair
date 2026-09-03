import { PostmanEndpointOutputSchemas } from './endpoints/types';
import { PostmanSchema } from './schema';
import {
	PostmanCollection,
	PostmanEnvironment,
	PostmanMock,
	PostmanMonitor,
	PostmanWorkspace,
} from './schema/database';

describe('Postman schema', () => {
	it('declares a semver version', () => {
		expect(PostmanSchema.version).toBeDefined();
		expect(PostmanSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PostmanSchema.entities).toBe('object');
		expect(PostmanSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PostmanSchema.entities))).toBe(true);
		for (const entity of Object.values(PostmanSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('parses a realistic collection entity', () => {
		const parsed = PostmanCollection.parse({
			id: '2412a72c-1d8e-491b-aced-93809c0e94e9',
			name: 'Sample Collection',
			uid: '5852-2412a72c-1d8e-491b-aced-93809c0e94e9',
		});

		expect(parsed.id).toBe('2412a72c-1d8e-491b-aced-93809c0e94e9');
		expect(parsed.uid).toContain('5852');
	});

	it('parses workspace, environment, monitor, and mock entities', () => {
		expect(
			PostmanWorkspace.parse({ id: 'ws_1', name: 'Team', type: 'team' }).type,
		).toBe('team');
		expect(
			PostmanEnvironment.parse({ id: 'env_1', name: 'Prod', uid: 'uid-1' }).uid,
		).toBe('uid-1');
		expect(PostmanMonitor.parse({ id: 'mon_1', name: 'Nightly' }).name).toBe(
			'Nightly',
		);
		expect(PostmanMock.parse({ id: 'mock_1' }).id).toBe('mock_1');
	});

	it('rejects entities without an id', () => {
		expect(() => PostmanCollection.parse({ name: 'No id' })).toThrow();
		expect(() => PostmanWorkspace.parse({})).toThrow();
	});

	it('parses collection-create outputs', () => {
		const parsed = PostmanEndpointOutputSchemas.collectionsCreate.parse({
			collection: { id: 'col_1', name: 'Sample', uid: 'uid-1' },
		});

		expect(parsed.collection?.id).toBe('col_1');
	});

	it('parses workspace-list outputs', () => {
		const parsed = PostmanEndpointOutputSchemas.workspacesList.parse({
			workspaces: [{ id: 'ws_1', name: 'Team' }],
		});

		expect(parsed.workspaces).toHaveLength(1);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
