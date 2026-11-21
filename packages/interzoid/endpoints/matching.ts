import { logEventFromContext } from 'corsair/core';
import { makeInterzoidRequest } from '../client';
import type { InterzoidContext } from '../index';
import type {
	GetAddressAndFullNameMatchInput,
	GetAddressAndFullNameMatchOutput,
	GetAddressMatchAdvancedInput,
	GetAddressMatchAdvancedOutput,
	GetAddressMatchInput,
	GetAddressMatchOutput,
	GetCityMatchInput,
	GetCityMatchOutput,
	GetCompanyAndAddressMatchInput,
	GetCompanyAndAddressMatchOutput,
	GetCompanyAndFullNameMatchInput,
	GetCompanyAndFullNameMatchOutput,
	GetCompanyMatchAdvancedInput,
	GetCompanyMatchAdvancedOutput,
	GetCompanyMatchInput,
	GetCompanyMatchOutput,
	GetCountryMatchInput,
	GetCountryMatchOutput,
	GetFullNameMatchInput,
	GetFullNameMatchOutput,
	GetFullNameMatchScoreInput,
	GetFullNameMatchScoreOutput,
	GetFullNameParsedMatchInput,
	GetFullNameParsedMatchOutput,
	GetGlobalAddressMatchInput,
	GetGlobalAddressMatchOutput,
	GetOrgMatchScoreInput,
	GetOrgMatchScoreOutput,
	GetProductMatchInput,
	GetProductMatchOutput,
} from './types';
import {
	GetAddressAndFullNameMatchInputSchema,
	GetAddressAndFullNameMatchOutputSchema,
	GetAddressMatchAdvancedInputSchema,
	GetAddressMatchAdvancedOutputSchema,
	GetAddressMatchInputSchema,
	GetAddressMatchOutputSchema,
	GetCityMatchInputSchema,
	GetCityMatchOutputSchema,
	GetCompanyAndAddressMatchInputSchema,
	GetCompanyAndAddressMatchOutputSchema,
	GetCompanyAndFullNameMatchInputSchema,
	GetCompanyAndFullNameMatchOutputSchema,
	GetCompanyMatchAdvancedInputSchema,
	GetCompanyMatchAdvancedOutputSchema,
	GetCompanyMatchInputSchema,
	GetCompanyMatchOutputSchema,
	GetCountryMatchInputSchema,
	GetCountryMatchOutputSchema,
	GetFullNameMatchInputSchema,
	GetFullNameMatchOutputSchema,
	GetFullNameMatchScoreInputSchema,
	GetFullNameMatchScoreOutputSchema,
	GetFullNameParsedMatchInputSchema,
	GetFullNameParsedMatchOutputSchema,
	GetGlobalAddressMatchInputSchema,
	GetGlobalAddressMatchOutputSchema,
	GetOrgMatchScoreInputSchema,
	GetOrgMatchScoreOutputSchema,
	GetProductMatchInputSchema,
	GetProductMatchOutputSchema,
} from './types';

