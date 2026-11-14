import { asRecord } from 'corsair/core';
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

// Archiving is idempotent. Gamma confirms with `{ gammaId, archived: true }`,
// and the output schema refuses anything that does not confirm it.
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
			// The ID comes from Gamma's reply, not the request, so a reply with no
			// ID fails the output schema instead of reading as a success.
			shape: (raw) => {
				const body = asRecord(raw);
				return {
					success: body?.archived === true ? true : body?.archived,
					gamma_id: body?.gammaId,
				};
			},
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
			body: { exportAs: format },
		}),
		{
			log: ({ gammaId, format }) => ({
				gammaId,
				format,
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
