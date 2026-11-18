import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const createMissingTransactionRequest: FidelEndpoints['createMissingTransactionRequest'] =
	async (ctx, input) => {
		const { cardId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['createMissingTransactionRequest']
		>(
			ctx,
			fidelPathParameter(
				'/v1/cards/{cardId}/missing-transaction-requests',
				'cardId',
				input.cardId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.missing-transaction-requests.createMissingTransactionRequest',
			input,
			'completed',
		);
		return response;
	};

export const retrieveMissingTransactionRequest: FidelEndpoints['retrieveMissingTransactionRequest'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['retrieveMissingTransactionRequest']
		>(
			ctx,
			fidelPathParameter(
				'/v1/missing-transaction-requests/{missingTransactionRequestId}',
				'missingTransactionRequestId',
				input.missingTransactionRequestId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'fidel.missing-transaction-requests.retrieveMissingTransactionRequest',
			input,
			'completed',
		);
		return response;
	};

export const listMissingTransactionRequests: FidelEndpoints['listMissingTransactionRequests'] =
	async (ctx, input) => {
		const { programId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listMissingTransactionRequests']
		>(
			ctx,
			fidelPathParameter(
				'/v1/programs/{programId}/missing-transaction-requests',
				'programId',
				input.programId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.missing-transaction-requests.listMissingTransactionRequests',
			input,
			'completed',
		);
		return response;
	};
