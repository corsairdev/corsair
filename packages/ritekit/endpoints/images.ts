import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

export const quote: RiteKitEndpoints['imagesQuote'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.quote',
			input: Inputs.imagesQuote,
			output: Outputs.imagesQuote,
		},
		input,
		({ ...params }) => ({
			method: 'GET',
			path: '/v2/image/quote',
			query: params,
			replayable: true,
			binary: true,
		}),
		{
			log: (parsed, result) => ({
				width: parsed.width,
				height: parsed.height,
				rendered: result.url !== undefined && result.url !== null,
			}),
		},
	);

export const animate: RiteKitEndpoints['imagesAnimate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.animate',
			input: Inputs.imagesAnimate,
			output: Outputs.imagesAnimate,
		},
		input,
		({ url, type }) => ({
			method: 'GET',
			path: '/v1/images/animate',
			query: { url, type },
			replayable: true,
			binary: true,
		}),
		{
			log: (_, result) => ({
				rendered: result.url !== undefined && result.url !== null,
			}),
		},
	);

export const extractTopImage: RiteKitEndpoints['imagesExtractTopImage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'images.extractTopImage',
			input: Inputs.imagesExtractTopImage,
			output: Outputs.imagesExtractTopImage,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v2/image/extract-image',
			query: { url },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				found: result.top_image !== undefined && result.top_image !== null,
			}),
		},
	);
