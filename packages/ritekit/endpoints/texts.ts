import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

export const extractArticle: RiteKitEndpoints['textsExtractArticle'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'texts.extractArticle',
			input: Inputs.textsExtractArticle,
			output: Outputs.textsExtractArticle,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v2/text/extract-article',
			query: { url },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				title: result.title ?? undefined,
				characters: result.text?.length ?? 0,
			}),
		},
	);

export const linkPreview: RiteKitEndpoints['textsLinkPreview'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'texts.linkPreview',
			input: Inputs.textsLinkPreview,
			output: Outputs.textsLinkPreview,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v2/text/link-preview',
			query: { url },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				title: result.title ?? undefined,
				hasImage: result.image !== undefined && result.image !== null,
			}),
		},
	);
