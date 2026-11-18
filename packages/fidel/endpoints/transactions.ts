import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const createTransactionTest: FidelEndpoints['createTransactionTest'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['createTransactionTest']
		>(ctx, '/v1/transactions/test', { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'fidel.transactions.createTransactionTest',
			input,
			'completed',
		);
		return response;
	};

export const retrieveTransaction: FidelEndpoints['retrieveTransaction'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['retrieveTransaction']
		>(
			ctx,
			fidelPathParameter(
				'/v1/transactions/{transactionId}',
				'transactionId',
				input.transactionId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'fidel.transactions.retrieveTransaction',
			input,
			'completed',
		);
		return response;
	};

export const listTransactions: FidelEndpoints['listTransactions'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['listTransactions']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/transactions',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.transactions.listTransactions',
		input,
		'completed',
	);
	return response;
};

export const listTransactionsByCard: FidelEndpoints['listTransactionsByCard'] =
	async (ctx, input) => {
		const { cardId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listTransactionsByCard']
		>(
			ctx,
			fidelPathParameter(
				'/v1/cards/{cardId}/transactions',
				'cardId',
				input.cardId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.transactions.listTransactionsByCard',
			input,
			'completed',
		);
		return response;
	};
