import { makeAnonyflowRequest } from '../client';
import type { AnonyflowContext } from '../index';
import type {
	AnalyzeInput,
	AnalyzeOutput,
	AnonymizeInput,
	AnonymizeOutput,
	DeanonymizeInput,
	DeanonymizeOutput,
	GetStatusInput,
	GetStatusOutput,
	ListEntitiesInput,
	ListEntitiesOutput,
} from './types';

// 1. Anonymize Text
async function anonymize(
	context: AnonyflowContext,
	input: AnonymizeInput,
): Promise<AnonymizeOutput> {
	const apiKey = (await context.keys.get_api_key()) ?? '';
	return makeAnonyflowRequest<AnonymizeOutput>('/anonymize', apiKey, {
		method: 'POST',
		body: input,
	});
}

// 2. Deanonymize Text
async function deanonymize(
	context: AnonyflowContext,
	input: DeanonymizeInput,
): Promise<DeanonymizeOutput> {
	const apiKey = (await context.keys.get_api_key()) ?? '';
	return makeAnonyflowRequest<DeanonymizeOutput>('/deanonymize', apiKey, {
		method: 'POST',
		body: input,
	});
}

// 3. Analyze Text
async function analyze(
	context: AnonyflowContext,
	input: AnalyzeInput,
): Promise<AnalyzeOutput> {
	const apiKey = (await context.keys.get_api_key()) ?? '';
	return makeAnonyflowRequest<AnalyzeOutput>('/analyze', apiKey, {
		method: 'POST',
		body: input,
	});
}

// 4. List Entities
async function listEntities(
	context: AnonyflowContext,
	_input: ListEntitiesInput,
): Promise<ListEntitiesOutput> {
	const apiKey = (await context.keys.get_api_key()) ?? '';
	return makeAnonyflowRequest<ListEntitiesOutput>('/entities', apiKey, {
		method: 'GET',
	});
}

// 5. Get Status
async function getStatus(
	context: AnonyflowContext,
	_input: GetStatusInput,
): Promise<GetStatusOutput> {
	const apiKey = (await context.keys.get_api_key()) ?? '';
	return makeAnonyflowRequest<GetStatusOutput>('/status', apiKey, {
		method: 'GET',
	});
}

// Export the operations grouped by resource
export const AnonyflowOperations = {
	anonymize,
	deanonymize,
	analyze,
	listEntities,
	getStatus,
};
