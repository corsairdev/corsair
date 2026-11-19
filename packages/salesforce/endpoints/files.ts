import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
import type { SalesforceEndpoints } from '..';
import { escapeSoql } from '../utils';
import { salesforceCall } from './shared';

export const getFileContent: SalesforceEndpoints['getFileContent'] = async (
	ctx,
	input,
) => {
	const [bytes, meta] = await Promise.all([
		salesforceCall<Buffer>(
			ctx,
			`sobjects/ContentVersion/${input.fileId}/VersionData`,
			{ method: 'GET', responseType: 'binary' },
		),
		versionMeta(ctx, input.fileId),
	]);

	await logEventFromContext(
		ctx,
		'salesforce.files.get_content',
		input,
		'completed',
	);
	const extension = meta?.FileExtension?.toLowerCase();
	const filename =
		meta?.PathOnClient ||
		(meta?.Title
			? `${meta.Title}${extension ? `.${extension}` : ''}`
			: undefined);
	// The file keeps its own key, content; the rest is core's file output, so a
	// host that keeps files gets a fileId for a large file instead.
	const { contentBase64, ...file } = toFileOutput(
		new Uint8Array(bytes),
		(extension && MEDIA_TYPES[extension]) || 'application/octet-stream',
		{ filename, maxBytes: CONTENT_MAX_BYTES, text: false },
	);
	return { ...file, ...(contentBase64 ? { content: contentBase64 } : {}) };
};

/**
 * Most bytes of a file returned inline to a caller without a host. A host that
 * keeps files (setFileSink) caps it at its own limit and gets a fileId instead.
 */
const CONTENT_MAX_BYTES = 100_000_000;

// VersionData comes back without a type, so it is taken from the extension.
const MEDIA_TYPES: Record<string, string> = {
	pdf: 'application/pdf',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	csv: 'text/csv',
	txt: 'text/plain',
	json: 'application/json',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

type VersionMeta = {
	Title?: string;
	FileExtension?: string;
	PathOnClient?: string;
};

/** The version's title and extension, for the file's name and type; undefined if they can't be read. */
async function versionMeta(
	ctx: Parameters<SalesforceEndpoints['getFileContent']>[0],
	fileId: string,
): Promise<VersionMeta | undefined> {
	try {
		return await salesforceCall<VersionMeta>(
			ctx,
			`sobjects/ContentVersion/${fileId}`,
			{ method: 'GET', query: { fields: 'Title,FileExtension,PathOnClient' } },
		);
	} catch {
		return undefined;
	}
}

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
