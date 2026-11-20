import { logEventFromContext } from 'corsair/core';
import { makeInterzoidRequest } from '../client';
import type { InterzoidContext } from '../index';
import type {
	AddressParseInput,
	AddressParseOutput,
	GetAreaCodeFromNumberInput,
	GetAreaCodeFromNumberOutput,
	GetAreaCodeInput,
	GetAreaCodeOutput,
	GetEmailDomainTypeInput,
	GetEmailDomainTypeOutput,
	GetEmailInfoInput,
	GetEmailInfoOutput,
	GetEmailTrustScoreInput,
	GetEmailTrustScoreOutput,
	GetGlobalNumberInfoInput,
	GetGlobalNumberInfoOutput,
	GetIpProfileInput,
	GetIpProfileOutput,
	GetPhoneProfileInput,
	GetPhoneProfileOutput,
	GetZipCodeInfoInput,
	GetZipCodeInfoOutput,
} from './types';
import {
	AddressParseInputSchema,
	AddressParseOutputSchema,
	GetAreaCodeFromNumberInputSchema,
	GetAreaCodeFromNumberOutputSchema,
	GetAreaCodeInputSchema,
	GetAreaCodeOutputSchema,
	GetEmailDomainTypeInputSchema,
	GetEmailDomainTypeOutputSchema,
	GetEmailInfoInputSchema,
	GetEmailInfoOutputSchema,
	GetEmailTrustScoreInputSchema,
	GetEmailTrustScoreOutputSchema,
	GetGlobalNumberInfoInputSchema,
	GetGlobalNumberInfoOutputSchema,
	GetIpProfileInputSchema,
	GetIpProfileOutputSchema,
	GetPhoneProfileInputSchema,
	GetPhoneProfileOutputSchema,
	GetZipCodeInfoInputSchema,
	GetZipCodeInfoOutputSchema,
} from './types';

export const Validation = {
	getEmailInfo: async (
		ctx: InterzoidContext,
		input: GetEmailInfoInput,
	): Promise<GetEmailInfoOutput> => {
		const validatedInput = GetEmailInfoInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetEmailInfoOutput>(
			'/getemailinfo',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetEmailInfoOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getEmailInfo', {
			endpoint: '/getemailinfo',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getEmailTrustScore: async (
		ctx: InterzoidContext,
		input: GetEmailTrustScoreInput,
	): Promise<GetEmailTrustScoreOutput> => {
		const validatedInput = GetEmailTrustScoreInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetEmailTrustScoreOutput>(
			'/emailtrustscore',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetEmailTrustScoreOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getEmailTrustScore', {
			endpoint: '/emailtrustscore',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getEmailDomainType: async (
		ctx: InterzoidContext,
		input: GetEmailDomainTypeInput,
	): Promise<GetEmailDomainTypeOutput> => {
		const validatedInput = GetEmailDomainTypeInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetEmailDomainTypeOutput>(
			'/getemaildomaintype',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetEmailDomainTypeOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getEmailDomainType', {
			endpoint: '/getemaildomaintype',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getIpProfile: async (
		ctx: InterzoidContext,
		input: GetIpProfileInput,
	): Promise<GetIpProfileOutput> => {
		const validatedInput = GetIpProfileInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetIpProfileOutput>(
			'/getipprofile',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetIpProfileOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getIpProfile', {
			endpoint: '/getipprofile',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getPhoneProfile: async (
		ctx: InterzoidContext,
		input: GetPhoneProfileInput,
	): Promise<GetPhoneProfileOutput> => {
		const validatedInput = GetPhoneProfileInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetPhoneProfileOutput>(
			'/getphoneprofile',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetPhoneProfileOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getPhoneProfile', {
			endpoint: '/getphoneprofile',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getGlobalNumberInfo: async (
		ctx: InterzoidContext,
		input: GetGlobalNumberInfoInput,
	): Promise<GetGlobalNumberInfoOutput> => {
		const validatedInput = GetGlobalNumberInfoInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetGlobalNumberInfoOutput>(
			'/getglobalnumberinfo',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetGlobalNumberInfoOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getGlobalNumberInfo', {
			endpoint: '/getglobalnumberinfo',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getAreaCodeFromNumber: async (
		ctx: InterzoidContext,
		input: GetAreaCodeFromNumberInput,
	): Promise<GetAreaCodeFromNumberOutput> => {
		const validatedInput = GetAreaCodeFromNumberInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetAreaCodeFromNumberOutput>(
			'/getareacodefromnumber',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetAreaCodeFromNumberOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getAreaCodeFromNumber', {
			endpoint: '/getareacodefromnumber',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getAreaCode: async (
		ctx: InterzoidContext,
		input: GetAreaCodeInput,
	): Promise<GetAreaCodeOutput> => {
		const validatedInput = GetAreaCodeInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetAreaCodeOutput>(
			'/getareacode',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetAreaCodeOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getAreaCode', {
			endpoint: '/getareacode',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	getZipCodeInfo: async (
		ctx: InterzoidContext,
		input: GetZipCodeInfoInput,
	): Promise<GetZipCodeInfoOutput> => {
		const validatedInput = GetZipCodeInfoInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<GetZipCodeInfoOutput>(
			'/getzipcodeinfo',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = GetZipCodeInfoOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_getZipCodeInfo', {
			endpoint: '/getzipcodeinfo',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
	addressParse: async (
		ctx: InterzoidContext,
		input: AddressParseInput,
	): Promise<AddressParseOutput> => {
		const validatedInput = AddressParseInputSchema.parse(input);
		const rawResponse = await makeInterzoidRequest<AddressParseOutput>(
			'/addressparse',
			ctx.key,
			{
				method: 'GET',
				query: validatedInput,
			},
		);
		const parsed = AddressParseOutputSchema.parse(rawResponse);
		logEventFromContext(ctx, 'interzoid_addressParse', {
			endpoint: '/addressparse',
			status: typeof parsed.Code === 'string' ? parsed.Code : 'missing',
		});
		return parsed;
	},
};
