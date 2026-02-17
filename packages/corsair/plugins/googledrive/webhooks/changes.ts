import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveWebhooks } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { ChangeList, File } from '../types';
import { createGoogleDriveWebhookMatcher, decodePubSubMessage } from './types';

const PAGE_TOKEN_PATTERN = /[?&]pageToken=([^&]+)/;
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const FILE_FIELDS = [
	'id',
	'name',
	'mimeType',
	'parents',
	'trashed',
	'createdTime',
	'modifiedTime',
	'size',
	'webViewLink',
	'webContentLink',
	'starred',
	'shared',
	'ownedByMe',
	'description',
	'fileExtension',
	'originalFilename',
].join(',');

function parsePageTokenFromUri(resourceUri: string): string | undefined {
	return resourceUri.match(PAGE_TOKEN_PATTERN)?.[1];
}

async function fetchFile(
	credentials: string,
	fileId: string,
): Promise<File | null> {
	try {
		return await makeGoogleDriveRequest<File>(`/files/${fileId}`, credentials, {
			method: 'GET',
			query: {
				supportsAllDrives: true,
				fields: FILE_FIELDS,
			},
		});
	} catch (error) {
		console.warn(`Failed to fetch file ${fileId}:`, error);
		return null;
	}
}

async function fetchChanges(
	credentials: string,
	pageToken: string,
): Promise<ChangeList> {
	return await makeGoogleDriveRequest<ChangeList>('/changes', credentials, {
		method: 'GET',
		query: {
			pageToken,
			pageSize: 100,
			includeRemoved: true,
			supportsAllDrives: true,
		},
	});
}

async function buildFilePath(
	credentials: string,
	file: File,
): Promise<string> {
	const parts: string[] = [file.name ?? ''];
	let currentParents = file.parents;

	while (currentParents?.length) {
		const parentId = currentParents[0];
		if (!parentId) break;

		const parent = await fetchFile(credentials, parentId);
		if (!parent?.name) break;

		if (!parent.parents?.length) {
			break;
		}

		parts.unshift(parent.name);
		currentParents = parent.parents;
	}

	return '/' + parts.join('/');
}

function determineChangeType(
	change: ChangeList['changes'] extends (infer T)[] | undefined ? T : never,
	file: File,
	isFirstMatch: boolean,
): 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' {
	if (change.removed) return 'deleted';
	if (file.trashed) return 'trashed';
	if (!isFirstMatch) return 'updated';
	return 'created';
}

type DriveChangedContext = Parameters<
	GoogleDriveWebhooks['driveChanged']['handler']
>[0];

async function processFileChange(
	ctx: DriveChangedContext,
	credentials: string,
	file: File,
	removed: boolean,
	filePath: string,
): Promise<string> {
	if (!ctx.db?.files || !file.id) return '';

	try {
		if (removed) {
			await ctx.db.files.deleteByEntityId(file.id);
			return '';
		}

		const entity = await ctx.db.files.upsertByEntityId(file.id, {
			...file,
			id: file.id,
			filePath,
			createdAt: new Date(),
		});

		return entity?.id ?? '';
	} catch (dbError) {
		console.error(`Failed to save file ${file.id} to database:`, dbError);
		return '';
	}
}

async function processFolderChange(
	ctx: DriveChangedContext,
	credentials: string,
	folder: File,
	removed: boolean,
	filePath: string,
): Promise<string> {
	if (!ctx.db?.folders || !folder.id) return '';

	try {
		if (removed) {
			await ctx.db.folders.deleteByEntityId(folder.id);
			return '';
		}

		const entity = await ctx.db.folders.upsertByEntityId(folder.id, {
			...folder,
			id: folder.id,
			filePath,
			createdAt: new Date(),
		});

		return entity?.id ?? '';
	} catch (dbError) {
		console.error(
			`Failed to save folder ${folder.id} to database:`,
			dbError,
		);
		return '';
	}
}

export const driveChanged: GoogleDriveWebhooks['driveChanged'] = {
	match: createGoogleDriveWebhookMatcher('driveChanged'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return { success: false, error: 'No message data in notification' };
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceId || !pushNotification.resourceUri) {
			return { success: false, error: 'Invalid push notification format' };
		}

		const credentials = ctx.key;
		const pageToken = parsePageTokenFromUri(pushNotification.resourceUri!);

		if (!pageToken) {
			return {
				success: false,
				error: 'Could not parse pageToken from resource URI',
			};
		}

		try {
			const changesResponse = await fetchChanges(credentials, pageToken);
			const changes = changesResponse.changes ?? [];

			let firstFile: File | null = null;
			let firstFolder: File | null = null;
			let fileChangeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' = 'updated';
			let folderChangeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' = 'updated';
			let corsairEntityId = '';
			let firstFilePath = '';
			let firstFolderPath = '';

			for (const change of changes) {
				if (!change.fileId) continue;

				const file = await fetchFile(credentials, change.fileId);
				if (!file) continue;

				const isFolder = file.mimeType === FOLDER_MIME_TYPE;
				const filePath = change.removed
					? ''
					: await buildFilePath(credentials, file);

				if (isFolder) {
					const isFirstFolder = !firstFolder;
					if (isFirstFolder) {
						firstFolder = file;
						firstFolderPath = filePath;
						folderChangeType = determineChangeType(change, file, true);
					} else {
						folderChangeType = determineChangeType(change, file, false);
					}

					const entityId = await processFolderChange(
						ctx,
						credentials,
						file,
						!!change.removed,
						filePath,
					);
					if (!corsairEntityId && entityId) corsairEntityId = entityId;
				} else {
					const isFirstFile = !firstFile;
					if (isFirstFile) {
						firstFile = file;
						firstFilePath = filePath;
						fileChangeType = determineChangeType(change, file, true);
					} else {
						fileChangeType = determineChangeType(change, file, false);
					}

					const entityId = await processFileChange(
						ctx,
						credentials,
						file,
						!!change.removed,
						filePath,
					);
					if (!corsairEntityId && entityId) corsairEntityId = entityId;
				}
			}

			if (firstFolder && !firstFile) {
				const eventData = {
					type: 'folderChanged' as const,
					folderId: firstFolder.id ?? pushNotification.resourceId ?? '',
					changeType: folderChangeType,
					folder: firstFolder,
					filePath: firstFolderPath,
					change: changes[0],
				};

				await logEventFromContext(
					ctx,
					'googledrive.webhook.folderChanged',
					{ ...eventData },
					'completed',
				);

				return { success: true, corsairEntityId, data: eventData };
			}

			const eventData = {
				type: 'fileChanged' as const,
				fileId: firstFile?.id ?? pushNotification.resourceId ?? '',
				changeType: fileChangeType,
				file: firstFile ?? undefined,
				filePath: firstFilePath,
				change: changes[0],
			};

			await logEventFromContext(
				ctx,
				'googledrive.webhook.fileChanged',
				{ ...eventData },
				'completed',
			);

			return { success: true, corsairEntityId, data: eventData };
		} catch (error) {
			console.error('Failed to process Google Drive webhook:', error);
			return {
				success: false,
				error: `Failed to process change: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
