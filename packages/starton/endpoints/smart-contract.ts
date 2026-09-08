import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * Deploy a smart contract from a Starton Library template (ERC20, ERC721, ...).
 * Returns the created contract together with the deployment transaction; the
 * transaction is asynchronous — poll `transaction.get` for its final state.
 *
 * Pass `simulate: true` to estimate gas without broadcasting.
 *
 * API: POST /v3/smart-contract/from-template?simulate=  (body:
 * DeployFromTemplateDto) -> { smartContract, transaction }
 */
export const deployFromTemplate: StartonEndpoints['smartContractDeployFromTemplate'] =
	async (ctx, input) => {
		// Validate before the request: this rejects bad input without a network
		// round trip, applies the documented `params` default, and strips unknown
		// keys so only DeployFromTemplateDto fields reach Starton.
		const { simulate, ...body } =
			StartonEndpointInputSchemas.smartContractDeployFromTemplate.parse(input);
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
				network: body.network,
				templateId: body.templateId,
				name: body.name,
			},
			'completed',
		);
		return deployment;
	};

/**
 * Execute a state-changing function on a deployed contract. Returns the relayer
 * Transaction; it is asynchronous, so poll `transaction.get` for the final
 * state. Pass `simulate: true` to estimate gas without broadcasting.
 *
 * API: POST /v3/smart-contract/{network}/{address}/call?simulate=
 * (body: CallDto) -> Transaction
 */
export const call: StartonEndpoints['smartContractCall'] = async (
	ctx,
	input,
) => {
	const { network, address, simulate, ...body } =
		StartonEndpointInputSchemas.smartContractCall.parse(input);
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
		{ network, address, functionName: body.functionName },
		'completed',
	);
	return transaction;
};

/**
 * Call a read-only (view) function on a deployed contract. Returns the decoded
 * value immediately; nothing is broadcast and no gas is spent.
 *
 * API: POST /v3/smart-contract/{network}/{address}/read
 * (body: ReadDto) -> ReadSmartContractResponse
 */
export const read: StartonEndpoints['smartContractRead'] = async (
	ctx,
	input,
) => {
	const { network, address, ...body } =
		StartonEndpointInputSchemas.smartContractRead.parse(input);
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
		{ network, address, functionName: body.functionName },
		'completed',
	);
	return result;
};
