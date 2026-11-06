import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	GOOGLE_DOCS_API_BASE,
	GoogleDriveAPIError,
	makeAuthenticatedGoogleDriveRequest,
} from '../client';
import type { GoogleDriveBoundEndpoints, GoogleDriveEndpoints } from '../index';
import type { File } from '../types';
import type { GoogleDriveEndpointOutputs } from './types';

export const list: GoogleDriveEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesList']
	>('/files', ctx, {
		method: 'GET',
		query: {
			...input,
			// A fields mask without nextPageToken silently ends pagination.
			fields:
				input.fields && !input.fields.includes('nextPageToken')
					? `nextPageToken,${input.fields}`
					: input.fields,
		},
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

export const download: GoogleDriveEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesDownload']
	>(`/files/${input.fileId}`, ctx, {
		method: 'GET',
		query: {
			alt: 'media',
			acknowledgeAbuse: input.acknowledgeAbuse,
		},
	});

	await logEventFromContext(
		ctx,
		'googledrive.files.download',
		{ ...input },
		'completed',
	);
	return result;
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

const GOOGLE_DOC_MIME_TYPE = 'application/vnd.google-apps.document';
const EXPORT_TEXT_FIELDS =
	'id,name,mimeType,createdTime,modifiedTime,webViewLink';
const EXPORT_TEXT_MAX_CHARS = 500_000;

type DocsParagraphElement = {
	textRun?: { content?: string };
	person?: { personProperties?: { name?: string; email?: string } };
	richLink?: { richLinkProperties?: { title?: string } };
	dateElement?: { dateElementProperties?: { displayText?: string } };
};

type DocsStructuralElement = {
	paragraph?: { elements?: DocsParagraphElement[] };
	table?: {
		tableRows?: {
			tableCells?: { content?: DocsStructuralElement[] }[];
		}[];
	};
};

type DocsTab = {
	tabProperties?: { title?: string };
	documentTab?: { body?: { content?: DocsStructuralElement[] } };
	childTabs?: DocsTab[];
};

function elementsText(elements: DocsStructuralElement[] = []): string {
	return elements
		.map((element) => {
			if (element.paragraph) {
				return (element.paragraph.elements ?? [])
					.map(
						(e) =>
							e.textRun?.content ??
							e.person?.personProperties?.name ??
							e.person?.personProperties?.email ??
							e.richLink?.richLinkProperties?.title ??
							e.dateElement?.dateElementProperties?.displayText ??
							'',
					)
					.join('');
			}
			return (element.table?.tableRows ?? [])
				.flatMap((row) => row.tableCells ?? [])
				.map((cell) => elementsText(cell.content))
				.join('');
		})
		.join('');
}

function tabsText(tabs: DocsTab[] = []): string[] {
	return tabs.flatMap((tab) => [
		`# ${tab.tabProperties?.title ?? ''}\n${elementsText(tab.documentTab?.body?.content)}`,
		...tabsText(tab.childTabs),
	]);
}

// Drive's files.export doesn't document tab handling, so read every tab
// (Gemini meeting notes keep the transcript in its own tab) via the Docs API.
export const exportText: GoogleDriveEndpoints['filesExportText'] = async (
	ctx,
	input,
) => {
	const meta = await makeAuthenticatedGoogleDriveRequest<File>(
		`/files/${input.fileId}`,
		ctx,
		{
			method: 'GET',
			query: { fields: EXPORT_TEXT_FIELDS, supportsAllDrives: true },
		},
	);

	if (meta.mimeType !== GOOGLE_DOC_MIME_TYPE) {
		throw new GoogleDriveAPIError('exportText supports Google Docs only', 400);
	}

	let doc: { tabs?: DocsTab[] };
	try {
		doc = await makeAuthenticatedGoogleDriveRequest<{ tabs?: DocsTab[] }>(
			`/documents/${input.fileId}`,
			ctx,
			{
				method: 'GET',
				base: GOOGLE_DOCS_API_BASE,
				query: { includeTabsContent: true },
			},
		);
	} catch (error) {
		// Carries Google's "enable docs.googleapis.com" hint when the Docs API is off.
		const message = (error as ApiError).body?.error?.message;
		if (error instanceof ApiError && error.status === 403 && message) {
			throw new GoogleDriveAPIError(message, 403);
		}
		throw error;
	}

	let text = tabsText(doc.tabs).join('\n').slice(0, EXPORT_TEXT_MAX_CHARS);
	const last = text.charCodeAt(text.length - 1);
	if (last >= 0xd800 && last <= 0xdbff) text = text.slice(0, -1);

	const result = {
		id: meta.id ?? input.fileId,
		name: meta.name,
		mimeType: meta.mimeType,
		createdTime: meta.createdTime,
		modifiedTime: meta.modifiedTime,
		webViewLink: meta.webViewLink,
		text,
	};

	if (ctx.db.fileContents) {
		try {
			await ctx.db.fileContents.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save file contents to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.exportText',
		{ ...input },
		'completed',
	);
	return result;
};
