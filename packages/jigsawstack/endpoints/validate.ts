import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const nsfw: JigsawstackEndpoints['nsfw'] = async (ctx, input) =>
	jigsawCall(
		ctx,
		'jigsawstack.validate.nsfw',
		'/v1/validate/nsfw',
		'POST',
		input,
		{
			body: input,
		},
	);

export const profanity: JigsawstackEndpoints['profanity'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.validate.profanity',
		'/v1/validate/profanity',
		'POST',
		input,
		{ body: input },
	);

export const spamCheck: JigsawstackEndpoints['spamCheck'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.validate.spamCheck',
		'/v1/validate/spam_check',
		'POST',
		input,
		{ body: input },
	);

export const spellCheck: JigsawstackEndpoints['spellCheck'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.validate.spellCheck',
		'/v1/validate/spell_check',
		'POST',
		input,
		{ body: input },
	);
