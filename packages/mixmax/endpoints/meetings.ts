import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxMultiSegmentPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const meetingsSearchSummaries: MixmaxEndpoints['meetingsSearchSummaries'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['meetingsSearchSummaries']
		>(ctx, '/v1/meetings/summaries/search', {
			method: 'GET',
			query: {
				isExternal: input.isExternal,
				from: input.from,
				to: input.to,
				attendee: input.attendee,
				title: input.title,
				skip: input.skip,
				limit: input.limit,
				owner: input.owner,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.meetings.searchSummaries',
			{ ...input },
			'completed',
		);
		return result;
	};

export const meetingsGetTranscript: MixmaxEndpoints['meetingsGetTranscript'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['meetingsGetTranscript']
		>(
			ctx,
			mixmaxMultiSegmentPathParameter(
				'/v1/meetings/transcripts/{id}',
				'id',
				input.id,
			),
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.meetings.getTranscript',
			{ ...input },
			'completed',
		);
		return result;
	};
