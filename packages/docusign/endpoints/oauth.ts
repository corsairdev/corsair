import { resolveClient } from './context';
import type {
	DocusignExecutionContext,
	ListOAuthUserInfoParams,
} from './types';
import {
	ListOAuthUserInfoInputSchema,
	ListOAuthUserInfoOutputSchema,
} from './types';

export const listOAuthUserInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params?: ListOAuthUserInfoParams,
) => {
	const input = ListOAuthUserInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.userInfo(input?.authServer);
	return ListOAuthUserInfoOutputSchema.parse(data);
};

export const OauthInputSchemas = {
	listOAuthUserInfo: ListOAuthUserInfoInputSchema,
};

export const OauthOutputSchemas = {
	listOAuthUserInfo: ListOAuthUserInfoOutputSchema,
};
