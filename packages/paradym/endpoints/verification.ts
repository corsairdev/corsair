import type { ParadymEndpoints } from '..';
import { call } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const listSessions: ParadymEndpoints['verificationListSessions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verification.listSessions',
			input: Inputs.verificationListSessions,
			output: Outputs.verificationListSessions,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/verification`,
			query: {
				'filter[status]': query.filterStatus,
				'filter[id]': query.filterId,
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const createRequest: ParadymEndpoints['verificationCreateRequest'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verification.createRequest',
			input: Inputs.verificationCreateRequest,
			output: Outputs.verificationCreateRequest,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/verification/request`,
			body,
		}),
		{
			log: (_, session) => ({ sessionId: session.id, status: session.status }),
		},
	);

export const getSession: ParadymEndpoints['verificationGetSession'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verification.getSession',
			input: Inputs.verificationGetSession,
			output: Outputs.verificationGetSession,
		},
		input,
		({ verificationId }, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/verification/${encodeURIComponent(verificationId)}`,
		}),
		{
			log: (_, session) => ({ sessionId: session.id, status: session.status }),
		},
	);

export const complete: ParadymEndpoints['verificationComplete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verification.complete',
			input: Inputs.verificationComplete,
			output: Outputs.verificationComplete,
		},
		input,
		({ verificationId }, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/openid4vc/verification/${encodeURIComponent(verificationId)}/complete`,
		}),
		{
			log: (_, session) => ({ sessionId: session.id, status: session.status }),
		},
	);
