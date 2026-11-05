import type { DataForSeoEndpoints } from '..';
import { call } from './call';

export const chatgptResponse: DataForSeoEndpoints['aiChatgptResponse'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'aiChatgptResponse',
		'ai.chatgptResponse',
		{
			method: 'POST',
			path: '/v3/ai_optimization/chat_gpt/llm_responses/live',
		},
		input,
	);

export const perplexityResponse: DataForSeoEndpoints['aiPerplexityResponse'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'aiPerplexityResponse',
		'ai.perplexityResponse',
		{
			method: 'POST',
			path: '/v3/ai_optimization/perplexity/llm_responses/live',
		},
		input,
	);

export const geminiResponse: DataForSeoEndpoints['aiGeminiResponse'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'aiGeminiResponse',
		'ai.geminiResponse',
		{
			method: 'POST',
			path: '/v3/ai_optimization/gemini/llm_responses/live',
		},
		input,
	);

export const mentionsSearch: DataForSeoEndpoints['aiMentionsSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'aiMentionsSearch',
		'ai.mentionsSearch',
		{
			method: 'POST',
			path: '/v3/ai_optimization/llm_mentions/search_mentions/live',
		},
		input,
	);

export const mentionsTopDomains: DataForSeoEndpoints['aiMentionsTopDomains'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'aiMentionsTopDomains',
		'ai.mentionsTopDomains',
		{
			method: 'POST',
			path: '/v3/ai_optimization/llm_mentions/top_mentioned_domains/live',
		},
		input,
	);
