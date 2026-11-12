import type { PlacidEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const create: PlacidEndpoints['pdfsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdfs.create',
			input: Inputs.pdfsCreate,
			output: Outputs.pdfsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/pdfs', body: parsed }),
		{
			log: (parsed, result) => ({
				id: result.id,
				status: result.status,
				pages: parsed.pages.length,
			}),
		},
	);

export const merge: PlacidEndpoints['pdfsMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdfs.merge',
			input: Inputs.pdfsMerge,
			output: Outputs.pdfsMerge,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/pdfs/merge', body: parsed }),
		{
			log: (parsed, result) => ({
				id: result.id,
				status: result.status,
				urls: parsed.urls.length,
			}),
		},
	);

export const get: PlacidEndpoints['pdfsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdfs.get',
			input: Inputs.pdfsGet,
			output: Outputs.pdfsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/pdfs/${segment(id)}` }),
		{
			log: ({ id }, result) => ({ id, status: result.status }),
		},
	);

export const remove: PlacidEndpoints['pdfsDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'pdfs.delete',
			input: Inputs.pdfsDelete,
			output: Outputs.pdfsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/pdfs/${segment(id)}` }),
		({ id }) => ({ success: true as const, id }),
		({ id }) => ({ id }),
	);
