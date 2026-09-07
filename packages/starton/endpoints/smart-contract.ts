import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import { StartonEndpointOutputSchemas } from './types';

export const deployFromTemplate: StartonEndpoints['smartContractDeployFromTemplate'] =
	async (ctx, input) => {
		const { simulate, ...body } = input;
		const response = await makeStartonRequest<unknown>(
			'v3/smart-contract/from-template',
			ctx.key,
			// Deploys a contract on-chain — never replay it.
			{ method: 'POST', body, query: { simulate }, replayable: false },
		);
		// Validate the provider payload before returning it as typed data.
		const deployment =
			StartonEndpointOutputSchemas.smartContractDeployFromTemplate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'starton.smartContract.deployFromTemplate',
			{
				network: input.network,
				templateId: input.templateId,
				name: input.name,
			},
			'completed',
		);
		return deployment;
	};

export const call: StartonEndpoints['smartContractCall'] = async (
	ctx,
	input,
) => {
	const { network, address, simulate, ...body } = input;
	const response = await makeStartonRequest<unknown>(
		`v3/smart-contract/${encodeStartonPathSegment(network)}/${encodeStartonPathSegment(address)}/call`,
		ctx.key,
		// Broadcasts a state-changing transaction — never replay it.
		{ method: 'POST', body, query: { simulate }, replayable: false },
	);
	const transaction =
		StartonEndpointOutputSchemas.smartContractCall.parse(response);
	await logEventFromContext(
		ctx,
		'starton.smartContract.call',
		{ network, address, functionName: input.functionName },
		'completed',
	);
	return transaction;
};

export const read: StartonEndpoints['smartContractRead'] = async (
	ctx,
	input,
) => {
	const { network, address, ...body } = input;
	const response = await makeStartonRequest<unknown>(
		`v3/smart-contract/${encodeStartonPathSegment(network)}/${encodeStartonPathSegment(address)}/read`,
		ctx.key,
		// A POST only because Starton takes the call arguments in a body; it
		// never broadcasts a transaction, so replaying it is harmless.
		{ method: 'POST', body, replayable: true },
	);
	const result = StartonEndpointOutputSchemas.smartContractRead.parse(response);
	await logEventFromContext(
		ctx,
		'starton.smartContract.read',
		{ network, address, functionName: input.functionName },
		'completed',
	);
	return result;
};
