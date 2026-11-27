import type { ShotstackEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { GenerationsCreateInput, GenerationsQuoteInput } from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

function generationBody(input: GenerationsCreateInput) {
	return {
		asset: {
			type: input.asset.type,
			prompt: input.asset.prompt,
			src: input.asset.src,
			model: input.asset.model,
			options: input.asset.options,
		},
		length: input.length,
	};
}

export const create: ShotstackEndpoints['generationsCreate'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'generations.create',
			input: ShotstackEndpointInputSchemas.generationsCreate,
			output: ShotstackEndpointOutputSchemas.generationsCreate,
		},
		rawInput,
		(input: GenerationsCreateInput) => ({
			method: 'POST',
			service: 'edit',
			path: '/generate',
			body: generationBody(input),
			headers: { 'Idempotency-Key': input.idempotencyKey },
		}),
		{
			log: (_input, result) => ({
				generationId: result.id,
				status: result.status,
			}),
		},
	);
};

export const get: ShotstackEndpoints['generationsGet'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'generations.get',
			input: ShotstackEndpointInputSchemas.generationsGet,
			output: ShotstackEndpointOutputSchemas.generationsGet,
		},
		rawInput,
		(input: { id: string }) => ({
			method: 'GET',
			service: 'edit',
			path: `/generate/${segment(input.id)}`,
		}),
		{
			log: (_input, result) => ({
				generationId: result.id,
				status: result.status,
			}),
		},
	);
};

export const quote: ShotstackEndpoints['generationsQuote'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'generations.quote',
			input: ShotstackEndpointInputSchemas.generationsQuote,
			output: ShotstackEndpointOutputSchemas.generationsQuote,
		},
		rawInput,
		(input: GenerationsQuoteInput) => ({
			method: 'POST',
			service: 'edit',
			path: '/generate/quote',
			body: generationBody(input),
		}),
	);
};

export const listModels: ShotstackEndpoints['generationsListModels'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'generations.listModels',
			input: ShotstackEndpointInputSchemas.generationsListModels,
			output: ShotstackEndpointOutputSchemas.generationsListModels,
		},
		rawInput,
		() => ({ method: 'GET', service: 'edit', path: '/models' }),
		{
			log: (_input, result) => ({ count: result.models.length }),
		},
	);
};

export const getModel: ShotstackEndpoints['generationsGetModel'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'generations.getModel',
			input: ShotstackEndpointInputSchemas.generationsGetModel,
			output: ShotstackEndpointOutputSchemas.generationsGetModel,
		},
		rawInput,
		(input: { id: string }) => ({
			method: 'GET',
			service: 'edit',
			path: `/models/${segment(input.id)}`,
		}),
	);
};
