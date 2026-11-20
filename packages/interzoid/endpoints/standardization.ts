import { logEventFromContext } from 'corsair/core';
import { makeInterzoidRequest } from '../client';
import type { InterzoidContext } from '../index';
import type {
	GetCityStandardInput,
	GetCityStandardOutput,
	GetCountryInfoInput,
	GetCountryInfoOutput,
	GetCountryStandardInput,
	GetCountryStandardOutput,
	GetOfficialNameInput,
	GetOfficialNameOutput,
	GetOrgStandardInput,
	GetOrgStandardOutput,
	GetStateAbbreviationInput,
	GetStateAbbreviationOutput,
} from './types';
import {
	GetCityStandardInputSchema,
	GetCityStandardOutputSchema,
	GetCountryInfoInputSchema,
	GetCountryInfoOutputSchema,
	GetCountryStandardInputSchema,
	GetCountryStandardOutputSchema,
	GetOfficialNameInputSchema,
	GetOfficialNameOutputSchema,
	GetOrgStandardInputSchema,
	GetOrgStandardOutputSchema,
	GetStateAbbreviationInputSchema,
	GetStateAbbreviationOutputSchema,
} from './types';

export const Standardization = {
	getOrgStandard: async (
		ctx: InterzoidContext,
		input: GetOrgStandardInput,
	): Promise<GetOrgStandardOutput> => {
		const validatedInput = GetOrgStandardInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetOrgStandardOutput>(
			'/getorgstandard',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetOrgStandardOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getOrgStandard', {
			endpoint: '/getorgstandard',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCountryStandard: async (
		ctx: InterzoidContext,
		input: GetCountryStandardInput,
	): Promise<GetCountryStandardOutput> => {
		const validatedInput = GetCountryStandardInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCountryStandardOutput>(
			'/getcountrystandard',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCountryStandardOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCountryStandard', {
			endpoint: '/getcountrystandard',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCountryInfo: async (
		ctx: InterzoidContext,
		input: GetCountryInfoInput,
	): Promise<GetCountryInfoOutput> => {
		const validatedInput = GetCountryInfoInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCountryInfoOutput>(
			'/getcountryinfo',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCountryInfoOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCountryInfo', {
			endpoint: '/getcountryinfo',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getStateAbbreviation: async (
		ctx: InterzoidContext,
		input: GetStateAbbreviationInput,
	): Promise<GetStateAbbreviationOutput> => {
		const validatedInput = GetStateAbbreviationInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetStateAbbreviationOutput>(
			'/getstateabbreviation',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetStateAbbreviationOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getStateAbbreviation', {
			endpoint: '/getstateabbreviation',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getCityStandard: async (
		ctx: InterzoidContext,
		input: GetCityStandardInput,
	): Promise<GetCityStandardOutput> => {
		const validatedInput = GetCityStandardInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetCityStandardOutput>(
			'/getcitystandard',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetCityStandardOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getCityStandard', {
			endpoint: '/getcitystandard',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getOfficialName: async (
		ctx: InterzoidContext,
		input: GetOfficialNameInput,
	): Promise<GetOfficialNameOutput> => {
		const validatedInput = GetOfficialNameInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetOfficialNameOutput>(
			'/getofficialname',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetOfficialNameOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getOfficialName', {
			endpoint: '/getofficialname',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
};
