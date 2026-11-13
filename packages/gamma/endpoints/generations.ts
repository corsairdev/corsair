import type { GammaEndpoints } from '..';
import { definedBody, segment } from '../client';
import { call } from './call';
import {
	GammaEndpointInputSchemas as Inputs,
	GammaEndpointOutputSchemas as Outputs,
} from './types';

// A Classic generation carries a large nested body whose optional blocks are all
// named the same as the schema, so it is passed through with undefined keys
// dropped rather than rebuilt field by field.
export const create: GammaEndpoints['generationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'generations.create',
			input: Inputs.generationsCreate,
			output: Outputs.generationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1.0/generations',
			body: definedBody({ ...parsed }),
		}),
		{
			log: (parsed, result) => ({
				generationId: result.generationId,
				pages: parsed.pages?.length ?? 1,
				// A warning means Gamma ignored part of the request, which is worth
				// seeing without logging the body.
				warnings: result.warnings ? 1 : 0,
			}),
		},
	);

export const get: GammaEndpoints['generationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'generations.get',
			input: Inputs.generationsGet,
			output: Outputs.generationsGet,
		},
		input,
		({ generationId }) => ({
			method: 'GET',
			path: `/v1.0/generations/${segment(generationId)}`,
		}),
		{
			log: (_, result) => ({
				status: result.status,
				gammaId: result.gammaId ?? undefined,
				// The URL itself is never logged, only whether one arrived.
				exported: result.exportUrl ? 1 : 0,
				credits: result.credits?.deducted ?? undefined,
			}),
		},
	);

// Gamma 5: one brief, no page array, and the newer route for a new
// presentation, document or social post.
export const agentCreate: GammaEndpoints['agentGenerate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.generate',
			input: Inputs.agentGenerate,
			output: Outputs.agentGenerate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1.0/agent/generations',
			body: definedBody({ ...parsed }),
		}),
		{
			log: (parsed, result) => ({
				generationId: result.generationId,
				format: parsed.format ?? 'presentation',
				quality: parsed.quality ?? undefined,
			}),
		},
	);

export const agentGet: GammaEndpoints['agentGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'agent.get',
			input: Inputs.agentGet,
			output: Outputs.agentGet,
		},
		input,
		({ generationId }) => ({
			method: 'GET',
			path: `/v1.0/agent/generations/${segment(generationId)}`,
		}),
		{
			log: (_, result) => ({
				status: result.status,
				gammaId: result.gamma?.gammaId ?? undefined,
				exported: result.exportUrl ? 1 : 0,
				credits: result.credits?.deducted ?? undefined,
			}),
		},
	);
