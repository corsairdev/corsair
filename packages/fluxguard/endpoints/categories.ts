import { asRecord } from 'corsair/core';
import type { FluxguardEndpoints } from '..';
import { call } from './call';
import {
	FluxguardEndpointInputSchemas as Inputs,
	FluxguardEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Fluxguard indexes categories by id and leaves the id OUT of each value, so
 * the key has to become the `id` field. An account with no categories answers
 * `{}`. A flat array is accepted too, since the API is in beta.
 */
export function normalizeCategories(raw: unknown): Record<string, unknown>[] {
	if (Array.isArray(raw)) {
		for (const [index, value] of raw.entries()) {
			if (value === null || typeof value !== 'object' || Array.isArray(value)) {
				throw new Error(
					`Fluxguard returned an unexpected category list body: entry ${index} is not an object`,
				);
			}
		}
		return raw as Record<string, unknown>[];
	}
	const record = asRecord(raw);
	if (!record)
		throw new Error('Fluxguard returned an unexpected category list body');
	return Object.entries(record).map(([id, value]) => {
		const category = asRecord(value);
		if (!category) {
			throw new Error(
				`Fluxguard returned an unexpected category list body: category ${id} is not an object`,
			);
		}
		return { id, ...category };
	});
}

export const list: FluxguardEndpoints['categoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
		},
		input,
		() => ({ method: 'GET', path: '/account/category' }),
		{
			// Keyed by category ID, with the id missing from the value; an
			// account with none answers `{}`.
			shape: (raw) => ({ categories: normalizeCategories(raw) }),
			log: (_, result) => ({ count: result.categories.length }),
		},
	);

export const create: FluxguardEndpoints['categoriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.create',
			input: Inputs.categoriesCreate,
			output: Outputs.categoriesCreate,
		},
		input,
		({ name }) => ({
			method: 'POST',
			path: '/account/category',
			body: { name },
		}),
		{ log: (_, result) => ({ categoryId: result.id }) },
	);
