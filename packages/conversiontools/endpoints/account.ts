import { logEventFromContext } from 'corsair/core';
import type { ConversiontoolsEndpoints } from '..';
import { makeConversiontoolsRequest } from '../client';
import type {
	AccountGetConfigResponse,
	AccountGetInfoResponse,
	AccountVerifyResponse,
} from './types';
import {
	ConversiontoolsEndpointInputSchemas,
	ConversiontoolsEndpointOutputSchemas,
} from './types';

const verify: ConversiontoolsEndpoints['account']['verify'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.accountVerify.parse(input);
	void parsedInput;
	const response = await makeConversiontoolsRequest<AccountVerifyResponse>(
		'/',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.accountVerify.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.account.verify',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const getInfo: ConversiontoolsEndpoints['account']['getInfo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.accountGetInfo.parse(input);
	void parsedInput;
	const response = await makeConversiontoolsRequest<AccountGetInfoResponse>(
		'/auth',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.accountGetInfo.parse(response);
	// Account email is PII; only log a count, never the response fields.
	await logEventFromContext(
		ctx,
		'conversiontools.account.getInfo',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const getConfig: ConversiontoolsEndpoints['account']['getConfig'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.accountGetConfig.parse(input);
	void parsedInput;
	const response = await makeConversiontoolsRequest<AccountGetConfigResponse>(
		'/config',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.accountGetConfig.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.account.getConfig',
		{ count: parsed.data.conversions?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const Account = { verify, getInfo, getConfig };
