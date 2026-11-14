import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type {
	CreateProfileOutput,
	DeleteProfileOutput,
	ForkProfileOutput,
	GetProfileOutput,
	ListProfilesOutput,
} from './types';
import {
	CreateProfileInputSchema,
	CreateProfileOutputSchema,
	DeleteProfileInputSchema,
	DeleteProfileOutputSchema,
	ForkProfileInputSchema,
	ForkProfileOutputSchema,
	GetProfileInputSchema,
	GetProfileOutputSchema,
	ListProfilesInputSchema,
	ListProfilesOutputSchema,
} from './types';

export const Profiles = {
	create: (async (ctx, input) => {
		const parsedInput = CreateProfileInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateProfileOutput>(
			'/api/profile',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateProfileOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.profiles.create',
			{ profileId: parsed.id },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['profiles.create'],

	fork: (async (ctx, input) => {
		const parsedInput = ForkProfileInputSchema.parse(input);
		const { id, ...body } = parsedInput;
		const response = await makeHyperbrowserRequest<ForkProfileOutput>(
			`/api/profile/${encodeURIComponent(id)}/fork`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = ForkProfileOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.profiles.fork',
			{ sourceProfileId: id, newProfileId: parsed.id },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['profiles.fork'],

	get: (async (ctx, input) => {
		const parsedInput = GetProfileInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetProfileOutput>(
			`/api/profile/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetProfileOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.profiles.get',
			{ profileId: parsed.id },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['profiles.get'],

	delete: (async (ctx, input) => {
		const parsedInput = DeleteProfileInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<DeleteProfileOutput>(
			`/api/profile/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = DeleteProfileOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.profiles.delete',
			{ profileId: parsedInput.id, success: parsed.success },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['profiles.delete'],

	list: (async (ctx, input) => {
		const parsedInput = ListProfilesInputSchema.parse(input ?? {});
		const query: Record<string, string | number | undefined> = {};
		if (parsedInput.page !== undefined) query.page = parsedInput.page;
		if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
		if (parsedInput.name !== undefined) query.name = parsedInput.name;

		const response = await makeHyperbrowserRequest<ListProfilesOutput>(
			'/api/profiles',
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);
		const parsed = ListProfilesOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.profiles.list',
			{ count: parsed.profiles?.length ?? 0, totalCount: parsed.totalCount },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['profiles.list'],
};
