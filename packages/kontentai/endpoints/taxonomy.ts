import type { KontentEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	KontentEndpointInputSchemas as Inputs,
	KONTENT_DEFAULT_LIMIT,
	KontentEndpointOutputSchemas as Outputs,
} from './types';

export const list: KontentEndpoints['typesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'types.list',
			input: Inputs.typesList,
			output: Outputs.typesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/types',
			preview: parsed.preview,
			query: definedQuery({
				skip: parsed.skip,
				limit: parsed.limit,
				order: parsed.order,
			}),
		}),
		{
			shape: (raw, parsed) =>
				listShape(raw, parsed, 'types', KONTENT_DEFAULT_LIMIT),
			log: (_, result) => ({ count: result.types.length }),
		},
	);

export const get: KontentEndpoints['typesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'types.get',
			input: Inputs.typesGet,
			output: Outputs.typesGet,
		},
		input,
		({ codename, preview }) => ({
			method: 'GET',
			path: `/types/${segment(codename)}`,
			preview,
		}),
		{
			// Kontent answers the type at the root; the output is `{ type }`.
			shape: (raw) => ({ type: raw }),
			log: (_, result) => ({
				codename: result.type.system.codename ?? undefined,
				elements: Object.keys(result.type.elements ?? {}).length,
			}),
		},
	);

export const taxonomies: KontentEndpoints['taxonomiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'taxonomies.list',
			input: Inputs.taxonomiesList,
			output: Outputs.taxonomiesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/taxonomies',
			preview: parsed.preview,
			query: definedQuery({
				skip: parsed.skip,
				limit: parsed.limit,
				order: parsed.order,
			}),
		}),
		{
			shape: (raw, parsed) =>
				listShape(raw, parsed, 'taxonomies', KONTENT_DEFAULT_LIMIT),
			log: (_, result) => ({ count: result.taxonomies.length }),
		},
	);

export const languages: KontentEndpoints['languagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'languages.list',
			input: Inputs.languagesList,
			output: Outputs.languagesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/languages',
			preview: parsed.preview,
			query: definedQuery({
				skip: parsed.skip,
				limit: parsed.limit,
				order: parsed.order,
			}),
		}),
		{
			shape: (raw, parsed) =>
				listShape(raw, parsed, 'languages', KONTENT_DEFAULT_LIMIT),
			log: (_, result) => ({ count: result.languages.length }),
		},
	);
