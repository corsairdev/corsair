import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeGoogleDriveRequest } from '../client';
import type { GoogleDriveWebhooks } from '../index';
import type { Change, ChangeList, File } from '../types';
import { createGoogleDriveWebhookMatcher, decodePubSubMessage } from './types';

const PAGE_TOKEN_PATTERN = /[?&]pageToken=([^&]+)/;
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const MAX_CHANGE_PAGES = 10;
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

type ChangeCursorKeys = {
	get_changes_page_token?: () => Promise<string | null>;
	set_changes_page_token?: (value: string | null) => Promise<void>;
};

type ChangeType = 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed';

type FileEvent = {
	file: File;
	filePath: string;
	change: Change;
	changeType: ChangeType;
	binaryData: string | null;
};

type FolderEvent = {
	folder: File;
	filePath: string;
	change: Change;
	changeType: ChangeType;
};

type FileFetch =
	| { status: 'ok'; file: File }
	| { status: 'missing' }
	| { status: 'failed' };

function parsePageTokenFromUri(resourceUri: string): string | undefined {
	return resourceUri.match(PAGE_TOKEN_PATTERN)?.[1];
}

function isRetryableFetchError(error: unknown): boolean {
	if (error instanceof ApiError) {
		return error.status >= 500 || error.status === 429;
	}
	return true;
}

function isInvalidPageTokenError(error: unknown): boolean {
	if (!(error instanceof ApiError) || error.status !== 400) return false;
	const haystack = `${error.message} ${JSON.stringify(error.body ?? {})}`;
	return /invalidStartPageToken|pageToken|Invalid Value/i.test(haystack);
}

async function fetchFile(
	credentials: string,
	fileId: string,
): Promise<FileFetch> {
	try {
		const file = await makeGoogleDriveRequest<File>(
			`/files/${fileId}`,
			credentials,
			{
				method: 'GET',
				query: {
					supportsAllDrives: true,
					fields: FILE_FIELDS,
				},
			},
		);
		return { status: 'ok', file };
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === 404 || error.status === 410)
		) {
			return { status: 'missing' };
		}
		console.warn(`Failed to fetch file ${fileId}:`, error);
		return isRetryableFetchError(error)
			? { status: 'failed' }
			: { status: 'missing' };
	}
}

