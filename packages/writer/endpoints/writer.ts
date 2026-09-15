import type { EventLoggingContext } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { LLM_GATEWAY_BASE, makeWriterRequest } from '../client';
import type { WriterEndpointInputs, WriterEndpointOutputs } from './types';

type WriterContext = EventLoggingContext & {
	key?: string;
	input?: unknown;
};

function requireKey(ctx: WriterContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('writer', 'api_key');
	}
	return ctx.key;
}

const COMPLETED = 'completed' as const;

export const listModels = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['listModels'],
): Promise<WriterEndpointOutputs['listModels']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['listModels']>(
		'/models',
		key,
		'GET',
		input,
		undefined,
		undefined,
		LLM_GATEWAY_BASE,
		false,
	);
	await logEventFromContext(ctx, 'writer.models.list', {}, COMPLETED);
	return response;
};

export const createCompletion = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['createCompletion'],
): Promise<WriterEndpointOutputs['createCompletion']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['createCompletion']
	>(
		'/completions',
		key,
		'POST',
		input,
		undefined,
		undefined,
		LLM_GATEWAY_BASE,
		false,
	);
	await logEventFromContext(
		ctx,
		'writer.completions.create',
		{ model: input.model },
		COMPLETED,
	);
	return response;
};

export const createChat = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['createChat'],
): Promise<WriterEndpointOutputs['createChat']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['createChat']>(
		'/chat',
		key,
		'POST',
		input,
		undefined,
		undefined,
		LLM_GATEWAY_BASE,
		false,
	);
	await logEventFromContext(
		ctx,
		'writer.chat.create',
		{ model: input.model },
		COMPLETED,
	);
	return response;
};

export const listFiles = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['listFiles'],
): Promise<WriterEndpointOutputs['listFiles']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['listFiles']>(
		'/files',
		key,
		'GET',
		input,
	);
	await logEventFromContext(ctx, 'writer.files.list', {}, COMPLETED);
	return response;
};

export const uploadFile = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['uploadFile'],
): Promise<WriterEndpointOutputs['uploadFile']> => {
	const key = requireKey(ctx);
	const fileContent = Buffer.from(input.content, 'base64');
	const formData = new FormData();
	formData.append(
		'file',
		new Blob([fileContent], { type: input.contentType }),
		input.filename,
	);
	const response = await makeWriterRequest<WriterEndpointOutputs['uploadFile']>(
		'/files',
		key,
		'POST',
		formData,
		input.graphId ? { graphId: input.graphId } : undefined,
	);
	await logEventFromContext(
		ctx,
		'writer.files.upload',
		{ filename: input.filename },
		COMPLETED,
	);
	return response;
};

export const getFile = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['getFile'],
): Promise<WriterEndpointOutputs['getFile']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['getFile']>(
		`/files/${encodeURIComponent(input.file_id)}`,
		key,
		'GET',
	);
	await logEventFromContext(ctx, 'writer.files.get', {}, COMPLETED);
	return response;
};

export const downloadFile = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['downloadFile'],
): Promise<WriterEndpointOutputs['downloadFile']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<unknown>(
		`/files/${encodeURIComponent(input.file_id)}/download`,
		key,
		'GET',
		undefined,
		undefined,
		'application/octet-stream',
	);
	await logEventFromContext(ctx, 'writer.files.download', {}, COMPLETED);
	return response;
};

export const deleteFile = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['deleteFile'],
): Promise<WriterEndpointOutputs['deleteFile']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['deleteFile']>(
		`/files/${encodeURIComponent(input.file_id)}`,
		key,
		'DELETE',
	);
	await logEventFromContext(ctx, 'writer.files.delete', {}, COMPLETED);
	return response;
};

export const listKnowledgeGraphs = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['listKnowledgeGraphs'],
): Promise<WriterEndpointOutputs['listKnowledgeGraphs']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['listKnowledgeGraphs']
	>('/graphs', key, 'GET', input);
	await logEventFromContext(ctx, 'writer.graphs.list', {}, COMPLETED);
	return response;
};

export const createKnowledgeGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['createKnowledgeGraph'],
): Promise<WriterEndpointOutputs['createKnowledgeGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['createKnowledgeGraph']
	>('/graphs', key, 'POST', input);
	await logEventFromContext(
		ctx,
		'writer.graphs.create',
		{ name: input.name },
		COMPLETED,
	);
	return response;
};

export const retrieveKnowledgeGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['retrieveKnowledgeGraph'],
): Promise<WriterEndpointOutputs['retrieveKnowledgeGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['retrieveKnowledgeGraph']
	>(`/graphs/${encodeURIComponent(input.graph_id)}`, key, 'GET');
	await logEventFromContext(ctx, 'writer.graphs.retrieve', {}, COMPLETED);
	return response;
};

export const updateKnowledgeGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['updateKnowledgeGraph'],
): Promise<WriterEndpointOutputs['updateKnowledgeGraph']> => {
	const key = requireKey(ctx);
	const { graph_id, ...payload } = input;
	const response = await makeWriterRequest<
		WriterEndpointOutputs['updateKnowledgeGraph']
	>(`/graphs/${encodeURIComponent(graph_id)}`, key, 'PUT', payload);
	await logEventFromContext(
		ctx,
		'writer.graphs.update',
		{ graphId: graph_id },
		COMPLETED,
	);
	return response;
};

