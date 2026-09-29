import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	CreateQuestionInputSchema,
	GetQuestionInputSchema,
	GetQuestionOutputSchema,
	ListQuestionsInputSchema,
	ListQuestionsOutputSchema,
	QuestionMutationOutputSchema,
	UpdateQuestionInputSchema,
} from './types';

export const listQuestions: ClassmarkerEndpoints['listQuestions'] = async (
	ctx,
	input,
) => {
	const parsedInput = ListQuestionsInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'listQuestions',
		path: '/v1/questions.json',
		input: parsedInput,
		inputSchema: ListQuestionsInputSchema,
		outputSchema: ListQuestionsOutputSchema,
		query: {
			page: parsedInput.page,
		},
	});
};

export const getQuestion: ClassmarkerEndpoints['getQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput = GetQuestionInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'getQuestion',
		path: `/v1/questions/${parsedInput.question_id}.json`,
		input: parsedInput,
		inputSchema: GetQuestionInputSchema,
		outputSchema: GetQuestionOutputSchema,
	});
};

export const createQuestion: ClassmarkerEndpoints['createQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput = CreateQuestionInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'createQuestion',
		path: '/v1/questions.json',
		method: 'POST',
		input: parsedInput,
		inputSchema: CreateQuestionInputSchema,
		outputSchema: QuestionMutationOutputSchema,
		query: {
			verify_only: parsedInput.verify_only,
		},
		body: parsedInput.question,
		logPayload: {
			verify_only: parsedInput.verify_only,
		},
	});
};

export const updateQuestion: ClassmarkerEndpoints['updateQuestion'] = async (
	ctx,
	input,
) => {
	const parsedInput = UpdateQuestionInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'updateQuestion',
		path: `/v1/questions/${parsedInput.question_id}.json`,
		method: 'PUT',
		input: parsedInput,
		inputSchema: UpdateQuestionInputSchema,
		outputSchema: QuestionMutationOutputSchema,
		query: {
			verify_only: parsedInput.verify_only,
		},
		body: parsedInput.question,
		logPayload: {
			question_id: parsedInput.question_id,
			verify_only: parsedInput.verify_only,
		},
	});
};
