import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import { makeAuthenticatedGoogleDriveRequest } from '../client';
import type { GoogleDriveBoundEndpoints, GoogleDriveEndpoints } from '../index';
import type { GoogleDriveEndpointOutputs } from './types';

export const list: GoogleDriveEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesList']
	>('/files', ctx, {
		method: 'GET',
		query: input,
	});

	if (result.files && ctx.db.files) {
		try {
			for (const file of result.files) {
				if (file.id) {
					const isFolder =
						file.mimeType === 'application/vnd.google-apps.folder';
					if (isFolder && ctx.db.folders) {
						await ctx.db.folders.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});
					} else if (!isFolder) {
						await ctx.db.files.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save files to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleDriveEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesGet']
	>(`/files/${input.fileId}`, ctx, {
		method: 'GET',
		query: input,
	});

	if (result.id) {
		const isFolder = result.mimeType === 'application/vnd.google-apps.folder';
		try {
			if (isFolder && ctx.db.folders) {
				await ctx.db.folders.upsertByEntityId(result.id, {
					...result,
					id: result.id,
					createdAt: new Date(),
				});
			} else if (!isFolder && ctx.db.files) {
				await ctx.db.files.upsertByEntityId(result.id, {
					...result,
					id: result.id,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const createFromText: GoogleDriveEndpoints['filesCreateFromText'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleDriveRequest<
			GoogleDriveEndpointOutputs['filesCreateFromText']
		>('/files', ctx, {
			method: 'POST',
			body: {
				...input,
			},
			query: {
				uploadType: 'multipart',
			},
		});

		if (result.id) {
			const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
			await endpoints.files.get({ fileId: result.id });
		}

		await logEventFromContext(
			ctx,
			'googledrive.files.createFromText',
			{ ...input },
			'completed',
		);
		return result;
	};

export const upload: GoogleDriveEndpoints['filesUpload'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesUpload']
	>('/files', ctx, {
		method: 'POST',
		body: {
			...input,
		},
		query: {
			uploadType: 'multipart',
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleDriveEndpoints['filesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesUpdate']
	>(`/files/${input.fileId}`, ctx, {
		method: 'PATCH',
		body: {
			name: input.name,
			description: input.description,
			starred: input.starred,
			trashed: input.trashed,
			parents: input.parents,
			properties: input.properties,
			appProperties: input.appProperties,
		},
		query: {
			addParents: input.addParents,
			removeParents: input.removeParents,
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFile: GoogleDriveEndpoints['filesDelete'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesDelete']
	>(`/files/${input.fileId}`, ctx, {
		method: 'DELETE',
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (ctx.db.files) {
		try {
			await ctx.db.files.deleteByEntityId(input.fileId);
		} catch (error) {
			console.warn('Failed to delete file from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.delete',
		{ ...input },
		'completed',
	);
};

export const copy: GoogleDriveEndpoints['filesCopy'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesCopy']
	>(`/files/${input.fileId}/copy`, ctx, {
		method: 'POST',
		body: {
			name: input.name,
			parents: input.parents,
		},
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.copy',
		{ ...input },
		'completed',
	);
	return result;
};

export const move: GoogleDriveEndpoints['filesMove'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesMove']
	>(`/files/${input.fileId}`, ctx, {
		method: 'PATCH',
		body: {},
		query: {
			addParents: input.addParents,
			removeParents: input.removeParents,
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.move',
		{ ...input },
		'completed',
	);
	return result;
};

const GOOGLE_TYPE_PREFIX = 'application/vnd.google-apps.';

// What files.export returns when the caller names no format: the one an agent
// can read most easily. Drive exports a spreadsheet's first sheet only as CSV.
const DEFAULT_EXPORT_TYPES: Record<string, string> = {
	'application/vnd.google-apps.document': 'text/markdown',
	'application/vnd.google-apps.spreadsheet': 'text/csv',
	'application/vnd.google-apps.presentation': 'application/pdf',
	'application/vnd.google-apps.drawing': 'image/png',
	'application/vnd.google-apps.script':
		'application/vnd.google-apps.script+json',
	'application/vnd.google-apps.vid': 'video/mp4',
};

// Drive's export formats and their extensions, from
// developers.google.com/workspace/drive/api/guides/ref-export-formats.
const EXPORT_EXTENSIONS: Record<string, string> = {
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'docx',
	'application/vnd.oasis.opendocument.text': 'odt',
	'application/rtf': 'rtf',
	'application/pdf': 'pdf',
	'text/plain': 'txt',
	'text/html': 'html',
	'application/zip': 'zip',
	'application/epub+zip': 'epub',
	'text/markdown': 'md',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.oasis.opendocument.spreadsheet': 'ods',
	'text/csv': 'csv',
	'text/tab-separated-values': 'tsv',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		'pptx',
	'application/vnd.oasis.opendocument.presentation': 'odp',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/svg+xml': 'svg',
	'application/vnd.google-apps.script+json': 'json',
	'video/mp4': 'mp4',
};

type DriveFileMeta = { name?: string; mimeType?: string };

async function fileMeta(
	ctx: Parameters<GoogleDriveEndpoints['filesDownload']>[0],
	fileId: string,
): Promise<DriveFileMeta> {
	return makeAuthenticatedGoogleDriveRequest<DriveFileMeta>(
		`/files/${fileId}`,
		ctx,
		{
			method: 'GET',
			query: { fields: 'name,mimeType', supportsAllDrives: true },
		},
	);
}

/** "Q3 plan" exported as text/markdown is "Q3 plan.md"; a name that already ends in it stays. */
function exportName(name: string, exportType: string): string {
	const extension = EXPORT_EXTENSIONS[exportType];
	if (!extension || name.toLowerCase().endsWith(`.${extension}`)) return name;
	return `${name}.${extension}`;
}

export const download: GoogleDriveEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	// The name rides along with the content, so a host that saves the file can
	// keep it. Drive answers a Docs, Sheets or Slides file with a 403 that
	// doesn't say what to do instead, so that case is refused here first.
	const meta = await fileMeta(ctx, input.fileId);
	if (meta.mimeType?.startsWith(GOOGLE_TYPE_PREFIX)) {
		throw new Error(
			`This file is a Google file (${meta.mimeType}), which Drive cannot download as it is. Use files.export with the same fileId to get it as Markdown, CSV, PDF or another format.`,
		);
	}

	// Read as bytes: decoding a PDF or image as text replaces every byte that
	// isn't valid UTF-8. toFileOutput returns a text file as text.
	const { bytes, contentType } =
		await makeAuthenticatedGoogleDriveRequest<BinaryResponse>(
			`/files/${input.fileId}`,
			ctx,
			{
				method: 'GET',
				query: {
					alt: 'media',
					acknowledgeAbuse: input.acknowledgeAbuse,
					supportsAllDrives: true,
				},
				responseType: 'binary',
			},
		);

	await logEventFromContext(
		ctx,
		'googledrive.files.download',
		{ ...input },
		'completed',
	);
	return toFileOutput(bytes, contentType ?? meta.mimeType, {
		...(meta.name ? { filename: meta.name } : {}),
	});
};

export const exportFile: GoogleDriveEndpoints['filesExport'] = async (
	ctx,
	input,
) => {
	const meta = await fileMeta(ctx, input.fileId);
	const sourceType = meta.mimeType ?? '';
	if (!sourceType.startsWith(GOOGLE_TYPE_PREFIX)) {
		throw new Error(
			`This file is not a Google Docs, Sheets, Slides or Drawings file (${sourceType || 'unknown type'}). Use files.download to get it as it is.`,
		);
	}
	const exportType = input.mimeType ?? DEFAULT_EXPORT_TYPES[sourceType];
	if (!exportType) {
		throw new Error(
			`Drive cannot export a ${sourceType} file. Docs, Sheets, Slides, Drawings, Apps Script and Vids files can be exported.`,
		);
	}

	const { bytes, contentType } =
		await makeAuthenticatedGoogleDriveRequest<BinaryResponse>(
			`/files/${input.fileId}/export`,
			ctx,
			{
				method: 'GET',
				query: { mimeType: exportType },
				responseType: 'binary',
			},
		);

	await logEventFromContext(
		ctx,
		'googledrive.files.export',
		{ ...input },
		'completed',
	);
	return toFileOutput(bytes, contentType ?? exportType, {
		...(meta.name ? { filename: exportName(meta.name, exportType) } : {}),
	});
};

export const share: GoogleDriveEndpoints['filesShare'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesShare']
	>(`/files/${input.fileId}/permissions`, ctx, {
		method: 'POST',
		body: {
			type: input.type,
			role: input.role,
			emailAddress: input.emailAddress,
			domain: input.domain,
			allowFileDiscovery: input.allowFileDiscovery,
			expirationTime: input.expirationTime,
			sendNotificationEmail: input.sendNotificationEmail,
			emailMessage: input.emailMessage,
		},
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
			moveToNewOwnersRoot: input.moveToNewOwnersRoot,
			transferOwnership: input.transferOwnership,
		},
	});

	await logEventFromContext(
		ctx,
		'googledrive.files.share',
		{ ...input },
		'completed',
	);
	return result;
};
