import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	FeedbackSubmitProductResponse,
	FeedbackSubmitResponse,
} from './types';

export const submit: ScrapegraphAiEndpoints['feedbackSubmit'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<FeedbackSubmitResponse>(
		'v1/feedback',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.feedback.submit',
		{ ...input },
		'completed',
	);
	return response;
};

export const submitProduct: ScrapegraphAiEndpoints['feedbackSubmitProduct'] =
	async (ctx, input) => {
		const response =
			await makeScrapegraphAiRequest<FeedbackSubmitProductResponse>(
				'v1/product-feedback',
				ctx.key,
				{ method: 'POST', body: input },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.feedback.submitProduct',
			{ ...input },
			'completed',
		);
		return response;
	};
