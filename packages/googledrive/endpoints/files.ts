import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { ApiError, toFileOutput } from 'corsair/http';
import {
	GOOGLE_DOCS_API_BASE,
	GoogleDriveAPIError,
	makeAuthenticatedGoogleDriveRequest,
} from '../client';
import type { GoogleDriveBoundEndpoints, GoogleDriveEndpoints } from '../index';
import type { File } from '../types';
import type { GoogleDriveEndpointOutputs } from './types';
import {
	GoogleDriveEndpointInputSchemas,
	GoogleDriveEndpointOutputSchemas,
} from './types';

// A fields mask returns part of a file. Upsert replaces the stored row, so a
// partial response is laid over what is already saved instead of erasing it.
export async function saveFile<T extends { id: string }>(
	table:
		| {
				findByEntityId(id: string): Promise<{ data: T } | null | undefined>;
				// The upsert's result isn't read here, so its type is left open.
				upsertByEntityId(id: string, data: T): Promise<unknown>;
		  }
		| undefined,
	data: T,
	partial: boolean,
): Promise<void> {
	if (!table) return;
	const prior = partial
		? (await table.findByEntityId(data.id))?.data
		: undefined;
	await table.upsertByEntityId(data.id, { ...prior, ...data });
}

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
					const row = { ...file, id: file.id, createdAt: new Date() };
					await saveFile(
						isFolder ? ctx.db.folders : ctx.db.files,
						row,
						Boolean(input.fields),
					);
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
			const row = { ...result, id: result.id, createdAt: new Date() };
			await saveFile(
				isFolder ? ctx.db.folders : ctx.db.files,
				row,
				Boolean(input.fields),
			);
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
			await ctx.db.fileContents?.deleteByEntityId(input.fileId);
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
};

// Drive gives a Vids file only through files.download's long-running operation
// (POST /files/{id}/download, then polling), not through export.
const VIDS_TYPE = 'application/vnd.google-apps.vid';

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
	// Checked before the format, so a named mimeType doesn't send a Form or a
	// Site on to Drive.
	if (sourceType === VIDS_TYPE) {
		throw new Error(
			'Drive does not export Google Vids files, and this plugin cannot download them yet.',
		);
	}
	const defaultType = DEFAULT_EXPORT_TYPES[sourceType];
	if (!defaultType) {
		throw new Error(
			`Drive cannot export a ${sourceType} file. Docs, Sheets, Slides, Drawings and Apps Script files can be exported.`,
		);
	}
	const exportType = input.mimeType ?? defaultType;

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

const GOOGLE_DOC_MIME_TYPE = 'application/vnd.google-apps.document';
const EXPORT_TEXT_FIELDS =
	'id,name,mimeType,createdTime,modifiedTime,webViewLink';
const EXPORT_TEXT_MAX_CHARS = 500_000;

type DocsParagraphElement = {
	textRun?: { content?: string };
	person?: { personProperties?: { name?: string; email?: string } };
	richLink?: { richLinkProperties?: { title?: string; uri?: string } };
	dateElement?: { dateElementProperties?: { displayText?: string } };
};

type DocsStructuralElement = {
	paragraph?: { elements?: DocsParagraphElement[] };
	tableOfContents?: { content?: DocsStructuralElement[] };
	table?: {
		tableRows?: {
			tableCells?: { content?: DocsStructuralElement[] }[];
		}[];
	};
};

export type DocsTab = {
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
			if (element.tableOfContents) {
				return elementsText(element.tableOfContents.content);
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
	rawInput,
) => {
	const input = GoogleDriveEndpointInputSchemas.filesExportText.parse(rawInput);
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
		// Google's message carries the "enable docs.googleapis.com" hint when the
		// Docs API is off; the ApiError itself is kept so callers still see its status.
		if (error instanceof ApiError && error.status === 403) {
			const message = error.body?.error?.message;
			if (typeof message === 'string' && message) error.message = message;
		}
		throw error;
	}

	let text = tabsText(doc.tabs).join('\n').slice(0, EXPORT_TEXT_MAX_CHARS);
	const last = text.charCodeAt(text.length - 1);
	if (last >= 0xd800 && last <= 0xdbff) text = text.slice(0, -1);

	const result = GoogleDriveEndpointOutputSchemas.filesExportText.parse({
		id: meta.id ?? input.fileId,
		name: meta.name,
		mimeType: meta.mimeType,
		createdTime: meta.createdTime,
		modifiedTime: meta.modifiedTime,
		webViewLink: meta.webViewLink,
		text,
	});

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
