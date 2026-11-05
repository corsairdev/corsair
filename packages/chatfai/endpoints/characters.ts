import { logEventFromContext } from 'corsair/core';
import type { ChatfaiEndpoints } from '..';
import { ChatfaiAPIError, makeChatfaiRequest } from '../client';
import { ChatfaiCharacter } from '../schema';
import {
	CharactersGetOutputSchema,
	CharactersSearchOutputSchema,
} from './types';

export const search: ChatfaiEndpoints['charactersSearch'] = async (
	ctx,
	input,
) => {
	const raw = await makeChatfaiRequest<unknown>('/characters/search', ctx.key, {
		query: { q: input.q },
	});
	if (!Array.isArray(raw)) {
		throw new ChatfaiAPIError('ChatFAI search did not return a character list');
	}
	const response = CharactersSearchOutputSchema.parse({
		characters: ChatfaiCharacter.array().parse(raw),
	});
	await logEventFromContext(
		ctx,
		'chatfai.characters.search',
		{ q: input.q },
		'completed',
	);
	return response;
};

export const get: ChatfaiEndpoints['charactersGet'] = async (ctx, input) => {
	const raw = await makeChatfaiRequest<unknown>(
		`/characters/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const response = CharactersGetOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'chatfai.characters.get',
		{ id: input.id },
		'completed',
	);
	return response;
};
