import type { ParadymEndpoints } from '..';
import { call } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const listSessions: ParadymEndpoints['issuanceListSessions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'issuance.listSessions',
			input: Inputs.issuanceListSessions,
			output: Outputs.issuanceListSessions,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/issuance`,
			query: {
				'filter[status]': query.filterStatus,
				'filter[id]': query.filterId,
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const createOffer: ParadymEndpoints['issuanceCreateOffer'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'issuance.createOffer',
			input: Inputs.issuanceCreateOffer,
			output: Outputs.issuanceCreateOffer,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/issuance/offer`,
			body,
		}),
		{
			log: (_, session) => ({ sessionId: session.id, status: session.status }),
		},
	);

export const getSession: ParadymEndpoints['issuanceGetSession'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'issuance.getSession',
			input: Inputs.issuanceGetSession,
			output: Outputs.issuanceGetSession,
		},
		input,
		({ issuanceId }, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/issuance/${encodeURIComponent(issuanceId)}`,
		}),
		{
			log: (_, session) => ({ sessionId: session.id, status: session.status }),
		},
	);
