import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	FeedbackRateConversationOutput,
	FeedbackRateMessageOutput,
	FeedbackSurveysGetOutput,
	FeedbackSurveysListOutput,
	FeedbackSurveysResponsesOutput,
	FeedbackSurveysStatsOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const rateConversation: GleapEndpoints['feedbackRateConversation'] =
	async (ctx, input) => {
		const parsed =
			GleapEndpointInputSchemas.feedbackRateConversation.parse(input);
		const response = await makeGleapRequest<FeedbackRateConversationOutput>(
			`/s2s/conversations/${encodeURIComponent(parsed.conversationId)}/rating`,
			ctx.key,
			{
				method: 'POST',
				body: { rating: parsed.rating },
			},
		);
		const output =
			GleapEndpointOutputSchemas.feedbackRateConversation.parse(response);
		await logEventFromContext(
			ctx,
			'gleap.feedback.rateConversation',
			{ conversationId: parsed.conversationId },
			'completed',
		);
		return output;
	};

export const rateMessage: GleapEndpoints['feedbackRateMessage'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.feedbackRateMessage.parse(input);
	const response = await makeGleapRequest<FeedbackRateMessageOutput>(
		`/s2s/messages/${encodeURIComponent(parsed.messageId)}/rating`,
		ctx.key,
		{
			method: 'POST',
			body: { rating: parsed.rating },
		},
	);
	const output =
		GleapEndpointOutputSchemas.feedbackRateMessage.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.feedback.rateMessage',
		{ messageId: parsed.messageId },
		'completed',
	);
	return output;
};

export const surveysList: GleapEndpoints['feedbackSurveysList'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.feedbackSurveysList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		skip: parsed.skip,
		limit: parsed.limit,
		sort: parsed.sort,
	};
	const response = await makeGleapRequest<FeedbackSurveysListOutput>(
		'/engagement/surveys',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project,
		},
	);
	const output =
		GleapEndpointOutputSchemas.feedbackSurveysList.parse(response);
	const count = Array.isArray(output) ? output.length : output.items.length;
	await logEventFromContext(
		ctx,
		'gleap.feedback.surveysList',
		{ count },
		'completed',
	);
	return output;
};

export const surveysGet: GleapEndpoints['feedbackSurveysGet'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.feedbackSurveysGet.parse(input);
	const response = await makeGleapRequest<FeedbackSurveysGetOutput>(
		`/engagement/surveys/${encodeURIComponent(parsed.surveyId)}`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project,
		},
	);
	const output =
		GleapEndpointOutputSchemas.feedbackSurveysGet.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.feedback.surveysGet',
		{ surveyId: parsed.surveyId },
		'completed',
	);
	return output;
};

export const surveysResponses: GleapEndpoints['feedbackSurveysResponses'] =
	async (ctx, input) => {
		const parsed =
			GleapEndpointInputSchemas.feedbackSurveysResponses.parse(input);
		const query: Record<string, string | number | boolean | undefined> = {
			skip: parsed.skip,
			limit: parsed.limit,
		};
		const response =
			await makeGleapRequest<FeedbackSurveysResponsesOutput>(
				`/engagement/surveys/${encodeURIComponent(parsed.surveyId)}/responses`,
				ctx.key,
				{
					method: 'GET',
					query,
					projectId: parsed.project,
				},
			);
		const output =
			GleapEndpointOutputSchemas.feedbackSurveysResponses.parse(response);
		const count = Array.isArray(output)
			? output.length
			: output.items.length;
		await logEventFromContext(
			ctx,
			'gleap.feedback.surveysResponses',
			{ surveyId: parsed.surveyId, count },
			'completed',
		);
		return output;
	};

export const surveysStats: GleapEndpoints['feedbackSurveysStats'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.feedbackSurveysStats.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		from: parsed.from,
		to: parsed.to,
		version: parsed.version,
	};
	const response = await makeGleapRequest<FeedbackSurveysStatsOutput>(
		`/engagement/surveys/${encodeURIComponent(parsed.surveyId)}/stats`,
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project,
		},
	);
	const output =
		GleapEndpointOutputSchemas.feedbackSurveysStats.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.feedback.surveysStats',
		{ surveyId: parsed.surveyId },
		'completed',
	);
	return output;
};