async function fetchFileBinary(
	credentials: string,
	fileId: string,
): Promise<string | null> {
	try {
		const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${credentials}`,
			},
		});

		if (!response.ok) {
			return null;
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		return buffer.toString('base64');
	} catch (error) {
		console.warn(`Failed to fetch binary data for file ${fileId}:`, error);
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

/**
 * Drives the changes feed to exhaustion. Google returns at most `pageSize`
 * changes per call and hands back a `nextPageToken` while more are pending;
 * the final page carries `newStartPageToken` instead, which is the cursor to
 * watch from next cycle. Capped at MAX_CHANGE_PAGES so a large backlog cannot
 * stall the webhook response. When the cap hits, `resumeToken` is the next
 * unread page so the following notification can continue instead of restarting
 * from the original watch token.
 */
async function fetchAllChanges(
	credentials: string,
	startPageToken: string,
): Promise<{ changes: Change[]; resumeToken?: string; truncated: boolean }> {
	const changes: Change[] = [];
	// Tokens already requested. A feed that points back at any earlier page
	// (77 → 78 → 77, not just 77 → 77) would otherwise refetch the same pages
	// and duplicate their changes until the page cap stopped it.
	const requestedTokens = new Set<string>();
	let pageToken: string | undefined = startPageToken;
	let newStartPageToken: string | undefined;

	for (let page = 0; pageToken && page < MAX_CHANGE_PAGES; page++) {
		if (requestedTokens.has(pageToken)) break;
		requestedTokens.add(pageToken);

		const response: ChangeList = await fetchChanges(credentials, pageToken);
		changes.push(...(response.changes ?? []));
		newStartPageToken = response.newStartPageToken ?? newStartPageToken;

		pageToken = response.nextPageToken;
	}

	const truncated = Boolean(pageToken && !requestedTokens.has(pageToken));
	const resumeToken = truncated ? pageToken : newStartPageToken;

	return { changes, resumeToken, truncated };
}

async function readResumeToken(ctx: { keys?: object }): Promise<string | null> {
	try {
		const keys = ctx.keys as ChangeCursorKeys | undefined;
		return (await keys?.get_changes_page_token?.()) ?? null;
	} catch (error) {
		console.warn('Failed to read Drive changes cursor:', error);
		return null;
	}
}

async function writeResumeToken(
	ctx: { keys?: object },
	token: string | undefined,
	expectedStart?: string,
): Promise<'written' | 'cas-lost' | 'failed'> {
	if (!token) return 'written';
	const keys = ctx.keys as ChangeCursorKeys | undefined;
	if (!keys?.set_changes_page_token) return 'failed';
	try {
		const current = (await keys.get_changes_page_token?.()) ?? null;
		if (current && expectedStart && current !== expectedStart) {
			return 'cas-lost';
		}
		await keys.set_changes_page_token(token);
		return 'written';
	} catch (error) {
		console.warn('Failed to persist Drive changes cursor:', error);
		return 'failed';
	}
}

async function buildFilePath(
	credentials: string,
	file: File,
	maxDepth: number = 20,
): Promise<string> {
	const parts: string[] = [file.name ?? ''];
	let currentParents = file.parents;
	let depth = 0;
	while (currentParents?.length && depth < maxDepth) {
		const parentId = currentParents[0];
		if (!parentId) break;
		const parent = await fetchFile(credentials, parentId);
		if (parent.status !== 'ok' || !parent.file.name) break;
		if (!parent.file.parents?.length) {
			break;
		}
		parts.unshift(parent.file.name);
		currentParents = parent.file.parents;
		depth++;
	}
	return '/' + parts.join('/');
}

function determineChangeType(
	change: ChangeList['changes'] extends (infer T)[] | undefined ? T : never,
	file: File,
): 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' {
	if (change.removed) return 'deleted';
	if (file.trashed) return 'trashed';
	return 'updated';
}

async function applyRemovedChange(
	ctx: {
		db?: {
			files?: { deleteByEntityId: (id: string) => Promise<unknown> };
			folders?: { deleteByEntityId: (id: string) => Promise<unknown> };
		};
	},
	change: Change,
	files: FileEvent[],
	folders: FolderEvent[],
): Promise<boolean> {
	const fileId = change.fileId;
	if (!fileId) return true;

	const file: File = change.file ?? { id: fileId };
	const isFolder = file.mimeType === FOLDER_MIME_TYPE;

	try {
		if (isFolder) {
			await ctx.db?.folders?.deleteByEntityId(fileId);
		} else {
			await ctx.db?.files?.deleteByEntityId(fileId);
		}
		if (!file.mimeType) {
			await ctx.db?.folders?.deleteByEntityId(fileId);
		}
	} catch (error) {
		console.warn(`Failed to delete ${fileId} from database:`, error);
		return false;
	}

	if (isFolder) {
		folders.push({
			folder: file,
			filePath: '',
			change,
			changeType: 'deleted',
		});
		return true;
	}

	files.push({
		file,
		filePath: '',
		change,
		changeType: 'deleted',
		binaryData: null,
	});
	return true;
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
		const uriPageToken = parsePageTokenFromUri(pushNotification.resourceUri!);

		try {
			const storedPageToken = await readResumeToken(ctx);
			const startPageToken = storedPageToken ?? uriPageToken;

			if (!startPageToken) {
				return {
					success: false,
					error: 'Could not parse pageToken from resource URI',
				};
			}

			let fetched: {
				changes: Change[];
				resumeToken?: string;
				truncated: boolean;
			};
			try {
				fetched = await fetchAllChanges(credentials, startPageToken);
			} catch (error) {
				if (
					storedPageToken &&
					uriPageToken &&
					storedPageToken !== uriPageToken &&
					isInvalidPageTokenError(error)
				) {
					fetched = await fetchAllChanges(credentials, uriPageToken);
				} else {
					throw error;
				}
			}

			const { changes, resumeToken, truncated } = fetched;
			let applyFailed = false;
			let corsairEntityId = '';
			const files: FileEvent[] = [];
			const folders: FolderEvent[] = [];

			for (const change of changes) {
				if (!change.fileId) continue;

				if (change.removed) {
					const removed = await applyRemovedChange(ctx, change, files, folders);
					if (!removed) applyFailed = true;
					continue;
				}

				const fetchedFile = await fetchFile(credentials, change.fileId);
				if (fetchedFile.status === 'failed') {
					applyFailed = true;
					continue;
				}
				if (fetchedFile.status === 'missing') continue;

				const file = fetchedFile.file;
				const isFolder = file.mimeType === FOLDER_MIME_TYPE;
				const filePath = await buildFilePath(credentials, file);
				const changeType = determineChangeType(change, file);

				if (isFolder) {
					if (ctx.db?.folders && file.id) {
						try {
							const entity = await ctx.db.folders.upsertByEntityId(file.id, {
								...file,
								id: file.id,
								filePath,
							});
							if (!corsairEntityId && entity?.id) {
								corsairEntityId = entity.id;
							}
						} catch (error) {
							applyFailed = true;
							console.warn(
								`Failed to save folder ${file.id} to database:`,
								error,
							);
						}
					}

					folders.push({
						folder: file,
						filePath,
						change,
						changeType,
					});
				} else {
					const binaryData = await fetchFileBinary(credentials, change.fileId);

					if (ctx.db?.files && file.id) {
						try {
							const entity = await ctx.db.files.upsertByEntityId(file.id, {
								...file,
								id: file.id,
								filePath,
							});

							if (!corsairEntityId && entity?.id) {
								corsairEntityId = entity.id;
							}
						} catch (error) {
							applyFailed = true;
							console.warn(
								`Failed to save file ${file.id} to database:`,
								error,
							);
						}
					}

					files.push({
						file,
						filePath,
						change,
						changeType,
						binaryData,
					});
				}
			}

			if (applyFailed) {
				return {
					success: false,
					error: 'Failed to apply one or more Drive changes',
				};
			}

			const persisted = await writeResumeToken(
				ctx,
				resumeToken,
				startPageToken,
			);
			if (truncated && persisted === 'failed') {
				return {
					success: false,
					error:
						'Truncated changes feed but could not persist continuation cursor',
				};
			}

			if (files.length === 0 && folders.length === 0) {
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
					allFiles: files.map((f) => ({
						file: f.file,
						filePath: f.filePath,
						change: f.change,
						changeType: f.changeType,
						binaryData: f.binaryData,
					})),
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
				fileId: firstFile?.file.id ?? pushNotification.resourceId ?? '',
				changeType: firstFile?.changeType ?? 'updated',
				file: firstFile?.file,
				filePath: firstFile?.filePath ?? '',
				change: firstFile?.change ?? changes[0],
				binaryData: firstFile?.binaryData ?? null,
				allFiles: files.map((f) => ({
					file: f.file,
					filePath: f.filePath,
					change: f.change,
					changeType: f.changeType,
					binaryData: f.binaryData,
				})),
				allFolders: folders,
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
