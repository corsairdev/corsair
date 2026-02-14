import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveWebhooks } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { ChangeList, File } from '../types';
import type {
	FileChangedEvent,
	FolderChangedEvent,
	PubSubNotification,
} from './types';
import { createGoogleDriveWebhookMatcher, decodePubSubMessage } from './types';

async function fetchFile(
	credentials: string,
	fileId: string,
): Promise<File | null> {
	try {
		return await makeGoogleDriveRequest<File>(`/files/${fileId}`, credentials, {
			method: 'GET',
			query: {
				supportsAllDrives: true,
			},
		});
	} catch (error) {
		console.warn(`Failed to fetch file ${fileId}:`, error);
		return null;
	}
}

async function fetchChanges(
	credentials: string,
	startPageToken?: string,
): Promise<ChangeList> {
	return await makeGoogleDriveRequest<ChangeList>('/changes', credentials, {
		method: 'GET',
		query: {
			pageToken: startPageToken,
			pageSize: 100,
			includeRemoved: true,
			supportsAllDrives: true,
		},
	});
}

export const fileChanged: GoogleDriveWebhooks['fileChanged'] = {
	match: createGoogleDriveWebhookMatcher('fileChanged'),
	handler: async (ctx, request) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceId || !pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;

		try {
			const changesResponse = await fetchChanges(credentials);
			const changes = changesResponse.changes || [];

			let firstChangedFile: File | null = null;
			let changeType:
				| 'created'
				| 'updated'
				| 'deleted'
				| 'trashed'
				| 'untrashed' = 'updated';
			let corsairEntityId = '';

			for (const change of changes) {
				if (!change.fileId) continue;

				const file = await fetchFile(credentials, change.fileId);
				if (!file) continue;

				const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
				if (isFolder) continue;

				if (!firstChangedFile) {
					firstChangedFile = file;
				}

				if (change.removed) {
					changeType = 'deleted';
				} else if (file.trashed) {
					changeType = 'trashed';
				} else if (!change.removed && !file.trashed) {
					changeType = firstChangedFile ? 'updated' : 'created';
				}

				if (!ctx.db?.files) {
					console.warn(
						'⚠️ ctx.db.files is not available - database may not be configured',
					);
					continue;
				}

				if (!file.id) {
					console.warn('⚠️ File has no ID, skipping database update');
					continue;
				}

				try {
					if (change.removed) {
						await ctx.db.files.deleteByEntityId(file.id);
					} else {
						const entity = await ctx.db.files.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});

						if (!corsairEntityId && entity) {
							corsairEntityId = entity.id;
						}
					}
				} catch (dbError) {
					console.error(
						`❌ Failed to save file ${file.id} to database:`,
						dbError,
					);
				}
			}

			const event: FileChangedEvent = {
				type: 'fileChanged',
				fileId: firstChangedFile?.id || pushNotification.resourceId || '',
				changeType,
				file: firstChangedFile || undefined,
				change: changes[0] || undefined,
			};

			await logEventFromContext(
				ctx,
				'googledrive.webhook.fileChanged',
				{ ...event },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		} catch (error) {
			const event: FileChangedEvent = {
				type: 'fileChanged',
				fileId: pushNotification.resourceId || '',
				changeType: 'updated',
			};
			await logEventFromContext(
				ctx,
				'googledrive.webhook.fileChanged',
				{ ...event },
				'failed',
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: event,
			};
		}
	},
};

export const folderChanged: GoogleDriveWebhooks['folderChanged'] = {
	match: createGoogleDriveWebhookMatcher('folderChanged'),
	handler: async (ctx, request) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceId || !pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;

		try {
			const changesResponse = await fetchChanges(credentials);
			const changes = changesResponse.changes || [];

			let firstChangedFolder: File | null = null;
			let changeType:
				| 'created'
				| 'updated'
				| 'deleted'
				| 'trashed'
				| 'untrashed' = 'updated';
			let corsairEntityId = '';

			for (const change of changes) {
				if (!change.fileId) continue;

				const file = await fetchFile(credentials, change.fileId);
				if (!file) continue;

				const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
				if (!isFolder) continue;

				if (!firstChangedFolder) {
					firstChangedFolder = file;
				}

				if (change.removed) {
					changeType = 'deleted';
				} else if (file.trashed) {
					changeType = 'trashed';
				} else if (!change.removed && !file.trashed) {
					changeType = firstChangedFolder ? 'updated' : 'created';
				}

				if (!ctx.db?.folders) {
					console.warn(
						'⚠️ ctx.db.folders is not available - database may not be configured',
					);
					continue;
				}

				if (!file.id) {
					console.warn('⚠️ Folder has no ID, skipping database update');
					continue;
				}

				try {
					if (change.removed) {
						await ctx.db.folders.deleteByEntityId(file.id);
					} else {
						const entity = await ctx.db.folders.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});

						if (!corsairEntityId && entity) {
							corsairEntityId = entity.id;
						}
					}
				} catch (dbError) {
					console.error(
						`❌ Failed to save folder ${file.id} to database:`,
						dbError,
					);
				}
			}

			const event: FolderChangedEvent = {
				type: 'folderChanged',
				folderId: firstChangedFolder?.id || pushNotification.resourceId || '',
				changeType,
				folder: firstChangedFolder || undefined,
				change: changes[0] || undefined,
			};

			await logEventFromContext(
				ctx,
				'googledrive.webhook.folderChanged',
				{ ...event },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		} catch (error) {
			const event: FolderChangedEvent = {
				type: 'folderChanged',
				folderId: pushNotification.resourceId || '',
				changeType: 'updated',
			};
			await logEventFromContext(
				ctx,
				'googledrive.webhook.folderChanged',
				{ ...event },
				'failed',
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: event,
			};
		}
	},
};