export const deleteKnowledgeGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['deleteKnowledgeGraph'],
): Promise<WriterEndpointOutputs['deleteKnowledgeGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['deleteKnowledgeGraph']
	>(`/graphs/${encodeURIComponent(input.graph_id)}`, key, 'DELETE');
	await logEventFromContext(ctx, 'writer.graphs.delete', {}, COMPLETED);
	return response;
};

export const addFileToGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['addFileToGraph'],
): Promise<WriterEndpointOutputs['addFileToGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['addFileToGraph']
	>(`/graphs/${encodeURIComponent(input.graph_id)}/file`, key, 'POST', {
		file_id: input.file_id,
	});
	await logEventFromContext(ctx, 'writer.graphs.files.add', {}, COMPLETED);
	return response;
};

export const removeFileFromGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['removeFileFromGraph'],
): Promise<WriterEndpointOutputs['removeFileFromGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['removeFileFromGraph']
	>(
		`/graphs/${encodeURIComponent(input.graph_id)}/file/${encodeURIComponent(input.file_id)}`,
		key,
		'DELETE',
	);
	await logEventFromContext(ctx, 'writer.graphs.files.remove', {}, COMPLETED);
	return response;
};

export const askQuestionToKnowledgeGraph = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['askQuestionToKnowledgeGraph'],
): Promise<WriterEndpointOutputs['askQuestionToKnowledgeGraph']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['askQuestionToKnowledgeGraph']
	>('/graphs/question', key, 'POST', input);
	await logEventFromContext(ctx, 'writer.graphs.question', {}, COMPLETED);
	return response;
};

export const listApplications = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['listApplications'],
): Promise<WriterEndpointOutputs['listApplications']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['listApplications']
	>('/applications', key, 'GET', input);
	await logEventFromContext(ctx, 'writer.applications.list', {}, COMPLETED);
	return response;
};

export const parsePdf = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['parsePdf'],
): Promise<WriterEndpointOutputs['parsePdf']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['parsePdf']>(
		`/tools/pdf-parser/${encodeURIComponent(input.file_id)}`,
		key,
		'POST',
		{ format: input.format },
	);
	await logEventFromContext(ctx, 'writer.tools.parsePdf', {}, COMPLETED);
	return response;
};

export const webSearch = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['webSearch'],
): Promise<WriterEndpointOutputs['webSearch']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<WriterEndpointOutputs['webSearch']>(
		'/tools/web-search',
		key,
		'POST',
		input,
	);
	await logEventFromContext(ctx, 'writer.tools.webSearch', {}, COMPLETED);
	return response;
};

export const analyzeImages = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['analyzeImages'],
): Promise<WriterEndpointOutputs['analyzeImages']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['analyzeImages']
	>('/vision', key, 'POST', input);
	await logEventFromContext(
		ctx,
		'writer.vision.analyze',
		{ model: input.model },
		COMPLETED,
	);
	return response;
};

export const translateText = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['translateText'],
): Promise<WriterEndpointOutputs['translateText']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['translateText']
	>('/chat', key, 'POST', {
		model: 'palmyra-x5',
		messages: [
			{
				role: 'system',
				content: `Translate the input text to ${input.target_language}. Return only translated text.`,
			},
			{ role: 'user', content: input.text },
		],
		stream: false,
	});
	await logEventFromContext(
		ctx,
		'writer.translate.text',
		{ targetLanguage: input.target_language },
		COMPLETED,
	);
	const maybeChat = response as {
		choices?: Array<{ message?: { content?: string | null } }>;
	};
	const translated =
		typeof maybeChat.choices?.[0]?.message?.content === 'string'
			? maybeChat.choices[0].message.content
			: undefined;
	return { translation: translated };
};

export const detectAiContent = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['detectAiContent'],
): Promise<WriterEndpointOutputs['detectAiContent']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['detectAiContent']
	>(
		`/content/organization/${input.organizationId}/detect`,
		key,
		'POST',
		{ text: input.text },
		undefined,
		'application/json; charset=utf-8',
		'https://enterprise-api.writer.com',
	);
	await logEventFromContext(ctx, 'writer.content.detect', {}, COMPLETED);
	return response;
};

export const medicalComprehend = async (
	ctx: WriterContext,
	input: WriterEndpointInputs['medicalComprehend'],
): Promise<WriterEndpointOutputs['medicalComprehend']> => {
	const key = requireKey(ctx);
	const response = await makeWriterRequest<
		WriterEndpointOutputs['medicalComprehend']
	>('/chat', key, 'POST', {
		model: input.model ?? 'palmyra-med',
		messages: [
			{
				role: 'system',
				content:
					'Extract and structure medical entities from the input text. Include relevant clinical concepts and coding hints.',
			},
			{ role: 'user', content: input.text },
		],
		stream: false,
	});
	await logEventFromContext(ctx, 'writer.medical.comprehend', {}, COMPLETED);
	return response;
};
