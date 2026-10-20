import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['fileDefinitionsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'fileDefinitions.list',
		In.fileDefinitionsList,
		Out.fileDefinitionsList,
		input,
		(i) => ({
			method: 'GET',
			path: ['filedefinitions'],
			query: {
				include: i.include,
				exclude: i.exclude,
				externalId: i.externalId,
				limit: i.limit,
			},
			empty: [],
		}),
	);

export const get: CeligoEndpoints['fileDefinitionsGet'] = (ctx, input) =>
	callCeligo(
		ctx,
		'fileDefinitions.get',
		In.fileDefinitionsGet,
		Out.fileDefinitionsGet,
		input,
		(i) => ({
			method: 'GET',
			path: ['filedefinitions', i.id],
		}),
	);

export const create: CeligoEndpoints['fileDefinitionsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'fileDefinitions.create',
		In.fileDefinitionsCreate,
		Out.fileDefinitionsCreate,
		input,
		(i) => ({
			method: 'POST',
			path: ['filedefinitions'],
			body: i,
		}),
	);
