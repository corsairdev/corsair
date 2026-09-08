import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * Create a KMS-managed wallet. Starton stores the private key in the given KMS
 * and returns the wallet's public address.
 *
 * API: POST /v3/kms/wallet  (body: CreateWalletDto, `kmsId` required)
 * Spec: https://github.com/starton-io/starton-openapi
 */
export const create: StartonEndpoints['walletCreate'] = async (ctx, input) => {
	// Validate before the request: this rejects bad input without a network
	// round trip and strips unknown keys, so only documented CreateWalletDto
	// fields reach Starton.
	const body = StartonEndpointInputSchemas.walletCreate.parse(input);
	const response = await makeStartonRequest<unknown>(
		'v3/kms/wallet',
		ctx.key,
		// Provisions a new wallet on every success — never replay it.
		{ method: 'POST', body, replayable: false },
	);
	// Validate the provider payload before returning it as typed data.
	const wallet = StartonEndpointOutputSchemas.walletCreate.parse(response);
	await logEventFromContext(
		ctx,
		'starton.wallet.create',
		{ kmsId: body.kmsId, name: body.name },
		'completed',
	);
	return wallet;
};

/**
 * List the project's KMS-managed wallets. Paginated via `page`/`limit`
 * (limit defaults to 100, maximum 2500); filterable by `name` and `kmsId`.
 *
 * API: GET /v3/kms/wallet  -> { items, meta }
 */
export const list: StartonEndpoints['walletList'] = async (ctx, input) => {
	// Parsing also keeps unknown keys out of the query string.
	const query = StartonEndpointInputSchemas.walletList.parse(input);
	const response = await makeStartonRequest<unknown>('v3/kms/wallet', ctx.key, {
		method: 'GET',
		query: { ...query },
	});
	const page = StartonEndpointOutputSchemas.walletList.parse(response);
	await logEventFromContext(
		ctx,
		'starton.wallet.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
