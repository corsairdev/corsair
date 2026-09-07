import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import type { StartonTransaction } from '../schema/database';
import type {
	SmartContractDeployFromTemplateResponse,
	SmartContractReadResponse,
} from './types';

export const deployFromTemplate: StartonEndpoints['smartContractDeployFromTemplate'] =
	async (ctx, input) => {
		const { simulate, ...body } = input;
		const response = await makeStartonRequest<SmartContractDeployFromTemplateResponse>(
			'v3/smart-contract/from-template',
			ctx.key,
			{ method: 'POST', body, query: { simulate } },
		);
		await logEventFromContext(
			ctx,
			'starton.smartContract.deployFromTemplate',
			{ network: input.network, templateId: input.templateId, name: input.name },
			'completed',
		);
		return response;
	};

export const call: StartonEndpoints['smartContractCall'] = async (ctx, input) => {
	const { network, address, simulate, ...body } = input;
	const response = await makeStartonRequest<StartonTransaction>(
		`v3/smart-contract/${encodeStartonPathSegment(network)}/${encodeStartonPathSegment(address)}/call`,
		ctx.key,
		{ method: 'POST', body, query: { simulate } },
	);
	await logEventFromContext(
		ctx,
		'starton.smartContract.call',
		{ network, address, functionName: input.functionName },
		'completed',
	);
	return response;
};

export const read: StartonEndpoints['smartContractRead'] = async (ctx, input) => {
	const { network, address, ...body } = input;
	const response = await makeStartonRequest<SmartContractReadResponse>(
		`v3/smart-contract/${encodeStartonPathSegment(network)}/${encodeStartonPathSegment(address)}/read`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'starton.smartContract.read',
		{ network, address, functionName: input.functionName },
		'completed',
	);
	return response;
};
