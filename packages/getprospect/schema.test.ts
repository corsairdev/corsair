import { GetProspectOperations } from './endpoints';
import {
	GetProspectOperationInputSchemas,
	GetProspectOperationOutputSchemas,
	getProspectOperationDefinitions,
} from './endpoints/types';
import { getprospectEndpointMeta, getprospectEndpointSchemas } from './index';
import { GetProspectSchema } from './schema';

function flattenEndpointPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		return typeof value === 'object' && value !== null
			? flattenEndpointPaths(value, path)
			: [];
	});
}

describe('GetProspect schemas', () => {
	it('declares a semver schema version and no persisted entities', () => {
		expect(GetProspectSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(GetProspectSchema.entities).toEqual({});
	});

	it('keeps endpoint, input/output schema, and metadata inventories aligned', () => {
		const endpointPaths = flattenEndpointPaths(GetProspectOperations).sort();
		expect(Object.keys(getprospectEndpointSchemas).sort()).toEqual(
			endpointPaths,
		);
		expect(Object.keys(getprospectEndpointMeta).sort()).toEqual(endpointPaths);
		expect(Object.keys(getProspectOperationDefinitions).sort()).toEqual(
			Object.keys(GetProspectOperationInputSchemas).sort(),
		);
		expect(Object.keys(GetProspectOperationOutputSchemas).sort()).toEqual(
			Object.keys(GetProspectOperationInputSchemas).sort(),
		);
	});

	it('rejects undocumented request properties and invalid pagination bounds', () => {
		const searchInput = GetProspectOperationInputSchemas.people_search;
		expect(
			searchInput.safeParse({ body: { unknown_field: true } }).success,
		).toBe(false);
		const verificationResults =
			GetProspectOperationInputSchemas.email_verifications_results;
		expect(
			verificationResults.safeParse({
				path: { id: 'verification-1' },
				query: { limit: 501 },
			}).success,
		).toBe(false);
	});

	it('rejects undocumented query enums and malformed provider responses', () => {
		expect(
			GetProspectOperationInputSchemas.lists_list.safeParse({
				query: { type: 'unsupported' },
			}).success,
		).toBe(false);
		expect(
			GetProspectOperationOutputSchemas.people_search.safeParse({}).success,
		).toBe(false);
	});
});
