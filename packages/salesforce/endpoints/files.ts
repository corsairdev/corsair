import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { escapeSoql } from '../utils';

export const getFileContent: SalesforceEndpoints['getFileContent'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<string | ArrayBuffer | Buffer>(
		`sobjects/ContentVersion/${input.fileId}/VersionData`,
		ctx.key,
		{ method: 'GET', responseType: 'text' },
	);

	let contentStr: string;
	if (typeof response === 'string') {
		contentStr = response;
	} else if (Buffer.isBuffer(response)) {
		contentStr = response.toString('base64');
	} else if (response instanceof ArrayBuffer) {
		contentStr = Buffer.from(response).toString('base64');
	} else {
		contentStr = String(response);
	}

	await logEventFromContext(
		ctx,
		'salesforce.files.get_content',
		input,
		'completed',
	);
	return { content: contentStr };
};

export const getFileInformation: SalesforceEndpoints['getFileInformation'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/ContentDocument/${input.fileId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.files.get_information',
			input,
			'completed',
		);
		return response;
	};

export const getFileShares: SalesforceEndpoints['getFileShares'] = async (
	ctx,
	input,
) => {
	const safeFileId = escapeSoql(input.fileId);
	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, {
		method: 'GET',
		query: {
			q: `SELECT Id, ContentDocumentId, LinkedEntityId, ShareType FROM ContentDocumentLink WHERE ContentDocumentId = '${safeFileId}'`,
		},
	});

	await logEventFromContext(
		ctx,
		'salesforce.files.get_shares',
		input,
		'completed',
	);
	return { shares: response.records ?? [] };
};

export const deleteFile: SalesforceEndpoints['deleteFile'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(
		`sobjects/ContentDocument/${input.fileId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'salesforce.files.delete', input, 'completed');
	return { success: true };
};
