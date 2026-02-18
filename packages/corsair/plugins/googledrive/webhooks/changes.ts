import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveWebhooks } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { ChangeList, File } from '../types';
import { createGoogleDriveWebhookMatcher, decodePubSubMessage } from './types';

const PAGE_TOKEN_PATTERN = /[?&]pageToken=([^&]+)/;
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const RECENT_CHANGES_WINDOW_MS = 60000;
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
	return 'updated';
}

function filterRecentChanges<T extends { time?: string }>(
	changes: T[],
	maxAgeMs: number = RECENT_CHANGES_WINDOW_MS,
): T[] {
	if (changes.length === 0) return changes;

	const now = Date.now();
	return changes.filter((change) => {
		if (!change.time) return true;
		const changeTime = new Date(change.time).getTime();
		return (now - changeTime) <= maxAgeMs;
	});
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
			let changes = changesResponse.changes ?? [];

			changes = filterRecentChanges(changes);

			if (changes.length === 0) {
				return {
					success: true,
					corsairEntityId: '',
					data: {
						type: 'fileChanged' as const,
						fileId: pushNotification.resourceId ?? '',
						changeType: 'updated' as const,
						allFiles: [],
						allFolders: [],
					},
				};
			}

			const files: Array<{ file: File; filePath: string; change: typeof changes[0]; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }> = [];
			const folders: Array<{ folder: File; filePath: string; change: typeof changes[0]; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }> = [];

			for (const change of changes) {
				if (!change.fileId) continue;

				const file = await fetchFile(credentials, change.fileId);
				if (!file) continue;

				const isFolder = file.mimeType === FOLDER_MIME_TYPE;
				const filePath = change.removed
					? ''
					: await buildFilePath(credentials, file);

				const changeType = determineChangeType(change, file, files.length === 0 && folders.length === 0);

				if (isFolder) {
					folders.push({
						folder: file,
						filePath,
						change,
						changeType,
					});
				} else {
					files.push({
						file,
						filePath,
						change,
						changeType,
					});
				}
			}

			const firstFolder = folders[0];
			const firstFile = files[0];

			if (firstFolder && !firstFile) {
				const eventData = {
					type: 'folderChanged' as const,
					folderId: firstFolder.folder.id ?? pushNotification.resourceId ?? '',
					changeType: firstFolder.changeType,
					folder: firstFolder.folder,
					filePath: firstFolder.filePath,
					change: firstFolder.change,
					allFolders: folders,
					allFiles: files,
				};

				await logEventFromContext(
					ctx,
					'googledrive.webhook.folderChanged',
					{ ...eventData },
					'completed',
				);

				return { success: true, corsairEntityId: '', data: eventData };
			}

			const eventData = {
				type: 'fileChanged' as const,
				fileId: firstFile?.file.id ?? pushNotification.resourceId ?? '',
				changeType: firstFile?.changeType ?? 'updated',
				file: firstFile?.file,
				filePath: firstFile?.filePath ?? '',
				change: firstFile?.change ?? changes[0],
				allFiles: files,
				allFolders: folders,
			};

			await logEventFromContext(
				ctx,
				'googledrive.webhook.fileChanged',
				{ ...eventData },
				'completed',
			);

			return { success: true, corsairEntityId: '', data: eventData };
		} catch (error) {
			console.error('Failed to process Google Drive webhook:', error);
			return {
				success: false,
				error: `Failed to process change: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
