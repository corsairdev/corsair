import type { GammaEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	GammaEndpointInputSchemas as Inputs,
	GammaEndpointOutputSchemas as Outputs,
} from './types';

export const get: GammaEndpoints['gammasGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gammas.get',
			input: Inputs.gammasGet,
			output: Outputs.gammasGet,
		},
		input,
		({ gammaId }) => ({
			method: 'GET',
			path: `/v1.0/gammas/${segment(gammaId)}`,
		}),
		{
			log: (_, result) => ({
				gammaId: result.id,
				type: result.type ?? undefined,
				archived: result.archived ?? undefined,
			}),
		},
	);

export const search: GammaEndpoints['gammasSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gammas.search',
			input: Inputs.gammasSearch,
			output: Outputs.gammasSearch,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1.0/gammas/search',
			query: definedQuery({ ...parsed }),
		}),
		{ log: (_, result) => ({ hits: result.hits.length }) },
	);

// Archiving is idempotent, so the answer states what was asked rather than
// relying on an empty body.
export const archive: GammaEndpoints['gammasArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gammas.archive',
			input: Inputs.gammasArchive,
			output: Outputs.gammasArchive,
		},
		input,
		({ gammaId }) => ({
			method: 'POST',
			path: `/v1.0/gammas/${segment(gammaId)}/archive`,
		}),
		{
			shape: (_, { gammaId }) => ({
				success: true as const,
				gamma_id: gammaId,
			}),
			log: ({ gammaId }) => ({ gammaId }),
		},
	);

export const remove: GammaEndpoints['gammasRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gammas.delete',
			input: Inputs.gammasRemove,
			output: Outputs.gammasRemove,
		},
		input,
		({ gammaId }) => ({
			method: 'DELETE',
			path: `/v1.0/gammas/${segment(gammaId)}`,
		}),
		{ log: ({ gammaId }) => ({ gammaId }) },
	);

export const exportGamma: GammaEndpoints['exportsStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exports.start',
			input: Inputs.exportsStart,
			output: Outputs.exportsStart,
		},
		input,
		({ gammaId, format }) => ({
			method: 'POST',
			path: `/v1.0/gammas/${segment(gammaId)}/export`,
			body: format === undefined ? undefined : { format },
		}),
		{
			log: ({ gammaId, format }) => ({
				gammaId,
				format: format ?? undefined,
			}),
		},
	);

export const exportStatus: GammaEndpoints['exportsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exports.get',
			input: Inputs.exportsGet,
			output: Outputs.exportsGet,
		},
		input,
		({ exportId }) => ({
			method: 'GET',
			path: `/v1.0/exports/${segment(exportId)}`,
		}),
		{
			log: ({ exportId }, result) => ({
				exportId,
				status: result.status,
				// The download link works for anyone who has it, so only whether one
				// arrived is logged.
				exported: result.exportUrl ? 1 : 0,
			}),
		},
	);
