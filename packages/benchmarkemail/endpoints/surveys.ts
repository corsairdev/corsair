/**
 * Benchmark Email surveys endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Survey folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const deleteSurvey: BenchmarkEmailEndpoints['surveysDeleteSurvey'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysDeleteSurvey']
		>(`Survey/${encodeURIComponent(input.id)}`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.deleteSurvey',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyDetails: BenchmarkEmailEndpoints['surveysGetSurveyDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyDetails']
		>(`Survey/${encodeURIComponent(input.id)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyTemplateList: BenchmarkEmailEndpoints['surveysGetSurveyTemplateList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyTemplateList']
		>(`Survey/TemplateList`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyTemplateList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyReportList: BenchmarkEmailEndpoints['surveysGetSurveyReportList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyReportList']
		>(`Survey/ReportList`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyReportList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyFullReport: BenchmarkEmailEndpoints['surveysGetSurveyFullReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyFullReport']
		>(`Survey/${encodeURIComponent(input.surveyID)}/ReportFull`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyFullReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyIndividualResults: BenchmarkEmailEndpoints['surveysGetSurveyIndividualResults'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyIndividualResults']
		>(
			`Survey/${encodeURIComponent(input.surveyID)}/ReportIndividual`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({ page: input.page, pageSize: input.pageSize }),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyIndividualResults',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyIndividualQuestionResult: BenchmarkEmailEndpoints['surveysGetSurveyIndividualQuestionResult'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyIndividualQuestionResult']
		>(
			`Survey/${encodeURIComponent(input.surveyID)}/ReportIndividual/${encodeURIComponent(input.emailID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyIndividualQuestionResult',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyReportAnswerText: BenchmarkEmailEndpoints['surveysGetSurveyReportAnswerText'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyReportAnswerText']
		>(
			`Survey/${encodeURIComponent(input.surveyID)}/ReportAnswer/Text`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({ questionID: input.questionID }),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyReportAnswerText',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyReportAnswerComment: BenchmarkEmailEndpoints['surveysGetSurveyReportAnswerComment'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyReportAnswerComment']
		>(
			`Survey/${encodeURIComponent(input.surveyID)}/ReportAnswer/Comment`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({ questionID: input.questionID }),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyReportAnswerComment',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyReportAnswerOther: BenchmarkEmailEndpoints['surveysGetSurveyReportAnswerOther'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyReportAnswerOther']
		>(
			`Survey/${encodeURIComponent(input.surveyID)}/ReportAnswer/Other`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({ questionID: input.questionID }),
			},
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyReportAnswerOther',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSurveyReportDetail: BenchmarkEmailEndpoints['surveysGetSurveyReportDetail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysGetSurveyReportDetail']
		>(`Survey/${encodeURIComponent(input.surveyID)}/ReportDetail`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.getSurveyReportDetail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateSurveyStatus: BenchmarkEmailEndpoints['surveysUpdateSurveyStatus'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['surveysUpdateSurveyStatus']
		>(
			`Survey/${encodeURIComponent(input.id)}/StatusUpdate/${encodeURIComponent(input.status)}`,
			ctx.key,
			{ method: 'PATCH', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.surveys.updateSurveyStatus',
			{ ...input },
			'completed',
		);
		return response;
	};