export const Matching = {
	getCompanyMatchAdvanced: async (
		ctx: InterzoidContext,
		input: GetCompanyMatchAdvancedInput,
	): Promise<GetCompanyMatchAdvancedOutput> => {
		const validatedInput = GetCompanyMatchAdvancedInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetCompanyMatchAdvancedOutput>(
				'/getcompanymatchadvanced',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetCompanyMatchAdvancedOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCompanyMatchAdvanced', {
			endpoint: '/getcompanymatchadvanced',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getFullNameMatch: async (
		ctx: InterzoidContext,
		input: GetFullNameMatchInput,
	): Promise<GetFullNameMatchOutput> => {
		const validatedInput = GetFullNameMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetFullNameMatchOutput>(
			'/getfullnamematch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetFullNameMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getFullNameMatch', {
			endpoint: '/getfullnamematch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getAddressMatchAdvanced: async (
		ctx: InterzoidContext,
		input: GetAddressMatchAdvancedInput,
	): Promise<GetAddressMatchAdvancedOutput> => {
		const validatedInput = GetAddressMatchAdvancedInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetAddressMatchAdvancedOutput>(
				'/getaddressmatchadvanced',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetAddressMatchAdvancedOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getAddressMatchAdvanced', {
			endpoint: '/getaddressmatchadvanced',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getAddressAndFullNameMatch: async (
		ctx: InterzoidContext,
		input: GetAddressAndFullNameMatchInput,
	): Promise<GetAddressAndFullNameMatchOutput> => {
		const validatedInput = GetAddressAndFullNameMatchInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetAddressAndFullNameMatchOutput>(
				'/getaddressandfullnamematch',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetAddressAndFullNameMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getAddressAndFullNameMatch', {
			endpoint: '/getaddressandfullnamematch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCompanyAndAddressMatch: async (
		ctx: InterzoidContext,
		input: GetCompanyAndAddressMatchInput,
	): Promise<GetCompanyAndAddressMatchOutput> => {
		const validatedInput = GetCompanyAndAddressMatchInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetCompanyAndAddressMatchOutput>(
				'/getcompanyandaddressmatch',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetCompanyAndAddressMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCompanyAndAddressMatch', {
			endpoint: '/getcompanyandaddressmatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCompanyAndFullNameMatch: async (
		ctx: InterzoidContext,
		input: GetCompanyAndFullNameMatchInput,
	): Promise<GetCompanyAndFullNameMatchOutput> => {
		const validatedInput = GetCompanyAndFullNameMatchInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetCompanyAndFullNameMatchOutput>(
				'/getcompanyandfullnamematch',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetCompanyAndFullNameMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCompanyAndFullNameMatch', {
			endpoint: '/getcompanyandfullnamematch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getGlobalAddressMatch: async (
		ctx: InterzoidContext,
		input: GetGlobalAddressMatchInput,
	): Promise<GetGlobalAddressMatchOutput> => {
		const validatedInput = GetGlobalAddressMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetGlobalAddressMatchOutput>(
			'/getglobaladdressmatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetGlobalAddressMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getGlobalAddressMatch', {
			endpoint: '/getglobaladdressmatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getProductMatch: async (
		ctx: InterzoidContext,
		input: GetProductMatchInput,
	): Promise<GetProductMatchOutput> => {
		const validatedInput = GetProductMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetProductMatchOutput>(
			'/getproductmatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetProductMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getProductMatch', {
			endpoint: '/getproductmatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getOrgMatchScore: async (
		ctx: InterzoidContext,
		input: GetOrgMatchScoreInput,
	): Promise<GetOrgMatchScoreOutput> => {
		const validatedInput = GetOrgMatchScoreInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetOrgMatchScoreOutput>(
			'/getorgmatchscore',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetOrgMatchScoreOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getOrgMatchScore', {
			endpoint: '/getorgmatchscore',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getFullNameMatchScore: async (
		ctx: InterzoidContext,
		input: GetFullNameMatchScoreInput,
	): Promise<GetFullNameMatchScoreOutput> => {
		const validatedInput = GetFullNameMatchScoreInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetFullNameMatchScoreOutput>(
			'/getfullnamematchscore',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetFullNameMatchScoreOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getFullNameMatchScore', {
			endpoint: '/getfullnamematchscore',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCompanyMatch: async (
		ctx: InterzoidContext,
		input: GetCompanyMatchInput,
	): Promise<GetCompanyMatchOutput> => {
		const validatedInput = GetCompanyMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCompanyMatchOutput>(
			'/getcompanymatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCompanyMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCompanyMatch', {
			endpoint: '/getcompanymatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getAddressMatch: async (
		ctx: InterzoidContext,
		input: GetAddressMatchInput,
	): Promise<GetAddressMatchOutput> => {
		const validatedInput = GetAddressMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetAddressMatchOutput>(
			'/getaddressmatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetAddressMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getAddressMatch', {
			endpoint: '/getaddressmatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getFullNameParsedMatch: async (
		ctx: InterzoidContext,
		input: GetFullNameParsedMatchInput,
	): Promise<GetFullNameParsedMatchOutput> => {
		const validatedInput = GetFullNameParsedMatchInputSchema.parse(input);
		const rawResponse =
			await makeInterzoidRequest<GetFullNameParsedMatchOutput>(
				'/getfullnameparsedmatch',
				ctx.key,
				{
					method: 'GET',
					query: validatedInput,
				},
			);
		const parsed = GetFullNameParsedMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getFullNameParsedMatch', {
			endpoint: '/getfullnameparsedmatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCityMatch: async (
		ctx: InterzoidContext,
		input: GetCityMatchInput,
	): Promise<GetCityMatchOutput> => {
		const validatedInput = GetCityMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCityMatchOutput>(
			'/getcitymatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCityMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCityMatch', {
			endpoint: '/getcitymatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCountryMatch: async (
		ctx: InterzoidContext,
		input: GetCountryMatchInput,
	): Promise<GetCountryMatchOutput> => {
		const validatedInput = GetCountryMatchInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCountryMatchOutput>(
			'/getcountrymatch',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCountryMatchOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCountryMatch', {
			endpoint: '/getcountrymatch',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
};
