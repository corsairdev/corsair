import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createShare: DatabricksEndpoints['createShare'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ name: string }>(
		'unity-catalog/shares',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.sharing.create_share',
		input,
		'completed',
	);
	return response;
};

export const createSharingProvider: DatabricksEndpoints['createSharingProvider'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/providers',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sharing.create_provider',
			input,
			'completed',
		);
		return response;
	};

export const createSharingRecipient: DatabricksEndpoints['createSharingRecipient'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'unity-catalog/recipients',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.sharing.create_recipient',
			input,
			'completed',
		);
		return response;
	};

export const deleteShare: DatabricksEndpoints['deleteShare'] = async (
	ctx,
	input,
) => {
	await makeDatabricksRequest<void>(
		`unity-catalog/shares/${safeEncode(input.name)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'databricks.sharing.delete_share',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteSharingRecipient: DatabricksEndpoints['deleteSharingRecipient'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`unity-catalog/recipients/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.sharing.delete_recipient',
			input,
			'completed',
		);
		return { success: true };
	};
