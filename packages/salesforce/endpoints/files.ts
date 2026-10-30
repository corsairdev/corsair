import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { escapeSoql } from '../utils';
import { salesforceCall } from './shared';

export const getFileContent: SalesforceEndpoints['getFileContent'] = async (
	ctx,
	input,
) => {
	const bytes = await salesforceCall<Buffer>(
		ctx,
		`sobjects/ContentVersion/${input.fileId}/VersionData`,
		{ method: 'GET', responseType: 'binary' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.files.get_content',
		input,
		'completed',
	);
	return { content: Buffer.from(bytes).toString('base64') };
};

export const getFileInformation: SalesforceEndpoints['getFileInformation'] =
	async (ctx, input) => {
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/ContentDocument/${input.fileId}`,
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
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', {
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
	await salesforceCall<void>(ctx, `sobjects/ContentDocument/${input.fileId}`, {
		method: 'DELETE',
	});

	await logEventFromContext(ctx, 'salesforce.files.delete', input, 'completed');
	return { success: true };
};

export const uploadFile: SalesforceEndpoints['uploadFile'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/ContentVersion', {
		method: 'POST',
		body: {
			Title: input.title,
			PathOnClient: input.pathOnClient ?? input.title,
			VersionData: input.versionData,
			FirstPublishLocationId: input.firstPublishLocationId,
		},
	});
	await logEventFromContext(
		ctx,
		'salesforce.files.upload',
		{ id: response.id, title: input.title },
		'completed',
	);
	return response;
};
